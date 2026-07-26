import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ArrowUpRight, ChevronRight, Sparkles, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import './NexusCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const CHALLENGES = [
  { t: 'Invisible Value', d: '"Thinks ahead" means nothing without something visual to back it up — most AI landing pages just stack claims on top of each other and hope one lands.' },
  { t: 'Instant-Reveal Fatigue', d: 'Dumping the whole pitch into one static hero makes even a genuinely good product feel like every other SaaS page competing for the same eight seconds.' },
  { t: 'No Sense of Momentum', d: 'Predictive products are fundamentally about anticipating what happens next — a page that reveals everything at once can\'t communicate that on its own.' },
];

const OUTCOMES = [
  { feature: 'Hero Pacing', legacy: 'Full pitch visible in one static frame', design: 'Scroll-choreographed, staged reveal', value: 'The page argues its own thesis through motion' },
  { feature: 'Visual Language', legacy: 'Stock gradients, generic AI iconography', design: 'Custom violet grid system + gradient type', value: 'A distinct, ownable identity instead of template AI' },
  { feature: 'Surface Coverage', legacy: 'Landing page only', design: 'Landing page + web app shell, shared tokens', value: 'Consistent product feel from pitch to product' },
  { feature: 'Positioning', legacy: 'Feature list', design: '"Thinks ahead" as a felt, motion-backed idea', value: 'Memorable pitch that mirrors the product itself' },
];

const NexusCaseStudy = () => {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-nx-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
      gsap.utils.toArray('[data-nx-stagger]').forEach((group) => {
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
    <div ref={pageRef} className="nx-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Nexus — Case Study | Infinity Pillars</title>
        <meta name="description" content="Making predictive AI feel like something, not just say it: an independent landing page and web app build by Infinity Pillars, choreographed around scroll." />
      </Helmet>

      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-28 overflow-hidden nx-grid-bg">
        <div className="absolute inset-0 nx-glow pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-14">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Success Blueprints
            </Link>
            <a
              href="https://developerpawanmaurya.github.io/nexus/"
              target="_blank"
              rel="noopener noreferrer"
              className="nx-visit-btn group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 transition-all duration-300"
            >
              Visit live site
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <div className="inline-flex items-center gap-2 nx-badge rounded-full px-4 py-2 text-xs font-bold mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Infinity Pillars Labs — Independent Product
          </div>

          <SplitReveal
            text="Making 'predictive AI' feel like something, not just say it."
            as="h1"
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-5xl"
          />

          <p className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            Nexus is a landing page and web app concept we built ourselves for a predictive-AI product — designed around a scroll-driven motion narrative, so the pitch is felt through pacing and reveal, not just read in a paragraph.
          </p>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-3xl">
            {[
              { k: 'Scroll-driven', v: 'Motion-first narrative' },
              { k: '2 surfaces', v: 'Landing page + web app' },
              { k: 'NEXUS 2.0', v: 'Predictive-AI concept' },
              { k: 'In-house', v: 'Concept through code' },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-xl md:text-2xl font-bold tracking-tighter">{s.k}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Challenge ────────────────────────────────────────────────── */}
      <section className="py-28 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-nx-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--nx-accent))' }}>The Product Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Predictive AI is an abstract pitch.</h2>
          </div>
          <div data-nx-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHALLENGES.map((c) => (
              <div key={c.t} className="nx-card p-8">
                <h3 className="text-xl font-bold tracking-tight mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive: the reveal, live ───────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-nx-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--nx-accent))' }}>Solution 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The reveal is the pitch.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              You just watched it happen. Every headline on this page enters the same way the product's own hero does — the technique doubles as the proof.
            </p>
          </div>

          <div className="nx-grid-bg relative rounded-2xl border border-border p-10 md:p-16 overflow-hidden">
            <div className="absolute inset-0 nx-glow pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 nx-badge rounded-full px-4 py-2 text-xs font-bold mb-8">
                <Zap className="w-3.5 h-3.5" />
                Introducing NEXUS 2.0 — Predictive AI
              </div>
              <SplitReveal
                text="The AI that thinks ahead."
                as="h3"
                trigger="scroll"
                className="text-4xl md:text-6xl font-bold tracking-tighter nx-gradient-text"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual System ────────────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-nx-reveal className="order-2 lg:order-1">
            <div className="rounded-2xl overflow-hidden border border-border bg-background">
              <img
                src="/images/portfolio/nexus.jpg"
                alt="Nexus landing page preview"
                className="w-full aspect-[16/10] object-contain"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--nx-accent))' }}>Solution 02</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">A distinct, ownable identity.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Instead of another generic AI-purple gradient, Nexus runs on a fine violet grid, a soft top-left glow, and a three-stop gradient — violet into indigo into cyan — reserved for the words that matter most.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The same grid, badge, and gradient-text components carry through from the landing page into the app shell, so the product never has to re-introduce itself.
            </p>
          </div>
        </div>
      </section>

      {/* ── One System, Two Surfaces ─────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-nx-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--nx-accent))' }}>Solution 03</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">One system, two surfaces.</h2>
          </div>
          <div data-nx-stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="nx-swatch rounded-xl p-6">
              <div className="inline-flex items-center gap-2 nx-badge rounded-full px-3 py-1.5 text-xs font-bold mb-4">
                <Sparkles className="w-3 h-3" />
                Badge
              </div>
              <p className="text-sm text-muted-foreground">A single pill component announces every new release across both surfaces.</p>
            </div>
            <div className="nx-swatch rounded-xl p-6">
              <div className="text-2xl font-bold nx-gradient-text mb-4">Gradient type</div>
              <p className="text-sm text-muted-foreground">Reserved for headline moments only — never overused into decoration.</p>
            </div>
            <div className="nx-swatch rounded-xl p-6">
              <div className="nx-grid-bg rounded-md h-10 w-full mb-4 border border-border" />
              <p className="text-sm text-muted-foreground">The violet grid ties the marketing site and the in-app dashboard to one canvas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual Identity ──────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-nx-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--nx-accent))' }}>Solution 04</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">One gradient, used sparingly.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Violet into indigo into cyan — three stops reserved for headline moments only, so the gradient still reads as a signal, not wallpaper.
            </p>
          </div>
          <div data-nx-stagger className="flex flex-wrap gap-6">
            {[
              { color: '#7c3aed', label: 'Violet gradient stop' },
              { color: '#6366f1', label: 'Indigo gradient stop' },
              { color: '#0891b2', label: 'Cyan gradient stop' },
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
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-nx-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--nx-accent))' }}>What Shipped</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Legacy approach vs. Nexus.</h2>
          </div>
          <div data-nx-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OUTCOMES.map((row) => (
              <div key={row.feature} className="nx-outcome-card p-7 rounded-xl">
                <h4 className="font-bold tracking-tight mb-4">{row.feature}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Typical Approach</div>
                    <p className="text-sm text-muted-foreground">{row.legacy}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--nx-accent))' }}>Nexus</div>
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
      <section className="py-40 text-center relative overflow-hidden nx-grid-bg">
        <div className="absolute inset-0 nx-glow pointer-events-none" />
        <div data-nx-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'hsl(var(--nx-accent))' }}>
            <Sparkles className="w-3.5 h-3.5" />
            We build products, not just pages
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Got a pitch that<br />deserves better pacing?</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Nexus is proof we can turn an abstract product claim into a page people actually feel — motion, identity, and code working together, not layered on top of a template.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm px-10 py-6 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #6366f1)', color: 'white' }}
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

export default NexusCaseStudy;
