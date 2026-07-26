import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ArrowUpRight, ChevronRight, Moon, BedDouble, Sparkles } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import './DriftCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const SHIFTS = [
  {
    key: 'night',
    label: 'Night Shift',
    sub: 'On shift 22:00 → 06:00',
    window: '09:30 → 16:30',
    tip: 'Anchor sleep, then a 90-min nap at 19:30 before your 22:00 shift.',
    debt: '-2h 40m',
    debtPct: 0.35,
    wind: 'Eye mask · 6.4° room · no caffeine after 04:30',
  },
  {
    key: 'day',
    label: 'Day Shift',
    sub: 'On shift 07:00 → 15:00',
    window: '22:30 → 06:00',
    tip: 'Standard anchor sleep — but shifted 30 min earlier to protect your commute buffer.',
    debt: '-0h 20m',
    debtPct: 0.08,
    wind: 'Blackout curtains · no screens after 21:45',
  },
  {
    key: 'swing',
    label: 'Swing Shift',
    sub: 'Rotating 06:00 / 14:00 / 22:00',
    window: '01:00 → 08:00',
    tip: 'Rotation day — split sleep recommended: a core block plus a 45-min bridge nap.',
    debt: '-3h 15m',
    debtPct: 0.55,
    wind: 'Bridge nap at 12:30 · caffeine cutoff moves with rotation',
  },
];

const CHALLENGES = [
  { t: 'The 9-to-5 Assumption', d: 'Nearly every sleep app is written for someone who wakes at 7 and sleeps at 10. That advice is actively unhelpful for a nurse clocking out at 4am.' },
  { t: 'No Concept of a Roster', d: 'Existing tools track one static bedtime. Real shift workers rotate — day, night, swing — often week to week, with no product reasoning about the pattern itself.' },
  { t: 'Generic Wind-Down Advice', d: '"Read a book, dim the lights" doesn’t account for sleeping through daylight, traffic noise, or a body that thinks it should be awake.' },
];

const OUTCOMES = [
  { feature: 'Sleep Guidance', legacy: 'Generic 9-to-5 advice', design: 'Roster-aware anchor-sleep engine', value: 'An actionable plan for any shift pattern, not just daytime workers' },
  { feature: 'Debt Tracking', legacy: 'Vague "you seem tired" framing', design: 'Explicit, visible sleep-debt counter', value: 'Turns a feeling into a number you can act on' },
  { feature: 'Tone & Visual Identity', legacy: 'Clinical, alarmist health-app red', design: 'Calm, warm, off-white palette', value: 'Feels like a companion, not a warning label' },
  { feature: 'Scope', legacy: '—', design: 'Logo, landing page, and full app UI', value: 'One cohesive, end-to-end product surface' },
];

