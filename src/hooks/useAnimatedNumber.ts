import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedNumberOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  precision?: number;
}

export function useAnimatedNumber(
  targetValue: number,
  options: AnimatedNumberOptions = {}
) {
  const { duration = 0.5, delay = 0, ease = 'power1.out', precision = 0 } = options;
  const [displayValue, setDisplayValue] = useState(targetValue);
  const valueRef = useRef({ val: targetValue });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      valueRef.current.val = targetValue;
      return;
    }

    const animObj = valueRef.current;

    const tween = gsap.to(animObj, {
      val: targetValue,
      duration,
      delay,
      ease,
      onUpdate: () => {
        const factor = Math.pow(10, precision);
        setDisplayValue(Math.round(animObj.val * factor) / factor);
      },
    });

    return () => {
      tween.kill();
    };
  }, [targetValue, duration, delay, ease, precision]);

  return displayValue;
}
