
import { Link, useNavigate } from "react-router-dom";
import compounds from "../data/compounds";

import melatoninImg from "../assets/structures/melatonin.png";
import baicaleinImg from "../assets/structures/baicalein.png";
import quercetinImg from "../assets/structures/quercetin.png";
import curcuminImg from "../assets/structures/curcumin.png";
import resveratrolImg from "../assets/structures/resveratrol.png";

const structureImages = {
  melatonin: melatoninImg,
  baicalein: baicaleinImg,
  quercetin: quercetinImg,
  curcumin: curcuminImg,
  resveratrol: resveratrolImg,
};

export default function Compounds() {
  const navigate = useNavigate();

  const handleAddToPrediction = (compound) => {
    navigate("/model-prediction", {
      state: {
        compoundName: compound.name,
        smiles: compound.smiles,
      },
    });
  };

  return (
    <div className="compounds-page">
      <div className="compounds-heading">
        <p className="eyebrow">RESEARCH LIBRARY</p>
        <h1>Compounds</h1>
        <p>
          Explore the chemical and molecular properties of
          nutraceutical compounds selected for IVDD research.
        </p>
      </div>

      <div className="compound-grid">
        {compounds.map((compound) => (
          <article className="compound-card" key={compound.id}>
            <Link
              to={`/compounds/${compound.id}`}
              className="compound-profile-link"
            >
              <div className="compound-structure">
                <img
                  src={structureImages[compound.id]}
                  alt={`${compound.name} molecular structure`}
                />
              </div>

              <div className="compound-card-info">
                <h3>{compound.name}</h3>
                <p>{compound.formula}</p>

                <div className="compound-card-footer">
                  <span>{compound.molecularWeight} g/mol</span>
                  <span className="view-link">View Profile →</span>
                </div>
              </div>
            </Link>

            <button
              className="add-to-prediction-btn"
              onClick={() => handleAddToPrediction(compound)}
            >
              Add to Model Prediction
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
