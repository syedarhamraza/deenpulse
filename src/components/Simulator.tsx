import { useEffect, useRef } from 'react';
import { CompassIcon, CpuIcon } from './ui/icons';
import { gsap } from 'gsap';
import { Location, JuristicMethod, CalcMethod, PrayerTimes } from '../types';
import { locationData } from '../constants';

interface SimulatorProps {
  selectedLocation: Location;
  setSelectedLocation: (loc: Location) => void;
  juristicMethod: JuristicMethod;
  setJuristicMethod: (method: JuristicMethod) => void;
  calcMethod: CalcMethod;
  setCalcMethod: (meth: CalcMethod) => void;
  calculatedTimes: PrayerTimes;
  nextPrayerName: string;
  activePrayerName: string | null;
  countdown: string;
  parseSimulatedTime: (timeStr: string) => Date;
}

export function Simulator({
  selectedLocation,
  setSelectedLocation,
  juristicMethod,
  setJuristicMethod,
  calcMethod,
  setCalcMethod,
  calculatedTimes,
  nextPrayerName,
  activePrayerName,
  countdown,
  parseSimulatedTime
}: SimulatorProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.simulator-row',
        { 
          opacity: 0.3, 
          x: -15 
        },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.5, 
          stagger: 0.06, 
          ease: 'power2.out',
          overwrite: 'auto'
        }
      );
    }, timelineRef);

    return () => ctx.revert();
  }, [selectedLocation, juristicMethod, calcMethod]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left side controls entrance
      gsap.fromTo('.simulator-left-reveal',
        { x: -35, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.simulator-left-reveal',
            start: 'top 85%'
          }
        }
      );

      // Right side card entrance
      gsap.fromTo('.simulator-right-reveal',
        { x: 35, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.simulator-right-reveal',
            start: 'top 85%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="simulator" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="simulator-left-reveal lg:col-span-6 text-left">
          <div className="inline-flex items-center gap-2 bg-[#00F29D]/10 text-[#00F29D] font-bold text-xs uppercase px-3 py-1.5 rounded-full mb-6 border border-[#00F29D]/20 font-mono">
            <CompassIcon className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Offline Calculation Engine</span>
          </div>
          
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Offline Calculation Simulator
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Test how the offline engine calculates prayer times, adjusts for the Hanafi juristic method, and updates coordinates locally.
          </p>

          {/* Custom Control Hub Dashboard */}
          <div className="space-y-6 bg-[#0c1212]/80 p-6 rounded-3xl border border-white/[0.05] shadow-lg">
            
            {/* Selector 1: Location */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 font-mono">
                Coordinate Seeds (Selected City)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['Karachi', 'Mecca', 'London', 'New York', 'Cairo', 'Jakarta', 'Dubai'] as Location[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocation(loc)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${selectedLocation === loc ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-[#050808]/70 text-slate-400 border-white/[0.04] hover:text-white hover:border-white/[0.08]'}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-3 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F29D]" />
                Coordinates: <span className="text-slate-300">{locationData[selectedLocation].lat}, {locationData[selectedLocation].lon}</span>
              </p>
            </div>

            {/* Selector 2: Juristic Rule */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 font-mono">
                Juristic Rule (Asr Shadow method)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Standard', 'Hanafi'] as JuristicMethod[]).map((method) => (
                  <button
                    key={method}
                    onClick={() => setJuristicMethod(method)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${juristicMethod === method ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-[#050808]/70 text-slate-400 border-white/[0.04] hover:text-white hover:border-white/[0.08]'}`}
                  >
                    {method === 'Standard' ? 'Standard (1x shadow)' : 'Hanafi (2x shadow)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector 3: Astronomical Angle Calculation method */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 font-mono">
                Calculation Rule Preset
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {(['Karachi', 'ISNA', 'MWL', 'Egypt', 'Makkah', 'Jakarta', 'Dubai'] as CalcMethod[]).map((meth) => (
                  <button
                    key={meth}
                    onClick={() => setCalcMethod(meth)}
                    className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${calcMethod === meth ? 'bg-[#00F29D]/10 text-[#00F29D] border-[#00F29D]/30' : 'bg-[#050808]/70 text-slate-400 border-white/[0.04] hover:text-white hover:border-white/[0.08]'}`}
                    title={
                      meth === 'Karachi' ? 'Karachi (18°)' : 
                      meth === 'ISNA' ? 'ISNA (15°)' : 
                      meth === 'MWL' ? 'MWL (18°)' : 
                      meth === 'Egypt' ? 'Egypt (19.5°)' :
                      meth === 'Makkah' ? 'Makkah (18.5°)' :
                      meth === 'Jakarta' ? 'Indonesia (20°)' :
                      'Dubai (16°)'
                    }
                  >
                    {meth}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Telemetry Response timeline */}
        <div className="simulator-right-reveal lg:col-span-6 flex items-center justify-center">
          <div className="w-full max-w-md bg-[#0c1212]/80 rounded-3xl border border-white/[0.06] p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl" />
            
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <CpuIcon className="text-[#00F29D] w-5 h-5 animate-pulse" />
                <span className="font-heading font-bold text-lg text-white">On-Device Timetable</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                100% Offline
              </span>
            </div>

            {/* Dynamic Timeline Layout */}
            <div ref={timelineRef} className="relative pl-6 border-l border-white/[0.05] space-y-6 text-left">
              
              {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((name) => {
                const time = calculatedTimes[name];
                const isNext = name === nextPrayerName;
                const isActive = name === activePrayerName;
                
                let label = 'Upcoming';
                let borderClass = 'border-white/[0.02] bg-[#050808]/40';
                let timelineDotClass = 'bg-slate-700 border-2 border-[#0c1212]';
                let timeColor = 'text-slate-400';
                let glowPill = null;

                if (isActive) {
                  label = 'Active Now';
                  borderClass = 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.08)]';
                  timelineDotClass = 'bg-amber-500 ring-4 ring-amber-500/20';
                  timeColor = 'text-amber-400 font-extrabold';
                  glowPill = (
                    <span className="text-[8px] font-mono font-bold text-amber-400 bg-amber-400/15 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse ml-2">
                      Ongoing
                    </span>
                  );
                } else if (isNext) {
                  label = `Next • ${countdown}`;
                  borderClass = 'border-[#00F29D]/30 bg-[#00F29D]/5 shadow-[0_0_20px_rgba(0,242,157,0.08)]';
                  timelineDotClass = 'bg-[#00F29D] ring-4 ring-[#00F29D]/20';
                  timeColor = 'text-[#00F29D] font-extrabold';
                  glowPill = (
                    <span className="text-[8px] font-mono font-bold text-[#00F29D] bg-[#00F29D]/15 border border-[#00F29D]/20 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse ml-2">
                      Countdown
                    </span>
                  );
                } else {
                  const pDate = parseSimulatedTime(time);
                  if (pDate <= new Date()) {
                    label = 'Passed';
                    borderClass = 'opacity-50 border-transparent bg-transparent';
                    timelineDotClass = 'bg-slate-800 border border-white/10';
                    timeColor = 'text-slate-600 line-through';
                  }
                }

                const displayNames: Record<string, string> = {
                  Fajr: 'Fajr',
                  Dhuhr: 'Dhuhr',
                  Asr: 'Asr',
                  Maghrib: 'Maghrib',
                  Isha: 'Isha'
                };

                return (
                  <div key={name} className="simulator-row relative group/time">
                    
                    {/* Left Dot on the border line */}
                    <div className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-10 transition-all duration-300 ${timelineDotClass}`} />
                    
                    <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${borderClass}`}>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-white font-heading">{displayNames[name]}</span>
                          {glowPill}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block mt-1 uppercase tracking-wider">{label}</span>
                      </div>
                      <span className={`text-base font-mono font-bold ${timeColor}`}>{time}</span>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Lat/Lon Stamp */}
            <div className="mt-8 pt-5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Calculated Seed:</span>
              <span className="text-slate-300">{locationData[selectedLocation].lat} / {locationData[selectedLocation].lon}</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
