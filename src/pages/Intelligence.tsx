import React, { useEffect, useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Sun, 
  CloudSun, 
  CloudLightning, 
  Battery, 
  Info,
  Flame,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { SIMULATION_DATA, TIME_BLOCK_LABELS } from '../data/mockData';

interface IntelligenceProps {
  currentDayIndex: number;
  setCurrentDayIndex: React.Dispatch<React.SetStateAction<number>>;
  currentBlockIndex: number;
  setCurrentBlockIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

// Predicted load curve vs prepared reserve
const PREDICTION_VS_RESERVE_DATA = [
  { time: '00:00', predictedLoad: 0.8, reserveSoc: 40 },
  { time: '02:00', predictedLoad: 0.7, reserveSoc: 55 },
  { time: '04:00', predictedLoad: 0.6, reserveSoc: 70 },
  { time: '06:00', predictedLoad: 2.2, reserveSoc: 75 }, // morning peak prep
  { time: '08:00', predictedLoad: 2.5, reserveSoc: 68 }, // discharges for morning AC/heater
  { time: '10:00', predictedLoad: 1.8, reserveSoc: 72 }, // solar fills back up
  { time: '12:00', predictedLoad: 3.1, reserveSoc: 82 }, // peak solar fill
  { time: '14:00', predictedLoad: 3.5, reserveSoc: 85 },
  { time: '16:00', predictedLoad: 2.8, reserveSoc: 78 }, // solar fading
  { time: '18:00', predictedLoad: 4.2, reserveSoc: 55 }, // evening cooking/AC peak
  { time: '20:00', predictedLoad: 3.8, reserveSoc: 38 },
  { time: '22:00', predictedLoad: 1.5, reserveSoc: 30 },
  { time: '24:00', predictedLoad: 0.9, reserveSoc: 40 }
];

// Seeded pre-charge forecast schedule matching the 7-day simulator
const PRE_CHARGE_DECISONS = [
  {
    dayIdx: 0,
    dayName: 'Monday',
    demandType: 'Normal Weekday',
    demandFactor: '1.0x baseline',
    weather: 'Sunny',
    weatherIcon: Sun,
    weatherColor: 'text-amber-400',
    targetSoc: 75,
    action: 'Maintain standard 75% target.',
    reasoning: 'Standard weekday demand + high solar yield forecast. Preserves 25% battery headroom to absorb free midday solar.'
  },
  {
    dayIdx: 1,
    dayName: 'Tuesday',
    demandType: 'Normal Weekday',
    demandFactor: '0.95x baseline',
    weather: 'Sunny',
    weatherIcon: Sun,
    weatherColor: 'text-amber-400',
    targetSoc: 75,
    action: 'Maintain standard 75% target.',
    reasoning: 'Mild weekday demand + optimal weather. Battery reserve will comfortably bridge evening peak without grid support.'
  },
  {
    dayIdx: 2,
    dayName: 'Wednesday',
    demandType: 'Holiday (Elevated)',
    demandFactor: '1.35x baseline',
    weather: 'Rainy / Storm',
    weatherIcon: CloudLightning,
    weatherColor: 'text-blue-400 animate-pulse',
    targetSoc: 95,
    action: 'Proactively charge to 95% target tonight.',
    reasoning: 'CRITICAL PRE-CHARGE: Tomorrow is a public holiday (+35% load) with heavy storm forecast (<15% solar yield). Pre-filling battery at cheap night rates to avoid high peak daytime grid imports.'
  },
  {
    dayIdx: 3,
    dayName: 'Thursday',
    demandType: 'Normal Weekday',
    demandFactor: '1.02x baseline',
    weather: 'Mild / Overcast',
    weatherIcon: CloudSun,
    weatherColor: 'text-slate-400',
    targetSoc: 80,
    action: 'Elevate target to 80% SOC.',
    reasoning: 'Slightly higher weekday load + moderate cloud forecast. Extra 5% buffer guarantees grid-free evening peak operations.'
  },
  {
    dayIdx: 4,
    dayName: 'Friday',
    demandType: 'Normal Weekday',
    demandFactor: '1.08x baseline',
    weather: 'Sunny',
    weatherIcon: Sun,
    weatherColor: 'text-amber-400',
    targetSoc: 75,
    action: 'Maintain standard 75% target.',
    reasoning: 'Optimal clear sky forecast allows system to rely heavily on self-generated solar during daytime load increases.'
  },
  {
    dayIdx: 5,
    dayName: 'Saturday',
    demandType: 'Weekend (High)',
    demandFactor: '1.45x baseline',
    weather: 'Mild / Overcast',
    weatherIcon: CloudSun,
    weatherColor: 'text-slate-400',
    targetSoc: 90,
    action: 'Raise target to 90% SOC tonight.',
    reasoning: 'WEEKEND PREPARATION: Learned weekend usage patterns (+45% AC/household load) combined with scattered clouds. Pre-charging to 90% on cheap overnight power.'
  },
  {
    dayIdx: 6,
    dayName: 'Sunday',
    demandType: 'Weekend (High)',
    demandFactor: '1.38x baseline',
    weather: 'Sunny',
    weatherIcon: Sun,
    weatherColor: 'text-amber-400',
    targetSoc: 85,
    action: 'Raise target to 85% SOC.',
    reasoning: 'Weekend load profile remains elevated. High solar index allows a slightly lower pre-charge target compared to Saturday.'
  }
];

const Intelligence: React.FC<IntelligenceProps> = ({ 
  currentDayIndex,
  currentBlockIndex
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  // Determine if simulator is in a night block (21:00-24:00, 00:00-03:00, 03:00-06:00)
  // Which corresponds to block indexes: 7, 0, 1
  const isNightBlock = currentBlockIndex === 7 || currentBlockIndex === 0 || currentBlockIndex === 1;

  // The pre-charge target is executing for the "Next Day". 
  // Let's find which day the pre-charge is preparing for.
  // If it is night, we are pre-charging for tomorrow (currentDayIndex + 1) % 7.
  const targetPlanningDayIdx = isNightBlock ? (currentDayIndex + 1) % 7 : currentDayIndex;

  // Helper to map block load to color intensity
  const getHeatmapColor = (load: number) => {
    // Normal range: 0.7 kW (colder) to 5.0 kW (hottest)
    if (load <= 1.0) return 'bg-[#0a1e1b] border-[#133c37]/50 text-slate-500';
    if (load <= 2.0) return 'bg-[#0f3b35] border-[#1e6157]/50 text-brand-accent/70';
    if (load <= 3.0) return 'bg-[#185e54] border-[#299586]/60 text-brand-glow';
    if (load <= 4.0) return 'bg-[#299586] text-brand-bg font-extrabold border-emerald-400/40';
    return 'bg-[#4ee5cf] text-brand-bg font-black border-white/50 animate-pulse';
  };

  return (
    <div className={`space-y-8 transition-opacity duration-1000 ${animate ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* 1. HEADER & LEARNING STATUS BANNER */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Brain className="text-brand-accent animate-pulse-glow" size={32} /> Usage Intelligence
          </h1>
          <p className="text-brand-accent/70 text-sm mt-1">
            Resident microgrid loading prediction models, learned usage heatmaps, and proactive battery pre-charge reasoning feeds.
          </p>
        </div>

        {/* Status Strip Banner */}
        <div className="glass-panel p-4 rounded-xl border border-brand-light/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-brand-deep/30">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div className="text-xs">
              <span className="font-extrabold text-white block uppercase tracking-wide">Predictive AI Brain Active</span>
              <p className="text-slate-400 text-[10px] mt-0.5 font-mono-data">
                Model Trained · <strong className="text-brand-accent">94 Days History</strong> · Confidence: <strong className="text-emerald-400">HIGH</strong> · Bill-Reconciled
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono-data text-slate-500 bg-brand-dark px-3 py-1.5 rounded border border-brand-light/10">
            Last model sync: Today at 02:00 AM (Refreshes nightly)
          </div>
        </div>
      </div>

      {/* 2. THE LEARNED USAGE HEATMAP */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-brand-light/20 pb-2">
          <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar size={18} className="text-brand-accent" /> Section A: Learned Weekly Load Heatmap
          </h2>
          <span className="text-[10px] font-mono-data text-slate-400">AVERAGE POWER DRAW (kW) BY TIME BLOCK</span>
        </div>

        {/* Grid Heatmap */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] space-y-2">
            
            {/* Heatmap header timeline labels */}
            <div className="grid grid-cols-9 gap-1.5 text-center text-[9px] font-mono-data text-slate-500 font-extrabold pb-1">
              <span>DAY</span>
              {TIME_BLOCK_LABELS.map((block) => (
                <span key={block} className="truncate">{block.split('–')[0]}</span>
              ))}
            </div>

            {/* Heatmap Rows */}
            {SIMULATION_DATA.map((day, dIdx) => (
              <div key={day.dayName} className="grid grid-cols-9 gap-1.5 items-center">
                {/* Row Header Label */}
                <div className={`text-[10px] font-bold py-2 px-1 rounded font-mono-data text-center ${
                  currentDayIndex === dIdx ? 'bg-brand-deep text-brand-glow border border-brand-accent/40' : 'text-slate-400'
                }`}>
                  {day.dayShort} {day.isHoliday ? '🎉' : day.isWeekend ? '💤' : ''}
                </div>

                {/* Cells */}
                {day.blocks.map((block, bIdx) => {
                  const isActiveCell = currentDayIndex === dIdx && currentBlockIndex === bIdx;
                  return (
                    <div 
                      key={bIdx}
                      className={`py-3.5 px-1 rounded-lg border text-[10px] font-mono-data text-center transition-all duration-300 ${getHeatmapColor(block.houseLoadKw)} ${
                        isActiveCell ? 'ring-2 ring-brand-glow ring-offset-2 ring-offset-brand-bg scale-102 font-black shadow-lg shadow-brand-accent/25' : 'hover:scale-102'
                      }`}
                      title={`${day.dayName} at ${block.timeLabel}: ${block.houseLoadKw} kW`}
                    >
                      {block.houseLoadKw.toFixed(1)} kW
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Takeaway and Legend */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-brand-light/10 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-400">
            <span className="font-extrabold text-[10px] text-slate-500 uppercase">HEATMAP SCALE:</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-[#0a1e1b] border border-[#133c37]/50 block"></span> &lt;1.0 kW (Off-Peak)</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-[#0f3b35] border border-[#1e6157]/50 block"></span> 1.0–2.0 kW (Mild)</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-[#185e54] border border-[#299586]/60 block"></span> 2.0–3.0 kW (Warm)</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-[#299586] block"></span> 3.0–4.0 kW (Peak)</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-[#4ee5cf] block animate-pulse"></span> &gt;4.0 kW (Extreme AC)</span>
          </div>

          <div className="text-[11px] text-brand-accent font-semibold italic bg-brand-deep/20 border border-brand-light/20 py-1.5 px-3 rounded-lg leading-snug">
            💡 <strong>Takeaway:</strong> Weekend loads run 28% higher. Public Holiday Wednesday (Day 3) records the highest peak loads (4.7 kW) due to 100% occupancy cooling demands.
          </div>
        </div>
      </div>

      {/* 3. LEARNED INSIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-xl border border-brand-light/25 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono-data text-brand-accent uppercase tracking-widest block font-extrabold">WEEKEND DRIFT</span>
            <Flame size={14} className="text-amber-500" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white font-mono-data leading-none">Weekends +28%</h4>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              Saturday/Sunday show elevated daytime base draws. Inverter ramps up solar offset early.
            </p>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-[28%]" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-brand-light/25 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono-data text-brand-accent uppercase tracking-widest block font-extrabold">HOLIDAY PEAK</span>
            <TrendingUp size={14} className="text-brand-glow animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white font-mono-data leading-none">Holidays +40%</h4>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              Occupancy increases home loading. Heat peaks during midday solar cycles.
            </p>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-brand-glow h-full w-[40%]" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-brand-light/25 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono-data text-brand-accent uppercase tracking-widest block font-extrabold">EVENING SPIKE</span>
            <Zap size={14} className="text-[#3ec2b3]" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white font-mono-data leading-none">6:00 – 9:00 PM</h4>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              Cooking and air conditioning spike. Battery shifts load fully off-grid.
            </p>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-[#3ec2b3] h-full w-[75%]" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-brand-light/25 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-[9px] font-mono-data text-brand-accent uppercase tracking-widest block font-extrabold">AM PUMP TRIGGER</span>
            <Calendar size={14} className="text-indigo-400" />
          </div>
          <div>
            <h4 className="text-lg font-black text-white font-mono-data leading-none">6:00 – 8:00 AM</h4>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              Predictable water-heater shower draw. Automatically supported by grid arbitrage.
            </p>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="bg-indigo-400 h-full w-[15%]" />
          </div>
        </div>

      </div>

      {/* 4. SMART PRE-CHARGE DECISION FEED & PREDICTED CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Decision feed list (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-brand-light/20 pb-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Battery size={18} className="text-brand-accent animate-pulse" /> Section B: AI Pre-Charge Decisions
            </h3>
            {isNightBlock && (
              <div className="flex items-center gap-1.5 bg-rose-950/45 border border-rose-900/50 text-rose-400 text-[8px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                <span className="h-1 w-1 rounded-full bg-rose-400 animate-ping"></span>
                <span>Active Pre-charge Window Open</span>
              </div>
            )}
          </div>

          {/* Interactive simulator connection display */}
          <div className="bg-brand-dark/45 border border-brand-light/25 p-4 rounded-xl flex gap-3 text-xs">
            <Info size={16} className="text-brand-accent shrink-0 mt-0.5" />
            <p className="text-slate-300">
              The feed below responds to the global timeline simulator. Under night blocks <strong className="text-white">21:00–06:00</strong>, the active pre-charge task runs. Headroom calculations merge weather indices and learned load expectations to target optimal SOC.
            </p>
          </div>

          {/* Pre-charge schedule lists */}
          <div className="space-y-4">
            {PRE_CHARGE_DECISONS.map((decision) => {
              const isPlanningDay = decision.dayIdx === targetPlanningDayIdx;
              const isExecutingPlanNow = isPlanningDay && isNightBlock;
              const WeatherIconComponent = decision.weatherIcon;

              return (
                <div 
                  key={decision.dayIdx}
                  className={`p-4 rounded-xl border transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 ${
                    isExecutingPlanNow 
                      ? 'bg-brand-deep border-brand-accent ring-1 ring-brand-glow shadow-md shadow-brand-accent/5'
                      : isPlanningDay 
                      ? 'bg-brand-dark border-brand-light/35'
                      : 'bg-brand-dark/20 border-brand-light/10 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-sm text-white">{decision.dayName}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        decision.dayIdx === 2
                          ? 'bg-purple-950/65 text-purple-400 border-purple-900/40'
                          : decision.dayIdx >= 5
                          ? 'bg-blue-950/65 text-blue-400 border-blue-900/40'
                          : 'bg-brand-dark border-brand-light/20 text-slate-400'
                      }`}>
                        {decision.demandType} ({decision.demandFactor})
                      </span>
                      {isExecutingPlanNow && (
                        <span className="text-[8px] bg-rose-500/15 border border-rose-500/30 text-rose-400 font-black px-1.5 py-0.5 rounded tracking-wide uppercase animate-pulse">
                          Active execution
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-300 leading-snug">{decision.reasoning}</p>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-brand-light/10 pt-2.5 md:pt-0 shrink-0 min-w-[130px]">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <WeatherIconComponent size={14} className={decision.weatherColor} />
                      <span>{decision.weather}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono-data text-slate-500 block leading-none">TARGET SOC</span>
                      <span className="text-xl font-mono-data font-black text-brand-glow leading-none block mt-1">{decision.targetSoc}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Predicted-vs-Ready graph (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl space-y-6 flex flex-col justify-between self-stretch">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-[#3ec2b3]" /> Section C: Predictive Power Buffering
            </h3>
            <span className="text-[10px] font-mono-data text-slate-500 block uppercase">24-HOUR FORECASTED LOAD VS PROACTIVE RESERVE BUFFER</span>
          </div>

          <div className="h-60 w-full bg-brand-dark/50 border border-brand-light/15 rounded-xl p-2.5 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={PREDICTION_VS_RESERVE_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="predictedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity="0.2"/>
                    <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="reserveColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-energy-battery)" stopOpacity="0.15"/>
                    <stop offset="95%" stopColor="var(--color-energy-battery)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 110, 103, 0.08)" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={8} className="font-mono-data" />
                <YAxis stroke="#64748b" fontSize={8} className="font-mono-data" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 34, 32, 0.95)', borderColor: 'rgba(42, 110, 103, 0.4)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '9px', color: '#94a3b8' }}
                />
                
                {/* Overlay predicted load (kW) and reserve level (SOC %) */}
                <Area 
                  type="monotone" 
                  dataKey="predictedLoad" 
                  name="Predicted Load (kW)" 
                  stroke="var(--color-brand-accent)" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#predictedColor)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="reserveSoc" 
                  name="Reserve SOC (%)" 
                  stroke="var(--color-energy-battery)" 
                  strokeWidth={1.5} 
                  strokeDasharray="4,4"
                  fillOpacity={1} 
                  fill="url(#reserveColor)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg text-[10px] text-slate-400 leading-normal">
            <span className="font-extrabold text-white block uppercase mb-1">PROACTIVE BUFFERING THEORY</span>
            Inverter charges the battery reserve prior to peak usage periods. Note the pre-charge bump between <strong className="text-white">02:00–06:00 AM</strong> ahead of the morning load spike, leaving enough headroom to absorb free midday solar power.
          </div>
        </div>

      </div>

    </div>
  );
};

export default Intelligence;
