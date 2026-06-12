import { useEffect, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  duration?: number;
  distance?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  ease?: string;
  once?: boolean;
  onComplete?: () => void;
}

export function useScrollReveal(
  targetRef: RefObject<HTMLElement | null> | string,
  options: ScrollRevealOptions = {}
) {
  const {
    direction = 'up',
    duration = 0.8,
    distance = 30,
    delay = 0,
    stagger = 0,
    start = 'top 85%',
    ease = 'power3.out',
    once = true,
    onComplete,
  } = options;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = typeof targetRef === 'string' ? targetRef : targetRef.current;

    if (!target) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        // Instantly reveal everything without animation if prefers-reduced-motion is active
        gsap.set(target, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          visibility: 'visible',
        });
        if (onComplete) onComplete();
        return;
      }

      // Determine initial offset states based on direction
      let xOffset = 0;
      let yOffset = 0;
      let scaleOffset = 1;

      switch (direction) {
        case 'up':
          yOffset = distance;
          break;
        case 'down':
          yOffset = -distance;
          break;
        case 'left':
          xOffset = distance;
          break;
        case 'right':
          xOffset = -distance;
          break;
        case 'scale':
          scaleOffset = 1 - (distance / 100); // e.g., distance 10 -> scale 0.9
          break;
        case 'none':
        default:
          break;
      }

      gsap.fromTo(
        target,
        {
          opacity: 0,
          x: xOffset,
          y: yOffset,
          scale: scaleOffset,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger,
          ease,
          scrollTrigger: {
            trigger: target as any,
            start,
            toggleActions: once ? 'play none none none' : 'play none none reverse',
            once,
          },
          onComplete,
        }
      );
    });

    return () => ctx.revert();
  }, [targetRef, direction, duration, distance, delay, stagger, start, ease, once, onComplete]);
}
