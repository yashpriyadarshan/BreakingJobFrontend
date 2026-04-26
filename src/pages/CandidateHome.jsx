import React, { useState } from 'react';

export default function CandidateHome({ setActiveTab, setSearchQuery }) {
  const [query, setQuery] = useState('');
  const trendingSearches = ["Frontend Developer", "Product Designer", "Backend Engineer", "Data Scientist"];

  const handleSearch = (searchText) => {
    const text = searchText || query;
    if (!text.trim()) return;
    setSearchQuery(text.trim());
    setActiveTab('Jobs');
  };

  return (
    <main className="flex-grow flex flex-col w-full relative z-10 text-[#eff1f6] bg-[#1a1a1a]">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#2cbb5d]/5 rounded-full blur-[120px] -ml-64 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -mr-64 -mb-32"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-[#2cbb5d]/10 border border-[#2cbb5d]/20 text-[#2cbb5d] text-[10px] font-black uppercase tracking-[0.2em]">
            Engineering Careers Redefined
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
            Find Your Next <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2cbb5d] to-[#2ecc71]">Engineering Role.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Direct connections. Verified salaries. Zero ghosting. We've built the platform we wish we had when we were job hunting.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row shadow-2xl shadow-black/50 rounded-[24px] overflow-hidden border border-[#333] group focus-within:border-[#2cbb5d]/50 transition-all">
            <div className="flex-grow flex items-center bg-[#282828] px-6">
               <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               <input
                 type="text"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 placeholder="Search by role, company, or location..."
                 className="w-full bg-transparent text-[#eff1f6] p-5 text-sm md:text-base outline-none placeholder-gray-500 font-medium"
               />
            </div>
            <button type="submit" className="bg-[#2cbb5d] text-white font-black text-xs uppercase tracking-widest px-10 py-5 sm:py-0 hover:bg-[#229c4b] transition-all whitespace-nowrap active:scale-95">
              Search Jobs
            </button>
          </form>

          {/* TRENDING TAGS */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 items-center">
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mr-2">Trending:</span>
            {trendingSearches.map((tag, i) => (
              <button key={i} onClick={() => handleSearch(tag)} className="bg-[#222] text-gray-400 border border-[#333] px-4 py-1.5 text-[11px] font-bold rounded-xl hover:bg-[#333] hover:text-white hover:border-[#444] transition-all">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-[#1e1e1e] border-t border-[#333]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="group p-10 bg-[#282828] border border-[#333] rounded-[32px] flex flex-col hover:border-[#2cbb5d]/30 transition-all duration-500">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-8 text-gray-500 font-black text-xl group-hover:bg-[#2cbb5d]/10 group-hover:text-[#2cbb5d] transition-colors">01</div>
              <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-tight">Sync Profile</h2>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                Connect your GitHub or LinkedIn. We'll build your technical skill tree automatically. No manual forms.
              </p>
            </div>

            <div className="group p-10 bg-[#282828] border border-[#333] rounded-[32px] flex flex-col hover:border-[#ffa116]/30 transition-all duration-500">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-8 text-gray-500 font-black text-xl group-hover:bg-[#ffa116]/10 group-hover:text-[#ffa116] transition-colors">02</div>
              <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-tight">AI Matching</h2>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                Our engine matches you with roles where your actual skills are valued, not just your credentials.
              </p>
            </div>

            <div className="group p-10 bg-[#282828] border border-[#333] rounded-[32px] flex flex-col hover:border-[#2cbb5d]/30 transition-all duration-500">
              <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-8 text-gray-500 font-black text-xl group-hover:bg-[#2cbb5d]/10 group-hover:text-[#2cbb5d] transition-colors">03</div>
              <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-tight">Apply Direct</h2>
              <p className="text-sm text-gray-400 leading-relaxed font-medium">
                Skip the recruiters. Apply directly to hiring managers with one click. Real-time status tracking included.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
