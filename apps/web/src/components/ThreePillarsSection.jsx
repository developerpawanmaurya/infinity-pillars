import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check } from 'lucide-react';
import './ThreePillarsSection.css';

gsap.registerPlugin(ScrollTrigger);

// The three offerings that already anchor the rest of the site (HomePage's
// hero particle-morph, the Services page packages, this page's own "Why It
// Works" copy further down) — Web Architecture ⬡, GMB Local ◎, AI Agents △.
// This section is the first place a visitor sees them explained as one
// system rather than three separate line items.
const ACTS = [
  {
    symbol: '⬡',
    phase: '01',
    title: 'The Website',
    verb: 'Captures.',
    desc: 'A high-conversion engine engineered around conversion psychology — every screen, every field, every micro-interaction earns its place.',
  },
  {
    symbol: '◎',
    phase: '02',
    title: 'The GMB Profile',
    verb: 'Qualifies.',
    desc: 'Undisputed local authority — reviews, ranking, and real-time signals that filter serious buyers before they ever pick up the phone.',
  },
  {
    symbol: '△',
    phase: '03',
    title: 'The AI Agent',
    verb: 'Converts.',
    desc: 'A trained knowledge agent that answers, qualifies, and books a call — 24 hours a day, 7 days a week, without a salary.',
  },
];

const PILLAR_WIDTHS = [64, 64, 64];

const WebsiteMock = () => (
  <div className="tp-mock w-full max-w-sm rounded-md overflow-hidden">
    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-muted/40">
      <span className="w-2 h-2 rounded-full bg-foreground/15" />
      <span className="w-2 h-2 rounded-full bg-foreground/15" />
      <span className="w-2 h-2 rounded-full bg-foreground/15" />
    </div>
    <div className="p-5 space-y-3">
      <div className="h-2 w-2/3 bg-foreground/10 rounded" />
      <div className="h-2 w-1/2 bg-foreground/10 rounded mb-4" />
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Work Email</div>
      <div className="text-sm border-b border-foreground/30 pb-1.5">
        you@company.com<span className="tp-cursor" />
      </div>
      <div className="mt-4 bg-[#AFEA00] text-black text-center text-[11px] font-bold uppercase tracking-widest py-2.5 rounded-sm">
        Book Audit Call
      </div>
    </div>
  </div>
);

const GmbMock = () => (
  <div className="tp-mock w-full max-w-sm rounded-md p-5">
    <div className="flex items-center gap-2 mb-1">
      <span className="tp-gmb-dot" />
      <span className="text-[11px] font-bold text-[#1a9e4c]">Open Now</span>
    </div>
    <div className="text-sm font-bold tracking-tight mb-1">Infinity Pillars Client Co.</div>
    <div className="flex items-center gap-1 mb-3 text-sm">
      <span className="tp-star">★★★★★</span>
      <span className="text-xs text-muted-foreground">5.0 (128)</span>
    </div>
    <div className="border-t border-border pt-3 text-xs text-muted-foreground leading-relaxed">
      "Booked same day, showed up on time, exactly what the site promised."
    </div>
    <div className="mt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">— Verified Google Review</div>
  </div>
);

const AgentMock = () => (
  <div className="tp-mock w-full max-w-sm rounded-md p-5">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">AI Knowledge Agent</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#AFEA00]">● 24/7</span>
    </div>
    <div className="flex flex-col gap-2">
      <div className="self-start bg-muted rounded-xl rounded-bl-sm px-3 py-2 text-xs max-w-[80%]">
        Do you service properties outside the metro area?
      </div>
      <div className="self-end bg-[#AFEA00] text-black rounded-xl rounded-br-sm px-3 py-2 text-xs max-w-[80%] flex items-center gap-1">
        Yes — booking your consult now <Check className="w-3 h-3" />
      </div>
      <div className="self-start flex gap-1 bg-muted rounded-xl px-3 py-2 w-fit">
        <span className="tp-typing-dot" /><span className="tp-typing-dot" /><span className="tp-typing-dot" />
      </div>
    </div>
  </div>
);

