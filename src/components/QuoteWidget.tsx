/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const QUOTES = [
  "Bury your mistakes under 40 layers of pixels.",
  "Your design should hit as hard as a critical hit.",
  "In the arena of art, every stroke is a battle.",
  "Monsters in the grid? Debug it with style.",
  "Level up your layout, one pixel at a time.",
  "Aggressive creativity is the best defense.",
  "Master the brush, slay the bland.",
  "A blank canvas is just an undefeated boss.",
  "Design with the confidence of a final boss.",
  "Stark brutalism: The heavy armor of UI."
];

export function QuoteWidget() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <div className="w-full comic-border bg-background p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
      <div className="absolute inset-0 halftone-bg opacity-10 pointer-events-none" />
      
      {/* Quote Text */}
      <div className="flex-1 relative z-10">
        <div className="bg-secondary-container text-on-background font-bold text-xs uppercase px-2 py-1 inline-block comic-border -rotate-2 mb-2">
          Daily Inspiration
        </div>
        <p className="font-headline text-xl md:text-2xl italic font-black text-on-background leading-tight">
          "{quote}"
        </p>
      </div>

      {/* Pixel Animation Area (Monster Shooter) */}
      <div className="w-48 h-18 bg-on-background comic-border overflow-hidden relative flex items-center shadow-inner">
        {/* Dark Dungeon/Tech Background */}
        <div className="absolute inset-0 halftone-bg opacity-20" />
        
        {/* Scanning Line (Retro FPS feel) */}
        <div className="absolute top-0 w-full h-0.5 bg-primary/30 animate-[scan_4s_linear_infinite]" />

        {/* Gunner (Player) */}
        <div className="relative ml-2 flex items-center z-20">
          <motion.div 
            animate={{ 
              y: [0, -2, 0],
              x: [0, 1, 0]
            }}
            transition={{ duration: 0.15, repeat: Infinity }}
            className="w-8 h-10 bg-primary border-4 border-white relative flex items-center"
          >
            {/* Visor */}
            <div className="absolute top-2 right-0 w-4 h-2 bg-secondary-container" />
            
            {/* Gun Handle/Arm */}
            <div className="absolute -right-6 top-4 w-6 h-3 bg-white border-2 border-primary" />
            
            {/* Muzzle Flash */}
            <motion.div 
              animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 1] }}
              transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 0.2 }}
              className="absolute -right-10 top-2 w-6 h-6 bg-secondary-container starburst z-30"
            />
          </motion.div>
        </div>

        {/* Bullets */}
        <div className="absolute left-10 w-full h-full pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -10 }}
              animate={{ x: 200 }}
              transition={{ 
                duration: 0.4, 
                repeat: Infinity, 
                delay: i * 0.15,
                ease: "linear" 
              }}
              className="absolute top-[45%] w-4 h-1 bg-secondary-container"
            />
          ))}
        </div>

        {/* Monsters */}
        <div className="absolute right-0 w-1/2 h-full">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 100, opacity: 1 }}
              animate={{ 
                x: [-10, -20, -10],
                opacity: [1, 1, 0]
              }}
              transition={{ 
                x: { duration: 2, repeat: Infinity, delay: i * 1 },
                opacity: { duration: 2, repeat: Infinity, delay: i * 1, times: [0, 0.8, 1] }
              }}
              className="absolute top-4 right-0 w-8 h-8 bg-tertiary border-4 border-white flex items-center justify-center rotate-[-12deg]"
            >
              {/* Monster Eye */}
              <div className="w-2 h-2 bg-background rounded-full" />
              {/* Monster Teeth */}
              <div className="absolute bottom-0 w-full h-2 flex gap-1">
                <div className="w-1 h-2 bg-white" />
                <div className="w-1 h-2 bg-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hit Effects (Sparks) */}
        <motion.div 
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 0.5 }}
          className="absolute right-12 top-6 w-8 h-8 bg-white starburst opacity-60 z-10"
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { top: -10%; }
          to { top: 110%; }
        }
      `}} />
    </div>
  );
}
