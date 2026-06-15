import { useState } from 'react';
import { BarChart3, Users, Award, Clock, ArrowLeft, TrendingUp, Zap, Sun, Moon, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme, Logo } from '../theme.jsx';
import { logoutHR } from './HRLogin';

const ANIM = `
@keyframes sidebarFadeIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:none} }
@keyframes indicatorGlow { 0%,100%{box-shadow:0 0 8px rgba(255,136,0,.5)} 50%{box-shadow:0 0 18px rgba(255,136,0,.9)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
`;

export default function Sidebar({ activeTab, setActiveTab, activeConfig, hrUser = {} }) {
  const navigate = useNavigate();
  const [hov, setHov] = useState(null);
  const { mode, toggle, T } = useTheme();

  const menuItems = [
    { id: 'analytics', label: 'Analytics',      icon: BarChart3, desc: 'Charts & metrics'   },
    { id: 'recruiter', label: 'Recruiter Panel', icon: Users,     desc: 'Candidates & config' },
  ];

  const st = S(T);
  return (
    <aside style={st.sidebar}>
      <style>{ANIM}</style>

      {/* Brand */}
      <div style={{ ...st.brand, animation: 'sidebarFadeIn .5s ease both' }}>
        <div style={st.logoWrap}>
          <Logo size={30} />
        </div>
        <div style={{ fontFamily: "'Outfit',sans-serif", lineHeight: 1 }}>
          <div style={{ fontWeight: 900, fontSize: '1.2rem', color: T.white, letterSpacing: '-.5px' }}>
            Screen<span style={{ color: T.orange }}>.AI</span>
          </div>
          <div style={{ fontSize: '.65rem', color: T.greyD, fontWeight: 500, letterSpacing: '.5px', textTransform: 'uppercase', marginTop: '1px' }}>HR Portal</div>
        </div>
      </div>

      <div style={st.divider} />

      {/* HR User profile card */}
      {hrUser?.full_name && (
        <div style={{ background:'rgba(255,136,0,.05)', border:`1px solid rgba(255,136,0,.15)`, borderRadius:'12px', padding:'.75rem .9rem', marginBottom:'.6rem', animation:'sidebarFadeIn .5s ease .12s both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
            <div style={{ width:'34px', height:'34px', borderRadius:'50%', background:'linear-gradient(135deg,#ff8800,#ffcc55)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'.9rem', color:'#fff', flexShrink:0 }}>
              {hrUser.full_name[0].toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ color:T.white, fontWeight:700, fontSize:'.85rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{hrUser.full_name}</div>
              <div style={{ color:T.greyD, fontSize:'.65rem', fontFamily:'monospace', marginTop:'1px' }}>{hrUser.hr_id}</div>
            </div>
          </div>
        </div>
      )}

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.45rem', padding: '.5rem .75rem', marginBottom: '.75rem', animation: 'sidebarFadeIn .5s ease .1s both' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: T.green, animation: 'pulse 2s ease-in-out infinite', boxShadow: `0 0 8px ${T.green}` }} />
        <span style={{ fontSize: '.72rem', color: T.grey, fontWeight: 500 }}>System live</span>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const on  = activeTab === item.id;
          const hovered = hov === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              onMouseEnter={() => setHov(item.id)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.75rem',
                padding: '.8rem .9rem', border: 'none', borderRadius: '12px',
                cursor: 'pointer', position: 'relative', textAlign: 'left',
                fontFamily: "'Outfit',sans-serif",
                background: on ? 'linear-gradient(135deg,rgba(255,136,0,.1),rgba(255,136,0,.04))' : hovered ? 'rgba(255,255,255,.03)' : 'transparent',
                border: `1px solid ${on ? 'rgba(255,136,0,.2)' : 'transparent'}`,
                transition: 'all .2s cubic-bezier(.4,0,.2,1)',
                animation: `sidebarFadeIn .4s ease ${.15 + i * .08}s both`,
                boxShadow: on ? '0 4px 20px rgba(255,136,0,.08)' : 'none',
              }}>
              {on && <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: '3px', background: T.orange, borderRadius: '0 3px 3px 0', animation: 'indicatorGlow 2s ease-in-out infinite' }} />}
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'rgba(255,136,0,.15)' : hovered ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.03)', border: `1px solid ${on ? 'rgba(255,136,0,.3)' : 'rgba(255,255,255,.06)'}`, transition: 'all .2s' }}>
                <Icon size={17} color={on ? T.orange : hovered ? T.offW : T.grey} />
              </div>
              <div>
                <div style={{ fontSize: '.9rem', fontWeight: on ? 700 : 500, color: on ? T.white : hovered ? T.offW : T.grey, transition: 'color .2s', lineHeight: 1.2 }}>{item.label}</div>
                <div style={{ fontSize: '.68rem', color: T.greyD, marginTop: '1px' }}>{item.desc}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <div style={{ flexGrow: 1 }} />

      {/* ── Theme toggle ── */}
      <button onClick={toggle}
        onMouseEnter={e => { e.currentTarget.style.background = mode === 'dark' ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'; e.currentTarget.style.borderColor = T.lineO; }}
        onMouseLeave={e => { e.currentTarget.style.background = mode === 'dark' ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.03)'; e.currentTarget.style.borderColor = T.line; }}
        style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.6rem .9rem', background: mode === 'dark' ? 'rgba(255,255,255,.03)' : 'rgba(0,0,0,.03)', border: `1px solid ${T.line}`, borderRadius: '10px', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: '.82rem', fontWeight: 600, color: T.grey, transition: 'all .2s', width: '100%', marginBottom: '.5rem', justifyContent: 'center', animation: 'sidebarFadeIn .5s ease .3s both' }}>
        {mode === 'dark'
          ? <><Sun size={14} color={T.orange} /> Light Mode</>
          : <><Moon size={14} color={T.orange} /> Dark Mode</>}
      </button>

      {/* Quick stats */}
      {activeConfig && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.75rem', animation: 'sidebarFadeIn .5s ease .35s both' }}>
          <div style={{ fontSize: '.68rem', color: T.greyD, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', padding: '0 .25rem' }}>Quick Stats</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.4rem' }}>
            {[
              { icon: TrendingUp, label: 'Role',   val: activeConfig.position ? activeConfig.position.split(' ')[0] : '—', color: T.orange },
              { icon: Zap,        label: 'Min Exp', val: activeConfig.experience > 0 ? `${activeConfig.experience}y` : 'Any', color: T.orangeL },
            ].map(st => (
              <div key={st.label} style={{ background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '10px', padding: '.6rem .7rem' }}>
                <div style={{ fontSize: '.62rem', color: T.greyD, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600 }}>{st.label}</div>
                <div style={{ fontSize: '.88rem', fontWeight: 800, color: st.color, marginTop: '2px', fontFamily: "'Outfit',sans-serif", letterSpacing: '-.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active config card */}
      {activeConfig?.position && (
        <div style={{ background: 'linear-gradient(135deg,rgba(255,136,0,.08),rgba(255,136,0,.03))', border: `1px solid rgba(255,136,0,.2)`, borderRadius: '14px', padding: '1rem', marginBottom: '.75rem', animation: 'sidebarFadeIn .5s ease .4s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.35rem', marginBottom: '.4rem' }}>
            <Award size={12} color={T.orange} />
            <span style={{ color: T.orange, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px' }}>Active Target</span>
          </div>
          <div style={{ color: T.white, fontWeight: 800, fontSize: '.95rem', lineHeight: 1.3 }}>{activeConfig.position}</div>
          {activeConfig.experience > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem', marginTop: '.35rem' }}>
              <Clock size={10} color={T.greyD} />
              <span style={{ color: T.greyD, fontSize: '.72rem' }}>Min {activeConfig.experience} yr{activeConfig.experience !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      <div style={st.divider} />

      {/* Back + Logout */}
      <div style={{ display:'flex', flexDirection:'column', gap:'.4rem' }}>
        <button onClick={() => navigate('/')}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,136,0,.06)'; e.currentTarget.style.borderColor = T.lineO; e.currentTarget.style.color = T.white; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.grey; }}
          style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.65rem 1rem', background: 'transparent', border: `1px solid ${T.line}`, borderRadius: '10px', fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", color: T.grey, transition: 'all .2s', width: '100%', animation: 'sidebarFadeIn .5s ease .45s both' }}>
          <ArrowLeft size={14} /> Back to Home
        </button>
        <button onClick={() => { logoutHR(); navigate('/hr-login', { replace: true }); }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,.35)'; e.currentTarget.style.color = T.red; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.line; e.currentTarget.style.color = T.grey; }}
          style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.65rem 1rem', background: 'transparent', border: `1px solid ${T.line}`, borderRadius: '10px', fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", color: T.grey, transition: 'all .2s', width: '100%', animation: 'sidebarFadeIn .5s ease .5s both' }}>
          <LogOut size={14} /> Logout
        </button>
      </div>
    </aside>
  );
}

const S = (T) => ({
  sidebar: {
    width: '240px', flexShrink: 0,
    background: T.bgCard,
    borderRight: `1px solid ${T.line}`,
    display: 'flex', flexDirection: 'column',
    padding: '1.5rem 1.1rem',
    height: '100vh', position: 'sticky', top: 0, zIndex: 100,
  },
  logoWrap: { width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,136,0,.08)', border: `1px solid rgba(255,136,0,.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brand:   { display: 'flex', alignItems: 'center', gap: '.65rem', marginBottom: '1.25rem' },
  divider: { height: '1px', background: T.line, margin: '.6rem 0' },
});
