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

    // Legacy/generic selectors
    const phoneArrow = btn.querySelector('.dp-icon-phone-arrow');
    const downloadArrow = btn.querySelector('.dp-icon-download-arrow');
    const arrowUp = btn.querySelector('.dp-icon-arrow-up');
    const watchSync = btn.querySelector('.dp-icon-watch-sync');
    const syncGroup = btn.querySelector('.dp-icon-sync-group');
    const copyFront = btn.querySelector('.dp-icon-copy-front');
    const docsLines = btn.querySelectorAll('.dp-icon-docs-line');
    const githubDots = btn.querySelectorAll('.dp-icon-github-dot');
    const externalArrow = btn.querySelector('.dp-icon-external-arrow');

    // Redesigned premium selectors
    const phoneParticle = btn.querySelector('.dp-icon-phone-particle');
    const phoneArrowHead = btn.querySelector('.dp-icon-phone-arrow-head');
    const watchSyncGroup = btn.querySelector('.dp-icon-watch-sync-group');
    const watchCenter = btn.querySelector('.dp-icon-watch-center');
    const downloadShaft = btn.querySelector('.dp-icon-download-shaft');
    const downloadTip = btn.querySelector('.dp-icon-download-tip');
    const downloadBar = btn.querySelector('.dp-icon-download-bar');
    const githubCat = btn.querySelector('.dp-icon-github-cat');
    const githubNodePulse = btn.querySelector('.dp-icon-github-git-node-pulse');
    const githubEyes = btn.querySelectorAll('.dp-icon-github-eye');
    const githubGraph = btn.querySelector('.dp-icon-github-graph');

    // Legacy bounce animations
    const bounceTarget = phoneArrow || downloadArrow || arrowUp || externalArrow;
    if (bounceTarget) {
      phoneTl = gsap.timeline({ repeat: -1, paused: true })
        .to(bounceTarget, { y: icon === 'arrow-up' ? -4 : 4, opacity: 0, duration: 0.6, ease: 'power2.in' })
        .set(bounceTarget, { y: icon === 'arrow-up' ? 4 : -4, opacity: 0 })
        .to(bounceTarget, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
    }

    // Legacy rotation animations
    const rotateTarget = watchSync || syncGroup;
    if (rotateTarget) {
      watchTween = gsap.to(rotateTarget, {
        rotation: 360,
        transformOrigin: '12px 12px',
        duration: icon === 'sync' ? 1.4 : 2,
        ease: 'none',
        repeat: -1,
        paused: true,
      });
    }

    // Legacy clipboard copy animations
    if (copyFront) {
      copyTween = gsap.timeline({ repeat: -1, paused: true })
        .to(copyFront, { y: -2, x: 2, duration: 0.35, ease: 'power2.out' })
        .to(copyFront, { y: 0, x: 0, duration: 0.35, ease: 'power2.in' })
        .to({}, { duration: 0.4 });
    }

    // Legacy docs lines animations
    let docsTween: gsap.core.Timeline | null = null;
    if (docsLines.length) {
      docsTween = gsap.timeline({ repeat: -1, paused: true })
        .to(docsLines, { x: 3, opacity: 0.4, duration: 0.4, stagger: 0.08, ease: 'power2.inOut' })
        .to(docsLines, { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'power2.inOut' })
        .to({}, { duration: 0.5 });
    }

    // Legacy github dot animations
    let githubTween: gsap.core.Timeline | null = null;
    if (githubDots.length) {
      githubTween = gsap.timeline({ repeat: -1, paused: true })
        .to(githubDots, { scale: 1.6, opacity: 0.5, duration: 0.35, stagger: 0.1, ease: 'power2.out' })
        .to(githubDots, { scale: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: 'power2.in' })
        .to({}, { duration: 0.6 });
    }

    // --- Redesigned Premium GSAP Timelines ---

    // 1. Phone Download Premium Timeline
    let phonePremiumTl: gsap.core.Timeline | null = null;
    if (phoneParticle || phoneArrowHead) {
      phonePremiumTl = gsap.timeline({ repeat: -1, paused: true });
      if (phoneParticle) {
        phonePremiumTl.fromTo(phoneParticle, 
          { attr: { cy: 7 }, opacity: 1 },
          { attr: { cy: 15 }, opacity: 0.2, duration: 0.9, ease: 'power1.inOut' }
        );
      }
      if (phoneArrowHead) {
        phonePremiumTl.fromTo(phoneArrowHead,
          { y: 0 },
          { y: 1.5, duration: 0.45, yoyo: true, repeat: 1, ease: 'sine.inOut' },
          0
        );
      }
    }

    // 2. Watch Sync Premium Timeline
    let watchPremiumTl: gsap.core.Timeline | null = null;
    if (watchSyncGroup || watchCenter) {
      watchPremiumTl = gsap.timeline({ repeat: -1, paused: true });
      if (watchSyncGroup) {
        watchPremiumTl.to(watchSyncGroup, {
          rotation: 360,
          transformOrigin: '12px 12px',
          duration: 1.5,
          ease: 'none'
        }, 0);
      }
      if (watchCenter) {
        watchPremiumTl.fromTo(watchCenter,
          { scale: 1, opacity: 1 },
          { scale: 1.6, opacity: 0.4, duration: 0.75, yoyo: true, repeat: 1, transformOrigin: '12px 12px', ease: 'sine.inOut' },
          0
        );
      }
    }

    // 3. Download Arrow Premium Timeline
    let downloadPremiumTl: gsap.core.Timeline | null = null;
    if (downloadShaft || downloadTip || downloadBar) {
      downloadPremiumTl = gsap.timeline({ repeat: -1, paused: true });
      if (downloadShaft && downloadTip) {
        downloadPremiumTl.fromTo([downloadShaft, downloadTip],
          { y: -3, opacity: 0.4 },
          { y: 2, opacity: 1, duration: 0.5, ease: 'power1.inOut' }
        ).to([downloadShaft, downloadTip],
          { y: 4, opacity: 0, duration: 0.15, ease: 'power1.in' }
        ).set([downloadShaft, downloadTip], { y: -4, opacity: 0 })
        .to([downloadShaft, downloadTip], { y: -3, opacity: 0.4, duration: 0.15 });
      }
      if (downloadBar) {
        downloadPremiumTl.fromTo(downloadBar,
          { opacity: 0, scaleX: 0.4 },
          { opacity: 1, scaleX: 1, duration: 0.4, transformOrigin: '12px 18px', ease: 'back.out(1.5)' },
          0.2
        ).to(downloadBar, { opacity: 0, duration: 0.3 }, 0.7);
      }
    }

    // 4. GitHub Premium Timeline
    let githubPremiumTl: gsap.core.Timeline | null = null;
    if (githubCat || githubNodePulse || githubEyes.length || githubGraph) {
      githubPremiumTl = gsap.timeline({ repeat: -1, paused: true });
      if (githubCat) {
        githubPremiumTl.fromTo(githubCat,
          { rotation: 0 },
          { rotation: 6, transformOrigin: '12px 18px', duration: 0.45, yoyo: true, repeat: 3, ease: 'sine.inOut' },
          0
        );
      }
      if (githubNodePulse) {
        githubPremiumTl.fromTo(githubNodePulse,
          { scale: 0.8, opacity: 0.5 },
          { scale: 1.5, opacity: 1, duration: 0.45, transformOrigin: '10px 11px', yoyo: true, repeat: 2, ease: 'power1.inOut' },
          0
        );
      }
      if (githubEyes.length) {
        githubPremiumTl.to(githubEyes, { scaleY: 0.1, transformOrigin: 'center', duration: 0.1, yoyo: true, repeat: 1 }, 0.4)
                       .to(githubEyes, { scaleY: 0.1, transformOrigin: 'center', duration: 0.1, yoyo: true, repeat: 1 }, 1.5);
      }
      if (githubGraph) {
        githubPremiumTl.fromTo(githubGraph, { y: 0 }, { y: -1, duration: 0.9, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0);
      }
    }

    const playAll = () => {
      phoneTl?.play();
      watchTween?.play();
      copyTween?.play();
      docsTween?.play();
      githubTween?.play();

      phonePremiumTl?.play();
      watchPremiumTl?.play();
      downloadPremiumTl?.play();
      githubPremiumTl?.play();
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

      // Pause and reset premium animations
      if (phonePremiumTl) {
        phonePremiumTl.pause();
        if (phoneParticle) gsap.to(phoneParticle, { attr: { cy: 7 }, opacity: 1, duration: 0.3 });
        if (phoneArrowHead) gsap.to(phoneArrowHead, { y: 0, duration: 0.3 });
      }
      if (watchPremiumTl) {
        if (watchSyncGroup) {
          gsap.to(watchSyncGroup, {
            rotation: '+=45',
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              watchPremiumTl?.pause();
              gsap.set(watchSyncGroup, { rotation: 0 });
            }
          });
        } else {
          watchPremiumTl.pause();
        }
        if (watchCenter) gsap.to(watchCenter, { scale: 1, opacity: 1, duration: 0.3 });
      }
      if (downloadPremiumTl) {
        downloadPremiumTl.pause();
        if (downloadShaft && downloadTip) gsap.to([downloadShaft, downloadTip], { y: 0, opacity: 1, duration: 0.3 });
        if (downloadBar) gsap.to(downloadBar, { opacity: 0, duration: 0.2 });
      }
      if (githubPremiumTl) {
        githubPremiumTl.pause();
        if (githubCat) gsap.to(githubCat, { rotation: 0, duration: 0.3 });
        if (githubNodePulse) gsap.to(githubNodePulse, { scale: 1, opacity: 0.5, duration: 0.3 });
        if (githubEyes.length) gsap.to(githubEyes, { scaleY: 1, duration: 0.1 });
        if (githubGraph) gsap.to(githubGraph, { y: 0, duration: 0.3 });
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

      phonePremiumTl?.kill();
      watchPremiumTl?.kill();
      downloadPremiumTl?.kill();
      githubPremiumTl?.kill();
    };
  }, [animated, icon, buttonRef]);
}
