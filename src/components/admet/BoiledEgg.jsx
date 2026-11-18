import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
} from "recharts";

import compounds from "../../data/compounds";

export default function BoiledEgg({ compound }) {
  if (!compound) return null;

  const data = compounds.map((item) => ({
    name: item.name,
    wlogp: item.lipophilicity.WLOGP,
    tpsa: item.physicochemical.tpsa,
    gi: item.pharmacokinetics.giAbsorption,
    bbb: item.pharmacokinetics.bbbPermeant,
    selected: item.id === compound.id,
  }));

  const selected = data.find((item) => item.selected);

  return (
    <div className="admet-chart-card">
      <div className="admet-chart-heading">
        <h3>BOILED-Egg Property Map</h3>
        <p>WLOGP versus TPSA for the five nutraceutical compounds</p>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ScatterChart margin={{ top: 20, right: 25, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            dataKey="wlogp"
            name="WLOGP"
            domain={[-1, 5]}
            label={{
              value: "WLOGP",
              position: "insideBottom",
              offset: -10,
            }}
          />

          <YAxis
            type="number"
            dataKey="tpsa"
            name="TPSA"
            domain={[0, 150]}
            label={{
              value: "TPSA (Å²)",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <ZAxis range={[100, 180]} />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;

              const item = payload[0].payload;

              return (
                <div className="chart-tooltip">
                  <strong>{item.name}</strong>
                  <p>WLOGP: {item.wlogp}</p>
                  <p>TPSA: {item.tpsa} Å²</p>
                  <p>GI absorption: {item.gi}</p>
                  <p>BBB permeant: {item.bbb ? "Yes" : "No"}</p>
                </div>
              );
            }}
          />

          <Scatter
            name="Other compounds"
            data={data.filter((item) => !item.selected)}
            fill="#C3A783"
          />

          <Scatter
            name="Selected compound"
            data={selected ? [selected] : []}
            fill="#806044"
            shape="star"
          />
        </ScatterChart>
      </ResponsiveContainer>

      <div className="boiled-egg-summary">
        <div>
          <span>GI Absorption</span>
          <strong>{compound.pharmacokinetics.giAbsorption}</strong>
        </div>

        <div>
          <span>BBB Permeant</span>
          <strong>
            {compound.pharmacokinetics.bbbPermeant ? "Yes" : "No"}
          </strong>
        </div>
      </div>

      <p className="chart-note">
        Points show SwissADME WLOGP and TPSA values. GI absorption and BBB
        predictions are displayed separately from the coordinates.
        This is not an exact reproduction of the SwissADME BOILED-Egg
        classifier or its probability regions.
      </p>
    </div>
  );
}