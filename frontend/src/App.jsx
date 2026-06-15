import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { ThemeProvider } from './theme.jsx';
import Sidebar from './components/Sidebar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RecruiterPanel from './components/RecruiterPanel';
import CandidatePortal from './components/CandidatePortal';
import PortalSelect from './components/PortalSelect';
import HRLogin, { isHRAuthenticated, getHRUser } from './components/HRLogin';

function HRPortal({ handleConfigChange }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [activeConfig, setActiveConfig] = useState(null);
  const hrUser = getHRUser();
  const hrId = hrUser?.hr_id || '';

  const fetchConfig = async () => {
    if (!hrId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/config?hr_id=${hrId}&t=${Date.now()}`);
      setActiveConfig(res.data);
    } catch (err) {
      console.error('Failed to load HR config:', err);
    }
  };

  useEffect(() => { fetchConfig(); }, [hrId]);

  const onConfigChange = () => { fetchConfig(); handleConfigChange(); };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} activeConfig={activeConfig} hrUser={hrUser} />
      <main className="main-content">
        {activeTab === 'analytics' ? (
          <AnalyticsDashboard hrId={hrId} />
        ) : (
          <RecruiterPanel activeConfig={activeConfig} onConfigChange={onConfigChange} hrId={hrId} />
        )}
      </main>
    </div>
  );
}

/* Guard: redirect to /hr-login if not authenticated */
function ProtectedHR({ children }) {
  return isHRAuthenticated() ? children : <Navigate to="/hr-login" replace />;
}

export default function App() {
  const [activeConfig, setActiveConfig] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Global config fetch for CandidatePortal (uses first/active HR config)
  useEffect(() => { fetchGlobalConfig(); }, [refreshTrigger]);

  const fetchGlobalConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/config?t=${Date.now()}`);
      setActiveConfig(res.data);
    } catch (err) {
      console.error('Failed to retrieve config:', err);
    }
  };

  const handleConfigChange = () => setRefreshTrigger(p => p + 1);

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PortalSelect />} />
          <Route path="/hr-login" element={<HRLogin />} />
          <Route path="/candidate" element={
            <div className="app-container">
              <main className="main-content" style={{ width:'100%', maxWidth:'100%', margin:'0 auto', display:'flex', justifyContent:'center' }}>
                <CandidatePortal activeConfig={activeConfig} onApplicationSuccess={handleConfigChange} />
              </main>
            </div>
          } />
          <Route path="/hr" element={
            <ProtectedHR>
              <HRPortal handleConfigChange={handleConfigChange} />
            </ProtectedHR>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
