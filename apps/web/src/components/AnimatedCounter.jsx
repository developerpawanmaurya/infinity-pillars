import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Counts up from 0 to `value` once it scrolls into view. Kept generic
// (prefix/suffix/decimals) so it can render "345+", "9.8%", "$2.8M", etc.
// without each case-study page rolling its own tween.
const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0, duration = 1.8, className = '', style }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${obj.n.toFixed(decimals)}${suffix}`;
        },
      });
    });

    return () => ctx.revert();
  }, [value, prefix, suffix, decimals, duration]);

  return <span ref={ref} className={className} style={style}>{prefix}0{suffix}</span>;
};

export default AnimatedCounter;
