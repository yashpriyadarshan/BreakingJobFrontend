import React, { useState, useEffect, useCallback } from 'react';
import { getCompanyJobs, createJob, deleteJob, updateJobStatus } from '../services/jobService';
import { getCompany } from '../services/companyService';
import { getApplicantsByJobId, updateApplicationStatus } from '../services/jobApplicationService';

const STATUS_COLORS = {
  OPEN: 'text-[#2cbb5d] bg-[#2cbb5d]/10 border-[#2cbb5d]/20',
  CLOSED: 'text-red-400 bg-red-500/10 border-red-500/20',
  DRAFT: 'text-gray-400 bg-[#333] border-[#444]',
  PAUSED: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function RecruiterHome() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setLoadingApplicants(true);
    try {
      const data = await getApplicantsByJobId(job.id);
      setApplicants(data || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateApplicantStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, status);
      setApplicants(prev => prev.map(a => a.applicationId === appId ? { ...a, status } : a));
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchJobs = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const data = await getCompanyJobs(companyId, page, 10);
      setJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [companyId, page]);

  useEffect(() => {
    const init = async () => {
      try {
        const company = await getCompany();
        if (company && company.id) {
          setCompanyId(company.id);
        } else {
          setError('Company profile not found. Please complete your profile.');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch company details: ' + err.message);
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (companyId) {
      fetchJobs();
    }
  }, [fetchJobs, companyId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    const f = e.target;
    const skillsRaw = f.skills.value;
    try {
      const jobData = {
        title: f.title.value,
        description: f.description.value,
        responsibilities: f.responsibilities.value || null,
        requirements: f.requirements.value || null,
        skills: skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
        location: f.location.value || null,
        employmentType: f.employmentType.value || null,
        jobType: f.jobType.value || null,
        minExperienceYears: f.minExperienceYears.value ? parseInt(f.minExperienceYears.value) : null,
        minSalary: f.minSalary.value ? parseFloat(f.minSalary.value) : null,
        maxSalary: f.maxSalary.value ? parseFloat(f.maxSalary.value) : null,
        currency: f.currency.value || 'USD',
        eddaVerificationRequired: f.eddaVerificationRequired.checked,
        eddaRequiredScore: f.eddaRequiredScore.value ? parseInt(f.eddaRequiredScore.value) : null,
        status: 'OPEN',
      };
      await createJob(jobData);
      setShowCreateForm(false);
      f.reset();
      fetchJobs();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;
    try { await deleteJob(jobId); fetchJobs(); }
    catch (err) { alert(err.message); }
  };

  const handleStatusToggle = async (job) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try { await updateJobStatus(job.id, newStatus); fetchJobs(); }
    catch (err) { alert(err.message); }
  };

  const openJobs = jobs.filter(j => j.status === 'OPEN');
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);
  const totalViews = jobs.reduce((sum, j) => sum + (j.viewCount || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 w-full text-[#eff1f6]">
      <section className="flex justify-between items-center pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Recruiting Dashboard</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="hidden sm:block bg-[#2cbb5d] text-white font-medium px-5 py-2 rounded-lg hover:bg-[#229c4b] transition-colors shadow-sm">
          {showCreateForm ? 'Cancel' : 'New Opening'}
        </button>
      </section>

      {/* METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {[
          { label: "Active Openings", value: openJobs.length, trend: `${jobs.length} total`, trendUp: true },
          { label: "Total Applicants", value: totalApplicants, trend: "Across all jobs", trendUp: true },
          { label: "Total Views", value: totalViews, trend: "All job views", trendUp: true },
          { label: "Total Postings", value: jobs.length, trend: `Page ${page + 1}/${totalPages || 1}`, trendUp: false },
        ].map((metric, i) => (
          <div key={i} className="bg-[#282828] border border-[#333] rounded-xl p-5 flex flex-col hover:border-[#444] transition-colors">
            <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider">{metric.label}</div>
            <div className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">{metric.value}</div>
            <div className={`mt-auto text-xs font-medium px-2 py-1 rounded bg-[#333] w-max ${metric.trendUp ? 'text-[#2cbb5d]' : 'text-gray-400'}`}>{metric.trend}</div>
          </div>
        ))}
      </section>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

      {/* CREATE FORM */}
      {showCreateForm && (
        <section className="bg-[#282828] border border-[#333] rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Create New Job Posting</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" required placeholder="Job Title *" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116] col-span-full" />
            <textarea name="description" required placeholder="Job Description *" rows={3} className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116] col-span-full" />
            <textarea name="responsibilities" placeholder="Responsibilities" rows={2} className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116]" />
            <textarea name="requirements" placeholder="Requirements" rows={2} className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116]" />
            <input name="skills" placeholder="Skills (comma separated)" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116]" />
            <input name="location" placeholder="Location" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116]" />
            <select name="employmentType" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116] text-gray-300">
              <option value="">Employment Type</option>
              <option value="FULL_TIME">Full Time</option><option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option><option value="INTERNSHIP">Internship</option>
            </select>
            <select name="jobType" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116] text-gray-300">
              <option value="">Job Type</option>
              <option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option>
            </select>
            <input name="minExperienceYears" type="number" placeholder="Min Experience (years)" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116]" />
            <select name="currency" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116] text-gray-300">
              <option value="USD">USD</option><option value="EUR">EUR</option><option value="INR">INR</option><option value="GBP">GBP</option>
            </select>
            <input name="minSalary" type="number" placeholder="Min Salary" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116]" />
            <input name="maxSalary" type="number" placeholder="Max Salary" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffa116]" />
            <div className="flex items-center gap-3 col-span-full">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="checkbox" name="eddaVerificationRequired" className="accent-[#ffa116]" /> Require AI Interview (Edda)
              </label>
              <input name="eddaRequiredScore" type="number" min="0" max="100" placeholder="Min Score" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:border-[#ffa116]" />
            </div>
            <div className="col-span-full flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowCreateForm(false)} className="px-5 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] text-sm font-medium transition-colors">Cancel</button>
              <button type="submit" disabled={saving} className="px-6 py-2 bg-[#ffa116] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#ffb03a] transition-colors disabled:opacity-50">{saving ? 'Creating...' : 'Create Job'}</button>
            </div>
          </form>
        </section>
      )}

      {/* JOBS TABLE */}
      <section className="bg-[#282828] border border-[#333] rounded-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#222]">
          <h2 className="text-lg font-bold text-white">Your Job Postings</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div></div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-bold text-white mb-2">No job postings yet</p>
            <p className="text-sm">Click "New Opening" to create your first job posting.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {jobs.map((job, i) => (
              <div key={job.id} className={`flex flex-col sm:flex-row justify-between p-5 ${i !== jobs.length - 1 ? 'border-b border-[#333]' : ''} hover:bg-[#333]/50 transition-colors group`}>
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-gray-200 group-hover:text-white transition-colors truncate">{job.title}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${STATUS_COLORS[job.status] || STATUS_COLORS.DRAFT}`}>{job.status}</span>
                  </div>
                  <div className="text-xs font-medium text-gray-500 mt-1.5 flex gap-2 items-center flex-wrap">
                    {job.location && <span className="bg-[#444] px-1.5 py-0.5 rounded">{job.location}</span>}
                    {job.jobType && <><span>•</span><span>{job.jobType}</span></>}
                    {job.employmentType && <><span>•</span><span>{job.employmentType.replace(/_/g, ' ')}</span></>}
                    <span>•</span><span>{timeAgo(job.createdAt)}</span>
                  </div>
                  {job.skills?.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {job.skills.slice(0, 5).map((s, j) => <span key={j} className="text-[10px] text-gray-500 bg-[#222] px-1.5 py-0.5 rounded border border-[#333]">{s}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex gap-6 mt-4 sm:mt-0 items-center shrink-0">
                  <div 
                    onClick={() => handleViewApplicants(job)}
                    className="flex flex-col items-center cursor-pointer hover:bg-[#333] p-2 rounded transition-colors group/app">
                    <span className="font-bold text-lg text-white group-hover/app:text-[#ffa116] transition-colors">{job.applicationCount || 0}</span>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider group-hover/app:text-[#ffa116]/80">Applicants</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <span className="font-bold text-lg text-white">{job.viewCount || 0}</span>
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Views</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleStatusToggle(job)} title={job.status === 'OPEN' ? 'Close job' : 'Reopen job'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${job.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={job.status === 'OPEN' ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"} /></svg>
                    </button>
                    <button onClick={() => handleDelete(job.id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* APPLICANTS MODAL */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#282828] border border-[#333] rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#222]">
              <div>
                <h2 className="text-lg font-bold text-white">Applicants</h2>
                <p className="text-xs text-gray-400">{selectedJobForApplicants.title}</p>
              </div>
              <button onClick={() => setSelectedJobForApplicants(null)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-grow">
              {loadingApplicants ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No applicants yet.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {applicants.map(app => (
                    <div key={app.applicationId} className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-medium text-white">User #{app.userId}</div>
                        <div className="text-xs text-gray-500">{timeAgo(app.appliedAt)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select 
                          value={app.status || 'PENDING'} 
                          onChange={(e) => handleUpdateApplicantStatus(app.applicationId, e.target.value)}
                          className="bg-[#222] border border-[#333] text-sm text-gray-300 rounded px-3 py-1.5 focus:outline-none focus:border-[#ffa116]">
                          <option value="PENDING">PENDING</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="INTERVIEWING">INTERVIEWING</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-[#282828] border border-[#333] rounded-lg text-sm font-medium text-gray-300 hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
          <span className="text-sm text-gray-400">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-[#282828] border border-[#333] rounded-lg text-sm font-medium text-gray-300 hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
        </div>
      )}
    </main>
  );
}
