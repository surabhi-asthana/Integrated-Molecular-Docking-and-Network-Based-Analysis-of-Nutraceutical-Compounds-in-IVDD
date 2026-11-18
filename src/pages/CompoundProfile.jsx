
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import compounds from "../data/compounds";
import BioavailabilityRadar from "../components/admet/BioavailabilityRadar";
import BoiledEgg from "../components/admet/BoiledEgg";
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
const sections = [
  "Compound Overview",
  "Physicochemical Properties",
  "Ligand Characteristics",
  "ADMET Analysis",
  "Drug-likeness",
  "Medicinal Chemistry",
];
const ligandData = {
  curcumin: {
    functionalGroups: [
      {
        name: "Phenolic hydroxyl groups",
        description: "Can act as hydrogen-bond donors and may participate in polar interactions."
      },
      {
        name: "Methoxy groups",
        description: "Ether-containing groups that contribute to the compound's electronic properties."
      },
      {
        name: "β-diketone group",
        description: "A conjugated diketone system that can exist in keto-enol forms."
      }
    ],
    aromaticDescription:
      "Contains two aromatic rings connected by a conjugated carbon chain."
  },

  quercetin: {
    functionalGroups: [
      {
        name: "Hydroxyl groups",
        description: "Five hydroxyl groups provide potential hydrogen-bond donor and acceptor sites."
      },
      {
        name: "Ketone group",
        description: "The carbonyl group can act as a hydrogen-bond acceptor."
      },
      {
        name: "Heterocyclic ether",
        description: "An oxygen-containing ring contributes to the flavonol structure."
      }
    ],
    aromaticDescription:
      "Contains a three-ring flavonol framework with conjugated aromatic regions."
  },

  baicalein: {
    functionalGroups: [
      {
        name: "Hydroxyl groups",
        description: "Three hydroxyl groups can participate in hydrogen bonding."
      },
      {
        name: "Ketone group",
        description: "The carbonyl oxygen provides a potential hydrogen-bond acceptor site."
      },
      {
        name: "Heterocyclic ether",
        description: "An oxygen-containing ring forms part of its flavone structure."
      }
    ],
    aromaticDescription:
      "Contains a flavone scaffold with two aromatic regions and an oxygen-containing central ring."
  },

  melatonin: {
    functionalGroups: [
      {
        name: "Indole ring",
        description: "A nitrogen-containing fused aromatic ring system."
      },
      {
        name: "Acetamide group",
        description: "Contains a carbonyl oxygen and an amide N–H that can participate in hydrogen bonding."
      },
      {
        name: "Methoxy group",
        description: "An ether group containing an oxygen atom that can act as a hydrogen-bond acceptor."
      }
    ],
    aromaticDescription:
      "Contains a fused bicyclic indole aromatic system."
  },

  resveratrol: {
    functionalGroups: [
      {
        name: "Phenolic hydroxyl groups",
        description: "Three hydroxyl groups can participate in hydrogen bonding."
      },
      {
        name: "Stilbene group",
        description: "Contains two aromatic rings connected by a carbon-carbon double bond."
      },
      {
        name: "Trans-alkene",
        description: "The trans double-bond geometry contributes to its relatively extended molecular shape."
      }
    ],
    aromaticDescription:
      "Contains two aromatic rings connected by a trans-ethenyl bridge."
  }
};
export default function CompoundProfile() {
  const { compoundId } = useParams();

  const [activeSection, setActiveSection] = useState(
    "Compound Overview"
  );

  const compound = compounds.find(
    (item) => item.id === compoundId
  );

  if (!compound) {
    return (
      <div className="panel">
        <h2>Compound not found</h2>
        <Link to="/compounds">Back to compounds</Link>
      </div>
    );
  }

  return (
    <div className="compound-profile">
      <Link to="/compounds" className="back-link">
        ← Back to Compounds
      </Link>

      <div className="profile-heading">
        <div>
          <p className="eyebrow">COMPOUND PROFILE</p>
          <h1>{compound.name}</h1>
          <p>{compound.formula}</p>
        </div>

        <div className="molecular-weight-card">
          <span>Molecular Weight</span>
          <h2>{compound.molecularWeight} g/mol</h2>
        </div>
      </div>

      <div className="compound-tabs">
        {sections.map((section) => (
          <button
            key={section}
            className={activeSection === section ? "active" : ""}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>

      <section className="profile-section">
        {activeSection === "Compound Overview" && (
  <div className="compound-overview">

    <h2>Compound Overview</h2>

    <p className="section-description">
      Basic chemical identity and structural information
      about {compound.name}.
    </p>

    <div className="overview-layout">

      {/* Molecular Structure */}
      <div className="overview-structure-card">
        <h3>2D Molecular Structure</h3>

        <img
          src={structureImages[compound.id]}
          alt={`${compound.name} molecular structure`}
        />

        <p>{compound.name}</p>
      </div>

      {/* Chemical Information */}
      <div className="overview-details-card">

        <h3>Chemical Information</h3>

        <div className="overview-info-row">
          <span>Compound Name</span>
          <strong>{compound.name}</strong>
        </div>

        <div className="overview-info-row">
          <span>Molecular Formula</span>
          <strong>{compound.formula}</strong>
        </div>

        <div className="overview-info-row">
          <span>Molecular Weight</span>
          <strong>{compound.molecularWeight} g/mol</strong>
        </div>

        <div className="overview-info-row">
          <span>PubChem CID</span>
          <strong>{compound.pubchemCID}</strong>
        </div>

        <div className="overview-info-row">
          <span>InChIKey</span>
          <strong>{compound.inchiKey}</strong>
        </div>

      </div>

    </div>

    {/* IUPAC Name */}
    <div className="overview-identifier-card">
      <h3>IUPAC Name</h3>
      <p>{compound.iupacName}</p>
    </div>

    {/* SMILES */}
    <div className="overview-identifier-card">
      <h3>Canonical SMILES</h3>
      <p className="smiles-text">{compound.smiles}</p>
    </div>

  </div>
)}
        {activeSection === "Physicochemical Properties" && (
  <div>
    <h2>Physicochemical Properties</h2>
    <p className="section-description">
      Chemical properties that influence the compound's behavior,
      solubility, permeability and molecular interactions.
    </p>

    <div className="property-grid">
      {[
        ["Molecular Weight", compound.molecularWeight, "g/mol"],
        ["Heavy Atoms", compound.physicochemical.heavyAtoms, ""],
        ["Aromatic Atoms", compound.physicochemical.aromaticHeavyAtoms, ""],
        ["Hydrogen Bond Donors", compound.physicochemical.hbd, ""],
        ["Hydrogen Bond Acceptors", compound.physicochemical.hba, ""],
        ["Rotatable Bonds", compound.physicochemical.rotatableBonds, ""],
        ["Topological Polar Surface Area", compound.physicochemical.tpsa, "Å²"],
        ["Consensus LogP", compound.lipophilicity.consensus, ""],
        ["Molar Refractivity", compound.physicochemical.molarRefractivity, ""],
        ["Fraction Csp3", compound.physicochemical.fractionCsp3, ""],
      ].map(([label, value, unit]) => (
        <div className="property-card" key={label}>
          <span>{label}</span>
          <h3>{value} {unit}</h3>
        </div>
      ))}
    </div>
  </div>
)}

      {activeSection === "Ligand Characteristics" && (
  <div>
    <h2>Ligand Characteristics</h2>

    <p className="section-description">
      Structural features that may influence how this compound
      interacts with biological targets.
    </p>

    <div className="ligand-grid">

      {/* Functional Groups */}
      <div className="ligand-card">
        <span>Functional Groups</span>

        {ligandData[compound.id].functionalGroups.map((group, index) => (
          <div key={index}>
            <h3>{group.name}</h3>
            <p>{group.description}</p>
          </div>
        ))}
      </div>

      {/* Molecular Flexibility */}
      <div className="ligand-card">
        <span>Molecular Flexibility</span>

        <h3>
          {compound.physicochemical.rotatableBonds} rotatable bonds
        </h3>

        <p>
          Rotatable bonds provide an indication of molecular
          flexibility. A higher number may allow more conformational
          variation, although molecular rigidity also depends on
          the overall chemical structure.
        </p>
      </div>

      {/* Polarity */}
      <div className="ligand-card">
        <span>Polarity</span>

        <h3>{compound.physicochemical.tpsa} Å² TPSA</h3>

        <p>
          Topological polar surface area estimates the contribution
          of polar atoms to the molecular surface. It is useful
          when assessing potential hydrogen-bonding characteristics
          and permeability.
        </p>
      </div>

      {/* Potential Interaction Sites */}
      <div className="ligand-card">
        <span>Potential Interaction Sites</span>

        <h3>Oxygen and nitrogen atoms</h3>

        <p>
          Depending on their chemical environment, oxygen and
          nitrogen atoms may act as hydrogen-bond donors or
          acceptors. Their actual interactions depend on the
          protein binding environment.
        </p>
      </div>

      {/* Aromatic Structure */}
      <div className="ligand-card">
        <span>Aromatic Structure</span>

        <h3>
          {compound.physicochemical.aromaticHeavyAtoms} aromatic atoms
        </h3>

        <p>
          {ligandData[compound.id].aromaticDescription}
          {" "}Aromatic regions may contribute to hydrophobic
          contacts and π-related interactions with suitable
          protein residues.
        </p>
      </div>

    </div>
  </div>
)}

        {activeSection === "ADMET Analysis" && (
  <div>
    <h2>ADMET Analysis</h2>

    <p className="section-description">
      Computational predictions describing the absorption,
      distribution and metabolism of this compound.
      These values are predictions, not experimental measurements.
    </p>

    {/* ABSORPTION */}
    <h3 className="admet-category">1. Absorption</h3>

    <div className="admet-info-grid">
      <div className="admet-info-card">
        <span>GI Absorption</span>
        <h3>{compound.pharmacokinetics.giAbsorption}</h3>
      </div>

      <div className="admet-info-card">
        <span>ESOL Solubility</span>
        <h3>{compound.solubility.ESOL.classification}</h3>
        <p>{compound.solubility.ESOL.mgMl} mg/mL</p>
      </div>

      <div className="admet-info-card">
        <span>Bioavailability Score</span>
        <h3>{compound.drugLikeness.bioavailabilityScore}</h3>
      </div>
    </div>

    {/* DISTRIBUTION */}
    <h3 className="admet-category">2. Distribution</h3>

    <div className="admet-info-grid">
      <div className="admet-info-card">
        <span>Blood-Brain Barrier</span>
        <h3>
          {compound.pharmacokinetics.bbbPermeant ? "Permeant" : "Not Permeant"}
        </h3>
      </div>

      <div className="admet-info-card">
        <span>P-glycoprotein Substrate</span>
        <h3>
          {compound.pharmacokinetics.pgpSubstrate ? "Yes" : "No"}
        </h3>
      </div>

      <div className="admet-info-card">
        <span>Skin Permeability (Log Kp)</span>
        <h3>{compound.pharmacokinetics.logKp}</h3>
      </div>
    </div>

    {/* METABOLISM */}
    <h3 className="admet-category">3. Metabolism</h3>

    <div className="cyp-grid">
      {Object.entries(compound.pharmacokinetics.cyp).map(
        ([enzyme, result]) => (
          <div className="cyp-card" key={enzyme}>
            <span>{enzyme}</span>
            <strong className={result ? "cyp-yes" : "cyp-no"}>
              {result ? "Predicted inhibitor" : "No inhibition predicted"}
            </strong>
          </div>
        )
      )}
    </div>

    {/* EXCRETION */}
    <h3 className="admet-category">4. Excretion</h3>

    <div className="admet-note">
      <strong>Data unavailable</strong>
      <p>
        Excretion-related predictions are not included in the
        current SwissADME dataset. Additional pharmacokinetic
        analysis is required to evaluate clearance and elimination.
      </p>
    </div>

    {/* TOXICITY */}
    <h3 className="admet-category">5. Toxicity</h3>

    <div className="admet-note">
      <strong>Not assessed in the current dataset</strong>
      <p>
        The available data do not provide a comprehensive toxicity
        prediction. Drug-likeness alerts and medicinal chemistry
        filters should not be interpreted as proof of safety or toxicity.
      </p>
    </div>

    {/* VISUALIZATIONS */}
    <h3 className="admet-category">ADMET Visualizations</h3>

    <div className="admet-grid">
      <BioavailabilityRadar compound={compound} />
      <BoiledEgg compound={compound} />
    </div>
  </div>
)}

       {activeSection === "Drug-likeness" && (
  <div>
    <h2>Drug-likeness</h2>

    <p className="section-description">
      Drug-likeness filters evaluate whether a compound's
      physicochemical properties fall within commonly used
      ranges associated with orally active drug candidates.
    </p>

    <div className="drug-filter-grid">
      {[
        ["Lipinski Rule of Five", compound.drugLikeness.lipinski],
        ["Ghose Filter", compound.drugLikeness.ghose],
        ["Veber Filter", compound.drugLikeness.veber],
        ["Egan Filter", compound.drugLikeness.egan],
        ["Muegge Filter", compound.drugLikeness.muegge],
      ].map(([name, passed]) => (
        <div className="drug-filter-card" key={name}>
          <span>{name}</span>

          <strong className={passed ? "filter-pass" : "filter-fail"}>
            {passed ? "✓ Passed" : "✕ Not Passed"}
          </strong>
        </div>
      ))}
    </div>

    <div className="drug-summary-card">
      <h3>Lipinski Rule of Five</h3>

      <p>
        Number of violations:
        <strong> {compound.drugLikeness.lipinskiViolations}</strong>
      </p>

      <p>
        Bioavailability Score:
        <strong> {compound.drugLikeness.bioavailabilityScore}</strong>
      </p>

      <p className="section-description">
        Passing these filters does not establish that a compound
        is safe, effective or suitable as a drug.
      </p>
    </div>
  </div>
)}
        {activeSection === "Medicinal Chemistry" && (
  <div>
    <h2>Medicinal Chemistry</h2>

    <p className="section-description">
      Structural alerts and synthetic accessibility indicators
      used to evaluate potential medicinal chemistry limitations.
    </p>

    <div className="medchem-grid">

      <div className="medchem-card">
        <span>PAINS Alerts</span>
        <h3>{compound.drugLikeness.painsAlerts}</h3>
        <p>
          Pan-Assay Interference Compounds alerts identify
          structural patterns that may cause nonspecific
          assay interference.
        </p>
      </div>

      <div className="medchem-card">
        <span>Brenk Alerts</span>
        <h3>{compound.drugLikeness.brenkAlerts}</h3>
        <p>
          Brenk filters identify potentially problematic
          structural features that may require further evaluation.
        </p>
      </div>

      <div className="medchem-card">
        <span>Synthetic Accessibility</span>
        <h3>{compound.drugLikeness.syntheticAccessibility} / 10</h3>
        <p>
          An estimated measure of the difficulty of synthesizing
          the compound. Lower scores generally indicate easier synthesis.
        </p>
      </div>

    </div>

    <div className="medchem-details">
      <h3>Structural Alert Details</h3>

      {(compound.drugLikeness.brenkDetails || []).length > 0 ? (
  <ul>
    {compound.drugLikeness.brenkDetails.map((alert, index) => (
      <li key={index}>{alert}</li>
    ))}
  </ul>
) : (
  <p>No Brenk alerts recorded.</p>
)}
      <p className="section-description">
        Structural alerts are screening indicators, not proof
        of toxicity or biological inactivity.
      </p>
    </div>

  </div>
)}
      </section>
    </div>
  );
}
