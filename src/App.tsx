/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, BarChart3, Binary, LogIn, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { ref, onValue, set } from 'firebase/database';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WelcomeView from './components/WelcomeView';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import DevicesView from './components/DevicesView';
import { AppView, TransactionItem, BinCapacity } from './types';

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  
  const [userName, setUserName] = useState('Operator SIPESAT');
  const [userRole, setUserRole] = useState<'Eco Specialist' | 'Chief Officer'>('Chief Officer');

  // Integrated live balance (synced with Firebase)
  const [balance, setBalance] = useState<number>(25000);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);

  const [ipUrl, setIpUrl] = useState<string>('http://192.168.18.168:8080/stream.mjpg');

  const lastStatusLog = useRef<string>('');
  
  // Real-time Node Status
  const [isNodeOnline, setIsNodeOnline] = useState(false);
  const lastHeartbeatRef = useRef<number>(0);

  // Monitor heartbeat staleness continuously
  useEffect(() => {
    const interval = setInterval(() => {
      const secondsSinceLastHeartbeat = (Date.now() / 1000) - lastHeartbeatRef.current;
      setIsNodeOnline(secondsSinceLastHeartbeat < 25);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Firebase Realtime Database Synchronization (Global Device Data & Stats)
  useEffect(() => {
    const sipesatRef = ref(db, 'sipesat');
    const unsubscribe = onValue(sipesatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Sync heartbeat
        if (data.last_heartbeat) {
          lastHeartbeatRef.current = data.last_heartbeat;
          const secondsSinceLastHeartbeat = (Date.now() / 1000) - data.last_heartbeat;
          setIsNodeOnline(secondsSinceLastHeartbeat < 25);
        }

        // 0. Sync camera URL from Firebase Realtime Database
        if (data.camera_url) {
          setIpUrl(data.camera_url);
        }

        // 1. Sync global balance
        if (data.global_balance !== undefined) {
          setBalance(data.global_balance);
        }

        // 2. Sync global transactions
        if (data.global_transactions) {
          const txArray: TransactionItem[] = Object.values(data.global_transactions);
          txArray.sort((a, b) => b.id.localeCompare(a.id));
          setTransactions(txArray.slice(0, 20));
        }

        // 3. Sync counters to binCapacities
        if (data.counter) {
          setBinCapacities((prevBins) =>
            prevBins.map((bin) => {
              if (bin.id === 'battery' && data.counter.baterai !== undefined) {
                const count = data.counter.baterai;
                return {
                  ...bin,
                  currentCount: count,
                  percentage: Math.min(100, Math.round((count / bin.maxVolume) * 100)),
                };
              }
              if (bin.id === 'atk' && data.counter.atk !== undefined) {
                const count = data.counter.atk;
                return {
                  ...bin,
                  currentCount: count,
                  percentage: Math.min(100, Math.round((count / bin.maxVolume) * 100)),
                };
              }
              if (bin.id === 'box' && data.counter.kemasan_kotak !== undefined) {
                const count = data.counter.kemasan_kotak;
                return {
                  ...bin,
                  currentCount: count,
                  percentage: Math.min(100, Math.round((count / bin.maxVolume) * 100)),
                };
              }
              return bin;
            })
          );
        }

        // 4. Trigger alert toast if status_terakhir changes
        if (data.status_terakhir && data.status_terakhir !== lastStatusLog.current) {
          lastStatusLog.current = data.status_terakhir;
          setAlertToast(`SIPESAT AI: ${data.status_terakhir}`);
          setTimeout(() => setAlertToast(null), 4000);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Live physical bin tracker status
  const [binCapacities, setBinCapacities] = useState<BinCapacity[]>([
    {
      id: 'battery',
      name: 'Baterai',
      subName: 'Bahan Berbahaya Beracun',
      icon: 'battery_charging_full',
      percentage: 45,
      maxVolume: 40,
      currentCount: 18,
      colorHex: '#1f995c',
    },
    {
      id: 'atk',
      name: 'ATK',
      subName: 'Alat Tulis Kantor',
      icon: 'draw',
      percentage: 80,
      maxVolume: 30,
      currentCount: 24,
      warning: 'Segera kosongkan penampung ATK.',
      colorHex: '#F87171',
    },
    {
      id: 'box',
      name: 'Kemasan Kotak',
      subName: 'Kardus & Kertas',
      icon: 'inventory_2',
      percentage: 20,
      maxVolume: 50,
      currentCount: 10,
      colorHex: '#2577b1',
    },
    {
      id: 'bottle',
      name: 'Botol Kecil',
      subName: 'Plastik PET',
      icon: 'water_full',
      percentage: 60,
      maxVolume: 80,
      currentCount: 48,
      colorHex: '#f3bb34', // Set to yellow to match Analytics Donut chart colors
    },
  ]);

  // Derived dynamically based on current capacities
  const sortedTodayCount = 120 + binCapacities.reduce((acc, bin) => acc + bin.currentCount, 0);
  const [uptime, setUptime] = useState<string>('99.8');

  // Triggered notifications tray alert
  const [alertToast, setAlertToast] = useState<string | null>(null);

  // Live simulation event! Stores points globally in Firebase.
  const handleDepositSimulation = (binId: 'battery' | 'atk' | 'box' | 'bottle') => {
    // 1. Calculate updates for global bins (simulated)
    const updatedBins = binCapacities.map((item) => {
      if (item.id === binId) {
        const nextCount = item.currentCount + 1;
        const nextPercentage = Math.min(100, Math.round((nextCount / item.maxVolume) * 100));
        return {
          ...item,
          currentCount: nextCount,
          percentage: nextPercentage,
        };
      }
      return item;
    });

    setBinCapacities(updatedBins);

    // 2. Add verification points globally in Firebase Realtime Database
    const rewardRupiah = binId === 'battery' ? 500 : binId === 'bottle' ? 500 : binId === 'atk' ? 400 : 350;
    
    const newBalance = balance + rewardRupiah;
    set(ref(db, `sipesat/global_balance`), newBalance);

    const now = new Date();
    const mapLabel = {
      battery: 'Deposit Baterai (1)',
      atk: 'Deposit ATK (1)',
      box: 'Deposit Kemasan Kotak (1)',
      bottle: 'Deposit Botol Kecil (1)',
    };

    const txId = `tx-${Date.now()}`;
    const newTx: TransactionItem = {
      id: txId,
      title: mapLabel[binId],
      count: 1,
      date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Selesai',
      amount: rewardRupiah,
      type: binId,
    };

    set(ref(db, `sipesat/global_transactions/${txId}`), newTx);

    // 5. Toast alert success feedback
    setAlertToast(`Identified ${binId.toUpperCase()}! Insentif +Rp ${rewardRupiah} ditambahkan.`);
    setTimeout(() => setAlertToast(null), 3000);
  };

  const handleUpdateIpUrl = (url: string) => {
    setIpUrl(url);
    const cameraUrlRef = ref(db, 'sipesat/camera_url');
    set(cameraUrlRef, url).catch((err) => {
      console.error("Failed to update camera URL in Firebase: ", err);
    });
  };

  const simulateFullInput = () => {
    // Select random category to drop
    const types: ('battery' | 'atk' | 'box' | 'bottle')[] = ['battery', 'atk', 'box', 'bottle'];
    const selected = types[Math.floor(Math.random() * types.length)];
    handleDepositSimulation(selected);
  };

  const handleExitDashboard = () => {
    setHasEntered(false);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans selection:bg-primary-container selection:text-on-primary-container relative overflow-x-hidden">
      
      {/* Decorative Atmosphere elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-container/5 rounded-full blur-[120px] floating-orb"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[150px] floating-orb-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-primary-fixed-dim/5 rounded-full blur-[100px] floating-orb" style={{ animationDelay: '-5s' }}></div>
      </div>

      {/* Embedded grid mesh background decoration */}
      <div className="fixed inset-0 z-[-1] opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1f995c 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

      {/* Floating active deposit simulation toast */}
      {alertToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0 z-[100] max-w-sm w-full p-4 rounded-xl bg-[#141824] border border-[#1f995c]/40 text-on-surface flex items-center gap-3 shadow-[0_0_20px_rgba(31,153,92,0.15)] animate-in slide-in-from-bottom-2 duration-300">
          <div className="w-8 h-8 rounded-full bg-primary-fixed-dim/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5 text-primary-fixed-dim" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">SIPESAT AI Verified</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">{alertToast}</p>
          </div>
        </div>
      )}

      {/* Layout Grid */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Sidebar Nav (collapses on mobile size) */}
        {hasEntered && (
          <Sidebar
            currentView={currentView}
            onChangeView={setCurrentView}
            isAuthenticated={hasEntered}
            onLogout={handleExitDashboard}
            userRole={userRole}
            userName={userName}
          />
        )}

        {/* Top Header Panel (collapses/adjusts to left margin when sidebar is shown) */}
        {hasEntered && (
          <TopBar
            currentView={currentView}
            onChangeView={setCurrentView}
            isAuthenticated={hasEntered}
            userRole={userRole}
            userName={userName}
            balance={balance}
            isNodeOnline={isNodeOnline}
          />
        )}

        {/* Content viewport panel with transition wrapper */}
        <main className={`flex-1 flex flex-col px-4 sm:px-6 ${
          hasEntered 
            ? 'justify-start pt-24 pb-32 md:pt-28 md:pb-12 md:pl-[304px] md:pr-10' 
            : 'justify-center pt-12 pb-12 items-center'
        }`}>
          <div className="w-full max-w-[1360px] mx-auto">
            <AnimatePresence mode="wait">
              {!hasEntered ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <WelcomeView onEnter={() => { setHasEntered(true); setCurrentView('dashboard'); }} />
                </motion.div>
              ) : (
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  {currentView === 'dashboard' ? (
                    <DashboardView 
                      transactions={transactions} 
                      binCapacities={binCapacities}
                      onTriggerWasteSim={simulateFullInput}
                      ipUrl={ipUrl}
                      onUpdateIpUrl={handleUpdateIpUrl}
                      balance={balance}
                    />
                  ) : currentView === 'analytics' ? (
                    <AnalyticsView binCapacities={binCapacities} />
                  ) : currentView === 'devices' ? (
                    <DevicesView 
                      binCapacities={binCapacities} 
                      onDepositSimulate={handleDepositSimulation}
                      sortedToday={sortedTodayCount}
                      uptime={uptime}
                    />
                  ) : (
                    <DashboardView 
                      transactions={transactions} 
                      binCapacities={binCapacities}
                      onTriggerWasteSim={simulateFullInput}
                      ipUrl={ipUrl}
                      onUpdateIpUrl={handleUpdateIpUrl}
                      balance={balance}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Bar Responsive Navigation (Mobile Screen size only) */}
        {hasEntered && (
          <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-[#0C0F14]/95 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex flex-col items-center justify-center p-2 transition-transform duration-150 active:scale-90 outline-none ${
                currentView === 'dashboard' ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-wider mt-1 font-headline">Home</span>
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              className={`flex flex-col items-center justify-center p-2 transition-transform duration-150 active:scale-90 outline-none ${
                currentView === 'analytics' ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-wider mt-1 font-headline">Stats</span>
            </button>
            <button 
              onClick={() => setCurrentView('devices')}
              className={`flex flex-col items-center justify-center p-2 transition-transform duration-150 active:scale-90 outline-none ${
                currentView === 'devices' ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              <Binary className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-wider mt-1 font-headline">Bins</span>
            </button>
            <button 
              onClick={handleExitDashboard}
              className="flex flex-col items-center justify-center p-2 text-on-surface-variant hover:text-error transition-transform active:scale-90 outline-none"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-wider mt-1 font-headline">Exit</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
