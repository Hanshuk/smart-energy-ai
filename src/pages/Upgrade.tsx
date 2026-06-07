import React from 'react';
import { 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart3, 
  Share2, 
  Calculator
} from 'lucide-react';

const Upgrade: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Upgrade Engine</h1>
        <p className="text-brand-accent/70 text-sm mt-1">
          Telemetry-driven retrofit matching. Capital recommendations are sized from real breaker usage.
        </p>
      </div>

      {/* HERO — PRIMARY RECOMMENDATION CARD (AC-MBR) */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-accent/40 bg-gradient-to-b from-brand-dark to-brand-bg relative overflow-hidden space-y-6">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full filter blur-[60px] pointer-events-none -z-10"></div>
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-brand-light/10 pb-4">
          <div>
            <span className="text-[10px] font-mono-data text-brand-accent uppercase tracking-widest block">Retrofit Optimization recommendation</span>
            <h2 className="text-lg font-bold text-white mt-1">AC-MBR (Master Bedroom AC)</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="bg-rose-950/40 border border-rose-800/60 text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded tracking-wide uppercase flex items-center gap-1.5 animate-pulse">
              <AlertTriangle size={12} /> DEGRADED COMPRESSOR SIGNATURE
            </span>
            <span className="bg-brand-deep border border-brand-accent/35 text-brand-glow text-[10px] font-bold px-2.5 py-1 rounded tracking-wide uppercase flex items-center gap-1.5 shadow-sm">
              <ShieldCheck size={12} /> BILL-RECONCILED
            </span>
          </div>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Current vs Recommended */}
          <div className="space-y-4">
            <span className="text-[9px] font-mono-data text-slate-400 uppercase tracking-wider block">Electrical Consumption Comparison</span>
            
            <div className="space-y-3">
              {/* Current */}
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-400 block">Current Appliance</span>
                  <span className="font-semibold text-white">Fixed-Speed 3.5 HP Unit</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Baseline Draw</span>
                  <span className="font-mono-data font-semibold text-rose-400">3.10 kW Mean</span>
                </div>
              </div>

              {/* Draw Bar comparison */}
              <div className="h-4 w-full bg-slate-800/50 rounded overflow-hidden flex relative">
                <div className="bg-rose-500/80 h-full w-[100%] transition-all duration-1000"></div>
                <div className="absolute inset-y-0 left-0 bg-brand-accent h-full w-[45%] transition-all duration-1000"></div>
                <span className="absolute right-2 inset-y-0 flex items-center text-[8px] font-mono-data text-slate-400 uppercase">3.10 kW</span>
                <span className="absolute left-2 inset-y-0 flex items-center text-[8px] font-mono-data text-brand-bg font-black uppercase">1.60 kW</span>
              </div>

              {/* Recommended */}
              <div className="flex justify-between items-center text-xs pt-1.5">
                <div>
                  <span className="text-brand-accent block">Recommended Retrofit</span>
                  <span className="font-semibold text-brand-glow">Inverter 3.5 HP Condenser</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Estimated Draw</span>
                  <span className="font-mono-data font-semibold text-emerald-400">~1.60 kW adaptive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Delta Badge */}
          <div className="flex flex-col justify-center items-center bg-brand-dark/50 border border-brand-light/25 rounded-xl p-6 text-center">
            <span className="text-emerald-400 font-display font-black text-4xl block animate-bounce">-55%</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mt-1.5 block">True Power Draw Reduction</span>
            <p className="text-[11px] text-slate-400 mt-2 max-w-xs">
              Continuous adaptive frequency modulation matches load dynamically rather than switching cycles on and off.
            </p>
          </div>

        </div>

        {/* FINANCIAL ROI MATRIX */}
        <div className="border-t border-brand-light/10 pt-6">
          <span className="text-[9px] font-mono-data text-slate-400 uppercase tracking-wider block mb-3">Capital Return Metrics</span>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono-data">
            <div className="bg-brand-dark/40 border border-brand-light/10 p-3.5 rounded-lg text-center">
              <span className="text-[9px] text-slate-500 block uppercase">Acquisition Cost</span>
              <span className="text-base font-extrabold text-white mt-1 block">₱64,000</span>
              <span className="text-[8px] text-slate-500 block">Estimated install retail</span>
            </div>
            <div className="bg-brand-dark/40 border border-brand-light/10 p-3.5 rounded-lg text-center">
              <span className="text-[9px] text-slate-500 block uppercase">Monthly savings</span>
              <span className="text-base font-extrabold text-brand-glow mt-1 block">₱8,550</span>
              <span className="text-[8px] text-brand-accent/70 block">Meralco rate offset</span>
            </div>
            <div className="bg-brand-dark/40 border border-brand-light/10 p-3.5 rounded-lg text-center">
              <span className="text-[9px] text-slate-500 block uppercase">Capital Payback</span>
              <span className="text-base font-extrabold text-amber-400 mt-1 block">7.5 Months</span>
              <span className="text-[8px] text-slate-500 block">100% cost recovery</span>
            </div>
            <div className="bg-brand-dark/40 border border-brand-light/10 p-3.5 rounded-lg text-center">
              <span className="text-[9px] text-slate-500 block uppercase">5-Year Net Value</span>
              <span className="text-base font-extrabold text-indigo-400 mt-1 block">₱513,000</span>
              <span className="text-[8px] text-indigo-500 block">Estimated life value</span>
            </div>
          </div>
        </div>

        {/* Payback Visual Timeline */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[9px] text-slate-500 uppercase font-mono-data">
            <span>Capital recovery trajectory (Months)</span>
            <span className="text-brand-glow">Cost fully offset: Month 7.5</span>
          </div>
          <div className="h-2 w-full bg-slate-800/50 rounded-full relative overflow-hidden flex">
            {/* Cost zone */}
            <div className="h-full bg-amber-500" style={{ width: '12.5%' }}></div>
            {/* Benefit zone */}
            <div className="h-full bg-brand-accent" style={{ width: '87.5%' }}></div>
            {/* Split pointer */}
            <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl" style={{ left: '12.5%' }}></div>
          </div>
          <div className="flex justify-between text-[8px] text-slate-500 font-mono-data">
            <span>Start</span>
            <span>Month 7.5 (Payback)</span>
            <span>Year 1</span>
            <span>Year 3</span>
            <span>Year 5 (₱513k Net)</span>
          </div>
        </div>

        {/* Plain English explanation */}
        <p className="text-xs text-slate-300 leading-relaxed border-t border-brand-light/10 pt-4 mt-2">
          "We don't just say your AC is dying — we recommend a specific unit sized to how you actually use it, show it'll cut ₱8,550/month, cost ₱64,000, and pay for itself in about 7.5 months."
        </p>

        {/* Share Button (Inert) */}
        <div className="flex justify-end pt-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-deep/80 hover:bg-brand-deep border border-brand-light/25 hover:border-brand-accent/50 text-brand-glow rounded-xl text-xs font-semibold select-none cursor-not-allowed transition-all opacity-80">
            <Share2 size={12} /> Share recommendation with installer
          </button>
        </div>

      </div>

      {/* METHODOLOGY — "HOW WE SIZE IT" */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">Upgrade matching sizing criteria</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-dark/30 border border-brand-light/10 p-4 rounded-xl space-y-2">
            <BarChart3 size={18} className="text-brand-accent" />
            <h4 className="text-white font-semibold text-xs">01. True Load Matching</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              We size replacement systems against actual peak loads recorded by breaker clamps rather than generic building envelope square-footage rules.
            </p>
          </div>
          <div className="bg-brand-dark/30 border border-brand-light/10 p-4 rounded-xl space-y-2">
            <Award size={18} className="text-brand-accent" />
            <h4 className="text-white font-semibold text-xs">02. Performance Equivalency</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Matched units guarantee identical output specs (equivalent BTU rating or water volume throughput) while reducing baseline power draws.
            </p>
          </div>
          <div className="bg-brand-dark/30 border border-brand-light/10 p-4 rounded-xl space-y-2">
            <TrendingUp size={18} className="text-brand-accent" />
            <h4 className="text-white font-semibold text-xs">03. Measured Capital Payback</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              We calculate return on capital with precision: Payback = Hardware Cost / Measured Monthly Telemetry Savings.
            </p>
          </div>
        </div>

        {/* Sizing Formula Callout */}
        <div className="bg-brand-dark/80 border border-brand-light/20 p-4 rounded-xl flex gap-3 text-xs text-slate-400 mt-2">
          <Calculator size={16} className="text-brand-accent shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white block">Sizing Formulas</span>
            <div className="font-mono-data text-[10px] text-slate-300">
              Saving Power = 30-day average real power &times; 0.55
            </div>
            <div className="font-mono-data text-[10px] text-slate-300">
              Monthly Savings = Saving Power &times; average daily run-hours &times; 30 &times; Meralco utility rate
            </div>
          </div>
        </div>
      </div>

      {/* CONFIDENCE FLAGS LEGEND */}
      <div className="glass-panel p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recommendation Confidence Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg">
            <span className="text-slate-400 font-bold font-mono-data uppercase block">ESTIMATED</span>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
              Fewer than 30 days of telemetry history. Sourced from initial estimates (confidence &lt; 0.8).
            </p>
          </div>
          <div className="p-3 bg-brand-deep/30 border border-brand-light/25 rounded-lg">
            <span className="text-brand-accent font-bold font-mono-data uppercase block">MEASURED</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              90+ days of continuous high-fidelity circuit telemetry. ROI calculations verified (confidence &ge; 0.9).
            </p>
          </div>
          <div className="p-3 bg-brand-deep/50 border border-brand-accent/30 rounded-lg">
            <span className="text-brand-glow font-bold font-mono-data uppercase block">BILL-RECONCILED</span>
            <p className="text-[10px] text-brand-accent mt-1 leading-relaxed">
              Telemetric consumption cross-checked and matched directly to local Meralco billing files. Maximum confidence level.
            </p>
          </div>
        </div>
      </div>

      {/* SECONDARY OPPORTUNITIES */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">Secondary Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* FRIDGE */}
          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-brand-accent/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono-data text-slate-500 uppercase">CIRCUIT: FRIDGE</span>
                <h4 className="text-white font-semibold text-sm mt-0.5">Kitchen Refrigerator Gaskets</h4>
              </div>
              <span className="bg-brand-deep border border-brand-light/20 text-brand-accent text-[8px] font-mono-data px-1.5 py-0.5 rounded tracking-wide uppercase">
                MEASURED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Monitoring duty cycle. Replacing worn magnetic door seal gaskets may improve background power efficiency.
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono-data border-t border-brand-light/10 pt-3">
              <span className="text-slate-500">Est Cost: ₱3,200</span>
              <span className="text-brand-glow font-bold">Saves ~₱850/mo</span>
            </div>
          </div>

          {/* WHT */}
          <div className="glass-panel p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-brand-accent/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono-data text-slate-500 uppercase">CIRCUIT: WHT</span>
                <h4 className="text-white font-semibold text-sm mt-0.5">Bathroom Water Heater Swap</h4>
              </div>
              <span className="bg-slate-900 border border-slate-800 text-slate-500 text-[8px] font-mono-data px-1.5 py-0.5 rounded tracking-wide uppercase">
                ESTIMATED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Low-confidence opportunity. Upgrading multipoint resistance heaters to heat-pump based models under review.
            </p>
            <div className="flex justify-between items-center text-[10px] font-mono-data border-t border-brand-light/10 pt-3">
              <span className="text-slate-500">Est Cost: ₱42,000</span>
              <span className="text-slate-500 font-bold">Saves ~₱1,800/mo</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Upgrade;
