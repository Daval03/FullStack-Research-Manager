import { useLocation } from "react-router-dom";

const routeMap = {
  "/":                       { label: "Dashboard",         parent: null },
  "/investigators":          { label: "Investigators",     parent: "Data" },
  "/projects":               { label: "Projects",          parent: "Data" },
  "/publications":           { label: "Publications",      parent: "Data" },
  "/associate-investigator": { label: "Link Investigator", parent: "Relations" },
  "/associate-publication":  { label: "Link Publication",  parent: "Relations" },
  "/queries":                { label: "Queries",           parent: "Analysis" },
};

export default function Header() {
  const location = useLocation();
  const route = routeMap[location.pathname] || { label: "Page", parent: null };

  const now = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric"
  });

  return (
    <header className="header">
      <div className="header-breadcrumb">
        <span>ResearchGraph</span>
        {route.parent && (
          <>
            <span style={{ opacity: 0.4 }}>›</span>
            <span>{route.parent}</span>
          </>
        )}
        <span style={{ opacity: 0.4 }}>›</span>
        <span className="current">{route.label}</span>
      </div>

      <div className="header-actions">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-muted)",
          }}
        >
          {now}
        </span>
      </div>
    </header>
  );
}