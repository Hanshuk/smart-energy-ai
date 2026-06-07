import React from 'react';
import { 
  TrendingUp, 
  PieChart as PieIcon, 
  Coins 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// Data for 10-year (120 months) cumulative savings curve
const CUMULATIVE_SAVINGS_DATA = [
  { month: 0, savings: 0 },
  { month: 12, savings: 220000 },
  { month: 24, savings: 440000 },
  { month: 36, savings: 660000 },
  { month: 42, savings: 770000 }, // Payback crossed
  { month: 48, savings: 880000 },
  { month: 60, savings: 1100000 }, // 5-Year Milestone
  { month: 72, savings: 1320000 },
  { month: 84, savings: 1540000 },
  { month: 96, savings: 1760000 },
  { month: 108, savings: 1980000 },
  { month: 120, savings: 2200000 } // 10-Year Milestone
];

// Data for monthly savings breakdown
const MONTHLY_BREAKDOWN_DATA = [
  { name: 'Solar Offsets', value: 12400, color: 'var(--color-energy-solar)' },
  { name: 'Night Shift', value: 4850, color: 'var(--color-brand-accent)' },
  { name: 'Predictive AI', value: 3150, color: 'var(--color-energy-battery)' }
];

const Savings: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Savings & ROI</h1>
        <p className="text-brand-accent/70 text-sm mt-1">
          Capital recovery tracking and pathway savings. Proving the microgrid as a self-funding home asset.
        </p>
      </div>

      {/* HERO — CAPITAL RECOVERY CURVE */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
          <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={18} className="text-brand-accent" /> Capital Recovery Curve
          </h2>
          <span className="text-[10px] font-mono-data bg-brand-deep text-brand-glow px-2.5 py-0.5 rounded border border-brand-accent/20 uppercase">PAYBACK TRACKING</span>
        </div>

        {/* Headline Stat Trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-brand-dark/40 border border-brand-light/10 p-4 rounded-xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-mono-data tracking-wider">Capital Payback</span>
            <span className="text-2xl font-black text-amber-400 font-mono-data mt-1 block">42 Months</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">100% initial cost offset</span>
          </div>
          <div className="bg-brand-dark/40 border border-brand-light/10 p-4 rounded-xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-mono-data tracking-wider">5-Year Net Value</span>
            <span className="text-2xl font-black text-white font-mono-data mt-1 block">₱1,100,000</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Cumulative savings value</span>
          </div>
          <div className="bg-brand-dark/40 border border-brand-light/10 p-4 rounded-xl text-center">
            <span className="text-slate-400 text-[10px] uppercase font-mono-data tracking-wider">10-Year Asset Return</span>
            <span className="text-2xl font-black text-brand-glow font-mono-data mt-1 block">₱2,200,000</span>
            <span className="text-[9px] text-slate-500 block mt-0.5">Cumulative lifetime return</span>
          </div>
        </div>

        {/* 10-Year Graph */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono-data text-slate-400 block uppercase">10-Year Cumulative Savings Trajectory (₱ vs Months)</span>
          <div className="h-56 w-full bg-brand-dark/50 border border-brand-light/10 rounded-xl p-2.5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={CUMULATIVE_SAVINGS_DATA}
                margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-energy-battery)" stopOpacity="0.25"/>
                    <stop offset="95%" stopColor="var(--color-energy-battery)" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 110, 103, 0.1)" />
                <XAxis dataKey="month" label={{ value: 'Months Active', position: 'insideBottomRight', offset: -5, fontSize: 8, fill: '#64748b' }} stroke="#64748b" fontSize={9} className="font-mono-data" />
                <YAxis stroke="#64748b" fontSize={9} className="font-mono-data" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 34, 32, 0.95)', borderColor: 'rgba(42, 110, 103, 0.4)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '10px', color: '#94a3b8' }}
                  formatter={(value: any) => [`₱${Number(value).toLocaleString()}`, "Savings"]}
                />
                
                {/* Horizontal reference line for ₱750k install cost */}
                <ReferenceLine 
                  y={750000} 
                  stroke="#ef4444" 
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  label={{ value: "₱750k System Cost", fill: "#f87171", fontSize: 8, position: "top" }}
                />

                <Area type="monotone" dataKey="savings" name="Cumulative Savings" stroke="var(--color-energy-battery)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSavings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline Milestones Table */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1.5 font-mono-data">
          <div className="p-3 bg-brand-dark/40 border border-brand-light/10 rounded-lg">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">Month 12</span>
            <span className="font-bold text-white block mt-0.5">₱220,000 saved</span>
            <span className="text-[8px] text-slate-500">₱530,000 remaining</span>
          </div>
          <div className="p-3 bg-brand-dark/40 border border-brand-light/10 rounded-lg">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">Month 24</span>
            <span className="font-bold text-white block mt-0.5">₱440,000 saved</span>
            <span className="text-[8px] text-slate-500">₱310,000 remaining</span>
          </div>
          <div className="p-3 bg-brand-dark/40 border border-brand-light/10 rounded-lg">
            <span className="text-[9px] text-slate-500 uppercase block font-semibold">Month 36</span>
            <span className="font-bold text-white block mt-0.5">₱660,000 saved</span>
            <span className="text-[8px] text-slate-500">₱90,000 remaining</span>
          </div>
          <div className="p-3 bg-brand-deep/60 border border-brand-accent/30 rounded-lg">
            <span className="text-[9px] text-brand-glow uppercase block font-bold">Month 42</span>
            <span className="font-bold text-brand-glow block mt-0.5">₱770,000 saved</span>
            <span className="text-[8px] text-emerald-400">FULL PAYBACK EXCEEDED</span>
          </div>
        </div>

        {/* Plain language summary */}
        <p className="text-xs text-slate-300 leading-relaxed pt-2">
          "You invest ₱750,000 up front. Savings pile up steadily, and by ~month 42 the system has fully paid for itself. Everything after — up to ~₱2.2M over ten years — is money back in your pocket."
        </p>

      </div>

      {/* MONTHLY SAVINGS BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pathway Breakdown */}
        <div className="glass-panel p-6 rounded-2xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-brand-light/20 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <PieIcon size={14} className="text-brand-accent" /> Monthly Savings Breakdown
              </h3>
              <span className="text-[9px] font-mono-data bg-brand-deep border border-brand-light/20 text-brand-accent px-1.5 py-0.5 rounded tracking-wide uppercase">
                BILL-RECONCILED
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Breaker-level offset values computed against historical baselines and Meralco rate shifts.
            </p>
          </div>

          <div className="h-40 w-full p-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_BREAKDOWN_DATA} layout="vertical" margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42, 110, 103, 0.1)" />
                <XAxis type="number" stroke="#64748b" fontSize={9} className="font-mono-data" />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={9} className="font-mono-data" />
                <Tooltip formatter={(v: any) => `₱${Number(v).toLocaleString()}`} />
                <Bar dataKey="value" name="Value Saved (₱)">
                  {MONTHLY_BREAKDOWN_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown labels legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono-data border-t border-brand-light/10 pt-4">
            <div>
              <span className="text-amber-400 block font-bold">₱12,400</span>
              <span className="text-slate-500">Solar Offsets</span>
            </div>
            <div>
              <span className="text-brand-accent block font-bold">₱4,850</span>
              <span className="text-slate-500">Night Shift</span>
            </div>
            <div>
              <span className="text-emerald-400 block font-bold">₱3,150</span>
              <span className="text-slate-500">Predictive AI</span>
            </div>
          </div>
        </div>

        {/* Before / After Bill Comparison */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-brand-light/20 pb-2">
              Monthly Utility Bill Comparison
            </h3>
            <p className="text-[11px] text-slate-400 mt-2">
              Impact of self-grid microgrid coordination on residential Meralco bills.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Before */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono-data">
                <span className="text-slate-400">Baseline Monthly Gasket Load</span>
                <span className="font-bold text-rose-400">₱39,538</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full" style={{ width: '100%' }}></div>
              </div>
              <span className="text-[9px] text-slate-500 block font-mono-data">2,520 kWh baseline &times; ₱15.69 Meralco rate</span>
            </div>

            {/* After */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono-data">
                <span className="text-brand-accent">Optimized Monthly Bill</span>
                <span className="font-bold text-brand-glow">₱19,138</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-brand-accent h-full" style={{ width: '48.4%' }}></div>
              </div>
              <span className="text-[9px] text-emerald-400 block font-mono-data">Net saving: ₱20,400 per month (-51.6%)</span>
            </div>

          </div>

          <div className="bg-brand-dark/50 border border-brand-light/25 rounded-xl p-3.5 flex gap-2.5 items-center">
            <Coins className="text-brand-glow shrink-0" size={18} />
            <div className="text-[10px] text-slate-400">
              Verified through Meralco billing reconciliation files matching actual smart grid outputs.
            </div>
          </div>
        </div>

      </div>

      {/* DEPLOYMENT TIERS */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">Deployment Integration Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Premium Tier */}
          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-brand-accent/25 transition-all">
            <div>
              <span className="text-[9px] font-mono-data text-slate-500 uppercase block">Capital Asset Investment</span>
              <h4 className="text-white font-bold text-sm mt-0.5">Premium Microgrid Tier</h4>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              "Own the asset outright; strongest long-term return." Full clamp monitoring, maximum solar array support, and larger battery reserves.
            </p>

            <div className="border-t border-brand-light/10 pt-3 flex justify-between items-center text-[10px] font-mono-data text-slate-400">
              <span>Install: ₱750,000</span>
              <span className="text-brand-glow font-bold">Payback: 42 Mos</span>
            </div>
          </div>

          {/* Financed Tier */}
          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-brand-accent/25 transition-all">
            <div>
              <span className="text-[9px] font-mono-data text-slate-500 uppercase block">Finance Integration</span>
              <h4 className="text-white font-bold text-sm mt-0.5">Mass-Market Financed Tier</h4>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              "Cash-flow neutral from day one: monthly bill savings roughly cancel the loan payment, so the household benefits from month one and owns the system at the end."
            </p>

            <div className="border-t border-brand-light/10 pt-3 flex justify-between items-center text-[10px] font-mono-data text-slate-400">
              <span>Install: ₱300k–₱350k</span>
              <span className="text-indigo-400 font-bold">Neutral Cash Flow</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Savings;
