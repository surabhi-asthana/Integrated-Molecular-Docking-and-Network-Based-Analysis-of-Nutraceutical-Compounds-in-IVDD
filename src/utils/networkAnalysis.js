// Pure graph helpers for the PPI network (no React, no network access).

// edges: [{ a, b, score }] with score in 0..1. Self-loops and duplicates are dropped.
export function buildGraph(genes, edges) {
  const adj = new Map(genes.map((g) => [g, new Set()]));
  const seen = new Set();
  const clean = [];

  for (const e of edges) {
    if (e.a === e.b || !adj.has(e.a) || !adj.has(e.b)) continue;
    const key = e.a < e.b ? `${e.a}|${e.b}` : `${e.b}|${e.a}`;
    if (seen.has(key)) continue;
    seen.add(key);
    adj.get(e.a).add(e.b);
    adj.get(e.b).add(e.a);
    clean.push(e);
  }
  return { adj, edges: clean };
}

export function degreeOf(adj, node) {
  return adj.get(node)?.size ?? 0;
}

// Local clustering coefficient of one node (STRING convention: 0 if degree < 2).
export function localClustering(adj, node) {
  const nbrs = [...(adj.get(node) ?? [])];
  const k = nbrs.length;
  if (k < 2) return 0;
  let links = 0;
  for (let i = 0; i < k; i++) {
    for (let j = i + 1; j < k; j++) {
      if (adj.get(nbrs[i]).has(nbrs[j])) links++;
    }
  }
  return (2 * links) / (k * (k - 1));
}

// Maximal cliques via Bron–Kerbosch with pivoting.
export function maximalCliques(adj) {
  const cliques = [];
  const nodes = new Set(adj.keys());

  function bk(R, P, X) {
    if (P.size === 0 && X.size === 0) {
      cliques.push(R);
      return;
    }
    // pivot = vertex in P ∪ X with most neighbours in P
    let pivot = null;
    let best = -1;
    for (const u of [...P, ...X]) {
      let c = 0;
      for (const v of adj.get(u)) if (P.has(v)) c++;
      if (c > best) {
        best = c;
        pivot = u;
      }
    }
    const pivotNbrs = adj.get(pivot);
    for (const v of [...P]) {
      if (pivotNbrs.has(v)) continue;
      const nv = adj.get(v);
      bk(
        [...R, v],
        new Set([...P].filter((x) => nv.has(x))),
        new Set([...X].filter((x) => nv.has(x)))
      );
      P.delete(v);
      X.add(v);
    }
  }

  bk([], nodes, new Set());
  return cliques;
}

const factorial = (n) => {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};

// cytoHubba MCC: for node v, sum over maximal cliques C containing v of (|C|-1)!
// For an isolated node MCC = 0; for a node whose only cliques are edges, MCC = degree.
export function mccScores(adj) {
  const scores = new Map([...adj.keys()].map((n) => [n, 0]));
  for (const clique of maximalCliques(adj)) {
    if (clique.length < 2) continue;
    const w = factorial(clique.length - 1);
    for (const n of clique) scores.set(n, scores.get(n) + w);
  }
  return scores;
}

// Full analysis used by the Network page.
export function analyseNetwork(genes, edges) {
  const { adj, edges: cleanEdges } = buildGraph(genes, edges);

  const degree = new Map(genes.map((g) => [g, degreeOf(adj, g)]));
  const clustering = new Map(genes.map((g) => [g, localClustering(adj, g)]));
  const mcc = mccScores(adj);

  const connected = genes.filter((g) => degree.get(g) > 0);
  const n = connected.length;
  const avgDegree = n ? (2 * cleanEdges.length) / n : 0;
  // STRING's "average local clustering coefficient" averages over all nodes in the network
  const avgClustering = n
    ? connected.reduce((s, g) => s + clustering.get(g), 0) / n
    : 0;

  const ranking = [...connected].sort(
    (a, b) =>
      mcc.get(b) - mcc.get(a) ||
      degree.get(b) - degree.get(a) ||
      a.localeCompare(b)
  );

  return {
    adj,
    edges: cleanEdges,
    degree,
    clustering,
    mcc,
    ranking,
    connected,
    isolated: genes.filter((g) => degree.get(g) === 0),
    stats: {
      nodes: n,
      edges: cleanEdges.length,
      avgDegree,
      avgClustering,
    },
  };
}
