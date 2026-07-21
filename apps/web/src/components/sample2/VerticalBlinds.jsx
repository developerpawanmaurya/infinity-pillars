import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Ported from Hiro-kiii's "Scroll-Transition" (03-Vertical-Blinds), MIT
// licensed: https://github.com/Hiro-kiii/Scroll-Transition
// 12 tall vertical column-pairs (mirror of Horizontal Blinds, columns
// instead of bands): each pair grows from its own center outward. The
// FIRST layer starts already fully open (matching the source exactly —
// `isFirstLayer` pre-sizes its rects instead of animating from zero), so
// the first image is visible immediately with no opening animation; every
// later layer opens normally. The master timeline also differs from the
// other variants: captions fade out before the next layer's blinds open,
// rather than each layer owning an independent in/out pair.
const IMAGES = ['/images/scroll-transition/7.webp', '/images/scroll-transition/8.webp', '/images/scroll-transition/9.webp'];
const CAPTIONS = [
  { h1: ['FIRST', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by several tall vertical bands. As you scroll, each band opens in sequence, smoothly revealing the next image.' },
  { h1: ['SECOND', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by several tall vertical bands. As you scroll, each band opens in sequence, smoothly revealing the next image.' },
  { h1: ['THIRD', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by several tall vertical bands. As you scroll, each band opens in sequence, smoothly revealing the next image.' },
];
const BLIND_COUNT = 12;

const VerticalBlinds = () => {
  const svgRefs = useRef([]);
  const txtRefs = useRef([]);
  const fillRefs = useRef([]);
  const stageRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    let master;
    let resizeTimer;
    let onResize;

    const ctx = gsap.context(() => {
      const createBlinds = (svg, isFirstLayer, vbWidth) => {
        const g = svg.querySelector('.blinds');
        while (g.firstChild) g.removeChild(g.firstChild);

        const w = vbWidth / BLIND_COUNT;
        const blinds = [];
        let currentX = 0;
        for (let i = 0; i < BLIND_COUNT; i++) {
          const centerX = currentX + w / 2;
          const left = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          const right = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          [left, right].forEach((r) => {
            r.setAttribute('y', 0);
            r.setAttribute('height', 100);
            r.setAttribute('width', isFirstLayer ? w / 2 + 0.1 : 0);
            r.setAttribute('fill', 'white');
            r.setAttribute('shape-rendering', 'crispEdges');
          });
          if (isFirstLayer) {
            left.setAttribute('x', centerX - w / 2);
            right.setAttribute('x', centerX);
          } else {
            left.setAttribute('x', centerX);
            right.setAttribute('x', centerX);
          }
          g.appendChild(left);
          g.appendChild(right);
          blinds.push({ left, right, x: centerX, w: w / 2 });
          currentX += w;
        }
        return blinds;
      };

      const openBlinds = (blinds) => gsap.to(
        blinds.flatMap((b) => [b.left, b.right]),
        {
          attr: {
            x: (i) => { const b = blinds[Math.floor(i / 2)]; return i % 2 === 0 ? b.x - b.w : b.x; },
            width: (i) => blinds[Math.floor(i / 2)].w + 0.05,
          },
          ease: 'none',
          stagger: { each: 0.02, from: 'start' },
        },
      );

      const layout = () => {
        const vbWidth = (window.innerWidth / window.innerHeight) * 100;
        return svgRefs.current.map((svg, i) => {
          svg.setAttribute('viewBox', `0 0 ${vbWidth} 100`);
          svg.querySelector('mask rect').setAttribute('width', vbWidth);
          const img = svg.querySelector('image');
          img.setAttribute('width', vbWidth);
          img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
          return createBlinds(svg, i === 0, vbWidth);
        });
      };

      const buildTimeline = () => {
        if (master) master.kill();
        const blindSets = layout();
        const texts = txtRefs.current;

        master = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2.0,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(texts, { clipPath: 'inset(0% 0% 100% 0%)', y: 40, opacity: 0 });
        gsap.set(texts[0], { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1 });

        blindSets.forEach((blinds, i) => {
          if (i === 0) return;
          if (texts[i - 1]) {
            master.to(texts[i - 1], { clipPath: 'inset(0% 0% 100% 0%)', y: -40, opacity: 0, duration: 0.8 }, '>');
          }
          master.add(openBlinds(blinds), '-=0.3');
          if (texts[i]) {
            master.to(texts[i], { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1, duration: 0.8 }, '-=0.5');
          }
          master.to({}, { duration: 1 });
        });

        ScrollTrigger.create({
          trigger: stageRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate(self) {
            const step = 1 / fillRefs.current.length;
            fillRefs.current.forEach((fill, i) => {
              const p = gsap.utils.clamp(0, 1, (self.progress - i * step) / step);
              fill.style.width = `${p * 100}%`;
            });
          },
        });
      };

      buildTimeline();

      onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildTimeline, 250);
      };
      window.addEventListener('resize', onResize);
    });

    return () => {
      if (onResize) window.removeEventListener('resize', onResize);
      ctx.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="svgmask">
      <div className="spacer">
        <h1>On-Scroll SVG Mask Transitions<br /><span>(Vertical Blinds)</span></h1>
        <span className="info">Scroll down</span>
      </div>
      <section className="stage" ref={stageRef}>
        <div className="layers">
          {IMAGES.map((src, i) => (
            <svg key={src} className="layer" ref={(el) => (svgRefs.current[i] = el)} viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id={`vb-mask-${i}`} maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g className="blinds" />
                </mask>
              </defs>
              <image href={src} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" mask={`url(#vb-mask-${i})`} />
            </svg>
          ))}
          <div className="progress-bar">
            {CAPTIONS.map((_, i) => <div className="segment" key={i}><div className="fill" ref={(el) => (fillRefs.current[i] = el)} /></div>)}
          </div>
          <div className="texts">
            {CAPTIONS.map((c, i) => (
              <div className="txt" key={i} ref={(el) => (txtRefs.current[i] = el)}>
                <h1>{c.h1[0]}<br />{c.h1[1]}</h1>
                <h2>{c.h2}</h2>
                <span>{c.span}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerticalBlinds;
