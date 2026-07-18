import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LimeRevealSection from '@/components/LimeRevealSection.jsx';
import ShootingGameSection from '@/components/ShootingGameSection.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Rotating hero audience labels ───────────────────────────────────────────
const AUDIENCES = [
  { label: 'E-commerce Brands.' },
  { label: 'Local Businesses.'  },
  { label: 'Startups.'          },
];

// ─── Shapes tied to each Core Offering — revealed on hover ───────────────────
// 01 Web Architecture → ⬡ hexagon (structured grid/web)
// 02 GMB Local        → ◎ concentric circles (location target)
// 03 AI Agents        → △ triangle (autonomous forward motion)
const SERVICE_SYMBOLS = ['⬡', '◎', '△'];

// ─── Particle constants ───────────────────────────────────────────────────────
const SHAPE_POOL = 260;   // particles for symbol shape in narrow left column
const BG_POOL    = 200;   // floating background particles
const REPEL_R    = 80;
const SAMPLE_GAP = 3;

// ─── Sample a symbol into a point cloud ──────────────────────────────────────
// yCenterFraction: 0–1, where vertically to centre the symbol (default 0.5)
function sampleSymbol(symbol, cw, ch, yCenterFraction = 0.50) {
  const oc  = document.createElement('canvas');
  oc.width  = cw;
  oc.height = ch;
  const ctx  = oc.getContext('2d');

  // Use 75% of the canvas width so symbols are bold and clearly legible
  const fontSize = cw * 0.75;

  ctx.font         = `900 ${fontSize}px Georgia, 'Times New Roman', serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = '#fff';
  ctx.fillText(symbol, cw * 0.50, ch * yCenterFraction);

  const { data } = ctx.getImageData(0, 0, cw, ch);
  const pts = [];
  for (let y = 0; y < ch; y += SAMPLE_GAP) {
    for (let x = 0; x < cw; x += SAMPLE_GAP) {
      if (data[(y * cw + x) * 4 + 3] > 100) pts.push({ x, y });
    }
  }
  // Fisher-Yates shuffle for even particle distribution
  for (let i = pts.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return pts;
}

// ─── Particle class ───────────────────────────────────────────────────────────
class Particle {
  constructor(w, h, isShapeSlot, color) {
    this.w         = w;
    this.h         = h;
    this.isShape   = isShapeSlot;
    this.color     = color;
    this.x         = Math.random() * w;
    this.y         = Math.random() * h;
    this.vx        = (Math.random() - 0.5) * 0.2;
    this.vy        = (Math.random() - 0.5) * 0.2;
    this.wx        = Math.random() * w;
    this.wy        = Math.random() * h;
    this.tx        = null;
    this.ty        = null;
    this.active    = false;
    this.lime      = 0;
    // Higher base alpha so floating particles are actually visible
    this.baseAlpha = isShapeSlot ? 0.22 : (0.08 + Math.random() * 0.22);
    this.curAlpha  = this.baseAlpha;
    this.size      = isShapeSlot ? (0.8 + Math.random() * 1.2) : (0.3 + Math.random() * 0.8);
  }

  assignTarget(x, y) {
    this.tx     = x;
    this.ty     = y;
    this.active = true;
  }

  releaseTarget() {
    this.tx     = null;
    this.ty     = null;
    this.active = false;
    this.wx     = Math.random() * this.w;
    this.wy     = Math.random() * this.h;
  }

  update(mouse, scrollBoost) {
    // ── Attraction to target or wander ───────────
    if (this.active) {
      this.vx += (this.tx - this.x) * 0.10;
      this.vy += (this.ty - this.y) * 0.10;
    } else {
      if (Math.random() < 0.003) {
        this.wx = Math.random() * this.w;
        this.wy = Math.random() * this.h;
      }
      this.vx += (this.wx - this.x) * 0.0006;
      this.vy += (this.wy - this.y) * 0.0006;
    }

    // ── Mouse repulsion ───────────────────────────
    if (mouse) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < REPEL_R * REPEL_R && d2 > 0.1) {
        const d = Math.sqrt(d2);
        const f = ((REPEL_R - d) / REPEL_R) * 3.0;
        this.vx += (dx / d) * f;
        this.vy += (dy / d) * f;
      }
    }

    // ── Scroll burst ──────────────────────────────
    if (scrollBoost > 0.1) {
      this.vx += (Math.random() - 0.5) * scrollBoost;
      this.vy += (Math.random() - 0.5) * scrollBoost;
    }

    // ── Friction & integrate ──────────────────────
    const damp = this.active ? 0.80 : 0.97;
    this.vx   *= damp;
    this.vy   *= damp;
    this.x    += this.vx;
    this.y    += this.vy;

    // ── Boundary wrap ─────────────────────────────
    if (this.x < -15)          this.x = this.w + 15;
    else if (this.x > this.w + 15) this.x = -15;
    if (this.y < -15)          this.y = this.h + 15;
    else if (this.y > this.h + 15) this.y = -15;

    // ── Lerp colour dark→lime and alpha ───────────
    const lt = this.active ? 1 : 0;
    this.lime    += (lt - this.lime) * 0.055;
    const at      = this.active ? 0.92 : this.baseAlpha;
    this.curAlpha += (at - this.curAlpha) * 0.055;
  }

  draw(ctx) {
    if (this.curAlpha < 0.01) return;
    // All particles share one color; alpha alone distinguishes idle vs shape-forming
    ctx.globalAlpha = this.curAlpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// ─── ParticleCanvas ───────────────────────────────────────────────────────────
// Particles float idly. When hoveredService (0|1|2) is set, they form that
// service's shape symbol. When null, all particles wander freely.
function ParticleCanvas({ hoveredService, color = '#AFEA00' }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({ particles: [], mouse: null, scrollBoost: 0, lastY: 0, lastT: 0 });
  const rafRef    = useRef(null);
  const readyRef  = useRef(false);

  // Init once — no initial shape, particles just float
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || readyRef.current) return;
    readyRef.current = true;

    const setSize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stateRef.current.particles.forEach(p => { p.w = canvas.width; p.h = canvas.height; });
    };
    setSize();

    stateRef.current.particles = [
      ...Array.from({ length: SHAPE_POOL }, () => new Particle(canvas.width, canvas.height, true, color)),
      ...Array.from({ length: BG_POOL    }, () => new Particle(canvas.width, canvas.height, false, color)),
    ];

    // Mouse tracking — canvas-relative
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { stateRef.current.mouse = null; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', setSize);

    const ctx = canvas.getContext('2d');
    const tick = () => {
      const { particles, mouse, scrollBoost } = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) { p.update(mouse, 0); p.draw(ctx); }
      ctx.globalAlpha = 1;
      rafRef.current  = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Morph on service hover — release → scatter → reform into symbol
  useEffect(() => {
    const canvas = canvasRef.current;
    const state  = stateRef.current;
    if (!canvas || !state.particles.length) return;

    const pool = state.particles.filter(p => p.isShape);
    pool.forEach(p => p.releaseTarget());  // always scatter first

    if (hoveredService === null) return;

    const timer = setTimeout(() => {
      const symbol = SERVICE_SYMBOLS[hoveredService];
      // 0.72 centres the shape 72% down the canvas ≈ 200px lower than centred
      const pts    = sampleSymbol(symbol, canvas.width, canvas.height, 0.72);
      const n      = Math.min(pool.length, pts.length);
      for (let i = 0; i < n; i++) pool[i].assignTarget(pts[i].x, pts[i].y);
    }, 160);

    return () => clearTimeout(timer);
  }, [hoveredService]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'block' }}
    />
  );
}

// Computes the hero heading's animation geometry from ACTUAL measured text
// width — never a guess — so it can't overflow on any device or audience
// label. Two things this depends on getting right:
//
// 1. Font timing: the site loads "DM Sans" async (index.css @import,
//    display=swap). If this runs before the font finishes loading, the
//    canvas falls back to a different (usually narrower) system font,
//    UNDER-estimating the real text width — exactly what let "E-commerce
//    Brands." clip on mobile. Callers MUST await document.fonts.ready first.
// 2. Every rotating audience label, not just whichever is showing right
//    now — the label rotates every 2.8s independent of when this runs, so
//    measuring only the current one would work by luck, not by construction.
//
// Returns bigScale/restScale (clamped by maxDesiredScale / 1 respectively,
// never exceeding what actually fits) and centerX — the px translate that
// puts the (left-anchored) heading's visual center in the middle of its
// container, used for the "big" state before it settles left-aligned.
function getHeroLayout(h1El, maxDesiredScale) {
  // clientWidth includes the parent's OWN left/right padding (px-4 etc.) —
  // h1 renders inside that padding, not overlapping it, so subtract it to
  // get the room actually available for the heading.
  const parentEl        = h1El.parentElement;
  const parentCs        = getComputedStyle(parentEl);
  const horizontalPad   = (parseFloat(parentCs.paddingLeft) || 0) + (parseFloat(parentCs.paddingRight) || 0);
  const containerWidth  = parentEl.clientWidth - horizontalPad;

  // Measure the REAL laid-out width of the heading, not a canvas estimate.
  // A previous version measured text via canvas.measureText, which
  // overestimated the real DOM width by ~20% (verified in-browser). offset/
  // scrollWidth are layout metrics: unaffected by the CSS transform, and
  // scrollWidth still reports full content width even if maxWidth:100% clips.
  const textWidth = Math.max(h1El.offsetWidth, h1El.scrollWidth);

  // Two different width budgets, because the START and RESTING states answer
  // to different edges:
  //  • START fills toward the VIEWPORT's right edge — at the "perfect" 1.0217
  //    the heading intentionally bleeds a little past the max-w-7xl content
  //    box; the only hard rule is it must not leave the viewport. left edge
  //    is stable under transform-origin: left top, so getBoundingClientRect
  //    gives its true x regardless of the current scale placeholder.
  //  • RESTING settles back to fit the content container cleanly.
  const h1Left       = h1El.getBoundingClientRect().left;
  const viewportRoom = window.innerWidth - h1Left - 8; // 8px breathing room off the screen edge

  return {
    // START (before scroll): the user's "perfect size" (1.0217), capped so
    // it can never push the heading out of the viewport on narrower screens.
    bigScale:  Math.min(1.0217, viewportRoom / textWidth),
    // RESTING (after scroll): fits the content container, never upscaled >1.
    restScale: Math.min(1, (containerWidth / textWidth) * 0.98),
  };
}

// Testimonial quote, split into words up front so the JSX below just maps
// over it — each word becomes its own <span> that the scroll-reveal effect
// (see quoteRef) fades/sharpens into view one at a time, in reading order.
const TESTIMONIAL_WORDS = '"Infinity Pillars did not just hand us a website and walk away. They rebuilt our entire customer intake pipeline. Within six months, our local Google Map inquiries surged, our AI agent qualified and booked over 200 leads without staff manual hours, and our client acquisition costs plummeted by 42%."'.split(' ');

// ─── Main page ────────────────────────────────────────────────────────────────
const HomeExperiment = () => {
  const [audienceIdx,    setAudienceIdx]    = useState(0);
  const [hoveredService, setHoveredService] = useState(null);
  const heroRef         = useRef(null);
  const h1Ref           = useRef(null);
  const audienceWrapRef = useRef(null);
  const cueRef          = useRef(null);
  const quoteRef        = useRef(null);
  const cueLineRef      = useRef(null);
  const subtitleRef     = useRef(null);
  const ctaRowRef       = useRef(null);

  // Rotate audiences
  useEffect(() => {
    const iv = setInterval(() => setAudienceIdx(i => (i + 1) % AUDIENCES.length), 2800);
    return () => clearInterval(iv);
  }, []);

  // GSAP: the heading rests BIG and CENTERED before any scroll (visible as
  // soon as the preloader lifts — no separate autoplay animation for it),
  // then scroll drives ONE continuous tween down to its real size, settling
  // left-aligned exactly where it sits at rest. Everything — heading, scale,
  // horizontal position, subtitle, CTA row, site header — lives in a single
  // scroll-scrubbed timeline; nothing else is allowed to touch h1's
  // transform. (A previous version had a separate autoplay tween AND a
  // scroll-scrubbed tween both fighting over h1's `scale`: GSAP applies a
  // scrubbed tween's "from" state immediately on creation, which was
  // silently overwriting the autoplay animation before it could play — the
  // reported "scroll effect isn't working" symptom. One tween, one owner.)
  //
  // getHeroLayout's text measurement must run after the page's webfont has
  // actually loaded (see its comment) — measuring against a fallback font
  // is what let long audience labels like "E-commerce Brands." clip on
  // mobile, so this whole effect waits on document.fonts.ready first.
  useEffect(() => {
    if (!heroRef.current) return;

    let cancelled = false;
    let ctx;

    const setup = () => {
      if (cancelled || !heroRef.current) return;

      ctx = gsap.context(() => {
        const headerEl        = document.querySelector('header');
        const reducedMotion    = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // Below Tailwind's md breakpoint: no big+centered intro, no
        // scroll-tied scale-and-slide — the heading just sits at its real
        // size and position the whole time, per request.
        const isMobile          = window.matchMedia('(max-width: 767px)').matches;

        const { bigScale, restScale } = getHeroLayout(h1Ref.current);

        // 'left top' keeps the heading's LEFT edge pinned at the container's
        // left (aligned with the paragraph below) no matter the scale — so
        // there's never a gap on the heading's left, and no x offset needed.
        gsap.set(h1Ref.current, { transformOrigin: 'left top', x: 0 });

        if (reducedMotion || isMobile) {
          gsap.set(h1Ref.current, { scale: restScale });
        } else {
          // Resting-before-scroll state: the "perfect size" start scale.
          // Static (not animated) — nothing to autoplay, so nothing to
          // fight the scroll-scrubbed tween below for ownership of scale.
          gsap.set(h1Ref.current, { scale: bigScale });
        }

        if (reducedMotion) {
          gsap.set([subtitleRef.current, ctaRowRef.current], { opacity: 1, y: 0, clipPath: 'none' });
          gsap.set(cueRef.current, { display: 'none' });
          return;
        }

        // The header's Tailwind `transition-all` fights GSAP's per-frame
        // scrub transforms; disable it for this page (ctx.revert restores
        // on unmount)
        if (headerEl) gsap.set(headerEl, { transition: 'none' });

        // ── Pinned, scroll-scrubbed reveal ───────────────────────────────
        // Scrubbing backwards reverses everything. Initial hidden states
        // live in inline CSS on the JSX so React Strict Mode remounts
        // can't flash content.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=650',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            // This pin's 650px spacer pushes every section below it down by
            // 650px. Without a high refreshPriority, ScrollTrigger computes
            // the downstream triggers (the "Why Us" lime square, the
            // testimonial word-reveal) BEFORE this pin's spacer is applied
            // during a refresh — so their start/end land 650px too early,
            // i.e. they fire while still off-screen and finish before the
            // user ever sees them (verified in-browser: the lime trigger's
            // start was exactly 650px low). A higher refreshPriority forces
            // this pin to be measured first on every refresh, so everything
            // below it accounts for the spacer.
            refreshPriority: 10,
            onUpdate(self) {
              // Progress cue: lime line fills with scroll, cue fades near the end
              if (cueLineRef.current) cueLineRef.current.style.transform = `scaleX(${self.progress})`;
              if (cueRef.current) {
                cueRef.current.style.opacity = String(Math.max(0, 1 - Math.max(0, (self.progress - 0.72) / 0.22)));
              }
            },
          },
        });

        // Heading: shrinks from the "perfect size" start scale to its
        // resting scale as the user scrolls, left edge fixed throughout
        // (transform-origin: left top). Skipped on mobile — the heading was
        // already set to its resting scale above.
        if (!isMobile) {
          tl.fromTo(h1Ref.current,
            { scale: bigScale },
            { scale: restScale, duration: 0.6, ease: 'power2.inOut' },
            0
          );
        }
        tl.fromTo(subtitleRef.current,
            { y: 30, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
            { y: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.out' },
            0.15
          )
          .fromTo(ctaRowRef.current,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
            0.4
          );

        // Site header slides down + fades in as the finale
        if (headerEl) {
          tl.fromTo(headerEl,
            { yPercent: -100, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
            0.35
          );
        }

        // Pinning inserts a spacer element that changes the document's
        // total scroll height — any ScrollTrigger created BEFORE this one
        // (e.g. the testimonial word-reveal effect below, which mounts
        // independently and isn't gated behind document.fonts.ready) had
        // already measured its start/end against the pre-spacer layout, so
        // its positions were stale the moment this pin was added. A
        // SYNCHRONOUS refresh() here (i.e. in the same tick the pin was
        // just created) was the wrong fix — it recalculates every trigger
        // on the page, including this pin's own, before the browser has
        // actually laid out the new spacer, which corrupted everything's
        // measurements at once (that's what broke the heading, the "Why
        // Us" square, AND the testimonial simultaneously). Deferring one
        // frame lets the spacer's layout settle first, so the refresh
        // recalculates against real, final measurements instead of a
        // half-updated DOM.
        requestAnimationFrame(() => ScrollTrigger.refresh());

      }, heroRef);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setup);
    } else {
      setup();
    }

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  // GSAP: testimonial words sharpen into view one at a time as the section
  // scrolls through the viewport — reading order (left→right, line by line)
  // falls out for free since stagger just walks the words in DOM order,
  // which is the order they're written in. Scrubbed (not autoplay) so the
  // reveal pace follows scroll speed directly, like someone reading along.
  useEffect(() => {
    if (!quoteRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = quoteRef.current.querySelectorAll('.reveal-word');

    if (reducedMotion) {
      gsap.set(words, { opacity: 1, y: 0, filter: 'blur(0px)' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.03,
        ease: 'none',
        scrollTrigger: {
          trigger: quoteRef.current,
          start: 'top 85%',
          end: 'bottom 55%',
          scrub: 0.6,
        },
      });
    }, quoteRef);

    return () => ctx.revert();
  }, []);

  // ── Data (same as HomePage) ───────────────────────────────────────────────
  const services = [
    { number: '01', title: 'Conversion-First Web Architecture & UX', description: "We design and build ultra-fast, responsive web platforms custom-built around your user's psychology. We turn passive visitors into immediate phone calls, form submissions, and booked calendar appointments.", linkText: 'Build Your Core Asset', link: '/services' },
    { number: '02', title: 'Google Local Map Dominance & GMB SEO', description: 'When target buyers search for your services, we make sure you are the undisputed, highly rated choice in the top 3 Google Map spots. We turn search intent into physical foot traffic and inbound inquiries.', linkText: 'Capture Local Market Share', link: '/services' },
    { number: '03', title: 'Autonomous B2B AI Agents & Automation', description: 'Form fills are too slow. We deploy custom-trained AI interfaces onto your website that act as continuous, round-the-clock sales reps—answering deep technical questions, qualifying high-value leads, and auto-booking sales calls.', linkText: 'Automate Your Lead Nurture', link: '/services' },
  ];
  const metrics = [
    { metric: '3.4x', label: 'Average Inbound Pipeline Growth' },
    { metric: '84%',  label: 'Reduction in Manual Lead Filtering' },
    { metric: '#1',   label: 'Google Business Ranking in 90 Days' },
    { metric: '500+', label: 'Automated Digital Assets Deployed' },
  ];
  const process = [
    { step: '01', title: 'The Discovery & Audit Phase',    description: 'We audit your local visibility, analyze competitor weaknesses, and map out a strict data-backed pipeline strategy tailored for revenue expansion.' },
    { step: '02', title: 'The UI/UX & Integration Sprint', description: "We build interactive Figma prototypes of your user's journey, configure GMB architectures, and train your custom AI agent on your exact business documentation." },
    { step: '03', title: 'Launch & Pipeline Calibration',  description: 'We deploy your high-speed web engine, sync API pathways to your WhatsApp Business app/CRM, and set up tracking to measure real pipeline value.' },
    { step: '04', title: 'Growth Optimization Retainer',   description: 'We continuously audit search algorithms, optimize your local Google Map rankings, and tune AI prompts to maximize lead-to-close conversions.' },
  ];
  const showcaseProjects = [
    { title: 'Web Conversion Overhaul', category: 'Web Architecture', image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712', rotation: '-rotate-3', margin: 'mt-0' },
    { title: 'GMB Local Dominance',     category: 'Local SEO',        image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712', rotation: 'rotate-2',  margin: 'mt-16 md:mt-32' },
    { title: 'AI Lead Automation',      category: 'AI Agents',         image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712', rotation: '-rotate-1', margin: 'mt-16' },
  ];
  const localBusinesses = ['The Daily Brew Coffee', 'Riverside Bakery', 'Pinch of Spice', 'Urban Tech Solutions', 'Green Leaf Landscaping', 'Coastal Fitness Studio', 'Artisan Woodworks', 'Bloom & Petals Florist', 'Swift Delivery Co'];

  return (
    <>
      <Helmet>
        <title>Infinity Pillars — Experiment</title>
        <meta name="description" content="Hero experiment with particle canvas and GSAP scroll effects." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Header />

        {/* ── Hero section ──────────────────────────────────────────────────── */}
        {/* Inverted palette scoped to just this section: overriding the CSS
            custom properties here (not editing every child) means every
            hsl(var(--foreground))/bg-background/text-muted-foreground/border-border
            usage below inherits black-bg/white-text automatically. */}
        <section
          ref={heroRef}
          className="relative overflow-hidden"
          style={{
            minHeight: '100svh',
            paddingTop: '10rem',
            paddingBottom: '8rem',
            backgroundColor: '#000',
            color: '#fff',
            '--background': '0 0% 0%',
            '--foreground': '0 0% 100%',
            '--muted-foreground': '0 0% 65%',
            '--border': '0 0% 20%',
          }}
        >
          {/* Ambient particle field — idle float, no hover-morph (hoveredService: null) */}
          <ParticleCanvas hoveredService={null} color="#AFEA00" />

          {/* Text content */}
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

            {/* Headline — rests big and centered before any scroll, then one
                continuous scroll-scrubbed tween shrinks it to its real size
                and slides it to its left-aligned resting position (see the
                GSAP effect for why scale+x live in a single tween). bigScale/
                restScale/centerX are all measured from actual text width
                (getHeroLayout) so this can never paint past the right edge —
                and shrinks below 1x on narrow phones instead of clipping.
                width:fit-content is what lets "center top" anchor on the
                text's own visual center rather than the full container.
                1.15/center placeholders below are just pre-JS fallbacks —
                GSAP overrides them with the real computed values once
                mounted. "Digital Infrastructure" and "for {audience}" each
                stay on their own single line (whiteSpace: nowrap). */}
            <h1
              ref={h1Ref}
              style={{
                // 10.5vw reaches 8.125rem (130px) right around a 1240px
                // viewport (10.5% of 1240px ≈ 130px), so screens wider than
                // that plateau at exactly 130px instead of the old 115.2px.
                fontSize: 'clamp(3.2rem, 10.5vw, 8.125rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 0.92,
                marginBottom: '0.1em',
                width: 'fit-content',
                maxWidth: '100%',
                transformOrigin: 'left top',
                transform: 'scale(1.0217)',
                willChange: 'transform',
              }}
            >
              <div style={{ width: 'fit-content', maxWidth: '100%', whiteSpace: 'nowrap' }}>
                Digital Infrastructure
              </div>

              {/* Line 2 */}
              <div style={{ width: 'fit-content', maxWidth: '100%', marginTop: '0.05em', whiteSpace: 'nowrap' }}>
                for{' '}
                <span
                  ref={audienceWrapRef}
                  style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    verticalAlign: 'bottom',
                    minWidth: 'min(20ch, 60vw)',
                    maxWidth: '100%',
                    position: 'relative',
                  }}
                >
                  <motion.span
                    key={audienceIdx}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%',   opacity: 1 }}
                    exit={{ y: '-110%',   opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'inline-block', color: 'hsl(var(--muted-foreground))', fontStyle: 'italic', fontWeight: 500 }}
                  >
                    {AUDIENCES[audienceIdx].label}
                  </motion.span>
                </span>
              </div>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              style={{
                fontSize: 'clamp(1.1rem, 2.2vw, 1.5rem)',
                fontWeight: 500,
                letterSpacing: '-0.01em',
                color: 'hsl(var(--foreground)/0.78)',
                marginTop: '2.2rem',
                marginBottom: '3.5rem',
                maxWidth: '44rem',
                lineHeight: 1.35,
                opacity: 0,
                transform: 'translateY(40px)',
              }}
            >
              We Build the Digital Infrastructure That Captures, Qualifies, and Closes Your Next Lead.
            </p>

            {/* CTA row */}
            <div ref={ctaRowRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border pt-12" style={{ opacity: 0, transform: 'translateY(24px)' }}>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                We engineer high-conversion websites, establish undisputed Google Business authority, and deploy autonomous B2B AI agents that engage leads 24/7.
              </p>
              <div className="flex flex-col items-start md:items-end justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-lg rounded-none px-10 py-8 shadow-editorial"
                >
                  <Link to="#booking">Book Audit Call</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll cue — lime line fills with scrub progress, fades at the end.
            Rendered as a sibling AFTER (not inside) the pinned hero section:
            GSAP's ScrollTrigger pin sets the section itself to position:fixed
            with computed inline top/left/width/height, and nesting another
            position:fixed element inside that pinned subtree was not painting
            reliably. Living outside it, position:fixed here reliably anchors
            to the viewport. Colors are hardcoded (not hsl(var(--foreground)))
            since this cue sits outside the hero's inverted (black-bg/white-
            text) color scope but still visually overlaps the hero while pinned. */}
        <div
          ref={cueRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            bottom: '2.2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.6rem',
            zIndex: 60,
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
            Scroll to explore
          </span>
          <div style={{ width: 120, height: 2, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
            <div
              ref={cueLineRef}
              style={{
                width: '100%',
                height: '100%',
                background: '#AFEA00',
                transform: 'scaleX(0)',
                transformOrigin: 'left center',
              }}
            />
          </div>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5" style={{ color: '#AFEA00' }} />
          </motion.div>
        </div>

        {/* ── Trust Banner ─────────────────────────────────────────────────── */}
        <section className="py-10 border-t border-border bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/60 mb-6 text-center">
              Trusted by Industry Leaders
            </p>
            <div className="flex gap-8 fade-left-edge">
              {[0, 1].map(dup => (
                <div key={dup} className="flex shrink-0 animate-scroll gap-8 items-center justify-between min-w-full" aria-hidden={dup === 1}>
                  {localBusinesses.map((logo, idx) => (
                    <span key={idx} className="text-lg md:text-xl font-bold tracking-widest uppercase text-muted-foreground/60 whitespace-nowrap">{logo}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Core Metrics ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {metrics.map((item, index) => (
                <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="flex flex-col">
                  <div className="text-5xl md:text-6xl font-bold tracking-tighter mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>{item.metric}</div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Core Offerings ───────────────────────────────────────────────── */}
        <section className="py-32 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:items-stretch">

              {/* Left column: heading + floating particle canvas below */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-4 flex flex-col"
              >
                <div className="sticky top-32">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Core Offerings</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Static websites and simple ad campaigns no longer work in 2026. We deploy integrated systems engineered to work together as a seamless sales team.
                  </p>
                </div>
                {/* Canvas below heading — shapes appear on service hover */}
                <div
                  className="relative mt-8 hidden lg:block"
                  style={{ flex: 1, minHeight: 480 }}
                >
                  <ParticleCanvas hoveredService={hoveredService} />
                </div>
              </motion.div>

              {/* Right column: service items with hover triggers */}
              <div className="lg:col-span-8 flex flex-col gap-0">
                {services.map((service, index) => (
                  <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredService(index)}
                    onMouseLeave={() => setHoveredService(null)}
                    className="group flex flex-col md:flex-row gap-8 items-start border-t border-border pt-12 pb-12 cursor-default transition-colors duration-200 hover:bg-muted/10 px-4 -mx-4 rounded-sm"
                  >
                    <div className="text-2xl text-[#AFEA00] font-medium">{service.number}</div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-muted-foreground transition-colors duration-300">{service.title}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">{service.description}</p>
                      <Link to={service.link} className="inline-flex items-center gap-2 font-medium uppercase tracking-widest text-sm hover:gap-4 transition-all duration-300">{service.linkText} <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── Success Blueprints ───────────────────────────────────────────── */}
        <section className="py-32 bg-muted/20 overflow-hidden border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Success Blueprints</h2>
                <p className="text-xl text-muted-foreground max-w-xl">Real evidence of engineered systems driving measurable customer growth.</p>
              </div>
              <Button asChild variant="outline" className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 px-8 py-6 text-base">
                <Link to="/portfolio">View Performance Archive <ArrowUpRight className="w-5 h-5 ml-2" /></Link>
              </Button>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {showcaseProjects.map((project, index) => (
                <motion.div key={project.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: index * 0.2 }} className={project.margin}>
                  <Link to="/portfolio" className="block group">
                    <div className={`transition-all duration-500 transform ${project.rotation} group-hover:rotate-0 group-hover:-translate-y-4`}>
                      <div className="editorial-frame">
                        <img src={project.image} alt={project.title} className="w-full h-[400px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
                      </div>
                    </div>
                    <div className="mt-8 text-center md:text-left">
                      <div className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-3">{project.category}</div>
                      <h3 className="text-2xl font-bold tracking-tighter">{project.title}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lime Reveal ──────────────────────────────────────────────────── */}
        <LimeRevealSection className="pt-[120px] sm:pt-[160px] md:pt-[200px] pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7">
                <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: '#111' }}>Our Philosophy</p>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-10" style={{ color: '#111' }}>
                  Not marketing.<br />
                  <span style={{ color: '#111', opacity: 0.55 }}>Infrastructure.</span>
                </h2>
                <p className="text-xl md:text-2xl leading-relaxed max-w-xl" style={{ color: '#222' }}>
                  Campaigns pause when budgets run dry. Infrastructure compounds — earning leads, authority, and revenue around the clock without manual input.
                </p>
              </div>
              <div className="lg:col-span-4 lg:col-start-9 flex flex-col gap-10">
                {[{ value: '24/7', label: 'AI-powered lead qualification' }, { value: '90d', label: 'To Google Map top 3' }, { value: '0', label: 'Vanity metrics. Results only.' }].map(item => (
                  <div key={item.label} className="border-t-2 pt-6" style={{ borderColor: '#111' }}>
                    <div className="text-4xl md:text-5xl font-bold tracking-tighter mb-2" style={{ color: '#111' }}>{item.value}</div>
                    <div className="text-sm font-medium uppercase tracking-widest" style={{ color: '#333' }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LimeRevealSection>

        {/* ── Testimonial ──────────────────────────────────────────────────── */}
        <section className="py-40 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="text-primary mb-12">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-30"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
            </div>
            <blockquote ref={quoteRef} className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-12">
              {TESTIMONIAL_WORDS.map((word, i) => (
                <span
                  key={i}
                  className="reveal-word"
                  style={{
                    display: 'inline-block',
                    marginRight: '0.28em',
                    opacity: 0.12,
                    transform: 'translateY(10px)',
                    filter: 'blur(3px)',
                  }}
                >
                  {word}
                </span>
              ))}
            </blockquote>
            <div>
              <div className="font-bold uppercase tracking-widest mb-1">Verified Partner</div>
              <div className="text-muted-foreground text-sm">Infinity Pillars Client</div>
            </div>
          </motion.div>
        </section>

        {/* ── Process Playbook ─────────────────────────────────────────────── */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">The Playbook: Our Work Philosophy</h2>
              <p className="text-xl text-background/70 max-w-2xl">A systematic, zero-guesswork approach designed to build digital assets that scale.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              {process.map((item, index) => (
                <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} className="border-t border-background/20 pt-8">
                  <div className="text-sm font-bold tracking-widest text-[#AFEA00] mb-6">{item.step}</div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{item.title}</h3>
                  <p className="text-background/70 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────────────── */}
        <section className="py-40 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Let's Build Your Digital Infrastructure That Converts.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Tell us where your client acquisition is stalling. We'll skip the generic sales pitch and present a custom engineering roadmap to scale your brand.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial inline-flex">
              <Link to="#booking">Book Audit Call</Link>
            </Button>
          </motion.div>
        </section>

        <ShootingGameSection />
        <Footer />
      </div>
    </>
  );
};

export default HomeExperiment;
