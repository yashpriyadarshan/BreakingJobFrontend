import { useState, useEffect, useCallback } from 'react'
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
import RecruiterLanding from './pages/RecruiterLanding'
import { getCompany } from './services/companyService'
import { getUserProfile } from './services/userService'

function App() {
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'FOR CANDIDATE');
  const [activeTab, setActiveTab] = useState(() => sessionStorage.getItem('activeTab') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);

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

  // Stable fetch function using useCallback so event listeners always get the latest version
  const fetchUser = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = role === 'FOR RECRUITERS' ? await getCompany() : await getUserProfile();
      setUser(data);
    } catch (e) {
      console.error('App: Failed to fetch user', e);
    }
  }, [isAuthenticated, role]);

  // Fetch user on auth/role change
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [fetchUser, isAuthenticated]);

  // Listen for profile updates from child components
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setUser(e.detail);
      }
    };
    window.addEventListener('profileUpdated', handleUpdate);
    return () => window.removeEventListener('profileUpdated', handleUpdate);
  }, []);

  // Convenience: refetch user from server (used after logo/picture upload where
  // the upload response may not contain the full public URL)
  const refetchUser = useCallback(() => fetchUser(), [fetchUser]);

  const renderContent = () => {
    if (activeTab === 'Login' || activeTab === 'Signup') {
      return <Auth role={role} setRole={setRole} activeTab={activeTab} setActiveTab={setActiveTab} setIsAuthenticated={setIsAuthenticated} />;
    }

    if (activeTab === 'RecruiterLogin' || activeTab === 'RecruiterSignup') {
      return <RecruiterAuth role={role} setRole={setRole} activeTab={activeTab} setActiveTab={setActiveTab} setIsAuthenticated={setIsAuthenticated} />;
    }
    
    if (activeTab === 'Profile') {
      return <Profile role={role} user={user} setUser={setUser} setActiveTab={setActiveTab} />;
    }
    
    if (activeTab === 'Settings') {
      return <Settings role={role} user={user} setUser={setUser} refetchUser={refetchUser} setIsAuthenticated={setIsAuthenticated} setActiveTab={setActiveTab} />;
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
      
      // Default for Recruiter: If authenticated show dashboard, otherwise show landing
      return isAuthenticated ? <RecruiterHome setActiveTab={setActiveTab} /> : <RecruiterLanding setActiveTab={setActiveTab} />;
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
        user={user}
      />
      {renderContent()}
    </div>
  )
}

export default App
