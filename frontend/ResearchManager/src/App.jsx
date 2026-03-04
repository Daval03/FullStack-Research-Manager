import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Investigators from "./pages/Investigators";
import Projects from "./pages/Projects";
import Publications from "./pages/Publications";
import AssociateInvestigator from "./pages/AssociateInvestigator";
import AssociatePublication from "./pages/AssociatePublication";
import Queries from "./pages/Queries";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/investigators" element={<Investigators />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/associate-investigator" element={<AssociateInvestigator />} />
              <Route path="/associate-publication" element={<AssociatePublication />} />
              <Route path="/queries" element={<Queries />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}