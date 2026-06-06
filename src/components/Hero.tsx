import { Smartphone, Watch } from 'lucide-react';
import { motion } from 'motion/react';
import { MobilePhoneFrame, WearOSWatchFrame } from './DeviceFrames';
import { ReleaseInfo } from '../types';

interface HeroProps {
  releaseInfo: ReleaseInfo;
}

export function Hero({ releaseInfo }: HeroProps) {
  return (
    <section className="pt-36 pb-20 px-6 relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-8">
      {/* Glow pill */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#00F29D]/5 border border-[#00F29D]/15 rounded-full backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-[#00F29D] animate-pulse" />
        <span className="text-xs font-mono font-bold text-[#00F29D] uppercase tracking-widest">
          {releaseInfo.loading ? 'Checking Updates...' : releaseInfo.version ? `${releaseInfo.version} Stable Release` : 'Latest Stable Release'}
        </span>
      </motion.div>

      {/* Premium Typographic Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] max-w-5xl"
      >
        Bring Live Prayer Alerts<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F29D] via-[#2CE1A6] to-[#3DD1C4]">
          to your Android device.
        </span>
      </motion.h1>

      {/* Copywriting Subheader */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl font-sans"
      >
        DeenPulse turns your static notifications into glanceable Live Prayer Alerts for ongoing status, upcoming countdowns, and Wear OS syncs. Built around native Android APIs and tuned to bypass aggressive OEM battery limits.
      </motion.p>

      {/* Clean, Premium Call-to-actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mt-4"
      >
        <a
          href="#downloads"
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] text-[#060A0A] font-extrabold rounded-xl hover:shadow-[0_0_35px_rgba(0,242,157,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
        >
          <Smartphone className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
          <span>Get Mobile APK</span>
        </a>
        <a
          href="#downloads"
          className="w-full sm:w-auto px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#3DD1C4]/40 text-slate-300 font-extrabold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
        >
          <Watch className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span>Get Wear OS Companion</span>
        </a>
      </motion.div>

      {/* Visual Showcase: Overlapping Device Frame Assembly */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-5xl mt-16 relative flex items-center justify-center"
      >
        {/* Neon radial backdrop shadow */}
        <div className="absolute w-[80%] h-[80%] bg-gradient-to-tr from-[#00F29D]/10 to-[#3DD1C4]/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

        <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-8 lg:gap-16">
          {/* Mobile Phone Mockup */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00F29D]/20 to-[#3DD1C4]/20 rounded-[44px] blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
            <MobilePhoneFrame />
          </div>

          {/* Wear OS Watch Mockup (floating slightly) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative group md:-ml-12 lg:-ml-20 md:-mt-16 z-20"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#3DD1C4]/30 to-[#00F29D]/10 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-700" />
            <WearOSWatchFrame />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
