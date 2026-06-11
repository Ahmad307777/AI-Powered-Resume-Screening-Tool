import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Users, Layout, Award, MapPin, Loader2, AlertCircle } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#ef4444'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/analytics?t=${new Date().getTime()}`);
      setData(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not retrieve telemetry data. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 style={styles.spinner} size={48} />
        <p style={{ marginTop: '1rem', color: '#9ca3af' }}>Loading analytical data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle color="#ef4444" size={48} />
        <h3 style={{ marginTop: '1rem', color: '#fff' }}>Failed to Load Dashboard</h3>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem', textAlign: 'center' }}>{error}</p>
        <button onClick={fetchAnalytics} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
          Retry Request
        </button>
      </div>
    );
  }

  const {
    total_applicants,
    unique_categories,
    avg_score,
    primary_location,
    category_distribution,
    score_distribution,
    top_skills,
    geo_distribution,
  } = data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.customTooltip}>
          <p style={{ fontWeight: 600, color: '#fff' }}>{label || payload[0].name}</p>
          <p style={{ color: '#a855f7', marginTop: '4px' }}>
            {payload[0].name ? `${payload[0].name}: ` : ''}
            {payload[0].value}
            {payload[0].name && payload[0].name.toLowerCase().includes('score') ? '%' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animated-view">
      <div style={styles.header}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', margin: 0 }}>
          🎯 Analytics & Insights
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.25rem' }}>
          Real-time candidate metrics and machine learning screening telemetry.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={styles.kpiCard}>
          <div style={{ ...styles.iconWrapper, background: 'rgba(239, 68, 68, 0.1)' }}>
            <Users color="#ef4444" size={24} />
          </div>
          <div>
            <div style={styles.kpiTitle}>Total Applicants</div>
            <div style={{ ...styles.kpiValue, color: '#ef4444' }}>{total_applicants}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.kpiCard}>
          <div style={{ ...styles.iconWrapper, background: 'rgba(236, 72, 153, 0.1)' }}>
            <Layout color="#ec4899" size={24} />
          </div>
          <div>
            <div style={styles.kpiTitle}>Unique Categories</div>
            <div style={{ ...styles.kpiValue, color: '#ec4899' }}>{unique_categories}</div>
          </div>
        </div>

        <div className="glass-card" style={styles.kpiCard}>
          <div style={{ ...styles.iconWrapper, background: 'rgba(16, 185, 129, 0.1)' }}>
            <Award color="#10b981" size={24} />
          </div>
          <div>
            <div style={styles.kpiTitle}>Avg. Match Score</div>
            <div style={{ ...styles.kpiValue, color: '#10b981' }}>{avg_score}%</div>
          </div>
        </div>

        <div className="glass-card" style={styles.kpiCard}>
          <div style={{ ...styles.iconWrapper, background: 'rgba(6, 182, 212, 0.1)' }}>
            <MapPin color="#06b6d4" size={24} />
          </div>
          <div>
            <div style={styles.kpiTitle}>Primary Location</div>
            <div style={{ ...styles.kpiValue, color: '#06b6d4', fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {primary_location}
            </div>
          </div>
        </div>
      </div>

      {total_applicants === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>
            No applicants are currently registered in the database.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Submit resumes through the Candidate Portal to populate these charts.
          </p>
        </div>
      ) : (
        <>
          {/* First Row of Charts */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <div className="glass-card" style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Applicants by Category Profile</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={category_distribution} layout="vertical" margin={{ left: 20, right: 10, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="category" type="category" stroke="#9ca3af" width={120} style={{ fontSize: '12px' }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                    <Bar dataKey="count" name="Applicants" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                      {category_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card" style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Algorithmic Match Quality Trend</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={score_distribution} margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="category" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="avg_score" name="Avg Score" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#e11d48', strokeWidth: 2, r: 5 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Second Row of Charts */}
          <div className="grid-2">
            <div className="glass-card" style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Top 10 Driver Skills (Keywords Matched)</h3>
              <div style={styles.chartContainer} className="flex-center">
                {top_skills && top_skills.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={top_skills}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="frequency"
                        nameKey="skill"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {top_skills.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ color: '#6b7280' }}>No skills recorded yet.</p>
                )}
              </div>
            </div>

            <div className="glass-card" style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Geo Distribution of Candidate Pool</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={geo_distribution} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="location" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Candidates" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '2.5rem',
    textAlign: 'left',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
  },
  spinner: {
    animation: 'spin 1.5s linear infinite',
    color: '#8b5cf6',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    padding: '2rem',
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.5rem',
    textAlign: 'left',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiTitle: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.75px',
  },
  kpiValue: {
    fontSize: '1.8rem',
    fontWeight: '800',
    marginTop: '0.25rem',
  },
  chartCard: {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  chartTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#fff',
    borderLeft: '4px solid #8b5cf6',
    paddingLeft: '8px',
  },
  chartContainer: {
    height: '280px',
    width: '100%',
  },
  customTooltip: {
    backgroundColor: '#11131c',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '10px 14px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
};
