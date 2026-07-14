import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PILLARS = [
  { w: 48, h: '52%' },
  { w: 68, h: '80%' },
  { w: 48, h: '63%' },
];

export default function Preloader({ onComplete }) {
  const wrapRef    = useRef(null);
  const pillarRefs = useRef([]);
  const topTextRef = useRef(null);
  const botTextRef = useRef(null);
  const counterRef = useRef(null);
  const barRef     = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const obj = { n: 0 };

    const tl = gsap.timeline({
      onComplete() {
        document.body.style.overflow = '';
        onComplete?.();
      },
    });

    // 1 — pillars rise from bottom
    tl.fromTo(
      pillarRefs.current,
      { scaleY: 0 },
      { scaleY: 1, duration: 0.65, stagger: 0.14, ease: 'power3.out', transformOrigin: 'center bottom' }
    )
    // 2 — agency name clips in (top word from above, bottom from below)
    .fromTo(
      topTextRef.current,
      { yPercent: -110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '-=0.25'
    )
    .fromTo(
      botTextRef.current,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      '<0.07'
    )
    // 3 — counter climbs 000 → 100 while bar fills
    .to(obj, {
      n: 100,
      duration: 1.15,
      ease: 'power1.inOut',
      onUpdate() {
        const v = Math.round(obj.n);
        if (counterRef.current)
          counterRef.current.textContent = String(v).padStart(3, '0');
        if (barRef.current)
          barRef.current.style.transform = `scaleX(${v / 100})`;
      },
    }, '-=0.1')
    // 4 — pillars slam back down
    .to(
      pillarRefs.current,
      { scaleY: 0, duration: 0.32, stagger: 0.06, ease: 'power4.in', transformOrigin: 'center bottom' },
      '+=0.08'
    )
    // 5 — curtain lifts to reveal site
    .to(wrapRef.current, { yPercent: -100, duration: 0.72, ease: 'power3.inOut' }, '-=0.04');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000000,
        background: '#0c0c0c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Three pillars — bottom-anchored in a flex row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 14,
          height: 200,
          marginBottom: 44,
        }}
      >
        {PILLARS.map((p, i) => (
          <div
            key={i}
            ref={el => (pillarRefs.current[i] = el)}
            style={{
              width: p.w,
              height: p.h,
              background: '#AFEA00',
              transformOrigin: 'center bottom',
            }}
          />
        ))}
      </div>

      {/* Agency name — two lines, each in its own overflow-hidden clip */}
      <div style={{ textAlign: 'center', lineHeight: 1 }}>
        <div style={{ overflow: 'hidden' }}>
          <div
            ref={topTextRef}
            style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '0.12em',
              color: '#ffffff',
              textTransform: 'uppercase',
            }}
          >
            Infinity
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div
            ref={botTextRef}
            style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              letterSpacing: '0.12em',
              color: '#AFEA00',
              textTransform: 'uppercase',
            }}
          >
            Pillars.
          </div>
        </div>
      </div>

      {/* Counter + % — bottom-right corner */}
      <div
        style={{
          position: 'absolute',
          bottom: 22,
          right: 28,
          display: 'flex',
          alignItems: 'baseline',
          gap: 3,
        }}
      >
        <span
          ref={counterRef}
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            fontWeight: 900,
            color: '#AFEA00',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum"',
          }}
        >
          000
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.05em',
          }}
        >
          %
        </span>
      </div>

      {/* Full-width progress bar pinned to bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: '100%',
            background: '#AFEA00',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>
    </div>
  );
}
