import React, { useState } from 'react';
import { postJob } from '../services/jobService';

export default function CreateJob({ setActiveTab }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    type: 'Full-time',
    location: '',
    workMode: 'Remote',
    salaryMin: '',
    salaryMax: '',
    description: '',
    requirements: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await postJob(formData);
      setSuccess(true);
      setTimeout(() => {
        setActiveTab('Overview');
      }, 2000);
    } catch (error) {
      alert('Failed to post job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#1a1a1a]">
        <div className="bg-[#282828] border border-[#2cbb5d]/30 p-12 rounded-2xl flex flex-col items-center text-center max-w-md shadow-2xl">
          <div className="w-20 h-20 bg-[#2cbb5d]/10 rounded-full flex items-center justify-center mb-6 border border-[#2cbb5d]/20">
            <svg className="w-10 h-10 text-[#2cbb5d]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Job Posted Successfully!</h2>
          <p className="text-gray-400">Your job opening is now live and visible to thousands of candidates.</p>
          <div className="mt-8 text-sm text-[#ffa116] font-bold animate-pulse">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow w-full bg-[#1a1a1a] text-[#eff1f6] p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="mb-10">
          <button 
            onClick={() => setActiveTab('Overview')}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4 text-sm font-bold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create New Opening</h1>
          <p className="text-gray-400 mt-1">Fill in the details below to reach the right candidates.</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* BASIC INFORMATION */}
          <section className="bg-[#282828] border border-[#333] rounded-2xl p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#ffa116] rounded-full"></div>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title</label>
                <input 
                  name="title" 
                  type="text" 
                  required 
                  value={formData.title}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                  placeholder="e.g. Senior Frontend Engineer" 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Department</label>
                <select 
                  name="department" 
                  value={formData.department}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all appearance-none"
                >
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Product</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Operations</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Employment Type</label>
                <select 
                  name="type" 
                  value={formData.type}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all appearance-none"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Work Mode</label>
                <div className="flex gap-2 p-1 bg-[#333] rounded-xl border border-[#444]">
                  {['Remote', 'Hybrid', 'On-site'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, workMode: mode }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.workMode === mode ? 'bg-[#444] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location / Timezone</label>
                <input 
                  name="location" 
                  type="text" 
                  required 
                  value={formData.location}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                  placeholder="e.g. San Francisco, CA or GMT+5" 
                />
              </div>
            </div>
          </section>

          {/* COMPENSATION & DESCRIPTION */}
          <section className="bg-[#282828] border border-[#333] rounded-2xl p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#ffa116] rounded-full"></div>
              Details & Compensation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Salary Min (Annual)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    name="salaryMin" 
                    type="number" 
                    required 
                    value={formData.salaryMin}
                    onChange={handleChange}
                    className="bg-[#333] border border-[#444] text-white p-3.5 pl-8 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full" 
                    placeholder="80,000" 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Salary Max (Annual)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input 
                    name="salaryMax" 
                    type="number" 
                    required 
                    value={formData.salaryMax}
                    onChange={handleChange}
                    className="bg-[#333] border border-[#444] text-white p-3.5 pl-8 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full" 
                    placeholder="120,000" 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Description</label>
              <textarea 
                name="description" 
                required 
                rows="5"
                value={formData.description}
                onChange={handleChange}
                className="bg-[#333] border border-[#444] text-white p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all resize-none" 
                placeholder="Describe the role, team, and what a typical day looks like..."
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Key Requirements (Comma separated)</label>
              <input 
                name="requirements" 
                type="text" 
                required 
                value={formData.requirements}
                onChange={handleChange}
                className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                placeholder="e.g. React, Node.js, 5+ years experience" 
              />
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 mb-12">
            <button 
              type="button"
              onClick={() => setActiveTab('Overview')}
              className="px-8 py-4 rounded-xl text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              Discard Draft
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-[#ffa116] hover:bg-[#ffb03a] text-[#1a1a1a] px-12 py-4 rounded-xl text-sm font-black transition-all shadow-xl shadow-[#ffa116]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Job Opening'}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
