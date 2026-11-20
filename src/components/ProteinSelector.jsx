import { PROTEINS as proteins } from "../data/proteins";

function ProteinSelector({ selected, onToggle }) {
  return (
    <div className="selector-section">
      <div className="selector-heading">
        <h3>Select Protein Targets</h3>
         <span>{selected ? "1 selected" : "None selected"}</span>
      </div>

      <div className="selection-grid">
        {proteins.map((protein) => (
          <button
            key={protein.id}
            type="button"
            className={`selection-button ${
              selected === protein.id ? "selected" : ""
            }`}
            onClick={() => onToggle(protein.id)}
            aria-pressed={selected === protein.id}
          >
            {protein.name}
            {selected === protein.id && " ✓"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProteinSelector;