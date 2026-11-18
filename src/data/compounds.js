const compounds = [
  {
    id: "curcumin",
    name: "Curcumin",
    formula: "C21H20O6",
    molecularWeight: 368.38,
    pubchemCID: 969516,
    iupacName: "(1E,6E)-1,7-bis(4-hydroxy-3-methoxyphenyl)hepta-1,6-diene-3,5-dione",
    smiles: "COC1=C(C=CC(=C1)/C=C/C(=O)CC(=O)/C=C/C2=CC(=C(C=C2)O)OC)O",
    inchiKey: "VFLDPWHFBUODDF-FCXRPNKRSA-N",

    physicochemical: {
      heavyAtoms: 27,
      aromaticHeavyAtoms: 12,
      fractionCsp3: 0.14,
      rotatableBonds: 8,
      hba: 6,
      hbd: 2,
      molarRefractivity: 102.80,
      tpsa: 93.06,
      logP: 3.07
    },

    lipophilicity: {
      iLOGP: 3.47,
      XLOGP3: 3.20,
      WLOGP: 3.15,
      MLOGP: 1.47,
      SILICOS_IT: 4.04,
      consensus: 3.07
    },

    solubility: {
      ESOL: { logS: -3.94, mgMl: 0.0422, classification: "Soluble" },
      Ali: { logS: -4.83, mgMl: 0.00550, classification: "Moderately soluble" },
      SILICOS_IT: { logS: -4.45, mgMl: 0.0131, classification: "Moderately soluble" }
    },

    pharmacokinetics: {
      giAbsorption: "High",
      bbbPermeant: false,
      pgpSubstrate: false,
      cyp: {
        CYP1A2: false,
        CYP2C19: false,
        CYP2C9: true,
        CYP2D6: false,
        CYP3A4: true
      },
      logKp: -6.28
    },

    drugLikeness: {
      lipinski: true,
      lipinskiViolations: 0,
      ghose: true,
      veber: true,
      egan: true,
      muegge: true,
      bioavailabilityScore: 0.55,
      painsDetails: [],
      painsAlerts: 0,
      brenkAlerts: 2,
      brenkDetails: ["beta_keto_anhydride", "michael_acceptor_1"],
      syntheticAccessibility: 2.97
    }
  },

  {
    id: "quercetin",
    name: "Quercetin",
    formula: "C15H10O7",
    molecularWeight: 302.24,
    pubchemCID: 5280343,
iupacName: "2-(3,4-dihydroxyphenyl)-3,5,7-trihydroxychromen-4-one",
smiles: "C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O",
inchiKey: "REFJWTPEDVJJIY-UHFFFAOYSA-N",

    physicochemical: {
      heavyAtoms: 22,
      aromaticHeavyAtoms: 16,
      fractionCsp3: 0,
      rotatableBonds: 1,
      hba: 7,
      hbd: 5,
      molarRefractivity: 78.03,
      tpsa: 131.36,
      logP: 0.95
    },

    lipophilicity: {
      iLOGP: 1.59,
      XLOGP3: 1.59,
      WLOGP: 1.99,
      MLOGP: -0.56,
      SILICOS_IT: 0.14,
      consensus: 0.95
    },

    solubility: {
      ESOL: { logS: -3.19, mgMl: 0.196, classification: "Soluble" },
      Ali: { logS: -3.96, mgMl: 0.0332, classification: "Soluble" },
      SILICOS_IT: { logS: -2.77, mgMl: 0.507, classification: "Soluble" }
    },

    pharmacokinetics: {
      giAbsorption: "High",
      bbbPermeant: false,
      pgpSubstrate: false,
      cyp: {
        CYP1A2: true,
        CYP2C19: false,
        CYP2C9: false,
        CYP2D6: true,
        CYP3A4: true
      },
      logKp: -7.01
    },

    drugLikeness: {
      lipinski: true,
      lipinskiViolations: 0,
      ghose: true,
      veber: true,
      egan: true,
      muegge: true,
      bioavailabilityScore: 0.55,
      painsAlerts: 1,
      painsDetails: ["catechol_A"],
      brenkAlerts: 1,
      brenkDetails: ["catechol"],
      syntheticAccessibility: 3.23
    }
  },

  {
    id: "baicalein",
    name: "Baicalein",
    formula: "C15H10O5",
    molecularWeight: 270.24,
    pubchemCID: 5281605,
iupacName: "5,6,7-trihydroxy-2-phenylchromen-4-one",
smiles: "C1=CC=C(C=C1)C2=CC(=O)C3=C(O2)C=C(C(=C3O)O)O",
inchiKey: "FXNFHKRTJBSTCS-UHFFFAOYSA-N",

    physicochemical: {
      heavyAtoms: 20,
      aromaticHeavyAtoms: 16,
      fractionCsp3: 0,
      rotatableBonds: 1,
      hba: 5,
      hbd: 3,
      molarRefractivity: 73.99,
      tpsa: 90.90,
      logP: 1.58
    },

    lipophilicity: {
      iLOGP: 1.79,
      XLOGP3: 1.88,
      WLOGP: 2.58,
      MLOGP: 0.52,
      SILICOS_IT: 1.13,
      consensus: 1.58
    },

    solubility: {
      ESOL: { logS: -3.23, mgMl: 0.161, classification: "Soluble" },
      Ali: { logS: -3.41, mgMl: 0.105, classification: "Soluble" },
      SILICOS_IT: { logS: -3.72, mgMl: 0.0517, classification: "Soluble" }
    },

    pharmacokinetics: {
      giAbsorption: "High",
      bbbPermeant: false,
      pgpSubstrate: false,
      cyp: {
        CYP1A2: true,
        CYP2C19: false,
        CYP2C9: false,
        CYP2D6: true,
        CYP3A4: true
      },
      logKp: -6.61
    },

    drugLikeness: {
      lipinski: true,
      lipinskiViolations: 0,
      ghose: true,
      veber: true,
      egan: true,
      muegge: true,
      bioavailabilityScore: 0.55,
      painsAlerts: 1,
      painsDetails: ["catechol_A"],
      brenkAlerts: 1,
      brenkDetails: ["catechol"],
      syntheticAccessibility: 3.02
    }
  },

  {
    id: "melatonin",
    name: "Melatonin",
    formula: "C13H16N2O2",
    molecularWeight: 232.28,
    pubchemCID: 896,
iupacName: "N-[2-(5-methoxy-1H-indol-3-yl)ethyl]acetamide",
smiles: "CC(=O)NCCC1=CNC2=C1C=C(C=C2)OC",
inchiKey: "DRLFMBDRBRZALE-UHFFFAOYSA-N",

    physicochemical: {
      heavyAtoms: 17,
      aromaticHeavyAtoms: 9,
      fractionCsp3: 0.31,
      rotatableBonds: 5,
      hba: 2,
      hbd: 2,
      molarRefractivity: 67.18,
      tpsa: 54.12,
      logP: 1.65
    },

    lipophilicity: {
      iLOGP: 2.18,
      XLOGP3: 1.59,
      WLOGP: 1.86,
      MLOGP: 0.97,
      SILICOS_IT: 1.63,
      consensus: 1.65
    },

    solubility: {
      ESOL: { logS: -2.34, mgMl: 1.05, classification: "Soluble" },
      Ali: { logS: -2.34, mgMl: 1.07, classification: "Soluble" },
      SILICOS_IT: { logS: -2.56, mgMl: 0.635, classification: "Soluble" }
    },

    pharmacokinetics: {
      giAbsorption: "High",
      bbbPermeant: true,
      pgpSubstrate: false,
      cyp: {
        CYP1A2: false,
        CYP2C19: false,
        CYP2C9: false,
        CYP2D6: false,
        CYP3A4: false
      },
      logKp: -6.59
    },

    drugLikeness: {
      lipinski: true,
      lipinskiViolations: 0,
      ghose: true,
      veber: true,
      egan: true,
      muegge: true,
      bioavailabilityScore: 0.55,
      painsDetails: [],
      painsAlerts: 0,
      brenkAlerts: 0,
      brenkDetails: [],
      syntheticAccessibility: 1.73
    }
  },

  {
    id: "resveratrol",
    name: "Resveratrol",
    formula: "C14H12O3",
    molecularWeight: 228.24,
    pubchemCID: 445154,
iupacName: "5-[(E)-2-(4-hydroxyphenyl)ethenyl]benzene-1,3-diol",
smiles: "C1=CC(=CC=C1/C=C/C2=CC(=CC(=C2)O)O)O",
inchiKey: "LUKBXSAWLPMMSZ-OWOJBTEDSA-N",
    physicochemical: {
      heavyAtoms: 17,
      aromaticHeavyAtoms: 12,
      fractionCsp3: 0,
      rotatableBonds: 2,
      hba: 3,
      hbd: 3,
      molarRefractivity: 67.88,
      tpsa: 60.69,
      logP: 2.47
    },

    lipophilicity: {
      iLOGP: 1.64,
      XLOGP3: 3.13,
      WLOGP: 2.76,
      MLOGP: 2.26,
      SILICOS_IT: 2.57,
      consensus: 2.47
    },

    solubility: {
      ESOL: { logS: -3.62, mgMl: 0.0551, classification: "Soluble" },
      Ali: { logS: -4.07, mgMl: 0.0193, classification: "Moderately soluble" },
      SILICOS_IT: { logS: -3.29, mgMl: 0.118, classification: "Soluble" }
    },

    pharmacokinetics: {
      giAbsorption: "High",
      bbbPermeant: true,
      pgpSubstrate: false,
      cyp: {
        CYP1A2: true,
        CYP2C19: false,
        CYP2C9: true,
        CYP2D6: false,
        CYP3A4: true
      },
      logKp: -5.47
    },

    drugLikeness: {
      lipinski: true,
      lipinskiViolations: 0,
      ghose: true,
      veber: true,
      egan: true,
      muegge: true,
      bioavailabilityScore: 0.55,
      painsDetails: [],
      painsAlerts: 0,
      brenkAlerts: 1,
      brenkDetails: ["stilbene"],
      syntheticAccessibility: 2.02
    }
  }
];

export default compounds;