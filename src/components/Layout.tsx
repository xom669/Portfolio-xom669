/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
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
      <header className="bg-background text-primary w-full sticky top-0 z-50 border-b-4 border-primary shadow-[8px_8px_0px_0px_rgba(27,27,28,1)] flex justify-between items-center px-8 md:px-12 py-6">
        <Link to="/" className="font-headline text-2xl md:text-3xl uppercase italic text-on-background hover:rotate-[-2deg] transition-transform whitespace-nowrap">
          ( xom669 | Dipanjan )
        </Link>
        <nav className="hidden md:flex gap-8 items-center font-bold uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "transition-all duration-150 hover:scale-110 hover:skew-x-2",
                location.pathname === link.path
                  ? "text-secondary underline decoration-4 underline-offset-8"
                  : "text-on-background hover:text-secondary"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-on-background hover:text-secondary transition-colors">
            <span className="material-symbols-outlined !text-3xl">face</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-surface border-t-4 border-primary mt-20 px-8 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-headline text-2xl text-primary hover:rotate-[-2deg] transition-transform">
          ( xom669 | Dipanjan )
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
