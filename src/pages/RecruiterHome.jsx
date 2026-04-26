import React, { useState } from 'react';

export default function RecruiterHome({ setActiveTab }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const metrics = [
    { label: "Active Openings", value: "12", trend: "+2", color: "text-[#ffa116]", bg: "bg-[#ffa116]/10" },
    { label: "Total Candidates", value: "486", trend: "+24%", color: "text-[#2cbb5d]", bg: "bg-[#2cbb5d]/10" },
    { label: "Interviews", value: "28", trend: "8 today", color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Avg. Time to Hire", value: "18d", trend: "-2d", color: "text-purple-400", bg: "bg-purple-400/10" }
  ];

  const activeJobs = [
    { title: "Senior Frontend Engineer", dept: "Engineering", applicants: 142, status: "Active", matchRate: "94%" },
    { title: "Lead Product Designer", dept: "Design", applicants: 89, status: "Interviewing", matchRate: "88%" },
    { title: "Backend Systems Staff", dept: "Engineering", applicants: 210, status: "Active", matchRate: "91%" },
    { title: "Product Manager", dept: "Product", applicants: 56, status: "On Hold", matchRate: "85%" }
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
              
              {/* Decorative Sparkline (Simple SVG) */}
              <div className="absolute bottom-0 left-0 w-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <svg viewBox="0 0 100 20" className="w-full h-12">
                   <path d="M0,20 Q10,5 20,15 T40,10 T60,18 T80,8 T100,15 L100,20 L0,20 Z" fill="currentColor" className={metric.color} />
                </svg>
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
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#222] text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      <th className="px-6 py-4">Job Title</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Applicants</th>
                      <th className="px-6 py-4">Match Rate</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {activeJobs.map((job, i) => (
                      <tr key={i} className="hover:bg-[#333]/30 transition-colors cursor-pointer group">
                        <td className="px-6 py-5">
                          <div className="font-bold text-gray-200 group-hover:text-white">{job.title}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-400">{job.dept}</td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                             <span className="font-bold text-white">{job.applicants}</span>
                             <div className="w-12 h-1.5 bg-[#333] rounded-full overflow-hidden">
                                <div className="h-full bg-[#ffa116] w-3/4"></div>
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-[#2cbb5d] font-bold text-sm">{job.matchRate}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                             job.status === 'Active' ? 'border-[#2cbb5d]/30 text-[#2cbb5d] bg-[#2cbb5d]/5' : 
                             job.status === 'Interviewing' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 
                             'border-gray-500/30 text-gray-400 bg-gray-500/5'
                           }`}>
                             {job.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-[#222] text-center">
                <button className="text-xs font-bold text-[#ffa116] hover:underline uppercase tracking-widest">View All 12 Postings</button>
              </div>
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
               <button className="w-full mt-6 bg-white text-black py-3 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all">
                  View Recommended Talent
               </button>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
