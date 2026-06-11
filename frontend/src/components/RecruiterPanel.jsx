import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Sliders, Search, Eye, FileDown, X, Check, XCircle, AlertCircle, Loader2, FileText } from 'lucide-react';

export default function RecruiterPanel({ activeConfig, onConfigChange }) {
  const [position, setPosition] = useState('');
  const [experience, setExperience] = useState('0');
  const [candidates, setCandidates] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [submittingConfig, setSubmittingConfig] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewMode, setViewMode] = useState('document'); // 'document' | 'text'
  useEffect(() => {
    if (activeConfig) {
      setPosition(activeConfig.position || '');
      setExperience(String(activeConfig.experience || 0));
    }
    fetchCandidates();
  }, [activeConfig]);

  const fetchCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const res = await axios.get(`${API_BASE_URL}/api/candidates?t=${new Date().getTime()}`);
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!position) {
      setMessage({ type: 'error', text: 'Please select a job position.' });
      return;
    }

    try {
      setSubmittingConfig(true);
      const res = await axios.post(`${API_BASE_URL}/api/config`, {
        position,
        experience: parseInt(experience) || 0,
      });
      setMessage({ type: 'success', text: res.data.message });
      onConfigChange(); // Notify App.jsx to refresh config
      fetchCandidates();
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update recruitment target.',
      });
    } finally {
      setSubmittingConfig(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  // Filter candidates based on selected category filter and search input
  const filteredCandidates = candidates.filter((cand) => {
    const matchesCategory =
      filterCategory === 'ALL' || (cand.category || '').toLowerCase() === filterCategory.toLowerCase();
    const matchesSearch =
      (cand.Name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cand.Email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cand.matched_skills || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animated-view" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      
      {/* Page Header */}
      <div style={styles.header}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0 }}>
          🎯 Recruiter Dashboard
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>
          Configure recruitment parameters and inspect candidate profiles.
        </p>
      </div>

      <div style={styles.layoutGrid}>
        
        {/* Left Side: Recruitment Configuration */}
        <div style={styles.leftCol}>
          <div className="glass-card" style={{ height: 'fit-content' }}>
            <div style={styles.cardHeader}>
              <Sliders size={20} color="#8b5cf6" />
              <h3 style={styles.cardTitle}>Configure Recruitment Target</h3>
            </div>
            
            <form onSubmit={handleSaveConfig} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Required Job Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="form-select"
                >
                  <option value="">-- Choose Position --</option>
                  {activeConfig?.available_positions?.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Minimum Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="form-input"
                  placeholder="e.g. 2"
                />
              </div>

              {message.text && (
                <div
                  style={{
                    ...styles.alert,
                    backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: message.type === 'success' ? '#10b981' : '#ef4444',
                  }}
                >
                  <AlertCircle size={16} />
                  <span>{message.text}</span>
                </div>
              )}

              <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }} disabled={submittingConfig}>
                {submittingConfig ? 'Saving...' : 'Set Role & Update Filter'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Candidate Listings */}
        <div style={styles.rightCol}>
          <div className="glass-card">
            
            {/* Filter and Search Bar */}
            <div style={styles.filterBar}>
              <div style={styles.searchBox}>
                <Search size={18} color="#6b7280" />
                <input
                  type="text"
                  placeholder="Search by name, email, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.filterSelectContainer}>
                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Filter category:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-select"
                  style={{ padding: '0.4rem 2rem 0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  <option value="ALL">All Categories</option>
                  {activeConfig?.available_positions?.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
              {loadingCandidates ? (
                <div style={styles.loadingWrapper}>
                  <Loader2 style={styles.spinner} size={32} />
                  <p style={{ color: '#9ca3af' }}>Retrieving candidates...</p>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9ca3af' }}>
                  No candidates found matching the active filters.
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Score</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((cand) => (
                      <tr key={cand.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{cand.Name}</div>
                        </td>
                        <td style={styles.td}>{cand.Email}</td>
                        <td style={styles.td}>
                          <span style={{ fontWeight: 700, color: '#a855f7' }}>{cand.score.toFixed(1)}%</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>{cand.category}</span>
                        </td>
                        <td style={styles.td}>
                          <span
                            className={`badge ${cand.status === 'Selected' ? 'badge-success' : 'badge-danger'}`}
                          >
                            {cand.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{cand.location}</span>
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => setSelectedCandidate(cand)}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.3rem' }}
                          >
                            <Eye size={14} />
                            <span>Report</span>
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

      {/* Candidate Report Modal overlay */}
      {selectedCandidate && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div>
                <h2 style={{ margin: 0, color: '#fff' }}>📋 Selection Report: {selectedCandidate.Name}</h2>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                  Algorithmic and semantic evaluation breakdown.
                </p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              <div style={styles.reportGrid}>
                
                {/* Left side of Modal: KPI breakdown */}
                <div style={styles.reportOverview}>
                  <div className="glass-card" style={styles.overviewScoreCard}>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#9ca3af' }}>Match Score</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a855f7', marginTop: '0.5rem' }}>
                      {selectedCandidate.score.toFixed(1)}%
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Status:</span>
                      <span className={`badge ${selectedCandidate.status === 'Selected' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '0.4rem 1rem' }}>
                        {selectedCandidate.status}
                      </span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Categorized As:</span>
                      <span style={{ ...styles.categoryBadge, fontSize: '0.85rem', padding: '0.3rem 0.6rem' }}>{selectedCandidate.category}</span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Location:</span>
                      <span style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedCandidate.location}</span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Email:</span>
                      <span style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedCandidate.Email}</span>
                    </div>

                    <div style={styles.metaRow}>
                      <span style={styles.metaLabel}>Phone:</span>
                      <span style={{ color: '#fff', fontSize: '0.9rem' }}>{selectedCandidate.phone || 'N/A'}</span>
                    </div>

                    {selectedCandidate.urls && (
                      <div style={{ ...styles.metaRow, flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                        <span style={styles.metaLabel}>Links & Portfolios:</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', width: '100%', marginTop: '0.2rem' }}>
                          {selectedCandidate.urls.split(',').filter(Boolean).map((url, idx) => {
                            let label = url;
                            if (url.includes('linkedin.com')) label = 'LinkedIn Profile';
                            else if (url.includes('github.com')) label = 'GitHub Profile';
                            else {
                              try {
                                label = new URL(url).hostname;
                              } catch(e) {
                                label = 'Portfolio Link';
                              }
                            }
                            return (
                              <a 
                                key={idx} 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ color: '#a855f7', fontSize: '0.85rem', textDecoration: 'underline', wordBreak: 'break-all', display: 'inline-block' }}
                              >
                                🔗 {label}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Reasoning Block */}
                  <div className="glass-card" style={styles.reasoningBox}>
                    <h4 style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      💡 AI Match Analysis
                    </h4>
                    <p style={{ color: '#ddd', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                      {selectedCandidate.reasoning}
                    </p>
                  </div>

                  {/* Matched and Missing Skills */}
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', marginBottom: '0.4rem' }}>
                        Matched Required Skills:
                      </div>
                      <div className="pill-container">
                        {selectedCandidate.matched_skills ? (
                          selectedCandidate.matched_skills.split(',').map((skill) => (
                            <span key={skill} className="skill-pill skill-pill-matched">
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>None</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.4rem' }}>
                        Missing Required Skills:
                      </div>
                      <div className="pill-container">
                        {activeConfig?.skills ? (
                          activeConfig.skills
                            .split(',')
                            .map(s => s.trim())
                            .filter(s => s && !(selectedCandidate.matched_skills || '').toLowerCase().includes(s.toLowerCase()))
                            .map((skill) => (
                              <span key={skill} className="skill-pill skill-pill-missing">
                                {skill}
                              </span>
                            ))
                        ) : (
                          <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>None</span>
                        )}
                        {activeConfig?.skills && 
                          activeConfig.skills
                            .split(',')
                            .map(s => s.trim())
                            .filter(s => s && !(selectedCandidate.matched_skills || '').toLowerCase().includes(s.toLowerCase()))
                            .length === 0 && (
                              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>None</span>
                            )
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side of Modal: Resume PDF view */}
                <div style={styles.resumeContainer}>
                  <div style={styles.resumeHeader}>
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem', borderRadius: '8px' }}>
                      <button 
                        onClick={() => setViewMode('document')}
                        style={{ ...styles.toggleBtn, ...(viewMode === 'document' ? styles.toggleBtnActive : {}) }}
                      >
                        <FileDown size={14} /> Preview
                      </button>
                      <button 
                        onClick={() => setViewMode('text')}
                        style={{ ...styles.toggleBtn, ...(viewMode === 'text' ? styles.toggleBtnActive : {}) }}
                      >
                        <FileText size={14} /> Extracted Text
                      </button>
                    </div>

                    <a
                      href={`${API_BASE_URL}/api/candidates/${selectedCandidate.id}/resume`}
                      download
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', gap: '0.4rem' }}
                    >
                      <FileDown size={14} />
                      <span>Download</span>
                    </a>
                  </div>
                  
                  {viewMode === 'document' ? (
                    <iframe
                      src={`${API_BASE_URL}/api/candidates/${selectedCandidate.id}/resume`}
                      style={styles.pdfIframe}
                      title="Resume Document"
                    />
                  ) : (
                    <div style={styles.extractedTextContainer}>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#d1d5db', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {selectedCandidate.extracted_text || "No extracted text available for this candidate."}
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

const styles = {
  header: {
    marginBottom: '0.5rem',
    textAlign: 'left',
  },
  layoutGrid: {
    display: 'flex',
    gap: '2rem',
    width: '100%',
  },
  leftCol: {
    width: '320px',
    flexShrink: 0,
  },
  rightCol: {
    flexGrow: 1,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '0.85rem',
    marginTop: '1rem',
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '1rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '0.4rem 0.8rem',
    width: '260px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    outline: 'none',
    fontSize: '0.9rem',
    width: '100%',
    fontFamily: "'Outfit', sans-serif",
  },
  filterSelectContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '0.75rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    borderBottom: '2px solid rgba(255, 255, 255, 0.08)',
  },
  tr: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '1rem',
    fontSize: '0.9rem',
    color: '#d1d5db',
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '4rem 1rem',
  },
  spinner: {
    animation: 'spin 1.5s linear infinite',
    color: '#8b5cf6',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '2rem',
  },
  modalContent: {
    width: '1100px',
    maxWidth: '100%',
    maxHeight: '90vh',
    background: '#11131c',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
    animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#9ca3af',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalBody: {
    padding: '2rem',
    overflowY: 'auto',
    flexGrow: 1,
  },
  reportGrid: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '2rem',
    height: '100%',
  },
  reportOverview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  overviewScoreCard: {
    textAlign: 'center',
    padding: '1.5rem',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    paddingBottom: '0.5rem',
  },
  metaLabel: {
    fontSize: '0.85rem',
    color: '#9ca3af',
  },
  reasoningBox: {
    marginTop: '1rem',
    padding: '1.25rem',
    background: 'rgba(139, 92, 246, 0.03)',
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  resumeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%',
    minHeight: '550px',
  },
  resumeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pdfIframe: {
    width: '100%',
    flexGrow: 1,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    background: '#1f2028',
  },
  extractedTextContainer: {
    width: '100%',
    flexGrow: 1,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    background: '#1f2028',
    padding: '1.5rem',
    overflowY: 'auto',
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  toggleBtnActive: {
    background: 'rgba(139, 92, 246, 0.2)',
    color: '#a855f7',
  }
};
