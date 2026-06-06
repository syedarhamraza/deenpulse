import { useEffect, useRef } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';

interface FAQProps {
  openFaq: number | null;
  setOpenFaq: (idx: number | null) => void;
}

export function FAQ({ openFaq, setOpenFaq }: FAQProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header block reveal
      gsap.fromTo('.faq-header-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%' // Trigger earlier
          }
        }
      );

      // Accordion rows stagger reveal
      gsap.fromTo('.faq-row-reveal',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%' // Trigger earlier
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="py-24 px-6 max-w-4xl mx-auto relative z-10 scroll-mt-20 text-left">
      <div className="faq-header-reveal text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 bg-[#3DD1C4]/10 text-[#3DD1C4] font-bold text-xs uppercase px-3 py-1.5 rounded-full mb-4 border border-[#3DD1C4]/20 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>FAQ</span>
        </div>
        <h2 className="font-heading text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-400 text-lg">
          Technical details on background tasks, offline calculation, and platform compatibility.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: "Is DeenPulse completely offline?",
            a: "Yes. DeenPulse only requires network access once a month to download the calculation calendar based on your coordinates. All daily calculations, countdowns, and background alarms run locally on-device without making any network calls."
          },
          {
            q: "Why is direct APK installation recommended?",
            a: "Installing the APK directly from GitHub ensures you are running a build that contains no proprietary tracking libraries, Google Play SDKs, or telemetry tools. This keeps the application small, fast, and private."
          },
          {
            q: "How are custom OEM notification styles managed?",
            a: "To handle non-standard status bar behaviors on manufacturer-specific Android skins, DeenPulse uses three category profiles. Category 1 (OPPO/OnePlus/Realme) leverages native status bar ongoing chips. Category 2 (Vivo/iQOO) uses a simplified layout to avoid UI alignment errors on Funtouch OS. Category 3 (others) uses standard alarm notifications scheduled 15 minutes before prayer times."
          },
          {
            q: "Does Wear OS sync impact watch battery life?",
            a: "No. Communication relies on the Wearable DataClient API, which pushes updates only when settings change or a new month's calendar is cached. The watch does not run a continuous listener or make network calls, saving battery."
          },
          {
            q: "How is location data handled?",
            a: "Your location is saved locally in private AsyncStorage to run the calculation engine. It is never transmitted to external servers, and GPS is queried only once a month for a maximum of 500ms."
          }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`faq-row-reveal bg-[#0c1212]/60 border rounded-2xl transition-all duration-300 overflow-hidden ${openFaq === idx ? 'border-[#00F29D]/40 shadow-[0_8px_30px_rgba(0,242,157,0.03)]' : 'border-white/[0.06] hover:border-white/[0.12]'}`}
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-heading font-bold text-white text-base md:text-lg">{item.q}</span>
              <span className="flex-shrink-0 ml-4 p-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#00F29D] transition-transform duration-300">
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === idx ? 'transform rotate-180' : ''}`} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {openFaq === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                >
                  <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-white/[0.04] pt-4">
                    {item.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
