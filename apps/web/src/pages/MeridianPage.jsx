import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitReveal from '../components/SplitReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import './Meridian.css';

gsap.registerPlugin(ScrollTrigger);

// Fictional architecture studio landing page. Copy, firm name, people,
// offices, awards and clients are all invented for this build — no real
// firm's text was copied. Photography is real, freely-licensed Unsplash
// photography standing in for a fictional studio and portfolio.
const IMG = (n) => `/images/meridian/${n}.jpg`;

const HERO_CAPTIONS = [
  'Sustainability strategy, material efficiency, passive systems, energy modelling.',
  'Concept, facade and planning solutions, sketch design, construction documentation.',
];

const AWARDS = [
  { name: 'Formline Design Award 2025', detail: '1st Place — Public Building Architecture' },
  { name: 'Bright Space Awards 2023', detail: "1st Place — Residential Interior over 60 sqm" },
  { name: 'Bright Space Awards 2023', detail: '1st Place — Garden & Landscape' },
  { name: '90+ awards', detail: 'In international competitions' },
];

const PUBLICATIONS = [
  'Modern Dwelling No. 5', 'ArchNow Feature: Ridge House', 'Interior Quarterly',
  'FieldNotes.Design', 'Home & Terrain', 'Hearth & Craft No. 2',
];

const OFFICES = [
  { role: 'Head Office', city: 'Portugal, Lisbon', addr: 'Rua das Amoreiras 45' },
  { role: 'Corporate Headquarters', city: 'Portugal, Porto', addr: 'Avenida da Boavista 102' },
  { role: 'Main Headquarters', city: 'Denmark, Copenhagen', addr: 'Vesterbrogade 78, 3rd floor' },
  { role: 'Central Office', city: 'Denmark, Aarhus', addr: 'Frederiksgade 56, Suite 3' },
  { role: 'Administrative Office', city: 'Portugal, Braga', addr: 'Rua do Souto 34' },
  { role: 'Executive Office', city: 'Denmark, Odense', addr: 'Vestergade 90, Room 4' },
  { role: 'Main Office', city: 'Portugal, Coimbra', addr: 'Rua Ferreira Borges 12' },
  { role: 'Corporate Office', city: 'Denmark, Aalborg', addr: 'Boulevarden 45, Floor 1' },
  { role: 'Headquarters', city: 'Portugal, Faro', addr: 'Rua de Santo António 23' },
  { role: 'Main Office', city: 'Denmark, Esbjerg', addr: 'Kongensgade 67, Suite 8' },
  { role: 'Central Office', city: 'Portugal, Setúbal', addr: 'Avenida Luísa Todi 11' },
  { role: 'Executive Headquarters', city: 'Denmark, Roskilde', addr: 'Algade 33' },
];

const PROJECTS = [
  { slug: 'ashcombe-ridge-house', name: 'Ashcombe Ridge House', area: '611 m²', img: IMG('proj-01') },
  { slug: 'millbrook-private-park', name: 'Millbrook Private Park', area: '1,360 m²', img: IMG('proj-02') },
  { slug: 'northgate-pavilion', name: 'Northgate Pavilion', area: '3,345 m²', img: IMG('proj-03') },
  { slug: 'foundry-yard-residences', name: 'Foundry Yard Residences', area: '8,200 m²', img: IMG('proj-04') },
  { slug: 'the-kiln-works', name: 'The Kiln Works', area: '16,488 m²', img: IMG('proj-05') },
  { slug: 'aster-mansion', name: 'Aster Mansion', area: '991 m²', img: IMG('proj-06') },
  { slug: 'birch-corner-house', name: 'Birch Corner House', area: '435 m²', img: IMG('proj-07') },
  { slug: 'solstice-hotel-stone-court', name: 'Solstice Hotel Stone Court', area: '58,079 m²', img: IMG('proj-08') },
];

const STATS = [
  { value: 15, suffix: '+', label: 'Years of experience' },
  { value: 490, suffix: '+', label: 'Completed projects' },
  { value: 45, suffix: '+', label: 'Professionals on the team' },
  { value: 40, suffix: 'K', label: 'Total area covered' },
];

