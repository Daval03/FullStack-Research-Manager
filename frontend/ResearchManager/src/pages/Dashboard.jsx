import { Link } from "react-router-dom";
import { investigators, projects, publications, invProjRelations, pubProjRelations } from "../mockData";

export default function Dashboard() {
  const statItems = [
    { label: "Investigators", value: investigators.length, path: "/investigators" },
    { label: "Projects",      value: projects.length,      path: "/projects" },
    { label: "Publications",  value: publications.length,  path: "/publications" },
    { label: "Relations",     value: invProjRelations.length + pubProjRelations.length, path: null },
  ];

  const shortcuts = [
    { path: "/investigators",          label: "Manage Investigators", desc: "Add or edit researcher profiles" },
    { path: "/projects",               label: "Manage Projects",      desc: "Add or edit research projects" },
    { path: "/publications",           label: "Manage Publications",  desc: "Add or edit articles" },
    { path: "/associate-investigator", label: "Link Investigator",    desc: "Attach researchers to projects" },
    { path: "/associate-publication",  label: "Link Publication",     desc: "Attach articles to projects" },
    { path: "/queries",                label: "Run Queries",          desc: "Analytics & search" },
  ];

  const areaCounts = {};
  projects.forEach(p => { areaCounts[p.knowledgeArea] = (areaCounts[p.knowledgeArea] || 0) + 1; });
  const topAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const maxArea  = topAreas[0]?.[1] || 1;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Research <span>Graph</span></h1>
        <p className="page-subtitle">Neo4j knowledge graph · researcher collaboration explorer</p>
      </div>

      <div className="stats-grid">
        {statItems.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {s.path && (
              <div className="stat-meta">
                <Link to={s.path} style={{ color: "var(--amber)", textDecoration: "none", fontSize: 12 }}>View all →</Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Top Knowledge Areas</div>
            <Link to="/queries" style={{ fontSize: 12, color: "var(--amber)", textDecoration: "none" }}>See all →</Link>
          </div>
          <div className="rank-list">
            {topAreas.map(([area, count], i) => (
              <div className="rank-item" key={area}>
                <div className="rank-number">{i + 1}</div>
                <div className="rank-info">
                  <div className="rank-name">{area}</div>
                  <div style={{ marginTop: 6, width: "100%" }}>
                    <div className="rank-bar">
                      <div className="rank-bar-fill" style={{ width: `${(count / maxArea) * 100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="rank-count">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Quick Access</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shortcuts.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "11px 14px", background: "var(--bg-surface)",
                  border: "1px solid var(--border)", borderRadius: "var(--radius)",
                  textDecoration: "none", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.background = "var(--bg-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-surface)"; }}
              >
                <div>
                  <div style={{ fontSize: 14, color: "var(--text-primary)", fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{s.desc}</div>
                </div>
                <span style={{ color: "var(--amber)", fontSize: 16 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}