const MOCKS = [WebsiteMock, GmbMock, AgentMock];

// Small static pillar-progress indicator for the mobile layout — the real
// scrub-accumulating cluster only makes sense pinned to a scroll range,
// which is exactly what mobile can't afford (see below).
const MiniPillars = ({ litCount }) => (
  <div className="flex items-end gap-2 h-12">
    {PILLAR_WIDTHS.map((w, i) => (
      <div
        key={i}
        className="tp-pillar"
        style={{
          width: w * 0.5,
          height: '100%',
          transform: 'scaleY(1)',
          backgroundColor: i < litCount ? '#AFEA00' : undefined,
          boxShadow: i < litCount ? '0 0 24px rgba(175,234,0,0.3)' : 'none',
        }}
      />
    ))}
  </div>
);

const ThreePillarsSection = () => {
  const wrapRef = useRef(null);
  const pillarRefs = useRef([]);
  const actRefs = useRef([]);
  const finaleRef = useRef(null);
  const lineRefs = useRef([]);
  const mobileRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0); // 0,1,2 = acts, 3 = finale
  // Pinned scrollytelling needs real scroll room per act to feel readable —
  // short mobile viewports don't have that room, and there's no way to
  // scroll *within* a pinned section, so anything that overflows the
  // viewport there is simply unreachable. Below `lg`, skip the pin/scrub
  // entirely and fall back to a plain stacked reveal instead.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Desktop: pinned scrub timeline
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || !isDesktop) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(actRefs.current, { opacity: 0, y: 24 });
      gsap.set(finaleRef.current, { opacity: 0, y: 24 });
      lineRefs.current.forEach((line) => {
        if (!line?.getTotalLength) return;
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          onUpdate: (self) => {
            const p = self.progress;
            setActiveStep(p < 0.3 ? 0 : p < 0.6 ? 1 : p < 0.9 ? 2 : 3);
          },
        },
      });

      [0, 1, 2].forEach((i) => {
        const base = i * 3;
        // Fill spans the act's *entire* scroll slice at a linear ease, not a
        // quick eased burst at the top of it — with scrub already providing
        // the smoothing, an eased tween here just meant the pillar snapped
        // to full height early then sat idle for the rest of the scroll.
        // Linear + full-span keeps scaleY directly proportional to scroll
        // position the whole way through.
        tl.to(pillarRefs.current[i], {
          scaleY: 1,
          backgroundColor: '#AFEA00',
          boxShadow: '0 0 40px rgba(175,234,0,0.35)',
          duration: 3,
          ease: 'none',
        }, base)
          .to(actRefs.current[i], { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, base + 0.15)
          .to(actRefs.current[i], { opacity: 0, y: -18, duration: 0.6, ease: 'power2.in' }, base + 2.5);
      });

      tl.to(finaleRef.current, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, 9)
        .to(pillarRefs.current, { scaleY: 1.08, duration: 0.5, ease: 'power2.out', stagger: 0.05 }, 9)
        .to(pillarRefs.current, { scaleY: 1, duration: 0.5, ease: 'power2.in', stagger: 0.05 }, 9.5);

      lineRefs.current.forEach((line, i) => {
        if (!line?.getTotalLength) return;
        tl.to(line, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 9 + i * 0.15);
      });
    }, wrap);

    return () => ctx.revert();
  }, [isDesktop]);

  // Mobile: plain stacked reveal, no pin, no scrub
  useEffect(() => {
    const wrap = mobileRef.current;
    if (!wrap || isDesktop) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-tp-mobile-act]').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });
    }, wrap);

    return () => ctx.revert();
  }, [isDesktop]);

  if (!isDesktop) {
    return (
      <section ref={mobileRef} className="tp-wrap py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">How We Actually Work</p>
          <h2 className="text-3xl font-bold tracking-tighter mb-16 text-balance">
            Three pillars. One compounding system.
          </h2>

          <div className="space-y-20">
            {ACTS.map((act, i) => {
              const Mock = MOCKS[i];
              return (
                <div key={act.title} data-tp-mobile-act>
                  <MiniPillars litCount={i + 1} />
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-6 mb-3">
                    <span>Phase {act.phase}</span>
                    <span className="text-[#AFEA00]">{act.symbol}</span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tighter mb-3">
                    {act.title} <span className="text-muted-foreground italic font-medium">{act.verb}</span>
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{act.desc}</p>
                  <Mock />
                </div>
              );
            })}

            <div data-tp-mobile-act className="text-center pt-4 border-t border-border">
              <MiniPillars litCount={3} />
              <h3 className="text-3xl font-bold tracking-tighter mt-8 mb-4 text-balance">
                Infinitely <span className="text-[#AFEA00]">compounding.</span>
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                This is the system behind every build on this site — not three vendors, one engineered engine.
              </p>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm border-b border-foreground pb-1"
              >
                See it in production
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={wrapRef} className="tp-wrap" style={{ height: '340vh' }}>
      <div className="tp-stage tp-noise">
        <span className="tp-symbol-watermark" aria-hidden="true">{ACTS[Math.min(activeStep, 2)].symbol}</span>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">How We Actually Work</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter max-w-2xl text-balance">
            Three pillars. One compounding system.
          </h2>
        </div>

        <div className="tp-layout flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-20 py-10">
          {/* Pillar cluster */}
          <div className="flex flex-col items-center lg:items-start gap-8 lg:w-[30%]">
            <div className="tp-pillars">
              {PILLAR_WIDTHS.map((w, i) => (
                <div
                  key={i}
                  ref={(el) => (pillarRefs.current[i] = el)}
                  className="tp-pillar"
                  style={{ width: w, height: '100%' }}
                />
              ))}
            </div>
            <div className="flex gap-6 md:gap-10">
              {ACTS.map((act, i) => (
                <div key={act.title} className="text-center">
                  <div className="text-lg mb-1 opacity-60">{act.symbol}</div>
                  <div
                    className="tp-pillar-label text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: activeStep >= i ? '#AFEA00' : 'hsl(var(--muted-foreground))' }}
                  >
                    {act.title.replace('The ', '')}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`tp-tick ${activeStep === i ? 'is-active' : ''}`} />
              ))}
            </div>
          </div>

          {/* Stage */}
          <div className="relative flex-1 w-full min-h-[360px]">
            {ACTS.map((act, i) => {
              const Mock = MOCKS[i];
              return (
                <div
                  key={act.title}
                  ref={(el) => (actRefs.current[i] = el)}
                  className="tp-act"
                  style={{ pointerEvents: activeStep === i ? 'auto' : 'none' }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full">
                    <div>
                      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                        <span>Phase {act.phase}</span>
                        <span className="text-[#AFEA00]">{act.symbol}</span>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
                        {act.title} <span className="text-muted-foreground italic font-medium">{act.verb}</span>
                      </h3>
                      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-md">{act.desc}</p>
                    </div>
                    <div className="flex justify-center md:justify-start">
                      <Mock />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Finale */}
            <div
              ref={finaleRef}
              className="tp-act"
              style={{ pointerEvents: activeStep === 3 ? 'auto' : 'none' }}
            >
              <div className="flex flex-col items-center text-center justify-center h-full">
                <svg width="0" height="0" aria-hidden="true">
                  <defs />
                </svg>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
                  <line ref={(el) => (lineRefs.current[0] = el)} x1="10%" y1="20%" x2="50%" y2="10%" stroke="#AFEA00" strokeWidth="1" opacity="0.4" />
                  <line ref={(el) => (lineRefs.current[1] = el)} x1="50%" y1="10%" x2="90%" y2="20%" stroke="#AFEA00" strokeWidth="1" opacity="0.4" />
                </svg>
                <h3 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 text-balance">
                  Infinitely<br /><span className="text-[#AFEA00]">compounding.</span>
                </h3>
                <p className="text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
                  This is the system behind every build on this site — not three vendors, one engineered engine.
                </p>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300"
                >
                  See it in production
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreePillarsSection;
