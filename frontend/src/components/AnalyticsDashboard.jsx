import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { Users, Layers, Award, MapPin, Loader2, AlertCircle, RefreshCw, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../theme.jsx';

/* ── Animations ─────────────────────────────────────── */
const ANIM = `
@keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes countUp  { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
@keyframes shimmer  { from{background-position:-400px 0} to{background-position:400px 0} }
@keyframes spin     { to{transform:rotate(360deg)} }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes barGrow  { from{transform:scaleY(0)} to{transform:scaleY(1)} }
@keyframes borderO  { 0%,100%{border-color:rgba(255,136,0,.15)} 50%{border-color:rgba(255,136,0,.5)} }
`;

/* ── Animated counter ────────────────────────────────── */
function Counter({ end, suffix = '', prefix = '', duration = 1400 }) {
  const { T } = useTheme();
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: .3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const n = parseFloat(end);
    if (isNaN(n)) { setVal(end); return; }
    const steps = 60;
    let cur = 0;
    const inc = n / steps;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, n);
      setVal(Number.isInteger(n) ? Math.round(cur) : cur.toFixed(1));
      if (cur >= n) clearInterval(t);
    }, duration / steps);
    return () => clearInterval(t);
  }, [started, end, duration]);

  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* ── Skeleton loader ─────────────────────────────────── */
function Skeleton({ h = '280px', radius = '16px' }) {
  const { mode } = useTheme();
  return (
    <div style={{ height: h, borderRadius: radius, background: mode === 'dark' ? 'linear-gradient(90deg,#111 25%,#1a1a1a 50%,#111 75%)' : 'linear-gradient(90deg,#e8e5e0 25%,#f0ede8 50%,#e8e5e0 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.4s linear infinite' }} />
  );
}

/* ── Custom tooltip ──────────────────────────────────── */
function Tip({ active, payload, label }) {
  const { T } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0e0e0e', border: `1px solid ${T.lineO}`, borderRadius: '10px', padding: '10px 14px', boxShadow: '0 12px 32px rgba(0,0,0,.7)', minWidth: '120px' }}>
      <p style={{ fontWeight: 700, color: T.white, margin: '0 0 6px', fontSize: '.85rem' }}>{label || payload[0].name}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || T.orange, margin: '2px 0', fontSize: '.82rem', fontWeight: 600 }}>
          {p.name}: {p.value}{p.name?.toLowerCase().includes('score') ? '%' : ''}
        </p>
      ))}
    </div>
  );
}

