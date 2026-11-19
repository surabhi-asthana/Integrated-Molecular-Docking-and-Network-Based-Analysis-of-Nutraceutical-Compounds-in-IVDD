

export default function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={21} />
        </div>
      </div>

      <h2>{value}</h2>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}