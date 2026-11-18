import {
  LayoutDashboard,
  FlaskConical,
  Dna,
  Workflow,
  ChartNoAxesCombined,
  BrainCircuit,
  Network,
  Settings,
  Microscope
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Compounds", path: "/compounds", icon: FlaskConical },
  { name: "Protein Targets", path: "/targets", icon: Dna },
  { name: "Docking Workspace", path: "/docking", icon: Workflow },
  { name: "Docking Results", path: "/results", icon: ChartNoAxesCombined },
  { name: "AI Interpretation", path: "/interpretation", icon: BrainCircuit },
  { name: "Network Analysis", path: "/network", icon: Network }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Microscope size={24} />
        </div>
        <div>
          <h2>DiscNet</h2>
          <p>Research Platform</p>
        </div>
      </div>

      <p className="menu-label">WORKSPACE</p>

      <nav className="sidebar-menu">
        {menuItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Icon size={19} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <div className="sidebar-note">
          <p>Research workspace</p>
          <span>Integrated Molecular Docking</span>
        </div>
      </div>
    </aside>
  );
}