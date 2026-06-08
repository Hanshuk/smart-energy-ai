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
  status: 'normal' | 'warning'; // lead-carbon: removed critical
  chargeRateKw: number; // negative for discharge
  voltage: number;
}

export interface InverterState {
  source: 'solar' | 'battery' | 'grid';
  mode: 'optimized' | 'island_backup' | 'grid_bypass';
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

// 7-Day Simulation Dataset
export interface TimeBlock {
  timeLabel: string;
  solarKw: number;
  houseLoadKw: number;
  batterySoc: number;
  gridImportKw: number;
  tempCelsius: number;
  sourceMix: {
    solar: number;
    battery: number;
    grid: number;
  };
  strategy: string;
  eventLog: string;
}

export interface DayProfile {
  dayName: string;
  dayShort: string;
  isHoliday?: boolean;
  isWeekend?: boolean;
  blocks: TimeBlock[];
}

export const TIME_BLOCK_LABELS = [
  '00:00–03:00',
  '03:00–06:00',
  '06:00–09:00',
  '09:00–12:00',
  '12:00–15:00',
  '15:00–18:00',
  '18:00–21:00',
  '21:00–24:00'
];

const createBlocksForDay = (loadFactor: number, _isHolidayOrWeekend = false): TimeBlock[] => {
  const load0 = Number((0.8 * loadFactor).toFixed(2));
  const load1 = Number((0.7 * loadFactor).toFixed(2));
  const load2 = Number((2.2 * loadFactor).toFixed(2));
  const load3 = Number((3.1 * loadFactor).toFixed(2));
  const load4 = Number((3.5 * loadFactor).toFixed(2));
  const load5 = Number((2.8 * loadFactor).toFixed(2));
  const load6 = Number((4.2 * loadFactor).toFixed(2));
  const load7 = Number((1.5 * loadFactor).toFixed(2));

  return [
    {
      timeLabel: '00:00–03:00',
      solarKw: 0.0,
      houseLoadKw: load0,
      batterySoc: 40,
      gridImportKw: load0, // Drawing from cheap night grid to preserve battery base
      tempCelsius: 32.5,
      sourceMix: { solar: 0, battery: 0, grid: 100 },
      strategy: 'Off-peak Night shifting charging active (₱11.02/kWh). preserving battery reserve.',
      eventLog: 'Grid power active. Pre-charge sequence holding target for tomorrow.'
    },
    {
      timeLabel: '03:00–06:00',
      solarKw: 0.0,
      houseLoadKw: load1,
      batterySoc: 75, // pre-charged from grid overnight
      gridImportKw: 0.0,
      tempCelsius: 31.8,
      sourceMix: { solar: 0, battery: 100, grid: 0 },
      strategy: 'Battery support active. Off-peak rate pre-charge finished.',
      eventLog: 'Switched house load to battery. Pre-charged to 75% target.'
    },
    {
      timeLabel: '06:00–09:00',
      solarKw: 0.9,
      houseLoadKw: load2,
      batterySoc: 68,
      gridImportKw: Number((load2 - 0.9 - 1.0).toFixed(2)), // Solar weak, battery discharges, grid bridges if needed
      tempCelsius: 33.2,
      sourceMix: { solar: 35, battery: 45, grid: 20 },
      strategy: 'Peak rate active (₱15.69/kWh). Weak morning solar assisted by battery + grid.',
      eventLog: 'Solar power rising. Battery supporting load with minor grid assist.'
    },
    {
      timeLabel: '09:00–12:00',
      solarKw: 4.5,
      houseLoadKw: load3,
      batterySoc: 75, // charging surplus
      gridImportKw: 0.0,
      tempCelsius: 35.5,
      sourceMix: { solar: 100, battery: 0, grid: 0 },
      strategy: 'Maximum Solar priority. Surplus solar charging battery.',
      eventLog: 'Zero grid draw. Solar covers total house load and charges battery.'
    },
    {
      timeLabel: '12:00–15:00',
      solarKw: 5.6,
      houseLoadKw: load4,
      batterySoc: 82, // battery high
      gridImportKw: 0.0,
      tempCelsius: 38.4,
      sourceMix: { solar: 100, battery: 0, grid: 0 },
      strategy: 'Peak solar. Battery charging at 1.1 kW. Grid idle.',
      eventLog: 'Surplus solar charging battery. Battery temperature warm but safe.'
    },
    {
      timeLabel: '15:00–18:00',
      solarKw: 1.8,
      houseLoadKw: load5,
      batterySoc: 78,
      gridImportKw: 0.0,
      tempCelsius: 36.8,
      sourceMix: { solar: 55, battery: 45, grid: 0 },
      strategy: 'Solar ramping down. Battery covers load deficit to dodge peak rates.',
      eventLog: 'Battery assisting solar as generation declines. Grid remains isolated.'
    },
    {
      timeLabel: '18:00–21:00',
      solarKw: 0.0,
      houseLoadKw: load6, // Evening cooking/AC peak
      batterySoc: 52,
      gridImportKw: Number((load6 - 2.5).toFixed(2)), // Battery limits discharge to 2.5 kW, grid bridges
      tempCelsius: 35.1,
      sourceMix: { solar: 0, battery: 60, grid: 40 },
      strategy: 'Evening load peak. Stored battery discharging (2.5kW max), grid bridging deficit.',
      eventLog: 'High household demand. Battery discharging at maximum safe rate. Grid bridging.'
    },
    {
      timeLabel: '21:00–24:00',
      solarKw: 0.0,
      houseLoadKw: load7,
      batterySoc: 35,
      gridImportKw: 0.0,
      tempCelsius: 33.6,
      sourceMix: { solar: 0, battery: 100, grid: 0 },
      strategy: 'Late evening. House load covered entirely by remaining battery reserve.',
      eventLog: 'Load reduced. Battery powering household. Approaching off-peak charging window.'
    }
  ];
};

export const SIMULATION_DATA: DayProfile[] = [
  {
    dayName: 'Day 1 · Monday',
    dayShort: 'Mon',
    blocks: createBlocksForDay(1.0)
  },
  {
    dayName: 'Day 2 · Tuesday',
    dayShort: 'Tue',
    blocks: createBlocksForDay(0.95)
  },
  {
    dayName: 'Day 3 · Wednesday',
    dayShort: 'Wed',
    isHoliday: true, // Holiday profile: higher usage
    blocks: createBlocksForDay(1.35, true)
  },
  {
    dayName: 'Day 4 · Thursday',
    dayShort: 'Thu',
    blocks: createBlocksForDay(1.02)
  },
  {
    dayName: 'Day 5 · Friday',
    dayShort: 'Fri',
    blocks: createBlocksForDay(1.08)
  },
  {
    dayName: 'Day 6 · Saturday',
    dayShort: 'Sat',
    isWeekend: true, // Weekend profile: higher usage
    blocks: createBlocksForDay(1.45, true)
  },
  {
    dayName: 'Day 7 · Sunday',
    dayShort: 'Sun',
    isWeekend: true,
    blocks: createBlocksForDay(1.38, true)
  }
];

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
