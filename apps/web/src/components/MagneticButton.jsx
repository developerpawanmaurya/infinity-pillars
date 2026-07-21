import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Wraps any element (typically a CTA button) and pulls it a few pixels
// toward the cursor while hovered, springing back on leave. Cheap tactile
// polish — most of the effect is in the spring-back, not the pull.
const MagneticButton = ({ children, className = '', strength = 0.3, maxOffset = 10 }) => {
  const ref = useRef(null);
  const quickX = useRef(null);
  const quickY = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    quickX.current = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    quickY.current = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const clamp = gsap.utils.clamp(-maxOffset, maxOffset);

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      quickX.current(clamp((e.clientX - (rect.left + rect.width / 2)) * strength));
      quickY.current(clamp((e.clientY - (rect.top + rect.height / 2)) * strength));
    };
    const handleLeave = () => {
      quickX.current(0);
      quickY.current(0);
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength, maxOffset]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default MagneticButton;
