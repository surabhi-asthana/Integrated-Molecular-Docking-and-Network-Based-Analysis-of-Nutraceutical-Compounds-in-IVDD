import { useEffect, useRef, useState } from "react";
import * as $3Dmol from "3dmol";

// Load a PDB file; fail loudly if the file is missing (Vite would otherwise
// serve index.html with status 200 and the viewer would silently break).
async function loadPdb(url) {
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok || text.trimStart().startsWith("<")) {
    throw new Error(`Could not load ${url}`);
  }
  return text;
}

function DockingViewer({ protein, compound }) {
  const boxRef = useRef(null);
  const viewerRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError("");

    const box = boxRef.current;
    box.innerHTML = ""; // avoid two canvases if React mounts twice in dev
    const viewer = $3Dmol.createViewer(box, { backgroundColor: "white" });
    viewerRef.current = viewer;

    (async () => {
      try {
        const [proteinPdb, ligandPdb] = await Promise.all([
          loadPdb(`/structures/${protein}/protein.pdb`),
          loadPdb(`/structures/${protein}/${compound}.pdb`),
        ]);
        if (cancelled) return;

        viewer.addModel(proteinPdb, "pdb");
        viewer.setStyle({ model: 0 }, { cartoon: { color: "spectrum" } });

        viewer.addModel(ligandPdb, "pdb");
        viewer.setStyle(
          { model: 1 },
          { stick: { colorscheme: "greenCarbon", radius: 0.35 } }
        );

        // Start with the WHOLE protein in view
        viewer.zoomTo({ model: 0 });
        viewer.render();

        // That starting view is also the maximum zoom-out.
        // (first number = how close you may zoom in, second = how far out)
        const startDistance = viewer.getPerceivedDistance();
        viewer.setZoomLimits(5, startDistance * 1.02);
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    })();

    return () => {
      cancelled = true;
      viewer.clear();
    };
  }, [protein, compound]);

  const resetView = () => {
    const v = viewerRef.current;
    if (!v) return;
    v.zoomTo({ model: 0 });
    v.render();
  };

  return (
    <div>
      <div
        ref={boxRef}
        style={{ width: "100%", height: "450px", position: "relative" }}
      />
      {error ? (
        <p style={{ color: "crimson" }}>{error}</p>
      ) : (
        <button
          type="button"
          onClick={resetView}
          className="reset-view-button"
        >
          Reset view
        </button>
      )}
    </div>
  );
}

export default DockingViewer;