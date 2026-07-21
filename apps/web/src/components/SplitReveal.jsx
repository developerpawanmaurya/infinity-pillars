import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Word-by-word kinetic reveal for headlines — splits `text` into spans and
// stagger-animates them up into place. No SplitText plugin in the bundle
// (it's a paid GSAP add-on), so the split happens by hand at word level.
const SplitReveal = ({ text, as: Tag = 'span', className = '', wordClassName = '', delay = 0, stagger = 0.045, trigger = 'mount' }) => {
  const containerRef = useRef(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const spans = el.querySelectorAll('[data-word]');
    const ctx = gsap.context(() => {
      gsap.fromTo(spans,
        { yPercent: 120, opacity: 0, rotate: 4 },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger,
          delay,
          ...(trigger === 'scroll'
            ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
            : {}),
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay, stagger, trigger]);

  return (
    <Tag ref={containerRef} className={className} style={{ display: 'block' }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span data-word className={wordClassName} style={{ display: 'inline-block', willChange: 'transform' }}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  );
};

export default SplitReveal;
