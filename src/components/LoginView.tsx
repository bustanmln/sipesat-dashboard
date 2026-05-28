/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('name@sipesat.tech');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMsg("Credentials required to sync terminal.");
      return;
    }
    // Simulate encryption verification
    setStatusMsg("Decrypting node certificate... Authorized!");
    setTimeout(() => {
      onLoginSuccess();
    }, 800);
  };

  const sipesatLogo = "https://lh3.googleusercontent.com/aida/ADBb0ujdX2Sa3mAmQfwA8A0zd3JtnZzoVy6b1ccCz8Bnjig7ctt-pLrRW87bpWHG8fqaFkKunO4EI2UoAfbgVuMJPhQ_4F6TNfvxmxey7p-zsNbqwfyox5wwaFgbzny-knhPEx1Ezc0G-awm_HcvxHN7yyFWS5LjsfwM9iHTNMl1g7AJAm6XEN4sXYGVM5Q5QM-eChQ8LAPY2asGM_y2hzJ4_27mXA3SXsuIL2s1SuFqNOC1xKfm2EeyLDXuJ3qD";

  return (
    <div className="relative w-full max-w-[480px] mx-auto z-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Glow card wrapper wrapper */}
      <div className="glass-panel bg-surface/60 border border-white/10 rounded-xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-4 relative">
            <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-xl scale-125"></div>
            <img 
              alt="SIPESAT Logo" 
              className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(42,229,0,0.45)] relative z-10" 
              src={sipesatLogo}
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-headline text-[38px] font-black text-brand-italic text-primary mb-1 tracking-tight">
            SIPESAT
          </h1>
          <p className="font-headline text-[13px] text-primary-fixed-dim tracking-[0.2em] uppercase font-extrabold text-center leading-wider">
            Sistem Pemilah Sampah Terpadu
          </p>
          <p className="font-headline text-[11px] text-on-surface-variant mt-2 opacity-60">
            Edge AI & IoT Command Center
          </p>
        </div>

        {/* Status notification */}
        {statusMsg && (
          <div className="mb-6 p-3 flex items-center gap-2 rounded-lg bg-primary/10 border border-primary-fixed-dim/20 text-primary-fixed-dim text-xs font-headline font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email field with active highlight */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="email">
              Work Email
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-fixed-dim transition-colors">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-high/40 border-b-2 border-white/5 focus:border-primary-fixed-dim focus:ring-0 text-on-surface font-sans text-sm pl-12 pr-4 py-3.5 transition-all duration-300 outline-none"
                placeholder="name@sipesat.tech"
              />
            </div>
          </div>

          {/* Password field with dynamic visibility toggle */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="password">
              Access Key
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-fixed-dim transition-colors">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-high/40 border-b-2 border-white/5 focus:border-primary-fixed-dim focus:ring-0 text-on-surface font-sans text-sm pl-12 pr-12 py-3.5 transition-all duration-300 outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & reset link */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-[#171b26] border-white/10 text-primary-fixed-dim focus:ring-primary-fixed-dim focus:ring-offset-surface"
              />
              <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">
                Remember device
              </span>
            </label>
            <a 
              href="#reset" 
              onClick={(e) => { e.preventDefault(); setStatusMsg("Secure reset token has been dispatched to administrators."); }}
              className="text-xs font-bold text-primary-fixed-dim hover:text-primary transition-colors"
            >
              Reset Encryption?
            </a>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary-fixed-dim text-on-primary-fixed font-headline text-sm font-black py-4 rounded-lg transition-all duration-300 neon-glow-primary neon-glow-primary-hover active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            Access Ecosystem
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-white/10"></div>
            <span className="text-[10px] font-headline font-bold text-on-surface-variant text-center tracking-[0.1em]">
              OR CONNECT VIA
            </span>
            <div className="h-[1px] flex-1 bg-white/10"></div>
          </div>

          {/* Social Sign In (Mock Google connection) */}
          <button
            type="button"
            onClick={onLoginSuccess}
            className="w-full glass-panel bg-white/5 border border-white/10 text-on-surface font-headline text-xs font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300 active:scale-95"
          >
            <img 
              alt="Google Icon" 
              className="w-4 h-4" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3Wv7NsgoOGrxIuQWEFfa1JPSZnC0un358lF5ynf9U6WYaxSLbPFVg_Rl-CVc2PpjE6FIWEzvpDXQwc0t6dnc8mvvAXyieyoytKiP8_TiJ3M3OVLzeH9wo3aRSwtp6EQwYQGsfasR4Js6JZNfDFQYh2fNiy0CE2WSBwcLcCcuarDObes3IAx1EWP1QUByPnpHttj38CMUtxYVE5WCZ9KBtmdk64WYKzgiH6BK72YlZZq5y1Nuu2FIy7XLP502uawz9rR3mwxtXg30H"
              referrerPolicy="no-referrer"
            />
            Sign in with Google
          </button>
        </form>

        {/* Footer info link */}
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-on-surface-variant">
            New to SIPESAT? 
            <a 
              href="#register" 
              onClick={(e) => { e.preventDefault(); setStatusMsg("Register module is restricted to Edge nodes only."); }}
              className="text-primary-fixed-dim font-black hover:underline underline-offset-4 ml-1.5"
            >
              Create Account
            </a>
          </p>
        </div>
      </div>

      {/* Utility terms */}
      <div className="mt-8 flex justify-center gap-6 text-[11px] text-on-surface-variant">
        <a href="#privacy" className="hover:text-on-surface transition-colors">Privacy Protocol</a>
        <a href="#terms" className="hover:text-on-surface transition-colors">Terms of Sync</a>
        <a href="#support" className="hover:text-on-surface transition-colors">Global Support</a>
      </div>
    </div>
  );
}
