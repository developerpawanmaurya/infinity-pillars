import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ProcessAnimation.css';

gsap.registerPlugin(ScrollTrigger);

// Stacking-cards process reveal: five full-viewport panels, each pinned
// via plain CSS `position: sticky` (no JS pinning needed for the core
// mechanic — later panels simply have a higher z-index, so as each one
// reaches the top of the viewport it visually slides up and over the
// previous one). GSAP adds the polish on top: the outgoing panel scales
// down and dims as the next one arrives, and each panel's image/text
// animate in as it becomes the active one. Real step photography, shown
// large and full-bleed — no shared canvas fighting five images for room.
const STEPS = [
  { id: 0, label: 'Discover', img: '/images/process/discover.png', desc: 'Mapping the terrain before we build anything — competitors, gaps, and where the actual leverage is.' },
  { id: 1, label: 'Strategize', img: '/images/process/strategize.png', desc: 'A plan built on data, not guesses — every decision traced back to a number that matters.' },
  { id: 2, label: 'Design', img: '/images/process/design.png', desc: 'Every screen earns its place. Prototyped, tested, and validated before a line of code exists.' },
  { id: 3, label: 'Build', img: '/images/process/build.png', desc: 'Shipped, tested, and built to last — infrastructure that holds up under real traffic.' },
  { id: 4, label: 'Launch', img: '/images/process/launch.png', desc: 'Live, measured, and already improving. The work continues after the ribbon-cutting.' },
];

const ProcessAnimation = () => {
  const stackRef = useRef(null);
  const panelRefs = useRef([]);
  const innerRefs = useRef([]);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return undefined;

    const ctx = gsap.context(() => {
      STEPS.forEach((_, i) => {
        const panel = panelRefs.current[i];
        const inner = innerRefs.current[i];
        if (!panel || !inner) return;

        const media = inner.querySelector('.process-panel__media img');
        const content = inner.querySelector('.process-panel__content');

        // Entrance — plays as the panel scrolls into place and becomes
        // the active (topmost) card.
        gsap.fromTo(media,
          { scale: 1.22 },
          {
            scale: 1.08,
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top top', scrub: true },
          });
        gsap.fromTo(content,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 85%', end: 'top 40%', scrub: true },
          });

        // Exit — the panel that's about to be covered scales down and
        // dims slightly, so the next one visibly arrives "on top" of it
        // rather than just abruptly replacing it.
        if (i < STEPS.length - 1) {
          gsap.to(inner, {
            scale: 0.92,
            filter: 'brightness(0.55)',
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top top', end: 'bottom top', scrub: true },
          });
        }
      });
    }, stack);

    // Large real photographs — force a global ScrollTrigger refresh once
    // they've all finished loading (plus a fallback on window 'load') so
    // other triggers on the page (e.g. the lime reveal section further
    // down) don't end up measured against a not-quite-final layout.
    const images = Array.from(stack.querySelectorAll('img'));
    let pending = images.length;
    const onOneLoaded = () => {
      pending -= 1;
      if (pending <= 0) ScrollTrigger.refresh();
    };
    if (images.length === 0) {
      ScrollTrigger.refresh();
    } else {
      images.forEach((img) => {
        img.addEventListener('load', onOneLoaded, { once: true });
        img.addEventListener('error', onOneLoaded, { once: true });
      });
    }
    const onWindowLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onWindowLoad);

    return () => {
      window.removeEventListener('load', onWindowLoad);
      images.forEach((img) => {
        img.removeEventListener('load', onOneLoaded);
        img.removeEventListener('error', onOneLoaded);
      });
      ctx.revert();
    };
  }, []);

  return (
    <div className="process-stack" ref={stackRef}>
      {STEPS.map((step, i) => (
        <div
          className="process-panel"
          key={step.id}
          style={{ zIndex: i + 1 }}
          ref={(el) => (panelRefs.current[i] = el)}
        >
          <div className="process-panel__inner" ref={(el) => (innerRefs.current[i] = el)}>
            <div className="process-panel__media">
              <img src={step.img} alt={step.label} />
            </div>
            <div className="process-panel__scrim" />

            <div className="process-panel__ticks">
              {STEPS.map((s, ti) => (
                <span key={s.id} className={`process-panel__tick${ti === i ? ' is-active' : ''}`} />
              ))}
            </div>

            <div className="process-panel__content">
              <span className="process-panel__index">{String(i + 1).padStart(2, '0')}</span>
              <div className="process-panel__text">
                <h3 className="process-panel__label">{step.label}</h3>
                <p className="process-panel__desc">{step.desc}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProcessAnimation;
