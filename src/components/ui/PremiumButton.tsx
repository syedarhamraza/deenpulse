import { forwardRef, useRef, type ReactNode } from 'react';
import { PremiumIcon, PremiumIconName } from './icons';
import { usePremiumButtonAnimation } from './usePremiumButtonAnimation';

type ButtonSize = 'sm' | 'md' | 'lg';

interface PremiumButtonProps {
  variant?: 'primary' | 'secondary';
  href?: string;
  onClick?: () => void;
  download?: string;
  target?: string;
  rel?: string;
  title?: string;
  type?: 'button' | 'submit';
  icon?: PremiumIconName;
  animated?: boolean;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const sizeClasses: Record<ButtonSize, { wrapper: string; face: string; icon: string }> = {
  sm: {
    wrapper: 'h-10',
    face: 'px-4 py-2 text-xs',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    wrapper: '',
    face: 'px-8 py-4 text-sm',
    icon: 'w-5 h-5',
  },
  lg: {
    wrapper: '',
    face: 'px-10 py-4.5 text-base',
    icon: 'w-5 h-5',
  },
};

export const PremiumButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, PremiumButtonProps>(
  function PremiumButton(
    {
      variant = 'primary',
      href,
      onClick,
      download,
      target,
      rel,
      title,
      type = 'button',
      icon,
      animated = true,
      size = 'md',
      fullWidth = false,
      className = '',
      children,
    },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

    const setRef = (el: HTMLAnchorElement | HTMLButtonElement | null) => {
      internalRef.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    usePremiumButtonAnimation(internalRef, icon, animated && !!icon);

    const sizes = sizeClasses[size];
    const widthClass = fullWidth ? 'w-full' : 'w-full sm:w-auto';
    const sharedClass = `btn-hover group relative ${widthClass} block ${sizes.wrapper} ${className}`;

    const iconEl = icon ? (
      <PremiumIcon
        name={icon}
        className={`${sizes.icon} transition-transform duration-300 group-hover:scale-105 shrink-0`}
      />
    ) : null;

    const faceContent = (
      <>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        {iconEl}
        <span className="tracking-tight relative z-10">{children}</span>
      </>
    );

    const primaryFace = (
      <div
        className={`relative w-full h-full ${sizes.face} bg-gradient-to-r from-[#00F29D] via-[#2CE1A6] to-[#3DD1C4] text-[#060A0A] font-extrabold rounded-xl shadow-[inset_0_1.5px_0_rgba(255,255,255,0.45),0_8px_30px_rgba(0,242,157,0.2)] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden`}
      >
        {faceContent}
      </div>
    );

    const secondaryFace = (
      <div className="relative p-[1px] rounded-xl bg-white/[0.08] group-hover:bg-transparent transition-colors duration-300 w-full h-full overflow-hidden">
        <div
          className={`w-full h-full ${sizes.face} bg-[#090D0D]/95 group-hover:bg-[#0c1212]/90 text-slate-300 hover:text-white font-extrabold rounded-[11px] transition-colors flex items-center justify-center gap-3 overflow-hidden relative`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
          {iconEl}
          <span className="tracking-tight relative z-10">{children}</span>
        </div>
      </div>
    );

    const inner = variant === 'primary' ? (
      <>
        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#00F29D] to-[#3DD1C4] rounded-2xl blur-xl opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
        {primaryFace}
      </>
    ) : (
      <>
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-0">
          <div
            className="absolute inset-[-1000%] bg-[conic-gradient(from_0deg,transparent_60%,#00F29D_80%,#3DD1C4_100%)] animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ animationDuration: '3.5s' }}
          />
        </div>
        {secondaryFace}
      </>
    );

    if (href) {
      return (
        <a
          ref={setRef}
          href={href}
          download={download}
          target={target}
          rel={rel}
          title={title}
          onClick={onClick}
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
