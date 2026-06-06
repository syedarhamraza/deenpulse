import { useEffect, useRef } from 'react';
import { Smartphone, Watch } from 'lucide-react';
import { gsap } from 'gsap';
import { MobilePhoneFrame, WearOSWatchFrame } from './DeviceFrames';
import { ReleaseInfo } from '../types';

interface HeroProps {
  releaseInfo: ReleaseInfo;
}

export function Hero({ releaseInfo }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.hero-badge', 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo('.hero-title-word',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
        '-=0.4'
      )
      .fromTo('.hero-title-word-grad',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 },
        '-=0.3'
      )
      .fromTo('.hero-desc',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.5'
      )
      .fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.5'
      )
      .fromTo('.hero-devices',
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.1)' },
        '-=0.4'
      );

      // Infinite floating layouts
      gsap.fromTo('.hero-phone-float',
        { y: 0 },
        {
          y: -8,
          duration: 4.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        }
      );

      gsap.fromTo('.hero-watch-float',
        { y: 0 },
        {
          y: -18,
          duration: 3.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        }
      );

      // Mouse Parallax logic
      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 768) return;
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;

        const xOffset = (clientX / width) - 0.5;
        const yOffset = (clientY / height) - 0.5;

        // Move phone in direction of cursor
        gsap.to('.hero-phone', {
          x: xOffset * 20,
          y: yOffset * 20,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Move watch opposite to cursor for parallax depth
        gsap.to('.hero-watch', {
          x: xOffset * -35,
          y: yOffset * -35,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Micro-animations for the custom SVG icons inside the buttons
      const phoneArrow = document.querySelector('.hero-phone-arrow');
      let phoneTl: gsap.core.Timeline | null = null;
      if (phoneArrow) {
        phoneTl = gsap.timeline({ repeat: -1, paused: true })
          .to(phoneArrow, {
            y: 4,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.in'
          })
          .set(phoneArrow, { y: -4, opacity: 0 })
          .to(phoneArrow, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out'
          });
      }

      const watchSync = document.querySelector('.hero-watch-sync-group');
      let watchTween: gsap.core.Tween | null = null;
      if (watchSync) {
        watchTween = gsap.to(watchSync, {
          rotation: 360,
          transformOrigin: '12px 12px',
          duration: 2,
          ease: 'none',
          repeat: -1,
          paused: true
        });
      }

      const primaryBtn = document.querySelector('.hero-cta-primary');
      const handlePrimaryEnter = () => { if (phoneTl) phoneTl.play(); };
      const handlePrimaryLeave = () => {
        if (phoneTl) {
          phoneTl.pause();
          gsap.to(phoneArrow, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
        }
      };

      if (primaryBtn) {
        primaryBtn.addEventListener('mouseenter', handlePrimaryEnter);
        primaryBtn.addEventListener('mouseleave', handlePrimaryLeave);
      }

      const secondaryBtn = document.querySelector('.hero-cta-secondary');
      const handleSecondaryEnter = () => { if (watchTween) watchTween.play(); };
      const handleSecondaryLeave = () => {
        if (watchTween) {
          gsap.to(watchSync, {
            rotation: '+=35',
            duration: 0.7,
            ease: 'power2.out',
            onComplete: () => {
              if (watchTween) {
                watchTween.pause();
                gsap.set(watchSync, { rotation: 0 });
              }
            }
          });
        }
      };

      if (secondaryBtn) {
        secondaryBtn.addEventListener('mouseenter', handleSecondaryEnter);
        secondaryBtn.addEventListener('mouseleave', handleSecondaryLeave);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (primaryBtn) {
          primaryBtn.removeEventListener('mouseenter', handlePrimaryEnter);
          primaryBtn.removeEventListener('mouseleave', handlePrimaryLeave);
        }
        if (secondaryBtn) {
          secondaryBtn.removeEventListener('mouseenter', handleSecondaryEnter);
          secondaryBtn.removeEventListener('mouseleave', handleSecondaryLeave);
        }
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const headingText = "Bring Live Prayer Alerts";
  const gradientText = "to your Android device.";

  return (
    <section ref={heroRef} className="pt-36 pb-20 px-6 relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
      {/* Glow pill */}
      <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 bg-[#00F29D]/5 border border-[#00F29D]/15 rounded-full backdrop-blur-md" style={{ opacity: 0 }}>
        <span className="w-2 h-2 rounded-full bg-[#00F29D] animate-pulse" />
        <span className="text-xs font-mono font-bold text-[#00F29D] uppercase tracking-widest">
          {releaseInfo.loading ? 'Checking Updates...' : releaseInfo.version ? `${releaseInfo.version} Stable Release` : 'Latest Stable Release'}
        </span>
      </div>

      {/* Premium Typographic Heading with Word Split */}
      <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] max-w-5xl">
        <span className="block mb-1">
          {headingText.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-10 -mb-10 mr-3 last:mr-0">
              <span className="hero-title-word inline-block pb-10 -mb-10" style={{ opacity: 0 }}>
                {word}
              </span>
            </span>
          ))}
        </span>
        <span className="block">
          {gradientText.split(' ').map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-10 -mb-10 mr-3 last:mr-0">
              <span className="hero-title-word-grad inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#00F29D] via-[#2CE1A6] to-[#3DD1C4] pb-10 -mb-10" style={{ opacity: 0 }}>
                {word}
              </span>
            </span>
          ))}
        </span>
      </h1>

      {/* Copywriting Subheader */}
      <p className="hero-desc text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl font-sans" style={{ opacity: 0 }}>
        DeenPulse turns your static notifications into glanceable Live Prayer Alerts for ongoing status, upcoming countdowns, and Wear OS syncs. Built around native Android APIs and tuned to bypass aggressive OEM battery limits.
      </p>

      {/* Clean, Premium Call-to-actions */}
      <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-4" style={{ opacity: 0 }}>
        {/* Primary Download Button (Glow + Gloss Shimmer + Custom SVG Phone Arrow) */}
        <a
          href="#downloads"
          className="hero-cta-primary btn-hover group relative w-full sm:w-auto block"
        >
          {/* Background radial glow */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] rounded-2xl blur-xl opacity-35 group-hover:opacity-75 transition-opacity duration-500" />
          
          {/* Button Face */}
          <div className="relative w-full h-full px-8 py-4 bg-gradient-to-r from-[#00F29D] via-[#2CE1A6] to-[#3DD1C4] text-[#060A0A] font-extrabold rounded-xl shadow-[inset_0_1.5px_0_rgba(255,255,255,0.45),0_8px_30px_rgba(0,242,157,0.2)] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
            {/* Shimmer sheen overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            
            {/* Custom SVG Phone with Animated Arrow */}
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {/* Outer Chassis */}
              <rect x="6" y="2" width="12" height="20" rx="2.5" strokeWidth="2" />
              {/* Top Speaker Bezel */}
              <line x1="10" y1="4.5" x2="14" y2="4.5" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              {/* Bottom Bezel Line */}
              <line x1="10" y1="19.5" x2="14" y2="19.5" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              {/* Download Arrow */}
              <path
                className="hero-phone-arrow"
                d="M12 7 v7 M9 11.5 l3 3 l3 -3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="tracking-tight">Get Mobile APK</span>
          </div>
        </a>

        {/* Secondary Watch Companion Button (Rotating Border Beam + Glass Card + Custom SVG Watch Sync) */}
        <a
          href="#downloads"
          className="hero-cta-secondary btn-hover group relative w-full sm:w-auto block"
        >
          {/* Rotating Conic Gradient Border Beam */}
          <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-[-1000%] bg-[conic-gradient(from_0deg,transparent_60%,#00F29D_80%,#3DD1C4_100%)] animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDuration: '3.5s' }} />
          </div>

          {/* Button Face Wrapper with 1px border simulation */}
          <div className="relative p-[1px] rounded-xl bg-white/[0.08] group-hover:bg-transparent transition-colors duration-300 w-full h-full overflow-hidden">
            <div className="w-full h-full px-8 py-4 bg-[#090D0D]/95 group-hover:bg-[#0c1212]/90 text-slate-300 hover:text-white font-extrabold rounded-[11px] transition-colors flex items-center justify-center gap-3 overflow-hidden">
              {/* Shimmer sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

              {/* Custom SVG Watch with Animated Sync Loop */}
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {/* Strap Top */}
                <path d="M9 5.5 V2.5 h6 v3" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                {/* Strap Bottom */}
                <path d="M9 18.5 v3 h6 v-3" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                {/* Watch Case */}
                <circle cx="12" cy="12" r="6.5" strokeWidth="2" />
                {/* Crown */}
                <path d="M18.5 11 h0.8 v2 H18.5" strokeWidth="1.5" />
                {/* Watch Sync Group */}
                <g className="hero-watch-sync-group">
                  {/* Arc 1 */}
                  <path d="M12 9 A3 3 0 0 1 15 12" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M13 11 L15 12 L16 10" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Arc 2 */}
                  <path d="M12 15 A3 3 0 0 1 9 12" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M11 13 L9 12 L8 14" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
              <span className="tracking-tight">Get Wear OS Companion</span>
            </div>
          </div>
        </a>
      </div>

      {/* Visual Showcase: Overlapping Device Frame Assembly */}
      <div className="hero-devices w-full max-w-5xl mt-16 relative flex items-center justify-center" style={{ opacity: 0 }}>
        {/* Neon radial backdrop shadow */}
        <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-[#00F29D]/10 to-[#3DD1C4]/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16">
          {/* Mobile Phone Mockup */}
          <div className="hero-phone relative group">
            <div className="hero-phone-float">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00F29D]/20 to-[#3DD1C4]/20 rounded-[44px] blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
              <MobilePhoneFrame />
            </div>
          </div>

          {/* Wear OS Watch Mockup (floating slightly) */}
          <div className="hero-watch relative group md:-ml-12 lg:-ml-20 md:-mt-16 z-20">
            <div className="hero-watch-float">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#3DD1C4]/30 to-[#00F29D]/10 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
              <WearOSWatchFrame />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
