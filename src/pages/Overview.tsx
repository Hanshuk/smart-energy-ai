import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sun, 
  Battery as BatteryIcon, 
  Zap, 
  Home as HomeIcon, 
  AlertTriangle,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SIMULATION_DATA, TIME_BLOCK_LABELS } from '../data/mockData';

export type DemoState = 'OPTIMAL' | 'WARNING' | 'OUTAGE';

interface OverviewProps {
  demoState: DemoState;
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>;
  currentDayIndex: number;
  setCurrentDayIndex: React.Dispatch<React.SetStateAction<number>>;
  currentBlockIndex: number;
  setCurrentBlockIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

const Overview: React.FC<OverviewProps> = ({ 
  demoState, 
  setDemoState,
  currentDayIndex,
  setCurrentDayIndex,
  currentBlockIndex,
  setCurrentBlockIndex,
  isPlaying,
  setIsPlaying
}) => {
  const [countdown, setCountdown] = useState(42);

  // Interval for 60 seconds cycle simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch current simulation block data
  const currentDay = SIMULATION_DATA[currentDayIndex];
  const currentBlock = currentDay.blocks[currentBlockIndex];

  // System states based on DemoState and simulation block
  const getSystemConfig = () => {
    const solarPower = currentBlock.solarKw;
    const homePower = currentBlock.houseLoadKw;

    switch (demoState) {
      case 'WARNING': {
        const gridPower = 0.0; // Paused grid charging
        const batteryPower = Number((solarPower - homePower).toFixed(2));
        const batteryTemp = Math.max(46.2, currentBlock.tempCelsius + 8.0);
        return {
          status: 'WARNING',
          color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
          batteryTemp,
          batteryStatus: 'warning' as const,
          batterySoc: currentBlock.batterySoc,
          solarPower,
          homePower,
          batteryPower,
          gridPower,
          chargeText: batteryPower > 0 ? 'Charging from solar' : (batteryPower < 0 ? 'Discharging to assist load' : 'Idle'),
          statusDesc: 'High battery temperature (≥45°C). Grid charging disabled for thermal protection.',
          flowStatus: { 
            solar: solarPower > 0, 
            battery: Math.abs(batteryPower) > 0.05, 
            grid: false, 
            home: true 
          },
          directions: { 
            solar: 'down', 
            battery: batteryPower > 0 ? 'down' : (batteryPower < 0 ? 'up' : 'none'), 
            grid: 'none', 
            home: 'right' 
          }
        };
      }
      case 'OUTAGE': {
        const gridPower = 0.0; // Grid connection down
        const batteryPower = Number((solarPower - homePower).toFixed(2));
        return {
          status: 'OUTAGE',
          color: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
          batteryTemp: currentBlock.tempCelsius,
          batteryStatus: 'normal' as const,
          batterySoc: Math.max(12, currentBlock.batterySoc - 5),
          solarPower,
          homePower,
          batteryPower,
          gridPower,
          chargeText: 'Grid Lost - Islanding mode',
          statusDesc: 'GRID OUTAGE: Grid connection lost. System running in islanded backup mode powered by solar and battery storage.',
          flowStatus: { 
            solar: solarPower > 0, 
            battery: Math.abs(batteryPower) > 0.05, 
            grid: false, 
            home: true 
          },
          directions: { 
            solar: 'down', 
            battery: batteryPower > 0 ? 'down' : (batteryPower < 0 ? 'up' : 'none'), 
            grid: 'none', 
            home: 'right' 
          }
        };
      }
      case 'OPTIMAL':
      default: {
        const gridPower = currentBlock.gridImportKw;
        const batteryPower = Number((solarPower - homePower + gridPower).toFixed(2));
        return {
          status: 'OPTIMAL',
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
          batteryTemp: currentBlock.tempCelsius,
          batteryStatus: 'normal' as const,
          batterySoc: currentBlock.batterySoc,
          solarPower,
          homePower,
          batteryPower,
          gridPower,
          chargeText: currentBlock.strategy,
          statusDesc: currentBlock.strategy,
          flowStatus: { 
            solar: solarPower > 0, 
            battery: Math.abs(batteryPower) > 0.05, 
            grid: gridPower > 0, 
            home: true 
          },
          directions: { 
            solar: 'down', 
            battery: batteryPower > 0 ? 'down' : (batteryPower < 0 ? 'up' : 'none'), 
            grid: gridPower > 0 ? 'right' : 'none', 
            home: 'right' 
          }
        };
      }
    }
  };

  const sys = getSystemConfig();

  // Gentle floating point tick for realism
  const [microTick, setMicroTick] = useState(0);
  useEffect(() => {
    const tInterval = setInterval(() => {
      setMicroTick((v) => (v + 1) % 100);
    }, 2500);
    return () => clearInterval(tInterval);
  }, []);

  const getTickedPower = (val: number, name: string) => {
    if (val === 0) return '0.00';
    const fl = (Math.sin(microTick + name.charCodeAt(0)) * 0.04);
    return (val + fl).toFixed(2);
  };

  // Calculate day metrics dynamically
  const totalSolarGenerated = currentDay.blocks.reduce((acc, curr) => acc + curr.solarKw * 3, 0);
  const totalGridImported = demoState === 'OUTAGE' ? 0 : currentDay.blocks.reduce((acc, curr) => acc + curr.gridImportKw * 3, 0);
  const totalLoad = currentDay.blocks.reduce((acc, curr) => acc + curr.houseLoadKw * 3, 0);
  const selfSufficiency = Math.min(100, Math.max(0, Math.round((1 - (totalGridImported / (totalLoad || 1))) * 100)));

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER STRIP */}
      <div className="glass-panel p-4 md:p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300">
        <div>
          <span className="text-[10px] font-mono-data text-brand-accent/70 tracking-widest uppercase">Philippine Smart Microgrid</span>
          <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Quezon City Residence <span className="text-brand-accent/50 font-normal">· FP-001</span></h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status pill toggler */}
          <div className="relative group">
            <button 
              onClick={() => {
                setDemoState((prev) => {
                  if (prev === 'OPTIMAL') return 'WARNING';
                  if (prev === 'WARNING') return 'OUTAGE';
                  return 'OPTIMAL';
                });
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold select-none cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-all animate-pulse-glow ${sys.color}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${
                sys.status === 'OPTIMAL' ? 'bg-emerald-400' : sys.status === 'WARNING' ? 'bg-amber-400' : 'bg-rose-400'
              }`}></span>
              <span>SYSTEM: {sys.status}</span>
            </button>
            <div className="absolute top-full right-0 mt-1.5 hidden group-hover:block bg-slate-800 text-[10px] text-slate-300 rounded p-2 z-50 whitespace-nowrap shadow-xl border border-brand-light/25">
              💡 Click to cycle demo states
            </div>
          </div>

          {/* 60s Cycle progress indicator */}
          <div className="flex items-center gap-2 bg-brand-dark border border-brand-light/25 rounded-lg px-3 py-1.5 text-xs font-mono-data">
            <svg className="w-4 h-4 transform -rotate-90">
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="rgba(42, 110, 103, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="var(--color-brand-accent)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="37.7"
                strokeDashoffset={37.7 - (37.7 * (60 - countdown)) / 60}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">Sync {countdown}s</span>
          </div>
        </div>
      </div>

      {/* 2. 7-DAY SIMULATOR CONTROL PANEL */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 border border-brand-light/35 shadow-md shadow-brand-accent/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1.5 rounded-lg bg-brand-deep border border-brand-light/25 text-brand-glow text-center shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider block font-mono-data">Day {currentDayIndex + 1}</span>
            </div>
            <div>
              <h3 className="text-white font-extrabold text-sm flex flex-wrap items-center gap-2">
                {currentDay.dayName} 
                {currentDay.isHoliday && <span className="bg-purple-950/60 text-purple-400 border border-purple-800 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Holiday Load</span>}
                {currentDay.isWeekend && <span className="bg-blue-950/60 text-blue-400 border border-blue-800 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Weekend Peak</span>}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono-data">
                Active time segment: <span className="text-brand-accent font-bold">{currentBlock.timeLabel}</span>
              </p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentBlockIndex((prev) => {
                  if (prev > 0) return prev - 1;
                  setCurrentDayIndex((d) => (d > 0 ? d - 1 : 6));
                  return 7;
                });
              }}
              className="p-2 bg-brand-deep border border-brand-light/20 rounded hover:border-brand-accent/40 text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all"
              title="Previous Time Block"
            >
              <ChevronLeft size={14} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer border ${
                isPlaying 
                  ? 'bg-brand-accent/25 border-brand-accent text-brand-glow' 
                  : 'bg-brand-deep border-brand-light/35 text-slate-300 hover:text-white'
              }`}
            >
              {isPlaying ? <Pause size={12} className="animate-pulse" /> : <Play size={12} />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentBlockIndex((prev) => {
                  if (prev < 7) return prev + 1;
                  setCurrentDayIndex((d) => (d + 1) % 7);
                  return 0;
                });
              }}
              className="p-2 bg-brand-deep border border-brand-light/20 rounded hover:border-brand-accent/40 text-slate-300 hover:text-white cursor-pointer active:scale-95 transition-all"
              title="Next Time Block"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Day selection tabs */}
        <div className="grid grid-cols-7 gap-1">
          {SIMULATION_DATA.map((day, idx) => (
            <button
              key={day.dayShort}
              onClick={() => {
                setCurrentDayIndex(idx);
              }}
              className={`py-1.5 rounded text-[10px] font-black tracking-wider transition-all cursor-pointer text-center ${
                currentDayIndex === idx 
                  ? 'bg-brand-deep text-brand-glow border border-brand-accent/50 shadow-sm' 
                  : 'bg-brand-dark/45 border border-brand-light/5 text-slate-400 hover:text-slate-300'
              }`}
            >
              {day.dayShort}
            </button>
          ))}
        </div>

        {/* Time block scrubber slider */}
        <div className="grid grid-cols-8 gap-1.5">
          {TIME_BLOCK_LABELS.map((label, idx) => (
            <button
              key={label}
              onClick={() => setCurrentBlockIndex(idx)}
              className={`py-2 px-1 rounded text-[8px] font-bold transition-all cursor-pointer truncate text-center relative ${
                currentBlockIndex === idx
                  ? 'bg-brand-accent text-brand-bg shadow shadow-brand-accent/20 font-extrabold'
                  : 'bg-brand-deep/65 hover:bg-brand-deep text-slate-400 hover:text-slate-200'
              }`}
              title={label}
            >
              <span className="block">{label.split('–')[0]}</span>
              {(idx >= 2 && idx <= 5) && (
                <span className={`absolute top-1 right-1 w-1 h-1 rounded-full ${currentBlockIndex === idx ? 'bg-brand-bg' : 'bg-amber-400'}`}></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. THE POWER FLOW (Hero Element) */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute w-[300px] h-[300px] bg-brand-accent/5 rounded-full filter blur-[80px] -z-10 pointer-events-none"></div>
        
        <div className="w-full max-w-[500px] aspect-square relative my-4">
          
          {/* SVG Connection Paths & Particle flows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="grad-solar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--color-energy-solar)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--color-brand-accent)" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="grad-battery" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="var(--color-energy-battery)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--color-brand-accent)" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="grad-grid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-energy-grid)" stopOpacity="0.8" />
                <stop offset="100%" stopColor="var(--color-brand-accent)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Static Connector Paths */}
            <path d="M 200,80 L 200,165" stroke="var(--color-brand-deep)" strokeWidth="4" fill="none" />
            <path d="M 200,235 L 200,320" stroke="var(--color-brand-deep)" strokeWidth="4" fill="none" />
            
            {/* Grid Line (Dashed/grayed if outage/warning) */}
            <path 
              d="M 80,200 L 165,200" 
              stroke="var(--color-brand-deep)" 
              strokeWidth="4" 
              strokeDasharray={demoState !== 'OPTIMAL' ? '4,4' : 'none'} 
              fill="none" 
            />
            
            <path d="M 235,200 L 320,200" stroke="var(--color-brand-deep)" strokeWidth="4" fill="none" />

            {/* Active Highlight Flows */}
            {sys.flowStatus.solar && (
              <path 
                d="M 200,80 L 200,165" 
                stroke="var(--color-energy-solar)" 
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none" 
                opacity="0.8"
              />
            )}
            
            {sys.flowStatus.battery && (
              <path 
                d="M 200,200 L 200,320" 
                stroke="var(--color-energy-battery)" 
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none" 
                opacity="0.8"
              />
            )}

            {sys.flowStatus.grid && (
              <path 
                d="M 80,200 L 200,200" 
                stroke="var(--color-energy-grid)" 
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none" 
                opacity="0.8"
              />
            )}

            {sys.flowStatus.home && (
              <path 
                d="M 200,200 L 320,200" 
                stroke="var(--color-brand-accent)" 
                strokeWidth="4" 
                strokeLinecap="round"
                fill="none" 
                opacity="0.9"
              />
            )}

            {/* Animated Flow Particles */}
            {/* Solar (Top -> Center) */}
            {sys.flowStatus.solar && sys.directions.solar === 'down' && (
              <circle r="4" fill="var(--color-energy-solar-glow)">
                <animateMotion dur="2s" repeatCount="indefinite" path="M 200,80 L 200,165" />
              </circle>
            )}

            {/* Battery Flow */}
            {sys.flowStatus.battery && sys.directions.battery === 'down' && (
              <circle r="4" fill="var(--color-energy-battery)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 200,200 L 200,320" />
              </circle>
            )}
            {sys.flowStatus.battery && sys.directions.battery === 'up' && (
              <circle r="4" fill="var(--color-energy-battery)">
                <animateMotion dur="2.5s" repeatCount="indefinite" path="M 200,320 L 200,200" />
              </circle>
            )}

            {/* Grid Flow */}
            {sys.flowStatus.grid && sys.directions.grid === 'right' && (
              <circle r="4" fill="var(--color-energy-grid)">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 80,200 L 200,200" />
              </circle>
            )}

            {/* Home Flow */}
            {sys.flowStatus.home && sys.directions.home === 'right' && (
              <circle r="4" fill="var(--color-brand-glow)">
                <animateMotion dur="1.5s" repeatCount="indefinite" path="M 200,200 L 320,200" />
              </circle>
            )}

          </svg>

          {/* SOLAR Node (Top) */}
          <div className="absolute top-[20px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className={`h-16 w-16 rounded-full bg-brand-dark border-2 ${
              sys.flowStatus.solar ? 'border-amber-500 animate-pulse-solar shadow-lg shadow-amber-500/20' : 'border-brand-deep'
            } flex items-center justify-center`}>
              <Sun size={24} className={sys.flowStatus.solar ? 'text-amber-400' : 'text-slate-600'} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wider uppercase">Solar Generation</span>
            <span className="text-sm font-bold font-mono-data text-amber-400 mt-0.5">{getTickedPower(sys.solarPower, 'solar')} kW</span>
          </div>

          {/* GRID Node (Left) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[10px] flex flex-col items-center">
            <div className={`h-16 w-16 rounded-full bg-brand-dark border-2 ${
              sys.flowStatus.grid ? 'border-blue-500 animate-pulse-grid shadow-lg shadow-blue-500/20' : 'border-brand-deep opacity-60'
            } flex items-center justify-center`}>
              <Zap size={24} className={sys.flowStatus.grid ? 'text-blue-400 animate-pulse' : 'text-slate-600'} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wider uppercase">Utility Grid</span>
            <span className="text-sm font-bold font-mono-data text-blue-400 mt-0.5">
              {demoState !== 'OPTIMAL' ? 'OFFLINE' : `${getTickedPower(sys.gridPower, 'grid')} kW`}
            </span>
          </div>

          {/* HOME Node (Right) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-[10px] flex flex-col items-center">
            <div className={`h-16 w-16 rounded-full bg-brand-dark border-2 ${
              sys.flowStatus.home ? 'border-brand-accent shadow-lg shadow-brand-accent/20' : 'border-brand-deep'
            } flex items-center justify-center`}>
              <HomeIcon size={24} className="text-brand-accent" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wider uppercase">House Load</span>
            <span className="text-sm font-bold font-mono-data text-slate-200 mt-0.5">{getTickedPower(sys.homePower, 'home')} kW</span>
          </div>

          {/* BATTERY Node (Bottom) */}
          <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span className="text-sm font-bold font-mono-data text-emerald-400 mb-0.5">
              {sys.batteryPower !== 0 ? (sys.batteryPower > 0 ? '+' : '') + getTickedPower(sys.batteryPower, 'battery') : '0.00'} kW
            </span>
            <div className={`h-16 w-16 rounded-full bg-brand-dark border-2 ${
              sys.flowStatus.battery ? 'border-emerald-500 animate-pulse-battery shadow-lg shadow-emerald-500/20' : 'border-brand-deep'
            } flex items-center justify-center`}>
              <BatteryIcon size={24} className={sys.flowStatus.battery ? 'text-emerald-400' : 'text-slate-600'} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wider uppercase">Battery Storage</span>
          </div>

          {/* Central AI Brain Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-brand-deep to-brand-bg border border-brand-accent/40 flex flex-col items-center justify-center shadow-xl animate-pulse-glow">
              <span className="text-[7px] font-mono-data text-brand-accent tracking-widest font-black leading-none mb-0.5">AI BRAIN</span>
              <span className="text-[9px] font-mono-data text-slate-400 font-bold leading-none uppercase">
                {sys.status === 'OPTIMAL' ? 'Opt' : sys.status === 'WARNING' ? 'Warn' : 'Outage'}
              </span>
            </div>
          </div>

        </div>

        {/* Source Mix Breakdown Pill */}
        <div className="px-4 py-2 bg-brand-deep/85 border border-brand-light/30 rounded-full flex flex-wrap items-center justify-center gap-2.5 text-[10px] font-mono-data text-slate-300 shadow-inner">
          <span className="font-extrabold text-brand-accent uppercase tracking-wider">Source Mix:</span>
          {demoState !== 'OPTIMAL' ? (
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <span>SOLAR {sys.solarPower > 0 ? Math.round((sys.solarPower / (sys.solarPower + Math.abs(sys.batteryPower) || 1)) * 100) : 0}%</span>
              <span>·</span>
              <span>BATTERY {sys.batteryPower < 0 ? Math.round((Math.abs(sys.batteryPower) / (sys.solarPower + Math.abs(sys.batteryPower) || 1)) * 100) : 100}%</span>
              <span>·</span>
              <span className="text-slate-500 line-through">GRID 0%</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">SOLAR {currentBlock.sourceMix.solar}%</span>
              <span className="text-slate-500 font-bold">·</span>
              <span className="text-emerald-400 font-bold">BATTERY {currentBlock.sourceMix.battery}%</span>
              <span className="text-slate-500 font-bold">·</span>
              <span className="text-blue-400 font-bold">GRID {currentBlock.sourceMix.grid}%</span>
            </div>
          )}
        </div>
        
        {/* Dynamic Status Strategy Caption */}
        <div className="text-xs text-slate-400 max-w-sm text-center border-t border-brand-light/10 pt-4 mt-2">
          {sys.statusDesc}
        </div>
      </div>

      {/* 4. KEY STAT TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Battery SOC */}
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 relative overflow-hidden">
          <div className="relative flex items-center justify-center h-16 w-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="4" fill="none" />
              <circle 
                cx="32" cy="32" r="28" 
                stroke="var(--color-energy-battery)" 
                strokeWidth="4" 
                fill="none" 
                strokeDasharray="175.9" 
                strokeDashoffset={175.9 - (175.9 * sys.batterySoc) / 100}
                className="transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-sm font-black font-mono-data text-emerald-400">{sys.batterySoc}%</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Battery SOC</span>
            <span className="text-lg font-black text-white">{sys.batterySoc}% Charge</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Target 75% (Sunny target)</span>
          </div>
        </div>

        {/* Battery Temp */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Battery Temp</span>
              <span className={`text-lg font-black font-mono-data mt-1 block ${
                sys.batteryStatus === 'normal' ? 'text-emerald-400' : 'text-amber-400'
              }`}>{sys.batteryTemp.toFixed(1)}°C</span>
            </div>
            <AlertTriangle size={18} className={
              sys.batteryStatus === 'normal' ? 'text-emerald-500/30' : 'text-amber-500 animate-bounce'
            } />
          </div>
          <div className="mt-4">
            {/* Thermal bar scale - 0 to 55 max, 45 warn */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
              <div className="h-full bg-emerald-500" style={{ width: '80%' }}></div>
              <div className="h-full bg-amber-500" style={{ width: '20%' }}></div>
              {/* Slider thumb */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white border border-slate-950 transition-all duration-1000"
                style={{ left: `${Math.min(95, (sys.batteryTemp / 55) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] text-slate-500 mt-1 font-mono-data">
              <span>0°C</span>
              <span>45°C WARN</span>
              <span>55°C MAX</span>
            </div>
          </div>
        </div>

        {/* Net Power */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Power</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-2xl font-black font-mono-data ${sys.batteryPower > 0 ? 'text-emerald-400' : sys.batteryPower < 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {sys.batteryPower > 0 ? '+' : ''}{sys.batteryPower.toFixed(2)} kW
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {sys.batteryPower > 0 ? 'Surplus solar (Charging)' : sys.batteryPower < 0 ? 'Deficit (Discharging battery)' : 'Grid Balanced'}
            </span>
          </div>
          <div className="mt-2.5">
            <span className={`text-[10px] font-mono-data px-2 py-0.5 rounded ${
              sys.batteryPower > 0 
                ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50' 
                : sys.batteryPower < 0 
                ? 'bg-amber-950/40 text-amber-400 border border-amber-900/50' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {sys.batteryPower > 0 ? 'SURPLUS FLOW' : sys.batteryPower < 0 ? 'GRID ASSIST / DISCHARGE' : 'BALANCED / STANDBY'}
            </span>
          </div>
        </div>

        {/* Today's Savings */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Savings</span>
            <span className="text-2xl font-black text-brand-glow font-mono-data mt-1 block">
              ₱{(312.45 * (totalSolarGenerated / 30)).toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Est. payback confidence</span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-[10px] bg-brand-deep text-brand-accent px-1.5 py-0.5 rounded font-mono-data">CONF: MEASURED</span>
            <svg className="w-16 h-6 stroke-brand-glow fill-none" viewBox="0 0 50 20">
              <path d="M0,18 L8,14 L16,16 L24,10 L32,12 L40,4 L48,2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* 5. TODAY AT A GLANCE (Compact Strip) */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        
        <div className="flex flex-wrap justify-around w-full md:w-auto md:justify-start gap-6">
          <div className="text-center md:text-left">
            <span className="text-slate-400 block">Solar Generated</span>
            <span className="font-bold text-white font-mono-data">{totalSolarGenerated.toFixed(1)} kWh</span>
          </div>
          <div className="border-r border-brand-light/25 hidden md:block"></div>
          <div className="text-center md:text-left">
            <span className="text-slate-400 block">Grid Imported</span>
            <span className="font-bold text-slate-300 font-mono-data">{totalGridImported.toFixed(1)} kWh</span>
          </div>
          <div className="border-r border-brand-light/25 hidden md:block"></div>
          
          <div className="flex items-center gap-3">
            <div>
              <span className="text-slate-400 block text-center md:text-left">Self-Sufficiency</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-accent h-full" style={{ width: `${selfSufficiency}%` }}></div>
                </div>
                <span className="font-bold text-brand-accent font-mono-data">{selfSufficiency}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tappable alerts link */}
        <NavLink 
          to="/faults" 
          className="flex items-center gap-2 bg-amber-950/35 border border-amber-900/50 hover:bg-amber-950/60 text-amber-400 px-4 py-2 rounded-lg cursor-pointer transition-all w-full md:w-auto justify-center md:justify-start"
        >
          <AlertTriangle size={14} className="animate-bounce" />
          <span className="font-semibold text-xs uppercase tracking-wide">1 Advisory Detected</span>
          <ArrowRight size={14} className="ml-1" />
        </NavLink>
      </div>

      {/* 6. LIVE TICKER / RECENT ACTIVITY */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-brand-light/20 pb-2">
          <span className="font-display font-semibold text-white text-sm uppercase tracking-wide">Live Microgrid Event Log</span>
          <span className="text-[10px] font-mono-data text-brand-accent">UPDATED REAL-TIME</span>
        </div>
        
        <div className="space-y-3 font-mono-data text-xs">
          
          {demoState === 'OUTAGE' ? (
            <div className="flex items-start gap-2.5 text-rose-400 bg-rose-950/20 border border-rose-900/40 p-2.5 rounded">
              <span className="text-slate-400 shrink-0">{currentBlock.timeLabel.split('–')[0]}</span>
              <span>•</span>
              <span className="font-semibold">GRID OUTAGE: Utility grid connection interrupted. Switched to islanded backup power supply. Running Home and cooling system on solar/battery reserve.</span>
            </div>
          ) : demoState === 'WARNING' ? (
            <div className="flex items-start gap-2.5 text-amber-400 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded">
              <span className="text-slate-400 shrink-0">{currentBlock.timeLabel.split('–')[0]}</span>
              <span>•</span>
              <span className="font-semibold">WARNING: Battery temp warm ({sys.batteryTemp.toFixed(1)}°C &gt;= 45°C). Lead-carbon backup profiles adjusted. Grid charging paused to regulate heat.</span>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded">
              <span className="text-slate-400 shrink-0">{currentBlock.timeLabel.split('–')[0]}</span>
              <span>•</span>
              <span className="font-semibold">{currentBlock.eventLog}</span>
            </div>
          )}

          {/* Older event logs */}
          {Array.from({ length: 3 }).map((_, logIdx) => {
            const targetIdx = (currentBlockIndex - 1 - logIdx + 8) % 8;
            const prevBlock = currentDay.blocks[targetIdx];
            const hourStr = TIME_BLOCK_LABELS[targetIdx].split('–')[0];
            return (
              <div key={logIdx} className="flex items-start gap-2.5 text-slate-300 pl-2">
                <span className="text-slate-500 shrink-0">{hourStr}</span>
                <span className="text-slate-500">•</span>
                <span>{prevBlock.eventLog}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Overview;
