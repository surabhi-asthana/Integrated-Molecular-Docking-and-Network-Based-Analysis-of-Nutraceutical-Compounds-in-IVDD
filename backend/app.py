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


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "DiscNet AI backend is running!"
    })


@app.route("/api/ask-ivdd", methods=["POST"])
def ask_ivdd():

    try:
        data = request.get_json(silent=True) or {}

        question = data.get("question", "").strip()
        context = data.get("context", {})
        print("QUESTION RECEIVED:", question)
        print("CONTEXT RECEIVED:", context)

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
5. Use Markdown formatting for headings, bullet points and important terms.
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
- Protein-protein interaction networks
- Molecular network analysis

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
9. When discussing pathways, explain how the relevant proteins
   interact and contribute to IVDD progression.
10. Do not repeat the user's question or provide generic
    introductory statements before answering.


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

if __name__ == "__main__":
    app.run(debug=False, port=5000)