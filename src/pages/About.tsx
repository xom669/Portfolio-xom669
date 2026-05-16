/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Code, Brush, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from('profiles').select('*').limit(1).single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  const bio = profile?.bio || "Based in Kolkata, I'm a 19-year-old designer fueled by Adobe Photoshop, Illustrator, and clean code. I specialize in branding, UI concepts, and custom web projects that help startups stand out.";
  const pfp = profile?.pfp_url || 'https://artifact.stately.ai/b798ab49-233f-41e4-ae83-f8c553e1aa7a/input_file_0.png';

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-12">
      {/* Header Panel */}
      <motion.header 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="comic-border bg-tertiary text-white p-8 md:p-12 -rotate-1 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/10 starburst opacity-20 pointer-events-none group-hover:animate-[spin_60s_linear_infinite]" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="absolute -top-4 -left-4 md:-top-8 md:-left-8 bg-secondary-container text-on-background font-black text-4xl p-4 starburst rotate-12 z-20">
            BAM!
          </div>
          
          <h1 className="font-black text-5xl md:text-7xl uppercase mb-4 relative drop-shadow-[4px_4px_0px_#1b1b1c]">
            Origin Story
            <span className="absolute -bottom-2 right-0 font-bold text-sm bg-primary text-white px-2 py-1 rotate-3 border-2 border-black">ISSUE #1</span>
          </h1>
          
          <p className="max-w-2xl bg-background text-on-background p-6 comic-border rotate-1 mt-4">
            {bio}
          </p>
        </div>
      </motion.header>

      {/* Comic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Panel 1: The Spark */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="col-span-1 md:col-span-7 comic-border bg-secondary-container p-6 relative flex flex-col justify-between group"
        >
          <div className="absolute -top-3 right-4 bg-background text-on-background font-bold px-3 py-1 border-2 border-black rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">THE SPARK...</div>
          <h2 className="font-black text-3xl md:text-5xl uppercase mb-4 leading-tight">A Humble Beginning</h2>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <p className="flex-1 bg-background p-4 border-l-4 border-black italic font-medium">
              I bridge the gap between aesthetics and sales. With experience in marketing, I don't just design websites—I build tools that help businesses and creators establish a strong online presence.
            </p>
            <div className="w-full md:w-1/2 aspect-square bg-background border-4 border-black relative overflow-hidden group-hover:scale-105 transition-transform">
              <img 
                src={pfp} 
                className="object-cover w-full h-full filter contrast-125 grayscale hover:grayscale-0 transition-all duration-500"
                alt="Profile"
              />
              <div className="absolute inset-0 bg-halftone-pattern opacity-40 mix-blend-multiply pointer-events-none" />
            </div>
          </div>
        </motion.section>

        {/* Panel 2: The Training */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="col-span-1 md:col-span-5 comic-border bg-tertiary-container p-6 relative overflow-hidden rotate-1 group"
        >
          <div className="absolute inset-0 halftone-bg opacity-20 pointer-events-none" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="bg-primary text-white font-bold px-3 py-1 inline-block border-2 border-black -rotate-2 w-max mb-4">YEARS OF LEARNING</div>
            <h2 className="font-black text-3xl md:text-5xl uppercase mb-4 leading-tight">Mastering<br/>Modern Design</h2>
            <p className="bg-background p-4 border-4 border-black flex-grow group-hover:scale-105 transition-transform">
              From Adobe Photoshop to Illustrator, I've spent thousands of hours perfecting the balance between high-end graphics and user-focused web interfaces.
            </p>
            <div className="mt-4 flex justify-end">
              <a href="mailto:dipanjanbaidya2007@gmail.com" className="bg-secondary-container text-on-background font-black text-xl px-4 py-2 border-4 border-black rotate-6 hover:scale-125 transition-transform cursor-pointer">HIRE ME!</a>
            </div>
          </div>
        </motion.section>

        {/* Panel 3: The Conflict */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="col-span-1 md:col-span-12 comic-border bg-primary text-white p-8 md:p-12 relative flex flex-col md:flex-row items-center gap-8 -rotate-1 group"
        >
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black text-3xl px-6 py-2 border-4 border-black starburst z-20"
          >
            KABOOM!
          </motion.div>
          <div className="w-full md:w-1/3 aspect-square bg-background border-4 border-black relative overflow-hidden group-hover:scale-105 transition-transform">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMGGYER4Nqj_Xl1zs9t2yyAVEwLHnrLZlIUSA99SAS0MPW4n_964IQAiJsNGAgbYP5Ekkopag3pHxGkHBsXhGURySNTfuSocM8Lt2bLTC4vl1Ej3WawnAY-LybdMUAuyp4RrqLOUHCHfuO1V7odY6dVnS_kwr88gvRi0CgJjg6I1i7cNLbBll-QX8k7kpgYwcRKMjKLZSPO3avBM2cCz3coRnq1GC2xd0Gu7wmrobmvuaDvJNhtv3Ezg3xMueogVQnfMK4jhd5Hmkg" 
              className="object-cover w-full h-full mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"
              alt="Explosion"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-black text-5xl md:text-7xl uppercase mb-6 drop-shadow-[4px_4px_0px_#1b1b1c]">The Impact Goal</h2>
            <p className="bg-background text-on-background p-6 border-4 border-black text-lg group-hover:-rotate-1 transition-transform">
              My mission is to help startups and creators bridge the gap between their ideas and reality. By continuously improving my skills in design and tech, I forge products that don't just look good, but solve real problems.
            </p>
          </div>
        </motion.section>

        {/* Panel 4: Power-Ups */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="col-span-1 md:col-span-12 mt-8"
        >
          <h2 className="font-black text-3xl uppercase mb-6 inline-block bg-secondary-container text-on-background px-6 py-2 border-4 border-black shadow-[6px_6px_0px_0px_#1b1b1c] -rotate-2">Current Power-Ups</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Visual Design', icon: <Brush />, color: 'bg-primary' },
              { name: 'Frontend Dev', icon: <Code />, color: 'bg-tertiary' },
              { name: 'User Research', icon: <Search />, color: 'bg-secondary' },
              { name: 'Prototyping', icon: <Zap />, color: 'bg-on-background' }
            ].map((skill, i) => (
              <div key={skill.name} className={`bg-background comic-border p-6 flex flex-col items-center justify-center text-center gap-3 hover:-translate-y-2 transition-transform ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                <div className={`${skill.color} text-white p-3 rounded-full comic-border`}>
                  {skill.icon}
                </div>
                <span className="font-bold uppercase text-sm">{skill.name}</span>
                <div className="w-full h-4 border-2 border-black bg-background relative overflow-hidden mt-2">
                  <div className={`absolute top-0 left-0 h-full ${skill.color} halftone-bg`} style={{ width: `${90 - i * 5}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
