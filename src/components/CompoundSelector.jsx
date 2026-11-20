import { COMPOUNDS as compounds } from "../data/proteins";

function CompoundSelector({ selected, onToggle, available = compounds, disabled = false }) {
  return (
    <div className="selector-section">
      <div className="selector-heading">
        <h3>Select Nutraceutical Compound</h3>
        <span>{selected ? "1 selected" : "None selected"}</span>
      </div>

      {disabled && (
        <p style={{ margin: "0 0 8px", opacity: 0.7, fontSize: "0.9rem" }}>
          Select a protein target first.
        </p>
      )}

      <div className="selection-grid">
        {available.map((compound) => (
          <button
            key={compound.id}
            type="button"
            className={`selection-button ${
              selected === compound.id ? "selected" : ""
            }`}
            disabled={disabled}
            onClick={() => onToggle(compound.id)}
            aria-pressed={selected === compound.id}
          >
            {compound.name}
            {selected === compound.id && " ✓"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CompoundSelector;