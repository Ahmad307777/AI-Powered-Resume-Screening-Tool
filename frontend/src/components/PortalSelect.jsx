import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BriefcaseBusiness, ArrowRight, ShieldCheck,
  FileText, Brain, Sparkles, Menu, X, ChevronRight,
  Upload, CheckCircle, Zap, TrendingUp, Sun, Moon
} from 'lucide-react';
import { useTheme, Logo as SharedLogo } from '../theme.jsx';

/* ═══════════════════════════════════════════════════════
   GLOBAL KEYFRAMES
   ═══════════════════════════════════════════════════════ */
const ANIM_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');

@keyframes lp-fadeUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:none} }
@keyframes lp-fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes lp-scaleIn  { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
@keyframes lp-slideLeft{ from{opacity:0;transform:translateX(50px)} to{opacity:1;transform:none} }
@keyframes lp-slideRight{from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:none}}

@keyframes lp-float {
  0%,100%{transform:translateY(0) rotate(0deg)}
  33%    {transform:translateY(-18px) rotate(1.5deg)}
  66%    {transform:translateY(-8px) rotate(-1deg)}
}
@keyframes lp-float2 {
  0%,100%{transform:translateY(0) rotate(0deg)}
  50%    {transform:translateY(-22px) rotate(-2deg)}
}
@keyframes lp-pulse-ring {
  0%  {transform:scale(.95);box-shadow:0 0 0 0 rgba(255,136,0,.5)}
  70% {transform:scale(1);  box-shadow:0 0 0 14px rgba(255,136,0,0)}
  100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(255,136,0,0)}
}
@keyframes lp-spin-slow { to{transform:rotate(360deg)} }
@keyframes lp-orb1 {
  0%,100%{transform:translate(0,0) scale(1)}
  33%    {transform:translate(60px,-40px) scale(1.15)}
  66%    {transform:translate(-30px,50px) scale(.9)}
}
@keyframes lp-orb2 {
  0%,100%{transform:translate(0,0) scale(1)}
  40%    {transform:translate(-70px,30px) scale(1.2)}
  70%    {transform:translate(40px,-50px) scale(.85)}
}
@keyframes lp-orb3 {
  0%,100%{transform:translate(0,0)}
  50%    {transform:translate(50px,60px)}
}
@keyframes lp-shimmer {
  from{background-position:-200% 0}
  to  {background-position: 200% 0}
}
@keyframes lp-gradient-shift {
  0%  {background-position:0%   50%}
  50% {background-position:100% 50%}
  100%{background-position:0%   50%}
}
@keyframes lp-blink { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes lp-progress {
  from{width:0%}
  to  {width:var(--w)}
}
@keyframes lp-count-badge {
  0%  {transform:scale(1)}
  50% {transform:scale(1.08)}
  100%{transform:scale(1)}
}
@keyframes lp-particle {
  0%  {transform:translateY(0) translateX(0);  opacity:.8}
  100%{transform:translateY(-120px) translateX(var(--dx,20px)); opacity:0}
}
@keyframes lp-card-glow {
  0%,100%{box-shadow:0 40px 90px rgba(0,0,0,.85),0 0 0 1px rgba(255,136,0,.08),0 0 40px rgba(255,136,0,.08)}
  50%    {box-shadow:0 40px 90px rgba(0,0,0,.85),0 0 0 1px rgba(255,136,0,.18),0 0 80px rgba(255,136,0,.18)}
}
@keyframes lp-step-line {
  from{width:0%}
  to  {width:100%}
}
@keyframes lp-badge-pop {
  0%  {transform:scale(0) rotate(-10deg);opacity:0}
  60% {transform:scale(1.12) rotate(2deg);opacity:1}
  100%{transform:scale(1) rotate(0deg);opacity:1}
}
@keyframes lp-icon-bounce {
  0%,100%{transform:translateY(0)}
  40%    {transform:translateY(-6px)}
  60%    {transform:translateY(-3px)}
}

/* Responsive */
@media(max-width:768px){
  .lp-nav-links,.lp-nav-cta{display:none!important}
  .lp-hamburger{display:flex!important}
}
@media(min-width:769px){
  .lp-hamburger{display:none!important}
}
`;

/* ═══════════════════════════════════════════════════════
   THEME HOOK
   ═══════════════════════════════════════════════════════ */
function useC() {
  const { T, mode } = useTheme();
  return {
    black:   T.bg,    white:   T.white,  offW:    T.offW,
    grey:    T.grey,  greyD:   T.greyD,  orange:  T.orange,
    orangeL: T.orangeL, card: T.bgCard,  card2:   T.bgCard2,
    line:    T.line,  lineO:   T.lineO,  btnGrad: T.btnGrad,
    txtGrad: T.txtGrad, mode,
  };
}

function Logo({ size = 34 }) { return <SharedLogo size={size} />; }

/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */
function useFade(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* Animated number counter */
function useCounter(target, duration = 1400, trigger = true) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) { setVal(target); return; }
    const steps = 60;
    const inc = num / steps;
    let cur = 0; let frame = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + inc, num);
      frame++;
      setVal(cur % 1 === 0 ? Math.round(cur) : cur.toFixed(1));
      if (frame >= steps) { setVal(target); clearInterval(id); }
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration, trigger]);
  return val;
}

/* Typewriter */
function useTypewriter(words, speed = 75, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [wIdx, setWIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[wIdx];
    const delay = del ? speed / 2 : speed;
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(word.slice(0, cIdx + 1));
        if (cIdx + 1 === word.length) setTimeout(() => setDel(true), pause);
        else setCIdx(c => c + 1);
      } else {
        setDisplay(word.slice(0, cIdx - 1));
        if (cIdx - 1 === 0) { setDel(false); setWIdx(i => (i + 1) % words.length); setCIdx(0); }
        else setCIdx(c => c - 1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [cIdx, del, wIdx, words, speed, pause]);
  return display;
}

/* ═══════════════════════════════════════════════════════
   FLOATING ORBS BACKGROUND
   ═══════════════════════════════════════════════════════ */
function FloatingOrbs({ mode }) {
  const orbs = [
    { size: 500, top: '-10%',  left: '-10%', color: mode === 'dark' ? 'rgba(255,136,0,.09)' : 'rgba(255,136,0,.13)', anim: 'lp-orb1 18s ease-in-out infinite' },
    { size: 400, top: '40%',   right: '-8%', color: mode === 'dark' ? 'rgba(255,170,51,.07)' : 'rgba(255,136,0,.10)', anim: 'lp-orb2 22s ease-in-out infinite' },
    { size: 300, bottom: '-5%',left: '30%',  color: mode === 'dark' ? 'rgba(255,100,0,.06)' : 'rgba(224,112,0,.08)', anim: 'lp-orb3 16s ease-in-out infinite' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {orbs.map((o, i) => (
        <div key={i} style={{
          position: 'absolute', width: o.size, height: o.size, borderRadius: '50%',
          background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
          top: o.top, left: o.left, right: o.right, bottom: o.bottom,
          animation: o.anim, willChange: 'transform',
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PARTICLES BURST (hero only)
   ═══════════════════════════════════════════════════════ */
function HeroParticles() {
  const pts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    top:  `${10 + Math.random() * 80}%`,
    size: Math.random() * 3 + 2,
    dur:  `${4 + Math.random() * 6}s`,
    delay:`${Math.random() * 6}s`,
    dx:   `${(Math.random() - .5) * 60}px`,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {pts.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.left, top: p.top,
          width: p.size, height: p.size, borderRadius: '50%',
          background: 'rgba(255,136,0,.6)',
          '--dx': p.dx,
          animation: `lp-particle ${p.dur} ease-in ${p.delay} infinite`,
        }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════ */
function Navbar() {
  const [mob, setMob] = useState(false);
  const [up, setUp]   = useState(false);
  const [entered, setEntered] = useState(false);
  const C = useC();
  const { toggle, mode } = useTheme();

  useEffect(() => {
    setTimeout(() => setEntered(true), 100);
    const fn = () => setUp(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMob(false); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      height: '64px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 6vw',
      background: up ? (mode === 'dark' ? 'rgba(8,8,8,.96)' : 'rgba(245,245,240,.96)') : 'transparent',
      borderBottom: `1px solid ${up ? C.line : 'transparent'}`,
      backdropFilter: up ? 'blur(20px)' : 'none',
      transition: 'background .35s, border-color .35s',
      opacity: entered ? 1 : 0,
      transform: entered ? 'none' : 'translateY(-16px)',
      // transition already covers this
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', cursor: 'default',
        animation: 'lp-slideRight .6s ease .1s both' }}>
        <Logo size={34}/>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: C.white, letterSpacing: '-.4px' }}>
          Screen<span style={{ color: C.orange }}>.AI</span>
        </span>
      </div>

      {/* Links */}
      <div className="lp-nav-links" style={{ display: 'flex', gap: '.15rem', animation: 'lp-fadeIn .6s ease .2s both' }}>
        {[['features','Features'],['how-it-works','How It Works'],['get-started','Portals']].map(([id, lbl]) => (
          <button key={id} onClick={() => go(id)}
            onMouseEnter={e => e.currentTarget.style.color = C.white}
            onMouseLeave={e => e.currentTarget.style.color = C.grey}
            style={{ background: 'none', border: 'none', color: C.grey, fontSize: '.92rem', fontWeight: 500, padding: '.5rem 1rem', cursor: 'pointer', borderRadius: '8px', fontFamily: "'Outfit',sans-serif", transition: 'color .2s' }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Right: toggle + CTA */}
      <div className="lp-nav-cta" style={{ display: 'flex', alignItems: 'center', gap: '.6rem', animation: 'lp-slideLeft .6s ease .15s both' }}>
        <button onClick={toggle}
          title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onMouseEnter={e => { e.currentTarget.style.background = mode === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'; e.currentTarget.style.borderColor = C.orange; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.line; }}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'9px', background:'transparent', border:`1px solid ${C.line}`, cursor:'pointer', transition:'background .2s, border-color .2s, transform .2s' }}>
          {mode === 'dark' ? <Sun size={16} color={C.orange}/> : <Moon size={16} color={C.orange}/>}
        </button>
        <button onClick={() => go('get-started')}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px) scale(1.03)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(255,136,0,.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(255,136,0,.35)'; }}
          style={{ background: C.btnGrad, border:'none', borderRadius:'9px', color:'#fff', fontSize:'.88rem', fontWeight:700, padding:'.58rem 1.3rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", display:'flex', alignItems:'center', gap:'.3rem', boxShadow:'0 4px 20px rgba(255,136,0,.35)', transition:'transform .2s, box-shadow .2s' }}>
          Get Started <ChevronRight size={15}/>
        </button>
      </div>

      {/* Hamburger */}
      <button onClick={() => setMob(o => !o)} className="lp-hamburger"
        style={{ display:'none', background:'none', border:'none', cursor:'pointer', padding:'.2rem' }}>
        {mob ? <X size={24} color={C.white}/> : <Menu size={24} color={C.white}/>}
      </button>

      {mob && (
        <div style={{ position:'absolute', top:'64px', left:0, right:0,
          background: mode === 'dark' ? 'rgba(8,8,8,.97)' : 'rgba(245,245,240,.97)',
          backdropFilter:'blur(20px)', borderBottom:`1px solid ${C.line}`,
          display:'flex', flexDirection:'column', padding:'1rem 6vw',
          animation: 'lp-fadeUp .25s ease both' }}>
          {[['features','Features'],['how-it-works','How It Works'],['get-started','Portals']].map(([id,lbl]) => (
            <button key={id} onClick={() => go(id)}
              style={{ background:'none', border:'none', borderBottom:`1px solid ${C.line}`, color:C.offW, fontSize:'1rem', fontWeight:500, padding:'.85rem 0', cursor:'pointer', textAlign:'left', fontFamily:"'Outfit',sans-serif" }}>
              {lbl}
            </button>
          ))}
          <button onClick={toggle}
            style={{ background:'none', border:'none', borderBottom:`1px solid ${C.line}`, color:C.offW, fontSize:'1rem', fontWeight:500, padding:'.85rem 0', cursor:'pointer', textAlign:'left', fontFamily:"'Outfit',sans-serif", display:'flex', alignItems:'center', gap:'.5rem' }}>
            {mode === 'dark' ? <Sun size={16} color={C.orange}/> : <Moon size={16} color={C.orange}/>}
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   MINI SVG RING
   ═══════════════════════════════════════════════════════ */
function MiniRing({ pct, color, size = 54 }) {
  const r = 22; const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="5"/>
      <circle cx="27" cy="27" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${(pct/100)*circ} ${circ}`} strokeLinecap="round"
        style={{ filter:`drop-shadow(0 0 5px ${color}99)`, transition:'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1) .4s' }}/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO MOCK CARD
   ═══════════════════════════════════════════════════════ */
