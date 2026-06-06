import iconImg from '../assets/icon.png';

export function Footer() {
  return (
    <footer className="bg-[#0c1212]/30 border-t border-white/[0.06] relative z-10 pt-16 pb-12 px-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        <div className="flex flex-col items-center md:items-start gap-3">
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

        <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <p className="text-xs text-slate-400">
            Created under the GNU GPL v3 License by <span className="font-bold text-white">Syed Arham Raza</span>
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            Copyright © 2026 DeenPulse App Project. All rights reserved.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://github.com/syedarhamraza/deen-pulse" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-[#00F29D] transition-all">GitHub Repo</a>
            <span className="text-white/10">•</span>
            <a href="#downloads" className="text-xs text-slate-500 hover:text-[#00F29D] transition-all">Download Binaries</a>
            <span className="text-white/10">•</span>
            <a href="#" className="text-xs text-slate-500 hover:text-[#00F29D] transition-all">Privacy Agreement</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
