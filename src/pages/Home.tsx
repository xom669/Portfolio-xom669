/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuoteWidget } from '../components/QuoteWidget';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Fetch the first profile (assuming only one artist/owner)
      const { data } = await supabase.from('profiles').select('*').limit(1).single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  const displayName = profile?.full_name?.split(' ')[0] || 'DIPANJAN';
  const bio = profile?.bio || '19-year-old Graphic & Web Designer based in Kolkata. I combine creativity with functionality to build impactful digital experiences.';
  const pfp = profile?.pfp_url || 'https://artifact.stately.ai/b798ab49-233f-41e4-ae83-f8c553e1aa7a/input_file_0.png';

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative bg-secondary-container comic-border p-8 md:p-12 rotate-[-1deg] overflow-hidden group">
        <div className="absolute top-0 right-0 w-full h-full halftone-bg opacity-10 pointer-events-none" />
        
        {/* Floating "WOW!" Pop */}
        <motion.div 
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: -12 }}
          className="absolute -top-6 -left-6 bg-primary text-white font-black text-4xl md:text-5xl italic p-4 comic-border z-10"
        >
          WOW!
        </motion.div>

        <div className="flex flex-row items-center justify-between gap-3 md:gap-12 relative z-20">
          <div className="flex-1 order-1">
            <h1 className="font-black text-lg md:text-7xl text-on-background uppercase bg-background inline-block px-3 py-2 md:px-4 md:py-2 comic-border rotate-[1deg] hover:rotate-[0deg] transition-transform overflow-hidden w-full md:w-auto text-center md:text-left leading-none">
              <motion.span
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="inline-block"
              >
                HI! I'M {displayName}
              </motion.span>
            </h1>
            <p className="text-sm md:text-xl bg-background p-3 md:p-6 comic-border hidden md:block mt-4">
              {bio}
            </p>
            <div className="hidden md:flex mt-6">
              <Link to="/work" className="bg-primary text-white font-bold uppercase py-4 px-8 comic-border hover:bg-primary/90 active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150 flex items-center gap-2 w-fit group/btn">
                <span>Explore My World</span>
                <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="flex-shrink-0 relative order-2">
            <div className="w-20 h-20 md:w-80 md:h-80 bg-tertiary-container comic-border-primary rounded-full overflow-hidden relative group/avatar">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover filter contrast-125 group-hover/avatar:scale-105 transition-all duration-500"
                src={pfp} 
              />
            </div>
            <div className="absolute -inset-2 md:-inset-4 border-2 md:border-4 border-on-background rounded-full border-dashed animate-[spin_10s_linear_infinite] pointer-events-none group-hover:border-primary transition-colors" />
          </div>
        </div>
        <div className="mt-6 md:hidden">
            <p className="text-sm bg-background p-4 comic-border mb-4">
              {bio}
            </p>
            <Link to="/work" className="bg-primary text-white font-bold uppercase py-3 px-6 comic-border text-sm flex items-center justify-center gap-2 w-full group/btn">
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
      <section className="animate-on-scroll">
        <QuoteWidget />
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="col-span-1 md:col-span-2 bg-background comic-border flex flex-col group h-full">
          <div className="bg-primary text-white font-bold uppercase p-2 md:p-3 border-b-4 border-on-background flex justify-between items-center text-xs md:text-base">
            <span>Recent Mission</span>
            <Star size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          </div>
          <div className="p-3 md:p-6 flex-grow flex flex-col justify-between">
            <h3 className="font-black text-lg md:text-4xl mb-1 md:mb-4">The Cosmic Ink Series</h3>
            <p className="mb-2 md:mb-6 opacity-80 text-xs md:text-base">Brutalist exploration of space.</p>
            <div className="w-full h-2 md:h-4 border-2 md:border-4 border-on-background relative overflow-hidden bg-background">
              <div className="absolute top-0 left-0 h-full bg-secondary-container w-3/4 halftone-bg" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-span-1 bg-tertiary/10 comic-border p-3 md:p-6 flex flex-col justify-center items-center text-center rotate-1 hover:rotate-0 transition-all h-full">
          <span className="material-symbols-outlined !text-3xl md:!text-6xl text-primary mb-1 md:mb-4 animate-bounce">local_fire_department</span>
          <h3 className="font-black text-base md:text-2xl mb-1 uppercase">Available</h3>
          <span className="inline-block bg-background px-2 py-1 comic-border font-bold uppercase hover:bg-primary hover:text-white transition-colors cursor-pointer text-[10px] md:text-sm">Hire</span>
        </div>

        {/* Card 3 - Gallery Sneak Peek (Moved Up) */}
        <div className="col-span-1 md:col-span-1 bg-on-background text-background comic-border p-0 overflow-hidden relative group h-full">
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none halftone-bg opacity-50" />
          <img 
            alt="Abstract Art" 
            className="w-full h-full object-cover min-h-[200px] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnWXhkoo3CjV8qT-_D2I66OdRoOhVIF9PjP-duihc7JPOAsVWGiVZh1Z9S_Z_i7RdPRxClCc8wk9dW0nqrqCfqi2Jbt6PhpXbF87gjGE517ETXnQGJNTKOE3nQB1q4W7rQLkP-NSS_GtdXnaZznaknIcAcRc795-EOtpBEcdS85bg8_RPRAxWoxoesRifWsJhh76bjTyLmjiIB-yfH1QzpQSGuTEiJ8i6jJh5HMXaW0qtE47GzdaMcsZbW6-TZoxxTGGcZF1YhGfVu"
          />
          <div className="absolute bottom-4 left-4 z-20 bg-background text-on-background comic-border p-2 font-bold uppercase text-[10px] md:text-xs">
            Gallery Sneak Peek
          </div>
        </div>

        {/* Card 4 - Skillset */}
        <div className="col-span-1 md:col-span-2 bg-background comic-border p-4 md:p-6 hover:-translate-y-2 transition-transform">
          <div className="bg-secondary-container text-on-background font-bold uppercase p-2 inline-block comic-border rotate-[-5deg] mb-4 text-xs md:text-base">
            Skillset
          </div>
          <ul className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-bold uppercase text-xs md:text-base">
            <li className="flex items-center gap-2 border-b-2 border-on-background border-dashed pb-2 group cursor-default">
              <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform text-sm md:text-xl">draw</span> 
              <span className="group-hover:translate-x-2 transition-transform">Illustration</span>
            </li>
            <li className="flex items-center gap-2 border-b-2 border-on-background border-dashed pb-2 group cursor-default">
              <span className="material-symbols-outlined text-tertiary group-hover:scale-125 transition-transform text-sm md:text-xl">code</span> 
              <span className="group-hover:translate-x-2 transition-transform">Web Dev</span>
            </li>
            <li className="flex items-center gap-2 border-b-2 border-on-background border-dashed pb-2 group cursor-default">
              <span className="material-symbols-outlined text-secondary group-hover:scale-125 transition-transform text-sm md:text-xl">animation</span> 
              <span className="group-hover:translate-x-2 transition-transform">Motion</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Decorative Widgets Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
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
        <div className="md:col-span-4 bg-secondary-container p-6 comic-border flex flex-col gap-4 -rotate-2">
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
      </section>
    </div>
  );
}