function HeroMockCard() {
  const C = useC();
  const skills  = ['Python','Django','FastAPI','SQL','Docker'];
  const missing = ['Kubernetes','Redis'];

  return (
    <div style={{ position:'relative', width:'380px', flexShrink:0, fontFamily:"'Outfit',sans-serif",
      animation:'lp-slideLeft .9s cubic-bezier(.16,1,.3,1) .4s both' }}>

      {/* Glow halo */}
      <div style={{ position:'absolute', inset:'-60px', borderRadius:'50%',
        background:'radial-gradient(circle,rgba(255,136,0,.28) 0%,transparent 65%)',
        pointerEvents:'none', zIndex:0, animation:'lp-pulse-ring 3s ease-in-out infinite' }}/>

      {/* Main card */}
      <div style={{ position:'relative', zIndex:1,
        background: C.mode==='dark'
          ? 'linear-gradient(145deg,#161616 0%,#0f0f0f 100%)'
          : 'linear-gradient(145deg,#ffffff 0%,#f5f2ed 100%)',
        border:`1px solid ${C.lineO}`, borderRadius:'24px', padding:'1.75rem',
        animation:'lp-card-glow 4s ease-in-out infinite' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.25rem' }}>
          <div style={{ width:'46px', height:'46px', borderRadius:'50%',
            background:'linear-gradient(135deg,#ff8800,#ffcc55)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontWeight:900, fontSize:'1.1rem', color:'#fff', flexShrink:0,
            boxShadow:'0 4px 14px rgba(255,136,0,.45)',
            animation:'lp-pulse-ring 2.5s ease-in-out infinite' }}>J</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:C.white, fontWeight:800, fontSize:'1rem' }}>John Doe</div>
            <div style={{ color:C.grey, fontSize:'.75rem', marginTop:'1px' }}>Python Developer · Lahore, PK</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'.3rem', background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.3)', borderRadius:'999px', padding:'.22rem .65rem', flexShrink:0,
            animation:'lp-count-badge 2s ease-in-out infinite' }}>
            <CheckCircle size={11} color="#22c55e"/>
            <span style={{ color:'#22c55e', fontSize:'.68rem', fontWeight:700 }}>Selected</span>
          </div>
        </div>

        <div style={{ height:'1px', background:C.line, marginBottom:'1.25rem' }}/>

        {/* Score rings */}
        <div style={{ display:'flex', justifyContent:'space-around', marginBottom:'1.25rem' }}>
          {[
            { label:'Role Match', pct:92, color:'#ff8800' },
            { label:'Keywords',   pct:87, color:'#ffaa33' },
            { label:'Semantic',   pct:89, color:'#22c55e' },
          ].map(({ label, pct, color }, i) => (
            <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem',
              animation:`lp-scaleIn .5s ease ${.5 + i*.12}s both` }}>
              <div style={{ position:'relative', width:'54px', height:'54px' }}>
                <MiniRing pct={pct} color={color}/>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:900, color }}>{pct}%</div>
              </div>
              <span style={{ fontSize:'.62rem', color:C.grey, textTransform:'uppercase', letterSpacing:'.4px' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Skill pills */}
        <div style={{ marginBottom:'1.1rem' }}>
          <div style={{ fontSize:'.68rem', color:C.grey, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'.5rem', fontWeight:600 }}>Matched Skills</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.35rem' }}>
            {skills.map((s, i) => (
              <span key={s} style={{ fontSize:'.7rem', fontWeight:700, padding:'.22rem .6rem', borderRadius:'6px',
                background:'rgba(34,197,94,.1)', border:'1px solid rgba(34,197,94,.28)', color:'#22c55e',
                animation:`lp-fadeUp .4s ease ${.7 + i*.07}s both` }}>{s}</span>
            ))}
            {missing.map((s, i) => (
              <span key={s} style={{ fontSize:'.7rem', fontWeight:700, padding:'.22rem .6rem', borderRadius:'6px',
                background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', color:'#ef4444',
                animation:`lp-fadeUp .4s ease ${1 + i*.07}s both` }}>{s}</span>
            ))}
          </div>
        </div>

        {/* AI reasoning */}
        <div style={{ background:'rgba(255,136,0,.06)', border:`1px solid ${C.lineO}`, borderRadius:'10px', padding:'.75rem 1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.4rem', marginBottom:'.3rem' }}>
            <Brain size={12} color={C.orange} style={{ animation:'lp-icon-bounce 2s ease-in-out infinite' }}/>
            <span style={{ fontSize:'.65rem', fontWeight:700, color:C.orange, textTransform:'uppercase', letterSpacing:'.4px' }}>AI Reasoning</span>
          </div>
          <p style={{ margin:0, fontSize:'.72rem', color:C.grey, lineHeight:1.55 }}>
            Strong alignment detected: 92% keyword match. Candidate qualifies for senior Python Developer role.
          </p>
        </div>
      </div>

      {/* Badge top-right */}
      <div style={{ position:'absolute', top:'-16px', right:'-12px', zIndex:2,
        display:'flex', alignItems:'center', gap:'.35rem',
        background: C.mode==='dark' ? '#1a1a1a' : '#fff',
        border:`1px solid rgba(255,136,0,.4)`, borderRadius:'999px',
        padding:'.38rem .85rem', boxShadow:'0 6px 24px rgba(0,0,0,.5)',
        animation:'lp-badge-pop .6s cubic-bezier(.16,1,.3,1) .9s both' }}>
        <TrendingUp size={13} color={C.orange}/>
        <span style={{ color:C.orangeL, fontSize:'.72rem', fontWeight:700 }}>500+ screened</span>
      </div>

      {/* Badge bottom-left */}
      <div style={{ position:'absolute', bottom:'-14px', left:'-12px', zIndex:2,
        display:'flex', alignItems:'center', gap:'.4rem',
        background: C.mode==='dark' ? '#1a1a1a' : '#fff',
        border:'1px solid rgba(34,197,94,.35)', borderRadius:'999px',
        padding:'.38rem .85rem', boxShadow:'0 6px 24px rgba(0,0,0,.5)',
        animation:'lp-badge-pop .6s cubic-bezier(.16,1,.3,1) 1.1s both' }}>
        <Zap size={13} color="#22c55e"/>
        <span style={{ color:'#22c55e', fontSize:'.72rem', fontWeight:700 }}>Analyzed in 2.1s</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════ */
function Hero({ onApply, onHR }) {
  const C = useC();
  const typed = useTypewriter(['AI-Powered Screening','Instant Match Scores','Smart CV Feedback','Hire in Seconds']);

  const heroBg = C.mode === 'dark'
    ? `radial-gradient(ellipse 70% 80% at 10% 50%, rgba(255,136,0,.18) 0%, transparent 55%),
       radial-gradient(ellipse 50% 60% at 90% 15%, rgba(255,170,51,.12) 0%, transparent 50%),
       radial-gradient(ellipse 40% 40% at 60% 90%, rgba(255,100,0,.08) 0%, transparent 50%),
       url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='rgba(255,136,0,0.25)'/%3E%3C/svg%3E")`
    : `radial-gradient(ellipse 70% 80% at 10% 50%, rgba(255,136,0,.22) 0%, transparent 55%),
       radial-gradient(ellipse 50% 60% at 90% 15%, rgba(255,170,51,.15) 0%, transparent 50%),
       radial-gradient(ellipse 40% 40% at 60% 90%, rgba(255,100,0,.10) 0%, transparent 50%),
       url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='rgba(160,80,0,0.18)'/%3E%3C/svg%3E")`;

  return (
    <section style={{
      width:'100%', minHeight:'100vh',
      backgroundColor: C.black,
      backgroundImage: heroBg,
      backgroundRepeat: 'repeat',
      display:'flex', alignItems:'center',
      padding:'100px 6vw 60px',
      position:'relative', overflow:'hidden',
    }}>
      <HeroParticles/>

      <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'4rem', flexWrap:'wrap', position:'relative', zIndex:1 }}>

        {/* LEFT */}
        <div style={{ flex:'1 1 420px', maxWidth:'640px' }}>

          {/* Typewriter badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'.5rem',
            background:'rgba(255,136,0,.1)', border:`1px solid rgba(255,136,0,.3)`,
            borderRadius:'999px', padding:'.38rem 1rem', marginBottom:'1.6rem',
            animation:'lp-fadeUp .6s ease .1s both' }}>
            <Zap size={13} color={C.orange} style={{ animation:'lp-icon-bounce 1.8s ease-in-out infinite' }}/>
            <span style={{ color:C.orangeL, fontSize:'.78rem', fontWeight:700, letterSpacing:'.3px', minWidth:'180px' }}>
              {typed}<span style={{ animation:'lp-blink 1s step-end infinite', color:C.orange }}>|</span>
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(2.8rem,5.5vw,5rem)', fontWeight:900, lineHeight:1.05, color:C.white, margin:'0 0 1.4rem', letterSpacing:'-2px', animation:'lp-fadeUp .7s ease .2s both' }}>
            Hire Smarter,<br/>
            <span key={C.mode} style={{ background:C.txtGrad, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'lp-gradient-shift 3s linear infinite' }}>
              Screen Faster
            </span>
          </h1>

          <p style={{ color:C.grey, fontSize:'1.1rem', lineHeight:1.75, margin:'0 0 2.2rem', maxWidth:'500px', animation:'lp-fadeUp .7s ease .3s both' }}>
            Upload your resume and get instant AI-driven match scores, skill gap analysis, and actionable feedback — in under 3 seconds.
          </p>

          {/* Buttons */}
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'1.8rem', animation:'lp-fadeUp .7s ease .4s both' }}>
            <button onClick={onApply}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px) scale(1.03)'; e.currentTarget.style.boxShadow='0 14px 36px rgba(255,136,0,.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 22px rgba(255,136,0,.35)'; }}
              style={{ display:'flex', alignItems:'center', gap:'.55rem', background:C.btnGrad, border:'none', borderRadius:'12px', color:'#fff', fontSize:'1.05rem', fontWeight:800, padding:'.9rem 2rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", boxShadow:'0 4px 22px rgba(255,136,0,.35)', transition:'transform .25s cubic-bezier(.4,0,.2,1), box-shadow .25s' }}>
              Apply Now <ArrowRight size={18}/>
            </button>
            <button onClick={onHR}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.08)'; e.currentTarget.style.borderColor='rgba(255,255,255,.3)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=C.line; e.currentTarget.style.transform='none'; }}
              style={{ display:'flex', alignItems:'center', gap:'.55rem', background:'transparent', border:`1px solid ${C.line}`, borderRadius:'12px', color:C.offW, fontSize:'1.05rem', fontWeight:600, padding:'.9rem 2rem', cursor:'pointer', fontFamily:"'Outfit',sans-serif", transition:'all .25s' }}>
              HR Login <BriefcaseBusiness size={18}/>
            </button>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'.5rem', color:C.greyD, fontSize:'.8rem', animation:'lp-fadeUp .7s ease .5s both' }}>
            <ShieldCheck size={14} color={C.greyD}/>
            Data stays on your server — zero external transfer
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ flex:'1 1 340px', display:'flex', justifyContent:'center', alignItems:'center' }}>
          <HeroMockCard/>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS BAR — animated counters
   ═══════════════════════════════════════════════════════ */
