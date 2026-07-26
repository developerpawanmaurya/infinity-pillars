import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitReveal from '../components/SplitReveal';
import RoomTour3D from '../components/RoomTour3D';
import HouseXray from '../components/HouseXray';
import { withRoomCopy, APARTMENT_MODEL_URL } from '../data/apartmentTourStops';
import './MeridianCopy.css';

gsap.registerPlugin(ScrollTrigger);

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const IMG = (n) => `/images/meridian/${n}.jpg`;

const HERO_KICKER = 'Meridian — Studio Nº 004';

const HERO_TITLE = ['Weight, Made', 'Weightless'];

const HERO_CAPTIONS = [
  'Sustainability strategy, material efficiency, passive systems, and energy modelling — built in, not bolted on.',
  'Concept through construction set: facades, plans, sketches, and the documentation that gets a building built.',
];

const RADIAL_LINES = ['Precision Isn’t Cold.', 'It’s How We Keep Things Honest.'];

const MARQUEE_ITEMS = Array.from({ length: 8 }, (_, i) => (i % 2 === 0 ? 'MERIDIAN' : 'BUILT TO LAST')).map((t) => `${t} ✦ `);

const PROJECTS = [
  { slug: 'ashcombe-ridge-house', name: 'Ashcombe Ridge House', area: '611 m²', img: IMG('proj-01') },
  { slug: 'foundry-yard-residences', name: 'Foundry Yard Residences', area: '8,200 m²', img: IMG('proj-04') },
  { slug: 'aster-mansion', name: 'Aster Mansion', area: '991 m²', img: IMG('proj-06') },
  { slug: 'birch-corner-house', name: 'Birch Corner House', area: '435 m²', img: IMG('proj-07') },
];

const PRINCIPLES = [
  { index: 'Nº 01', text: 'Draw it twice before you trust it.' },
  { index: 'Nº 02', text: 'If it can’t survive one sentence, it isn’t resolved.' },
  { index: 'Nº 03', text: 'The site speaks first. We just listen, then draw.' },
  { index: 'Nº 04', text: 'A house should still make sense at 2am with the lights off.' },
];

const CLIENTS = [
  { mark: 'VN', name: 'Verrant' }, { mark: 'ORLA', name: 'Orla Group' },
  { mark: 'HTK', name: 'Hartek' }, { mark: 'BW', name: 'Bridwell' },
  { mark: 'NU', name: 'Numen' }, { mark: 'C&C', name: 'Cast & Co' },
  { mark: 'GP', name: 'Greyport' }, { mark: 'AT', name: 'Atlier' },
];

const CULTURE_PHOTOS = Array.from({ length: 8 }, (_, i) => IMG(`culture-${String(i + 1).padStart(2, '0')}`));

const TOUR_ROOMS = withRoomCopy([
  { tag: 'Floor Plan', title: 'Ashcombe Ridge House',
    body: '611 m² cut into the hillside. Every room chases daylight; every line still does structural work.' },
  { tag: '01 — Living Room', title: 'The Living Room',
    body: 'Open enough to gather a crowd, still enough to sit alone in — oak underfoot, the ridge held in a low line of glass.' },
  { tag: '02 — Kitchen', title: 'The Kitchen',
    body: 'One counter runs the whole wall, uninterrupted — built for a quiet Tuesday or twelve people, no difference in the plan.' },
  { tag: '03 — Hallway', title: 'The Hallway',
    body: "The plan's spine — one straight run of herringbone oak that every room answers to." },
  { tag: '04 — Bedroom', title: 'The Bedroom',
    body: 'The volume drops here, deliberately. Filtered light, soft textiles, a bed aimed straight at the morning sun.' },
  { tag: '05 — Bathroom', title: 'The Bathroom',
    body: 'Small footprint, no compromises — stone surfaces, warm light, storage that disappears until you need it.' },
]);

const GENESIS = {
  year: '2011',
  label: 'Year One',
  lead: 'Started in a rented room with two desks and one rule: nothing gets drawn that we can’t defend in a room full of engineers.',
  sub: 'Fifteen years and roughly five hundred projects later, the rule hasn’t changed — we’ve just gotten better at drawing things worth defending.',
};

