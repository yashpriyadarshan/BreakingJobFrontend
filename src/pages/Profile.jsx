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

export default function Profile({ role, setActiveTab }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('Experience');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const url = role === 'FOR RECRUITERS'
          ? 'http://localhost:8082/api/v1/company'
          : 'http://localhost:8081/api/v1/user';

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
  }, [role]);

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
          FirstName: formData.FirstName || formData.firstName || '',
          LastName: formData.LastName || formData.lastName || '',
          bio: formData.bio || '',
          location: formData.location || '',
          phone: formData.phone || '',
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

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = isRecruiter ? 'http://localhost:8082' : 'http://localhost:8081';
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

  const isRecruiter = role === 'FOR RECRUITERS';
  const displayName = isRecruiter ? user?.name : `${user?.firstName || ''} ${user?.lastName || ''}`;

  return (
    <main className="flex-grow w-full bg-[#1a1a1a] text-[#eff1f6] p-4 lg:p-10">
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
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-all">
                  <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-[9px] font-black text-white uppercase tracking-wider">Change</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUploadAvatar} />
                </label>
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
             <div className="flex items-center gap-4 bg-[#333]/50 p-4 rounded-2xl border border-[#444]/50 group hover:border-[#ffa116]/30 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#ffa116]/10 flex items-center justify-center text-[#ffa116]">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div className="flex-grow min-w-0">
                   <div className="text-[11px] font-black text-white truncate">{user?.firstName}_Resume.pdf</div>
                   <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Updated 2d ago</div>
                </div>
             </div>
             <label className="mt-4 w-full py-3 rounded-xl bg-[#333] text-white text-[11px] font-black uppercase tracking-widest text-center block cursor-pointer hover:bg-[#444] transition-all border border-[#444]">
                Update Resume
                <input type="file" className="hidden" onChange={handleUploadResume} />
             </label>
          </div>

        </aside>

        {/* RIGHT COLUMN: TABS & DETAILS */}
        <div className="flex-grow flex flex-col gap-8">
          
          {/* NAVIGATION TABS */}
          <div className="bg-[#282828] border border-[#333] rounded-3xl p-1.5 flex gap-1 overflow-x-auto scrollbar-hide">
             {['Experience', 'Skills', 'Projects', 'Education', 'Settings'].map(tab => (
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
                   <button onClick={() => setIsEditing(!isEditing)} className="text-xs font-black text-[#ffa116] uppercase tracking-widest hover:underline transition-all">
                      {isEditing ? 'Cancel' : '+ Add New'}
                   </button>
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
                         <button onClick={() => handleDeleteSkill(skill.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                      </div>
                   ))}
                </div>

                <form onSubmit={handleAddSkill} className="max-w-md bg-[#333]/30 border border-[#444]/50 p-8 rounded-3xl">
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Master a new skill</h3>
                   <div className="flex gap-3">
                      <input name="skillName" placeholder="e.g. Docker, Figma, AI Engineering" className="flex-grow bg-[#1a1a1a] border border-[#333] p-4 rounded-xl text-sm outline-none focus:border-[#ffa116] transition-all" />
                      <button type="submit" className="bg-white text-black px-6 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Add</button>
                   </div>
                </form>
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

            {/* FALLBACK FOR OTHER TABS */}
            {(activeSubTab === 'Projects' || activeSubTab === 'Education') && (
               <div className="py-20 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                  <div className="w-20 h-20 bg-[#333] rounded-3xl flex items-center justify-center mb-6 text-[#ffa116] border border-[#444]">
                     <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{activeSubTab} coming soon</h3>
                  <p className="text-gray-400">We are fine-tuning this section to help you showcase your best work.</p>
               </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}
