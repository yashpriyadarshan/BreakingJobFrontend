import React, { useState } from 'react';

const candidatesData = [
  {
    id: 1,
    name: "Alice Chen",
    title: "Senior Frontend Engineer",
    experience: "8 years",
    location: "San Francisco, CA",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    matchScore: 98,
    status: "Screened",
    aiInterview: "Completed",
    avatar: "AC"
  },
  {
    id: 2,
    name: "Jordan Smith",
    title: "Product Designer",
    experience: "5 years",
    location: "Remote",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping"],
    matchScore: 95,
    status: "Interviewing",
    aiInterview: "Completed",
    avatar: "JS"
  },
  {
    id: 3,
    name: "David Kim",
    title: "Backend Engineer",
    experience: "6 years",
    location: "Austin, TX",
    skills: ["Go", "PostgreSQL", "Docker", "Kubernetes"],
    matchScore: 91,
    status: "New",
    aiInterview: "Pending",
    avatar: "DK"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    title: "Fullstack Developer",
    experience: "4 years",
    location: "London, UK",
    skills: ["JavaScript", "Python", "React", "Django"],
    matchScore: 88,
    status: "Screened",
    aiInterview: "Completed",
    avatar: "SW"
  },
  {
    id: 5,
    name: "Michael Brown",
    title: "Data Scientist",
    experience: "7 years",
    location: "Boston, MA",
    skills: ["Python", "TensorFlow", "Pandas", "SQL"],
    matchScore: 84,
    status: "Reviewing",
    aiInterview: "Not Started",
    avatar: "MB"
  },
  {
    id: 6,
    name: "Emily Davis",
    title: "iOS Developer",
    experience: "5 years",
    location: "Remote",
    skills: ["Swift", "SwiftUI", "Core Data", "Combine"],
    matchScore: 92,
    status: "Screened",
    aiInterview: "Completed",
    avatar: "ED"
  }
];

export default function Candidates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredCandidates = candidatesData.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <main className="flex-grow w-full bg-[#1a1a1a] text-[#eff1f6] p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Talent Pool</h1>
            <p className="text-gray-400 mt-1">Manage and track your applicants across all job openings.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
               <input 
                 type="text" 
                 placeholder="Search candidates..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-[#282828] border border-[#333] text-white pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all w-full md:w-64"
               />
               <svg className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button className="bg-[#ffa116] text-[#1a1a1a] px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#ffb03a] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
              Export
            </button>
          </div>
        </header>

        {/* FILTERS BAR */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'New', 'Screened', 'Interviewing', 'Reviewing'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedStatus === status ? 'bg-[#ffa116] text-[#1a1a1a] border-[#ffa116]' : 'bg-[#282828] text-gray-400 border-[#333] hover:border-[#444] hover:text-white'}`}
            >
              {status} Candidates
            </button>
          ))}
        </div>

        {/* CANDIDATE LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCandidates.map(candidate => (
            <div key={candidate.id} className="bg-[#282828] border border-[#333] rounded-2xl p-6 hover:border-[#ffa116]/30 transition-all group relative overflow-hidden">
              
              {/* TOP ROW: AVATAR & SCORE */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffa116]/20 to-[#ffa116]/5 border border-[#ffa116]/20 flex items-center justify-center text-xl font-black text-[#ffa116]">
                  {candidate.avatar}
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">AI Match</span>
                   <div className="text-2xl font-black text-[#2cbb5d]">{candidate.matchScore}%</div>
                </div>
              </div>

              {/* INFO */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#ffa116] transition-colors">{candidate.name}</h3>
                <p className="text-sm text-gray-400 font-medium">{candidate.title}</p>
                <div className="flex items-center gap-3 mt-3">
                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {candidate.experience}
                   </div>
                   <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      {candidate.location}
                   </div>
                </div>
              </div>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mb-8">
                {candidate.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg bg-[#333] text-[10px] font-bold text-gray-400 border border-[#444]">
                    {skill}
                  </span>
                ))}
              </div>

              {/* FOOTER: STATUS & ACTIONS */}
              <div className="pt-6 border-t border-[#333] flex items-center justify-between">
                <div className="flex flex-col gap-1">
                   <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Interview Status</span>
                   <span className={`text-[10px] font-bold flex items-center gap-1.5 ${candidate.aiInterview === 'Completed' ? 'text-[#2cbb5d]' : 'text-[#ffa116]'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${candidate.aiInterview === 'Completed' ? 'bg-[#2cbb5d]' : 'bg-[#ffa116]'}`}></div>
                      {candidate.aiInterview}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#333] text-gray-400 hover:text-white hover:bg-[#444] transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                   </button>
                   <button className="bg-white text-black px-4 py-2 rounded-xl text-[11px] font-black hover:bg-gray-200 transition-all uppercase tracking-tight">
                      View Profile
                   </button>
                </div>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#ffa116]/5 rounded-full blur-2xl group-hover:bg-[#ffa116]/10 transition-all"></div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredCandidates.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-[#282828] rounded-3xl flex items-center justify-center mb-6 border border-[#333]">
               <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No candidates found</h3>
            <p className="text-gray-400">Try adjusting your filters or search keywords.</p>
          </div>
        )}

      </div>
    </main>
  );
}
