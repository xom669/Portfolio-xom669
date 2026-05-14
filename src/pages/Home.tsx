/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuoteWidget } from '../components/QuoteWidget';

export default function Home() {
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

        <div className="flex flex-col md:flex-row items-center gap-12 relative z-20">
          <div className="flex-1 space-y-6">
            <h1 className="font-black text-5xl md:text-7xl text-on-background uppercase bg-background inline-block px-4 py-2 comic-border rotate-[2deg] hover:rotate-[0deg] transition-transform">
              HELLO! I'M DIPANJAN
            </h1>
            <p className="text-xl bg-background p-6 comic-border">
              19-year-old Graphic & Web Designer based in Kolkata. I combine creativity with functionality to build impactful digital experiences.
            </p>
            <Link to="/work" className="bg-primary text-white font-bold uppercase py-4 px-8 comic-border hover:bg-primary/90 active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all duration-150 flex items-center gap-2 w-fit group/btn">
              <span>Explore My World</span>
              <ArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="flex-shrink-0 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-tertiary-container comic-border-primary rounded-full overflow-hidden relative group/avatar">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover filter grayscale contrast-125 mix-blend-luminosity group-hover/avatar:grayscale-0 group-hover/avatar:scale-105 transition-all duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRdaCbyYApekdQjB1da06oeawe7jOS56eTb096BbZzEWV5V_kSvSbgNWTAAP0d7YIfDsLr3vNT3QkzkgtR8h8vPN7JJKgBaA0dXJv1b9DP8zEi9zGF71uxcfcS2mXOdUE62Z7k6wvOf1YRuAAfXjz9TRnWjDs5weViaB3ohJRq6HBwSRh-aBRwDGFlrYrzDup7kdf9w_4QPFvKKRjpucb8H9Um_aXw7reXGrjUiO6BfV9CZHntHQN19LjJy4Ew3jGV0z_mecSfl4BR" 
              />
            </div>
            <div className="absolute -inset-4 border-4 border-on-background rounded-full border-dashed animate-[spin_10s_linear_infinite] pointer-events-none group-hover:border-primary transition-colors" />
          </div>
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
        <div className="col-span-1 md:col-span-2 bg-background comic-border flex flex-col group">
          <div className="bg-primary text-white font-bold uppercase p-3 border-b-4 border-on-background flex justify-between items-center">
            <span>Latest Project</span>
            <Star className="group-hover:rotate-180 transition-transform duration-500" />
          </div>
          <div className="p-6 flex-grow flex flex-col justify-between">
            <h3 className="font-black text-3xl md:text-4xl mb-4">The Cosmic Ink Series</h3>
            <p className="mb-6 opacity-80">A brutalist exploration of space through the lens of a malfunctioning ballpoint pen.</p>
            <div className="w-full h-4 border-4 border-on-background relative overflow-hidden bg-background">
              <div className="absolute top-0 left-0 h-full bg-secondary-container w-3/4 halftone-bg" />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-span-1 bg-tertiary/10 comic-border p-6 flex flex-col justify-center items-center text-center rotate-[3deg] hover:rotate-0 transition-all">
          <span className="material-symbols-outlined !text-6xl text-primary mb-4 animate-bounce">local_fire_department</span>
          <h3 className="font-black text-2xl mb-2 uppercase">Available for Work</h3>
          <span className="inline-block bg-background px-3 py-1 comic-border font-bold uppercase mt-4 hover:bg-primary hover:text-white transition-colors cursor-pointer">Hire Me</span>
        </div>

        {/* Card 3 */}
        <div className="col-span-1 bg-background comic-border p-6 hover:-translate-y-2 transition-transform">
          <div className="bg-secondary-container text-on-background font-bold uppercase p-2 inline-block comic-border rotate-[-5deg] mb-4">
            Skillset
          </div>
          <ul className="space-y-4 font-bold uppercase">
            <li className="flex items-center gap-2 border-b-2 border-on-background border-dashed pb-2 group cursor-default">
              <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">draw</span> 
              <span className="group-hover:translate-x-2 transition-transform">Illustration</span>
            </li>
            <li className="flex items-center gap-2 border-b-2 border-on-background border-dashed pb-2 group cursor-default">
              <span className="material-symbols-outlined text-tertiary group-hover:scale-125 transition-transform">code</span> 
              <span className="group-hover:translate-x-2 transition-transform">Web Dev</span>
            </li>
            <li className="flex items-center gap-2 border-b-2 border-on-background border-dashed pb-2 group cursor-default">
              <span className="material-symbols-outlined text-secondary group-hover:scale-125 transition-transform">animation</span> 
              <span className="group-hover:translate-x-2 transition-transform">Motion</span>
            </li>
          </ul>
        </div>

        {/* Card 4 */}
        <div className="col-span-1 md:col-span-2 bg-on-background text-background comic-border p-0 overflow-hidden relative group">
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none halftone-bg opacity-50" />
          <img 
            alt="Abstract Art" 
            className="w-full h-full object-cover min-h-[250px] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnWXhkoo3CjV8qT-_D2I66OdRoOhVIF9PjP-duihc7JPOAsVWGiVZh1Z9S_Z_i7RdPRxClCc8wk9dW0nqrqCfqi2Jbt6PhpXbF87gjGE517ETXnQGJNTKOE3nQB1q4W7rQLkP-NSS_GtdXnaZznaknIcAcRc795-EOtpBEcdS85bg8_RPRAxWoxoesRifWsJhh76bjTyLmjiIB-yfH1QzpQSGuTEiJ8i6jJh5HMXaW0qtE47GzdaMcsZbW6-TZoxxTGGcZF1YhGfVu"
          />
          <div className="absolute bottom-4 left-4 z-20 bg-background text-on-background comic-border p-2 font-bold uppercase">
            Gallery Sneak Peek
          </div>
        </div>
      </section>
    </div>
  );
}
