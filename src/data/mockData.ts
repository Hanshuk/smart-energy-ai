// Smart Energy AI System - Mock Data Stubs for Presentation Demo

export interface CircuitInfo {
  code: string;
  name: string;
  specs: string;
  currentDrawKw: number;
  currentDrawAmps: number;
  baselineMedianKw: number;
  status: 'normal' | 'advisory' | 'fault' | 'learning';
  anomalyMinutes: number;
  description: string;
  confidence: string;
  operatingRange: string;
  todayKwh: number;
}

export interface BatteryStatus {
  soc: number; // State of Charge in %
  tempCelsius: number;
  status: 'normal' | 'warning' | 'critical';
  chargeRateKw: number; // negative for discharge
  voltage: number;
}

export interface InverterState {
  source: 'solar' | 'battery' | 'grid';
  mode: 'optimized' | 'safe_standby' | 'grid_bypass';
  decisionTimeLeftSeconds: number; // 60 seconds cycle countdown
  lastNightlySync: string; // 2:00 AM
}

export interface FaultRecommendation {
  id: string;
  circuitCode: string;
  appliance: string;
  issue: string;
  severity: 'warning' | 'critical';
  signature: string;
  efficiencyLoss: string;
  remedy: string;
  costEstimate: number;
  savingsMonthly: number;
  paybackMonths: number;
}

export interface SavingsMetrics {
  confidence: 'Estimated' | 'Measured' | 'Bill-Reconciled';
  monthlySavingsNightShift: number;
  monthlySavingsSolar: number;
  monthlySavingsOptimized: number;
  totalMonthlySavings: number;
  installCost: number;
  projected10YearSavings: number;
  paybackMonths: number;
}

export const CIRCUITS_DATA: CircuitInfo[] = [
  {
    code: 'AC-MBR',
    name: 'Master Bedroom AC',
    specs: '3.5 HP Split-Type',
    currentDrawKw: 3.10,
    currentDrawAmps: 15.2,
    baselineMedianKw: 2.00,
    status: 'fault',
    anomalyMinutes: 22,
    description: 'Master bedroom air conditioning unit. High baseline draw indicates degrading compressor & clogged filters.',
    confidence: 'Bill-Reconciled',
    operatingRange: '10–18A nominal',
    todayKwh: 14.8,
  },
  {
    code: 'AC-LR',
    name: 'Living Room AC',
    specs: '3.0–4.0 HP Inverter',
    currentDrawKw: 2.80,
    currentDrawAmps: 13.8,
    baselineMedianKw: 2.60,
    status: 'normal',
    anomalyMinutes: 0,
    description: 'Living room inverter air conditioner. Operating at high capacity but within target bounds.',
    confidence: 'Bill-Reconciled',
    operatingRange: '12–22A nominal',
    todayKwh: 22.4,
  },
  {
    code: 'FRIDGE',
    name: 'Kitchen Refrigerator',
    specs: 'Two-Door Inverter',
    currentDrawKw: 0.48,
    currentDrawAmps: 2.4,
    baselineMedianKw: 0.22,
    status: 'advisory',
    anomalyMinutes: 0,
    description: 'Kitchen refrigerator showing signs of worn door seal. Run-time cycles are creeping up.',
    confidence: 'Measured',
    operatingRange: '1–4A nominal',
    todayKwh: 4.1,
  },
  {
    code: 'PUMP',
    name: 'Water Pump',
    specs: '1.5 HP Pool/Utility',
    currentDrawKw: 1.10,
    currentDrawAmps: 5.4,
    baselineMedianKw: 1.20,
    status: 'normal',
    anomalyMinutes: 0,
    description: 'Pool and main residential water pump. Running nominal.',
    confidence: 'Bill-Reconciled',
    operatingRange: '4–10A nominal',
    todayKwh: 3.6,
  },
  {
    code: 'WHT',
    name: 'Water Heater',
    specs: 'Multipoint shower',
    currentDrawKw: 2.30,
    currentDrawAmps: 10.0,
    baselineMedianKw: 2.30,
    status: 'normal',
    anomalyMinutes: 0,
    description: 'Bathroom water heater. Pure resistive load used as sensor calibration reference.',
    confidence: 'Bill-Reconciled',
    operatingRange: '8–12A nominal',
    todayKwh: 1.8,
  },
  {
    code: 'MAIN',
    name: 'Whole-House Main',
    specs: '100A Main Breaker',
    currentDrawKw: 9.78,
    currentDrawAmps: 46.8,
    baselineMedianKw: 8.92,
    status: 'normal',
    anomalyMinutes: 0,
    description: 'Main incoming service monitoring aggregate house power.',
    confidence: 'Bill-Reconciled',
    operatingRange: 'Up to 100A',
    todayKwh: 46.7,
  }
];

