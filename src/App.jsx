import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import Compounds from "./pages/Compounds";
import Docking from "./pages/Docking";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Pathways from "./pages/Pathways";
import Targets from "./pages/Targets";
import Interpretation from "./pages/Interpretation";
import Network from "./pages/Network";
import CompoundProfile from "./pages/CompoundProfile";
import "./App.css";
import FloatingAI from "./components/FloatingAI";

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
  const location = useLocation();

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Header />

        <div className="page-content">
          <Outlet />
        </div>
      </main>

      {location.pathname !== "/interpretation" && <FloatingAI />}
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
          <Route path="/targets" element={<Targets />} />
          <Route path="/pathways" element={<Pathways />} />
          <Route
            path="/results"
            element={<Placeholder title="Docking Results" />}
          />

          <Route path="/interpretation" element={<Interpretation />} />

                    <Route path="/network" element={<Network/>} />

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