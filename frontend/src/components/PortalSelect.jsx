import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BriefcaseBusiness, ArrowRight, ShieldCheck,
  FileText, Brain, Sparkles, Menu, X, ChevronRight,
  Upload, CheckCircle, Zap, TrendingUp, Star
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   THEME  —  pure black · white · orange
   ═══════════════════════════════════════════════════════ */
const C = {
  black:   '#000000',
  white:   '#ffffff',
  offW:    '#f5f5f5',
  grey:    '#999999',
  greyD:   '#444444',
  orange:  '#ff8800',
  orangeL: '#ffaa33',
  card:    '#0e0e0e',
  card2:   '#141414',
  line:    'rgba(255,255,255,0.09)',
  lineO:   'rgba(255,136,0,0.35)',
  btnGrad: 'linear-gradient(135deg,#ff8800,#ffaa33)',
  txtGrad: 'linear-gradient(90deg,#ff8800 0%,#ffcc55 100%)',
};

/* ─── SVG Logo ──────────────────────────────────────── */
function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="12" fill={C.orange}/>
      <rect x="12" y="9" width="18" height="24" rx="2.5" stroke="white" strokeWidth="2"/>
      <line x1="16" y1="16" x2="26" y2="16" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16" y1="21" x2="26" y2="21" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="16" y1="26" x2="22" y2="26" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="34" cy="34" r="9" fill={C.black}/>
      <circle cx="34" cy="34" r="9" fill={C.orange}/>
      <path d="M34 29v10M29 34h10" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
  );
}

/* ─── Scroll-fade hook ──────────────────────────────── */
function useFade(t = 0.1) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, [t]);
  return [r, v];
}

const fade = (v, delay = '0s') => ({
  opacity: v ? 1 : 0,
  transform: v ? 'none' : 'translateY(28px)',
  transition: `opacity .7s ease ${delay}, transform .7s ease ${delay}`,
});

