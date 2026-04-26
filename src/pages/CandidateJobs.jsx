import React, { useState, useEffect, useRef } from 'react';
import { getAllOpenJobs, searchJobs, incrementViewCount } from '../services/jobService';
import { applyToJob, getMyApplications } from '../services/jobApplicationService';

// Skills can be a string (from search endpoint) or array (from list endpoint)
function normalizeSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return String(skills).split(',').map(s => s.trim()).filter(Boolean);
}

const accentColors = [
  { bg: "bg-[#ffa116]/15", text: "text-[#ffa116]", border: "border-[#ffa116]/25" },
  { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/25" },
  { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/25" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" },
  { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/25" },
  { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/25" },
];

const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
const JOB_TYPES = ['REMOTE', 'HYBRID', 'ONSITE'];

function formatLabel(t) {
  return (t || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function formatSalary(min, max, currency) {
  const c = currency || 'USD';
  const fmt = (v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v;
  if (min && max) return `${fmt(min)} - ${fmt(max)} ${c}`;
  if (min) return `From ${fmt(min)} ${c}`;
  if (max) return `Up to ${fmt(max)} ${c}`;
  return null;
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1d ago';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function CheckBox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group mt-3 first:mt-0">
      <div onClick={onChange}
        className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${checked ? 'border-transparent bg-[#2cbb5d]' : 'border-[#555] bg-[#333] group-hover:border-gray-400'}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
    </label>
  );
}

export default function CandidateJobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedEmployment, setSelectedEmployment] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const debounceRef = useRef(null);
  
  const [applying, setApplying] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  useEffect(() => {
    // Fetch applied jobs on mount so we know which ones are already applied
    const fetchApplied = async () => {
      try {
        const apps = await getMyApplications();
        const appliedSet = new Set(apps.map(app => app.jobId));
        setAppliedJobs(appliedSet);
      } catch (err) {
        // user might not be logged in or other error, ignore gracefully
      }
    };
    fetchApplied();
  }, []);

  const handleApply = async (jobId) => {
    setApplying(jobId);
    try {
      await applyToJob(jobId);
      setAppliedJobs(prev => new Set([...prev, jobId]));
      alert('Successfully applied to job!');
    } catch (err) {
      alert('Error applying: ' + err.message);
    } finally {
      setApplying(null);
    }
  };

  // Debounce the search query
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(val);
      setPage(0);
    }, 500);
  };

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    setPage(0);
  };

  // Determine if we need search or plain listing
  const hasFilters = debouncedQuery || selectedJobTypes.length > 0 || selectedEmployment.length > 0;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (hasFilters) {
          const params = { page, size: 10 };
          if (debouncedQuery) params.keyword = debouncedQuery;
          // Backend only accepts a single value for these filters
          if (selectedJobTypes.length === 1) params.jobType = selectedJobTypes[0];
          if (selectedEmployment.length === 1) params.employmentType = selectedEmployment[0];
          data = await searchJobs(params);
        } else {
          data = await getAllOpenJobs(page, 10);
        }
        setJobs(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } catch (err) {
        setError(err.message);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [debouncedQuery, selectedJobTypes, selectedEmployment, page]);

  const clearAll = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedJobTypes([]);
    setSelectedEmployment([]);
    setPage(0);
  };

  const remoteCount = jobs.filter(j => j.jobType === 'REMOTE').length;

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 w-full text-[#eff1f6]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Explore Jobs</h1>
        <p className="text-gray-400 text-sm">Find your next opportunity at world-class companies</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search jobs by title, skills, or description..."
          className="w-full bg-[#282828] border border-[#333] rounded-xl py-3 pl-12 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ffa116]/50 focus:ring-1 focus:ring-[#ffa116]/20 transition-all" />
        {searchQuery && (
          <button onClick={clearAll} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Jobs", value: totalElements, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { label: "Remote (this page)", value: remoteCount, icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
          { label: "Showing", value: jobs.length, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          { label: "Page", value: `${page + 1} / ${totalPages || 1}`, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#282828] border border-[#333] rounded-xl p-4 hover:border-[#444] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ffa116]/10 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#ffa116]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-[#282828] border border-[#333] rounded-xl p-5">
            <h2 className="font-bold text-lg mb-4 text-white">Filters</h2>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wider">JOB TYPE</h3>
                {JOB_TYPES.map(jt => (
                  <CheckBox key={jt} checked={selectedJobTypes.includes(jt)} onChange={() => toggle(selectedJobTypes, setSelectedJobTypes, jt)} label={formatLabel(jt)} />
                ))}
              </div>
              <div className="border-t border-[#333] pt-5">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wider">EMPLOYMENT</h3>
                {EMPLOYMENT_TYPES.map(et => (
                  <CheckBox key={et} checked={selectedEmployment.includes(et)} onChange={() => toggle(selectedEmployment, setSelectedEmployment, et)} label={formatLabel(et)} />
                ))}
              </div>
              <button onClick={clearAll}
                className={`mt-2 w-full text-sm font-medium rounded-lg py-2.5 transition-colors ${hasFilters ? 'bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 hover:bg-[#ffa116]/20' : 'bg-[#333] text-gray-400 cursor-default'}`}>
                Clear All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* JOB FEED */}
        <section className="flex-grow flex flex-col gap-5">
          <div className="flex justify-between items-end pb-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Active Openings</h2>
            <span className="text-sm text-gray-400 font-medium">
              {loading ? 'Loading...' : `Showing ${jobs.length} of ${totalElements} Jobs`}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Loading spinner */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {jobs.map((job, i) => {
                const colorSet = accentColors[i % accentColors.length];
                const salary = formatSalary(job.minSalary, job.maxSalary, job.currency);
                return (
                  <div key={job.id}
                    className="bg-[#282828] border border-[#333] rounded-xl flex flex-col p-6 hover:border-[#ffa116]/30 hover:shadow-lg hover:shadow-[#ffa116]/5 transition-all group cursor-pointer"
                    onClick={() => incrementViewCount(job.id).catch(() => { })}>
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 rounded-xl ${colorSet.bg} ${colorSet.border} border flex items-center justify-center shrink-0`}>
                        <span className={`text-base font-bold ${colorSet.text}`}>
                          {(job.title || '??').substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-[#ffa116] transition-colors truncate">{job.title}</h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{timeAgo(job.createdAt)}</span>
                        </div>

                        <div className="text-sm font-medium text-gray-400 mb-4">
                          Company #{job.companyId}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {job.location && (
                            <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                              {job.location}
                            </span>
                          )}
                          {job.jobType && <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">{formatLabel(job.jobType)}</span>}
                          {job.employmentType && <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">{formatLabel(job.employmentType)}</span>}
                          {job.minExperienceYears != null && <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">{job.minExperienceYears}+ yrs exp</span>}
                          {salary && <span className="bg-[#2cbb5d]/10 text-[#2cbb5d] px-2.5 py-1 rounded text-xs font-medium border border-[#2cbb5d]/20">{salary}/yr</span>}
                          {job.eddaVerificationRequired && <span className="bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded text-xs font-medium border border-purple-500/20">AI Verification Required</span>}
                        </div>

                        {job.description && (
                          <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-2">{job.description}</p>
                        )}

                        <div className="flex justify-between items-center pt-5 border-t border-[#333]">
                          <div className="flex gap-2 flex-wrap">
                            {normalizeSkills(job.skills).slice(0, 5).map((skill, j) => (
                              <span key={j} className="text-xs text-gray-500 bg-[#222] px-2 py-1 rounded border border-[#333]">{skill}</span>
                            ))}
                            {normalizeSkills(job.skills).length > 5 && <span className="text-xs text-gray-600">+{normalizeSkills(job.skills).length - 5} more</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            {(job.viewCount > 0) && <span className="text-xs text-gray-500">{job.viewCount} views</span>}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApply(job.id);
                              }}
                              disabled={applying === job.id || appliedJobs.has(job.id)}
                              className="font-medium text-sm px-6 py-2 rounded-lg bg-[#ffa116] text-[#1a1a1a] hover:bg-[#ffb03a] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                              {appliedJobs.has(job.id) ? 'Applied' : applying === job.id ? 'Applying...' : 'Apply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {jobs.length === 0 && !loading && !error && (
                <div className="bg-[#282828] border border-[#333] rounded-xl p-12 text-center">
                  <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <h3 className="text-lg font-bold text-white mb-2">No jobs found</h3>
                  <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 bg-[#282828] border border-[#333] rounded-lg text-sm font-medium text-gray-300 hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Previous</button>
              <span className="text-sm text-gray-400">Page {page + 1} of {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-[#282828] border border-[#333] rounded-lg text-sm font-medium text-gray-300 hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
