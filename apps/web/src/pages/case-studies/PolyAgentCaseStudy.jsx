import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ArrowUpRight, ChevronRight, Zap, Play, Pause, Sparkles } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AnimatedCounter from '@/components/AnimatedCounter.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import './PolyAgentCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const TICKER = [
  'Will SpaceX launch Starship by Q3? ↗ 62.0¢',
  'Will ETH exceed $4,000 before June? ↗ 51.0¢',
  'Will the Fed cut rates this quarter? ↘ 64.0¢',
  'Will Bitcoin reach $120K in 2026? ↗ 34.0¢',
  'Will AI surpass human performance benchmarks? ↘ 48.0¢',
];

const CHALLENGES = [
  { t: 'Unattended by Design', d: 'Trading agents run 24/7 with no human in the loop — the interface has to carry all the trust an operator would normally get from watching over someone\'s shoulder.' },
  { t: 'PnL Isn\'t Enough', d: 'A number going up or down tells you nothing about why. An operator who doesn\'t trust the "why" disables the agent — defeating the point of automating it.' },
  { t: 'One Action That Matters', d: 'Most dashboards bury the kill switch three menus deep. The single control that matters most — stop it — needs to be the fastest thing to reach.' },
];

const SIGNALS = [
  { q: 'Will ETH exceed $4k before June?', pos: 'YES', ev: '+14.2% EV', pct: 78, reason: 'On-chain accumulation spike, historically bullish for Q2.' },
  { q: 'Will the Fed cut rates this quarter?', pos: 'NO', ev: '+9.6% EV', pct: 61, reason: 'Futures pricing has drifted from consensus over the last 48h.' },
];

const OUTCOMES = [
  { feature: 'Trust Signal', legacy: 'Raw PnL number, no context', design: 'AI Signal Feed with plain-English rationale', value: 'Operators understand why a position exists' },
  { feature: 'Control', legacy: 'Kill switch buried in settings', design: 'Single Pause Agent control beside the balance', value: 'The riskiest moment is also the fastest to act on' },
  { feature: 'Status at a Glance', legacy: 'Requires opening logs', design: 'Live PnL, wallet & unrealized PnL up front', value: 'Health check takes one glance, not an investigation' },
  { feature: 'Reusability', legacy: 'One-off internal tool', design: 'White-label-ready component shell', value: 'Same shell can front a different agent or asset class' },
];

