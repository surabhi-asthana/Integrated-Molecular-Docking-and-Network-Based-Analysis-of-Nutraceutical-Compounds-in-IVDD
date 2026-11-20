
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FlaskConical, Dna, Sparkles } from "lucide-react";
import "./ModelPrediction.css";

export default function ModelPrediction() {
  const location = useLocation();

  const [smiles, setSmiles] = useState("");
  const [sequence, setSequence] = useState("");
  const [compoundName, setCompoundName] = useState("");
  const [proteinName, setProteinName] = useState("");
const [proteinLoading, setProteinLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Receive selected compound from the Compounds page
 useEffect(() => {
  const savedCompound = JSON.parse(
    sessionStorage.getItem("selectedCompound") || "null"
  );

  const savedProtein = JSON.parse(
    sessionStorage.getItem("selectedProtein") || "null"
  );

  // Prefer newly selected compound; otherwise restore saved one
  const compound = location.state?.smiles
    ? {
        smiles: location.state.smiles,
        compoundName: location.state.compoundName || "",
      }
    : savedCompound;

  if (compound) {
    setSmiles(compound.smiles || "");
    setCompoundName(compound.compoundName || "");

    sessionStorage.setItem(
      "selectedCompound",
      JSON.stringify(compound)
    );
  }

  // Prefer newly selected protein; otherwise restore saved one
  const protein = location.state?.proteinGene
    ? {
        proteinGene: location.state.proteinGene,
        proteinName: location.state.proteinName || "",
      }
    : savedProtein;

  if (!protein?.proteinGene) return;

  sessionStorage.setItem(
    "selectedProtein",
    JSON.stringify(protein)
  );

  let cancelled = false;

  const fetchSequence = async () => {
    setProteinLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/protein-sequence/${encodeURIComponent(protein.proteinGene)}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Could not fetch sequence.");
      }

      if (!cancelled) {
        setSequence(result.sequence);
        setProteinName(result.protein_name);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message);
      }
    } finally {
      if (!cancelled) {
        setProteinLoading(false);
      }
    }
  };

  fetchSequence();

  return () => {
    cancelled = true;
  };

}, [location.key]);

  const handlePredict = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);

    if (!smiles.trim()) {
      setError("Please enter a compound SMILES string.");
      return;
    }

    if (!sequence.trim()) {
      setError("Please enter a protein sequence.");
      return;
    }

    const cleanedSequence = sequence.replace(/\s/g, "").toUpperCase();

    if (!/^[ACDEFGHIKLMNPQRSTVWY]+$/.test(cleanedSequence)) {
      setError("Protein sequence contains invalid amino acid characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/predict-activity",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            smiles: smiles.trim(),
            sequence: cleanedSequence,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Prediction failed.");
      }

      setPrediction(result);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the prediction server. Make sure the Flask backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="model-prediction-page">
      <div className="prediction-heading">
        <div>
          <h1>Model Prediction</h1>
          <p>
            Predict compound–protein activity using deep learning.
          </p>
        </div>
        <div className="prediction-icon">
          <Sparkles size={25} />
        </div>
      </div>

      <form className="prediction-form" onSubmit={handlePredict}>
        <div className="prediction-card">
          <div className="input-heading">
            <FlaskConical size={21} />
            <div>
              <h3>Compound SMILES</h3>
              <p>Enter the SMILES representation of your compound.</p>
            </div>
          </div>

          <textarea
            value={smiles}
            onChange={(e) => {
              setSmiles(e.target.value);
              setCompoundName("");
            }}
            placeholder="Example: CC(=O)OC1=CC=CC=C1C(=O)O"
            rows={4}
          />

          {compoundName && (
            <p className="selected-compound">
              Selected compound: <strong>{compoundName}</strong>
            </p>
          )}
        </div>

        <div className="prediction-card">
          <div className="input-heading">
            <Dna size={21} />
            <div>
              <h3>Protein Sequence</h3>
              <p>Paste the amino acid sequence in single-letter format.</p>
            </div>
          </div>

          <textarea
  value={sequence}
  onChange={(e) => {
    setSequence(e.target.value);
    setProteinName("");
  }}
  placeholder="Example: MKWVTFISLLLLFSSAYS..."
  rows={7}
/>

{proteinLoading && (
  <p className="selected-compound">
    Fetching protein sequence...
  </p>
)}

{proteinName && !proteinLoading && (
  <p className="selected-compound">
    Selected protein: <strong>{proteinName}</strong>
  </p>
)}
        </div>

        {error && (
          <div className="prediction-message">{error}</div>
        )}

        <button
          type="submit"
          className="predict-button"
          disabled={loading}
        >
          {loading ? "Processing..." : "Predict Activity"}
        </button>
{prediction && (
  <div className="prediction-card prediction-result">
    <div className="input-heading">
      <Sparkles size={21} />
      <div>
        <h3>Prediction Result</h3>
        <p>Predicted compound–protein activity</p>
      </div>
    </div>

    <div className="result-details">
      <div>
        <span>COMPOUND</span>
        <h4>{compoundName || "Selected compound"}</h4>
      </div>

      <div>
        <span>TARGET PROTEIN</span>
        <h4>{proteinName || "Selected protein"}</h4>
      </div>
    </div>

    <div className="result-score">
      <span>Predicted pActivity</span>
      <h2>{prediction.predicted_pActivity}</h2>
      <p>
        A higher predicted pActivity score generally indicates
        greater compound potency on the pChEMBL scale.
      </p>
    </div>
  </div>
)}

      </form>
    </div>
  );
}
