"""
Analyse the docked poses in public/structures and write
public/structures/interaction_summary.json  (read by src/services/dockingContext.js).

Method (geometric estimates only - NOT experimentally confirmed interactions):
  * contact residue        : any protein heavy atom within 4.0 A of a ligand heavy atom
  * possible H-bond        : ligand N/O to protein N/O within 3.5 A (distance only, no angle check)
  * hydrophobic contact    : protein C atom of a non-polar residue within 4.0 A of a ligand C atom
  * metal ion contact      : metal ion (Zn, Ca, Mg, ...) within 3.5 A of a ligand atom

Run from the project root:   python scripts/analyze_poses.py
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STRUCT = ROOT / "public" / "structures"

CONTACT_CUTOFF = 4.0
HBOND_CUTOFF = 3.5
METAL_CUTOFF = 3.5
HYDROPHOBIC_RESIDUES = {"ALA", "VAL", "LEU", "ILE", "MET", "PHE", "TRP", "PRO", "TYR"}
METALS = {"ZN", "CA", "MG", "FE", "MN", "CU", "CO", "NI", "NA", "K"}
WATER = {"HOH", "WAT", "DOD"}


def element_of(line):
    el = line[76:78].strip().upper()
    if el:
        return el
    name = line[12:16].strip()
    return (name[:1] if name else "C").upper()


def parse(path, first_model_only=False):
    atoms = []
    with open(path) as fh:
        for line in fh:
            if line.startswith("ENDMDL") and first_model_only:
                break
            if not line.startswith(("ATOM", "HETATM")):
                continue
            atoms.append(
                {
                    "serial": int(line[6:11]),
                    "name": line[12:16].strip(),
                    "resname": line[17:20].strip(),
                    "chain": line[21].strip(),
                    "resnum": line[22:27].strip(),
                    "xyz": (float(line[30:38]), float(line[38:46]), float(line[46:54])),
                    "el": element_of(line),
                    "het": line.startswith("HETATM"),
                }
            )
    return atoms


def dist(a, b):
    return math.dist(a["xyz"], b["xyz"])


def analyse(protein_path, ligand_path):
    protein = [a for a in parse(protein_path) if a["resname"] not in WATER and a["el"] != "H"]
    ligand = [a for a in parse(ligand_path, True) if a["el"] != "H"]

    multi_chain = len({a["chain"] for a in protein if not a["het"]}) > 1

    def label(a):
        base = f'{a["resname"]}{a["resnum"]}'
        return f'{a["chain"]}:{base}' if multi_chain and a["chain"] else base

    metals = [a for a in protein if a["het"] and a["el"] in METALS]
    residues = [a for a in protein if not (a["het"] and a["el"] in METALS)]

    contacts, hbonds, hydrophobic = {}, [], set()
    for p in residues:
        for l in ligand:
            d = dist(p, l)
            if d <= CONTACT_CUTOFF:
                contacts.setdefault(label(p), None)
                if p["el"] == "C" and l["el"] == "C" and p["resname"] in HYDROPHOBIC_RESIDUES:
                    hydrophobic.add(label(p))
            if d <= HBOND_CUTOFF and p["el"] in ("N", "O") and l["el"] in ("N", "O"):
                hbonds.append(
                    {
                        "residue": label(p),
                        "protein_atom": p["name"],
                        "ligand_atom": f'{l["el"]}{l["serial"]}',
                        "distance": round(d, 2),
                    }
                )

    metal_contacts = []
    for m in metals:
        close = min((dist(m, l) for l in ligand), default=999)
        if close <= METAL_CUTOFF:
            metal_contacts.append(f'{m["el"].capitalize()} ({m["resname"]}{m["resnum"]}) {close:.2f} Å from ligand')

    def order(label_):
        digits = "".join(ch for ch in label_.split(":")[-1] if ch.isdigit())
        return int(digits) if digits else 0

    hbonds.sort(key=lambda h: h["distance"])
    return {
        "contact_residues": sorted(contacts, key=order),
        "possible_hydrogen_bonds": hbonds,
        "hydrophobic_contact_residues": sorted(hydrophobic, key=order),
        "metal_ion_contacts": metal_contacts,
    }


def main():
    out = {}
    for prot_dir in sorted(p for p in STRUCT.iterdir() if p.is_dir()):
        protein_pdb = prot_dir / "protein.pdb"
        if not protein_pdb.exists():
            continue
        out[prot_dir.name] = {}
        for lig in sorted(prot_dir.glob("*.pdb")):
            if lig.name == "protein.pdb":
                continue
            out[prot_dir.name][lig.stem] = analyse(protein_pdb, lig)
            print(f"analysed {prot_dir.name} / {lig.stem}")
    target = STRUCT / "interaction_summary.json"
    target.write_text(json.dumps(out, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote {target} ({target.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
