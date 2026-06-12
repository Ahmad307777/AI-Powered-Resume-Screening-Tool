import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  UploadCloud, FileText, CheckCircle, XCircle, AlertCircle,
  Sparkles, Loader2, RefreshCw, ArrowLeft, User, Mail,
  Phone, MapPin, ChevronRight, Zap, Brain, Shield
} from 'lucide-react';
import CVEnhancer from './CVEnhancer';
import { useNavigate } from 'react-router-dom';
import { useTheme, Logo } from '../theme.jsx';

/* ═══════════════════════════════════════════════════════
   KEYFRAMES injected once
   ═══════════════════════════════════════════════════════ */
const STYLES = `
@keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes slideRight { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:none} }
@keyframes scaleIn  { from{opacity:0;transform:scale(.88)} to{opacity:1;transform:scale(1)} }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.45} }
@keyframes spin     { to{transform:rotate(360deg)} }
@keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
@keyframes shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }
@keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
@keyframes scoreCount { from{opacity:0;transform:scale(.5)} to{opacity:1;transform:scale(1)} }
@keyframes borderPulse { 0%,100%{border-color:rgba(255,136,0,.25)} 50%{border-color:rgba(255,136,0,.7)} }
@keyframes particleDrift {
  0%   { transform:translateY(0)   translateX(0)   opacity:.7 }
  33%  { transform:translateY(-30px) translateX(10px)  opacity:.4 }
  66%  { transform:translateY(-15px) translateX(-8px)  opacity:.6 }
  100% { transform:translateY(-50px) translateX(5px)   opacity:0  }
}
@keyframes gradientShift {
  0%  { background-position: 0%   50% }
  50% { background-position: 100% 50% }
  100%{ background-position: 0%   50% }
}
@keyframes typewriter {
  from { width:0 }
  to   { width:100% }
}
@keyframes glow {
  0%,100% { box-shadow: 0 0 20px rgba(255,136,0,.15) }
  50%     { box-shadow: 0 0 40px rgba(255,136,0,.45), 0 0 80px rgba(255,136,0,.15) }
}
@keyframes progressFill {
  from { width: 0% }
  to   { width: var(--target-width) }
}
@keyframes ripple {
  to { transform: scale(4); opacity: 0 }
}
.cp-particle { animation: particleDrift linear infinite; }
.cp-float    { animation: float 3s ease-in-out infinite; }
.cp-glow     { animation: glow 2.5s ease-in-out infinite; }
.cp-border-pulse { animation: borderPulse 2s ease-in-out infinite; }
`;

/* ─── Typewriter hook ─────────────────────────────────── */
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const delay = deleting ? speed / 2 : speed;
    const t = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(word.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(i => (i + 1) % words.length); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

/* ─── Animated counter ────────────────────────────────── */
function AnimatedNumber({ target, suffix = '%', duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const isNum = !isNaN(parseFloat(target));
    if (!isNum) { setVal(target); return; }
    const end = parseFloat(target);
    const steps = 60;
    const step = end / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, end);
      setVal(cur.toFixed(1));
      if (cur >= end) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [target, duration]);
  return <>{val}{suffix}</>;
}

/* ─── Particle field ──────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    dur: `${Math.random() * 4 + 3}s`,
    delay: `${Math.random() * 4}s`,
    opacity: Math.random() * 0.5 + 0.1,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {particles.map(p => (
        <div key={p.id} className="cp-particle"
          style={{ position: 'absolute', left: p.left, top: p.top, width: p.size, height: p.size, borderRadius: '50%', background: T.orange, opacity: p.opacity, animationDuration: p.dur, animationDelay: p.delay }} />
      ))}
    </div>
  );
}

/* ─── Progress bar ────────────────────────────────────── */
function ProgressBar({ value, color, delay = '0s' }) {
  const { T } = useTheme();
  const c = color || T.orange;
  return (
    <div style={{ height: '4px', background: 'rgba(255,255,255,.06)', borderRadius: '99px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: '99px',
        background: `linear-gradient(90deg, ${c}, ${T.orangeL})`,
        '--target-width': `${value}%`,
        animation: `progressFill .9s ease ${delay} both`,
        width: `${value}%`,
      }} />
    </div>
  );
}