const STATS = [
  { value:'25',   label:'Job Categories'   },
  { value:'50%',  label:'Match Threshold'  },
  { value:'3',    label:'File Formats'     },
  { value:'3s',   label:'Screening Time'   },
];

function StatItem({ value, label, delay, trigger }) {
  const displayed = useCounter(value, 1200, trigger);
  const C = useC();
  const { mode } = useTheme();
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem', flex:'1 1 120px', position:'relative',
      opacity: trigger ? 1 : 0, transform: trigger ? 'none' : 'translateY(20px)',
      transition:`opacity .6s ease ${delay}, transform .6s ease ${delay}` }}>
      <span key={mode} style={{ fontFamily:"'Outfit',sans-serif", fontSize:'2.8rem', fontWeight:900, color:C.white, letterSpacing:'-2px', lineHeight:1,
        background:C.txtGrad, backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        animation:'lp-gradient-shift 4s linear infinite' }}>
        {displayed}
      </span>
      <span style={{ fontSize:'.78rem', color:C.grey, textTransform:'uppercase', letterSpacing:'.7px', fontWeight:500 }}>{label}</span>
    </div>
  );
}

function StatsBar() {
  const [ref, visible] = useFade();
  const C = useC();
  return (
    <div ref={ref} style={{ width:'100%', background:C.card, borderTop:`1px solid ${C.line}`, borderBottom:`1px solid ${C.line}`, padding:'2.8rem 6vw' }}>
      <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', flexWrap:'wrap', gap:'2rem' }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ display:'contents' }}>
            <StatItem value={s.value} label={s.label} delay={`${i * .12}s`} trigger={visible}/>
            {i < STATS.length - 1 && (
              <div style={{ width:'1px', height:'60px', background:C.line, opacity: visible ? 1 : 0, transition:`opacity .5s ease ${i*.1}s` }}/>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION HELPERS
   ═══════════════════════════════════════════════════════ */
function Tag({ text }) {
  const C = useC();
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'.35rem', background:'rgba(255,136,0,.1)', border:`1px solid rgba(255,136,0,.25)`, borderRadius:'999px', padding:'.3rem .9rem', color:C.orangeL, fontSize:'.75rem', fontWeight:700, letterSpacing:'.5px', textTransform:'uppercase', marginBottom:'1.1rem' }}>
      {text}
    </span>
  );
}

function SecHead({ tag, title, sub, visible }) {
  const C = useC();
  const { mode } = useTheme();
  return (
    <div style={{ textAlign:'center', marginBottom:'3.5rem',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)',
      transition:'opacity .7s ease, transform .7s ease' }}>
      <Tag text={tag}/>
      <h2 key={mode} style={{ fontFamily:"'Outfit',sans-serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:C.white, lineHeight:1.15, letterSpacing:'-1px', margin:'0 0 1rem' }}
        dangerouslySetInnerHTML={{ __html: title }}/>
      {sub && <p style={{ color:C.grey, fontSize:'1.05rem', lineHeight:1.7, maxWidth:'540px', margin:'0 auto' }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════════════════ */
const FEATURES = [
  { icon:FileText, title:'Smart Resume Parsing', desc:'Auto-extracts name, email, phone, skills and URLs from any PDF, DOCX, or TXT file in seconds.' },
  { icon:Brain,    title:'AI Role Matching',     desc:'Cosine similarity + keyword scoring compares your resume against job requirements for a precise match score.' },
  { icon:Sparkles, title:'CV Enhancer',          desc:'AI-generated, actionable feedback to strengthen your resume and close skill gaps before applying.' },
];

function FeatureCard({ f, delay, visible }) {
  const [hov, setHov] = useState(false);
  const C = useC();
  const Icon = f.icon;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.card2 : C.card,
        border:`1px solid ${hov ? C.lineO : C.line}`,
        borderRadius:'22px', padding:'2.2rem',
        display:'flex', flexDirection:'column', gap:'1.1rem',
        transform: visible ? (hov ? 'translateY(-10px) scale(1.02)' : 'none') : 'translateY(40px)',
        opacity: visible ? 1 : 0,
        boxShadow: hov ? '0 24px 60px rgba(0,0,0,.55),0 0 50px rgba(255,136,0,.12)' : '0 4px 24px rgba(0,0,0,.4)',
        transition:`transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s, opacity .6s ease ${delay}, background .25s, border-color .25s`,
        cursor:'default', height:'100%',
      }}>
      <div style={{ width:'56px', height:'56px', borderRadius:'14px', background: hov ? 'rgba(255,136,0,.18)' : 'rgba(255,136,0,.1)', border:`1px solid rgba(255,136,0,.22)`, display:'flex', alignItems:'center', justifyContent:'center', transition:'background .3s',
        animation: hov ? 'lp-icon-bounce .6s ease' : 'none' }}>
        <Icon size={26} color={C.orange}/>
      </div>
      <div style={{ color:C.white, fontSize:'1.15rem', fontWeight:800 }}>{f.title}</div>
      <div style={{ color:C.grey, fontSize:'.92rem', lineHeight:1.68 }}>{f.desc}</div>

      {/* shimmer line on hover */}
      <div style={{ height:'2px', borderRadius:'99px', marginTop:'auto',
        background: hov ? `linear-gradient(90deg, transparent, ${C.orange}, transparent)` : 'transparent',
        backgroundSize:'200% 100%',
        animation: hov ? 'lp-shimmer 1.5s linear infinite' : 'none',
        transition:'background .3s' }}/>
    </div>
  );
}

function FeaturesSection() {
  const [ref, visible] = useFade(.08);
  const C = useC();
  return (
    <section id="features" ref={ref} style={{ width:'100%', backgroundColor:C.black, padding:'7rem 6vw' }}>
      <SecHead
        tag="Features" visible={visible}
        title={`Everything you need to screen<br/><span style="background:${C.txtGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent">smarter, not harder</span>`}
        sub="Three powerful AI tools — one platform, zero setup required."
      />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'1.5rem', alignItems:'stretch' }}>
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.title} f={f} delay={`${i * .15}s`} visible={visible}/>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS — animated connector line
   ═══════════════════════════════════════════════════════ */
const STEPS = [
  { num:'01', icon:Upload,      title:'Upload Your Resume',   desc:'Drag & drop or browse to upload. The AI auto-extracts your name, email, skills, and more instantly.' },
  { num:'02', icon:Brain,       title:'AI Analyzes & Scores', desc:'Our model classifies your role, calculates keyword match, semantic similarity, and experience alignment.' },
  { num:'03', icon:CheckCircle, title:'Get Instant Feedback', desc:'See your result, matched/missing skills, AI reasoning, and CV improvement suggestions — all at once.' },
];

function StepCard({ s, delay, visible }) {
  const [hov, setHov] = useState(false);
  const C = useC();
  const Icon = s.icon;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.card2 : C.card, border:`1px solid ${hov ? C.lineO : C.line}`,
        borderRadius:'22px', padding:'2.2rem 2rem',
        display:'flex', flexDirection:'column', gap:'1.1rem', width:'280px',
        opacity: visible ? 1 : 0,
        transform: visible ? (hov ? 'translateY(-8px)' : 'none') : 'translateY(40px)',
        transition:`opacity .6s ease ${delay}, transform .35s cubic-bezier(.4,0,.2,1), background .25s, border-color .25s`,
        boxShadow: hov ? '0 20px 50px rgba(0,0,0,.5),0 0 30px rgba(255,136,0,.1)' : 'none' }}>
      <span style={{ fontSize:'.72rem', fontWeight:800, letterSpacing:'1px', color:C.orange, background:'rgba(255,136,0,.1)', border:`1px solid rgba(255,136,0,.3)`, borderRadius:'6px', padding:'.22rem .6rem', alignSelf:'flex-start', fontFamily:"'Outfit',sans-serif" }}>{s.num}</span>
      <div style={{ width:'56px', height:'56px', borderRadius:'14px', background:'rgba(255,136,0,.1)', border:`1px solid rgba(255,136,0,.22)`, display:'flex', alignItems:'center', justifyContent:'center',
        animation: hov ? 'lp-icon-bounce .5s ease' : 'none' }}>
        <Icon size={26} color={C.orange}/>
      </div>
      <div style={{ color:C.white, fontSize:'1.05rem', fontWeight:800 }}>{s.title}</div>
      <div style={{ color:C.grey, fontSize:'.88rem', lineHeight:1.65 }}>{s.desc}</div>
    </div>
  );
}

