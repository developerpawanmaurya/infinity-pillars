import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// This project's own earlier build (kept as-is) — a variant on the same
// SVG-mask "blinds" idea using 30 vertical columns (rather than the real
// demo's horizontal bands) with a shared center line, Infinity Pillars'
// own service imagery/captions.
const BLIND_COLUMNS = 30;

const LAYERS = [
  {
    image: '/images/services/package-1.webp',
    h1: 'Design.',
    h2: 'Conversion-first interfaces',
    desc: 'Every screen engineered around user psychology, not aesthetic preference.',
  },
  {
    image: '/images/services/a-la-carte-2.webp',
    h1: 'Build.',
    h2: 'Full-stack infrastructure',
    desc: 'APIs, automations, and data pipelines — tested before any go-live.',
  },
  {
    image: 'https://images.unsplash.com/photo-1530435460869-d13625c69bbf',
    h1: 'Scale.',
    h2: 'Compounding growth systems',
    desc: 'Search visibility, AI agents, and retention working as one system.',
  },
];

const CustomTransition = () => {
  const stageRef = useRef(null);
  const svgRefs  = useRef([]);
  const txtRefs  = useRef([]);
  const fillRefs = useRef([]);

  useEffect(() => {
    let lenis;
    let ctx;
    let cancelled = false;
    let rafFn;
    let onResize;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const buildBlinds = (svg, vbHeight) => {
      const g = svg.querySelector('.blinds');
      while (g.firstChild) g.removeChild(g.firstChild);

      const colWidth = 100 / BLIND_COLUMNS;
      const centerY = vbHeight / 2;
      const tops = [];
      const bottoms = [];

      for (let i = 0; i < BLIND_COLUMNS; i++) {
        const x = i * colWidth;
        const top = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        top.setAttribute('x', x);
        top.setAttribute('width', colWidth + 0.15);
        top.setAttribute('y', centerY);
        top.setAttribute('height', 0);
        top.setAttribute('fill', '#fff');

        const bottom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bottom.setAttribute('x', x);
        bottom.setAttribute('width', colWidth + 0.15);
        bottom.setAttribute('y', centerY);
        bottom.setAttribute('height', 0);
        bottom.setAttribute('fill', '#fff');

        g.appendChild(top);
        g.appendChild(bottom);
        tops.push(top);
        bottoms.push(bottom);
      }
      return { tops, bottoms, centerY, bottomHeight: vbHeight - centerY };
    };

    const preload = () => Promise.all(
      LAYERS.map((l) => new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = resolve;
        img.src = l.image;
      }))
    );

    preload().then(() => {
      if (cancelled) return;

      lenis = new Lenis({ lerp: isTouch ? 0.15 : 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      rafFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(rafFn);
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        let blindSets = [];

        const layout = () => {
          const vbHeight = (window.innerHeight / window.innerWidth) * 100;
          blindSets = svgRefs.current.map((svg) => {
            svg.setAttribute('viewBox', `0 0 100 ${vbHeight}`);
            svg.querySelector('mask rect').setAttribute('height', vbHeight);
            svg.querySelector('image').setAttribute('height', vbHeight);
            return buildBlinds(svg, vbHeight);
          });
        };
        layout();

        let master;

        const buildTimeline = () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: stageRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 2.5,
              invalidateOnRefresh: true,
            },
          });

          LAYERS.forEach((_, i) => {
            const { tops, bottoms, centerY, bottomHeight } = blindSets[i];
            const slot = i * 3;

            tl.to(tops, {
              attr: { y: 0, height: centerY },
              duration: 1,
              ease: 'power3.out',
              stagger: 0.02,
            }, slot);
            tl.to(bottoms, {
              attr: { height: bottomHeight },
              duration: 1,
              ease: 'power3.out',
              stagger: 0.02,
            }, slot);

            tl.to(txtRefs.current[i], {
              clipPath: 'inset(0% 0% 0% 0%)',
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
            }, slot + 0.6);
            tl.to(txtRefs.current[i], {
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 1.2,
              ease: 'power2.in',
            }, slot + 2);
          });

          return tl;
        };

        master = buildTimeline();

        ScrollTrigger.create({
          trigger: stageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate(self) {
            const step = 1 / LAYERS.length;
            fillRefs.current.forEach((fill, i) => {
              const segStart = i * step;
              const segProgress = gsap.utils.clamp(0, 1, (self.progress - segStart) / step);
              fill.style.width = `${segProgress * 100}%`;
            });
          },
        });

        let resizeTimeout;
        onResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            master.scrollTrigger?.kill();
            master.kill();
            layout();
            master = buildTimeline();
            ScrollTrigger.refresh();
          }, 250);
        };
        window.addEventListener('resize', onResize);
      }, stageRef);
    });

    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener('resize', onResize);
      ctx?.revert();
      if (lenis) {
        if (rafFn) gsap.ticker.remove(rafFn);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div className="sample2">
      <div className="stage" ref={stageRef}>
        <div className="layers">
          {LAYERS.map((layer, i) => (
            <svg
              key={layer.image}
              className="layer"
              ref={(el) => (svgRefs.current[i] = el)}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <mask id={`ct-mask-${i}`} maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g className="blinds" />
                </mask>
              </defs>
              <image
                href={layer.image}
                x="0" y="0" width="100" height="100"
                preserveAspectRatio="xMidYMid slice"
                mask={`url(#ct-mask-${i})`}
              />
            </svg>
          ))}

          {LAYERS.map((layer, i) => (
            <div className="txt" key={layer.h1} ref={(el) => (txtRefs.current[i] = el)}>
              <h1>{layer.h1}</h1>
              <h2>{layer.h2}</h2>
              <span>{layer.desc}</span>
            </div>
          ))}

          <div className="progress-bar">
            {LAYERS.map((layer, i) => (
              <div className="segment" key={layer.image}>
                <div className="fill" ref={(el) => (fillRefs.current[i] = el)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTransition;