const MeridianCopyPage = () => {
  const rootRef = useRef(null);
  const heroImgRef = useRef(null);
  const flagshipImgRef = useRef(null);
  const tooltipRef = useRef(null);

  const preloaderRef = useRef(null);
  const preloaderBlockRefs = useRef([]);
  const preloaderLabelRef = useRef(null);

  // Projects Wipe Refs
  const projectsWipeRef = useRef(null);
  const projectsWipePinRef = useRef(null);
  const projectLayerRefs = useRef([]);
  const cutEdgeRef = useRef(null);
  const flashRef = useRef(null);

  const spokeRefs = useRef([]);
  const spokeLabelRefs = useRef([]);
  const radialCharRefs = useRef([]);
  const badgeRefs = useRef([]);
  const ctaLinkRef = useRef(null);
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

    const domCleanups = [];
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.1, paused: true });
      heroTl
        .fromTo('.merc-hero__title-line span', { yPercent: 120, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'power4.out', stagger: 0.08 }, 0.2)
        .fromTo('.merc-hero__kicker', { opacity: 0, letterSpacing: '0.5em' }, { opacity: 1, letterSpacing: '0.28em', duration: 0.9, ease: 'power2.out' }, 0.1)
        .fromTo('.merc-hero__caption', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.9);

      // Building-blocks preloader — a small skyline grows in column by
      // column, holds, then collapses as the whole overlay lifts away.
      // The hero reveal stays paused until this finishes so it isn't
      // wasted playing out underneath the preloader.
      const blocks = preloaderBlockRefs.current;
      gsap.timeline({ onComplete: () => heroTl.play() })
        .to(blocks, { scaleY: 1, duration: 0.7, ease: 'power3.out', stagger: 0.09 })
        .to(preloaderLabelRef.current, { opacity: 1, duration: 0.4 }, '-=0.35')
        .to({}, { duration: 0.3 })
        .to(preloaderLabelRef.current, { opacity: 0, duration: 0.25 })
        .to(blocks, { scaleY: 0, duration: 0.4, ease: 'power3.in', stagger: 0.04 }, '<')
        .to(preloaderRef.current, { yPercent: -100, duration: 0.7, ease: 'power4.inOut' }, '-=0.1')
        .set(preloaderRef.current, { pointerEvents: 'none' });

      gsap.to(heroImgRef.current, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: '.merc-hero', start: 'top top', end: 'bottom top', scrub: true },
      });

      gsap.fromTo(flagshipImgRef.current,
        { scale: 1.08, yPercent: -6 },
        { scale: 1.0, yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: '.merc-flagship', start: 'top bottom', end: 'bottom top', scrub: true } });

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const isNearPageEnd = !!el.closest('.merc-footer');
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

      // ---------- Projects Wipe Animation ----------
      if (projectsWipeRef.current && projectsWipePinRef.current) {
        let pinRect = { w: projectsWipePinRef.current.clientWidth, h: projectsWipePinRef.current.clientHeight };
        const refreshRect = () => { pinRect = { w: projectsWipePinRef.current.clientWidth, h: projectsWipePinRef.current.clientHeight }; };
        refreshRect();

        const numProjects = PROJECTS.length;
        const totalTransitions = numProjects - 1;

        ScrollTrigger.create({
          trigger: projectsWipeRef.current,
          start: 'top top',
          end: `+=${totalTransitions * 150}%`,
          pin: projectsWipePinRef.current,
          scrub: 0.2,
          invalidateOnRefresh: true,
          onRefresh: refreshRect,
          onUpdate: (self) => {
            const p = self.progress;
            const segmentProgress = p * totalTransitions;
            const currentIndex = Math.min(Math.floor(segmentProgress), totalTransitions - 1);
            const localP = segmentProgress - currentIndex;
            
            projectLayerRefs.current.forEach((layer, i) => {
              if (!layer) return;
              
              if (i < currentIndex) {
                // Layer already fully wiped away
                layer.style.clipPath = 'polygon(0px 0px, 0px 0px, 0px 0px, 0px 0px)';
                layer.style.visibility = 'hidden';
              } else if (i > currentIndex) {
                // Layer waiting to be revealed (currently covered by current layer)
                layer.style.clipPath = 'none';
                layer.style.visibility = 'visible';
              } else {
                // Layer currently wiping
                layer.style.visibility = 'visible';
                const easedT = smoothstep(0, 1, localP);
                const w = pinRect.w;
                const h = pinRect.h;
                
                const slant = w * 0.22;
                // Move from left to right across the screen
                const topX = -0.15 * w + easedT * 1.3 * w;
                const botX = topX - slant;
                
                // The polygon keeps the right side visible, and the left side is cut away
                layer.style.clipPath = `polygon(${topX}px 0px, ${w + 40}px 0px, ${w + 40}px ${h}px, ${botX}px ${h}px)`;
                
                // Update cut edge and flash
                if (cutEdgeRef.current && flashRef.current) {
                  const edgeVisible = easedT > 0.001 && easedT < 0.999;
                  const midX = (topX + botX) / 2;
                  const midY = h / 2;
                  const angleDeg = (Math.atan2(h, botX - topX) * 180) / Math.PI - 90;
                  const edgeLen = Math.hypot(h, botX - topX);
                  
                  let burst = 0;
                  if (easedT <= 0.5) burst = smoothstep(0, 0.5, easedT);
                  else burst = 1 - smoothstep(0.5, 1, easedT);
                  
                  cutEdgeRef.current.style.opacity = edgeVisible ? String(Math.min(1, burst * 1.4 + 0.55)) : '0';
                  cutEdgeRef.current.style.height = `${edgeLen}px`;
                  cutEdgeRef.current.style.transform = `translate(${midX}px, ${midY}px) rotate(${angleDeg}deg) translate(-50%, -50%)`;
                  
                  flashRef.current.style.opacity = edgeVisible ? String(burst * 0.5) : '0';
                }
              }
            });
          }
        });
        
        window.addEventListener('resize', refreshRect);
      }

      // ---------- Radial Diagram ----------
      spokeRefs.current.forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut', delay: i * 0.06,
          scrollTrigger: { trigger: '.merc-radial', start: 'top 70%', toggleActions: 'play none none reverse' },
          onComplete: () => spokeLabelRefs.current[i]?.classList.add('is-visible'),
          onReverseComplete: () => spokeLabelRefs.current[i]?.classList.remove('is-visible'),
        });
      });

      gsap.to(spokeGroupRef.current, {
        rotate: 18, transformOrigin: '50% 50%', ease: 'none',
        scrollTrigger: { trigger: '.merc-radial', start: 'top top', end: 'bottom bottom', scrub: 1 },
      });

      // ---------- Scramble-decode reveal for the radial headline ----------
      const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&+=';
      const scrambleTargets = radialCharRefs.current.filter(Boolean);
      scrambleTargets.forEach((el) => { el.dataset.final = el.textContent; });
      ScrollTrigger.create({
        trigger: '.merc-radial',
        start: 'top 65%',
        once: true,
        onEnter: () => {
          scrambleTargets.forEach((el, i) => {
            const final = el.dataset.final;
            if (final === ' ') return;
            const obj = { p: 0 };
            gsap.to(obj, {
              p: 1,
              duration: 0.9,
              delay: i * 0.035,
              ease: 'power1.out',
              onUpdate: () => {
                if (obj.p > 0.85) { el.textContent = final; return; }
                el.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
              },
              onComplete: () => { el.textContent = final; },
            });
          });
        },
      });

      gsap.timeline({
        scrollTrigger: { trigger: '.merc-radial', start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
        .to(headlineARef.current, { opacity: 0, duration: 0.3 }, 0.35)
        .fromTo(headlineBRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.45);

      const themeVars = { bg: '#FAFAF8', fg: '#121210' };
      gsap.to(themeVars, {
        bg: '#0B0B0A', fg: '#F5F4F0',
        scrollTrigger: { trigger: '.merc-theme-transition', start: 'top center', end: 'bottom center', scrub: 1 },
        onUpdate: () => {
          if (!rootRef.current) return;
          rootRef.current.style.setProperty('--merc-bg', themeVars.bg);
          rootRef.current.style.setProperty('--merc-fg', themeVars.fg);
        },
      });

      // ---------- Culture Stats ----------
      const n = photoRefs.current.length;
      const radius = window.innerWidth < 900 ? 230 : 460;
      const ringScale = 1.875 * 0.75;
      const startPositions = [];
      photoRefs.current.forEach((el, i) => {
        startPositions.push({ x: gsap.utils.random(-600, 600), y: gsap.utils.random(-360, 360), rotate: gsap.utils.random(-30, 30) });
        if (el) gsap.set(el, { x: startPositions[i].x, y: startPositions[i].y, rotate: startPositions[i].rotate, opacity: 0 });
      });

      let currentBeat = -1;
      ScrollTrigger.create({
        trigger: cultureStageRef.current, start: 'top top', end: 'bottom bottom', scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          // Phase 1: Ring forming (0 to 0.1)
          const ringT = gsap.utils.clamp(0, 1, p / 0.1);
          
          // Phase 2 & 3: Revolving and tracing path to left (0.1 to 1.0)
          const revolveP = gsap.utils.clamp(0, 1, (p - 0.1) / 0.9);
          const scrollAngle = revolveP * Math.PI * 6; // 3 total revolutions
          
          const pathStartAngle = Math.PI * 1.2; // Angle at which translation starts
          const pathEndAngle = Math.PI * 3.2;   // Angle at which translation ends (1 revolution later)
          
          const leftCenterX = -window.innerWidth / 2; // Center on left edge for half-circle

          photoRefs.current.forEach((el, i) => {
            if (!el) return;
            const start = startPositions[i];
            
            // Base angle for this image
            const initialAngle = (i / n) * Math.PI * 2 - Math.PI / 2;
            const currentAngle = initialAngle + scrollAngle;
            
            // Calculate center position for this specific image based on ITS current angle
            let currentCenterX = 0;
            if (currentAngle > pathStartAngle && currentAngle < pathEndAngle) {
              const translateProgress = (currentAngle - pathStartAngle) / (pathEndAngle - pathStartAngle);
              const eased = gsap.parseEase('power2.inOut')(translateProgress);
              currentCenterX = gsap.utils.interpolate(0, leftCenterX, eased);
            } else if (currentAngle >= pathEndAngle) {
              currentCenterX = leftCenterX;
            }
            
            // Target ring position for this image
            const targetX = currentCenterX + Math.cos(currentAngle) * radius;
            const targetY = Math.sin(currentAngle) * radius;
            
            // Interpolate from random start to target ring position based on ringT
            const x = gsap.utils.interpolate(start.x, targetX, ringT);
            const y = gsap.utils.interpolate(start.y, targetY, ringT);
            const opacity = ringT;
            const scale = gsap.utils.interpolate(1, ringScale, ringT);
            
            gsap.set(el, { x, y, opacity, scale, rotate: start.rotate * (1 - ringT) });
          });

          // Text overlay fades out before translation starts (0 to 0.12)
          gsap.set(cultureCaptionRef.current, { opacity: ringT * (1 - gsap.utils.clamp(0, 1, (p - 0.1) / 0.05)) });

          // Principles pop in one at a time as images reach the left side (0.45 to 0.9)
          const notesP = gsap.utils.clamp(0, 1, (p - 0.45) / 0.45);
          if (notesP <= 0) {
            if (currentBeat !== -1) {
              currentBeat = -1;
              statTextRefs.current.forEach((el) => el && gsap.set(el, { opacity: 0 }));
            }
          } else {
            const beat = Math.min(3, Math.floor(notesP * 4));
            if (beat !== currentBeat) {
              currentBeat = beat;
              statTextRefs.current.forEach((el, i) => {
                if (!el) return;
                if (i === beat) {
                  gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
                } else {
                  gsap.to(el, { opacity: 0, y: -20, duration: 0.3, overwrite: true });
                }
              });
            }
          }
        },
      });

      const marqueeTween = marqueeTrackRef.current
        ? gsap.to(marqueeTrackRef.current, { xPercent: -50, ease: 'none', duration: 24, repeat: -1 })
        : null;
      if (marqueeTween && marqueeTrackRef.current) {
        const marqueeSection = marqueeTrackRef.current.closest('.merc-marquee');
        const onEnter = () => gsap.to(marqueeTween, { timeScale: 0.15, duration: 0.6 });
        const onLeaveMarquee = () => gsap.to(marqueeTween, { timeScale: 1, duration: 0.6 });
        marqueeSection?.addEventListener('mouseenter', onEnter);
        marqueeSection?.addEventListener('mouseleave', onLeaveMarquee);
        domCleanups.push(() => {
          marqueeSection?.removeEventListener('mouseenter', onEnter);
          marqueeSection?.removeEventListener('mouseleave', onLeaveMarquee);
        });
      }

      // ---------- Magnetic hover: client badges + CTA link ----------
      const magneticEls = [...badgeRefs.current.filter(Boolean), ...(ctaLinkRef.current ? [ctaLinkRef.current] : [])];
      magneticEls.forEach((el) => {
        const strength = el === ctaLinkRef.current ? 0.25 : 0.4;
        const onMove = (e) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * strength;
          const y = (e.clientY - rect.top - rect.height / 2) * strength;
          gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' });
        };
        const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        el.addEventListener('mousemove', onMove);
        el.addEventListener('mouseleave', onLeave);
        domCleanups.push(() => {
          el.removeEventListener('mousemove', onMove);
          el.removeEventListener('mouseleave', onLeave);
        });
      });
    }, rootRef);

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
      domCleanups.forEach((fn) => fn());
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div className="merc-page" ref={rootRef}>
      <Helmet>
        <title>Meridian Architectural Bureau — Structured Vision, Honest Form</title>
        <meta
          name="description"
          content="Meridian Architectural Bureau: precision architecture, interiors, and master planning across Portugal and Denmark."
        />
      </Helmet>

      <div className="merc-preloader" ref={preloaderRef} aria-hidden="true">
        <div className="merc-preloader__blocks">
          {[45, 70, 100, 60, 85].map((h, i) => (
            <span
              key={i}
              className="merc-preloader__block"
              style={{ height: `${h}%` }}
              ref={(el) => { preloaderBlockRefs.current[i] = el; }}
            />
          ))}
        </div>
        <div className="merc-preloader__label" ref={preloaderLabelRef}>Meridian</div>
      </div>

      <div className="merc-cursor-tooltip" ref={tooltipRef} />

      {/* ---------- SECTION 1: Hero ---------- */}
      <section className="merc-hero" id="index">
        <div className="merc-hero__media">
          <img ref={heroImgRef} className="merc-hero__img" src={IMG('hero')} alt="Minimalist concrete and timber house facade at dusk" />
          <div className="merc-hero__scrim" />
        </div>
        <div className="merc-hero__body">
          <div className="merc-hero__kicker">{HERO_KICKER}</div>
          <h1 className="merc-hero__title">
            {HERO_TITLE.map((line, i) => (
              <span className="merc-hero__title-line" key={i}><span>{line}</span></span>
            ))}
          </h1>
          <div className="merc-hero__captions">
            {HERO_CAPTIONS.map((c, i) => (
              <p className="merc-hero__caption" key={i}>{c}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 2: Flagship image ---------- */}
      <section className="merc-flagship">
        <img ref={flagshipImgRef} src={IMG('flagship')} alt="Modern architectural form with dramatic angular roofline" />
      </section>

      {/* ---------- SECTION 3: About / Mission ---------- */}
      <section className="merc-section merc-about" id="about">
        <div className="merc-wrap merc-about__grid">
          <div className="merc-about__labels" data-reveal>
            <div className="merc-label-row"><span>Founded</span><strong>2010</strong></div>
            <div className="merc-label-row"><span>Founder</span><strong>Adrian Voss</strong></div>
            <div className="merc-label-row merc-label-row--block">
              <span>Services</span>
              <strong>Vision to construction set — facades, layouts, sketches, documentation, and the walkthroughs that let a client stand inside a building before it exists.</strong>
            </div>
          </div>
          <div className="merc-about__mission" data-reveal>
            <p>
              We work backward from how a building will actually be lived in — the angle of
              morning light in a kitchen, the weight of a door, the quiet between rooms.
              Precision isn't decoration here; it's the discipline that lets a house feel
              inevitable instead of designed. Private residence or civic hall, we start from
              the site and let the architecture follow.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 5: Inside Ashcombe Ridge House (3D room tour) ---------- */}
      <section className="merc-section merc-tour-intro">
        <div className="merc-wrap">
          <div className="merc-eyebrow" data-reveal>Realized Work</div>
          <SplitReveal text="Inside Ashcombe Ridge House" as="h2" className="merc-section-heading" trigger="scroll" />
          <p className="merc-body" data-reveal>
            Scroll and you're inside — no floor plan required. Move room to room the way a
            resident actually would: living room, kitchen, bedroom, bath.
          </p>
        </div>
      </section>
      <RoomTour3D rooms={TOUR_ROOMS} modelUrl={APARTMENT_MODEL_URL} className="merc-tour" />

      <section className="merc-section merc-sketch-copy">
        <div className="merc-wrap">
          <SplitReveal text="An idea survives first contact with a tape measure, or it doesn't." as="p" className="merc-pullquote" trigger="scroll" />
          <p className="merc-body" data-reveal>
            Every project starts on paper, not a screen — diagrams, section sketches, first
            principles. This is where we test the logic of a plan and the rhythm of moving
            through it: where the light falls at 4pm, where a hallway earns the right to be
            a room. Every line drawn here is an argument that has to survive the next one.
            Sketch by sketch, an idea stops being ambitious and starts being buildable.
          </p>
        </div>
      </section>

      {/* ---------- SECTION 6: Precision in Practice ---------- */}
      <section className="merc-section merc-precision">
        <div className="merc-wrap merc-precision__grid">
          <div className="merc-precision__media" data-card-reveal>
            <HouseXray
              photoSrc="/images/meridian-xray/villa-front.jpg"
              photoAlt="Meridian villa front elevation"
            />
            <span className="merc-scribble merc-scribble--precision" aria-hidden="true">no wasted line</span>
          </div>
          <div className="merc-precision__text" data-reveal>
            <div className="merc-precision__index">02</div>
            <div className="merc-eyebrow">Precision in Practice</div>
            <p className="merc-body">
              This is where the sketch has to answer for itself. Layout, massing, facade,
              structural logic — each gets resolved against the others until nothing is
              arbitrary. What leaves this stage isn't a concept anymore. It's a set of
              drawings a contractor can build from without calling us twice.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 7: Projects Wipe (NEW) ---------- */}
      <section className="merc-projects-wipe" ref={projectsWipeRef}>
        <div className="merc-projects-wipe__pin" ref={projectsWipePinRef}>
          {PROJECTS.map((p, i) => (
            <div 
              className="merc-projects-wipe__layer" 
              key={p.slug} 
              ref={(el) => { projectLayerRefs.current[i] = el; }}
              style={{ zIndex: PROJECTS.length - i }}
            >
              <div className="merc-projects-wipe__img-wrap">
                <img src={p.img} alt={p.name} />
                <div className="merc-projects-wipe__scrim" />
              </div>
              <div className="merc-projects-wipe__content">
                <h3 className="merc-projects-wipe__title">{p.name}</h3>
                <div className="merc-projects-wipe__area">{p.area}</div>
              </div>
            </div>
          ))}
          <div className="merc-projects-wipe__cut-edge" ref={cutEdgeRef} aria-hidden="true" />
          <div className="merc-projects-wipe__flash" ref={flashRef} aria-hidden="true" />
        </div>
      </section>

      {/* ---------- SECTION 8: Radial diagram + theme transition ---------- */}
      <section className="merc-radial merc-theme-transition">
        <div className="merc-radial__stage">
          <svg ref={spokeGroupRef} className="merc-radial__svg" viewBox="0 0 800 800">
            {[-92, -48, -8, 34, 82, 128, 172, 218].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x2 = 400 + Math.cos(rad) * 300;
              const y2 = 400 + Math.sin(rad) * 300;
              const lx = 400 + Math.cos(rad) * 340;
              const ly = 400 + Math.sin(rad) * 340;
              return (
                <g key={`spoke-${i}`}>
                  <path
                    ref={(el) => { spokeRefs.current[i] = el; }}
                    d={`M400 400 L ${x2} ${y2}`}
                    stroke="currentColor" strokeWidth="1"
                  />
                  <text
                    ref={(el) => { spokeLabelRefs.current[i] = el; }}
                    x={lx} y={ly}
                    className="merc-radial__label"
                    textAnchor="middle"
                  >{String(i + 1).padStart(2, '0')}</text>
                </g>
              );
            })}
          </svg>
          <div className="merc-radial__headline">
            <h3 ref={headlineARef} className="merc-radial__line">
              {RADIAL_LINES[0].split('').map((ch, i) => (
                <span className="merc-radial__char" key={i} ref={(el) => { radialCharRefs.current[i] = el; }}>{ch === ' ' ? ' ' : ch}</span>
              ))}
            </h3>
            <h3 ref={headlineBRef} className="merc-radial__line merc-radial__line--b">{RADIAL_LINES[1]}</h3>
          </div>
        </div>
      </section>

      {/* ---------- SECTION 9: Philosophy / Team culture intro ---------- */}
      <section className="merc-section merc-culture">
        <div className="merc-wrap">
          <div className="merc-eyebrow" data-reveal>People &amp; Process</div>
          <SplitReveal text="Fifteen years in, we still argue about door handles. That's the whole culture." as="h3" className="merc-pullquote" trigger="scroll" />
        </div>
      </section>

      {/* ---------- SECTION 9/10: shared photo ring → cascade → stats ---------- */}
      <section className="merc-culture-stats" ref={cultureStageRef}>
        <div className="merc-culture-stats__sticky">
          <div className="merc-culture__ring">
            {CULTURE_PHOTOS.map((src, i) => (
              <div className="merc-culture__photo" key={src} ref={(el) => { photoRefs.current[i] = el; }}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
          <div className="merc-culture__caption" ref={cultureCaptionRef}>
            <div className="merc-culture__card">
              <div className="merc-culture__year">
                {GENESIS.year}
                <span>{GENESIS.label}</span>
              </div>
              <div className="merc-culture__cols">
                <p className="merc-culture__lead">{GENESIS.lead}</p>
                <p className="merc-culture__sub">{GENESIS.sub}</p>
              </div>
            </div>
          </div>
          <div className="merc-stats__inner">
            {PRINCIPLES.map((pr, i) => (
              <div className="merc-stats__beat" key={pr.index} ref={(el) => { statTextRefs.current[i] = el; }} style={{ opacity: 0 }}>
                <div className="merc-stats__index">{pr.index}</div>
                <div className="merc-stats__note">{pr.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 11: Clients ---------- */}
      <section className="merc-section merc-clients">
        <div className="merc-wrap">
          <SplitReveal text="The clients who push back the hardest build the best buildings." as="h3" className="merc-section-heading" trigger="scroll" />
          <div className="merc-clients__field">
            {CLIENTS.map((c, i) => (
              <div
                className="merc-badge"
                key={c.mark}
                data-card-reveal
                ref={(el) => { badgeRefs.current[i] = el; }}
                style={{ '--r': `${(i % 2 === 0 ? -1 : 1) * (6 + i * 2)}deg` }}
                title={c.name}
              >
                <span>{c.mark}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SECTION 11.5: Closing CTA ---------- */}
      <section className="merc-section merc-cta" id="cta">
        <div className="merc-wrap merc-cta__wrap">
          <div className="merc-eyebrow" data-reveal>Start a Project</div>
          <SplitReveal text="Tell us what site you're stuck with." as="h2" className="merc-cta__headline" trigger="scroll" />
          <p className="merc-body merc-cta__sub" data-reveal>
            We answer every inquiry within two working days. Bring drawings if you have them —
            bring a napkin sketch if that's all there is.
          </p>
          <a href="mailto:studio@meridianbureau.com" className="merc-cta__link" data-reveal ref={ctaLinkRef}>
            <span>studio@meridianbureau.com</span>
            <svg className="merc-cta__arrow" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 19L19 5M19 5H8M19 5V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* ---------- SECTION 12: Marquee + Footer ---------- */}
      <section className="merc-marquee">
        <div className="merc-marquee__track" ref={marqueeTrackRef}>
          {MARQUEE_ITEMS.map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </div>
      </section>

      <footer className="merc-footer" id="contact">
        <div className="merc-wrap merc-footer__grid" data-reveal>
          <div>
            <div className="merc-footer__label">Contact</div>
            <a href="mailto:studio@meridianbureau.com">studio@meridianbureau.com</a>
            <div>+351 21 400 2200</div>
          </div>
          <div>
            <div className="merc-footer__label">Offices</div>
            <div>Lisbon &middot; Copenhagen &middot; Porto</div>
          </div>
          <div>
            <div className="merc-footer__label">Social</div>
            <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
            <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Behance</a>
          </div>
          <div>
            <div className="merc-footer__label">&nbsp;</div>
            <div>&copy; 2026 Meridian Architectural Bureau.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MeridianCopyPage;
