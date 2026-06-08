import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  Award, 
  Smartphone, 
  Monitor, 
  Lock, 
  RefreshCw, 
  Battery, 
  Wifi, 
  Compass,
  Bell,
  X,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
  QrCode,
  Copy,
  Check,
  Brain
} from 'lucide-react';

// Import pages
import Overview from './pages/Overview';
import Circuits from './pages/Circuits';
import Faults from './pages/Faults';
import Optimization from './pages/Optimization';
import Upgrade from './pages/Upgrade';
import Savings from './pages/Savings';
import Intelligence from './pages/Intelligence';

// Clean 404 Page
const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
      <HelpCircle size={48} className="text-brand-accent animate-bounce" />
      <h1 className="text-2xl font-black text-white">Screen Not Found</h1>
      <p className="text-slate-400 text-xs max-w-sm">
        The requested routing telemetry path does not exist on this resident microgrid node.
      </p>
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-brand-deep border border-brand-light/35 text-brand-glow text-xs font-semibold rounded-xl hover:bg-brand-medium/50 transition-all cursor-pointer"
      >
        Return to Overview
      </button>
    </div>
  );
};

// Navigation Item Definition
interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { name: 'Live Overview', path: '/', icon: Activity },
  { name: 'Usage Intelligence', path: '/intelligence', icon: Brain },
  { name: 'Circuits', path: '/circuits', icon: Cpu },
  { name: 'Predictive Fault AI', path: '/faults', icon: ShieldAlert },
  { name: 'Energy Optimization', path: '/optimization', icon: Zap },
  { name: 'Upgrade Engine', path: '/upgrade', icon: Award },
  { name: 'Savings & ROI', path: '/savings', icon: TrendingUp },
];

export type DemoState = 'OPTIMAL' | 'WARNING' | 'OUTAGE';

