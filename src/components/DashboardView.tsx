/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  QrCode, BatteryCharging, PenTool, Container, Droplets, 
  ChevronRight, ArrowUpRight, CheckCircle2, RefreshCw, X,
  Camera, Video, Wifi, Settings, Sparkles
} from 'lucide-react';
import { TransactionItem, BinCapacity } from '../types';

interface DashboardViewProps {
  balance: number;
  transactions: TransactionItem[];
  binCapacities: BinCapacity[];
  onTriggerWasteSim: () => void;
  onRefreshData?: () => void;
}

export default function DashboardView({
  balance,
  transactions,
  binCapacities,
  onTriggerWasteSim,
  onRefreshData,
}: DashboardViewProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  // Camera Integration states
  const [cameraMode, setCameraMode] = useState<'simulation' | 'ip'>(() => {
    return (localStorage.getItem('sipesat_camera_mode') as 'simulation' | 'ip') || 'simulation';
  });
  const [ipUrl, setIpUrl] = useState(() => {
    return localStorage.getItem('sipesat_ip_url') || 'http://192.168.1.100:8080/stream.mjpg';
  });
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [detectionState, setDetectionState] = useState<{
    status: 'idle' | 'scanning' | 'detected';
    item: string | null;
    confidence: number | null;
    type: 'battery' | 'atk' | 'box' | 'bottle' | null;
  }>({
    status: 'idle',
    item: null,
    confidence: null,
    type: null,
  });

  const handleCameraModeChange = (mode: 'simulation' | 'ip') => {
    setCameraMode(mode);
    localStorage.setItem('sipesat_camera_mode', mode);
  };

  const handleIpUrlSave = (url: string) => {
    setIpUrl(url);
    localStorage.setItem('sipesat_ip_url', url);
    setIsEditingIp(false);
  };

  const handleSimulateWithDetection = () => {
    if (detectionState.status !== 'idle') return;

    const types: ('battery' | 'atk' | 'box' | 'bottle')[] = ['battery', 'atk', 'box', 'bottle'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    
    const itemsMap = {
      battery: { name: 'Baterai Litium', confidence: 98.4 },
      atk: { name: 'Alat Tulis / Pen', confidence: 96.2 },
      box: { name: 'Kardus Box', confidence: 94.7 },
      bottle: { name: 'Botol Plastik PET', confidence: 99.1 },
    };

    const selectedItem = itemsMap[selectedType];

    // Start scanning
    setDetectionState({
      status: 'scanning',
      item: null,
      confidence: null,
      type: selectedType,
    });

    // After 1 second, mark as detected
    setTimeout(() => {
      setDetectionState({
        status: 'detected',
        item: selectedItem.name,
        confidence: selectedItem.confidence,
        type: selectedType,
      });

      // After another 1.2 seconds, trigger the actual sorting and go back to idle
      setTimeout(() => {
        onTriggerWasteSim();
        setDetectionState({
          status: 'idle',
          item: null,
          confidence: null,
          type: null,
        });
      }, 1200);

    }, 1000);
  };

  // Map transaction type to details
  const getTxConfig = (type: string) => {
    switch (type) {
      case 'battery':
        return { icon: BatteryCharging, color: 'text-primary-fixed-dim', bg: 'bg-primary-fixed-dim/10' };
      case 'atk':
        return { icon: PenTool, color: 'text-error', bg: 'bg-error/10' };
      case 'box':
        return { icon: Container, color: 'text-tertiary-fixed-dim', bg: 'bg-tertiary-fixed-dim/10' };
      default:
        return { icon: Droplets, color: 'text-secondary-container', bg: 'bg-secondary-container/10' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top action layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="font-headline text-[32px] font-black text-white leading-tight">
            Halo, Alex! 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed-dim pulse-dot"></span>
            <span className="text-xs uppercase tracking-widest font-extrabold text-primary-fixed-dim font-headline">
              sipesat Edge Node-092 Active & Syncing
            </span>
          </div>
        </div>
        
        {/* Quick simulator shortcut button to make the app feel alive */}
        <button
          onClick={handleSimulateWithDetection}
          disabled={detectionState.status !== 'idle'}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold font-headline bg-primary/10 hover:bg-primary/25 text-primary border border-primary/20 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${detectionState.status !== 'idle' ? 'animate-spin' : ''}`} />
          {detectionState.status === 'scanning' ? 'Scanning Chute...' : detectionState.status === 'detected' ? 'Sorting Item...' : 'Simulate Sorting Input'}
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Balance Card (Large 7-cols) */}
        <div className="lg:col-span-7 glass-panel bg-white/3 card-gradient rounded-xl p-8 relative overflow-hidden group border border-white/10 min-h-[220px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-fixed-dim/5 rounded-full blur-[90px] pointer-events-none group-hover:bg-primary-fixed-dim/10 transition-all duration-700"></div>
          
          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase font-headline">
              Saldo Terkumpul
            </p>
            <h2 className="font-headline text-[48px] font-black text-white mt-1.5 tracking-tight">
              Rp {balance.toLocaleString('id-ID')}
            </h2>
            <p className="text-xs text-on-surface-variant opacity-60 mt-1">
              Dapat dicairkan melalui e-wallet mitra Lingkungan terdekat.
            </p>
          </div>

          <div className="relative z-10 mt-6">
            <button
              onClick={() => setShowQrModal(true)}
              className="bg-primary hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] text-on-primary font-headline text-xs font-bold py-3.5 px-6 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all outline-none cursor-pointer"
            >
              <QrCode className="w-4.5 h-4.5" />
              Tampilkan QR Code
            </button>
          </div>
        </div>

        {/* Quick Stats Grid (Mini Cards - 5-cols) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          
          {binCapacities.map((item) => {
            const Icon = getTxConfig(item.id).icon;
            const borderColors = getTxConfig(item.id).color;
            const bgLight = getTxConfig(item.id).bg;

            return (
              <div 
                key={item.id} 
                className="glass-panel rounded-xl p-4.5 flex flex-col justify-between group hover:border-white/25 transition-all text-left"
              >
                <div className="flex justify-between items-start">
                  <div className={`${bgLight} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${borderColors}`} />
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-[#2ae500]/80 lowercase bg-[#2ae500]/10 px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-primary-fixed-dim rounded-full pulse-dot"></span>
                    sync
                  </span>
                </div>
                
                <div className="mt-4">
                  <p className="text-[11px] font-bold tracking-wider text-on-surface-variant uppercase font-headline truncate">
                    {item.name}
                  </p>
                  <p className="font-headline text-[22px] font-extrabold text-white mt-0.5">
                    {item.currentCount} Pcs
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Transactions & System Health parallel layout */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-lg font-bold text-white">
              Transaksi Terakhir
            </h3>
            <span className="text-xs text-on-surface-variant opacity-60 font-mono">
              Showing last {transactions.length} operations
            </span>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => {
              const activeConfig = getTxConfig(tx.type);
              const TxIcon = activeConfig.icon;
              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="glass-panel hover:bg-white/5 cursor-pointer rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 group border border-white/5 hover:border-white/15"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest/60 border border-white/5 flex items-center justify-center shrink-0">
                      <TxIcon className={`w-5 h-5 ${activeConfig.color}`} />
                    </div>
                    <div>
                      <h4 className="font-headline text-[15px] font-bold text-white group-hover:text-primary transition-colors">
                        {tx.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-mono">
                        <span>{tx.date}</span>
                        <span className="opacity-40">•</span>
                        <span>{tx.time}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none border-white/5 pt-3 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-primary-fixed-dim font-bold text-base font-headline">
                        +Rp {tx.amount.toLocaleString('id-ID')}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 mt-1">
                        {tx.status}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-on-surface-variant opacity-40 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar Column (4-cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Raspberry Pi 4B Camera Feed Card */}
          <div className="glass-panel bg-white/3 rounded-xl p-5 border border-white/10 flex flex-col justify-between group overflow-hidden relative min-h-[350px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed-dim/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary-fixed-dim" />
                <span className="text-xs font-bold tracking-wider text-white uppercase font-headline">
                  Pi Camera Feed
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                <span className={`w-2 h-2 rounded-full ${
                  detectionState.status === 'scanning' 
                    ? 'bg-[#facc15] animate-pulse' 
                    : detectionState.status === 'detected' 
                      ? 'bg-primary-fixed-dim pulse-dot' 
                      : 'bg-red-500 animate-pulse'
                }`}></span>
                <span className="text-[10px] font-mono font-bold text-white uppercase">
                  {detectionState.status === 'scanning' ? 'SCAN' : detectionState.status === 'detected' ? 'LOCK' : 'LIVE'}
                </span>
              </div>
            </div>

            {/* Camera Viewport */}
            <div className="relative aspect-video w-full rounded-lg bg-[#0a0d14] border border-white/10 overflow-hidden flex items-center justify-center font-mono">
              {cameraMode === 'simulation' ? (
                <div className="absolute inset-0 w-full h-full flex flex-col justify-center items-center overflow-hidden">
                  {detectionState.status === 'scanning' && (
                    <div className="absolute left-0 w-full h-[2px] bg-primary-fixed-dim/80 shadow-[0_0_8px_#4ade80] animate-scan z-20"></div>
                  )}
                  
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                    
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/20"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/20"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/20"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/20"></div>
                    
                    <div className="absolute top-2 left-3 text-[9px] text-white/40 flex flex-col gap-0.5 select-none">
                      <span>CAM-01 [RASPBERRY_PI_4B]</span>
                      <span>192.168.1.92</span>
                    </div>
                    
                    <div className="absolute top-2 right-3 text-[9px] text-white/40 text-right flex flex-col gap-0.5 select-none">
                      <span>AI-NET: V1.0-STABLE</span>
                      <span>FPS: {detectionState.status === 'scanning' ? '54.2' : '60.0'}</span>
                    </div>

                    {detectionState.status === 'detected' && detectionState.type && (
                      <div className="absolute top-[25%] left-[25%] w-[50%] h-[50%] border-2 border-primary shadow-[0_0_15px_rgba(74,222,128,0.4)] rounded flex flex-col justify-between p-1.5 animate-pulse z-10 bg-primary/5">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold text-white bg-primary px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                            {detectionState.item}
                          </span>
                          <span className="text-[8px] font-mono text-primary bg-black/60 px-1 py-0.5 rounded leading-none">
                            {(detectionState.confidence || 0).toFixed(1)}%
                          </span>
                        </div>
                        <div className="text-[8px] text-primary-fixed-dim text-right font-bold uppercase tracking-widest font-mono">
                          TARGET LOCKED
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      {detectionState.status === 'scanning' && (
                        <div className="flex flex-col items-center gap-1.5">
                          <RefreshCw className="w-6 h-6 text-primary-fixed-dim animate-spin" />
                          <span className="text-[10px] font-bold tracking-widest text-primary-fixed-dim uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                            Analysing Chute...
                          </span>
                        </div>
                      )}
                      {detectionState.status === 'idle' && (
                        <div className="flex flex-col items-center gap-1 text-center">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 border border-white/5">
                            <Video className="w-5 h-5 text-white/30" />
                          </div>
                          <span className="text-[10px] font-bold text-white/40 tracking-wider uppercase mt-1">
                            No Object Spotted
                          </span>
                          <span className="text-[9px] text-white/20 select-none">
                            Click Simulate to start sorting
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center overflow-hidden">
                  <img 
                    src={ipUrl} 
                    alt="Raspberry Pi Camera Stream" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.stream-fallback');
                        if (fallback) fallback.classList.remove('hidden');
                      }
                    }}
                  />
                  
                  <div className="stream-fallback hidden absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/90">
                    <Wifi className="w-7 h-7 text-error/70 mb-2" />
                    <p className="text-[11px] text-white font-bold leading-tight uppercase tracking-wider">Stream Connection Failed</p>
                    <p className="text-[9px] text-on-surface-variant opacity-60 mt-1 max-w-[200px]">
                      Pastikan Raspberry Pi online dan menyajikan mjpg-streamer di:
                    </p>
                    <code className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded mt-2 text-primary max-w-full truncate font-mono select-all">
                      {ipUrl}
                    </code>
                  </div>
                </div>
              )}
            </div>

            {/* Mode Switch and Settings bar */}
            <div className="mt-3 pt-3 border-t border-white/5">
              {isEditingIp ? (
                <div className="space-y-2">
                  <label className="block text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Raspberry Pi Stream URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      defaultValue={ipUrl}
                      id="camera_ip_input"
                      className="flex-1 bg-surface-container border border-white/10 rounded-lg py-1 px-2.5 text-xs text-white font-mono"
                      placeholder="http://192.168.1.100:8080/stream.mjpg"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('camera_ip_input') as HTMLInputElement;
                        if (input) handleIpUrlSave(input.value);
                      }}
                      className="px-2.5 bg-primary text-on-primary font-headline text-xs font-bold rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingIp(false)}
                      className="px-2.5 bg-white/5 text-white/60 border border-white/10 text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-xs">
                  <div className="flex rounded-lg bg-surface-container-low p-1 border border-white/5">
                    <button
                      onClick={() => handleCameraModeChange('simulation')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md font-headline transition-all ${cameraMode === 'simulation' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-on-surface-variant'}`}
                    >
                      AI Sim
                    </button>
                    <button
                      onClick={() => handleCameraModeChange('ip')}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-md font-headline transition-all ${cameraMode === 'ip' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-on-surface-variant'}`}
                    >
                      IP Cam
                    </button>
                  </div>

                  {cameraMode === 'ip' ? (
                    <button
                      onClick={() => setIsEditingIp(true)}
                      className="p-1 px-2 text-[10px] font-semibold text-secondary-fixed-dim hover:text-white bg-[#00dbe9]/10 rounded border border-[#00dbe9]/20 flex items-center gap-1 transition-all"
                    >
                      <Settings className="w-3 h-3" />
                      Configure IP
                    </button>
                  ) : (
                    <div className="text-[10px] font-bold text-primary-fixed-dim/75 font-mono select-none flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Object Detection Active
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* System Health Card */}
          <div className="glass-panel bg-white/3 rounded-xl p-6 flex flex-col justify-between border border-white/10">
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold font-headline mb-4">
                System Health
              </p>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/60 font-medium font-sans">Edge AI Core</span>
                  <span className="text-primary-fixed-dim font-bold">Optimal</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="text-white/60 font-medium font-sans">Bin Connectivity</span>
                  <span className="text-primary-fixed-dim font-bold">Stable</span>
                </div>
                <div className="flex justify-between items-center text-sm pb-2">
                  <span className="text-white/60 font-medium font-sans">Cloud API</span>
                  <span className="text-[#FACC15] font-bold">Latency +12ms</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 mt-6 border-t border-white/5 flex gap-2">
              <div className="flex-1 h-1 bg-[#4ADE80] rounded-full pulse-dot"></div>
              <div className="flex-1 h-1 bg-[#4ADE80] rounded-full"></div>
              <div className="flex-1 h-1 bg-white/10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Holographic QR Code Modal Overlay */}
      {showQrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel bg-[#141824]/90 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Glowing background */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl"></div>

            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-lg font-extrabold text-white mb-1">
              Ecosystem QR Verified
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">
              Arahkan layar ponsel Anda ke scanner IoT SIPESAT untuk autentikasi instan.
            </p>

            {/* Glowing QR wrapper */}
            <div className="relative mx-auto w-48 h-48 bg-white/5 border border-primary/40 rounded-xl p-4 flex items-center justify-center neon-glow-primary overflow-hidden mb-6">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10 animate-pulse pointer-events-none"></div>
              {/* Complex futuristic pixel QR simulation */}
              <div className="grid grid-cols-6 gap-1 w-full h-full opacity-90 p-2">
                {[...Array(36)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-sm ${(i % 3 === 0 || i < 8 || i > 28 || i % 7 === 1) && i !== 14 ? 'bg-primary-fixed-dim shadow-[0_0_5px_rgba(42,229,0,0.5)]' : 'bg-transparent'}`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 mb-6 text-left">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface-variant">ID User</span>
                <span className="font-bold text-white font-mono">ALX-922658</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-on-surface-variant">Uptime Token</span>
                <span className="text-primary-fixed-dim font-bold">180s Active</span>
              </div>
            </div>

            <p className="text-[10px] text-on-surface-variant opacity-55 uppercase tracking-wider font-semibold">
              securing with sipesat end-to-end encryption
            </p>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel bg-[#141824] border border-white/10 rounded-2xl p-6 max-w-sm w-full text-left relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-headline text-lg font-bold text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary-fixed-dim" />
              Rincian Transaksi
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-on-surface-variant">Jenis Setoran</span>
                <span className="text-xs text-white font-bold">{selectedTx.title}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-on-surface-variant">Jumlah</span>
                <span className="text-xs text-white font-bold">{selectedTx.count} Unit</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-on-surface-variant">Waktu</span>
                <span className="text-xs text-white font-mono">{selectedTx.date} @ {selectedTx.time}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-on-surface-variant">Nilai Insentif</span>
                <span className="text-xs text-primary-fixed-dim font-bold">Rp {selectedTx.amount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-xs text-on-surface-variant">Status Jaringan</span>
                <span className="text-[10px] bg-primary/20 text-primary-fixed-dim px-2 py-0.5 rounded font-bold uppercase">
                  {selectedTx.status} Verified
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-on-surface hover:text-white rounded-lg text-xs font-bold transition-all"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
