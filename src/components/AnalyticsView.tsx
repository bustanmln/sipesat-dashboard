/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Cpu, Sparkles, Wifi, Radio, TrendingUp, HelpCircle } from 'lucide-react';
import { NodeStatus, BinCapacity } from '../types';

interface AnalyticsViewProps {
  binCapacities: BinCapacity[];
}

export default function AnalyticsView({ binCapacities }: AnalyticsViewProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Calculate dynamic stats
  const totalCount = binCapacities.reduce((sum, bin) => sum + bin.currentCount, 0);

  // Average weight per item in kg
  const weightMap: Record<string, number> = {
    battery: 0.05,
    atk: 0.03,
    box: 0.15,
    bottle: 0.04
  };
  
  const totalWeight = binCapacities.reduce((sum, bin) => sum + (bin.currentCount * (weightMap[bin.id] || 0.05)), 0).toFixed(1);

  // Dynamic segments for SVG Donut
  let accumulatedPercentage = 0;
  const processedSegments = binCapacities.map((bin) => {
    const pct = totalCount > 0 ? (bin.currentCount / totalCount) * 100 : 25;
    const circumference = 251.2;
    const strokeDashoffset = circumference - (circumference * pct) / 100;
    const rotation = (accumulatedPercentage / 100) * 360;
    
    accumulatedPercentage += pct;

    return {
      id: bin.id,
      name: bin.name,
      value: Math.round(pct),
      color: bin.colorHex,
      strokeDashoffset,
      rotation,
      currentCount: bin.currentCount
    };
  });

  // Dynamic AI evaluation recommendation based on highest count
  const sortedBinsForRecommendation = [...binCapacities].sort((a, b) => b.currentCount - a.currentCount);
  const dominantBin = sortedBinsForRecommendation[0];
  const secondaryBin = sortedBinsForRecommendation[1] || sortedBinsForRecommendation[0];

  const nodeStatuses: NodeStatus[] = [
    { id: '1', name: 'Central Sorting Hub', status: 'ONLINE', colorClass: 'bg-primary-fixed-dim' },
    { id: '2', name: 'SIPESAT Node A2', status: 'SYNCING', colorClass: 'bg-secondary-container' },
  ];

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
    }, 1500);
  };

  const getAIEvaluation = () => {
    if (totalCount === 0) {
      return (
        <>
          Belum ada aktivitas pemilahan aktif terdeteksi. Silakan gunakan simulator pada menu <span className="text-primary-fixed-dim font-semibold">Devices</span> atau masukkan sampah fisik ke dalam mesin SIPESAT untuk melihat analisis evaluasi cerdas AI secara real-time.
        </>
      );
    }
    
    if (totalCount < 15) {
      return (
        <>
          Sistem SIPESAT mendeteksi aktivitas awal dengan total <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">{totalCount} item</span> tersortir. 
          Rekomendasi AI: Fokuskan setoran awal pada jenis <span className="text-primary-fixed-dim font-semibold">Baterai Bekas</span> jika ada, karena memisahkannya sejak dini sangat efektif mencegah pencemaran zat kimia B3 ke tanah sekitar Anda.
        </>
      );
    }
    
    if (totalCount < 50) {
      // Tier 2: Low-Medium
      switch(dominantBin.id) {
        case 'battery':
          return (
            <>
              Pemilahan <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">Baterai</span> mendominasi setoran Anda ({dominantBin.currentCount} pcs). 
              Ini sangat luar biasa karena memilah baterai secara khusus mencegah zat asam korosif merusak lingkungan. Cobalah untuk mulai menyetor kategori <span className="text-secondary font-semibold">{secondaryBin.id === 'battery' ? 'Botol Kecil' : secondaryBin.name}</span> guna menyeimbangkan siklus daur ulang harian Anda.
            </>
          );
        case 'atk':
          return (
            <>
              Pemilahan <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">ATK</span> menjadi kontributor utama ({dominantBin.currentCount} pcs). 
              Langkah yang bagus untuk merapikan limbah plastik/kertas perkantoran. Tips AI: Pastikan pulpen atau spidol bekas yang dibuang sudah benar-benar kosong tanpa sisa tinta basah demi menjaga kebersihan penampung fisik mesin.
            </>
          );
        case 'box':
          return (
            <>
              Volume pemilahan <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">Kemasan Kotak</span> meningkat ({dominantBin.currentCount} pcs). 
              Ini membantu menyelamatkan serat kayu hutan! Tips AI: Lipat kemasan kotak hingga pipih sebelum dimasukkan ke mesin agar hemat volume penampungan hingga 60%.
            </>
          );
        case 'bottle':
          default:
          return (
            <>
              Setoran <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">Botol Plastik</span> mendominasi aktivitas Anda ({dominantBin.currentCount} pcs). 
              Sangat baik untuk mempercepat pasokan industri daur ulang PET. AI menyarankan: Kosongkan sisa cairan dalam botol terlebih dahulu agar berat timbangan sampah terbaca akurat oleh sensor presisi mesin.
            </>
          );
      }
    }
    
    if (totalCount < 150) {
      // Tier 3: Medium-High
      const treesSaved = (totalCount * 0.05).toFixed(1);
      switch(dominantBin.id) {
        case 'battery':
          return (
            <>
              Milestone Menengah Tercapai! Anda telah memilah <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">{dominantBin.currentCount} Baterai</span>. 
              Tindakan ini setara dengan mengamankan ribuan liter air tanah dari pencemaran merkuri. Sistem menyarankan untuk berkoordinasi dengan petugas kebersihan untuk pengiriman berkala ke TPS B3 terdekat karena volume baterai sudah optimum.
            </>
          );
        case 'atk':
          return (
            <>
              Pemilahan kategori <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">ATK</span> mencapai tingkat menengah ({dominantBin.currentCount} pcs). 
              Langkah ini berkontribusi signifikan pada pengurangan sampah plastik keras. Rekomendasi: Sebarkan kampanye pemilahan ini ke area kerja atau kelas Anda untuk meningkatkan partisipasi sebesar 40%.
            </>
          );
        case 'box':
          return (
            <>
              Kemasan Kotak terkumpul sebanyak <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">{dominantBin.currentCount} unit</span>. 
              Anda telah menyelamatkan setara dengan <span className="font-bold text-white">{treesSaved} pohon dewasa</span> dari penebangan! Terus tingkatkan setoran kertas dan kardus untuk mendorong program kampus/kantor hijau yang berkelanjutan.
            </>
          );
        case 'bottle':
          default:
          return (
            <>
              Pemilahan <span className="text-primary-fixed-dim font-extrabold bg-primary/10 px-1.5 py-0.5 rounded">Botol Plastik</span> berjalan sangat produktif ({dominantBin.currentCount} pcs). 
              Energi yang dihemat dari pemilahan ini setara dengan menyalakan komputer selama puluhan jam. Pertahankan konsistensi ini untuk mencapai target pemulihan plastik bulanan Anda!
            </>
          );
      }
    }

    // Tier 4: High / Professional (> 150 items)
    const treesTotal = Math.round(totalCount * 0.08);
    return (
      <>
        Status Pemilahan: **Level Industrial** (Total: <span className="text-primary-fixed-dim font-black">{totalCount} item</span>). 
        Kontribusi terbesar berasal dari **{dominantBin.name}** ({dominantBin.currentCount} pcs). Dengan pencapaian ini, Anda telah menyerap emisi karbon setara dengan merawat **{treesTotal} pohon dewasa** selama satu tahun penuh. 
        Sistem menyarankan untuk mengunduh laporan PDF di pojok kanan atas untuk digunakan sebagai bukti audit keberlanjutan (*Sustainability Audit Report*).
      </>
    );
  };

  // Dynamic trends based on total counts
  const recyclingRate = totalCount > 0 ? (24.5 + (totalCount * 0.2)).toFixed(1) : "24.5";
  const co2Offset = totalCount > 0 ? (1240 + (totalCount * 1.5)).toFixed(0) : "1240";
  const energySaved = totalCount > 0 ? (842 + (totalCount * 0.8)).toFixed(0) : "842";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Toast notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-[100] p-4 rounded-xl bg-primary-fixed-dim text-on-primary-fixed font-headline font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(42,229,0,0.4)] animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>Ecosystem PDF Report exported successfully!</span>
        </div>
      )}

      {/* Header and Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="font-headline text-[32px] font-black text-white leading-tight">
            AI Evaluation
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-xs md:text-sm mt-1 leading-relaxed">
            Precision analytics for your environmental impact. Our SIPESAT AI tracks your waste patterns to optimize global sustainability goals.
          </p>
        </div>
        <div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="bg-primary hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] text-on-primary font-headline text-xs font-bold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all outline-none disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Generating Report...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Central Analytics Donut Card (7-cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col min-h-[440px] border border-white/10 justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-headline text-lg font-bold text-white leading-snug">
                Waste Distribution
              </h2>
              <p className="text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold">
                Monthly sorting breakdown
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-lg px-3 py-1 font-headline">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim pulse-dot"></span>
              <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest leading-none">
                SIPESAT Edge Sync
              </span>
            </div>
          </div>

          {/* Interactive SVG Donut */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-6 py-4">
            <div className="relative w-52 h-52 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-white/5" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>
                
                {processedSegments.map((s) => (
                  <circle 
                    key={s.id}
                    onMouseEnter={() => setHoveredSegment(s.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    className="transition-all duration-300 cursor-pointer"
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke={s.color} 
                    strokeWidth={hoveredSegment === s.id ? '14' : '10'}
                    fill="transparent"
                    strokeDasharray="251.2" 
                    strokeDashoffset={s.strokeDashoffset}
                    style={{ 
                      transform: `rotate(${s.rotation}deg)`, 
                      transformOrigin: '50% 50%',
                      transition: 'stroke-width 0.3s ease, stroke-dashoffset 0.5s ease, transform 0.5s ease'
                    }}
                  ></circle>
                ))}
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[10px] text-on-surface-variant font-extrabold uppercase tracking-widest font-headline">
                  Total Weight
                </span>
                <span className="text-3xl font-black text-white font-headline mt-0.5">
                  {totalWeight}<span className="text-sm font-medium text-on-surface-variant ml-0.5">kg</span>
                </span>
              </div>
            </div>

            {/* Grid display stats */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              {processedSegments.map((s) => (
                <div 
                  key={s.id}
                  onMouseEnter={() => setHoveredSegment(s.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    hoveredSegment === s.id 
                      ? 'bg-white/10 border-white/20 scale-102 shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                      : 'bg-white/5 border-white/5'
                  }`}
                  style={{ borderLeft: `4px solid ${s.color}` }}
                >
                  <p className="font-headline text-xs text-on-surface font-semibold">
                    {s.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <p className="text-lg font-black text-white">
                      {s.value}%
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-mono">
                      ({s.currentCount} pcs)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations (5-cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Main Evaluation Recommendation Box */}
          <div className="glass-panel rounded-2xl p-6 border border-primary/20 bg-white/3 card-gradient relative group hover:border-primary/40 transition-all cursor-pointer overflow-hidden neon-glow-primary">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/20 transition-all duration-500"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-primary-fixed-dim" />
              </div>
              <h3 className="font-headline text-lg font-black text-primary-fixed-dim tracking-tight">
                Evaluasi SIPESAT
              </h3>
            </div>

            <p className="font-sans text-[15px] leading-relaxed text-on-surface">
              {getAIEvaluation()}
            </p>

            <div className="flex items-center gap-4 pt-5 mt-5 border-t border-white/10">
              <div className="flex -space-x-1.5">
                <span className="w-6 h-6 rounded-full bg-secondary-fixed-dim/20 border border-secondary-fixed-dim/40 flex items-center justify-center text-[10px] text-secondary-fixed-dim font-bold">
                  IoT
                </span>
                <span className="w-6 h-6 rounded-full bg-primary-fixed-dim/20 border border-primary-fixed-dim/40 flex items-center justify-center text-[10px] text-primary-fixed-dim font-bold">
                  AI
                </span>
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant opacity-75 uppercase font-headline">
                SIPESAT Impact: +{totalCount > 0 ? (12 + (totalCount * 0.15)).toFixed(1) : "12.0"}% Efficiency
              </span>
            </div>
          </div>

          {/* Node sync status cards */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant font-headline">
                SIPESAT LOCAL NETWORKS
              </span>
              <Radio className="w-4 h-4 text-on-surface-variant opacity-75" />
            </div>

            <div className="space-y-2.5">
              {nodeStatuses.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${node.colorClass} pulse-dot`}></span>
                    <span className="text-xs font-semibold text-white font-headline">
                      {node.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                    node.status === 'ONLINE' ? 'bg-[#2ae500]/10 text-[#2ae500]' : 'bg-[#00eefc]/10 text-[#00eefc]'
                  }`}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Trends Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        {/* Recyling rate */}
        <div className="glass-panel bg-white/3 card-gradient rounded-xl p-5 flex flex-col justify-between border border-white/5">
          <div>
            <span className="text-[9px] font-extrabold text-on-surface-variant uppercase tracking-widest font-headline">
              Recycling Rate
            </span>
            <h4 className="text-2xl font-black text-primary-fixed-dim mt-1">
              +{recyclingRate}%
            </h4>
          </div>
          <div className="h-12 w-full mt-4 bg-primary/5 rounded-lg relative overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path className="text-[#4ade80]/30" d="M0 20 L0 15 Q25 5 50 12 T100 5 L100 20 Z" fill="currentColor"></path>
              <path className="text-[#4ade80]/50" d="M0 20 L0 17 Q25 8 50 14 T100 8 L100 20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* CO2 Offset */}
        <div className="glass-panel bg-white/3 card-gradient rounded-xl p-5 flex flex-col justify-between border border-white/5">
          <div>
            <span className="text-[9px] font-extrabold text-on-surface-variant uppercase tracking-widest font-headline">
              CO2 Offset
            </span >
            <h4 className="text-2xl font-black text-secondary-fixed-dim mt-1">
              {co2Offset}<span className="text-xs font-normal text-on-surface-variant ml-0.5">kg</span>
            </h4>
          </div>
          <div className="h-12 w-full mt-4 bg-secondary-container/5 rounded-lg relative overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path className="text-[#3b82f6]/20" d="M0 20 L0 18 Q20 10 40 15 T80 5 T100 8 L100 20 Z" fill="currentColor"></path>
              <path className="text-[#3b82f6]/45" d="M0 20 L0 19 Q20 12 40 16 T80 8 T100 11 L100 20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

        {/* Energy Saved */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between border border-white/5">
          <div>
            <span className="text-[9px] font-extrabold text-on-surface-variant uppercase tracking-widest font-headline">
              Energy Saved
            </span>
            <h4 className="text-2xl font-black text-white mt-1">
              {energySaved}<span className="text-xs font-normal text-on-surface-variant ml-0.5">kWh</span>
            </h4>
          </div>
          <div className="h-12 w-full mt-4 bg-white/5 rounded-lg relative overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
              <path className="text-white/10" d="M0 20 L0 10 Q30 20 60 10 T100 15 L100 20 Z" fill="currentColor"></path>
              <path className="text-white/20" d="M0 20 L0 12 Q30 18 60 12 T100 17 L100 20 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