const AppContent: React.FC<{ 
  isMobilePreview: boolean; 
  demoState: DemoState; 
  setDemoState: React.Dispatch<React.SetStateAction<DemoState>>;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  isAlertOpen: boolean;
  setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentDayIndex: number;
  setCurrentDayIndex: React.Dispatch<React.SetStateAction<number>>;
  currentBlockIndex: number;
  setCurrentBlockIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ 
  isMobilePreview, 
  demoState, 
  setDemoState, 
  unreadCount, 
  setUnreadCount,
  isAlertOpen,
  setIsAlertOpen,
  currentDayIndex,
  setCurrentDayIndex,
  currentBlockIndex,
  setCurrentBlockIndex,
  isPlaying,
  setIsPlaying
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticker, setTicker] = useState(42);

  // 60 seconds cycle counter
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format the clock for the phone mockup
  const [timeStr, setTimeStr] = useState('09:41 AM');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      setTimeStr(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 30000);
    return () => clearInterval(clockInterval);
  }, []);

  // Alert severity color-code matching
  const alertItems = [
    {
      id: 'a1',
      severity: 'critical',
      title: 'AC-MBR degraded compressor',
      desc: 'Startup draw >3x nominal. Recommended unit replacement.',
      path: '/faults'
    },
    {
      id: 'a2',
      severity: 'warning',
      title: 'Fridge door seal leakage',
      desc: 'Background consumption up 35%. Check gaskets.',
      path: '/faults'
    },
    {
      id: 'a3',
      severity: 'info',
      title: 'Pre-charge battery to 75%',
      desc: 'Night tariff pre-charge target set for Sunny weather forecast.',
      path: '/optimization'
    },
    {
      id: 'a4',
      severity: 'info',
      title: 'Nightly sync complete',
      desc: '2:00 AM machine learning models baseline updated.',
      path: '/circuits'
    }
  ];

  const handleAlertClick = (path: string) => {
    setIsAlertOpen(false);
    setUnreadCount(0);
    navigate(path);
  };

  // Layout wrapper that changes design if isMobilePreview is true
  if (isMobilePreview) {
    return (
      <div className="flex justify-center items-center py-6 min-h-[calc(100vh-64px)] bg-brand-bg/95 transition-all duration-500 relative">
        
        {/* Phone Bezel */}
        <div className="relative w-[375px] h-[812px] rounded-[50px] bg-slate-900 border-[8px] border-slate-800 shadow-2xl flex flex-col overflow-hidden ring-12 ring-slate-950/20 animate-fade-in">
          
          {/* Phone Speaker & Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center">
            <div className="w-12 h-1 bg-slate-700 rounded-full mb-1"></div>
          </div>

          {/* Status Bar */}
          <div className="h-10 bg-brand-bg px-6 pt-3 flex justify-between items-center text-[10px] font-mono-data text-brand-accent/80 select-none z-40 shrink-0">
            <span>{timeStr}</span>
            <div className="flex items-center gap-1.5">
              <Wifi size={10} />
              {unreadCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
              <span className="text-[8px] border border-brand-accent/40 rounded px-0.5 scale-90">LoRa</span>
              <Battery size={12} className={demoState === 'OUTAGE' ? 'text-rose-500 animate-pulse' : demoState === 'WARNING' ? 'text-amber-500' : 'text-emerald-400'} />
            </div>
          </div>

          {/* Safe mode banner inside mobile */}
          <div className="bg-brand-deep/80 border-b border-brand-light/20 py-1.5 px-3 flex items-center justify-between gap-1.5 text-[9px] font-medium text-brand-accent select-none z-30 shrink-0">
            <div className="flex items-center gap-1">
              <Lock size={10} className="text-brand-accent" />
              <span>READ-ONLY PORTAL</span>
            </div>
            
            {/* Tappable status pill in mobile header for demo */}
            <button 
              onClick={() => {
                setDemoState((prev) => {
                  if (prev === 'OPTIMAL') return 'WARNING';
                  if (prev === 'WARNING') return 'OUTAGE';
                  return 'OPTIMAL';
                });
              }}
              className={`px-1.5 py-0.5 rounded-full text-[7px] font-bold border transition-colors ${
                demoState === 'OPTIMAL' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : demoState === 'WARNING' ? 'bg-amber-950/60 text-amber-400 border-amber-800' : 'bg-rose-950/60 text-rose-400 border-rose-800'
              }`}
            >
              STATE: {demoState === 'OUTAGE' ? 'OUTAGE' : demoState}
            </button>
          </div>

          {/* Mobile Main Content Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-20 bg-brand-bg relative scroll-smooth">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Overview 
                    demoState={demoState} 
                    setDemoState={setDemoState} 
                    currentDayIndex={currentDayIndex}
                    setCurrentDayIndex={setCurrentDayIndex}
                    currentBlockIndex={currentBlockIndex}
                    setCurrentBlockIndex={setCurrentBlockIndex}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                  />
                } 
              />
              <Route 
                path="/intelligence" 
                element={
                  <Intelligence 
                    currentDayIndex={currentDayIndex}
                    setCurrentDayIndex={setCurrentDayIndex}
                    currentBlockIndex={currentBlockIndex}
                    setCurrentBlockIndex={setCurrentBlockIndex}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                  />
                } 
              />
              <Route path="/circuits" element={<Circuits />} />
              <Route path="/faults" element={<Faults />} />
              <Route 
                path="/optimization" 
                element={
                  <Optimization 
                    currentDayIndex={currentDayIndex}
                    currentBlockIndex={currentBlockIndex}
                  />
                } 
              />
              <Route path="/upgrade" element={<Upgrade />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>

          {/* Mobile Navigation - Bottom Bar */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-brand-dark/95 border-t border-brand-light/20 backdrop-blur-md flex justify-around items-center px-2 z-40">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] transition-colors ${
                    isActive ? 'text-brand-glow font-semibold' : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-brand-glow' : ''} />
                  <span className="mt-1 leading-none text-center truncate w-full max-w-[70px]">{item.name.split(' ')[0]}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/upgrade"
              className={() => 
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] transition-colors ${
                  location.pathname === '/upgrade' || location.pathname === '/savings'
                    ? 'text-brand-glow font-semibold'
                    : 'text-slate-400 hover:text-slate-300'
                }`
              }
            >
              <Compass size={18} className={location.pathname === '/upgrade' || location.pathname === '/savings' ? 'text-brand-glow' : ''} />
              <span className="mt-1 leading-none text-center">Engine</span>
            </NavLink>
          </div>

          {/* Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-700 rounded-full z-50"></div>
        </div>
      </div>
    );
  }

  // Desktop View layout
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-brand-bg text-slate-100 relative">
      
      {/* Desktop Left Sidebar */}
      <aside className="w-64 bg-brand-dark/90 border-r border-brand-light/20 flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-6 flex-1 flex flex-col">
          <div className="px-2">
            <span className="text-[10px] font-mono-data text-brand-accent/60 tracking-widest block mb-1">DECISION CYCLE</span>
            <div className="flex items-center gap-2 font-mono-data">
              <RefreshCw size={12} className="text-brand-accent animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-brand-glow font-bold text-sm">RE-EVAL IN {ticker}S</span>
            </div>
          </div>
          
          <nav className="space-y-1 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-deep border-l-4 border-brand-accent text-brand-glow font-medium shadow-md shadow-brand-accent/5'
                        : 'text-slate-400 hover:bg-brand-deep/30 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Desktop Sidebar Footer */}
        <div className="space-y-4 pt-4 shrink-0">
          
          {/* Tasteful Live Demo Control widget on desktop sidebar */}
          <div className="bg-brand-deep/50 border border-brand-light/20 rounded-xl p-3 space-y-2">
            <span className="text-[8px] font-mono-data text-brand-accent/70 tracking-widest uppercase block">Live Demo control</span>
            <div className="grid grid-cols-3 gap-1">
              <button 
                onClick={() => setDemoState('OPTIMAL')}
                className={`py-1 rounded text-[8px] font-black transition-all cursor-pointer ${
                  demoState === 'OPTIMAL' ? 'bg-emerald-500 text-brand-bg shadow-sm shadow-emerald-500/10' : 'bg-brand-dark text-slate-400 hover:text-slate-200'
                }`}
              >
                NORMAL
              </button>
              <button 
                onClick={() => setDemoState('WARNING')}
                className={`py-1 rounded text-[8px] font-black transition-all cursor-pointer ${
                  demoState === 'WARNING' ? 'bg-amber-500 text-brand-bg shadow-sm shadow-amber-500/10' : 'bg-brand-dark text-slate-400 hover:text-slate-200'
                }`}
              >
                WARN
              </button>
              <button 
                onClick={() => setDemoState('OUTAGE')}
                className={`py-1 rounded text-[8px] font-black transition-all cursor-pointer ${
                  demoState === 'OUTAGE' ? 'bg-rose-500 text-brand-bg shadow-sm shadow-rose-500/10' : 'bg-brand-dark text-slate-400 hover:text-slate-200'
                }`}
              >
                OUTAGE
              </button>
            </div>
          </div>

          <div className="border-t border-brand-light/10 pt-4 space-y-2 text-xs font-mono-data px-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Night Sync:</span>
              <span className="text-brand-accent font-semibold">2:00 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Main Breaker:</span>
              <span className="text-brand-glow font-semibold">9.78 kW</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Utility:</span>
              <span className="text-blue-400 font-semibold">Meralco</span>
            </div>
            <div className="text-[7px] text-slate-600 border-t border-brand-light/5 pt-2 text-center">
              Demonstration build · Representative data
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full scroll-smooth">
        <Routes>
          <Route 
            path="/" 
            element={
              <Overview 
                demoState={demoState} 
                setDemoState={setDemoState} 
                currentDayIndex={currentDayIndex}
                setCurrentDayIndex={setCurrentDayIndex}
                currentBlockIndex={currentBlockIndex}
                setCurrentBlockIndex={setCurrentBlockIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            } 
          />
          <Route 
            path="/intelligence" 
            element={
              <Intelligence 
                currentDayIndex={currentDayIndex}
                setCurrentDayIndex={setCurrentDayIndex}
                currentBlockIndex={currentBlockIndex}
                setCurrentBlockIndex={setCurrentBlockIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            } 
          />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/faults" element={<Faults />} />
          <Route 
            path="/optimization" 
            element={
              <Optimization 
                currentDayIndex={currentDayIndex}
                currentBlockIndex={currentBlockIndex}
              />
            } 
          />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Alerts Overlay Panel Drawer */}
      {isAlertOpen && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-brand-dark/95 border-l border-brand-light/30 shadow-2xl backdrop-blur-md p-6 z-50 flex flex-col justify-between animate-slide-in">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-brand-light/25 pb-3">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-brand-glow animate-pulse" />
                <h3 className="text-white font-bold text-sm">System Alerts ({unreadCount})</h3>
              </div>
              <button 
                onClick={() => setIsAlertOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 animate-fade-in">
              {alertItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleAlertClick(item.path)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:scale-102 flex gap-3 ${
                    item.severity === 'critical' 
                      ? 'bg-rose-950/15 border-rose-900/50 hover:bg-rose-950/25 text-rose-200' 
                      : item.severity === 'warning' 
                      ? 'bg-amber-950/15 border-amber-900/50 hover:bg-amber-950/25 text-amber-200' 
                      : 'bg-brand-deep/30 border-brand-light/20 hover:bg-brand-deep/50 text-brand-accent'
                  }`}
                >
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <span className="font-bold flex items-center gap-1">
                      {item.title} <ExternalLink size={10} />
                    </span>
                    <p className="text-[10px] text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={() => {
              setUnreadCount(0);
              setIsAlertOpen(false);
            }}
            className="w-full py-2 bg-brand-deep border border-brand-light/35 hover:bg-brand-medium text-brand-glow text-xs font-semibold rounded-lg transition-all cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>
      )}
    </div>
  );
};

