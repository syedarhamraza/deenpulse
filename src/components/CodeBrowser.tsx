import { useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CodeIcon, CopyIcon, CheckIcon } from './ui/icons';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';
import { highlightCode } from '../utils/codeHighlighter';
import { fileContents } from '../constants';
import { ReleaseInfo } from '../types';

const fileTreeVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: {
      height: { type: 'spring', stiffness: 220, damping: 26 },
      opacity: { duration: 0.2 }
    }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: {
      height: { type: 'spring', stiffness: 220, damping: 26 },
      opacity: { duration: 0.15 }
    }
  }
};

interface CodeBrowserProps {
  activeFile: string;
  setActiveFile: (file: string) => void;
  expandedNodes: Record<string, boolean>;
  toggleNode: (node: string) => void;
  releaseInfo: ReleaseInfo;
  copied: boolean;
  copyToClipboard: () => void;
}

export function CodeBrowser({
  activeFile,
  setActiveFile,
  expandedNodes,
  toggleNode,
  releaseInfo,
  copied,
  copyToClipboard
}: CodeBrowserProps) {
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!codeContainerRef.current) return;
    
    // Reset scroll positions to top-left on active file switch
    codeContainerRef.current.scrollTop = 0;
    codeContainerRef.current.scrollLeft = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      // Flash the first line to simulate file load highlight
      gsap.fromTo('.first-code-line',
        { backgroundColor: 'rgba(0, 242, 157, 0.2)' },
        { backgroundColor: 'rgba(0, 242, 157, 0)', duration: 1.2, ease: 'power2.out', overwrite: 'auto' }
      );
    }

    gsap.fromTo(codeContainerRef.current,
      { x: 15, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      }
    );
  }, [activeFile]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header block entrance
      gsap.fromTo('.code-browser-header-reveal',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.code-browser-header-reveal',
            start: 'top 85%'
          }
        }
      );

      // Left explorer entrance
      gsap.fromTo('.code-browser-explorer-reveal',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.code-browser-explorer-reveal',
            start: 'top 85%'
          }
        }
      );

      // Right editor card entrance
      gsap.fromTo('.code-browser-editor-reveal',
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.code-browser-editor-reveal',
            start: 'top 85%'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="structure" className="py-24 px-6 max-w-7xl mx-auto relative z-10 scroll-mt-20">
      <div className="code-browser-header-reveal text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Source Code Structure
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          Browse the core modules responsible for calculating offline prayer times, handling Wear OS synchronization, and managing background notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="code-browser-explorer-reveal lg:col-span-4 bg-[#0c1212]/90 rounded-3xl border border-white/[0.06] p-5 shadow-2xl text-left flex flex-col h-[520px] overflow-hidden">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.05] flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <span className="text-[11px] font-mono text-slate-500 ml-2">deen-pulse-app{releaseInfo.version ? `-${releaseInfo.version}` : ''}</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2 font-mono text-xs text-slate-400 select-none custom-scrollbar">
            
            {/* node: android */}
            <div>
              <div 
                onClick={() => toggleNode('android')}
                className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
              >
                {expandedNodes['android'] ? <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500" />}
                <span className="text-amber-400 text-xs">📁</span>
                <span className="font-bold text-slate-200">android</span>
              </div>

              <AnimatePresence initial={false}>
                {expandedNodes['android'] && (
                  <motion.div 
                    variants={fileTreeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1.5 overflow-hidden"
                  >
                    
                    {/* node: android/app */}
                    <div>
                      <div 
                        onClick={() => toggleNode('android/app')}
                        className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        {expandedNodes['android/app'] ? <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-amber-400 text-xs">📁</span>
                        <span className="text-slate-300">app</span>
                      </div>
                      
                      <AnimatePresence initial={false}>
                        {expandedNodes['android/app'] && (
                          <motion.div 
                            variants={fileTreeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1 overflow-hidden"
                          >
                            <div 
                              onClick={() => setActiveFile('PrayerCapsuleForegroundService.kt')}
                              className={`btn-hover flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${activeFile === 'PrayerCapsuleForegroundService.kt' ? 'bg-[#3DD1C4]/10 text-[#3DD1C4]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                            >
                              <span className="text-[#3DD1C4] text-[10px] font-bold">KT</span>
                              <span>PrayerCapsuleForegroundService.kt</span>
                            </div>
                            <div 
                              onClick={() => setActiveFile('WearDataSyncService.kt')}
                              className={`btn-hover flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${activeFile === 'WearDataSyncService.kt' ? 'bg-[#3DD1C4]/10 text-[#3DD1C4]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                            >
                              <span className="text-[#3DD1C4] text-[10px] font-bold">KT</span>
                              <span>WearDataSyncService.kt</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* node: src */}
            <div>
              <div 
                onClick={() => toggleNode('src')}
                className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
              >
                {expandedNodes['src'] ? <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500" />}
                <span className="text-amber-400 text-xs">📁</span>
                <span className="font-bold text-slate-200">src</span>
              </div>
              
              <AnimatePresence initial={false}>
                {expandedNodes['src'] && (
                  <motion.div 
                    variants={fileTreeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1.5 overflow-hidden"
                  >
                    
                    {/* node: src/hooks */}
                    <div>
                      <div 
                        onClick={() => toggleNode('src/hooks')}
                        className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        {expandedNodes['src/hooks'] ? <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-amber-400 text-xs">📁</span>
                        <span className="text-slate-300">hooks</span>
                      </div>
                      
                      <AnimatePresence initial={false}>
                        {expandedNodes['src/hooks'] && (
                          <motion.div 
                            variants={fileTreeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1 overflow-hidden"
                          >
                            <div 
                              onClick={() => setActiveFile('usePrayerTimes.ts')}
                              className={`btn-hover flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${activeFile === 'usePrayerTimes.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                            >
                              <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                              <span>usePrayerTimes.ts</span>
                            </div>
                            <div 
                              onClick={() => setActiveFile('usePrayerCountdown.ts')}
                              className={`btn-hover flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${activeFile === 'usePrayerCountdown.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                            >
                              <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                              <span>usePrayerCountdown.ts</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* node: src/utils */}
                    <div>
                      <div 
                        onClick={() => toggleNode('src/utils')}
                        className="flex items-center gap-1.5 hover:bg-white/[0.03] p-1.5 rounded-lg cursor-pointer transition-colors"
                      >
                        {expandedNodes['src/utils'] ? <ChevronDownIcon className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500" />}
                        <span className="text-amber-400 text-xs">📁</span>
                        <span className="text-slate-300">utils</span>
                      </div>
                      
                      <AnimatePresence initial={false}>
                        {expandedNodes['src/utils'] && (
                          <motion.div 
                            variants={fileTreeVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pl-4 border-l border-white/[0.05] ml-3 mt-1 space-y-1 overflow-hidden"
                          >
                            <div 
                              onClick={() => setActiveFile('prayerEngine.ts')}
                              className={`btn-hover flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${activeFile === 'prayerEngine.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                            >
                              <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                              <span>prayerEngine.ts</span>
                            </div>
                            <div 
                              onClick={() => setActiveFile('deviceProfiles.ts')}
                              className={`btn-hover flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${activeFile === 'deviceProfiles.ts' ? 'bg-[#00F29D]/10 text-[#00F29D]' : 'hover:bg-white/[0.02] text-slate-500'}`}
                            >
                              <span className="text-[#00F29D] text-[10px] font-bold">TS</span>
                              <span>deviceProfiles.ts</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* IDE-like Code Editor Panel (Col-span-8) */}
        <div className="code-browser-editor-reveal lg:col-span-8 bg-[#090D0D] rounded-3xl border border-white/[0.06] overflow-hidden shadow-2xl flex flex-col h-[520px]">
          
          {/* Editor Tabs bar */}
          <div className="bg-[#050808]/70 px-4 border-b border-white/[0.05] flex items-center justify-between h-12">
            <div className="flex gap-1">
              <div className="bg-[#090D0D] border-x border-t border-white/[0.06] px-4 h-12 flex items-center gap-2 text-xs font-mono text-white font-semibold rounded-t-lg">
                <CodeIcon className="w-3.5 h-3.5 text-[#00F29D]" />
                <span>{activeFile}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={copyToClipboard}
                className="btn-hover px-2.5 py-1 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-slate-400 hover:text-white rounded-lg flex items-center gap-1.5 text-[10px] font-mono transition-colors uppercase font-semibold"
              >
                {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <span className="text-[10px] font-mono text-slate-500 bg-white/[0.04] px-2 py-1 rounded">
                {activeFile.endsWith('.ts') ? 'TypeScript' : 'Kotlin'}
              </span>
            </div>
          </div>

          {/* Description tooltip */}
          <div className="bg-[#00F29D]/5 border-b border-white/[0.03] px-5 py-3.5 text-xs text-slate-400 text-left leading-relaxed">
            <span className="font-bold text-[#00F29D] font-mono mr-1">MODULE GOAL:</span> {fileContents[activeFile].desc}
          </div>

          {/* Code lines container */}
          <div ref={codeContainerRef} className="flex-1 overflow-auto p-5 text-left font-mono text-xs leading-relaxed text-slate-300 bg-[#090D0D]/40 custom-scrollbar flex flex-col">
            <div className="w-full flex-1">
              {highlightCode(fileContents[activeFile].code).__html.split('\n').map((lineHtml, i) => {
                const isFirstLine = i === 0;
                return (
                  <div 
                    key={i} 
                    className={`code-line-hover flex w-full min-h-[1.5rem] px-2 py-0.5 rounded transition-all duration-300 font-mono text-xs ${
                      isFirstLine ? 'first-code-line' : ''
                    }`}
                  >
                    {/* Line number */}
                    <span className="w-8 text-slate-600 text-right select-none pr-3 border-r border-white/[0.04] shrink-0 inline-block font-mono">
                      {i + 1}
                    </span>
                    {/* Line content */}
                    <span 
                      className="pl-4 whitespace-pre flex-1 inline-block font-mono text-slate-300 relative"
                    >
                      <span dangerouslySetInnerHTML={{ __html: lineHtml || ' ' }} />
                      {/* Blinking cursor at the end of the very last line */}
                      {i === fileContents[activeFile].code.split('\n').length - 1 && (
                        <span className="animate-cursor-blink text-[#00F29D] font-bold select-none ml-1">_</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
