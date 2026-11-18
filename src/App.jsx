import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Compounds from "./pages/Compounds";
import Docking from "./pages/Docking";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CompoundProfile from "./pages/CompoundProfile";
import "./App.css";
function Placeholder({ title }) {
  return (
    <div className="panel">
      <h2>{title}</h2>
      <p>This research module is under development.</p>
    </div>
  );
}

// Layout used only after login
function DashboardLayout() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page - completely separate from dashboard */}
        <Route path="/" element={<Login />} />

        {/* Dashboard layout - appears only after login */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docking" element={<Docking />} />
        <Route
        path="/compounds/:compoundId"
        element={<CompoundProfile />}
/>
<Route path="/compounds" element={<Compounds />} />
          <Route
            path="/targets"
            element={<Placeholder title="Protein Targets" />}
          />

          <Route
            path="/results"
            element={<Placeholder title="Docking Results" />}
          />

          <Route
            path="/interpretation"
            element={<Placeholder title="AI Interpretation" />}
          />

          <Route
            path="/network"
            element={<Placeholder title="Network Analysis" />}
          />

          <Route
            path="/settings"
            element={<Placeholder title="Settings" />}
          />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}