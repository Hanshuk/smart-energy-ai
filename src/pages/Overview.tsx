import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sun, 
  Battery as BatteryIcon, 
  Zap, 
  Home as HomeIcon, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export type DemoState = 'OPTIMAL' | 'WARNING' | 'CRITICAL';

interface OverviewProps {
  demoState: DemoState;
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>;
}

const Overview: React.FC<OverviewProps> = ({ demoState, setDemoState }) => {
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

  // System states based on DemoState
  const getSystemConfig = () => {
    switch (demoState) {
      case 'WARNING':
        return {
          status: 'WARNING',
          color: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
          batteryTemp: 46.2,
          batteryStatus: 'warning',
          batterySoc: 78,
          solarPower: 2.8,
          homePower: 3.1,
          batteryPower: -0.3, // discharging to assist solar
          gridPower: 0,
          chargeText: 'Discharging to assist load',
          statusDesc: 'High battery temperature (≥45°C). Grid charging disabled for thermal protection.',
          flowStatus: { solar: true, battery: true, grid: false, home: true },
          directions: { solar: 'down', battery: 'up', grid: 'none', home: 'right' }
        };
      case 'CRITICAL':
        return {
          status: 'CRITICAL',
          color: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
          batteryTemp: 51.5,
          batteryStatus: 'critical',
          batterySoc: 78,
          solarPower: 0.0,
          homePower: 3.1,
          batteryPower: 0.0, // battery isolated
          gridPower: 3.1, // fully grid powered
          chargeText: 'Safe Standby - isolated',
          statusDesc: 'Thermal threshold exceeded (≥50°C). Battery and Solar isolated. Inverter in Safe Standby.',
          flowStatus: { solar: false, battery: false, grid: true, home: true },
          directions: { solar: 'none', battery: 'none', grid: 'right', home: 'right' }
        };
      case 'OPTIMAL':
      default:
        return {
          status: 'OPTIMAL',
          color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
          batteryTemp: 34.1,
          batteryStatus: 'normal',
          batterySoc: 78,
          solarPower: 4.2,
          homePower: 3.1,
          batteryPower: 1.1, // surplus charging
          gridPower: 0.0,
          chargeText: 'Surplus charging battery',
          statusDesc: 'System functioning normally. Solar powering home and charging battery.',
          flowStatus: { solar: true, battery: true, grid: false, home: true },
          directions: { solar: 'down', battery: 'down', grid: 'none', home: 'right' }
        };
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
    // Add minor stable fluctuations for display realism
    const fl = (Math.sin(microTick + name.charCodeAt(0)) * 0.04);
    return (val + fl).toFixed(2);
  };

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
                  if (prev === 'WARNING') return 'CRITICAL';
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
            {/* SVG countdown circle */}
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

      {/* 2. THE POWER FLOW (Hero Element) */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow behind the diagram */}
        <div className="absolute w-[300px] h-[300px] bg-brand-accent/5 rounded-full filter blur-[80px] -z-10 pointer-events-none"></div>
        
        <div className="w-full max-w-[500px] aspect-square relative my-4">
          
          {/* SVG Connection Paths & Particle flows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
            {/* Defs for gradients & markers */}
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
              <linearGradient id="grad-home" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--color-brand-accent)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E2E8F0" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Static Connector Paths */}
            {/* Solar -> Inverter (Vertical down) */}
            <path d="M 200,80 L 200,165" stroke="var(--color-brand-deep)" strokeWidth="4" fill="none" />
            {/* Inverter -> Battery (Vertical down) */}
            <path d="M 200,235 L 200,320" stroke="var(--color-brand-deep)" strokeWidth="4" fill="none" />
            {/* Grid -> Inverter (Horizontal right) */}
            <path d="M 80,200 L 165,200" stroke="var(--color-brand-deep)" strokeWidth="4" fill="none" />
            {/* Inverter -> Home (Horizontal right) */}
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
                className="shadow-lg shadow-energy-solar/40"
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

            {/* Battery (Center -> Bottom or Bottom -> Center) */}
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

            {/* Grid (Left -> Center) */}
            {sys.flowStatus.grid && sys.directions.grid === 'right' && (
              <circle r="4" fill="var(--color-energy-grid)">
                <animateMotion dur="1.8s" repeatCount="indefinite" path="M 80,200 L 200,200" />
              </circle>
            )}

            {/* Home (Center -> Right) */}
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
              sys.flowStatus.grid ? 'border-blue-500 animate-pulse-grid shadow-lg shadow-blue-500/20' : 'border-brand-deep'
            } flex items-center justify-center`}>
              <Zap size={24} className={sys.flowStatus.grid ? 'text-blue-400 animate-pulse' : 'text-slate-600'} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wider uppercase">Utility Grid</span>
            <span className="text-sm font-bold font-mono-data text-blue-400 mt-0.5">{getTickedPower(sys.gridPower, 'grid')} kW</span>
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
            <span className="text-sm font-bold font-mono-data text-emerald-400 mb-0.5">{sys.batteryPower !== 0 ? (sys.batteryPower > 0 ? '+' : '') + getTickedPower(sys.batteryPower, 'battery') : '0.00'} kW</span>
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
              <span className="text-[9px] font-mono-data text-slate-400 font-bold leading-none uppercase">{sys.status === 'OPTIMAL' ? 'Opt' : sys.status === 'WARNING' ? 'Warn' : 'Safe'}</span>
            </div>
          </div>

        </div>
        
        {/* Safe Mode indicator label */}
        <div className="text-xs text-slate-400 max-w-sm text-center border-t border-brand-light/10 pt-4 mt-2">
          {sys.statusDesc}
        </div>
      </div>

      {/* 3. KEY STAT TILES */}
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
                sys.batteryStatus === 'normal' ? 'text-emerald-400' : sys.batteryStatus === 'warning' ? 'text-amber-400' : 'text-rose-400'
              }`}>{sys.batteryTemp.toFixed(1)}°C</span>
            </div>
            <AlertTriangle size={18} className={
              sys.batteryStatus === 'normal' ? 'text-emerald-500/30' : sys.batteryStatus === 'warning' ? 'text-amber-500 animate-bounce' : 'text-rose-500 animate-ping'
            } />
          </div>
          <div className="mt-4">
            {/* Simple thermal bar scale */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex relative">
              <div className="h-full bg-emerald-500" style={{ width: '75%' }}></div>
              <div className="h-full bg-amber-500" style={{ width: '10%' }}></div>
              <div className="h-full bg-rose-500" style={{ width: '15%' }}></div>
              {/* Slider thumb */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white border border-slate-950 transition-all duration-1000"
                style={{ left: `${Math.min(95, (sys.batteryTemp / 55) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] text-slate-500 mt-1 font-mono-data">
              <span>0°C</span>
              <span>45°C WARN</span>
              <span>50°C CRIT</span>
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
              {sys.batteryPower > 0 ? 'Surplus solar (Charging)' : sys.batteryPower < 0 ? 'Deficit (Discharging battery)' : 'Grid Powered (Standby)'}
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
            <span className="text-2xl font-black text-brand-glow font-mono-data mt-1 block">₱312.45</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Est. payback confidence</span>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-[10px] bg-brand-deep text-brand-accent px-1.5 py-0.5 rounded font-mono-data">CONF: MEASURED</span>
            {/* Sparkline simulation in inline SVG */}
            <svg className="w-16 h-6 stroke-brand-glow fill-none" viewBox="0 0 50 20">
              <path d="M0,18 L8,14 L16,16 L24,10 L32,12 L40,4 L48,2" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* 4. TODAY AT A GLANCE (Compact Strip) */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        
        <div className="flex flex-wrap justify-around w-full md:w-auto md:justify-start gap-6">
          <div className="text-center md:text-left">
            <span className="text-slate-400 block">Solar Generated</span>
            <span className="font-bold text-white font-mono-data">18.4 kWh</span>
          </div>
          <div className="border-r border-brand-light/25 hidden md:block"></div>
          <div className="text-center md:text-left">
            <span className="text-slate-400 block">Grid Imported</span>
            <span className="font-bold text-slate-300 font-mono-data">6.2 kWh</span>
          </div>
          <div className="border-r border-brand-light/25 hidden md:block"></div>
          
          <div className="flex items-center gap-3">
            <div>
              <span className="text-slate-400 block text-center md:text-left">Self-Sufficiency</span>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-accent h-full" style={{ width: '74%' }}></div>
                </div>
                <span className="font-bold text-brand-accent font-mono-data">74%</span>
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

      {/* 5. LIVE TICKER / RECENT ACTIVITY */}
      <div className="glass-panel p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-brand-light/20 pb-2">
          <span className="font-display font-semibold text-white text-sm uppercase tracking-wide">Live Microgrid Event Log</span>
          <span className="text-[10px] font-mono-data text-brand-accent">UPDATED REAL-TIME</span>
        </div>
        
        <div className="space-y-3 font-mono-data text-xs">
          
          {demoState === 'CRITICAL' ? (
            <div className="flex items-start gap-2.5 text-rose-400 bg-rose-950/20 border border-rose-900/40 p-2.5 rounded">
              <span className="text-slate-400 shrink-0">21:44</span>
              <span>•</span>
              <span className="font-semibold">CRITICAL: Battery safe isolation active. Temp 51.5°C &gt;= 50°C. Inverter in Safe Standby mode, whole home load bypassed to Grid.</span>
            </div>
          ) : demoState === 'WARNING' ? (
            <div className="flex items-start gap-2.5 text-amber-400 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded">
              <span className="text-slate-400 shrink-0">21:44</span>
              <span>•</span>
              <span className="font-semibold">WARNING: Battery temp 46.2°C &gt;= 45°C. Disabling charging from Grid. Battery helper discharge configured to support home load.</span>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded">
              <span className="text-slate-400 shrink-0">21:44</span>
              <span>•</span>
              <span>Surplus solar charging battery at 1.10 kW (0.1C). Load balanced.</span>
            </div>
          )}

          <div className="flex items-start gap-2.5 text-slate-300 pl-2">
            <span className="text-slate-500 shrink-0">06:32</span>
            <span className="text-slate-500">•</span>
            <span>Surplus solar charging battery at 1.25 kW (0.1C). Load fully offset.</span>
          </div>

          <div className="flex items-start gap-2.5 text-slate-300 pl-2">
            <span className="text-slate-500 shrink-0">02:00</span>
            <span className="text-slate-500">•</span>
            <span className="text-brand-accent">Nightly learning cycle complete. Load prediction models and breaker baselines refreshed.</span>
          </div>

          <div className="flex items-start gap-2.5 text-slate-300 pl-2">
            <span className="text-slate-500 shrink-0">22:00</span>
            <span className="text-slate-500">•</span>
            <span>Pre-charged battery to 75% SOC target based on Sunny weather forecast for tomorrow. (₱11.02/kWh rate window)</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Overview;