/* ═══════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════ */
function Navbar() {
  const [mob, setMob] = useState(false);
  const [up, setUp]   = useState(false);

  useEffect(() => {
    const fn = () => setUp(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMob(false); };

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
    height: '64px', display: 'flex', alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 6vw',
    background: up ? 'rgba(0,0,0,0.95)' : 'transparent',
    borderBottom: `1px solid ${up ? C.line : 'transparent'}`,
    backdropFilter: up ? 'blur(18px)' : 'none',
    transition: 'background .3s, border-color .3s',
  };

  return (
    <nav style={navStyle}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', cursor: 'default' }}>
        <Logo size={34}/>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: C.white, letterSpacing: '-.4px' }}>
          Screen<span style={{ color: C.orange }}>.AI</span>
        </span>
      </div>

      {/* Links — hidden on mobile via class */}
      <div className="lp-nav-links" style={{ display: 'flex', gap: '.15rem' }}>
        {[['features','Features'],['how-it-works','How It Works'],['get-started','Portals']].map(([id, lbl]) => (
          <button key={id} onClick={() => go(id)}
            onMouseEnter={e => e.currentTarget.style.color = C.white}
            onMouseLeave={e => e.currentTarget.style.color = C.grey}
            style={{ background: 'none', border: 'none', color: C.grey, fontSize: '.92rem', fontWeight: 500, padding: '.5rem 1rem', cursor: 'pointer', borderRadius: '8px', fontFamily: "'Outfit',sans-serif", transition: 'color .2s' }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => go('get-started')} className="lp-nav-cta"
        onMouseEnter={e => { e.currentTarget.style.opacity = '.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'none'; }}
        style={{ background: C.btnGrad, border: 'none', borderRadius: '9px', color: C.white, fontSize: '.88rem', fontWeight: 700, padding: '.58rem 1.3rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", display: 'flex', alignItems: 'center', gap: '.3rem', boxShadow: '0 4px 20px rgba(255,136,0,.35)', transition: 'opacity .2s, transform .2s' }}>
        Get Started <ChevronRight size={15}/>
      </button>

      {/* Hamburger */}
      <button onClick={() => setMob(o => !o)} className="lp-hamburger"
        style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '.2rem' }}>
        {mob ? <X size={24} color={C.white}/> : <Menu size={24} color={C.white}/>}
      </button>

      {mob && (
        <div style={{ position: 'absolute', top: '64px', left: 0, right: 0, background: '#000', borderBottom: `1px solid ${C.line}`, display: 'flex', flexDirection: 'column', padding: '1rem 6vw' }}>
          {[['features','Features'],['how-it-works','How It Works'],['get-started','Portals']].map(([id, lbl]) => (
            <button key={id} onClick={() => go(id)}
              style={{ background: 'none', border: 'none', borderBottom: `1px solid ${C.line}`, color: C.offW, fontSize: '1rem', fontWeight: 500, padding: '.85rem 0', cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit',sans-serif" }}>
              {lbl}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
function HeroMockCard() {
  return (
    <div style={{ position: 'relative', width: '360px', flexShrink: 0 }}>
      {/* orange glow */}
      <div style={{ position: 'absolute', inset: '-40px', borderRadius: '40px', background: 'radial-gradient(circle,rgba(255,136,0,.18) 0%,transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '22px', padding: '2rem', boxShadow: '0 30px 80px rgba(0,0,0,.8)', position: 'relative' }}>
        {/* file row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem', marginBottom: '1.4rem' }}>
          <div style={{ width: '44px', height: '52px', background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.28)`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} color={C.orange}/>
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: '.95rem' }}>resume_john_doe.pdf</div>
            <div style={{ color: C.greyD, fontSize: '.75rem', marginTop: '3px' }}>248 KB · Parsed ✓</div>
          </div>
        </div>

        <div style={{ height: '1px', background: C.line, marginBottom: '1.4rem' }}/>

        {/* scores */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
          {[['92%','Role Match',C.orange],['87%','Keywords',C.orangeL],['89%','Semantic',C.white]].map(([v,l,col]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: col, lineHeight: 1 }}>{v}</div>
              <div style={{ color: C.greyD, fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: '4px' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem', background: 'rgba(255,136,0,.08)', border: `1px solid rgba(255,136,0,.28)`, borderRadius: '10px', padding: '.7rem' }}>
          <CheckCircle size={16} color={C.orange}/>
          <span style={{ color: C.orange, fontWeight: 800, fontSize: '.82rem', letterSpacing: '.5px' }}>SELECTED FOR REVIEW</span>
        </div>
      </div>

      {/* floating tag */}
      <div style={{ position: 'absolute', top: '-18px', right: '-14px', display: 'flex', alignItems: 'center', gap: '.35rem', background: '#0e0e0e', border: `1px solid rgba(255,136,0,.35)`, borderRadius: '999px', padding: '.42rem .95rem', boxShadow: '0 6px 20px rgba(0,0,0,.6)' }}>
        <TrendingUp size={14} color={C.orange}/>
        <span style={{ color: C.orangeL, fontSize: '.76rem', fontWeight: 700 }}>500+ screened</span>
      </div>
    </div>
  );
}

function Hero({ onApply, onHR }) {
  const [r, v] = useFade(.04);
  return (
    <section ref={r} style={{
      width: '100%', minHeight: '100vh',
      background: C.black,
      display: 'flex', alignItems: 'center',
      padding: '100px 6vw 60px',
      position: 'relative', overflow: 'hidden',
      ...fade(v),
    }}>
      {/* bg tints */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 70% 60% at 10% 40%,rgba(255,136,0,.07) 0%,transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '0', right: '0', width: '50vw', height: '60vh', background: 'radial-gradient(ellipse at 80% 80%,rgba(255,136,0,.04) 0%,transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>

        {/* LEFT TEXT */}
        <div style={{ flex: '1 1 420px', maxWidth: '640px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.45rem', background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.25)`, borderRadius: '999px', padding: '.38rem .9rem', color: C.orangeL, fontSize: '.78rem', fontWeight: 700, letterSpacing: '.3px', marginBottom: '1.6rem' }}>
            <Zap size={13} color={C.orange}/> AI-Powered Resume Screening
          </div>

          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(2.8rem,5.5vw,5rem)', fontWeight: 900, lineHeight: 1.05, color: C.white, margin: '0 0 1.4rem', letterSpacing: '-2px' }}>
            Hire Smarter,<br/>
            <span style={{ background: C.txtGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Screen Faster</span>
          </h1>

          <p style={{ color: C.grey, fontSize: '1.1rem', lineHeight: 1.75, margin: '0 0 2.2rem', maxWidth: '500px' }}>
            Upload your resume and get instant AI-driven match scores, skill gap analysis, and actionable feedback — in under 3 seconds.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.8rem' }}>
            <button onClick={onApply}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 32px rgba(255,136,0,.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none';             e.currentTarget.style.boxShadow='0 4px 22px rgba(255,136,0,.35)'; }}
              style={{ display: 'flex', alignItems: 'center', gap: '.55rem', background: C.btnGrad, border: 'none', borderRadius: '12px', color: C.white, fontSize: '1.05rem', fontWeight: 800, padding: '.9rem 2rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 22px rgba(255,136,0,.35)', transition: 'transform .2s,box-shadow .2s', letterSpacing: '-.2px' }}>
              Apply Now <ArrowRight size={18}/>
            </button>
            <button onClick={onHR}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,.07)'; e.currentTarget.style.borderColor='rgba(255,255,255,.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent';            e.currentTarget.style.borderColor=C.line; }}
              style={{ display: 'flex', alignItems: 'center', gap: '.55rem', background: 'transparent', border: `1px solid ${C.line}`, borderRadius: '12px', color: C.offW, fontSize: '1.05rem', fontWeight: 600, padding: '.9rem 2rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'background .2s,border-color .2s' }}>
              HR Login <BriefcaseBusiness size={18}/>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', color: C.greyD, fontSize: '.8rem' }}>
            <ShieldCheck size={14} color={C.greyD}/>
            Data stays on your server — zero external transfer
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HeroMockCard/>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STATS BAR  —  full width stripe
   ═══════════════════════════════════════════════════════ */
const STATS = [
  { value: '10x',  label: 'Faster Hiring'    },
  { value: '95%',  label: 'AI Accuracy'      },
  { value: '500+', label: 'Resumes Screened' },
  { value: '3 s',  label: 'Instant Results'  },
];

function StatsBar() {
  const [r, v] = useFade();
  return (
    <div ref={r} style={{ width: '100%', background: '#0a0a0a', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: '2.8rem 6vw', ...fade(v) }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.3rem', flex: '1 1 120px', position: 'relative' }}>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '2.8rem', fontWeight: 900, color: C.white, letterSpacing: '-2px', lineHeight: 1 }}>{s.value}</span>
            <span style={{ fontSize: '.78rem', color: C.grey, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 500 }}>{s.label}</span>
            {i < STATS.length - 1 && (
              <div style={{ position: 'absolute', right: 0, top: '15%', height: '70%', width: '1px', background: C.line }}/>
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
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.25)`, borderRadius: '999px', padding: '.3rem .9rem', color: C.orangeL, fontSize: '.75rem', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
      {text}
    </span>
  );
}

function SecHead({ tag, title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
      <Tag text={tag}/>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: C.white, lineHeight: 1.15, letterSpacing: '-1px', margin: '0 0 1rem' }}
        dangerouslySetInnerHTML={{ __html: title }}/>
      {sub && <p style={{ color: C.grey, fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto' }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURES
   ═══════════════════════════════════════════════════════ */
const FEATURES = [
  { icon: FileText,  title: 'Smart Resume Parsing', desc: 'Auto-extracts name, email, phone, skills and URLs from any PDF, DOCX, or TXT file in seconds.' },
  { icon: Brain,     title: 'AI Role Matching',     desc: 'Cosine similarity + keyword scoring compares your resume against job requirements for a precise match score.' },
  { icon: Sparkles,  title: 'CV Enhancer',          desc: 'AI-generated, actionable feedback to strengthen your resume and close skill gaps before applying.' },
];

function FeatureCard({ f }) {
  const [hov, set] = useState(false);
  const Icon = f.icon;
  return (
    <div onMouseEnter={() => set(true)} onMouseLeave={() => set(false)}
      style={{ background: hov ? C.card2 : C.card, border: `1px solid ${hov ? C.lineO : C.line}`, borderRadius: '22px', padding: '2.2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', transform: hov ? 'translateY(-8px)' : 'none', boxShadow: hov ? '0 20px 50px rgba(0,0,0,.6),0 0 40px rgba(255,136,0,.09)' : '0 4px 24px rgba(0,0,0,.4)', transition: 'all .3s cubic-bezier(.4,0,.2,1)', cursor: 'default', height: '100%' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={26} color={C.orange}/>
      </div>
      <div style={{ color: C.white, fontSize: '1.15rem', fontWeight: 800 }}>{f.title}</div>
      <div style={{ color: C.grey, fontSize: '.92rem', lineHeight: 1.68 }}>{f.desc}</div>
    </div>
  );
}

function FeaturesSection() {
  const [r, v] = useFade();
  return (
    <section id="features" ref={r} style={{ width: '100%', background: C.black, padding: '7rem 6vw', ...fade(v) }}>
      <SecHead
        tag="Features"
        title={`Everything you need to screen<br/><span style="background:${C.txtGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent">smarter, not harder</span>`}
        sub="Three powerful AI tools — one platform, zero setup required."
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
        {FEATURES.map(f => <FeatureCard key={f.title} f={f}/>)}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   HOW IT WORKS
   ═══════════════════════════════════════════════════════ */
const STEPS = [
  { num: '01', icon: Upload,      title: 'Upload Your Resume',   desc: 'Drag & drop or browse to upload. The AI auto-extracts your name, email, skills, and more instantly.' },
  { num: '02', icon: Brain,       title: 'AI Analyzes & Scores', desc: 'Our model classifies your role, calculates keyword match, semantic similarity, and experience alignment.' },
  { num: '03', icon: CheckCircle, title: 'Get Instant Feedback', desc: 'See your result, matched/missing skills, AI reasoning, and CV improvement suggestions — all at once.' },
];

function HowItWorks() {
  const [r, v] = useFade();
  return (
    <section id="how-it-works" ref={r} style={{ width: '100%', background: '#050505', padding: '7rem 6vw', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, ...fade(v, '.1s') }}>
      <SecHead
        tag="How It Works"
        title={`From upload to result<br/><span style="background:${C.txtGrad};-webkit-background-clip:text;-webkit-text-fill-color:transparent">in three simple steps</span>`}
      />
      <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap', gap: '0' }}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: '22px', padding: '2.2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', width: '280px' }}>
                <span style={{ fontSize: '.72rem', fontWeight: 800, letterSpacing: '1px', color: C.orange, background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.3)`, borderRadius: '6px', padding: '.22rem .6rem', alignSelf: 'flex-start', fontFamily: "'Outfit',sans-serif" }}>{s.num}</span>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={26} color={C.orange}/>
                </div>
                <div style={{ color: C.white, fontSize: '1.05rem', fontWeight: 800 }}>{s.title}</div>
                <div style={{ color: C.grey, fontSize: '.88rem', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ padding: '0 1.2rem', flexShrink: 0, color: C.greyD }}>
                  <ArrowRight size={22} color={C.greyD}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PORTAL SELECTION  —  full width CTA band
   ═══════════════════════════════════════════════════════ */
function PortalSection({ onCandidate, onHR }) {
  const [hov, set] = useState(null);
  const [r, v] = useFade();

  const portals = [
    { id: 'candidate', icon: Users,            action: onCandidate, title: 'Candidate Portal', desc: 'Upload your resume, check alignment with the active job role, and get AI-powered CV improvement feedback.', pills: ['Resume Upload','AI Screening','CV Enhancer'] },
    { id: 'hr',        icon: BriefcaseBusiness, action: onHR,        title: 'HR Portal',        desc: 'Configure job requirements, review candidates, manage the pipeline, and view analytics.',                 pills: ['Analytics','Recruiter Panel','Candidate Review'] },
  ];

  return (
    <section id="get-started" ref={r} style={{ width: '100%', background: C.black, padding: '7rem 6vw', ...fade(v) }}>
      <SecHead tag="Get Started" title="Choose your portal" sub="Two dedicated portals — one for candidates, one for recruiters."/>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {portals.map(p => {
          const Icon = p.icon;
          const on = hov === p.id;
          return (
            <button key={p.id} onClick={p.action}
              onMouseEnter={() => set(p.id)} onMouseLeave={() => set(null)}
              style={{ flex: '1 1 340px', maxWidth: '460px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.3rem', padding: '3rem 2.4rem', background: on ? C.card2 : C.card, border: `1px solid ${on ? C.lineO : C.line}`, borderRadius: '24px', cursor: 'pointer', transform: on ? 'translateY(-8px)' : 'none', boxShadow: on ? '0 20px 60px rgba(0,0,0,.6),0 0 50px rgba(255,136,0,.1)' : '0 8px 32px rgba(0,0,0,.5)', transition: 'all .28s cubic-bezier(.4,0,.2,1)', fontFamily: "'Outfit',sans-serif", textAlign: 'center' }}>
              <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: on ? 'rgba(255,136,0,.14)' : 'rgba(255,136,0,.08)', border: `1px solid ${on ? 'rgba(255,136,0,.4)' : 'rgba(255,136,0,.18)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .28s' }}>
                <Icon size={40} color={C.orange} strokeWidth={1.5}/>
              </div>
              <div style={{ color: C.white, fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-.4px' }}>{p.title}</div>
              <div style={{ color: C.grey, fontSize: '.9rem', lineHeight: 1.65, maxWidth: '300px' }}>{p.desc}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem', justifyContent: 'center' }}>
                {p.pills.map(l => (
                  <span key={l} style={{ fontSize: '.72rem', fontWeight: 700, padding: '.28rem .7rem', borderRadius: '999px', border: `1px solid rgba(255,136,0,.25)`, color: C.orangeL, background: 'rgba(255,136,0,.07)', letterSpacing: '.2px' }}>{l}</span>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.88rem', fontWeight: 700, color: on ? C.orange : C.greyD, transition: 'color .2s', marginTop: 'auto' }}>
                Enter Portal <ArrowRight size={16} style={{ transform: on ? 'translateX(5px)' : 'none', transition: 'transform .2s' }}/>
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
  return (
    <footer style={{ width: '100%', background: '#050505', borderTop: `1px solid ${C.line}`, padding: '2rem 6vw' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
          <Logo size={28}/>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.05rem', color: C.white }}>
            Screen<span style={{ color: C.orange }}>.AI</span>
          </span>
        </div>
        <span style={{ color: C.greyD, fontSize: '.82rem' }}>© 2025 Screen.AI · All rights reserved</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', color: C.greyD, fontSize: '.8rem' }}>
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
  return (
    <div style={{ background: C.black, minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Navbar/>
      <Hero onApply={() => nav('/candidate')} onHR={() => nav('/hr')}/>
      <StatsBar/>
      <FeaturesSection/>
      <HowItWorks/>
      <PortalSection onCandidate={() => nav('/candidate')} onHR={() => nav('/hr')}/>
      <Footer/>
    </div>
  );
}
