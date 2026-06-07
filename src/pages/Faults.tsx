import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  ArrowRight, 
  Activity, 
  Layers, 
  Search, 
  Wind
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

// Waveform data for the startup spike comparison
const STARTUP_WAVEFORM_DATA = [
  { time: '0s', normal: 0, abnormal: 0 },
  { time: '0.1s', normal: 0.8, abnormal: 1.5 },
  { time: '0.2s', normal: 1.8, abnormal: 3.2 },
  { time: '0.3s', normal: 2.2, abnormal: 4.8 }, // Normal peak
  { time: '0.4s', normal: 1.2, abnormal: 4.5 },
  { time: '0.5s', normal: 0.9, abnormal: 3.8 }, // Normal settles
  { time: '0.6s', normal: 0.8, abnormal: 3.6 },
  { time: '0.7s', normal: 0.8, abnormal: 3.4 },
  { time: '0.8s', normal: 0.8, abnormal: 3.0 },
  { time: '0.9s', normal: 0.8, abnormal: 2.5 },
  { time: '1.0s', normal: 0.8, abnormal: 1.8 }, // Abnormal slowly settles
  { time: '1.2s', normal: 0.8, abnormal: 1.1 },
  { time: '1.4s', normal: 0.8, abnormal: 0.9 },
  { time: '1.6s', normal: 0.8, abnormal: 0.8 }, // Settled
];

interface LibrarySignature {
  appliance: string;
  signature: string;
  cause: string;
  action: string;
  isActive: boolean;
  type: 'fault' | 'advisory' | 'none';
}

const FAULT_LIBRARY: LibrarySignature[] = [
  {
    appliance: 'AC Air Flow',
    signature: 'Current 10–20% above median, normal startup',
    cause: 'Clogged filter / dirty coils',
    action: 'Clean filter & basic service',
    isActive: false,
    type: 'none'
  },
  {
    appliance: 'AC Coolant',
    signature: 'Draw 15–25% below median under high demand',
    cause: 'Low refrigerant',
    action: 'Leak check & top-up',
    isActive: false,
    type: 'none'
  },
  {
    appliance: 'AC Compressor',
    signature: 'Startup spike >3× normal, longer start',
    cause: 'Motor friction / mechanical binding',
    action: 'Compressor overhaul or unit replacement',
    isActive: true,
    type: 'fault'
  },
  {
    appliance: 'AC Start Capacitor',
    signature: 'Startup spike >4× but very brief',
    cause: 'Degraded start capacitor',
    action: 'Low-cost capacitor swap',
    isActive: false,
    type: 'none'
  },
  {
    appliance: 'Refrigerator',
    signature: 'Run-time up 20–40%, tighter cycling',
    cause: 'Worn door seal / heat leak',
    action: 'Inspect and replace magnetic gasket',
    isActive: true,
    type: 'advisory'
  },
  {
    appliance: 'Water Pump',
    signature: 'Current 15–25% up, unstable spikes',
    cause: 'Worn bearings / friction',
    action: 'Replace bearings before seizure',
    isActive: false,
    type: 'none'
  }
];

