import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';

export default function CVEnhancer({ file, activeConfig }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [expandedFault, setExpandedFault] = useState(null);

  const handleEnhance = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('job_title', activeConfig?.position || '');
      formData.append('required_skills', activeConfig?.skills || '');

      const res = await axios.post(`${API_BASE_URL}/api/enhance`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 90000,
      });

      if (res.data.success) {
        setResult(res.data);
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'An error occurred.';
      if (detail.includes('GROQ_API_KEY')) {
        setError('🔑 Groq API key not configured. Please set the GROQ_API_KEY environment variable before starting the server.');
      } else {
        setError(detail);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFault = (i) => setExpandedFault(expandedFault === i ? null : i);

  if (!file) return null;

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Wand2 size={22} color="#a855f7" />
          <div>
            <div style={styles.headerTitle}>AI CV Enhancer</div>
            <div style={styles.headerSub}>
              Powered by Llama 3.3 · Groq
            </div>
          </div>
        </div>

        <button
          onClick={handleEnhance}
          disabled={loading}
          style={{
            ...styles.enhanceBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>{result ? 'Re-Analyze' : 'Enhance My CV'}</span>
            </>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.loadingDots}>
            <span style={{ ...styles.dot, animationDelay: '0s' }} />
            <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
            <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
          </div>
          <p style={styles.loadingText}>
            Llama is reading your CV and comparing it against <strong style={{ color: '#a855f7' }}>{activeConfig?.position || 'the job role'}</strong>...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={styles.errorBox}>
          <AlertTriangle size={16} color="#f87171" />
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={styles.results} className="animated-view">
          <div style={styles.resultsHeader}>
            <span style={styles.roleTag}>
              📋 {result.job_title || 'General Analysis'}
            </span>
            <span style={styles.countBadge}>
              {result.faults.length} issue{result.faults.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Two-column layout */}
          <div style={styles.columns}>

            {/* Faults Panel */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <XCircle size={16} color="#f87171" />
                <span style={{ color: '#f87171', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Faults Detected
                </span>
              </div>
              <div style={styles.itemList}>
                {result.faults.map((fault, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.faultItem,
                      borderColor: expandedFault === i ? 'rgba(248,113,113,0.4)' : 'rgba(248,113,113,0.15)',
                      background: expandedFault === i ? 'rgba(248,113,113,0.07)' : 'rgba(248,113,113,0.03)',
                    }}
                    onClick={() => toggleFault(i)}
                  >
                    <div style={styles.faultRow}>
                      <div style={styles.faultNumber}>{i + 1}</div>
                      <p style={styles.faultText}>{fault}</p>
                      {expandedFault === i
                        ? <ChevronUp size={14} color="#6b7280" />
                        : <ChevronDown size={14} color="#6b7280" />
                      }
                    </div>
                    {expandedFault === i && result.suggestions[i] && (
                      <div style={styles.suggestionInline}>
                        <CheckCircle2 size={13} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={styles.suggestionInlineText}>{result.suggestions[i]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions Panel */}
            <div style={styles.panel}>
              <div style={styles.panelHeader}>
                <CheckCircle2 size={16} color="#4ade80" />
                <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Improvements
                </span>
              </div>
              <div style={styles.itemList}>
                {result.suggestions.map((sug, i) => (
                  <div key={i} style={styles.suggestionItem}>
                    <div style={styles.suggestionNumber}>{i + 1}</div>
                    <p style={styles.suggestionText}>{sug}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <p style={styles.disclaimer}>
            ✦ AI analysis is advisory. Always tailor suggestions to your experience and the specific job description.
          </p>
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    marginTop: '2rem',
    background: 'rgba(139, 92, 246, 0.04)',
    border: '1px solid rgba(139, 92, 246, 0.18)',
    borderRadius: '16px',
    padding: '1.5rem',
    backdropFilter: 'blur(8px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: 1.2,
  },
  headerSub: {
    color: '#9ca3af',
    fontSize: '0.75rem',
    marginTop: '2px',
  },
  enhanceBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.4rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.875rem',
    boxShadow: '0 0 20px rgba(139,92,246,0.35)',
    transition: 'all 0.2s ease',
    letterSpacing: '0.3px',
  },
  loadingBox: {
    marginTop: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.5rem',
  },
  loadingDots: {
    display: 'flex',
    gap: '0.4rem',
  },
  dot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#a855f7',
    animation: 'dotPulse 1.4s ease-in-out infinite',
  },
  loadingText: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  errorBox: {
    marginTop: '1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    padding: '0.9rem 1rem',
    borderRadius: '10px',
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.2)',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: '0.85rem',
    lineHeight: 1.5,
  },
  results: {
    marginTop: '1.25rem',
  },
  resultsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  roleTag: {
    color: '#c4b5fd',
    fontSize: '0.85rem',
    fontWeight: 600,
    background: 'rgba(139,92,246,0.12)',
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    border: '1px solid rgba(139,92,246,0.25)',
  },
  countBadge: {
    color: '#f87171',
    fontSize: '0.8rem',
    fontWeight: 600,
    background: 'rgba(248,113,113,0.1)',
    padding: '0.25rem 0.7rem',
    borderRadius: '999px',
    border: '1px solid rgba(248,113,113,0.2)',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  panel: {
    background: 'rgba(255,255,255,0.015)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  faultItem: {
    borderRadius: '8px',
    border: '1px solid',
    padding: '0.7rem 0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  faultRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
  },
  faultNumber: {
    flexShrink: 0,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(248,113,113,0.2)',
    color: '#f87171',
    fontSize: '0.7rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
  },
  faultText: {
    color: '#fca5a5',
    fontSize: '0.82rem',
    lineHeight: 1.5,
    margin: 0,
    flex: 1,
  },
  suggestionInline: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    marginTop: '0.6rem',
    paddingTop: '0.6rem',
    borderTop: '1px solid rgba(248,113,113,0.1)',
  },
  suggestionInlineText: {
    color: '#86efac',
    fontSize: '0.8rem',
    lineHeight: 1.5,
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    padding: '0.7rem 0.85rem',
    borderRadius: '8px',
    background: 'rgba(74,222,128,0.04)',
    border: '1px solid rgba(74,222,128,0.12)',
  },
  suggestionNumber: {
    flexShrink: 0,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(74,222,128,0.18)',
    color: '#4ade80',
    fontSize: '0.7rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
  },
  suggestionText: {
    color: '#86efac',
    fontSize: '0.82rem',
    lineHeight: 1.5,
    margin: 0,
  },
  disclaimer: {
    color: '#4b5563',
    fontSize: '0.75rem',
    textAlign: 'center',
    marginTop: '1.25rem',
    letterSpacing: '0.2px',
  },
};
