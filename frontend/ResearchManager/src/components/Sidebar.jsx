import { NavLink, useLocation } from "react-router-dom";

const navSections = [
  {
    label: "Overview",
    items: [
      { path: "/", label: "Dashboard", icon: "⬡" },
    ],
  },
  {
    label: "Data",
    items: [
      { path: "/investigators", label: "Investigators", icon: "◈" },
      { path: "/projects",      label: "Projects",      icon: "◉" },
      { path: "/publications",  label: "Publications",  icon: "◎" },
    ],
  },
  {
    label: "Relations",
    items: [
      { path: "/associate-investigator", label: "Link Investigator", icon: "⇢" },
      { path: "/associate-publication",  label: "Link Publication",  icon: "⇢" },
    ],
  },
  {
    label: "Analysis",
    items: [
      { path: "/queries", label: "Queries", icon: "⟡" },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">ResearchGraph</span>
        <span className="logo-sub">.Net · Postgres</span>
      </div>

      <nav style={{ flex: 1 }}>
        {navSections.map((section) => (
          <div className="sidebar-section" key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `nav-item${isActive ? " active" : ""}`
                }
              >
                <span className="nav-icon" style={{ fontStyle: "normal" }}>
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="db-status">
          <span className="db-dot" />
          postgres://localhost:7687
        </div>
      </div>
    </aside>
  );
}