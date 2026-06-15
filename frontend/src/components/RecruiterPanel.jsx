import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  Sliders, Search, Eye, FileDown, X, AlertCircle,
  Loader2, FileText, CheckCircle, XCircle, Sparkles,
  User, Mail, Phone, MapPin, Link, RefreshCw, Filter
} from 'lucide-react';
import { useTheme } from '../theme.jsx';

/* ── Animations ─────────────────────────────────────── */
const ANIM = `
@keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes scaleIn  { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
@keyframes spin     { to{transform:rotate(360deg)} }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes slideUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
@keyframes shimmer  { from{background-position:-400px 0} to{background-position:400px 0} }
`;

/* ── Skeleton ────────────────────────────────────────── */
function Skel({ h = '40px', radius = '8px', w = '100%' }) {
  const { mode } = useTheme();
  return <div style={{ height: h, width: w, borderRadius: radius, background: mode === 'dark' ? 'linear-gradient(90deg,#111 25%,#181818 50%,#111 75%)' : 'linear-gradient(90deg,#e8e5e0 25%,#f0ede8 50%,#e8e5e0 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.4s linear infinite' }} />;
}

/* ── Score ring (small) ──────────────────────────────── */
function MiniRing({ value, size = 46 }) {
  const { T } = useTheme();
  const r = 16, circ = 2 * Math.PI * r;
  const pct = Math.min(parseFloat(value) || 0, 100);
  const col = pct >= 70 ? T.green : pct >= 45 ? T.amber : T.red;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 46 46" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="23" cy="23" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="4" />
        <circle cx="23" cy="23" r={r} fill="none" stroke={col} strokeWidth="4"
          strokeDasharray={`${(pct / 100) * circ} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${col}88)` }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '.62rem', fontWeight: 900, color: col, fontFamily: "'Outfit',sans-serif" }}>{pct.toFixed(0)}</span>
      </div>
    </div>
  );
}

