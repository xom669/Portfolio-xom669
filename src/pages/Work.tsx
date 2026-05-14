/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';

const projects = [
  {
    title: 'Neon Genesis',
    description: 'Brand identity and digital platform for an experimental music collective. Focusing on brutalist typography and high-contrast colorways.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsdsjfESACStT0rYtqv1OkXNpqJJvb_--GSR0hTP2vbN7aqqMRQgDV_ScOrZX8CfTgNO_aYDnU9I6X0Hpk7TDjIA1RNFvxOwo5fV78tW8I1FbRerXVDKFRyZz2Kvy3Err1oDlMuHD7sr1iK2sI6G6ZSvxKJATiV8XrJvY_WOrDXoS76UloSKO2eIO_IhFbTrsbW9ncdlAZTuVY0MfmhG3x4RRNFkX01ifsvG-8GKhFoDt77PEd-ASviw_-MCVfZn6CpulAQzh5zJSB',
    tag: 'ZAP!',
    size: 'large'
  },
  {
    title: 'Urban Grid',
    description: 'Editorial design system for a street culture magazine. Grid-breaking layouts.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI79T23eEm0BvTA5rr8_y1DcBmy1jBazC0O6JXovI-7OVYsP3C07gyZsxEBlLVLkT6Q6Oyrky881wq4EyV-FNRMdnDAEZcW5T7tBb9Una7ZSaww7XATZp0gzZgZZLV1NxO877gUnD00La5cClvMoitEXbNMzIbJi7AjPmmcJ4lIJarkOE9gqaq7RWjKHL2aOat9_F4iaKSE0s0PD1yZ32acz9WecTkadh-WR7vnQgPdNOv0ZNf5Oh1Z-Twy9V90Tol_vI93L4yCJhz',
    tag: null,
    size: 'tall'
  },
  {
    title: 'Ink & Chaos',
    description: 'Illustration series exploring tactile sketching in digital mediums.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjplOEmteZBBT0d2CxfydUbdbXMAv1IgnRSWB9f_rS8HpmmapTfI6QVLjc4yNDLw9J_AiHUpu-o_5CJW7kWSpEW_0gySxMmlGig_L5F9p4Bl6bH4fynzVdDCXJQ5P62BwRiaD4ajMzoh17PbIJquTac_YuJAvnJ73kcjd_7GVdO4Qdr6QZPcPkwV2i2gw4ymb1xWiEEKJVkAtBWgp7oaYecpW0st64NwPZtbmrVRJxQZe6TthuVq-4TAP7kRfvhv8IferPSiCPiVI2',
    tag: null,
    size: 'square'
  },
  {
    title: 'System Reset',
    description: 'A full platform redesign applying brutalist UI principles to a SaaS dashboard, prioritizing stark functionalism and bold aesthetics.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEF15izuP81wnCNB16I5FyHBJhgi8r2_tGsfmbjo4l_UdyVOQZOan5-J2pbBhOFPwiorim8bSb6toUU647Amb60kwUXiMXuoFcJJOVpXuuC-VW_L0dD9zxpqyFCSuapRo9FkrKNpaAX3yCaDiAHYwRDIcONoIi17Ph9PXO8PkYSh9ooSvqI3rgE4adGYhXpGiFHWJHFxtrAjnFXXnnIpsBJxnlMLmvto6p6qSUVDZUgQXefnZ42oQjJd3wnsphJ0zlVrqbmT6sCwmK',
    tag: 'POW!',
    size: 'wide'
  }
];

export default function Work() {
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

      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 relative">
        {projects.map((project, idx) => (
          <article 
            key={project.title}
            className={`
              comic-border bg-background flex flex-col relative group overflow-hidden
              ${project.size === 'large' ? 'md:col-span-8' : ''}
              ${project.size === 'tall' ? 'md:col-span-4 md:row-span-2' : ''}
              ${project.size === 'square' ? 'md:col-span-4' : ''}
              ${project.size === 'wide' ? 'md:col-span-8' : ''}
              ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}
              hover:rotate-0 transition-all
            `}
          >
            {project.tag && (
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-container starburst flex items-center justify-center comic-border rotate-[25deg] z-20 group-hover:scale-125 group-hover:rotate-45 transition-all">
                <span className="font-bold text-white -rotate-[25deg]">{project.tag}</span>
              </div>
            )}
            
            <div className={`
              w-full overflow-hidden border-b-4 border-on-background relative
              ${project.size === 'tall' ? 'h-96 md:h-full' : 'h-64 md:h-96'}
            `}>
              <img 
                src={project.image} 
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
        ))}
      </section>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 z-50 bg-primary text-white w-16 h-16 rounded-full comic-border flex items-center justify-center hover:scale-110 transition-all group">
         <Mail className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
