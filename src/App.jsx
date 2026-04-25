import { useState, useEffect } from 'react'
import Header from './components/Header'
import CandidateHome from './pages/CandidateHome'
import CandidateJobs from './pages/CandidateJobs'
import Companies from './pages/Companies'
import Community from './pages/Community'
import RecruiterHome from './pages/RecruiterHome'
import Auth from './pages/Auth'
import Profile from './pages/Profile'

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
    
    if (activeTab === 'Profile') {
      return <Profile role={role} />;
    }

    if (activeTab === 'Community') {
      return <Community />;
    }

    if (role === 'FOR CANDIDATE') {
      if (activeTab === 'Jobs') return <CandidateJobs />;
      if (activeTab === 'Companies') return <Companies />;
      return <CandidateHome />;
    } else {
      if (activeTab === 'Overview') return <RecruiterHome />;
      return <RecruiterHome />;
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