/* ── Status badge ────────────────────────────────────── */
function StatusBadge({ s, small }) {
  const { T } = useTheme();
  const ok = s === 'Selected';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.28rem', padding: small ? '.18rem .55rem' : '.28rem .7rem', borderRadius: '999px', border: `1px solid ${ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)'}`, background: ok ? 'rgba(34,197,94,.08)' : 'rgba(239,68,68,.08)', color: ok ? T.green : T.red, fontSize: small ? '.65rem' : '.72rem', fontWeight: 700 }}>
      {ok ? <CheckCircle size={small ? 9 : 11} /> : <XCircle size={small ? 9 : 11} />} {s}
    </span>
  );
}

/* ── Modal: Candidate Report ─────────────────────────── */
function CandidateModal({ cand, activeConfig, onClose }) {
  const [viewMode, setView] = useState('document');
  const { T } = useTheme();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1.5rem' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width: '1140px', maxWidth: '100%', maxHeight: '92vh', background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: T.shadow, animation: 'scaleIn .3s ease both' }}>

        {/* Modal header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.4rem 1.75rem', borderBottom: `1px solid ${T.line}`, gap: '1rem', background: 'linear-gradient(135deg,rgba(255,136,0,.04),transparent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(255,136,0,.15),rgba(255,136,0,.05))', border: `1px solid rgba(255,136,0,.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={20} color={T.orange} />
            </div>
            <div>
              <h2 style={{ color: T.white, margin: 0, fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-.3px' }}>{cand.Name}</h2>
              <p style={{ color: T.grey, fontSize: '.82rem', margin: '.15rem 0 0' }}>AI Screening Report · {cand.category}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <StatusBadge s={cand.status} />
            <button onClick={onClose}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = T.white; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.bgCard2; e.currentTarget.style.color = T.grey; }}
              style={{ width: '36px', height: '36px', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '9px', color: T.grey, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}>
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden', flexGrow: 1, minHeight: 0 }}>

          {/* Left panel */}
          <div style={{ borderRight: `1px solid ${T.line}`, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Big score */}
            <div style={{ background: 'linear-gradient(135deg,rgba(255,136,0,.08),rgba(255,136,0,.02))', border: `1px solid rgba(255,136,0,.2)`, borderRadius: '16px', padding: '1.4rem', textAlign: 'center' }}>
              <div style={{ fontSize: '.68rem', color: T.grey, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 700, marginBottom: '.4rem' }}>Overall Match Score</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '3.2rem', fontWeight: 900, color: T.orange, letterSpacing: '-2px', lineHeight: 1, animation: 'scaleIn .5s ease .1s both' }}>
                {cand.score.toFixed(1)}%
              </div>
              <div style={{ marginTop: '.75rem' }}><StatusBadge s={cand.status} /></div>
            </div>

            {/* Meta info */}
            <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '14px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
              {[
                { icon: User,   label: 'Category', val: cand.category },
                { icon: MapPin, label: 'Location',  val: cand.location },
                { icon: Mail,   label: 'Email',     val: cand.Email },
                { icon: Phone,  label: 'Phone',     val: cand.phone || 'N/A' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.45rem 0', borderBottom: `1px solid ${T.line}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: T.grey, fontSize: '.78rem' }}>
                    <r.icon size={12} color={T.greyD} /> {r.label}
                  </div>
                  <span style={{ color: T.white, fontSize: '.82rem', fontWeight: 500, maxWidth: '160px', textAlign: 'right', wordBreak: 'break-word' }}>{r.val}</span>
                </div>
              ))}
              {cand.urls && (
                <div style={{ paddingTop: '.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', color: T.greyD, fontSize: '.72rem', marginBottom: '.4rem' }}>
                    <Link size={11} /> Links
                  </div>
                  {cand.urls.split(',').filter(Boolean).map((url, i) => {
                    let lbl = url;
                    if (url.includes('linkedin.com')) lbl = '🔗 LinkedIn';
                    else if (url.includes('github.com')) lbl = '🔗 GitHub';
                    else { try { lbl = `🔗 ${new URL(url).hostname}`; } catch { lbl = '🔗 Portfolio'; } }
                    return <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: T.orange, fontSize: '.8rem', textDecoration: 'none', marginBottom: '.2rem', transition: 'opacity .2s' }} onMouseEnter={e => e.currentTarget.style.opacity='.7'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>{lbl}</a>;
                  })}
                </div>
              )}
            </div>

            {/* AI Reasoning */}
            <div style={{ background: 'rgba(255,136,0,.03)', border: `1px solid rgba(255,136,0,.18)`, borderRadius: '14px', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.6rem' }}>
                <Sparkles size={14} color={T.orange} />
                <span style={{ color: T.orangeL, fontWeight: 700, fontSize: '.82rem' }}>AI Analysis</span>
              </div>
              <p style={{ color: T.grey, fontSize: '.82rem', lineHeight: 1.65, margin: 0 }}>{cand.reasoning}</p>
            </div>

            {/* Skills */}
            {[
              { title: '✓ Matched', color: T.green,  bg: 'rgba(34,197,94,.08)',  bd: 'rgba(34,197,94,.2)',  pBg: 'rgba(34,197,94,.1)',  pBd: 'rgba(34,197,94,.3)',  skills: cand.matched_skills?.split(',').map(s=>s.trim()).filter(Boolean)||[] },
              { title: '✗ Missing', color: T.red,    bg: 'rgba(239,68,68,.06)',  bd: 'rgba(239,68,68,.18)', pBg: 'rgba(239,68,68,.1)',  pBd: 'rgba(239,68,68,.3)',
                skills: (activeConfig?.skills||'').split(',').map(s=>s.trim()).filter(s=>s&&!(cand.matched_skills||'').toLowerCase().includes(s.toLowerCase())) },
            ].map(b => (
              <div key={b.title} style={{ background: b.bg, border: `1px solid ${b.bd}`, borderRadius: '12px', padding: '.9rem' }}>
                <div style={{ color: b.color, fontWeight: 700, fontSize: '.78rem', marginBottom: '.5rem' }}>{b.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                  {b.skills.length > 0
                    ? b.skills.map(s => <span key={s} style={{ fontSize: '.68rem', fontWeight: 700, padding: '.2rem .55rem', borderRadius: '5px', border: `1px solid ${b.pBd}`, background: b.pBg, color: b.color }}>{s}</span>)
                    : <span style={{ color: T.greyD, fontSize: '.78rem' }}>None</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Right panel: resume viewer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem', padding: '1.5rem', minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '10px', padding: '3px', gap: '3px' }}>
                {[['document','Preview', FileDown],['text','Extracted Text', FileText]].map(([mode, lbl, Icon]) => (
                  <button key={mode} onClick={() => setView(mode)}
                    style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.4rem .9rem', borderRadius: '8px', border: 'none', background: viewMode===mode ? 'rgba(255,136,0,.15)' : 'transparent', color: viewMode===mode ? T.orange : T.grey, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s' }}>
                    <Icon size={13}/> {lbl}
                  </button>
                ))}
              </div>
              <a href={`${API_BASE_URL}/api/candidates/${cand.id}/resume`} download
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.lineO; e.currentTarget.style.color=T.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.line;  e.currentTarget.style.color=T.grey; }}
                style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.42rem .95rem', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '9px', color: T.grey, fontSize: '.82rem', fontWeight: 600, textDecoration: 'none', transition: 'all .2s' }}>
                <FileDown size={14}/> Download
              </a>
            </div>
            {viewMode === 'document' ? (
              <iframe src={`${API_BASE_URL}/api/candidates/${cand.id}/resume`} title="Resume"
                style={{ flexGrow: 1, width: '100%', minHeight: '400px', border: `1px solid ${T.line}`, borderRadius: '12px', background: T.bgCard2 }}/>
            ) : (
              <div style={{ flexGrow: 1, border: `1px solid ${T.line}`, borderRadius: '12px', background: T.bgCard2, padding: '1.25rem', overflowY: 'auto', minHeight: '400px' }}>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: T.grey, fontFamily: 'monospace', fontSize: '.85rem', margin: 0, lineHeight: 1.65 }}>
                  {cand.extracted_text || 'No extracted text available.'}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════ */
export default function RecruiterPanel({ activeConfig, onConfigChange, hrId = '' }) {
  const [position, setPosition]         = useState('');
  const [experience, setExperience]     = useState('0');
  const [candidates, setCandidates]     = useState([]);
  const [filterCat, setFilterCat]       = useState('ALL');
  const [searchQuery, setSearch]        = useState('');
  const [selected, setSelected]         = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [loadingCands, setLoadingCands] = useState(false);
  const [message, setMessage]           = useState({ type: '', text: '' });
  const { T } = useTheme();

  useEffect(() => {
    if (activeConfig) { setPosition(activeConfig.position || ''); setExperience(String(activeConfig.experience || 0)); }
    fetchCandidates();
  }, [activeConfig]);

  const fetchCandidates = async () => {
    try { setLoadingCands(true); const res = await axios.get(`${API_BASE_URL}/api/candidates?hr_id=${hrId}&t=${Date.now()}`); setCandidates(res.data); }
    catch {} finally { setLoadingCands(false); }
  };

  const handleSave = async e => {
    e.preventDefault();
    if (!position) { setMessage({ type: 'error', text: 'Please select a position.' }); return; }
    try {
      setSubmitting(true);
      const res = await axios.post(`${API_BASE_URL}/api/config`, { position, experience: parseInt(experience)||0, hr_id: hrId });
      setMessage({ type: 'success', text: res.data.message });
      onConfigChange(); fetchCandidates();
    } catch (err) { setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to update.' }); }
    finally { setSubmitting(false); setTimeout(() => setMessage({ type: '', text: '' }), 5000); }
  };

  const filtered = candidates.filter(c => {
    const okCat  = filterCat === 'ALL' || (c.category||'').toLowerCase() === filterCat.toLowerCase();
    const q      = searchQuery.toLowerCase();
    const okSrch = (c.Name||'').toLowerCase().includes(q) || (c.Email||'').toLowerCase().includes(q) || (c.matched_skills||'').toLowerCase().includes(q);
    return okCat && okSrch;
  });

  const selectedCount  = candidates.filter(c => c.status === 'Selected').length;
  const rejectedCount  = candidates.filter(c => c.status !== 'Selected').length;
  const avgScore       = candidates.length ? (candidates.reduce((a, c) => a + c.score, 0) / candidates.length).toFixed(1) : '0';

  const inputSt = {
    background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '11px',
    color: T.white, padding: '.72rem 1rem', fontFamily: "'Outfit',sans-serif",
    fontSize: '.9rem', outline: 'none', transition: 'border-color .2s, box-shadow .2s',
    width: '100%', boxSizing: 'border-box',
  };

  return (
    <div className="animated-view" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <style>{ANIM}</style>

      {/* ── Page header ── */}
      <div style={{ marginBottom: '1.75rem', animation: 'fadeUp .4s ease both' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.3rem)', fontWeight: 900, color: T.white, margin: 0, letterSpacing: '-1px' }}>
          Recruiter <span style={{ background: `linear-gradient(90deg,${T.orange},${T.orangeL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Panel</span>
        </h1>
        <p style={{ color: T.grey, marginTop: '.3rem', fontSize: '.92rem' }}>Configure requirements and manage candidate pipeline.</p>
      </div>

      {/* ── Mini stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.75rem', animation: 'fadeUp .45s ease .05s both' }}>
        {[
          { label: 'Total', val: candidates.length, color: T.orange,  bg: 'rgba(255,136,0,.1)',  icon: User },
          { label: 'Selected', val: selectedCount,   color: T.green,  bg: 'rgba(34,197,94,.1)',  icon: CheckCircle },
          { label: 'Avg Score', val: `${avgScore}%`, color: T.orangeL, bg: 'rgba(255,170,51,.1)', icon: Sparkles },
        ].map(s => (
          <div key={s.label} style={{ background: T.bgCard, border: `1px solid ${s.color}22`, borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '.85rem', transition: 'border-color .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}44`}
            onMouseLeave={e => e.currentTarget.style.borderColor = `${s.color}22`}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={17} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '.68rem', color: T.grey, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 600 }}>{s.label}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.5rem', fontWeight: 900, color: s.color, letterSpacing: '-1px', lineHeight: 1.1 }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* ── Left: Config ── */}
        <div style={{ width: '290px', flexShrink: 0, animation: 'fadeUp .5s ease .1s both' }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '20px', padding: '1.4rem', overflow: 'hidden', position: 'relative' }}>
            {/* Glow */}
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,136,0,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem', borderBottom: `1px solid ${T.line}`, paddingBottom: '1rem', marginBottom: '1.4rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sliders size={16} color={T.orange} />
              </div>
              <h3 style={{ color: T.white, fontSize: '1rem', fontWeight: 700, margin: 0 }}>Configure Target</h3>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                <label style={{ fontSize: '.72rem', fontWeight: 700, color: T.grey, textTransform: 'uppercase', letterSpacing: '.5px' }}>Job Position</label>
                <select value={position} onChange={e => setPosition(e.target.value)} style={inputSt}
                  onFocus={e => { e.target.style.borderColor=T.orange; e.target.style.boxShadow='0 0 0 3px rgba(255,136,0,.12)'; }}
                  onBlur={e  => { e.target.style.borderColor=T.line;   e.target.style.boxShadow='none'; }}>
                  <option value="">-- Choose Position --</option>
                  {activeConfig?.available_positions?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
                <label style={{ fontSize: '.72rem', fontWeight: 700, color: T.grey, textTransform: 'uppercase', letterSpacing: '.5px' }}>Min. Experience (yrs)</label>
                <input type="number" min="0" max="30" value={experience} onChange={e => setExperience(e.target.value)}
                  style={inputSt} placeholder="0"
                  onFocus={e => { e.target.style.borderColor=T.orange; e.target.style.boxShadow='0 0 0 3px rgba(255,136,0,.12)'; }}
                  onBlur={e  => { e.target.style.borderColor=T.line;   e.target.style.boxShadow='none'; }}/>
              </div>

              {message.text && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.65rem .85rem', borderRadius: '9px', background: message.type==='success' ? 'rgba(34,197,94,.07)' : 'rgba(239,68,68,.07)', border: `1px solid ${message.type==='success' ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`, color: message.type==='success' ? T.green : T.red, fontSize: '.82rem', animation: 'fadeIn .3s ease both' }}>
                  <AlertCircle size={13}/> {message.text}
                </div>
              )}

              <button type="submit" disabled={submitting}
                onMouseEnter={e => { if (!submitting) { e.currentTarget.style.opacity='.85'; e.currentTarget.style.transform='translateY(-1px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='none'; }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', background: T.btnGrad, border: 'none', borderRadius: '11px', color: T.white, fontSize: '.9rem', fontWeight: 700, padding: '.78rem 1rem', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 16px rgba(255,136,0,.25)', transition: 'all .2s', opacity: submitting ? .65 : 1 }}>
                {submitting ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }}/> Saving…</> : 'Set Role & Update Filter'}
              </button>
            </form>

            {/* Current config preview */}
            {activeConfig?.position && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(255,136,0,.04)', border: `1px solid rgba(255,136,0,.15)`, borderRadius: '12px' }}>
                <div style={{ fontSize: '.65rem', color: T.orange, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', marginBottom: '.4rem' }}>Currently Active</div>
                <div style={{ color: T.white, fontWeight: 700, fontSize: '.92rem' }}>{activeConfig.position}</div>
                {activeConfig.experience > 0 && <div style={{ color: T.greyD, fontSize: '.75rem', marginTop: '.25rem' }}>Min {activeConfig.experience} yr{activeConfig.experience !== 1 ? 's' : ''} exp</div>}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Candidates ── */}
        <div style={{ flexGrow: 1, minWidth: 0, animation: 'fadeUp .5s ease .15s both' }}>
          <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '20px', padding: '1.4rem' }}>

            {/* Filter bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flexWrap: 'wrap', borderBottom: `1px solid ${T.line}`, paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '11px', padding: '.45rem .9rem', flexGrow: 1, maxWidth: '320px', transition: 'border-color .2s' }}
                onFocusCapture={e => e.currentTarget.style.borderColor = T.orange}
                onBlurCapture={e  => e.currentTarget.style.borderColor = T.line}>
                <Search size={15} color={T.grey} />
                <input type="text" placeholder="Search name, email, skills…" value={searchQuery} onChange={e => setSearch(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: T.white, outline: 'none', fontSize: '.88rem', width: '100%', fontFamily: "'Outfit',sans-serif" }} />
              </div>

              {/* Category filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                <Filter size={13} color={T.grey} />
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                  style={{ ...inputSt, padding: '.42rem 1.6rem .42rem .75rem', fontSize: '.82rem', width: 'auto' }}>
                  <option value="ALL">All Roles</option>
                  {activeConfig?.available_positions?.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Refresh */}
              <button onClick={fetchCandidates}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.lineO; e.currentTarget.style.color=T.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.line;  e.currentTarget.style.color=T.grey; }}
                style={{ display: 'flex', alignItems: 'center', gap: '.35rem', padding: '.45rem .85rem', background: 'transparent', border: `1px solid ${T.line}`, borderRadius: '9px', color: T.grey, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s', marginLeft: 'auto' }}>
                <RefreshCw size={13}/> Refresh
              </button>

              {/* Count badge */}
              <div style={{ background: 'rgba(255,136,0,.08)', border: `1px solid rgba(255,136,0,.2)`, borderRadius: '999px', padding: '.25rem .75rem', color: T.orangeL, fontSize: '.75rem', fontWeight: 700 }}>
                {filtered.length} candidate{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Table */}
            {loadingCands ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', padding: '.5rem 0' }}>
                {[...Array(5)].map((_, i) => <Skel key={i} h="52px" radius="10px" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: T.grey, animation: 'fadeIn .4s ease both' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '.75rem' }}>🔍</div>
                <div style={{ fontWeight: 600, marginBottom: '.3rem' }}>No candidates found</div>
                <div style={{ fontSize: '.85rem', color: T.greyD }}>Try adjusting your search or filter</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {[['Candidate','left'],['Score','center'],['Category','left'],['Status','center'],['Location','left'],['','center']].map(([h, align]) => (
                        <th key={h} style={{ padding: '.6rem 1rem', fontSize: '.68rem', fontWeight: 700, color: T.greyD, textTransform: 'uppercase', letterSpacing: '.7px', borderBottom: `1px solid ${T.line}`, textAlign: align, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c, ri) => (
                      <tr key={c.id}
                        style={{ borderBottom: `1px solid ${T.line}`, transition: 'background .15s', animation: `fadeIn .3s ease ${ri * .03}s both`, cursor: 'default' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.025)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        {/* Candidate */}
                        <td style={{ padding: '.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg,rgba(255,136,0,.15),rgba(255,136,0,.05))`, border: `1px solid rgba(255,136,0,.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontSize: '.75rem', fontWeight: 700, color: T.orange }}>{(c.Name||'?')[0].toUpperCase()}</span>
                            </div>
                            <div>
                              <div style={{ color: T.white, fontWeight: 600, fontSize: '.9rem', lineHeight: 1.2 }}>{c.Name}</div>
                              <div style={{ color: T.greyD, fontSize: '.72rem', marginTop: '1px' }}>{c.Email}</div>
                            </div>
                          </div>
                        </td>
                        {/* Score ring */}
                        <td style={{ padding: '.85rem 1rem', textAlign: 'center' }}>
                          <MiniRing value={c.score} />
                        </td>
                        {/* Category */}
                        <td style={{ padding: '.85rem 1rem' }}>
                          <span style={{ background: 'rgba(255,136,0,.07)', color: T.orangeL, border: `1px solid rgba(255,136,0,.18)`, borderRadius: '6px', padding: '2px 8px', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.3px' }}>{c.category}</span>
                        </td>
                        {/* Status */}
                        <td style={{ padding: '.85rem 1rem', textAlign: 'center' }}>
                          <StatusBadge s={c.status} small />
                        </td>
                        {/* Location */}
                        <td style={{ padding: '.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', color: T.grey, fontSize: '.82rem' }}>
                            <MapPin size={11} color={T.greyD} /> {c.location}
                          </div>
                        </td>
                        {/* Action */}
                        <td style={{ padding: '.85rem 1rem', textAlign: 'center' }}>
                          <button onClick={() => setSelected(c)}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,136,0,.1)'; e.currentTarget.style.borderColor=T.lineO; e.currentTarget.style.color=T.orange; }}
                            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=T.line; e.currentTarget.style.color=T.grey; }}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '.3rem', padding: '.36rem .75rem', background: 'transparent', border: `1px solid ${T.line}`, borderRadius: '8px', color: T.grey, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s', whiteSpace: 'nowrap' }}>
                            <Eye size={13}/> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && <CandidateModal cand={selected} activeConfig={activeConfig} onClose={() => setSelected(null)} />}
    </div>
  );
}
