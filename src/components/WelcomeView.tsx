import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WelcomeViewProps {
  onEnter: () => void;
}

export default function WelcomeView({ onEnter }: WelcomeViewProps) {
  const supportLogos = [
    { name: "Daskom Lab", file: "daskomlab.png" },
    { name: "Elitia Lab", file: "elitialab.png" },
    { name: "ISS Lab", file: "isslab.png" },
    { name: "SKD Lab", file: "skdlab.png" },
    { name: "UPCI Lab", file: "upcilab.png" }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative z-10 text-on-surface select-none animate-in fade-in duration-500">
      
      {/* Welcome Card Panel */}
      <div className="w-full max-w-4xl glass-panel bg-surface/40 border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.7)] flex flex-col items-center">
        
        {/* Logos and Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          
          {/* Side-by-Side Logos */}
          <div className="flex items-center gap-6 mb-6 relative">
            <div className="absolute inset-0 bg-primary-container/10 rounded-full blur-3xl scale-150 animate-pulse"></div>
            
            {/* SIPESAT Logo */}
            <div className="relative group flex items-center justify-center">
              <img 
                alt="SIPESAT Logo" 
                className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(74,222,128,0.45)] relative z-10 transition-transform duration-300 group-hover:scale-105" 
                src={`${(import.meta as any).env.BASE_URL}logo-sipesat.png`}
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Separator */}
            <div className="h-12 w-[1px] bg-white/20 relative z-10"></div>
            
            {/* FTE Logo */}
            <div className="relative group flex items-center justify-center">
              <img 
                alt="Fakultas Teknik Elektro Logo" 
                className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] relative z-10 transition-transform duration-300 group-hover:scale-105" 
                src={`${(import.meta as any).env.BASE_URL}fte.png`}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <h1 className="font-headline text-[48px] font-black text-brand-italic text-primary mb-1 tracking-tight">
            SIPESAT
          </h1>
          <p className="font-headline text-sm text-primary-fixed-dim tracking-[0.25em] uppercase font-black max-w-lg leading-relaxed">
            Sistem Pemilah Sampah Terpadu
          </p>
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-primary-fixed-dim/40 to-transparent my-4"></div>
          <p className="text-sm text-on-surface-variant max-w-xl leading-relaxed">
            Edge AI & IoT Command Center. Dashboard monitoring cerdas untuk klasifikasi dan manajemen pemilahan sampah daur ulang otomatis secara real-time.
          </p>
        </div>

        {/* Enter Dashboard Button */}
        <button
          onClick={onEnter}
          className="group relative px-8 py-4 bg-primary-fixed-dim text-on-primary-fixed font-headline text-base font-black rounded-xl transition-all duration-300 neon-glow-primary neon-glow-primary-hover active:scale-95 flex items-center gap-3 cursor-pointer mb-16 shadow-[0_0_25px_rgba(74,222,128,0.15)]"
        >
          <span>Masuk ke Dashboard</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Support By Header */}
        <div className="w-full text-center mb-6 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0b0f17]/95 px-6 text-[11px] uppercase tracking-[0.2em] font-extrabold text-primary-fixed-dim font-headline">
              Support By :
            </span>
          </div>
        </div>

        {/* Support Logos Row (Simple logos without description) */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 w-full mt-4">
          {supportLogos.map((lab, index) => (
            <div key={index} className="group relative">
              <img 
                alt={lab.name} 
                className="h-16 md:h-24 w-auto object-contain opacity-55 hover:opacity-100 transition-all duration-300 filter grayscale hover:grayscale-0 drop-shadow-[0_0_8px_rgba(255,255,255,0.05)] hover:scale-105" 
                src={`${(import.meta as any).env.BASE_URL}${lab.file}`}
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
