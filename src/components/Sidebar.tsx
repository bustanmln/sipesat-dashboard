/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, BarChart3, Binary, LogIn, LogOut, UserCheck } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  userRole: string;
  userName: string;
}

export default function Sidebar({
  currentView,
  onChangeView,
  isAuthenticated,
  onLogout,
  userRole,
  userName,
}: SidebarProps) {
  const logoUrl = `${(import.meta as any).env.BASE_URL}logo-sipesat.png`;

  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics' as AppView, label: 'Analytics', icon: BarChart3 },
    { id: 'devices' as AppView, label: 'Devices', icon: Binary },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] hidden md:flex flex-col bg-[#2577b1] border-r border-[#1a5784] z-50 py-8 shadow-xl">
      {/* Brand Header */}
      <div className="px-8 mb-10 text-white">
        <div className="flex items-center gap-2 mb-2">
          <img 
            alt="SIPESAT Logo" 
            className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] animate-pulse" 
            src={logoUrl} 
            referrerPolicy="no-referrer"
          />
          <img 
            alt="FTE Logo" 
            className="h-11 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" 
            src={`${(import.meta as any).env.BASE_URL}fte.png`} 
            referrerPolicy="no-referrer"
          />
          <h1 className="font-headline text-2xl font-black text-brand-italic text-white tracking-tighter ml-1">
            SIPESAT
          </h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-blue-100/70 leading-tight">
          SIstem PEmilah SAmpah Terpadu
        </p>
        <p className="text-[11px] text-[#f3bb34] opacity-90 mt-1 font-mono font-bold">
          Edge AI & IoT Command Center
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3">
        {isAuthenticated ? (
          menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-lg font-headline transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-[#2577b1] border-l-4 border-[#f3bb34] shadow-[inset_1px_1px_4px_rgba(0,0,0,0.05)]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#2577b1]' : 'text-white/80'}`} />
                <span className="text-[14px] font-bold tracking-wider">{item.label}</span>
              </button>
            );
          })
        ) : (
          <button
            onClick={() => onChangeView('login')}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-lg font-headline transition-all duration-300 ${
              currentView === 'login'
                ? 'bg-white text-[#2577b1] border-l-4 border-[#f3bb34]'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <LogIn className="w-5 h-5 text-white/80" />
            <span className="text-[14px] font-bold tracking-wider">Authentication</span>
          </button>
        )}
      </nav>

      {/* Footer Profile or Action Card */}
      <div className="px-4 mt-auto space-y-4">
        {isAuthenticated && (
          <div className="p-4 rounded-xl border border-white/10 bg-white/10 text-white shadow-md">
            <p className="text-[10px] text-white/70 mb-2 font-headline font-bold uppercase tracking-widest">ECO FOOTPRINT</p>
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#f3bb34] w-3/4"></div>
            </div>
            <p className="text-[10px] mt-2 text-white/90 font-semibold font-sans">You saved 4.2kg of plastic today</p>
          </div>
        )}

        {isAuthenticated ? (
          <div className="space-y-3">
            {/* User details card */}
            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/15 bg-white/5">
              <div className="relative">
                <img
                  alt="User profile photo"
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                  src={
                    userRole === 'Eco Specialist'
                      ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAF2gRPHX5Iucg-WFu8S9Mo4m9iSrboPjJoo74rndGznXhb6Qm-rtS8riZydoRaVupcCLZmr0NuZ_bO2k12nZnZ9wCGim8wNlgBB9Ra6cnfdF1VTMvwQAQ-fRDmGABbryyDKLi0nHdNaN2NIDm_cX6tpA0_el5t9DbAJ5385w_cGyaTbbf1PkmhxWxNXx2UhFwmEBHGjgzKdMvr8bpXT0kQlcKjtuxFar6NcSb2KcCz49fKJKuhoVyan4K8u7Ll2jCzR5vnQbfZl25l"
                      : "https://lh3.googleusercontent.com/aida-public/AB6AXuDAH-KiPkdMoVC3Sf2gkzziW8-DFtYea3_JteX322u1TF4AsaiOpEZORIcB5V2WTz_myp3wEduVr0NiXQI434hLM7KzeJ97-P1DmGU5Szd9yCicDV78rkdgBGgl4Ih0dVll5vIZWKttKH37NuXOCisws8NF6ENyft-dBsv7x28MFwH6IE6FwYECF3akC6pA1OKmNMe6LcjQ1EWhNv_Kku_8eoK9BJ5Pg0zExWvyvqMWnovfb7b_0nOxPI1jFCOcjiOg8TTAJBzFh2BE"
                  }
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#f3bb34] rounded-full ring-2 ring-[#2577b1] pulse-dot"></span>
              </div>
              <div className="overflow-hidden">
                <p className="font-headline text-[13px] font-bold text-white truncate leading-tight">
                  {userName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <UserCheck className="w-3 h-3 text-[#f3bb34]" />
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#f3bb34] font-headline">
                    {userRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-4 py-2 text-xs text-white/85 hover:text-[#f3bb34] hover:bg-white/10 rounded-lg border border-dashed border-white/20 transition-all text-left"
            >
              <span className="font-bold">Disconnect Terminal</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-3 text-center rounded-xl bg-white/5 border border-white/10">
            <p className="text-[11px] text-white/70">SIPESAT Edge Terminal is presently locked.</p>
          </div>
        )}
      </div>
    </aside>
  );
}
