import { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { UploadCloud, FileText, CheckCircle, XCircle, AlertCircle, Sparkles, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import CVEnhancer from './CVEnhancer';
import { useNavigate } from 'react-router-dom';
import { T, Logo } from '../theme';

export default function CandidatePortal({ activeConfig, onApplicationSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail]               = useState('');
  const [fullName, setFullName]         = useState('');
  const [mobile, setMobile]             = useState('');
  const [location, setLocation]         = useState('');
  const [file, setFile]                 = useState(null);
  const [dragging, setDragging]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');
  const [parsing, setParsing]           = useState(false);
  const [extractedUrls, setExtractedUrls] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver  = e => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = ()=> setDragging(false);
  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = e => { if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]); };

  const parseFileDetails = async (f) => {
    try {
      setParsing(true);
      const fd = new FormData(); fd.append('file', f);
      const res = await axios.post(`${API_BASE_URL}/api/parse`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        const { name, email: em, phone, urls } = res.data;
        if (name)  setFullName(name);
        if (em)    setEmail(em);
        if (phone) setMobile(phone);
        if (urls)  setExtractedUrls(urls);
      }
    } catch (err) { console.error(err); }
    finally { setParsing(false); }
  };

  const validateAndSetFile = f => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (['pdf','docx','txt'].includes(ext)) { setFile(f); setError(''); parseFileDetails(f); }
    else { setError('Unsupported file type. Please upload PDF, DOCX, or TXT.'); setFile(null); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !fullName || !location || !file) { setError('Please fill all required fields and upload your resume.'); return; }
    try {
      setLoading(true); setError(''); setResult(null);
      const fd = new FormData();
      fd.append('email', email); fd.append('fullName', fullName);
      fd.append('mobile', mobile); fd.append('location', location);
      fd.append('urls', extractedUrls); fd.append('file', file);
      const res = await axios.post(`${API_BASE_URL}/api/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
      if (res.data.success) onApplicationSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during resume analysis.');
    } finally { setLoading(false); }
  };

  const handleReset = () => { setEmail(''); setFullName(''); setMobile(''); setLocation(''); setFile(null); setResult(null); setError(''); setExtractedUrls(''); };

  return (
    <div className="animated-view" style={{ width: '100%', maxWidth: '860px', padding: '2.5rem 2rem' }}>

      {/* Top bar */}
      <div style={S.topBar}>
        <button onClick={() => navigate('/')} style={S.backBtn}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.lineO; e.currentTarget.style.color = T.offW; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.line;  e.currentTarget.style.color = T.grey; }}>
          <ArrowLeft size={14} /> Back to Home
        </button>
        <div style={S.brandRow}>
          <Logo size={28} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.15rem', color: T.white }}>
            Screen<span style={{ color: T.orange }}>.AI</span>
          </span>
        </div>
      </div>

      {/* Page heading */}
      <div style={S.pageHead}>
        <h1 style={S.h1}>
          AI <span style={{ background: T.txtGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Candidate</span> Portal
        </h1>
        <p style={{ color: T.grey, fontSize: '1rem', marginTop: '.4rem' }}>
          Upload your CV to verify alignment with the active job role.
        </p>
      </div>

      {/* Active role banner */}
      {activeConfig && (
        <div style={S.roleBanner}>
          <div style={{ fontSize: '10px', color: T.orange, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', marginBottom: '.3rem' }}>
            Current Recruitment Target
          </div>
          <div style={{ color: T.white, fontWeight: 700, fontSize: '1.15rem' }}>📋 {activeConfig.position || 'Not Set'}</div>
          {activeConfig.skills && (
            <div style={{ color: T.grey, fontSize: '.85rem', marginTop: '.5rem', paddingTop: '.5rem', borderTop: `1px solid ${T.line}` }}>
              <strong style={{ color: T.offW }}>Required Skills:</strong> {activeConfig.skills}
            </div>
          )}
        </div>
      )}

      {/* Main card */}
      <div style={S.card}>
        {loading ? (
          <div style={S.centered}>
            <div style={S.spinnerRing}>
              <Loader2 size={40} color={T.orange} style={{ animation: 'spin 1.2s linear infinite' }} />
            </div>
            <h3 style={{ color: T.white, fontSize: '1.2rem', margin: '1.25rem 0 .5rem' }}>Analyzing Resume…</h3>
            <p style={{ color: T.grey, fontSize: '.9rem', maxWidth: '300px', textAlign: 'center', lineHeight: 1.6 }}>
              Extracting text, comparing metrics, and calculating cosine similarity…
            </p>
          </div>

        ) : result ? (
          <div className="animated-view">
            {result.success ? (
              <>
                {/* Status banner */}
                {result.data.status === 'Selected' ? (
                  <div style={{ ...S.statusBanner, background: 'rgba(34,197,94,.1)', borderColor: 'rgba(34,197,94,.3)', color: T.green }}>
                    <CheckCircle size={22} /> PRE-SCREENING: SELECTED FOR REVIEW
                  </div>
                ) : (
                  <div style={{ ...S.statusBanner, background: 'rgba(245,158,11,.1)', borderColor: 'rgba(245,158,11,.3)', color: T.amber }}>
                    <XCircle size={22} /> PRE-SCREENING: REJECTED
                  </div>
                )}

                {/* Score grid */}
                <div style={S.scoreGrid}>
                  {[
                    { label: 'AI Role Category',  value: result.data.category,                          color: T.orange },
                    { label: 'AI Confidence',     value: `${result.data.confidenceScore?.toFixed(1) ?? 'N/A'}%`, color: result.data.confidenceScore >= 60 ? T.green : T.amber },
                    { label: 'Keyword Match',     value: `${result.data.keywordScore.toFixed(1)}%`,     color: T.white },
                    { label: 'Semantic Similarity',value: `${result.data.semanticScore.toFixed(1)}%`,   color: T.orangeL },
                  ].map(k => (
                    <div key={k.label} style={S.metricCard}>
                      <div style={S.metricLabel}>{k.label}</div>
                      <div style={{ ...S.metricValue, color: k.color }}>{k.value}</div>
                    </div>
                  ))}
                </div>

                {/* Experience / mixed profile badges */}
                <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap', justifyContent: 'center', margin: '1rem 0' }}>
                  {result.data.experienceYears !== undefined && (
                    <span style={{ ...S.badge, borderColor: result.data.experienceMeetsRequirement ? 'rgba(34,197,94,.35)' : 'rgba(245,158,11,.35)', color: result.data.experienceMeetsRequirement ? T.green : T.amber, background: result.data.experienceMeetsRequirement ? 'rgba(34,197,94,.07)' : 'rgba(245,158,11,.07)' }}>
                      {result.data.experienceMeetsRequirement ? '✓' : '⚠'} {result.data.experienceYears} yr{result.data.experienceYears !== 1 ? 's' : ''} detected
                    </span>
                  )}
                  {result.data.secondaryCategory && (
                    <span style={{ ...S.badge, borderColor: T.lineO, color: T.orangeL, background: 'rgba(255,136,0,.07)' }}>
                      ⚡ Also matches {result.data.secondaryCategory} ({result.data.secondaryConfidence?.toFixed(1)}%)
                    </span>
                  )}
                </div>

                {/* Skills breakdown */}
                <div style={S.skillsGrid}>
                  <div style={S.skillsBox}>
                    <div style={{ color: T.green, fontWeight: 700, fontSize: '.85rem', marginBottom: '.6rem' }}>✓ Matched Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                      {result.data.matchedSkills.length > 0
                        ? result.data.matchedSkills.map(s => <span key={s} style={{ ...S.pill, background: 'rgba(34,197,94,.1)', borderColor: 'rgba(34,197,94,.3)', color: T.green }}>{s}</span>)
                        : <span style={{ color: T.greyD, fontSize: '.85rem' }}>None matched</span>}
                    </div>
                  </div>
                  <div style={S.skillsBox}>
                    <div style={{ color: T.red, fontWeight: 700, fontSize: '.85rem', marginBottom: '.6rem' }}>✗ Missing Skills</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                      {result.data.missingSkills.length > 0
                        ? result.data.missingSkills.map(s => <span key={s} style={{ ...S.pill, background: 'rgba(239,68,68,.1)', borderColor: 'rgba(239,68,68,.3)', color: T.red }}>{s}</span>)
                        : <span style={{ color: T.greyD, fontSize: '.85rem' }}>None missing</span>}
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div style={S.reasonBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.6rem' }}>
                    <Sparkles size={16} color={T.orange} />
                    <span style={{ color: T.white, fontWeight: 700, fontSize: '.95rem' }}>AI Reasoning</span>
                  </div>
                  <p style={{ color: T.grey, fontSize: '.9rem', lineHeight: 1.65, margin: 0 }}>{result.data.reasoning}</p>
                </div>
              </>
            ) : (
              <>
                <div style={{ ...S.statusBanner, background: 'rgba(239,68,68,.1)', borderColor: 'rgba(239,68,68,.3)', color: T.red }}>
                  <XCircle size={22} /> APPLICATION SUBMISSION FAILED
                </div>
                <div style={{ ...S.reasonBox, borderColor: 'rgba(239,68,68,.2)', marginTop: '1.5rem' }}>
                  <h4 style={{ color: T.white, fontWeight: 700, marginBottom: '.5rem' }}>Role Category Mismatch</h4>
                  <p style={{ color: T.grey, fontSize: '.9rem', lineHeight: 1.55, margin: 0 }}>
                    The model classified your resume as <strong style={{ color: T.offW }}>{result.data?.category}</strong>, but the department requires <strong style={{ color: T.orange }}>{activeConfig?.position?.toUpperCase()}</strong>.
                  </p>
                </div>
              </>
            )}

            <button onClick={handleReset} style={S.btnPrimary} onMouseEnter={e => e.currentTarget.style.opacity='.85'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
              <RefreshCw size={16} /> Submit Another Application
            </button>
          </div>

        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={S.formTitle}>Application Details</h3>

            <div style={S.grid2}>
              <div style={S.formGroup}>
                <label style={S.label}>Full Name *</label>
                <input type="text" required placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} style={S.input} onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.line}/>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Email Address *</label>
                <input type="email" required placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={S.input} onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.line}/>
              </div>
            </div>

            <div style={S.grid2}>
              <div style={S.formGroup}>
                <label style={S.label}>Mobile Phone</label>
                <input type="tel" placeholder="+92 300 1234567" value={mobile} onChange={e => setMobile(e.target.value)} style={S.input} onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.line}/>
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Location (City, Country) *</label>
                <input type="text" required placeholder="Lahore, Pakistan" value={location} onChange={e => setLocation(e.target.value)} style={S.input} onFocus={e => e.target.style.borderColor=T.orange} onBlur={e => e.target.style.borderColor=T.line}/>
              </div>
            </div>

            {/* Drop zone */}
            <div style={S.formGroup}>
              <label style={S.label}>Resume File (PDF, DOCX, TXT) *</label>
              <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}
                style={{ ...S.dropzone, borderColor: dragging ? T.orange : file ? T.lineO : T.line, background: dragging ? 'rgba(255,136,0,.04)' : 'transparent' }}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.docx,.txt"/>
                {file ? (
                  <>
                    <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(255,136,0,.1)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={26} color={T.orange}/>
                    </div>
                    <div>
                      <div style={{ color: T.white, fontWeight: 600 }}>{file.name}</div>
                      <div style={{ color: T.greyD, fontSize: '.8rem', marginTop: '.2rem' }}>
                        {parsing
                          ? <span style={{ color: T.orangeL, display: 'flex', alignItems: 'center', gap: '.4rem' }}><Loader2 size={13} style={{ animation: 'spin 1.2s linear infinite' }}/> Auto-extracting…</span>
                          : `${(file.size/1024).toFixed(1)} KB · Parsed ✓`}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud size={40} color={T.grey}/>
                    <div>
                      <div style={{ color: T.white, fontWeight: 600 }}>Drag & drop or <span style={{ color: T.orange }}>browse</span></div>
                      <div style={{ color: T.greyD, fontSize: '.8rem', marginTop: '.3rem' }}>PDF, DOCX, TXT · Max 10 MB</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div style={S.errorAlert}>
                <AlertCircle size={16} color={T.red}/> {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
              <button type="submit" style={S.btnPrimary} onMouseEnter={e => e.currentTarget.style.opacity='.85'} onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                Submit Application <CheckCircle size={16}/>
              </button>
            </div>
          </form>
        )}
      </div>

      {file && !result && !loading && <CVEnhancer file={file} activeConfig={activeConfig}/>}
    </div>
  );
}

/* ── styles ──────────────────────────────────────────── */
const S = {
  topBar:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' },
  backBtn:   { display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.4rem .9rem', background: 'transparent', border: `1px solid ${T.line}`, borderRadius: '8px', color: T.grey, fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s' },
  brandRow:  { display: 'flex', alignItems: 'center', gap: '.5rem' },
  pageHead:  { textAlign: 'center', marginBottom: '1.75rem' },
  h1:        { fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 900, color: T.white, margin: 0, letterSpacing: '-1px' },
  txtGrad:   T.txtGrad,

  roleBanner: { background: T.bgCard, border: `1px solid ${T.lineO}`, borderRadius: '14px', padding: '1.1rem 1.5rem', marginBottom: '1.75rem' },

  card:  { background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '20px', padding: '2rem' },
  centered: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem' },
  spinnerRing: { width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,136,0,.08)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' },

  statusBanner: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.75rem', padding: '.9rem 1rem', borderRadius: '10px', border: '1px solid', fontWeight: 800, fontSize: '.88rem', letterSpacing: '.5px', marginBottom: '1.5rem' },

  scoreGrid:  { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem', margin: '0 0 1rem' },
  metricCard: { background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '12px', padding: '1.1rem', textAlign: 'center' },
  metricLabel:{ fontSize: '10px', color: T.grey, textTransform: 'uppercase', letterSpacing: '.6px', fontWeight: 700, marginBottom: '.35rem' },
  metricValue:{ fontSize: '1.5rem', fontWeight: 900 },

  badge: { display: 'inline-flex', alignItems: 'center', gap: '.35rem', padding: '.38rem .8rem', borderRadius: '999px', border: '1px solid', fontSize: '.8rem', fontWeight: 600 },

  skillsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0' },
  skillsBox:  { background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '12px', padding: '1rem' },
  pill:       { fontSize: '.72rem', fontWeight: 700, padding: '.22rem .6rem', borderRadius: '6px', border: '1px solid' },

  reasonBox: { background: 'rgba(255,136,0,.04)', border: `1px solid ${T.lineO}`, borderRadius: '12px', padding: '1.25rem', marginTop: '1.25rem' },

  formTitle: { color: T.white, fontSize: '1.1rem', fontWeight: 700, borderBottom: `1px solid ${T.line}`, paddingBottom: '.75rem', marginBottom: '1.5rem' },
  grid2:     { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '.45rem' },
  label:     { fontSize: '.82rem', fontWeight: 600, color: T.grey, textTransform: 'uppercase', letterSpacing: '.5px' },
  input:     { background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '10px', color: T.white, padding: '.75rem 1rem', fontFamily: "'Outfit',sans-serif", fontSize: '.95rem', outline: 'none', transition: 'border-color .2s', width: '100%', boxSizing: 'border-box' },
  dropzone:  { border: '2px dashed', borderRadius: '14px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '.85rem', cursor: 'pointer', transition: 'all .2s', textAlign: 'center' },

  errorAlert:{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.75rem 1rem', borderRadius: '8px', background: 'rgba(239,68,68,.08)', border: `1px solid rgba(239,68,68,.2)`, color: T.red, fontSize: '.85rem', marginTop: '1rem' },

  btnPrimary:{ display: 'inline-flex', alignItems: 'center', gap: '.5rem', background: T.btnGrad, border: 'none', borderRadius: '10px', color: T.white, fontSize: '.95rem', fontWeight: 700, padding: '.8rem 1.75rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 18px rgba(255,136,0,.3)', transition: 'opacity .2s', marginTop: '1rem' },
};
