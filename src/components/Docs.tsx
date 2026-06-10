import { 
  BookOpenIcon, 
  DownloadArrowIcon, 
  WifiIcon, 
  SmartphoneIcon, 
  WatchIcon, 
  SettingsIcon, 
  TerminalIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  CheckIcon, 
  InfoIcon, 
  CpuIcon, 
  LockIcon 
} from './ui/icons';
import { IconButton } from './ui/IconButton';
import { PremiumButton } from './ui/PremiumButton';

import { useState, ComponentType, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'motion/react';

type SectionId = 'app-guide' | 'installation' | 'wireless-debugging' | 'geminiman';

interface DocSection {
  id: SectionId;
  title: string;
  shortTitle: string;
  icon: ComponentType<any>;
  description: string;
}

export function Docs() {
  const [activeSection, setActiveSection] = useState<SectionId>('app-guide');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Animate header elements
      tl.fromTo('.docs-header-reveal > *',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power3.out' }
      );

      // Animate sidebar nav
      tl.fromTo('.docs-sidebar-reveal',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.4'
      );

      // Animate main container panel
      tl.fromTo('.docs-main-reveal',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.65'
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Stagger animate current section content whenever active section changes
    gsap.fromTo('.docs-content-animate > *',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: 'auto' }
    );
  }, [activeSection]);

  const sections: DocSection[] = [
    {
      id: 'app-guide',
      title: 'DeenPulse Application Guide',
      shortTitle: 'App Guide',
      icon: BookOpenIcon,
      description: 'Understand the main features, offline calculation engine, and system permissions.'
    },
    {
      id: 'installation',
      title: 'Standard Installation Guide',
      shortTitle: 'Install Phone APK',
      icon: DownloadArrowIcon,
      description: 'How to download and install DeenPulse on your Android mobile device.'
    },
    {
      id: 'wireless-debugging',
      title: 'Wear OS Sideloading via Wireless Debugging',
      shortTitle: 'Install Watch APK',
      icon: WifiIcon,
      description: 'Step-by-step instructions to pair and sideload the watch companion via Wi-Fi ADB.'
    },
    {
      id: 'geminiman',
      title: 'Wear OS Sideloading via Geminiman App',
      shortTitle: 'Geminiman Manager',
      icon: SmartphoneIcon,
      description: 'Install the companion watch app directly from your phone using Geminiman.'
    }
  ];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 pt-28 pb-16 relative z-10 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-12 text-center md:text-left docs-header-reveal">
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white tracking-tight leading-tight">
          Technical <span className="bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] bg-clip-text text-transparent">Documentation</span>
        </h1>
        <p className="text-slate-400 mt-3 max-w-2xl text-base md:text-lg">
          Everything you need to set up, sideload, optimize, and run DeenPulse on Android and Wear OS devices.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar (Desktop) / Tab Bar (Mobile) */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 bg-[#060a0a]/60 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] docs-sidebar-reveal">
          <div className="hidden lg:block px-4.5 py-3 border-b border-white/[0.05] mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation Table</span>
          </div>
          
          {/* Menu Items */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1.5 scrollbar-none relative">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`relative flex items-center gap-3 px-4 py-3 text-xs md:text-sm font-semibold rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-colors duration-300 ${
                    isActive ? 'text-[#00F29D]' : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDocSection"
                      className="absolute inset-0 bg-gradient-to-r from-[#00F29D]/10 to-[#3DD1C4]/10 border border-[#00F29D]/20 rounded-xl shadow-[0_0_15px_rgba(0,242,157,0.05)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 relative z-10 transition-colors duration-300 ${isActive ? 'text-[#00F29D]' : 'text-slate-500'}`} />
                  <span className="relative z-10">{sec.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content Panel */}
        <main className="lg:col-span-9 bg-[#060a0a]/40 backdrop-blur-md border border-white/[0.05] rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.4)] docs-main-reveal">
          
          {/* 1. APP GUIDE SECTION */}
          {activeSection === 'app-guide' && (
            <div className="space-y-8 docs-content-animate">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <BookOpenIcon className="w-6 h-6 text-[#00F29D]" />
                  DeenPulse Application Guide
                </h2>
                <div className="h-px bg-gradient-to-r from-[#00F29D]/30 to-transparent my-4" />
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  DeenPulse is a high-fidelity utility that calculates Islamic prayer times completely locally and offline. It ensures you stay connected to your daily prayers with zero tracking, zero ads, and minimum battery drain.
                </p>
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#0c1212]/50 border border-white/[0.04] p-5 rounded-xl space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00F29D]/10 flex items-center justify-center text-[#00F29D]">
                    <CpuIcon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-semibold text-white text-base">Offline Calculation Engine</h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                    By combining your device's low-power GPS triangulation with standard astronomical algorithms, DeenPulse calculates prayer coordinates on-device. No location histories or queries ever exit to external APIs.
                  </p>
                </div>

                <div className="bg-[#0c1212]/50 border border-white/[0.04] p-5 rounded-xl space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3DD1C4]/10 flex items-center justify-center text-[#3DD1C4]">
                    <SettingsIcon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-semibold text-white text-base">Flexible Configurations</h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                    Supports world-standard computation organizations (University of Islamic Sciences Karachi, ISNA, MWL, Makkah, Egyptian General Authority) and Shafi'i/Hanafi juristic methods for Asr calculations.
                  </p>
                </div>
              </div>

              {/* Status Bar Pill Setup */}
              <div className="bg-[#0c1212]/45 border border-white/[0.05] p-6 rounded-xl space-y-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00F29D] shadow-[0_0_8px_#00F29D]" />
                  Setting up the Live Status Bar Capsule
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  The flagship feature of DeenPulse is the status-bar Live Capsule pill (reminiscent of ColorOS/iOS Dynamic Island) displaying live countdowns. To keep it functioning reliably, you must configure two Android permissions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-[#030606]/60 border border-white/[0.03] p-4 rounded-lg">
                    <span className="text-xs font-bold text-[#00F29D] uppercase tracking-wider block mb-1">1. Draw Over Other Apps</span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Required to inject the overlay capsule pill on top of the system status bar and lockscreen. Enable it via <code className="text-slate-300 font-mono text-[11px] bg-white/5 px-1 py-0.5 rounded">App Info &gt; Display over other apps</code>.
                    </p>
                  </div>
                  <div className="bg-[#030606]/60 border border-white/[0.03] p-4 rounded-lg">
                    <span className="text-xs font-bold text-[#3DD1C4] uppercase tracking-wider block mb-1">2. Notifications Permission</span>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Ensures that the foreground capsule controller service is not killed by the OS and allows instant adhan alarms to trigger at correct prayer hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Battery Optimizations */}
              <div className="bg-[#241c10]/20 border border-amber-500/20 p-5 rounded-xl flex items-start gap-4">
                <AlertTriangleIcon className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-bold text-amber-300 text-sm md:text-base">OEM Battery Whitelisting (Critical)</h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    Android's background execution rules are highly restrictive. Device manufacturers (especially OPPO, Vivo, Samsung, Xiaomi) will stop background prayer updates unless whitelisted.
                  </p>
                  <ul className="text-slate-400 text-xs list-disc pl-4 space-y-1 mt-1">
                    <li>Open DeenPulse settings &gt; Tap <strong className="text-white">Bypass Battery Optimizations</strong>.</li>
                    <li>Toggle permission to <strong className="text-white">Unrestricted</strong> / <strong className="text-white">Don't Optimize</strong>.</li>
                    <li>On ColorOS/FuntouchOS, lock DeenPulse in your App Switcher (swipe down on card and click Lock) and enable "Allow Background Auto-Start".</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. STANDARD INSTALLATION */}
          {activeSection === 'installation' && (
            <div className="space-y-6 docs-content-animate">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <DownloadArrowIcon className="w-6 h-6 text-[#00F29D]" />
                  Standard Installation Guide
                </h2>
                <div className="h-px bg-gradient-to-r from-[#00F29D]/30 to-transparent my-4" />
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Installing DeenPulse on your primary Android smartphone is straightforward. Since the app is open-source and distributed directly as an APK, follow these steps to sideload:
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold shrink-0 text-sm">1</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm md:text-base">Download the APK</h3>
                    <p className="text-slate-400 text-xs md:text-sm">
                      Navigate to the downloads panel on this website and download the latest <code className="text-[#00F29D] font-mono text-xs bg-[#00F29D]/5 px-1.5 py-0.5 rounded">app-release.apk</code> package file.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold shrink-0 text-sm">2</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm md:text-base">Authorize Unknown Sources</h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      Android protects users by blocking installations outside Google Play by default. When opening the downloaded APK, click <strong className="text-white">Settings</strong> on the pop-up and toggle <strong className="text-white">"Allow from this source"</strong> (for your browser or file manager app).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold shrink-0 text-sm">3</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm md:text-base">Complete Installation</h3>
                    <p className="text-slate-400 text-xs md:text-sm">
                      Tap <strong className="text-white">Install</strong>. Once completed, open DeenPulse, specify calculation protocols, and authorize GPS location and Notification alerts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Companion Tip Info */}
              <div className="bg-[#0c1212]/50 border border-white/[0.05] p-5 rounded-xl flex items-start gap-4">
                <InfoIcon className="w-5 h-5 text-[#3DD1C4] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-white text-sm">Need the Companion Watch App?</h4>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                    To sync notifications, complications, and tiles, install the watch companion APK (<code className="font-mono text-[11px] text-[#3DD1C4] bg-white/5 px-1 py-0.5 rounded">wear-release.apk</code>). Check out the subsequent tabs for instructions on using PC-based **Wireless Debugging** or the mobile **Geminiman app**.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. WIRELESS DEBUGGING SETUP */}
          {activeSection === 'wireless-debugging' && (
            <div className="space-y-6 docs-content-animate">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <WifiIcon className="w-6 h-6 text-[#00F29D]" />
                  Wear OS Installation via Wireless Debugging
                </h2>
                <div className="h-px bg-gradient-to-r from-[#00F29D]/30 to-transparent my-4" />
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  Wireless debugging uses the Android Debug Bridge (ADB) over your local Wi-Fi network. This allows you to install the Wear OS application companion (<code className="font-mono text-xs text-[#00F29D] bg-[#00F29D]/5 px-1 rounded">wear-release.apk</code>) to your smartwatch from a PC.
                </p>
              </div>

              {/* Steps Layout */}
              <div className="space-y-6">
                
                {/* Step 1 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#00F29D] uppercase tracking-wider block">Step 1: Enable Developer Options on Wear OS</span>
                  <div className="bg-[#0c1212]/55 border border-white/[0.04] p-4.5 rounded-xl text-slate-300 text-xs md:text-sm leading-relaxed">
                    On your watch, navigate to <strong className="text-white">Settings &gt; System</strong> (or <strong className="text-white">Settings &gt; About watch</strong>) &gt; <strong className="text-white">Software info</strong>. Scroll to <strong className="text-white">Software version</strong> (or <strong className="text-white">Build number</strong>) and tap it repeatedly 7 times. You'll see a notification: <span className="text-emerald-400">"You are now a developer!"</span>.
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#00F29D] uppercase tracking-wider block">Step 2: Turn on Wi-Fi Debugging</span>
                  <div className="bg-[#0c1212]/55 border border-white/[0.04] p-4.5 rounded-xl text-slate-300 text-xs md:text-sm leading-relaxed space-y-2">
                    <p>Go back to the main Settings page, scroll to the bottom, and enter <strong className="text-white">Developer options</strong>. Locate and enable the following settings:</p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Enable <strong className="text-white">ADB debugging</strong>.</li>
                      <li>Enable <strong className="text-white">Wireless debugging</strong>. Ensure your smartwatch and computer/phone are on the <strong className="text-white">same Wi-Fi network</strong>.</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#00F29D] uppercase tracking-wider block">Step 3: Pair Devices (For Wear OS 3 / 4 / Android 11+)</span>
                  <div className="bg-[#0c1212]/55 border border-white/[0.04] p-4.5 rounded-xl text-slate-300 text-xs md:text-sm leading-relaxed space-y-3">
                    <p>Tap on <strong className="text-white">"Wireless debugging"</strong> inside Developer options, then tap <strong className="text-white">"Pair new device"</strong>. You will see a 6-digit <span className="text-[#3DD1C4]">Wi-Fi pairing code</span> and an <span className="text-[#3DD1C4]">IP Address & Port</span> (e.g. <code className="text-slate-300 font-mono bg-white/5 px-1.5 py-0.5 rounded">192.168.1.100:41235</code>).</p>
                    <p>Open your command line/terminal on your PC (ensure Android SDK Platform Tools are installed) and run the pairing command:</p>
                    
                    {/* Command Box */}
                    <div className="bg-[#030606] border border-white/[0.05] rounded-xl p-3 sm:p-3.5 flex items-center justify-between font-mono text-xs text-slate-300 select-all relative group overflow-hidden">
                      <span className="overflow-x-auto whitespace-nowrap pr-14 scrollbar-none">adb pair 192.168.1.100:41235 123456</span>
                      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-[#030606] pl-2 py-1 flex items-center justify-center">
                        {copiedText === 'pair' ? (
                          <span className="flex w-8 h-8 items-center justify-center text-[#00F29D]">
                            <CheckIcon className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <IconButton
                            onClick={() => handleCopy('adb pair 192.168.1.100:41235 123456', 'pair')}
                            icon="copy"
                            size="sm"
                            title="Copy Command"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#00F29D] uppercase tracking-wider block">Step 4: Establish Connection</span>
                  <div className="bg-[#0c1212]/55 border border-white/[0.04] p-4.5 rounded-xl text-slate-300 text-xs md:text-sm leading-relaxed space-y-3">
                    <p>Go back to the main Wireless Debugging screen on the watch. Find the active <strong className="text-white">IP address and port</strong> (note: the port number is usually different from the pairing port, e.g. <code className="font-mono text-slate-300 bg-white/5 px-1 py-0.5 rounded">192.168.1.100:34567</code>).</p>
                    <p>Connect your PC via ADB command:</p>

                    {/* Command Box */}
                    <div className="bg-[#030606] border border-white/[0.05] rounded-xl p-3 sm:p-3.5 flex items-center justify-between font-mono text-xs text-slate-300 select-all relative group overflow-hidden">
                      <span className="overflow-x-auto whitespace-nowrap pr-14 scrollbar-none">adb connect 192.168.1.100:34567</span>
                      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-[#030606] pl-2 py-1 flex items-center justify-center">
                        {copiedText === 'connect' ? (
                          <span className="flex w-8 h-8 items-center justify-center text-[#00F29D]">
                            <CheckIcon className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <IconButton
                            onClick={() => handleCopy('adb connect 192.168.1.100:34567', 'connect')}
                            icon="copy"
                            size="sm"
                            title="Copy Command"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#00F29D] uppercase tracking-wider block">Step 5: Sideload companion watch app</span>
                  <div className="bg-[#0c1212]/55 border border-white/[0.04] p-4.5 rounded-xl text-slate-300 text-xs md:text-sm leading-relaxed space-y-3">
                    <p>Download <code className="font-mono text-slate-300 bg-white/5 px-1 py-0.5 rounded">wear-release.apk</code> to your PC. In your terminal, run the installer command pointing to your downloaded file path:</p>

                    {/* Command Box */}
                    <div className="bg-[#030606] border border-white/[0.05] rounded-xl p-3 sm:p-3.5 flex items-center justify-between font-mono text-xs text-slate-300 select-all relative group overflow-hidden">
                      <span className="overflow-x-auto whitespace-nowrap pr-14 scrollbar-none">adb install wear-release.apk</span>
                      <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-[#030606] pl-2 py-1 flex items-center justify-center">
                        {copiedText === 'install' ? (
                          <span className="flex w-8 h-8 items-center justify-center text-[#00F29D]">
                            <CheckIcon className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <IconButton
                            onClick={() => handleCopy('adb install wear-release.apk', 'install')}
                            icon="copy"
                            size="sm"
                            title="Copy Command"
                          />
                        )}
                      </div>
                    </div>

                    <p className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs pt-1.5">
                      <CheckCircleIcon className="w-4 h-4 shrink-0" />
                      Once terminal outputs "Success", the app is on your watch!
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean up Warning */}
              <div className="bg-[#241c10]/20 border border-amber-500/20 p-5 rounded-xl flex items-start gap-4">
                <AlertTriangleIcon className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300 text-sm">Conserve Watch Battery</h4>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                    Always navigate back into Developer Options on your smartwatch and <strong className="text-white">turn off Wireless debugging</strong> and <strong className="text-white">ADB debugging</strong> once installation is done. Leaving debugging active causes the smartwatch processor to remain awake, severely depleting battery life.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. GEMINIMAN SETUP */}
          {activeSection === 'geminiman' && (
            <div className="space-y-6 docs-content-animate">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <WatchIcon className="w-6 h-6 text-[#00F29D]" />
                  Wear OS Sideloading via Geminiman Manager
                </h2>
                <div className="h-px bg-gradient-to-r from-[#00F29D]/30 to-transparent my-4" />
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  If you do not have access to a PC, or prefer avoiding command terminals, you can sideload the Wear OS companion app (<code className="font-mono text-xs text-[#00F29D] bg-[#00F29D]/5 px-1 rounded">wear-release.apk</code>) directly from your Android phone using the free **Geminiman WearOS Manager** app.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F29D] font-bold shrink-0 text-sm">1</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm md:text-base">Download Wear APK & Geminiman</h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      Download the watch companion package <code className="font-mono text-xs text-[#3DD1C4] bg-white/5 px-1 py-0.5 rounded">wear-release.apk</code> onto your phone's downloads folder. Then, search and install <strong className="text-white">Geminiman WearOS Manager</strong> from the Google Play Store on your smartphone.
                    </p>
                    <PremiumButton
                      variant="secondary"
                      href="https://play.google.com/store/apps/details?id=com.geminiman.wearosmanager"
                      target="_blank"
                      rel="noreferrer"
                      icon="external"
                      size="sm"
                      className="inline-block mt-2"
                    >
                      Get Geminiman on Play Store
                    </PremiumButton>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F29D] font-bold shrink-0 text-sm">2</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm md:text-base">Prepare Watch Debugging</h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      Ensure both your phone and Wear OS watch are on the <strong className="text-white">same Wi-Fi network</strong>. Enable <strong className="text-white">ADB Debugging</strong> and <strong className="text-white">Wireless Debugging</strong> in your smartwatch Developer Options (see the "Wireless Debugging" tab for how to activate).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F29D] font-bold shrink-0 text-sm">3</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm md:text-base">Pair & Connect inside Geminiman</h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      Open the Geminiman app on your phone. Tap the <strong className="text-white">Connection icon</strong> (usually top-right).
                    </p>
                    <ul className="text-slate-400 text-xs list-disc pl-4 space-y-1.5 mt-1 leading-relaxed">
                      <li>Choose <strong className="text-white">Wireless Debugging</strong>.</li>
                      <li>Click <strong className="text-white">Pair</strong> and enter the IP, port, and 6-digit pairing code displayed under <code className="text-slate-300 font-mono bg-white/5 px-1 py-0.5 rounded">Pair new device</code> on your watch.</li>
                      <li>Once successfully paired, input the active connection port and tap <strong className="text-white">Connect</strong>. The connection indicator will turn green.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F29D] font-bold shrink-0 text-sm">4</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white text-sm md:text-base">Select and Install watch APK</h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                      Inside Geminiman:
                    </p>
                    <ul className="text-slate-400 text-xs list-disc pl-4 space-y-1.5 mt-1 leading-relaxed">
                      <li>Swipe to the <strong className="text-white">Sideload APK</strong> / <strong className="text-white">App Manager</strong> tab.</li>
                      <li>Tap the folder browser icon and navigate to your phone's storage to locate the downloaded <code className="font-mono text-slate-300 bg-white/5 px-1 py-0.5 rounded">wear-release.apk</code>.</li>
                      <li>Select the file and tap <strong className="text-white">"Send to Watch"</strong> or <strong className="text-white">"Install APK"</strong>.</li>
                      <li>Wait for the loading bar to complete. Geminiman will prompt a toast notification confirming <span className="text-emerald-400">Installation Success</span>.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Clean up Info */}
              <div className="bg-[#0c1212]/50 border border-white/[0.05] p-5 rounded-xl flex items-start gap-4">
                <InfoIcon className="w-5 h-5 text-[#3DD1C4] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-white text-sm">Turn Off Wireless Debugging</h4>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                    Make sure to disable ADB & Wireless debugging settings on your Wear OS watch after install is completed, to avoid unnecessary battery drain on the watch.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
