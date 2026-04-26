import React, { useState, useEffect } from 'react';
import { login, signup } from '../services/authService';

export default function RecruiterAuth({ role, setRole, activeTab, setActiveTab, setIsAuthenticated }) {
  const [mode, setMode] = useState('Login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'RecruiterLogin') {
      setMode('Login');
      setError(null);
    } else if (activeTab === 'RecruiterSignup') {
      setMode('Signup');
      setError(null);
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      if (mode === 'Signup') {
        if (data.password !== data.passwordConfirmation) {
          throw new Error("Passwords do not match.");
        }

        // Always RECRUITER for this page
        await signup(data.firstName, data.lastName, data.email, data.password, 'RECRUITER');

        alert('Recruiter registration successful! Please log in.');
        setMode('Login');
        setActiveTab('RecruiterLogin');

      } else {
        // LOGIN
        const result = await login(data.email, data.password);

        if (setIsAuthenticated) setIsAuthenticated(true);
        if (setRole) setRole('FOR RECRUITERS');

        // Store token
        if (result.jwtToken) {
          localStorage.setItem('token', result.jwtToken);
        }

        setActiveTab('Overview'); // Go to recruiter dashboard
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'Login' ? 'Signup' : 'Login';
    setMode(newMode);
    setActiveTab(newMode === 'Login' ? 'RecruiterLogin' : 'RecruiterSignup');
  };

  return (
    <main className="flex-grow flex items-center justify-center w-full min-h-[calc(100vh-56px)] bg-[#1a1a1a] p-6 text-[#eff1f6]">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-[#282828] border border-[#333] rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
        
        {/* LEFT SIDE: MARKETING/INFO */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-[#2cbb5d]/20 to-[#ffa116]/10 w-1/2 border-r border-[#333]">
          <div className="mb-8">
            <span className="text-[#ffa116] font-bold text-lg tracking-widest uppercase">For Employers</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">
            Hire the <span className="text-[#ffa116]">best talent</span> <br /> in record time.
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Breaking Job helps you find the perfect match using our advanced AI-driven candidate screening. Post jobs, track applicants, and schedule interviews all in one place.
          </p>
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
                <svg className="w-5 h-5 text-[#2cbb5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-gray-300 font-medium text-sm">Post unlimited job openings</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
                <svg className="w-5 h-5 text-[#2cbb5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-gray-300 font-medium text-sm">Access to verified AI-interviewed candidates</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center border border-[#444]">
                <svg className="w-5 h-5 text-[#2cbb5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-gray-300 font-medium text-sm">Dedicated recruiter dashboard & analytics</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="flex flex-col justify-center p-8 md:p-12 w-full lg:w-1/2">
          <div className="mb-8 text-center lg:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              {mode === 'Login' ? 'Recruiter Sign In' : 'Recruiter Registration'}
            </h3>
            <p className="text-gray-400 text-sm">
              {mode === 'Login' ? 'Access your dashboard and manage your hiring.' : 'Start finding top talent for your company today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            {mode === 'Signup' && (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                  <input name="firstName" type="text" required className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full" placeholder="John" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                  <input name="lastName" type="text" required className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full" placeholder="Doe" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Work Email</label>
              <input name="email" type="email" required className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full" placeholder="name@company.com" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <input name="password" type="password" required className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full" placeholder="••••••••" />
            </div>

            {mode === 'Signup' && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm Password</label>
                <input name="passwordConfirmation" type="password" required className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full" placeholder="••••••••" />
              </div>
            )}

            {mode === 'Login' && (
              <div className="flex justify-end mt-[-8px]">
                <button type="button" className="text-xs text-[#ffa116] hover:underline font-medium">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-4 rounded-xl mt-4 bg-[#ffa116] text-[#1a1a1a] hover:bg-[#ffb03a] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#ffa116]/10"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-[#1a1a1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </div>
              ) : (mode === 'Login' ? 'Sign In to Dashboard' : 'Create Recruiter Account')}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-gray-400">
            {mode === 'Login' ? "New to Breaking Job Hiring? " : "Already have a recruiter account? "}
            <button type="button" onClick={toggleMode} className="text-[#ffa116] hover:text-[#ffb03a] font-bold transition-colors">
              {mode === 'Login' ? 'Register Now' : 'Sign In'}
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#333] flex flex-col items-center">
            <button 
              type="button" 
              onClick={() => { setRole('FOR CANDIDATE'); setActiveTab('Login'); }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
              Not a recruiter? Go to Candidate Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
