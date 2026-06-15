import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BriefcaseBusiness, Eye, EyeOff, ShieldCheck,
  AlertCircle, ArrowLeft, UserPlus, LogIn, CheckCircle, Copy, User, Mail, Lock
} from 'lucide-react';
import { useTheme, Logo } from '../theme.jsx';
import { API_BASE_URL } from '../config';

/* ═══════════════════════════════════════════════════════
   SESSION HELPERS  (exported so App + Sidebar can use them)
   ═══════════════════════════════════════════════════════ */
const SESSION_KEY = 'hr_authenticated';
const SESSION_USER = 'hr_user';

export function isHRAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}
export function getHRUser() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_USER) || '{}'); }
  catch { return {}; }
}
export function logoutHR() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_USER);
}

/* ═══════════════════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
@keyframes hl-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
@keyframes hl-scaleIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
@keyframes hl-shake {
  0%,100%{transform:translateX(0)}
  15%{transform:translateX(-8px)} 30%{transform:translateX(8px)}
  45%{transform:translateX(-5px)} 60%{transform:translateX(5px)}
  75%{transform:translateX(-2px)} 90%{transform:translateX(2px)}
}
@keyframes hl-pulse-ring {
  0%  {box-shadow:0 0 0 0 rgba(255,136,0,.45)}
  70% {box-shadow:0 0 0 14px rgba(255,136,0,0)}
  100%{box-shadow:0 0 0 0 rgba(255,136,0,0)}
}
@keyframes hl-orb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,-35px)} }
@keyframes hl-orb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,45px)} }
@keyframes hl-success { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.1);opacity:1} 100%{transform:scale(1);opacity:1} }
@keyframes hl-tab-slide { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:none} }
`;

/* ═══════════════════════════════════════════════════════
   SHARED INPUT STYLE
   ═══════════════════════════════════════════════════════ */
function useInputStyle(T) {
  return {
    width: '100%', boxSizing: 'border-box',
    background: T.bgCard2, border: `1px solid ${T.line}`,
    borderRadius: '12px', color: T.white,
    padding: '.82rem 1rem', fontSize: '.95rem',
    fontFamily: "'Outfit',sans-serif", outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
  };
}

