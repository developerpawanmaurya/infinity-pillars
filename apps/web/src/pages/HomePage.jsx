import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LimeRevealSection from '@/components/LimeRevealSection.jsx';
import StackPillarsSection from '@/components/StackPillarsSection.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioIndexSection from '@/components/portfolio-variants/PortfolioIndexSection.jsx';
import { portfolioProjects } from '@/data/portfolioProjects.js';

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

const HomePage = () => {
  const [audienceIdx,    setAudienceIdx]    = useState(0);
  const heroRef         = useRef(null);
  const h1Ref           = useRef(null);
  const audienceWrapRef = useRef(null);
  const cueRef          = useRef(null);
  const cueLineRef      = useRef(null);
  const subtitleRef     = useRef(null);
  const ctaRowRef       = useRef(null);
  const quoteRef        = useRef(null);

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

  const packages = [
    {
      number: '01',
      name: 'The Product Foundation Blueprint',
      description: 'A comprehensive transformation that transitions an idea from a rough business concept into a fully functional digital product.',
      deliverables: [
        'Product Strategy & User Journey Mapping',
        'Interactive UX Design Sprint (HiFi Figma Prototypes)',
        'Core Engineering & Infrastructure',
        'Go-To-Market Automation (WhatsApp API / CRM)',
      ],
      linkText: 'Start Your Foundation',
      link: '/services',
    },
    {
      number: '02',
      name: 'The Scale & Scale-Up Ecosystem',
      description: 'Engineering multi-layered web systems integrated with product intelligence and team-building consulting.',
      deliverables: [
        'Full-Scale Product Architecture & Advanced UX',
        'Advanced Full-Stack Engineering & Data Security',
        'Product Talent Pipeline Strategy',
        'Automated Product Ops (AI Agents & Webhooks)',
      ],
      linkText: 'Build Your Ecosystem',
      link: '/services',
    },
  ];

  const metrics = [
    { metric: '342%', label: 'Average ROI Increase' },
    { metric: '2.8M+', label: 'High-Intent Impressions Generated' },
    { metric: '87%', label: 'Long-Term Client Retention Rate' },
    { metric: '500+', label: 'Data-Driven Campaigns & Architectures Launched' }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Audit',
      description: 'We audit your current digital footprint, analyze competitor gaps, and map a data-backed strategy tailored to your revenue goals.'
    },
    {
      step: '02',
      title: 'UX/UI Interactive Design',
      description: 'We prototype your complete user journey in high-fidelity Figma — designed around conversion psychology, not aesthetic preference.'
    },
    {
      step: '03',
      title: 'Full-Stack System Engineering',
      description: 'We build and deploy your high-speed web engine, API integrations, and automation flows — tested before any go-live.'
    },
    {
      step: '04',
      title: 'Growth Optimization Retainer',
      description: 'Post-launch, we continuously audit performance, tune AI prompts, and optimize every layer to compound your returns.'
    },
    {
      step: '05',
      title: 'Growth Operations & Talent Consulting',
      description: 'We help you build the internal team and operational systems to sustain growth beyond our engagement.'
    }
  ];

  // Just a teaser of the first 3 — the full 8-project set lives on /portfolio,
  // reached via the "View Performance Archive" button below.
  const showcaseProjects = portfolioProjects.slice(0, 3);

  const trustPoints = [
    'Conversion-Focused Design',
    'Google Business Authority',
    '24/7 AI Lead Engagement',
    'Built for Measurable ROI',
    'Data-Driven Strategy',
    'Performance-First Engineering',
    'Scalable Digital Infrastructure',
    'Transparent Reporting'
  ];

  return (
    <>
      <Helmet>
        <title>Infinity Pillars - Digital Infrastructure That Captures, Qualifies, and Closes Leads</title>
        <meta name="description" content="We engineer high-conversion websites, establish undisputed Google Business authority, and deploy autonomous B2B AI agents that engage leads 24/7." />
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
                // Floor dropped from 3.2rem to 2.5rem — 3.2rem was wider than
                // the JS resting scale below could shrink for on narrow
                // phones during the brief window before that JS runs (the
                // scale correction is applied in a useEffect, so it always
                // lands a frame after first paint), so the heading visibly
                // overshot the screen for a beat on load. 2.5rem keeps that
                // first paint already phone-sized.
                fontSize: 'clamp(2.5rem, 10.5vw, 8.125rem)',
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
                We engineer high-conversion websites, establish undisputed Google Business authority, and deploy autonomous B2B AI agents that engage leads 24/7. No vanity metrics. No fluff. Just digital assets that work to scale your revenue.
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

        {/* Trust Banner Marquee */}
        <section className="py-10 border-t border-border bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/60 mb-6 text-center">
              Built on a Foundation of Performance
            </p>
            <div className="flex gap-8 fade-left-edge">
              <div className="flex shrink-0 animate-scroll gap-8 items-center justify-between min-w-full">
                {trustPoints.map((point, idx) => (
                  <span key={`trust-1-${idx}`} className="flex items-center gap-8 shrink-0">
                    <span className="text-lg md:text-xl font-bold tracking-widest uppercase text-muted-foreground/60 whitespace-nowrap">
                      {point}
                    </span>
                    <span className="text-muted-foreground/30" aria-hidden="true">/</span>
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 animate-scroll gap-8 items-center justify-between min-w-full" aria-hidden="true">
                {trustPoints.map((point, idx) => (
                  <span key={`trust-2-${idx}`} className="flex items-center gap-8 shrink-0">
                    <span className="text-lg md:text-xl font-bold tracking-widest uppercase text-muted-foreground/60 whitespace-nowrap">
                      {point}
                    </span>
                    <span className="text-muted-foreground/30" aria-hidden="true">/</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Metrics Bar */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {metrics.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <div className="text-5xl md:text-6xl font-bold tracking-tighter mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {item.metric}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Offerings Section */}
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Core Offerings</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Two focused packages, engineered for where you are right now — and where you need to be next.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="border border-border p-10 flex flex-col gap-8 hover:border-[#AFEA00] transition-colors duration-300"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold tracking-widest text-[#AFEA00]">{pkg.number}</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{pkg.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
                </div>
                <ul className="space-y-3 border-t border-border pt-8">
                  {pkg.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="text-[#AFEA00] mt-0.5 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={pkg.link}
                  className="mt-auto inline-flex items-center gap-2 font-medium uppercase tracking-widest text-sm hover:gap-4 transition-all duration-300"
                >
                  {pkg.linkText} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium uppercase tracking-widest transition-colors duration-300"
            >
              View A-La-Carte & Intelligence Layer <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        {/* Success Blueprints Preview */}
        <section className="py-32 bg-muted/20 overflow-hidden border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-8"
            >
              <div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Success Blueprints</h2>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Real evidence of engineered systems driving measurable customer growth.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 px-8 py-6 text-base"
              >
                <Link to="/portfolio">
                  View Performance Archive
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <PortfolioIndexSection projects={showcaseProjects} />
        </section>

        {/* Lime Reveal — "Why Us" */}
        <LimeRevealSection className="pt-[120px] sm:pt-[160px] md:pt-[200px] pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7">
                <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: '#111' }}>
                  Why Us
                </p>
                <h2
                  className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-10"
                  style={{ color: '#111' }}
                >
                  Most web shops<br />build pages.<br />
                  <span style={{ color: '#111', opacity: 0.5 }}>We architect digital assets.</span>
                </h2>
              </div>
              <div className="lg:col-span-5 flex flex-col gap-10 lg:pt-16">
                {[
                  {
                    title: 'Product-Led, Not Trend-Led',
                    body: 'We build around your business model and revenue logic — not whatever design trend is popular this quarter.'
                  },
                  {
                    title: 'Systems, Not Campaigns',
                    body: 'Campaigns stop the moment budgets run dry. Our infrastructure compounds — earning attention, trust, and revenue long after launch.'
                  },
                  {
                    title: 'Measurable from Day One',
                    body: 'Every deliverable is tied to a metric. If it cannot be measured, we do not build it.'
                  },
                ].map((anchor) => (
                  <div key={anchor.title} className="border-t-2 pt-6" style={{ borderColor: '#111' }}>
                    <div className="text-base font-bold tracking-tight mb-2" style={{ color: '#111' }}>
                      {anchor.title}
                    </div>
                    <div className="text-sm leading-relaxed" style={{ color: '#333' }}>
                      {anchor.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LimeRevealSection>

        {/* Testimonial Highlight */}
        <section className="py-40 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-primary mb-12">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-30"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
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

        {/* The Playbook - Process Section */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">The Playbook: Our Work Philosophy</h2>
              <p className="text-xl text-background/70 max-w-2xl">
                A systematic, zero-guesswork approach designed to build digital assets that scale.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-t border-background/20 pt-8"
                >
                  <div className="text-sm font-bold tracking-widest text-background/50 mb-6">{item.step}</div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{item.title}</h3>
                  <p className="text-background/70 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 md:py-40 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Stop wasting capital on generic developments which don't understand your business roadmap.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Let's build your digital infrastructure.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial inline-flex"
            >
              <Link to="#booking">Book Audit Call</Link>
            </Button>
          </motion.div>
        </section>

        <StackPillarsSection />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
