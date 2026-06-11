import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BriefcaseBusiness, ArrowRight, ShieldCheck,
  FileText, Brain, Sparkles, Menu, X, ChevronRight,
  Upload, CheckCircle, Zap, TrendingUp
} from 'lucide-react';

// ─── Theme tokens ─────────────────────────────────────────────────────────────
const T = {
  bg:        '#0d0d0d',
  bgCard:    '#161616',
  bgCard2:   '#1a1a1a',
  border:    'rgba(255,255,255,0.08)',
  borderHov: 'rgba(255,140,0,0.5)',
  orange:    '#ff8c00',
  orangeL:   '#ffa733',
  orangeD:   '#e07800',
  orangeGlow:'rgba(255,140,0,0.18)',
  white:     '#ffffff',
  offWhite:  '#f0f0f0',
  muted:     '#888888',
  mutedD:    '#555555',
  gradBtn:   'linear-gradient(135deg, #ff8c00 0%, #ffa733 100%)',
  gradText:  'linear-gradient(135deg, #ff8c00 0%, #ffcc66 100%)',
  gradGlow:  'radial-gradient(circle, rgba(255,140,0,0.14) 0%, transparent 70%)',
};

// ─── SVG Logo ─────────────────────────────────────────────────────────────────
function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill={T.orange} />
      {/* Document shape */}
      <rect x="10" y="8" width="16" height="20" rx="2" fill="white" opacity="0.15" />
      <rect x="10" y="8" width="16" height="20" rx="2" stroke="white" strokeWidth="1.5" />
      <line x1="14" y1="14" x2="22" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="18" x2="22" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="22" x2="19" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* AI spark */}
      <circle cx="28" cy="28" r="7" fill="#0d0d0d" />
      <circle cx="28" cy="28" r="7" fill={T.orange} opacity="0.9" />
      <path d="M28 24v8M24 28h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// ─── Intersection Observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '10x',  label: 'Faster Hiring'    },
  { value: '95%',  label: 'AI Accuracy'      },
  { value: '500+', label: 'Resumes Screened' },
  { value: '3s',   label: 'Instant Results'  },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Smart Resume Parsing',
    desc:  'Auto-extracts name, email, phone, skills and URLs from any PDF, DOCX, or TXT file in seconds.',
  },
  {
    icon: Brain,
    title: 'AI Role Matching',
    desc:  'Cosine similarity + keyword scoring compares your resume against job requirements for a precise match score.',
  },
  {
    icon: Sparkles,
    title: 'CV Enhancer',
    desc:  'AI-generated, actionable feedback to strengthen your resume and close skill gaps before applying.',
  },
];

