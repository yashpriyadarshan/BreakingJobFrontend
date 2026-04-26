import React, { useState, useEffect } from 'react';
import { updateCompany, uploadLogo } from '../services/companyService';
import { 
  updateUserProfile,
  addSkill, deleteSkill,
  addExperience, deleteExperience,
  addProject, deleteProject,
  uploadResume,
  uploadProfilePicture
} from '../services/userService';
import ResumeViewer from '../components/ResumeViewer';
import TranscriptViewer from '../components/TranscriptViewer';
import EvaluationViewer from '../components/EvaluationViewer';
import FeedbackViewer from '../components/FeedbackViewer';

export default function Profile({ role, setActiveTab, user, setUser, readOnly = false, onClose }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!user);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('Experience');
  const [resumeViewerUrl, setResumeViewerUrl] = useState(null);

  useEffect(() => {
    if (!user) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('Not authenticated');

          const url = role === 'FOR RECRUITERS'
            ? '/api/v1/company'
            : '/api/v1/user';

          const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!response.ok) throw new Error('Failed to fetch profile details');
          const data = await response.json();
          setUser(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [role, user, setUser]);

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (role === 'FOR RECRUITERS') {
        const updated = await updateCompany(formData);
        setUser(updated);
      } else {
        const payload = {
          FirstName: formData.FirstName || formData.firstName || user?.firstName || '',
          LastName: formData.LastName || formData.lastName || user?.lastName || '',
          bio: formData.bio || user?.bio || '',
          location: formData.location || user?.location || '',
          phone: formData.phone || user?.phone || '',
        };
        const updated = await updateUserProfile(user.id, payload);
        setUser(updated);
      }
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const name = e.target.skillName.value;
    if (!name) return;
    try {
      const updated = await addSkill(user.id, { name });
      setUser(updated);
      e.target.reset();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkill(user.id, skillId);
      setUser(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skillId) }));
    } catch (err) { alert(err.message); }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    const data = {
      company: e.target.company.value,
      role: e.target.role.value,
      description: e.target.description.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
    };
    try {
      const updated = await addExperience(user.id, data);
      setUser(updated);
      e.target.reset();
    } catch (err) { alert(err.message); }
  };

  const handleDeleteExperience = async (expId) => {
    try {
      await deleteExperience(user.id, expId);
      setUser(prev => ({ ...prev, experiences: prev.experiences.filter(x => x.id !== expId) }));
    } catch (err) { alert(err.message); }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
      githubLink: e.target.githubLink.value || null,
      liveLink: e.target.liveLink.value || null,
    };
    try {
      const updated = await addProject(user.id, data);
      setUser(updated);
      e.target.reset();
      setIsEditing(false);
    } catch (err) { alert(err.message); }
  };

  const handleDeleteProject = async (projId) => {
    try {
      await deleteProject(user.id, projId);
      setUser(prev => ({ ...prev, projects: prev.projects.filter(x => x.id !== projId) }));
    } catch (err) { alert(err.message); }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const updated = await uploadResume(user.id, file);
      setUser(updated);
      alert('Resume uploaded successfully!');
    } catch (err) { alert(err.message); }
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setSaving(true);
      if (role === 'FOR RECRUITERS') {
        const updated = await uploadLogo(user.id, file);
        setUser(updated);
      } else {
        const updated = await uploadProfilePicture(user.id, file);
        setUser(updated);
      }
      alert('Profile picture updated successfully!');
    } catch (err) {
      alert('Failed to upload profile picture: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const isRecruiter = role === 'FOR RECRUITERS';

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = '';
    return `${baseUrl}${url}`;
  };

  if (loading) return (
    <main className="flex-grow flex items-center justify-center bg-[#1a1a1a]">
      <div className="w-10 h-10 border-4 border-[#ffa116] border-t-transparent rounded-full animate-spin"></div>
    </main>
  );

  if (error) return (
    <main className="flex-grow flex items-center justify-center bg-[#1a1a1a] p-6 text-[#eff1f6]">
      <div className="bg-[#282828] border border-red-500/30 p-8 rounded-2xl text-center max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Error loading profile</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#333] rounded-xl font-bold">Try Again</button>
      </div>
    </main>
  );

  // isRecruiter already declared above getImageUrl
  const displayName = isRecruiter ? user?.name : `${user?.firstName || ''} ${user?.lastName || ''}`;

  const availableTabs = ['Experience', 'Skills', 'Projects', 'Education'];
  if (!readOnly) availableTabs.push('Settings');
  if (user?.skillVerified) {
    if (readOnly) availableTabs.push('AI Analysis');
    if (!readOnly) availableTabs.push('AI Feedback');
    availableTabs.push('Transcript');
  }

  return (
    <main className="flex-grow w-full bg-[#1a1a1a] text-[#eff1f6] p-4 lg:p-10 relative">
      {readOnly && onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 lg:top-10 lg:right-10 z-50 bg-[#333] hover:bg-[#444] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg border border-[#444] flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Applicants
        </button>
      )}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: PROFILE CARD & STATS */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          
          {/* PROFILE CARD */}
          <div className="bg-[#282828] border border-[#333] rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="h-24 bg-gradient-to-br from-[#ffa116] to-[#ffb03a] opacity-80"></div>
            <div className="px-6 pb-8 text-center relative">
              <div className="w-24 h-24 rounded-2xl bg-[#1a1a1a] border-4 border-[#282828] shadow-xl mx-auto -mt-12 flex items-center justify-center text-3xl font-black text-[#ffa116] overflow-hidden mb-4 relative group/avatar">
                {user?.profilePicture ? (
                  <img src={getImageUrl(user.profilePicture)} alt="" className="w-full h-full object-cover" />
                ) : (
                  displayName?.charAt(0)
                )}
                
                {/* UPLOAD OVERLAY */}
                {!readOnly && (
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-all">
                    <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">Change</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUploadAvatar} />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">{displayName}</h2>
              <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest">{isRecruiter ? 'Recruiter' : 'Software Engineer'}</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="px-3 py-1 bg-[#2cbb5d]/10 text-[#2cbb5d] text-[10px] font-black rounded-full border border-[#2cbb5d]/20 uppercase">Available</span>
                <span className="px-3 py-1 bg-[#333] text-gray-400 text-[10px] font-black rounded-full border border-[#444] uppercase">{user?.location || 'San Francisco'}</span>
              </div>
              <div className="mt-8 pt-6 border-t border-[#333] grid grid-cols-2 gap-4">
                <div>
                   <div className="text-lg font-black text-white">24</div>
                   <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Jobs Applied</div>
                </div>
                <div>
                   <div className="text-lg font-black text-white">8</div>
                   <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Interviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* PROFILE STRENGTH */}
          <div className="bg-[#282828] border border-[#333] rounded-3xl p-6">
             <div className="flex justify-between items-end mb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Profile Strength</h3>
                <span className="text-xs font-black text-[#ffa116]">85%</span>
             </div>
             <div className="w-full h-1.5 bg-[#333] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#ffa116] to-[#ffb03a] w-[85%] rounded-full shadow-[0_0_10px_rgba(255,161,22,0.3)]"></div>
             </div>
             <p className="text-[10px] text-gray-500 mt-4 leading-relaxed font-bold">Add your <span className="text-white">GitHub profile</span> to reach 100% and get noticed by top recruiters.</p>
          </div>

          {/* RESUME SECTION */}
          <div className="bg-[#282828] border border-[#333] rounded-3xl p-6">
             <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Resume</h3>
             {user?.resumeUrl ? (
               <>
                 <div 
                   onClick={() => setResumeViewerUrl(getImageUrl(user.resumeUrl))}
                   className="flex items-center gap-4 bg-[#333]/50 p-4 rounded-2xl border border-[#444]/50 group hover:border-[#ffa116]/30 transition-all cursor-pointer"
                 >
                   <div className="w-10 h-10 rounded-xl bg-[#ffa116]/10 flex items-center justify-center text-[#ffa116]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   </div>
                   <div className="flex-grow min-w-0">
                      <div className="text-[11px] font-black text-white truncate">{user?.firstName || user?.name}_Resume.pdf</div>
                      <div className="text-[9px] font-bold text-[#ffa116] uppercase tracking-widest mt-0.5 group-hover:underline">Click to view</div>
                   </div>
                   <svg className="w-4 h-4 text-gray-500 group-hover:text-[#ffa116] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 </div>
               </>
             ) : (
               <div className="flex items-center gap-4 bg-[#333]/50 p-4 rounded-2xl border border-[#444]/50">
                 <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 </div>
                 <div className="text-[11px] font-bold text-gray-500">No resume uploaded yet</div>
               </div>
             )}
             {!readOnly && (
               <label className="mt-4 w-full py-3 rounded-xl bg-[#333] text-white text-[11px] font-black uppercase tracking-widest text-center block cursor-pointer hover:bg-[#444] transition-all border border-[#444]">
                  {user?.resumeUrl ? 'Update Resume' : 'Upload Resume'}
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUploadResume} />
               </label>
             )}
          </div>

        </aside>

        {/* RIGHT COLUMN: TABS & DETAILS */}
        <div className="flex-grow flex flex-col gap-8">
          
          {/* NAVIGATION TABS */}
          <div className="bg-[#282828] border border-[#333] rounded-3xl p-1.5 flex gap-1 overflow-x-auto scrollbar-hide">
             {availableTabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === tab ? 'bg-[#333] text-[#ffa116] shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  {tab}
                </button>
             ))}
          </div>

          {/* TAB CONTENT */}
          <div className="bg-[#282828] border border-[#333] rounded-[32px] p-8 lg:p-10 shadow-2xl relative overflow-hidden min-h-[500px]">
            
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffa116]/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            {/* EXPERIENCE TAB */}
            {activeSubTab === 'Experience' && (
              <div className="relative animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-2xl font-black text-white tracking-tight">Work Experience</h2>
                   {!readOnly && (
                     <button onClick={() => setIsEditing(!isEditing)} className="text-xs font-black text-[#ffa116] uppercase tracking-widest hover:underline transition-all">
                        {isEditing ? 'Cancel' : '+ Add New'}
                     </button>
                   )}
                </div>

                <div className="flex flex-col gap-10">
                   {user?.experiences?.map((exp, idx) => (
                      <div key={exp.id} className="relative pl-10 group">
                         {/* Timeline Line */}
                         {idx !== user.experiences.length - 1 && <div className="absolute left-[19px] top-10 bottom-[-40px] w-0.5 bg-[#333]"></div>}
                         {/* Timeline Dot */}
                         <div className="absolute left-0 top-1.5 w-10 h-10 rounded-xl bg-[#333] border border-[#444] flex items-center justify-center group-hover:border-[#ffa116]/50 transition-all z-10">
                            <div className="w-2 h-2 rounded-full bg-[#ffa116]"></div>
                         </div>
                         
                         <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                               <h4 className="text-lg font-black text-white group-hover:text-[#ffa116] transition-colors">{exp.role}</h4>
                               <div className="flex items-center gap-3 mt-1">
                                  <span className="text-sm font-bold text-gray-300">{exp.company}</span>
                                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{exp.startDate} — {exp.endDate || 'Present'}</span>
                               </div>
                               <p className="text-sm text-gray-400 mt-4 leading-relaxed max-w-2xl">{exp.description}</p>
                            </div>
                            {isEditing && (
                               <button onClick={() => handleDeleteExperience(exp.id)} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">Delete</button>
                            )}
                         </div>
                      </div>
                   ))}

                   {isEditing && (
                      <form onSubmit={handleAddExperience} className="bg-[#333]/30 border border-[#444]/50 p-8 rounded-3xl flex flex-col gap-6 mt-4">
                         <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">New Experience</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="role" placeholder="Your Role" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                            <input name="company" placeholder="Company Name" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                            <input name="startDate" placeholder="Start (Oct 2021)" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                            <input name="endDate" placeholder="End (Present)" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                         </div>
                         <textarea name="description" placeholder="What did you achieve? Use bullet points for best results." rows="4" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all resize-none"></textarea>
                         <button type="submit" className="bg-[#ffa116] text-[#1a1a1a] py-4 rounded-xl text-xs font-black uppercase tracking-widest self-end px-10 hover:bg-[#ffb03a] transition-all shadow-xl shadow-[#ffa116]/10">Save Experience</button>
                      </form>
                   )}

                   {(!user?.experiences || user.experiences.length === 0) && !isEditing && (
                      <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                         <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                         <p className="text-sm font-bold text-gray-500">No work experience added yet.</p>
                      </div>
                   )}
                </div>
              </div>
            )}

            {/* SKILLS TAB */}
            {activeSubTab === 'Skills' && (
              <div className="relative animate-in fade-in duration-500">
                <h2 className="text-2xl font-black text-white tracking-tight mb-10">Technical Arsenal</h2>
                
                <div className="flex flex-wrap gap-3 mb-12">
                   {user?.skills?.map(skill => (
                      <div key={skill.id} className="bg-[#333] border border-[#444] px-5 py-3 rounded-2xl flex items-center gap-3 hover:border-[#ffa116]/50 transition-all group">
                         <span className="text-sm font-bold text-gray-200">{skill.name}</span>
                         {!readOnly && (
                           <button onClick={() => handleDeleteSkill(skill.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                         )}
                      </div>
                   ))}
                </div>

                {!readOnly && (
                  <form onSubmit={handleAddSkill} className="max-w-md bg-[#333]/30 border border-[#444]/50 p-8 rounded-3xl">
                     <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Master a new skill</h3>
                     <div className="flex gap-3">
                        <input name="skillName" placeholder="e.g. Docker, Figma, AI Engineering" className="flex-grow bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                        <button type="submit" className="bg-white text-black px-6 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Add</button>
                     </div>
                  </form>
                )}
              </div>
            )}

            {/* SETTINGS TAB (REDESIGNED) */}
            {activeSubTab === 'Settings' && (
              <div className="relative animate-in fade-in duration-500">
                <h2 className="text-2xl font-black text-white tracking-tight mb-10">Profile Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                      <input 
                        value={formData.FirstName || user?.firstName || ''} 
                        onChange={(e) => handleInputChange('FirstName', e.target.value)}
                        className="bg-[#333]/50 border border-[#444]/50 p-4 rounded-2xl text-sm text-white focus:border-[#ffa116] outline-none transition-all" 
                      />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                      <input 
                        value={formData.LastName || user?.lastName || ''} 
                        onChange={(e) => handleInputChange('LastName', e.target.value)}
                        className="bg-[#333]/50 border border-[#444]/50 p-4 rounded-2xl text-sm text-white focus:border-[#ffa116] outline-none transition-all" 
                      />
                   </div>
                   <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Bio</label>
                      <textarea 
                        value={formData.bio || user?.bio || ''} 
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows="4"
                        className="bg-[#333]/50 border border-[#444]/50 p-4 rounded-2xl text-sm text-white focus:border-[#ffa116] outline-none transition-all resize-none" 
                      />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Location</label>
                      <input 
                        value={formData.location || user?.location || ''} 
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-[#333]/50 border border-[#444]/50 p-4 rounded-2xl text-sm text-white focus:border-[#ffa116] outline-none transition-all" 
                      />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                      <input 
                        value={formData.phone || user?.phone || ''} 
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-[#333]/50 border border-[#444]/50 p-4 rounded-2xl text-sm text-white focus:border-[#ffa116] outline-none transition-all" 
                      />
                   </div>
                </div>

                <div className="mt-12 flex justify-end">
                   <button 
                     onClick={handleSave}
                     disabled={saving}
                     className="bg-[#ffa116] text-[#1a1a1a] px-12 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[#ffb03a] transition-all shadow-xl shadow-[#ffa116]/10 disabled:opacity-50"
                   >
                     {saving ? 'Updating...' : 'Update Profile'}
                   </button>
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeSubTab === 'Projects' && (
              <div className="relative animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-2xl font-black text-white tracking-tight">Projects</h2>
                   {!readOnly && (
                     <button onClick={() => setIsEditing(!isEditing)} className="text-xs font-black text-[#ffa116] uppercase tracking-widest hover:underline transition-all">
                        {isEditing ? 'Cancel' : '+ Add New'}
                     </button>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {user?.projects?.map(proj => (
                     <div key={proj.id} className="bg-[#333]/30 border border-[#444]/50 rounded-3xl p-8 hover:border-[#ffa116]/30 transition-all group relative">
                       {isEditing && (
                         <button onClick={() => handleDeleteProject(proj.id)} className="absolute top-4 right-4 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors">Delete</button>
                       )}
                       <h4 className="text-lg font-black text-white group-hover:text-[#ffa116] transition-colors">{proj.title}</h4>
                       <p className="text-sm text-gray-400 mt-3 leading-relaxed">{proj.description}</p>
                       <div className="flex gap-4 mt-6">
                         {proj.githubLink && (
                           <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-[10px] font-black text-[#ffa116] uppercase tracking-widest hover:underline flex items-center gap-1.5">
                             <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                             GitHub
                           </a>
                         )}
                         {proj.liveLink && (
                           <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline flex items-center gap-1.5">
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                             Live Demo
                           </a>
                         )}
                       </div>
                     </div>
                   ))}
                </div>

                {isEditing && (
                  <form onSubmit={handleAddProject} className="bg-[#333]/30 border border-[#444]/50 p-8 rounded-3xl flex flex-col gap-6 mt-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">New Project</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input name="title" placeholder="Project Title" required className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                      <input name="githubLink" type="url" placeholder="GitHub URL (optional)" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                    </div>
                    <textarea name="description" placeholder="Describe your project, the problem it solves, and tech used..." rows="4" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all resize-none"></textarea>
                    <input name="liveLink" type="url" placeholder="Live Demo URL (optional)" className="bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                    <button type="submit" className="bg-[#ffa116] text-[#1a1a1a] py-4 rounded-xl text-xs font-black uppercase tracking-widest self-end px-10 hover:bg-[#ffb03a] transition-all shadow-xl shadow-[#ffa116]/10">Save Project</button>
                  </form>
                )}

                {(!user?.projects || user.projects.length === 0) && !isEditing && (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
                     <svg className="w-12 h-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                     <p className="text-sm font-bold text-gray-500">No projects added yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeSubTab === 'Education' && (
               <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-[#333] rounded-3xl flex items-center justify-center mb-6 text-[#ffa116] border border-[#444]">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Education coming soon</h3>
                  <p className="text-gray-400">We are building this section to help you showcase your academic achievements.</p>
               </div>
            )}

            {/* TRANSCRIPT TAB */}
            {activeSubTab === 'Transcript' && (
              <div className="relative animate-in fade-in duration-500 h-full flex flex-col">
                <h2 className="text-2xl font-black text-white tracking-tight mb-6">Interview Transcript</h2>
                <div className="flex-grow bg-[#1a1a1a] border border-[#333] rounded-2xl overflow-hidden min-h-[400px] shadow-inner">
                  <TranscriptViewer userId={user.id} inline={true} />
                </div>
              </div>
            )}

            {/* AI ANALYSIS TAB */}
            {activeSubTab === 'AI Analysis' && (
              <div className="relative animate-in fade-in duration-500 h-full flex flex-col">
                <h2 className="text-2xl font-black text-white tracking-tight mb-6">AI Interview Analysis</h2>
                <EvaluationViewer userId={user.id} />
              </div>
            )}

            {/* AI FEEDBACK TAB */}
            {activeSubTab === 'AI Feedback' && (
              <div className="relative animate-in fade-in duration-500 h-full flex flex-col">
                <h2 className="text-2xl font-black text-white tracking-tight mb-6">AI Interview Feedback</h2>
                <FeedbackViewer userId={user.id} />
              </div>
            )}

          </div>

        </div>

      </div>
      {resumeViewerUrl && <ResumeViewer url={resumeViewerUrl} onClose={() => setResumeViewerUrl(null)} />}
    </main>
  );
}
