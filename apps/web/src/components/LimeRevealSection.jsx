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
            // (verified in-browser).
            //
            // 'top 40%' → 'top -5%' (45% of a viewport height) read as too
            // fast. 'top 100%' → 'top -60%' (160%) fixed that, but the
            // handoff to full green then landed well past the top of the
            // viewport — later than intended.
            //
            // end's "68%" token means the section's top edge sits 68% down
            // the viewport (32% up from the BOTTOM) when the screen finishes
            // going fully green — the requested 30–35%-from-bottom handoff.
            //
            // Two more rounds of feedback since: (1) the start still felt
            // too soon → delayed by another fixed 400px via the "+=400" on
            // the ELEMENT-side token (not the viewport-side one — offsetting
            // that side shifts the trigger EARLIER, the opposite of what's
            // needed here). (2) still too fast overall → rather than only
            // shifting start later (which alone would have SHRUNK the gap
            // to a fixed `end`), end also moved later by 1000px, 600px more
            // than start's delay — net effect: start delayed 400px, AND the
            // total scroll span grows from 576px to 1176px (+600px) at a
            // 900px-tall viewport. "+=N" on the element-side token is a
            // fixed pixel offset independent of viewport height, so the
            // start-delay holds exactly regardless of device; only the
            // percentage portion of the span scales with viewport size.
            //
            // Pulled 200px earlier again (+=400 → +=200) — everything else
            // (end, overall pacing) was confirmed good, just the onset was
            // slightly late.
            start: 'top+=200 132%',
            end: 'top+=600 68%',
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
