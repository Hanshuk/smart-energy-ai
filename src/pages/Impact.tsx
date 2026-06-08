import React, { useEffect, useState } from 'react';
import { 
  Leaf, 
  Heart, 
  Wind, 
  Shield, 
  Moon, 
  Eye, 
  Globe, 
  Info,
  TrendingUp,
  Activity
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

interface ImpactProps {
  currentDayIndex: number;
  currentBlockIndex: number;
}

// 10-Year Cumulative Carbon Avoided
const CUMULATIVE_CARBON_DATA = [
  { year: 'Year 0', carbonTons: 0 },
  { year: 'Year 1', carbonTons: 8.1 },
  { year: 'Year 2', carbonTons: 16.2 },
  { year: 'Year 3', carbonTons: 24.3 },
  { year: 'Year 4', carbonTons: 32.4 },
  { year: 'Year 5', carbonTons: 40.5 },
  { year: 'Year 6', carbonTons: 48.6 },
  { year: 'Year 7', carbonTons: 56.7 },
  { year: 'Year 8', carbonTons: 64.8 },
  { year: 'Year 9', carbonTons: 72.9 },
  { year: 'Year 10', carbonTons: 81.0 }
];

// Breakdown of carbon offsets
const OFFSETS_BREAKDOWN = [
  { source: 'Master Bedroom AC (AC-MBR Upgrade)', value: 5130, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'Solar Self-Generation (Offsetting Fossil Grid)', value: 2500, unit: 'kg CO₂/yr', category: 'solar' },
  { source: 'Living Room AC (1HP Inverter Retrofit)', value: 1820, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'Night-Shift Grid Arbitrage Offset', value: 600, unit: 'kg CO₂/yr', category: 'grid' },
  { source: 'Smart LED Lighting Retrofit', value: 315, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'Kitchen Refrigerator (Inverter Upgrade)', value: 290, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'Washing Machine (Front-Load Inverter)', value: 154, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'Double Hob Induction Cooker Swap', value: 140, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'Smart TV (4K LED Retrofit)', value: 126, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'DC Inverter Fans (Batch of 3)', value: 84, unit: 'kg CO₂/yr', category: 'appliance' },
  { source: 'Fuzzy Logic Rice Cooker Swap', value: 42, unit: 'kg CO₂/yr', category: 'appliance' }
];

const HEALTH_CARDS = [
  {
    title: 'Cleaner Indoor Air Quality',
    icon: Wind,
    iconColor: 'text-sky-400',
    bgColor: 'bg-sky-950/20 border-sky-900/40',
    benefit: 'Reduces indoor air pollutants linked to respiratory irritation.',
    mechanism: 'Swapping the gas LPG burner/electric-coil stove for clean induction cooking eliminates combustion byproducts like nitrogen dioxide (NO₂), carbon monoxide (CO), and fine particulate matters in the kitchen.'
  },
  {
    title: 'Dust & Allergen Mitigation',
    icon: Shield,
    iconColor: 'text-teal-400',
    bgColor: 'bg-teal-950/20 border-teal-900/40',
    benefit: 'Maintains steady thermal comfort and filters airborne irritants.',
    mechanism: 'Modern inverter-based AC units operate with steady, non-cycling fan speeds that continuously filter air. Advanced micro-filters catch dust, pollen, and pet dander more efficiently than old fixed-speed cycles.'
  },
  {
    title: 'Reliable Emergency Backup',
    icon: Activity,
    iconColor: 'text-rose-400',
    bgColor: 'bg-rose-950/20 border-rose-900/40',
    benefit: 'Safeguards food, critical medicine cooling, and provides heat-stress protection.',
    mechanism: 'During utility brownouts, the microgrid automatically triggers islanding backup mode, sustaining essential refrigerator cooling for perishables/insulin and running fans to mitigate heat stroke.'
  },
  {
    title: 'Acoustic Comfort & Steadier Sleep',
    icon: Moon,
    iconColor: 'text-indigo-400',
    bgColor: 'bg-indigo-950/20 border-indigo-900/40',
    benefit: 'Supports healthy sleep hygiene by dampening ambient appliances noise.',
    mechanism: 'DC motor fans and inverter compressors run continuously at soft decibels, eliminating the loud startup clicks and metallic vibrations characteristic of legacy window AC units.'
  },
  {
    title: 'Flicker-Free Visual Protection',
    icon: Eye,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-950/20 border-amber-900/40',
    benefit: 'Alleviates ocular strain and headaches from high-frequency flickering.',
    mechanism: 'Solid-state LED lighting provides steady, dimmable, flicker-free illumination, replacing the annoying 60Hz magnetic ballast buzz and flicker associated with aging fluorescent tubes.'
  },
  {
    title: 'Lower Community Air Pollution',
    icon: Globe,
    iconColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/20 border-emerald-900/40',
    benefit: 'Contributes to regional respiratory health by lowering fossil load dependency.',
    mechanism: 'Generating solar onsite and shifting peak grid imports directly offsets local utility demand from coal-fired power stations, lowering heavy sulfur dioxide and particulate emissions in residential corridors.'
  }
];

const Impact: React.FC<ImpactProps> = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className={`space-y-8 transition-opacity duration-1000 ${animate ? 'opacity-100' : 'opacity-0'} pb-24`}>
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Heart className="text-rose-400 animate-pulse-glow" size={32} /> Impact & Wellbeing
        </h1>
        <p className="text-brand-accent/70 text-sm mt-1">
          Beyond the utility bill: telemetric environmental contributions and credible, mechanism-based indoor wellness profiles.
        </p>
      </div>

      {/* 1. CARBON IMPACT HERO & CUMULATIVE FORECAST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Hero Stat and Tree Visual (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden bg-gradient-to-br from-brand-dark to-brand-bg border border-brand-accent/35">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full filter blur-[50px] pointer-events-none -z-10"></div>
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono-data text-brand-accent uppercase tracking-widest font-extrabold block">Combined Footprint Offsets</span>
            <h3 className="text-white font-extrabold text-sm uppercase">Tangible Ecological Value</h3>
          </div>

          <div className="py-4 space-y-2 text-center md:text-left">
            <span className="text-[10px] font-mono-data text-emerald-400 uppercase tracking-wider block">Estimated Annual Impact</span>
            <h2 className="text-5xl font-black text-white font-mono-data tracking-tight">
              8.1 <span className="text-lg font-normal text-slate-400 font-sans">Tons CO₂/yr</span>
            </h2>
            <span className="text-xs text-slate-300 font-medium block mt-1">Avoided greenhouse gas emissions</span>
          </div>

          {/* Tree visuals */}
          <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg shrink-0">
              <Leaf size={24} className="text-emerald-400 animate-bounce" style={{ animationDuration: '3s' }} />
            </div>
            <div className="text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-emerald-400 block uppercase text-[9px] tracking-wide">Forestry Equivalence</span>
              Equivalent to planting **~368 mature trees** per year, absorbing residential carbon footprints continuously.
            </div>
          </div>
        </div>

        {/* Right: Area trajectory (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between border border-brand-light/20">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-accent" /> Section A: Cumulative Carbon Avoidance Curve
            </h3>
            <span className="text-[10px] font-mono-data text-slate-500 block uppercase">10-YEAR CUMULATIVE TELEMETRIC SAVINGS TRAJECTORY (TONS CO₂)</span>
          </div>

          <div className="h-52 w-full bg-brand-dark/50 border border-brand-light/10 rounded-xl p-2.5 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={CUMULATIVE_CARBON_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="carbonOffset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-energy-battery)" stopOpacity="0.25"/>
                    <stop offset="95%" stopColor="var(--color-energy-battery)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16, 185, 129, 0.08)" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={8} className="font-mono-data" />
                <YAxis stroke="#64748b" fontSize={8} className="font-mono-data" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 34, 32, 0.95)', borderColor: 'rgba(42, 110, 103, 0.4)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '9px', color: '#94a3b8' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="carbonTons" 
                  name="CO₂ Avoided (Tons)" 
                  stroke="var(--color-energy-battery)" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#carbonOffset)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 leading-normal">
            <Info size={12} className="text-brand-accent shrink-0" />
            <span>
              10-Year target of **81 Tons avoided** matches the lifetime of retrofitted inverter systems, equivalent to offsetting **~320,000 km** of generic passenger vehicle driving emissions.
            </span>
          </div>
        </div>

      </div>

      {/* 2. OFFSET BREAKDOWN BY SOURCE */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="border-b border-brand-light/20 pb-2">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Globe size={18} className="text-emerald-400" /> Section B: Carbon Reduction Source Breakdown
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">DETAILED ANNUAL GREENHOUSE GAS REDUCTIONS (kg CO₂/yr)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-data">
          {OFFSETS_BREAKDOWN.map((item, index) => (
            <div 
              key={index}
              className="flex justify-between items-center p-3 rounded-lg bg-brand-dark/40 border border-brand-light/10 hover:border-brand-accent/25 transition-colors"
            >
              <span className="text-slate-300 font-sans font-medium">{item.source}</span>
              <div className="text-right shrink-0">
                <span className="text-emerald-400 font-extrabold">{item.value.toLocaleString()}</span>
                <span className="text-slate-500 text-[9px] ml-1 uppercase">{item.unit.split(' ')[1]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HEALTH & WELLBEING SECTION */}
      <div className="space-y-4">
        <div className="border-b border-brand-light/20 pb-2">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Heart size={18} className="text-rose-400" /> Section C: Credible Health & Wellbeing Benefits
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">INDICATIVE HEALTH ADVANTAGES TIED TO MEASURABLE EQUIPMENT ATTRIBUTES</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HEALTH_CARDS.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <div 
                key={idx}
                className={`glass-panel p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all duration-300 hover:scale-102 ${card.bgColor}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-dark border border-brand-light/15">
                      <CardIcon size={18} className={card.iconColor} />
                    </div>
                    <h4 className="text-white font-extrabold text-xs tracking-wide uppercase leading-tight">{card.title}</h4>
                  </div>
                  
                  {/* Confident benefits & mechanisms */}
                  <div className="space-y-2 text-xs">
                    <p className="text-white font-bold leading-relaxed">{card.benefit}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{card.mechanism}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer footnote */}
        <div className="bg-brand-dark/40 border border-brand-light/10 p-3 rounded-lg flex gap-2 items-center text-[10px] text-slate-500 italic">
          <AlertCircleIcon size={12} className="text-slate-600 shrink-0" />
          <span>Indicative wellbeing benefits based on equipment characteristics; not medical advice. Always consult certified health specialists for diagnostic outcomes.</span>
        </div>
      </div>

      {/* 4. COMBINED IMPACT SUMMARY STRIP (Triple Pillar) */}
      <div className="fixed bottom-0 inset-x-0 bg-brand-dark/95 border-t border-brand-accent/35 backdrop-blur-md z-45 py-4 px-6 flex justify-center shadow-2xl">
        <div className="max-w-7xl w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-accent to-brand-deep flex items-center justify-center shadow-lg shrink-0">
              <Leaf size={18} className="text-brand-glow" />
            </div>
            <div>
              <span className="font-extrabold text-white block uppercase text-[10px] tracking-wider leading-none">Smart Resident Microgrid Pitch</span>
              <p className="text-slate-400 text-[10px] mt-1">
                Tying together <strong className="text-brand-glow">Financial Savings</strong>, <strong className="text-emerald-400">Carbon Offsets</strong>, and <strong className="text-rose-400">Wellbeing Comfort</strong>.
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <span className="text-[11px] text-brand-accent font-semibold block leading-tight font-sans">
              🟢 This home avoids ~8.1 Tons CO₂/year (≈ 368 trees),
            </span>
            <span className="text-[10px] text-slate-300 block mt-0.5 font-sans">
              while improving indoor air quality, sleep comfort, and brownout resilience.
            </span>
          </div>

        </div>
      </div>

    </div>
  );
};

// Simple inline SVG helper for alert circle to avoid dependency load issues
const AlertCircleIcon: React.FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export default Impact;
