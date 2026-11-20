import numpy as np
import torch
import torch.nn as nn

from itertools import product
from rdkit import Chem, RDLogger
from rdkit.Chem import AllChem

RDLogger.DisableLog("rdApp.*")
import os
import json
import time
from google.genai.errors import ServerError
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=api_key)

# -----------------------------------------
# MLP MODEL
# -----------------------------------------

class TransferMLP(nn.Module):
    def __init__(self, in_features=2469):
        super().__init__()

        self.fc1 = nn.Linear(in_features, 1024)
        self.bn1 = nn.BatchNorm1d(1024)
        self.relu1 = nn.ReLU()

        self.fc2 = nn.Linear(1024, 256)
        self.bn2 = nn.BatchNorm1d(256)
        self.relu2 = nn.ReLU()

        self.out = nn.Linear(256, 1)

    def forward(self, x):
        x = self.relu1(self.bn1(self.fc1(x)))
        x = self.relu2(self.bn2(self.fc2(x)))
        x = self.out(x)

        return x.squeeze(-1)


# -----------------------------------------
# LOAD CHECKPOINT
# -----------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# -----------------------------------------
# PROTEIN SEQUENCE DATABASE
# -----------------------------------------

SEQUENCE_FILE = os.path.join(
    BASE_DIR,
    "data",
    "protein_sequences.json"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "model",
    "arm2_full_finetuned.pt"
)

device = torch.device("cpu")

activity_model = TransferMLP(in_features=2469)

state_dict = torch.load(
    MODEL_PATH,
    map_location=device,
    weights_only=True
)

activity_model.load_state_dict(state_dict)
activity_model.to(device)
activity_model.eval()

print("Fine-tuned activity model loaded successfully.")
# -----------------------------------------
# FEATURE EXTRACTION
# -----------------------------------------

AA = "ACDEFGHIKLMNPQRSTVWY"

DIPEP = {
    a + b: i
    for i, (a, b) in enumerate(product(AA, AA))
}


def get_protein_features(sequence):

    sequence = "".join(
        c for c in str(sequence).upper()
        if c in AA
    )

    if len(sequence) < 2:
        raise ValueError(
            "Protein sequence must contain at least 2 valid amino acids."
        )

    comp = np.zeros(20)
    dip = np.zeros(400)

    for c in sequence:
        comp[AA.index(c)] += 1

    comp /= len(sequence)

    for i in range(len(sequence) - 1):
        dip[DIPEP[sequence[i:i + 2]]] += 1

    dip /= len(sequence) - 1

    return np.concatenate([
        comp,
        dip,
        [np.log1p(len(sequence))]
    ])


def get_compound_fingerprint(smiles):

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:
        raise ValueError("Invalid compound SMILES.")

    fingerprint = AllChem.GetMorganFingerprintAsBitVect(
        mol,
        2,
        nBits=2048
    )

    return np.array(list(fingerprint), dtype=np.uint8)


def extract_features(smiles, sequence):

    compound_features = get_compound_fingerprint(smiles)

    protein_features = get_protein_features(sequence)

    features = np.hstack([
        compound_features,
        protein_features
    ]).astype(np.float32)

    if features.shape[0] != 2469:
        raise ValueError("Unexpected feature vector size.")

    return features
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "DiscNet AI backend is running!"
    })
# -----------------------------------------
# PROTEIN SEQUENCE API
# -----------------------------------------

@app.route("/api/protein-sequence/<gene>", methods=["GET"])
def get_protein_sequence(gene):

    gene = gene.upper()

    try:
        with open(SEQUENCE_FILE, "r", encoding="utf-8") as f:
            database = json.load(f)

    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify({
            "success": False,
            "error": "Protein sequence database is unavailable."
        }), 500

    protein = database.get(gene)

    if not protein:
        return jsonify({
            "success": False,
            "error": f"No sequence found for {gene}."
        }), 404

    return jsonify({
        "success": True,
        "gene": protein["gene"],
        "protein_name": protein["protein_name"],
        "accession": protein["accession"],
        "sequence": protein["sequence"],
        "length": protein["length"]
    })

