/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, BarChart3, Binary, LogIn, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import AnalyticsView from './components/AnalyticsView';
import DevicesView from './components/DevicesView';
import { AppView, TransactionItem, BinCapacity } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  
  // Custom Persona / Session states
  const [currentPersona, setCurrentPersona] = useState<'Alex' | 'Admin'>('Alex');
  const [userName, setUserName] = useState('Alex Rivera');
  const [userRole, setUserRole] = useState<'Eco Specialist' | 'Chief Officer'>('Eco Specialist');

  // Sync persona updates
  useEffect(() => {
    if (currentPersona === 'Alex') {
      setUserName('Alex Rivera');
      setUserRole('Eco Specialist');
    } else {
      setUserName('Admin One');
      setUserRole('Chief Officer');
    }
  }, [currentPersona]);

  // Integrated live balance
  const [balance, setBalance] = useState<number>(25000);

  const lastStatusLog = useRef<string>('');

  // Firebase Realtime Database Synchronization
  useEffect(() => {
    const sipesatRef = ref(db, 'sipesat');
    const unsubscribe = onValue(sipesatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 1. Sync counters to binCapacities
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

        // 2. Trigger alert toast and add transaction if status_terakhir changes
        if (data.status_terakhir && data.status_terakhir !== lastStatusLog.current) {
          lastStatusLog.current = data.status_terakhir;
          setAlertToast(`SIPESAT AI: ${data.status_terakhir}`);
          
          const logText = data.status_terakhir;
          setTransactions((prevTx) => {
            const now = new Date();
            let type: 'battery' | 'atk' | 'box' | 'bottle' = 'battery';
            let title = 'Deposit Baterai (1)';
            
            if (logText.toLowerCase().includes('atk')) {
              type = 'atk';
              title = 'Deposit ATK (1)';
            } else if (logText.toLowerCase().includes('kemasan') || logText.toLowerCase().includes('kotak')) {
              type = 'box';
              title = 'Deposit Kemasan Kotak (1)';
            }
            
            const newTx: TransactionItem = {
              id: `tx-firebase-${Date.now()}`,
              title: title,
              count: 1,
              date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              status: 'Selesai',
              amount: 0,
              type: type,
            };
            return [newTx, ...prevTx].slice(0, 10);
          });

          setTimeout(() => setAlertToast(null), 4000);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Live transaction log
  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'tx-1',
      title: 'Deposit Baterai (3)',
      count: 3,
      date: '12 Okt 2023',
      time: '14:20',
      status: 'Selesai',
      amount: 1500,
      type: 'battery'
    },
    {
      id: 'tx-2',
      title: 'Deposit Botol Kecil (5)',
      count: 5,
      date: '10 Okt 2023',
      time: '09:15',
      status: 'Selesai',
      amount: 2500,
      type: 'bottle'
    },
    {
      id: 'tx-3',
      title: 'Deposit Kemasan Kotak (2)',
      count: 2,
      date: '08 Okt 2023',
      time: '18:45',
      status: 'Selesai',
      amount: 1000,
      type: 'box'
    },
  ]);

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
      colorHex: '#4ADE80',
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
      colorHex: '#3B82F6',
    },
    {
      id: 'bottle',
      name: 'Botol Kecil',
      subName: 'Plastik PET',
      icon: 'water_full',
      percentage: 60,
      maxVolume: 80,
      currentCount: 48,
      colorHex: '#4ADE80',
    },
  ]);

  // Derived dashboard quick values
  const [sortedToday, setSortedToday] = useState<number>(124);
  const [uptime, setUptime] = useState<string>('99.8');

  // Triggered notifications tray alert
  const [alertToast, setAlertToast] = useState<string | null>(null);

  // Live simulation event! (Insanely cool UX factor for client capstone evaluation)
  const handleDepositSimulation = (binId: 'battery' | 'atk' | 'box' | 'bottle') => {
    // 1. Calculate updates
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

    // 2. Add verification points
    const rewardRupiah = binId === 'battery' ? 500 : binId === 'bottle' ? 500 : binId === 'atk' ? 400 : 350;
    setBalance((prev) => prev + rewardRupiah);

    // 3. Increment counters
    setSortedToday((prev) => prev + 1);

    // 4. Dispatch transaction log entry
    const now = new Date();
    const mapLabel = {
      battery: 'Deposit Baterai (1)',
      atk: 'Deposit ATK (1)',
      box: 'Deposit Kemasan Kotak (1)',
      bottle: 'Deposit Botol Kecil (1)',
    };

    const newTx: TransactionItem = {
      id: `tx-${Date.now()}`,
      title: mapLabel[binId],
      count: 1,
      date: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'Selesai',
      amount: rewardRupiah,
      type: binId,
    };

    setTransactions([newTx, ...transactions]);

    // 5. Toast alert success feedback
    setAlertToast(`Identified ${binId.toUpperCase()}! Insentif +Rp ${rewardRupiah} ditambahkan.`);
    setTimeout(() => setAlertToast(null), 3000);
  };

  const simulateFullInput = () => {
    // Select random category to drop
    const types: ('battery' | 'atk' | 'box' | 'bottle')[] = ['battery', 'atk', 'box', 'bottle'];
    const selected = types[Math.floor(Math.random() * types.length)];
    handleDepositSimulation(selected);
  };

  const handlePersonaChange = (personaName: 'Alex' | 'Admin') => {
    setCurrentPersona(personaName);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('login');
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
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
      <div className="fixed inset-0 z-[-1] opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4ade80 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

      {/* Floating active deposit simulation toast */}
      {alertToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:bottom-6 md:left-auto md:right-6 md:translate-x-0 z-[100] max-w-sm w-full p-4 rounded-xl bg-[#141824] border border-[#4ade80]/40 text-on-surface flex items-center gap-3 shadow-[0_0_20px_rgba(74,222,128,0.15)] animate-in slide-in-from-bottom-2 duration-300">
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
        {isAuthenticated && (
          <Sidebar
            currentView={currentView}
            onChangeView={setCurrentView}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            userRole={userRole}
            userName={userName}
          />
        )}

        {/* Top Header Panel (collapses/adjusts to left margin when sidebar is shown) */}
        {isAuthenticated && (
          <TopBar
            currentView={currentView}
            onChangeView={setCurrentView}
            isAuthenticated={isAuthenticated}
            userRole={userRole}
            userName={userName}
            onChangePersona={handlePersonaChange}
          />
        )}

        {/* Content viewport panel */}
        <main className={`flex-1 flex flex-col justify-center px-4 sm:px-6 md:py-6 ${
          isAuthenticated 
            ? 'pt-24 pb-32 md:pb-12 md:pl-[304px] md:pr-10' 
            : 'pt-12 pb-12 items-center'
        }`}>
          <div className="w-full max-w-[1360px] mx-auto">
            {currentView === 'login' && !isAuthenticated ? (
              <LoginView onLoginSuccess={handleLoginSuccess} />
            ) : currentView === 'dashboard' ? (
              <DashboardView 
                transactions={transactions} 
                binCapacities={binCapacities}
                onTriggerWasteSim={simulateFullInput}
              />
            ) : currentView === 'analytics' ? (
              <AnalyticsView />
            ) : currentView === 'devices' ? (
              <DevicesView 
                binCapacities={binCapacities} 
                onDepositSimulate={handleDepositSimulation}
                sortedToday={sortedToday}
                uptime={uptime}
              />
            ) : (
              // Fallback just-in-case
              <LoginView onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
        </main>

        {/* Bottom Bar Responsive Navigation (Mobile Screen size only) */}
        {isAuthenticated && (
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
              onClick={handleLogout}
              className="flex flex-col items-center justify-center p-2 text-on-surface-variant hover:text-error transition-transform active:scale-90 outline-none"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-[10px] uppercase font-bold tracking-wider mt-1 font-headline">Lock</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
