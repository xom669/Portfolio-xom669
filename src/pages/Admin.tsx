/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import { LayoutDashboard, Palette, CloudUpload, Settings, HelpCircle, LogOut, Search, PlusCircle, Link as LinkIcon, Edit3 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image_url: '',
    status: 'published' as const,
    link_url: '',
    size: 'square'
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
        fetchProjects();
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch from Supabase', err);
    } finally {
      setLoading(false);
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
      const { error } = await supabase.from('projects').insert([
        { 
          ...newProject, 
          created_at: new Date().toISOString() 
        }
      ]);
      
      if (error) throw error;
      
      setIsAdding(false);
      setNewProject({
        title: '',
        description: '',
        image_url: '',
        status: 'published',
        link_url: '',
        size: 'square'
      });
      fetchProjects();
      alert('Project added successfully!');
    } catch (err: any) {
      console.error('Error adding project:', err);
      alert('Failed to add project. Make sure your Supabase RLS policies allow inserts.\n\nError: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-halftone min-h-screen">
      {/* Sidebar (same as before) */}
      <aside className="hidden md:flex h-screen w-72 flex-col fixed left-0 top-0 bg-surface border-r-4 border-on-background shadow-[6px_0px_0px_0px_rgba(27,27,28,1)] gap-6 p-8 z-40">
        <div className="mb-8">
          <h1 className="font-black text-3xl text-primary uppercase">Studio Admin</h1>
          <p className="font-bold text-xs opacity-50 mt-2">V1.0.5</p>
        </div>

        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white font-bold uppercase py-4 px-6 comic-border active:translate-x-[4px] active:translate-y-[4px] active:shadow-none mb-6"
        >
          New Project
        </button>

        <nav className="flex-1 flex flex-col gap-2">
          <button className="flex items-center gap-4 p-3 font-bold hover:text-primary transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="flex items-center gap-4 bg-secondary-container text-on-background border-4 border-on-background rounded-xl p-3 -rotate-1 shadow-[3px_3px_0px_0px_rgba(27,27,28,1)] font-bold">
            <Palette size={20} /> Projects
          </button>
          <button className="flex items-center gap-4 p-3 font-bold hover:text-primary transition-colors">
            <CloudUpload size={20} /> Uploads
          </button>
          <button className="flex items-center gap-4 p-3 font-bold hover:text-primary transition-colors">
            <Settings size={20} /> Settings
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4 border-t-4 border-on-background border-dashed">
          <button className="flex items-center gap-4 p-3 font-bold hover:text-primary transition-colors">
            <HelpCircle size={20} /> Help
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 p-3 font-bold hover:text-primary transition-colors"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 p-8 md:p-12">
        {/* Header Section */}
        <div className="bg-background p-8 comic-border flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 rotate-[-0.5deg]">
          <div>
            <h2 className="font-black text-5xl uppercase tracking-tighter">Projects</h2>
            <p className="max-w-xl mt-2 border-l-4 border-primary pl-4">Manage your active sketchbook panels. Real-time sync with Supabase enabled.</p>
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-primary text-white font-bold uppercase py-4 px-8 comic-border hover:bg-primary/90 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none rotate-[1deg] flex items-center gap-2"
          >
            <PlusCircle size={20} /> New Content
          </button>
        </div>

        {/* Add Project Form Modal */}
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-background/50 backdrop-blur-sm">
            <div className="bg-background comic-border w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
              <h3 className="font-black text-3xl uppercase mb-6">Create New Panel</h3>
              <form onSubmit={handleAddProject} className="space-y-6">
                <div>
                  <label className="block font-bold uppercase text-sm mb-2 text-on-background">Project Title</label>
                  <input 
                    required
                    type="text" 
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-surface border-4 border-on-background p-3 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none"
                    placeholder="E.g. Neon Streets"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2 text-on-background">Description</label>
                  <textarea 
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full bg-surface border-4 border-on-background p-3 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none h-32"
                    placeholder="What's the story behind this one?"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-sm mb-2 text-on-background">Image URL</label>
                  <input 
                    required
                    type="url" 
                    value={newProject.image_url}
                    onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
                    className="w-full bg-surface border-4 border-on-background p-3 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase text-sm mb-2 text-on-background">Panel Size</label>
                    <select 
                      value={newProject.size}
                      onChange={(e) => setNewProject({...newProject, size: e.target.value})}
                      className="w-full bg-surface border-4 border-on-background p-3 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none"
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
                      className="w-full bg-surface border-4 border-on-background p-3 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none"
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
                    className="flex-1 bg-primary text-white font-bold uppercase py-4 comic-border hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add to Sketchbook'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="bg-background text-on-background font-bold uppercase py-4 px-8 comic-border hover:bg-surface"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toolbar (same as before) */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-background" size={20} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full bg-background border-4 border-on-background py-3 pl-12 pr-4 font-bold shadow-[3px_3px_0px_0px_rgba(27,27,28,1)] focus:outline-none focus:border-secondary-container"
            />
          </div>
          <div className="flex gap-2 font-bold">
            <button className="bg-secondary-container px-4 py-2 border-4 border-on-background shadow-[3px_3px_0px_0px_rgba(27,27,28,1)]">All</button>
            <button className="bg-background px-4 py-2 border-4 border-on-background hover:bg-surface transition-colors">Published</button>
            <button className="bg-background px-4 py-2 border-4 border-on-background hover:bg-surface transition-colors">Drafts</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article key={project.id} className="bg-background comic-border flex flex-col group hover:-translate-y-1 transition-all">
              <div className="h-48 border-b-4 border-on-background relative overflow-hidden bg-surface-variant">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                />
                <div className={cn(
                  "absolute top-2 right-2 font-bold px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(27,27,28,1)] uppercase text-xs rotate-[-3deg]",
                  project.status === 'published' ? "bg-secondary-container" : "bg-background"
                )}>
                  {project.status.toUpperCase()}
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-black text-2xl uppercase mb-1 truncate">{project.title}</h3>
                <p className="text-sm opacity-70 line-clamp-2 mb-4">{project.description}</p>
                <div className="mt-auto space-y-3">
                  <div className="bg-surface p-2 border-2 border-black flex items-center justify-between gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 truncate opacity-70 font-mono text-xs">
                      <LinkIcon size={14} />
                      <span className="truncate">{project.link_url || 'No link set'}</span>
                    </div>
                    <button className="bg-background border-2 border-black px-3 py-1 font-bold text-xs hover:bg-secondary-container shadow-[2px_2px_0px_0px_rgba(27,27,28,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none whitespace-nowrap">
                      Edit Link
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
