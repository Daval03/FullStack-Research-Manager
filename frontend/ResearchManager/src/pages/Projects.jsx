import { useState } from "react";
import { projects as initialData } from "../mockData";

const EMPTY = { title: "", startYear: "", durationMonths: "", knowledgeArea: "" };
const AREA_COLORS = ["badge-amber","badge-teal","badge-green","badge-rose"];

export default function Projects() {
  const [data, setData]     = useState(initialData);
  const [tab, setTab]       = useState("list");
  const [form, setForm]     = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);

  function startEdit(p) {
    setForm({ title: p.title, startYear: p.startYear, durationMonths: p.durationMonths, knowledgeArea: p.knowledgeArea });
    setEditId(p.id);
    setTab("edit");
    setMessage(null);
  }

  function startAdd() {
    setForm(EMPTY);
    setEditId(null);
    setTab("add");
    setMessage(null);
  }

  function handleSubmit() {
    if (!form.title) { setMessage({ type: "error", text: "Project title is required." }); return; }
    if (editId) {
      setData(prev => prev.map(p => p.id === editId ? { ...p, ...form } : p));
      setMessage({ type: "success", text: "Project updated." });
    } else {
      const newId = Math.max(...data.map(p => p.id)) + 1;
      setData(prev => [...prev, { id: newId, ...form }]);
      setMessage({ type: "success", text: "Project created." });
      setForm(EMPTY);
    }
  }

  const filtered = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><span>Projects</span></h1>
        <p className="page-subtitle">Research projects in the knowledge graph · {data.length} registered</p>
      </div>

      <div className="tabs">
        <button className={`tab-btn${tab === "list" ? " active" : ""}`} onClick={() => setTab("list")}>All Projects</button>
        <button className={`tab-btn${tab === "add"  ? " active" : ""}`} onClick={startAdd}>+ Add New</button>
        {tab === "edit" && <button className="tab-btn active">Edit</button>}
      </div>

      {tab === "list" && (
        <div className="card">
          <div className="card-header">
            <div className="card-title"><span className="dot" /> Projects ({filtered.length})</div>
            <div className="search-bar" style={{ width: 260 }}>
              <span className="search-icon" style={{ fontSize: 13 }}>⌕</span>
              <input className="form-input" placeholder="Search by title…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">◉</div><h3>No results</h3></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Title</th><th>Knowledge Area</th><th>Start Year</th><th>Duration</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id}>
                      <td className="td-primary">{p.title}</td>
                      <td><span className={`badge ${AREA_COLORS[i % AREA_COLORS.length]}`}>{p.knowledgeArea}</span></td>
                      <td className="td-mono">{p.startYear}</td>
                      <td className="td-muted">{p.durationMonths} months</td>
                      <td><button className="btn btn-ghost btn-sm" onClick={() => startEdit(p)}>Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {(tab === "add" || tab === "edit") && (
        <div className="card" style={{ maxWidth: 640 }}>
          <div className="card-header">
            <div className="card-title"><span className="dot" />{tab === "edit" ? "Edit Project" : "New Project"}</div>
          </div>

          {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input className="form-input" placeholder="Enter project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Knowledge Area</label>
              <input className="form-input" placeholder="e.g. Informática, Biología…" value={form.knowledgeArea} onChange={e => setForm({ ...form, knowledgeArea: e.target.value })} />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Start Year</label>
                <input className="form-input" type="number" min="1990" max="2100" placeholder="2023" value={form.startYear} onChange={e => setForm({ ...form, startYear: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration (months)</label>
                <input className="form-input" type="number" min="1" placeholder="12" value={form.durationMonths} onChange={e => setForm({ ...form, durationMonths: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="divider" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={() => setTab("list")}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {tab === "edit" ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}