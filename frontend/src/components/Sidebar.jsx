import { useState } from 'react';
import { BarChart3, Users, Award, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { T, Logo } from '../theme.jsx';

export default function Sidebar({ activeTab, setActiveTab, activeConfig }) {
  const navigate = useNavigate();
  const [hovBtn, setHovBtn] = useState(false);

  const menuItems = [
    { id: 'analytics', label: 'Analytics',       icon: BarChart3 },
    { id: 'recruiter', label: 'Recruiter Panel',  icon: Users },
  ];

  return (
    <aside style={S.sidebar}>
      {/* Brand */}
      <div style={S.brand}>
        <Logo size={34} />
        <div style={{ fontFamily: "'Outfit',sans-serif" }}>
          <span style={S.brandMain}>Screen</span>
          <span style={S.brandAccent}>.AI</span>
        </div>
      </div>

      {/* Divider */}
      <div style={S.divider} />

      {/* Nav */}
      <nav style={S.nav}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const on = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ ...S.navBtn, ...(on ? S.navBtnActive : {}) }}>
              {on && <div style={S.indicator} />}
              <div style={{ ...S.iconBox, background: on ? 'rgba(255,136,0,.12)' : 'transparent', border: `1px solid ${on ? 'rgba(255,136,0,.25)' : 'transparent'}` }}>
                <Icon size={18} color={on ? T.orange : T.grey} />
              </div>
              <span style={{ color: on ? T.white : T.grey, transition: 'color .2s' }}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flexGrow: 1 }} />

      {/* Active config card */}
      {activeConfig && (
        <div style={S.configCard}>
          <div style={S.configTag}>
            <Award size={12} color={T.orange} />
            <span style={{ color: T.orange, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px' }}>Active Target</span>
          </div>
          <div style={{ color: T.white, fontWeight: 700, fontSize: '1rem', marginTop: '.35rem' }}>
            {activeConfig.position || 'Not Set'}
          </div>
          {activeConfig.experience > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', marginTop: '.3rem' }}>
              <Clock size={11} color={T.grey} />
              <span style={{ color: T.grey, fontSize: '12px' }}>≥ {activeConfig.experience} yrs experience</span>
            </div>
          )}
        </div>
      )}

      <div style={S.divider} />

      {/* Back button */}
      <button onClick={() => navigate('/')}
        onMouseEnter={() => setHovBtn(true)}
        onMouseLeave={() => setHovBtn(false)}
        style={{ ...S.backBtn, borderColor: hovBtn ? T.lineO : T.line, color: hovBtn ? T.offW : T.grey }}>
        <ArrowLeft size={14} color={hovBtn ? T.orangeL : T.grey} />
        <span>Back to Home</span>
      </button>
    </aside>
  );
}

const S = {
  sidebar: {
    width: '260px', flexShrink: 0,
    background: T.bgCard,
    borderRight: `1px solid ${T.line}`,
    display: 'flex', flexDirection: 'column',
    padding: '1.75rem 1.25rem',
    height: '100vh', position: 'sticky', top: 0, zIndex: 100,
  },
  brand: { display: 'flex', alignItems: 'center', gap: '.65rem', marginBottom: '1.5rem' },
  brandMain: { fontWeight: 800, fontSize: '1.3rem', color: T.white, letterSpacing: '-.4px' },
  brandAccent: { fontWeight: 800, fontSize: '1.3rem', color: T.orange },
  divider: { height: '1px', background: T.line, margin: '.75rem 0' },
  nav: { display: 'flex', flexDirection: 'column', gap: '.3rem', marginTop: '.5rem' },
  navBtn: {
    display: 'flex', alignItems: 'center', gap: '.75rem',
    padding: '.7rem .85rem', background: 'transparent', border: 'none',
    borderRadius: '10px', cursor: 'pointer', position: 'relative',
    fontFamily: "'Outfit',sans-serif", fontSize: '.92rem', fontWeight: 500,
    textAlign: 'left', transition: 'background .2s',
  },
  navBtnActive: { background: 'rgba(255,136,0,.06)' },
  indicator: {
    position: 'absolute', left: 0, top: '20%', height: '60%',
    width: '3px', background: T.orange, borderRadius: '0 3px 3px 0',
    boxShadow: `0 0 10px rgba(255,136,0,.6)`,
  },
  iconBox: { width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 },
  configCard: {
    background: T.bgCard2, border: `1px solid ${T.lineO}`,
    borderRadius: '12px', padding: '1rem', marginBottom: '.75rem',
  },
  configTag: { display: 'flex', alignItems: 'center', gap: '.35rem' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '.5rem',
    padding: '.65rem 1rem', background: 'transparent',
    border: `1px solid ${T.line}`, borderRadius: '10px',
    fontSize: '.82rem', fontWeight: 500, cursor: 'pointer',
    fontFamily: "'Outfit',sans-serif", transition: 'all .2s', width: '100%',
  },
};
