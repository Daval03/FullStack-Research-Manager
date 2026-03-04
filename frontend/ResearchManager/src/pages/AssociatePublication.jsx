import { useState } from "react";
import { publications, projects, pubProjRelations as initialRelations } from "../mockData";

export default function AssociatePublication() {
  const [relations,    setRelations]    = useState(initialRelations);
  const [selectedPub,  setSelectedPub]  = useState(null);
  const [selectedProj, setSelectedProj] = useState(null);
  const [pubSearch,    setPubSearch]    = useState("");
  const [projSearch,   setProjSearch]   = useState("");
  const [message, setMessage] = useState(null);

  function handleAssociate() {
    if (!selectedPub || !selectedProj) return;
    const alreadyLinked = relations.find(r => r.pubId === selectedPub.id);
    if (alreadyLinked) {
      const prevProj = projects.find(p => p.id === alreadyLinked.projId);
      setMessage({ type: "error", text: `This publication is already linked to "${prevProj?.title || alreadyLinked.projId}".` });
      return;
    }
    setRelations(prev => [...prev, { projId: selectedProj.id, pubId: selectedPub.id }]);
    setMessage({ type: "success", text: `"${selectedPub.title}" linked to "${selectedProj.title}".` });
    setSelectedPub(null);
    setSelectedProj(null);
  }

  const filteredPubs  = publications.filter(p => p.title.toLowerCase().includes(pubSearch.toLowerCase()));
  const filteredProjs = projects.filter(p => p.title.toLowerCase().includes(projSearch.toLowerCase()));

  const getPubProject = (pubId) => {
    const rel = relations.find(r => r.pubId === pubId);
    return rel ? projects.find(p => p.id === rel.projId) : null;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Link <span>Publication</span></h1>
        <p className="page-subtitle">Attach an article to its research project</p>
      </div>

      <div className="alert alert-info" style={{ maxWidth: 600 }}>
        ℹ Each publication can only be linked to one project.
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Publications */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Step 1 — Select Publication</div>
            {selectedPub && <span className="badge badge-green">Selected</span>}
          </div>

          <div className="search-bar" style={{ marginBottom: 12 }}>
            <span className="search-icon" style={{ fontSize: 13 }}>⌕</span>
            <input className="form-input" placeholder="Search article…" value={pubSearch} onChange={e => setPubSearch(e.target.value)} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}>
            {filteredPubs.map(pub => {
              const isActive    = selectedPub?.id === pub.id;
              const linkedProj  = getPubProject(pub.id);
              return (
                <div
                  key={pub.id}
                  onClick={() => { setSelectedPub(pub); setSelectedProj(null); setMessage(null); }}
                  style={{
                    padding: "10px 12px", borderRadius: "var(--radius)",
                    border: `1px solid ${isActive ? "rgba(245,166,35,0.4)" : "var(--border)"}`,
                    background: isActive ? "var(--amber-glow)" : "var(--bg-base)",
                    cursor: "pointer", transition: "all 0.12s",
                  }}
                >
                  <div style={{ fontSize: 14, color: isActive ? "var(--amber)" : "var(--text-primary)", fontWeight: 500 }}>{pub.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {pub.journal} · {pub.year}
                    {linkedProj && <span style={{ color: "var(--rose)", marginLeft: 8 }}>● linked to {linkedProj.title.slice(0, 28)}…</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Step 2 — Select Project</div>
            {selectedProj && <span className="badge badge-green">Selected</span>}
          </div>

          {!selectedPub ? (
            <div className="alert alert-info">Select a publication first.</div>
          ) : (
            <>
              <div className="search-bar" style={{ marginBottom: 12 }}>
                <span className="search-icon" style={{ fontSize: 13 }}>⌕</span>
                <input className="form-input" placeholder="Search project…" value={projSearch} onChange={e => setProjSearch(e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 360, overflowY: "auto" }}>
                {filteredProjs.map(p => {
                  const isActive = selectedProj?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => { setSelectedProj(p); setMessage(null); }}
                      style={{
                        padding: "10px 12px", borderRadius: "var(--radius)",
                        border: `1px solid ${isActive ? "rgba(56,189,248,0.4)" : "var(--border)"}`,
                        background: isActive ? "var(--teal-glow)" : "var(--bg-base)",
                        cursor: "pointer", transition: "all 0.12s",
                      }}
                    >
                      <div style={{ fontSize: 14, color: isActive ? "var(--teal)" : "var(--text-primary)", fontWeight: 500 }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{p.knowledgeArea} · {p.startYear}</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedPub && selectedProj && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Association Summary</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <span className="badge badge-teal" style={{ fontSize: 13, padding: "6px 14px" }}>◎ {selectedPub.title}</span>
            <span style={{ color: "var(--text-muted)", fontSize: 20 }}>⇢</span>
            <span className="badge badge-amber" style={{ fontSize: 13, padding: "6px 14px" }}>◉ {selectedProj.title}</span>
          </div>
          <div className="divider" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn btn-primary btn-lg" onClick={handleAssociate}>Confirm Association</button>
          </div>
        </div>
      )}
    </div>
  );
}