import {
  FlaskConical,
  Dna,
  Workflow,
  Activity,
  Plus
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";

const stats = [
  {
    title: "Compounds",
    value: "05",
    description: "Nutraceutical compounds",
    icon: FlaskConical
  },
  {
    title: "Protein Targets",
    value: "10",
    description: "IVDD-associated targets",
    icon: Dna
  },
  {
    title: "Docking Experiments",
    value: "—",
    description: "Awaiting result integration",
    icon: Workflow
  },
  {
    title: "Interactions Analysed",
    value: "—",
    description: "Awaiting interaction analysis",
    icon: Activity
  }
];

const pipeline = [
  ["01", "Compound Selection", "Choose nutraceutical compounds"],
  ["02", "Protein Selection", "Select IVDD-associated targets"],
  ["03", "Molecular Docking", "Run AutoDock Vina"],
  ["04", "Interaction Analysis", "Analyse molecular interactions"],
  ["05", "AI Interpretation", "Generate biological explanations"]
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      <section className="welcome-section">
        <div>
          <p className="eyebrow">RESEARCH OVERVIEW</p>
          <h1>Welcome to your research workspace</h1>
          <p>
            Explore nutraceutical interactions with IVDD-associated
            protein targets through molecular docking and network analysis.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/docking")}
        >
          <Plus size={18} />
          New Docking Study
        </button>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="dashboard-grid">

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Research Pipeline</h3>
              <p>Overview of the analysis workflow</p>
            </div>
          </div>

          <div className="pipeline">
            {pipeline.map(([number, title, description]) => (
              <div className="pipeline-step" key={number}>
                <span className="step-number">{number}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <h3>Quick Access</h3>
              <p>Explore your research modules</p>
            </div>
          </div>

          <div className="quick-links">
            <button onClick={() => navigate("/compounds")}>
              <FlaskConical size={21} />
              Explore Compounds
            </button>

            <button onClick={() => navigate("/targets")}>
              <Dna size={21} />
              Explore Protein Targets
            </button>

            <button onClick={() => navigate("/docking")}>
              <Workflow size={21} />
              Open Docking Workspace
            </button>
          </div>
        </div>

      </section>

      <div className="footer-note">
        Integrated Molecular Docking and Network-Based Analysis
        <span>Research platform · IVDD</span>
      </div>

    </div>
  );
}