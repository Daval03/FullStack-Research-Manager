import { useState } from "react";
import {
  investigators, projects, publications,
  getTopAreas, getTopInstitutions, getTopInvestigators,
  getInvestigatorWithProjects, getProjectDetails,
  getPublicationWithProject, getAreaDetails, getColleagues,
  uniqueAreas,
} from "../mockData";

const QUERY_TABS = [
  { id: "top-areas", label: "Top 5 Areas" },
  { id: "top-inst",  label: "Top 5 Institutions" },
  { id: "top-inv",   label: "Top 5 Investigators" },
  { id: "search-inv",  label: "Find Investigator" },
  { id: "search-proj", label: "Find Project" },
  { id: "search-pub",  label: "Find Publications" },
  { id: "search-area", label: "By Area" },
  { id: "colleagues",  label: "Colleagues" },
];

function RankList({ items, nameKey, metaKey, countKey }) {
  const maxCount = Math.max(...items.map(x => x[countKey] || 0), 1);
  if (!items.length) return <div className="empty-state" style={{ padding: "30px 10px" }}><p>No data.</p></div>;
  return (
    <div className="rank-list">
      {items.map((item, i) => (
        <div className="rank-item" key={i}>
          <div className="rank-number">{i + 1}</div>
          <div className="rank-info">
            <div className="rank-name">{item[nameKey] || "—"}</div>
            {metaKey && <div className="rank-meta">{item[metaKey]}</div>}
            <div style={{ marginTop: 6 }}>
              <div className="rank-bar">
                <div className="rank-bar-fill" style={{ width: `${(item[countKey] / maxCount) * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="rank-count">{item[countKey]}</div>
        </div>
      ))}
    </div>
  );
}

function InvestigatorDetail({ data }) {
  if (!data) return null;
  const initials = (n = "") => n.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("");
  return (
    <div className="detail-card">
      <div className="detail-card-top">
        <div className="avatar">{initials(data.fullName)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{data.fullName}</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{data.institution}</div>
        </div>
        <span className="badge badge-teal">{data.academicTitle}</span>
      </div>
      <div className="detail-card-body">
        <div className="detail-grid" style={{ marginBottom: 20 }}>
          <div className="detail-field">
            <span className="detail-field-label">Email</span>
            <span className="detail-field-value" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{data.email}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Institution</span>
            <span className="detail-field-value">{data.institution}</span>
          </div>
        </div>
        {data.projects?.length > 0 && (
          <>
            <div className="section-heading">Projects ({data.projects.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.projects.map((p, i) => (
                <div key={i} style={{ padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {p.knowledgeArea} · {p.startYear}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProjectDetail({ data }) {
  if (!data) return null;
  const initials = (n = "") => n.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("");
  return (
    <div className="detail-card">
      <div className="detail-card-top">
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{data.title}</div>
          <span className="badge badge-amber" style={{ marginTop: 8, display: "inline-flex" }}>{data.knowledgeArea}</span>
        </div>
      </div>
      <div className="detail-card-body">
        <div className="detail-grid" style={{ marginBottom: 20 }}>
          <div className="detail-field">
            <span className="detail-field-label">Start Year</span>
            <span className="detail-field-value">{data.startYear}</span>
          </div>
          <div className="detail-field">
            <span className="detail-field-label">Duration</span>
            <span className="detail-field-value">{data.durationMonths} months</span>
          </div>
        </div>
        {data.investigators?.length > 0 && (
          <>
            <div className="section-heading">Investigators ({data.investigators.length})</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {data.investigators.map((inv, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                  <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, borderRadius: 6 }}>{initials(inv.fullName)}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{inv.fullName}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{inv.institution}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {data.publications?.length > 0 && (
          <>
            <div className="section-heading">Publications ({data.publications.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {data.publications.map((pub, i) => (
                <div key={i} style={{ padding: "10px 14px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{pub.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {pub.journal} · {pub.year}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Queries() {
  const [activeTab, setActiveTab] = useState("top-areas");

  // Selections
  const [selInv,       setSelInv]       = useState("");
  const [selProj,      setSelProj]      = useState("");
  const [selPubs,      setSelPubs]      = useState([]);
  const [selArea,      setSelArea]      = useState("");
  const [selColleague, setSelColleague] = useState("");

  // Results (computed on demand)
  const [invResult,     setInvResult]     = useState(null);
  const [projResult,    setProjResult]    = useState(null);
  const [pubResults,    setPubResults]    = useState([]);
  const [areaResult,    setAreaResult]    = useState(null);
  const [colleagueResult, setColleagueResult] = useState(null);

  const topAreas = getTopAreas();
  const topInst  = getTopInstitutions();
  const topInv   = getTopInvestigators();

  function togglePub(id) {
    setSelPubs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setPubResults([]);
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Graph <span>Queries</span></h1>
        <p className="page-subtitle">Analytics and search across the research graph</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 28, flexWrap: "wrap", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 4, width: "fit-content" }}>
        {QUERY_TABS.map(t => (
          <button key={t.id} className={`tab-btn${activeTab === t.id ? " active" : ""}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TOP 5 AREAS ── */}
      {activeTab === "top-areas" && (
        <div className="card" style={{ maxWidth: 620 }}>
          <div className="card-header"><div className="card-title"><span className="dot" /> Top 5 Knowledge Areas</div></div>
          <RankList items={topAreas} nameKey="area" countKey="count" />
        </div>
      )}

      {/* ── TOP 5 INSTITUTIONS ── */}
      {activeTab === "top-inst" && (
        <div className="card" style={{ maxWidth: 620 }}>
          <div className="card-header"><div className="card-title"><span className="dot" /> Top 5 Institutions</div></div>
          <RankList items={topInst} nameKey="institution" countKey="count" />
        </div>
      )}

      {/* ── TOP 5 INVESTIGATORS ── */}
      {activeTab === "top-inv" && (
        <div className="card" style={{ maxWidth: 620 }}>
          <div className="card-header"><div className="card-title"><span className="dot" /> Top 5 Investigators</div></div>
          <RankList items={topInv} nameKey="fullName" metaKey="institution" countKey="count" />
        </div>
      )}

      {/* ── FIND INVESTIGATOR ── */}
      {activeTab === "search-inv" && (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
          <div className="card">
            <div className="card-header"><div className="card-title"><span className="dot" /> Select Investigator</div></div>
            <div className="form-group">
              <label className="form-label">Investigator</label>
              <select className="form-select" value={selInv} onChange={e => { setSelInv(e.target.value); setInvResult(null); }}>
                <option value="">Choose…</option>
                {investigators.map(i => <option key={i.id} value={i.id}>{i.fullName}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setInvResult(getInvestigatorWithProjects(Number(selInv)))} disabled={!selInv}>
                Search
              </button>
            </div>
          </div>
          <div>
            {invResult
              ? <InvestigatorDetail data={invResult} />
              : <div className="empty-state"><div className="empty-icon">◈</div><p>Select an investigator to view their profile.</p></div>}
          </div>
        </div>
      )}

      {/* ── FIND PROJECT ── */}
      {activeTab === "search-proj" && (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
          <div className="card">
            <div className="card-header"><div className="card-title"><span className="dot" /> Select Project</div></div>
            <div className="form-group">
              <label className="form-label">Project</label>
              <select className="form-select" value={selProj} onChange={e => { setSelProj(e.target.value); setProjResult(null); }}>
                <option value="">Choose…</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setProjResult(getProjectDetails(Number(selProj)))} disabled={!selProj}>
                Search
              </button>
            </div>
          </div>
          <div>
            {projResult
              ? <ProjectDetail data={projResult} />
              : <div className="empty-state"><div className="empty-icon">◉</div><p>Select a project to see full details.</p></div>}
          </div>
        </div>
      )}

      {/* ── FIND PUBLICATIONS ── */}
      {activeTab === "search-pub" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="card">
            <div className="card-header">
              <div className="card-title"><span className="dot" /> Select Publications</div>
              {selPubs.length > 0 && <span className="badge badge-amber">{selPubs.length} selected</span>}
            </div>
            <div className="checkbox-list" style={{ maxHeight: 380 }}>
              {publications.map(pub => {
                const checked = selPubs.includes(pub.id);
                return (
                  <div key={pub.id} className={`checkbox-item${checked ? " checked" : ""}`} onClick={() => togglePub(pub.id)}>
                    <div className="checkbox-box"><span className="checkbox-checkmark">✓</span></div>
                    <div style={{ flex: 1 }}>
                      <div className="checkbox-label">{pub.title}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{pub.journal} · {pub.year}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 14 }}>
              <button
                className="btn btn-primary" style={{ width: "100%" }}
                disabled={selPubs.length === 0}
                onClick={() => setPubResults(selPubs.map(id => getPublicationWithProject(id)))}
              >
                View {selPubs.length || ""} Publication(s)
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pubResults.length === 0
              ? <div className="empty-state"><div className="empty-icon">◎</div><p>Select publications and click View.</p></div>
              : pubResults.map((pub, i) => (
                <div key={i} className="detail-card">
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 16, fontFamily: "var(--font-display)", color: "var(--text-primary)", marginBottom: 10 }}>{pub.title}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span className="badge badge-teal">{pub.journal}</span>
                      <span className="badge badge-amber">{pub.year}</span>
                      {pub.project
                        ? <span className="badge badge-green">◉ {pub.project.title}</span>
                        : <span className="badge badge-rose">No project linked</span>}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* ── BY AREA ── */}
      {activeTab === "search-area" && (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>
          <div className="card">
            <div className="card-header"><div className="card-title"><span className="dot" /> Select Area</div></div>
            <div className="form-group">
              <label className="form-label">Knowledge Area</label>
              <select className="form-select" value={selArea} onChange={e => { setSelArea(e.target.value); setAreaResult(null); }}>
                <option value="">Choose…</option>
                {uniqueAreas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setAreaResult(getAreaDetails(selArea))} disabled={!selArea}>
                Search
              </button>
            </div>
          </div>

          <div>
            {!areaResult
              ? <div className="empty-state"><div className="empty-icon">⟡</div><p>Select a knowledge area.</p></div>
              : (
                <div className="detail-card">
                  <div className="detail-card-top">
                    <div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: 1 }}>Knowledge Area</div>
                      <div style={{ fontSize: 22, fontFamily: "var(--font-display)", color: "var(--amber)", marginTop: 4 }}>{areaResult.area}</div>
                    </div>
                  </div>
                  <div className="detail-card-body">
                    {areaResult.projects.length > 0 && (
                      <>
                        <div className="section-heading">Projects ({areaResult.projects.length})</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                          {areaResult.projects.map((p, i) => (
                            <div key={i} style={{ padding: "9px 12px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                              {p.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {areaResult.publications.length > 0 && (
                      <>
                        <div className="section-heading">Publications ({areaResult.publications.length})</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {areaResult.publications.map((pub, i) => (
                            <span key={i} className="badge badge-teal">{pub.title}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* ── COLLEAGUES ── */}
      {activeTab === "colleagues" && (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
          <div className="card">
            <div className="card-header"><div className="card-title"><span className="dot" /> Select Investigator</div></div>
            <div className="form-group">
              <label className="form-label">Investigator</label>
              <select className="form-select" value={selColleague} onChange={e => { setSelColleague(e.target.value); setColleagueResult(null); }}>
                <option value="">Choose…</option>
                {investigators.map(i => <option key={i.id} value={i.id}>{i.fullName}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 14 }}>
              <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => setColleagueResult(getColleagues(Number(selColleague)))} disabled={!selColleague}>
                Find Colleagues
              </button>
            </div>
          </div>

          <div>
            {!colleagueResult
              ? <div className="empty-state"><div className="empty-icon">◈</div><p>Select a researcher to see their collaborators.</p></div>
              : (
                <div className="detail-card">
                  <div className="detail-card-top">
                    <div className="avatar">
                      {colleagueResult.fullName.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{colleagueResult.fullName}</div>
                      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                        {colleagueResult.academicTitle} · {colleagueResult.institution}
                      </div>
                    </div>
                  </div>
                  <div className="detail-card-body">
                    <div className="detail-grid" style={{ marginBottom: 20 }}>
                      <div className="detail-field">
                        <span className="detail-field-label">Email</span>
                        <span className="detail-field-value" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{colleagueResult.email}</span>
                      </div>
                      <div className="detail-field">
                        <span className="detail-field-label">Institution</span>
                        <span className="detail-field-value">{colleagueResult.institution}</span>
                      </div>
                    </div>

                    {colleagueResult.colleagues.length > 0 ? (
                      <>
                        <div className="section-heading">Colleagues ({colleagueResult.colleagues.length})</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {colleagueResult.colleagues.map((c, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
                              <div className="avatar" style={{ width: 28, height: 28, fontSize: 11, borderRadius: 6 }}>
                                {c.fullName.split(" ").slice(0,2).map(w=>w[0]?.toUpperCase()).join("")}
                              </div>
                              <span style={{ fontSize: 14, color: "var(--text-primary)" }}>{c.fullName}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="alert alert-info">This researcher has no registered colleagues.</div>
                    )}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
}