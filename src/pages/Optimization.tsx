import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudLightning,
  Sparkles,
  Info,
  Moon
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

// 24 Hour battery charge/discharge timeline data
const ARBITRAGE_TIMELINE = [
  { hour: '00:00', SOC: 45, rate: 11.02 },
  { hour: '02:00', SOC: 60, rate: 11.02 },
  { hour: '04:00', SOC: 72, rate: 11.02 },
  { hour: '06:00', SOC: 75, rate: 11.02 }, // Fully pre-charged
  { hour: '08:00', SOC: 70, rate: 15.69 }, // Discharging for morning load
  { hour: '10:00', SOC: 62, rate: 15.69 },
  { hour: '12:00', SOC: 68, rate: 15.69 }, // Solar surplus charges slightly
  { hour: '14:00', SOC: 73, rate: 15.69 }, // Peak solar
  { hour: '16:00', SOC: 65, rate: 15.69 }, // Solar fading
  { hour: '18:00', SOC: 50, rate: 15.69 }, // Evening peak load discharge
  { hour: '20:00', SOC: 38, rate: 15.69 }, 
  { hour: '22:00', SOC: 30, rate: 11.02 }, // Night rate starts
  { hour: '24:00', SOC: 45, rate: 11.02 }
];

const Optimization: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Energy Optimization</h1>
        <p className="text-brand-accent/70 text-sm mt-1">
          Automated night arbitrage schedules and weather-aware pre-charge configuration presets.
        </p>
      </div>

      {/* SECTION A — NIGHT-RATE ARBITRAGE */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
          <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Moon size={18} className="text-indigo-400" /> Section A: Night-Rate Arbitrage
          </h2>
          <span className="text-[10px] font-mono-data bg-indigo-950/50 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/40 uppercase">ENABLED</span>
        </div>

        {/* Pricing Trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-brand-dark/40 border border-brand-light/10 p-4 rounded-xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-mono-data tracking-wider">Daytime Peak Rate</span>
            <span className="text-2xl font-black text-white font-mono-data mt-1 block">₱15.69<span className="text-xs font-normal text-slate-400">/kWh</span></span>
            <span className="text-[9px] text-slate-500 block mt-0.5">06:00 AM – 10:00 PM</span>
          </div>
          <div className="bg-brand-dark/40 border border-brand-light/10 p-4 rounded-xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-mono-data tracking-wider">Night Off-Peak Rate</span>
            <span className="text-2xl font-black text-brand-glow font-mono-data mt-1 block">₱11.02<span className="text-xs font-normal text-brand-accent/70">/kWh</span></span>
            <span className="text-[9px] text-slate-500 block mt-0.5">10:00 PM – 06:00 AM</span>
          </div>
          <div className="bg-brand-dark/40 border border-indigo-900/50 bg-indigo-950/10 p-4 rounded-xl text-center">
            <span className="text-indigo-400 text-[10px] uppercase font-mono-data tracking-wider">Arbitrage Delta</span>
            <span className="text-2xl font-black text-indigo-400 font-mono-data mt-1 block">₱4.67<span className="text-xs font-normal text-indigo-500/80">/kWh</span></span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Shifting margin saving</span>
          </div>
        </div>

        {/* Plain English explanation */}
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          "Like off-peak phone minutes for electricity — we fill the battery overnight at the cheap rate and run the house from it during expensive daytime hours."
        </p>

        {/* Timeline Chart */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono-data text-slate-400 block uppercase">24-Hour Battery SOC & Grid Cost Schedule Overlay</span>
          <div className="h-48 w-full bg-brand-dark/50 border border-brand-light/10 rounded-xl p-2.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={ARBITRAGE_TIMELINE}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSOC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-energy-battery)" stopOpacity="0.25"/>
                    <stop offset="95%" stopColor="var(--color-energy-battery)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 110, 103, 0.1)" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={9} className="font-mono-data" />
                <YAxis stroke="#64748b" fontSize={9} className="font-mono-data" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 34, 32, 0.95)', borderColor: 'rgba(42, 110, 103, 0.4)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '10px', color: '#94a3b8' }}
                />

                {/* Shading Cheap Night charge zone */}
                <ReferenceArea x1="00:00" x2="06:00" fill="rgba(16, 185, 129, 0.04)" label={{ value: "NIGHT CHEAP CHARGE", fill: "#10b981", fontSize: 7, position: "insideTop" }} />
                <ReferenceArea x1="22:00" x2="24:00" fill="rgba(16, 185, 129, 0.04)" label={{ value: "NIGHT CHEAP CHARGE", fill: "#10b981", fontSize: 7, position: "insideTop" }} />
                
                {/* Shading peak day discharge */}
                <ReferenceArea x1="06:00" x2="22:00" fill="rgba(245, 158, 11, 0.02)" label={{ value: "DAY PEAK DISCHARGE / SOLAR", fill: "#f59e0b", fontSize: 7, position: "insideTop" }} />

                <Area type="monotone" dataKey="SOC" name="Battery SOC (%)" stroke="var(--color-energy-battery)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSOC)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Added monthly value callout */}
        <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-indigo-400 uppercase font-mono-data tracking-wider block">Estimated Savings Impact</span>
            <span className="text-white font-semibold text-xs mt-1 block">Night-shifting battery arbitrage configuration adding monthly value</span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-lg font-black text-indigo-400 font-mono-data">₱4,500 – ₱5,000</span>
            <span className="text-[9px] text-slate-500 block">per month (Meralco rates)</span>
          </div>
        </div>

      </div>

      {/* SECTION B — WEATHER-DRIVEN PRE-CHARGE */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
          <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Sun size={18} className="text-amber-400" /> Section B: Weather-Driven Pre-Charge
          </h2>
          <span className="text-[10px] font-mono-data bg-amber-950/50 text-amber-400 px-2 py-0.5 rounded border border-amber-900/40 uppercase">ACTIVE PLAN</span>
        </div>

        <div className="bg-brand-dark/40 border border-brand-light/10 p-4 rounded-xl flex gap-3 text-xs text-slate-400">
          <Info size={16} className="text-brand-accent shrink-0 mt-0.5" />
          <p>
            At <span className="text-white font-semibold">2:00 AM nightly</span>, the system brain retrieves localized cloud forecasts. It automatically sets tomorrow's target State of Charge (SOC) to prevent drawing expensive grid energy while leaving enough battery headroom to absorb free morning solar.
          </p>
        </div>

        {/* Tonight's Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Tonight's target card */}
          <div className="md:col-span-5 bg-brand-dark/50 border border-brand-light/20 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[9px] font-mono-data text-brand-accent uppercase tracking-widest block">Tonight's Automation Target</span>
              <h3 className="text-white font-bold text-sm mt-1">Optimal Target: 75% SOC</h3>
            </div>
            
            <div className="flex items-center gap-4 py-2">
              {/* Target Gauge Visual */}
              <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(245, 158, 11, 0.1)" strokeWidth="4" fill="none" />
                  <circle 
                    cx="32" cy="32" r="28" 
                    stroke="var(--color-energy-solar)" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeDasharray="175.9" 
                    strokeDashoffset={175.9 - (175.9 * 75) / 100}
                  />
                </svg>
                <span className="absolute text-xs font-mono-data font-black text-amber-400">75%</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-400">Forecast: <strong className="text-white">Sunny & Clear</strong></span>
                <span className="text-[10px] text-emerald-400 block mt-1">Reason: Leaves 25% headroom to capture free morning solar.</span>
              </div>
            </div>

            <div className="border-t border-brand-light/10 pt-3 flex justify-between text-[10px] font-mono-data text-slate-500">
              <span>Current SOC: 78%</span>
              <span>Rate: Off-Peak (₱11.02)</span>
            </div>
          </div>

          {/* Rule library */}
          <div className="md:col-span-7 bg-brand-dark/30 border border-brand-light/10 rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[9px] font-mono-data text-slate-500 uppercase block mb-2">Automated Targeting Matrix</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-amber-950/20 border border-amber-900/50 text-amber-200">
                <span className="font-semibold flex items-center gap-1.5"><Sun size={12} /> Sunny / Clear (&ge;80% sun)</span>
                <span className="font-mono-data font-bold">75% Target</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-brand-deep/20 text-slate-400">
                <span className="flex items-center gap-1.5"><CloudSun size={12} /> Mild / Scattered (60–80%)</span>
                <span className="font-mono-data font-bold">80% Target</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-brand-deep/20 text-slate-400">
                <span className="flex items-center gap-1.5"><Cloud size={12} /> Heavy / Overcast (40–60%)</span>
                <span className="font-mono-data font-bold">88% Target</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded hover:bg-brand-deep/20 text-slate-400">
                <span className="flex items-center gap-1.5"><CloudLightning size={12} /> Rainy / Storm (&lt;40%)</span>
                <span className="font-mono-data font-bold">95% Target</span>
              </div>
            </div>
          </div>

        </div>

        {/* 48-Hour Forecast strip */}
        <div className="border-t border-brand-light/10 pt-4">
          <span className="text-[9px] font-mono-data text-slate-500 uppercase block mb-3">Localized 48h Forecast</span>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-brand-dark/30 p-2.5 rounded-lg border border-brand-light/10 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">Today</span>
              <Sun size={16} className="text-amber-400 my-1.5" />
              <span className="font-bold text-white">Sunny (85%)</span>
              <span className="text-[9px] font-mono-data text-slate-500 mt-1">Target: 75%</span>
            </div>
            <div className="bg-brand-dark/30 p-2.5 rounded-lg border border-brand-light/10 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">Tomorrow</span>
              <Sun size={16} className="text-amber-400 my-1.5" />
              <span className="font-bold text-white">Sunny (82%)</span>
              <span className="text-[9px] font-mono-data text-slate-500 mt-1">Target: 75%</span>
            </div>
            <div className="bg-brand-dark/30 p-2.5 rounded-lg border border-brand-light/10 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">Tuesday</span>
              <CloudSun size={16} className="text-slate-400 my-1.5" />
              <span className="font-bold text-slate-300">Mild (65%)</span>
              <span className="text-[9px] font-mono-data text-slate-500 mt-1">Target: 80%</span>
            </div>
            <div className="bg-brand-dark/30 p-2.5 rounded-lg border border-brand-light/10 flex flex-col items-center">
              <span className="text-slate-400 text-[10px]">Wednesday</span>
              <CloudLightning size={16} className="text-blue-400 my-1.5" />
              <span className="font-bold text-slate-300">Storm (20%)</span>
              <span className="text-[9px] font-mono-data text-slate-500 mt-1">Target: 95%</span>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION C — REAL-TIME BALANCING */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={16} className="text-brand-accent" /> Section C: 60-Second Real-Time Balancing
          </h2>
          <div className="flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>CURRENT MODE: SURPLUS SOLAR</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-3 text-xs text-slate-300">
            <h4 className="text-white font-semibold">Microgrid Routing Logic Rules:</h4>
            <ul className="space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                <strong>Net Power Equation:</strong> Computed every 60 seconds as <code className="bg-brand-dark px-1.5 py-0.5 rounded text-brand-glow">Net = Solar - House Load</code>.
              </li>
              <li>
                <strong>Surplus (&gt;+0.2 kW):</strong> Routes excess solar to battery charge (up to battery limit/temp safety).
              </li>
              <li>
                <strong>Deficit (&lt;0 kW):</strong> Battery discharges up to 2.5 kW maximum output (if SOC &gt;50%). Grid bridges if load exceeds 2.5 kW or SOC is low.
              </li>
            </ul>
          </div>

          <div className="bg-brand-dark/60 border border-brand-light/20 p-4 rounded-xl space-y-2.5 text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-white block mb-1">Anti-Cycling Safeguards</span>
            Built-in <span className="text-brand-glow font-semibold">0.2 kW hysteresis bands</span> and a <span className="text-brand-glow font-semibold">5-minute anti-cycling delay</span> prevent rapid switching on passing clouds. This reduces thermal stress on inverter relays, extending total system hardware lifecycle by up to 40%.
          </div>
        </div>
      </div>

    </div>
  );
};

export default Optimization;
