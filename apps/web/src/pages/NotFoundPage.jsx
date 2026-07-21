import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring } from 'framer-motion';
import BulgeText from '../components/BulgeText.jsx';

function Stars() {
  const stars = useRef([]);
  if (!stars.current.length) {
    stars.current = Array.from({ length: 140 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.8 + 0.3,
      d: Math.random() * 4 + 2,
    }));
  }
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.current.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: s.d, repeat: Infinity, delay: Math.random() * 4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function MagneticButton({ to, children, primary }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x, y }}>
      <Link
        to={to}
        className={`inline-flex items-center gap-2 px-7 py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-200 ${
          primary
            ? 'bg-white text-black hover:bg-indigo-400 hover:text-white'
            : 'border border-white/30 text-white/70 hover:border-white hover:text-white'
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center">
      <Stars />

      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 w-full">
        <motion.p
          className="text-[10px] font-black uppercase tracking-[0.35em] text-indigo-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Error — Dimension Not Found
        </motion.p>

        <motion.div
          className="w-full max-w-5xl"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <BulgeText className="h-[42vh] md:h-[48vh] w-full" />
        </motion.div>

        <motion.p
          className="font-mono text-sm text-white/40 max-w-sm leading-relaxed -mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The coordinates you seek have drifted into the void. Move your cursor over the text above.
        </motion.p>

        <motion.div
          className="w-px bg-gradient-to-b from-transparent via-indigo-500/60 to-transparent"
          style={{ height: 48 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />

        <motion.div
          className="flex items-center gap-4 flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton to="/" primary>← Return Home</MagneticButton>
          <MagneticButton to="/blog">Go to Blog →</MagneticButton>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/20 space-y-1" aria-hidden>
        <p>SYS:INFINITY_PILLARS</p>
        <p>STATUS:404_VOID</p>
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-white/20 text-right" aria-hidden>
        <p>REF:{Math.random().toString(36).slice(2, 10).toUpperCase()}</p>
      </div>
    </div>
  );
}
