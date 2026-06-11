import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BriefcaseBusiness, ArrowRight, ShieldCheck,
  FileText, Brain, Sparkles, Menu, X, ChevronRight,
  Upload, CheckCircle, Zap, Target, Clock, TrendingUp
} from 'lucide-react';

// ─── Intersection Observer hook for scroll animations ───────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Data ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '10x', label: 'Faster Hiring' },
  { value: '95%', label: 'AI Accuracy' },
  { value: '500+', label: 'Resumes Screened' },
  { value: '3 sec', label: 'Instant Results' },
];

const FEATURES = [
  {
    icon: FileText,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.1)',
    border: 'rgba(168,85,247,0.2)',
    title: 'Smart Resume Parsing',
    desc: 'Auto-extracts name, email, phone, skills and URLs from any PDF, DOCX, or TXT file in seconds.',
  },
  {
    icon: Brain,
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.2)',
    title: 'AI Role Matching',
    desc: 'Cosine similarity + keyword scoring compares your resume against job requirements for a precise match score.',
  },
  {
    icon: Sparkles,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
    title: 'CV Enhancer',
    desc: 'AI-generated, actionable feedback to strengthen your resume and close skill gaps before applying.',
  },
];

const STEPS = [
  {
    num: '01',
    icon: Upload,
    color: '#a855f7',
    title: 'Upload Your Resume',
    desc: 'Drag & drop or browse to upload your PDF, DOCX, or TXT resume. The AI auto-extracts your details instantly.',
  },
  {
    num: '02',
    icon: Brain,
    color: '#06b6d4',
    title: 'AI Analyzes & Scores',
    desc: 'Our model classifies your role, calculates keyword match, semantic similarity, and experience alignment.',
  },
  {
    num: '03',
    icon: CheckCircle,
    color: '#10b981',
    title: 'Get Instant Feedback',
    desc: 'See your screening result, matched/missing skills, AI reasoning, and CV improvement suggestions — all in one view.',
  },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav style={{ ...nav.bar, background: scrolled ? 'rgba(10,11,16,0.92)' : 'transparent', borderBottomColor: scrolled ? 'rgba(255,255,255,0.07)' : 'transparent' }}>
      {/* Brand */}
      <div style={nav.brand}>
        <span style={{ fontSize: '1.5rem' }}>🔮</span>
        <span style={nav.brandMain}>Screen</span>
        <span style={nav.brandAccent}>.AI</span>
      </div>

      {/* Desktop links */}
      <div style={nav.links}>
        {['features', 'how-it-works', 'get-started'].map((id) => (
          <button key={id} onClick={() => scrollTo(id)} style={nav.link}>
            {id === 'get-started' ? 'Portals' : id.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button onClick={() => scrollTo('get-started')} style={nav.cta}>
        Get Started <ChevronRight size={15} />
      </button>

      {/* Hamburger */}
      <button onClick={() => setMenuOpen(o => !o)} style={nav.hamburger}>
        {menuOpen ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={nav.mobileMenu}>
          {['features', 'how-it-works', 'get-started'].map((id) => (
            <button key={id} onClick={() => scrollTo(id)} style={nav.mobileLink}>
              {id === 'get-started' ? 'Portals' : id.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

const nav = {
  bar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 5%', height: '68px',
    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid transparent',
    transition: 'background 0.3s ease, border-color 0.3s ease',
  },
  brand: { display: 'flex', alignItems: 'baseline', gap: '0.25rem', cursor: 'default' },
  brandMain: { fontWeight: 800, fontSize: '1.35rem', color: '#fff', letterSpacing: '-0.5px', fontFamily: "'Outfit', sans-serif" },
  brandAccent: { fontWeight: 800, fontSize: '1.35rem', color: '#a855f7', fontFamily: "'Outfit', sans-serif" },
  links: { display: 'flex', gap: '0.25rem', '@media(max-width:768px)': { display: 'none' } },
  link: {
    background: 'transparent', border: 'none', color: '#9ca3af',
    fontSize: '0.9rem', fontWeight: 500, padding: '0.5rem 0.85rem',
    cursor: 'pointer', borderRadius: '8px', fontFamily: "'Outfit', sans-serif",
    transition: 'color 0.2s',
  },
  cta: {
    display: 'flex', alignItems: 'center', gap: '0.3rem',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    border: 'none', borderRadius: '8px', color: '#fff',
    fontSize: '0.875rem', fontWeight: 600, padding: '0.55rem 1.1rem',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
  },
  hamburger: {
    display: 'none', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem',
  },
  mobileMenu: {
    position: 'absolute', top: '68px', left: 0, right: 0,
    background: 'rgba(10,11,16,0.97)', borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', flexDirection: 'column', padding: '1rem 5%', gap: '0.25rem',
  },
  mobileLink: {
    background: 'transparent', border: 'none', color: '#d1d5db',
    fontSize: '1rem', fontWeight: 500, padding: '0.75rem 0',
    cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit', sans-serif",
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
};

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onApply, onHR }) {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} style={{ ...hero.section, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      {/* Background glows */}
      <div style={hero.glowPurple} />
      <div style={hero.glowCyan} />
      <div style={hero.glowPink} />

      <div style={hero.inner}>
        {/* Left: text */}
        <div style={hero.textCol}>
          <div style={hero.badge}>
            <Zap size={12} color="#a855f7" />
            <span>AI-Powered Resume Screening</span>
          </div>

          <h1 style={hero.h1}>
            Hire Smarter,<br />
            <span className="gradient-text">Screen Faster</span>
          </h1>

          <p style={hero.sub}>
            Upload your resume and get instant AI-driven matching scores, skill gap analysis, and actionable improvement feedback — all in under 3 seconds.
          </p>

          <div style={hero.ctaRow}>
            <button onClick={onApply} style={hero.btnPrimary}>
              Apply Now <ArrowRight size={16} />
            </button>
            <button onClick={onHR} style={hero.btnSecondary}>
              HR Login <BriefcaseBusiness size={16} />
            </button>
          </div>

          <div style={hero.trustRow}>
            <ShieldCheck size={13} color="#4b5563" />
            <span style={{ color: '#4b5563', fontSize: '0.78rem' }}>Data stays on your server — zero external transfer</span>
          </div>
        </div>

        {/* Right: visual card */}
        <div style={hero.visualCol}>
          <HeroCard />
        </div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div style={heroCard.wrap}>
      {/* Glow ring */}
      <div style={heroCard.ring} />

      <div style={heroCard.card}>
        <div style={heroCard.cardTop}>
          <div style={heroCard.fileIcon}>📄</div>
          <div>
            <div style={heroCard.fileName}>resume_john_doe.pdf</div>
            <div style={heroCard.fileSize}>248 KB · Parsed ✓</div>
          </div>
        </div>

        <div style={heroCard.divider} />

        <div style={heroCard.scoreRow}>
          {[
            { label: 'Role Match', value: '92%', color: '#10b981' },
            { label: 'Keywords', value: '87%', color: '#a855f7' },
            { label: 'Semantic', value: '89%', color: '#06b6d4' },
          ].map(s => (
            <div key={s.label} style={heroCard.scoreBox}>
              <div style={{ ...heroCard.scoreVal, color: s.color }}>{s.value}</div>
              <div style={heroCard.scoreLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={heroCard.statusBadge}>
          <CheckCircle size={14} color="#10b981" />
          <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.8rem' }}>SELECTED FOR REVIEW</span>
        </div>
      </div>

      {/* Floating pill */}
      <div style={heroCard.pill}>
        <TrendingUp size={13} color="#a855f7" />
        <span>500+ resumes screened</span>
      </div>
    </div>
  );
}

const hero = {
  section: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    padding: '100px 5% 60px', position: 'relative', overflow: 'hidden',
  },
  glowPurple: {
    position: 'absolute', top: '10%', left: '-5%',
    width: '600px', height: '600px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowCyan: {
    position: 'absolute', bottom: '5%', right: '-5%',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowPink: {
    position: 'absolute', top: '50%', left: '40%',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  inner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '4rem', width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1,
    flexWrap: 'wrap',
  },
  textCol: { flex: '1 1 420px', maxWidth: '560px' },
  visualCol: { flex: '1 1 320px', display: 'flex', justifyContent: 'center' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)',
    borderRadius: '999px', padding: '0.35rem 0.85rem',
    color: '#c4b5fd', fontSize: '0.78rem', fontWeight: 600,
    marginBottom: '1.5rem', letterSpacing: '0.3px',
  },
  h1: {
    fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800,
    lineHeight: 1.1, color: '#fff', marginBottom: '1.25rem', letterSpacing: '-1px',
  },
  sub: {
    color: '#9ca3af', fontSize: '1.05rem', lineHeight: 1.7,
    marginBottom: '2rem', maxWidth: '480px',
  },
  ctaRow: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' },
  btnPrimary: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    border: 'none', borderRadius: '10px', color: '#fff',
    fontSize: '1rem', fontWeight: 600, padding: '0.85rem 1.75rem',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  btnSecondary: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#d1d5db',
    fontSize: '1rem', fontWeight: 600, padding: '0.85rem 1.75rem',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    transition: 'background 0.2s, border-color 0.2s',
  },
  trustRow: { display: 'flex', alignItems: 'center', gap: '0.4rem' },
};

const heroCard = {
  wrap: { position: 'relative', width: '340px' },
  ring: {
    position: 'absolute', inset: '-20px', borderRadius: '28px',
    background: 'radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '20px', padding: '1.75rem', backdropFilter: 'blur(16px)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' },
  fileIcon: { fontSize: '2rem' },
  fileName: { color: '#fff', fontWeight: 600, fontSize: '0.9rem' },
  fileSize: { color: '#6b7280', fontSize: '0.75rem', marginTop: '2px' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '1.25rem' },
  scoreRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' },
  scoreBox: { textAlign: 'center' },
  scoreVal: { fontSize: '1.5rem', fontWeight: 800 },
  scoreLabel: { color: '#6b7280', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' },
  statusBadge: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: '8px', padding: '0.6rem',
  },
  pill: {
    position: 'absolute', top: '-16px', right: '-16px',
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)',
    borderRadius: '999px', padding: '0.4rem 0.85rem',
    color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 600,
    backdropFilter: 'blur(8px)',
  },
};

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const [ref, inView] = useInView();
  return (
    <section ref={ref} style={{ ...statsBar.section, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
      <div style={statsBar.inner}>
        {STATS.map((s, i) => (
          <div key={s.label} style={statsBar.item}>
            <div style={statsBar.value}>{s.value}</div>
            <div style={statsBar.label}>{s.label}</div>
            {i < STATS.length - 1 && <div style={statsBar.divider} />}
          </div>
        ))}
      </div>
    </section>
  );
}

const statsBar = {
  section: { padding: '0 5%', marginBottom: '5rem' },
  inner: {
    maxWidth: '900px', margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px', padding: '2rem 3rem', gap: '1rem',
    position: 'relative',
  },
  item: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: '1 1 100px', position: 'relative' },
  value: { fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-1px' },
  label: { fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' },
  divider: {
    position: 'absolute', right: 0, top: '10%', height: '80%',
    width: '1px', background: 'rgba(255,255,255,0.07)',
  },
};

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  const [ref, inView] = useInView();
  return (
    <section id="features" ref={ref} style={{ ...sec.section, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div style={sec.inner}>
        <SectionLabel text="Features" />
        <h2 style={sec.h2}>Everything you need to screen<br /><span className="gradient-text">smarter, not harder</span></h2>
        <p style={sec.sub}>Three powerful AI tools — all in one platform, zero setup required.</p>

        <div style={feat.grid}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <FeatureCard key={f.title} f={f} Icon={Icon} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ f, Icon }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...feat.card,
        borderColor: hovered ? f.border : 'rgba(255,255,255,0.07)',
        boxShadow: hovered ? `0 0 40px ${f.bg}, 0 20px 40px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'translateY(-6px)' : 'none',
      }}
    >
      <div style={{ ...feat.iconBox, background: f.bg, border: `1px solid ${f.border}` }}>
        <Icon size={26} color={f.color} />
      </div>
      <h3 style={feat.title}>{f.title}</h3>
      <p style={feat.desc}>{f.desc}</p>
    </div>
  );
}

const feat = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '3rem' },
  card: {
    background: 'rgba(255,255,255,0.025)', border: '1px solid',
    borderRadius: '20px', padding: '2rem',
    display: 'flex', flexDirection: 'column', gap: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'default',
  },
  iconBox: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: 0 },
  desc: { color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 },
};

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const [ref, inView] = useInView();
  return (
    <section id="how-it-works" ref={ref} style={{ ...sec.section, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s' }}>
      <div style={sec.inner}>
        <SectionLabel text="How It Works" />
        <h2 style={sec.h2}>From upload to result<br /><span className="gradient-text">in three simple steps</span></h2>

        <div style={how.grid}>
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} style={how.row}>
                {/* Step card */}
                <div style={how.card}>
                  <div style={{ ...how.numBadge, color: step.color, borderColor: step.color + '40', background: step.color + '10' }}>
                    {step.num}
                  </div>
                  <div style={{ ...how.iconRing, background: step.color + '12', border: `1px solid ${step.color}30` }}>
                    <Icon size={28} color={step.color} />
                  </div>
                  <div>
                    <h3 style={how.title}>{step.title}</h3>
                    <p style={how.desc}>{step.desc}</p>
                  </div>
                </div>
                {/* Connector arrow */}
                {i < STEPS.length - 1 && (
                  <div style={how.connector}>
                    <ArrowRight size={20} color="rgba(255,255,255,0.15)" />
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

const how = {
  grid: { display: 'flex', alignItems: 'flex-start', gap: '0', marginTop: '3rem', flexWrap: 'wrap', justifyContent: 'center' },
  row: { display: 'flex', alignItems: 'center' },
  card: {
    display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start',
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px', padding: '2rem 1.75rem', maxWidth: '280px', minWidth: '220px',
  },
  numBadge: {
    fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px',
    border: '1px solid', borderRadius: '6px', padding: '0.2rem 0.55rem',
    fontFamily: "'Outfit', sans-serif",
  },
  iconRing: { width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.35rem' },
  desc: { color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 },
  connector: { padding: '0 1rem', flexShrink: 0 },
};

// ─── Portal Selection (CTA) ───────────────────────────────────────────────────
function PortalSection({ onCandidate, onHR }) {
  const [hovered, setHovered] = useState(null);
  const [ref, inView] = useInView();

  const PORTALS = [
    {
      id: 'candidate',
      icon: Users,
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.1)',
      border: 'rgba(168,85,247,0.25)',
      hoverBorder: 'rgba(168,85,247,0.55)',
      hoverShadow: '0 0 40px rgba(139,92,246,0.18), 0 20px 40px rgba(0,0,0,0.4)',
      title: 'Candidate Portal',
      desc: 'Upload your resume, check alignment with the active job role, and get AI-powered CV improvement feedback.',
      pills: ['Resume Upload', 'AI Screening', 'CV Enhancer'],
      pillColor: { color: '#c4b5fd', borderColor: 'rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.08)' },
      action: onCandidate,
    },
    {
      id: 'hr',
      icon: BriefcaseBusiness,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.1)',
      border: 'rgba(16,185,129,0.22)',
      hoverBorder: 'rgba(16,185,129,0.55)',
      hoverShadow: '0 0 40px rgba(16,185,129,0.14), 0 20px 40px rgba(0,0,0,0.4)',
      title: 'HR Portal',
      desc: 'Configure job requirements, review candidates, manage the recruitment pipeline, and view analytics.',
      pills: ['Analytics', 'Recruiter Panel', 'Candidate Review'],
      pillColor: { color: '#6ee7b7', borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.07)' },
      action: onHR,
    },
  ];

  return (
    <section id="get-started" ref={ref} style={{ ...sec.section, opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(30px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      <div style={sec.inner}>
        <SectionLabel text="Get Started" />
        <h2 style={sec.h2}>Choose your portal</h2>
        <p style={sec.sub}>Two dedicated portals — one for candidates, one for recruiters.</p>

        <div style={portal.grid}>
          {PORTALS.map((p) => {
            const Icon = p.icon;
            const isHov = hovered === p.id;
            return (
              <button
                key={p.id}
                onClick={p.action}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  ...portal.card,
                  borderColor: isHov ? p.hoverBorder : 'rgba(255,255,255,0.08)',
                  boxShadow: isHov ? p.hoverShadow : '0 10px 30px rgba(0,0,0,0.3)',
                  transform: isHov ? 'translateY(-6px)' : 'none',
                }}
              >
                <div style={{ ...portal.iconRing, background: p.bg, border: `1px solid ${p.border}` }}>
                  <Icon size={36} color={p.color} strokeWidth={1.5} />
                </div>
                <div style={portal.cardTitle}>{p.title}</div>
                <div style={portal.cardDesc}>{p.desc}</div>
                <div style={portal.pills}>
                  {p.pills.map(label => (
                    <span key={label} style={{ ...portal.pill, ...p.pillColor }}>{label}</span>
                  ))}
                </div>
                <div style={{ ...portal.cta, color: isHov ? p.color : '#6b7280' }}>
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

const portal = {
  grid: { display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem', width: '100%' },
  card: {
    flex: '1 1 300px', maxWidth: '400px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem',
    padding: '2.5rem 2rem', background: 'rgba(255,255,255,0.025)',
    border: '1px solid', borderRadius: '20px', cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
    backdropFilter: 'blur(12px)', textAlign: 'center',
    fontFamily: "'Outfit', sans-serif",
  },
  iconRing: { width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.3px' },
  cardDesc: { color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '280px' },
  pills: { display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' },
  pill: { fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.65rem', borderRadius: '999px', border: '1px solid', letterSpacing: '0.2px' },
  cta: { display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s', marginTop: 'auto' },
};

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={footer.bar}>
      <div style={footer.inner}>
        <div style={footer.brand}>
          <span>🔮</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>Screen</span>
          <span style={{ color: '#a855f7', fontWeight: 700 }}>.AI</span>
        </div>
        <div style={footer.copy}>© 2025 Screen.AI · All rights reserved</div>
        <div style={footer.privacy}>
          <ShieldCheck size={13} color="#4b5563" />
          <span>Data processed locally</span>
        </div>
      </div>
    </footer>
  );
}

const footer = {
  bar: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1.75rem 5%', marginTop: '4rem' },
  inner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' },
  brand: { display: 'flex', alignItems: 'baseline', gap: '0.25rem', fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif" },
  copy: { color: '#4b5563', fontSize: '0.82rem' },
  privacy: { display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4b5563', fontSize: '0.78rem' },
};

// ─── Shared section helpers ───────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '999px', padding: '0.3rem 0.85rem', color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
      {text}
    </div>
  );
}

const sec = {
  section: { padding: '5rem 5%' },
  inner: { maxWidth: '1200px', margin: '0 auto', textAlign: 'center' },
  h2: { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.5px', margin: '0 0 1rem' },
  sub: { color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' },
};

// ─── Root Export ──────────────────────────────────────────────────────────────
export default function PortalSelect() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#0a0b10', minHeight: '100vh', overflowX: 'hidden' }}>
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
