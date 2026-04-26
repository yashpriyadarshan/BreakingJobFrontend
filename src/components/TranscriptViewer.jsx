import React, { useState, useEffect } from 'react';
import { getTranscript } from '../services/eddaService';

export default function TranscriptViewer({ userId, onClose, inline = false }) {
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const data = await getTranscript(userId);
        setTranscript(data);
      } catch (err) {
        setError(err.message || 'Failed to load transcript');
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchTranscript();
    }
  }, [userId]);

  const renderChat = (transcriptData) => {
    if (typeof transcriptData !== 'object' || !transcriptData.conversation) {
      return (
        <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {typeof transcriptData === 'object' ? JSON.stringify(transcriptData, null, 2) : transcriptData}
        </pre>
      );
    }

    const { candidateName, interviewDate, conversation } = transcriptData;
    const initial = candidateName ? candidateName.charAt(0).toUpperCase() : 'C';

    return (
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full">
        <div className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-[#333] pb-4">
          Interview Log • {interviewDate || 'Unknown time'}
        </div>
        
        {conversation.map((msg, idx) => {
          const isAi = msg.speaker === 'edda';
          return (
            <div key={idx} className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'}`}>
              <div className={`flex max-w-[90%] md:max-w-[75%] gap-3 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black mt-auto mb-1
                  ${isAi ? 'bg-[#ffa116]/20 text-[#ffa116] border border-[#ffa116]/30 shadow-[0_0_10px_rgba(255,161,22,0.2)]' : 'bg-[#333] text-gray-300 border border-[#444]'}`}
                >
                  {isAi ? 'AI' : initial}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed relative ${
                  isAi 
                    ? 'bg-[#282828] text-gray-300 border border-[#333] rounded-bl-sm shadow-lg' 
                    : 'bg-gradient-to-br from-[#ffa116] to-[#ffb03a] text-[#1a1a1a] font-medium rounded-br-sm shadow-xl shadow-[#ffa116]/20'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const content = (
    <div className={`flex-grow relative overflow-auto p-6 bg-[#1a1a1a] ${inline ? 'h-full w-full' : ''}`}>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="w-8 h-8 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin mb-4"></div>
          Loading transcript...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-full text-red-400">
          <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      ) : (
        renderChat(transcript)
      )}
    </div>
  );

  if (inline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#282828] border border-[#333] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#333] bg-[#222] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ffa116]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#ffa116]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">Interview Transcript</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">AI Skill Verification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#444] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CONTENT */}
        {content}
      </div>
    </div>
  );
}