export function App() {
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [demoState, setDemoState] = useState<DemoState>('OPTIMAL');
  const [unreadCount, setUnreadCount] = useState(2);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isQrOpen, setIsQrOpen] = useState(false);
  
  // Simulator state variables
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(3);
  const [isPlaying, setIsPlaying] = useState(true);

  // Simulator Play/Pause Timer Block
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentBlockIndex((prevBlock) => {
        if (prevBlock < 7) {
          return prevBlock + 1;
        } else {
          setCurrentDayIndex((prevDay) => (prevDay + 1) % 7);
          return 0;
        }
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // URL targeting state for dynamic QR codes
  const [qrUrl, setQrUrl] = useState('https://smart-energy-ai.vercel.app');
  const [copied, setCopied] = useState(false);

  // Set default QR URL to actual viewport if available on live server
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setQrUrl(window.location.origin + window.location.pathname);
    }
  }, []);

  // Auto-dismiss splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showSplash) {
    return (
      <div 
        onClick={() => setShowSplash(false)}
        className="fixed inset-0 bg-[#091312] z-9999 flex flex-col justify-center items-center text-center cursor-pointer select-none"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(62,194,179,0.06),transparent_70%)] pointer-events-none"></div>
        
        <div className="space-y-6 max-w-sm px-6">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-accent to-brand-deep flex items-center justify-center shadow-2xl shadow-brand-accent/20 border border-brand-accent/30 animate-pulse-glow">
            <Zap size={32} className="text-brand-glow" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-white text-3xl tracking-tight leading-none">Smart Energy <span className="text-brand-accent">AI</span></h1>
            <span className="text-[10px] font-mono-data text-brand-accent/60 tracking-widest block uppercase">Self-Managing Home Microgrid</span>
          </div>

          <div className="h-1 w-24 bg-brand-deep mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-brand-glow rounded-full animate-loading-bar" style={{ width: '40%' }}></div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            "Your home's self-learning power brain"
          </p>
          
          <span className="text-[8px] text-slate-600 block uppercase tracking-widest pt-4 animate-pulse">Tap screen to skip intro</span>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-brand-bg flex flex-col font-sans antialiased text-slate-200 selection:bg-brand-accent selection:text-brand-bg relative">
        
        {/* Subtle grid background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,62,58,0.1),transparent_50%)] pointer-events-none"></div>

        {/* Top Control Bar / Header */}
        <header className="h-16 border-b border-brand-light/20 bg-brand-dark/95 backdrop-blur px-6 flex justify-between items-center z-50 shrink-0">
          
          {/* Branding */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-accent to-brand-deep flex items-center justify-center shadow-lg shadow-brand-accent/20">
              <Zap size={18} className="text-brand-glow" />
            </div>
            <div>
              <span className="font-display font-extrabold text-white text-base tracking-tight leading-none">Smart Energy <span className="text-brand-accent">AI</span></span>
              <span className="text-[10px] font-mono-data text-brand-accent/60 block leading-none mt-0.5">PHILIPPINES RESIDENTIAL DEMO</span>
            </div>
          </div>

          {/* Center: Toggle buttons for Desktop / Mobile View */}
          <div className="flex items-center bg-brand-bg border border-brand-light/35 rounded-lg p-1 gap-1">
            <button
              onClick={() => setIsMobilePreview(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                !isMobilePreview
                  ? 'bg-brand-deep text-brand-glow shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Desktop View</span>
            </button>
            <button
              onClick={() => setIsMobilePreview(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isMobilePreview
                  ? 'bg-brand-deep text-brand-glow shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Mobile Preview</span>
            </button>
          </div>

          {/* Right: Notifications trigger, QR trigger & Safety Notice */}
          <div className="flex items-center gap-2">
            
            {/* Share QR Trigger */}
            <button 
              onClick={() => setIsQrOpen(true)}
              className="p-2 rounded-lg bg-brand-deep border border-brand-light/20 text-slate-300 hover:text-brand-glow hover:border-brand-accent/40 transition-all cursor-pointer shadow-sm flex items-center justify-center"
              title="Generate Demo QR Code"
            >
              <QrCode size={16} />
            </button>

            {/* Notifications Button */}
            <button 
              onClick={() => setIsAlertOpen(!isAlertOpen)}
              className="relative p-2 rounded-lg bg-brand-deep border border-brand-light/20 text-slate-300 hover:text-brand-glow hover:border-brand-accent/40 transition-all cursor-pointer shadow-sm"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 border border-brand-dark animate-pulse"></span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-2 bg-brand-bg border border-brand-light/20 rounded-lg py-1.5 px-3">
              <Lock size={12} className="text-emerald-400" />
              <span className="text-[10px] font-mono-data text-emerald-400/90 font-medium uppercase tracking-wider">🔒 Read-Only Telemetry Portal</span>
            </div>
          </div>

        </header>

        {/* Inner Content Area */}
        <AppContent 
          isMobilePreview={isMobilePreview} 
          demoState={demoState} 
          setDemoState={setDemoState}
          unreadCount={unreadCount}
          setUnreadCount={setUnreadCount}
          isAlertOpen={isAlertOpen}
          setIsAlertOpen={setIsAlertOpen}
          currentDayIndex={currentDayIndex}
          setCurrentDayIndex={setCurrentDayIndex}
          currentBlockIndex={currentBlockIndex}
          setCurrentBlockIndex={setCurrentBlockIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />

        {/* QR Code Presentation Modal */}
        {isQrOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-9999 animate-fade-in font-sans">
            <div className="glass-panel w-full max-w-sm rounded-2xl p-6 border border-brand-light/45 shadow-2xl relative space-y-4">
              
              <button 
                onClick={() => setIsQrOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-2">
                <QrCode size={28} className="text-brand-glow mx-auto animate-pulse" />
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Presenter Share Portal</h3>
                <p className="text-slate-400 text-[10px] max-w-xs mx-auto leading-relaxed">
                  Open this link on your smartphone to naturally demonstrate the mobile phone viewport layout live.
                </p>
              </div>

              {/* Dynamic QR Output Box */}
              <div className="bg-white p-3 rounded-lg w-[184px] h-[184px] mx-auto flex items-center justify-center shadow-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=0a1f1d&bgcolor=ffffff&data=${encodeURIComponent(qrUrl)}`} 
                  alt="Share QR Code"
                  className="w-[160px] h-[160px]"
                />
              </div>

              {/* Custom Target Input */}
              <div className="space-y-1.5 text-left text-xs font-mono-data">
                <label className="text-slate-500 text-[8px] uppercase">Target Deployed Demo URL</label>
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    className="flex-1 bg-brand-bg/80 border border-brand-light/30 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none focus:border-brand-accent font-sans"
                    placeholder="https://..."
                  />
                  <button 
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 bg-brand-deep border border-brand-light/35 rounded hover:bg-brand-medium text-brand-glow flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    title="Copy URL"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </HashRouter>
  );
}

export default App;
