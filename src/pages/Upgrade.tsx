import React, { useState } from 'react';
import { 
  Award, 
  AlertTriangle, 
  ShieldCheck, 
  Share2, 
  Calculator,
  Leaf,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

interface UpgradeItem {
  id: string;
  appliance: string;
  oldModel: string;
  newModel: string;
  price: number;
  annualKwhSaved: number;
  annualCo2SavedKg: number;
  description: string;
  circuitCode: string;
}

const BLENDED_RATE = 14.00; // Meralco blended rate in ₱/kWh

const CATALOG_ITEMS: UpgradeItem[] = [
  {
    id: 'U-AC1',
    appliance: 'Air Conditioner (1HP)',
    oldModel: 'Non-Inverter Window Type',
    newModel: 'Smart Inverter Split Type (5-Star)',
    price: 24000,
    annualKwhSaved: 2600,
    annualCo2SavedKg: 1820,
    description: 'Upgrading the main study/dining room AC unit. Telemetry shows high start-up draw spikes due to continuous compressor cycling.',
    circuitCode: 'AC-LR'
  },
  {
    id: 'U-RF1',
    appliance: 'Refrigerator (10 cu.ft)',
    oldModel: 'Defrost Single-Stage Compressor',
    newModel: 'Inverter Continuous-Cycle Refrigerator',
    price: 26000,
    annualKwhSaved: 420,
    annualCo2SavedKg: 290,
    description: 'Continuous background load reduction. High duty cycle clamps detect worn magnetic door seals and single-speed compressor fatigue.',
    circuitCode: 'FRIDGE'
  },
  {
    id: 'U-WM1',
    appliance: 'Washing Machine',
    oldModel: 'Top-Load Conventional Belt-Drive',
    newModel: 'Front-Load Inverter Direct-Drive',
    price: 22000,
    annualKwhSaved: 220,
    annualCo2SavedKg: 154,
    description: 'Washing machine motor efficiency retrofit. Optimizes wash cycle peak amperage and reduces runtime mechanical losses.',
    circuitCode: 'MAIN'
  },
  {
    id: 'U-TV1',
    appliance: 'Television',
    oldModel: '50" CCFL Backlight LCD TV',
    newModel: '50" Smart LED TV (4K UHD)',
    price: 15000,
    annualKwhSaved: 180,
    annualCo2SavedKg: 126,
    description: 'Reduces active display energy footprint. 4K LED consumes 65% less power than CCFL gas backlight models.',
    circuitCode: 'MAIN'
  },
  {
    id: 'U-EF1',
    appliance: 'Electric Fan (Batch of 3)',
    oldModel: 'AC Induction Motor Standing Fans',
    newModel: 'DC Inverter Motor Fans',
    price: 3500,
    annualKwhSaved: 120,
    annualCo2SavedKg: 84,
    description: 'Replaces high-run hour bedroom fans with highly efficient DC motor variants, saving up to 70% during night operations.',
    circuitCode: 'MAIN'
  },
  {
    id: 'U-LT1',
    appliance: 'Lighting (Batch of 15)',
    oldModel: 'CFL & Incandescent Bulbs',
    newModel: 'Smart LED Lighting Retrofit',
    price: 1800,
    annualKwhSaved: 450,
    annualCo2SavedKg: 315,
    description: 'Whole-house residential lighting retrofit. Immediate drop in baseline background lighting wattage.',
    circuitCode: 'MAIN'
  },
  {
    id: 'U-RC1',
    appliance: 'Rice Cooker',
    oldModel: 'Basic Mechanical Heating Plate Cooker',
    newModel: 'Inverter Induction Fuzzy Logic Cooker',
    price: 5000,
    annualKwhSaved: 60,
    annualCo2SavedKg: 42,
    description: 'Fuzzy logic cook cycles optimize heater plate pulses based on real-time internal thermal sensors.',
    circuitCode: 'MAIN'
  },
  {
    id: 'U-IC1',
    appliance: 'Induction Cooker',
    oldModel: 'LPG Burner / Coil Electric Cooker',
    newModel: 'Modern Double Hob Induction Cooker',
    price: 4500,
    annualKwhSaved: 200,
    annualCo2SavedKg: 140,
    description: 'High thermal transfer efficiency upgrade. Induction directly heats cookware base, eliminating ambient kitchen heating losses.',
    circuitCode: 'MAIN'
  }
];

const Upgrade: React.FC = () => {
  const [emiTerm, setEmiTerm] = useState<12 | 24 | 36>(24);

  // Hero AC-MBR Specifications
  const heroPrice = 64000;
  const heroAnnualKwh = 7330;
  const heroAnnualCo2 = 5130;
  const heroMonthlySavings = Math.round((heroAnnualKwh * BLENDED_RATE) / 12);
  const heroEmi = Math.round(heroPrice / emiTerm);
  const heroNet = heroMonthlySavings - heroEmi;

  // Catalog Totals Calculation
  const totalCatalogPrice = CATALOG_ITEMS.reduce((sum, item) => sum + item.price, 0);
  const totalCatalogKwh = CATALOG_ITEMS.reduce((sum, item) => sum + item.annualKwhSaved, 0);
  const totalCatalogCo2 = CATALOG_ITEMS.reduce((sum, item) => sum + item.annualCo2SavedKg, 0);

  // All Recommendations combined (Hero + Catalog)
  const combinedPrice = heroPrice + totalCatalogPrice;
  const combinedKwh = heroAnnualKwh + totalCatalogKwh;
  const combinedCo2 = (heroAnnualCo2 + totalCatalogCo2) / 1000; // in tons
  const combinedMonthlySavings = Math.round((combinedKwh * BLENDED_RATE) / 12);
  const combinedEmi = Math.round(combinedPrice / emiTerm);
  const combinedNet = combinedMonthlySavings - combinedEmi;
  const equivalentTrees = Math.round((heroAnnualCo2 + totalCatalogCo2) / 22);

  return (
    <div className="space-y-8 animate-fade-in pb-28">
      
      {/* 1. HEADER & UTILITY RATE CALLOUT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Award className="text-brand-accent" size={30} /> Upgrade Engine
          </h1>
          <p className="text-brand-accent/70 text-sm mt-1">
            Telemetry-driven retrofit matching. Capital recommendations are sized from real breaker usage.
          </p>
        </div>

        {/* Meralco Blended Rate Badge */}
        <div className="glass-panel py-2.5 px-4 rounded-xl border border-brand-light/35 bg-brand-deep/30 flex items-center gap-2.5 shrink-0 text-xs">
          <DollarSign size={14} className="text-brand-accent" />
          <div className="font-mono-data">
            <span className="text-slate-400 block uppercase text-[8px] tracking-wider leading-none">Calculated savings rate</span>
            <span className="text-white font-extrabold text-sm block mt-0.5">₱{BLENDED_RATE.toFixed(2)}/kWh</span>
            <span className="text-slate-500 text-[8px] block mt-0.5 leading-none">Blended Meralco Utility Rate</span>
          </div>
        </div>
      </div>

      {/* 2. TERM TOGGLE PANEL */}
      <div className="glass-panel p-4 rounded-xl border border-brand-light/25 bg-brand-deep/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Calculator size={18} className="text-brand-glow animate-pulse" />
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Select Financing Term (0% Interest)</h4>
            <p className="text-[10px] text-slate-400">Monthly EMI adapts dynamically. Interest rate is locked at 0.00%.</p>
          </div>
        </div>

        {/* Toggle Pill */}
        <div className="flex bg-brand-bg border border-brand-light/35 rounded-lg p-1 gap-1 shrink-0 font-mono-data">
          {([12, 24, 36] as const).map((term) => (
            <button
              key={term}
              onClick={() => setEmiTerm(term)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                emiTerm === term
                  ? 'bg-brand-deep text-brand-glow shadow shadow-brand-accent/10 border-l border-brand-accent'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {term} Months
            </button>
          ))}
        </div>
      </div>

      {/* 3. HERO PRIMARY RECOMMENDATION CARD (AC-MBR) */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-accent/40 bg-gradient-to-b from-brand-dark to-brand-bg relative overflow-hidden space-y-6">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full filter blur-[60px] pointer-events-none -z-10"></div>
        
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-brand-light/10 pb-4">
          <div>
            <span className="text-[10px] font-mono-data text-brand-accent uppercase tracking-widest block font-extrabold">Primary Retrofit Recommendation</span>
            <h2 className="text-xl font-bold text-white mt-1">AC-MBR (Master Bedroom AC Upgrade)</h2>
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
            <span className="text-emerald-400 font-display font-black text-4xl block">-55%</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold mt-1.5 block">True Power Draw Reduction</span>
            <p className="text-[11px] text-slate-400 mt-2 max-w-xs leading-relaxed">
              Continuous adaptive frequency modulation matches load dynamically rather than switching cycles on and off.
            </p>
          </div>

        </div>

        {/* HERO ROI & EMI COMPARISON PANEL */}
        <div className="bg-brand-dark/40 border border-brand-light/25 rounded-xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-brand-light/10 pb-2">
            <Calculator size={14} className="text-brand-accent" /> AC-MBR 0% Financing & Return Matrix
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono-data text-center">
            <div className="bg-brand-deep/30 border border-brand-light/15 p-3 rounded-lg">
              <span className="text-[8px] text-slate-500 block uppercase">Acquisition Cost</span>
              <span className="text-base font-extrabold text-white mt-1 block">₱{heroPrice.toLocaleString()}</span>
              <span className="text-[8px] text-slate-500 block">Retail installed</span>
            </div>
            
            <div className="bg-brand-deep/30 border border-brand-light/15 p-3 rounded-lg">
              <span className="text-[8px] text-slate-500 block uppercase">Monthly Savings</span>
              <span className="text-base font-extrabold text-brand-glow mt-1 block">₱{heroMonthlySavings.toLocaleString()}</span>
              <span className="text-[8px] text-brand-accent block">₱14.00 blended rate</span>
            </div>

            <div className="bg-brand-deep/30 border border-brand-light/15 p-3 rounded-lg">
              <span className="text-[8px] text-slate-500 block uppercase">Monthly EMI ({emiTerm} mo)</span>
              <span className="text-base font-extrabold text-white mt-1 block">₱{heroEmi.toLocaleString()}/mo</span>
              <span className="text-[8px] text-slate-500 block">0% interest financing</span>
            </div>

            <div className="bg-brand-deep/30 border border-brand-light/15 p-3 rounded-lg">
              <span className="text-[8px] text-slate-500 block uppercase">Carbon Savings</span>
              <span className="text-base font-extrabold text-emerald-400 mt-1 block flex items-center justify-center gap-1">
                <Leaf size={12} /> {(heroAnnualCo2 / 1000).toFixed(2)} t/yr
              </span>
              <span className="text-[8px] text-slate-500 block">CO₂ offset impact</span>
            </div>
          </div>

          {/* Net position calculation for AC-MBR */}
          <div className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-between ${
            heroNet >= 0
              ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
              : 'bg-slate-900/40 border-slate-800 text-slate-400'
          }`}>
            <span>NET MONTHLY FINANCING POSITION:</span>
            {heroNet >= 0 ? (
              <span>🟢 Cash-positive from day one: you save ₱{heroNet.toLocaleString()}/month MORE than the installment</span>
            ) : (
              <span>⚪ Net ₱{Math.abs(heroNet).toLocaleString()}/month while financing, then ₱{heroMonthlySavings.toLocaleString()}/mo pure savings after</span>
            )}
          </div>
        </div>

        {/* Share Button (Inert) */}
        <div className="flex justify-end border-t border-brand-light/10 pt-4">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-deep/80 hover:bg-brand-deep border border-brand-light/25 hover:border-brand-accent/50 text-brand-glow rounded-xl text-xs font-semibold select-none cursor-not-allowed transition-all opacity-80 shadow">
            <Share2 size={12} /> Share recommendation with installer
          </button>
        </div>

      </div>

      {/* 4. APPLIANCE UPGRADE CATALOG */}
      <div className="space-y-4">
        <div className="border-b border-brand-light/20 pb-2">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calculator size={18} className="text-brand-accent" /> Retrofit Matching Appliance Catalog
          </h2>
          <p className="text-[10px] text-slate-400 mt-0.5">SELECT THE FINANCING TERM TOGGLE ABOVE TO DYNAMICALLY RECALCULATE EMIS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATALOG_ITEMS.map((item) => {
            const monthlySavings = Math.round((item.annualKwhSaved * BLENDED_RATE) / 12);
            const monthlyEmi = Math.round(item.price / emiTerm);
            const netPosition = monthlySavings - monthlyEmi;

            return (
              <div 
                key={item.id}
                className="glass-panel p-5 rounded-xl border border-brand-light/20 flex flex-col justify-between space-y-4 hover:border-brand-accent/30 transition-all duration-300"
              >
                {/* Card Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[8px] font-mono-data text-slate-500 uppercase block">CIRCUIT: {item.circuitCode}</span>
                    <h4 className="text-white font-extrabold text-sm mt-0.5">{item.appliance}</h4>
                  </div>
                  <span className="bg-brand-deep border border-brand-light/25 text-brand-accent text-[8px] font-mono-data px-2 py-0.5 rounded uppercase font-bold shrink-0">
                    {item.annualKwhSaved >= 400 ? 'HIGH SAVINGS' : 'MEASURED'}
                  </span>
                </div>

                {/* Model swap details */}
                <div className="bg-brand-dark/40 rounded-lg p-2.5 border border-brand-light/10 text-[11px] space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current model:</span>
                    <span className="text-slate-400 line-through text-right font-medium">{item.oldModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-accent">Retrofitted:</span>
                    <span className="text-brand-glow text-right font-semibold flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-brand-glow" /> {item.newModel}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                  {item.description}
                </p>

                {/* Financial/Carbon breakdown */}
                <div className="grid grid-cols-3 gap-2 border-t border-brand-light/10 pt-3 text-center font-mono-data text-[10px]">
                  <div className="bg-brand-dark/20 p-2 rounded">
                    <span className="text-slate-500 block uppercase text-[7px]">Price</span>
                    <span className="text-white font-bold block mt-0.5">₱{item.price.toLocaleString()}</span>
                  </div>
                  <div className="bg-brand-dark/20 p-2 rounded">
                    <span className="text-slate-500 block uppercase text-[7px]">Monthly Savings</span>
                    <span className="text-brand-glow font-bold block mt-0.5">₱{monthlySavings.toLocaleString()}</span>
                  </div>
                  <div className="bg-brand-dark/20 p-2 rounded">
                    <span className="text-slate-500 block uppercase text-[7px]">Carbon Offset</span>
                    <span className="text-emerald-400 font-bold block mt-0.5 flex items-center justify-center gap-0.5">
                      <Leaf size={8} /> {item.annualCo2SavedKg >= 1000 ? `${(item.annualCo2SavedKg / 1000).toFixed(2)}t` : `${item.annualCo2SavedKg}kg`}/yr
                    </span>
                  </div>
                </div>

                {/* Installment details */}
                <div className="bg-brand-dark/50 border border-brand-light/10 p-3 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400 font-mono-data text-[10px]">
                    <span>Installment plan:</span>
                    <span className="text-white font-extrabold">₱{monthlyEmi.toLocaleString()}/mo × {emiTerm} mo (0% int)</span>
                  </div>

                  {/* Dynamic Net Position Badge */}
                  <div className={`p-2 rounded text-[10px] font-bold font-mono-data text-center ${
                    netPosition >= 0
                      ? 'bg-emerald-950/25 text-emerald-400 border border-emerald-900/50'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}>
                    {netPosition >= 0 ? (
                      <span>🟢 Cash-positive: You save ₱{netPosition.toLocaleString()}/mo MORE than EMI</span>
                    ) : (
                      <span>⚪ Net -₱{Math.abs(netPosition).toLocaleString()}/mo, then ₱{monthlySavings.toLocaleString()}/mo in pure savings</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SUMMARY / TOTALS STRIP (Floating Bottom Bar) */}
      <div className="fixed bottom-0 inset-x-0 bg-brand-dark/95 border-t border-brand-accent/35 backdrop-blur-md z-40 py-4 px-6 flex justify-center shadow-2xl">
        <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono-data">
          
          {/* Energy & Carbon Accumulation */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="text-center md:text-left">
              <span className="text-slate-500 uppercase text-[8px] tracking-wider block">Combined Capital Cost</span>
              <span className="text-base font-extrabold text-white">₱{combinedPrice.toLocaleString()}</span>
            </div>
            <div className="border-r border-brand-light/25 h-8 hidden md:block"></div>
            
            <div className="text-center md:text-left">
              <span className="text-slate-500 uppercase text-[8px] tracking-wider block">Total Annual Savings</span>
              <span className="text-base font-extrabold text-brand-glow">{combinedKwh.toLocaleString()} kWh/yr</span>
            </div>
            <div className="border-r border-brand-light/25 h-8 hidden md:block"></div>

            <div className="text-center md:text-left">
              <span className="text-slate-500 uppercase text-[8px] tracking-wider block">Total Carbon Reduction</span>
              <span className="text-base font-extrabold text-emerald-400 flex items-center gap-1 justify-center md:justify-start">
                <Leaf size={14} /> {combinedCo2.toFixed(2)} Tons/yr
              </span>
            </div>
            
            <div className="text-[10px] text-emerald-400 italic bg-emerald-950/45 px-2.5 py-1 rounded border border-emerald-900/35 hidden lg:block shrink-0">
              🌳 Equivalent to planting ~{equivalentTrees} trees per year!
            </div>
          </div>

          {/* Combined Installment vs Cash Position */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center md:text-right">
              <span className="text-slate-500 uppercase text-[8px] tracking-wider block">Combined monthly position</span>
              <div className="flex items-center gap-1.5 justify-center md:justify-end">
                <span className="text-xs text-slate-400">(₱{combinedMonthlySavings.toLocaleString()} saves - ₱{combinedEmi.toLocaleString()} EMI)</span>
                <span className={`text-sm font-black ${combinedNet >= 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {combinedNet >= 0 ? '+' : ''}₱{combinedNet.toLocaleString()}/mo
                </span>
              </div>
            </div>

            {/* Inactive demo checkout */}
            <button className="bg-brand-accent hover:bg-brand-glow text-brand-bg px-4 py-2.5 rounded-xl font-bold font-sans text-xs tracking-wide transition-all shadow-md shadow-brand-accent/10 hover:shadow-brand-accent/25 active:scale-95 cursor-not-allowed">
              Submit Upgrade Package
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Upgrade;
