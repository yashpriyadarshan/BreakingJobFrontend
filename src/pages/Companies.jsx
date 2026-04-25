import React, { useState } from 'react';

const companiesData = [
  {
    name: "TechCorp Intl",
    logo: "TC",
    industry: "Software Development",
    location: "San Francisco, CA",
    employees: "5,000+",
    rating: 4.5,
    description: "Leading enterprise SaaS company building the next generation of developer tools and cloud infrastructure.",
    openJobs: [
      { title: "Senior Frontend Engineer", type: "Remote", salary: "$140k - $160k", reqs: ["React", "TypeScript", "Tailwind"], posted: "2d ago" },
      { title: "Backend Engineer", type: "Hybrid", salary: "$130k - $155k", reqs: ["Node.js", "PostgreSQL", "AWS"], posted: "3d ago" },
      { title: "DevOps Engineer", type: "Remote", salary: "$125k - $145k", reqs: ["Docker", "Kubernetes", "CI/CD"], posted: "5d ago" },
    ]
  },
  {
    name: "Studio Brutal",
    logo: "SB",
    industry: "Design Agency",
    location: "New York, NY",
    employees: "200 - 500",
    rating: 4.8,
    description: "Award-winning design studio specializing in brand identity, digital experiences, and design systems for Fortune 500 companies.",
    openJobs: [
      { title: "Lead Product Designer", type: "New York, NY", salary: "$120k - $150k", reqs: ["Figma", "UI/UX", "Systems"], posted: "5d ago" },
      { title: "Motion Designer", type: "Remote", salary: "$90k - $110k", reqs: ["After Effects", "Lottie", "3D"], posted: "1w ago" },
      { title: "UX Researcher", type: "Hybrid", salary: "$95k - $115k", reqs: ["User Testing", "Analytics", "Prototyping"], posted: "1w ago" },
    ]
  },
  {
    name: "Global Logistics",
    logo: "GL",
    industry: "Supply Chain & Tech",
    location: "Austin, TX",
    employees: "10,000+",
    rating: 4.2,
    description: "Transforming global supply chains with AI-powered logistics, real-time tracking, and predictive analytics at scale.",
    openJobs: [
      { title: "Fullstack Developer", type: "Hybrid", salary: "$110k - $130k", reqs: ["Node.js", "PostgreSQL", "React"], posted: "1w ago" },
      { title: "Data Scientist", type: "Remote", salary: "$135k - $160k", reqs: ["Python", "ML", "TensorFlow"], posted: "3d ago" },
      { title: "Product Manager", type: "Austin, TX", salary: "$120k - $145k", reqs: ["Agile", "Analytics", "Strategy"], posted: "4d ago" },
    ]
  },
  {
    name: "FinEdge",
    logo: "FE",
    industry: "FinTech",
    location: "London, UK",
    employees: "1,000 - 5,000",
    rating: 4.6,
    description: "Disrupting traditional banking with modern APIs, real-time payments, and embedded finance solutions for businesses worldwide.",
    openJobs: [
      { title: "Security Engineer", type: "Remote", salary: "$145k - $175k", reqs: ["Penetration Testing", "SOC2", "Go"], posted: "1d ago" },
      { title: "iOS Developer", type: "London, UK", salary: "$115k - $140k", reqs: ["Swift", "SwiftUI", "CoreData"], posted: "4d ago" },
      { title: "QA Automation Lead", type: "Hybrid", salary: "$100k - $125k", reqs: ["Selenium", "Cypress", "CI/CD"], posted: "6d ago" },
    ]
  },
  {
    name: "NovaMed",
    logo: "NM",
    industry: "HealthTech",
    location: "Boston, MA",
    employees: "500 - 1,000",
    rating: 4.4,
    description: "Pioneering digital health solutions with AI diagnostics, telemedicine platforms, and patient data analytics.",
    openJobs: [
      { title: "ML Engineer", type: "Remote", salary: "$150k - $180k", reqs: ["PyTorch", "Computer Vision", "HIPAA"], posted: "2d ago" },
      { title: "React Native Developer", type: "Hybrid", salary: "$105k - $130k", reqs: ["React Native", "Redux", "APIs"], posted: "5d ago" },
      { title: "Cloud Architect", type: "Boston, MA", salary: "$155k - $185k", reqs: ["AWS", "Terraform", "Security"], posted: "1w ago" },
    ]
  },
  {
    name: "PixelForge",
    logo: "PF",
    industry: "Gaming",
    location: "Seattle, WA",
    employees: "200 - 500",
    rating: 4.7,
    description: "Indie-to-AAA game studio creating immersive worlds with cutting-edge graphics, physics engines, and AI-driven narratives.",
    openJobs: [
      { title: "Graphics Programmer", type: "Seattle, WA", salary: "$130k - $160k", reqs: ["C++", "Vulkan", "Shaders"], posted: "3d ago" },
      { title: "Game Designer", type: "Hybrid", salary: "$95k - $120k", reqs: ["Unity", "Level Design", "Narrative"], posted: "1w ago" },
      { title: "Technical Artist", type: "Remote", salary: "$100k - $130k", reqs: ["Houdini", "Unreal", "VFX"], posted: "5d ago" },
    ]
  },
];

