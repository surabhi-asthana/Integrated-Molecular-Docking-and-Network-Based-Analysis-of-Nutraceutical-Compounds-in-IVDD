const proteins = [
  { id: "TNFA", name: "TNF-α" },
  { id: "IKKB", name: "IKKβ" },
  { id: "MD2", name: "MD-2" },
  { id: "STAT3", name: "STAT3" },
  { id: "SIRT1", name: "SIRT1" },
  { id: "HIF1A", name: "HIF-1α" },
  { id: "SOX9", name: "SOX9" },
  { id: "NFKB", name: "NF-κB" },
  { id: "IL1B", name: "IL-1β" },
  { id: "IL6", name: "IL-6" },
  { id: "NLRP3", name: "NLRP3" },
  { id: "MMP13", name: "MMP-13" },
  { id: "MMP7", name: "MMP-7" },
  { id: "ADAMTS5", name: "ADAMTS-5" },
];

function ProteinSelector({ selected, onToggle }) {
  return (
    <div className="selector-section">
      <div className="selector-heading">
        <h3>Select Protein Targets</h3>
        <span>{selected.length} selected</span>
      </div>

      <div className="selection-grid">
        {proteins.map((protein) => (
          <button
            key={protein.id}
            type="button"
            className={`selection-button ${
              selected.includes(protein.id) ? "selected" : ""
            }`}
            onClick={() => onToggle(protein.id)}
            aria-pressed={selected.includes(protein.id)}
          >
            {protein.name}
            {selected.includes(protein.id) && <span> ✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProteinSelector;