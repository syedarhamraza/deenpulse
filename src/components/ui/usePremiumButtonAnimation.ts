import { RefObject, useEffect } from 'react';
import { gsap } from 'gsap';
import type { PremiumIconName } from './icons';

export function usePremiumButtonAnimation(
  buttonRef: RefObject<HTMLElement | null>,
  icon: PremiumIconName | undefined,
  animated: boolean
) {
  useEffect(() => {
    if (!animated || !icon || !buttonRef.current) return;

    const btn = buttonRef.current;
    let phoneTl: gsap.core.Timeline | null = null;
    let watchTween: gsap.core.Tween | null = null;
    let copyTween: gsap.core.Timeline | null = null;

    const phoneArrow = btn.querySelector('.dp-icon-phone-arrow');
    const downloadArrow = btn.querySelector('.dp-icon-download-arrow');
    const arrowUp = btn.querySelector('.dp-icon-arrow-up');
    const watchSync = btn.querySelector('.dp-icon-watch-sync');
    const syncGroup = btn.querySelector('.dp-icon-sync-group');
    const copyFront = btn.querySelector('.dp-icon-copy-front');
    const docsLines = btn.querySelectorAll('.dp-icon-docs-line');
    const githubDots = btn.querySelectorAll('.dp-icon-github-dot');
    const externalArrow = btn.querySelector('.dp-icon-external-arrow');

    const bounceTarget = phoneArrow || downloadArrow || arrowUp || externalArrow;

    if (bounceTarget) {
      phoneTl = gsap.timeline({ repeat: -1, paused: true })
        .to(bounceTarget, { y: icon === 'arrow-up' ? -4 : 4, opacity: 0, duration: 0.6, ease: 'power2.in' })
        .set(bounceTarget, { y: icon === 'arrow-up' ? 4 : -4, opacity: 0 })
        .to(bounceTarget, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
    }

    const rotateTarget = watchSync || syncGroup;
    if (rotateTarget) {
      watchTween = gsap.to(rotateTarget, {
        rotation: 360,
        transformOrigin: icon === 'watch-sync' ? '12px 12px' : '12px 12px',
        duration: icon === 'sync' ? 1.4 : 2,
        ease: 'none',
        repeat: -1,
        paused: true,
      });
    }

    if (copyFront) {
      copyTween = gsap.timeline({ repeat: -1, paused: true })
        .to(copyFront, { y: -2, x: 2, duration: 0.35, ease: 'power2.out' })
        .to(copyFront, { y: 0, x: 0, duration: 0.35, ease: 'power2.in' })
        .to({}, { duration: 0.4 });
    }

    let docsTween: gsap.core.Timeline | null = null;
    let githubTween: gsap.core.Timeline | null = null;
    if (docsLines.length) {
      docsTween = gsap.timeline({ repeat: -1, paused: true })
        .to(docsLines, { x: 3, opacity: 0.4, duration: 0.4, stagger: 0.08, ease: 'power2.inOut' })
        .to(docsLines, { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.inOut' })
        .to({}, { duration: 0.5 });
    }

    if (githubDots.length) {
      githubTween = gsap.timeline({ repeat: -1, paused: true })
        .to(githubDots, { scale: 1.6, opacity: 0.5, duration: 0.35, stagger: 0.1, ease: 'power2.out' })
        .to(githubDots, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: 'power2.in' })
        .to({}, { duration: 0.6 });
    }

    const playAll = () => {
      phoneTl?.play();
      watchTween?.play();
      copyTween?.play();
      docsTween?.play();
      githubTween?.play();
    };

    const pauseAll = () => {
      if (phoneTl && bounceTarget) {
        phoneTl.pause();
        gsap.to(bounceTarget, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
      }
      if (watchTween && rotateTarget) {
        gsap.to(rotateTarget, {
          rotation: '+=35',
          duration: 0.7,
          ease: 'power2.out',
          onComplete: () => {
            watchTween?.pause();
            gsap.set(rotateTarget, { rotation: 0 });
          },
        });
      }
      if (copyTween && copyFront) {
        copyTween.pause();
        gsap.to(copyFront, { x: 0, y: 0, duration: 0.3 });
      }
      if (docsTween) {
        docsTween.pause();
        gsap.to(docsLines, { x: 0, opacity: 1, duration: 0.3 });
      }
      if (githubTween) {
        githubTween.pause();
        gsap.to(githubDots, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    btn.addEventListener('mouseenter', playAll);
    btn.addEventListener('mouseleave', pauseAll);

    return () => {
      btn.removeEventListener('mouseenter', playAll);
      btn.removeEventListener('mouseleave', pauseAll);
      phoneTl?.kill();
      watchTween?.kill();
      copyTween?.kill();
      docsTween?.kill();
      githubTween?.kill();
    };
  }, [animated, icon, buttonRef]);
}
