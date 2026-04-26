import React, { useState } from 'react';
import { createJob } from '../services/jobService';

/**
 * CreateJob form maps to backend JobRequest DTO:
 *   title, description, responsibilities, requirements, skills: List<String>,
 *   location, employmentType: EmploymentType, jobType: JobType,
 *   minExperienceYears: Integer, minSalary: Double, maxSalary: Double,
 *   currency: CurrencyType, eddaVerificationRequired: Boolean,
 *   eddaRequiredScore: Integer, status: StatusType, expiresAt: LocalDateTime
 */
export default function CreateJob({ setActiveTab }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    location: '',
    employmentType: 'FULL_TIME',
    jobType: 'REMOTE',
    minExperienceYears: '',
    minSalary: '',
    maxSalary: '',
    currency: 'USD',
    eddaVerificationRequired: false,
    eddaRequiredScore: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Build the JobRequest object exactly as the backend expects
      const jobRequest = {
        title: formData.title,
        description: formData.description,
        responsibilities: formData.responsibilities || null,
        requirements: formData.requirements || null,
        skills: formData.skills
          ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [],
        location: formData.location || null,
        employmentType: formData.employmentType,
        jobType: formData.jobType,
        minExperienceYears: formData.minExperienceYears
          ? parseInt(formData.minExperienceYears)
          : null,
        minSalary: formData.minSalary ? parseFloat(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseFloat(formData.maxSalary) : null,
        currency: formData.currency,
        eddaVerificationRequired: formData.eddaVerificationRequired,
        eddaRequiredScore: formData.eddaRequiredScore
          ? parseInt(formData.eddaRequiredScore)
          : null,
        status: 'OPEN',
      };

      await createJob(jobRequest);
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Title *</label>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Employment Type</label>
                <select 
                  name="employmentType" 
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all appearance-none"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Job Type</label>
                <div className="flex gap-2 p-1 bg-[#333] rounded-xl border border-[#444]">
                  {[
                    { value: 'REMOTE', label: 'Remote' },
                    { value: 'HYBRID', label: 'Hybrid' },
                    { value: 'ONSITE', label: 'On-site' },
                  ].map(mode => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, jobType: mode.value }))}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.jobType === mode.value ? 'bg-[#444] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Min Experience (Years)</label>
                <input 
                  name="minExperienceYears" 
                  type="number" 
                  min="0"
                  value={formData.minExperienceYears}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                  placeholder="e.g. 3" 
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</label>
                <input 
                  name="location" 
                  type="text" 
                  value={formData.location}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                  placeholder="e.g. San Francisco, CA or Remote" 
                />
              </div>
            </div>
          </section>

          {/* COMPENSATION */}
          <section className="bg-[#282828] border border-[#333] rounded-2xl p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#ffa116] rounded-full"></div>
              Compensation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Currency</label>
                <select 
                  name="currency" 
                  value={formData.currency}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all appearance-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Min Salary (Annual)</label>
                <input 
                  name="minSalary" 
                  type="number" 
                  value={formData.minSalary}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                  placeholder="80000" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Max Salary (Annual)</label>
                <input 
                  name="maxSalary" 
                  type="number" 
                  value={formData.maxSalary}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                  placeholder="120000" 
                />
              </div>
            </div>
          </section>

          {/* DESCRIPTION & REQUIREMENTS */}
          <section className="bg-[#282828] border border-[#333] rounded-2xl p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-[#ffa116] rounded-full"></div>
              Job Details
            </h2>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description *</label>
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Responsibilities</label>
                <textarea 
                  name="responsibilities" 
                  rows="3"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all resize-none" 
                  placeholder="Key responsibilities for this role..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requirements</label>
                <textarea 
                  name="requirements" 
                  rows="3"
                  value={formData.requirements}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all resize-none" 
                  placeholder="What are the essential requirements for this role?"
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Skills (Comma separated) *</label>
                <input 
                  name="skills" 
                  type="text" 
                  required 
                  value={formData.skills}
                  onChange={handleChange}
                  className="bg-[#333] border border-[#444] text-white p-3.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" 
                  placeholder="e.g. React, Node.js, AWS, Docker" 
                />
                {formData.skills && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.split(',').map(s => s.trim()).filter(Boolean).map((skill, i) => (
                      <span key={i} className="text-xs bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 px-2.5 py-1 rounded-lg font-medium">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* AI INTERVIEW */}
          <section className="bg-[#282828] border border-[#333] rounded-2xl p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
              AI Interview (Edda)
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#333]/50 border border-[#444] p-5 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer group flex-grow">
                <div className={`w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-colors ${formData.eddaVerificationRequired ? 'border-transparent bg-purple-500' : 'border-[#555] bg-[#222] group-hover:border-gray-400'}`}>
                  {formData.eddaVerificationRequired && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input 
                  type="checkbox" 
                  name="eddaVerificationRequired" 
                  checked={formData.eddaVerificationRequired}
                  onChange={handleChange}
                  className="hidden" 
                />
                <div>
                  <span className={`text-sm font-bold transition-colors block ${formData.eddaVerificationRequired ? 'text-purple-400' : 'text-gray-300 group-hover:text-white'}`}>Require AI Interview Verification</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">Candidates must complete an AI-powered technical interview via Edda</span>
                </div>
              </label>
              {formData.eddaVerificationRequired && (
                <div className="flex items-center gap-2 bg-[#222] border border-[#444] rounded-lg px-3 py-2">
                  <span className="text-xs text-gray-400 font-bold whitespace-nowrap">Min Score:</span>
                  <input 
                    name="eddaRequiredScore" 
                    type="number" 
                    min="0" max="100" 
                    value={formData.eddaRequiredScore}
                    onChange={handleChange}
                    className="bg-transparent text-white text-sm outline-none w-16 text-center font-bold" 
                    placeholder="80" 
                  />
                </div>
              )}
            </div>
          </section>

          {/* ACTIONS */}
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
