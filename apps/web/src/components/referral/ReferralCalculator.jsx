import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Slider } from '@/components/ui/slider';

const MIN = 2000;
const MAX = 150000;
const STEP = 1000;

const formatCurrency = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const ReferralCalculator = () => {
  const [dealSize, setDealSize] = useState(20000);
  const commissionRef = useRef(null);
  const tweenObj = useRef({ n: dealSize * 0.1 });
  const barRef = useRef(null);

  useEffect(() => {
    const target = dealSize * 0.1;
    const ctx = gsap.context(() => {
      gsap.to(tweenObj.current, {
        n: target,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (commissionRef.current) {
            commissionRef.current.textContent = formatCurrency(Math.round(tweenObj.current.n));
          }
        },
      });
    });
    return () => ctx.revert();
  }, [dealSize]);

  const pct = ((dealSize - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="border border-border bg-background p-8 md:p-12">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Earnings Calculator</p>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-10 max-w-lg">
        Drag to estimate what a referred engagement is worth to you.
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Engagement Value</span>
            <span className="text-2xl font-bold tracking-tight">{formatCurrency(dealSize)}</span>
          </div>
          <Slider
            value={[dealSize]}
            onValueChange={([v]) => setDealSize(v)}
            min={MIN}
            max={MAX}
            step={STEP}
            className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-[#AFEA00] [&_[role=slider]]:bg-[#AFEA00]"
          />
          <div className="flex justify-between mt-3 text-xs text-muted-foreground font-medium">
            <span>{formatCurrency(MIN)}</span>
            <span>{formatCurrency(MAX)}+</span>
          </div>
        </div>

        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 lg:pl-16">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-3">Your 10% Payout</span>
          <span ref={commissionRef} className="text-5xl md:text-6xl font-bold tracking-tighter text-[#AFEA00] block mb-4">
            {formatCurrency(dealSize * 0.1)}
          </span>
          <div ref={barRef} className="h-1.5 w-full bg-muted overflow-hidden">
            <div
              className="h-full bg-[#AFEA00] transition-all duration-500 ease-out"
              style={{ width: `${Math.max(4, pct)}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Paid out once the client's first invoice clears. No cap on how many people you refer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralCalculator;
