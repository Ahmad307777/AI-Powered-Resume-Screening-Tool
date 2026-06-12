import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { ThemeProvider } from './theme.jsx';
import Sidebar from './components/Sidebar';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RecruiterPanel from './components/RecruiterPanel';
import CandidatePortal from './components/CandidatePortal';
import PortalSelect from './components/PortalSelect';

function HRPortal({ activeConfig, handleConfigChange }) {
  const [activeTab, setActiveTab] = useState('analytics');
  
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} activeConfig={activeConfig} />
      <main className="main-content">
        {activeTab === 'analytics' ? (
          <AnalyticsDashboard />
        ) : (
          <RecruiterPanel activeConfig={activeConfig} onConfigChange={handleConfigChange} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [activeConfig, setActiveConfig] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchActiveConfig();
  }, [refreshTrigger]);

  const fetchActiveConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/config?t=${new Date().getTime()}`);
      setActiveConfig(res.data);
    } catch (err) {
      console.error('Failed to retrieve active configuration details:', err);
    }
  };

  const handleConfigChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PortalSelect />} />
          
          <Route path="/candidate" element={
            <div className="app-container">
               <main className="main-content" style={{ width: '100%', maxWidth: '100%', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                  <CandidatePortal activeConfig={activeConfig} onApplicationSuccess={handleConfigChange} />
               </main>
            </div>
          } />
          
          <Route path="/hr" element={
            <HRPortal activeConfig={activeConfig} handleConfigChange={handleConfigChange} />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
