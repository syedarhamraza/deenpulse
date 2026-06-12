import { forwardRef, useRef, useEffect } from 'react';
import { PremiumIcon, PremiumIconName } from './icons';
import { usePremiumButtonAnimation } from './usePremiumButtonAnimation';

interface IconButtonProps {
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
  title?: string;
  type?: 'button' | 'submit';
  icon: PremiumIconName;
  animated?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const IconButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      href,
      onClick,
      target,
      rel,
      title,
      type = 'button',
      icon,
      animated = true,
      size = 'md',
      className = '',
    },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    const setRef = (el: HTMLAnchorElement | HTMLButtonElement | null) => {
      internalRef.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    usePremiumButtonAnimation(internalRef, icon, animated);

    useEffect(() => {
      const button = internalRef.current;
      if (!button) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const onPress = () => {
        gsap.to(button, { scale: 0.96, duration: 0.15, ease: 'power1.out', overwrite: 'auto' });
      };

      const onRelease = () => {
        gsap.to(button, { scale: 1, duration: 0.45, ease: 'back.out(2)', overwrite: 'auto' });
      };

      button.addEventListener('mousedown', onPress);
      button.addEventListener('mouseup', onRelease);
      button.addEventListener('mouseleave', onRelease);
      button.addEventListener('touchstart', onPress, { passive: true });
      button.addEventListener('touchend', onRelease, { passive: true });
      button.addEventListener('touchcancel', onRelease, { passive: true });

      return () => {
        button.removeEventListener('mousedown', onPress);
        button.removeEventListener('mouseup', onRelease);
        button.removeEventListener('mouseleave', onRelease);
        button.removeEventListener('touchstart', onPress);
        button.removeEventListener('touchend', onRelease);
        button.removeEventListener('touchcancel', onRelease);
      };
    }, []);

    const dim = size === 'sm' ? 'w-10 h-10' : 'w-11 h-11';
    const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
    const sharedClass = `btn-hover group relative ${dim} block ${className}`;

    const inner = (
      <>
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
          <div
            className="absolute inset-[-1000%] bg-[conic-gradient(from_0deg,transparent_60%,#00F29D_80%,#3DD1C4_100%)] animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ animationDuration: '3.5s' }}
          />
        </div>
        <div className="relative p-[1px] rounded-xl bg-white/[0.08] group-hover:bg-transparent transition-colors duration-300 w-full h-full overflow-hidden">
          <div className="w-full h-full bg-[#090D0D]/95 group-hover:bg-[#0c1212]/90 text-slate-300 hover:text-[#00F29D] rounded-[11px] transition-colors flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
            <PremiumIcon
              name={icon}
              className={`${iconSize} transition-transform duration-300 group-hover:scale-110 relative z-10`}
            />
          </div>
        </div>
      </>
    );

    if (href) {
      return (
        <a
          ref={setRef}
          href={href}
          target={target}
          rel={rel}
          title={title}
          className={sharedClass}
        >
          {inner}
        </a>
      );
    }

    return (
      <button
        ref={setRef}
        type={type}
        onClick={onClick}
        title={title}
        className={sharedClass}
      >
        {inner}
      </button>
    );
  }
);
