import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ChevronLeft, ArrowUpRight, ChevronRight, Check, MessageCircle,
  Building2, GraduationCap, HeartPulse, FileText, Printer
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import { Button } from '@/components/ui/button';
import './KissCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const QUOTE_STEPS = [
  { title: 'Monthly Print Volume', options: ['Under 5,000', '5,000 – 20,000', '20,000 – 50,000', '50,000+'] },
  { title: 'Colour Preference', options: ['Mono Only', 'Full Colour', 'Mixed Fleet'] },
  { title: 'Paper Sizes', options: ['A4', 'A3', 'A4 + A3', 'Wide Format'] },
  { title: 'Leasing Structure', options: ['12-Month Lease', '36-Month Lease', '60-Month Lease', 'Outright Purchase'] },
  { title: 'Business Type', options: ['Corporate Office', 'School / Education', 'Aged Care Facility', 'Healthcare Provider'] },
  { title: 'Existing Provider', options: ['Switching Providers', 'New to Managed Print', 'Currently Self-Managed', 'Multiple Providers'] },
  { title: 'Regional Office', options: ['Melbourne', 'Sydney', 'Gippsland'] },
  { title: 'Timeline', options: ['Immediate', 'Within 30 Days', '1 – 3 Months', 'Just Exploring'] },
];

const CHAT_SEQUENCE = [
  { from: 'user', text: 'I need to order more toner for the branch printer.' },
  { from: 'bot', text: "Got it — I can see 3 registered devices at your Melbourne office. Which one?" },
  { from: 'user', text: 'The Ricoh on Level 2.' },
  { from: 'bot', text: 'Toner ordered. Dispatch ETA: next business day. Anything else, like a meter reading?' },
];

const DIRECTORY = [
  { icon: Building2, label: 'Corporate Office Fleets', desc: 'High-volume print, document software, and business NBN.' },
  { icon: GraduationCap, label: 'Education & Schools', desc: 'High-volume school printing without enterprise clutter.' },
  { icon: HeartPulse, label: 'Aged Care Facilities', desc: 'Radar safety communication systems and mission-critical hardware.' },
  { icon: FileText, label: 'Document Software', desc: 'Workflow and document management for regulated industries.' },
];

const PERFORMANCE = [
  { el: 'Services Navigation', legacy: 'Visual clutter from disparate service lines.', design: 'Industry-focused multi-branch directory.', value: 'Users quickly self-select exact business requirements.' },
  { el: 'B2B Lead Acquisition', legacy: 'High abandonment on dense, static forms.', design: '8-step interactive print quote engine.', value: 'Generates highly qualified, sales-ready leads.' },
  { el: 'Client Servicing', legacy: 'High volume of simple, manual support calls.', design: 'Interactive "Ness" chatbot interface.', value: 'Clients instantly order toner and log repairs.' },
  { el: 'Regional Expansion', legacy: 'Disjointed footprint across regional offices.', design: 'Geo-targeted local authority pages.', value: 'Strengthens local search presence in VIC & NSW.' },
];

const REGIONS = [
  { name: 'Melbourne', x: '28%', y: '30%' },
  { name: 'Sydney', x: '72%', y: '22%' },
  { name: 'Gippsland', x: '48%', y: '68%' },
];

