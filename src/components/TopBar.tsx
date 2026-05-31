/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Calendar, UserCheck, Wallet, Menu } from 'lucide-react';
import { AppView } from '../types';

interface TopBarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isAuthenticated: boolean;
  userRole: string;
  userName: string;
  balance?: number;
  isNodeOnline?: boolean;
}

export default function TopBar({
  currentView,
  onChangeView,
  isAuthenticated,
  userRole,
  userName,
  balance = 0,
  isNodeOnline = false,
}: TopBarProps) {
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const notifications = [
    { id: 1, text: "SIPESAT Node #092 Online", time: "2 min ago", unread: true },
    { id: 2, text: "Segera kosongkan penampung ATK (80%)", time: "15 min ago", unread: true },
    { id: 3, text: "Setoran Baterai berhasil diverifikasi", time: "2 hrs ago", unread: false },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[280px] z-40 bg-[#1f995c] border-b border-[#166e41] h-16 px-6 flex justify-between items-center text-white shadow-md">
      {/* Mobile-only Branding */}
      <div className="flex items-center gap-2 md:hidden">
        <img 
          alt="SIPESAT Mobile Logo" 
          className="h-7 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" 
          src={`${(import.meta as any).env.BASE_URL}logo-sipesat.png`}
          referrerPolicy="no-referrer"
        />
        <img 
          alt="FTE Mobile Logo" 
          className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]" 
          src={`${(import.meta as any).env.BASE_URL}fte.png`}
          referrerPolicy="no-referrer"
        />
        <h2 className="font-headline text-lg font-black text-brand-italic text-white tracking-tighter ml-1">
          SIPESAT
        </h2>
      </div>

      {/* Desktop-only view stats indicator or live node health */}
      <div className="hidden md:flex items-center gap-2 font-headline text-xs text-white/90 font-semibold">
        <span className={`w-2 h-2 rounded-full ${isNodeOnline ? 'bg-[#f3bb34] pulse-dot' : 'bg-red-400'}`}></span>
        <span>Unit SIPESAT-092 :</span>
        <span className={`font-bold tracking-widest px-2 py-0.5 rounded uppercase text-[10px] ${isNodeOnline ? 'text-[#3d2b02] bg-[#f3bb34]' : 'text-white bg-red-500/30'}`}>
          {isNodeOnline ? 'Command Center Online' : 'System Offline'}
        </span>
      </div>

      {/* Right Utility Options */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* User Balance & Profile */}
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-white">
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-bold text-xs font-mono">Rp {balance.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 font-headline text-xs font-semibold text-white">
              <UserCheck className="w-3.5 h-3.5 text-[#f3bb34]" />
              <span className="max-w-[80px] md:max-w-none truncate">{userName}</span>
            </div>
          </div>
        )}

        {/* Notif Button & Dropdown */}
        <div className="relative text-white">
          <button
            onClick={() => {
              setNotifDropdownOpen(!notifDropdownOpen);
            }}
            className="relative font-mono hover:bg-white/10 rounded-full p-2.5 transition-all text-white/90 hover:text-white"
          >
            <Bell className="w-4 h-4" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f3bb34] ring-2 ring-[#1f995c] pulse-dot"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-slate-800">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <span className="font-headline text-xs font-bold text-slate-900">System Logs & Alerts</span>
                <span className="text-[9px] uppercase tracking-wider font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">
                  2 Critical
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100/70 text-xs">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className={`font-semibold ${notif.unread ? 'text-slate-900' : 'text-slate-500'}`}>
                        {notif.text}
                      </span>
                      {notif.unread && <span className="w-1.5 h-1.5 bg-[#1f995c] rounded-full mt-1.5"></span>}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date visual pill */}
        <div className="hidden lg:flex items-center gap-2 border-l border-white/20 pl-4">
          <Calendar className="w-4 h-4 text-white/95" />
          <span className="font-headline text-xs text-white/95 select-none font-bold">
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
    </header>
  );
}