function HowItWorks() {
  const [ref, visible] = useFade(.08);
  const C = useC();
  return (
    <section id="how-it-works" ref={ref} style={{ width:'100%', background:C.card, padding:'7rem 6vw', borderTop:`1px solid ${C.line}`, borderBottom:`1px solid ${C.line}` }}>
      <SecHead
        tag="How It Works" visible={visible}
        title={`From upload to result<br/><span style="background:${C.txtGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent">in three simple steps</span>`}
      />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:'0' }}>
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ display:'flex', alignItems:'center' }}>
            <StepCard s={s} delay={`${i * .18}s`} visible={visible}/>
            {i < STEPS.length - 1 && (
              <div style={{ padding:'0 1rem', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:'.3rem' }}>
                {/* animated arrow connector */}
                <div style={{ width:'48px', height:'2px', background: visible ? `linear-gradient(90deg, ${C.orange}, ${C.orangeL})` : C.line,
                  borderRadius:'99px',
                  transition:`background 1s ease ${.3 + i*.2}s`,
                  boxShadow: visible ? `0 0 8px rgba(255,136,0,.4)` : 'none' }}/>
                <ArrowRight size={18} color={visible ? C.orange : C.greyD}
                  style={{ transition:`color 1s ease ${.3 + i*.2}s`,
                    animation: visible ? `lp-fadeIn .5s ease ${.5+i*.2}s both` : 'none' }}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PORTAL SELECTION
   ═══════════════════════════════════════════════════════ */
function PortalSection({ onCandidate, onHR }) {
  const [hov, setHov] = useState(null);
  const [ref, visible] = useFade(.08);
  const C = useC();

  const portals = [
    { id:'candidate', icon:Users,             action:onCandidate, title:'Candidate Portal', desc:'Upload your resume, check alignment with the active job role, and get AI-powered CV improvement feedback.', pills:['Resume Upload','AI Screening','CV Enhancer'] },
    { id:'hr',        icon:BriefcaseBusiness, action:onHR,        title:'HR Portal',        desc:'Configure job requirements, review candidates, manage the pipeline, and view analytics.',                  pills:['Analytics','Recruiter Panel','Candidate Review'] },
  ];

  return (
    <section id="get-started" ref={ref} style={{ width:'100%', backgroundColor:C.black, padding:'7rem 6vw' }}>
      <SecHead tag="Get Started" title="Choose your portal" visible={visible}
        sub="Two dedicated portals — one for candidates, one for recruiters."/>

      <div style={{ display:'flex', gap:'2rem', justifyContent:'center', flexWrap:'wrap' }}>
        {portals.map((p, i) => {
          const Icon = p.icon;
          const on = hov === p.id;
          return (
            <button key={p.id} onClick={p.action}
              onMouseEnter={() => setHov(p.id)} onMouseLeave={() => setHov(null)}
              style={{
                flex:'1 1 340px', maxWidth:'460px',
                display:'flex', flexDirection:'column', alignItems:'center', gap:'1.3rem',
                padding:'3rem 2.4rem',
                background: on ? C.card2 : C.card,
                border:`1px solid ${on ? C.lineO : C.line}`,
                borderRadius:'24px', cursor:'pointer',
                opacity: visible ? 1 : 0,
                transform: visible ? (on ? 'translateY(-10px) scale(1.02)' : 'none') : 'translateY(40px)',
                boxShadow: on ? '0 24px 70px rgba(0,0,0,.6),0 0 60px rgba(255,136,0,.14)' : '0 8px 32px rgba(0,0,0,.5)',
                transition:`opacity .65s ease ${i*.15}s, transform .3s cubic-bezier(.4,0,.2,1), box-shadow .3s, background .25s, border-color .25s`,
                fontFamily:"'Outfit',sans-serif", textAlign:'center',
              }}>

              {/* Icon circle */}
              <div style={{ width:'88px', height:'88px', borderRadius:'50%',
                background: on ? 'rgba(255,136,0,.16)' : 'rgba(255,136,0,.08)',
                border:`1px solid ${on ? 'rgba(255,136,0,.45)' : 'rgba(255,136,0,.18)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all .3s',
                animation: on ? 'lp-pulse-ring 1.5s ease-in-out infinite' : 'none' }}>
                <Icon size={40} color={C.orange} strokeWidth={1.5}
                  style={{ transition:'transform .3s', transform: on ? 'scale(1.15)' : 'none' }}/>
              </div>

              <div style={{ color:C.white, fontSize:'1.45rem', fontWeight:800, letterSpacing:'-.4px' }}>{p.title}</div>
              <div style={{ color:C.grey, fontSize:'.9rem', lineHeight:1.65, maxWidth:'300px' }}>{p.desc}</div>

              <div style={{ display:'flex', flexWrap:'wrap', gap:'.45rem', justifyContent:'center' }}>
                {p.pills.map((l, pi) => (
                  <span key={l} style={{ fontSize:'.72rem', fontWeight:700, padding:'.28rem .7rem',
                    borderRadius:'999px', border:`1px solid rgba(255,136,0,.25)`,
                    color:C.orangeL, background:'rgba(255,136,0,.07)', letterSpacing:'.2px',
                    transition:'all .2s',
                    ...(on ? { background:'rgba(255,136,0,.13)', borderColor:'rgba(255,136,0,.4)' } : {}) }}>
                    {l}
                  </span>
                ))}
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:'.4rem', fontSize:'.88rem', fontWeight:700, color: on ? C.orange : C.greyD, transition:'color .2s', marginTop:'auto' }}>
                Enter Portal
                <ArrowRight size={16} style={{ transform: on ? 'translateX(6px)' : 'none', transition:'transform .25s cubic-bezier(.4,0,.2,1)' }}/>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
function Footer() {
  const C = useC();
  return (
    <footer style={{ width:'100%', background:C.card, borderTop:`1px solid ${C.line}`, padding:'2rem 6vw' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.6rem' }}>
          <Logo size={28}/>
          <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:'1.05rem', color:C.white }}>
            Screen<span style={{ color:C.orange }}>.AI</span>
          </span>
        </div>
        <span style={{ color:C.greyD, fontSize:'.82rem' }}>© 2025 Screen.AI · All rights reserved</span>
        <div style={{ display:'flex', alignItems:'center', gap:'.4rem', color:C.greyD, fontSize:'.8rem' }}>
          <ShieldCheck size={14} color={C.greyD}/> Data processed locally
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT EXPORT
   ═══════════════════════════════════════════════════════ */
export default function PortalSelect() {
  const nav = useNavigate();
  const C = useC();

  const bgPattern = C.mode === 'dark'
    ? `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(255,136,0,.13) 0%, transparent 70%),
       url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='rgba(255,136,0,0.25)'/%3E%3C/svg%3E")`
    : `radial-gradient(ellipse 90% 60% at 50% 0%, rgba(255,136,0,.18) 0%, transparent 70%),
       url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='1.5' cy='1.5' r='1.5' fill='rgba(160,80,0,0.18)'/%3E%3C/svg%3E")`;

  return (
    <div style={{ backgroundColor:C.black, backgroundImage:bgPattern, backgroundRepeat:'repeat, repeat', minHeight:'100vh', width:'100%', overflowX:'hidden' }}>
      <style>{ANIM_STYLES}</style>
      <FloatingOrbs mode={C.mode}/>
      <Navbar/>
      <Hero     onApply={() => nav('/candidate')} onHR={() => nav('/hr-login')}/>
      <StatsBar/>
      <FeaturesSection/>
      <HowItWorks/>
      <PortalSection onCandidate={() => nav('/candidate')} onHR={() => nav('/hr-login')}/>
      <Footer/>
    </div>
  );
}
