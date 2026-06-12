import { useEffect, useRef, type FC } from 'react';
import iconImg from '../assets/icon.png';
import { gsap } from 'gsap';

export const Footer: FC<{ isDocsPage?: boolean }> = function Footer({ isDocsPage = false }) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set('.footer-logo-block, .footer-links-block, .footer-link-item', { y: 0, opacity: 1 });
        return;
      }

      // Left logo block entrance
      gsap.fromTo('.footer-logo-block',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%'
          }
        }
      );

      // Right links block entrance
      gsap.fromTo('.footer-links-block',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%'
          }
        }
      );

      // Staggered links reveal
      gsap.fromTo('.footer-link-item',
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%'
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#0c1212]/30 border-t border-white/[0.06] relative z-10 pt-16 pb-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        <div className="footer-logo-block flex flex-col items-center md:items-start gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00F29D] to-[#3DD1C4] p-[1px] overflow-hidden shadow-[0_0_10px_rgba(0,242,157,0.1)]">
              <div className="w-full h-full bg-[#030606] rounded-[5px] flex items-center justify-center overflow-hidden p-1">
                <img src={iconImg} alt="DeenPulse Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <span className="font-heading font-extrabold text-xl text-white tracking-tight">
              Deen<span className="text-[#00F29D]">Pulse</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm text-center md:text-left max-w-sm leading-relaxed mt-2">
            Reliable prayer tracking for Android and Wear OS. Works entirely offline, respects your battery, and stays perfectly in sync—no missed alerts, no complications.
          </p>
        </div>

        <div className="footer-links-block flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <p className="text-xs text-slate-400">
            Created under the GNU GPL v3 License by <span className="font-bold text-white">Syed Arham Raza</span>
          </p>
          <p className="text-[10px] font-mono text-slate-500 animate-text-shimmer">
            Copyright © 2026 DeenPulse. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-2 mt-2">
            <a href="https://github.com/syedarhamraza/deen-pulse" target="_blank" rel="noreferrer" className="footer-link-item text-xs text-slate-500 hover:text-[#00F29D] transition-colors">GitHub Repo</a>
            <span className="footer-link-item hidden sm:inline text-white/10">•</span>
            <a href="#docs" className="footer-link-item text-xs text-slate-500 hover:text-[#00F29D] transition-colors">Documentation</a>
            <span className="footer-link-item hidden sm:inline text-white/10">•</span>
            <a href="#downloads" className="footer-link-item text-xs text-slate-500 hover:text-[#00F29D] transition-colors">Download Binaries</a>
            <span className="footer-link-item hidden sm:inline text-white/10">•</span>
            <a href="#privacy" className="footer-link-item text-xs text-slate-500 hover:text-[#00F29D] transition-colors">Privacy Agreement</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