export const BATTERY_DATA: BatteryStatus = {
  soc: 78,
  tempCelsius: 34.1,
  status: 'normal',
  chargeRateKw: 1.1, // charging from solar
  voltage: 51.2
};

export const INVERTER_DATA: InverterState = {
  source: 'solar',
  mode: 'optimized',
  decisionTimeLeftSeconds: 42,
  lastNightlySync: '02:00 AM'
};

export const FAULTS_DATA: FaultRecommendation[] = [
  {
    id: 'F-1',
    circuitCode: 'AC-MBR',
    appliance: 'Master Bedroom AC',
    issue: 'Degraded Compressor (Startup Spike & High Run Power)',
    severity: 'critical',
    signature: 'Startup draw >3x nominal, running draw +15% above 30-day baseline for 22 mins',
    efficiencyLoss: 'Running draw 3.10 kW vs baseline 2.00 kW (+55%)',
    remedy: 'Replace with high-efficiency 3.5HP Inverter AC',
    costEstimate: 64000,
    savingsMonthly: 8550,
    paybackMonths: 7.5
  },
  {
    id: 'F-2',
    circuitCode: 'FRIDGE',
    appliance: 'Kitchen Refrigerator',
    issue: 'Fridge Door Seal (Run time up 20-40%)',
    severity: 'warning',
    signature: 'Compressor duty cycle increased to 72% vs 45% historical median baseline',
    efficiencyLoss: 'Continuous background crawl 0.48 kW vs baseline 0.22 kW (+118%)',
    remedy: 'Replace magnetic door seal gaskets',
    costEstimate: 3200,
    savingsMonthly: 850,
    paybackMonths: 3.8
  }
];

export const SAVINGS_DATA: SavingsMetrics = {
  confidence: 'Measured',
  monthlySavingsNightShift: 4850,
  monthlySavingsSolar: 12400,
  monthlySavingsOptimized: 3150,
  totalMonthlySavings: 20400,
  installCost: 750000,
  projected10YearSavings: 2200000,
  paybackMonths: 42
};

// Weather-driven charge targets
export interface WeatherForecast {
  day: string;
  condition: 'Sunny' | 'Mild' | 'Heavy cloud' | 'Rainy/Storm';
  targetSoc: number;
}

export const WEATHER_FORECASTS: WeatherForecast[] = [
  { day: 'Today', condition: 'Sunny', targetSoc: 75 },
  { day: 'Tomorrow', condition: 'Mild', targetSoc: 80 },
  { day: 'Tuesday', condition: 'Heavy cloud', targetSoc: 88 },
  { day: 'Wednesday', condition: 'Rainy/Storm', targetSoc: 95 }
];

export const PRICING_FACTS = {
  daytimeRate: 15.69,
  nightRate: 11.02,
  arbitrageDelta: 4.67,
  utilityName: 'Meralco'
};

// Chart Data generator for detail modal
export interface HourlyData {
  time: string;
  actual: number;
  baseline: number;
  isAnomaly?: boolean;
}

export const getChartDataForCircuit = (code: string): HourlyData[] => {
  const data: HourlyData[] = [];
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', 
    '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  const profiles: Record<string, { base: number; mult: number; anomalyHour?: string }> = {
    'AC-MBR': { base: 2.0, mult: 1.1, anomalyHour: '14:00' },
    'AC-LR': { base: 2.6, mult: 1.05 },
    'FRIDGE': { base: 0.22, mult: 1.5 },
    'PUMP': { base: 1.2, mult: 0.95 },
    'WHT': { base: 2.3, mult: 1.0 },
    'MAIN': { base: 8.9, mult: 1.1 },
  };

  const prof = profiles[code] || { base: 1.0, mult: 1.0 };

  hours.forEach((time) => {
    let baseline = prof.base;
    let actual = baseline * prof.mult;

    // Add some noise
    const noise = (Math.sin(time.charCodeAt(1)) * 0.1);
    baseline = Math.max(0.1, Number((baseline + noise).toFixed(2)));
    actual = Math.max(0.1, Number((actual + noise * 1.2).toFixed(2)));

    // Specific profiles overrides
    if (code === 'AC-MBR' && (time === '12:00' || time === '14:00' || time === '16:00')) {
      actual = baseline * 1.55; // 55% over baseline anomaly
    }
    if (code === 'WHT' && (time !== '08:00' && time !== '20:00')) {
      actual = 0;
      baseline = 0.1; // inactive during non-shower hours
    }
    
    const isAnomaly = code === 'AC-MBR' && (time === '12:00' || time === '14:00' || time === '16:00');

    data.push({
      time,
      actual,
      baseline,
      isAnomaly
    });
  });

  return data;
};
