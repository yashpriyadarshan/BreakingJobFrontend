import React, { useState, useEffect, useCallback } from 'react';
import { getCompanyJobs, createJob, deleteJob, updateJobStatus } from '../services/jobService';
import { getCompany } from '../services/companyService';
import { getApplicantsByJobId, updateApplicationStatus } from '../services/jobApplicationService';
import { getUserById } from '../services/userService';
import ResumeViewer from '../components/ResumeViewer';
import Profile from './Profile';
import TranscriptViewer from '../components/TranscriptViewer';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export default function RecruiterHome({ setActiveTab }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [companyId, setCompanyId] = useState(null);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [resumeViewerUrl, setResumeViewerUrl] = useState(null);
  const [viewTranscriptUserId, setViewTranscriptUserId] = useState(null);

  const handleViewApplicants = async (job) => {
    setSelectedJobForApplicants(job);
    setSelectedProfile(null);
    setLoadingApplicants(true);
    try {
      const data = await getApplicantsByJobId(job.id);
      // Enrich each applicant with their user profile
      const enriched = await Promise.all(
        (data || []).map(async (app) => {
          try {
            const profile = await getUserById(app.userId);
            return { ...app, userProfile: profile };
          } catch {
            return { ...app, userProfile: null };
          }
        })
      );
      setApplicants(enriched);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleViewProfile = async (app) => {
    if (app.userProfile) {
      setSelectedProfile(app.userProfile);
    } else {
      setLoadingProfile(true);
      try {
        const profile = await getUserById(app.userId);
        setSelectedProfile(profile);
      } catch (err) {
        alert('Failed to load profile: ' + err.message);
      } finally {
        setLoadingProfile(false);
      }
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

  const handleStatusToggle = async (job) => {
    const newStatus = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try { 
      await updateJobStatus(job.id, newStatus); 
      fetchJobs(); 
    } catch (err) { 
      alert(err.message); 
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;
    try { 
      await deleteJob(jobId); 
      fetchJobs(); 
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
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
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

  const openJobsCount = jobs.filter(j => j.status === 'OPEN').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);
  const totalViews = jobs.reduce((sum, j) => sum + (j.viewCount || 0), 0);

  const metrics = [
    { label: "Active Openings", value: openJobsCount, trend: `+${jobs.length} total`, color: "text-[#ffa116]", bg: "bg-[#ffa116]/10" },
    { label: "Total Applicants", value: totalApplicants, trend: "+24%", color: "text-[#2cbb5d]", bg: "bg-[#2cbb5d]/10" },
    { label: "Total Views", value: totalViews, trend: "All time", color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Avg. Time to Hire", value: "18d", trend: "-2d", color: "text-purple-400", bg: "bg-purple-400/10" }
  ];

  const recentActivities = [
    { user: "Alice Chen", action: "applied for", target: "Senior Frontend", time: "2h ago", avatar: null },
    { user: "Jordan Smith", action: "completed", target: "AI Interview", time: "5h ago", avatar: null },
    { user: "David Kim", action: "accepted", target: "Interview Invite", time: "1d ago", avatar: null },
    { user: "Sarah Wilson", action: "applied for", target: "Product Designer", time: "1d ago", avatar: null }
  ];

  const topMatches = [
    { name: "Robert Fox", role: "Frontend Dev", match: "99%", status: "Top Fit", score: 98 },
    { name: "Jane Cooper", role: "UI Designer", match: "96%", status: "Qualified", score: 95 },
    { name: "Cody Fisher", role: "Backend Eng", match: "92%", status: "Qualified", score: 92 }
  ];

  if (selectedProfile) {
    return <Profile user={selectedProfile} readOnly={true} onClose={() => setSelectedProfile(null)} />;
  }

  return (
    <main className="flex-grow w-full bg-[#1a1a1a] text-[#eff1f6] p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Recruiting Overview</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your hiring pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#333] hover:bg-[#444] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-[#444]">
              Generate Report
            </button>
            <button 
              onClick={() => setActiveTab('New Opening')}
              className="bg-[#ffa116] hover:bg-[#ffb03a] text-[#1a1a1a] px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#ffa116]/20 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              New Job Post
            </button>
          </div>
        </header>

        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">{error}</div>}

        {/* METRICS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <div key={i} className="bg-[#282828] border border-[#333] rounded-2xl p-6 relative overflow-hidden group hover:border-[#444] transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{metric.label}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${metric.bg} ${metric.color}`}>
                  {metric.trend}
                </span>
              </div>
              <div className="text-4xl font-black text-white mb-2">{metric.value}</div>
              <div className="w-full h-1 bg-[#333] rounded-full mt-4 overflow-hidden">
                <div className={`h-full ${metric.color.replace('text', 'bg')} w-2/3 rounded-full opacity-50`}></div>
              </div>
            </div>
          ))}
        </section>

        {/* MAIN DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: PIPELINE & FUNNEL (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* HIRING FUNNEL VISUALIZATION */}
            <section className="bg-[#282828] border border-[#333] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#ffa116] rounded-full"></div>
                Overall Hiring Funnel
              </h2>
              <div className="flex items-end justify-between gap-2 h-48 px-4">
                {[
                  { label: "Applied", val: 850, h: "h-full", color: "bg-[#ffa116]" },
                  { label: "Screened", val: 320, h: "h-[60%]", color: "bg-blue-500" },
                  { label: "Interview", val: 84, h: "h-[25%]", color: "bg-purple-500" },
                  { label: "Offered", val: 12, h: "h-[8%]", color: "bg-[#2cbb5d]" }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className="text-xs font-bold text-gray-400">{item.val}</div>
                    <div className={`w-full max-w-[100px] ${item.h} ${item.color} rounded-t-xl opacity-80 hover:opacity-100 transition-opacity cursor-pointer relative group`}>
                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                         {((item.val / 850) * 100).toFixed(1)}% Conversion
                       </div>
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* ACTIVE JOBS TABLE */}
            <section className="bg-[#282828] border border-[#333] rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-[#333] flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Active Pipelines</h2>
                <div className="flex bg-[#1a1a1a] p-1 rounded-lg">
                   {['All', 'Active', 'On Hold'].map(f => (
                     <button 
                       key={f}
                       onClick={() => setActiveFilter(f)}
                       className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${activeFilter === f ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                     >
                       {f}
                     </button>
                   ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-[#222] text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <th className="px-6 py-4">Job Title</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Applicants</th>
                        <th className="px-6 py-4 text-center">Views</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#333]">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-[#333]/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="font-bold text-gray-200 group-hover:text-white transition-colors">{job.title}</div>
                            <div className="text-[10px] text-gray-500 mt-1">{job.location}</div>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex justify-center">
                               <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                                 job.status === 'OPEN' ? 'border-[#2cbb5d]/30 text-[#2cbb5d] bg-[#2cbb5d]/5' : 
                                 'border-gray-500/30 text-gray-400 bg-gray-500/5'
                               }`}>
                                 {job.status}
                               </span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <div 
                               onClick={() => handleViewApplicants(job)}
                               className="flex flex-col items-center cursor-pointer hover:bg-[#333] p-1 rounded transition-colors group/app">
                               <span className="font-bold text-lg text-white group-hover/app:text-[#ffa116] transition-colors">{job.applicationCount || 0}</span>
                               <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider group-hover/app:text-[#ffa116]/80">Applicants</span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex flex-col items-center">
                               <span className="font-bold text-lg text-white">{job.viewCount || 0}</span>
                               <span className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">Views</span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <div className="flex justify-end gap-2">
                               <button 
                                 onClick={() => handleStatusToggle(job)} 
                                 title={job.status === 'OPEN' ? 'Close job' : 'Reopen job'}
                                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${job.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={job.status === 'OPEN' ? "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"} /></svg>
                               </button>
                               <button 
                                 onClick={() => handleDelete(job.id)} 
                                 className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))}
                      {jobs.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">No job postings found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              {totalPages > 1 && (
                <div className="p-4 bg-[#222] flex justify-center items-center gap-3">
                  <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-[#282828] border border-[#333] rounded text-xs text-gray-400 hover:bg-[#333] disabled:opacity-40 transition-all">Prev</button>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Page {page + 1} of {totalPages}</span>
                  <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-[#282828] border border-[#333] rounded text-xs text-gray-400 hover:bg-[#333] disabled:opacity-40 transition-all">Next</button>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: ACTIVITY & MATCHES (4 COLS) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* RECENT ACTIVITY FEED */}
            <section className="bg-[#282828] border border-[#333] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
              <div className="flex flex-col gap-6">
                {recentActivities.map((act, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-[#333] flex items-center justify-center shrink-0 border border-[#444] text-[#ffa116] font-black group-hover:border-[#ffa116]/50 transition-all">
                       {act.user.charAt(0)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                       <p className="text-sm">
                         <span className="font-bold text-white">{act.user}</span>{' '}
                         <span className="text-gray-400">{act.action}</span>{' '}
                         <span className="font-bold text-[#ffa116]">{act.target}</span>
                       </p>
                       <span className="text-[10px] font-medium text-gray-600 uppercase tracking-wider">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 rounded-xl border border-[#333] text-xs font-bold text-gray-500 hover:text-white hover:border-[#444] transition-all">
                See More Activity
              </button>
            </section>

            {/* AI MATCHES CARD */}
            <section className="bg-gradient-to-br from-[#282828] to-[#1a1a1a] border border-[#ffa116]/20 rounded-2xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg className="w-16 h-16 text-[#ffa116]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.4 9.1L22 9.1L15.9 13.5L18.3 20.6L12 16.2L5.7 20.6L8.1 13.5L2 9.1L9.6 9.1L12 2Z" /></svg>
               </div>
               <h2 className="text-lg font-bold text-white mb-6 relative z-10">AI Top Matches</h2>
               <div className="flex flex-col gap-4 relative z-10">
                  {topMatches.map((match, i) => (
                    <div key={i} className="bg-[#333]/30 border border-[#444] rounded-xl p-4 hover:border-[#ffa116]/40 transition-all cursor-pointer">
                       <div className="flex justify-between items-start mb-2">
                          <div className="font-bold text-white">{match.name}</div>
                          <span className="text-[10px] font-bold text-[#2cbb5d] bg-[#2cbb5d]/10 px-1.5 py-0.5 rounded">{match.match}</span>
                       </div>
                       <div className="text-xs text-gray-400 mb-3">{match.role}</div>
                       <div className="w-full h-1 bg-[#1a1a1a] rounded-full">
                          <div className="h-full bg-[#ffa116] rounded-full" style={{ width: `${match.score}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 bg-white text-black py-3 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all" onClick={() => setActiveTab('Candidates')}>
                  View Recommended Talent
               </button>
            </section>

          </div>
        </div>
      </div>

      {/* APPLICANTS MODAL */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#282828] border border-[#333] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-[#333] bg-[#222]">
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Job Applicants</h2>
                <p className="text-[10px] font-bold text-[#ffa116] uppercase tracking-widest mt-1">{selectedJobForApplicants.title}</p>
              </div>
              <button onClick={() => setSelectedJobForApplicants(null)} className="w-10 h-10 rounded-xl bg-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#444] transition-all">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
              {loadingApplicants ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-10 h-10 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Fetching candidates...</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center gap-4 opacity-50">
                   <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                   <p className="text-sm font-bold text-gray-400">No applicants yet for this position.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {applicants.map(app => {
                    const p = app.userProfile;
                    const name = p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : `Candidate #${app.userId}`;
                    const initial = name.charAt(0).toUpperCase();
                    const statusColor = {
                      PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
                      REVIEWING: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
                      INTERVIEWING: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
                      ACCEPTED: 'text-[#2cbb5d] bg-[#2cbb5d]/10 border-[#2cbb5d]/20',
                      REJECTED: 'text-red-400 bg-red-400/10 border-red-400/20',
                    }[app.status] || 'text-gray-400 bg-gray-400/10 border-gray-400/20';
                    return (
                      <div key={app.applicationId} className="bg-[#1a1a1a] border border-[#333] p-5 rounded-2xl group hover:border-[#444] transition-all">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-[#333] border border-[#444] flex items-center justify-center text-lg font-black text-[#ffa116] shrink-0">
                              {p?.profilePicture ? <img src={p.profilePicture.startsWith('http') ? p.profilePicture : `${p.profilePicture}`} alt="" className="w-full h-full rounded-xl object-cover" /> : initial}
                            </div>
                            <div className="min-w-0">
                              <div className="font-black text-white text-base truncate">{name}</div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1 flex items-center gap-2 flex-wrap">
                                Applied {timeAgo(app.appliedAt)}
                                {p?.location && <><span className="w-1 h-1 rounded-full bg-gray-600"></span>{p.location}</>}
                              </div>
                              {p?.skills?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {p.skills.slice(0, 4).map(s => <span key={s.id || s.name} className="text-[9px] bg-[#333] text-gray-400 px-1.5 py-0.5 rounded font-bold">{s.name}</span>)}
                                  {p.skills.length > 4 && <span className="text-[9px] text-gray-600">+{p.skills.length - 4}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <select 
                              value={app.status || 'PENDING'} 
                              onChange={(e) => handleUpdateApplicantStatus(app.applicationId, e.target.value)}
                              className={`text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 focus:outline-none cursor-pointer transition-all border ${statusColor}`}>
                              <option value="PENDING">PENDING</option>
                              <option value="REVIEWING">REVIEWING</option>
                              <option value="INTERVIEWING">INTERVIEWING</option>
                              <option value="ACCEPTED">ACCEPTED</option>
                              <option value="REJECTED">REJECTED</option>
                            </select>
                            {p?.skillVerified && (
                              <button 
                                onClick={() => setViewTranscriptUserId(app.userId)}
                                title="View Transcript" 
                                className="w-10 h-10 rounded-xl bg-[#ffa116]/10 text-[#ffa116] flex items-center justify-center hover:bg-[#ffa116] hover:text-[#1a1a1a] transition-all"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                              </button>
                            )}
                            <button onClick={() => handleViewProfile(app)} title="View Profile" className="w-10 h-10 rounded-xl bg-[#ffa116]/10 text-[#ffa116] flex items-center justify-center hover:bg-[#ffa116] hover:text-[#1a1a1a] transition-all">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* PROFILE DRAWER REMOVED: Now redirects to full Profile component */}

            <div className="p-6 bg-[#222] border-t border-[#333] flex justify-end gap-3">
               <button onClick={() => setSelectedJobForApplicants(null)} className="px-6 py-3 rounded-xl bg-[#333] text-xs font-black text-white uppercase tracking-widest hover:bg-[#444] transition-all">Close</button>
            </div>
          </div>
        </div>
      )}
      {resumeViewerUrl && <ResumeViewer url={resumeViewerUrl} onClose={() => setResumeViewerUrl(null)} />}
      {viewTranscriptUserId && <TranscriptViewer userId={viewTranscriptUserId} onClose={() => setViewTranscriptUserId(null)} />}
    </main>
  );
}
