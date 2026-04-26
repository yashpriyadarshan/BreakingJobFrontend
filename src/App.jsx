import { useState, useEffect } from 'react'
import Header from './components/Header'
import CandidateHome from './pages/CandidateHome'
import CandidateJobs from './pages/CandidateJobs'
import Companies from './pages/Companies'
import Community from './pages/Community'
import RecruiterHome from './pages/RecruiterHome'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import RecruiterAuth from './pages/RecruiterAuth'
import CreateJob from './pages/CreateJob'
import Candidates from './pages/Candidates'
import Interviews from './pages/Interviews'

function App() {
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'FOR CANDIDATE');
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    localStorage.setItem('role', role);
  }, [role]);

  useEffect(() => {
    if (activeTab) {
      sessionStorage.setItem('activeTab', activeTab);
    } else {
      sessionStorage.removeItem('activeTab');
    }
  }, [activeTab]);


  const renderContent = () => {
    if (activeTab === 'Login' || activeTab === 'Signup') {
      return <Auth role={role} setRole={setRole} activeTab={activeTab} setActiveTab={setActiveTab} setIsAuthenticated={setIsAuthenticated} />;
    }

    if (activeTab === 'RecruiterLogin' || activeTab === 'RecruiterSignup') {
      return <RecruiterAuth role={role} setRole={setRole} activeTab={activeTab} setActiveTab={setActiveTab} setIsAuthenticated={setIsAuthenticated} />;
    }
    
    if (activeTab === 'Profile') {
      return <Profile role={role} setActiveTab={setActiveTab} />;
    }
    
    if (activeTab === 'Settings') {
      return <Settings role={role} setIsAuthenticated={setIsAuthenticated} setActiveTab={setActiveTab} />;
    }

    if (activeTab === 'Community') {
      return <Community />;
    }

    if (role === 'FOR CANDIDATE') {
      if (activeTab === 'Jobs') return <CandidateJobs />;
      if (activeTab === 'Companies') return <Companies />;
      return <CandidateHome />;
    } else {
      if (activeTab === 'Overview') return <RecruiterHome setActiveTab={setActiveTab} />;
      if (activeTab === 'New Opening') return <CreateJob setActiveTab={setActiveTab} />;
      if (activeTab === 'Candidates') return <Candidates />;
      if (activeTab === 'Interviews') return <Interviews />;
      return <RecruiterHome setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#eff1f6] flex flex-col">
      <Header 
        role={role} 
        setRole={setRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {renderContent()}
    </div>
  )
}

export default App