/* ─── Step indicator ─────────────────────────────────── */
function StepDots({ step }) {
  const { T } = useTheme();
  const steps = ['Details', 'Upload', 'Result'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
      {steps.map((s, i) => {
        const done    = i < step;
        const current = i === step;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <div style={{
              width: current ? '28px' : '10px', height: '10px', borderRadius: '99px',
              background: done ? T.orange : current ? T.orange : 'rgba(255,255,255,.1)',
              border: `1px solid ${current || done ? T.orange : 'rgba(255,255,255,.12)'}`,
              transition: 'all .4s cubic-bezier(.4,0,.2,1)',
              boxShadow: current ? `0 0 12px rgba(255,136,0,.6)` : 'none',
            }} />
            {i < steps.length - 1 && (
              <div style={{ width: '32px', height: '1px', background: done ? T.orange : 'rgba(255,255,255,.08)', transition: 'background .4s' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO HEADER (shown before result)
   ═══════════════════════════════════════════════════════ */
function HeroHeader({ activeConfig }) {
  const { T } = useTheme();
  const typed = useTypewriter([
    'Upload Your Resume',
    'Get AI Feedback',
    'Land Your Dream Job',
    'Beat the Competition',
  ]);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: '24px', marginBottom: '2rem', background: `linear-gradient(135deg,${T.bgCard} 0%,${T.bgCard2} 100%)`, border: `1px solid ${T.line}`, padding: '3rem 2.5rem' }}>
      <Particles />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,136,0,.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,136,0,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'rgba(255,136,0,.1)', border: `1px solid rgba(255,136,0,.25)`, borderRadius: '999px', padding: '.3rem .9rem', color: T.orangeL, fontSize: '.75rem', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: '1.25rem', animation: 'fadeUp .6s ease both' }}>
          <Zap size={12} color={T.orange} /> AI-Powered Screening
        </div>

        {/* Static + typewriter */}
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: T.white, margin: '0 0 .5rem', letterSpacing: '-1.5px', lineHeight: 1.1, animation: 'fadeUp .6s ease .1s both' }}>
          <span style={{ background: `linear-gradient(90deg,${T.orange},${T.orangeL},#fff)`, backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradientShift 3s linear infinite' }}>
            {typed}
          </span>
          <span style={{ color: T.orange, animation: 'blink 1s step-end infinite', marginLeft: '2px' }}>|</span>
        </h1>

        <p style={{ color: T.grey, fontSize: '1rem', lineHeight: 1.7, maxWidth: '500px', margin: '1rem 0 1.5rem', animation: 'fadeUp .6s ease .2s both' }}>
          Get instant AI-driven match scores, skill gap analysis, and actionable improvement feedback — all in under 3 seconds.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.6rem', animation: 'fadeUp .6s ease .3s both' }}>
          {[
            { icon: Brain,   text: 'AI Role Matching'   },
            { icon: Zap,     text: 'Instant Results'    },
            { icon: Shield,  text: 'Private & Secure'   },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', background: 'rgba(255,255,255,.04)', border: `1px solid ${T.line}`, borderRadius: '999px', padding: '.32rem .85rem', color: T.grey, fontSize: '.78rem', fontWeight: 500 }}>
              <Icon size={12} color={T.orange} /> {text}
            </div>
          ))}
        </div>
      </div>

      {/* Active role pill */}
      {activeConfig?.position && (
        <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,136,0,.08)', border: `1px solid rgba(255,136,0,.25)`, borderRadius: '12px', padding: '.6rem .9rem', animation: 'fadeIn .8s ease .4s both' }}>
          <div style={{ fontSize: '10px', color: T.orange, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Open Role</div>
          <div style={{ color: T.white, fontWeight: 700, fontSize: '.9rem', marginTop: '2px' }}>{activeConfig.position}</div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ANIMATED FORM FIELD
   ═══════════════════════════════════════════════════════ */
function Field({ icon: Icon, label, delay = '0s', children }) {
  const { T } = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', animation: `fadeUp .5s ease ${delay} both` }}>
      <label style={{ fontSize: '.75rem', fontWeight: 700, color: T.grey, textTransform: 'uppercase', letterSpacing: '.55px', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
        <Icon size={11} color={focus ? T.orange : T.greyD} style={{ transition: 'color .2s' }} /> {label}
      </label>
      <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ position: 'relative', transition: 'all .2s',
          filter: focus ? `drop-shadow(0 0 8px rgba(255,136,0,.2))` : 'none' }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCORE RING
   ═══════════════════════════════════════════════════════ */
function ScoreRing({ value, label, color, delay = '0s', size = 100 }) {
  const { T } = useTheme();
  const r = 38;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(parseFloat(value) || 0, 100);
  const dash = (pct / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', animation: `scaleIn .6s ease ${delay} both` }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="7" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)', filter: `drop-shadow(0 0 6px ${color}88)` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.1rem', fontWeight: 900, color, lineHeight: 1 }}>
            {typeof value === 'string' && isNaN(parseFloat(value)) ? value : <AnimatedNumber target={pct} suffix="%" duration={1000} />}
          </span>
        </div>
      </div>
      <span style={{ fontSize: '.72rem', color: T.grey, textTransform: 'uppercase', letterSpacing: '.5px', fontWeight: 600, textAlign: 'center' }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESULT VIEW
   ═══════════════════════════════════════════════════════ */
function ResultView({ result, activeConfig, onReset }) {
  const { T } = useTheme();
  const selected = result.success && result.data?.status === 'Selected';
  const failed   = !result.success;

  return (
    <div style={{ animation: 'fadeUp .5s ease both' }}>

      {/* Big status banner */}
      {result.success ? (
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '18px', padding: '1.75rem 2rem', marginBottom: '2rem', background: selected ? 'linear-gradient(135deg,rgba(34,197,94,.08),rgba(34,197,94,.03))' : 'linear-gradient(135deg,rgba(245,158,11,.08),rgba(245,158,11,.03))', border: `1px solid ${selected ? 'rgba(34,197,94,.3)' : 'rgba(245,158,11,.3)'}`, animation: 'scaleIn .5s ease both' }}>
          <Particles />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: selected ? 'rgba(34,197,94,.15)' : 'rgba(245,158,11,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {selected ? <CheckCircle size={26} color={T.green} /> : <XCircle size={26} color={T.amber} />}
            </div>
            <div>
              <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', color: selected ? T.green : T.amber, marginBottom: '.25rem' }}>Pre-Screening Result</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.4rem', fontWeight: 900, color: T.white, letterSpacing: '-.5px' }}>
                {selected ? '🎉 Selected for Review' : '⚠ Not Selected'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ borderRadius: '18px', padding: '1.5rem 2rem', marginBottom: '2rem', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.3)', animation: 'scaleIn .5s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <XCircle size={28} color={T.red} />
            <div>
              <div style={{ color: T.red, fontWeight: 800, fontSize: '1.1rem' }}>Application Submission Failed</div>
              <div style={{ color: T.grey, fontSize: '.88rem', marginTop: '.3rem' }}>
                Classified as <strong style={{ color: T.white }}>{result.data?.category}</strong> but role requires <strong style={{ color: T.orange }}>{activeConfig?.position?.toUpperCase()}</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {result.success && (
        <>
          {/* Score rings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', animation: 'fadeUp .5s ease .1s both' }}>
              <ScoreRing value={result.data.confidenceScore?.toFixed(1) ?? 'N/A'} label="AI Confidence" color={result.data.confidenceScore >= 60 ? T.green : T.amber} delay=".1s" />
            </div>
            <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', animation: 'fadeUp .5s ease .2s both' }}>
              <ScoreRing value={result.data.keywordScore.toFixed(1)} label="Keyword Match" color={T.orange} delay=".2s" />
            </div>
            <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', animation: 'fadeUp .5s ease .3s both' }}>
              <ScoreRing value={result.data.semanticScore.toFixed(1)} label="Semantic Sim." color={T.orangeL} delay=".3s" />
            </div>
            <div style={{ background: T.bgCard, border: `1px solid ${T.lineO}`, borderRadius: '18px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.75rem', animation: 'fadeUp .5s ease .4s both' }}>
              <div style={{ fontSize: '1.6rem', animation: 'scoreCount .6s ease .4s both' }}>🏷</div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: T.orange, fontWeight: 800, fontSize: '.9rem', lineHeight: 1.2 }}>{result.data.category}</div>
                <div style={{ color: T.grey, fontSize: '.68rem', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: '4px' }}>AI Category</div>
              </div>
            </div>
          </div>

          {/* Progress bars */}
          <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '18px', padding: '1.5rem', marginBottom: '1.5rem', animation: 'fadeUp .5s ease .35s both' }}>
            <div style={{ color: T.white, fontWeight: 700, fontSize: '.9rem', marginBottom: '1.1rem' }}>Score Breakdown</div>
            {[
              { label: 'Keyword Match',      val: result.data.keywordScore,   color: T.orange,  delay: '.1s' },
              { label: 'Semantic Similarity', val: result.data.semanticScore, color: T.orangeL, delay: '.2s' },
              { label: 'AI Confidence',       val: result.data.confidenceScore ?? 0, color: T.green, delay: '.3s' },
            ].map(bar => (
              <div key={bar.label} style={{ marginBottom: '.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
                  <span style={{ color: T.grey, fontSize: '.8rem', fontWeight: 500 }}>{bar.label}</span>
                  <span style={{ color: bar.color, fontSize: '.8rem', fontWeight: 700 }}>{bar.val?.toFixed(1)}%</span>
                </div>
                <ProgressBar value={bar.val ?? 0} color={bar.color} delay={bar.delay} />
              </div>
            ))}
          </div>

          {/* Experience + mixed profile badges */}
          {(result.data.experienceYears !== undefined || result.data.secondaryCategory) && (
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap', marginBottom: '1.5rem', animation: 'fadeUp .5s ease .4s both' }}>
              {result.data.experienceYears !== undefined && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', padding: '.4rem .85rem', borderRadius: '999px', border: `1px solid ${result.data.experienceMeetsRequirement ? 'rgba(34,197,94,.35)' : 'rgba(245,158,11,.35)'}`, color: result.data.experienceMeetsRequirement ? T.green : T.amber, background: result.data.experienceMeetsRequirement ? 'rgba(34,197,94,.07)' : 'rgba(245,158,11,.07)', fontSize: '.8rem', fontWeight: 600 }}>
                  {result.data.experienceMeetsRequirement ? '✓' : '⚠'} {result.data.experienceYears} yr{result.data.experienceYears !== 1 ? 's' : ''} detected
                </span>
              )}
              {result.data.secondaryCategory && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.35rem', padding: '.4rem .85rem', borderRadius: '999px', border: `1px solid ${T.lineO}`, color: T.orangeL, background: 'rgba(255,136,0,.07)', fontSize: '.8rem', fontWeight: 600 }}>
                  ⚡ Also matches {result.data.secondaryCategory} ({result.data.secondaryConfidence?.toFixed(1)}%)
                </span>
              )}
            </div>
          )}

          {/* Skills grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', animation: 'fadeUp .5s ease .45s both' }}>
            {[
              { title: '✓ Matched Skills', color: T.green,  bg: 'rgba(34,197,94,.08)',  bd: 'rgba(34,197,94,.25)',  pillBg: 'rgba(34,197,94,.1)',  pillBd: 'rgba(34,197,94,.3)',  skills: result.data.matchedSkills },
              { title: '✗ Missing Skills', color: T.red,    bg: 'rgba(239,68,68,.06)',   bd: 'rgba(239,68,68,.2)',   pillBg: 'rgba(239,68,68,.1)',  pillBd: 'rgba(239,68,68,.3)',  skills: result.data.missingSkills },
            ].map(block => (
              <div key={block.title} style={{ background: block.bg, border: `1px solid ${block.bd}`, borderRadius: '14px', padding: '1.25rem' }}>
                <div style={{ color: block.color, fontWeight: 700, fontSize: '.85rem', marginBottom: '.75rem' }}>{block.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem' }}>
                  {block.skills.length > 0
                    ? block.skills.map((s, i) => (
                        <span key={s} style={{ fontSize: '.72rem', fontWeight: 700, padding: '.25rem .65rem', borderRadius: '6px', border: `1px solid ${block.pillBd}`, background: block.pillBg, color: block.color, animation: `fadeIn .3s ease ${i * .05}s both` }}>{s}</span>
                      ))
                    : <span style={{ color: T.greyD, fontSize: '.82rem' }}>None</span>}
                </div>
              </div>
            ))}
          </div>

          {/* AI Reasoning */}
          <div style={{ background: 'linear-gradient(135deg,rgba(255,136,0,.05),rgba(255,136,0,.02))', border: `1px solid ${T.lineO}`, borderRadius: '16px', padding: '1.5rem', animation: 'fadeUp .5s ease .5s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.75rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,136,0,.12)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={15} color={T.orange} />
              </div>
              <span style={{ color: T.white, fontWeight: 700, fontSize: '.95rem' }}>AI Reasoning Analysis</span>
            </div>
            <p style={{ color: T.grey, fontSize: '.9rem', lineHeight: 1.7, margin: 0 }}>{result.data.reasoning}</p>
          </div>
        </>
      )}

      <button onClick={onReset}
        onMouseEnter={e => { e.currentTarget.style.opacity = '.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'none'; }}
        style={{ display: 'flex', alignItems: 'center', gap: '.6rem', background: T.btnGrad, border: 'none', borderRadius: '12px', color: T.white, fontSize: '.95rem', fontWeight: 700, padding: '.85rem 2rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 20px rgba(255,136,0,.3)', transition: 'all .2s', marginTop: '2rem', animation: 'fadeUp .5s ease .6s both' }}>
        <RefreshCw size={16} /> Submit Another Application
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */
export default function CandidatePortal({ activeConfig, onApplicationSuccess }) {
  const navigate = useNavigate();
  const { T } = useTheme();
  const [email, setEmail]                   = useState('');
  const [fullName, setFullName]             = useState('');
  const [mobile, setMobile]                 = useState('');
  const [location, setLocation]             = useState('');
  const [file, setFile]                     = useState(null);
  const [dragging, setDragging]             = useState(false);
  const [loading, setLoading]               = useState(false);
  const [result, setResult]                 = useState(null);
  const [error, setError]                   = useState('');
  const [parsing, setParsing]               = useState(false);
  const [extractedUrls, setExtractedUrls]   = useState('');
  const fileInputRef = useRef(null);

  const step = result ? 2 : file ? 1 : 0;

  const handleDragOver  = e => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = ()  => setDragging(false);
  const handleDrop = e => {
    e.preventDefault(); setDragging(false);
    if (e.dataTransfer.files?.[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };
  const handleFileChange = e => { if (e.target.files?.[0]) validateAndSetFile(e.target.files[0]); };

  const parseFileDetails = async (f) => {
    try {
      setParsing(true);
      const fd = new FormData(); fd.append('file', f);
      const res = await axios.post(`${API_BASE_URL}/api/parse`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data.success) {
        const { name, email: em, phone, urls } = res.data;
        if (name) setFullName(name); if (em) setEmail(em);
        if (phone) setMobile(phone); if (urls) setExtractedUrls(urls);
      }
    } catch {}
    finally { setParsing(false); }
  };

  const validateAndSetFile = f => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (['pdf','docx','txt'].includes(ext)) { setFile(f); setError(''); parseFileDetails(f); }
    else { setError('Unsupported file type. Please upload PDF, DOCX, or TXT.'); setFile(null); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !fullName || !location || !file) { setError('Please fill all required fields and upload your resume.'); return; }
    try {
      setLoading(true); setError(''); setResult(null);
      const fd = new FormData();
      fd.append('email', email); fd.append('fullName', fullName);
      fd.append('mobile', mobile); fd.append('location', location);
      fd.append('urls', extractedUrls); fd.append('file', file);
      const res = await axios.post(`${API_BASE_URL}/api/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
      if (res.data.success) onApplicationSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during resume analysis.');
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    setEmail(''); setFullName(''); setMobile(''); setLocation('');
    setFile(null); setResult(null); setError(''); setExtractedUrls('');
  };

  const inputStyle = {
    background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '12px',
    color: T.white, padding: '.8rem 1rem', fontFamily: "'Outfit',sans-serif",
    fontSize: '.95rem', outline: 'none', width: '100%', boxSizing: 'border-box',
    transition: 'border-color .2s, box-shadow .2s',
  };

  return (
    <div style={{ width: '100%', maxWidth: '900px', padding: '2rem 1.5rem', fontFamily: "'Outfit',sans-serif" }}>
      <style>{STYLES}</style>

      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', animation: 'fadeUp .4s ease both' }}>
        <button onClick={() => navigate('/')}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.lineO; e.currentTarget.style.color = T.white; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.line;  e.currentTarget.style.color = T.grey; }}
          style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.42rem .95rem', background: 'transparent', border: `1px solid ${T.line}`, borderRadius: '9px', color: T.grey, fontSize: '.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all .2s' }}>
          <ArrowLeft size={13} /> Home
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <Logo size={26} />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: T.white }}>Screen<span style={{ color: T.orange }}>.AI</span></span>
        </div>
      </div>

      {/* Hero / result heading */}
      {!result && !loading && <HeroHeader activeConfig={activeConfig} />}

      {/* Step dots */}
      {!loading && <StepDots step={step} />}

      {/* Main card */}
      <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '22px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle corner glow */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,136,0,.06) 0%,transparent 70%)', pointerEvents: 'none' }} />

        {loading ? (
          /* ── Loading state ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div style={{ position: 'relative', width: '90px', height: '90px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid rgba(255,136,0,.15)` }} />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `3px solid transparent`, borderTopColor: T.orange, animation: 'spin 1s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '12px', borderRadius: '50%', border: `2px solid transparent`, borderTopColor: T.orangeL, animation: 'spin .7s linear infinite reverse' }} />
              <div style={{ position: 'absolute', inset: '22px', borderRadius: '50%', background: 'rgba(255,136,0,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={22} color={T.orange} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: T.white, fontSize: '1.3rem', fontWeight: 800, margin: '0 0 .5rem', animation: 'pulse 1.5s ease-in-out infinite' }}>Analyzing Resume…</h3>
              <p style={{ color: T.grey, fontSize: '.9rem', lineHeight: 1.6, maxWidth: '300px', margin: '0 auto' }}>
                Extracting text, comparing metrics, calculating cosine similarity…
              </p>
            </div>
            <div style={{ display: 'flex', gap: '.5rem' }}>
              {[0,.15,.3].map(d => (
                <div key={d} style={{ width: '8px', height: '8px', borderRadius: '50%', background: T.orange, animation: `pulse 1.2s ease-in-out ${d}s infinite` }} />
              ))}
            </div>
          </div>

        ) : result ? (
          <ResultView result={result} activeConfig={activeConfig} onReset={handleReset} />

        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', borderBottom: `1px solid ${T.line}`, paddingBottom: '1rem', marginBottom: '1.75rem', animation: 'slideRight .4s ease both' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(255,136,0,.1)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={17} color={T.orange} />
              </div>
              <h3 style={{ color: T.white, fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Application Details</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Field icon={User} label="Full Name *" delay=".05s">
                <input type="text" required placeholder="John Doe" value={fullName}
                  onChange={e => setFullName(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
                  onBlur={e  => { e.target.style.borderColor = T.line;  e.target.style.boxShadow = 'none'; }}/>
              </Field>
              <Field icon={Mail} label="Email Address *" delay=".1s">
                <input type="email" required placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
                  onBlur={e  => { e.target.style.borderColor = T.line;  e.target.style.boxShadow = 'none'; }}/>
              </Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <Field icon={Phone} label="Mobile Phone" delay=".15s">
                <input type="tel" placeholder="+92 300 1234567" value={mobile}
                  onChange={e => setMobile(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
                  onBlur={e  => { e.target.style.borderColor = T.line;  e.target.style.boxShadow = 'none'; }}/>
              </Field>
              <Field icon={MapPin} label="Location *" delay=".2s">
                <input type="text" required placeholder="Lahore, Pakistan" value={location}
                  onChange={e => setLocation(e.target.value)} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = T.orange; e.target.style.boxShadow = '0 0 0 3px rgba(255,136,0,.12)'; }}
                  onBlur={e  => { e.target.style.borderColor = T.line;  e.target.style.boxShadow = 'none'; }}/>
              </Field>
            </div>

            {/* Drop zone */}
            <div style={{ animation: 'fadeUp .5s ease .25s both' }}>
              <label style={{ fontSize: '.75rem', fontWeight: 700, color: T.grey, textTransform: 'uppercase', letterSpacing: '.55px', display: 'flex', alignItems: 'center', gap: '.35rem', marginBottom: '.5rem' }}>
                <FileText size={11} color={T.greyD} /> Resume File (PDF, DOCX, TXT) *
              </label>
              <div
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                style={{
                  border: `2px dashed ${dragging ? T.orange : file ? T.lineO : T.line}`,
                  borderRadius: '16px', padding: '2.5rem 2rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '.9rem', cursor: 'pointer', textAlign: 'center',
                  background: dragging ? 'rgba(255,136,0,.04)' : file ? 'rgba(255,136,0,.02)' : 'transparent',
                  transition: 'all .25s',
                  ...(file && !dragging ? { animation: 'borderPulse 2s ease-in-out infinite' } : {}),
                }}>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.docx,.txt" />
                {file ? (
                  <>
                    <div className="cp-float" style={{ width: '60px', height: '60px', borderRadius: '14px', background: 'rgba(255,136,0,.1)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={28} color={T.orange} />
                    </div>
                    <div>
                      <div style={{ color: T.white, fontWeight: 700, fontSize: '1rem' }}>{file.name}</div>
                      <div style={{ color: T.greyD, fontSize: '.8rem', marginTop: '.25rem' }}>
                        {parsing
                          ? <span style={{ color: T.orangeL, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.4rem' }}>
                              <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Auto-extracting details…
                            </span>
                          : `${(file.size/1024).toFixed(1)} KB · Parsed ✓`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.25)', borderRadius: '999px', padding: '.28rem .75rem', color: T.green, fontSize: '.75rem', fontWeight: 600 }}>
                      <CheckCircle size={12} /> Ready to submit
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,.03)', border: `1px solid ${T.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UploadCloud size={30} color={T.grey} />
                    </div>
                    <div>
                      <div style={{ color: T.white, fontWeight: 600, fontSize: '1rem' }}>
                        Drag & drop or <span style={{ color: T.orange, textDecoration: 'underline' }}>browse</span>
                      </div>
                      <div style={{ color: T.greyD, fontSize: '.8rem', marginTop: '.3rem' }}>PDF, DOCX, TXT · Max 10 MB</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.75rem 1rem', borderRadius: '10px', background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.25)', color: T.red, fontSize: '.85rem', marginTop: '1rem', animation: 'scaleIn .3s ease both' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', animation: 'fadeUp .5s ease .3s both' }}>
              <button type="submit"
                className="cp-glow"
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(255,136,0,.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 20px rgba(255,136,0,.3)'; }}
                style={{ display: 'flex', alignItems: 'center', gap: '.55rem', background: T.btnGrad, border: 'none', borderRadius: '12px', color: T.white, fontSize: '1rem', fontWeight: 800, padding: '.9rem 2.2rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 20px rgba(255,136,0,.3)', transition: 'transform .2s, box-shadow .2s', letterSpacing: '-.2px' }}>
                Submit Application <ChevronRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* CV Enhancer */}
      {file && !result && !loading && <CVEnhancer file={file} activeConfig={activeConfig} />}
    </div>
  );
}
