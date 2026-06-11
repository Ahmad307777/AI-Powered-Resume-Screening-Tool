import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Layout, Award, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { T } from '../theme.jsx';

const COLORS = [T.orange, T.orangeL, '#facc15', '#fb923c', '#fde68a', '#fed7aa', '#fef3c7'];

export default function AnalyticsDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      setLoad(true);
      const res = await axios.get(`${API_BASE_URL}/api/analytics?t=${Date.now()}`);
      setData(res.data); setError('');
    } catch { setError('Could not retrieve analytics. Is the backend running?'); }
    finally { setLoad(false); }
  };

  const Tip = ({ active, payload, label }) => active && payload?.length ? (
    <div style={{ background: T.bgCard, border: `1px solid ${T.lineO}`, borderRadius: '8px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.6)' }}>
      <p style={{ fontWeight: 700, color: T.white, margin: '0 0 4px' }}>{label || payload[0].name}</p>
      <p style={{ color: T.orangeL, margin: 0 }}>{payload[0].value}{payload[0].name?.toLowerCase().includes('score') ? '%' : ''}</p>
    </div>
  ) : null;

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,136,0,.08)', border: `1px solid ${T.lineO}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color={T.orange} style={{ animation: 'spin 1.2s linear infinite' }}/>
      </div>
      <p style={{ marginTop: '1rem', color: T.grey }}>Loading analytics…</p>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', padding: '2rem' }}>
      <AlertCircle color={T.red} size={48}/>
      <h3 style={{ color: T.white, marginTop: '1rem' }}>Failed to Load Dashboard</h3>
      <p style={{ color: T.grey, marginTop: '.5rem', textAlign: 'center' }}>{error}</p>
      <button onClick={fetchAnalytics} style={{ marginTop: '1.5rem', ...S.btnSec }}>Retry</button>
    </div>
  );

  const { total_applicants, unique_categories, avg_score, primary_location, category_distribution, score_distribution, top_skills, geo_distribution } = data;

  const KPI = ({ icon: Icon, label, value, color, bg }) => (
    <div style={{ ...S.kpiCard, borderColor: `${color}25` }}>
      <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color}/>
      </div>
      <div>
        <div style={{ fontSize: '.72rem', color: T.grey, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color, marginTop: '.15rem', letterSpacing: '-1px', lineHeight: 1, fontFamily: "'Outfit',sans-serif" }}>{value}</div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children }) => (
    <div style={S.chartCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '1rem' }}>
        <div style={{ width: '4px', height: '18px', background: T.btnGrad, borderRadius: '2px' }}/>
        <h3 style={{ color: T.white, fontSize: '1rem', fontWeight: 700, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="animated-view">
      {/* Page heading */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, color: T.white, margin: 0, letterSpacing: '-1px' }}>
          Analytics &amp; <span style={{ background: T.txtGrad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Insights</span>
        </h1>
        <p style={{ color: T.grey, marginTop: '.3rem', fontSize: '.95rem' }}>Real-time candidate metrics and AI screening telemetry.</p>
      </div>

      {/* KPI row */}
      <div style={S.kpiRow}>
        <KPI icon={Users}   label="Total Applicants"  value={total_applicants}  color={T.orange}  bg="rgba(255,136,0,.1)"  />
        <KPI icon={Layout}  label="Unique Categories" value={unique_categories} color={T.orangeL} bg="rgba(255,170,51,.1)" />
        <KPI icon={Award}   label="Avg. Match Score"  value={`${avg_score}%`}  color={T.green}   bg="rgba(34,197,94,.1)"  />
        <KPI icon={MapPin}  label="Primary Location"  value={primary_location} color={T.white}   bg="rgba(255,255,255,.06)"  />
      </div>

      {total_applicants === 0 ? (
        <div style={{ ...S.chartCard, textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: T.grey, fontSize: '1.05rem' }}>No applicants in the database yet.</p>
          <p style={{ color: T.greyD, fontSize: '.9rem', marginTop: '.4rem' }}>Submit resumes via the Candidate Portal to populate these charts.</p>
        </div>
      ) : (
        <>
          <div style={S.grid2}>
            <ChartCard title="Applicants by Category">
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={category_distribution} layout="vertical" margin={{ left: 20, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                    <XAxis type="number" stroke={T.greyD} tick={{ fill: T.grey, fontSize: 11 }}/>
                    <YAxis dataKey="category" type="category" stroke={T.greyD} width={110} tick={{ fill: T.grey, fontSize: 11 }}/>
                    <Tooltip content={<Tip/>} cursor={{ fill: 'rgba(255,136,0,.04)' }}/>
                    <Bar dataKey="count" name="Applicants" radius={[0,4,4,0]}>
                      {category_distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Match Quality Trend">
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={score_distribution} margin={{ left: 5, right: 15, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                    <XAxis dataKey="category" stroke={T.greyD} tick={{ fill: T.grey, fontSize: 11 }}/>
                    <YAxis stroke={T.greyD} domain={[0,100]} tick={{ fill: T.grey, fontSize: 11 }}/>
                    <Tooltip content={<Tip/>}/>
                    <Line type="monotone" dataKey="avg_score" name="Avg Score" stroke={T.orange} strokeWidth={3} dot={{ fill: T.orangeD, strokeWidth: 2, r: 5 }} activeDot={{ r: 8, fill: T.orangeL }}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div style={{ ...S.grid2, marginTop: '1.5rem' }}>
            <ChartCard title="Top Skills (Keywords Matched)">
              <div style={{ height: '280px' }}>
                {top_skills?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={top_skills} cx="50%" cy="50%" innerRadius={55} outerRadius={88} paddingAngle={4} dataKey="frequency" nameKey="skill"
                        label={({ name, percent }) => `${name} (${(percent*100).toFixed(0)}%)`}
                        labelLine={{ stroke: T.greyD }}>
                        {top_skills.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
                      </Pie>
                      <Tooltip content={<Tip/>}/>
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p style={{ color: T.greyD, textAlign: 'center', paddingTop: '6rem' }}>No skills yet.</p>}
              </div>
            </ChartCard>

            <ChartCard title="Geo Distribution">
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geo_distribution} margin={{ left: 5, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)"/>
                    <XAxis dataKey="location" stroke={T.greyD} tick={{ fill: T.grey, fontSize: 11 }}/>
                    <YAxis stroke={T.greyD} tick={{ fill: T.grey, fontSize: 11 }}/>
                    <Tooltip content={<Tip/>} cursor={{ fill: 'rgba(255,136,0,.04)' }}/>
                    <Bar dataKey="count" name="Candidates" fill={T.orange} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  );
}

const S = {
  kpiRow:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' },
  kpiCard:   { background: T.bgCard, border: '1px solid', borderRadius: '16px', padding: '1.4rem', display: 'flex', alignItems: 'center', gap: '1rem' },
  grid2:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(380px,1fr))', gap: '1.5rem' },
  chartCard: { background: T.bgCard, border: `1px solid ${T.line}`, borderRadius: '18px', padding: '1.5rem' },
  btnSec:    { background: T.bgCard2, border: `1px solid ${T.line}`, borderRadius: '8px', color: T.offW, fontSize: '.88rem', fontWeight: 600, padding: '.6rem 1.4rem', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" },
  txtGrad:   T.txtGrad,
};
