import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';

const EXAMPLES = [
  { label: 'Website Rebuild', value: 18000 },
  { label: 'Local SEO Retainer', value: 6000 },
  { label: 'AI Agent Build', value: 32000 },
  { label: 'Full System Engagement', value: 65000 },
];

const CYCLE_MS = 3200;

const formatCurrency = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

// Live-feeling hero card — auto-cycles through example engagement sizes and
// tweens the 10% payout number each time, instead of sitting there as static
// decoration. The real interactive calculator lives further down the page;
// this is just a taste of it.
const PayoutPreviewCard = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const payoutRef = useRef(null);
  const tweenObj = useRef({ n: EXAMPLES[0].value * 0.1 });

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % EXAMPLES.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const target = EXAMPLES[index].value * 0.1;
    const ctx = gsap.context(() => {
      gsap.to(tweenObj.current, {
        n: target,
        duration: 0.7,
        ease: 'power2.out',
        onUpdate: () => {
          if (payoutRef.current) payoutRef.current.textContent = formatCurrency(Math.round(tweenObj.current.n));
        },
      });
    });
    return () => ctx.revert();
  }, [index]);

  const example = EXAMPLES[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="border border-border bg-background p-8 md:p-10"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Example Payout</span>
        <span className="text-xs font-bold uppercase tracking-widest text-[#AFEA00]">Live Preview</span>
      </div>

      <div className="min-h-[9.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={example.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-3">
              {example.label} · {formatCurrency(example.value)}
            </span>
            <span ref={payoutRef} className="text-4xl md:text-5xl font-bold tracking-tighter text-[#AFEA00] block mb-3">
              {formatCurrency(example.value * 0.1)}
            </span>
            <span className="text-sm text-muted-foreground">for the intro. That's it.</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border">
        {EXAMPLES.map((ex, i) => (
          <button
            key={ex.label}
            onClick={() => setIndex(i)}
            aria-label={`Show ${ex.label}`}
            className="h-1 flex-1 bg-border relative overflow-hidden"
          >
            <span
              className="absolute inset-0 bg-[#AFEA00] transition-transform duration-300 origin-left"
              style={{ transform: `scaleX(${i === index ? 1 : 0})` }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PayoutPreviewCard;