/* ── KPI Card ────────────────────────────────────────── */
function KPICard({ icon: Icon, label, value, suffix, prefix, color, bg, delay = '0s', trend }) {
  const { T } = useTheme();
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${color}22`, borderRadius: '18px', padding: '1.4rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '.75rem', animation: `fadeUp .5s ease ${delay} both`, position: 'relative', overflow: 'hidden', transition: 'border-color .3s', cursor: 'default' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${color}55`}
      onMouseLeave={e => e.currentTarget.style.borderColor = `${color}22`}>
      {/* BG glow */}
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: `radial-gradient(circle,${bg} 0%,transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={20} color={color} />
        </div>
        {trend != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem', background: trend >= 0 ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)', border: `1px solid ${trend >= 0 ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`, borderRadius: '999px', padding: '.18rem .6rem' }}>
            <TrendingUp size={11} color={trend >= 0 ? T.green : T.red} style={{ transform: trend < 0 ? 'scaleY(-1)' : 'none' }} />
            <span style={{ fontSize: '.68rem', fontWeight: 700, color: trend >= 0 ? T.green : T.red }}>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '.72rem', color: T.grey, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 600, marginBottom: '.3rem' }}>{label}</div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '2rem', fontWeight: 900, color, letterSpacing: '-1.5px', lineHeight: 1, animation: `countUp .6s ease ${delay} both` }}>
          <Counter end={value} suffix={suffix} prefix={prefix} />
        </div>
      </div>
    </div>
  );
}

/* ── Chart Card ─────────────────────────────────────── */
function ChartCard({ title, subtitle, children, delay = '0s', action }) {
  const { T } = useTheme();
  return (
    <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', animation: `fadeUp .5s ease ${delay} both`, transition: 'border-color .25s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.lineO}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.line}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <div style={{ width: '3px', height: '16px', background: T.btnGrad, borderRadius: '2px' }} />
            <h3 style={{ color: T.white, fontSize: '.98rem', fontWeight: 700, margin: 0 }}>{title}</h3>
          </div>
          {subtitle && <p style={{ color: T.greyD, fontSize: '.75rem', margin: '.3rem 0 0 .75rem' }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ── Selected / Rejected mini bar ────────────────────── */
function SelectionBar({ selected, total }) {
  const { T } = useTheme();
  const pct = total > 0 ? Math.round((selected / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
          <CheckCircle size={13} color={T.green} />
          <span style={{ color: T.grey, fontSize: '.8rem' }}>Selected</span>
        </div>
        <span style={{ color: T.green, fontWeight: 700, fontSize: '.8rem' }}>{selected} / {total}</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,.06)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${T.orange},${T.green})`, borderRadius: '99px', transition: 'width 1s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: T.greyD, fontSize: '.72rem' }}>Selection rate</span>
        <span style={{ color: T.white, fontWeight: 700, fontSize: '.72rem' }}>{pct}%</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════ */
export default function AnalyticsDashboard() {
  const [data, setData]    = useState(null);
  const [loading, setLoad] = useState(true);
  const [error, setError]  = useState('');
  const { T } = useTheme();

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      setLoad(true);
      const res = await axios.get(`${API_BASE_URL}/api/analytics?t=${Date.now()}`);
      setData(res.data); setError('');
    } catch { setError('Could not retrieve analytics. Is the backend running?'); }
    finally { setLoad(false); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <style>{ANIM}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.5rem' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,136,0,.08)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={26} color={T.orange} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
        <div>
          <div style={{ color: T.white, fontWeight: 700, animation: 'pulse 1.5s ease-in-out infinite' }}>Loading dashboard…</div>
          <div style={{ color: T.greyD, fontSize: '.82rem', marginTop: '2px' }}>Fetching candidate analytics</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem' }}>
        {[...Array(4)].map((_, i) => <Skeleton key={i} h="108px" />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {[...Array(4)].map((_, i) => <Skeleton key={i} h="320px" />)}
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1.25rem', animation: 'fadeIn .5s ease both' }}>
      <style>{ANIM}</style>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AlertCircle color={T.red} size={32} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ color: T.white, margin: '0 0 .4rem' }}>Dashboard Unavailable</h3>
        <p style={{ color: T.grey, fontSize: '.9rem', maxWidth: '300px' }}>{error}</p>
      </div>
      <button onClick={fetchAnalytics}
        onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        style={{ display: 'flex', alignItems: 'center', gap: '.5rem', background: T.btnGrad, border: 'none', borderRadius: '10px', color: T.white, fontSize: '.9rem', fontWeight: 700, padding: '.75rem 1.5rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", boxShadow: '0 4px 16px rgba(255,136,0,.3)', transition: 'opacity .2s' }}>
        <RefreshCw size={15} /> Retry
      </button>
    </div>
  );

  const { total_applicants, unique_categories, avg_score, primary_location,
          category_distribution, score_distribution, top_skills, geo_distribution } = data;

  const selected_count = category_distribution?.reduce((a, c) => a + (c.selected || 0), 0) ?? 0;
  const COLORS = [T.orange, T.orangeL, '#facc15', '#fb923c', '#fbbf24', '#fed7aa', '#fef3c7'];

  return (
    <div className="animated-view" style={{ fontFamily: "'Outfit',sans-serif" }}>
      <style>{ANIM}</style>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', animation: 'fadeUp .4s ease both' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'rgba(255,136,0,.08)', border: `1px solid rgba(255,136,0,.2)`, borderRadius: '999px', padding: '.28rem .8rem', color: T.orangeL, fontSize: '.72rem', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '.75rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: T.green, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} /> Live Data
          </div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.3rem)', fontWeight: 900, color: T.white, margin: 0, letterSpacing: '-1px' }}>
            Analytics &amp; <span style={{ background: `linear-gradient(90deg,${T.orange},${T.orangeL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Insights</span>
          </h1>
          <p style={{ color: T.grey, marginTop: '.35rem', fontSize: '.92rem' }}>Real-time candidate metrics and AI screening telemetry.</p>
        </div>
        <button onClick={fetchAnalytics}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.lineO; e.currentTarget.style.color = T.orange; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.line;  e.currentTarget.style.color = T.grey; }}
          style={{ display: 'flex', alignItems: 'center', gap: '.4rem', padding: '.55rem 1rem', background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '10px', color: T.grey, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit',sans-serif", transition: 'all .2s', flexShrink: 0 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── KPI row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <KPICard icon={Users}   label="Total Applicants"  value={total_applicants}  color={T.orange}  bg="rgba(255,136,0,.12)"   delay=".05s" trend={12} />
        <KPICard icon={Layers}  label="Role Categories"   value={unique_categories} color={T.orangeL} bg="rgba(255,170,51,.1)"   delay=".1s"  />
        <KPICard icon={Award}   label="Avg. Match Score"  value={avg_score}         suffix="%" color={T.green} bg="rgba(34,197,94,.1)" delay=".15s" trend={5} />
        <KPICard icon={MapPin}  label="Top Location"      value={primary_location}  color={T.white}   bg="rgba(255,255,255,.06)" delay=".2s"  />
      </div>

      {total_applicants === 0 ? (
        /* Empty state */
        <div style={{ background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '20px', padding: '4rem 2rem', textAlign: 'center', animation: 'fadeUp .5s ease .2s both' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <h3 style={{ color: T.white, margin: '0 0 .5rem', fontSize: '1.2rem' }}>No Data Yet</h3>
          <p style={{ color: T.grey, fontSize: '.9rem', maxWidth: '360px', margin: '0 auto' }}>
            Submit resumes via the Candidate Portal to populate charts and analytics.
          </p>
        </div>
      ) : (
        <>
          {/* ── Row 1 ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

            {/* Applicants by Category — horizontal bars */}
            <ChartCard title="Applicants by Category" subtitle="Role distribution across all applications" delay=".1s">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={category_distribution} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }} barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" horizontal={false} />
                    <XAxis type="number" stroke={T.greyD} tick={{ fill: T.grey, fontSize: 11, fontFamily: "'Outfit',sans-serif" }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="category" type="category" stroke={T.greyD} width={100} tick={{ fill: T.grey, fontSize: 11, fontFamily: "'Outfit',sans-serif" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,136,0,.04)' }} />
                    <Bar dataKey="count" name="Applicants" radius={[0, 6, 6, 0]}>
                      {category_distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Match Quality Trend — area chart */}
            <ChartCard title="Match Quality Trend" subtitle="Average AI score per role category" delay=".15s">
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={score_distribution} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={T.orange} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={T.orange} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" />
                    <XAxis dataKey="category" stroke={T.greyD} tick={{ fill: T.grey, fontSize: 10, fontFamily: "'Outfit',sans-serif" }} axisLine={false} tickLine={false} />
                    <YAxis stroke={T.greyD} domain={[0, 100]} tick={{ fill: T.grey, fontSize: 11, fontFamily: "'Outfit',sans-serif" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} />
                    <Area type="monotone" dataKey="avg_score" name="Avg Score" stroke={T.orange} strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: T.orangeD, strokeWidth: 2, r: 4, stroke: T.orange }} activeDot={{ r: 7, fill: T.orangeL }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* ── Row 2 ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

            {/* Top Skills donut */}
            <ChartCard title="Top Skills" subtitle="Most frequent matched keywords" delay=".2s">
              <div style={{ height: '260px' }}>
                {top_skills?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={top_skills} cx="50%" cy="50%" innerRadius={52} outerRadius={82}
                        paddingAngle={3} dataKey="frequency" nameKey="skill"
                        label={({ name, percent }) => percent > 0.07 ? `${name}` : ''}
                        labelLine={{ stroke: T.greyD, strokeWidth: 1 }}>
                        {top_skills.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip content={<Tip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: T.greyD, fontSize: '.9rem' }}>No skills data</div>
                )}
              </div>
            </ChartCard>

            {/* Geo Distribution */}
            <ChartCard title="Geo Distribution" subtitle="Candidates by location" delay=".25s">
              <div style={{ height: '260px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geo_distribution} margin={{ left: 0, right: 5, top: 5, bottom: 20 }} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
                    <XAxis dataKey="location" stroke={T.greyD} tick={{ fill: T.grey, fontSize: 10, fontFamily: "'Outfit',sans-serif" }} angle={-30} textAnchor="end" axisLine={false} tickLine={false} />
                    <YAxis stroke={T.greyD} tick={{ fill: T.grey, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,136,0,.04)' }} />
                    <Bar dataKey="count" name="Candidates" fill={T.orange} radius={[5, 5, 0, 0]}>
                      {(geo_distribution || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Selection rate mini card */}
            <ChartCard title="Selection Rate" subtitle="Selected vs total screened" delay=".3s">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '.5rem 0' }}>
                {/* Big number */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: '3.5rem', fontWeight: 900, color: T.orange, letterSpacing: '-3px', lineHeight: 1, animation: 'countUp .7s ease .3s both' }}>
                    <Counter end={total_applicants > 0 ? Math.round((selected_count / total_applicants) * 100) : 0} suffix="%" />
                  </div>
                  <div style={{ color: T.grey, fontSize: '.78rem', marginTop: '.35rem' }}>pass rate</div>
                </div>

                <SelectionBar selected={selected_count} total={total_applicants} />

                {/* Mini stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
                  <div style={{ background: 'rgba(34,197,94,.07)', border: '1px solid rgba(34,197,94,.2)', borderRadius: '10px', padding: '.7rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem', marginBottom: '.2rem' }}>
                      <CheckCircle size={11} color={T.green} />
                      <span style={{ color: T.greyD, fontSize: '.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Selected</span>
                    </div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.4rem', color: T.green, letterSpacing: '-1px' }}>
                      <Counter end={selected_count} />
                    </div>
                  </div>
                  <div style={{ background: 'rgba(239,68,68,.07)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '10px', padding: '.7rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem', marginBottom: '.2rem' }}>
                      <XCircle size={11} color={T.red} />
                      <span style={{ color: T.greyD, fontSize: '.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Rejected</span>
                    </div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: '1.4rem', color: T.red, letterSpacing: '-1px' }}>
                      <Counter end={total_applicants - selected_count} />
                    </div>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* ── Row 3: Skills legend list ── */}
          {top_skills?.length > 0 && (
            <ChartCard title="Skill Frequency Breakdown" subtitle="All matched keywords ranked by occurrence" delay=".35s">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {top_skills.map((sk, i) => (
                  <div key={sk.skill} style={{ display: 'flex', alignItems: 'center', gap: '.45rem', background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '8px', padding: '.38rem .75rem', animation: `fadeIn .3s ease ${i * .04}s both` }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <span style={{ color: T.white, fontSize: '.78rem', fontWeight: 600 }}>{sk.skill}</span>
                    <span style={{ color: T.grey, fontSize: '.72rem' }}>{sk.frequency}×</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}
        </>
      )}
    </div>
  );
}
