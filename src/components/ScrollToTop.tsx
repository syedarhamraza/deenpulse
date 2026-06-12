import { useState, useEffect, useRef } from 'react';
import { ArrowUpIcon } from './ui/icons';
import { motion, AnimatePresence } from 'motion/react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);

  const width = 48;
  const rx = 16;
  const circumference = 4 * (width - 2 * rx) + 2 * Math.PI * rx;

  // Callback ref to initialize styles immediately when element mounts
  const setPathRef = (node: SVGPathElement | null) => {
    (pathRef as any).current = node;
    if (node) {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      const offset = circumference - pct * circumference;
      node.style.strokeDasharray = `${circumference}px`;
      node.style.strokeDashoffset = `${offset}px`;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      
      // Update DOM directly to avoid React re-renders on every scroll pixel
      if (pathRef.current) {
        const offset = circumference - pct * circumference;
        pathRef.current.style.strokeDashoffset = `${offset}px`;
      }
      
      const isVisible = scrollTop > 300;
      setVisible((prev) => (prev !== isVisible ? isVisible : prev));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [circumference]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: {
              type: 'spring',
              stiffness: 260,
              damping: 18
            }
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          exit={{ 
            opacity: 0, 
            scale: 0.7, 
            y: 20,
            transition: {
              duration: 0.2
            }
          }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 rounded-2xl bg-[#0c1212]/80 backdrop-blur-md border border-white/[0.08] hover:border-[#00F29D]/40 text-[#00F29D] hover:text-white flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors z-50 prevent-gsap-hover group"
          title="Scroll to Top"
        >
          {/* Squircle Scroll Progress Ring */}
          <svg className="absolute -inset-px w-[50px] h-[50px] pointer-events-none" viewBox="0 0 50 50">
            <path
              className="text-white/[0.02]"
              strokeWidth="2"
              stroke="currentColor"
              fill="transparent"
              d="M 25 1 L 33 1 A 16 16 0 0 1 49 17 L 49 33 A 16 16 0 0 1 33 49 L 17 49 A 16 16 0 0 1 1 33 L 1 17 A 16 16 0 0 1 17 1 Z"
            />
            <path
              ref={setPathRef}
              className="text-[#00F29D]"
              strokeWidth="2"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              d="M 25 1 L 33 1 A 16 16 0 0 1 49 17 L 49 33 A 16 16 0 0 1 33 49 L 17 49 A 16 16 0 0 1 1 33 L 1 17 A 16 16 0 0 1 17 1 Z"
            />
          </svg>
          
          <ArrowUpIcon className="w-4.5 h-4.5 group-hover:-translate-y-1 transition-transform duration-300 relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
