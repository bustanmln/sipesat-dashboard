/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu, Zap, Info, Settings, ShieldAlert, Check, RefreshCw, AlertTriangle, Play, HelpCircle
} from 'lucide-react';
import { BinCapacity } from '../types';

interface DevicesViewProps {
  binCapacities: BinCapacity[];
  onDepositSimulate: (id: 'battery' | 'atk' | 'box' | 'bottle') => void;
  sortedToday: number;
  uptime: string;
}

export default function DevicesView({
  binCapacities,
  onDepositSimulate,
  sortedToday,
  uptime,
}: DevicesViewProps) {
  const [showConfigLocal, setShowConfigLocal] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [selectedSensorFreq, setSelectedSensorFreq] = useState('250ms');

  // Interactive configurations update simulation
  const handleConfigSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSuccess(true);
    setTimeout(() => {
      setConfigSuccess(false);
      setShowConfigLocal(false);
    }, 1500);
  };

  const handleRestartNode = () => {
    setRestarting(true);
    setTimeout(() => {
      setRestarting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 bg-primary-fixed-dim rounded-full pulse-dot"></span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-primary">
              Unit #SIPESAT-092 Active Command
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline text-[32px] font-black text-white leading-tight">
              Machine Status
            </h1>
            <div className="w-7 h-7 rounded bg-white/5 flex items-center justify-center border border-white/5 text-primary">
              <Zap className="w-4 h-4 text-primary-fixed-dim" />
            </div>
          </div>
          <p className="text-on-surface-variant max-w-2xl text-xs md:text-sm mt-1 leading-relaxed">
            Real-time IoT monitoring of SIPESAT Unit 092. Environmentally conscious sorting precision and power management.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-surface-container-high/60 border border-white/10 rounded-full py-1.5 px-4.5 font-headline">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim pulse-dot"></span>
          <span className="text-xs font-bold tracking-widest text-primary uppercase">ONLINE</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Capacities and Quick Stats (8-cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Bin capacities visual cards */}
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden flex flex-col border border-white/10">
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-primary-fixed-dim/5 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <div>
                <h3 className="font-headline text-lg font-bold text-white">
                  Kapasitas Tempat Sampah
                </h3>
                <p className="text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold">
                  SIPESAT Edge Intelligence
                </p>
              </div>
              <Cpu className="w-5 h-5 text-on-surface-variant opacity-60" />
            </div>

            {/* List of dynamic capacities */}
            <div className="space-y-6">
              {binCapacities.map((bin) => {
                const isOverThreshold = bin.percentage >= 80;
                
                return (
                  <div key={bin.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white uppercase tracking-wider font-headline">
                          {bin.name}
                        </span>
                        {isOverThreshold && (
                          <span className="text-[9px] uppercase tracking-wider font-extrabold bg-error/15 text-error px-1.5 py-0.5 rounded border border-error/10 flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5 text-error" />
                            Warning: Hampir Penuh
                          </span>
                        )}
                      </div>
                      <span 
                        className={`font-semibold font-headline text-sm animate-pulse ${
                          isOverThreshold ? 'text-error font-extrabold' : 'text-primary-fixed-dim'
                        }`}
                      >
                        {bin.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden border border-white/5 relative">
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${bin.percentage}%`,
                          backgroundColor: bin.colorHex,
                          boxShadow: `0 0 12px ${bin.colorHex}55`
                        }}
                      ></div>
                    </div>

                    {/* Conditional Warnings or stats */}
                    {isOverThreshold ? (
                      <p className="text-[11px] text-error flex items-center gap-1.5 font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5 text-error shrink-0" />
                        <span>Segera kosongkan penampung {bin.name}.</span>
                      </p>
                    ) : (
                      <div className="flex justify-between text-[10px] text-on-surface-variant opacity-60 font-mono">
                        <span>Volume: {bin.currentCount}/{bin.maxVolume} unit</span>
                        <span>Threshold Limit: {Math.round(bin.maxVolume * 0.8)} unit</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics display bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="glass-panel bg-surface-container-low/40 rounded-xl p-5 border border-white/5">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline mb-1">
                Sorted Today
              </p>
              <div className="flex items-end justify-between">
                <h4 className="font-headline text-2xl font-black text-white">{sortedToday}</h4>
                <span className="text-primary-fixed-dim text-xs font-bold font-headline bg-primary-fixed-dim/10 px-1.5 py-0.5 rounded">
                  +12% ↑
                </span>
              </div>
            </div>

            <div className="glass-panel bg-surface-container-low/40 rounded-xl p-5 border border-white/5">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline mb-1">
                Uptime
              </p>
              <div className="flex items-end justify-between">
                <h4 className="font-headline text-2xl font-black text-white">
                  {uptime}<span className="text-xs font-normal text-on-surface-variant ml-0.5">%</span>
                </h4>
                <span className="text-primary-fixed-dim text-[10px] font-bold bg-primary-fixed-dim/10 px-2 py-0.5 rounded">
                  Opt.
                </span>
              </div>
            </div>

            <div className="glass-panel bg-surface-container-low/40 rounded-xl p-5 border border-white/5 col-span-2 md:col-span-1">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-headline mb-1">
                Last Sync
              </p>
              <div className="flex items-end justify-between">
                <h4 className="font-headline text-2xl font-black text-white">2m<span className="text-xs font-normal text-on-surface-variant ml-0.5"> ago</span></h4>
                <button 
                  onClick={() => alert("Re-syncing with edge networks... Success!")}
                  className="p-1 px-2.5 text-xs font-bold text-secondary-fixed-dim hover:text-white bg-secondary/10 rounded border border-secondary/20 flex items-center gap-1 transition-all outline-none md:mb-1 hover:bg-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  Sync
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live simulator panel */}
          <div className="glass-panel rounded-xl p-5 border border-primary/20 bg-primary/5">
            <h4 className="font-headline text-sm font-bold text-white mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-fixed-dim pulse-dot"></span>
              Live Garbage Simulator (Interact Here)
            </h4>
            <p className="text-xs text-on-surface-variant mb-4">
              Pilih item berkategori di bawah untuk mensimulasikan pemilahan sampah fisik di mesin. Sensor Edge AI akan mengidentifikasi jenis sampah, mengupdate level tempat sampah, dan menyalurkan insentif ke saldo Anda.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {binCapacities.map((b) => (
                <button
                  key={b.id}
                  onClick={() => onDepositSimulate(b.id)}
                  className="py-3 px-3 rounded-lg border text-left bg-[#141824] border-white/10 hover:border-primary-fixed-dim hover:bg-white/5 transition-all text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="uppercase text-[9px] font-black text-on-surface-variant">{b.id}</span>
                    <Play className="w-3 h-3 text-primary-fixed-dim opacity-40" />
                  </div>
                  <p className="font-semibold text-white font-headline truncate">{b.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Physical Visual Model Card & System Health (4-cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Physical specs visual glass card */}
          <div className="glass-panel bg-surface-container-high/60 border border-white/10 rounded-xl overflow-hidden relative group">
            <div className="aspect-square w-full bg-surface-dim relative overflow-hidden select-none">
              <img 
                alt="SIPESAT-X1 Hardware" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" 
                src={`${(import.meta as any).env.BASE_URL}alatsipesat.jpeg`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141824] via-transparent to-transparent"></div>
              
              {/* Overlapping IoT chips */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full pulse-dot"></span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white">Edge AI Enabled</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white">Cloud Synced</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="font-headline text-lg font-black text-white mb-3">
                <span className="text-primary-fixed-dim text-brand-italic mr-1.5">SIPESAT</span>Unit Details
              </h3>

              <div className="space-y-2.5">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-on-surface-variant">Model ID</span>
                  <span className="text-xs text-white font-bold">SIPESAT-X1 Edge</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-xs text-on-surface-variant">Location</span>
                  <span className="text-xs text-white font-bold">Main Hallway A</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-xs text-on-surface-variant">Firmware</span>
                  <span className="text-xs text-white font-bold">v2.4.1-stable</span>
                </div>
              </div>

              {/* Configure Trigger Button */}
              <button
                onClick={() => setShowConfigLocal(true)}
                className="w-full mt-6 py-3 px-6 bg-primary-container text-on-primary font-headline text-xs font-bold rounded-xl shadow-[0_0_12px_rgba(42,229,0,0.1)] hover:shadow-[0_0_20px_rgba(42,229,0,0.4)] hover:scale-101 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Settings className="w-4.5 h-4.5" />
                System Configuration
              </button>
            </div>
          </div>

          {/* System Health visual track gauge */}
          <div className="glass-panel bg-surface-container-low/60 border border-white/10 rounded-xl p-5">
            <h4 className="text-xs font-bold mb-3 flex items-center gap-2 text-primary font-headline uppercase tracking-[0.05em]">
              <Zap className="w-4.5 h-4.5 text-primary-fixed-dim" />
              Machine Hardware Health
            </h4>
            
            <div className="flex gap-1 mb-4 h-1.5">
              <div className="h-full w-full bg-primary rounded-full"></div>
              <div className="h-full w-full bg-primary rounded-full"></div>
              <div className="h-full w-full bg-primary rounded-full"></div>
              <div className="h-full w-full bg-primary rounded-full"></div>
              <div className="h-full w-full bg-primary rounded-full"></div>
              <div className="h-full w-full bg-primary/25 rounded-full"></div>
              <div className="h-full w-full bg-primary/25 rounded-full"></div>
            </div>

            <p className="text-[11px] text-on-surface-variant leading-relaxed opacity-85 font-sans">
              All SIPESAT environmental modules are operating within nominal parameters. 5 of 7 core AI logical sorting layers reported success in the last validation audit cycle.
            </p>
          </div>
        </div>
      </div>

      {/* System configuration overlay modal panel */}
      {showConfigLocal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel bg-[#141824] border border-white/10 rounded-2xl p-6 max-w-md w-full relative animate-in zoom-in-95 duration-200">
            <button 
              type="button"
              onClick={() => setShowConfigLocal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
            >
              ×
            </button>

            <h3 className="font-headline text-lg font-bold text-white mb-1.5 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-fixed-dim" />
              SIPESAT Edge Config Deck
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Konfigurasi sirkuit dan sensor di IoT unit SIPESAT-092. Pastikan parameter berada di rentang aman.
            </p>

            {configSuccess && (
              <div className="mb-5 p-3 rounded-lg bg-primary-fixed-dim/10 text-primary-fixed-dim border border-primary-fixed-dim/20 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                Parameters updated and burned to EEPROM!
              </div>
            )}

            <form onSubmit={handleConfigSave} className="space-y-4">
              <div>
                <label className="block text-xs text-on-surface-variant mb-2 font-headline font-semibold">
                  Sensor Scanning Frequency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['100ms', '250ms', '500ms'].map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setSelectedSensorFreq(freq)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold font-headline border text-center transition-all ${
                        selectedSensorFreq === freq 
                          ? 'bg-primary-fixed-dim/10 text-primary-fixed-dim border-primary-fixed-dim' 
                          : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-on-surface-variant mb-1.5 font-headline font-semibold" htmlFor="threshold">
                  Overflow Alert Threshold
                </label>
                <input
                  id="threshold"
                  type="text"
                  defaultValue="80%"
                  className="w-full bg-surface-container border border-white/10 rounded-lg py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleRestartNode}
                  disabled={restarting}
                  className="flex-1 py-3 text-xs font-bold rounded-lg border border-white/10 hover:bg-white/5 hover:text-white text-on-surface-variant transition-all disabled:opacity-50"
                >
                  {restarting ? 'Rebooting...' : 'Soft Restart Node'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-xs font-headline font-bold text-on-primary bg-primary rounded-lg transition-all"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
