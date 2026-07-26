import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioCTALinks from './PortfolioCTALinks.jsx';

gsap.registerPlugin(ScrollTrigger);

// Variant — Scrub Slideshow. One large sticky image area crossfades between
// projects as a tall scroll driver passes by (opacity-only, no pin, no
// drag) — calmer than a pinned horizontal reel. A thumbnail rail lets you
// jump straight to a project; jumps go through the page's Lenis instance
// (passed down as `lenisRef`) so they stay in the same smooth-scroll system
// instead of fighting it with a native scrollIntoView.
const PortfolioScrubSlideshowSection = ({ projects, lenisRef }) => {
  const wrapperRef = useRef(null);
  const imgRefs = useRef([]);
  const contentRefs = useRef([]);
  const anchorRefs = useRef([]);
  const railRefs = useRef([]);
  imgRefs.current = [];
  contentRefs.current = [];
  anchorRefs.current = [];
  railRefs.current = [];

  const n = projects.length;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      imgRefs.current.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
      contentRefs.current.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0, y: 0 }));
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(imgRefs.current[0], { opacity: 1 });
      gsap.set(contentRefs.current[0], { opacity: 1, y: 0 });
      for (let i = 1; i < n; i += 1) {
        gsap.set(imgRefs.current[i], { opacity: 0 });
        gsap.set(contentRefs.current[i], { opacity: 0, y: 16 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const active = Math.min(n - 1, Math.round(self.progress * (n - 1)));
            railRefs.current.forEach((r, i) => gsap.to(r, { opacity: i === active ? 1 : 0.35, duration: 0.2, overwrite: 'auto' }));
          },
        },
        defaults: { duration: 1, ease: 'power2.inOut' },
      });

      for (let i = 0; i < n - 1; i += 1) {
        tl.to(imgRefs.current[i], { opacity: 0 }, i)
          .to(imgRefs.current[i + 1], { opacity: 1 }, i)
          .to(contentRefs.current[i], { opacity: 0, y: -16, duration: 0.5 }, i)
          .to(contentRefs.current[i + 1], { opacity: 1, y: 0, duration: 0.5 }, i + 0.5);
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [n]);

  const goTo = (i) => {
    const target = anchorRefs.current[i];
    if (!target) return;
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(target, { duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section ref={wrapperRef} style={{ height: `${n * 100}vh` }} className="relative bg-foreground" aria-label="Portfolio showcase">
      {projects.map((project, i) => (
        <div
          key={`anchor-${project.slug}`}
          ref={(el) => { anchorRefs.current[i] = el; }}
          className="absolute left-0 w-px h-px"
          style={{ top: `${(i / Math.max(n - 1, 1)) * 100}%` }}
          aria-hidden="true"
        />
      ))}

      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center px-6 sm:px-10 md:px-16 py-12">
        {/* Framed "laptop screen" — the full, uncropped screenshot */}
        <div className="relative w-full max-w-5xl aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-black mb-10">
          {projects.map((project, i) => (
            <div key={project.slug} ref={(el) => { imgRefs.current[i] = el; }} className="absolute inset-0">
              <img src={project.image} alt={`${project.title} case study showcase`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>

        <div className="relative w-full max-w-2xl text-center min-h-[180px]">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              ref={(el) => { contentRefs.current[i] = el; }}
              className="absolute inset-0 flex flex-col items-center"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-white/70 mb-3">{project.category}</div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">{project.title}</h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 max-w-xl">{project.description}</p>
              <PortfolioCTALinks project={project} dark />
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-20">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              ref={(el) => { railRefs.current[i] = el; }}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Jump to ${project.title}`}
              className="w-16 aspect-[16/10] rounded-md overflow-hidden border border-white/30 bg-black"
              style={{ opacity: i === 0 ? 1 : 0.35 }}
            >
              <img src={project.image} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioScrubSlideshowSection;
