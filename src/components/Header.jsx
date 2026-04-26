import { useState, useEffect, useRef } from 'react';

export default function Header({ role, setRole, activeTab, setActiveTab, isAuthenticated, setIsAuthenticated }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const url = role === 'FOR RECRUITERS' 
            ? 'http://localhost:8082/api/v1/company' 
            : 'http://localhost:8081/api/v1/user';
          const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchProfile();
    } else {
      setUser(null);
    }
  }, [isAuthenticated, role]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = role === 'FOR RECRUITERS' ? 'http://localhost:8082' : 'http://localhost:8081';
    return `${baseUrl}${url}`;
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const url = role === 'FOR RECRUITERS'
          ? `http://localhost:8082/api/v1/company/${user.id}`
          : `http://localhost:8081/api/v1/user/${user.id}`;
        
        const res = await fetch(url, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok || res.status === 204) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setActiveTab(null);
          setIsDropdownOpen(false);
        } else {
          alert('Failed to delete account');
        }
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    if (!isAuthenticated) {
      if (newRole === 'FOR RECRUITERS') {
        setActiveTab('RecruiterLogin');
      } else {
        setActiveTab('Login');
      }
    } else {
      setActiveTab(prev => (prev === 'Login' || prev === 'Signup' || prev === 'Profile' ? prev : null));
    }
  };

  const navLinks = role === 'FOR CANDIDATE'
    ? [
      { label: "Jobs", href: "#jobs" },
      { label: "Companies", href: "#companies" },
      { label: "Community", href: "#community" },
    ]
    : [
      { label: "Overview", href: "#overview" },
      { label: "Candidates", href: "#candidates" },
      { label: "Interviews", href: "#interviews" },
    ];

  return (
    <header className="flex items-center justify-between border-b border-[#333] h-14 bg-[#282828] shrink-0 sticky top-0 lg:px-6 z-50 text-[#eff1f6]">
      <div className="flex items-center h-full">
        {/* LOGO */}
        <h1
          className="text-lg font-bold whitespace-nowrap flex items-center h-full px-4 lg:px-0 lg:mr-8 cursor-pointer hover:text-white transition-colors"
          onClick={() => setActiveTab(null)}
        >
          <span className="text-[#ffa116] mr-1">&lt;/&gt;</span> Breaking Job
        </h1>

        {/* DESKTOP ROLE DISPLAY / DROPDOWN */}
        <div className={`hidden lg:flex items-center h-full ${isAuthenticated ? 'hidden' : 'cursor-pointer group relative'}`}>
          <div className={`flex items-center gap-1.5 h-full px-3 text-sm text-gray-400 ${isAuthenticated ? 'hidden' : 'hover:text-white transition-colors'}`}>
            {role === 'FOR CANDIDATE' ? 'For Candidate' : 'For Recruiter'}
            {!isAuthenticated && (
              <svg className="transition-transform duration-200 group-hover:rotate-180" width="10" height="6" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          {!isAuthenticated && (
            <div className="hidden group-hover:block absolute top-full left-0 pt-2 w-48">
              <div className="bg-[#333] rounded-lg shadow-xl border border-[#444] overflow-hidden flex flex-col py-1">
                <button
                  className="text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#444] hover:text-white transition-colors flex items-center justify-between"
                  onClick={() => handleRoleSwitch('FOR CANDIDATE')}
                >
                  Candidate Mode
                  {role === 'FOR CANDIDATE' && <div className="w-1.5 h-1.5 rounded-full bg-[#ffa116]"></div>}
                </button>
                <button
                  className="text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#444] hover:text-white transition-colors flex items-center justify-between"
                  onClick={() => handleRoleSwitch('FOR RECRUITERS')}
                >
                  Recruiter Mode
                  {role === 'FOR RECRUITERS' && <div className="w-1.5 h-1.5 rounded-full bg-[#ffa116]"></div>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center h-full ml-4">
          {navLinks.map((link) => {
            const isActive = activeTab === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveTab(link.label)}
                className={`px-4 h-full flex items-center text-sm transition-colors relative ${isActive ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {link.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffa116]"></div>
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* DESKTOP AUTH */}
      <div className="hidden lg:flex items-center h-full gap-4 relative" ref={dropdownRef}>
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full bg-[#333] border border-[#444] shadow-sm flex items-center justify-center overflow-hidden hover:border-[#ffa116] transition-colors focus:outline-none"
            >
              {(role === 'FOR RECRUITERS' ? (user?.logoUrl || user?.logo) : user?.profilePicture) ? (
                <img src={getImageUrl(role === 'FOR RECRUITERS' ? (user?.logoUrl || user?.logo) : user?.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-[#ffa116]">
                  {role === 'FOR RECRUITERS' ? (user?.name?.charAt(0) || 'R') : (user?.firstName?.charAt(0) || 'U')}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-[48px] right-0 w-[280px] bg-[#282828] border border-[#333] rounded-xl shadow-2xl py-2 flex flex-col z-50">
                <button 
                  onClick={() => { setIsDropdownOpen(false); setActiveTab('Profile'); }}
                  className="w-full px-4 py-3 border-b border-[#333] flex items-center gap-3 hover:bg-[#333]/50 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-[#333] flex items-center justify-center overflow-hidden shrink-0">
                    {(role === 'FOR RECRUITERS' ? (user?.logoUrl || user?.logo) : user?.profilePicture) ? (
                      <img src={getImageUrl(role === 'FOR RECRUITERS' ? (user?.logoUrl || user?.logo) : user?.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-[#ffa116]">
                        {role === 'FOR RECRUITERS' ? (user?.name?.charAt(0) || 'R') : (user?.firstName?.charAt(0) || 'U')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-base font-bold text-white truncate">
                      {role === 'FOR RECRUITERS' ? user?.name : `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                    </span>
                    {role === 'FOR CANDIDATE' && (
                      <span className="text-[11px] font-medium text-[#ffa116] truncate mt-0.5">Access all features!</span>
                    )}
                  </div>
                </button>

                <div className="py-2 flex flex-col border-b border-[#333]">
                  {role === 'FOR CANDIDATE' ? (
                    <>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors text-left w-full" onClick={() => { setIsDropdownOpen(false); setActiveTab('Interviews'); }}>
                        <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                        Get Verified (AI Interview)
                      </button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors text-left w-full" onClick={() => { setIsDropdownOpen(false); setActiveTab('Jobs'); }}>
                        <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>
                        Applied Jobs
                      </button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors text-left w-full" onClick={() => { setIsDropdownOpen(false); setActiveTab('Companies'); }}>
                        <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
                        Applied Companies
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors text-left w-full" onClick={() => { setIsDropdownOpen(false); setActiveTab('Overview'); }}>
                        <div className="w-6 h-6 rounded bg-[#ffa116]/20 flex items-center justify-center"><svg className="w-4 h-4 text-[#ffa116]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></div>
                        Add New Job Post
                      </button>
                      <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors text-left w-full" onClick={() => { setIsDropdownOpen(false); setActiveTab('Candidates'); }}>
                        <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center"><svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg></div>
                        View Applicants
                      </button>
                    </>
                  )}
                </div>

                <div className="py-2 flex flex-col">
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors text-left w-full" onClick={() => { setIsDropdownOpen(false); setActiveTab('Settings'); }}>
                    <div className="w-5 h-5 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Settings
                  </button>
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white transition-colors text-left w-full" onClick={() => { localStorage.removeItem('token'); setIsAuthenticated(false); setActiveTab(null); setIsDropdownOpen(false); }}>
                    <div className="w-5 h-5 flex items-center justify-center"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></div>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center text-[15px] font-medium text-gray-300">
            <button
              onClick={() => setActiveTab(role === 'FOR RECRUITERS' ? 'RecruiterSignup' : 'Signup')}
              className="hover:text-white transition-colors"
            >
              Register
            </button>
            <span className="mx-2 text-gray-500 font-normal">or</span>
            <button
              onClick={() => setActiveTab(role === 'FOR RECRUITERS' ? 'RecruiterLogin' : 'Login')}
              className="hover:text-white transition-colors"
            >
              Log in
            </button>
          </div>
        )}
      </div>

      {/* MOBILE TOGGLE */}
      <button
        className="flex lg:hidden items-center h-full px-4 text-gray-400 hover:text-white"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
      </button>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="flex lg:hidden flex-col absolute top-[56px] left-0 w-full h-[calc(100vh-56px)] bg-[#282828] z-[100] border-t border-[#333] overflow-y-auto">
          <div className="flex flex-col p-4 border-b border-[#333]">
            <div className="text-xs font-semibold text-gray-500 mb-2">MODE</div>
            {isAuthenticated ? (
              <div className="text-left py-3 rounded-lg px-4 text-sm font-medium bg-[#444] text-white">
                {role === 'FOR CANDIDATE' ? 'Candidate Profile' : 'Recruiter Dashboard'}
              </div>
            ) : (
              <>
                <button
                  className={`text-left py-3 rounded-lg px-4 text-sm font-medium transition-colors ${role === 'FOR CANDIDATE' ? 'bg-[#444] text-white' : 'text-gray-400 hover:bg-[#333]'}`}
                  onClick={() => { handleRoleSwitch('FOR CANDIDATE'); setIsMobileMenuOpen(false); }}
                >
                  Candidate Profile
                </button>
                <button
                  className={`text-left py-3 rounded-lg px-4 text-sm font-medium mt-1 transition-colors ${role === 'FOR RECRUITERS' ? 'bg-[#444] text-white' : 'text-gray-400 hover:bg-[#333]'}`}
                  onClick={() => { handleRoleSwitch('FOR RECRUITERS'); setIsMobileMenuOpen(false); }}
                >
                  Recruiter Dashboard
                </button>
              </>
            )}
          </div>

          <nav className="flex flex-col p-4 border-b border-[#333]">
            <div className="text-xs font-semibold text-gray-500 mb-2">NAVIGATION</div>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`py-3 px-4 rounded-lg text-sm font-medium ${activeTab === link.label ? 'bg-[#444] text-white' : 'text-gray-400 hover:bg-[#333]'}`}
                onClick={() => { setActiveTab(link.label); setIsMobileMenuOpen(false); }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="p-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <button className="py-2.5 rounded-lg font-medium text-sm text-[#282828] bg-white hover:bg-gray-200 transition-colors" onClick={() => { setActiveTab('Settings'); setIsMobileMenuOpen(false); }}>Settings</button>
                <button className="py-2.5 rounded-lg font-medium text-sm text-white bg-[#333] hover:bg-[#444] transition-colors" onClick={() => { localStorage.removeItem('token'); setIsAuthenticated(false); setActiveTab(null); setIsMobileMenuOpen(false); }}>Logout</button>
              </>
            ) : (
              <>
                <button className="py-2.5 rounded-lg font-medium text-sm text-[#282828] bg-white hover:bg-gray-200 transition-colors" onClick={() => { setActiveTab('Login'); setIsMobileMenuOpen(false); }}>Sign in</button>
                <button className="py-2.5 rounded-lg font-medium text-sm text-[#ffa116] bg-[#ffa116]/10 border border-[#ffa116]/30 hover:bg-[#ffa116]/20 transition-colors" onClick={() => { setActiveTab('Signup'); setIsMobileMenuOpen(false); }}>Register</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}