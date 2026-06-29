import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%∆Ω∑∞≠≈';

function useScramble(target, delay = 0) {
  const [text, setText] = useState('');
  useEffect(() => {
    let frame = 0;
    let raf;
    const total = target.length * 5;
    const timeout = setTimeout(() => {
      const tick = () => {
        const revealed = Math.floor(frame / 5);
        setText(
          target.split('').map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i < revealed) return ch;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }).join('')
        );
        frame++;
        if (frame <= total) raf = requestAnimationFrame(tick);
        else setText(target);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, delay]);
  return text;
}

function Stars() {
  const stars = useRef([]);
  if (!stars.current.length) {
    stars.current = Array.from({ length: 180 }, () => ({
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
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: s.d, repeat: Infinity, delay: Math.random() * 4, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
        boxShadow: '0 0 20px rgba(99,102,241,0.4)',
      }}
      initial={{ top: '-2px' }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    />
  );
}

function Rings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
      {[260, 380, 500, 620].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border border-indigo-500/20"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.12, 0.3] }}
          transition={{ duration: 3 + i * 0.8, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        />
      ))}
      {/* Rotating ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          border: '1px solid transparent',
          borderTopColor: 'rgba(99,102,241,0.7)',
          borderRightColor: 'rgba(139,92,246,0.4)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 240,
          height: 240,
          border: '1px solid transparent',
          borderBottomColor: 'rgba(236,72,153,0.6)',
          borderLeftColor: 'rgba(99,102,241,0.3)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

function GlitchNumber() {
  return (
    <div className="relative select-none" aria-hidden>
      <style>{`
        @keyframes glitch-r {
          0%,100%{transform:translate(0,0);opacity:0}
          20%{transform:translate(-4px,2px);opacity:0.7;clip-path:polygon(0 20%,100% 20%,100% 40%,0 40%)}
          40%{transform:translate(3px,-2px);opacity:0.5;clip-path:polygon(0 60%,100% 60%,100% 75%,0 75%)}
          60%{transform:translate(-2px,3px);opacity:0.6;clip-path:polygon(0 10%,100% 10%,100% 25%,0 25%)}
          80%{transform:translate(4px,0);opacity:0;clip-path:polygon(0 80%,100% 80%,100% 95%,0 95%)}
        }
        @keyframes glitch-b {
          0%,100%{transform:translate(0,0);opacity:0}
          25%{transform:translate(5px,-3px);opacity:0.6;clip-path:polygon(0 45%,100% 45%,100% 65%,0 65%)}
          50%{transform:translate(-3px,2px);opacity:0.4;clip-path:polygon(0 5%,100% 5%,100% 18%,0 18%)}
          75%{transform:translate(2px,4px);opacity:0.5;clip-path:polygon(0 72%,100% 72%,100% 88%,0 88%)}
        }
        @keyframes float-num {
          0%,100%{transform:translateY(0px) rotateX(0deg)}
          50%{transform:translateY(-18px) rotateX(4deg)}
        }
        .num-glitch{animation:float-num 4s ease-in-out infinite}
        .num-glitch::before{content:'404';position:absolute;inset:0;color:#ef4444;animation:glitch-r 3.5s infinite}
        .num-glitch::after{content:'404';position:absolute;inset:0;color:#3b82f6;animation:glitch-b 3.5s infinite 0.4s}
      `}</style>
      <div
        className="num-glitch relative text-[clamp(7rem,22vw,16rem)] font-black tracking-tighter leading-none text-white"
        style={{ textShadow: '0 0 60px rgba(99,102,241,0.5), 0 0 120px rgba(99,102,241,0.2)' }}
      >
        404
      </div>
    </div>
  );
}

function MagneticButton({ to, children, primary }) {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width  / 2) * 0.35);
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.35);
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

function FloatingFragment({ char, x, delay }) {
  return (
    <motion.span
      className="absolute bottom-0 text-indigo-400/30 font-mono text-xs pointer-events-none select-none"
      style={{ left: `${x}%` }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: '-100vh', opacity: [0, 0.6, 0.6, 0] }}
      transition={{ duration: Math.random() * 6 + 6, delay, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      {char}
    </motion.span>
  );
}

const FRAGMENTS = Array.from({ length: 22 }, (_, i) => ({
  char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
  x: Math.random() * 100,
  delay: Math.random() * 8,
}));

export default function NotFoundPage() {
  const heading = useScramble('PAGE NOT FOUND', 400);
  const sub     = useScramble('The coordinates you seek have drifted into the void.', 1200);
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const cx = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const cy = useSpring(cursorY, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const move = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  return (
    <div
      className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center justify-center"
      style={{ perspective: '1000px' }}
    >
      {/* Custom cursor glow */}
      <motion.div
        className="fixed pointer-events-none z-50 rounded-full"
        style={{
          x: cx, y: cy,
          width: 28, height: 28,
          marginLeft: -14, marginTop: -14,
          background: 'radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
        aria-hidden
      />

      <Stars />
      <ScanLine />

      {/* Floating code fragments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {FRAGMENTS.map((f, i) => <FloatingFragment key={i} {...f} />)}
      </div>

      <Rings />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6">

        {/* Error code label */}
        <motion.p
          className="text-[10px] font-black uppercase tracking-[0.35em] text-indigo-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Error — Dimension Not Found
        </motion.p>

        {/* Glitching 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlitchNumber />
        </motion.div>

        {/* Scrambled heading */}
        <motion.h1
          className="font-black text-xl md:text-2xl tracking-[0.25em] text-white/90 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {heading || ' '}
        </motion.h1>

        {/* Scrambled subtext */}
        <motion.p
          className="font-mono text-sm text-white/40 max-w-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {sub || ' '}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-px bg-gradient-to-b from-transparent via-indigo-500/60 to-transparent"
          style={{ height: 48 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />

        {/* Buttons */}
        <motion.div
          className="flex items-center gap-4 flex-wrap justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton to="/" primary>← Return Home</MagneticButton>
          <MagneticButton to="/blog">Go to Blog →</MagneticButton>
        </motion.div>

        {/* Coordinates */}
        <motion.p
          className="font-mono text-[10px] text-white/20 tracking-widest mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          {`LAT: ${(Math.random() * 180 - 90).toFixed(4)}°  ·  LNG: ${(Math.random() * 360 - 180).toFixed(4)}°  ·  ALT: ∞`}
        </motion.p>
      </div>

      {/* Corner coords */}
      <div className="absolute bottom-6 left-6 font-mono text-[10px] text-white/20 space-y-1" aria-hidden>
        <p>SYS:INFINITY_PILLARS</p>
        <p>STATUS:404_VOID</p>
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-white/20 text-right" aria-hidden>
        <p>REF:{Math.random().toString(36).slice(2,10).toUpperCase()}</p>
        <p>T:{Date.now()}</p>
      </div>
    </div>
  );
}
