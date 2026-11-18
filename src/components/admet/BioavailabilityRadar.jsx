import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Convert different property units into a common 0–100 display scale.
function normalize(value, min, max) {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

export default function BioavailabilityRadar({ compound }) {
  if (!compound) {
    return <p>Select a compound to view its radar chart.</p>;
  }

  const data = [
    {
      property: "Lipophilicity",
      value: normalize(compound.lipophilicity.XLOGP3, -0.7, 5),
      actual: compound.lipophilicity.XLOGP3,
      unit: "XLOGP3",
    },
    {
      property: "Size",
      value: normalize(compound.molecularWeight, 150, 500),
      actual: compound.molecularWeight,
      unit: "g/mol",
    },
    {
      property: "Polarity",
      value: normalize(compound.physicochemical.tpsa, 20, 130),
      actual: compound.physicochemical.tpsa,
      unit: "Å²",
    },
    {
      property: "Solubility",
      value: normalize(compound.solubility.ESOL.logS, -6, 0),
      actual: compound.solubility.ESOL.logS,
      unit: "LogS",
    },
    {
      property: "Saturation",
      value: normalize(compound.physicochemical.fractionCsp3, 0, 1),
      actual: compound.physicochemical.fractionCsp3,
      unit: "Fraction Csp3",
    },
    {
      property: "Flexibility",
      value: normalize(compound.physicochemical.rotatableBonds, 0, 9),
      actual: compound.physicochemical.rotatableBonds,
      unit: "Rotatable bonds",
    },
  ];

  return (
    <div className="admet-chart-card">
      <div className="admet-chart-heading">
        <h3>Bioavailability Radar</h3>
        <p>Physicochemical property profile of {compound.name}</p>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid />

          <PolarAngleAxis
            dataKey="property"
            tick={{ fill: "#493B30", fontSize: 12 }}
          />

          <PolarRadiusAxis
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          <Radar
            name={compound.name}
            dataKey="value"
            stroke="#AD9273"
            fill="#C3A783"
            fillOpacity={0.4}
            strokeWidth={2}
          />

          <Tooltip
            formatter={(value, name, props) => [
              `${props.payload.actual} ${props.payload.unit}`,
              props.payload.property,
            ]}
          />
        </RadarChart>
      </ResponsiveContainer>

      <p className="chart-note">
        Values are normalized for visualization. They do not represent
        experimental measurements or a validated bioavailability score.
      </p>
    </div>
  );
}