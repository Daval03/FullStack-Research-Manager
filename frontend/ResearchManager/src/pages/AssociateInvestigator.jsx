import { useState } from "react";
import { investigators, projects, invProjRelations as initialRelations } from "../mockData";

export default function AssociateInvestigator() {
  const [relations, setRelations] = useState(initialRelations);
  const [selectedInv,   setSelectedInv]   = useState(null);
  const [selectedProjs, setSelectedProjs] = useState([]);
  const [invSearch,  setInvSearch]  = useState("");
  const [projSearch, setProjSearch] = useState("");
  const [message, setMessage] = useState(null);

  function toggleProject(id) {
    setSelectedProjs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleAssociate() {
    if (!selectedInv || selectedProjs.length === 0) return;
    const existing  = relations.filter(r => r.invId === selectedInv.id).map(r => r.projId);
    const newLinks  = selectedProjs.filter(pid => !existing.includes(pid));
    const already   = selectedProjs.filter(pid =>  existing.includes(pid));

    if (newLinks.length === 0) {
      setMessage({ type: "warning", text: "This investigator is already linked to all selected projects." });
      return;
    }

    setRelations(prev => [...prev, ...newLinks.map(pid => ({ invId: selectedInv.id, projId: pid }))]);
    setMessage({
      type: "success",
      text: `Linked ${selectedInv.fullName} to ${newLinks.length} project(s).${already.length ? ` (${already.length} already existed)` : ""}`,
    });
    setSelectedProjs([]);
  }

  const filteredInvs  = investigators.filter(i => i.fullName.toLowerCase().includes(invSearch.toLowerCase()));
  const filteredProjs = projects.filter(p => p.title.toLowerCase().includes(projSearch.toLowerCase()));
  const initials      = (name = "") => name.split(" ").slice(0, 2).map(w => w[0]?.toUpperCase()).join("");

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Link <span>Investigator</span></h1>
        <p className="page-subtitle">Associate a researcher with one or more projects</p>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Step 1 */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Step 1 — Select Investigator</div>
            {selectedInv && <span className="badge badge-green">Selected</span>}
          </div>

          <div className="search-bar" style={{ marginBottom: 12 }}>
            <span className="search-icon" style={{ fontSize: 13 }}>⌕</span>
            <input className="form-input" placeholder="Search investigator…" value={invSearch} onChange={e => setInvSearch(e.target.value)} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 340, overflowY: "auto" }}>
            {filteredInvs.map(inv => {
              const isActive = selectedInv?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => { setSelectedInv(inv); setSelectedProjs([]); setMessage(null); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: "var(--radius)",
                    border: `1px solid ${isActive ? "rgba(245,166,35,0.4)" : "var(--border)"}`,
                    background: isActive ? "var(--amber-glow)" : "var(--bg-base)",
                    cursor: "pointer", transition: "all 0.12s",
                  }}
                >
                  <div className="avatar" style={{ width: 34, height: 34, fontSize: 13, borderRadius: 8 }}>
                    {initials(inv.fullName)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: isActive ? "var(--amber)" : "var(--text-primary)", fontWeight: 500 }}>{inv.fullName}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{inv.institution}</div>
                  </div>
                  {isActive && <span style={{ color: "var(--amber)" }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2 */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Step 2 — Select Projects</div>
            {selectedProjs.length > 0 && <span className="badge badge-amber">{selectedProjs.length} selected</span>}
          </div>

          {!selectedInv ? (
            <div className="alert alert-info">Select an investigator first.</div>
          ) : (
            <>
              <div className="search-bar" style={{ marginBottom: 12 }}>
                <span className="search-icon" style={{ fontSize: 13 }}>⌕</span>
                <input className="form-input" placeholder="Search project…" value={projSearch} onChange={e => setProjSearch(e.target.value)} />
              </div>
              <div className="checkbox-list">
                {filteredProjs.map(p => {
                  const checked   = selectedProjs.includes(p.id);
                  const linked    = relations.some(r => r.invId === selectedInv.id && r.projId === p.id);
                  return (
                    <div
                      key={p.id}
                      className={`checkbox-item${checked ? " checked" : ""}`}
                      onClick={() => toggleProject(p.id)}
                    >
                      <div className="checkbox-box"><span className="checkbox-checkmark">✓</span></div>
                      <div style={{ flex: 1 }}>
                        <div className="checkbox-label">{p.title}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                          {p.knowledgeArea}
                          {linked && <span style={{ color: "var(--green)", marginLeft: 8 }}>● already linked</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedInv && selectedProjs.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Association Summary</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar" style={{ width: 36, height: 36, fontSize: 14, borderRadius: 9 }}>
                {selectedInv.fullName.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("")}
              </div>
              <span style={{ color: "var(--amber)", fontWeight: 600 }}>{selectedInv.fullName}</span>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: 20 }}>⇢</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {selectedProjs.map(pid => {
                const p = projects.find(x => x.id === pid);
                return <span key={pid} className="badge badge-teal">{p?.title || pid}</span>;
              })}
            </div>
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