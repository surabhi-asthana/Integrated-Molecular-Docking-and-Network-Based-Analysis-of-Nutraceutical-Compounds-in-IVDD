import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { NETWORK_GENES } from "../data/networkGenes";
import { fetchStringNetwork, clearNetworkCache } from "../services/networkService";
import { analyseNetwork } from "../utils/networkAnalysis";

// Published reference study (for comparison only)
const REFERENCE = {
  nodes: 21,
  edges: 82,
  avgDegree: 7.81,
  avgClustering: 0.702,
  hubs: ["NFKB1", "IL6", "TNF", "TIMP1", "SIRT1", "IL1B", "STAT3", "NLRP3"],
};

const CATEGORY_COLORS = {
  Inflammation: "#c0654a",
  Signalling: "#d19a3c",
  "Matrix Degradation": "#7a5c3e",
  "Extracellular Matrix": "#8f9a5b",
  Apoptosis: "#a0507a",
  "Oxidative Stress": "#4f8a8b",
  "Cellular Senescence": "#6f7fa8",
  Hypoxia: "#9b8a7a",
};

const GENE_INFO = Object.fromEntries(NETWORK_GENES.map((g) => [g.gene, g]));
const GENES = NETWORK_GENES.map((g) => g.gene);
const TOP_HUBS = 8;
const MIN_SCORE = 0.7; // STRING high confidence, same as the reference study

