import React, { useState, useEffect } from 'react';
import { login, signup } from '../services/authService';

export default function Auth({ role, setRole, activeTab, setActiveTab, setIsAuthenticated }) {
  const [mode, setMode] = useState('Login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'Login' || activeTab === 'Signup') {
      setMode(activeTab);
      setError(null); // Clear errors on tab switch
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

        const userRole = role === 'FOR CANDIDATE' ? 'CANDIDATE' : 'RECRUITER';
        if (!userRole) {
           throw new Error("Unable to determine user role.");
        }
        await signup(data.firstName, data.lastName, data.email, data.password, userRole);

        alert('Registration successful! Please log in.');
        toggleMode(); // switch to login

      } else {
        // LOGIN
        const result = await login(data.email, data.password);

        if (setIsAuthenticated) setIsAuthenticated(true);

        if (result.role === 'RECRUITER' || result.role === 'ROLE_RECRUITER') {
          if (setRole) setRole('FOR RECRUITERS');
        } else if (result.role === 'CANDIDATE' || result.role === 'ROLE_CANDIDATE') {
          if (setRole) setRole('FOR CANDIDATE');
        } else {
          if (setRole) setRole(result.companyId ? 'FOR RECRUITERS' : 'FOR CANDIDATE');
        }

        // Store token
        if (result.jwtToken) {
          localStorage.setItem('token', result.jwtToken)
        }

        setActiveTab('Profile');
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
    setActiveTab(newMode);
  };

  return (
    <main className="flex-grow flex items-center justify-center w-full min-h-[calc(100vh-56px)] bg-[#1a1a1a] p-6 text-[#eff1f6]">
      <div className="bg-[#282828] border border-[#333] rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="px-8 pt-8 pb-6 border-b border-[#333] text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">{mode === 'Login' ? 'Welcome Back' : 'Create an Account'}</h2>
          <div className="text-sm font-medium text-gray-400">
            {mode === 'Login' ? "Sign in to access your profile" : "Join Breaking Job today"}
          </div>
          {mode === 'Signup' && (
            <div className="mt-3 inline-block bg-[#333] text-[#ffa116] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#444]">
              {role === 'FOR CANDIDATE' ? 'Candidate Mode' : 'Recruiter Mode'}
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {mode === 'Signup' && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium text-gray-300">First Name</label>
                  <input name="firstName" type="text" required className="bg-[#333] border border-[#444] text-white p-2.5 rounded-lg text-sm outline-none focus:border-[#ffa116] transition-colors w-full" placeholder="John" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-sm font-medium text-gray-300">Last Name</label>
                  <input name="lastName" type="text" required className="bg-[#333] border border-[#444] text-white p-2.5 rounded-lg text-sm outline-none focus:border-[#ffa116] transition-colors w-full" placeholder="Doe" />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Email Address</label>
              <input name="email" type="email" required className="bg-[#333] border border-[#444] text-white p-2.5 rounded-lg text-sm outline-none focus:border-[#ffa116] transition-colors w-full" placeholder="you@example.com" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <input name="password" type="password" required className="bg-[#333] border border-[#444] text-white p-2.5 rounded-lg text-sm outline-none focus:border-[#ffa116] transition-colors w-full" placeholder="••••••••" />
            </div>

            {mode === 'Signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <input name="passwordConfirmation" type="password" required className="bg-[#333] border border-[#444] text-white p-2.5 rounded-lg text-sm outline-none focus:border-[#ffa116] transition-colors w-full" placeholder="••••••••" />
              </div>
            )}

            {mode === 'Login' && (
              <div className="flex justify-end mt-[-8px] mb-2">
                <button type="button" className="text-xs text-gray-400 hover:text-[#ffa116] transition-colors">Forgot password?</button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-medium py-3 rounded-lg mt-2 bg-[#ffa116] text-[#1a1a1a] hover:bg-[#ffb03a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none"
            >
              {loading ? 'Processing...' : (mode === 'Login' ? 'Sign In' : 'Sign Up')}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            {mode === 'Login' ? "Don't have an account? " : "Already registered? "}
            <button type="button" onClick={toggleMode} className="text-[#ffa116] hover:text-[#ffb03a] font-medium transition-colors">
              {mode === 'Login' ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
