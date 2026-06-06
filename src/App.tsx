import { useState, useEffect } from 'react';
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
      setIsDocsPage(onDocs);
      setIsPrivacyPage(onPrivacy);

      if (onDocs || onPrivacy) {
        window.scrollTo(0, 0);
      } else if (window.location.hash) {
        // Transition from subpage back to home sections
        const targetId = window.location.hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
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
      
      {/* Custom Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat pointer-events-none opacity-[0.05] mix-blend-screen -z-10" 
        style={{ backgroundImage: `url(${backgroundImg})` }} 
      />
      
      {/* Premium subtle mesh grid and floating lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,242,157,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,242,157,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#00F29D]/5 to-[#3DD1C4]/5 rounded-full filter blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-[#3DD1C4]/5 to-[#00F29D]/5 rounded-full filter blur-[150px] pointer-events-none" />

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

    </div>
  );
}
