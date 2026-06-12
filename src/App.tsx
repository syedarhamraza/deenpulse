import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      target.classList.add('visible');
      return;
    }
    const trigger = ScrollTrigger.create({
      trigger: target,
      start: 'top 95%',
      onEnter: () => target.classList.add('visible'),
      once: true
    });
    return () => trigger.kill();
  }, []);
  return <div ref={ref} className="section-divider max-w-7xl mx-auto" />;
}

import { useLatestRelease } from './hooks/useLatestRelease';
import { usePrayerSimulator } from './hooks/usePrayerSimulator';
import { Location, JuristicMethod, CalcMethod } from './types';
import { fileContents } from './constants';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Downloads } from './components/Downloads';
import { Features } from './components/Features';
import { Simulator } from './components/Simulator';
import { CodeBrowser } from './components/CodeBrowser';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Docs } from './components/Docs';
import { PrivacyAgreement } from './components/Privacy';
import { ScrollToTop } from './components/ScrollToTop';

import backgroundImg from './assets/backgound.png';
import iconImg from './assets/icon.png';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location>('Karachi');
  const [juristicMethod, setJuristicMethod] = useState<JuristicMethod>('Hanafi');
  const [calcMethod, setCalcMethod] = useState<CalcMethod>('Karachi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<string>('prayerEngine.ts');
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDocsPage, setIsDocsPage] = useState(window.location.hash.startsWith('#docs'));
  const [isPrivacyPage, setIsPrivacyPage] = useState(window.location.hash.startsWith('#privacy'));
  const [showSplash, setShowSplash] = useState(() => {
    try {
      const hasSplashed = sessionStorage.getItem('deenpulse_splashed');
      return !hasSplashed;
    } catch (e) {
      return true;
    }
  });

  // Premium Custom Cursor
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const cursorDot = document.querySelector('.custom-cursor-dot') as HTMLElement;
    const cursorRing = document.querySelector('.custom-cursor-ring') as HTMLElement;

    if (!cursorDot || !cursorRing) return;

    gsap.set([cursorDot, cursorRing], { xPercent: -50, yPercent: -50, opacity: 0 });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };

    const setCursorDotX = gsap.quickSetter(cursorDot, 'x', 'px');
    const setCursorDotY = gsap.quickSetter(cursorDot, 'y', 'px');
    const setCursorRingX = gsap.quickSetter(cursorRing, 'x', 'px');
    const setCursorRingY = gsap.quickSetter(cursorRing, 'y', 'px');

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      gsap.to([cursorDot, cursorRing], { opacity: 1, duration: 0.2, overwrite: 'auto' });
    };

    window.addEventListener('mousemove', onMouseMove);

    const ticker = gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;

      setCursorDotX(mouse.x);
      setCursorDotY(mouse.y);
      setCursorRingX(pos.x);
      setCursorRingY(pos.y);
    });

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'button, a, .btn-hover, .interactive-hover, [role="button"]'
      );
      if (target) {
        gsap.to(cursorRing, {
          scale: 1.6,
          backgroundColor: 'rgba(0, 242, 157, 0.08)',
          borderColor: '#00F29D',
          boxShadow: '0 0 15px rgba(0, 242, 157, 0.45)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(cursorDot, {
          scale: 1.4,
          backgroundColor: '#3DD1C4',
          boxShadow: '0 0 8px rgba(61, 209, 196, 0.7)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'button, a, .btn-hover, .interactive-hover, [role="button"]'
      );
      if (target) {
        gsap.to(cursorRing, {
          scale: 1,
          backgroundColor: 'transparent',
          borderColor: 'rgba(0, 242, 157, 0.4)',
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
        gsap.to(cursorDot, {
          scale: 1,
          backgroundColor: '#00F29D',
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    };

    const onMouseDown = () => {
      gsap.to(cursorRing, {
        scale: 0.75,
        backgroundColor: 'rgba(0, 242, 157, 0.25)',
        borderColor: '#00F29D',
        boxShadow: '0 0 8px rgba(0, 242, 157, 0.2)',
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto'
      });
      gsap.to(cursorDot, {
        scale: 0.6,
        backgroundColor: '#3DD1C4',
        duration: 0.15,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const onMouseUp = () => {
      const hoveredEl = document.querySelector(':hover');
      const isOverInteractive = hoveredEl?.closest('button, a, .btn-hover, .interactive-hover, [role="button"]');
      
      gsap.to(cursorRing, {
        scale: isOverInteractive ? 1.6 : 1,
        backgroundColor: isOverInteractive ? 'rgba(0, 242, 157, 0.08)' : 'transparent',
        borderColor: isOverInteractive ? '#00F29D' : 'rgba(0, 242, 157, 0.4)',
        boxShadow: isOverInteractive ? '0 0 15px rgba(0, 242, 157, 0.45)' : 'none',
        duration: 0.25,
        ease: 'back.out(1.5)',
        overwrite: 'auto'
      });
      gsap.to(cursorDot, {
        scale: isOverInteractive ? 1.4 : 1,
        backgroundColor: isOverInteractive ? '#3DD1C4' : '#00F29D',
        boxShadow: isOverInteractive ? '0 0 8px rgba(61, 209, 196, 0.7)' : 'none',
        duration: 0.25,
        ease: 'back.out(1.5)',
        overwrite: 'auto'
      });
    };

    const onMouseLeave = () => {
      gsap.to([cursorDot, cursorRing], { opacity: 0, duration: 0.25, overwrite: 'auto' });
    };

    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      gsap.ticker.remove(ticker);
    };
  }, []);

  // Immersive Splash Screen Animation Timeline
  useEffect(() => {
    if (!showSplash) return;

    const cursorDot = document.querySelector('.custom-cursor-dot') as HTMLElement;
    const cursorRing = document.querySelector('.custom-cursor-ring') as HTMLElement;
    if (cursorDot && cursorRing) {
      gsap.set([cursorDot, cursorRing], { display: 'none' });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        try {
          sessionStorage.setItem('deenpulse_splashed', 'true');
        } catch (e) {}
        setShowSplash(false);
        if (cursorDot && cursorRing) {
          gsap.set([cursorDot, cursorRing], { display: 'block' });
        }
      }
    });

    tl.fromTo('.splash-logo-container',
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'elastic.out(1.1, 0.75)' }
    );

    tl.fromTo('.splash-title',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' },
      '-=0.45'
    );

    tl.fromTo('.splash-progress-container',
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
      '-=0.3'
    );

    const statusMessages = [
      'Registering astronomical computation algorithms...',
      'Loading local coordinate cache...',
      'Synchronizing Wear OS Data Client...',
      'Initializing status bar Live Capsule overlays...',
      'System ready. Launching DeenPulse...'
    ];

    const progressObj = { value: 0 };
    const bar = document.querySelector('.splash-progress-bar') as HTMLElement;
    const percentEl = document.querySelector('.splash-progress-percent') as HTMLElement;
    const statusEl = document.querySelector('.splash-progress-status') as HTMLElement;
    let currentMsgIdx = -1;

    tl.to(progressObj, {
      value: 100,
      duration: 2.0,
      ease: 'power1.inOut',
      onUpdate: () => {
        const val = Math.floor(progressObj.value);
        if (bar) bar.style.width = `${val}%`;
        if (percentEl) percentEl.textContent = `${val}%`;
        
        if (statusEl) {
          let msgIdx = 0;
          if (val >= 25 && val < 50) msgIdx = 1;
          else if (val >= 50 && val < 75) msgIdx = 2;
          else if (val >= 75 && val < 95) msgIdx = 3;
          else if (val >= 95) msgIdx = 4;
          
          if (currentMsgIdx !== msgIdx) {
            currentMsgIdx = msgIdx;
            gsap.timeline()
              .to(statusEl, { opacity: 0, y: -6, duration: 0.15, ease: 'power2.in' })
              .call(() => {
                statusEl.textContent = statusMessages[msgIdx];
                gsap.set(statusEl, { y: 6 });
              })
              .to(statusEl, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
          }
        }
      }
    });

    tl.to('.splash-logo-container', {
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in'
    }, '+=0.15');

    tl.to('.splash-screen', {
      y: '-100%',
      duration: 0.65,
      ease: 'power3.inOut'
    }, '-=0.1');

  }, [showSplash]);

  // Interactive Bento states
  const [simCapsuleFormat, setSimCapsuleFormat] = useState<'name' | 'name_time' | 'time' | 'name_countdown'>('name_countdown');
  const [selectedOemProfile, setSelectedOemProfile] = useState<'oppo' | 'vivo' | 'samsung'>('oppo');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'System ready. Client listening...',
    'Idle. Waiting for configuration shifts...'
  ]);

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'android': true,
    'android/app': true,
    'src': true,
    'src/hooks': true,
    'src/utils': true,
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Custom Hooks
  const releaseInfo = useLatestRelease();
  const {
    calculatedTimes,
    countdown,
    nextPrayerName,
    activePrayerName,
    parseSimulatedTime
  } = usePrayerSimulator(selectedLocation, juristicMethod, calcMethod);

  // Monitor scroll for navbar styles and listen to hash change for routing
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const handleHashChange = () => {
      const onDocs = window.location.hash.startsWith('#docs');
      const onPrivacy = window.location.hash.startsWith('#privacy');
      const targetIsDifferent = onDocs !== isDocsPage || onPrivacy !== isPrivacyPage;

      if (targetIsDifferent) {
        // Smooth slide-up transition overlay
        gsap.timeline()
          .set('.page-transition-curtain', { display: 'flex', pointerEvents: 'auto', y: '100%' })
          .to('.page-transition-curtain', {
            y: '0%',
            duration: 0.5,
            ease: 'power3.inOut'
          })
          .call(() => {
            // Update React routing state when fully covered
            setIsDocsPage(onDocs);
            setIsPrivacyPage(onPrivacy);
            window.scrollTo(0, 0);
          })
          .to('.page-transition-curtain', {
            y: '-100%',
            duration: 0.5,
            ease: 'power3.inOut'
          })
          .set('.page-transition-curtain', {
            display: 'none',
            pointerEvents: 'none',
            y: '100%' // reset below view
          })
          .call(() => {
            ScrollTrigger.refresh();
          });
      } else {
        // Standard scrolling inside the same view
        if (window.location.hash && !onDocs && !onPrivacy) {
          const targetId = window.location.hash.substring(1);
          setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isDocsPage, isPrivacyPage]);

  // Initial page load curtain reveal
  useEffect(() => {
    gsap.timeline()
      .to('.page-transition-curtain', {
        y: '-100%',
        duration: 0.6,
        ease: 'power3.inOut',
        delay: 0.15
      })
      .set('.page-transition-curtain', {
        display: 'none',
        pointerEvents: 'none',
        y: '100%' // reset
      })
      .call(() => {
        ScrollTrigger.refresh();
      });
  }, []);

  // Dynamic SEO Meta Tag updates on page changes
  useEffect(() => {
    let title = "DeenPulse | Islamic Prayer Utility App for Android & Wear OS";
    let desc = "DeenPulse is a Islamic prayer utility with a status bar live pill capsule overlay, low-power GPS triangulation, local monthly caching, and a native Wear OS companion watch client sync.";

    if (isDocsPage) {
      title = "Documentation | DeenPulse - Setup & Installation Guide";
      desc = "Learn how to install DeenPulse, sideload the Wear OS watch companion using wireless debugging (Wi-Fi ADB) or Geminiman, and configure background optimizations.";
    } else if (isPrivacyPage) {
      title = "Privacy Agreement | DeenPulse";
      desc = "DeenPulse is built from the ground up for data sovereignty. Learn about our local geolocation calculations, zero-tracking framework, and ad-free experience.";
    }

    // Set page title
    document.title = title;

    // Set meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    // Set Open Graph & Twitter meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
    const twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', desc);
  }, [isDocsPage, isPrivacyPage]);

  // ScrollTrigger animations are handled locally by each component for high-fidelity transitions

  // Animate ambient background glows slowly
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.bg-glow-1', {
        x: '+=35',
        y: '+=25',
        scale: 1.08,
        duration: 15,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });

      gsap.to('.bg-glow-2', {
        x: '-=25',
        y: '-=35',
        scale: 0.92,
        duration: 18,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      });
    });

    return () => ctx.revert();
  }, []);

  // Global hover spring scale transition for elements with hover indicators
  useEffect(() => {
    let currentHovered: HTMLElement | null = null;

    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        'button, a, .btn-hover, .interactive-hover, [role="button"]'
      ) as HTMLElement | null;

      if (!target) return;
      if (target.classList.contains('prevent-gsap-hover')) return;
      if (target === currentHovered) return;

      currentHovered = target;
      
      // Dynamically calculate scale factor based on item size to prevent large components from over-scaling
      const rect = target.getBoundingClientRect();
      const scaleVal = rect.width > 320 ? 1.015 : 1.04;
      
      gsap.to(target, {
        scale: scaleVal,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!currentHovered) return;

      const related = e.relatedTarget as HTMLElement | null;
      if (related && currentHovered.contains(related)) return;

      const target = currentHovered;
      currentHovered = null;

      gsap.to(target, {
        scale: 1,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  // Sync simulation logging
  const triggerMockSync = () => {
    const time = new Date().toLocaleTimeString();
    const newLogs = [
      `[${time}] [DataClient] Broadcast requested`,
      `[${time}] [DataClient] serialize timetable -> json`,
      `[${time}] [DataClient] push payload to /deen_pulse_wear_timetable`,
      `[${time}] [DataClient] sync success -> Wear OS node (0ms latency)`
    ];
    setSyncLogs(newLogs);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fileContents[activeFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleNode = (node: string) => {
    setExpandedNodes(prev => ({ ...prev, [node]: !prev[node] }));
  };

  return (
    <div className="min-h-screen bg-[#030606] text-[#A6B2B2] selection:bg-[#00F29D]/30 selection:text-[#00F29D] font-sans antialiased relative pb-16 overflow-x-hidden">

      {/* Page Transition Curtain Overlay */}
      <div className="page-transition-curtain fixed inset-0 bg-[#060a0a] z-[9999] flex flex-col items-center justify-center border-y border-white/[0.04]" style={{ transform: 'translateY(0%)' }}>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00F29D]/10 via-[#00F29D] to-[#3DD1C4]/10" />
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#00F29D]/10 via-[#00F29D] to-[#3DD1C4]/10" />
        <span className="font-heading font-extrabold text-2xl tracking-tight text-white select-none animate-pulse">
          Deen<span className="text-[#00F29D]">Pulse</span>
        </span>
      </div>

      {/* Custom Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none opacity-[0.05] mix-blend-screen -z-10"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      />

      {/* Premium subtle mesh grid and floating lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,157,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,157,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="bg-glow-1 absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#00F29D]/5 to-[#3DD1C4]/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="bg-glow-2 absolute bottom-0 right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#3DD1C4]/5 to-[#00F29D]/5 rounded-full filter blur-[150px] pointer-events-none" />

      <Navbar
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isDocsPage={isDocsPage}
      />

      {isDocsPage ? (
        <Docs />
      ) : isPrivacyPage ? (
        <PrivacyAgreement />
      ) : (
        <>
          <Hero releaseInfo={releaseInfo} />

          <SectionDivider />

          <Downloads releaseInfo={releaseInfo} />

          <SectionDivider />

          <Features
            simCapsuleFormat={simCapsuleFormat}
            setSimCapsuleFormat={setSimCapsuleFormat}
            selectedOemProfile={selectedOemProfile}
            setSelectedOemProfile={setSelectedOemProfile}
            syncLogs={syncLogs}
            triggerMockSync={triggerMockSync}
            countdown={countdown}
          />

          <SectionDivider />

          <Simulator
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            juristicMethod={juristicMethod}
            setJuristicMethod={setJuristicMethod}
            calcMethod={calcMethod}
            setCalcMethod={setCalcMethod}
            calculatedTimes={calculatedTimes}
            nextPrayerName={nextPrayerName}
            activePrayerName={activePrayerName}
            countdown={countdown}
            parseSimulatedTime={parseSimulatedTime}
          />

          <SectionDivider />

          <CodeBrowser
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            releaseInfo={releaseInfo}
            copied={copied}
            copyToClipboard={copyToClipboard}
          />

          <SectionDivider />

          <FAQ openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </>

      )}

      <Footer key={isDocsPage ? 'docs' : isPrivacyPage ? 'privacy' : 'main'} isDocsPage={isDocsPage} />

      <ScrollToTop />

      {/* Custom Cursor elements */}
      <div className="custom-cursor-dot fixed w-2 h-2 bg-[#00F29D] rounded-full pointer-events-none z-[99999] opacity-0 hidden md:block left-0 top-0 shadow-[0_0_4px_#00F29D]" />
      <div className="custom-cursor-ring fixed w-7 h-7 border border-[#00F29D]/40 rounded-full pointer-events-none z-[99999] opacity-0 hidden md:block left-0 top-0 backdrop-blur-[0.5px]" />

      {/* Immersive Splash Screen */}
      {showSplash && (
        <div className="splash-screen fixed inset-0 bg-[#030606] z-[99999] flex flex-col items-center justify-center select-none">
          {/* Ambient Glowing Backgrounds */}
          <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-[#00F29D]/5 rounded-full filter blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[20%] w-[60%] h-[60%] bg-[#3DD1C4]/5 rounded-full filter blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col items-center gap-6 text-center max-w-sm px-6">
            {/* Animated Logo Container */}
            <div className="splash-logo-container w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00F29D] to-[#3DD1C4] p-[1.5px] shadow-[0_0_50px_rgba(0,242,157,0.25)] relative">
              <div className="w-full h-full bg-[#030606] rounded-[22px] flex items-center justify-center p-4">
                <img src={iconImg} alt="DeenPulse Logo" className="splash-logo w-full h-full object-contain" />
              </div>
            </div>
            
            {/* App Name */}
            <div className="splash-title opacity-0 mt-2">
              <span className="font-heading font-black text-3xl tracking-tight text-white">
                Deen<span className="text-[#00F29D]">Pulse</span>
              </span>
              <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest mt-1.5 font-mono">
                Prayer Utility
              </p>
            </div>

            {/* Progress Bar & Status Text */}
            <div className="splash-progress-container w-64 mt-6 space-y-3 opacity-0">
              <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden relative border border-white/[0.02]">
                <div className="splash-progress-bar absolute left-0 top-0 h-full bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] rounded-full" style={{ width: '0%' }} />
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 min-h-[30px]">
                <span className="splash-progress-percent text-[10px] font-bold text-slate-500 font-mono">
                  0%
                </span>
                <span className="splash-progress-status text-[10px] text-[#00F29D] font-mono leading-normal max-w-xs text-center transition-all duration-300">
                  Initializing calculations...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
