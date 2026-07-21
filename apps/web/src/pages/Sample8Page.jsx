import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './Sample8.css';

gsap.registerPlugin(ScrollTrigger);

// Recreates GreenSock's official CodePen "ScrollTrigger Image Zoom"
// (codepen.io/GreenSock/pen/YzbPYMx) — the pen itself couldn't be fetched
// (CodePen returns 403 to automated requests), so this is built from the
// well-documented, publicly-taught technique its own title names: pin a
// section in place with ScrollTrigger, then scrub an image's scale up
// (transform-origin centred) so the page holds still while the photo
// zooms in, easing back out to normal flow once the pin releases.
// Independent code, written from scratch. Image is the project's own
// existing service illustration, already used elsewhere on the site.
const ZOOM_FROM = 1;
const ZOOM_TO = 2.6;

const Sample8Page = () => {
  const zoomSectionRef = useRef(null);
  const imgRef = useRef(null);
  const captionRef = useRef(null);

  useEffect(() => {
    const section = zoomSectionRef.current;
    const img = imgRef.current;
    const caption = captionRef.current;
    if (!section || !img || !caption) return undefined;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    let onResize;

    const ctx = gsap.context(() => {
      gsap.set(img, { scale: ZOOM_FROM });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(img, { scale: ZOOM_TO, ease: 'none' }, 0);
      tl.to(caption, { autoAlpha: 0, y: -20, ease: 'none' }, 0.3);

      onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);
    }, section);

    return () => {
      if (onResize) window.removeEventListener('resize', onResize);
      ctx.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="sample8-page">
      <Helmet>
        <title>Sample 8 — ScrollTrigger Image Zoom | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample8-page__back">&larr; Back</Link>

      <div className="sample8-intro">
        <h1>ScrollTrigger Image Zoom</h1>
        <span>Scroll down</span>
      </div>

      <section className="sample8-zoom" ref={zoomSectionRef}>
        <div className="sample8-zoom__media">
          <img ref={imgRef} src="/images/services/package-1.webp" alt="Zooming product illustration" />
        </div>
        <div className="sample8-zoom__caption" ref={captionRef}>
          <h2>One Image, Held in Place</h2>
          <p>The section pins while the photo scales up underneath your scroll.</p>
        </div>
      </section>

      <div className="sample8-outro">
        <h2>Once the pin releases, the page continues on as normal.</h2>
      </div>
    </div>
  );
};

export default Sample8Page;
