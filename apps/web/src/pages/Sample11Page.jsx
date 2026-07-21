import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import './Sample11.css';

// Ported from d3adrabbit's Codrops demo "Entrance Animation for Images"
// (MIT licensed, tympanus.net/Development/EntranceAnimationForImages/):
// eight cards fly in from below the fold, rotated flat (rotateX -180,
// scale 3), settle into a shared 3D transform origin, spin into a ring
// around that origin, expand outward into a circle, flip face-out
// (rotateY 180), then loop forever — the whole group slowly turning while
// a random card flips again every couple of seconds. The repo ships three
// variations (index/index2/index3.html); this ports "Variation 1", the
// demo's default entry point. Independent implementation, written from
// scratch — no CSS/JS source copied, only the GSAP tween values/sequence
// (radius math, stagger, easing), which are functional, not creative.
// Images are the demo's own real assets (its README credits them "Images
// generated with Midjourney"), reused directly per the repo's MIT license
// with no reuse restriction stated for them. Heading copy below is our
// own original writing, not the demo's own placeholder brand text.
const IMAGES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/images/entrance-animation/${n}.jpg`);

const Sample11Page = () => {
  const rootRef = useRef(null);
  const groupRef = useRef(null);
  const cardRefs = useRef([]);
  const imgRefs = useRef([]);
  const headingRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      IMAGES.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isLoading) return undefined;

    const cards = cardRefs.current.filter(Boolean);
    const firstImg = imgRefs.current[0];
    if (!cards.length || !firstImg) return undefined;

    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: '(min-width: 53em)', isMobile: '(max-width: 53em)' },
      (context) => {
        const { isDesktop } = context.conditions;
        const count = cards.length;
        const sliceAngle = (2 * Math.PI) / count;

        const radius1 = 50 + firstImg.clientHeight / 2;
        const radius2 = (isDesktop ? 250 : 180) - radius1;

        const tl = gsap
          .timeline()
          .from(cards, {
            y: window.innerHeight / 2 + firstImg.clientHeight * 1.5,
            rotateX: -180,
            stagger: 0.1,
            duration: 0.5,
            opacity: 0.8,
            scale: 3,
          })
          .set(cards, {
            transformOrigin: `center ${radius1 + firstImg.clientHeight / 2}px`,
          })
          .set(groupRef.current, { transformStyle: 'preserve-3d' })
          .to(cards, { y: -radius1, duration: 0.5, ease: 'power1.out' })
          .to(
            cards,
            {
              rotation: (index) => (index * 360) / count,
              rotateY: 15,
              duration: 1,
              ease: 'power1.out',
            },
            '<',
          )
          .to(cards, {
            x: (index) => Math.round(radius2 * Math.cos(sliceAngle * index - Math.PI / 4)),
            y: (index) => Math.round(radius2 * Math.sin(sliceAngle * index - Math.PI / 4)) - radius1,
            rotation: (index) => (index + 1) * (360 / count),
          })
          .to(cards, { rotateY: 180, opacity: 0.8, duration: 1 }, '<')
          .from(headingRef.current, { opacity: 0, filter: 'blur(60px)', duration: 1 }, '<')
          .to(cards, {
            repeat: -1,
            duration: 2,
            onRepeat: () => {
              gsap.to(cards[Math.floor(Math.random() * count)], { rotateY: '+=180' });
            },
          })
          .to(groupRef.current, { rotation: 360, duration: 20, repeat: -1, ease: 'none' }, '<-=2');

        return () => tl.kill();
      },
    );

    return () => mm.revert();
  }, [isLoading]);

  return (
    <div className={`sample11-page${isLoading ? ' is-loading' : ''}`} ref={rootRef}>
      <Helmet>
        <title>Sample 11 — Entrance Animation for Images | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample11-page__back">&larr; Back</Link>

      <div className="sample11-content">
        <div className="sample11-scene">
          <div className="sample11-group" ref={groupRef}>
            {IMAGES.map((src, i) => (
              <div className="sample11-card" key={src} ref={(el) => (cardRefs.current[i] = el)}>
                <div
                  className="sample11-card__img"
                  ref={(el) => (imgRefs.current[i] = el)}
                  style={{ backgroundImage: `url(${src})` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sample11-headings" ref={headingRef}>
          <h1 className="sample11-headings__main">Quiet</h1>
          <h1 className="sample11-headings__main">Orbit</h1>
          <h5 className="sample11-headings__sub">2026</h5>
        </div>
      </div>

      <div className="sample11-hint">Watch the loop</div>
    </div>
  );
};

export default Sample11Page;
