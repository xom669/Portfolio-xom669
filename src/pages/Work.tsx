/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

export default function Work() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        
        if (data) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-16 relative">
      <header className="relative text-center flex flex-col items-center justify-center py-12">
        <motion.div 
          initial={{ scale: 0, rotate: 12 }}
          animate={{ scale: 1, rotate: 12 }}
          className="absolute -top-10 -left-10 w-32 h-32 bg-secondary-container starburst flex items-center justify-center comic-border rotate-12 z-20 hover:scale-110 transition-transform"
        >
          <span className="font-black text-2xl -rotate-12 italic uppercase">BOOM!</span>
        </motion.div>
        
        <h1 className="font-black text-4xl md:text-6xl uppercase bg-primary text-white inline-block px-8 py-4 comic-border -rotate-2 relative z-10">
          SELECTED WORKS
        </h1>
        
        <p className="max-w-2xl bg-surface px-6 py-4 comic-border rotate-1 mt-8">
          A collection of recent visual explorations, digital chaos, and creative problem solving. Built with ink, caffeine, and brutalism.
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin comic-border" />
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
          {projects.length === 0 ? (
            <div className="col-span-12 text-center py-20 comic-border bg-surface">
              <h2 className="font-black text-2xl uppercase">No projects found in the sketchbook yet!</h2>
              <p className="mt-2">Check back soon or add some content in the admin panel.</p>
            </div>
          ) : (
            projects.map((project, idx) => (
              <article 
                key={project.id || project.title}
                className={`
                  comic-border bg-background flex flex-col relative group overflow-hidden
                  ${project.size === 'large' ? 'md:col-span-8' : 
                    project.size === 'tall' ? 'md:col-span-4 md:row-span-2' : 
                    project.size === 'wide' ? 'md:col-span-8' : 'md:col-span-4'}
                  ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}
                  hover:rotate-0 transition-all
                `}
              >
                {project.category && (
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container starburst flex items-center justify-center comic-border rotate-[25deg] z-20 group-hover:scale-125 group-hover:rotate-45 transition-all">
                    <span className="font-bold text-white -rotate-[25deg]">{project.category}</span>
                  </div>
                )}
                
                <div className={`
                  w-full overflow-hidden border-b-4 border-on-background relative
                  ${project.size === 'tall' ? 'h-96 md:h-full' : 'h-64 md:h-96'}
                `}>
                  <img 
                    src={project.image_url || project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover filter contrast-125 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-halftone-pattern opacity-30 mix-blend-multiply pointer-events-none" />
                </div>

                <div className="p-6 bg-background">
                  <h2 className="font-black text-3xl uppercase underline decoration-secondary decoration-4 mb-2">
                    {project.title}
                  </h2>
                  <p className="opacity-80 line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </article>
            ))
          )}
        </section>
      )}

      {/* Floating Action Button */}
      <a 
        href="mailto:dipanjanbaidya2007@gmail.com"
        className="fixed bottom-8 right-8 z-50 bg-primary text-white w-16 h-16 rounded-full comic-border flex items-center justify-center hover:scale-110 transition-all group shadow-[4px_4px_0px_0px_#1b1b1c]"
      >
         <Mail className="group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
}
