import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioCTALinks from './PortfolioCTALinks.jsx';

gsap.registerPlugin(ScrollTrigger);

// Variant — Quiet Cards. A single, generously-spaced column of large cards;
// the only motion is a clip-path wipe + gentle scale-settle when a card
// scrolls into view, plus a CSS hover lift. Closest in spirit to the
// original layout but tightened into one column with far more restraint —
// the low-risk baseline of this comparison set.
const PortfolioQuietCardsSection = ({ projects }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cards = gsap.utils.toArray('[data-qc-card]', section);

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        const reveal = card.querySelector('[data-qc-reveal]');
        const img = card.querySelector('[data-qc-img]');

        if (prefersReducedMotion) {
          gsap.set(reveal, { clipPath: 'inset(0% 0% 0% 0%)' });
          return;
        }

        gsap.fromTo(reveal, { clipPath: 'inset(0% 0% 100% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        });
        gsap.fromTo(img, { scale: 1.12 }, {
          scale: 1,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section ref={sectionRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32" aria-label="Portfolio showcase">
      {projects.map((project) => (
        <div key={project.slug} data-qc-card className="group">
          <Link to={`/portfolio/${project.slug}`} data-qc-reveal className="block mb-8 editorial-frame overflow-hidden">
            <div data-qc-img className="w-full aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={project.image}
                alt={`${project.title} case study showcase`}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
          </Link>

          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            {project.category}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">{project.title}</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-x-10 gap-y-3 mb-10 border-t border-border pt-6 max-w-2xl">
            {project.metrics.map((metric) => (
              <div key={metric} className="text-sm font-medium">{metric}</div>
            ))}
          </div>
          <PortfolioCTALinks project={project} />
        </div>
      ))}
    </section>
  );
};

export default PortfolioQuietCardsSection;
