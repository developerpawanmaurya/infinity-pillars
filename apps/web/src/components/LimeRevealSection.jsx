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

    const ctx = gsap.context(() => {
      gsap.fromTo(square,
        { scale: 0.04, rotation: 0 },
        {
          scale: 1,
          rotation: 180,         // clockwise
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            // 'top+=300 30%' was an INVERTED range: it moved the start to
            // "section top at -30px" (already scrolled past the viewport
            // top), which is a LATER scroll position than the end ('top 8%'
            // = section top at 8% viewport). GSAP resolved that inversion
            // into a broken window that ran while the NEXT section (the
            // testimonial) was on screen — and since the growing square
            // lives in a full-viewport position:fixed overlay at z-40, it
            // was covering the testimonial's word-reveal entirely
            // (verified in-browser). 'top 40%' → 'top -5%' is a valid,
            // late-ish window: the grow starts only once the section's top
            // has climbed to 40% of the viewport and completes just past
            // the top, well before the following section scrolls in.
            start: 'top 40%',
            end: 'top -5%',
            scrub: 1.7,          // was 1.6 — slightly slower/laggier catch-up to scroll

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
