import React, { useState, useEffect } from 'react';
import { updateUserProfile, uploadResume, uploadProfilePicture, addSkill, deleteSkill, addExperience, deleteExperience, addProject, deleteProject } from '../services/userService';
import { updateCompany, uploadLogo } from '../services/companyService';
import { deleteUserProfile } from '../services/userService';
import { deleteCompany } from '../services/companyService';

export default function Settings({ role, setIsAuthenticated, setActiveTab, user, setUser, refetchUser }) {
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('Account');
  const [formData, setFormData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Sync form data when user prop changes
  useEffect(() => {
    if (user) {
      const base = {
        FirstName: user.firstName || user.FirstName || '',
        LastName: user.lastName || user.LastName || '',
        bio: user.bio || '', location: user.location || '',
        phone: user.phone || '', profilePicture: user.profilePicture || '',
        resumeUrl: user.resumeUrl || '', name: user.name || '',
        address: user.address || '', description: user.description || '',
        website: user.website || ''
      };
      setFormData(base);
      setInitialData(base);
    }
  }, [user]);

  const broadcastUpdate = (data) => {
    setUser(data);
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: data }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true); setSuccessMsg(''); setError(null);
    try {
      const changedData = {};
      const accountFields = role === 'FOR RECRUITERS' ? ['name', 'phone'] : ['FirstName', 'LastName', 'phone'];
      const profileFields = role === 'FOR RECRUITERS' ? ['description', 'website', 'address', 'location'] : ['bio', 'location'];
      const relevantFields = activeSection === 'Account' ? accountFields : (activeSection === 'Profile Settings' ? profileFields : []);

      relevantFields.forEach(key => {
        if (formData[key] !== initialData[key]) {
          changedData[key] = formData[key] === '' ? null : formData[key];
        }
      });

      if (Object.keys(changedData).length === 0) {
        setSuccessMsg('No changes detected.'); setSaving(false); return;
      }

      let updated;
      if (role === 'FOR RECRUITERS') {
        updated = await updateCompany({ ...changedData, id: user.id });
      } else {
        updated = await updateUserProfile(user.id, changedData);
      }
      broadcastUpdate(updated);
      setSuccessMsg('Settings updated successfully!');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleFileUpload = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size >= 5 * 1024 * 1024) {
      alert('File size must be strictly smaller than 5MB.');
      setError('File size must be strictly smaller than 5MB.');
      e.target.value = '';
      return;
    }

    setSaving(true); setSuccessMsg(''); setError(null);
    try {
      if (type === 'avatar') {
        if (role === 'FOR RECRUITERS') {
          await uploadLogo(user.id, file);
        } else {
          await uploadProfilePicture(user.id, file);
        }
      } else if (type === 'resume') {
        await uploadResume(user.id, file);
      }
      // Re-fetch to get the public URL the backend generates
      await refetchUser();
      setSuccessMsg(`${type === 'avatar' ? 'Picture' : 'Resume'} uploaded successfully!`);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  // --- Skill/Experience/Project handlers (candidate only) ---
  const handleAddSkill = async (e) => {
    e.preventDefault();
    const name = e.target.skillName.value;
    if (!name) return;
    setSaving(true);
    try { const updated = await addSkill(user.id, { name }); broadcastUpdate(updated); e.target.reset(); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDeleteSkill = async (skillId) => {
    setSaving(true);
    try {
      await deleteSkill(user.id, skillId);
      setUser(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skillId) }));
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleAddExperience = async (e) => {
    e.preventDefault();
    const data = { company: e.target.company.value, role: e.target.role.value, description: e.target.description.value, startDate: e.target.startDate.value, endDate: e.target.endDate.value };
    setSaving(true);
    try { const updated = await addExperience(user.id, data); broadcastUpdate(updated); e.target.reset(); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDeleteExperience = async (expId) => {
    setSaving(true);
    try {
      await deleteExperience(user.id, expId);
      setUser(prev => ({ ...prev, experiences: prev.experiences.filter(x => x.id !== expId) }));
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const data = { title: e.target.title.value, description: e.target.description.value, githubLink: e.target.githubLink.value, liveLink: e.target.liveLink.value };
    setSaving(true);
    try { const updated = await addProject(user.id, data); broadcastUpdate(updated); e.target.reset(); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDeleteProject = async (projId) => {
    setSaving(true);
    try {
      await deleteProject(user.id, projId);
      setUser(prev => ({ ...prev, projects: prev.projects.filter(x => x.id !== projId) }));
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        if (role === 'FOR RECRUITERS') { await deleteCompany(user.id); }
        else { await deleteUserProfile(user.id); }
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setActiveTab(null);
      } catch (e) { alert(e.message); }
    }
  };

  if (!user) return <div className="p-8 text-center text-gray-400">Loading settings...</div>;

  const avatarUrl = role === 'FOR RECRUITERS' ? user.logoUrl : user.profilePicture;
  const fallbackInitial = role === 'FOR RECRUITERS' ? (user.name?.charAt(0) || 'R') : (user.firstName?.charAt(0) || 'U');

  const sidebarItems = [
    { name: 'Account', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Profile Settings', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Privacy', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  return (
    <div className="flex-grow flex bg-[#1a1a1a] text-[#eff1f6] min-h-[calc(100vh-56px)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#333] flex flex-col p-4 gap-2 shrink-0 sticky top-14 h-[calc(100vh-56px)]">
        <h2 className="text-xl font-bold px-4 mb-6">Settings</h2>
        {sidebarItems.map(item => (
          <button key={item.name} onClick={() => { setActiveSection(item.name); setSuccessMsg(''); setError(null); }}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${activeSection === item.name ? 'bg-[#333] text-white' : 'text-gray-400 hover:bg-[#282828] hover:text-white'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-4xl overflow-y-auto">
        <div className="flex flex-col gap-8 pb-20">
          
          {activeSection === 'Account' && (
            <section>
              <h3 className="text-lg font-bold mb-4">Account Information</h3>
              <div className="bg-[#282828] border border-[#333] rounded-xl overflow-hidden divide-y divide-[#333]">
                {role === 'FOR RECRUITERS' ? (
                  <SettingItem label="Company Name" name="name" value={formData.name} onChange={handleInputChange} />
                ) : (
                  <>
                    <SettingItem label="First Name" name="FirstName" value={formData.FirstName} onChange={handleInputChange} />
                    <SettingItem label="Last Name" name="LastName" value={formData.LastName} onChange={handleInputChange} />
                  </>
                )}
                <SettingItem label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                <div className="px-6 py-4 flex flex-col gap-1 bg-[#1a1a1a]/30">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{user.email}</span>
                    <span className="text-[10px] bg-[#333] text-gray-500 px-2 py-0.5 rounded uppercase font-bold">Read Only</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex flex-col">
                  {error && activeSection === 'Account' && <p className="text-red-400 text-sm mb-2">{error}</p>}
                  {successMsg && activeSection === 'Account' && <p className="text-green-400 text-sm mb-2">{successMsg}</p>}
                </div>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#ffa116] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#ffb03a] transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Account Changes'}
                </button>
              </div>

              <section className="mt-12 pt-8 border-t border-[#333]">
                <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button onClick={handleDeleteAccount} className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-bold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  Delete Account
                </button>
              </section>
            </section>
          )}

          {activeSection === 'Profile Settings' && (
            <div className="flex flex-col gap-10">
              <section>
                <h3 className="text-lg font-bold mb-4">Identity & Assets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Avatar Card */}
                  <div className="bg-[#282828] border border-[#333] rounded-xl p-6 flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-[#1a1a1a] border-2 border-[#333] overflow-hidden relative group flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-bold text-[#ffa116]">{fallbackInitial}</span>
                      )}
                      <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">Change</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload('avatar', e)} />
                      </label>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-bold">{role === 'FOR RECRUITERS' ? 'Company Logo' : 'Profile Picture'}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Square ratio recommended</p>
                    </div>
                  </div>

                  {/* Resume Card (Candidate Only) */}
                  {role === 'FOR CANDIDATE' && (
                    <div className="bg-[#282828] border border-[#333] rounded-xl p-6 flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#ffa116]/10 flex items-center justify-center text-[#ffa116]">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <div className="text-center">
                        <h4 className="text-sm font-bold">Resume / CV</h4>
                        <label className="text-[11px] text-[#ffa116] hover:underline cursor-pointer font-bold mt-1 block">
                          {user.resumeUrl ? 'Update Document' : 'Upload Resume'}
                          <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload('resume', e)} />
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#282828] border border-[#333] rounded-xl overflow-hidden divide-y divide-[#333]">
                  {role === 'FOR RECRUITERS' && (
                    <>
                      <SettingItem label="Website URL" name="website" value={formData.website} onChange={handleInputChange} />
                      <SettingItem label="Company Address" name="address" value={formData.address} onChange={handleInputChange} />
                    </>
                  )}
                  <SettingItem label="Current Location" name="location" value={formData.location} onChange={handleInputChange} />
                  <div className="px-6 py-4 flex flex-col gap-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{role === 'FOR RECRUITERS' ? 'About the Company' : 'Professional Bio'}</label>
                    <textarea name={role === 'FOR RECRUITERS' ? 'description' : 'bio'} value={role === 'FOR RECRUITERS' ? formData.description : formData.bio} onChange={handleInputChange}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg p-3 text-sm focus:outline-none focus:border-[#ffa116] min-h-[120px]" placeholder="Share your story..." />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex flex-col">
                    {error && activeSection === 'Profile Settings' && <p className="text-red-400 text-sm mb-2">{error}</p>}
                    {successMsg && activeSection === 'Profile Settings' && <p className="text-green-400 text-sm mb-2">{successMsg}</p>}
                  </div>
                  <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#ffa116] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#ffb03a] transition-colors disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </section>

              {role === 'FOR CANDIDATE' && (
                <>
                  {/* Skills */}
                  <section>
                    <h3 className="text-lg font-bold mb-4">Skills</h3>
                    <div className="bg-[#282828] border border-[#333] rounded-xl p-6">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {user.skills?.map(skill => (
                          <div key={skill.id} className="bg-[#1a1a1a] border border-[#333] px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                            {skill.name}
                            <button onClick={() => handleDeleteSkill(skill.id)} className="text-red-500 hover:text-red-400">&times;</button>
                          </div>
                        ))}
                        {(!user.skills || user.skills.length === 0) && <p className="text-sm text-gray-500">No skills added yet.</p>}
                      </div>
                      <form onSubmit={handleAddSkill} className="flex gap-2">
                        <input name="skillName" type="text" placeholder="Add a skill (e.g. Java, React)..." className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                        <button type="submit" className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors text-sm font-bold">Add</button>
                      </form>
                    </div>
                  </section>

                  {/* Experience */}
                  <section>
                    <h3 className="text-lg font-bold mb-4">Experience</h3>
                    <div className="flex flex-col gap-4 mb-6">
                      {user.experiences?.map(exp => (
                        <div key={exp.id} className="bg-[#282828] border border-[#333] rounded-xl p-5 relative">
                          <button onClick={() => handleDeleteExperience(exp.id)} className="absolute top-4 right-4 text-red-500 text-xs font-bold hover:underline">Remove</button>
                          <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                          <p className="text-xs text-[#ffa116] mt-0.5">{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</p>
                          <p className="text-sm text-gray-400 mt-3 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddExperience} className="bg-[#282828] border border-[#333] rounded-xl p-6 flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Add New Experience</h4>
                      <input name="company" type="text" placeholder="Company Name" required className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                      <input name="role" type="text" placeholder="Job Title" required className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                      <div className="grid grid-cols-2 gap-3">
                        <input name="startDate" type="text" placeholder="Start Date (2020-01)" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                        <input name="endDate" type="text" placeholder="End Date (Optional)" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                      </div>
                      <textarea name="description" placeholder="Responsibilities & achievements..." className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116] min-h-[80px]" />
                      <button type="submit" className="self-end px-6 py-2 bg-[#ffa116] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#ffb03a] transition-colors mt-2">Add Experience</button>
                    </form>
                  </section>

                  {/* Projects */}
                  <section>
                    <h3 className="text-lg font-bold mb-4">Projects</h3>
                    <div className="flex flex-col gap-4 mb-6">
                      {user.projects?.map(proj => (
                        <div key={proj.id} className="bg-[#282828] border border-[#333] rounded-xl p-5 relative">
                          <button onClick={() => handleDeleteProject(proj.id)} className="absolute top-4 right-4 text-red-500 text-xs font-bold hover:underline">Remove</button>
                          <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                          <p className="text-sm text-gray-400 mt-2 leading-relaxed">{proj.description}</p>
                          <div className="flex gap-4 mt-4">
                            {proj.githubLink && <a href={proj.githubLink} target="_blank" rel="noreferrer" className="text-xs text-[#ffa116] font-bold hover:underline">GitHub</a>}
                            {proj.liveLink && <a href={proj.liveLink} target="_blank" rel="noreferrer" className="text-xs text-blue-400 font-bold hover:underline">Live Demo</a>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleAddProject} className="bg-[#282828] border border-[#333] rounded-xl p-6 flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Add New Project</h4>
                      <input name="title" type="text" placeholder="Project Title" required className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                      <textarea name="description" placeholder="Short description of the project..." className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116] min-h-[80px]" />
                      <div className="grid grid-cols-2 gap-3">
                        <input name="githubLink" type="url" placeholder="GitHub Repository URL" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                        <input name="liveLink" type="url" placeholder="Live Site URL" className="bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ffa116]" />
                      </div>
                      <button type="submit" className="self-end px-6 py-2 bg-[#ffa116] text-[#1a1a1a] font-bold rounded-lg hover:bg-[#ffb03a] transition-colors mt-2">Add Project</button>
                    </form>
                  </section>
                </>
              )}
            </div>
          )}

          {(activeSection !== 'Account' && activeSection !== 'Profile Settings') && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <h3 className="text-lg font-bold text-white">Privacy & Security</h3>
              <p className="text-sm mt-1">This section is coming soon.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function SettingItem({ label, name, value, onChange }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between group hover:bg-[#333]/30 transition-colors">
      <div className="flex flex-col gap-1 flex-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
        <input name={name} value={value} onChange={onChange} className="bg-transparent border-none p-0 text-sm text-gray-200 focus:outline-none focus:ring-0 w-full" placeholder={`Enter ${label.toLowerCase()}...`} />
      </div>
      <svg className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
    </div>
  );
}
