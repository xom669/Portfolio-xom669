/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import { safeGetItem } from '../lib/cache';

export default function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;

      // Check cache first
      const cached = safeGetItem('projects_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as Project[];
          const found = parsed.find(p => p.id === id);
          if (found) {
            if (found.status === 'published') {
              setProject(found);
              setLoading(false);
            } else {
              navigate('/work');
              return;
            }
          }
        } catch (e) {
          console.error('Failed to parse cached project', e);
        }
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .single();
        
        if (data) {
          setProject(data);
        } else {
          navigate('/work');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        navigate('/work');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-halftone flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin comic-border" />
      </div>
    );
  }

  if (!project) return null;

  const allImages = [project.image_url, ...(project.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-halftone p-8 md:p-12">
      <Helmet>
        <title>{`${project.title} | Dipanjan Baidya Portfolio`}</title>
        <meta name="description" content={project.description} />
        <meta property="og:title" content={`${project.title} | Dipanjan Baidya`} />
        <meta property="og:description" content={project.description} />
        <meta property="og:image" content={project.image_url} />
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-12">
        <Link 
          to="/work" 
          className="inline-flex items-center gap-2 bg-surface p-4 comic-border font-black uppercase hover:bg-primary-container transition-all hover:-translate-x-1"
        >
          <ArrowLeft size={20} /> Back to Sketchbook
        </Link>

        <header className="bg-background p-8 comic-border rotate-[-0.5deg] space-y-4">
          <h1 className="font-black text-5xl md:text-7xl uppercase italic tracking-tighter decoration-secondary decoration-8 underline">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-4">
             {project.category && (
               <span className="bg-primary text-white px-4 py-1 font-bold comic-border rotate-1">
                 {project.category}
               </span>
             )}
             <span className="bg-secondary-container px-4 py-1 font-bold comic-border -rotate-1">
               {allImages.length} PHOTOS
             </span>
          </div>
          <p className="text-xl max-w-3xl font-medium opacity-90 border-l-8 border-primary pl-6 py-2 bg-surface/50">
            {project.description}
          </p>
          
          {project.link_url && (
            <a 
              href={project.link_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-on-background text-white px-6 py-3 font-black uppercase comic-border mt-4 hover:scale-105 transition-transform"
            >
              <ExternalLink size={20} /> Visit Project
            </a>
          )}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allImages.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-background p-4 comic-border relative group overflow-hidden ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}
            >
              <div className="w-full aspect-[4/3] md:aspect-auto md:min-h-[400px] overflow-hidden comic-border">
                <img 
                  src={img} 
                  alt={`${project.title} - ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-halftone-pattern opacity-10 mix-blend-multiply pointer-events-none" />
              <div className="mt-4 flex items-center justify-between">
                <span className="font-black uppercase text-sm opacity-50">Panel #{idx + 1}</span>
                <ImageIcon size={16} className="opacity-30" />
              </div>
            </motion.div>
          ))}
        </section>

        <footer className="py-20 text-center">
           <div className="bg-surface p-12 comic-border rotate-1 inline-block">
             <h3 className="font-black text-3xl uppercase mb-4">WANT TO SEE MORE?</h3>
             <p className="mb-8 font-bold opacity-70">Check out the other panels in my sketchbook.</p>
             <Link to="/work" className="bg-primary text-white px-12 py-4 font-black uppercase comic-border hover:shadow-none hover:translate-x-1 hover:translate-y-1 shadow-[6px_6px_0px_0px_rgba(27,27,28,1)] transition-all inline-block">
               Return to Gallery
             </Link>
           </div>
        </footer>
      </div>
    </div>
  );
}
