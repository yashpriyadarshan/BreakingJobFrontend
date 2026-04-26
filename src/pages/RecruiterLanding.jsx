import React from 'react';

export default function RecruiterLanding({ setActiveTab }) {
  const stats = [
    { label: "Talent Pool", value: "50k+", sub: "Verified engineers" },
    { label: "Avg. Time to Hire", value: "12 Days", sub: "3x faster than industry" },
    { label: "AI Accuracy", value: "94%", sub: "Matched by skill tree" },
  ];

  return (
    <main className="flex-grow flex flex-col w-full relative z-10 text-[#eff1f6] bg-[#1a1a1a]">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffa116]/5 rounded-full blur-[120px] -mr-64 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-32"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#ffa116]/10 border border-[#ffa116]/20 text-[#ffa116] text-[10px] font-black uppercase tracking-[0.2em]">
            Built for High-Growth Teams
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            Hire the Top 1% of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffa116] to-[#ffb03a]">Tech Talent.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Stop sorting through resumes. Our AI-driven engine matches you with candidates based on their actual code, not just keywords.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setActiveTab('RecruiterSignup')}
              className="w-full sm:w-auto px-10 py-5 bg-[#ffa116] text-[#1a1a1a] font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-[#ffb03a] transition-all shadow-xl shadow-[#ffa116]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Hiring Now
            </button>
            <button 
              className="w-full sm:w-auto px-10 py-5 bg-[#333] text-white font-black text-sm uppercase tracking-widest rounded-2xl border border-[#444] hover:bg-[#444] transition-all"
            >
              Book a Demo
            </button>
          </div>

          {/* STATS */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#333] pt-16">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-xs font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                <div className="text-[10px] text-gray-600 mt-1 font-medium italic">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECRUITER ADVANTAGE */}
      <section className="py-24 bg-[#222] border-y border-[#333]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">Why Top Companies Trust Us</h2>
            <div className="w-20 h-1 bg-[#ffa116] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-[#282828] border border-[#333] p-10 rounded-[32px] hover:border-[#ffa116]/50 transition-all duration-500">
              <div className="w-14 h-14 bg-[#ffa116]/10 rounded-2xl flex items-center justify-center text-[#ffa116] mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">AI Skill Matching</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                Our proprietary engine analyzes candidate projects and code to ensure a 99% technical fit before you even interview.
              </p>
            </div>

            <div className="group bg-[#282828] border border-[#333] p-10 rounded-[32px] hover:border-[#ffa116]/50 transition-all duration-500">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Verified Profiles</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                Every candidate is vetted. No fake profiles, no redundant data. Get high-signal profiles delivered to your dashboard.
              </p>
            </div>

            <div className="group bg-[#282828] border border-[#333] p-10 rounded-[32px] hover:border-[#ffa116]/50 transition-all duration-500">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Full Transparency</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                See salary expectations, availability, and direct communication logs in one place. No middle-men, no confusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#ffa116] to-[#ffb03a] rounded-[40px] p-12 md:p-20 text-center shadow-2xl shadow-[#ffa116]/20 overflow-hidden relative">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                 <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
                 <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                       <path d="M 10 0 L 0 0 0 10" fill="none" stroke="black" strokeWidth="0.5" />
                    </pattern>
                 </defs>
              </svg>
           </div>
           <h2 className="text-3xl md:text-5xl font-black text-[#1a1a1a] mb-6 relative z-10">Ready to build your <br/> dream team?</h2>
           <p className="text-[#1a1a1a] text-lg font-bold mb-10 opacity-80 max-w-xl mx-auto relative z-10">Join 500+ tech leaders who use our platform to scale their engineering organizations.</p>
           <button 
             onClick={() => setActiveTab('RecruiterSignup')}
             className="px-12 py-5 bg-[#1a1a1a] text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-all relative z-10 shadow-2xl"
           >
             Create Recruiter Account
           </button>
        </div>
      </section>

    </main>
  );
}
