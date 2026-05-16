/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Project, Profile, Skill } from '../types';
import { 
  LayoutDashboard, 
  Palette, 
  CloudUpload, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  PlusCircle, 
  Link as LinkIcon, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Save,
  User,
  Image as ImageIcon,
  Sword
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'projects' | 'settings' | 'skills';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const defaultSkills: any[] = [
    { name: 'Adobe Photoshop', category: 'Graphic Design', enabled: true, order: 1 },
    { name: 'Adobe Illustrator', category: 'Graphic Design', enabled: true, order: 2 },
    { name: 'Adobe After Effects', category: 'Graphic Design', enabled: true, order: 3 },
    { name: 'Adobe Premiere Pro', category: 'Graphic Design', enabled: true, order: 4 },
    { name: 'Adobe Lightroom', category: 'Graphic Design', enabled: true, order: 5 },
    { name: 'Figma', category: 'Graphic Design', enabled: true, order: 6 },
    { name: 'Canva', category: 'Graphic Design', enabled: true, order: 7 },
    
    { name: 'JavaScript', category: 'Coding Languages', enabled: true, order: 8 },
    { name: 'Python', category: 'Coding Languages', enabled: true, order: 9 },
    { name: 'C++', category: 'Coding Languages', enabled: true, order: 10 },
    { name: 'CSS3', category: 'Coding Languages', enabled: true, order: 11 },
    { name: 'HTML5', category: 'Coding Languages', enabled: true, order: 12 },
    { name: 'TypeScript', category: 'Coding Languages', enabled: true, order: 13 },
    
    { name: 'HTML5', category: 'Web Development', enabled: true, order: 14 },
    { name: 'CSS3', category: 'Web Development', enabled: true, order: 15 },
    { name: 'JavaScript', category: 'Web Development', enabled: true, order: 16 },
    { name: 'React.js', category: 'Web Development', enabled: true, order: 17 },
    { name: 'Next.js', category: 'Web Development', enabled: true, order: 18 },
    { name: 'Tailwind CSS', category: 'Web Development', enabled: true, order: 19 },
    { name: 'Node.js', category: 'Web Development', enabled: true, order: 20 },
    { name: 'Express.js', category: 'Web Development', enabled: true, order: 21 },
    { name: 'MongoDB', category: 'Web Development', enabled: true, order: 22 },
    { name: 'Firebase', category: 'Web Development', enabled: true, order: 23 },
    { name: 'Git & GitHub', category: 'Web Development', enabled: true, order: 24 },
    { name: 'Vercel', category: 'Web Development', enabled: true, order: 25 },
  ];
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image_url: '',
    status: 'published' as const,
    link_url: '',
    size: 'square' as any
  });

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    pfp_url: '',
    instagram: '',
    twitter: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        fetchInitialData(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchInitialData = async (userId: string) => {
    setLoading(true);
    await Promise.all([
      fetchProjects(),
      fetchProfile(userId),
      fetchSkills()
    ]);
    setLoading(false);
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) setProjects(data);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from('skills').select('*').order('order', { ascending: true });
      if (error) throw error;
      if (data) setSkills(data);
    } catch (err) {
      console.error('Failed to fetch skills', err);
    }
  };

  const handleSyncSkills = async () => {
    if (!confirm('This will populate your skills list with defaults. Existing skills with same names will be ignored. Continue?')) return;
    setLoading(true);
    try {
      // For each default skill, check if it exists, if not insert
      for (const skill of defaultSkills) {
        const exists = skills.find(s => s.name === skill.name);
        if (!exists) {
          await supabase.from('skills').insert([skill]);
        }
      }
      await fetchSkills();
      alert('Skills synchronized!');
    } catch (err: any) {
      alert('Sync failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('skills').update({ enabled: !currentStatus }).eq('id', id);
      if (error) throw error;
      fetchSkills();
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    }
  };
  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        setProfile(data);
        setProfileForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          pfp_url: data.pfp_url || '',
          instagram: data.social_links?.instagram || '',
          twitter: data.social_links?.twitter || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Constructing payload explicitly. 
      // We omit 'size' and 'link_url' because they may be missing from your Supabase table.
      // Run the SQL provided in the chat to add these columns, then you can uncomment them here.
      const projectData: any = { 
        title: newProject.title, 
        description: newProject.description, 
        image_url: newProject.image_url, 
        status: newProject.status,
        created_at: new Date().toISOString() 
      };

      // if (newProject.link_url) projectData.link_url = newProject.link_url;
      // projectData.size = newProject.size;

      const { error } = await supabase.from('projects').insert([projectData]);
      if (error) throw error;
      
      setIsAdding(false);
      setNewProject({ title: '', description: '', image_url: '', status: 'published', link_url: '', size: 'square' });
      fetchProjects();
      alert('Project added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this panel?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user) {
        alert('Authentication lost. Please log in again.');
        return;
      }
      
      const profileData: any = {
        id: user.id,
        full_name: profileForm.full_name,
        bio: profileForm.bio,
        pfp_url: profileForm.pfp_url,
        social_links: {
          instagram: profileForm.instagram,
          twitter: profileForm.twitter,
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('profiles').upsert(profileData);
      if (error) throw error;
      alert('Profile updated successfully!');
      fetchProfile(user.id);
    } catch (err: any) {
      alert('Profile update failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-halftone min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex h-screen w-72 flex-col fixed left-0 top-0 bg-surface border-r-4 border-on-background shadow-[6px_0px_0px_0px_rgba(27,27,28,1)] gap-6 p-8 z-40">
        <div className="mb-8">
          <h1 className="font-black text-3xl text-primary uppercase leading-tight">Studio<br />Guardian</h1>
          <p className="font-bold text-xs opacity-50 mt-2 tracking-widest uppercase">Member ID: {user?.email?.split('@')[0]}</p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white font-bold uppercase py-4 px-6 comic-border active:translate-x-[4px] active:translate-y-[4px] active:shadow-none mb-6 shadow-[4px_4px_0px_0px_rgba(27,27,28,1)]"
        >
          New Project
        </button>

        <nav className="flex-1 flex flex-col gap-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "flex items-center gap-4 p-3 font-bold transition-all",
              activeTab === 'dashboard' ? "bg-secondary-container comic-border -rotate-1" : "hover:text-primary"
            )}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('projects')}
            className={cn(
              "flex items-center gap-4 p-3 font-bold transition-all",
              activeTab === 'projects' ? "bg-secondary-container comic-border rotate-1" : "hover:text-primary"
            )}
          >
            <Palette size={20} /> Sketchbook
          </button>
          <button 
            onClick={() => setActiveTab('skills')}
            className={cn(
              "flex items-center gap-4 p-3 font-bold transition-all",
              activeTab === 'skills' ? "bg-secondary-container comic-border rotate-1" : "hover:text-primary"
            )}
          >
            <Sword size={20} /> Armory (Skills)
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center gap-4 p-3 font-bold transition-all",
              activeTab === 'settings' ? "bg-secondary-container comic-border -rotate-1" : "hover:text-primary"
            )}
          >
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t-4 border-on-background border-dashed">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 p-8 md:p-12 pb-24">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background p-8 comic-border rotate-[-0.5deg]">
              <h2 className="font-black text-5xl uppercase italic tracking-tighter">Mission Status</h2>
              <p className="mt-2 border-l-4 border-primary pl-4 font-bold">Analytics for your creative empire.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Live Panels', value: projects.filter(p => p.status === 'published').length, color: 'bg-primary-container' },
                { label: 'Drafts', value: projects.filter(p => p.status === 'draft').length, color: 'bg-secondary-container' },
                { label: 'Studio Age', value: '19 Days', color: 'bg-tertiary-container' },
              ].map((stat, i) => (
                <div key={i} className={cn("p-8 comic-border flex flex-col", stat.color, i % 2 === 0 ? 'rotate-1' : '-rotate-1')}>
                  <span className="font-black text-xs uppercase opacity-60">{stat.label}</span>
                  <span className="font-black text-6xl mt-2">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-surface p-12 comic-border flex items-center justify-between gap-8">
              <div className="space-y-4">
                <h3 className="font-black text-3xl uppercase">Quick Deploy</h3>
                <p className="font-medium opacity-70">Ready to drop a new piece? The audience is waiting for your next transmission.</p>
                <button onClick={() => setIsAdding(true)} className="bg-on-background text-white px-8 py-4 font-black uppercase comic-border">Execute Upload</button>
              </div>
              <div className="hidden lg:block w-48 h-48 bg-primary/20 rounded-full border-4 border-dashed border-primary animate-pulse" />
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background p-8 comic-border flex flex-col md:flex-row justify-between items-start md:items-end gap-6 rotate-[-0.5deg]">
              <div>
                <h2 className="font-black text-5xl uppercase tracking-tighter">Sketchbook Panels</h2>
                <p className="max-w-xl mt-2 border-l-4 border-primary pl-4 font-bold">Manage your active sketchbook panels. Real-time sync with Supabase enabled.</p>
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="bg-primary text-white font-bold uppercase py-4 px-8 comic-border hover:bg-primary/90 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rotate-[1deg] flex items-center gap-2"
              >
                <PlusCircle size={20} /> New Content
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {projects.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-surface comic-border">
                  <h3 className="font-black text-2xl uppercase">No projects found. Start by creating one!</h3>
                </div>
              ) : (
                projects.map((project) => (
                  <article key={project.id} className="bg-background comic-border flex flex-col group hover:-translate-y-1 transition-all">
                    <div className="h-48 border-b-4 border-on-background relative overflow-hidden bg-surface-variant">
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all"
                      />
                      <div className={cn(
                        "absolute top-2 right-2 font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(27,27,28,1)] uppercase text-xs rotate-[-3deg]",
                        project.status === 'published' ? "bg-secondary-container" : "bg-background"
                      )}>
                        {project.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col gap-4">
                      <div>
                        <h3 className="font-black text-2xl uppercase truncate">{project.title}</h3>
                        <p className="text-sm opacity-70 line-clamp-2">{project.description}</p>
                      </div>
                      
                      <div className="mt-auto flex gap-2">
                        <button className="flex-1 bg-surface border-4 border-on-background py-2 font-bold hover:bg-secondary-container transition-colors flex items-center justify-center gap-2">
                          <Edit3 size={16} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="w-12 bg-background border-4 border-on-background flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background p-8 comic-border flex flex-col md:flex-row justify-between items-start md:items-end gap-6 rotate-[-0.5deg]">
              <div>
                <h2 className="font-black text-5xl uppercase tracking-tighter">Professional Armory</h2>
                <p className="max-w-xl mt-2 border-l-4 border-primary pl-4 font-bold">In the brutal world of creativity, these are your weapons. Enable or disable them for the frontend.</p>
              </div>
              <button 
                onClick={handleSyncSkills}
                className="bg-secondary-container text-on-background font-bold uppercase py-4 px-8 comic-border hover:bg-secondary active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rotate-[1deg] flex items-center gap-2"
              >
                Sync Defaults
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['Graphic Design', 'Coding Languages', 'Web Development'].map((category) => (
                <div key={category} className="bg-background comic-border p-6 space-y-6">
                  <h3 className="font-black text-2xl uppercase border-b-4 border-on-background pb-2 text-primary">{category}</h3>
                  <div className="space-y-4">
                    {skills.filter(s => s.category === category).map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-surface comic-border shadow-[4px_4px_0px_0px_rgba(27,27,28,1)]">
                        <span className="font-bold uppercase text-sm">{skill.name}</span>
                        <button 
                          onClick={() => toggleSkill(skill.id, skill.enabled)}
                          className={cn(
                            "w-12 h-6 flex items-center p-1 rounded-full bg-surface border-2 border-on-background transition-colors",
                            skill.enabled ? "bg-primary" : "bg-on-background/20"
                          )}
                        >
                          <div className={cn(
                            "w-3 h-3 rounded-full bg-white transition-all transform",
                            skill.enabled ? "translate-x-6" : "translate-x-0"
                          )} />
                        </button>
                      </div>
                    ))}
                    {skills.filter(s => s.category === category).length === 0 && (
                      <p className="text-sm italic opacity-50 uppercase font-bold">No skills in this category.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-background p-8 comic-border rotate-[0.5deg]">
              <h2 className="font-black text-5xl uppercase tracking-tighter">Studio Identity</h2>
              <p className="mt-2 border-l-4 border-primary pl-4 font-bold">Customize your public persona and portfolio background data.</p>
            </div>

            <form onSubmit={handleUpdateProfile} className="bg-surface p-8 md:p-12 comic-border space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Profile Pic Preview */}
                <div className="space-y-4">
                  <span className="block font-black uppercase text-xs tracking-widest text-on-background/60">Current Vizor</span>
                  <div className="w-full aspect-square bg-background comic-border rounded-full overflow-hidden relative border-8 border-white p-2">
                    <img 
                      src={profileForm.pfp_url || 'https://via.placeholder.com/400'} 
                      alt="PFP Preview" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex gap-2 p-2 bg-on-background/5 rounded-xl">
                    <ImageIcon size={14} className="opacity-50" />
                    <span className="text-[10px] uppercase font-bold opacity-50 overflow-hidden truncate">{profileForm.pfp_url}</span>
                  </div>
                </div>

                {/* Info Fields */}
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="block font-black uppercase text-sm">Artist Name</label>
                    <input 
                      type="text"
                      value={profileForm.full_name}
                      onChange={e => setProfileForm({...profileForm, full_name: e.target.value})}
                      className="w-full bg-background border-4 border-on-background p-4 font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)]"
                      placeholder="Your Public Alias"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-black uppercase text-sm">PFP URL / Upload</label>
                    <div className="flex flex-col gap-4">
                      <input 
                        type="url"
                        value={profileForm.pfp_url}
                        onChange={e => setProfileForm({...profileForm, pfp_url: e.target.value})}
                        className="w-full bg-background border-4 border-on-background p-4 font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)]"
                        placeholder="Direct image link"
                      />
                      <div className="relative">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert('File too large! Keep it under 2MB for local storage.');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setProfileForm({...profileForm, pfp_url: reader.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="w-full bg-tertiary-container border-4 border-dashed border-on-background p-4 font-black text-center uppercase hover:bg-tertiary transition-colors">
                          Or Drop/Select Local File
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-black uppercase text-sm">Bio / Origin Story</label>
                <textarea 
                  value={profileForm.bio}
                  onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                  className="w-full h-40 bg-background border-4 border-on-background p-4 font-bold outline-none focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] resize-none"
                  placeholder="Tell the world who you are..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block font-black uppercase text-sm">Instagram</label>
                  <input 
                    type="text"
                    value={profileForm.instagram}
                    onChange={e => setProfileForm({...profileForm, instagram: e.target.value})}
                    className="w-full bg-background border-4 border-on-background p-4 font-bold outline-none"
                    placeholder="@username"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-black uppercase text-sm">Twitter/X</label>
                  <input 
                    type="text"
                    value={profileForm.twitter}
                    onChange={e => setProfileForm({...profileForm, twitter: e.target.value})}
                    className="w-full bg-background border-4 border-on-background p-4 font-bold outline-none"
                    placeholder="@username"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-primary text-white font-black uppercase py-4 px-12 comic-border hover:bg-primary/90 flex items-center justify-center gap-3 transition-all active:translate-y-1 shadow-[8px_8px_0px_0px_rgba(27,27,28,1)]"
              >
                <Save size={20} /> {loading ? 'Saving Transmission...' : 'Update Identity'}
              </button>
            </form>
          </div>
        )}

        {/* MODAL: ADD PROJECT */}
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm">
            <div className="bg-background comic-border w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(27,27,28,1)]">
              <h3 className="font-black text-3xl uppercase mb-6 flex items-center gap-3">
                <CloudUpload className="text-primary" /> Create New Panel
              </h3>
              <form onSubmit={handleAddProject} className="space-y-6">
                <div>
                  <label className="block font-bold uppercase text-sm mb-2 text-on-background">Project Title</label>
                  <input 
                    required
                    type="text" 
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-surface border-4 border-on-background p-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none"
                    placeholder="E.g. Neon Streets"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2 text-on-background">Description</label>
                  <textarea 
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-surface border-4 border-on-background p-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none h-32"
                    placeholder="What's the story behind this one?"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2 text-on-background">Image URL / Upload</label>
                  <div className="flex flex-col gap-4">
                    <input 
                      required
                      type="url" 
                      value={newProject.image_url}
                      onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
                      className="w-full bg-surface border-4 border-on-background p-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none"
                      placeholder="https://..."
                    />
                    <div className="relative">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('File too large! Keep it under 2MB.');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProject({...newProject, image_url: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="w-full bg-secondary-container border-4 border-dashed border-on-background p-4 font-black text-center uppercase hover:bg-secondary transition-colors">
                        Drop / Select Panel Image
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2 text-on-background">Destination URL (Optional)</label>
                  <input 
                    type="url" 
                    value={newProject.link_url}
                    onChange={(e) => setNewProject({...newProject, link_url: e.target.value})}
                    className="w-full bg-surface border-4 border-on-background p-4 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none"
                    placeholder="https://behance.net/..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2 text-on-background">Panel Size</label>
                    <select 
                      value={newProject.size}
                      onChange={(e) => setNewProject({...newProject, size: e.target.value as any})}
                      className="w-full bg-surface border-4 border-on-background p-4 font-bold outline-none"
                    >
                      <option value="square">Standard Square</option>
                      <option value="large">Big Banner (Wide)</option>
                      <option value="tall">Tall Comic Panel</option>
                      <option value="wide">Full Width</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2 text-on-background">Status</label>
                    <select 
                      value={newProject.status}
                      onChange={(e) => setNewProject({...newProject, status: e.target.value as any})}
                      className="w-full bg-surface border-4 border-on-background p-4 font-bold outline-none"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-primary text-white font-black uppercase py-4 comic-border hover:bg-primary/90 disabled:opacity-50 transition-all hover:-translate-y-1 shadow-[6px_6px_0px_0px_rgba(27,27,28,1)]"
                  >
                    {loading ? 'Synthesizing...' : 'Upload Transmission'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="bg-background text-on-background font-bold uppercase py-4 px-8 comic-border hover:bg-surface transition-all"
                  >
                    Abort
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
