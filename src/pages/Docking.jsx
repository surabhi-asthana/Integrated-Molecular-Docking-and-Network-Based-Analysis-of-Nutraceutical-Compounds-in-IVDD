import { useState, useEffect } from "react";
import CompoundSelector from "../components/CompoundSelector";
import ProteinSelector from "../components/ProteinSelector";
import DockingViewer from "../components/DockingViewer";
import { PROTEINS, COMPOUNDS, nameOf } from "../data/proteins";
import { setActiveDocking } from "../services/activeDocking";
function Docking() {
  const [selectedCompound, setSelectedCompound] = useState("");
  const [selectedProtein, setSelectedProtein] = useState("");
  const [results, setResults] = useState(null); 
  const [affinities, setAffinities] = useState(null);
  // Toggle multiple protein selections
  useEffect(() => {
    fetch("/structures/poses_summary.json")
      .then((r) => r.json())
      .then(setAffinities)
      .catch(() => setAffinities({}));
  }, []);

  // Compounds that have docking data for the chosen protein
  // (e.g. melatonin has no MMP-13 / MMP-7 / ADAMTS-5 results, so it is hidden there).
  // Falls back to all compounds while the summary loads or if it is unavailable.
  const proteinData = selectedProtein ? affinities?.[selectedProtein] : null;
  const availableCompounds = proteinData
    ? COMPOUNDS.filter((c) => proteinData[c.id])
    : COMPOUNDS;

  const handleProteinToggle = (item) => {
    const next = selectedProtein === item ? "" : item;
    setSelectedProtein(next);
    // clear the compound if it has no data for the newly chosen protein
    const data = next ? affinities?.[next] : null;
    if (data && selectedCompound && !data[selectedCompound]) {
      setSelectedCompound("");
    }
  };

  // Handle docking request
  const handleDocking = () => {
    if (!selectedCompound || !selectedProtein) {
      alert("Please select one compound and at least one protein.");
      return;
    }

    // console.log("Selected compound:", selectedCompound);
    // console.log("Selected proteins:", selectedProteins);

    // alert("Selections captured! Backend integration comes next.");
    setResults({ compound: selectedCompound, protein: selectedProtein });
    setActiveDocking({
      compound: selectedCompound,
      protein: selectedProtein,
      displayed_affinity: affinities?.[selectedProtein]?.[selectedCompound]?.score?.toFixed(1),
    });
  };
const compoundName = results ? nameOf(COMPOUNDS, results.compound) : "";
const proteinName = results ? nameOf(PROTEINS, results.protein) : "";
const entry = results
  ? affinities?.[results.protein]?.[results.compound]
  : null;
  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Docking Workspace</h1>
        <p>
          Select one protein target, then one nutraceutical compound
          for docking analysis.
        </p>
      </div>

      <div className="docking-card">
        <ProteinSelector
          selected={selectedProtein}
          onToggle={handleProteinToggle}
        />

        <CompoundSelector
          selected={selectedCompound}
          available={availableCompounds}
          disabled={!selectedProtein}
          onToggle={(item) =>
            setSelectedCompound((prev) => (prev === item ? "" : item))
          }
        />

        <button
          className="run-docking-button"
          onClick={handleDocking}
        >
          Run Docking Analysis →
        </button>
      </div>

      {results && (
        <div className="docking-card" style={{ marginTop: "24px" }}>
          <h2>Docking Results:</h2>
          <h3>
            {compoundName} &amp; {proteinName}
          </h3>

          {affinities === null ? (
            <p>Loading…</p>
          ) : !entry ? (
            <p>Docking results not available yet for this pair.</p>
          ) : (
            <>
              <p>
                <strong>Binding Affinity:</strong> {entry.score.toFixed(1)} kcal/mol
              </p>
              <DockingViewer protein={results.protein} compound={results.compound} />
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default Docking;