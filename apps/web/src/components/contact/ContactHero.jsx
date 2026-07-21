import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PARTICLE_COUNT = 70;
const LINK_DISTANCE = 130;

class Signal {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.22;
    this.vy = (Math.random() - 0.5) * 0.22;
    this.r = 1 + Math.random() * 1.4;
  }

  update(mouse) {
    if (mouse) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120 && dist > 0.01) {
        const force = (1 - dist / 120) * 0.6;
        this.vx += (dx / dist) * force;
        this.vy += (dy / dist) * force;
      }
    }
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -20) this.x = this.w + 20;
    if (this.x > this.w + 20) this.x = -20;
    if (this.y < -20) this.y = this.h + 20;
    if (this.y > this.h + 20) this.y = -20;
  }
}

// Ambient "signal network" — dots drifting and linking with faint lines
// when close, gently repelled by the cursor. Purely decorative/idle: it
// never gates the real content, which renders (and animates in) on mount
// regardless of whether this canvas runs.
function SignalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = canvas.getContext('2d');
    const state = { particles: [], mouse: null };

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      state.particles.forEach((p) => { p.w = canvas.width; p.h = canvas.height; });
    };
    resize();
    state.particles = Array.from({ length: PARTICLE_COUNT }, () => new Signal(canvas.width, canvas.height));

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { state.mouse = null; };
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { particles } = state;

      for (const p of particles) p.update(state.mouse);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(120, 130, 90, ${(1 - dist / LINK_DISTANCE) * 0.16})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(175, 234, 0, 0.55)';
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
}

const ContactHero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background flex items-center">
      <SignalCanvas />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 border border-[#AFEA00]/40 bg-[#AFEA00]/5 px-4 py-2 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AFEA00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AFEA00]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-[#AFEA00]">Get In Touch</span>
        </motion.div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-10">
          <SplitReveal text="Let's talk." trigger="mount" delay={0.15} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-12"
        >
          No forms-into-the-void. A real person reads every message and replies within one business day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6"
        >
          <MagneticButton>
            <Button
              asChild
              size="lg"
              className="bg-[#AFEA00] text-black hover:bg-[#AFEA00]/90 transition-all duration-200 active:scale-[0.98] rounded-none px-10 py-7 text-base shadow-editorial"
            >
              <Link to="#booking">
                Book Audit Call <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </MagneticButton>
          <a
            href="#contact-form"
            className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300"
          >
            Send a Message
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground"
      >
        <span className="text-[0.65rem] font-bold uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
};

export default ContactHero;
