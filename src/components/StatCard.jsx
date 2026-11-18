import { ArrowUpRight } from "lucide-react";

export default function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={21} />
        </div>
        <ArrowUpRight size={18} className="muted-icon" />
      </div>

      <h2>{value}</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}