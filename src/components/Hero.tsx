import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MobilePhoneFrame, WearOSWatchFrame } from './DeviceFrames';
import { PremiumButton } from './ui/PremiumButton';
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

      const handleMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 768) return;
        const { clientX, clientY } = e;
        const width = window.innerWidth;
        const height = window.innerHeight;

        const xOffset = (clientX / width) - 0.5;
        const yOffset = (clientY / height) - 0.5;

        gsap.to('.hero-phone', {
          x: xOffset * 20,
          y: yOffset * 20,
          duration: 0.8,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        gsap.to('.hero-watch', {
          x: xOffset * -35,
          y: yOffset * -35,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const headingText = "Bring Live Prayer Alerts";
  const gradientText = "to your Android device.";

  return (
    <section ref={heroRef} className="pt-36 pb-20 px-6 relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
      <div className="hero-badge inline-flex items-center gap-2.5 px-4 py-2 bg-[#00F29D]/5 border border-[#00F29D]/15 rounded-full backdrop-blur-md" style={{ opacity: 0 }}>
        <span className="w-2 h-2 rounded-full bg-[#00F29D] animate-pulse" />
        <span className="text-xs font-mono font-bold text-[#00F29D] uppercase tracking-widest">
          {releaseInfo.loading ? 'Checking Updates...' : releaseInfo.version ? `${releaseInfo.version} Stable Release` : 'Latest Stable Release'}
        </span>
      </div>

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

      <p className="hero-desc text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl font-sans" style={{ opacity: 0 }}>
        DeenPulse turns your static notifications into glanceable Live Prayer Alerts for ongoing status, upcoming countdowns, and Wear OS syncs. Built around native Android APIs and tuned to bypass aggressive OEM battery limits.
      </p>

      <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-4" style={{ opacity: 0 }}>
        <PremiumButton
          variant="primary"
          href="#downloads"
          icon="phone-download"
        >
          Get Mobile APK
        </PremiumButton>

        <PremiumButton
          variant="secondary"
          href="#downloads"
          icon="watch-sync"
        >
          Get Wear OS Companion
        </PremiumButton>
      </div>

      <div className="hero-devices w-full max-w-5xl mt-16 relative flex items-center justify-center" style={{ opacity: 0 }}>
        <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-[#00F29D]/10 to-[#3DD1C4]/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16">
          <div className="hero-phone relative group">
            <div className="hero-phone-float">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00F29D]/20 to-[#3DD1C4]/20 rounded-[44px] blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
              <MobilePhoneFrame />
            </div>
          </div>

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
