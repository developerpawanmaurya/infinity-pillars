import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import './Sample15.css';

gsap.registerPlugin(Flip);

// Ported from Codrops' "Lines to Content Layout Animation" (MIT
// licensed, tympanus.net/Development/LinesToLayout/, source mirrored
// locally under src/Sample/LinesToLayout-main for reference): four rows
// of oversized text and two clickable photos share a CSS grid exactly
// matching the source's own (28% / 1fr / 22% columns, 4 rows, 8.625vw
// text). Clicking a photo captures its Flip state, physically re-parents
// it (a real DOM move, like the source — GSAP's `absolute:true` handles
// the transform across containers) into the matching content row, and
// Flip.from animates the move while every other row/photo slides off in
// its own tagged direction and the title/number/meta lines wipe up.
// The custom SVG cursor is the source's own Cursor/CursorElement classes
// ported line-for-line: a lerped trailing circle that swells and gets a
// pulsing feTurbulence displacement filter on hover — this page hides
// the site's regular custom cursor (via the `suppress-custom-cursor`
// body class) so this one isn't drawn underneath it. Independent
// implementation, written from scratch — no CSS/JS source copied, only
// the grid measurements, animation values and cursor math, which are
// functional, not creative. Photos are the demo's own real assets (its
// README credits "Images from Unsplash"), reused directly per the
// repo's MIT license. Fonts are Inter + Bodoni Moda (Google Fonts), not
// the source's Typekit account. Row/title/meta copy below is our own
// writing, not the source's own text.
const IMG = (n) => `/images/lines-to-layout/${n}.jpg`;

const ROWS = [
  [{ text: 'Light does', direction: 'top' }, { text: 'not', direction: 'right' }],
  [{ text: 'arrive', direction: 'left' }, { text: 'all at once', direction: 'bottom' }],
  [{ text: 'it gathers', direction: 'right' }, { text: 'slowly', direction: 'right' }],
  [{ text: 'in the frame', direction: 'bottom' }],
];

const CONTENTS = [
  {
    number: '1',
    title: ['A quiet register', 'of what remains'],
    meta: ['Field Notes', ['Souls', 'for freedom'], ['Made by Humans', 'in 2026']],
  },
  {
    number: '2',
    title: ['Everything arrives', 'a little later'],
    meta: ['Novel World', ['Souls', 'for love'], ['Made by Humans', 'in 2026']],
  },
];

const xForDirection = (direction) => {
  if (direction === 'right') return 101;
  if (direction === 'left') return -101;
  return 0;
};
const yForDirection = (direction) => {
  if (direction === 'top') return -101;
  if (direction === 'bottom') return 101;
  return 0;
};

const lerp = (a, b, n) => (1 - n) * a + n * b;

