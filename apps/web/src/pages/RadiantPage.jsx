import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitReveal from '../components/SplitReveal';
import RadiantHeroCanvas from '../components/RadiantHeroCanvas';
import MagneticButton from '../components/MagneticButton';
import './Radiant.css';

gsap.registerPlugin(ScrollTrigger);

// Fictional solo creative-development studio landing page — structure and
// motion language inspired by the "design engineer" portfolio genre (hero
// pitch, featured work, service tiers, process timeline, contact form), not
// a copy of any single real site. Brand ("RDNT"), founder, projects,
// clients and all copy below are invented for this build; no real studio's
// text, images or client names were reproduced.
const WORK = [
  {
    slug: 'northlight',
    name: 'Northlight',
    kind: 'Product Visualizer',
    desc: 'A real-time WebGL configurator for a lighting brand — swap materials, drop it in a room, orbit for real.',
    tags: ['3D', 'Shader'],
    grad: ['#ff5d3a', '#7a1e0f'],
  },
  {
    slug: 'vantage-analytics',
    name: 'Vantage Analytics',
    kind: 'Motion System',
    desc: 'A dashboard that explains itself — every state change animates with intent instead of just appearing.',
    tags: ['Motion', 'UI'],
    grad: ['#2b6cff', '#0d1a3a'],
  },
  {
    slug: 'ember-and-co',
    name: 'Ember & Co',
    kind: 'Brand Site',
    desc: 'A scroll that reveals the brand one turn at a time — pinned sections, soft parallax, no wasted frames.',
    tags: ['Scroll', 'Brand'],
    grad: ['#ffb238', '#4a2600'],
  },
];

const SERVICES = [
  {
    title: 'Immersive Web',
    items: ['Real-time 3D scenes', 'Custom GLSL shaders', 'Scroll-driven storytelling'],
  },
  {
    title: 'Premium Sites',
    items: ['Creative marketing sites', 'Portfolio & brand sites', 'Motion-rich interfaces'],
  },
  {
    title: 'Design + Build',
    items: ['End-to-end design & dev', 'Creative dev partnership', 'Visual & interaction design'],
  },
];

const PROCESS = [
  { n: '01', title: 'Discovery', desc: 'Goals, audience, and the technical shape of the problem — before a single pixel moves.' },
  { n: '02', title: 'Concept & Design', desc: 'Direction, layout, and motion language, tested against real content, not lorem ipsum.' },
  { n: '03', title: 'Build', desc: 'Production code from day one — component-driven, performance-budgeted, no throwaway prototypes.' },
  { n: '04', title: 'Launch & Beyond', desc: 'Shipped, measured, and tuned — motion and performance revisited once real users show up.' },
];

const SKILLS_TICKER = ['3D SCENES', 'SHADER WORK', 'SCROLL STORYTELLING', 'MOTION SYSTEMS', 'DESIGN ENGINEERING'];

