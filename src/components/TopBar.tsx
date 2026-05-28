/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Calendar, UserCheck, ChevronDown, Check, Menu } from 'lucide-react';
import { AppView } from '../types';

interface TopBarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isAuthenticated: boolean;
  userRole: 'Eco Specialist' | 'Chief Officer';
  userName: string;
  onChangePersona: (persona: 'Alex' | 'Admin') => void;
}

export default function TopBar({
  currentView,
  onChangeView,
  isAuthenticated,
  userRole,
  userName,
  onChangePersona,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const notifications = [
    { id: 1, text: "SIPESAT Node #092 Online", time: "2 min ago", unread: true },
    { id: 2, text: "Segera kosongkan penampung ATK (80%)", time: "15 min ago", unread: true },
    { id: 3, text: "Setoran Baterai berhasil diverifikasi", time: "2 hrs ago", unread: false },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[280px] z-40 border-b border-white/10 bg-surface/60 backdrop-blur-xl h-16 px-6 flex justify-between items-center">
      {/* Mobile-only Branding */}
      <div className="flex items-center gap-2 md:hidden">
        <img 
          alt="SIPESAT Mobile Logo" 
          className="w-7 h-7 object-contain" 
          src="https://lh3.googleusercontent.com/aida/ADBb0ujdX2Sa3mAmQfwA8A0zd3JtnZzoVy6b1ccCz8Bnjig7ctt-pLrRW87bpWHG8fqaFkKunO4EI2UoAfbgVuMJPhQ_4F6TNfvxmxey7p-zsNbqwfyox5wwaFgbzny-knhPEx1Ezc0G-awm_HcvxHN7yyFWS5LjsfwM9iHTNMl1g7AJAm6XEN4sXYGVM5Q5QM-eChQ8LAPY2asGM_y2hzJ4_27mXA3SXsuIL2s1SuFqNOC1xKfm2EeyLDXuJ3qD"
          referrerPolicy="no-referrer"
        />
        <h2 className="font-headline text-lg font-black text-brand-italic text-primary tracking-tighter">
          SIPESAT
        </h2>
      </div>

      {/* Desktop-only view stats indicator or live node health */}
      <div className="hidden md:flex items-center gap-2 font-headline text-xs text-on-surface-variant font-medium">
        <span className="w-2 h-2 rounded-full bg-primary-fixed-dim pulse-dot"></span>
        <span>Unit SIPESAT-092 :</span>
        <span className="text-primary-fixed-dim font-bold tracking-widest bg-primary-fixed-dim/10 px-2 py-0.5 rounded uppercase text-[10px]">
          Command Center Online
        </span>
      </div>

      {/* Right Utility Options */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Dynamic Persona Switcher Dropdown (Interactive Premium Feature!) */}
        {isAuthenticated && (
          <div className="relative">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotifDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-headline text-xs font-semibold text-on-surface"
            >
              <UserCheck className="w-3.5 h-3.5 text-primary-fixed-dim" />
              <span className="max-w-[80px] md:max-w-none truncate">{userName}</span>
              <ChevronDown className="w-3 h-3 text-on-surface-variant" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#141824] border border-white/10 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant p-2">
                  Switch User Session
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChangePersona('Alex');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-xs hover:bg-white/5 text-on-surface"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">Alex Rivera</span>
                    <span className="text-[10px] text-primary-fixed-dim">Eco Specialist</span>
                  </div>
                  {userName === 'Alex Rivera' && <Check className="w-3.5 h-3.5 text-primary-fixed-dim" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChangePersona('Admin');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-xs hover:bg-white/5 text-on-surface"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">Admin One</span>
                    <span className="text-[10px] text-primary-fixed-dim">Chief Officer</span>
                  </div>
                  {userName === 'Admin One' && <Check className="w-3.5 h-3.5 text-primary-fixed-dim" />}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notif Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
              setDropdownOpen(false);
            }}
            className="relative font-mono hover:bg-white/5 rounded-full p-2.5 transition-all text-on-surface-variant hover:text-on-surface"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface pulse-dot"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#141824] border border-white/10 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                <span className="font-headline text-xs font-bold text-white">System Logs & Alerts</span>
                <span className="text-[9px] uppercase tracking-wider font-bold bg-error/10 text-error px-1.5 py-0.5 rounded">
                  2 Critical
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-2 rounded-lg bg-surface-container/40 hover:bg-white/5 text-xs">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className={`font-semibold ${notif.unread ? 'text-white' : 'text-on-surface-variant'}`}>
                        {notif.text}
                      </span>
                      {notif.unread && <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full mt-1.5"></span>}
                    </div>
                    <span className="text-[10px] text-on-surface-variant opacity-60">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date visual pill */}
        <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-4">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-headline text-xs text-on-surface-variant select-none">
            Jan 2024 Report
          </span>
        </div>
      </div>
    </header>
  );
}
