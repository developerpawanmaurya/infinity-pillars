import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Variant — Tilt Grid. A uniform grid of tiles, each held at a 16:10
// "laptop webpage" aspect ratio so every screenshot renders in full —
// each tile gets a small scroll parallax on its image and, on fine
// pointers, a mouse-driven 3D tilt (rotate only while hovered — never a
// resting rotation, so raster images stay crisp at rest).
const PortfolioTiltGridSection = ({ projects }) => {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiles = gsap.utils.toArray('[data-tile]', grid);

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(tiles, { opacity: 1, y: 0 });
        return;
      }

      ScrollTrigger.batch(tiles, {
        start: 'top 88%',
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }),
      });

      tiles.forEach((tile) => {
        const img = tile.querySelector('[data-tile-img]');
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
      });
    }, grid);

    return () => ctx.revert();
  }, [projects]);

  const handleMove = (e) => {
    const tile = e.currentTarget;
    const rect = tile.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(tile.querySelector('[data-tile-inner]'), { rotateY: px * 8, rotateX: -py * 8, duration: 0.5, ease: 'power2.out', transformPerspective: 1000 });
    gsap.to(tile.querySelector('[data-tile-img]'), { scale: 1.06, duration: 0.5, ease: 'power2.out' });
  };
  const handleLeave = (e) => {
    const tile = e.currentTarget;
    gsap.to(tile.querySelector('[data-tile-inner]'), { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
    gsap.to(tile.querySelector('[data-tile-img]'), { scale: 1, duration: 0.6, ease: 'power3.out' });
  };

  return (
    <section ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24" aria-label="Portfolio showcase">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {projects.map((project) => (
          <Link
            key={project.slug}
            to={`/portfolio/${project.slug}`}
            data-tile
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="group relative block overflow-hidden rounded-xl aspect-[16/10] bg-black"
            style={{ perspective: 1200 }}
          >
            <div data-tile-inner className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 overflow-hidden">
                <img
                  data-tile-img
                  src={project.image}
                  alt={`${project.title} case study showcase`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 text-white">
                <div className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {project.category}
                </div>
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tighter leading-[0.95]">{project.title}</h2>
                  <ArrowUpRight className="w-8 h-8 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PortfolioTiltGridSection;
