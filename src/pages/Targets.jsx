import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Dna, CheckCircle2, Clock3 } from "lucide-react";
import "./Targets.css";
import { RESEARCH_TARGETS } from "../data/proteins";


const categories = [
  "All",
  "Inflammation",
  "Matrix Degradation",
  "Extracellular Matrix",
  "Apoptosis",
  "Oxidative Stress",
  "Hypoxia",
  "Cellular Senescence",
  "Signalling",
];

export default function Targets() {
   const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
const [selectedProtein, setSelectedProtein] = useState(null);
const handleUseForPrediction = (protein) => {
  navigate("/model-prediction", {
    state: {
      proteinGene: protein.gene,
      proteinName: protein.name,
    },
  });
};

  const filteredProteins = useMemo(() => {
    return RESEARCH_TARGETS .filter((protein) => {
      const matchesSearch =
        protein.name.toLowerCase().includes(search.toLowerCase()) ||
        protein.gene.toLowerCase().includes(search.toLowerCase()) ||
        protein.pdb.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || protein.category === category;

      const matchesStatus =
        status === "All" ||
        (status === "Docked" && protein.docked) ||
        (status === "Catalogue only" && !protein.docked);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, category, status]);
  const totalProteins = RESEARCH_TARGETS .length;

const dockedCount = RESEARCH_TARGETS .filter(
  (protein) => protein.docked
).length;

const catalogueCount = RESEARCH_TARGETS .filter(
  (protein) => !protein.docked
).length;

  return (
    <main className="targets-page">
      <section className="targets-heading">
        <div>
          <span className="section-eyebrow">RESEARCH DATABASE</span>
          <h1>Protein Targets</h1>
          <p>
            Explore the molecular targets associated with intervertebral
            disc degeneration.
          </p>
        </div>

        <div className="targets-heading-icon">
          <Dna size={30} />
        </div>
      </section>

     <section className="target-stats">
  <div className="target-stat-card">
    <span>Total Research Targets</span>
    <h2>{totalProteins}</h2>
    <p>Curated protein panel</p>
  </div>

  <div className="target-stat-card">
    <span>Docked Proteins</span>
    <h2>{dockedCount}</h2>
    <p>Included in docking analysis</p>
  </div>

  <div className="target-stat-card">
    <span>Catalogue Only</span>
    <h2>{catalogueCount}</h2>
    <p>Not included in current docking</p>
  </div>
</section>

      <section className="targets-toolbar">
        <div className="targets-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search protein, gene or PDB ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All Categories" : item}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Docked">Docked</option>
          <option value="Catalogue only">Catalogue Only</option>
        </select>
      </section>

      <section className="targets-results-heading">
        <h2>Target Catalogue</h2>
        <span>{filteredProteins.length} proteins found</span>
      </section>

      <section className="targets-grid">
        {filteredProteins.map((protein) => (
          <article className="target-card" key={protein.gene}>
            <div className="target-card-top">
              <div className="target-icon">
                <Dna size={21} />
              </div>

              <span
                className={
                  protein.docked
                    ? "target-status docked"
                    : "target-status catalogue"
                }
              >
                {protein.docked ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <Clock3 size={13} />
                )}
                {protein.docked ? "Docked" : "Catalogue Only"}
              </span>
            </div>

            <div className="target-identity">
              <h3>{protein.name}</h3>
              <span className="target-gene">{protein.gene}</span>
            </div>

            <p className="target-role">{protein.role}</p>

            <div className="target-card-footer">
              <span className="target-category">{protein.category}</span>
              <span className="target-pdb">{protein.pdb}</span>
            </div>
            <button
  className="view-details-btn"
  onClick={(e) => {
    e.stopPropagation();
    setSelectedProtein(protein);
  }}
>
  View Protein Details →
</button>
<button
  className="use-for-prediction-btn"
  onClick={() => handleUseForPrediction(protein)}
>
  Use for Prediction →
</button>
          </article>
        ))}
      </section>

      {filteredProteins.length === 0 && (
        <div className="targets-empty">
          <Dna size={30} />
          <h3>No proteins found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      )}
      {selectedProtein && (
  <div
    className="protein-modal-overlay"
    onClick={() => setSelectedProtein(null)}
  >
    <div
      className="protein-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="protein-modal-close"
        onClick={() => setSelectedProtein(null)}
      >
        ×
      </button>

      <span className="section-eyebrow">
        PROTEIN RESEARCH DETAILS
      </span>

      <h2>{selectedProtein.name}</h2>

      <span className="target-gene">
        {selectedProtein.gene}
      </span>

      <div className="protein-modal-info">
        <div>
          <span>Research Category</span>
          <strong>{selectedProtein.category}</strong>
        </div>

        <div>
          <span>PDB / Structure ID</span>
          <strong>{selectedProtein.pdb}</strong>
        </div>

        <div>
          <span>Docking Status</span>
          <strong>
            {selectedProtein.docked
              ? "Included in docking"
              : "Catalogue only"}
          </strong>
        </div>
      </div>

      <div className="protein-modal-description">
        <h3>Biological Function</h3>
        <p>{selectedProtein.role}</p>
      </div>
    </div>
  </div>
)}
    </main>
  );
}