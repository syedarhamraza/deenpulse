import { useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import iconImg from '../assets/icon.png';
import { PremiumButton } from './ui/PremiumButton';
import { IconButton } from './ui/IconButton';

interface NavbarProps {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isDocsPage?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.85, y: -30 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 18, // liquid spring wobble
      mass: 0.8,
      staggerChildren: 0.04,
      delayChildren: 0.08
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: -20,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30, // quick fluid collapse
      duration: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      type: 'spring', 
      stiffness: 280, 
      damping: 20 
    } 
  }
};

export function Navbar({ scrolled, mobileMenuOpen, setMobileMenuOpen, isDocsPage = false }: NavbarProps) {
  const headerRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Smooth stagger intro on mount
  useEffect(() => {
    if (!headerRef.current) return;
    
    // Smooth navbar entrance on page load
    gsap.fromTo(headerRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', delay: 0.1 }
    );

    // Stagger animate logo and nav items for premium intro feel
    gsap.fromTo('.nav-logo-item',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.2 }
    );

    gsap.fromTo('.nav-animate-item',
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  // Liquid spring scroll transition for header glass pill (restored floating pill layout)
  useEffect(() => {
    if (!headerRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Setup initial visual properties instantly without delay/flash
      gsap.set(headerRef.current, {
        maxWidth: scrolled ? '896px' : '1024px',
        scale: scrolled ? 0.97 : 1,
        backgroundColor: scrolled ? '#060a0a' : 'rgba(6, 10, 10, 0.2)', // Solid background when scrolled to hide background text
        borderColor: scrolled ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
        backdropFilter: scrolled ? 'none' : 'blur(12px)', // Disable backdrop filter on scroll
        boxShadow: scrolled 
          ? '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
          : '0 4px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      });
      return;
    }

    // Liquid transition on scrolled state changes
    if (scrolled) {
      gsap.to(headerRef.current, {
        maxWidth: '896px',
        scale: 0.97,
        backgroundColor: '#060a0a', // Solid opaque card color on scroll
        borderColor: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'none', // Remove backdrop blur on scroll to cleanly block content
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        duration: 0.8,
        ease: 'elastic.out(1.1, 0.65)',
        overwrite: 'auto'
      });
    } else {
      gsap.to(headerRef.current, {
        maxWidth: '1024px',
        scale: 1,
        backgroundColor: 'rgba(6, 10, 10, 0.2)', // Frosted glass at top
        borderColor: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        duration: 0.8,
        ease: 'elastic.out(1.1, 0.65)',
        overwrite: 'auto'
      });
    }
  }, [scrolled]);

  return (
    <>
      {/* FLOATING GLASS PILL NAVBAR */}
      <div className="fixed top-4 inset-x-0 z-50 px-6 flex justify-center pointer-events-none">
        <header 
          ref={headerRef} 
          className="pointer-events-auto h-16 w-full rounded-2xl flex items-center justify-between px-6 border"
          style={{ opacity: 0 }} /* Initial state for GSAP mount animation */
        >
          <a href="#" className="nav-logo-item flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F29D] to-[#3DD1C4] p-[1px] shadow-[0_0_15px_rgba(0,242,157,0.15)] group-hover:shadow-[0_0_20px_rgba(0,242,157,0.3)] transition-colors overflow-hidden">
              <div className="w-full h-full bg-[#030606] rounded-[11px] flex items-center justify-center overflow-hidden p-1.5">
                <img src={iconImg} alt="DeenPulse Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-[#00F29D] transition-colors">
              Deen<span className="text-[#00F29D]">Pulse</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            <a href="#features" className="nav-animate-item text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#simulator" className="nav-animate-item text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Local Simulator</a>
            <a href="#structure" className="nav-animate-item text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Architecture</a>
            <a href="#faq" className="nav-animate-item text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">FAQ</a>
            <a 
              href="#docs" 
              className={`nav-animate-item text-xs font-semibold uppercase tracking-wider transition-colors ${
                isDocsPage ? 'text-[#00F29D] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Docs
            </a>
          </nav>

          {/* Download CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <PremiumButton
              variant="primary"
              href="#downloads"
              icon="phone-download"
              size="sm"
              className="nav-animate-item uppercase tracking-wider"
            >
              Get APK
            </PremiumButton>
            <IconButton
              href="https://github.com/syedarhamraza/deen-pulse"
              target="_blank"
              rel="noreferrer"
              icon="github"
              title="GitHub Repository"
              className="nav-animate-item"
            />
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn-hover md:hidden w-10 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center text-slate-300 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>
      </div>

      {/* MOBILE NAV ACCORDION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden fixed top-24 inset-x-6 bg-[#060a0a]/80 backdrop-blur-2xl border border-white/[0.08] z-40 p-6 rounded-2xl flex flex-col gap-4 shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15)]"
          >
            <motion.a 
              variants={itemVariants}
              href="#features" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D] transition-colors"
            >
              Features
            </motion.a>
            <motion.a 
              variants={itemVariants}
              href="#simulator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D] transition-colors"
            >
              Local Simulator
            </motion.a>
            <motion.a 
              variants={itemVariants}
              href="#structure" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D] transition-colors"
            >
              Architecture
            </motion.a>
            <motion.a 
              variants={itemVariants}
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D] transition-colors"
            >
              FAQ
            </motion.a>
            <motion.a 
              variants={itemVariants}
              href="#docs" 
              onClick={() => setMobileMenuOpen(false)} 
              className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                isDocsPage ? 'text-[#00F29D] font-bold' : 'text-slate-200 hover:text-[#00F29D]'
              }`}
            >
              Docs
            </motion.a>
            <motion.div variants={itemVariants} className="h-px bg-white/[0.08] my-2" />
            <motion.div variants={itemVariants} className="flex gap-4">
              <PremiumButton
                variant="primary"
                href="#downloads"
                icon="phone-download"
                size="sm"
                className="flex-1 uppercase tracking-wider"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get APK
              </PremiumButton>
              <IconButton
                href="https://github.com/syedarhamraza/deen-pulse"
                target="_blank"
                rel="noreferrer"
                icon="github"
                title="GitHub Repository"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
