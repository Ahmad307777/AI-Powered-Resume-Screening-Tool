import React from 'react';
import { BarChart3, Users, Award, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ activeTab, setActiveTab, activeConfig }) {
  const navigate = useNavigate();
  const menuItems = [
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'recruiter', label: 'Recruiter Panel', icon: Users },
  ];

  return (
    <div style={styles.sidebar}>
      {/* Brand logo */}
      <div style={styles.brand}>
        <div style={styles.brandIcon}>🔮</div>
        <div style={styles.brandText}>
          <span style={styles.brandMain}>Screen</span>
          <span style={styles.brandSub}>.AI</span>
        </div>
      </div>

      {/* Nav links */}
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              }}
            >
              <Icon size={20} color={isActive ? '#a855f7' : '#9ca3af'} />
              <span>{item.label}</span>
              {isActive && <div style={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* Back to portal select */}
      <button
        onClick={() => navigate('/')}
        style={styles.backBtn}
      >
        <ArrowLeft size={15} color="#6b7280" />
        <span>Switch Portal</span>
      </button>

      {/* Config summary card at footer */}
      {activeConfig && (
        <div style={styles.footerConfig}>
          <div style={styles.configHeader}>
            <Award size={14} color="#10b981" />
            <span style={styles.configHeaderText}>Active Recruitment Target</span>
          </div>
          <div style={styles.configRole}>{activeConfig.position || 'Not Set'}</div>
          {activeConfig.experience > 0 && (
            <div style={styles.configExp}>
              <Clock size={12} color="#9ca3af" />
              <span>≥ {activeConfig.experience} Years Exp Required</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: '#11131c',
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.5rem',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '3rem',
    paddingLeft: '0.5rem',
  },
  brandIcon: {
    fontSize: '2rem',
    textShadow: '0 0 10px rgba(139, 92, 246, 0.4)',
  },
  brandText: {
    display: 'flex',
    alignItems: 'baseline',
    fontFamily: "'Outfit', sans-serif",
  },
  brandMain: {
    fontWeight: '800',
    fontSize: '1.4rem',
    letterSpacing: '-0.5px',
    color: '#fff',
  },
  brandSub: {
    fontWeight: '800',
    fontSize: '1.4rem',
    color: '#a855f7',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flexGrow: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.85rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '10px',
    color: '#9ca3af',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.95rem',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    color: '#fff',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '25%',
    height: '50%',
    width: '4px',
    backgroundColor: '#a855f7',
    borderRadius: '0 4px 4px 0',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.8)',
  },
  footerConfig: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  configHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  configHeaderText: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#10b981',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  configRole: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
  },
  configExp: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '12px',
    color: '#9ca3af',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    marginBottom: '0.75rem',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    color: '#6b7280',
    fontSize: '0.82rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.2s ease',
    width: '100%',
  },
};