export default function Network() {
  const [rawEdges, setRawEdges] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [showIsolated, setShowIsolated] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const wrapRef = useRef(null);
  const graphRef = useRef(null);
  const [width, setWidth] = useState(800);

  const load = useCallback(async (force = false) => {
    setStatus("loading");
    setError("");
    try {
      if (force) clearNetworkCache();
      const edges = await fetchStringNetwork(GENES, MIN_SCORE);
      setRawEdges(edges);
      setStatus("ready");
    } catch (e) {
      setError(e.message || "Could not reach STRING");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchStringNetwork(GENES, MIN_SCORE)
      .then((edges) => {
        if (cancelled) return;
        setRawEdges(edges);
        setStatus("ready");
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message || "Could not reach STRING");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, [status]);

  const analysis = useMemo(
    () => analyseNetwork(GENES, rawEdges),
    [rawEdges]
  );

  const hubSet = useMemo(
    () => new Set(analysis.ranking.slice(0, TOP_HUBS)),
    [analysis]
  );

  const graphData = useMemo(() => {
    const nodeIds = showIsolated ? GENES : analysis.connected;
    return {
      nodes: nodeIds.map((id) => ({
        id,
        degree: analysis.degree.get(id),
        mcc: analysis.mcc.get(id),
        category: GENE_INFO[id].category,
      })),
      links: analysis.edges.map((e) => ({
        source: e.a,
        target: e.b,
        score: e.score,
      })),
    };
  }, [analysis, showIsolated]);

  const active = hovered || selected;
  const activeNbrs = useMemo(
    () => (active ? analysis.adj.get(active) ?? new Set() : null),
    [active, analysis]
  );

  const drawNode = useCallback(
    (node, ctx, scale) => {
      const r = 4 + Math.sqrt(node.degree) * 1.8;
      const dim =
        active && node.id !== active && !activeNbrs?.has(node.id);
      ctx.globalAlpha = dim ? 0.15 : 1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
      ctx.fillStyle = CATEGORY_COLORS[node.category] || "#999";
      ctx.fill();

      if (hubSet.has(node.id) || node.id === active) {
        ctx.lineWidth = 2 / scale;
        ctx.strokeStyle = "#3b2f25";
        ctx.stroke();
      }

      const fontSize = Math.max(10 / scale, 3);
      ctx.font = `${hubSet.has(node.id) ? "600 " : ""}${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#3b2f25";
      ctx.fillText(node.id, node.x, node.y + r + 1.5);
      ctx.globalAlpha = 1;
    },
    [active, activeNbrs, hubSet]
  );

  const stats = analysis.stats;
  const statCards = [
    { label: "Network Nodes", value: stats.nodes, ref: REFERENCE.nodes },
    { label: "Protein Associations", value: stats.edges, ref: REFERENCE.edges },
    {
      label: "Average Node Degree",
      value: stats.avgDegree.toFixed(2),
      ref: REFERENCE.avgDegree,
    },
    {
      label: "Clustering Coefficient",
      value: stats.avgClustering.toFixed(3),
      ref: REFERENCE.avgClustering,
    },
  ];

  const selectedInfo = selected ? GENE_INFO[selected] : null;

  return (
    <div className="network-page">
      <div className="page-heading">
        <div>
          <span className="section-eyebrow">SYSTEM BIOLOGY</span>
          <h1>Molecular Network</h1>
          <p>
            Protein–protein interaction network of the {GENES.length} IVDD
            targets, built live from STRING, with hub genes ranked by MCC.
          </p>
        </div>
      </div>

      <div className="reference-banner">
        <strong>Network generated from this platform's target list</strong>
        <span>
          Interactions come from STRING (Homo sapiens) for the {GENES.length}{" "}
          targets on the Targets page. The published 2026 reference network is
          shown beside each statistic for comparison; the two gene sets differ,
          so the numbers are not expected to match.
        </span>
      </div>

      {status === "loading" && (
        <div className="network-panel">
          <div className="network-placeholder">
            <span>Fetching interactions from STRING…</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="network-panel">
          <div className="network-placeholder">
            <span>Could not load the STRING network</span>
            <small>{error}</small>
            <button className="network-btn" onClick={() => load(true)}>
              Retry
            </button>
          </div>
        </div>
      )}

      {status === "ready" && (
        <>
          <div className="network-stats">
            {statCards.map((s) => (
              <div className="network-stat-card" key={s.label}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
                <small className="network-ref">Reference: {s.ref}</small>
              </div>
            ))}
          </div>

          <div className="network-panel">
            <div className="network-toolbar">
              <div>
                <h3>Protein–Protein Interaction Network</h3>
                <p>
                  Node size = degree · thick outline = top {TOP_HUBS} hub genes
                  · hover or click a gene to highlight its neighbours.
                </p>
              </div>
              <div className="network-controls">
                <label className="network-check">
                  <input
                    type="checkbox"
                    checked={showIsolated}
                    onChange={(e) => setShowIsolated(e.target.checked)}
                  />
                  Show isolated genes ({analysis.isolated.length})
                </label>
                {selected && (
                  <button
                    className="network-btn network-btn-primary"
                    onClick={() => setSelected(null)}
                  >
                    Show full network
                  </button>
                )}
                <button
                  className="network-btn"
                  onClick={() => graphRef.current?.zoomToFit(400, 40)}
                >
                  Fit view
                </button>
              </div>
            </div>

            <div className="network-canvas" ref={wrapRef}>
              <ForceGraph2D
                ref={graphRef}
                width={width}
                height={520}
                graphData={graphData}
                backgroundColor="#f8f3ea"
                nodeCanvasObject={drawNode}
                nodePointerAreaPaint={(node, color, ctx) => {
                  ctx.fillStyle = color;
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 4 + Math.sqrt(node.degree) * 1.8 + 2, 0, 2 * Math.PI);
                  ctx.fill();
                }}
                linkColor={(l) => {
                  const s = l.source.id ?? l.source;
                  const t = l.target.id ?? l.target;
                  if (!active) return "rgba(120,98,75,0.35)";
                  return s === active || t === active
                    ? "rgba(96,75,56,0.85)"
                    : "rgba(120,98,75,0.06)";
                }}
                linkWidth={(l) => 0.5 + (l.score - 0.7) * 6}
                onNodeHover={(n) => setHovered(n ? n.id : null)}
                onNodeClick={(n) => setSelected((s) => (s === n.id ? null : n.id))}
                onBackgroundClick={() => setSelected(null)}
                cooldownTicks={120}
                onEngineStop={() => graphRef.current?.zoomToFit(300, 40)}
              />
            </div>

            <div className="network-legend">
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                <span key={cat}>
                  <i style={{ background: color }} />
                  {cat}
                </span>
              ))}
            </div>

            {selectedInfo && (
              <div className="network-selected">
                <div className="network-selected-head">
                  <span>
                    <strong>{selectedInfo.gene}</strong> — {selectedInfo.name}
                  </span>
                  <button
                    className="network-btn"
                    onClick={() => setSelected(null)}
                  >
                    ← Back to full network
                  </button>
                </div>
                <span>
                  {selectedInfo.category} · degree {analysis.degree.get(selected)} ·
                  MCC {analysis.mcc.get(selected)} ·{" "}
                  {selectedInfo.docked ? "docked" : "not docked"}
                </span>
                <span>
                  Interacts with:{" "}
                  {[...analysis.adj.get(selected)].sort().join(", ") || "none"}
                </span>
              </div>
            )}
          </div>

          <div className="network-panel">
            <h3>Hub Genes</h3>
            <p>
              Top {TOP_HUBS} genes by Maximal Clique Centrality (MCC, the
              cytoHubba method).
            </p>

            <div className="hub-gene-list">
              {analysis.ranking.slice(0, TOP_HUBS).map((gene, i) => (
                <div
                  className={`hub-gene${selected === gene ? " hub-gene-active" : ""}`}
                  key={gene}
                  onClick={() => setSelected((s) => (s === gene ? null : gene))}
                  style={{ cursor: "pointer" }}
                >
                  <span className="hub-rank">{i + 1}</span>
                  <strong>{gene}</strong>
                  <small>
                    MCC {analysis.mcc.get(gene)} · deg {analysis.degree.get(gene)}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="network-note">
        <strong>Network methodology</strong>
        <p>
          Interactions are queried from STRING (Homo sapiens, taxon 9606) for
          the {GENES.length} target genes and filtered by combined score
          (≥ 0.70, high confidence). Average node degree and clustering
          coefficient are computed over connected nodes; hub genes are ranked
          by MCC (sum of (|C|−1)! over maximal cliques C containing the gene),
          matching cytoHubba. The reference study used STRING 12.0 with
          Cytoscape and cytoHubba.
        </p>
      </div>
    </div>
  );
}