const KissCaseStudy = () => {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatTyping, setChatTyping] = useState(false);
  const chatPlayedRef = useRef(false);
  const chatSectionRef = useRef(null);
  const pageRef = useRef(null);

  const isReview = step === QUOTE_STEPS.length;

  const selectOption = (title, option) => {
    setSelections((s) => ({ ...s, [title]: option }));
  };

  const goNext = () => setStep((s) => Math.min(s + 1, QUOTE_STEPS.length));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  // Section reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-kc-reveal]').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });
      gsap.utils.toArray('[data-kc-stagger]').forEach((group) => {
        gsap.fromTo(group.children,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.09, scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });
      // Network lines drawing in
      gsap.utils.toArray('[data-kc-line]').forEach((line) => {
        const len = line.getTotalLength ? line.getTotalLength() : 300;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: line, start: 'top 80%', once: true } });
      });
    }, pageRef);

    // Web fonts swapping in after these triggers were measured shifts every
    // element's position slightly — recalculate once fonts settle so later
    // sections' start/end points stay accurate instead of drifting.
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  // The chat box and the quote-generator step both change height as the
  // user interacts (messages append, option grids differ in row count).
  // Every section below them was measured before that growth, so their
  // ScrollTrigger start points drift out of sync with the real layout
  // unless we tell GSAP to remeasure.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [chatMessages, chatTyping, step]);

  // "Ness" chat playback, once, triggered on scroll
  useEffect(() => {
    const el = chatSectionRef.current;
    if (!el) return undefined;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        if (chatPlayedRef.current) return;
        chatPlayedRef.current = true;
        let i = 0;
        const playNext = () => {
          if (i >= CHAT_SEQUENCE.length) return;
          // Capture the message now, synchronously — the setState updater
          // below runs later (after this whole callback returns), by which
          // point a closure read of `i` would already reflect the `i += 1`
          // a few lines down and skip straight past the last message.
          const msg = CHAT_SEQUENCE[i];
          setChatTyping(true);
          setTimeout(() => {
            setChatTyping(false);
            setChatMessages((m) => [...m, msg]);
            i += 1;
            setTimeout(playNext, 700);
          }, 900);
        };
        playNext();
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={pageRef} className="kc-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>KISS Professional Solutions — Case Study | Infinity Pillars</title>
        <meta name="description" content="Accelerating enterprise lead generation through smart interactive architecture: how Infinity Pillars rebuilt KISS Professional Solutions' digital footprint." />
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
            href="https://kissps.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
          >
            Visit live site
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] mb-8" style={{ color: 'hsl(var(--kc-accent))' }}>
          <Printer className="w-3.5 h-3.5" />
          Case Study — Enterprise Lead Generation
        </div>

        <SplitReveal
          text="Accelerating enterprise lead generation through smart interactive architecture."
          as="h1"
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-5xl"
        />

        <p className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
          KISS Professional Solutions — a premier Australian office technology and managed services provider trusted by 3,000+ organizations — needed a digital footprint that could match its rapid growth after acquiring NEXT Tech Group.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-3xl">
          {[
            { k: '3,000+', v: 'Organizations served' },
            { k: '70', v: 'Specialist staff' },
            { k: '5', v: 'Regional offices' },
            { k: '8', v: 'Step quote engine' },
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
          <div data-kc-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--kc-accent))' }}>The Digital Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Diverse services, one confusing front door.</h2>
          </div>
          <div data-kc-stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { t: 'High Lead Abandonment', d: 'Text-heavy, complex contact forms drove high-intent prospects to drop off.' },
              { t: 'Cluttered Information Architecture', d: 'Merging school printing alongside mission-critical aged care hardware confused the user journey.' },
              { t: 'High Sales Overhead', d: 'Account executives spent disproportionate hours manually qualifying and routing inbound leads.' },
            ].map((c) => (
              <div key={c.t} className="bg-background border border-border p-8">
                <h3 className="text-xl font-bold tracking-tight mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8-Step Interactive Quote Generator ──────────────────────── */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-kc-reveal className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--kc-accent))' }}>Solution 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The 8-Step Print Quote Generator.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              Guides prospects through visual questions on volume, colour, paper size, leasing, and timeline — try the live flow below.
            </p>
          </div>

          <div className="border border-border p-8 md:p-12 bg-background">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {isReview ? 'Review' : `Step ${step + 1} of ${QUOTE_STEPS.length}`}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(var(--kc-accent))' }}>
                {Math.round(((isReview ? QUOTE_STEPS.length : step) / QUOTE_STEPS.length) * 100)}%
              </span>
            </div>
            <div className="kc-progress-track mb-10">
              <div className="kc-progress-fill" style={{ width: `${((isReview ? QUOTE_STEPS.length : step) / QUOTE_STEPS.length) * 100}%` }} />
            </div>

            {!isReview ? (
              <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-2xl font-bold tracking-tight mb-6">{QUOTE_STEPS[step].title}</h3>
                <div className="grid grid-cols-2 gap-3 mb-10">
                  {QUOTE_STEPS[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => selectOption(QUOTE_STEPS[step].title, opt)}
                      className={`kc-option px-5 py-4 text-left text-sm font-medium rounded-md flex items-center justify-between ${selections[QUOTE_STEPS[step].title] === opt ? 'is-selected' : ''}`}
                    >
                      {opt}
                      {selections[QUOTE_STEPS[step].title] === opt && <Check className="w-4 h-4" style={{ color: 'hsl(var(--kc-accent))' }} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-2xl font-bold tracking-tight mb-6">Your requirements, at a glance.</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                  {QUOTE_STEPS.map((s) => (
                    <div key={s.title} className="flex items-center justify-between border-b border-border py-2 text-sm">
                      <span className="text-muted-foreground">{s.title}</span>
                      <span className="font-semibold">{selections[s.title] || '—'}</span>
                    </div>
                  ))}
                </div>
                {!submitted ? (
                  <Button onClick={() => setSubmitted(true)} className="w-full rounded-none py-6 text-sm font-bold uppercase tracking-widest" style={{ backgroundColor: 'hsl(var(--kc-accent))', color: 'white' }}>
                    Get My Personalised Quote
                  </Button>
                ) : (
                  <div className="text-center py-6 border border-dashed" style={{ borderColor: 'hsl(var(--kc-accent))' }}>
                    <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'hsl(var(--kc-accent))' }}>Request Captured</p>
                    <p className="text-muted-foreground text-sm">A sales-ready lead — routed automatically, zero manual qualification hours spent.</p>
                  </div>
                )}
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button onClick={goBack} disabled={step === 0} className="text-xs font-bold uppercase tracking-widest text-muted-foreground disabled:opacity-30 hover:text-foreground transition-colors">
                Back
              </button>
              {!isReview && (
                <button
                  onClick={goNext}
                  disabled={!selections[QUOTE_STEPS[step].title]}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-30 hover:opacity-70 transition-opacity"
                  style={{ color: 'hsl(var(--kc-accent))' }}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── "Ness" Conversational Bot ────────────────────────────────── */}
      <section ref={chatSectionRef} className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-kc-reveal>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--kc-accent))' }}>Solution 02</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Meet "Ness."</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              A support hub allowing active clients to directly log on-site technical repair calls, order replacement toner, and submit monthly meter readings — lowering support queue volumes.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Order Toner', 'Log Repair', 'Meter Reading'].map((tag) => (
                <span key={tag} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-border px-4 py-2">
                  <MessageCircle className="w-3.5 h-3.5" style={{ color: 'hsl(var(--kc-accent))' }} />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-background border border-border p-6 md:p-8 min-h-[340px] flex flex-col justify-end">
            <div className="flex flex-col gap-3">
              {chatMessages.filter(Boolean).map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`kc-chat-bubble ${m.from}`}
                >
                  {m.text}
                </motion.div>
              ))}
              {chatTyping && (
                <div className="kc-chat-bubble bot flex gap-1 items-center">
                  <span className="kc-typing-dot" /><span className="kc-typing-dot" /><span className="kc-typing-dot" />
                </div>
              )}
              {chatMessages.length === 0 && !chatTyping && (
                <p className="text-muted-foreground text-sm text-center py-16">Scroll here to watch Ness handle a live support request…</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Directory ────────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-kc-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--kc-accent))' }}>Solution 03</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Clean, multi-layered directory.</h2>
          </div>
          <div data-kc-stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIRECTORY.map((d) => (
              <div key={d.label} className="kc-directory-card p-7 bg-background">
                <d.icon className="w-7 h-7 mb-5" style={{ color: 'hsl(var(--kc-accent))' }} />
                <h4 className="font-bold tracking-tight mb-2">{d.label}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Regional Network Map ─────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div data-kc-reveal>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--kc-accent))' }}>Solution 04</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Unified local presence.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Geo-targeted landing pages were deployed for Melbourne, Sydney, and Gippsland — unifying five regional offices and capturing local search traffic across VIC & NSW.
            </p>
          </div>
          <div className="relative aspect-[4/3] border border-border bg-background overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <line data-kc-line x1="28%" y1="30%" x2="50%" y2="50%" stroke="hsl(var(--kc-accent))" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line data-kc-line x1="72%" y1="22%" x2="50%" y2="50%" stroke="hsl(var(--kc-accent))" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <line data-kc-line x1="48%" y1="68%" x2="50%" y2="50%" stroke="hsl(var(--kc-accent))" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest bg-foreground text-background px-3 py-1.5 rounded-full z-10">
              KISS HQ
            </div>
            {REGIONS.map((r) => (
              <div key={r.name} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2" style={{ left: r.x, top: r.y }}>
                <div className="kc-pin" />
                <span className="text-[10px] font-bold uppercase tracking-widest bg-background border border-border px-2 py-1 whitespace-nowrap">{r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Performance Summary ──────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-kc-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--kc-accent))' }}>Measurable Outcomes</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Performance summary.</h2>
          </div>
          <div data-kc-stagger className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="py-4 pr-6">Element</th>
                  <th className="py-4 pr-6">Legacy Process</th>
                  <th className="py-4 pr-6">Infinity Pillars Design</th>
                  <th className="py-4">Operational Business Value</th>
                </tr>
              </thead>
              <tbody>
                {PERFORMANCE.map((row) => (
                  <tr key={row.el} className="border-b border-border align-top">
                    <td className="py-6 pr-6 font-bold">{row.el}</td>
                    <td className="py-6 pr-6 text-muted-foreground">{row.legacy}</td>
                    <td className="py-6 pr-6" style={{ color: 'hsl(var(--kc-accent))' }}>{row.design}</td>
                    <td className="py-6 text-foreground/80">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-40 text-center text-background" style={{ backgroundColor: '#0f172a' }}>
        <div data-kc-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Turn complex services into<br />high-converting pipelines.</h2>
          <p className="text-xl text-background/60 mb-12 leading-relaxed">
            Don't let disjointed directories or high-friction lead forms stall your sales velocity.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm px-10 py-6 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--kc-accent))', color: 'white' }}
          >
            Book Audit Call
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

export default KissCaseStudy;