function useCustomCursor(pageRef) {
  useEffect(() => {
    document.body.classList.add('suppress-custom-cursor');
    if (!window.matchMedia('(any-pointer: fine)').matches) {
      return () => document.body.classList.remove('suppress-custom-cursor');
    }

    const cursor = { x: 0, y: 0 };
    const onMouseMove = (ev) => { cursor.x = ev.clientX; cursor.y = ev.clientY; };
    window.addEventListener('mousemove', onMouseMove);

    const cursorEls = [...pageRef.current.querySelectorAll('.sample15-cursor')];
    const instances = cursorEls.map((el) => {
      const inner = el.querySelector('.sample15-cursor__inner');
      const feTurbulence = el.querySelector('feTurbulence');
      const filterId = el.dataset.filterId;
      const radiusOnEnter = Number(el.dataset.radiusEnter) || 30;
      const amt = Number(el.dataset.amt) || 0.2;
      const radius = Number(inner.getAttribute('r'));

      const renderedStyles = {
        tx: { previous: 0, current: 0, amt },
        ty: { previous: 0, current: 0, amt },
        radius: { previous: radius, current: radius, amt },
        opacity: { previous: 1, current: 1, amt },
      };

      const bounds = el.getBoundingClientRect();
      el.style.opacity = 0;

      let filterTimeline;
      if (filterId) {
        const primitiveValues = { turbulence: 0 };
        filterTimeline = gsap.timeline({
          paused: true,
          onStart: () => { inner.style.filter = `url(#${filterId})`; },
          onUpdate: () => feTurbulence.setAttribute('baseFrequency', primitiveValues.turbulence),
          onComplete: () => { inner.style.filter = 'none'; },
        }).to(primitiveValues, {
          duration: 3, ease: 'none', repeat: -1, yoyo: true, startAt: { turbulence: 0.15 }, turbulence: 0.13,
        });
      }

      let rafId;
      const render = () => {
        renderedStyles.tx.current = cursor.x - bounds.width / 2;
        renderedStyles.ty.current = cursor.y - bounds.height / 2;
        Object.keys(renderedStyles).forEach((key) => {
          const s = renderedStyles[key];
          s.previous = lerp(s.previous, s.current, s.amt);
        });
        el.style.transform = `translateX(${renderedStyles.tx.previous}px) translateY(${renderedStyles.ty.previous}px)`;
        inner.setAttribute('r', renderedStyles.radius.previous);
        el.style.opacity = renderedStyles.opacity.previous;
        rafId = requestAnimationFrame(render);
      };

      const onFirstMove = () => {
        renderedStyles.tx.previous = renderedStyles.tx.current = cursor.x - bounds.width / 2;
        renderedStyles.ty.previous = renderedStyles.ty.current = cursor.y - bounds.height / 2;
        el.style.opacity = 1;
        rafId = requestAnimationFrame(render);
        window.removeEventListener('mousemove', onFirstMove);
      };
      window.addEventListener('mousemove', onFirstMove);

      return {
        enter() {
          renderedStyles.radius.current = radiusOnEnter;
          renderedStyles.opacity.current = 1;
          filterTimeline?.restart();
        },
        leave() {
          renderedStyles.radius.current = radius;
          renderedStyles.opacity.current = 1;
          filterTimeline?.progress(1).kill();
        },
        destroy() {
          cancelAnimationFrame(rafId);
          window.removeEventListener('mousemove', onFirstMove);
        },
      };
    });

    const triggers = [...pageRef.current.querySelectorAll('a, .sample15-image, .sample15-content__back')];
    const onEnter = () => instances.forEach((i) => i.enter());
    const onLeave = () => instances.forEach((i) => i.leave());
    triggers.forEach((t) => {
      t.addEventListener('mouseenter', onEnter);
      t.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.body.classList.remove('suppress-custom-cursor');
      window.removeEventListener('mousemove', onMouseMove);
      instances.forEach((i) => i.destroy());
      triggers.forEach((t) => {
        t.removeEventListener('mouseenter', onEnter);
        t.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [pageRef]);
}

const Sample15Page = () => {
  const pageRef = useRef(null);
  const introRef = useRef(null);
  const rowSpanRefs = useRef([]);
  const imageRefs = useRef([]);
  const imageInnerRefs = useRef([]);
  const contentRowImageRefs = useRef([]);
  const contentTextRefs = useRef([[], []]);
  const backRefs = useRef([]);

  const [openIndex, setOpenIndex] = useState(null);
  const isAnimatingRef = useRef(false);

  useCustomCursor(pageRef);

  useEffect(() => {
    gsap.set(contentTextRefs.current.flat().filter(Boolean), { yPercent: 101 });
  }, []);

  const openContent = (index) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const image = imageRefs.current[index];
    const otherInner = imageInnerRefs.current.filter((_, i) => i !== index);
    const introTexts = rowSpanRefs.current.filter(Boolean);
    const texts = contentTextRefs.current[index].filter(Boolean);

    const state = Flip.getState(image);
    contentRowImageRefs.current[index].appendChild(image);

    setOpenIndex(index);
    gsap.set(backRefs.current[index], { xPercent: 20, opacity: 0 });
    gsap.set(texts, { yPercent: 101 });

    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: 'power4.inOut' },
      onComplete: () => { isAnimatingRef.current = false; },
    });
    tl.addLabel('start', 0);
    tl.add(() => {
      Flip.from(state, { duration: 1.2, ease: 'power4.inOut', absolute: true });
    }, 'start');
    tl.to([introTexts, otherInner], {
      xPercent: (i, target) => xForDirection(target.dataset.direction),
      yPercent: (i, target) => yForDirection(target.dataset.direction),
    }, 'start');
    tl.addLabel('content', 'start+=0.7');
    tl.to(texts, { ease: 'expo', yPercent: 0 }, 'content');
    tl.to(backRefs.current[index], { ease: 'expo', xPercent: 0, opacity: 1 }, 'content');
  };

  const closeContent = (index) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const image = imageRefs.current[index];
    const otherInner = imageInnerRefs.current.filter((_, i) => i !== index);
    const introTexts = rowSpanRefs.current.filter(Boolean);
    const texts = contentTextRefs.current[index].filter(Boolean);

    const tl = gsap.timeline({
      defaults: { duration: 1.1, ease: 'power4.inOut' },
      onComplete: () => {
        setOpenIndex(null);
        isAnimatingRef.current = false;
      },
    });
    tl.addLabel('start', 0);
    tl.to(texts, { duration: 0.8, yPercent: 101 }, 'start');
    tl.to(backRefs.current[index], { duration: 0.8, xPercent: 20, opacity: 0 }, 'start');
    tl.add(() => {
      const state = Flip.getState(image);
      introRef.current.appendChild(image);
      Flip.from(state, { duration: 1.2, ease: 'power4.inOut', absolute: true });
    }, 'start');
    tl.addLabel('intro', 'start+=0.6');
    tl.to([introTexts, otherInner], { ease: 'expo', xPercent: 0, yPercent: 0 }, 'intro');
  };

  return (
    <div className="sample15-page" ref={pageRef}>
      <Helmet>
        <title>Sample 15 — Lines to Content Layout | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample15-page__back">&larr; Back</Link>

      <main className="sample15-main">
        <div className={`sample15-intro${openIndex !== null ? ' is-closed' : ''}`} ref={introRef}>
          {ROWS.map((row, ri) => (
            <div className={`sample15-row sample15-row--${ri + 1}`} key={ri}>
              {row.map((span, si) => (
                <React.Fragment key={si}>
                  <span className="sample15-row__text sample15-oh">
                    <span
                      data-direction={span.direction}
                      ref={(el) => {
                        rowSpanRefs.current[ri * 2 + si] = el;
                      }}
                    >
                      {span.text}
                    </span>
                  </span>
                  {si < row.length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </div>
          ))}

          {[0, 1].map((index) => (
            <div
              className={`sample15-image sample15-image--${index === 0 ? 'up' : 'down'}`}
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
              onClick={() => (openIndex === null ? openContent(index) : null)}
            >
              <div
                className="sample15-image__inner"
                data-direction={index === 0 ? 'right' : 'left'}
                style={{ backgroundImage: `url(${IMG(index + 1)})` }}
                ref={(el) => (imageInnerRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>

        <section className="sample15-content-wrap">
          {CONTENTS.map((content, index) => (
            <div
              className={`sample15-content${openIndex === index ? ' sample15-content--open' : ''}`}
              key={index}
            >
              {index === 0 && <div className="sample15-content__row--image" ref={(el) => (contentRowImageRefs.current[index] = el)} />}
              <div className="sample15-content__row--text">
                <h2 className="sample15-content__title">
                  {content.title.map((line, li) => (
                    <React.Fragment key={li}>
                      <span className="sample15-oh">
                        <span ref={(el) => (contentTextRefs.current[index][li] = el)}>{line}</span>
                      </span>
                      {li < content.title.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <span className="sample15-content__number">
                  <span className="sample15-oh">
                    <span ref={(el) => (contentTextRefs.current[index][2] = el)}>{content.number}</span>
                  </span>
                </span>
                <button
                  type="button"
                  className="sample15-content__back"
                  ref={(el) => (backRefs.current[index] = el)}
                  onClick={() => closeContent(index)}
                >
                  <svg viewBox="0 0 50 9"><path d="m0 4.5 5-3m-5 3 5 3m45-3h-77" /></svg>
                </button>
                <div className="sample15-content__meta">
                  {content.meta.map((entry, mi) => {
                    const lines = Array.isArray(entry) ? entry : [entry];
                    return (
                      <span
                        className={`sample15-content__meta-text${mi === 1 ? ' sample15-content__meta-text--center' : ''}`}
                        key={mi}
                      >
                        {lines.map((line, li) => (
                          <React.Fragment key={li}>
                            <span className="sample15-oh">
                              <span ref={(el) => (contentTextRefs.current[index][3 + mi * 2 + li] = el)}>{line}</span>
                            </span>
                            {li < lines.length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </span>
                    );
                  })}
                </div>
              </div>
              {index === 1 && <div className="sample15-content__row--image" ref={(el) => (contentRowImageRefs.current[index] = el)} />}
            </div>
          ))}
        </section>
      </main>

      <svg className="sample15-cursor" data-filter-id="sample15-cursor-filter" width="100" height="100" viewBox="0 0 100 100">
        <defs>
          <filter id="sample15-cursor-filter" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0" numOctaves="1" result="warp" />
            <feOffset dx="0" result="warpOffset" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="40" in="SourceGraphic" in2="warpOffset" />
          </filter>
        </defs>
        <circle className="sample15-cursor__inner" cx="50" cy="50" r="10" />
      </svg>
      <svg className="sample15-cursor" width="100" height="100" viewBox="0 0 100 100" data-amt="0.15" data-radius-enter="40">
        <circle className="sample15-cursor__inner" cx="50" cy="50" r="10" />
      </svg>

      <span className="sample15-credit">Photography via Unsplash (as credited by the source demo)</span>
    </div>
  );
};

export default Sample15Page;
