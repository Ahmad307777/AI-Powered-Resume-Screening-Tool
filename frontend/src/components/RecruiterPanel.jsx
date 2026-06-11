import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Sliders, Search, Eye, FileDown, X, AlertCircle, Loader2, FileText } from 'lucide-react';
import { T } from '../theme.jsx';

export default function RecruiterPanel({ activeConfig, onConfigChange }) {
  const [position, setPosition]                 = useState('');
  const [experience, setExperience]             = useState('0');
  const [candidates, setCandidates]             = useState([]);
  const [filterCategory, setFilterCategory]     = useState('ALL');
  const [searchQuery, setSearchQuery]           = useState('');
  const [selected, setSelected]                 = useState(null);
  const [submitting, setSubmitting]             = useState(false);
  const [loadingCands, setLoadingCands]         = useState(false);
  const [message, setMessage]                   = useState({ type: '', text: '' });
  const [viewMode, setViewMode]                 = useState('document');

  useEffect(() => {
    if (activeConfig) { setPosition(activeConfig.position || ''); setExperience(String(activeConfig.experience || 0)); }
    fetchCandidates();
  }, [activeConfig]);

  const fetchCandidates = async () => {
    try { setLoadingCands(true); const res = await axios.get(`${API_BASE_URL}/api/candidates?t=${Date.now()}`); setCandidates(res.data); }
    catch { /* silent */ } finally { setLoadingCands(false); }
  };

  const handleSaveConfig = async e => {
    e.preventDefault();
    if (!position) { setMessage({ type: 'error', text: 'Please select a job position.' }); return; }
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE_URL}/api/config`, { position, experience: parseInt(experience) || 0 });
      setMessage({ type: 'success', text: res.data.message });
      onConfigChange(); fetchCandidates();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update recruitment target.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const filtered = candidates.filter(c => {
    const okCat  = filterCategory === 'ALL' || (c.category||'').toLowerCase() === filterCategory.toLowerCase();
    const q      = searchQuery.toLowerCase();
    const okSrch = (c.Name||'').toLowerCase().includes(q) || (c.Email||'').toLowerCase().includes(q) || (c.matched_skills||'').toLowerCase().includes(q);
    return okCat && okSrch;
  });

  const StatusBadge = ({ s }) => (
    <span style={{ ...S.badge, background: s==='Selected' ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', borderColor: s==='Selected' ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)', color: s==='Selected' ? T.green : T.red }}>
      {s}
    </span>
  );

  return (
    <div className="animated-view">
      {/* Page heading */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, color: T.white, margin: 0, letterSpacing: '-1px' }}>
          Recruiter <span style={{ background: T.txtGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
        </h1>
        <p style={{ color: T.grey, marginTop: '.3rem', fontSize: '.95rem' }}>Configure recruitment parameters and inspect candidate profiles.</p>
      </div>

      <div style={S.layout}>
        {/* ── Left: Config panel ── */}
        <div style={S.leftCol}>
          <div style={S.card}>
            <div style={S.cardHead}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(255,136,0,.1)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sliders size={18} color={T.orange}/>
              </div>
              <h3 style={S.cardTitle}>Configure Target</h3>
            </div>

            <form onSubmit={handleSaveConfig} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={S.formGroup}>
                <label style={S.label}>Job Position</label>
                <select value={position} onChange={e => setPosition(e.target.value)} style={S.input}>
                  <option value="">-- Choose Position --</option>
                  {activeConfig?.available_positions?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div style={S.formGroup}>
                <label style={S.label}>Min. Experience (Years)</label>
                <input type="number" min="0" max="30" value={experience} onChange={e => setExperience(e.target.value)} style={S.input} placeholder="e.g. 2"
                  onFocus={e => e.target.style.borderColor = T.orange}
                  onBlur={e  => e.target.style.borderColor = T.line}/>
              </div>

              {message.text && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.7rem .9rem', borderRadius: '8px', background: message.type==='success' ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)', border: `1px solid ${message.type==='success' ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`, color: message.type==='success' ? T.green : T.red, fontSize: '.85rem' }}>
                  <AlertCircle size={15}/> {message.text}
                </div>
              )}

              <button type="submit" disabled={submitting}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity='.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity='1'; }}
                style={{ ...S.btnPrimary, opacity: submitting ? .65 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
                {submitting ? 'Saving…' : 'Set Role & Update Filter'}
              </button>
            </form>
          </div>
        </div>

        {/* ── Right: Candidates table ── */}
        <div style={S.rightCol}>
          <div style={S.card}>
            {/* Filter bar */}
            <div style={S.filterBar}>
              <div style={S.searchBox}>
                <Search size={16} color={T.grey}/>
                <input type="text" placeholder="Search by name, email, skills…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: T.white, outline: 'none', fontSize: '.9rem', width: '100%', fontFamily: "'Outfit',sans-serif" }}/>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <span style={{ fontSize: '.82rem', color: T.grey, whiteSpace: 'nowrap' }}>Filter:</span>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ ...S.input, padding: '.38rem 1.5rem .38rem .7rem', fontSize: '.82rem', width: 'auto' }}>
                  <option value="ALL">All Categories</option>
                  {activeConfig?.available_positions?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            {/* Table */}
            <div style={{ marginTop: '1.25rem', overflowX: 'auto' }}>
              {loadingCands ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', padding: '4rem' }}>
                  <Loader2 size={32} color={T.orange} style={{ animation: 'spin 1.2s linear infinite' }}/>
                  <p style={{ color: T.grey }}>Retrieving candidates…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: T.grey }}>No candidates match the active filters.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      {['Name','Email','Score','Category','Status','Location',''].map(h => (
                        <th key={h} style={{ padding: '.7rem 1rem', fontSize: '.75rem', fontWeight: 700, color: T.grey, textTransform: 'uppercase', letterSpacing: '.6px', borderBottom: `1px solid ${T.line}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.id} style={{ borderBottom: `1px solid ${T.line}` }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={S.td}><span style={{ color: T.white, fontWeight: 600 }}>{c.Name}</span></td>
                        <td style={S.td}><span style={{ color: T.grey }}>{c.Email}</span></td>
                        <td style={S.td}><span style={{ fontWeight: 800, color: T.orange, fontSize: '1rem' }}>{c.score.toFixed(1)}%</span></td>
                        <td style={S.td}>
                          <span style={{ background: 'rgba(255,136,0,.08)', color: T.orangeL, border: `1px solid rgba(255,136,0,.2)`, borderRadius: '6px', padding: '2px 8px', fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase' }}>{c.category}</span>
                        </td>
                        <td style={S.td}><StatusBadge s={c.status}/></td>
                        <td style={S.td}><span style={{ color: T.grey, fontSize: '.85rem' }}>{c.location}</span></td>
                        <td style={S.td}>
                          <button onClick={() => setSelected(c)}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = T.lineO; e.currentTarget.style.color = T.orange; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.line;  e.currentTarget.style.color = T.grey; }}
                            style={{ display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.38rem .75rem', background: 'transparent', border: `1px solid ${T.line}`, borderRadius: '8px', color: T.grey, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s' }}>
                            <Eye size={14}/> Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {selected && (
        <div style={S.overlay} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div style={S.modal} className="animated-view">

            {/* Modal header */}
            <div style={S.modalHead}>
              <div>
                <h2 style={{ color: T.white, margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                  Selection Report — {selected.Name}
                </h2>
                <p style={{ color: T.grey, fontSize: '.85rem', marginTop: '.2rem' }}>Algorithmic and semantic evaluation breakdown.</p>
              </div>
              <button onClick={() => setSelected(null)}
                style={{ background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '8px', color: T.grey, width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <X size={18}/>
              </button>
            </div>

            <div style={S.modalBody}>
              <div style={S.reportGrid}>

                {/* Left: overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Big score */}
                  <div style={{ ...S.card, textAlign: 'center', padding: '1.5rem', border: `1px solid ${T.lineO}` }}>
                    <div style={{ fontSize: '.72rem', color: T.grey, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 700 }}>Match Score</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '3rem', fontWeight: 900, color: T.orange, letterSpacing: '-2px', lineHeight: 1.1, marginTop: '.3rem' }}>{selected.score.toFixed(1)}%</div>
                    <StatusBadge s={selected.status}/>
                  </div>

                  {/* Meta */}
                  <div style={S.card}>
                    {[
                      { label: 'Category',  val: <span style={{ background: 'rgba(255,136,0,.08)', color: T.orangeL, border: `1px solid rgba(255,136,0,.2)`, borderRadius: '6px', padding: '2px 8px', fontSize: '.75rem', fontWeight: 700 }}>{selected.category}</span> },
                      { label: 'Location',  val: selected.location },
                      { label: 'Email',     val: selected.Email },
                      { label: 'Phone',     val: selected.phone || 'N/A' },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.55rem 0', borderBottom: `1px solid ${T.line}` }}>
                        <span style={{ color: T.grey, fontSize: '.82rem' }}>{r.label}</span>
                        <span style={{ color: T.white, fontSize: '.88rem', fontWeight: 500 }}>{r.val}</span>
                      </div>
                    ))}
                    {selected.urls && (
                      <div style={{ paddingTop: '.6rem' }}>
                        <span style={{ color: T.grey, fontSize: '.82rem', display: 'block', marginBottom: '.35rem' }}>Links</span>
                        {selected.urls.split(',').filter(Boolean).map((url, i) => {
                          let lbl = url;
                          if (url.includes('linkedin.com')) lbl = 'LinkedIn';
                          else if (url.includes('github.com')) lbl = 'GitHub';
                          else { try { lbl = new URL(url).hostname; } catch { lbl = 'Portfolio'; } }
                          return <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: T.orange, fontSize: '.82rem', textDecoration: 'underline', wordBreak: 'break-all', marginBottom: '.2rem' }}>🔗 {lbl}</a>;
                        })}
                      </div>
                    )}
                  </div>

                  {/* AI Reasoning */}
                  <div style={{ ...S.card, background: 'rgba(255,136,0,.03)', borderColor: T.lineO }}>
                    <div style={{ color: T.orangeL, fontWeight: 700, fontSize: '.85rem', marginBottom: '.5rem' }}>💡 AI Match Analysis</div>
                    <p style={{ color: T.grey, fontSize: '.88rem', lineHeight: 1.6, margin: 0 }}>{selected.reasoning}</p>
                  </div>

                  {/* Skills */}
                  {[
                    { title: '✓ Matched Skills', color: T.green, skills: selected.matched_skills?.split(',').map(s=>s.trim()).filter(Boolean) || [], pillBg: 'rgba(34,197,94,.1)', pillBd: 'rgba(34,197,94,.3)', pillCol: T.green },
                    { title: '✗ Missing Skills', color: T.red,
                      skills: (activeConfig?.skills||'').split(',').map(s=>s.trim()).filter(s=>s && !(selected.matched_skills||'').toLowerCase().includes(s.toLowerCase())),
                      pillBg: 'rgba(239,68,68,.1)', pillBd: 'rgba(239,68,68,.3)', pillCol: T.red },
                  ].map(block => (
                    <div key={block.title} style={S.card}>
                      <div style={{ color: block.color, fontWeight: 700, fontSize: '.82rem', marginBottom: '.55rem' }}>{block.title}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                        {block.skills.length > 0
                          ? block.skills.map(s => <span key={s} style={{ fontSize: '.72rem', fontWeight: 700, padding: '.22rem .6rem', borderRadius: '6px', border: `1px solid ${block.pillBd}`, background: block.pillBg, color: block.pillCol }}>{s}</span>)
                          : <span style={{ color: T.greyD, fontSize: '.82rem' }}>None</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: resume viewer */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', minHeight: '500px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '8px', padding: '3px', gap: '3px' }}>
                      {[['document','Preview'],['text','Extracted Text']].map(([mode, lbl]) => (
                        <button key={mode} onClick={() => setViewMode(mode)}
                          style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.38rem .85rem', borderRadius: '6px', border: 'none', background: viewMode===mode ? 'rgba(255,136,0,.15)' : 'transparent', color: viewMode===mode ? T.orange : T.grey, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s' }}>
                          {mode==='document' ? <FileDown size={13}/> : <FileText size={13}/>} {lbl}
                        </button>
                      ))}
                    </div>
                    <a href={`${API_BASE_URL}/api/candidates/${selected.id}/resume`} download
                      style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.4rem .85rem', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '8px', color: T.grey, fontSize: '.82rem', fontWeight: 600, textDecoration: 'none', transition: 'all .2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = T.lineO; e.currentTarget.style.color = T.orange; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.line;  e.currentTarget.style.color = T.grey; }}>
                      <FileDown size={14}/> Download
                    </a>
                  </div>

                  {viewMode === 'document' ? (
                    <iframe src={`${API_BASE_URL}/api/candidates/${selected.id}/resume`} title="Resume"
                      style={{ flexGrow: 1, width: '100%', border: `1px solid ${T.line}`, borderRadius: '10px', background: T.bgCard2 }}/>
                  ) : (
                    <div style={{ flexGrow: 1, border: `1px solid ${T.line}`, borderRadius: '10px', background: T.bgCard2, padding: '1.25rem', overflowY: 'auto' }}>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: T.grey, fontFamily: 'monospace', fontSize: '.88rem', margin: 0 }}>
                        {selected.extracted_text || 'No extracted text available.'}
                      </pre>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  layout:     { display: 'flex', gap: '1.75rem', width: '100%', alignItems: 'flex-start' },
  leftCol:    { width: '300px', flexShrink: 0 },
  rightCol:   { flexGrow: 1, minWidth: 0 },
  card:       { background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '16px', padding: '1.4rem' },
  cardHead:   { display: 'flex', alignItems: 'center', gap: '.65rem', borderBottom: `1px solid ${T.line}`, paddingBottom: '1rem' },
  cardTitle:  { color: T.white, fontSize: '1.05rem', fontWeight: 700, margin: 0 },
  formGroup:  { display: 'flex', flexDirection: 'column', gap: '.4rem' },
  label:      { fontSize: '.78rem', fontWeight: 700, color: T.grey, textTransform: 'uppercase', letterSpacing: '.5px' },
  input:      { background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '10px', color: T.white, padding: '.7rem .95rem', fontFamily: "'Outfit',sans-serif", fontSize: '.9rem', outline: 'none', transition: 'border-color .2s', width: '100%', boxSizing: 'border-box' },
  btnPrimary: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', background: T.btnGrad, border: 'none', borderRadius: '10px', color: T.white, fontSize: '.9rem', fontWeight: 700, padding: '.75rem 1rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 16px rgba(255,136,0,.25)', transition: 'opacity .2s' },
  filterBar:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderBottom: `1px solid ${T.line}`, paddingBottom: '1rem' },
  searchBox:  { display: 'flex', alignItems: 'center', gap: '.5rem', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '10px', padding: '.42rem .85rem', width: '260px' },
  td:         { padding: '.9rem 1rem', fontSize: '.88rem', color: T.grey },
  badge:      { display: 'inline-flex', alignItems: 'center', padding: '.25rem .65rem', borderRadius: '999px', border: '1px solid', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.2px' },
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' },
  modal:      { width: '1100px', maxWidth: '100%', maxHeight: '90vh', background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.9)' },
  modalHead:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1.4rem 1.75rem', borderBottom: `1px solid ${T.line}`, gap: '1rem' },
  modalBody:  { padding: '1.75rem', overflowY: 'auto', flexGrow: 1 },
  reportGrid: { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', height: '100%' },
  txtGrad:    T.txtGrad,
};
