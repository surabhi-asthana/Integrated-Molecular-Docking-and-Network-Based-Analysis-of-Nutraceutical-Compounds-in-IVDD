import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function Header() {
  const [userName] = useState(
    () => sessionStorage.getItem("userName") || "Researcher"
  );

  const [userRole] = useState(
    () => sessionStorage.getItem("userRole") || "Researcher"
  );

  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="header">
      <div>
        <p className="header-subtitle">MOLECULAR RESEARCH</p>
        <h2>IVDD Research Workspace</h2>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <Search size={17} />
          <input placeholder="Search compounds, proteins..." />
        </div>

        <button className="icon-button">
          <Bell size={19} />
        </button>
<button className="profile-button">
  <span className="profile-avatar">{initial}</span>

  <div className="profile-info">
    <strong>{userName}</strong>
    <small>{userRole}</small>
  </div>

  <ChevronDown size={15} />
</button>
      </div>
    </header>
  );
}