import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LimeRevealSection = ({ children, className = '' }) => {
  const sectionRef = useRef(null);
  const squareRef  = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const square  = squareRef.current;
    const overlay = overlayRef.current;
    const section = sectionRef.current;
    if (!square || !overlay || !section) return;

    // Same scroll-distance-to-reveal ratio on every device would make the
    // square feel sluggish on small screens, where there's less page to
    // scroll through overall — so the reveal completes over a shorter scroll
    // distance (i.e. plays faster relative to scroll) on mobile/tablet.
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const isTablet = !isMobile && window.matchMedia('(max-width: 1023px)').matches;
    const speedMultiplier = isMobile ? 2.2 * 0.75 * 0.5 : isTablet ? 1.5 : 1; // mobile: 0.825x (dialed back again from 1.65x)
    const startOffset = 200;
    const baseRange   = 400; // desktop: end (600) - start (200)
    const endOffset   = startOffset + baseRange / speedMultiplier;

    // The square is sized in vmax and centered ON the viewport's bottom edge
    // (bottom/marginLeft are always exactly half its own size — half sits
    // below the fold, half above). vmax is the LARGER of width/height, which
    // on a landscape desktop is the width — plenty of headroom to also
    // cover the (smaller) height once scaled up. On a portrait phone/tablet
    // vmax IS the height, and this geometry only reaches half its size
    // above the bottom edge — at the old 160vmax that's 0.8×viewport
    // height, leaving the top ~20% of the screen never covered no matter
    // how far it scales. Needs to be genuinely >= 2x viewport height in
    // that orientation, not 1.6x, so bump the multiplier for narrower
    // devices instead of reusing the desktop value everywhere.
    const sizeVmax = isMobile ? 240 : isTablet ? 210 : 160;
    square.style.width = `${sizeVmax}vmax`;
    square.style.height = `${sizeVmax}vmax`;
    square.style.bottom = `${-sizeVmax / 2}vmax`;
    square.style.marginLeft = `${-sizeVmax / 2}vmax`;

    const ctx = gsap.context(() => {
      gsap.fromTo(square,
        { scale: 0.04, rotation: 0 },
        {
          scale: 1,
          rotation: 180,         // clockwise
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: `top+=${startOffset} 132%`,
            end: `top+=${endOffset} 68%`,
            scrub: 0.8,          // was 1.6 — slightly slower/laggier catch-up to scroll

            // Section entering — show growing square over the page
            onEnter: () => {
              overlay.style.visibility = 'visible';
            },

            // Square now covers full screen — hand off to section's own background
            // Section bg = same lime → seamless; any scrub-lag gaps filled by lime bg
            onLeave: () => {
              overlay.style.visibility = 'hidden';
              section.style.backgroundColor = '#AFEA00';
            },

            // Scrolling back into animation zone — restore overlay, clear section bg
            onEnterBack: () => {
              section.style.backgroundColor = 'var(--background)';
              overlay.style.visibility = 'visible';
            },

            // Section scrolled back below the viewport
            onLeaveBack: () => {
              overlay.style.visibility = 'hidden';
              section.style.backgroundColor = 'var(--background)';
            },
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    // Starts as page background (white in light mode) — turns lime only after animation
    <section
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Fixed full-viewport overlay
            z-index 40 — above normal page sections (z-auto/0) but below header (z-50) */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          pointerEvents: 'none',
          visibility: 'hidden',
        }}
      >
        {/* Lime square — centre anchored at viewport bottom, grows upward and clockwise */}
        <div
          ref={squareRef}
          style={{
            position: 'absolute',
            width: '160vmax',
            height: '160vmax',
            bottom: '-80vmax',
            left: '50%',
            marginLeft: '-80vmax',
            backgroundColor: '#AFEA00',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        />
      </div>

      {/* Content — z-index 45: above the overlay (40) but below the header (50) */}
      <div style={{ position: 'relative', zIndex: 45 }}>
        {children}
      </div>
    </section>
  );
};

export default LimeRevealSection;
