import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ArrowUpRight, ChevronRight, Sparkles, Building2 } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import './MeridianCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const CHALLENGES = [
  { t: 'Architecture Sells Itself, If You Let It', d: 'The temptation with a portfolio like this is to over-design around the work. The real challenge was getting out of the way of the photography.' },
  { t: 'Multi-Studio, One Voice', d: 'Three studios across two countries needed to read as a single, coherent practice — not three disconnected local offices sharing a logo.' },
  { t: 'Culture Without Clutter', d: 'Firms this precise often bury their actual design philosophy in a wall of text. It needed to read in a scroll, not a manifesto.' },
];

const STUDIOS = [
  { name: 'Lisbon', role: 'Headquarters', img: '/images/meridian/proj-01.jpg' },
  { name: 'Porto', role: 'Studio', img: '/images/meridian/proj-03.jpg' },
  { name: 'Copenhagen', role: 'Studio', img: '/images/meridian/proj-05.jpg' },
];

const OUTCOMES = [
  { feature: 'Hero Structure', legacy: 'Text-heavy intro before any work is shown', design: 'Flagship project as the hero, copy second', value: 'The work makes the first argument, not the copy' },
  { feature: 'Studio Presence', legacy: 'Locations listed as a footer afterthought', design: 'Studio rows with hover-preview imagery', value: 'Three cities read as one deliberate footprint' },
  { feature: 'Design Philosophy', legacy: 'Long-form manifesto page', design: 'Short culture beats paced through scroll', value: 'Philosophy is felt in seconds, not read in minutes' },
  { feature: 'Scope', legacy: '—', design: 'Full site: hero, projects, culture, studios', value: 'One coherent practice across two countries' },
];

