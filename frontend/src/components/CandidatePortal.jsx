import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { UploadCloud, FileText, CheckCircle, XCircle, AlertCircle, Sparkles, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import CVEnhancer from './CVEnhancer';
import { useNavigate } from 'react-router-dom';

export default function CandidatePortal({ activeConfig, onApplicationSuccess }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [parsing, setParsing] = useState(false);
  const [extractedUrls, setExtractedUrls] = useState('');

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const parseFileDetails = async (selectedFile) => {
    try {
      setParsing(true);
      setError('');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const res = await axios.post(`${API_BASE_URL}/api/parse`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (res.data.success) {
        const { name, email: parsedEmail, phone, urls } = res.data;
        if (name) setFullName(name);
        if (parsedEmail) setEmail(parsedEmail);
        if (phone) setMobile(phone);
        if (urls) setExtractedUrls(urls);
      }
    } catch (err) {
      console.error("Error auto-parsing resume:", err);
    } finally {
      setParsing(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (['pdf', 'docx', 'txt'].includes(ext)) {
      setFile(selectedFile);
      setError('');
      parseFileDetails(selectedFile);
    } else {
      setError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !fullName || !location || !file) {
      setError('Please fill in all mandatory fields and upload your resume.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('fullName', fullName);
      formData.append('mobile', mobile);
      formData.append('location', location);
      formData.append('urls', extractedUrls);
      formData.append('file', file);

      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(res.data);
      if (res.data.success) {
        onApplicationSuccess(); // Refreshes recruiter analytics
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An error occurred during resume analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setFullName('');
    setMobile('');
    setLocation('');
    setFile(null);
    setResult(null);
    setError('');
    setExtractedUrls('');
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="animated-view" style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Portal Header */}
      <div style={styles.header}>
        {/* Back button */}
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          <ArrowLeft size={14} />
          <span>Switch Portal</span>
        </button>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0, textAlign: 'center' }}>
          🔮 AI Candidate Portal
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.25rem', textAlign: 'center' }}>
          Upload your CV to verify matching alignment with the active job role.
        </p>
      </div>

      {/* Required Role Banner */}
      {activeConfig && (
        <div style={styles.reqBox}>
          <div style={styles.reqHeader}>Current Open Recruitment Target</div>
          <div style={styles.reqRole}>📋 {activeConfig.position || 'Not Set'}</div>
          {activeConfig.skills && (
            <div style={styles.reqKeywords}>
              <strong>Required Keywords:</strong> {activeConfig.skills}
            </div>
          )}
        </div>
      )}

      {/* Main Container */}
      <div className="glass-card" style={{ marginTop: '2.5rem' }}>
        
        {loading ? (
          /* Analyzing State */
          <div style={styles.loadingWrapper}>
            <Loader2 style={styles.spinner} size={54} />
            <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Analyzing Resume Details...</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '300px' }}>
              Extracing document texts, comparing key technical metrics, and calculating matching cosine similarity...
            </p>
          </div>
        ) : result ? (
          /* Screening Results Feedback View */
          <div style={styles.resultContainer} className="animated-view">
            
            {result.success ? (
              /* Scenario A & C: Pre-screening result: Selected / Rejected */
              <div>
                {result.data.status === 'Selected' ? (
                  <div style={{ ...styles.statusBanner, background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}>
                    <CheckCircle size={24} />
                    <span>PRE-SCREENING RESULT: SELECTED FOR REVIEW</span>
                  </div>
                ) : (
                  <div style={{ ...styles.statusBanner, background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>
                    <XCircle size={24} />
                    <span>PRE-SCREENING RESULT: REJECTED</span>
                  </div>
                )}

                {/* Score Cards */}
                <div className="grid-2" style={{ margin: '2rem 0', gap: '1rem' }}>
                  <div style={styles.metricCard}>
                    <div style={styles.metricLabel}>AI Categorized Role</div>
                    <div style={{ ...styles.metricValue, color: '#f59e0b', fontSize: '1.1rem' }}>
                      {result.data.category}
                    </div>
                  </div>

                  <div style={styles.metricCard}>
                    <div style={styles.metricLabel}>AI Confidence</div>
                    <div style={{ ...styles.metricValue, color: result.data.confidenceScore >= 60 ? '#10b981' : '#f59e0b' }}>
                      {result.data.confidenceScore?.toFixed(1) ?? 'N/A'}%
                    </div>
                  </div>

                  <div style={styles.metricCard}>
                    <div style={styles.metricLabel}>Keyword Match</div>
                    <div style={{ ...styles.metricValue, color: '#fff' }}>
                      {result.data.keywordScore.toFixed(1)}%
                    </div>
                  </div>

                  <div style={styles.metricCard}>
                    <div style={styles.metricLabel}>Semantic Similarity</div>
                    <div style={{ ...styles.metricValue, color: '#10b981' }}>
                      {result.data.semanticScore.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Experience & Mixed Profile Indicators */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
                  {result.data.experienceYears !== undefined && (
                    <div style={{
                      ...styles.infoBadge,
                      borderColor: result.data.experienceMeetsRequirement ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)',
                      color: result.data.experienceMeetsRequirement ? '#10b981' : '#f59e0b',
                      background: result.data.experienceMeetsRequirement ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                    }}>
                      {result.data.experienceMeetsRequirement ? '✓' : '⚠'} Experience Detected: {result.data.experienceYears} yr{result.data.experienceYears !== 1 ? 's' : ''}
                    </div>
                  )}
                  {result.data.secondaryCategory && (
                    <div style={{ ...styles.infoBadge, borderColor: 'rgba(139,92,246,0.4)', color: '#a78bfa', background: 'rgba(139,92,246,0.08)' }}>
                      ⚡ Mixed Profile: also matches {result.data.secondaryCategory} ({result.data.secondaryConfidence?.toFixed(1)}%)
                    </div>
                  )}
                </div>

                {/* Skills Breakdown Grid */}
                <div className="grid-2" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                  <div style={styles.skillsBox}>
                    <h4 style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                      Matched Required Skills
                    </h4>
                    <div className="pill-container">
                      {result.data.matchedSkills.length > 0 ? (
                        result.data.matchedSkills.map((s) => (
                          <span key={s} className="skill-pill skill-pill-matched">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>None matched</span>
                      )}
                    </div>
                  </div>

                  <div style={styles.skillsBox}>
                    <h4 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                      Missing Required Skills
                    </h4>
                    <div className="pill-container">
                      {result.data.missingSkills.length > 0 ? (
                        result.data.missingSkills.map((s) => (
                          <span key={s} className="skill-pill skill-pill-missing">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>None missing</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Reasoning Text */}
                <div style={styles.reasoningBox}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 600 }}>
                    <Sparkles size={16} color="#8b5cf6" />
                    <span>AI Reasoning Analysis</span>
                  </div>
                  <p style={{ color: '#d1d5db', fontSize: '0.92rem', marginTop: '0.6rem', lineHeight: '1.5' }}>
                    {result.data.reasoning}
                  </p>
                </div>
              </div>
            ) : (
              /* Scenario B: Role Category Mismatch failure */
              <div style={{ padding: '1rem 0', textAlign: 'left' }}>
                <div style={{ ...styles.statusBanner, background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                  <XCircle size={24} />
                  <span>APPLICATION SUBMISSION FAILED</span>
                </div>
                
                <div style={styles.mismatchAlert}>
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>Role Category Mismatch</h4>
                  <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.4' }}>
                    The AI screening model classified your resume as <strong>{result.data?.category}</strong>, but the department is currently filtering specifically for <strong>{activeConfig?.position?.toUpperCase()}</strong>.
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.8rem' }}>
                    Your applicant credentials were not recorded because your profile category did not align with this target role requirement.
                  </p>
                </div>
              </div>
            )}

            <button onClick={handleReset} className="btn" style={{ marginTop: '2rem', gap: '0.5rem' }}>
              <RefreshCw size={16} />
              <span>Submit Another Application</span>
            </button>

          </div>
        ) : (
          /* Resume Upload Registration Form */
          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              Candidate Application Details
            </h3>

            <div className="grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Mobile Phone</label>
                <input
                  type="tel"
                  placeholder="e.g. +923001234567"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Location (City, Country) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lahore, Pakistan"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Resume File (PDF, DOCX, TXT) *</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`dropzone ${dragging ? 'active' : ''}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.txt"
                />
                
                {file ? (
                  <>
                    <FileText size={42} color="#8b5cf6" style={{ animation: 'bounce 2s infinite' }} />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>{file.name}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {parsing ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a855f7' }}>
                            <Loader2 style={{ animation: 'spin 1.5s linear infinite', color: '#a855f7' }} size={14} /> Auto-extracting details...
                          </span>
                        ) : (
                          <span>{(file.size / 1024).toFixed(1)} KB (Parsed successfully)</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <UploadCloud size={42} color="#9ca3af" />
                    <div>
                      <div style={{ color: '#fff', fontWeight: 600 }}>
                        Drag & drop file here, or <span style={{ color: '#8b5cf6' }}>browse</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                        Supported formats: PDF, DOCX, TXT (Max size 10MB)
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div style={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn" style={{ width: '200px' }}>
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>

      {/* CV Enhancer — shown below form when a file is selected and no result yet */}
      {file && !result && !loading && (
        <CVEnhancer file={file} activeConfig={activeConfig} />
      )}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  backBtn: {
    display: 'flex',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.9rem',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#6b7280',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    marginBottom: '0.5rem',
    transition: 'all 0.2s ease',
  },
  reqBox: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
  },
  reqHeader: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#10b981',
    fontWeight: '700',
    letterSpacing: '0.75px',
    marginBottom: '4px',
  },
  reqRole: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
  },
  reqKeywords: {
    fontSize: '0.85rem',
    color: '#d1d5db',
    marginTop: '0.5rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  loadingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '3rem 1rem',
    textAlign: 'center',
  },
  spinner: {
    animation: 'spin 1.5s linear infinite',
    color: '#8b5cf6',
  },
  resultContainer: {
    padding: '0.5rem 0',
    textAlign: 'center',
  },
  statusBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '0.85rem',
    borderRadius: '8px',
    border: '1px solid',
    fontWeight: '800',
    fontSize: '0.9rem',
    letterSpacing: '0.5px',
  },
  metricCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '10px',
    padding: '1.25rem',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '10px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '0.4rem',
  },
  metricValue: {
    fontSize: '1.6rem',
    fontWeight: '800',
  },
  skillsBox: {
    background: 'rgba(255,255,255,0.01)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '1.25rem',
  },
  reasoningBox: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(139, 92, 246, 0.03)',
    border: '1px solid rgba(139, 92, 246, 0.1)',
    borderRadius: '12px',
    textAlign: 'left',
  },
  mismatchAlert: {
    marginTop: '1.5rem',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    background: 'rgba(239, 68, 68, 0.03)',
    padding: '1.5rem',
    borderRadius: '12px',
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    fontSize: '0.85rem',
    marginTop: '1.5rem',
  },
  infoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.9rem',
    borderRadius: '999px',
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.2px',
  },
};
