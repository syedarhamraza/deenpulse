import { Download, Github, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import iconImg from '../assets/icon.png';

interface NavbarProps {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isDocsPage?: boolean;
}

export function Navbar({ scrolled, mobileMenuOpen, setMobileMenuOpen, isDocsPage = false }: NavbarProps) {
  return (
    <>
      {/* FLOATING GLASS PILL NAVBAR */}
      <div className="fixed top-4 inset-x-0 z-50 px-6 flex justify-center pointer-events-none">
        <header className={`pointer-events-auto h-16 w-full max-w-5xl rounded-2xl flex items-center justify-between px-6 border transition-all duration-500 ${scrolled ? 'bg-[#060A0A]/85 backdrop-blur-xl border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'bg-transparent border-transparent'}`}>
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00F29D] to-[#3DD1C4] p-[1px] shadow-[0_0_15px_rgba(0,242,157,0.15)] group-hover:shadow-[0_0_20px_rgba(0,242,157,0.3)] transition-all overflow-hidden">
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
            <a href="#features" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#simulator" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Local Simulator</a>
            <a href="#structure" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Architecture</a>
            <a href="#faq" className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">FAQ</a>
            <a 
              href="#docs" 
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                isDocsPage ? 'text-[#00F29D] font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Docs
            </a>
          </nav>

          {/* Download CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="#downloads" 
              className="h-10 px-4 bg-white/[0.03] hover:bg-[#00F29D] text-slate-300 hover:text-[#060a0a] border border-white/[0.06] hover:border-transparent text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get APK</span>
            </a>
            <a 
              href="https://github.com/syedarhamraza/deen-pulse" 
              target="_blank" 
              rel="noreferrer" 
              className="w-10 h-10 bg-white/[0.03] border border-white/[0.06] hover:border-[#00F29D]/40 text-slate-300 hover:text-[#00F29D] rounded-xl transition-all flex items-center justify-center"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden w-10 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>
      </div>

      {/* MOBILE NAV ACCORDION */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-24 inset-x-6 bg-[#0c1212]/95 backdrop-blur-xl border border-white/[0.08] z-40 p-6 rounded-2xl flex flex-col gap-4 shadow-2xl"
          >
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              Features
            </a>
            <a 
              href="#simulator" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              Local Simulator
            </a>
            <a 
              href="#structure" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              Architecture
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="text-sm font-semibold uppercase tracking-wider text-slate-200 hover:text-[#00F29D]"
            >
              FAQ
            </a>
            <a 
              href="#docs" 
              onClick={() => setMobileMenuOpen(false)} 
              className={`text-sm font-semibold uppercase tracking-wider ${
                isDocsPage ? 'text-[#00F29D] font-bold' : 'text-slate-200 hover:text-[#00F29D]'
              }`}
            >
              Docs
            </a>
            <div className="h-px bg-white/[0.08] my-2" />
            <div className="flex gap-4">
              <a 
                href="#downloads" 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex-1 py-3 text-center bg-[#111616] border border-white/[0.08] text-xs font-bold uppercase tracking-wider rounded-xl text-white flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Get APK</span>
              </a>
              <a 
                href="https://github.com/syedarhamraza/deen-pulse" 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-[#111616] border border-white/[0.08] rounded-xl text-slate-300 flex items-center justify-center"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
