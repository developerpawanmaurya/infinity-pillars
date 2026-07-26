import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ArrowUpRight, ChevronRight, Sparkles, Camera } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import './MarisolFerreiraCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const CHALLENGES = [
  { t: 'A Digital Portfolio for an Analog Practice', d: 'Most photography-portfolio templates default to crisp digital polish. The challenge was making a website feel like it was printed, not rendered.' },
  { t: 'The First Five Seconds', d: 'Photography portfolios live or die on the entrance. A generic hero image says nothing about how the work was actually made — or why it took as long as it did.' },
  { t: 'Grain Without Gimmick', d: 'Film-grain textures are an easy visual cliché. The harder version is letting the analog process show through structure and pacing, not a filter slapped over a digital photo.' },
];

const OUTCOMES = [
  { feature: 'Entrance Experience', legacy: 'Static hero image', design: 'Custom image-trail intro sequence', value: 'Signals the craft before a single word is read' },
  { feature: 'Visual Language', legacy: 'Generic photography-template polish', design: 'Darkroom-inspired charcoal & warm-tan palette', value: 'Feels printed, not rendered' },
  { feature: 'Content Voice', legacy: 'Generic bio copy', design: 'Specific, tactile "About" narrative', value: 'Personality reads through, even in placeholder copy' },
  { feature: 'Scope', legacy: '—', design: 'Full portfolio: intro, gallery, about', value: 'One cohesive, analog-inspired experience' },
];

const MarisolFerreiraCaseStudy = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-mf-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
      gsap.utils.toArray('[data-mf-stagger]').forEach((group) => {
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
    <div ref={pageRef} className="mf-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Marisol Ferreira — Case Study | Infinity Pillars</title>
        <meta name="description" content="A portfolio site for a fictional analog photographer, built around a hand-printed darkroom aesthetic: an independent build by Infinity Pillars." />
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
            href="/marisol-ferreira"
            target="_blank"
            rel="noopener noreferrer"
            className="mf-visit-btn group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 transition-all duration-300"
          >
            Visit live site
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] mb-8" style={{ color: 'hsl(var(--mf-accent))' }}>
          <Camera className="w-3.5 h-3.5" />
          Infinity Pillars Labs — Independent Product
        </div>

        <SplitReveal
          text="Bringing a darkroom photographer's patience to the scroll."
          as="h1"
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-5xl"
        />

        <p className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
          Marisol Ferreira is a portfolio site we built for a fictional fine-art photographer working entirely in analog — every frame hand-printed before it ever reaches a screen. We designed an intro sequence that trails a single photograph across the entrance and lets the grain do the talking.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-3xl">
          {[
            { k: 'Image-trail', v: 'Custom entrance sequence' },
            { k: 'Darkroom', v: 'Hand-printed visual language' },
            { k: 'Editorial', v: 'Gallery & about layout' },
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
          <div data-mf-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mf-accent))' }}>The Product Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">A portfolio that reads as printed, not rendered.</h2>
          </div>
          <div data-mf-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHALLENGES.map((c) => (
              <div key={c.t} className="mf-card p-8">
                <h3 className="text-xl font-bold tracking-tight mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Image-Trail Intro ────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-mf-reveal>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mf-accent))' }}>Solution 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The image-trail intro.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              A single photograph trails across the entrance in layered frames as the "MF" mark and full name resolve letter by letter — a deliberately slow, ceremonial open, closer to watching a print rise in a developer tray than loading a webpage.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              It's on the live site right now — visit it to see the actual sequence rather than a description of one.
            </p>
          </div>
          <div className="editorial-frame overflow-hidden bg-muted">
            <img
              src="/images/portfolio/marisol-ferreira.jpg"
              alt="Marisol Ferreira portfolio preview"
              className="w-full aspect-[16/10] object-contain"
            />
          </div>
        </div>
      </section>

      {/* ── Print-Grade Restraint ────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-mf-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mf-accent))' }}>Solution 02</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Print-grade restraint.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              A charcoal canvas and a single warm-tan accent — the same restraint a darkroom printer applies to dodging and burning a frame, not adding to it.
            </p>
          </div>
          <div data-mf-stagger className="flex flex-wrap gap-6">
            {[
              { hex: '#161a19', label: 'Charcoal canvas' },
              { hex: '#dbb59b', label: 'Warm tan accent' },
              { hex: '#7f9993', label: 'Muted sage link' },
              { hex: '#fff', label: 'Print-white text' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="mf-palette-swatch w-10 h-10 rounded-full shrink-0" style={{ backgroundColor: c.hex }} />
                <span className="text-sm text-muted-foreground">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes ─────────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-mf-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--mf-accent))' }}>What Shipped</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Legacy approach vs. Marisol Ferreira.</h2>
          </div>
          <div data-mf-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OUTCOMES.map((row) => (
              <div key={row.feature} className="mf-outcome-card p-7">
                <h4 className="font-bold tracking-tight mb-4">{row.feature}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Typical Approach</div>
                    <p className="text-sm text-muted-foreground">{row.legacy}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--mf-accent))' }}>Marisol Ferreira</div>
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
      <section className="py-40 text-center border-t border-border" style={{ backgroundColor: 'hsl(var(--mf-accent) / 0.08)' }}>
        <div data-mf-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'hsl(var(--mf-accent))' }}>
            <Sparkles className="w-3.5 h-3.5" />
            We build products, not just pages
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Want a portfolio that<br />feels like your process?</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Marisol Ferreira is proof we design the entrance as carefully as the content — the first five seconds carry as much craft as the gallery behind them.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm px-10 py-6 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--mf-accent))', color: 'white' }}
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

export default MarisolFerreiraCaseStudy;
