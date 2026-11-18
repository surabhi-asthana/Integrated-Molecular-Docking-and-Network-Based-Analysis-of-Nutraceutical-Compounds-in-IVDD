import { useState } from "react";
import CompoundSelector from "../components/CompoundSelector";
import ProteinSelector from "../components/ProteinSelector";

function Docking() {
  const [selectedCompound, setSelectedCompound] = useState("");
  const [selectedProteins, setSelectedProteins] = useState([]);

  // Toggle multiple protein selections
  const toggleProtein = (item) => {
    setSelectedProteins((prev) =>
      prev.includes(item)
        ? prev.filter((value) => value !== item)
        : [...prev, item]
    );
  };

  // Handle docking request
  const handleDocking = () => {
    if (!selectedCompound || selectedProteins.length === 0) {
      alert("Please select one compound and at least one protein.");
      return;
    }

    console.log("Selected compound:", selectedCompound);
    console.log("Selected proteins:", selectedProteins);

    alert("Selections captured! Backend integration comes next.");
  };

  return (
    <div className="page-container">
      <div className="page-heading">
        <h1>Docking Workspace</h1>
        <p>
          Select one nutraceutical compound and one or more protein targets
          for docking analysis.
        </p>
      </div>

      <div className="docking-card">
        <CompoundSelector
          selected={selectedCompound}
          onToggle={(item) =>
            setSelectedCompound((prev) => (prev === item ? "" : item))
          }
        />

        <ProteinSelector
          selected={selectedProteins}
          onToggle={toggleProtein}
        />

        <button
          className="run-docking-button"
          onClick={handleDocking}
        >
          Run Docking Analysis →
        </button>
      </div>
    </div>
  );
}

export default Docking;