const CLIENTS = [
  { mark: 'VN', name: 'Verrant' }, { mark: 'ORLA', name: 'Orla Group' },
  { mark: 'HTK', name: 'Hartek' }, { mark: 'BW', name: 'Bridwell' },
  { mark: 'NU', name: 'Numen' }, { mark: 'C&C', name: 'Cast & Co' },
  { mark: 'GP', name: 'Greyport' }, { mark: 'AT', name: 'Atlier' },
];

const CULTURE_PHOTOS = Array.from({ length: 14 }, (_, i) => IMG(`culture-${String(i + 1).padStart(2, '0')}`));

const MeridianPage = () => {
  const rootRef = useRef(null);
  const heroImgRef = useRef(null);
  const flagshipImgRef = useRef(null);
  const tooltipRef = useRef(null);
  const officeRowRefs = useRef([]);
  const xrayContainerRef = useRef(null);
  const xraySkeletonRef = useRef(null);
  const xrayLensRef = useRef(null);
  const spokeRefs = useRef([]);
  const spokeLabelRefs = useRef([]);
  const spokeGroupRef = useRef(null);
  const headlineARef = useRef(null);
  const headlineBRef = useRef(null);
  const cultureStageRef = useRef(null);
  const photoRefs = useRef([]);
  const cultureCaptionRef = useRef(null);
  const statTextRefs = useRef([]);
  const marqueeTrackRef = useRef(null);

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

    // Cursor link-preview tooltip
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

    // ---------- Section 5: Sketch to System — cursor-driven X-ray lens ----------
    // Independent of scroll/Lenis entirely (per build-doc revision 2): a
    // square lens trails the cursor over the flagship photo, clip-revealing
    // an edge-detected "blueprint" layer underneath. Driven by its own
    // gsap.ticker lerp loop, never gsap.to() per mousemove (avoids queueing
    // hundreds of overlapping tweens). Declared in the outer effect scope
    // (not inside gsap.context) so the cleanup below can reach it.
    const xrayContainer = xrayContainerRef.current;
    const xraySkeleton = xraySkeletonRef.current;
    const xrayLens = xrayLensRef.current;
    const XRAY_HALF = window.innerWidth < 768 ? 70 : 130;
    let xrayActive = false, xmx = 0, xmy = 0, xtx = 0, xty = 0;
    let xrayTick = null;
    if (xraySkeleton) {
      gsap.set(xraySkeleton, { clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)' });
    }
    const onXrayMove = (e) => {
      const rect = xrayContainer.getBoundingClientRect();
      xmx = e.clientX - rect.left;
      xmy = e.clientY - rect.top;
    };
    const onXrayEnter = () => { xrayActive = true; };
    const onXrayLeave = () => { xrayActive = false; };
    if (xrayContainer && xraySkeleton) {
      xrayContainer.addEventListener('mousemove', onXrayMove);
      xrayContainer.addEventListener('mouseenter', onXrayEnter);
      xrayContainer.addEventListener('mouseleave', onXrayLeave);
      xrayTick = () => {
        xtx += (xmx - xtx) * 0.18;
        xty += (xmy - xty) * 0.18;
        const half = xrayActive ? XRAY_HALF : 0;
        xraySkeleton.style.clipPath = `polygon(${xtx - half}px ${xty - half}px, ${xtx + half}px ${xty - half}px, ${xtx + half}px ${xty + half}px, ${xtx - half}px ${xty + half}px)`;
        if (xrayLens) {
          gsap.set(xrayLens, { x: xtx, y: xty, opacity: xrayActive ? 1 : 0 });
        }
      };
      gsap.ticker.add(xrayTick);
    }

    const ctx = gsap.context(() => {
      // ---------- Section 1: Hero ----------
      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl
        .fromTo('.mer-nav__mark', { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        .fromTo('.mer-nav__links a', { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out' }, 0.3)
        .fromTo('.mer-hero__title-line', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.5)
        .fromTo('.mer-hero__caption', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 1.0);

      gsap.to(heroImgRef.current, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: '.mer-hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      // ---------- Section 2: Flagship image Ken Burns ----------
      gsap.fromTo(flagshipImgRef.current,
        { scale: 1.08, yPercent: -6 },
        { scale: 1.0, yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: '.mer-flagship', start: 'top bottom', end: 'bottom top', scrub: true } });

      // ---------- Generic reveal presets ----------
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        // Elements near the very bottom of the document (the footer is the
        // only one on this page) can compute a "top 80%" start position
        // beyond the page's actual max scroll — there's no room below them
        // to satisfy an 80%-down-the-viewport trigger point, so it never
        // fires. Use a start that only needs the element to begin entering
        // from below, which always stays within the reachable range.
        const isNearPageEnd = !!el.closest('.mer-footer');
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
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });

      gsap.utils.toArray('[data-stagger-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-stagger-item]');
        gsap.fromTo(items, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06,
          scrollTrigger: { trigger: group, start: 'top 82%' },
        });
      });

      // ---------- Section 4b: Offices "reading head" ----------
      officeRowRefs.current.forEach((row) => {
        if (!row) return;
        // A zero-duration start===end trigger fires onEnter+onLeave in the
        // same tick (no visible "active" window) — use the row's own
        // extent vs. viewport center instead, so exactly one row is
        // active for as long as the center line sits inside it.
        ScrollTrigger.create({
          trigger: row, start: 'top center', end: 'bottom center',
          onToggle: (self) => row.classList.toggle('is-active', self.isActive),
        });
      });

      // ---------- Section 7: Projects — parallax image scale ----------
      gsap.utils.toArray('[data-project-img]').forEach((img) => {
        gsap.fromTo(img, { scale: 1 }, {
          scale: 1.06, ease: 'none',
          scrollTrigger: { trigger: img.closest('.mer-project'), start: 'top bottom', end: 'bottom top', scrub: true },
        });
      });

      // ---------- Section 8: Radial diagram + theme flip ----------
      spokeRefs.current.forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', delay: i * 0.06,
          scrollTrigger: { trigger: '.mer-radial', start: 'top 70%', toggleActions: 'play none none reverse' },
          onComplete: () => spokeLabelRefs.current[i]?.classList.add('is-visible'),
          onReverseComplete: () => spokeLabelRefs.current[i]?.classList.remove('is-visible'),
        });
      });

      gsap.to(spokeGroupRef.current, {
        rotate: 18, transformOrigin: '50% 50%', ease: 'none',
        scrollTrigger: { trigger: '.mer-radial', start: 'top top', end: 'bottom bottom', scrub: 1 },
      });

      gsap.timeline({
        scrollTrigger: { trigger: '.mer-radial', start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
        .to(headlineARef.current, { opacity: 0, duration: 0.3 }, 0.35)
        .fromTo(headlineBRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.45);

      const themeVars = { bg: '#FAFAF8', fg: '#121210' };
      gsap.to(themeVars, {
        bg: '#0B0B0A', fg: '#F5F4F0',
        scrollTrigger: { trigger: '.mer-theme-transition', start: 'top center', end: 'bottom center', scrub: 1 },
        onUpdate: () => {
          document.documentElement.style.setProperty('--mer-bg', themeVars.bg);
          document.documentElement.style.setProperty('--mer-fg', themeVars.fg);
        },
      });

      // ---------- Section 9/10: shared photo ring -> cascade -> stats stage ----------
      // One continuous scroll-linked sequence (not pin+pin — the stage is CSS
      // position:sticky, so the same photo DOM nodes persist visually from
      // ring-formation straight through the stats cascade, per the "don't
      // destroy/rebuild shared elements" rule).
      const n = photoRefs.current.length;
      const radius = window.innerWidth < 900 ? 190 : 380;
      const ringPositions = [];
      const startPositions = [];
      const trailPositions = [];
      photoRefs.current.forEach((el, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        ringPositions.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
        startPositions.push({ x: gsap.utils.random(-600, 600), y: gsap.utils.random(-360, 360), rotate: gsap.utils.random(-30, 30) });
        trailPositions.push({ x: -600 + i * 90, y: -380 + i * 58 });
        if (el) gsap.set(el, { x: startPositions[i].x, y: startPositions[i].y, rotate: startPositions[i].rotate, opacity: 0 });
      });

      let currentBeat = -1;
      ScrollTrigger.create({
        trigger: cultureStageRef.current, start: 'top top', end: 'bottom bottom', scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const ringT = gsap.utils.clamp(0, 1, p / 0.22);
          const cascadeT = gsap.utils.clamp(0, 1, (p - 0.35) / 0.65);

          photoRefs.current.forEach((el, i) => {
            if (!el) return;
            const start = startPositions[i];
            const ring = ringPositions[i];
            const trail = trailPositions[i];
            let x = gsap.utils.interpolate(start.x, ring.x, ringT);
            let y = gsap.utils.interpolate(start.y, ring.y, ringT);
            let opacity = ringT;
            if (cascadeT > 0) {
              x = gsap.utils.interpolate(ring.x, trail.x, cascadeT);
              y = gsap.utils.interpolate(ring.y, trail.y, cascadeT);
              opacity = gsap.utils.interpolate(1, 0.2, cascadeT);
            }
            gsap.set(el, { x, y, opacity, rotate: start.rotate * (1 - ringT) });
          });

          // Fade the caption out over just the first quarter of the cascade
          // (not the full span) so it clears before the first stat beat
          // becomes legible — otherwise "2011" and "15+" briefly overlap.
          gsap.set(cultureCaptionRef.current, { opacity: ringT * gsap.utils.clamp(0, 1, 1 - cascadeT * 4) });

          if (cascadeT <= 0) {
            if (currentBeat !== -1) {
              currentBeat = -1;
              statTextRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0 }));
            }
          } else {
            const beat = Math.min(3, Math.floor(cascadeT * 4));
            if (beat !== currentBeat) {
              currentBeat = beat;
              statTextRefs.current.forEach((el, i) => {
                if (!el) return;
                if (i === beat) {
                  gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, overwrite: true });
                  const counterEl = el.querySelector('[data-counter]');
                  const target = STATS[i].value;
                  const obj = { n: 0 };
                  gsap.to(obj, {
                    n: target, duration: 1.2, ease: 'power2.out', snap: { n: 1 }, overwrite: true,
                    onUpdate: () => { if (counterEl) counterEl.textContent = obj.n.toLocaleString() + STATS[i].suffix; },
                  });
                } else {
                  gsap.to(el, { opacity: 0, y: -20, duration: 0.3, overwrite: true });
                }
              });
            }
          }
        },
      });

      // ---------- Section 12: Marquee ----------
      if (marqueeTrackRef.current) {
        gsap.to(marqueeTrackRef.current, { xPercent: -50, ease: 'none', duration: 20, repeat: -1 });
      }
    }, rootRef);

    // A single early refresh isn't enough on a page this long: late-loading
    // web fonts and images reflow layout after triggers are first computed,
    // leaving late-page triggers (e.g. the footer reveal) permanently
    // mis-positioned — per §2.7 of the build doc. Refresh again once fonts
    // and the full `load` event have both settled.
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
      if (xrayContainer && xraySkeleton) {
        xrayContainer.removeEventListener('mousemove', onXrayMove);
        xrayContainer.removeEventListener('mouseenter', onXrayEnter);
        xrayContainer.removeEventListener('mouseleave', onXrayLeave);
        if (xrayTick) gsap.ticker.remove(xrayTick);
      }
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  const handleCardEnter = (e, slug) => {
    if (!tooltipRef.current) return;
    tooltipRef.current.textContent = `/work/${slug}`;
    gsap.to(tooltipRef.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.7)' });
  };
  const handleCardLeave = () => {
    if (!tooltipRef.current) return;
    gsap.to(tooltipRef.current, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.in' });
  };

  return (
    <div className="mer-page" ref={rootRef}>
      <Helmet>
        <title>Meridian Architectural Bureau — Structured Vision, Honest Form</title>
        <meta
          name="description"
          content="Meridian Architectural Bureau: precision architecture, interiors, and master planning across Portugal and Denmark."
        />
      </Helmet>

      <Link to="/" className="mer-back">&larr; Infinity Pillars</Link>
      <div className="mer-cursor-tooltip" ref={tooltipRef} />

      {/* Shared SVG filter: turns the flagship photo's edges (mullions, roof
          lines, structural seams) into a pale blueprint-on-navy outline for
          the Section 5 hover lens — same pixels as the photo, so the two
          layers are guaranteed to line up. feConvolveMatrix detects edges as
          RGB brightness; luminanceToAlpha turns that brightness into an
          alpha mask; the mask then clips a pale-blue flood ("lines"), which
          is merged over a navy flood ("bg") — a plain color-matrix on the
          convolve output can't do this since it can only remap channels,
          not use edge strength to select where the line color appears. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="mer-blueprint">
          <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" result="edges" />
          <feColorMatrix in="edges" type="luminanceToAlpha" result="edgeAlpha" />
          <feComponentTransfer in="edgeAlpha" result="edgeAlphaBoost">
            <feFuncA type="linear" slope="2.4" intercept="0" />
          </feComponentTransfer>
          <feFlood floodColor="#bfe0ff" result="lineColor" />
          <feComposite in="lineColor" in2="edgeAlphaBoost" operator="in" result="lines" />
          <feFlood floodColor="#07182b" result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="lines" />
          </feMerge>
        </filter>
      </svg>

      {/* ---------- Nav ---------- */}
      <nav className="mer-nav">
        <div className="mer-nav__mark">Meridian<br />Architectural<br />Bureau</div>
        <div className="mer-nav__links">
          <a href="#index" className="is-active">Index</a>,
          <a href="#work">Work</a>,
          <a href="#about">About</a>,
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* ---------- SECTION 1: Hero ---------- */}
      <section className="mer-hero" id="index">
        <div className="mer-hero__media">
          <img ref={heroImgRef} className="mer-hero__img" src={IMG('hero')} alt="Minimalist concrete and timber house facade at dusk" />
          <div className="mer-hero__scrim" />
        </div>
        <div className="mer-hero__body">
          <h1 className="mer-hero__title">
            <span className="mer-hero__title-line">Structured Vision,</span>
            <span className="mer-hero__title-line">Honest Form</span>
          </h1>
          <div className="mer-hero__captions">
            {HERO_CAPTIONS.map((c, i) => (
              <p className="mer-hero__caption" key={i}>{c}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 2: Flagship image ---------- */}
      <section className="mer-flagship">
        <img ref={flagshipImgRef} src={IMG('flagship')} alt="Modern architectural form with dramatic angular roofline" />
      </section>

      {/* ---------- SECTION 3: About / Mission ---------- */}
      <section className="mer-section mer-about" id="about">
        <div className="mer-wrap mer-about__grid">
          <div className="mer-about__labels" data-reveal>
            <div className="mer-label-row"><span>Founded</span><strong>2010</strong></div>
            <div className="mer-label-row"><span>Founder</span><strong>Adrian Voss</strong></div>
            <div className="mer-label-row mer-label-row--block">
              <span>Services</span>
              <strong>From architectural vision to final drawings — facades, layouts, sketches, documentation, and immersive visualization.</strong>
            </div>
          </div>
          <div className="mer-about__mission" data-reveal>
            <p>
              An architecture studio built on precision and restraint. We design with a close
              reading of site, program, and light — shaping spaces that feel inevitable, calm,
              and quietly confident. From private residences to civic works, every project is
              considered on its own terms.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 4a: Achievements ---------- */}
      <section className="mer-section mer-achievements">
        <div className="mer-wrap mer-achievements__grid">
          <div>
            <div className="mer-eyebrow" data-reveal>Awards</div>
            <div className="mer-achievements__list" data-stagger-group>
              {AWARDS.map((a) => (
                <div className="mer-achievements__item" key={a.name + a.detail} data-stagger-item>
                  <div className="mer-achievements__name">{a.name}</div>
                  <div className="mer-achievements__detail">{a.detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mer-eyebrow" data-reveal>Publications</div>
            <div className="mer-achievements__list" data-stagger-group>
              {PUBLICATIONS.map((p) => (
                <div className="mer-achievements__item" key={p} data-stagger-item>{p}</div>
              ))}
              <div className="mer-achievements__item mer-achievements__item--note" data-stagger-item>25+ publications in the last year</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 4b: Offices ---------- */}
      <section className="mer-section mer-offices">
        <div className="mer-wrap">
          <div className="mer-eyebrow" data-reveal>Offices</div>
          <div className="mer-offices__table">
            {OFFICES.map((o, i) => (
              <div
                className="mer-offices__row"
                key={o.role + o.city}
                ref={(el) => { officeRowRefs.current[i] = el; }}
              >
                <span className="mer-offices__role">{o.role}</span>
                <span className="mer-offices__city">{o.city}</span>
                <span className="mer-offices__addr">{o.addr}</span>
                <span className="mer-offices__link">&#8599;</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 5: Sketch to System (cursor-driven X-ray lens) ---------- */}
      <section className="mer-sketch">
        <div className="mer-sketch__label">Sketch to System</div>
        <SplitReveal text="Sketch to System" as="h2" className="mer-sketch__heading" trigger="scroll" />
        <p className="mer-sketch__hint" data-reveal>Move your cursor over the photograph</p>
        <div className="mer-sketch__canvas xray-container" data-card-reveal ref={xrayContainerRef}>
          <img className="xray-photo" src={IMG('flagship')} alt="Meridian flagship building — angular roofline and glass facade" />
          <img className="xray-skeleton" ref={xraySkeletonRef} src={IMG('flagship')} alt="" aria-hidden="true" />
          <div className="xray-lens" ref={xrayLensRef} />
        </div>
      </section>

      <section className="mer-section mer-sketch-copy">
        <div className="mer-wrap">
          <SplitReveal text="Early ideas are pressure-tested into precise frameworks — balancing instinct, analysis, and clarity." as="p" className="mer-pullquote" trigger="scroll" />
          <p className="mer-body" data-reveal>
            We start with the fundamentals — sketches, diagrams, first principles. This is where
            we test the logic of a plan, the rhythm of movement through a building, and how
            people actually inhabit space. Every line is a small argument. Through back-and-forth
            between design and delivery, between ambition and feasibility, an idea becomes a
            direction — considered, adaptable, and buildable.
          </p>
        </div>
      </section>

      {/* ---------- SECTION 6: Precision in Practice ---------- */}
      <section className="mer-section mer-precision">
        <div className="mer-wrap mer-precision__grid">
          <div className="mer-precision__media" data-card-reveal>
            <svg viewBox="0 0 600 420" fill="none" className="mer-precision__svg">
              <path d="M60 360 L60 140 L300 60 L540 140 L540 360" stroke="currentColor" strokeWidth="2" />
              <path d="M60 360 L540 360" stroke="currentColor" strokeWidth="2" />
              <path d="M150 360 L150 200 L230 200 L230 360" stroke="currentColor" strokeWidth="1.5" />
              <path d="M370 360 L370 180 L460 180 L460 360" stroke="currentColor" strokeWidth="1.5" />
              <line x1="150" y1="150" x2="230" y2="150" stroke="currentColor" strokeWidth="1" />
              <text x="235" y="150" className="mer-precision__annot">terrace</text>
              <line x1="380" y1="240" x2="450" y2="240" stroke="currentColor" strokeWidth="1" />
              <text x="380" y="230" className="mer-precision__annot">glazing</text>
            </svg>
          </div>
          <div className="mer-precision__text" data-reveal>
            <div className="mer-eyebrow">Precision in Practice</div>
            <p className="mer-body">
              Here the idea earns its architecture. We resolve layout, massing, and facade,
              define the structural logic, and prepare the project for delivery. Through
              drawings, models, and approvals, the concept hardens into a coherent system —
              ready to leave the page.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 7: Selected Projects ---------- */}
      <section className="mer-section mer-projects" id="work">
        <div className="mer-wrap">
          <div className="mer-projects__head" data-reveal>
            <h3 className="mer-section-heading">Selected Projects <sup>(8+)</sup></h3>
          </div>
          <div className="mer-projects__grid">
            {PROJECTS.map((p, i) => (
              <div className={`mer-project ${i % 2 === 1 ? 'mer-project--offset' : ''}`} key={p.slug} data-card-reveal>
                <div
                  className="mer-project__frame"
                  data-preview-url={`/work/${p.slug}`}
                  onMouseEnter={(e) => handleCardEnter(e, p.slug)}
                  onMouseLeave={handleCardLeave}
                >
                  <img data-project-img src={p.img} alt={p.name} />
                  <span className="mer-project__visit">Visit &rarr;</span>
                </div>
                <div className="mer-project__caption">
                  <span>{p.name}</span>
                  <span className="mer-project__area">{p.area}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mer-projects__footer" data-reveal><a href="#work" className="mer-underline-link">See All</a></div>
        </div>
      </section>

      {/* ---------- SECTION 8: Radial diagram + theme transition ---------- */}
      <section className="mer-radial mer-theme-transition">
        <div className="mer-radial__stage">
          <svg ref={spokeGroupRef} className="mer-radial__svg" viewBox="0 0 800 800">
            {PROJECTS.map((p, i) => {
              const angles = [-92, -48, -8, 34, 82, 128, 172, 218];
              const rad = (angles[i] * Math.PI) / 180;
              const x2 = 400 + Math.cos(rad) * 300;
              const y2 = 400 + Math.sin(rad) * 300;
              const lx = 400 + Math.cos(rad) * 340;
              const ly = 400 + Math.sin(rad) * 340;
              return (
                <g key={p.slug}>
                  <path
                    ref={(el) => { spokeRefs.current[i] = el; }}
                    d={`M400 400 L ${x2} ${y2}`}
                    stroke="currentColor" strokeWidth="1"
                  />
                  <text
                    ref={(el) => { spokeLabelRefs.current[i] = el; }}
                    x={lx} y={ly}
                    className="mer-radial__label"
                    textAnchor="middle"
                  >{String(i + 1).padStart(2, '0')}</text>
                </g>
              );
            })}
          </svg>
          <div className="mer-radial__headline">
            <h3 ref={headlineARef} className="mer-radial__line">Refined &amp; Bold Essential</h3>
            <h3 ref={headlineBRef} className="mer-radial__line mer-radial__line--b">Simplicity &amp; Clarity of Approach</h3>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 9: Philosophy / Team culture intro ---------- */}
      <section className="mer-section mer-culture">
        <div className="mer-wrap">
          <div className="mer-eyebrow" data-reveal>People &amp; Process</div>
          <SplitReveal text="A studio shaped by clarity, trust, and a shared pursuit of considered design." as="h3" className="mer-pullquote" trigger="scroll" />
        </div>
      </section>

      {/* ---------- SECTION 9/10: shared photo ring → cascade → stats (pinned via sticky) ---------- */}
      <section className="mer-culture-stats" ref={cultureStageRef}>
        <div className="mer-culture-stats__sticky">
          <div className="mer-culture__ring">
            {CULTURE_PHOTOS.map((src, i) => (
              <div className="mer-culture__photo" key={src} ref={(el) => { photoRefs.current[i] = el; }}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
          <div className="mer-culture__caption" ref={cultureCaptionRef}>
            <div className="mer-culture__year">2011 <span>Year of Foundation</span></div>
            <div className="mer-culture__cols">
              <p>Design grounded in passive strategy, material honesty, and environmental responsibility.</p>
              <p>Lifecycle-minded architecture — efficient systems, durable choices, long-term value.</p>
            </div>
          </div>
          <div className="mer-stats__inner">
            {STATS.map((s, i) => (
              <div className="mer-stats__beat" key={s.label} ref={(el) => { statTextRefs.current[i] = el; }} style={{ opacity: 0 }}>
                <div className="mer-stats__value" data-counter>0{s.suffix}</div>
                <div className="mer-stats__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 11: Clients ---------- */}
      <section className="mer-section mer-clients">
        <div className="mer-wrap">
          <SplitReveal text="Ambitious clients choose to build with us." as="h3" className="mer-section-heading" trigger="scroll" />
          <div className="mer-clients__field">
            {CLIENTS.map((c, i) => (
              <div className="mer-badge" key={c.mark} data-card-reveal style={{ '--r': `${(i % 2 === 0 ? -1 : 1) * (6 + i * 2)}deg` }}>
                <span>{c.mark}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 12: Marquee + Footer ---------- */}
      <section className="mer-marquee">
        <div className="mer-marquee__track" ref={marqueeTrackRef}>
          <span>MERIDIAN&nbsp;</span><span>MERIDIAN&nbsp;</span><span>MERIDIAN&nbsp;</span><span>MERIDIAN&nbsp;</span>
          <span>MERIDIAN&nbsp;</span><span>MERIDIAN&nbsp;</span><span>MERIDIAN&nbsp;</span><span>MERIDIAN&nbsp;</span>
        </div>
      </section>

      <footer className="mer-footer" id="contact">
        <div className="mer-wrap mer-footer__grid" data-reveal>
          <div>
            <div className="mer-footer__label">Contact</div>
            <a href="mailto:studio@meridianbureau.com">studio@meridianbureau.com</a>
            <div>+351 21 400 2200</div>
          </div>
          <div>
            <div className="mer-footer__label">Offices</div>
            <div>Lisbon &middot; Copenhagen &middot; Porto</div>
          </div>
          <div>
            <div className="mer-footer__label">Social</div>
            <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Behance</a>
          </div>
          <div>
            <div className="mer-footer__label">&nbsp;</div>
            <div>&copy; 2026 Meridian Architectural Bureau.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MeridianPage;
