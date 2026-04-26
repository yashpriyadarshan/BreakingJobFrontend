import React, { useState, useEffect, useRef } from 'react';
import { getAllOpenJobs, searchJobs } from '../services/jobService';
import { getCompanyById } from '../services/companyService';

const accentColors = [
  { bg: "bg-[#ffa116]/15", text: "text-[#ffa116]", border: "border-[#ffa116]/25" },
  { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/25" },
  { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/25" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" },
  { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/25" },
  { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/25" },
];

const JOB_TYPES = ['REMOTE', 'HYBRID', 'ONSITE'];

function formatLabel(t) {
  return (t || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function normalizeSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return String(skills).split(',').map(s => s.trim()).filter(Boolean);
}

function formatSalary(min, max, currency) {
  const c = currency || '';
  const fmt = (v) => v >= 1000 ? `${Math.round(v / 1000)}k` : v;
  if (min && max && (min > 0 || max > 0)) return `${fmt(min)} - ${fmt(max)} ${c}`.trim();
  if (min && min > 0) return `From ${fmt(min)} ${c}`.trim();
  if (max && max > 0) return `Up to ${fmt(max)} ${c}`.trim();
  return null;
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

export default function Companies() {
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  // Map of companyId -> { company, jobs[] }
  const [companyMap, setCompanyMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(val), 500);
  };

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch up to 100 jobs to build the companies list
        let jobs = [];
        const hasFilters = debouncedQuery || selectedJobTypes.length > 0;
        if (hasFilters) {
          const params = { page: 0, size: 100 };
          if (debouncedQuery) params.keyword = debouncedQuery;
          if (selectedJobTypes.length === 1) params.jobType = selectedJobTypes[0];
          const data = await searchJobs(params);
          jobs = data.content || [];
        } else {
          const data = await getAllOpenJobs(0, 100);
          jobs = data.content || [];
        }

        // Group jobs by companyId
        const grouped = {};
        for (const job of jobs) {
          if (!grouped[job.companyId]) {
            grouped[job.companyId] = { company: null, jobs: [] };
          }
          grouped[job.companyId].jobs.push(job);
        }

        // Fetch company details for each unique companyId
        const companyIds = Object.keys(grouped);
        await Promise.all(
          companyIds.map(async (cid) => {
            try {
              const company = await getCompanyById(Number(cid));
              grouped[cid].company = company;
            } catch {
              // If we can't fetch the company, use placeholder
              grouped[cid].company = { id: Number(cid), name: `Company #${cid}` };
            }
          })
        );

        setCompanyMap(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [debouncedQuery, selectedJobTypes]);

  const companies = Object.values(companyMap);
  const totalOpenJobs = companies.reduce((sum, c) => sum + c.jobs.length, 0);
  const remoteJobs = companies.reduce((sum, c) => sum + c.jobs.filter(j => j.jobType === 'REMOTE').length, 0);
  const hasFilters = debouncedQuery || selectedJobTypes.length > 0;

  const clearAll = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedJobTypes([]);
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 w-full text-[#eff1f6]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Top Companies</h1>
        <p className="text-gray-400 text-sm">Discover companies currently hiring and their open positions</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input type="text" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by job title, skills, or location..."
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
          { label: "Companies Hiring", value: companies.length, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          { label: "Open Roles", value: totalOpenJobs, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { label: "Remote Jobs", value: remoteJobs, icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
          { label: "Avg Jobs/Company", value: companies.length ? (totalOpenJobs / companies.length).toFixed(1) : 0, icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
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
                  <CheckBox key={jt} checked={selectedJobTypes.includes(jt)}
                    onChange={() => toggle(selectedJobTypes, setSelectedJobTypes, jt)}
                    label={formatLabel(jt)} />
                ))}
              </div>
              <button onClick={clearAll}
                className={`mt-2 w-full text-sm font-medium rounded-lg py-2.5 transition-colors ${hasFilters ? 'bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 hover:bg-[#ffa116]/20' : 'bg-[#333] text-gray-400 cursor-default'}`}>
                Clear All Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Company Cards */}
        <div className="flex-grow flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">{error}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : companies.length === 0 ? (
            <div className="bg-[#282828] border border-[#333] rounded-xl p-12 text-center">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <h3 className="text-lg font-bold text-white mb-2">No companies found</h3>
              <p className="text-sm text-gray-400">No companies are currently hiring{hasFilters ? ' matching your filters' : ''}.</p>
            </div>
          ) : (
            companies.map(({ company, jobs }, idx) => {
              const isExpanded = expandedCompany === idx;
              const colorSet = accentColors[idx % accentColors.length];
              const logoInitials = (company?.name || '?').substring(0, 2).toUpperCase();
              const logoUrl = company?.logoUrl;

              return (
                <div key={company?.id || idx}
                  className={`bg-[#282828] border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-[#ffa116]/30 shadow-lg shadow-[#ffa116]/5' : 'border-[#333] hover:border-[#444]'}`}>

                  {/* Company Header */}
                  <div className="p-6 cursor-pointer" onClick={() => setExpandedCompany(isExpanded ? null : idx)}>
                    <div className="flex items-start gap-5">
                      {/* Logo */}
                      <div className={`w-14 h-14 rounded-xl ${colorSet.bg} ${colorSet.border} border flex items-center justify-center shrink-0 overflow-hidden`}>
                        {logoUrl ? (
                          <img src={logoUrl} alt={company?.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className={`text-lg font-bold ${colorSet.text}`}>{logoInitials}</span>
                        )}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-lg font-bold text-white mb-1">{company?.name || `Company #${company?.id}`}</h2>
                            <div className="flex flex-wrap items-center gap-3">
                              {company?.location && (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                  {company.location}
                                </span>
                              )}
                              {company?.website && (
                                <a href={company.website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                  className="text-xs text-[#ffa116] hover:underline">{company.website}</a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right hidden sm:block">
                              <p className="text-sm font-bold text-white">{jobs.length} Job{jobs.length !== 1 ? 's' : ''}</p>
                              <p className="text-xs text-gray-500">Open positions</p>
                            </div>
                            <div className={`w-8 h-8 rounded-lg bg-[#333] flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        </div>

                        {company?.description && (
                          <p className="text-sm text-gray-400 mt-3 leading-relaxed line-clamp-2">{company.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded: Job Listings */}
                  {isExpanded && (
                    <div className="border-t border-[#333] bg-[#222]/50">
                      <div className="px-6 py-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                          Open Positions at {company?.name}
                        </h3>
                        <div className="flex flex-col gap-3">
                          {jobs.map((job, jIdx) => {
                            const salary = formatSalary(job.minSalary, job.maxSalary, job.currency);
                            const skills = normalizeSkills(job.skills);
                            return (
                              <div key={job.id} className="bg-[#282828] border border-[#333] rounded-xl p-5 hover:border-[#555] transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="text-base font-bold text-white group-hover:text-[#ffa116] transition-colors">{job.title}</h4>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                  {job.location && <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">{job.location}</span>}
                                  {job.jobType && <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">{formatLabel(job.jobType)}</span>}
                                  {job.employmentType && <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">{formatLabel(job.employmentType)}</span>}
                                  {salary && <span className="bg-[#2cbb5d]/10 text-[#2cbb5d] px-2.5 py-1 rounded text-xs font-medium border border-[#2cbb5d]/20">{salary}/yr</span>}
                                  {job.eddaVerificationRequired && <span className="bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded text-xs font-medium border border-purple-500/20">AI Verification Interview Required</span>}
                                </div>

                                {job.description && <p className="text-sm text-gray-400 mb-4 line-clamp-2">{job.description}</p>}

                                <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                                  <div className="flex gap-2 flex-wrap">
                                    {skills.slice(0, 4).map((req, rIdx) => (
                                      <span key={rIdx} className="text-xs text-gray-500 bg-[#222] px-2 py-1 rounded border border-[#333]">{req}</span>
                                    ))}
                                    {skills.length > 4 && <span className="text-xs text-gray-600">+{skills.length - 4} more</span>}
                                  </div>
                                  <button className="ml-2 font-medium text-sm px-6 py-2 rounded-lg bg-[#ffa116] text-[#1a1a1a] hover:bg-[#ffb03a] transition-colors shadow-sm">Apply</button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
