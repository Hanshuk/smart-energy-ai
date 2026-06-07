import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wind, 
  Droplet, 
  Cpu, 
  Layers, 
  ShowerHead,
  AlertTriangle, 
  ArrowRight, 
  X, 
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceArea, 
  CartesianGrid 
} from 'recharts';
import { CIRCUITS_DATA, type CircuitInfo, getChartDataForCircuit } from '../data/mockData';

// Helper to match icons
const getCircuitIcon = (code: string) => {
  switch (code) {
    case 'AC-MBR':
    case 'AC-LR':
      return Wind;
    case 'FRIDGE':
      return Layers;
    case 'PUMP':
      return Droplet;
    case 'WHT':
      return ShowerHead;
    case 'MAIN':
    default:
      return Cpu;
  }
};

const Circuits: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitInfo | null>(null);
  const [ticker, setTicker] = useState(0);

  // Tick generator to make values feel alive
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => (prev + 1) % 100);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTickedValues = (circuit: CircuitInfo) => {
    if (circuit.currentDrawKw === 0) return { kw: '0.00', amps: '0.0' };
    
    // Add tiny fluctuations based on ticker
    const fl = Math.sin(ticker + circuit.code.charCodeAt(0)) * 0.03;
    const kw = (circuit.currentDrawKw + fl).toFixed(2);
    const amps = (circuit.currentDrawAmps + fl * 4.3).toFixed(1);
    return { kw, amps };
  };

  const handleOpenDetail = (circuit: CircuitInfo) => {
    setSelectedCircuit(circuit);
  };

  const handleCloseDetail = () => {
    setSelectedCircuit(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Circuit Breaker Telemetry</h1>
        <p className="text-brand-accent/70 text-sm mt-1">
          Breaker-level True Power clamp sensors. Learned baselines flag abnormal draw.
        </p>
      </div>

      {/* Circuits List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CIRCUITS_DATA.map((circuit) => {
          const Icon = getCircuitIcon(circuit.code);
          const { kw, amps } = getTickedValues(circuit);
          const percentOfBaseline = circuit.baselineMedianKw > 0 
            ? ((parseFloat(kw) / circuit.baselineMedianKw) * 100).toFixed(0) 
            : '0';

          return (
            <div 
              key={circuit.code}
              onClick={() => handleOpenDetail(circuit)}
              className="glass-panel p-5 rounded-xl flex flex-col justify-between cursor-pointer hover:border-brand-accent/40 hover:bg-brand-dark/80 transition-all duration-300 group"
            >
              {/* Card Top */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg bg-brand-deep ${
                    circuit.status === 'fault' 
                      ? 'text-rose-400 border border-rose-900/50' 
                      : circuit.status === 'advisory' 
                      ? 'text-amber-400 border border-amber-900/50' 
                      : 'text-brand-accent border border-brand-light/10'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-data text-xs font-bold text-brand-accent uppercase tracking-wider">{circuit.code}</span>
                      <span className="text-[10px] text-slate-500 font-mono-data">· {circuit.specs}</span>
                    </div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-brand-glow transition-colors mt-0.5">{circuit.name}</h3>
                  </div>
                </div>

                {/* Status Badges */}
                {circuit.status === 'fault' && (
                  <span className="bg-rose-950/40 border border-rose-800/60 text-rose-400 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase flex items-center gap-1">
                    <AlertTriangle size={10} /> FAULT
                  </span>
                )}
                {circuit.status === 'advisory' && (
                  <span className="bg-amber-950/40 border border-amber-800/60 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase flex items-center gap-1">
                    <AlertTriangle size={10} /> ADVISORY
                  </span>
                )}
                {circuit.status === 'normal' && (
                  <span className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    NORMAL
                  </span>
                )}
                {circuit.status === 'learning' && (
                  <span className="bg-slate-800 border border-slate-700 text-slate-400 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
                    LEARNING
                  </span>
                )}
              </div>

              {/* Card Middle: Current power */}
              <div className="my-4 flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Current Load:</span>
                <div className="text-right">
                  <span className="text-lg font-black font-mono-data text-white">{kw} kW</span>
                  <span className="text-xs font-mono-data text-slate-400 block mt-0.5">({amps}A @ 230V)</span>
                </div>
              </div>

              {/* Card Bottom: Baseline Bar Graphic */}
              <div className="space-y-1.5 border-t border-brand-light/10 pt-3 mt-1">
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span>Median Baseline ({circuit.baselineMedianKw.toFixed(2)} kW)</span>
                  <span className={circuit.status === 'fault' ? 'text-rose-400 font-semibold' : circuit.status === 'advisory' ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                    {percentOfBaseline}% of baseline
                  </span>
                </div>
                
                {/* Visual meter */}
                <div className="h-2 w-full bg-slate-800/50 rounded-full relative overflow-hidden">
                  {/* Learned baseline bounds (shaded area) */}
                  <div className="absolute top-0 bottom-0 bg-brand-light/25 w-2/5 left-[30%]"></div>
                  {/* Current reading indicator */}
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      circuit.status === 'fault' 
                        ? 'bg-rose-500' 
                        : circuit.status === 'advisory' 
                        ? 'bg-amber-500' 
                        : 'bg-brand-accent'
                    }`}
                    style={{ width: `${Math.min(100, (parseFloat(kw) / (circuit.baselineMedianKw * 1.8)) * 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono-data pt-0.5">
                  <span>Ref: {circuit.confidence}</span>
                  {circuit.anomalyMinutes > 0 && (
                    <span className="text-rose-400">High load: {circuit.anomalyMinutes} min</span>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Detail Modal Overlay */}
      {selectedCircuit && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-brand-light/45 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-light/20 flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-deep rounded-xl border border-brand-light/20 text-brand-accent">
                  {React.createElement(getCircuitIcon(selectedCircuit.code), { size: 22 })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data text-xs font-black text-brand-glow uppercase tracking-wider">{selectedCircuit.code}</span>
                    <span className="text-xs text-slate-400">· {selectedCircuit.specs}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">{selectedCircuit.name}</h2>
                </div>
              </div>
              
              <button 
                onClick={handleCloseDetail}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-brand-deep transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* 24-Hour Recharts Chart */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">24-Hour Telemetry Graph</span>
                  <div className="flex items-center gap-3 font-mono-data text-[10px]">
                    <span className="flex items-center gap-1 text-brand-glow">
                      <span className="h-1.5 w-3 bg-brand-accent rounded-sm"></span> Actual Draw
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="h-1.5 w-3 bg-brand-light/30 rounded-sm"></span> Median Baseline
                    </span>
                  </div>
                </div>

                <div className="h-48 w-full bg-brand-dark/50 rounded-xl border border-brand-light/10 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getChartDataForCircuit(selectedCircuit.code)}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={selectedCircuit.status === 'fault' ? '#ef4444' : 'var(--color-brand-accent)'} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={selectedCircuit.status === 'fault' ? '#ef4444' : 'var(--color-brand-accent)'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 110, 103, 0.1)" />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={9} className="font-mono-data" />
                      <YAxis stroke="#64748b" fontSize={9} className="font-mono-data" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 34, 32, 0.95)', borderColor: 'rgba(42, 110, 103, 0.4)', borderRadius: '8px' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                        itemStyle={{ fontSize: '11px' }}
                      />
                      
                      {/* Highlight anomaly window for AC-MBR */}
                      {selectedCircuit.code === 'AC-MBR' && (
                        <ReferenceArea 
                          x1="12:00" 
                          x2="16:00" 
                          fill="rgba(239, 68, 68, 0.08)" 
                          stroke="rgba(239, 68, 68, 0.2)"
                          strokeDasharray="3 3"
                          label={{ value: 'ANOMALY AREA', fill: '#f87171', fontSize: 8, position: 'insideTopLeft' }}
                        />
                      )}

                      <Area type="monotone" dataKey="actual" name="Actual Draw (kW)" stroke={selectedCircuit.status === 'fault' ? '#ef4444' : 'var(--color-brand-accent)'} strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                      <Area type="monotone" dataKey="baseline" name="Baseline (kW)" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" fill="none" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono-data">
                <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 block uppercase">Live Draw</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {getTickedValues(selectedCircuit).kw} kW
                  </span>
                </div>
                <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 block uppercase">Today's Total</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {selectedCircuit.todayKwh.toFixed(1)} kWh
                  </span>
                </div>
                <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 block uppercase">30D Median</span>
                  <span className="text-sm font-bold text-white mt-1 block">
                    {selectedCircuit.baselineMedianKw.toFixed(2)} kW
                  </span>
                </div>
                <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg text-center">
                  <span className="text-[9px] text-slate-500 block uppercase">Bounds</span>
                  <span className="text-sm font-bold text-brand-accent mt-1 block">
                    {selectedCircuit.operatingRange.split(' ')[0]}
                  </span>
                </div>
              </div>

              {/* Anomaly Rule Callout */}
              <div className="bg-brand-dark/80 border border-brand-light/20 p-4 rounded-xl flex gap-3 text-xs text-slate-400">
                <Info size={16} className="text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block mb-1">Standard Anomaly Detection Filter</span>
                  Any circuit drawing more than <span className="text-brand-glow font-semibold">15% above its 30-day median baseline</span> for <span className="text-brand-glow font-semibold">15 consecutive minutes</span> triggers a diagnostic alarm.
                </div>
              </div>

              {/* Case-specific description */}
              {selectedCircuit.code === 'AC-MBR' && (
                <div className="border border-rose-900/40 bg-rose-950/15 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                      <AlertTriangle size={14} /> DIAGNOSTIC ALERT: COMPRESSOR FAULT
                    </span>
                    <p className="text-xs text-slate-400 max-w-md">
                      Current draw exceeds threshold by 55% for 22 straight minutes. Indicates signature compressor degradation.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      handleCloseDetail();
                      navigate('/faults');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    View AI Diagnosis <ArrowRight size={12} />
                  </button>
                </div>
              )}

              {selectedCircuit.code === 'FRIDGE' && (
                <div className="border border-amber-900/40 bg-amber-950/15 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle size={14} /> ADVISORY: DOOR SEAL DEGRADATION
                    </span>
                    <p className="text-xs text-slate-400 max-w-md">
                      Compressor runs 72% of the hour (baseline 45%). Indicates cold loss likely from a broken door gasket.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      handleCloseDetail();
                      navigate('/faults');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-950/60 border border-amber-800 text-amber-300 hover:bg-amber-900/50 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    View AI Diagnosis <ArrowRight size={12} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Circuits;
