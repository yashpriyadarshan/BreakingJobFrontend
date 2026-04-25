import React, { useState } from 'react';

const jobsData = [
  {
    title: "Senior Frontend Engineer",
    company: "TechCorp Intl",
    logo: "TC",
    category: "Engineering",
    type: "Remote",
    location: "San Francisco, CA",
    salary: "$140k - $160k",
    posted: "2d ago",
    reqs: ["React", "TypeScript", "Tailwind"],
    description: "We are looking for a Senior Frontend Engineer to lead our core product team. You will be responsible for building high-performance web applications and mentoring junior developers."
  },
  {
    title: "Lead Product Designer",
    company: "Studio Brutal",
    logo: "SB",
    category: "Design",
    type: "New York, NY",
    location: "New York, NY",
    salary: "$120k - $150k",
    posted: "5d ago",
    reqs: ["Figma", "UI/UX", "Systems"],
    description: "Join our award-winning design studio to create digital experiences that define brands. You'll lead design systems and product strategy for global clients."
  },
  {
    title: "Fullstack Developer",
    company: "Global Logistics",
    logo: "GL",
    category: "Engineering",
    type: "Hybrid",
    location: "Austin, TX",
    salary: "$110k - $130k",
    posted: "1w ago",
    reqs: ["Node.js", "PostgreSQL", "React"],
    description: "Build scalable supply chain solutions using modern tech. You will work on everything from database schema design to frontend UI components."
  },
  {
    title: "Backend Engineer",
    company: "TechCorp Intl",
    logo: "TC",
    category: "Engineering",
    type: "Hybrid",
    location: "San Francisco, CA",
    salary: "$130k - $155k",
    posted: "3d ago",
    reqs: ["Node.js", "PostgreSQL", "AWS"],
    description: "Design and implement high-throughput microservices. Experience with cloud infrastructure and distributed systems is a must."
  },
  {
    title: "Motion Designer",
    company: "Studio Brutal",
    logo: "SB",
    category: "Design",
    type: "Remote",
    location: "New York, NY",
    salary: "$90k - $110k",
    posted: "1w ago",
    reqs: ["After Effects", "Lottie", "3D"],
    description: "Create stunning animations and interactive motion graphics. You'll bring our digital interfaces to life with smooth transitions and cinematic feel."
  },
  {
    title: "Data Scientist",
    company: "Global Logistics",
    logo: "GL",
    category: "Data",
    type: "Remote",
    location: "Austin, TX",
    salary: "$135k - $160k",
    posted: "3d ago",
    reqs: ["Python", "ML", "TensorFlow"],
    description: "Apply machine learning to optimize global logistics. You will analyze vast amounts of data to predict supply chain disruptions."
  },
  {
    title: "Security Engineer",
    company: "FinEdge",
    logo: "FE",
    category: "Engineering",
    type: "Remote",
    location: "London, UK",
    salary: "$145k - $175k",
    posted: "1d ago",
    reqs: ["Penetration Testing", "SOC2", "Go"],
    description: "Secure our fintech platform against modern threats. You'll conduct regular audits and implement robust security protocols."
  },
  {
    title: "ML Engineer",
    company: "NovaMed",
    logo: "NM",
    category: "Engineering",
    type: "Remote",
    location: "Boston, MA",
    salary: "$150k - $180k",
    posted: "2d ago",
    reqs: ["PyTorch", "Computer Vision", "HIPAA"],
    description: "Build AI-powered diagnostics for healthcare. You'll work with medical imaging data to improve patient outcomes."
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

const ALL_CATEGORIES = [...new Set(jobsData.map(j => j.category))];
const ALL_JOB_TYPES = ["Remote", "Hybrid", "On-site"];
const ALL_LOCATIONS = [...new Set(jobsData.map(j => j.location))];

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

export default function CandidateJobs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  const toggle = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const filteredJobs = jobsData.filter(j => {
    const matchesSearch = !searchQuery ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.reqs.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !activeCategory || j.category === activeCategory;
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(j.location);
    const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.some(type => {
      if (type === 'Remote') return j.type === 'Remote';
      if (type === 'Hybrid') return j.type === 'Hybrid';
      return j.type !== 'Remote' && j.type !== 'Hybrid';
    });

    return matchesSearch && matchesCategory && matchesLocation && matchesJobType;
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 w-full text-[#eff1f6]">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Explore Jobs</h1>
        <p className="text-gray-400 text-sm">Find your next opportunity at world-class companies</p>
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
          placeholder="Search jobs by title, company, or skills..."
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
          <span className="text-xs font-semibold text-gray-500 mr-1">Category:</span>
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat
                  ? 'bg-[#ffa116] text-[#1a1a1a]'
                  : 'bg-[#282828] border border-[#333] text-gray-400 hover:text-white hover:border-[#555]'
                }`}
            >{cat}</button>
          ))}
        </div>
        {activeCategory && (
          <button
            onClick={() => setActiveCategory(null)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors ml-auto"
          >Clear Category</button>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Jobs", value: filteredJobs.length, icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
          { label: "Remote", value: filteredJobs.filter(j => j.type === 'Remote').length, icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" },
          { label: "Avg Salary", value: "$120k", icon: "M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z M12 20c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" },
          { label: "New Today", value: "12", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
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
                  <CheckBox key={jt} checked={selectedJobTypes.includes(jt)} onChange={() => toggle(selectedJobTypes, setSelectedJobTypes, jt)} label={jt} />
                ))}
              </div>
              <button
                onClick={() => { setSelectedLocations([]); setSelectedJobTypes([]); }}
                className={`mt-2 w-full text-sm font-medium rounded-lg py-2.5 transition-colors ${selectedLocations.length > 0 || selectedJobTypes.length > 0 ? 'bg-[#ffa116]/10 text-[#ffa116] border border-[#ffa116]/20 hover:bg-[#ffa116]/20' : 'bg-[#333] text-white hover:bg-[#444]'}`}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </aside>

        {/* JOB FEED */}
        <section className="flex-grow flex flex-col gap-5">
          <div className="flex justify-between items-end pb-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Active Openings</h2>
            <span className="text-sm text-gray-400 font-medium">Showing {filteredJobs.length} Jobs</span>
          </div>

          <div className="flex flex-col gap-4">
            {filteredJobs.map((job, i) => {
              const colorSet = accentColors[i % accentColors.length];
              return (
                <div key={i} className="bg-[#282828] border border-[#333] rounded-xl flex flex-col p-6 hover:border-[#ffa116]/30 hover:shadow-lg hover:shadow-[#ffa116]/5 transition-all group">
                  <div className="flex items-start gap-5">
                    {/* Company Logo */}
                    <div className={`w-12 h-12 rounded-xl ${colorSet.bg} ${colorSet.border} border flex items-center justify-center shrink-0`}>
                      <span className={`text-base font-bold ${colorSet.text}`}>{job.logo}</span>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#ffa116] transition-colors cursor-pointer truncate">
                          {job.title}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{job.posted}</span>
                      </div>

                      <div className="flex items-center text-sm font-medium text-gray-400 mb-4 w-fit cursor-pointer hover:text-white transition-colors">
                        {job.company}
                        <svg className="w-3.5 h-3.5 ml-1.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="bg-[#333] text-gray-300 px-2.5 py-1 rounded text-xs font-medium">
                          {job.type}
                        </span>
                        <span className="bg-[#2cbb5d]/10 text-[#2cbb5d] px-2.5 py-1 rounded text-xs font-medium border border-[#2cbb5d]/20">
                          {job.salary} / yr
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex justify-between items-center pt-5 border-t border-[#333]">
                        <div className="flex gap-2 flex-wrap">
                          {job.reqs.map((req, j) => (
                            <span key={j} className="text-xs text-gray-500 bg-[#222] px-2 py-1 rounded border border-[#333]">
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
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="bg-[#282828] border border-[#333] rounded-xl p-12 text-center">
                <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-bold text-white mb-2">No jobs found</h3>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