@app.route("/api/ask-ivdd", methods=["POST"])
def ask_ivdd():

    try:
        data = request.get_json(silent=True) or {}

        question = data.get("question", "").strip()
        context = data.get("context", {})
        print("QUESTION RECEIVED:", question)

        if not question:
            return jsonify({
                "success": False,
                "error": "Please provide a question."
            }), 400

        if not isinstance(context, dict):
            return jsonify({
                "success": False,
                "error": "Context must be a JSON object."
            }), 400

        context_text = json.dumps(context, indent=2)

        prompt = f"""
You are DiscNet AI, an intelligent scientific research assistant
specializing in human intervertebral disc degeneration (IVDD).

YOUR COMMUNICATION STYLE:

1. Answer the user's question directly. Do not repeatedly introduce
   yourself or describe your capabilities.
2. For greetings such as "hi" or "hello", respond briefly and naturally.
3. For scientific questions, provide detailed, structured explanations.
4. Avoid unnecessary introductions and repetitive conclusions.
5. Write in clear sentences and short paragraphs. You may use bold for key
   terms and short bullet points, but NEVER use tables. The chat window is
   narrow and tables break.
6. Explain complex scientific terminology in simple language when needed.
7. Maintain a professional but conversational tone.
8. Never begin a scientific answer with greetings such as
   "Hello!", "Hi!" or "Hey!". Only greet the user when
   their message is purely a greeting.
9. Only respond with a greeting when the user's entire
   message consists of a greeting, such as "hi" or "hello".

10. Never interpret a scientific question, incomplete
    sentence, keyword-based query, or short phrase as a greeting.
    Always understand the user's intended question and answer it directly.

YOUR AREA OF SPECIALIZATION:

- Human intervertebral disc degeneration
- IVDD disease mechanisms
- Protein functions and biological targets
- Inflammatory signalling pathways
- Extracellular matrix degradation
- Nutraceutical compounds
- Molecular docking and binding affinity
- Protein-ligand interactions
- ADMET properties


PROJECT DOCKING DATA (inside AVAILABLE PROJECT CONTEXT):

"current_docking_selection" is the protein-compound pair the user currently has
open on the Docking page. When the user says "this", "it", "this docking",
"my result" or asks "is this efficient / good / strong?" WITHOUT naming a pair,
they mean that pair. Answer about it directly, quoting its exact score, its
ranks, how it compares with the other compounds on the same protein, and its
pose interactions. If it says no pair is open, ask which protein and compound
they mean instead of giving a generic answer.

"binding_affinity_shown_on_screen" is the exact Binding Affinity value displayed
to the user on the Docking page. When the user refers to "the binding affinity",
"the score on screen" or "this value", they mean this number. Quote it exactly
as given and do not recompute or round it differently.

"docking_results" holds all of this project's docking data:

- docking_protocol: software and settings (fields marked "not provided" are
  unknown; never invent them).
- docking_scores_kcal_per_mol, best_compound_per_protein,
  best_protein_per_compound, top_5_strongest_overall, pairs_not_docked and
  average_score_per_compound_on_those_targets.
- pose_interaction_analysis: per pair, residues in contact with the ligand,
  possible hydrogen bonds with distances, hydrophobic contact residues and
  metal-ion contacts. These come from a geometric analysis of the docked poses.
- compounds: formula, molecular weight and ADMET / drug-likeness values.
- compounds_admet: ADMET / drug-likeness values for every compound.
- protein_target_catalogue (if present): gene, PDB ID, category, role in IVDD.

How to answer:

1. Lead with the project's own numbers, not textbook definitions. Do NOT start
   with a generic explanation of what docking efficiency means.
2. A more negative score means stronger predicted binding. A short line of
   general context is fine (for AutoDock Vina, roughly -7 kcal/mol or lower is
   usually read as moderate-to-good binding), but judge a result mainly by how
   it compares with the other pairs in this project. Differences under about
   0.5 kcal/mol are weak evidence of a real difference.
3. Describe residue contacts and hydrogen bonds as estimates from the docked
   poses (distance-based), not experimentally confirmed interactions.
4. If a pair is in "pairs_not_docked", or a value is absent or "not provided",
   say it is not available. Never estimate a score, residue or setting.
5. Never use tables, LaTeX or the dollar sign "$" anywhere in your answer.
   Write Greek letters as words or symbols: TNF-alpha or TNF-α, IL-1 beta or
   IL-1β, IKK-beta or IKKβ. Write units as plain text: "-7.9 kcal/mol",
   "TPSA 131.36 Å2", "302.24 g/mol", "logP 0.95".
6. Keep answers focused and reasonably short unless the user asks for depth.

FINAL ANALYSIS (use whenever the user asks whether a docking result, compound
or target is efficient, good, strong, promising, safe, suitable, beneficial or
good for the body, or worth pursuing). If the user names a compound that is not
the open pair, use that compound's entry in compounds_admet and its scores in
docking_results instead:

Use current_docking_selection (compound_admet, multi_target_profile) and answer
in these three parts:

1. Binding: this pair's score and rank, and how it compares with the other
   compounds on the same protein.
2. Multi-target: how many docked targets the compound binds at or below
   -7.0 kcal/mol, which ones, and whether it looks broad or selective.
3. ADMET / suitability for the human body: explain in plain sentences, with
   the actual numbers, whether the compound is likely to work well in the
   body. Cover absorption (GI absorption, TPSA, solubility), drug-likeness
   (Lipinski violations, Veber, bioavailability score), transport and
   metabolism (P-gp substrate, which CYP enzymes it inhibits and what that
   means for drug interactions), and safety flags (PAINS and Brenk alerts,
   which can mean assay interference or reactive groups). Say clearly what is
   a strength and what is a concern, for example "GI absorption is high and
   there are 0 Lipinski violations, so oral absorption looks favourable, but
   it inhibits CYP3A4, which could cause drug interactions." BBB permeability
   is not needed for a disc-targeting compound, so mention it only as a
   side-effect consideration. These are predictions, not measurements.Never list only the favourable values: always also report the concerns that
are present in the data (CYP inhibition, PAINS or Brenk alerts, low solubility).

Always finish with one last line that starts with "Conclusion:" and gives the
verdict in a single sentence, weighing binding, multi-target breadth and ADMET,
and naming the main strength and the main concern. Nothing may come after this
line. Format example only (use the real values for the compound asked about):
"Conclusion: Quercetin looks like a promising multi-target candidate because of
strong predicted binding and high GI absorption, but its CYP inhibition and
PAINS alert mean it needs experimental validation before any conclusion about
its benefit in the body."
Never claim the compound treats or cures IVDD. If any part's data is missing,
say so instead of guessing.

SCIENTIFIC GUIDELINES:

1. Prioritize human IVDD research unless the user asks about another species.
2. Distinguish established experimental findings from computational predictions.
3. Never invent docking scores, amino acid residues, interactions,
   ADMET values or experimental results.
4. Use supplied project context whenever relevant.
5. If information is missing, explicitly state that it is unavailable.
6. Treat docking scores as computational estimates, not experimental
   measurements of binding affinity.
7. Do not claim that nutraceuticals cure or clinically treat IVDD
   based solely on computational findings.
8. Do not present hypotheses as established scientific facts.
9. Do not mention network analysis or hub genes unless the user asks.
10. Do not repeat the user's question or provide generic
    introductory statements before answering.

FINAL FORMAT CHECK: do not output any table, any LaTeX, and no dollar signs.
Explain ADMET in words and numbers only.

USER QUESTION:
{question}

AVAILABLE PROJECT CONTEXT:
{context_text}

Answer the user's question according to these instructions.
"""

        response = None

        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model="gemini-3.5-flash-lite",
                    contents=prompt
                )
                print("GEMINI RESPONSE:", response.text)
                break

            except ServerError as e:
                if "503" in str(e) and attempt < 2:
                    wait_time = 2 ** (attempt + 1)
                    print(f"Gemini overloaded. Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    raise

        return jsonify({
            "success": True,
            "question": question,
            "answer": response.text
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
# -----------------------------------------
# PREDICT ACTIVITY API
# -----------------------------------------

@app.route("/api/predict-activity", methods=["POST"])
def predict_activity():

    try:
        data = request.get_json(silent=True) or {}

        smiles = data.get("smiles", "").strip()
        sequence = data.get("sequence", "").strip()

        if not smiles or not sequence:
            return jsonify({
                "success": False,
                "error": "Both SMILES and protein sequence are required."
            }), 400

        features = extract_features(smiles, sequence)

        input_tensor = torch.tensor(
            features,
            dtype=torch.float32
        ).unsqueeze(0).to(device)

        with torch.no_grad():
            prediction = activity_model(input_tensor)

        predicted_activity = float(prediction.item())

        return jsonify({
            "success": True,
            "predicted_pActivity": round(predicted_activity, 4),
            "model_used": "arm2_full_finetuned",
            "prediction_type": "pActivity (pChEMBL scale)"
        })

    except ValueError as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

    except Exception as e:

        print("PREDICTION ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": "Prediction failed. Please check the backend logs."
        }), 500

if __name__ == "__main__":
    app.run(debug=False, port=5000)