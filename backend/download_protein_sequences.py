
import json
import time
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen

GENES = [
    "TNF", "IL6", "IL1B", "NLRP3", "LY96", "NFKB1",
    "IKBKB", "STAT3", "HIF1A", "SIRT1", "MAPK1", "AKT1",
    "MMP7", "MMP13", "ADAMTS5", "MMP19", "MMP1", "MMP3",
    "SOX9", "COL2A1", "ACAN", "COL1A1",
    "CASP3", "BAX", "BCL2",
    "SOD1", "SOD2", "NFE2L2", "VEGFA",
    "TP53", "CDKN1A", "CDKN2A",
]

API_URL = "https://rest.uniprot.org/uniprotkb/search"

OUTPUT_FILE = (
    Path(__file__).resolve().parent
    / "data"
    / "protein_sequences.json"
)


def fetch_protein(gene):
    params = {
        "query": (
        "accession:P42771"
        if gene == "CDKN2A"
        else f"gene_exact:{gene} AND organism_id:9606 AND reviewed:true"),
        "format": "json",
        "fields": "accession,gene_primary,protein_name,sequence",
        "size": 10,
    }

    url = f"{API_URL}?{urlencode(params)}"

    request = Request(
        url,
        headers={"User-Agent": "DiscNetAI/1.0"}
    )

    with urlopen(request, timeout=30) as response:
        data = json.loads(response.read().decode("utf-8"))

    results = data.get("results", [])

    # Keep only records whose primary gene matches the requested gene.
    matches = [
        item for item in results
        if any(
            entry.get("geneName", {}).get("value") == gene
            for entry in item.get("genes", [])
        )
    ]

    if len(matches) != 1:
        print(
            f"[WARNING] {gene}: expected 1 reviewed match, "
            f"found {len(matches)}"
        )
        return None

    item = matches[0]

    sequence = item.get("sequence", {}).get("value", "")
    accession = item.get("primaryAccession", "")

    protein_description = item.get("proteinDescription", {})
    recommended_name = protein_description.get(
        "recommendedName", {}
    )
    full_name = recommended_name.get("fullName", {})
    protein_name = full_name.get("value", gene)

    if not sequence or not accession:
        print(f"[WARNING] {gene}: missing sequence or accession")
        return None

    return {
        "gene": gene,
        "accession": accession,
        "protein_name": protein_name,
        "sequence": sequence,
        "length": len(sequence),
        "organism": "Homo sapiens",
        "reviewed": True,
    }


def main():
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    database = {}
    failed = []

    for index, gene in enumerate(GENES, start=1):
        print(f"[{index}/{len(GENES)}] Fetching {gene}...")

        try:
            record = fetch_protein(gene)

            if record:
                database[gene] = record
                print(
                    f"  Saved: {record['accession']} "
                    f"({record['length']} amino acids)"
                )
            else:
                failed.append(gene)

        except Exception as error:
            print(f"  [ERROR] {gene}: {error}")
            failed.append(gene)

        time.sleep(0.2)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump(database, file, indent=4)

    print("\n========== DOWNLOAD SUMMARY ==========")
    print(f"Successful: {len(database)}/{len(GENES)}")
    print(f"Failed: {failed}")
    print(f"Saved to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
