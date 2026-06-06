import { useEffect, useRef } from 'react';
import { Bell, Compass, WifiOff, Layers, Activity, RefreshCw } from 'lucide-react';
import { gsap } from 'gsap';

interface FeaturesProps {
  simCapsuleFormat: 'name' | 'name_time' | 'time' | 'name_countdown';
  setSimCapsuleFormat: (fmt: 'name' | 'name_time' | 'time' | 'name_countdown') => void;
  selectedOemProfile: 'oppo' | 'vivo' | 'samsung';
  setSelectedOemProfile: (profile: 'oppo' | 'vivo' | 'samsung') => void;
  syncLogs: string[];
  triggerMockSync: () => void;
  countdown: string;
}

export function Features({
  simCapsuleFormat,
  setSimCapsuleFormat,
  selectedOemProfile,
  setSelectedOemProfile,
  syncLogs,
  triggerMockSync,
  countdown
}: FeaturesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const capsuleTextRef = useRef<HTMLSpanElement>(null);
  const oemDetailsRef = useRef<HTMLDivElement>(null);

  // Transition the status capsule on format change
  useEffect(() => {
    if (!capsuleRef.current) return;
    
    gsap.fromTo(capsuleRef.current,
      { scale: 0.85, opacity: 0.7 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: 'elastic.out(1.2, 0.5)',
        overwrite: 'auto'
      }
    );

    if (capsuleTextRef.current) {
      gsap.fromTo(capsuleTextRef.current,
        { y: 4, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        }
      );
    }
  }, [simCapsuleFormat]);

  // Stagger details list inside the OEM Profile box on selection change
  useEffect(() => {
    if (!oemDetailsRef.current) return;
    gsap.fromTo(oemDetailsRef.current.children,
      { opacity: 0, x: -10 },
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.out',
        overwrite: 'auto'
      }
    );
  }, [selectedOemProfile]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header block reveal
      gsap.fromTo('.features-header-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.features-header-reveal',
            start: 'top 85%'
          }
        }
      );

      // Staggered bento cards entrance
      gsap.fromTo('.feature-card',
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.feature-card',
            start: 'top 85%'
          }
        }
      );

      const cards = gsap.utils.toArray('.feature-card') as HTMLElement[];

      cards.forEach((card) => {
        const handleMouseMove = (e: MouseEvent) => {
          if (window.innerWidth < 1024) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -6; // 6 degrees max tilt
          const rotateY = ((x - centerX) / centerX) * 6;

          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.015,
            transformPerspective: 1000,
            ease: 'power2.out',
            duration: 0.3,
            overwrite: 'auto'
          });
        };

        const handleMouseLeave = () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            ease: 'power3.out',
            duration: 0.5,
            overwrite: 'auto'
          });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          card.removeEventListener('mousemove', handleMouseMove);
          card.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
      <div className="features-header-reveal text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Designed for Android background limits.
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Android OEM skins aggressively kill background tasks. DeenPulse works around these constraints using local foreground services and specific alarm profiles, keeping your device synced without battery drain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Card 1: Interactive Status Capsule Simulator (Col 7) */}
        <div className="feature-card md:col-span-7 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-colors duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00F29D]/10 border border-[#00F29D]/25 flex items-center justify-center text-[#00F29D]">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-heading text-xl font-extrabold text-white">Live Status Bar Capsule</h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                  Android 16+ & Custom OEM Skins
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
              Displays a persistent countdown capsule in the status bar on supported custom skins (ColorOS, OOS) and Android 16+ using ongoing notification chips. Falls back to standard notifications on older Android builds.
            </p>
          </div>

          {/* Interactive Capsule Simulation */}
          <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-6 flex flex-col gap-6">
            <p className="text-xs font-mono text-slate-500 text-left uppercase tracking-wider">Interactive Pill Preview</p>
            
            {/* Mock Status Bar */}
            <div className="w-full h-12 bg-black rounded-full border border-white/10 px-3 sm:px-6 flex items-center justify-between relative overflow-hidden">
              <span className="text-[10px] sm:text-xs text-white font-semibold font-mono">08:00</span>
              
              {/* Simulated Notch / Dynamic Capsule Pill */}
              <div ref={capsuleRef} className="absolute left-1/2 -translate-x-1/2 bg-[#0c1212] border border-white/15 h-7 sm:h-8 px-2.5 sm:px-4 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(0,242,157,0.1)]">
                <Compass className="w-3.5 h-3.5 text-[#00F29D] animate-spin-slow flex-shrink-0" />
                <span ref={capsuleTextRef} className="text-[10px] sm:text-xs font-bold text-white font-mono whitespace-nowrap inline-block">
                  {simCapsuleFormat === 'name' && 'Fajr'}
                  {simCapsuleFormat === 'name_time' && 'Fajr at 04:15 AM'}
                  {simCapsuleFormat === 'time' && '04:15 AM'}
                  {simCapsuleFormat === 'name_countdown' && `Fajr: ${countdown}`}
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 text-white/50 text-[10px] sm:text-xs">
                <WifiOff className="w-3.5 h-3.5 text-white/30" />
                <span className="font-mono">82%</span>
              </div>
            </div>

            {/* Format Controls */}
            <div className="flex flex-wrap gap-2 justify-start">
              {(['name', 'name_time', 'time', 'name_countdown'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSimCapsuleFormat(fmt)}
                  className={`btn-hover px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-colors ${simCapsuleFormat === fmt ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-white/[0.02] text-slate-400 border-white/[0.05] hover:text-white'}`}
                >
                  {fmt === 'name' && 'Name Only'}
                  {fmt === 'name_time' && 'Name + Time'}
                  {fmt === 'time' && 'Time Only'}
                  {fmt === 'name_countdown' && 'Name + Countdown'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: WearSync Data Layer Terminal (Col 5) */}
        <div className="feature-card md:col-span-5 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-colors duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3DD1C4]/5 to-transparent rounded-tr-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#3DD1C4]/10 border border-[#3DD1C4]/25 flex items-center justify-center text-[#3DD1C4]">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-heading text-xl font-extrabold text-white">Wear OS Companion</h3>
                <span className="text-[10px] font-mono text-[#3DD1C4] bg-[#3DD1C4]/10 px-2 py-0.5 rounded border border-[#3DD1C4]/20 uppercase tracking-widest">
                  Google Wearable DataLayer
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
              Synchronizes monthly prayer schedules and preferences using the Wearable DataClient API. Complications and tiles run directly off the watch's local database, avoiding radio wakes.
            </p>
          </div>

          {/* Terminal simulation */}
          <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-3 font-mono text-[11px] text-left">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 text-[10px] text-slate-500 uppercase tracking-wider">
              <span>WearSync DataClient Console</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <div className="space-y-1.5 overflow-hidden h-[95px] scrollbar-none text-slate-400">
              {syncLogs.map((log, index) => (
                <p key={index} className={log.includes('success') ? 'text-emerald-400' : ''}>
                  {log}
                </p>
              ))}
            </div>

            <button
              onClick={triggerMockSync}
              className="btn-hover w-full mt-2 py-2 bg-[#0c1212] hover:bg-[#3DD1C4]/10 hover:text-[#3DD1C4] border border-white/[0.05] hover:border-[#3DD1C4]/30 text-slate-300 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Sync Broadcast</span>
            </button>
          </div>
        </div>

        {/* Card 3: OEM Battery Tier Profiler (Col 6) */}
        <div className="feature-card md:col-span-6 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-colors duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-tr-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-heading text-xl font-extrabold text-white">OEM Custom Styles Handling</h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                  Notification style mappings
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
              Adapts status bar layouts based on the device manufacturer. Mapped into three compatibility tiers to support native capsules where possible and prevent UI alignment bugs on strict skins like Funtouch OS.
            </p>
          </div>

          {/* Profile Configurator UI */}
          <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-4 text-left">
            <div className="flex gap-2">
              {(['oppo', 'vivo', 'samsung'] as const).map((oem) => (
                <button
                  key={oem}
                  onClick={() => setSelectedOemProfile(oem)}
                  className={`btn-hover flex-1 py-2 rounded-lg text-xs font-bold border transition-colors uppercase ${selectedOemProfile === oem ? 'bg-amber-400/10 text-amber-400 border-amber-400/30' : 'bg-white/[0.02] text-slate-400 border-white/[0.05] hover:text-white'}`}
                >
                  {oem === 'oppo' ? 'Oppo/1+' : oem === 'vivo' ? 'Vivo/iQOO' : 'Samsung/Pixel'}
                </button>
              ))}
            </div>

            <div ref={oemDetailsRef} className="space-y-3 font-mono text-xs border-t border-white/[0.05] pt-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500">Category Mapping:</span>
                <span className="text-white font-bold sm:text-right">
                  {selectedOemProfile === 'oppo' ? 'Category 1 (Oppo / OnePlus)' : selectedOemProfile === 'vivo' ? 'Category 2 (Vivo / iQOO)' : 'Category 3 (General Fallback)'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500">Notification Style:</span>
                <span className="text-white sm:text-right">
                  {selectedOemProfile === 'oppo' ? 'Live Capsule + Expanded View' : selectedOemProfile === 'vivo' ? 'Modified Ticker (Partially Optimized)' : 'Standard System Alert'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500">Alert Dispatch:</span>
                <span className="text-amber-400 font-bold sm:text-right">
                  {selectedOemProfile === 'oppo' ? 'Real-time countdown capsule' : selectedOemProfile === 'vivo' ? 'Real-time modified capsule' : '15 min before prayer'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="text-slate-500">Layout Reason:</span>
                <span className="text-emerald-400 sm:text-right">
                  {selectedOemProfile === 'oppo' ? 'Fits expanded status bar overlay' : selectedOemProfile === 'vivo' ? 'Simplified layout (partially optimized) to avoid Funtouch OS alignment issues' : 'Simplified standard alerts (not optimized)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Geolocation Fetch & Kill (Col 6) */}
        <div className="feature-card md:col-span-6 bg-[#0c1212]/90 border border-white/[0.05] hover:border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-colors duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00F29D]/10 border border-[#00F29D]/25 flex items-center justify-center text-[#00F29D]">
                <WifiOff className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-heading text-xl font-extrabold text-white">Fetch & Kill Geolocation</h3>
                <span className="text-[10px] font-mono text-[#00F29D] bg-[#00F29D]/10 px-2 py-0.5 rounded border border-[#00F29D]/20 uppercase tracking-widest">
                  Low-Power GPS Triangulation
                </span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-6 text-left">
              Queries coordinates for less than a second once a month to establish the calculation seed, then immediately releases the GPS hardware lock. Eliminates background battery drain and tracking concerns.
            </p>
          </div>

          {/* Battery comparison chart simulator */}
          <div className="bg-[#050808] border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>GPS HARDWARE WAKELOCKS OVER 24H</span>
              <span className="text-[#00F29D]">DeenPulse: 1x wake</span>
            </div>
            
            {/* Graphic line chart */}
            <div className="h-20 flex items-end gap-1 border-b border-l border-white/10 p-2 relative">
              {/* Standard app line */}
              <div className="absolute inset-x-0 bottom-1/2 h-0.5 bg-red-500/30 border-t border-dashed border-red-500" />
              <span className="absolute right-4 top-2 text-[9px] font-mono text-red-400">Standard apps (constant polling)</span>

              {/* DeenPulse Line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path 
                  d="M 10 70 L 100 70 L 105 10 L 110 70 L 400 70" 
                  fill="none" 
                  stroke="#00F29D" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  className="shadow-[0_0_10px_rgba(0,242,157,0.3)]"
                />
              </svg>
              <span className="absolute left-32 bottom-2 text-[9px] font-mono text-emerald-400 font-bold">DeenPulse: Fetch & Kill (500ms)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
