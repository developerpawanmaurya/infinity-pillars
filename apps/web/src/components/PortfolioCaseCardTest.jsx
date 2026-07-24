import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// TEST COPY of PortfolioCaseCard — used only on /portfolio-test to verify
// that dropping the permanent Tailwind `rotate-*` class (which forces
// Chromium to resample the raster image at an angle, blurring it at rest)
// actually fixes the reported blur. Delete this file + the route once
// confirmed; don't wire it into the real portfolio page.
const PortfolioCaseCardTest = ({ project, index }) => {
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const reversed = index % 2 === 1;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return undefined;

    const ctx = gsap.context(() => {
      const curtain = card.querySelector('[data-curtain]');
      const img = card.querySelector('[data-parallax-img]');
      const indexNum = card.querySelector('[data-index-num]');
      const metrics = card.querySelectorAll('[data-metric]');
      const category = card.querySelector('[data-category]');
      const titleInner = card.querySelector('[data-title-inner]');
      const desc = card.querySelector('[data-desc]');
      const cta = card.querySelector('[data-cta]');

      gsap.set(card, { autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        defaults: { ease: 'power3.out' },
      });

      tl.fromTo(indexNum, { opacity: 0, x: reversed ? -24 : 24 }, { opacity: 1, x: 0, duration: 0.7 }, 0)
        .fromTo(curtain,
          { scaleX: 1, skewX: reversed ? -6 : 6 },
          { scaleX: 0, skewX: 0, duration: 1, ease: 'power3.inOut', transformOrigin: reversed ? 'left center' : 'right center' },
          0.05)
        .fromTo(img, { scale: 1.15 }, { scale: 1.05, duration: 1.3, ease: 'power2.out' }, 0.05)
        .fromTo(category, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3)
        .fromTo(titleInner, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0.35)
        .fromTo(desc, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0.55)
        .fromTo(metrics, { opacity: 0, y: 16, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 0.6)
        .fromTo(cta, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.9);

      gsap.to(img, {
        yPercent: 3,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to(indexNum, {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    }, card);

    return () => ctx.revert();
  }, [reversed]);

  const handleMouseMove = (e) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(frame, { rotateY: px * 10, rotateX: -py * 10, duration: 0.5, ease: 'power2.out', transformPerspective: 900 });
  };
  const handleMouseLeave = () => {
    gsap.to(frameRef.current, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power3.out' });
  };

  return (
    <div
      ref={cardRef}
      style={{ opacity: 0 }}
      className={`relative flex flex-col gap-12 lg:gap-24 items-center ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'}`}
    >
      {/* Index badge */}
      <span
        data-index-num
        aria-hidden="true"
        className={`hidden lg:block absolute -top-16 select-none pointer-events-none text-[10rem] font-bold leading-none tracking-tighter text-foreground/[0.05] ${reversed ? 'right-0' : 'left-0'}`}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Image Presentation — no static rotate-* class here (that's the fix) */}
      <div className="w-full md:w-1/2" style={{ perspective: 1000 }}>
        <div
          ref={frameRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="editorial-frame relative overflow-hidden">
            <div className="w-full h-[400px] md:h-[600px] overflow-hidden relative">
              <img
                data-parallax-img
                src={project.image}
                alt={`${project.title} case study showcase`}
                className={`w-full h-full object-cover transition-all duration-500 ${project.dark ? 'grayscale brightness-[0.55]' : 'grayscale-[20%] hover:grayscale-0'}`}
              />
              {project.dark && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              )}
            </div>
            {/* Wipe-reveal curtain — animated closed via GSAP on scroll-into-view */}
            <div data-curtain className="absolute inset-0 bg-background z-10" />
          </div>
        </div>
      </div>

      {/* Content Presentation */}
      <div className="w-full md:w-1/2">
        <div data-category className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          {project.category}
        </div>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 overflow-hidden">
          <span data-title-inner className="block">{project.title}</span>
        </h2>
        <p data-desc className="text-xl text-muted-foreground leading-relaxed mb-12">
          {project.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 border-t border-border pt-8">
          {project.metrics.map((metric) => (
            <div data-metric key={metric} className="text-sm font-medium">
              {metric}
            </div>
          ))}
        </div>

        <div data-cta>
          <Link
            to={`/portfolio/${project.slug}`}
            className="group inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300"
          >
            Read full case study
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCaseCardTest;
