import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
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
            y: '100%' // reset below view
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
        y: '100%' // reset
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
      <div className="page-transition-curtain fixed inset-0 bg-[#060a0a] z-[9999] pointer-events-none flex flex-col items-center justify-center border-y border-white/[0.04]" style={{ transform: 'translateY(0%)' }}>
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

          <Downloads releaseInfo={releaseInfo} />

          <Features
            simCapsuleFormat={simCapsuleFormat}
            setSimCapsuleFormat={setSimCapsuleFormat}
            selectedOemProfile={selectedOemProfile}
            setSelectedOemProfile={setSelectedOemProfile}
            syncLogs={syncLogs}
            triggerMockSync={triggerMockSync}
            countdown={countdown}
          />

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

          <CodeBrowser
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            releaseInfo={releaseInfo}
            copied={copied}
            copyToClipboard={copyToClipboard}
          />

          <FAQ openFaq={openFaq} setOpenFaq={setOpenFaq} />
        </>
      )}

      <Footer isDocsPage={isDocsPage} />

      <ScrollToTop />
    </div>
  );
}
