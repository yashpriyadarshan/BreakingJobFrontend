import React, { useState } from 'react';

const interviewsData = [
  {
    id: 1,
    candidate: "Alice Chen",
    role: "Senior Frontend Engineer",
    date: "Oct 28, 2023",
    time: "10:00 AM",
    type: "Technical Round",
    status: "Upcoming",
    platform: "Zoom",
    avatar: "AC"
  },
  {
    id: 2,
    candidate: "Jordan Smith",
    role: "Product Designer",
    date: "Oct 28, 2023",
    time: "02:30 PM",
    type: "Culture Fit",
    status: "Upcoming",
    platform: "Google Meet",
    avatar: "JS"
  },
  {
    id: 3,
    candidate: "Sarah Wilson",
    role: "Fullstack Developer",
    date: "Oct 29, 2023",
    time: "11:00 AM",
    type: "Final Round",
    status: "Upcoming",
    platform: "Zoom",
    avatar: "SW"
  },
  {
    id: 4,
    candidate: "Robert Fox",
    role: "Frontend Dev",
    date: "Oct 25, 2023",
    time: "09:00 AM",
    type: "Initial Screening",
    status: "Completed",
    platform: "AI Interview",
    avatar: "RF"
  },
  {
    id: 5,
    candidate: "Jane Cooper",
    role: "UI Designer",
    date: "Oct 24, 2023",
    time: "04:00 PM",
    type: "Technical Round",
    status: "Completed",
    platform: "Zoom",
    avatar: "JC"
  }
];

export default function Interviews() {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const filteredInterviews = interviewsData.filter(i => i.status === activeTab);

  return (
    <main className="flex-grow w-full bg-[#1a1a1a] text-[#eff1f6] p-4 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Interviews</h1>
            <p className="text-gray-400 mt-1">Manage your schedule and track candidate evaluations.</p>
          </div>
          <div className="flex bg-[#282828] p-1.5 rounded-2xl border border-[#333]">
            {['Upcoming', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#ffa116] text-[#1a1a1a]' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* INTERVIEW LIST */}
        <div className="flex flex-col gap-6">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map(interview => (
              <div key={interview.id} className="bg-[#282828] border border-[#333] rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#444] transition-all group">
                
                {/* LEFT: CANDIDATE & TIME */}
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#333] border border-[#444] flex items-center justify-center text-lg font-black text-[#ffa116] group-hover:border-[#ffa116]/50 transition-all">
                    {interview.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#ffa116] transition-colors">{interview.candidate}</h3>
                    <p className="text-sm text-gray-400 font-medium">{interview.role}</p>
                  </div>
                </div>

                {/* MIDDLE: DATE & TYPE */}
                <div className="flex flex-wrap items-center gap-8">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Date & Time</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
                      <svg className="w-4 h-4 text-[#ffa116]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {interview.date} at {interview.time}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Interview Type</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      {interview.type}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Platform</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
                      <span className="bg-[#333] px-2 py-0.5 rounded text-[10px] border border-[#444]">{interview.platform}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: ACTIONS */}
                <div className="flex items-center gap-3 border-t lg:border-t-0 pt-6 lg:pt-0 border-[#333]">
                  {activeTab === 'Upcoming' ? (
                    <>
                      <button className="flex-grow lg:flex-grow-0 px-6 py-3 rounded-xl bg-[#2cbb5d] text-white text-xs font-black hover:bg-[#229c4b] transition-all uppercase tracking-tight shadow-lg shadow-[#2cbb5d]/10">
                        Join Call
                      </button>
                      <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#333] text-gray-400 hover:text-white hover:bg-[#444] transition-all border border-[#444]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </button>
                    </>
                  ) : (
                    <button className="flex-grow lg:flex-grow-0 px-6 py-3 rounded-xl bg-[#333] text-gray-300 text-xs font-black hover:bg-[#444] hover:text-white transition-all uppercase tracking-tight border border-[#444]">
                      View Feedback
                    </button>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-[#282828] border border-[#333] rounded-3xl">
              <div className="w-20 h-20 bg-[#333] rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No {activeTab.toLowerCase()} interviews</h3>
              <p className="text-gray-400">Your schedule is currently clear for this category.</p>
            </div>
          )}
        </div>

        {/* CALENDAR PREVIEW (DECORATIVE) */}
        <div className="mt-12 p-8 bg-gradient-to-br from-[#282828] to-[#1a1a1a] border border-[#333] rounded-3xl flex flex-col lg:flex-row items-center gap-10">
           <div className="shrink-0">
              <div className="w-48 h-48 rounded-3xl bg-[#333] border border-[#444] p-6 flex flex-col justify-between">
                 <div className="text-red-500 font-black text-lg tracking-widest uppercase text-center">October</div>
                 <div className="text-7xl font-black text-white text-center">28</div>
                 <div className="text-xs font-bold text-gray-500 text-center uppercase tracking-tighter">Today's Schedule</div>
              </div>
           </div>
           <div>
              <h4 className="text-2xl font-bold text-white mb-4">You have 2 interviews today</h4>
              <p className="text-gray-400 mb-6 max-w-lg leading-relaxed">
                Stay on top of your hiring process. We've synchronized your calendar with Breaking Job to ensure you never miss a connection with top talent.
              </p>
              <button className="text-[#ffa116] font-bold text-sm hover:underline flex items-center gap-2">
                Open External Calendar
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </button>
           </div>
        </div>

      </div>
    </main>
  );
}
