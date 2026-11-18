import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Network, BrainCircuit } from "lucide-react";
import "./Login.css";

function Login() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleEnter = (e) => {
    e.preventDefault();

    if (!name.trim() || !role) {
      alert("Please enter your name and select your role.");
      return;
    }

    sessionStorage.setItem("userName", name.trim());
    sessionStorage.setItem("userRole", role);

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
        <img
    src="/discnet-background.png"
    alt=""
    className="login-background-art"
    aria-hidden="true"
  />

      {/* LEFT SECTION */}
      <section className="login-intro">

        <div className="brand">
          <div className="brand-icon">
            <Activity size={23} />
          </div>
          <span>DiscNet <small>AI</small></span>
        </div>

        <div className="intro-content">
          <p className="eyebrow">MOLECULAR RESEARCH PLATFORM</p>

          <h1>
            Connecting molecules.
            <br />
            <span>Discovering insights.</span>
          </h1>

          <p className="intro-description">
            An intelligent platform for exploring nutraceutical–protein
            interactions in intervertebral disc degeneration through
            molecular docking, interaction analysis and biological networks.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <Activity size={19} />
              </div>
              <div>
                <h4>Molecular Docking</h4>
                <p>Explore potential compound–protein binding.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <BrainCircuit size={19} />
              </div>
              <div>
                <h4>AI Interpretation</h4>
                <p>Understand molecular interaction profiles.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Network size={19} />
              </div>
              <div>
                <h4>Network Analysis</h4>
                <p>Explore interconnected biological targets.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="intro-footer">
          COMPUTATIONAL BIOLOGY · MOLECULAR INTELLIGENCE
        </p>
      </section>

      {/* RIGHT SECTION */}
      <section className="login-form-section">

        <div className="login-card">

          <div className="welcome-icon">
            <Activity size={25} />
          </div>

          <p className="eyebrow">WELCOME TO DISCNET AI</p>

          <h2>Let's get started.</h2>

          <p className="form-description">
            Introduce yourself to enter the research workspace.
          </p>

          <form onSubmit={handleEnter}>

            <label>Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Your Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select your role</option>
              <option value="Student">Student</option>
              <option value="Researcher">Researcher</option>
              <option value="Faculty / Guide">Faculty / Guide</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit" className="enter-button">
              Enter Workspace <span>→</span>
            </button>

          </form>

          <p className="privacy-note">
            No account required. Your details are used only
            to personalize your workspace.
          </p>

        </div>

      </section>
    </div>
  );
}

export default Login;