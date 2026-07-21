import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Handshake, Wallet } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: UserPlus,
    phase: '01',
    title: 'You make the intro.',
    desc: 'Send a name, a company, and a couple of sentences of context. Takes under two minutes.',
  },
  {
    icon: Handshake,
    phase: '02',
    title: 'They become a client.',
    desc: "We run our usual process — audit, proposal, signed engagement. You don't have to sell anything.",
  },
  {
    icon: Wallet,
    phase: '03',
    title: 'You earn 10%.',
    desc: "Once their first invoice clears, 10% of the engagement value lands with you. No cap, no expiry.",
  },
];

const ReferralHowItWorks = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reducedMotion) {
        gsap.set(cardRefs.current, { opacity: 1, y: 0 });
        gsap.set(nodeRefs.current, { scale: 1 });
        if (lineRef.current) gsap.set(lineRef.current, { scaleX: 1 });
        return;
      }

      gsap.set(cardRefs.current, { opacity: 0, y: 30 });
      gsap.set(nodeRefs.current, { scale: 0 });
      if (lineRef.current) gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      });

      tl.to(lineRef.current, { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0);

      STEPS.forEach((_, i) => {
        tl.to(nodeRefs.current[i], { scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, i * 0.35)
          .to(cardRefs.current[i], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, i * 0.35 + 0.05);
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-20 max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">How It Works</p>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Three steps. One payout.</h2>
      </div>

      <div className="relative">
        <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-border" aria-hidden="true">
          <div ref={lineRef} className="h-full bg-[#AFEA00]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="relative">
                <div
                  ref={(el) => (nodeRefs.current[i] = el)}
                  className="w-14 h-14 rounded-full bg-background border-2 border-[#AFEA00] flex items-center justify-center mb-8 relative z-10"
                >
                  <Icon className="w-6 h-6 text-[#AFEA00]" strokeWidth={1.75} />
                </div>
                <div ref={(el) => (cardRefs.current[i] = el)}>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Step {step.phase}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ReferralHowItWorks;