const PolyAgentCaseStudy = () => {
  const pageRef = useRef(null);
  const chartPathRef = useRef(null);
  const [agentActive, setAgentActive] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-pa-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      });
      gsap.utils.toArray('[data-pa-stagger]').forEach((group) => {
        gsap.fromTo(group.children, { opacity: 0, y: 22 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.09,
          scrollTrigger: { trigger: group, start: 'top 85%', once: true },
        });
      });

      if (chartPathRef.current) {
        const len = chartPathRef.current.getTotalLength();
        gsap.set(chartPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(chartPathRef.current, {
          strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut',
          scrollTrigger: { trigger: chartPathRef.current, start: 'top 85%', once: true },
        });
      }
    }, pageRef);

    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="pa-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>PolyAgent — Case Study | Infinity Pillars</title>
        <meta name="description" content="Designing an operator's control surface for an autonomous prediction-market trading agent: an independent product build by Infinity Pillars." />
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
            href="https://developerpawanmaurya.github.io/PolyAgent/"
            target="_blank"
            rel="noopener noreferrer"
            className="pa-visit-btn group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 transition-all duration-300"
          >
            Visit live site
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] mb-8" style={{ color: 'hsl(var(--pa-accent))' }}>
          <Zap className="w-3.5 h-3.5" />
          Infinity Pillars Labs — Independent Product
        </div>

        <SplitReveal
          text="An operator's window into an AI that trades unattended."
          as="h1"
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-5xl"
        />

        <p className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
          PolyAgent is a product we built ourselves — a real-time dashboard for autonomous agents trading Polymarket's prediction markets, designed to answer one question at a glance: is it working, right now?
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-3xl">
          {[
            { k: 'Real-time', v: 'Live PnL & wallet tracking' },
            { k: 'AI Signal Feed', v: 'Explains agent rationale' },
            { k: 'White-label', v: 'Reusable dashboard shell' },
            { k: '1-click', v: 'Pause control' },
          ].map((s) => (
            <div key={s.v}>
              <div className="pa-mono text-xl md:text-2xl font-bold tracking-tighter">{s.k}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Market ticker */}
        <div className="mt-16 border-y border-border py-5 overflow-hidden relative">
          <div className="flex whitespace-nowrap fade-left-edge">
            {[0, 1].map((dupe) => (
              <div key={dupe} className="flex items-center animate-scroll pa-mono" aria-hidden={dupe === 1}>
                {TICKER.map((item) => (
                  <span key={item} className="mx-6 text-sm text-muted-foreground flex items-center gap-6">
                    {item}
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'hsl(var(--pa-accent))' }} />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Challenge ────────────────────────────────────────────────── */}
      <section className="py-28 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-pa-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--pa-accent))' }}>The Product Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Autonomous agents fail silently.</h2>
          </div>
          <div data-pa-stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CHALLENGES.map((c) => (
              <div key={c.t} className="pa-card p-8">
                <h3 className="text-xl font-bold tracking-tight mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive: Overview Dashboard ──────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-pa-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--pa-accent))' }}>Solution 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The Overview Dashboard.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Total PnL, wallet balance, and unrealized PnL sit first — the health check happens in one glance, not an investigation. Try the pause control below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="pa-card is-glow p-6">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Total PnL</div>
              <AnimatedCounter value={125.75} prefix="+$" decimals={2} className="pa-mono text-3xl md:text-4xl font-bold block mb-2" style={{ color: 'hsl(var(--pa-accent))' }} />
              <div className="text-xs" style={{ color: 'hsl(var(--pa-accent))' }}>↗ +$18.42 today</div>
            </div>
            <div className="pa-card p-6">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Wallet Balance</div>
              <AnimatedCounter value={1450.50} prefix="$" decimals={2} className="pa-mono text-3xl md:text-4xl font-bold block mb-2" />
              <div className="text-xs text-muted-foreground">USDC</div>
            </div>
            <div className="pa-card p-6">
              <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Unrealized PnL</div>
              <AnimatedCounter value={46} prefix="+$" decimals={2} className="pa-mono text-3xl md:text-4xl font-bold block mb-2" />
              <div className="text-xs text-muted-foreground">Open positions</div>
            </div>
          </div>

          <div className="pa-card p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-2">PnL Over Time</div>
                  <div className="pa-mono text-2xl font-bold" style={{ color: 'hsl(var(--pa-accent))' }}>+$69.20 USDC</div>
                </div>
              </div>
              <svg viewBox="0 0 400 100" className="w-full h-24" preserveAspectRatio="none">
                <path
                  ref={chartPathRef}
                  d="M0,80 C20,78 35,82 50,76 C70,68 85,74 100,70 C130,62 150,66 170,52 C200,36 220,44 240,30 C270,14 290,20 320,10 C350,4 370,10 400,6"
                  fill="none"
                  stroke="hsl(var(--pa-accent))"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-3 md:border-l md:border-border md:pl-8">
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Agent Control</div>
              <button
                onClick={() => setAgentActive((a) => !a)}
                className={`pa-toggle ${agentActive ? 'is-active' : 'is-paused'} flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold`}
              >
                {agentActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {agentActive ? 'Active — Click to Pause' : 'Paused — Click to Resume'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Signal Feed ───────────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-pa-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--pa-accent))' }}>Solution 02</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The AI Signal Feed.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Every open position ships with a plain-English reason attached — not just a ticker and a percentage.
            </p>
          </div>
          <div data-pa-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SIGNALS.map((s) => (
              <div key={s.q} className="pa-signal-card p-7">
                <div className="text-sm text-foreground/80 mb-4">{s.q}</div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="pa-pill px-3 py-1 rounded-full text-xs font-bold">{s.pos}</span>
                  <span className="text-sm font-bold pa-mono" style={{ color: 'hsl(var(--pa-accent))' }}>{s.ev}</span>
                  <span className="ml-auto text-muted-foreground text-xs pa-mono">{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: 'hsl(var(--pa-accent))' }} />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual Identity ──────────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-pa-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--pa-accent))' }}>Solution 03</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Signal-green, and nothing else.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              One accent color, reserved entirely for numbers moving in your favor — monospace type keeps every figure honest and easy to scan.
            </p>
          </div>
          <div data-pa-stagger className="flex flex-wrap gap-6">
            {[
              { color: 'hsl(var(--background))', label: 'Clean dashboard canvas' },
              { color: 'hsl(var(--pa-accent))', label: 'Signal-green accent' },
              { color: 'hsl(var(--foreground))', label: 'Monospace ink' },
              { color: 'hsl(var(--border))', label: 'Hairline dividers' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full shrink-0 border border-border" style={{ backgroundColor: c.color }} />
                <span className="text-sm text-muted-foreground pa-mono">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes ─────────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-pa-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--pa-accent))' }}>What Shipped</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Legacy approach vs. PolyAgent.</h2>
          </div>
          <div data-pa-stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OUTCOMES.map((row) => (
              <div key={row.feature} className="pa-outcome-card p-7">
                <h4 className="font-bold tracking-tight mb-4">{row.feature}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Typical Approach</div>
                    <p className="text-sm text-muted-foreground">{row.legacy}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--pa-accent))' }}>PolyAgent</div>
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
      <section className="py-40 text-center border-t border-border" style={{ backgroundColor: 'hsl(var(--pa-accent) / 0.06)' }}>
        <div data-pa-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'hsl(var(--pa-accent))' }}>
            <Sparkles className="w-3.5 h-3.5" />
            We build products, not just pages
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Automating something<br />that needs a trust layer?</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            PolyAgent is proof we can design the operator surface for a system that runs without a human in the loop — real-time data, clear rationale, one fast control.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm px-10 py-6 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--pa-accent))', color: 'white' }}
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

export default PolyAgentCaseStudy;