const RadiantPage = () => {
  const rootRef = useRef(null);
  const tooltipRef = useRef(null);
  const marqueeTrackRef = useRef(null);
  const workViewportRef = useRef(null);
  const workTrackRef = useRef(null);
  const workProgressRef = useRef(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      smoothTouch: !isTouch,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    // Cursor "view project" tooltip, same lerp-follow approach as Meridian.
    const tooltip = tooltipRef.current;
    let mouseX = 0, mouseY = 0, tipX = 0, tipY = 0;
    const onMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMouseMove);
    const tooltipTick = () => {
      tipX += (mouseX - tipX) * 0.15;
      tipY += (mouseY - tipY) * 0.15;
      if (tooltip) gsap.set(tooltip, { x: tipX + 16, y: tipY + 16 });
    };
    gsap.ticker.add(tooltipTick);

    const ctx = gsap.context(() => {
      // ---------- Hero ----------
      // Premium archetype (motion-design): decelerate-only entrances, no
      // overshoot, slightly longer holds than a "corporate" default.
      const premiumEase = 'cubic-bezier(0.4, 0, 0.2, 1)';
      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl
        .fromTo('.rdt-nav__mark', { opacity: 0 }, { opacity: 1, duration: 0.5, ease: premiumEase })
        .fromTo('.rdt-nav__links a', { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.05, ease: premiumEase }, 0.3)
        .fromTo(
          '.rdt-hero__title-line',
          { yPercent: 110, filter: 'blur(6px)' },
          { yPercent: 0, filter: 'blur(0px)', duration: 1, ease: 'power4.out', stagger: 0.08 },
          0.35
        )
        .fromTo('.rdt-hero__caption', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: premiumEase }, 0.95)
        .fromTo('.rdt-hero__cta', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: premiumEase }, 1.1)
        .fromTo('.rdt-hero__canvas', { opacity: 0 }, { opacity: 1, duration: 1.6, ease: premiumEase }, 0.2);

      // Secondary/ambient layer: hero body drifts up and the canvas drifts
      // down at a slower rate as the section scrolls past (parallax depth).
      gsap.to('.rdt-hero__body', {
        yPercent: -18,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: { trigger: '.rdt-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to('.rdt-hero__canvas', {
        yPercent: 10,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: { trigger: '.rdt-hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      // ---------- Generic reveal presets (shared with Meridian's pattern) ----------
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const isNearPageEnd = !!el.closest('.rdt-footer');
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: isNearPageEnd ? 'top bottom' : 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      gsap.utils.toArray('[data-card-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 60, opacity: 0, scale: 0.96 }, {
          y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        });
      });

      gsap.utils.toArray('[data-stagger-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-stagger-item]');
        gsap.fromTo(items, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: group, start: 'top 82%' },
        });
      });

      // ---------- Process timeline: connecting line draws in as it enters ----------
      gsap.fromTo('.rdt-process__line', { scaleX: 0 }, {
        scaleX: 1, ease: 'none', transformOrigin: 'left center',
        scrollTrigger: { trigger: '.rdt-process', start: 'top 70%', end: 'bottom 70%', scrub: 1 },
      });

      // ---------- Work: pinned horizontal-scroll gallery (desktop only) ----------
      // Signature scroll interaction for this genre — vertical scroll drives
      // horizontal movement through the panels while the section stays
      // pinned. containerAnimation pattern, ease: 'none' required so
      // scroll position and panel position stay 1:1.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const track = workTrackRef.current;
        const viewport = workViewportRef.current;
        if (!track || !viewport) return undefined;

        const getDistance = () => Math.max(0, track.scrollWidth - viewport.offsetWidth);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: viewport,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (workProgressRef.current) gsap.set(workProgressRef.current, { scaleX: self.progress });
            },
          },
        });

        return () => tween.scrollTrigger?.kill();
      });
    }, rootRef);

    if (marqueeTrackRef.current) {
      gsap.to(marqueeTrackRef.current, { xPercent: -50, ease: 'none', duration: 22, repeat: -1 });
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    const onWindowLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      onWindowLoad();
    } else {
      window.addEventListener('load', onWindowLoad);
    }

    return () => {
      window.removeEventListener('load', onWindowLoad);
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tooltipTick);
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  const handleCardEnter = () => {
    if (!tooltipRef.current) return;
    tooltipRef.current.textContent = 'View project';
    gsap.to(tooltipRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.7)' });
  };
  const handleCardLeave = () => {
    if (!tooltipRef.current) return;
    gsap.to(tooltipRef.current, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.in' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="rdt-page" ref={rootRef}>
      <Helmet>
        <title>RDNT — Creative Development Studio</title>
        <meta
          name="description"
          content="RDNT: a creative development studio building 3D scenes, scroll-driven narratives, and motion-rich interfaces."
        />
      </Helmet>

      <Link to="/" className="rdt-back">&larr; Infinity Pillars</Link>
      <div className="rdt-cursor-tooltip" ref={tooltipRef} />

      {/* ---------- Nav ---------- */}
      <nav className="rdt-nav">
        <div className="rdt-nav__mark">RDNT<span>/ Creative Dev</span></div>
        <div className="rdt-nav__links">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* ---------- Hero ---------- */}
      <section className="rdt-hero">
        <RadiantHeroCanvas />
        <div className="rdt-hero__body">
          <h1 className="rdt-hero__title">
            <span className="rdt-hero__title-line">Interfaces that move</span>
            <span className="rdt-hero__title-line">like they mean it.</span>
          </h1>
          <p className="rdt-hero__caption">
            Design engineering across 3D scenes, scroll-driven narratives, and motion-rich
            interfaces — built without sacrificing performance.
          </p>
          <div className="rdt-hero__ctas">
            <MagneticButton className="rdt-hero__cta">
              <a href="#contact" className="rdt-btn rdt-btn--solid">Start a project</a>
            </MagneticButton>
            <MagneticButton className="rdt-hero__cta">
              <a href="#work" className="rdt-btn rdt-btn--ghost">View work</a>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ---------- Skills ticker ---------- */}
      <section className="rdt-skills-ticker" aria-hidden="true">
        <div className="rdt-skills-ticker__track">
          {[...SKILLS_TICKER, ...SKILLS_TICKER].map((s, i) => (
            <span key={i}>{s}<em>&#10022;</em></span>
          ))}
        </div>
      </section>

      {/* ---------- Featured Work ---------- */}
      {/* Pinned on desktop: vertical scroll drives horizontal movement
          through the panels (see the matchMedia block above). On mobile the
          track is just a native horizontally-scrollable row (CSS only). */}
      <section className="rdt-section rdt-work" id="work">
        <div className="rdt-wrap">
          <div className="rdt-section-head" data-reveal>
            <div className="rdt-eyebrow">Selected Work</div>
            <h2 className="rdt-section-heading">Three builds, three different problems.</h2>
          </div>
        </div>
        <div className="rdt-work__viewport" ref={workViewportRef}>
          <div className="rdt-work__track" ref={workTrackRef}>
            {WORK.map((p, i) => (
              <div
                className="rdt-work__panel"
                key={p.slug}
                data-preview-url={`/work/${p.slug}`}
                onMouseEnter={handleCardEnter}
                onMouseLeave={handleCardLeave}
              >
                <div
                  className="rdt-work__preview"
                  style={{ '--g1': p.grad[0], '--g2': p.grad[1] }}
                >
                  <span className="rdt-work__preview-grain" />
                  <span className="rdt-work__index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="rdt-work__meta">
                  <div className="rdt-work__meta-top">
                    <h3>{p.name}</h3>
                    <span className="rdt-work__link">See live &#8599;</span>
                  </div>
                  <p className="rdt-work__kind">{p.kind}</p>
                  <p className="rdt-work__desc">{p.desc}</p>
                  <div className="rdt-work__tags">
                    {p.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rdt-work__progress"><span ref={workProgressRef} /></div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="rdt-section rdt-services" id="studio">
        <div className="rdt-wrap">
          <div className="rdt-section-head" data-reveal>
            <div className="rdt-eyebrow">What I Build</div>
            <h2 className="rdt-section-heading">Three ways to work together.</h2>
          </div>
          <div className="rdt-services__grid" data-stagger-group>
            {SERVICES.map((s) => (
              <div className="rdt-services__col" key={s.title} data-stagger-item>
                <h3>{s.title}</h3>
                <ul>
                  {s.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section className="rdt-section rdt-process">
        <div className="rdt-wrap">
          <div className="rdt-section-head" data-reveal>
            <div className="rdt-eyebrow">How It Runs</div>
            <h2 className="rdt-section-heading">Four stages, no surprises.</h2>
          </div>
          <div className="rdt-process__track">
            <span className="rdt-process__line" />
            <div className="rdt-process__grid" data-stagger-group>
              {PROCESS.map((p) => (
                <div className="rdt-process__step" key={p.n} data-stagger-item>
                  <span className="rdt-process__num">{p.n}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Pull quote ---------- */}
      <section className="rdt-section rdt-quote">
        <div className="rdt-wrap">
          <SplitReveal
            text="Motion isn't decoration here — every frame earns its place, and every scroll is deliberate."
            as="p"
            className="rdt-pullquote"
            trigger="scroll"
          />
        </div>
      </section>

      {/* ---------- Contact ---------- */}
      <section className="rdt-section rdt-contact" id="contact">
        <div className="rdt-wrap rdt-contact__grid">
          <div data-reveal>
            <div className="rdt-eyebrow">Start a Project</div>
            <h2 className="rdt-section-heading">Tell me what you're building.</h2>
            <p className="rdt-body">
              Open to new projects — creative sites, product visualizers, or a motion pass on
              something that already exists. A few details up front saves us both a round trip.
            </p>
            <a href="mailto:hello@rdnt.studio" className="rdt-contact__email">hello@rdnt.studio</a>
          </div>
          <form className="rdt-form" data-reveal onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  className="rdt-form__sent"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
                >
                  <p>Message received — I'll reply within a couple of days.</p>
                  <button type="button" className="rdt-underline-link" onClick={() => setSent(false)}>Send another</button>
                </motion.div>
              ) : (
                <motion.div
                  key="fields"
                  className="rdt-form__fields"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
                >
                  <div className="rdt-form__row">
                    <label>
                      Name
                      <input type="text" name="name" required />
                    </label>
                    <label>
                      Email
                      <input type="email" name="email" required />
                    </label>
                  </div>
                  <div className="rdt-form__row">
                    <label>
                      Company
                      <input type="text" name="company" />
                    </label>
                    <label>
                      Services
                      <select name="services" defaultValue="">
                        <option value="" disabled>Choose one</option>
                        <option>Immersive Web</option>
                        <option>Premium Site</option>
                        <option>Design + Build</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Budget range
                    <select name="budget" defaultValue="">
                      <option value="" disabled>Choose one</option>
                      <option>Under $5k</option>
                      <option>$5k &ndash; $15k</option>
                      <option>$15k+</option>
                    </select>
                  </label>
                  <label>
                    Message
                    <textarea name="message" rows={4} required />
                  </label>
                  <button type="submit" className="rdt-btn rdt-btn--solid">Send message</button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </section>

      {/* ---------- Marquee + Footer ---------- */}
      <section className="rdt-marquee">
        <div className="rdt-marquee__track" ref={marqueeTrackRef}>
          <span>RDNT&nbsp;</span><span>RDNT&nbsp;</span><span>RDNT&nbsp;</span><span>RDNT&nbsp;</span>
          <span>RDNT&nbsp;</span><span>RDNT&nbsp;</span><span>RDNT&nbsp;</span><span>RDNT&nbsp;</span>
        </div>
      </section>

      <footer className="rdt-footer">
        <div className="rdt-wrap rdt-footer__grid" data-reveal>
          <div>
            <div className="rdt-footer__label">Contact</div>
            <a href="mailto:hello@rdnt.studio">hello@rdnt.studio</a>
            <div>Berlin, Germany</div>
          </div>
          <div>
            <div className="rdt-footer__label">Studio</div>
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <a href="#contact">Contact</a>
          </div>
          <div>
            <div className="rdt-footer__label">Social</div>
            <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
            <a href="#" onClick={(e) => e.preventDefault()}>X</a>
          </div>
          <div>
            <div className="rdt-footer__label">&nbsp;</div>
            <div>Where design meets code.</div>
            <div>&copy; 2026 RDNT Studio.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RadiantPage;
