import React, { useState, useEffect } from 'react';
import { getRecruiterEvaluation } from '../services/eddaService';

export default function EvaluationViewer({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEval = async () => {
      try {
        const response = await getRecruiterEvaluation(userId);
        setData(response);
      } catch (err) {
        setError(err.message || 'Failed to load evaluation');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchEval();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
        <div className="w-10 h-10 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin mb-4"></div>
        Generating AI Analysis...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-400 bg-red-500/5 rounded-3xl border border-red-500/20 p-8 text-center">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div className="text-lg font-bold mb-2">Analysis Unavailable</div>
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

  const recLower = (data.hireRecommendation || '').toLowerCase();
  const isHire = recLower.includes('hire') && !recLower.includes('not');
  const isNotHire = recLower.includes('not') || recLower.includes('reject');

  const metricScores = [
    { label: 'Technical Depth', val: data.technicalDepthScore },
    { label: 'Problem Solving', val: data.problemSolvingScore },
    { label: 'Communication', val: data.communicationScore },
    { label: 'Confidence', val: data.confidenceScore },
    { label: 'Experience', val: data.experienceScore }
  ];

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* HEADER STATS */}
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
            <p className="text-sm font-bold text-gray-300">AI computed rating based on full interview performance.</p>
          </div>
        </div>

        {/* DECISION */}
        <div className="bg-[#282828] border border-[#333] rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-20 transition-all ${isHire ? 'bg-[#2cbb5d]' : isNotHire ? 'bg-red-500' : 'bg-[#ffa116]'}`}></div>
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">AI Recommendation</h3>
          <div className={`text-xl font-black uppercase tracking-tight ${isHire ? 'text-[#2cbb5d]' : isNotHire ? 'text-red-400' : 'text-[#ffa116]'}`}>
            {data.hireRecommendation}
          </div>
        </div>

        {/* QUICK METRICS */}
        <div className="bg-[#282828] border border-[#333] rounded-3xl p-6 flex flex-col justify-center gap-3">
          <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Flags</span>
             <span className="text-xs font-black text-red-400 bg-red-400/10 px-2.5 py-1 rounded-lg">{data.redFlags?.length || 0} Detected</span>
          </div>
          <div className="flex items-center justify-between">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Highlights</span>
             <span className="text-xs font-black text-[#2cbb5d] bg-[#2cbb5d]/10 px-2.5 py-1 rounded-lg">{data.highlights?.length || 0} Found</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: DETAILED METRICS & NOTES */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          
          <div className="bg-[#282828] border border-[#333] rounded-3xl p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 border-b border-[#333] pb-4">Performance Metrics</h3>
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

          {(data.redFlags?.length > 0 || data.highlights?.length > 0) && (
            <div className="bg-[#282828] border border-[#333] rounded-3xl p-6 flex flex-col gap-6">
               {data.redFlags?.length > 0 && (
                 <div>
                   <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Red Flags
                   </h3>
                   <ul className="flex flex-col gap-2">
                     {data.redFlags.map((flag, i) => <li key={i} className="text-xs text-gray-300 bg-red-500/5 border border-red-500/20 px-3 py-2 rounded-xl">{flag}</li>)}
                   </ul>
                 </div>
               )}
               {data.highlights?.length > 0 && (
                 <div>
                   <h3 className="text-[10px] font-black text-[#2cbb5d] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Highlights
                   </h3>
                   <ul className="flex flex-col gap-2">
                     {data.highlights.map((hl, i) => <li key={i} className="text-xs text-gray-300 bg-[#2cbb5d]/5 border border-[#2cbb5d]/20 px-3 py-2 rounded-xl">{hl}</li>)}
                   </ul>
                 </div>
               )}
            </div>
          )}
          
        </div>

        {/* RIGHT COLUMN: ASSESSMENT DETAILS */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-gradient-to-br from-[#282828] to-[#1a1a1a] border border-[#333] rounded-3xl p-6 lg:p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Detailed AI Notes</h3>
             <p className="text-sm text-gray-300 leading-relaxed bg-[#1a1a1a]/50 p-6 rounded-2xl border border-[#333] font-medium">
               {data.detailedNotes || 'No detailed notes provided.'}
             </p>
          </div>

          <div className="flex flex-col gap-4">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 pl-2 border-l-2 border-[#ffa116]">Skill Breakdown</h3>
             {data.skillAssessment?.map((sk, i) => (
               <div key={i} className="bg-[#282828] border border-[#333] rounded-2xl p-5 hover:border-[#444] transition-all">
                  <div className="flex justify-between items-start mb-3">
                     <div>
                       <h4 className="font-bold text-white text-base">{sk.skill}</h4>
                       <span className={`inline-block mt-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                         sk.proficiencyLevel?.toLowerCase() === 'expert' ? 'text-purple-400 border-purple-400/30 bg-purple-400/10' :
                         sk.proficiencyLevel?.toLowerCase() === 'advanced' ? 'text-blue-400 border-blue-400/30 bg-blue-400/10' :
                         sk.proficiencyLevel?.toLowerCase() === 'intermediate' ? 'text-[#ffa116] border-[#ffa116]/30 bg-[#ffa116]/10' :
                         'text-red-400 border-red-400/30 bg-red-400/10'
                       }`}>
                         {sk.proficiencyLevel}
                       </span>
                     </div>
                     <div className={`px-3 py-1.5 rounded-xl border font-black text-xs ${scoreColor(sk.score || 0)}`}>
                        {sk.score || 0}/100
                     </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#333] leading-relaxed italic border-l-2 border-l-[#ffa116]/50">
                    "{sk.evidence}"
                  </div>
               </div>
             ))}
             {(!data.skillAssessment || data.skillAssessment.length === 0) && (
               <div className="text-center py-6 text-gray-500 text-sm">No specific skills assessed.</div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