const STEPS = [
  { num: '01', icon: Upload,       title: 'Upload Your Resume',     desc: 'Drag & drop or browse to upload your PDF, DOCX, or TXT resume. The AI auto-extracts your details instantly.' },
  { num: '02', icon: Brain,        title: 'AI Analyzes & Scores',   desc: 'Our model classifies your role, calculates keyword match, semantic similarity, and experience alignment.' },
  { num: '03', icon: CheckCircle,  title: 'Get Instant Feedback',   desc: 'See your screening result, matched/missing skills, AI reasoning, and CV improvement suggestions — all at once.' },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setOpen(false); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
      height: '64px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 5%',
      background: scrolled ? 'rgba(13,13,13,0.94)' : 'transparent',
      borderBottom: `1px solid ${scrolled ? T.border : 'transparent'}`,
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Logo size={32} />
        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: T.white, fontFamily: "'Outfit',sans-serif", letterSpacing: '-0.5px' }}>
          Screen<span style={{ color: T.orange }}>.AI</span>
        </span>
      </div>

      {/* Desktop links */}
      <div className="nav-links" style={{ display: 'flex', gap: '0.25rem' }}>
        {[['features','Features'],['how-it-works','How It Works'],['get-started','Portals']].map(([id, label]) => (
          <button key={id} onClick={() => go(id)} style={{
            background: 'transparent', border: 'none', color: T.muted,
            fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 0.9rem',
            cursor: 'pointer', borderRadius: '8px', fontFamily: "'Outfit',sans-serif",
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.white}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >{label}</button>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => go('get-started')} className="nav-cta" style={{
        display: 'flex', alignItems: 'center', gap: '0.3rem',
        background: T.gradBtn, border: 'none', borderRadius: '8px',
        color: T.white, fontSize: '0.875rem', fontWeight: 700,
        padding: '0.55rem 1.2rem', cursor: 'pointer',
        fontFamily: "'Outfit',sans-serif",
        boxShadow: `0 4px 18px ${T.orangeGlow}`,
      }}>
        Get Started <ChevronRight size={15} />
      </button>

      {/* Hamburger */}
      <button onClick={() => setOpen(o => !o)} className="hamburger" style={{
        display: 'none', background: 'transparent', border: 'none', cursor: 'pointer',
      }}>
        {open ? <X size={22} color={T.white} /> : <Menu size={22} color={T.white} />}
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'absolute', top: '64px', left: 0, right: 0,
          background: 'rgba(13,13,13,0.98)', borderBottom: `1px solid ${T.border}`,
          display: 'flex', flexDirection: 'column', padding: '1rem 5%', gap: '0.15rem',
        }}>
          {[['features','Features'],['how-it-works','How It Works'],['get-started','Portals']].map(([id, label]) => (
            <button key={id} onClick={() => go(id)} style={{
              background: 'transparent', border: 'none', borderBottom: `1px solid ${T.border}`,
              color: '#d1d5db', fontSize: '1rem', fontWeight: 500, padding: '0.85rem 0',
              cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit',sans-serif",
            }}>{label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Hero Card (visual mockup) ────────────────────────────────────────────────
function HeroCard() {
  return (
    <div style={{ position: 'relative', width: '340px' }}>
      {/* Glow behind card */}
      <div style={{ position: 'absolute', inset: '-30px', borderRadius: '30px', background: T.gradGlow, pointerEvents: 'none' }} />

      <div style={{
        background: T.bgCard, border: `1px solid ${T.border}`,
        borderRadius: '20px', padding: '1.75rem',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        {/* File row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '40px', height: '48px', background: 'rgba(255,140,0,0.1)', border: `1px solid rgba(255,140,0,0.25)`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color={T.orange} />
          </div>
          <div>
            <div style={{ color: T.white, fontWeight: 600, fontSize: '0.9rem' }}>resume_john_doe.pdf</div>
            <div style={{ color: T.mutedD, fontSize: '0.75rem', marginTop: '2px' }}>248 KB · Parsed ✓</div>
          </div>
        </div>

        <div style={{ height: '1px', background: T.border, marginBottom: '1.25rem' }} />

        {/* Score row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          {[['92%','Role Match', T.orange],['87%','Keywords', T.orangeL],['89%','Semantic', T.white]].map(([v,l,c]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: c }}>{v}</div>
              <div style={{ color: T.mutedD, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(255,140,0,0.08)', border: `1px solid rgba(255,140,0,0.25)`, borderRadius: '8px', padding: '0.65rem' }}>
          <CheckCircle size={15} color={T.orange} />
          <span style={{ color: T.orange, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.5px' }}>SELECTED FOR REVIEW</span>
        </div>
      </div>

      {/* Floating pill */}
      <div style={{ position: 'absolute', top: '-16px', right: '-10px', display: 'flex', alignItems: 'center', gap: '0.35rem', background: T.bgCard, border: `1px solid rgba(255,140,0,0.3)`, borderRadius: '999px', padding: '0.4rem 0.9rem', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
        <TrendingUp size={13} color={T.orange} />
        <span style={{ color: T.orangeL, fontSize: '0.75rem', fontWeight: 600 }}>500+ resumes screened</span>
      </div>
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function Hero({ onApply, onHR }) {
  const [ref, inView] = useInView(0.05);
  return (
    <section ref={ref} style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '100px 5% 60px', position: 'relative', overflow: 'hidden',
      opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    }}>
      {/* Background glows */}
      <div style={{ position: 'absolute', top: '10%', left: '-8%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,140,0,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,140,0,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>

        {/* Text */}
        <div style={{ flex: '1 1 400px', maxWidth: '560px' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,140,0,0.08)', border: `1px solid rgba(255,140,0,0.22)`, borderRadius: '999px', padding: '0.35rem 0.85rem', color: T.orangeL, fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.3px' }}>
            <Zap size={12} color={T.orange} />
            AI-Powered Resume Screening
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem,5vw,3.8rem)', fontWeight: 800, lineHeight: 1.1, color: T.white, marginBottom: '1.25rem', letterSpacing: '-1px' }}>
            Hire Smarter,<br />
            <span style={{ background: T.gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Screen Faster</span>
          </h1>

          <p style={{ color: T.muted, fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '480px' }}>
            Upload your resume and get instant AI-driven matching scores, skill gap analysis, and actionable improvement feedback — all in under 3 seconds.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button onClick={onApply}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 28px rgba(255,140,0,0.5)`; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 4px 20px rgba(255,140,0,0.3)`; }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: T.gradBtn, border: 'none', borderRadius: '10px', color: T.white, fontSize: '1rem', fontWeight: 700, padding: '0.85rem 1.75rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: `0 4px 20px rgba(255,140,0,0.3)`, transition: 'transform 0.2s, box-shadow 0.2s' }}>
              Apply Now <ArrowRight size={16} />
            </button>
            <button onClick={onHR}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,140,0,0.35)'; e.currentTarget.style.color=T.white; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color='#d1d5db'; }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, borderRadius: '10px', color: '#d1d5db', fontSize: '1rem', fontWeight: 600, padding: '0.85rem 1.75rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'border-color 0.2s, color 0.2s' }}>
              HR Login <BriefcaseBusiness size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: T.mutedD, fontSize: '0.78rem' }}>
            <ShieldCheck size={13} color={T.mutedD} />
            Data stays on your server — zero external transfer
          </div>
        </div>

        {/* Visual */}
        <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ padding: '0 5%', marginBottom: '5rem', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '16px', padding: '2rem 3rem', gap: '1.5rem' }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 100px', position: 'relative' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: T.white, letterSpacing: '-1px' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: T.muted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s.label}</div>
            {i < STATS.length - 1 && <div style={{ position: 'absolute', right: 0, top: '10%', height: '80%', width: '1px', background: T.border }} />}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Section helpers ──────────────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,140,0,0.08)', border: `1px solid rgba(255,140,0,0.2)`, borderRadius: '999px', padding: '0.3rem 0.9rem', color: T.orangeL, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
      {text}
    </div>
  );
}

function SectionHead({ label, h2, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
      <SectionLabel text={label} />
      <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: T.white, lineHeight: 1.2, letterSpacing: '-0.5px', margin: '0 0 1rem' }} dangerouslySetInnerHTML={{ __html: h2 }} />
      {sub && <p style={{ color: T.muted, fontSize: '1rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>{sub}</p>}
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const [ref, inView] = useInView();
  return (
    <section id="features" ref={ref} style={{ padding: '5rem 5%', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHead
          label="Features"
          h2={`Everything you need to screen<br/><span style="background:${T.gradText};-webkit-background-clip:text;-webkit-text-fill-color:transparent">smarter, not harder</span>`}
          sub="Three powerful AI tools — one platform, zero setup required."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.5rem' }}>
          {FEATURES.map(f => <FeatureCard key={f.title} f={f} />)}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ f }) {
  const [hov, setHov] = useState(false);
  const Icon = f.icon;
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.bgCard2 : T.bgCard,
        border: `1px solid ${hov ? T.borderHov : T.border}`,
        borderRadius: '20px', padding: '2rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        transform: hov ? 'translateY(-6px)' : 'none',
        boxShadow: hov ? `0 0 40px rgba(255,140,0,0.1), 0 20px 40px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor: 'default',
      }}
    >
      <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(255,140,0,0.1)', border: `1px solid rgba(255,140,0,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} color={T.orange} />
      </div>
      <div style={{ color: T.white, fontSize: '1.1rem', fontWeight: 700 }}>{f.title}</div>
      <div style={{ color: T.muted, fontSize: '0.9rem', lineHeight: 1.65 }}>{f.desc}</div>
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const [ref, inView] = useInView();
  return (
    <section id="how-it-works" ref={ref} style={{ padding: '5rem 5%', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <SectionHead
          label="How It Works"
          h2={`From upload to result<br/><span style="background:${T.gradText};-webkit-background-clip:text;-webkit-text-fill-color:transparent">in three simple steps</span>`}
        />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', gap: '0' }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '20px', padding: '2rem 1.75rem', maxWidth: '280px', minWidth: '220px' }}>
                  {/* Step number */}
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '1px', color: T.orange, border: `1px solid rgba(255,140,0,0.35)`, background: 'rgba(255,140,0,0.08)', borderRadius: '6px', padding: '0.2rem 0.55rem', fontFamily: "'Outfit',sans-serif" }}>{step.num}</span>
                  {/* Icon */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(255,140,0,0.1)', border: `1px solid rgba(255,140,0,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={26} color={T.orange} />
                  </div>
                  <div>
                    <div style={{ color: T.white, fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{step.title}</div>
                    <div style={{ color: T.muted, fontSize: '0.875rem', lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ padding: '0 1rem', flexShrink: 0 }}>
                    <ArrowRight size={20} color={T.mutedD} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Portal Selection ─────────────────────────────────────────────────────────
function PortalSection({ onCandidate, onHR }) {
  const [hov, setHov] = useState(null);
  const [ref, inView] = useInView();

  const PORTALS = [
    {
      id: 'candidate', icon: Users, action: onCandidate,
      title: 'Candidate Portal',
      desc: 'Upload your resume, check alignment with the active job role, and get AI-powered CV improvement feedback.',
      pills: ['Resume Upload', 'AI Screening', 'CV Enhancer'],
    },
    {
      id: 'hr', icon: BriefcaseBusiness, action: onHR,
      title: 'HR Portal',
      desc: 'Configure job requirements, review candidates, manage the recruitment pipeline, and view analytics.',
      pills: ['Analytics', 'Recruiter Panel', 'Candidate Review'],
    },
  ];

  return (
    <section id="get-started" ref={ref} style={{ padding: '5rem 5%', opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <SectionHead
          label="Get Started"
          h2="Choose your portal"
          sub="Two dedicated portals — one for candidates, one for recruiters."
        />
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {PORTALS.map(p => {
            const Icon = p.icon;
            const isHov = hov === p.id;
            return (
              <button key={p.id} onClick={p.action}
                onMouseEnter={() => setHov(p.id)}
                onMouseLeave={() => setHov(null)}
                style={{
                  flex: '1 1 300px', maxWidth: '400px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
                  padding: '2.5rem 2rem',
                  background: isHov ? T.bgCard2 : T.bgCard,
                  border: `1px solid ${isHov ? T.borderHov : T.border}`,
                  borderRadius: '20px', cursor: 'pointer',
                  transform: isHov ? 'translateY(-6px)' : 'none',
                  boxShadow: isHov ? `0 0 40px rgba(255,140,0,0.12), 0 20px 40px rgba(0,0,0,0.4)` : '0 10px 30px rgba(0,0,0,0.3)',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  fontFamily: "'Outfit',sans-serif", textAlign: 'center',
                }}
              >
                {/* Icon ring */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,140,0,0.1)', border: `1px solid rgba(255,140,0,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={36} color={T.orange} strokeWidth={1.5} />
                </div>
                <div style={{ color: T.white, fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.3px' }}>{p.title}</div>
                <div style={{ color: T.muted, fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '280px' }}>{p.desc}</div>
                {/* Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                  {p.pills.map(label => (
                    <span key={label} style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '999px', border: `1px solid rgba(255,140,0,0.25)`, color: T.orangeL, background: 'rgba(255,140,0,0.07)', letterSpacing: '0.2px' }}>
                      {label}
                    </span>
                  ))}
                </div>
                {/* CTA row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: isHov ? T.orange : T.mutedD, transition: 'color 0.2s', marginTop: 'auto' }}>
                  <span>Enter Portal</span>
                  <ArrowRight size={16} style={{ transform: isHov ? 'translateX(4px)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${T.border}`, padding: '1.75rem 5%', marginTop: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Logo size={26} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: T.white, fontFamily: "'Outfit',sans-serif" }}>
            Screen<span style={{ color: T.orange }}>.AI</span>
          </span>
        </div>
        <div style={{ color: T.mutedD, fontSize: '0.82rem' }}>© 2025 Screen.AI · All rights reserved</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: T.mutedD, fontSize: '0.78rem' }}>
          <ShieldCheck size={13} color={T.mutedD} />
          Data processed locally
        </div>
      </div>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function PortalSelect() {
  const navigate = useNavigate();
  return (
    <div style={{ background: T.bg, minHeight: '100vh', overflowX: 'hidden' }}>
      <Navbar />
      <Hero onApply={() => navigate('/candidate')} onHR={() => navigate('/hr')} />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <PortalSection onCandidate={() => navigate('/candidate')} onHR={() => navigate('/hr')} />
      <Footer />
    </div>
  );
}