const MeridianCaseStudy = () => {
  const pageRef = useRef(null);
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 300, damping: 30, mass: 0.5 });
  const springY = useSpring(mvY, { stiffness: 300, damping: 30, mass: 0.5 });

  const handleMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mvX.set(e.clientX - rect.left);
    mvY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-mer-cs-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
      gsap.utils.toArray('[data-mer-cs-stagger]').forEach((group) => {
        gsap.fromTo(group.children, { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });
    }, pageRef);

    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="mer-cs-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Meridian — Case Study | Infinity Pillars</title>
        <meta name="description" content="A portfolio site for a fictional architecture bureau spanning Lisbon, Porto, and Copenhagen: an independent build by Infinity Pillars." />
      </Helmet>

      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-24 md:pt-52 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-14">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Success Blueprints
          </Link>
          <a
            href="/meridian"
            target="_blank"
            rel="noopener noreferrer"
            className="mer-cs-visit-btn group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 transition-all duration-300"
          >
            Visit live site
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] mb-8" style={{ color: 'hsl(var(--mer-cs-accent))' }}>
          <Building2 className="w-3.5 h-3.5" />
          Infinity Pillars Labs — Independent Product
        </div>

        <SplitReveal
          text="Precision architecture, presented with the same restraint it's designed with."
          as="h1"
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-5xl"
        />

        <p className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
          Meridian is a portfolio site we built for a fictional architecture bureau spanning Lisbon, Porto, and Copenhagen — precision residential and cultural work that doesn't need decoration to make its case.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-3xl">
          {[
            { k: '3 studios', v: 'Lisbon, Porto, Copenhagen' },
            { k: 'Flagship-first', v: 'Project gallery structure' },
            { k: 'Cursor-tooltip', v: 'Interaction system' },
            { k: 'In-house', v: 'Concept through code' },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-xl md:text-2xl font-bold tracking-tighter">{s.k}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Challenge ────────────────────────────────────────────────── */}
      <section className="py-28 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-mer-cs-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mer-cs-accent))' }}>The Product Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">A portfolio precise enough to match the work.</h2>
          </div>
          <div data-mer-cs-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHALLENGES.map((c) => (
              <div key={c.t} className="mer-cs-card p-8">
                <h3 className="text-xl font-bold tracking-tight mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Flagship-First Hero ──────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-mer-cs-reveal className="order-2 lg:order-1">
            <div className="editorial-frame overflow-hidden bg-muted">
              <img
                src="/images/portfolio/meridian.jpg"
                alt="Meridian architecture portfolio preview"
                className="w-full aspect-[16/10] object-contain"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mer-cs-accent))' }}>Solution 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">A flagship-first structure.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              The hero opens directly on the flagship project, full-bleed, before a single line of positioning copy — the work argues the firm's case before the firm does.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Everything below is paced the same way: a project stream, then culture beats, then the studios — each section earning the next.
            </p>
          </div>
        </div>
      </section>

      {/* ── Interactive: Studio Rows ─────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-mer-cs-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mer-cs-accent))' }}>Solution 02</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Three studios, one hover.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              On the live site, hovering a studio name floats a live preview near the cursor — the same technique, live, right here. Try it.
            </p>
          </div>

          <div ref={containerRef} onMouseMove={handleMove} className="relative">
            <AnimatePresence>
              {hovered !== null && (
                <motion.div
                  key={STUDIOS[hovered].name}
                  aria-hidden="true"
                  className="hidden md:block absolute z-30 pointer-events-none w-[280px] aspect-[16/10] rounded-xl overflow-hidden shadow-2xl bg-muted"
                  style={{ left: springX, top: springY, x: '-30%', y: '-120%' }}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img src={STUDIOS[hovered].img} alt="" className="w-full h-full object-contain" />
                </motion.div>
              )}
            </AnimatePresence>

            {STUDIOS.map((s, i) => (
              <div
                key={s.name}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="mer-cs-studio-row flex items-center justify-between py-6 cursor-default"
              >
                <span className="text-3xl md:text-5xl font-bold tracking-tighter">{s.name}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual Identity ──────────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-mer-cs-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mer-cs-accent))' }}>Solution 03</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Materials, not colors.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              A paper-white canvas and a single slate accent, chosen the way a material sample is chosen — for how it ages, not how it pops.
            </p>
          </div>
          <div data-mer-cs-stagger className="flex flex-wrap gap-6">
            {[
              { color: 'hsl(var(--background))', label: 'Paper-white canvas' },
              { color: 'hsl(var(--mer-cs-accent))', label: 'Slate accent' },
              { color: 'hsl(var(--foreground))', label: 'Ink text' },
              { color: 'hsl(var(--border))', label: 'Hairline dividers' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full shrink-0 border border-border" style={{ backgroundColor: c.color }} />
                <span className="text-sm text-muted-foreground">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes ─────────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-mer-cs-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mer-cs-accent))' }}>What Shipped</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Legacy approach vs. Meridian.</h2>
          </div>
          <div data-mer-cs-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OUTCOMES.map((row) => (
              <div key={row.feature} className="mer-cs-outcome-card p-7">
                <h4 className="font-bold tracking-tight mb-4">{row.feature}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Typical Approach</div>
                    <p className="text-sm text-muted-foreground">{row.legacy}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--mer-cs-accent))' }}>Meridian</div>
                    <p className="text-sm">{row.design}</p>
                  </div>
                  <div className="pt-1 border-t border-border">
                    <p className="text-sm text-foreground/80 pt-3">{row.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-40 text-center border-t border-border" style={{ backgroundColor: 'hsl(var(--mer-cs-accent) / 0.06)' }}>
        <div data-mer-cs-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'hsl(var(--mer-cs-accent))' }}>
            <Sparkles className="w-3.5 h-3.5" />
            We build products, not just pages
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Precise work deserves<br />an equally precise site.</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Meridian is proof we can let strong work carry a page — restraint as a design decision, not a missing feature.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm px-10 py-6 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--mer-cs-accent))', color: 'white' }}
          >
            Book a Strategy Call
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <div className="mt-10">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
              More success blueprints
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MeridianCaseStudy;
