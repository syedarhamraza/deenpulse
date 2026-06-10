import { ShieldIcon, LockIcon, EyeOffIcon, FileTextIcon, CpuIcon, GlobeIcon } from './ui/icons';
import { PremiumButton } from './ui/PremiumButton';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function PrivacyAgreement() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Animate header elements
      tl.fromTo('.privacy-header-reveal > *',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' }
      );

      // Animate bento cards stagger
      tl.fromTo('.privacy-bento-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' },
        '-=0.4'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 relative z-10 min-h-screen">

      {/* Header */}
      <div className="mb-12 text-center md:text-left privacy-header-reveal">
        <div className="inline-flex items-center gap-2 bg-[#00F29D]/10 text-[#00F29D] font-bold text-xs uppercase px-3 py-1.5 rounded-full mb-4 border border-[#00F29D]/20 font-mono">
          <ShieldIcon className="w-3.5 h-3.5" />
          <span>Security & Sovereignty</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
          Privacy <span className="bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] bg-clip-text text-transparent">Agreement</span>
        </h1>
        <p className="text-slate-400 mt-3 max-w-2xl text-sm sm:text-base md:text-lg">
          DeenPulse is built from the ground up to respect data sovereignty. No accounts, no data extraction, completely local calculation.
        </p>
        <p className="text-[10px] text-slate-500 font-mono mt-2">
          Last updated: June 6, 2026
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

        {/* 1. Privacy Promise Card (Full Width on Desktop) */}
        <div className="privacy-bento-card md:col-span-2 bg-[#0c1212]/30 backdrop-blur-md border border-white/[0.05] rounded-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row gap-6 items-start">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-[#00F29D]/5 to-transparent rounded-full filter blur-[60px] pointer-events-none -z-10" />
          
          <div className="w-12 h-12 rounded-xl bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] shrink-0 border border-[#00F29D]/20">
            <ShieldIcon className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Sovereignty Over Your Personal Data</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
              Unlike mainstream utility apps, DeenPulse does not require user accounts, email sign-ups, or social logins. We do not transmit coordinates, prayer schedules, or usage metrics to external servers. Your religious schedule and daily habits are entirely private to you.
            </p>
          </div>
        </div>

        {/* 2. Geolocation Card */}
        <div className="privacy-bento-card bg-[#0c1212]/30 backdrop-blur-md border border-white/[0.05] rounded-2xl p-6 sm:p-7 shadow-[0_15px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-[150px] h-[150px] bg-[#3DD1C4]/5 rounded-full filter blur-[40px] pointer-events-none -z-10" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#3DD1C4]/10 flex items-center justify-center text-[#3DD1C4] border border-[#3DD1C4]/15">
                <LockIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">1. Geolocation calculation</h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              DeenPulse queries location details solely to compute local sunrise, sunset, and prayer times according to standard astronomical calculations.
            </p>
            
            <div className="bg-[#030606]/40 border border-white/[0.03] p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#00F29D] uppercase tracking-wider">
                <CpuIcon className="w-3.5 h-3.5" />
                Local Sandboxed Storage
              </div>
              <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                When location updates are requested, the device executes a low-power GPS triangulation cycle. Lat/long coordinates are saved locally in the app's sandboxed storage and are never transmitted over network connections.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Ad & Tracker Free Card */}
        <div className="privacy-bento-card bg-[#0c1212]/30 backdrop-blur-md border border-white/[0.05] rounded-2xl p-6 sm:p-7 shadow-[0_15px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-[150px] h-[150px] bg-[#00F29D]/5 rounded-full filter blur-[40px] pointer-events-none -z-10" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] border border-[#00F29D]/15">
                <EyeOffIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">2. Ad and Tracker Free Policy</h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              DeenPulse guarantees a completely clean user experience with zero tracking scripts, telemetry, or network-based alarms.
            </p>
            
            <ul className="space-y-2 text-[11px] sm:text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F29D] mt-1.5 shrink-0" />
                <span><strong className="text-white">Zero Advertising</strong>: No third-party ad networks (like AdMob) are integrated.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F29D] mt-1.5 shrink-0" />
                <span><strong className="text-white">Zero Telemetry</strong>: No crash reports or usage analytics are sent.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F29D] mt-1.5 shrink-0" />
                <span><strong className="text-white">Local Alarms</strong>: Scheduled entirely via local alarm services, bypassing cloud notification relays.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Smartwatch Sync Card */}
        <div className="privacy-bento-card bg-[#0c1212]/30 backdrop-blur-md border border-white/[0.05] rounded-2xl p-6 sm:p-7 shadow-[0_15px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-[150px] h-[150px] bg-[#3DD1C4]/5 rounded-full filter blur-[40px] pointer-events-none -z-10" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#3DD1C4]/10 flex items-center justify-center text-[#3DD1C4] border border-[#3DD1C4]/15">
                <GlobeIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">3. Smartwatch Synchronization</h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              The Wear OS companion app synchronizes data locally from your phone using Google's Google Play Services Wearable APIs.
            </p>
            <div className="p-3.5 bg-white/[0.02] border border-white/[0.03] rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] text-slate-400 leading-normal">
                Coordinate updates are sent via the local Bluetooth/Wi-Fi Google Wearable Data Layer. No cloud server relays.
              </p>
            </div>
          </div>
        </div>

        {/* 5. License Card */}
        <div className="privacy-bento-card bg-[#0c1212]/30 backdrop-blur-md border border-white/[0.05] rounded-2xl p-6 sm:p-7 shadow-[0_15px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between gap-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-[150px] h-[150px] bg-[#00F29D]/5 rounded-full filter blur-[40px] pointer-events-none -z-10" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D] border border-[#00F29D]/15">
                <FileTextIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">4. Licensing & Verification</h3>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Licensed under the <strong className="text-white">GNU GPL v3 License</strong>. You can fully audit the security and data-handling features by inspecting our public source code repository.
            </p>
          </div>
          
          <div className="pt-2">
            <PremiumButton
              variant="primary"
              href="https://github.com/syedarhamraza/deen-pulse"
              target="_blank"
              rel="noreferrer"
              icon="github"
              size="sm"
              fullWidth={true}
            >
              Verify Source Code on GitHub
            </PremiumButton>
          </div>
        </div>

      </div>

    </div>
  );
}