function Field({ label, icon: Icon, delay = '0s', children }) {
  const { T } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.38rem', animation: `hl-fadeUp .45s ease ${delay} both` }}>
      <label style={{ fontSize: '.7rem', fontWeight: 700, color: T.grey, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: '.3rem' }}>
        {Icon && <Icon size={11} color={T.greyD}/>} {label}
      </label>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   REGISTER FORM
   ═══════════════════════════════════════════════════════ */
function RegisterForm({ onSuccess, onSwitch }) {
  const { T } = useTheme();
  const iStyle = useInputStyle(T);

  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/hr/register`, { full_name: fullName, email, password });
      onSuccess(res.data.hr_id, fullName, email);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
      <Field label="Full Name" icon={User} delay=".1s">
        <input type="text" required placeholder="Jane Smith" value={fullName}
          onChange={e => setFullName(e.target.value)} style={iStyle}
          onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
          onBlur={e  => { e.target.style.borderColor = T.line;   e.target.style.boxShadow = 'none'; }}/>
      </Field>

      <Field label="Email Address" icon={Mail} delay=".15s">
        <input type="email" required placeholder="hr@company.com" value={email}
          onChange={e => setEmail(e.target.value)} style={iStyle}
          onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
          onBlur={e  => { e.target.style.borderColor = T.line;   e.target.style.boxShadow = 'none'; }}/>
      </Field>

      <Field label="Password" icon={Lock} delay=".2s">
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} required placeholder="Min 6 characters" value={password}
            onChange={e => setPassword(e.target.value)} style={{ ...iStyle, paddingRight: '3rem' }}
            onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
            onBlur={e  => { e.target.style.borderColor = T.line;   e.target.style.boxShadow = 'none'; }}/>
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: 'absolute', right: '.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {showPw ? <EyeOff size={16} color={T.greyD}/> : <Eye size={16} color={T.greyD}/>}
          </button>
        </div>
      </Field>

      <Field label="Confirm Password" icon={Lock} delay=".25s">
        <input type="password" required placeholder="Re-enter password" value={confirm}
          onChange={e => setConfirm(e.target.value)} style={iStyle}
          onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
          onBlur={e  => { e.target.style.borderColor = T.line;   e.target.style.boxShadow = 'none'; }}/>
      </Field>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.7rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.25)', color: T.red, fontSize: '.83rem', animation: 'hl-scaleIn .3s ease both' }}>
          <AlertCircle size={14}/> {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,136,0,.5)'; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,136,0,.3)'; }}
        style={{ marginTop: '.3rem', padding: '.9rem', background: loading ? 'rgba(255,136,0,.5)' : T.btnGrad, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '.95rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 20px rgba(255,136,0,.3)', transition: 'transform .2s, box-shadow .2s', animation: 'hl-fadeUp .45s ease .3s both' }}>
        {loading ? 'Creating Account…' : 'Create HR Account →'}
      </button>

      <p style={{ textAlign: 'center', color: T.grey, fontSize: '.83rem', margin: 0, animation: 'hl-fadeUp .45s ease .35s both' }}>
        Already have an account?{' '}
        <button type="button" onClick={onSwitch}
          style={{ background: 'none', border: 'none', color: T.orange, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: '.83rem', padding: 0 }}>
          Sign in
        </button>
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════
   SUCCESS SCREEN (shows generated HR ID)
   ═══════════════════════════════════════════════════════ */
function SuccessScreen({ hrId, fullName, onGoLogin }) {
  const { T } = useTheme();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hrId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', textAlign: 'center', animation: 'hl-scaleIn .5s cubic-bezier(.16,1,.3,1) both' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'hl-success .6s ease both' }}>
        <CheckCircle size={34} color={T.green}/>
      </div>
      <div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: T.white, letterSpacing: '-.5px' }}>Account Created!</div>
        <div style={{ color: T.grey, fontSize: '.88rem', marginTop: '.3rem' }}>Welcome, {fullName}. Save your HR ID below.</div>
      </div>

      {/* HR ID display */}
      <div style={{ width: '100%', background: 'rgba(255,136,0,.07)', border: `1px solid ${T.lineO}`, borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
        <div style={{ fontSize: '.68rem', color: T.orange, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.5rem' }}>Your HR ID (save this!)</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: T.white, letterSpacing: '1px' }}>{hrId}</span>
          <button onClick={copy}
            style={{ display: 'flex', alignItems: 'center', gap: '.3rem', background: copied ? 'rgba(34,197,94,.1)' : 'rgba(255,136,0,.1)', border: `1px solid ${copied ? 'rgba(34,197,94,.35)' : T.lineO}`, borderRadius: '8px', padding: '.35rem .75rem', cursor: 'pointer', color: copied ? T.green : T.orange, fontSize: '.75rem', fontWeight: 700, fontFamily: "'Outfit',sans-serif", transition: 'all .2s' }}>
            {copied ? <CheckCircle size={13}/> : <Copy size={13}/>}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '10px', padding: '.75rem 1rem', width: '100%' }}>
        <p style={{ margin: 0, color: T.red, fontSize: '.8rem', lineHeight: 1.5 }}>
          ⚠ You will need this HR ID to log in. It cannot be recovered if lost.
        </p>
      </div>

      <button onClick={onGoLogin}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(255,136,0,.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,136,0,.3)'; }}
        style={{ width: '100%', padding: '.9rem', background: T.btnGrad, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '.95rem', fontWeight: 800, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 20px rgba(255,136,0,.3)', transition: 'transform .2s, box-shadow .2s' }}>
        Go to Login →
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOGIN FORM
   ═══════════════════════════════════════════════════════ */
function LoginForm({ onSuccess, onSwitch }) {
  const { T } = useTheme();
  const iStyle = useInputStyle(T);

  const [email,    setEmail]   = useState('');
  const [password,setPassword]= useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [shake,   setShake]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/hr/login`, { email: email.trim(), password });
      onSuccess(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Please try again.';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '.9rem',
      animation: shake ? 'hl-shake .55s ease both' : 'hl-tab-slide .35s ease both' }}>

      <Field label="Email Address" icon={Mail} delay=".1s">
        <input type="email" required placeholder="hr@company.com" value={email}
          onChange={e => setEmail(e.target.value)} style={iStyle}
          onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
          onBlur={e  => { e.target.style.borderColor = T.line;   e.target.style.boxShadow = 'none'; }}/>
      </Field>

      <Field label="Password" icon={Lock} delay=".16s">
        <div style={{ position: 'relative' }}>
          <input type={showPw ? 'text' : 'password'} required placeholder="••••••••" value={password}
            onChange={e => setPassword(e.target.value)} style={{ ...iStyle, paddingRight: '3rem' }}
            onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
            onBlur={e  => { e.target.style.borderColor = T.line;   e.target.style.boxShadow = 'none'; }}/>
          <button type="button" onClick={() => setShowPw(v => !v)}
            style={{ position: 'absolute', right: '.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {showPw ? <EyeOff size={16} color={T.greyD}/> : <Eye size={16} color={T.greyD}/>}
          </button>
        </div>
      </Field>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.7rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.25)', color: T.red, fontSize: '.83rem', animation: 'hl-scaleIn .3s ease both' }}>
          <AlertCircle size={14}/> {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,136,0,.5)'; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,136,0,.3)'; }}
        style={{ marginTop: '.3rem', padding: '.9rem', background: loading ? 'rgba(255,136,0,.5)' : T.btnGrad, border: 'none', borderRadius: '12px', color: '#fff', fontSize: '.95rem', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 20px rgba(255,136,0,.3)', transition: 'transform .2s, box-shadow .2s', animation: 'hl-fadeUp .45s ease .25s both' }}>
        {loading ? 'Signing in…' : 'Access HR Dashboard →'}
      </button>

      <p style={{ textAlign: 'center', color: T.grey, fontSize: '.83rem', margin: 0, animation: 'hl-fadeUp .45s ease .3s both' }}>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitch}
          style={{ background: 'none', border: 'none', color: T.orange, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontSize: '.83rem', padding: 0 }}>
          Create one
        </button>
      </p>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT EXPORT
   ═══════════════════════════════════════════════════════ */
export default function HRLogin() {
  const navigate = useNavigate();
  const { T, mode } = useTheme();

  // 'login' | 'register' | 'success'
  const [view,        setView]        = useState('login');
  const [newHrId,     setNewHrId]     = useState('');
  const [newFullName, setNewFullName] = useState('');

  const handleRegisterSuccess = (hrId, fullName) => {
    setNewHrId(hrId);
    setNewFullName(fullName);
    setView('success');
  };

  const handleLoginSuccess = (userData) => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    sessionStorage.setItem(SESSION_USER, JSON.stringify(userData));
    navigate('/hr', { replace: true });
  };

  const pageBg = mode === 'dark'
    ? `radial-gradient(ellipse 80% 60% at 30% 40%, rgba(255,136,0,.12) 0%, transparent 60%),
       radial-gradient(ellipse 60% 50% at 80% 70%, rgba(255,170,51,.08) 0%, transparent 55%),
       url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='rgba(255,136,0,0.2)'/%3E%3C/svg%3E")`
    : `radial-gradient(ellipse 80% 60% at 30% 40%, rgba(255,136,0,.15) 0%, transparent 60%),
       radial-gradient(ellipse 60% 50% at 80% 70%, rgba(255,170,51,.10) 0%, transparent 55%),
       url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='rgba(160,80,0,0.15)'/%3E%3C/svg%3E")`;

  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: T.bg, backgroundImage: pageBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: "'Outfit',sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{STYLES}</style>

      {/* Orbs */}
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', top:'-15%', left:'-10%', background:'radial-gradient(circle,rgba(255,136,0,.09) 0%,transparent 70%)', animation:'hl-orb1 14s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', bottom:'-10%', right:'-8%', background:'radial-gradient(circle,rgba(255,170,51,.07) 0%,transparent 70%)', animation:'hl-orb2 18s ease-in-out infinite', pointerEvents:'none' }}/>

      {/* Back */}
      <button onClick={() => navigate('/')}
        onMouseEnter={e => { e.currentTarget.style.borderColor = T.lineO; e.currentTarget.style.color = T.white; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = T.line;  e.currentTarget.style.color = T.grey; }}
        style={{ position:'absolute', top:'1.5rem', left:'1.5rem', display:'flex', alignItems:'center', gap:'.4rem', background:'transparent', border:`1px solid ${T.line}`, borderRadius:'9px', color:T.grey, fontSize:'.82rem', fontWeight:500, padding:'.42rem .95rem', cursor:'pointer', transition:'all .2s', animation:'hl-fadeUp .5s ease both' }}>
        <ArrowLeft size={13}/> Home
      </button>

      {/* Card */}
      <div style={{ width:'100%', maxWidth: view === 'register' ? '460px' : '420px', position:'relative', zIndex:1,
        background: mode === 'dark' ? 'linear-gradient(145deg,#141414,#0f0f0f)' : 'linear-gradient(145deg,#ffffff,#f5f2ed)',
        border:`1px solid ${T.lineO}`, borderRadius:'28px', padding:'2.5rem',
        boxShadow: mode === 'dark' ? '0 40px 90px rgba(0,0,0,.8),0 0 0 1px rgba(255,136,0,.07)' : '0 40px 90px rgba(0,0,0,.15),0 0 0 1px rgba(255,136,0,.12)',
        animation:'hl-scaleIn .55s cubic-bezier(.16,1,.3,1) both',
        transition: 'max-width .35s ease' }}>

        {view !== 'success' && (
          <>
            {/* Logo + title */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.85rem', marginBottom:'1.75rem' }}>
              <div style={{ width:'62px', height:'62px', borderRadius:'50%', background:'rgba(255,136,0,.1)', border:`1px solid rgba(255,136,0,.28)`, display:'flex', alignItems:'center', justifyContent:'center', animation:'hl-pulse-ring 2.5s ease-in-out infinite' }}>
                <Logo size={34}/>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontWeight:900, fontSize:'1.5rem', color:T.white, letterSpacing:'-.5px', lineHeight:1.1 }}>
                  {view === 'login' ? 'HR Portal Login' : 'Create HR Account'}
                </div>
                <div style={{ color:T.grey, fontSize:'.85rem', marginTop:'.35rem' }}>
                  {view === 'login' ? 'Sign in to access the recruitment dashboard' : 'Register to get your unique HR ID'}
                </div>
              </div>
            </div>

            {/* Tab switcher */}
            <div style={{ display:'flex', background:T.bgCard2, borderRadius:'12px', padding:'4px', marginBottom:'1.5rem', border:`1px solid ${T.line}` }}>
              {[['login','Sign In', LogIn],['register','Register', UserPlus]].map(([key, label, Icon]) => (
                <button key={key} type="button" onClick={() => setView(key)}
                  style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem', padding:'.55rem', borderRadius:'9px', border:'none', cursor:'pointer', fontFamily:"'Outfit',sans-serif", fontSize:'.85rem', fontWeight:700, transition:'all .2s',
                    background: view === key ? T.btnGrad : 'transparent',
                    color:      view === key ? '#fff' : T.grey,
                    boxShadow:  view === key ? '0 2px 12px rgba(255,136,0,.3)' : 'none' }}>
                  <Icon size={14}/> {label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Content */}
        {view === 'login'    && <LoginForm    onSuccess={handleLoginSuccess} onSwitch={() => setView('register')}/>}
        {view === 'register' && <RegisterForm onSuccess={handleRegisterSuccess} onSwitch={() => setView('login')}/>}
        {view === 'success'  && <SuccessScreen hrId={newHrId} fullName={newFullName} onGoLogin={() => setView('login')}/>}

        {/* Default admin hint — only on login view */}
        {view === 'login' && (
          <div style={{ marginTop:'1.25rem', background:'rgba(255,136,0,.05)', border:`1px solid ${T.lineO}`, borderRadius:'10px', padding:'.75rem 1rem', animation:'hl-fadeUp .5s ease .4s both' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'.4rem', marginBottom:'.4rem' }}>
              <ShieldCheck size={12} color={T.orange}/>
              <span style={{ fontSize:'.67rem', fontWeight:700, color:T.orange, textTransform:'uppercase', letterSpacing:'.4px' }}>Default Admin Account</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'.2rem .65rem', fontSize:'.8rem' }}>
              <span style={{ color:T.greyD, fontWeight:600 }}>Email</span>
              <span style={{ color:T.white, fontFamily:'monospace', fontWeight:700 }}>admin@screenai.com</span>
              <span style={{ color:T.greyD, fontWeight:600 }}>Password</span>
              <span style={{ color:T.white, fontFamily:'monospace', fontWeight:700 }}>Admin@1234</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
