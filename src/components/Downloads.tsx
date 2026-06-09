import { useEffect, useRef } from 'react';
import { Download, Smartphone, Watch, CheckCircle2 } from 'lucide-react';
import { ReleaseInfo } from '../types';
import { gsap } from 'gsap';
import { PremiumButton } from './ui/PremiumButton';

interface DownloadsProps {
  releaseInfo: ReleaseInfo;
}

export function Downloads({ releaseInfo }: DownloadsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header block entrance
      gsap.fromTo('.downloads-header-reveal',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.downloads-header-reveal',
            start: 'top 85%'
          }
        }
      );

      // Stats banner spring pop
      gsap.fromTo('.downloads-banner-reveal',
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'back.out(1.3)',
          scrollTrigger: {
            trigger: '.downloads-banner-reveal',
            start: 'top 85%'
          }
        }
      );

      // Mobile APK card slides in from left (restored layout sliding)
      gsap.fromTo('.downloads-card-mobile-reveal',
        { x: -50, opacity: 0, rotate: -1 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.downloads-cards-grid',
            start: 'top 95%', // Trigger sooner to eliminate delay
            toggleActions: 'play none none none'
          }
        }
      );

      // Watch companion card slides in from right
      gsap.fromTo('.downloads-card-watch-reveal',
        { x: 50, opacity: 0, rotate: 1 },
        {
          x: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.downloads-cards-grid',
            start: 'top 95%', // Trigger sooner to eliminate delay
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="downloads" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
      <div className="downloads-header-reveal text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-[#00F29D]/10 text-[#00F29D] font-bold text-xs uppercase px-3 py-1.5 rounded-full mb-4 border border-[#00F29D]/20 font-mono">
          <Download className="w-3.5 h-3.5" />
          <span>Direct Downloads</span>
        </div>
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
          Direct Releases
        </h2>
        <p className="text-slate-400 text-lg">
          Download verified, telemetry-free builds directly. DeenPulse does not use Google Play SDKs for tracking or analytics.
        </p>
      </div>

      {/* Release Stats Banner */}
      <div className="downloads-banner-reveal bg-[#0c1212]/90 border border-white/[0.05] rounded-3xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 flex-1 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#00F29D]/10 border border-[#00F29D]/20 flex items-center justify-center text-[#00F29D] flex-shrink-0 shadow-[0_0_15px_rgba(0,242,157,0.15)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <strong className="font-heading text-white text-lg font-bold">Latest Release: {releaseInfo.loading ? 'Checking...' : releaseInfo.version || 'Active'}</strong>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-slate-400 text-sm">
              {releaseInfo.loading ? 'Fetching release details...' : releaseInfo.publishedAt ? `Released on ${releaseInfo.publishedAt}. Verified build.` : 'Direct APK builds. Sideload ready.'}
            </span>
          </div>
        </div>
        
        <div className="hidden md:block w-px h-12 bg-white/[0.08]" />
        
        <div className="flex flex-col gap-1 flex-shrink-0 text-left">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider font-mono">System compatibility</span>
          <span className="text-white text-base font-bold">Android 9.0+ / Wear OS 3.0+</span>
        </div>
      </div>

      <div className="downloads-cards-grid grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Mobile Client APK */}
        <div className="downloads-card-mobile-reveal bg-[#0c1212]/90 rounded-3xl border border-white/[0.05] hover:border-[#00F29D]/30 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative group shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#00F29D]/5 to-transparent rounded-tr-3xl pointer-events-none" />
          
          <div className="text-left">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-[#00F29D]/10 rounded-2xl text-[#00F29D] border border-[#00F29D]/20">
                <Smartphone className="w-8 h-8" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#00F29D] bg-[#00F29D]/10 px-2.5 py-1 rounded-full border border-[#00F29D]/20">
                  Latest Stable
                </span>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {releaseInfo.loading ? 'Checking size...' : `${releaseInfo.version || 'Latest'} ${releaseInfo.mobileSize ? `• ${releaseInfo.mobileSize}` : ''}`}
                </p>
              </div>
            </div>

            <h3 className="font-heading text-2xl font-bold text-white mb-2">Mobile Application</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              A clean React Native app for Android. It uses a single-shot, low-power GPS request to calculate your local coordinates, generates a month of prayer times, and schedules local alarms.
            </p>

            <div className="space-y-3 mb-8 border-t border-white/[0.05] pt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#00F29D] flex-shrink-0" />
                <span>Integrated OEM background battery profiles</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#00F29D] flex-shrink-0" />
                <span>Persistent status bar capsule or local alarm notifications</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#00F29D] flex-shrink-0" />
                <span>Zero continuous tracking or external coordinate sharing</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <PremiumButton
              variant="primary"
              href={releaseInfo.mobileUrl}
              download={releaseInfo.mobileName}
              icon="phone-download"
              fullWidth
            >
              Download Mobile APK
            </PremiumButton>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>SHA-256 Checksum:</span>
              <span className="hover:text-white transition-colors cursor-pointer" title="Double click to copy">
                5f2c...8dbe6ef
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Wear OS Client APK */}
        <div className="downloads-card-watch-reveal bg-[#0c1212]/90 rounded-3xl border border-white/[0.05] hover:border-[#3DD1C4]/30 transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between relative group shadow-2xl text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#3DD1C4]/5 to-transparent rounded-tr-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-[#3DD1C4]/15 rounded-2xl text-[#3DD1C4] border border-[#3DD1C4]/20">
                <Watch className="w-8 h-8" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#3DD1C4] bg-[#3DD1C4]/10 px-2.5 py-1 rounded-full border border-[#3DD1C4]/20">
                  WearOS Companion
                </span>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  {releaseInfo.loading ? 'Checking size...' : `${releaseInfo.version || 'Latest'} ${releaseInfo.watchSize ? `• ${releaseInfo.watchSize}` : ''}`}
                </p>
              </div>
            </div>

            <h3 className="font-heading text-2xl font-bold text-white mb-2">Wear OS Companion</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              A native Wear OS app built in Kotlin. It syncs settings and prayer times from your phone over the Wearable DataClient API to display complications and tiles.
            </p>

            <div className="space-y-3 mb-8 border-t border-white/[0.05] pt-6 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#3DD1C4] flex-shrink-0" />
                <span>Standalone mode or auto-synced complication feeds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#3DD1C4] flex-shrink-0" />
                <span>Lightweight layouts designed for circular watches</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#3DD1C4] flex-shrink-0" />
                <span>Minimal data sync frequency to preserve watch battery</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <PremiumButton
              variant="secondary"
              href={releaseInfo.watchUrl}
              download={releaseInfo.watchName}
              icon="watch-sync"
              fullWidth
            >
              Download Watch APK
            </PremiumButton>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
              <span>SHA-256 Checksum:</span>
              <span className="hover:text-white transition-colors cursor-pointer" title="Double click to copy">
                9b1e...0cca54d
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
