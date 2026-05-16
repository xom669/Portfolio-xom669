/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Work', path: '/work' },
    { name: 'Know More', path: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="relative w-full sticky top-0 z-50 border-b-4 border-primary shadow-[8px_8px_0px_0px_rgba(27,27,28,1)] flex flex-col overflow-hidden">
        {/* Glowing Moving Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-br from-fuchsia-600 via-black to-emerald-500 bg-[length:400%_400%] animate-[gradient_15s_ease_infinite]" />
        
        {/* Glow Overlay */}
        <div className="absolute inset-0 opacity-40 blur-3xl pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-tr from-purple-500/20 to-emerald-500/20 animate-pulse" />
        </div>

        <div className="absolute inset-0 halftone-white-bg opacity-30 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center px-8 md:px-12 py-6">
          <Link to="/" className="group flex items-center gap-2">
            <div className="font-black text-4xl md:text-5xl tracking-tighter text-white lowercase relative group-hover:drop-shadow-[0_0_20px_rgba(192,38,211,0.8)] transition-all">
              xom669
              <motion.div 
                className="absolute -bottom-1 left-0 h-2 bg-secondary w-0 group-hover:w-full transition-all duration-300" 
              />
            </div>
          </Link>
          <nav className="hidden md:flex gap-8 items-center font-bold uppercase">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "transition-all duration-150 hover:scale-110 hover:skew-x-2 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]",
                  location.pathname === link.path
                    ? "text-secondary underline decoration-4 underline-offset-8"
                    : "text-white hover:text-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-white hover:text-secondary hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all">
              <span className="material-symbols-outlined !text-3xl">face</span>
            </Link>
          </div>
        </div>
        
        {/* Sub-header bar - Mobile Only */}
        <div className="relative z-10 bg-black/40 backdrop-blur-md text-white py-2 px-8 md:hidden flex justify-center gap-8 text-xs font-black uppercase tracking-widest border-t border-white/10">
          <Link to="/" className="hover:text-secondary transition-all">home</Link>
          <Link to="/work" className="hover:text-secondary transition-all">works</Link>
          <Link to="/about" className="hover:text-secondary transition-all">about</Link>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-surface border-t-4 border-primary mt-20 px-8 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-black text-3xl text-primary lowercase">
          xom669
        </div>
        <nav className="flex gap-6 items-center uppercase font-bold text-sm">
          <a href="https://www.linkedin.com/in/dipanjanbaidya/" target="_blank" rel="noopener noreferrer" className="text-on-background hover:line-through hover:text-secondary transition-colors">LinkedIn</a>
          <a href="https://instagram.com/xom669" target="_blank" rel="noopener noreferrer" className="text-on-background hover:line-through hover:text-secondary transition-colors">Instagram</a>
          <a href="mailto:dipanjanbaidya2007@gmail.com" className="text-on-background hover:line-through hover:text-secondary transition-colors">Email</a>
        </nav>
        <div className="text-on-background uppercase font-bold text-xs">
          © 2024 DIPANJAN. MADE WITH INK & CHAOS.
        </div>
      </footer>
    </div>
  );
}