const Faults: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Predictive Fault AI</h1>
        <p className="text-brand-accent/70 text-sm mt-1">
          Machine learning diagnostics match telemetry signatures against known failure modes before breakdowns occur.
        </p>
      </div>

      {/* TOP SECTION — ACTIVE DIAGNOSES */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
          <Activity size={18} className="text-brand-accent animate-pulse" /> Active Diagnoses
        </h2>

        <div className="grid grid-cols-1 gap-6">
          
          {/* AC-MBR Diagnosis Card */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-rose-500 bg-rose-950/5 hover:bg-rose-950/10 transition-all duration-300 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-400">
                  <Wind size={22} className="animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono-data">
                    <span className="font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/50 uppercase">ACTION REQUIRED</span>
                    <span className="text-slate-400">CIRCUIT: AC-MBR · Master Bedroom AC 3.5 HP</span>
                    <span className="text-slate-500">· CONFIDENCE: BILL-RECONCILED</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1.5">Degrading Compressor Motor (Mechanical binding)</h3>
                  <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
                    "Your bedroom aircon is straining harder to start than it used to — a classic sign of a tiring compressor. Acting now avoids a breakdown on the hottest day."
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Waveform Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* wave chart */}
              <div className="md:col-span-7 space-y-2">
                <span className="text-[10px] font-mono-data text-slate-400 block uppercase">Startup Fingerprint Waveform (kW vs Time)</span>
                <div className="h-44 w-full bg-brand-dark/50 border border-brand-light/10 rounded-xl p-2.5">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={STARTUP_WAVEFORM_DATA}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAbnormal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity="0.25"/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity="0"/>
                        </linearGradient>
                        <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity="0.15"/>
                          <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#64748b" fontSize={9} className="font-mono-data" />
                      <YAxis stroke="#64748b" fontSize={9} className="font-mono-data" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 34, 32, 0.95)', borderColor: 'rgba(239, 68, 68, 0.4)', borderRadius: '8px' }}
                        labelStyle={{ fontSize: '10px', color: '#94a3b8' }}
                      />
                      <Area type="monotone" dataKey="abnormal" name="Abnormal Startup" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAbnormal)" />
                      <Area type="monotone" dataKey="normal" name="Nominal Baseline" stroke="var(--color-brand-accent)" strokeWidth={1.5} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorNormal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* description and action details */}
              <div className="md:col-span-5 space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg font-mono-data">
                    <span className="text-slate-400 block text-[9px] uppercase">Detected Signature:</span>
                    <span className="text-rose-400 font-semibold mt-0.5 block">Startup spike &gt;3.1× nominal (4.8 kW) sustained over 0.9s</span>
                  </div>
                  <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg font-mono-data">
                    <span className="text-slate-400 block text-[9px] uppercase">Recommended Remedy:</span>
                    <span className="text-slate-200 font-semibold mt-0.5 block flex items-center gap-1.5">
                      <Wrench size={12} className="text-brand-accent" /> Compressor overhaul / high-eff upgrade
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/upgrade')}
                  className="w-full flex items-center justify-center gap-2 bg-rose-950/60 border border-rose-800 text-rose-200 hover:bg-rose-900/50 py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-rose-950/20"
                >
                  See Replacement Options <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>

          {/* FRIDGE Diagnosis Card */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-amber-500 bg-amber-950/5 hover:bg-amber-950/10 transition-all duration-300 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-400">
                  <Layers size={22} className="animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2 text-[10px] font-mono-data">
                    <span className="font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50 uppercase">ADVISORY</span>
                    <span className="text-slate-400">CIRCUIT: FRIDGE · Kitchen Refrigerator</span>
                    <span className="text-slate-500">· CONFIDENCE: MEASURED</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-1.5">Worn Refrigerator Door Seal (Heat Leakage)</h3>
                  <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
                    "Your refrigerator is running more frequently than normal to stay cold, pointing to a leaky magnetic door gasket. Replacing it restores insulation and reduces power creep."
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-light/10 pt-4 mt-2 text-xs">
              <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg font-mono-data">
                <span className="text-slate-400 block text-[9px] uppercase">Detected Signature:</span>
                <span className="text-amber-400 font-semibold mt-0.5 block">Duty cycle creep up +35% (Compressor active 72% of runtime)</span>
              </div>
              <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg font-mono-data">
                <span className="text-slate-400 block text-[9px] uppercase">Recommended Gasket Remedy:</span>
                <span className="text-slate-200 font-semibold mt-0.5 block flex items-center gap-1.5">
                  <Wrench size={12} className="text-brand-accent" /> Inspect door seal gaskets & clean magnet core
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MIDDLE SECTION — HOW DETECTION WORKS */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">How Predictive Fault Detection Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-dark/30 border border-brand-light/10 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <span className="h-6 w-6 rounded-full bg-brand-deep border border-brand-light/35 text-brand-glow text-xs font-bold font-mono-data flex items-center justify-center mb-3">01</span>
              <h4 className="text-white font-semibold text-sm mb-1">Baseline Learning</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Nightly cycles compile a 30-day median hourly power baseline for every breaker. Median averages block fluke spikes.
              </p>
            </div>
          </div>
          <div className="bg-brand-dark/30 border border-brand-light/10 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <span className="h-6 w-6 rounded-full bg-brand-deep border border-brand-light/35 text-brand-glow text-xs font-bold font-mono-data flex items-center justify-center mb-3">02</span>
              <h4 className="text-white font-semibold text-sm mb-1">Telemetry Monitoring</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Breaker draw is cross-checked every 60s. A deviation &gt;15% above median sustained for 15+ minutes triggers evaluation.
              </p>
            </div>
          </div>
          <div className="bg-brand-dark/30 border border-brand-light/10 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <span className="h-6 w-6 rounded-full bg-brand-deep border border-brand-light/35 text-brand-glow text-xs font-bold font-mono-data flex items-center justify-center mb-3">03</span>
              <h4 className="text-white font-semibold text-sm mb-1">Pattern Matching</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The wave signature of the surge is matched against our electrical library to diagnose compressor, capacitor, or bearing wear.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION — FAULT SIGNATURE LIBRARY */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Search size={16} className="text-brand-accent" /> System Diagnosis Reference Gasket Library
          </h2>
          <span className="text-[9px] font-mono-data text-brand-accent/75 uppercase">Safe Telemetry database</span>
        </div>

        {/* Scrollable table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-brand-light/10 text-slate-400 text-[10px] uppercase font-mono-data">
                <th className="py-2.5 px-3">Appliance Component</th>
                <th className="py-2.5 px-3">Electrical Signature</th>
                <th className="py-2.5 px-3">Likely Root Cause</th>
                <th className="py-2.5 px-3">Recommended Remedy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light/10">
              {FAULT_LIBRARY.map((item, idx) => {
                let rowStyle = "hover:bg-brand-deep/20 transition-all";
                if (item.type === 'fault') {
                  rowStyle = "bg-rose-950/20 border-l-2 border-l-rose-500 hover:bg-rose-950/30 transition-all text-rose-200";
                } else if (item.type === 'advisory') {
                  rowStyle = "bg-amber-950/20 border-l-2 border-l-amber-500 hover:bg-amber-950/30 transition-all text-amber-200";
                }

                return (
                  <tr key={idx} className={rowStyle}>
                    <td className="py-3.5 px-3 font-semibold flex items-center gap-2">
                      {item.appliance}
                      {item.isActive && (
                        <span className={`h-1.5 w-1.5 rounded-full animate-ping ${item.type === 'fault' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono-data text-slate-300">{item.signature}</td>
                    <td className="py-3.5 px-3 text-slate-300">{item.cause}</td>
                    <td className="py-3.5 px-3 text-slate-200 font-medium">{item.action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Faults;
