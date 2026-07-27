import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Variant C — Editorial Index + Cursor Preview. No static images in the row
// itself — just huge type. On desktop, hovering a row floats a live image
// preview that trails the cursor (Framer Motion springs); on touch devices
// (no hover to trigger from) each row instead shows its image inline,
// always visible. The preview panel never carries a resting rotation, only
// a clip-path/scale entrance, so there's no raster-blur risk at rest.
const PortfolioIndexSection = ({ projects }) => {
  const containerRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  // Read synchronously (lazy init) rather than defaulting to false and
  // flipping in an effect — that one-render lag briefly rendered every
  // row's inline fallback image block (tall layout) before collapsing to
  // the compact hover-preview layout, which threw off ScrollTrigger
  // measurements for anything below this section (see AnimatedCounter).
  const [pointerFine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  const prefersReducedMotion = useReducedMotion();

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 300, damping: 30, mass: 0.5 });
  const springY = useSpring(mvY, { stiffness: 300, damping: 30, mass: 0.5 });

  const showFloatingPreview = pointerFine && !prefersReducedMotion;

  const handleMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    mvX.set(e.clientX - rect.left);
    mvY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={showFloatingPreview ? handleMove : undefined}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      aria-label="Portfolio showcase"
    >
      {showFloatingPreview && (
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              key={projects[hovered].slug}
              aria-hidden="true"
              className="hidden sm:block absolute z-30 pointer-events-none w-[360px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-muted"
              style={{ left: springX, top: springY, x: '-30%', y: '-120%' }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={projects[hovered].image} alt="" className="w-full h-full object-contain" />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div>
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            to={`/portfolio/${project.slug}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="group block border-t border-border last:border-b py-10 md:py-14"
          >
            <div className={`flex items-start gap-6 md:gap-10 ${showFloatingPreview ? 'md:items-center' : ''}`}>
              <span className={`text-sm md:text-base font-bold text-muted-foreground/50 tabular-nums pt-2 ${showFloatingPreview ? 'md:pt-0' : ''}`}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="flex-1 min-w-0">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] transition-colors duration-300 group-hover:text-muted-foreground">
                  {project.title}
                </h2>
                <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground mt-3">
                  {project.category}
                </div>

                {/* Fallback for anything that doesn't get the floating hover
                    preview — touch phones AND touch tablets/laptops alike,
                    regardless of viewport width. Gated on the same
                    `showFloatingPreview` capability check as the floating
                    panel itself, not a CSS width breakpoint, so the image
                    never just disappears on a touch device wider than 768px. */}
                {!showFloatingPreview && (
                  <div className="mt-6">
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-muted">
                      <img
                        src={project.image}
                        alt={`${project.title} case study showcase`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {project.metrics.map((metric) => (
                        <div key={metric} className="text-xs font-medium text-muted-foreground">{metric}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <ArrowUpRight className="hidden md:block w-8 h-8 lg:w-12 lg:h-12 shrink-0 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2 text-muted-foreground/40 group-hover:text-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PortfolioIndexSection;
