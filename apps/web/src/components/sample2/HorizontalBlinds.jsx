import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Ported from Hiro-kiii's "Scroll-Transition" (01-Horizontal-Blinds),
// MIT licensed: https://github.com/Hiro-kiii/Scroll-Transition
// 30 full-width horizontal bands stack the whole image top-to-bottom; each
// band's top/bottom halves grow from that band's own center line outward.
// A 0.02s stagger across all 60 half-rects (ordered bottom band first, per
// the source's centerY math) makes the reveal cascade from the bottom band
// up to the top. Real local images, English captions (translated/adapted
// from the source's Japanese descriptions).
const IMAGES = ['/images/scroll-transition/1.webp', '/images/scroll-transition/2.webp', '/images/scroll-transition/3.webp'];
const CAPTIONS = [
  { h1: ['FIRST', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by several wide horizontal bands. As you scroll, each band opens in sequence, smoothly revealing the next image.' },
  { h1: ['SECOND', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by several wide horizontal bands. As you scroll, each band opens in sequence, smoothly revealing the next image.' },
  { h1: ['THIRD', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by several wide horizontal bands. As you scroll, each band opens in sequence, smoothly revealing the next image.' },
];
const BLIND_COUNT = 30;

const HorizontalBlinds = () => {
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
      const createBlinds = (svg, vbHeight) => {
        const g = svg.querySelector('.blinds');
        while (g.firstChild) g.removeChild(g.firstChild);

        const h = vbHeight / BLIND_COUNT;
        const blinds = [];
        let currentY = 0;
        for (let i = 0; i < BLIND_COUNT; i++) {
          const centerY = vbHeight - (currentY + h / 2);
          const top = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          const bottom = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          [top, bottom].forEach((r) => {
            r.setAttribute('x', 0);
            r.setAttribute('width', 100);
            r.setAttribute('height', 0);
            r.setAttribute('y', centerY);
            r.setAttribute('fill', 'white');
            r.setAttribute('shape-rendering', 'crispEdges');
          });
          g.appendChild(top);
          g.appendChild(bottom);
          blinds.push({ top, bottom, y: centerY, h: h / 2 });
          currentY += h;
        }
        return blinds;
      };

      const openBlinds = (blinds) => gsap.timeline().to(
        blinds.flatMap((b) => [b.top, b.bottom]),
        {
          attr: {
            y: (i) => { const b = blinds[Math.floor(i / 2)]; return i % 2 === 0 ? b.y - b.h : b.y; },
            height: (i) => blinds[Math.floor(i / 2)].h + 0.01,
          },
          ease: 'power3.out',
          stagger: { each: 0.02, from: 'start' },
        },
      );

      const textIn = (el) => gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.5, ease: 'expo.out' });
      const textOut = (el) => gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', y: -30, duration: 1.2, ease: 'power2.inOut' });

      const layout = () => {
        const vbHeight = (window.innerHeight / window.innerWidth) * 100;
        return svgRefs.current.map((svg) => {
          svg.setAttribute('viewBox', `0 0 100 ${vbHeight}`);
          svg.querySelector('mask rect').setAttribute('height', vbHeight);
          svg.querySelector('image').setAttribute('height', vbHeight);
          return createBlinds(svg, vbHeight);
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
            scrub: 2.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        blindSets.forEach((blinds, i) => {
          master.add(openBlinds(blinds));
          if (texts[i]) {
            master.add(textIn(texts[i]), '-=0.3');
            master.add(textOut(texts[i]), '+=0.8');
          }
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
        <h1>On-Scroll SVG Mask Transitions<br /><span>(Horizontal Blinds)</span></h1>
        <span className="info">Scroll down</span>
      </div>
      <section className="stage" ref={stageRef}>
        <div className="layers">
          {IMAGES.map((src, i) => (
            <svg key={src} className="layer" ref={(el) => (svgRefs.current[i] = el)} viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id={`hb-mask-${i}`} maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g className="blinds" />
                </mask>
              </defs>
              <image href={src} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" mask={`url(#hb-mask-${i})`} />
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

export default HorizontalBlinds;