const accentColors = [
  { bg: "bg-[#ffa116]/15", text: "text-[#ffa116]", border: "border-[#ffa116]/25" },
  { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/25" },
  { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/25" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/25" },
  { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/25" },
  { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/25" },
];

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < full ? 'text-[#ffa116]' : i === full && hasHalf ? 'text-[#ffa116]/50' : 'text-[#444]'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1.5 font-medium">{rating}</span>
    </div>
  );
}

const ALL_INDUSTRIES = [...new Set(companiesData.map(c => c.industry))];
const ALL_JOB_TYPES = ["Remote", "Hybrid", "On-site"];
const ALL_COMPANIES = companiesData.map(c => c.name);
const ALL_JOB_TITLES = [...new Set(companiesData.flatMap(c => c.openJobs.map(j => j.title)))];
const ALL_LOCATIONS = [...new Set(companiesData.map(c => c.location))];

function CheckBox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group mt-3 first:mt-0">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${checked ? 'border-transparent bg-[#2cbb5d]' : 'border-[#555] bg-[#333] group-hover:border-gray-400'}`}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'}`}>{label}</span>
    </label>
  );
}

export default function Companies() {
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndustry, setActiveIndustry] = useState(null);
  const [activeJobType, setActiveJobType] = useState(null);
  const [activeCompany, setActiveCompany] = useState(null);
  const [activeJob, setActiveJob] = useState(null);
  
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSidebarJobTypes, setSelectedSidebarJobTypes] = useState([]);

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const filteredCompanies = companiesData.filter(c => {
    const matchesSearch = !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.openJobs.some(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = !activeIndustry || c.industry === activeIndustry;
    const matchesCompany = !activeCompany || c.name === activeCompany;
    const matchesJob = !activeJob || c.openJobs.some(j => j.title === activeJob);
    const matchesJobType = !activeJobType || c.openJobs.some(j => {
      if (activeJobType === 'Remote') return j.type === 'Remote';
      if (activeJobType === 'Hybrid') return j.type === 'Hybrid';
      return j.type !== 'Remote' && j.type !== 'Hybrid';
    });
    
    const matchesSidebarLocation = selectedLocations.length === 0 || selectedLocations.includes(c.location);
    const matchesSidebarJobType = selectedSidebarJobTypes.length === 0 || c.openJobs.some(j => {
      if (selectedSidebarJobTypes.includes('Remote') && j.type === 'Remote') return true;
      if (selectedSidebarJobTypes.includes('Hybrid') && j.type === 'Hybrid') return true;
      if (selectedSidebarJobTypes.includes('On-site') && j.type !== 'Remote' && j.type !== 'Hybrid') return true;
      return false;
    });

    return matchesSearch && matchesIndustry && matchesCompany && matchesJob && matchesJobType && matchesSidebarLocation && matchesSidebarJobType;
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 w-full text-[#eff1f6]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Top Companies</h1>
        <p className="text-gray-400 text-sm">Discover leading companies and their open positions</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search companies by name, industry, or location..."
          className="w-full bg-[#282828] border border-[#333] rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ffa116]/50 focus:ring-1 focus:ring-[#ffa116]/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 mr-1">Industry:</span>
          {ALL_INDUSTRIES.map(ind => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(activeIndustry === ind ? null : ind)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeIndustry === ind
                  ? 'bg-[#ffa116] text-[#1a1a1a]'
                  : 'bg-[#282828] border border-[#333] text-gray-400 hover:text-white hover:border-[#555]'
                }`}
            >{ind}</button>
          ))}
        </div>
        <div className="w-px h-6 bg-[#333] self-center hidden md:block"></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 mr-1">Job Type:</span>
          {ALL_JOB_TYPES.map(jt => (
            <button
              key={jt}
              onClick={() => setActiveJobType(activeJobType === jt ? null : jt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeJobType === jt
                  ? 'bg-[#ffa116] text-[#1a1a1a]'
                  : 'bg-[#282828] border border-[#333] text-gray-400 hover:text-white hover:border-[#555]'
                }`}
            >{jt}</button>
          ))}
        </div>
        {(activeIndustry || activeJobType) && (
          <button
            onClick={() => { setActiveIndustry(null); setActiveJobType(null); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors ml-auto"
          >Clear Filters</button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Companies", value: filteredCompanies.length, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
          { label: "Open Roles", value: filteredCompanies.reduce((a, c) => a + c.openJobs.length, 0), icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { label: "Remote Jobs", value: filteredCompanies.reduce((a, c) => a + c.openJobs.filter(j => j.type === 'Remote').length, 0), icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
          { label: "Avg Rating", value: (filteredCompanies.reduce((a, c) => a + c.rating, 0) / (filteredCompanies.length || 1)).toFixed(1), icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#282828] border border-[#333] rounded-xl p-4 hover:border-[#444] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ffa116]/10 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5 text-[#ffa116]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Layout with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* SIDEBAR FILTERS */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
          <div className="bg-[#282828] border border-[#333] rounded-xl p-5">
            <h2 className="font-bold text-lg mb-4 text-white">Filters</h2>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wider">LOCATION</h3>
                {ALL_LOCATIONS.map(loc => (
                  <CheckBox key={loc} checked={selectedLocations.includes(loc)} onChange={() => toggle(selectedLocations, setSelectedLocations, loc)} label={loc} />
                ))}
              </div>
              <div className="border-t border-[#333] pt-5">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wider">JOB TYPE</h3>
                {ALL_JOB_TYPES.map(jt => (
                  <CheckBox key={jt} checked={selectedSidebarJobTypes.includes(jt)} onChange={() => toggle(selectedSidebarJobTypes, setSelectedSidebarJobTypes, jt)} label={jt} />
                ))}
              </div>
              <button
                onClick={() => { setSelectedLocations([]); setSelectedSidebarJobTypes([]); }}
                className={`mt-2 w-full text-sm font-medium rounded-lg py-2.5 transition-colors ${selectedLocations.length > 0 || selectedSidebarJobTypes.length > 0 ? 'bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 hover:bg-[#ffa116]/20' : 'bg-[#333] text-white hover:bg-[#444]'}`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Company Cards */}
        <div className="flex-grow flex flex-col gap-5">
        {filteredCompanies.map((company, idx) => {
          const isExpanded = expandedCompany === idx;
          const colorSet = accentColors[idx % accentColors.length];

          return (
            <div
              key={idx}
              className={`bg-[#282828] border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-[#ffa116]/30 shadow-lg shadow-[#ffa116]/5' : 'border-[#333] hover:border-[#444]'}`}
            >
              {/* Company Header */}
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedCompany(isExpanded ? null : idx)}
              >
                <div className="flex items-start gap-5">
                  {/* Company Logo */}
                  <div className={`w-14 h-14 rounded-xl ${colorSet.bg} ${colorSet.border} border flex items-center justify-center shrink-0`}>
                    <span className={`text-lg font-bold ${colorSet.text}`}>{company.logo}</span>
                  </div>

                  {/* Company Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-lg font-bold text-white">{company.name}</h2>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colorSet.bg} ${colorSet.text} ${colorSet.border} border`}>
                            {company.industry}
                          </span>
                        </div>
                        <StarRating rating={company.rating} />
                      </div>

                      {/* Open Jobs Badge */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold text-white">{company.openJobs.length} Jobs</p>
                          <p className="text-xs text-gray-500">Open positions</p>
                        </div>
                        <div className={`w-8 h-8 rounded-lg bg-[#333] flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Meta Tags */}
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {company.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#444]"></span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {company.employees} employees
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#444]"></span>
                      <span className="sm:hidden text-xs font-semibold text-[#ffa116]">{company.openJobs.length} open roles</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed line-clamp-2">{company.description}</p>
                  </div>
                </div>
              </div>

              {/* Expanded: Job Listings */}
              {isExpanded && (
                <div className="border-t border-[#333] bg-[#222]/50">
                  <div className="px-6 py-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Top Open Positions at {company.name}
                    </h3>

                    <div className="flex flex-col gap-3">
                      {company.openJobs.map((job, jIdx) => (
                        <div
                          key={jIdx}
                          className="bg-[#282828] border border-[#333] rounded-xl p-5 hover:border-[#555] transition-colors group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-base font-bold text-white group-hover:text-[#ffa116] transition-colors cursor-pointer">
                              {job.title}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{job.posted}</span>
                          </div>

                          <div className="flex items-center text-sm font-medium text-gray-400 mb-4 w-fit cursor-pointer hover:text-white transition-colors">
                            {company.name}
                            <svg className="w-3.5 h-3.5 ml-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">
                              {job.type}
                            </span>
                            <span className="bg-[#2cbb5d]/10 text-[#2cbb5d] px-2.5 py-1 rounded text-xs font-medium border border-[#2cbb5d]/20">
                              {job.salary} / yr
                            </span>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                            <div className="flex gap-2 flex-wrap">
                              {job.reqs.map((req, rIdx) => (
                                <span key={rIdx} className="text-xs text-gray-500 bg-[#222] px-2 py-1 rounded border border-[#333]">
                                  {req}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#333] text-gray-400 hover:text-white hover:bg-[#444] transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </button>
                              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#333] text-gray-400 hover:text-white hover:bg-[#444] transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                              </button>
                              <button className="ml-2 font-medium text-sm px-6 py-2 rounded-lg bg-[#ffa116] text-[#1a1a1a] hover:bg-[#ffb03a] transition-colors shadow-sm">
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredCompanies.length === 0 && (
          <div className="bg-[#282828] border border-[#333] rounded-xl p-12 text-center">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2">No companies found</h3>
            <p className="text-sm text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
