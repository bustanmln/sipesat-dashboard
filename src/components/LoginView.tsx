/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, User } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../../firebase';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setStatusMsg("All fields are required.");
      return;
    }
    
    setIsLoading(true);
    setStatusMsg("Authenticating...");

    try {
      if (isSignUp) {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Initialize user profile in Database
        await set(ref(db, `users/${user.uid}`), {
          name: name,
          email: email,
          balance: 0,
          role: 'Eco Specialist',
          createdAt: new Date().toISOString()
        });
        
        setStatusMsg("Account created successfully!");
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      } else {
        // Login user
        await signInWithEmailAndPassword(auth, email, password);
        setStatusMsg("Authorized!");
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      }
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Authentication failed.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email is already registered.";
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak.";
      }
      setStatusMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            {isSignUp ? "Create Your Account" : "Edge AI & IoT Command Center"}
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
          
          {/* Name field (Only for Sign Up) */}
          {isSignUp && (
            <div className="group animate-in slide-in-from-top-2">
              <label className="block text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary-fixed-dim transition-colors">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-high/40 border-b-2 border-white/5 focus:border-primary-fixed-dim focus:ring-0 text-on-surface font-sans text-sm pl-12 pr-4 py-3.5 transition-all duration-300 outline-none"
                  placeholder="Your Name"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          {/* Email field with active highlight */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="email">
              Email Address
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
                placeholder="name@example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password field with dynamic visibility toggle */}
          <div className="group">
            <label className="block text-xs font-semibold text-on-surface-variant mb-2 ml-1" htmlFor="password">
              Password
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
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isSignUp && (
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
                onClick={(e) => { e.preventDefault(); setStatusMsg("Password reset is not configured yet."); }}
                className="text-xs font-bold text-primary-fixed-dim hover:text-primary transition-colors"
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-primary-fixed-dim text-on-primary-fixed font-headline text-sm font-black py-4 rounded-lg transition-all duration-300 neon-glow-primary neon-glow-primary-hover flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95 cursor-pointer'}`}
          >
            <Lock className="w-4 h-4" />
            {isSignUp ? "Create Account" : "Access Ecosystem"}
          </button>
          
        </form>

        {/* Footer info link */}
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-on-surface-variant">
            {isSignUp ? "Already have an account?" : "New to SIPESAT?"}
            <button 
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setStatusMsg(null);
              }}
              className="text-primary-fixed-dim font-black hover:underline underline-offset-4 ml-1.5 cursor-pointer"
            >
              {isSignUp ? "Log In Here" : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
