const compounds = [
  { id: "curcumin", name: "Curcumin" },
  { id: "quercetin", name: "Quercetin" },
  { id: "baicalein", name: "Baicalein" },
  { id: "melatonin", name: "Melatonin" },
  { id: "resveratrol", name: "Resveratrol" },
];

function CompoundSelector({ selected, onToggle }) {
  return (
    <div className="selector-section">
      <div className="selector-heading">
        <h3>Select Nutraceutical Compound</h3>
        <span>{selected ? "1 selected" : "None selected"}</span>
      </div>

      <div className="selection-grid">
        {compounds.map((compound) => (
          <button
            key={compound.id}
            type="button"
            className={`selection-button ${
              selected === compound.id ? "selected" : ""
            }`}
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