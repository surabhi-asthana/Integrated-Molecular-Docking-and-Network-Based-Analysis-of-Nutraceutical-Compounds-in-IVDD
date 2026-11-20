import { useMemo, useState } from "react";
import { Search, Dna, CheckCircle2, Clock3 } from "lucide-react";
import "./Targets.css";

const proteins = [
  // INFLAMMATION
  {
    name: "Tumor Necrosis Factor Alpha",
    gene: "TNF",
    pdb: "2AZ5",
    category: "Inflammation",
    role: "Promotes inflammatory responses and contributes to intervertebral disc cell damage.",
    docked: true,
  },
  {
    name: "Interleukin 6",
    gene: "IL6",
    pdb: "1ALU",
    category: "Inflammation",
    role: "A pro-inflammatory cytokine associated with inflammation and disc degeneration.",
    docked: true,
  },
  {
    name: "Interleukin 1 Beta",
    gene: "IL1B",
    pdb: "8C3U",
    category: "Inflammation",
    role: "Promotes inflammatory signalling and matrix-degrading enzyme production.",
    docked: true,
  },
  {
    name: "NLR Family Pyrin Domain Containing 3",
    gene: "NLRP3",
    pdb: "9HG4",
    category: "Inflammation",
    role: "Forms the NLRP3 inflammasome, which contributes to inflammatory responses.",
    docked: true,
  },
  {
    name: "Myeloid Differentiation Factor 2",
    gene: "LY96",
    pdb: "4G8A",
    category: "Inflammation",
    role: "Participates in innate immune signalling through the TLR4 receptor complex.",
    docked: true,
  },
  {
    name: "Nuclear Factor Kappa B Subunit 1",
    gene: "NFKB1",
    pdb: "Not added",
    category: "Inflammation",
    role: "Regulates inflammatory gene expression and plays a central role in NF-κB signalling.",
    docked: false,
  },

  // SIGNALLING
  {
    name: "Inhibitor of Nuclear Factor Kappa B Kinase Subunit Beta",
    gene: "IKBKB",
    pdb: "4KIK",
    category: "Signalling",
    role: "A key kinase involved in NF-κB inflammatory signalling.",
    docked: true,
  },
  {
    name: "Signal Transducer and Activator of Transcription 3",
    gene: "STAT3",
    pdb: "6NJS",
    category: "Signalling",
    role: "Regulates cellular responses to cytokines and inflammatory signals.",
    docked: true,
  },
  {
    name: "Hypoxia Inducible Factor 1 Alpha",
    gene: "HIF1A",
    pdb: "4ZPR",
    category: "Hypoxia",
    role: "Regulates cellular adaptation to the low-oxygen environment of the intervertebral disc.",
    docked: false,
  },
  {
    name: "Sirtuin 1",
    gene: "SIRT1",
    pdb: "4I5I",
    category: "Signalling",
    role: "Associated with cellular stress responses, inflammation and tissue homeostasis.",
    docked: false,
  },
  {
    name: "Mitogen Activated Protein Kinase 1",
    gene: "MAPK1",
    pdb: "Not added",
    category: "Signalling",
    role: "Participates in MAPK/ERK signalling and regulates cellular responses.",
    docked: false,
  },
  {
    name: "AKT Serine/Threonine Kinase 1",
    gene: "AKT1",
    pdb: "Not added",
    category: "Signalling",
    role: "Regulates cell survival, metabolism and growth signalling.",
    docked: false,
  },

  // MATRIX DEGRADATION
  {
    name: "Matrix Metalloproteinase 7",
    gene: "MMP7",
    pdb: "7WXX",
    category: "Matrix Degradation",
    role: "An extracellular matrix-degrading enzyme involved in tissue remodelling.",
    docked: true,
  },
  {
    name: "Matrix Metalloproteinase 13",
    gene: "MMP13",
    pdb: "2OW9",
    category: "Matrix Degradation",
    role: "Degrades collagen and contributes to extracellular matrix breakdown.",
    docked: true,
  },
  {
    name: "ADAM Metallopeptidase with Thrombospondin Type 1 Motif 5",
    gene: "ADAMTS5",
    pdb: "6YJM",
    category: "Matrix Degradation",
    role: "An aggrecan-degrading enzyme associated with loss of disc matrix integrity.",
    docked: true,
  },
  {
    name: "Matrix Metalloproteinase 19",
    gene: "MMP19",
    pdb: "AlphaFold Q99542",
    category: "Matrix Degradation",
    role: "A matrix metalloproteinase associated with extracellular matrix remodelling.",
    docked: false,
  },
  {
    name: "Matrix Metalloproteinase 1",
    gene: "MMP1",
    pdb: "Not added",
    category: "Matrix Degradation",
    role: "Degrades extracellular matrix components, including collagen.",
    docked: false,
  },
  {
    name: "Matrix Metalloproteinase 3",
    gene: "MMP3",
    pdb: "Not added",
    category: "Matrix Degradation",
    role: "Contributes to extracellular matrix breakdown and tissue remodelling.",
    docked: false,
  },

  // EXTRACELLULAR MATRIX
  {
    name: "SRY-Box Transcription Factor 9",
    gene: "SOX9",
    pdb: "4EUW",
    category: "Extracellular Matrix",
    role: "Regulates the expression of cartilage-related extracellular matrix components.",
    docked: false,
  },
  {
    name: "Collagen Type II Alpha 1 Chain",
    gene: "COL2A1",
    pdb: "6JEC",
    category: "Extracellular Matrix",
    role: "Encodes type II collagen, an important structural component of cartilage-like tissue.",
    docked: false,
  },
  {
    name: "Aggrecan",
    gene: "ACAN",
    pdb: "9DFF",
    category: "Extracellular Matrix",
    role: "A major extracellular matrix proteoglycan that helps maintain disc hydration and structure.",
    docked: false,
  },
  {
    name: "Collagen Type I Alpha 1 Chain",
    gene: "COL1A1",
    pdb: "Not added",
    category: "Extracellular Matrix",
    role: "Encodes type I collagen, a structural component of connective tissue.",
    docked: false,
  },

  // APOPTOSIS
  {
    name: "Caspase 3",
    gene: "CASP3",
    pdb: "Not added",
    category: "Apoptosis",
    role: "An executioner caspase involved in programmed cell death.",
    docked: false,
  },
  {
    name: "BCL2 Associated X Protein",
    gene: "BAX",
    pdb: "Not added",
    category: "Apoptosis",
    role: "Promotes apoptosis through mitochondrial signalling.",
    docked: false,
  },
  {
    name: "BCL2 Apoptosis Regulator",
    gene: "BCL2",
    pdb: "Not added",
    category: "Apoptosis",
    role: "Regulates cell survival by inhibiting apoptotic processes.",
    docked: false,
  },

  // OXIDATIVE STRESS
  {
    name: "Superoxide Dismutase 1",
    gene: "SOD1",
    pdb: "Not added",
    category: "Oxidative Stress",
    role: "Helps protect cells against oxidative damage by neutralizing superoxide radicals.",
    docked: false,
  },
  {
    name: "Superoxide Dismutase 2",
    gene: "SOD2",
    pdb: "Not added",
    category: "Oxidative Stress",
    role: "A mitochondrial antioxidant enzyme involved in reactive oxygen species regulation.",
    docked: false,
  },
  {
    name: "Nuclear Factor Erythroid 2 Related Factor 2",
    gene: "NFE2L2",
    pdb: "Not added",
    category: "Oxidative Stress",
    role: "A transcription factor that regulates cellular antioxidant responses.",
    docked: false,
  },

  // HYPOXIA
  {
    name: "Vascular Endothelial Growth Factor A",
    gene: "VEGFA",
    pdb: "Not added",
    category: "Hypoxia",
    role: "Regulates angiogenesis and is associated with hypoxia-related responses.",
    docked: false,
  },

  // CELLULAR SENESCENCE
  {
    name: "Tumor Protein P53",
    gene: "TP53",
    pdb: "Not added",
    category: "Cellular Senescence",
    role: "Regulates cell-cycle arrest, DNA damage responses and cellular senescence.",
    docked: false,
  },
  {
    name: "Cyclin Dependent Kinase Inhibitor 1A",
    gene: "CDKN1A",
    pdb: "Not added",
    category: "Cellular Senescence",
    role: "Encodes p21, a regulator of cell-cycle arrest and senescence.",
    docked: false,
  },
  {
    name: "Cyclin Dependent Kinase Inhibitor 2A",
    gene: "CDKN2A",
    pdb: "Not added",
    category: "Cellular Senescence",
    role: "Encodes cell-cycle regulatory proteins associated with senescence.",
    docked: false,
  },
];

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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
const [selectedProtein, setSelectedProtein] = useState(null);

  const filteredProteins = useMemo(() => {
    return proteins.filter((protein) => {
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
  const totalProteins = proteins.length;

const dockedCount = proteins.filter(
  (protein) => protein.docked
).length;

const catalogueCount = proteins.filter(
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