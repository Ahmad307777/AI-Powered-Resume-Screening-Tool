import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BriefcaseBusiness, ArrowRight, ShieldCheck } from 'lucide-react';

export default function PortalSelect() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.page}>
      {/* Ambient glows */}
      <div style={styles.glowLeft} />
      <div style={styles.glowRight} />

      <div style={styles.container} className="animated-view">
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.brandIcon}>🔮</span>
          <span style={styles.brandMain}>Screen</span>
          <span style={styles.brandAccent}>.AI</span>
        </div>

        <h1 style={styles.heading}>
          <span className="gradient-text">Select Your Portal</span>
        </h1>
        <p style={styles.subheading}>
          Choose how you'd like to continue
        </p>

        {/* Portal Cards */}
        <div style={styles.cards}>

          {/* Candidate Card */}
          <button
            style={{
              ...styles.card,
              ...(hovered === 'candidate' ? styles.cardHovered : {}),
              borderColor: hovered === 'candidate'
                ? 'rgba(139,92,246,0.55)'
                : 'rgba(255,255,255,0.08)',
              boxShadow: hovered === 'candidate'
                ? '0 0 40px rgba(139,92,246,0.18), 0 20px 40px rgba(0,0,0,0.4)'
                : '0 10px 30px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={() => setHovered('candidate')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate('/candidate')}
          >
            <div style={{ ...styles.iconRing, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <Users size={36} color="#a855f7" strokeWidth={1.5} />
            </div>

            <div style={styles.cardBody}>
              <div style={styles.cardTitle}>Candidate Portal</div>
              <div style={styles.cardDesc}>
                Upload your resume, check alignment with the active job role, and get AI-powered CV improvement feedback.
              </div>
            </div>

            <div style={styles.cardFeatures}>
              <span style={{ ...styles.featurePill, borderColor: 'rgba(139,92,246,0.25)', color: '#c4b5fd', background: 'rgba(139,92,246,0.08)' }}>Resume Upload</span>
              <span style={{ ...styles.featurePill, borderColor: 'rgba(139,92,246,0.25)', color: '#c4b5fd', background: 'rgba(139,92,246,0.08)' }}>AI Screening</span>
              <span style={{ ...styles.featurePill, borderColor: 'rgba(139,92,246,0.25)', color: '#c4b5fd', background: 'rgba(139,92,246,0.08)' }}>CV Enhancer</span>
            </div>

            <div style={{
              ...styles.cardCta,
              color: hovered === 'candidate' ? '#a855f7' : '#6b7280',
            }}>
              <span>Enter Portal</span>
              <ArrowRight size={16} style={{
                transform: hovered === 'candidate' ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform 0.2s ease',
              }} />
            </div>
          </button>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine} />
          </div>

          {/* HR Card */}
          <button
            style={{
              ...styles.card,
              ...(hovered === 'hr' ? styles.cardHovered : {}),
              borderColor: hovered === 'hr'
                ? 'rgba(16,185,129,0.55)'
                : 'rgba(255,255,255,0.08)',
              boxShadow: hovered === 'hr'
                ? '0 0 40px rgba(16,185,129,0.14), 0 20px 40px rgba(0,0,0,0.4)'
                : '0 10px 30px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={() => setHovered('hr')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => navigate('/hr')}
          >
            <div style={{ ...styles.iconRing, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)' }}>
              <BriefcaseBusiness size={36} color="#10b981" strokeWidth={1.5} />
            </div>

            <div style={styles.cardBody}>
              <div style={styles.cardTitle}>HR Portal</div>
              <div style={styles.cardDesc}>
                Configure job requirements, review candidates, manage the recruitment pipeline, and view analytics.
              </div>
            </div>

            <div style={styles.cardFeatures}>
              <span style={{ ...styles.featurePill, borderColor: 'rgba(16,185,129,0.25)', color: '#6ee7b7', background: 'rgba(16,185,129,0.07)' }}>Analytics</span>
              <span style={{ ...styles.featurePill, borderColor: 'rgba(16,185,129,0.25)', color: '#6ee7b7', background: 'rgba(16,185,129,0.07)' }}>Recruiter Panel</span>
              <span style={{ ...styles.featurePill, borderColor: 'rgba(16,185,129,0.25)', color: '#6ee7b7', background: 'rgba(16,185,129,0.07)' }}>Candidate Review</span>
            </div>

            <div style={{
              ...styles.cardCta,
              color: hovered === 'hr' ? '#10b981' : '#6b7280',
            }}>
              <span>Enter Portal</span>
              <ArrowRight size={16} style={{
                transform: hovered === 'hr' ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform 0.2s ease',
              }} />
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div style={styles.footer}>
          <ShieldCheck size={13} color="#4b5563" />
          <span>All data is processed locally — no data leaves your server</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0b10',
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem',
  },
  glowLeft: {
    position: 'absolute',
    top: '20%',
    left: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowRight: {
    position: 'absolute',
    bottom: '10%',
    right: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    maxWidth: '860px',
    position: 'relative',
    zIndex: 1,
  },
  brand: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.4rem',
    marginBottom: '0.5rem',
  },
  brandIcon: {
    fontSize: '2rem',
  },
  brandMain: {
    fontWeight: 800,
    fontSize: '1.8rem',
    color: '#fff',
    letterSpacing: '-0.5px',
    fontFamily: "'Outfit', sans-serif",
  },
  brandAccent: {
    fontWeight: 800,
    fontSize: '1.8rem',
    color: '#a855f7',
    fontFamily: "'Outfit', sans-serif",
  },
  heading: {
    fontSize: '2.8rem',
    fontWeight: 800,
    textAlign: 'center',
    lineHeight: 1.1,
    margin: 0,
  },
  subheading: {
    color: '#6b7280',
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  cards: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '0',
    width: '100%',
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: '260px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '2.5rem 2rem',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
    backdropFilter: 'blur(12px)',
    textAlign: 'center',
  },
  cardHovered: {
    background: 'rgba(255,255,255,0.04)',
    transform: 'translateY(-4px)',
  },
  iconRing: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  cardTitle: {
    color: '#fff',
    fontSize: '1.35rem',
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  cardDesc: {
    color: '#9ca3af',
    fontSize: '0.875rem',
    lineHeight: 1.6,
    maxWidth: '280px',
  },
  cardFeatures: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
    justifyContent: 'center',
  },
  featurePill: {
    fontSize: '0.72rem',
    fontWeight: 600,
    padding: '0.25rem 0.65rem',
    borderRadius: '999px',
    border: '1px solid',
    letterSpacing: '0.2px',
  },
  cardCta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'color 0.2s ease',
    marginTop: 'auto',
  },
  divider: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0 1.25rem',
  },
  dividerLine: {
    width: '1px',
    flex: 1,
    background: 'rgba(255,255,255,0.07)',
  },
  dividerText: {
    color: '#4b5563',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#4b5563',
    fontSize: '0.78rem',
    marginTop: '1rem',
  },
};
