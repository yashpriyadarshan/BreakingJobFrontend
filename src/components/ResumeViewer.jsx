import React from 'react';

/**
 * Modal-style resume viewer.
 * All URLs are now relative (going through Vite's proxy), which:
 *  - Eliminates CORS (same origin)
 *  - Rewrites Content-Disposition: attachment → inline (configured in vite.config.js)
 * So the browser renders the PDF in the iframe instead of downloading it.
 *
 * Props: url (string), onClose (function)
 */
export default function ResumeViewer({ url, onClose }) {
  if (!url) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#282828] border border-[#333] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#333] bg-[#222] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#ffa116]/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#ffa116]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">Resume Viewer</h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Document Preview</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#ffa116] text-[#1a1a1a] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ffb03a] transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-[#333] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#444] transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* PDF CONTENT — iframe loads through Vite proxy which sets Content-Disposition: inline */}
        <div className="flex-grow relative overflow-hidden" style={{ background: '#525659' }}>
          <iframe
            src={url}
            title="Resume"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}