const DriftCaseStudy = () => {
  const [activeShift, setActiveShift] = useState('night');
  const pageRef = useRef(null);
  const shift = SHIFTS.find((s) => s.key === activeShift);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-drift-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
      gsap.utils.toArray('[data-drift-stagger]').forEach((group) => {
        gsap.fromTo(group.children, { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });
    }, pageRef);

    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [activeShift]);

  return (
    <div ref={pageRef} className="drift-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Drift — Case Study | Infinity Pillars</title>
        <meta name="description" content="Designing a roster-first sleep coach for shift workers: an independent product build by Infinity Pillars — logo, landing page, and app, end to end." />
      </Helmet>

      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-24 md:pt-52 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-14">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Success Blueprints
          </Link>
          <a
            href="https://developerpawanmaurya.github.io/drift-app/"
            target="_blank"
            rel="noopener noreferrer"
            className="drift-visit-btn group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 transition-all duration-300"
          >
            Visit live site
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] mb-8" style={{ color: 'hsl(var(--drift-accent))' }}>
          <Moon className="w-3.5 h-3.5" />
          Infinity Pillars Labs — Independent Product
        </div>

        <SplitReveal
          text="Designing sleep for people whose day doesn't start at sunrise."
          as="h1"
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-5xl"
        />

        <p className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
          Drift is a product we built ourselves — a sleep-coaching app for night nurses, long-haul drivers, paramedics, and anyone whose week doesn't end on Friday. Logo, landing page, and in-app experience, designed and engineered end to end to prove out a roster-first approach to sleep.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-3xl">
          {[
            { k: '3', v: 'Shift patterns modeled' },
            { k: 'End-to-end', v: 'Brand, product & front-end' },
            { k: '1', v: 'Roster-aware sleep engine' },
            { k: 'Solo', v: 'Designed & built in-house' },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-2xl md:text-3xl font-bold tracking-tighter">{s.k}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Challenge ────────────────────────────────────────────────── */}
      <section className="py-28 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-drift-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--drift-accent))' }}>The Product Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Every mainstream sleep app assumes the same day.</h2>
          </div>
          <div data-drift-stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CHALLENGES.map((c) => (
              <div key={c.t} className="bg-background border border-border p-8">
                <h3 className="text-xl font-bold tracking-tight mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive: Roster-First Sleep Engine ──────────────────── */}
      <section className="py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-drift-reveal>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--drift-accent))' }}>Solution 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The roster-first sleep engine.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Instead of one fixed bedtime, Drift reasons about an anchor-sleep window against whatever shift is next — night, day, or a rotating swing. Try switching shifts below and watch tonight's plan change.
            </p>
            <div className="flex flex-wrap gap-3">
              {SHIFTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveShift(s.key)}
                  className={`drift-shift-tab px-5 py-3 rounded-full text-sm font-bold ${activeShift === s.key ? 'is-active' : ''}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="drift-phone-card rounded-3xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Moon className="w-4 h-4" style={{ color: 'hsl(var(--drift-accent))' }} />
                drift
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-muted px-2.5 py-1 rounded-full text-muted-foreground">MT</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeShift} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{shift.sub}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-6">{shift.label}</div>

                <div className="rounded-2xl border border-border p-5 mb-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Tonight's Plan</div>
                  <div className="text-2xl font-bold tracking-tight mb-3" style={{ fontVariantNumeric: 'tabular-nums' }}>{shift.window}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{shift.tip}</p>
                </div>

                <div className="rounded-2xl border border-border p-5 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sleep Debt</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: 'hsl(var(--drift-accent) / 0.12)', color: 'hsl(var(--drift-accent))' }}>clearing</span>
                  </div>
                  <div className="text-xl font-bold tracking-tight mb-3">{shift.debt}</div>
                  <div className="drift-debt-track">
                    <motion.div
                      className="drift-debt-fill"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: shift.debtPct }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-border p-5">
                  <BedDouble className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'hsl(var(--drift-accent))' }} />
                  <div>
                    <div className="text-sm font-bold mb-1">Wind-down plan</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{shift.wind}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Brand & Landing Page ─────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-drift-reveal className="order-2 lg:order-1">
            <div className="editorial-frame overflow-hidden">
              <img
                src="/images/portfolio/drift-app.jpg"
                alt="Drift landing page and app preview"
                className="w-full h-[380px] md:h-[460px] object-cover object-top"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--drift-accent))' }}>Solution 02</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">A calm identity, on purpose.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Most health apps reach for alarm-red and urgent iconography. We went the other way: a warm off-white canvas, muted terracotta accents, and quiet, generous typography — a brand that reads as a companion getting you through a hard week, not a warning label.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The logo, landing page copy, and every card in the app share the same restrained voice — right down to how the sleep-debt counter is worded as "clearing," not "behind."
            </p>
          </div>
        </div>
      </section>

      {/* ── Visual Identity ──────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-drift-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--drift-accent))' }}>Solution 03</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The palette, plainly.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              A warm off-white canvas and a single muted terracotta accent — restraint that reads as calm, not clinical.
            </p>
          </div>
          <div data-drift-stagger className="flex flex-wrap gap-6">
            {[
              { color: 'hsl(var(--background))', label: 'Warm off-white canvas' },
              { color: 'hsl(var(--drift-accent))', label: 'Muted terracotta accent' },
              { color: 'hsl(var(--foreground))', label: 'Soft charcoal text' },
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
          <div data-drift-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--drift-accent))' }}>What Shipped</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Legacy approach vs. Drift.</h2>
          </div>
          <div data-drift-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OUTCOMES.map((row) => (
              <div key={row.feature} className="drift-outcome-card p-7">
                <h4 className="font-bold tracking-tight mb-4">{row.feature}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Typical Approach</div>
                    <p className="text-sm text-muted-foreground">{row.legacy}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--drift-accent))' }}>Drift</div>
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
      <section className="py-40 text-center text-background" style={{ backgroundColor: '#2b2420' }}>
        <div data-drift-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'hsl(var(--drift-accent))' }}>
            <Sparkles className="w-3.5 h-3.5" />
            We build products, not just pages
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Have a product idea<br />that needs a real build?</h2>
          <p className="text-xl text-background/60 mb-12 leading-relaxed">
            Drift is proof we take a product from a blank page to a working brand, front-end, and interaction system — not just a template with your logo on it.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm px-10 py-6 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--drift-accent))', color: 'white' }}
          >
            Book a Strategy Call
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <div className="mt-10">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-background/50 hover:text-background transition-colors group">
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

export default DriftCaseStudy;
