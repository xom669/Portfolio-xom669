/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/admin');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data?.session) {
          navigate('/admin');
        } else {
          setError('Registration initialized! If verification is disabled, you can sign in directly now.');
          setIsRegister(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-halftone flex items-center justify-center p-8">
      <motion.div 
        initial={{ rotate: -2, scale: 0.95, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-background comic-border p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(27,27,28,1)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 starburst -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10 text-center mb-8">
          <div className="inline-block bg-primary p-3 comic-border -rotate-3 mb-4">
            <LogIn className="text-white w-8 h-8" />
          </div>
          <h1 className="font-black text-4xl uppercase tracking-tighter text-on-background">
            {isRegister ? 'Registration' : 'Restricted'}
          </h1>
          <p className="font-bold text-sm text-on-background/60 uppercase mt-2">
            {isRegister ? 'Create Your Artist Profile' : 'Authorized Artists Only'}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          {error && (
            <div className="bg-error-container text-on-error-container p-4 comic-border flex items-center gap-3 animate-shake">
              <ShieldAlert className="shrink-0" />
              <p className="text-xs font-bold uppercase">{error}</p>
            </div>
          )}

          <div>
            <label className="block font-black uppercase text-xs mb-2 text-on-background">Access Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-background/40" size={18} />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border-4 border-on-background p-4 pl-12 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none transition-all"
                placeholder="artist@sketchbook.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-black uppercase text-xs mb-2 text-on-background">Secret Cipher</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-background/40" size={18} />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border-4 border-on-background p-4 pl-12 font-bold focus:shadow-[4px_4px_0px_0px_rgba(27,27,28,1)] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary text-white font-black uppercase py-4 comic-border hover:bg-primary/90 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Decrypting...' : isRegister ? 'Initiate Account' : 'Enter Studio'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-xs font-black uppercase text-on-background/70 hover:text-primary transition-colors underline decoration-2 cursor-pointer"
            >
              {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register Artist'}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-8 border-t-4 border-halftone text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-background/40">
            System Identity: xom669 | Studio Guardian V1.1
          </p>
        </div>
      </motion.div>
    </div>
  );
}
