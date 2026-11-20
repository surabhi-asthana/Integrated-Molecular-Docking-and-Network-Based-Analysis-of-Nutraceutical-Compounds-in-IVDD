const STRING_URL = "https://string-db.org/api/json/network";
const CACHE_KEY = "ivdd-string-network-v1";

// Fetch interactions among `genes` from STRING (Homo sapiens).
// Returns [{ a, b, score }] with score in 0..1. Results are cached in localStorage.
export async function fetchStringNetwork(genes, minScore = 0.4) {
  const signature = `${[...genes].sort().join(",")}|${minScore}`;

  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && cached.signature === signature) return cached.edges;
  } catch {
    /* ignore cache problems */
  }

  const body = new URLSearchParams({
    identifiers: genes.join("\r"),
    species: "9606",
    required_score: String(Math.round(minScore * 1000)),
    caller_identity: "ivdd-platform",
  });

  const res = await fetch(STRING_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`STRING returned HTTP ${res.status}`);

  const rows = await res.json();
  if (!Array.isArray(rows)) throw new Error("Unexpected response from STRING");

  const edges = rows.map((r) => ({
    a: r.preferredName_A,
    b: r.preferredName_B,
    score: r.score,
  }));

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ signature, edges }));
  } catch {
    /* storage full / blocked: fine */
  }
  return edges;
}

export function clearNetworkCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}
