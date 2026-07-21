import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './CatalogSample.css';

gsap.registerPlugin(ScrollTrigger);

// Ported from Codrops' "Rotating On-Scroll Animations" (Demo 1) — MIT
// licensed, source: https://github.com/codrops/RotatingOnScrollAnimations
// The animation mechanics (sine-wave zigzag positioning, per-item rotation
// scrubbed to scroll, Z-depth wobble, marquee scroll) are ported faithfully.
// Only the gallery images and marquee text are ours — their curated
// photography and name list weren't reused, just the technique.
const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1750056393306-ac672d0dbb8c',
  'https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8',
  'https://images.unsplash.com/photo-1637937459053-c788742455be',
  'https://images.unsplash.com/photo-1530435460869-d13625c69bbf',
  'https://images.unsplash.com/photo-1658753145551-8f44e5811d21',
  'https://images.unsplash.com/photo-1722159475082-0a2331580de3',
  '/images/services/package-1.webp',
  '/images/services/package-2.webp',
  '/images/services/a-la-carte-1.webp',
  '/images/services/a-la-carte-2.webp',
  '/images/services/a-la-carte-3.webp',
  'https://images.unsplash.com/photo-1567080185975-88eedc2b273a',
];

const MARQUEE_WORDS = [
  'Web Design', 'Local SEO', 'AI Automation', 'Growth Systems', 'Conversion',
  'Infrastructure', 'Strategy', 'Engineering', 'Scale', 'Results',
];

const CatalogSamplePage = () => {
  const galleryRef  = useRef(null);
  const markRef     = useRef(null);
  const markerInner = useRef(null);

  useEffect(() => {
    let lenis;
    let ctx;
    let cancelled = false;
    let rafFn;
    let onResize;

    const preload = () => Promise.all(
      GALLERY_IMAGES.map((src) => new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = resolve;
        img.src = src;
      }))
    );

    preload().then(() => {
      if (cancelled) return;

      lenis = new Lenis();
      lenis.on('scroll', ScrollTrigger.update);
      // Named, stable reference — needed so gsap.ticker.remove() below
      // actually removes it. Passing a fresh arrow function to `.remove()`
      // (as this originally did) doesn't match by reference, so the ticker
      // callback silently never gets removed on unmount.
      rafFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(rafFn);
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        const wraps = gsap.utils.toArray('.gallery__item-wrap', galleryRef.current);
        const items = gsap.utils.toArray('.gallery__item', galleryRef.current);

        const positionItems = () => {
          const amplitude = window.innerWidth * 0.2;
          wraps.forEach((wrap, i) => {
            const angle = i * 0.45;
            gsap.set(wrap, { x: Math.sin(angle) * amplitude });
          });
        };
        positionItems();

        items.forEach((item) => {
          const rotationX = gsap.utils.random(70, 120);
          const rotationY = gsap.utils.random(-20, 20);
          const rotationZ = gsap.utils.random(-20, 20);
          const setZ = gsap.quickSetter(item, 'z', 'px');
          gsap.fromTo(item, { rotationX, rotationY, rotationZ }, {
            rotationX: -rotationX,
            rotationY: -rotationY,
            rotationZ: -rotationZ,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom+=20%',
              end: 'bottom top-=20%',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate(self) {
                const z = Math.sin(self.progress * Math.PI) * -50;
                setZ(z);
              },
            },
          });
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }).fromTo(markerInner.current, { x: '100vw' }, { x: '-100%', ease: 'none' });

        // Plain outer-scoped var, not ctx.add(...) — ctx.add() called from
        // inside gsap.context()'s own initializer callback fails, because
        // gsap.context() runs that callback SYNCHRONOUSLY before it returns,
        // so the outer `ctx =` assignment hasn't happened yet at the point
        // this code runs (confirmed via the resulting "Cannot read
        // properties of undefined (reading 'add')" error). A plain DOM
        // listener doesn't need ctx tracking anyway — just clean it up
        // directly below.
        onResize = () => { positionItems(); ScrollTrigger.refresh(); };
        window.addEventListener('resize', onResize);
      }, galleryRef);
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
    <>
      <Helmet>
        <title>Catalog Sample — Rotating On-Scroll Gallery</title>
        <meta name="description" content="Internal catalog sample: rotating on-scroll image gallery effect." />
      </Helmet>

      <div className="catalog-sample">
        <header className="frame">
          <nav className="frame__links">
            <Link to="/">← Back to site</Link>
          </nav>
        </header>

        <div className="gallery" ref={galleryRef}>
          {GALLERY_IMAGES.map((src, i) => (
            <div className="gallery__item-wrap" key={i}>
              <div className="gallery__item" style={{ backgroundImage: `url('${src}')` }} />
            </div>
          ))}
        </div>

        <div className="mark" ref={markRef}>
          <div className="mark__inner" ref={markerInner}>
            {MARQUEE_WORDS.map((word, i) => (
              <React.Fragment key={i}>
                <span>{word}</span>
                {i < MARQUEE_WORDS.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogSamplePage;
