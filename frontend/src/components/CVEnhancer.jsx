import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { T } from '../theme';

export default function CVEnhancer({ file, activeConfig }) {
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');
  const [expandedFault, setExpandedFault] = useState(null);

  const handleEnhance = async () => {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('job_title', activeConfig?.position || '');
      fd.append('required_skills', activeConfig?.skills || '');
      const res = await axios.post(`${API_BASE_URL}/api/enhance`, fd, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 90000 });
      if (res.data.success) setResult(res.data);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'An error occurred.';
      setError(detail.includes('GROQ_API_KEY')
        ? '🔑 Groq API key not configured. Set GROQ_API_KEY before starting the server.'
        : detail);
    } finally { setLoading(false); }
  };

  const toggleFault = i => setExpandedFault(expandedFault === i ? null : i);

  if (!file) return null;

  return (
    <div style={S.wrapper}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,136,0,.1)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wand2 size={20} color={T.orange}/>
          </div>
          <div>
            <div style={{ color: T.white, fontWeight: 700, fontSize: '1rem' }}>AI CV Enhancer</div>
            <div style={{ color: T.grey, fontSize: '.75rem', marginTop: '1px' }}>Powered by Llama 3.3 · Groq</div>
          </div>
        </div>

        <button onClick={handleEnhance} disabled={loading}
          style={{ ...S.enhBtn, opacity: loading ? .65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '.85'; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.opacity = '1'; }}>
          {loading
            ? <><Loader2 size={15} style={{ animation: 'spin 1.2s linear infinite' }}/> Analyzing…</>
            : <><Sparkles size={15}/> {result ? 'Re-Analyze' : 'Enhance My CV'}</>}
        </button>
      </div>

      {/* Loading dots */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', padding: '1.5rem', marginTop: '.5rem' }}>
          <div style={{ display: 'flex', gap: '.4rem' }}>
            {[0,.2,.4].map(d => (
              <span key={d} style={{ width: '9px', height: '9px', borderRadius: '50%', background: T.orange, display: 'inline-block', animation: `dotPulse 1.4s ease-in-out ${d}s infinite` }}/>
            ))}
          </div>
          <p style={{ color: T.grey, fontSize: '.88rem', textAlign: 'center', lineHeight: 1.55 }}>
            Llama is reading your CV against <strong style={{ color: T.orangeL }}>{activeConfig?.position || 'the job role'}</strong>…
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.6rem', padding: '.9rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.2)', marginTop: '1rem' }}>
          <AlertTriangle size={16} color={T.red} style={{ flexShrink: 0, marginTop: '1px' }}/>
          <span style={{ color: '#fca5a5', fontSize: '.85rem', lineHeight: 1.5 }}>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="animated-view" style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem', marginBottom: '1.25rem' }}>
            <span style={{ background: 'rgba(255,136,0,.1)', border: `1px solid ${T.lineO}`, color: T.orangeL, fontSize: '.82rem', fontWeight: 600, padding: '.28rem .8rem', borderRadius: '999px' }}>
              📋 {result.job_title || 'General Analysis'}
            </span>
            <span style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', color: '#f87171', fontSize: '.78rem', fontWeight: 600, padding: '.25rem .7rem', borderRadius: '999px' }}>
              {result.faults.length} issue{result.faults.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={S.cols}>
            {/* Faults */}
            <div style={S.panel}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', paddingBottom: '.6rem', borderBottom: `1px solid ${T.line}` }}>
                <XCircle size={15} color="#f87171"/>
                <span style={{ color: '#f87171', fontWeight: 700, fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>Faults Detected</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '.6rem' }}>
                {result.faults.map((fault, i) => (
                  <div key={i} onClick={() => toggleFault(i)}
                    style={{ borderRadius: '8px', border: `1px solid ${expandedFault===i ? 'rgba(248,113,113,.4)' : 'rgba(248,113,113,.15)'}`, background: expandedFault===i ? 'rgba(248,113,113,.06)' : 'rgba(248,113,113,.02)', padding: '.65rem .8rem', cursor: 'pointer', transition: 'all .2s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.55rem' }}>
                      <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(248,113,113,.2)', color: '#f87171', fontSize: '.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>{i+1}</div>
                      <p style={{ color: '#fca5a5', fontSize: '.82rem', lineHeight: 1.5, margin: 0, flex: 1 }}>{fault}</p>
                      {expandedFault===i ? <ChevronUp size={13} color={T.greyD}/> : <ChevronDown size={13} color={T.greyD}/>}
                    </div>
                    {expandedFault===i && result.suggestions[i] && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.45rem', marginTop: '.55rem', paddingTop: '.55rem', borderTop: '1px solid rgba(248,113,113,.1)' }}>
                        <CheckCircle2 size={13} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }}/>
                        <span style={{ color: '#86efac', fontSize: '.8rem', lineHeight: 1.5 }}>{result.suggestions[i]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div style={S.panel}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', paddingBottom: '.6rem', borderBottom: `1px solid ${T.line}` }}>
                <CheckCircle2 size={15} color="#4ade80"/>
                <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>Improvements</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '.6rem' }}>
                {result.suggestions.map((sug, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '.55rem', padding: '.65rem .8rem', borderRadius: '8px', background: 'rgba(74,222,128,.04)', border: '1px solid rgba(74,222,128,.12)' }}>
                    <div style={{ flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(74,222,128,.18)', color: '#4ade80', fontSize: '.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>{i+1}</div>
                    <p style={{ color: '#86efac', fontSize: '.82rem', lineHeight: 1.5, margin: 0 }}>{sug}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p style={{ color: T.greyD, fontSize: '.73rem', textAlign: 'center', marginTop: '1.1rem' }}>
            ✦ AI analysis is advisory. Always tailor suggestions to your experience and the job description.
          </p>
        </div>
      )}

      <style>{`@keyframes dotPulse { 0%,80%,100%{opacity:.2;transform:scale(.8)} 40%{opacity:1;transform:scale(1.2)} }`}</style>
    </div>
  );
}

const S = {
  wrapper: { marginTop: '2rem', background: 'rgba(255,136,0,.03)', border: `1px solid ${T.lineO}`, borderRadius: '18px', padding: '1.5rem' },
  header:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.75rem', marginBottom: '.5rem' },
  enhBtn:  { display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.6rem 1.4rem', borderRadius: '10px', border: 'none', background: T.btnGrad, color: T.white, fontWeight: 700, fontSize: '.875rem', boxShadow: '0 0 18px rgba(255,136,0,.28)', transition: 'opacity .2s', fontFamily: "'Outfit',sans-serif", letterSpacing: '.2px' },
  cols:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  panel:   { background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '12px', padding: '1rem' },
};
