import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// Ported from Hiro-kiii's "Scroll-Transition" (02-Random-Grid), MIT
// licensed: https://github.com/Hiro-kiii/Scroll-Transition
// A responsive grid of cells (14 cols desktop / 10 tablet / 6 mobile, rows
// computed to match viewport aspect ratio) starts fully transparent; cells
// fade to opaque in a shuffled random order with a 0.02s stagger, revealing
// the masked image beneath. Real local images, English captions.
const IMAGES = ['/images/scroll-transition/4.webp', '/images/scroll-transition/5.webp', '/images/scroll-transition/6.webp'];
const CAPTIONS = [
  { h1: ['FIRST', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by a grid of cells. As you scroll, the cells open in random order, smoothly revealing the next image.' },
  { h1: ['SECOND', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by a grid of cells. As you scroll, the cells open in random order, smoothly revealing the next image.' },
  { h1: ['THIRD', 'IMAGE'], h2: 'Section transition', span: 'The image is masked by a grid of cells. As you scroll, the cells open in random order, smoothly revealing the next image.' },
];

const getGridCols = () => {
  if (window.innerWidth <= 599) return 6;
  if (window.innerWidth <= 1024) return 10;
  return 14;
};

const RandomGrid = () => {
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
      const createCells = (svg, vbHeight) => {
        const g = svg.querySelector('.blinds');
        while (g.firstChild) g.removeChild(g.firstChild);

        const cols = getGridCols();
        const rows = Math.round(cols * (vbHeight / 100));
        const cellW = 100 / cols;
        const cellH = vbHeight / rows;
        const cells = [];

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x * cellW);
            rect.setAttribute('y', y * cellH);
            rect.setAttribute('width', cellW);
            rect.setAttribute('height', cellH);
            rect.setAttribute('fill', 'white');
            rect.setAttribute('shape-rendering', 'crispEdges');
            rect.setAttribute('opacity', 0);
            g.appendChild(rect);
            cells.push(rect);
          }
        }
        return cells;
      };

      const openBlinds = (cells) => {
        const shuffled = gsap.utils.shuffle([...cells]);
        return gsap.timeline().to(shuffled, {
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          stagger: { each: 0.02 },
        });
      };

      const textIn = (el) => gsap.to(el, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 2.6, ease: 'expo.out' });
      const textOut = (el) => gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', y: 0, duration: 2.0, ease: 'power2.inOut' });

      const layout = () => {
        const vbHeight = (window.innerHeight / window.innerWidth) * 100;
        return svgRefs.current.map((svg) => {
          svg.setAttribute('viewBox', `0 0 100 ${vbHeight}`);
          svg.querySelector('mask rect').setAttribute('height', vbHeight);
          svg.querySelector('image').setAttribute('height', vbHeight);
          return createCells(svg, vbHeight);
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

        blindSets.forEach((cells, i) => {
          master.add(openBlinds(cells));
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
        <h1>On-Scroll SVG Mask Transitions<br /><span>(Random Grid)</span></h1>
        <span className="info">Scroll down</span>
      </div>
      <section className="stage" ref={stageRef}>
        <div className="layers">
          {IMAGES.map((src, i) => (
            <svg key={src} className="layer" ref={(el) => (svgRefs.current[i] = el)} viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id={`rg-mask-${i}`} maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g className="blinds" />
                </mask>
              </defs>
              <image href={src} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" mask={`url(#rg-mask-${i})`} />
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

export default RandomGrid;
