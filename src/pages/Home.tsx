/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Star, Instagram, Linkedin, Github, Bomb, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuoteWidget } from '../components/QuoteWidget';
import { supabase } from '../lib/supabase';
import { Profile, Project, Skill } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper component for the decorative cards
const PlayingCard = ({ 
  suit = '♠', 
  value = 'K', 
  isRed = false, 
  className = "", 
  rotation = 12 
}: { 
  suit?: string; 
  value?: string; 
  isRed?: boolean; 
  className?: string; 
  rotation?: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0, rotate: rotation + 10 }}
    whileInView={{ opacity: 1, scale: 1, rotate: rotation }}
    viewport={{ once: true }}
    className={cn(
      "absolute bg-white comic-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-30 flex flex-col p-1 group/card hover:-translate-y-2 transition-transform",
      className
    )}
  >
    <div className={cn(
      "flex flex-col h-full border rounded-sm relative p-1 overflow-hidden",
      isRed ? "border-red-600" : "border-on-background"
    )}>
      <span className={cn("font-bold text-xs leading-none", isRed ? "text-red-600" : "text-on-background")}>{value}</span>
      <span className={cn("text-[8px]", isRed ? "text-red-600" : "text-on-background")}>{suit}</span>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("text-xl font-black", isRed ? "text-red-600" : "text-on-background")}>{value}</span>
      </div>
      <div className="absolute bottom-0 right-0 flex flex-col items-end rotate-180 p-0.5">
        <span className={cn("font-bold text-[8px] leading-none", isRed ? "text-red-600" : "text-on-background")}>{value}</span>
        <span className={cn("text-[6px]", isRed ? "text-red-600" : "text-on-background")}>{suit}</span>
      </div>
      <div className="absolute inset-0 halftone-bg opacity-5 pointer-events-none" />
    </div>
  </motion.div>
);

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isExploding, setIsExploding] = useState(false);
  const [isEverythingGone, setIsEverythingGone] = useState(false);

  const handleBoom = () => {
    setIsExploding(true);
    
    // Step 1: Trigger Explosion
    setTimeout(() => {
      setIsExploding(false);
      setIsEverythingGone(true);
      
      // Step 2: Show "Gone" message and then fix it
      setTimeout(() => {
        setIsEverythingGone(false);
      }, 3000);
    }, 800);
  };

  useEffect(() => {
    // Try to load from cache first for instant UI
    const cachedProfile = localStorage.getItem('profile_cache');
    if (cachedProfile) {
      try {
        setProfile(JSON.parse(cachedProfile));
      } catch (e) {
        console.error('Failed to parse cached profile', e);
      }
    }

    const fetchData = async () => {
      // Fetch the first profile (assuming only one artist/owner)
      const { data: profileData } = await supabase.from('profiles').select('*').limit(1).single();
      if (profileData) {
        setProfile(profileData);
        // Update cache
        localStorage.setItem('profile_cache', JSON.stringify(profileData));
      }

      // Fetch projects for the collage
      const { data: projectsData } = await supabase.from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
      
      if (projectsData) {
        // Shuffle and take random projects
        const shuffled = [...projectsData].sort(() => 0.5 - Math.random());
        setProjects(shuffled.slice(0, 6));
      }

      // Fetch skills
      const { data: skillsData } = await supabase.from('skills')
        .select('*')
        .eq('enabled', true)
        .order('category', { ascending: true })
        .order('order', { ascending: true });
      
      if (skillsData) {
        setSkills(skillsData);
      } else {
        // Fallback or empty state handling is done in render
      }
    };
    fetchData();
  }, []);

  const categories = ['Graphic Design', 'Coding Languages', 'Web Development'] as const;
  const groupedSkills = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  const displayName = profile?.full_name?.split(' ')[0] || 'DIPANJAN';
  const bio = profile?.bio || '19-year-old Graphic & Web Designer based in Kolkata. I combine creativity with functionality to build impactful digital experiences.';
  const pfp = profile?.pfp_url || 'https://artifact.stately.ai/b798ab49-233f-41e4-ae83-f8c553e1aa7a/input_file_0.png';

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-12 relative min-h-screen overflow-x-hidden">
      <Helmet>
        <title>Dipanjan Baidya | Portfolio & Creative Sketchbook</title>
        <meta name="description" content="Explore the creative portfolio of Dipanjan Baidya. A brutalist comic-style sketchbook featuring panels, digital work, and a custom sketchbook CMS." />
        <meta property="og:title" content="Dipanjan Baidya | Portfolio & Creative Sketchbook" />
        <meta property="og:description" content="Explore the creative portfolio of Dipanjan Baidya. A brutalist comic-style sketchbook featuring digital work and creative panels." />
      </Helmet>
      <AnimatePresence>
        {isExploding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 4, 3.5], rotate: [0, 10, -5] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="text-[120px] md:text-[300px] font-black text-white italic drop-shadow-[10px_10px_0px_rgba(0,0,0,1)] uppercase select-none z-10 relative starburst px-20 py-10 bg-red-600 border-[12px] border-black">
                BOOM!
              </div>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={{ 
                    x: (Math.random() - 0.5) * 1000, 
                    y: (Math.random() - 0.5) * 1000,
                    scale: 0,
                    rotate: Math.random() * 360
                  }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className={cn(
                    "absolute top-1/2 left-1/2 w-20 h-20 comic-border rounded-full",
                    i % 3 === 0 ? "bg-yellow-400" : i % 3 === 1 ? "bg-orange-500" : "bg-red-600"
                  )}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEverythingGone && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-on-background flex flex-col items-center justify-center text-center p-8 overflow-hidden"
          >
            <div className="absolute inset-0 halftone-bg opacity-20" />
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative z-10"
            >
              <h2 className="text-white font-black text-2xl md:text-6xl uppercase mb-4 comic-border border-white p-6 inline-block -rotate-2">
                Every thing is gone...
              </h2>
              <div className="flex items-center justify-center gap-2 mt-4 text-primary font-bold text-xl md:text-3xl animate-pulse">
                <span>but we will fix all again</span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="fill-primary" />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("flex flex-col gap-12 transition-all duration-300", (isExploding || isEverythingGone) && "opacity-0 scale-95 blur-xl")}>
      {/* Hero Section */}
      <section className="relative comic-border p-8 md:p-12 rotate-[-1deg] group">
        {/* Glowing Moving Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-fuchsia-600 via-black to-emerald-500 bg-[length:400%_400%] animate-[gradient_15s_ease_infinite] overflow-hidden" />
        
        {/* Glow Overlay */}
        <div className="absolute inset-0 opacity-40 blur-3xl pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-purple-500/20 to-emerald-500/20 animate-pulse" />
        </div>

        <div className="absolute inset-0 halftone-white-bg opacity-30 pointer-events-none overflow-hidden" />
        
        {/* Floating "WOW!" Pop */}
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute -top-6 -left-6 bg-primary text-white font-black text-4xl md:text-5xl italic p-4 comic-border z-10"
        >
          WOW!
        </motion.div>

        {/* Hero Card - King of Spades (Black) */}
        <PlayingCard 
          suit="♠" 
          value="K" 
          rotation={12} 
          className="w-12 h-18 md:w-20 md:h-28 -top-4 -right-4 md:-top-10 md:-right-10" 
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 relative z-20">
          <div className="flex-shrink-0 relative order-1 md:order-2">
            <div className="w-48 h-48 md:w-80 md:h-80 bg-tertiary-container comic-border-primary rounded-full overflow-hidden relative group/avatar hover:shadow-[0_0_50px_-5px_rgba(16,185,129,0.7)] transition-all">
              <img 
                alt="Dipanjan Baidya - Graphic & Web Designer Portfolio Profile" 
                className="w-full h-full object-cover filter contrast-125 group-hover/avatar:scale-105 transition-all duration-500"
                src={pfp} 
                // @ts-ignore - fetchPriority is a valid attribute for performance optimization
                fetchPriority="high"
                loading="eager"
                decoding="sync"
              />
            </div>
            <div className="absolute -inset-2 md:-inset-4 border-2 md:border-4 border-on-background rounded-full border-dashed animate-[spin_10s_linear_infinite] pointer-events-none group-hover:border-primary transition-colors" />
          </div>

          <div className="flex-1 order-2 md:order-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="font-black text-2xl md:text-7xl text-on-background uppercase bg-background inline-block px-4 py-2 md:px-4 md:py-2 comic-border rotate-[1deg] hover:rotate-[0deg] hover:shadow-[0_0_40px_-10px_rgba(192,38,211,0.6)] transition-all overflow-hidden w-auto leading-none decoration-primary decoration-4">
              <motion.span
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="inline-block"
              >
                HI! I'M {displayName}
              </motion.span>
            </h1>
            <p className="text-xl bg-background p-6 comic-border hidden md:block mt-4 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)] transition-all">
              {bio}
            </p>
            <div className="hidden md:flex mt-6">
              <Link to="/work" className="bg-primary text-white font-bold uppercase py-4 px-8 comic-border hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(192,38,211,0.6)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150 flex items-center gap-2 w-fit group/btn">
                <span>Explore My World</span>
                <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 md:hidden relative z-20">
            <p className="text-[10px] md:text-sm bg-background p-3 comic-border mb-4 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.5)] transition-all text-center">
              {bio}
            </p>
            <Link to="/work" className="bg-primary text-white font-bold uppercase py-3 px-6 comic-border text-sm flex items-center justify-center gap-2 w-full group/btn hover:shadow-[0_0_20px_rgba(192,38,211,0.6)] transition-all">
              <span>Explore My World</span>
              <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
            </Link>
        </div>

        {/* Floating "POW!" Pop */}
        <motion.div 
          animate={{ rotate: [15, 5, 15] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute -bottom-8 right-8 bg-tertiary text-white font-black text-3xl md:text-4xl italic p-4 comic-border z-10 hover:scale-110 transition-transform"
        >
          POW!
        </motion.div>
      </section>

      {/* Quote & Game Widget */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="animate-on-scroll"
      >
        <QuoteWidget />
      </motion.section>

      {/* Collage Section (Moved below Daily Inspiration) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="animate-on-scroll relative transition-all"
      >
        {/* Joker Card */}
        <PlayingCard 
          suit="☠️" 
          value="JK" 
          rotation={-15} 
          className="w-10 h-14 md:w-16 md:h-24 -top-8 -left-2 md:-top-12 md:-left-4 z-40" 
        />

        <div className="relative comic-border p-4 md:p-6 overflow-hidden min-h-[300px] group/collage">
          {/* Glowing Moving Gradient Background */}
          <div className="absolute inset-0 bg-linear-to-br from-fuchsia-600 via-black to-emerald-500 bg-[length:400%_400%] animate-[gradient_15s_ease_infinite]" />
          
          {/* Glow Overlay */}
          <div className="absolute inset-0 opacity-50 blur-3xl pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-purple-500/30 to-emerald-500/30 animate-pulse" />
          </div>
  
          <div className="absolute inset-0 halftone-white-bg opacity-40 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 relative z-10">
            <div className="bg-background text-on-background font-bold uppercase p-2 inline-block comic-border rotate-2 w-fit">
              Recent Projects
            </div>
            
            <Link 
              to="/work" 
              className="bg-on-background px-3 py-1 comic-border font-black uppercase group relative transition-all rgb-lava-button w-fit"
            >
              <span className="rgb-text-lava relative z-10 text-sm md:text-base">See More</span>
              <div className="absolute inset-0 bg-on-background" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-10">
            {projects.length > 0 ? (
              projects.map((project, i) => (
                <Link 
                  key={project.id} 
                  to="/work"
                  className="block group/item"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ 
                      scale: 1.05, 
                      rotate: i % 2 === 0 ? 2 : -2, 
                      zIndex: 50,
                      boxShadow: "0 0 30px rgba(192,38,211,0.6)"
                    }}
                    className="aspect-square bg-background comic-border overflow-hidden relative cursor-pointer"
                  >
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-on-background/0 group-hover/item:bg-on-background/20 transition-colors" />
                  </motion.div>
                </Link>
              ))
            ) : (
              // Fallback placeholders if no projects yet
              [...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-background/50 comic-border border-dashed flex items-center justify-center text-on-background/20">
                  <Star size={24} />
                </div>
              ))
            )}
          </div>

        </div>
      </motion.section>

      {/* Bento Grid */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Card 1 */}
        {projects.length > 0 ? (
          <Link to={`/work/${projects[0].id}`} className="col-span-1 md:col-span-2 bg-background comic-border flex flex-col group h-full relative cursor-pointer hover:shadow-[4px_4px_0px_0px_#1b1b1c] transition-all">
            {/* Ace of Hearts */}
            <PlayingCard 
              suit="♥️" 
              value="A" 
              isRed 
              rotation={-8} 
              className="w-8 h-12 md:w-14 md:h-20 -bottom-4 -left-4 md:-bottom-8 md:-left-8" 
            />

            <div className="bg-primary text-white font-bold uppercase p-2 md:p-3 border-b-4 border-on-background flex justify-between items-center text-xs md:text-base">
              <span>Recent Mission</span>
              <Star size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            </div>
            <div className="p-3 md:p-6 flex-grow flex flex-col justify-between">
              <h3 className="font-black text-lg md:text-4xl mb-1 md:mb-4">{projects[0].title}</h3>
              <p className="mb-2 md:mb-6 opacity-80 text-xs md:text-base line-clamp-2">{projects[0].description}</p>
              <div className="w-full h-2 md:h-4 border-2 md:border-4 border-on-background relative overflow-hidden bg-background">
                <div className="absolute top-0 left-0 h-full bg-secondary-container w-3/4 halftone-bg" />
              </div>
            </div>
          </Link>
        ) : (
          <div className="col-span-1 md:col-span-2 bg-background comic-border flex flex-col group h-full relative p-12 items-center justify-center">
            <p className="font-black opacity-20 uppercase">No active missions</p>
          </div>
        )}

        {/* Card 2 */}
        <div className="col-span-1 bg-tertiary/10 comic-border p-3 md:p-6 flex flex-col justify-center items-center text-center rotate-1 hover:rotate-0 transition-all h-full relative">
          <span className="material-symbols-outlined !text-3xl md:!text-6xl text-primary mb-1 md:mb-4 animate-bounce">local_fire_department</span>
          <h3 className="font-black text-base md:text-2xl mb-1 uppercase">Available</h3>
          <a href="mailto:dipanjanbaidya2007@gmail.com" className="inline-block bg-background px-2 py-1 comic-border font-bold uppercase hover:bg-primary hover:text-white transition-colors cursor-pointer text-[10px] md:text-sm">
            Hire
          </a>
        </div>

        {/* Card 4 - Skillset Redesigned */}
        <div className="col-span-1 md:col-span-3 bg-background comic-border p-4 md:p-8 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)] transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="bg-secondary-container text-on-background font-black uppercase p-2 inline-block comic-border rotate-[-2deg] mb-8 text-sm md:text-xl relative z-10">
            Professional Armory
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {categories.map((category) => (
              <div key={category} className="space-y-4">
                <h4 className="font-black text-primary uppercase text-sm md:text-lg border-b-4 border-on-background pb-2 flex justify-between items-center group">
                  {category}
                  <Star size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                </h4>
                <div className="flex flex-wrap gap-2">
                  {groupedSkills[category]?.length > 0 ? (
                    groupedSkills[category].map((skill) => (
                      <motion.div
                        key={skill.id}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="bg-surface-variant px-3 py-1.5 comic-border text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-secondary-container transition-colors cursor-default"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        {skill.name}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-[10px] md:text-xs font-bold opacity-30 uppercase italic py-4">
                      Deploying skills soon...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3 - Gallery Sneak Peek */}
        {projects.length > 1 ? (
          <Link to={`/work/${projects[1].id}`} className="col-span-1 md:col-span-1 bg-on-background text-background comic-border p-0 overflow-hidden relative group h-full cursor-pointer">
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none halftone-bg opacity-50" />
            <img 
              alt="Project Teaser" 
              className="w-full h-full object-cover min-h-[200px] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              src={projects[1].image_url}
            />
            <div className="absolute bottom-4 left-4 z-20 bg-background text-on-background comic-border p-2 font-bold uppercase text-[10px] md:text-xs">
              Sneak Peek
            </div>
          </Link>
        ) : (
          <Link to="/work" className="col-span-1 md:col-span-1 bg-on-background text-background comic-border p-0 overflow-hidden relative group h-full cursor-pointer">
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none halftone-bg opacity-50" />
            <img 
              alt="Abstract Art" 
              className="w-full h-full object-cover min-h-[200px] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnWXhkoo3CjV8qT-_D2I66OdRoOhVIF9PjP-duihc7JPOAsVWGiVZh1Z9S_Z_i7RdPRxClCc8wk9dW0nqrqCfqi2Jbt6PhpXbF87gjGE517ETXnQGJNTKOE3nQB1q4W7rQLkP-NSS_GtdXnaZznaknIcAcRc795-EOtpBEcdS85bg8_RPRAxWoxoesRifWsJhh76bjTyLmjiIB-yfH1QzpQSGuTEiJ8i6jJh5HMXaW0qtE47GzdaMcsZbW6-TZoxxTGGcZF1YhGfVu"
            />
            <div className="absolute bottom-4 left-4 z-20 bg-background text-on-background comic-border p-2 font-bold uppercase text-[10px] md:text-xs">
              Gallery Sneak Peek
            </div>
          </Link>
        )}

        {/* Card 5 - Connect Widget */}
        <div className="col-span-1 md:col-span-2 bg-tertiary text-white comic-border p-4 md:p-8 flex flex-col justify-between group overflow-hidden relative min-h-[250px] hover:shadow-[0_0_50px_rgba(0,88,190,0.6)] transition-all duration-500">
          {/* Ace of Spades */}
          <PlayingCard 
            suit="♠" 
            value="A" 
            rotation={25} 
            className="w-10 h-14 md:w-16 md:h-24 -top-4 -right-4 md:-top-6 md:-right-6" 
          />

          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute inset-0 halftone-white-bg opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="bg-background text-on-background font-black uppercase p-2 inline-block comic-border rotate-[-1deg] mb-4 text-xs md:text-sm">
              Digital Network
            </div>
            <h3 className="font-black text-2xl md:text-5xl uppercase leading-tight mb-6">Let's build<br/>Something Cool!</h3>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-8 relative z-10">
            <a 
              href="https://www.instagram.com/xom669" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 group/link hover:-translate-y-1 transition-transform"
            >
              <div className="bg-background p-2 md:p-3 comic-border text-on-background group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                <Instagram size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="font-black uppercase text-[10px] md:text-xs">Instagram</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/dipanjanbaidya/" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 group/link hover:-translate-y-1 transition-transform"
            >
              <div className="bg-background p-2 md:p-3 comic-border text-on-background group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                <Linkedin size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="font-black uppercase text-[10px] md:text-xs">LinkedIn</span>
            </a>

            <a 
              href="https://github.com/xom669" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-2 group/link hover:-translate-y-1 transition-transform"
            >
              <div className="bg-background p-2 md:p-3 comic-border text-on-background group-hover/link:bg-primary group-hover/link:text-white transition-colors">
                <Github size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="font-black uppercase text-[10px] md:text-xs">GitHub</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* Emergency Protocol Widget - Dedicated Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-full flex justify-center py-4"
      >
        <div className="max-w-md w-full bg-red-700 comic-border p-8 relative overflow-visible group/boom-widget">
          {/* Top Right Caution Icon - Stretching out */}
          <div className="absolute -top-6 -right-6 md:-top-10 md:-right-10 bg-yellow-400 p-2 md:p-4 comic-border rotate-12 z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <AlertTriangle className="text-black w-8 h-8 md:w-12 md:h-12" />
          </div>

          {/* Halftone texture */}
          <div className="absolute inset-0 halftone-bg opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <h3 className="font-black text-white text-3xl md:text-4xl uppercase italic mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              Press for a BOOM
            </h3>
            <p className="text-white/90 font-bold uppercase text-[10px] md:text-sm mb-8 tracking-[0.2em] bg-black/20 px-4 py-1 rounded-full">
              CAUTION: HIGH VOLTAGE CREATIVITY
            </p>

            <motion.button
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ y: 20 }}
              onClick={handleBoom}
              className="relative w-24 h-28 flex flex-col items-center justify-end group cursor-pointer"
            >
              {/* Dynamite Plunger Handle */}
              <div className="w-20 h-4 bg-on-background comic-border group-hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
              <div className="w-4 h-16 bg-on-background comic-border group-hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
              {/* The "Box" */}
              <div className="w-24 h-16 bg-on-background comic-border flex items-center justify-center -mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Bomb size={32} className="text-red-600 animate-pulse" />
              </div>
            </motion.button>

            <div className="mt-8 flex gap-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={cn(
                  "w-2 h-2 rounded-full",
                  i % 2 === 0 ? "bg-yellow-400" : "bg-black"
                )} />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Decorative Widgets Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12"
      >
        {/* Ticker Widget */}
        <div className="md:col-span-12 bg-on-background text-background py-4 flex overflow-hidden comic-border rotate-1">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-12 font-black uppercase text-2xl"
          >
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex items-center gap-4">
                <Star className="fill-primary text-primary" />
                Available for New Missions
                <Star className="fill-secondary text-secondary" />
                Kolkata Based Creative
              </span>
            ))}
          </motion.div>
        </div>

        {/* Status Widget */}
        <div className="md:col-span-4 bg-secondary-container p-6 comic-border flex flex-col gap-4 -rotate-2 relative">
          {/* King of Hearts */}
          <PlayingCard 
            suit="♥️" 
            value="K" 
            isRed 
            rotation={15} 
            className="w-10 h-14 md:w-16 md:h-24 -bottom-6 -right-2 md:-bottom-10 md:-right-4" 
          />

          <h3 className="font-black uppercase text-xl border-b-2 border-on-background pb-2">System Status</h3>
          <div className="space-y-3 font-bold text-sm">
            <div className="flex justify-between">
              <span>Creativity</span>
              <div className="w-24 h-4 bg-background comic-border overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '95%' }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span>Caffeine</span>
              <div className="w-24 h-4 bg-background comic-border overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  className="h-full bg-tertiary" 
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span>Pixels</span>
              <span className="text-primary font-black">∞</span>
            </div>
          </div>
        </div>

        {/* Sticker Widget */}
        <div className="md:col-span-8 bg-background p-8 comic-border relative overflow-hidden group">
          <div className="absolute inset-0 bg-halftone-pattern opacity-20" />
          <div className="relative z-10 flex flex-wrap gap-6 justify-center">
            {['100% COOL', 'FAST RENDER', 'SKETCHBOOK', 'LO-FI'].map((text, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2, rotate: Math.random() * 20 - 10 }}
                className={cn(
                  "px-6 py-2 comic-border font-black uppercase text-lg shadow-[4px_4px_0px_0px_rgba(27,27,28,1)]",
                  i % 3 === 0 ? "bg-primary text-white" : i % 3 === 1 ? "bg-tertiary text-on-background" : "bg-secondary text-white"
                )}
              >
                {text}
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-6 font-bold uppercase text-xs opacity-40">Digital Artifacts Collection V1.0</p>
        </div>
      </motion.section>
      </div>
    </div>
  );
}
