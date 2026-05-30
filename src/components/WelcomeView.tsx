import React from 'react';
import { Brain, Cpu, Settings, Leaf, Cloud, ArrowRight } from 'lucide-react';

interface WelcomeViewProps {
  onEnter: () => void;
}

export default function WelcomeView({ onEnter }: WelcomeViewProps) {
  const labs = [
    {
      name: "AI & Machine Learning Lab",
      abbreviation: "AI-ML Lab",
      role: "Computer Vision & Object Detection",
      description: "Pengembangan model AI YOLO untuk deteksi dan klasifikasi jenis sampah (baterai, ATK, kemasan kotak, botol) secara real-time.",
      icon: Brain,
      colorClass: "text-[#38BDF8]",
      bgGlow: "rgba(56, 189, 248, 0.15)",
      borderColor: "group-hover:border-[#38BDF8]/40",
      iconBg: "bg-[#38BDF8]/10"
    },
    {
      name: "IoT & Embedded Systems Lab",
      abbreviation: "IoT Lab",
      role: "Microcontroller & Sensor Integration",
      description: "Perancangan sirkuit kontrol Raspberry Pi, pembacaan sensor ultrasonik tingkat keterisian sampah, dan modul jaringan.",
      icon: Cpu,
      colorClass: "text-[#A78BFA]",
      bgGlow: "rgba(167, 139, 250, 0.15)",
      borderColor: "group-hover:border-[#A78BFA]/40",
      iconBg: "bg-[#A78BFA]/10"
    },
    {
      name: "Robotics & Automation Lab",
      abbreviation: "Robotics Lab",
      role: "Mechanical & Actuator Control",
      description: "Rancangan fisik pemilah sampah otomatis, kendali motor servo penyortir, dan kalibrasi mekanik pintu penampung.",
      icon: Settings,
      colorClass: "text-[#F59E0B]",
      bgGlow: "rgba(245, 158, 11, 0.15)",
      borderColor: "group-hover:border-[#F59E0B]/40",
      iconBg: "bg-[#F59E0B]/10"
    },
    {
      name: "Green Technology & Energy Lab",
      abbreviation: "GreenTech Lab",
      role: "Sustainability & Circular Economy",
      description: "Analisis siklus hidup material, perhitungan karbon yang dihemat, dan pengoptimalan ekosistem daur ulang berkelanjutan.",
      icon: Leaf,
      colorClass: "text-[#34D399]",
      bgGlow: "rgba(52, 211, 153, 0.15)",
      borderColor: "group-hover:border-[#34D399]/40",
      iconBg: "bg-[#34D399]/10"
    },
    {
      name: "Software & Cloud Engineering Lab",
      abbreviation: "SE-Cloud Lab",
      role: "Web Application & Database Sync",
      description: "Pengembangan dashboard web monitoring real-time, sinkronisasi Firebase Realtime Database, dan integrasi streaming kamera.",
      icon: Cloud,
      colorClass: "text-[#60A5FA]",
      bgGlow: "rgba(96, 165, 250, 0.15)",
      borderColor: "group-hover:border-[#60A5FA]/40",
      iconBg: "bg-[#60A5FA]/10"
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative z-10 text-on-surface select-none">
      
      {/* Welcome Card Panel */}
      <div className="w-full max-w-5xl glass-panel bg-surface/40 border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.7)] flex flex-col items-center">
        
        {/* Logo and Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 relative">
            <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-2xl scale-150 animate-pulse"></div>
            <img 
              alt="SIPESAT Logo" 
              className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(74,222,128,0.45)] relative z-10" 
              src={`${(import.meta as any).env.BASE_URL}logo-sipesat.png`}
              referrerPolicy="no-referrer"
            />
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

        {/* Collaborating Laboratories Header */}
        <div className="w-full text-center mb-8 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0b0f17]/90 px-6 text-[11px] uppercase tracking-[0.2em] font-extrabold text-primary-fixed-dim font-headline">
              Mitra Laboratorium Pengembang
            </span>
          </div>
        </div>

        {/* Laboratories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
          {labs.map((lab, index) => {
            const LabIcon = lab.icon;
            return (
              <div 
                key={index}
                className={`group flex flex-col p-5 bg-[#0e121c]/60 border border-white/5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#121826]/80 ${lab.borderColor}`}
                style={{
                  boxShadow: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 10px 30px -10px ${lab.bgGlow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Lab Icon with Glow */}
                <div className={`w-12 h-12 rounded-lg ${lab.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <LabIcon className={`w-6 h-6 ${lab.colorClass}`} />
                </div>

                {/* Lab Title */}
                <div className="mb-2">
                  <h3 className="font-headline font-bold text-sm text-white group-hover:text-primary transition-colors leading-snug">
                    {lab.name}
                  </h3>
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${lab.colorClass} block mt-0.5 font-mono`}>
                    {lab.abbreviation}
                  </span>
                </div>

                {/* Lab Role */}
                <p className="text-[10px] text-white/50 font-semibold mb-3 leading-snug uppercase tracking-wide">
                  {lab.role}
                </p>

                {/* Lab Description */}
                <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-80 mt-auto">
                  {lab.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
