import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioCTALinks from './PortfolioCTALinks.jsx';

gsap.registerPlugin(ScrollTrigger);

// Variant — Sidebar Selector. A project-name list drives a detail pane via
// click, not scroll — feels like an interactive portfolio "app" rather than
// a page. The active-row indicator uses a Framer Motion shared layoutId so
// it glides between rows instead of just toggling. Framer Motion is the
// right tool here (per the framer-motion sub-skill: React UI interactions,
// not scroll-driven cinematics) — GSAP only handles the one-time section
// entrance.
const PortfolioSidebarSelectorSection = ({ projects }) => {
  const [selected, setSelected] = useState(0);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  const active = projects[selected];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(section, { opacity: 0, y: 24 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true },
      });
    }, section);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" aria-label="Portfolio showcase">
      <div className="flex flex-col md:grid md:grid-cols-[260px_1fr] gap-8 md:gap-16">
        {/* Selector list */}
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-r border-border pb-2 md:pb-0 md:pr-8">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative shrink-0 text-left px-4 py-4 md:px-0 md:py-5 text-lg md:text-2xl font-bold tracking-tight transition-colors duration-300 whitespace-nowrap md:whitespace-normal ${
                i === selected ? 'text-foreground' : 'text-muted-foreground/50 hover:text-muted-foreground'
              }`}
            >
              {i === selected && (
                <motion.span
                  layoutId="sidebar-active-indicator"
                  className="absolute left-0 right-0 bottom-0 h-[2px] md:top-0 md:bottom-0 md:h-auto md:w-[2px] md:right-auto bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              {project.title}
            </button>
          ))}
        </div>

        {/* Detail pane */}
        <div className="relative min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: prefersReducedMotion ? 0.15 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid md:grid-cols-2 gap-10 items-center"
            >
              <div className="editorial-frame overflow-hidden order-2 md:order-1 bg-muted">
                <img
                  src={active.image}
                  alt={`${active.title} case study showcase`}
                  className="w-full aspect-[16/10] object-contain"
                />
              </div>
              <div className="order-1 md:order-2">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  {active.category}
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">{active.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{active.description}</p>
                <div className="flex flex-wrap gap-x-8 gap-y-3 mb-8 border-t border-border pt-6">
                  {active.metrics.map((metric) => (
                    <div key={metric} className="text-sm font-medium">{metric}</div>
                  ))}
                </div>
                <PortfolioCTALinks project={active} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSidebarSelectorSection;
