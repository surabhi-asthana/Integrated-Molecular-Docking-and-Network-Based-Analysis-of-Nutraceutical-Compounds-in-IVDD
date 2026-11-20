// Builds the docking knowledge that is sent to the AI backend with every question,
// so DiscNet AI can answer using YOUR docking results instead of guessing.
//
// It combines:
//   1. docking scores         (public/structures/poses_summary.json)
//   2. pose interaction data  (public/structures/interaction_summary.json,
//                              created by scripts/analyze_poses.py)
import { PROTEINS, COMPOUNDS } from "../data/proteins";
import { getActiveDocking } from "./activeDocking";
import compounds from "../data/compounds";

// ---------------------------------------------------------------------------
// EDIT THIS: add the real details of your docking protocol here.
// Anything left empty is reported to the AI as "not provided", so it will not
// invent it.
// ---------------------------------------------------------------------------
const DOCKING_PROTOCOL = {
  software: "AutoDock Vina",
  scoring_unit: "kcal/mol (more negative = stronger predicted binding)",
  exhaustiveness: "",
  grid_box: "",
  receptor_preparation: "",
  ligand_preparation: "",
  validation: "",
};

let cached = null; // fetch + build only once per page load

const round = (n) => Math.round(n * 100) / 100;

async function loadJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Could not load ${url}:`, err);
    return null;
  }
}

function buildScores(summary) {
  const scores = {};
  const bestCompoundPerProtein = {};
  const byCompound = {};
  const ranked = [];

  for (const protein of PROTEINS) {
    const entries = summary[protein.id];
    if (!entries) continue;

    scores[protein.name] = {};
    let best = null;

    for (const compound of COMPOUNDS) {
      const entry = entries[compound.id];
      if (!entry || typeof entry.score !== "number") continue;

      const score = round(entry.score);
      scores[protein.name][compound.name] = score;
      (byCompound[compound.name] ??= []).push({ protein: protein.name, score });
      ranked.push({ protein: protein.name, compound: compound.name, score });
      if (!best || score < best.score) best = { compound: compound.name, score };
    }
    if (best) bestCompoundPerProtein[protein.name] = best;
  }

  // Targets docked with EVERY compound, so averages compare like with like
  // (melatonin was not docked to MMP-13 / MMP-7 / ADAMTS-5).
  const sharedTargets = PROTEINS.filter((p) =>
    COMPOUNDS.every((c) => typeof summary[p.id]?.[c.id]?.score === "number")
  ).map((p) => p.name);

  const bestProteinPerCompound = {};
  const averageOnSharedTargets = {};
  for (const [compound, list] of Object.entries(byCompound)) {
    bestProteinPerCompound[compound] = [...list].sort((a, b) => a.score - b.score)[0];
    const shared = list.filter((x) => sharedTargets.includes(x.protein));
    if (shared.length) {
      averageOnSharedTargets[compound] = round(
        shared.reduce((sum, x) => sum + x.score, 0) / shared.length
      );
    }
  }

  const notDocked = [];
  for (const protein of PROTEINS) {
    for (const compound of COMPOUNDS) {
      if (!summary[protein.id]?.[compound.id]) {
        notDocked.push(`${compound.name} with ${protein.name}`);
      }
    }
  }

  return {
    docking_scores_kcal_per_mol: scores,
    best_compound_per_protein: bestCompoundPerProtein,
    best_protein_per_compound: bestProteinPerCompound,
    targets_docked_with_all_compounds: sharedTargets,
    average_score_per_compound_on_those_targets: averageOnSharedTargets,
    top_5_strongest_overall: [...ranked].sort((a, b) => a.score - b.score).slice(0, 5),
    pairs_not_docked: notDocked,
  };
}

// Compact interaction data for ONE protein-compound pair
function pairInteractions(e) {
  if (!e) return null;
  return {
    contact_residues: e.contact_residues,
    possible_hydrogen_bonds: (e.possible_hydrogen_bonds ?? [])
      .slice(0, 8)
      .map((h) => `${h.residue} (${h.protein_atom}...${h.ligand_atom}) ${h.distance} Å`),
    hydrophobic_contact_residues: e.hydrophobic_contact_residues,
    metal_ion_contacts: e.metal_ion_contacts,
  };
}

// Compact per-pair interaction data from the docked poses
function buildInteractions(interactionSummary) {
  if (!interactionSummary) return null;
  const out = {};

  for (const protein of PROTEINS) {
    const entries = interactionSummary[protein.id];
    if (!entries) continue;
    out[protein.name] = {};

    for (const compound of COMPOUNDS) {
      const e = entries[compound.id];
      if (e) out[protein.name][compound.name] = pairInteractions(e);
    }
  }
  return out;
}

const STRONG_BINDING = -7.0; // rough working cut-off, not a validated threshold

// ADMET / drug-likeness summary for ONE compound (from src/data/compounds.js)
function buildAdmet(id) {
  const c = compounds.find((x) => x.id === id);
  if (!c) return "unavailable";
  return {
    formula: c.formula,
    molecular_weight: c.molecularWeight,
    logP: c.physicochemical?.logP,
    tpsa: c.physicochemical?.tpsa,
    h_bond_donors: c.physicochemical?.hbd,
    h_bond_acceptors: c.physicochemical?.hba,
    rotatable_bonds: c.physicochemical?.rotatableBonds,
    solubility_ESOL: c.solubility?.ESOL
      ? `${c.solubility.ESOL.classification} (logS ${c.solubility.ESOL.logS})`
      : undefined,
    gi_absorption: c.pharmacokinetics?.giAbsorption,
    bbb_permeant: c.pharmacokinetics?.bbbPermeant,
    pgp_substrate: c.pharmacokinetics?.pgpSubstrate,
    cyp_inhibitor_of: Object.entries(c.pharmacokinetics?.cyp ?? {})
      .filter(([, v]) => v)
      .map(([k]) => k),
    lipinski_pass: c.drugLikeness?.lipinski,
    lipinski_violations: c.drugLikeness?.lipinskiViolations,
    veber_pass: c.drugLikeness?.veber,
    bioavailability_score: c.drugLikeness?.bioavailabilityScore,
    pains_alerts: c.drugLikeness?.painsAlerts,
    brenk_alerts: c.drugLikeness?.brenkAlerts,
    synthetic_accessibility: c.drugLikeness?.syntheticAccessibility,
    note: "Predicted (in silico) values, not experimental measurements.",
  };
}

// How many targets does this compound bind well? (multi-target check)
function buildMultiTarget(summary, compoundId) {
  const rows = [];
  for (const p of PROTEINS) {
    const s = summary?.[p.id]?.[compoundId]?.score;
    if (typeof s === "number") rows.push({ protein: p.name, score: round(s) });
  }
  if (!rows.length) return "unavailable";
  const byScore = [...rows].sort((a, b) => a.score - b.score);
  const strong = byScore.filter((r) => r.score <= STRONG_BINDING);
  return {
    targets_docked: rows.length,
    targets_at_or_below_minus_7: strong.length,
    strong_targets: strong.map((r) => `${r.protein}: ${r.score}`),
    weaker_targets: byScore.filter((r) => r.score > STRONG_BINDING).map((r) => `${r.protein}: ${r.score}`),
    average_score_kcal_per_mol: round(rows.reduce((t, r) => t + r.score, 0) / rows.length),
    note: "-7.0 kcal/mol is only a rough working cut-off for moderate-to-good predicted binding.",
  };
}

// What the user is looking at RIGHT NOW on the Docking page, with rankings,
// so questions like "is this docking efficient?" can be answered about that pair.
function buildSelection(summary, interactionSummary, active) {
  if (!active) {
    return {
      status:
        "No docking result is currently open on the Docking page. If the user says " +
        "'this' or 'it' without naming a protein and compound, ask which pair they mean.",
    };
  }
  const protein = PROTEINS.find((p) => p.id === active.protein);
  const compound = COMPOUNDS.find((c) => c.id === active.compound);
  const entry = summary?.[active.protein]?.[active.compound];
  if (!protein || !compound || !entry || typeof entry.score !== "number") {
    return {
      protein: protein?.name ?? active.protein,
      compound: compound?.name ?? active.compound,
      status: "Docking results are not available for this pair.",
    };
  }

  const score = round(entry.score);
  const all = [];
  for (const p of PROTEINS) {
    for (const c of COMPOUNDS) {
      const e = summary[p.id]?.[c.id];
      if (e && typeof e.score === "number") {
        all.push({ protein: p.name, compound: c.name, score: round(e.score) });
      }
    }
  }
  const sorted = [...all].sort((a, b) => a.score - b.score);
  const rankOf = (list) => list.findIndex((x) => x.score >= score) + 1;

  const sameProtein = sorted.filter((x) => x.protein === protein.name);
  const sameCompound = sorted.filter((x) => x.compound === compound.name);
  const weakerCount = all.filter((x) => x.score > score).length;

  return {
    protein: protein.name,
    compound: compound.name,
    docking_score_kcal_per_mol: score,
    binding_affinity_shown_on_screen: active.displayed_affinity
      ? `${active.displayed_affinity} kcal/mol`
      : `${score} kcal/mol`,
    rank_among_all_docked_pairs: `${rankOf(sorted)} of ${all.length} (1 = strongest)`,
    rank_among_compounds_for_this_protein: `${rankOf(sameProtein)} of ${sameProtein.length}`,
    rank_among_proteins_for_this_compound: `${rankOf(sameCompound)} of ${sameCompound.length}`,
    stronger_than_percent_of_all_pairs: Math.round((weakerCount / all.length) * 100),
    project_score_range_kcal_per_mol: { strongest: sorted[0].score, weakest: sorted[sorted.length - 1].score },
    all_compounds_on_this_protein: sameProtein.map((x) => `${x.compound}: ${x.score}`),
    all_proteins_for_this_compound: sameCompound.map((x) => `${x.protein}: ${x.score}`),
    docking_runs: entry.runs,
    compound_admet: buildAdmet(active.compound),
    multi_target_profile: buildMultiTarget(summary, active.compound),
    pose_interactions: pairInteractions(interactionSummary?.[active.protein]?.[active.compound]) ?? "unavailable",
  };
}

let rawData = null; // { summary, interactionSummary } loaded once per page load

async function loadRaw() {
  if (rawData) return rawData;
  const [summary, interactionSummary] = await Promise.all([
    loadJson("/structures/poses_summary.json"),
    loadJson("/structures/interaction_summary.json"),
  ]);
  rawData = { summary, interactionSummary };
  return rawData;
}

export async function getDockingContext() {
  if (cached) return cached;

  const { summary, interactionSummary } = await loadRaw();

  const protocol = Object.fromEntries(
    Object.entries(DOCKING_PROTOCOL).map(([k, v]) => [k, v || "not provided"])
  );

  cached = {
    docking_protocol: protocol,
    compounds_admet: Object.fromEntries(COMPOUNDS.map((c) => [c.name, buildAdmet(c.id)])),
    ...(summary ? buildScores(summary) : { docking_scores_kcal_per_mol: "unavailable" }),
    pose_interaction_analysis: {
      method:
        "Geometric analysis of the docked pose files. Contact = any protein heavy atom " +
        "within 4.0 Å of the ligand. Possible hydrogen bond = ligand N/O to protein N/O " +
        "within 3.5 Å (distance only, angles not checked). These are estimates, not " +
        "experimentally confirmed interactions.",
      per_pair: buildInteractions(interactionSummary) ?? "unavailable",
    },
    data_limitations:
      "Docking scores, pose-based contact/H-bond estimates, ADMET predictions and the " +
      "docking protocol are provided. Anything marked 'not provided' or missing must be " +
      "reported as unavailable, never guessed.",
  };
  return cached;
}

// Everything the AI needs for one question: all docking results, plus the pair
// currently open on the Docking page. Used by the floating chat and the
// AI Interpretation tab.
export async function getAskContext(section, extra = {}) {
  const docking = await getDockingContext();
  const { summary, interactionSummary } = await loadRaw();
  return {
    section,
    ...extra,
    current_docking_selection: buildSelection(summary, interactionSummary, getActiveDocking()),
    docking_results: docking,
  };
}
