import React, { useState, useEffect } from 'react';
import { getCandidateFeedback } from '../services/eddaService';

export default function FeedbackViewer({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await getCandidateFeedback(userId);
        setData(response);
      } catch (err) {
        setError(err.message || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchFeedback();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
        <div className="w-10 h-10 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin mb-4"></div>
        Generating your feedback report...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-400 bg-red-500/5 rounded-3xl border border-red-500/20 p-8 text-center">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div className="text-lg font-bold mb-2">Feedback Unavailable</div>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const scoreColor = (score) => {
    if (score >= 80) return 'text-[#2cbb5d] bg-[#2cbb5d]/10 border-[#2cbb5d]/30';
    if (score >= 50) return 'text-[#ffa116] bg-[#ffa116]/10 border-[#ffa116]/30';
    return 'text-red-400 bg-red-400/10 border-red-400/30';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'bg-[#2cbb5d]';
    if (score >= 50) return 'bg-[#ffa116]';
    return 'bg-red-500';
  };

  const metricScores = [
    { label: 'Technical Depth', val: data.technicalDepthScore },
    { label: 'Problem Solving', val: data.problemSolvingScore },
    { label: 'Communication', val: data.communicationScore },
    { label: 'Experience & Projects', val: data.experienceScore }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* OVERALL SCORE */}
        <div className="bg-[#282828] border border-[#333] rounded-3xl p-6 flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle className="text-[#333] stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent" />
              <circle className={`${getProgressColor(data.overallScore || 0)} stroke-current`} strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (data.overallScore || 0)) / 100} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-black text-white">{data.overallScore || 0}</span>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Overall Score</h3>
            <div className={`text-xl font-black uppercase tracking-tight ${data.overallScore >= 80 ? 'text-[#2cbb5d]' : data.overallScore >= 50 ? 'text-[#ffa116]' : 'text-red-400'}`}>
              {data.overallRating || 'Needs Work'}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="md:col-span-2 bg-[#282828] border border-[#333] rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 bg-[#ffa116]"></div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Interview Summary</h3>
          <p className="text-sm text-gray-300 leading-relaxed font-medium relative z-10">
            {data.summary}
          </p>
        </div>
      </div>

      {/* METRICS & ACTION ITEMS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* PROGRESS BARS */}
          <div className="bg-[#282828] border border-[#333] rounded-3xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-[#333] pb-4">Core Competencies</h3>
            <div className="flex flex-col gap-5">
              {metricScores.map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{m.label}</span>
                    <span className="text-xs font-black text-white">{m.val || 0}/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getProgressColor(m.val || 0)}`} style={{ width: `${m.val || 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTION ITEMS (STRENGTHS/IMPROVEMENTS) */}
          <div className="flex flex-col gap-4">
             {data.strengths?.length > 0 && (
               <div className="bg-[#282828] border border-[#333] rounded-3xl p-6">
                 <h3 className="text-[10px] font-black text-[#2cbb5d] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Key Strengths
                 </h3>
                 <ul className="flex flex-col gap-2">
                   {data.strengths.map((s, i) => <li key={i} className="text-xs text-gray-300 bg-[#2cbb5d]/5 border border-[#2cbb5d]/20 px-4 py-2.5 rounded-xl font-bold">{s}</li>)}
                 </ul>
               </div>
             )}
             
             {data.areasForImprovement?.length > 0 && (
               <div className="bg-[#282828] border border-[#333] rounded-3xl p-6">
                 <h3 className="text-[10px] font-black text-[#ffa116] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Areas for Improvement
                 </h3>
                 <ul className="flex flex-col gap-2">
                   {data.areasForImprovement.map((a, i) => <li key={i} className="text-xs text-gray-300 bg-[#ffa116]/5 border border-[#ffa116]/20 px-4 py-2.5 rounded-xl font-bold">{a}</li>)}
                 </ul>
               </div>
             )}
          </div>
        </div>

        {/* FEEDBACK DETAILS */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-gradient-to-br from-[#282828] to-[#1a1a1a] border border-[#333] rounded-3xl p-6 lg:p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Final Recommendation</h3>
             <p className="text-sm text-gray-300 leading-relaxed font-medium">
               {data.recommendations || 'Keep practicing and honing your skills.'}
             </p>
             
             {data.suggestions?.length > 0 && (
               <div className="mt-6 pt-6 border-t border-[#333]">
                 <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Actionable Suggestions</h4>
                 <ul className="list-disc pl-5 space-y-2 text-xs text-gray-300">
                   {data.suggestions.map((s, i) => <li key={i} className="leading-relaxed">{s}</li>)}
                 </ul>
               </div>
             )}
          </div>

          <div className="flex flex-col gap-4">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 pl-2 border-l-2 border-[#ffa116]">Detailed Skill Feedback</h3>
             {data.skillScores?.map((sk, i) => (
               <div key={i} className="bg-[#282828] border border-[#333] rounded-2xl p-5 hover:border-[#444] transition-all">
                  <div className="flex justify-between items-center mb-3">
                     <h4 className="font-bold text-white text-base">{sk.skill}</h4>
                     <div className={`px-3 py-1.5 rounded-xl border font-black text-xs ${scoreColor(sk.score || 0)}`}>
                        {sk.score || 0}/100
                     </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {sk.feedback}
                  </div>
               </div>
             ))}
             {(!data.skillScores || data.skillScores.length === 0) && (
               <div className="text-center py-6 text-gray-500 text-sm">No detailed skill feedback available.</div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
