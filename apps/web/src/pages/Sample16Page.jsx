import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import './Sample16.css';

// Ported from Codrops' "Kinetic Typography Page Transition" (MIT
// licensed, tympanus.net/Development/KineticTypePageTransition/): a
// fixed grid of giant, near-invisible repeated words sits behind
// everything at all times (5% opacity); clicking a grid item scales
// that whole word-grid up (2.7x) and rotates it -90deg while each line
// sweeps sideways through two keyframes and briefly flashes to full
// opacity then back to faint — a "wipe" built entirely out of type
// rather than a mask or a solid panel — during which the item grid
// fades out and an article view (image reveal + staggered text) fades
// in. The back control runs the same transition in reverse. Independent
// implementation, written from scratch — no CSS/JS source copied, only
// the animation technique (timeline label offsets, keyframe values,
// easing), which is functional, not creative. Photos are the demo's own
// real assets (its README credits "Images from Unsplash"), reused
// directly per the repo's MIT license. Fonts are Inter + Anton (Google
// Fonts), not the source's Typekit account. Item/article copy below is
// our own writing, not the source's own "A Poem" / Zamyatin excerpts.
const IMG = (n) => `/images/kinetic-type/${n}.jpg`;
const IMG_LARGE = (n) => `/images/kinetic-type/large/${n}.jpg`;

const TYPE_WORDS = ['LUMEN', 'VERVE', 'CADENCE', 'AURORA', 'TREMOR', 'ECHO'];
const TYPE_LINE_COUNT = 11;
const TYPE_LINE_OPACITY = 0.05;

const ITEMS = [
  {
    title: '01 — Passage',
    desc: 'A corridor of light between two rooms, held for one second longer than expected.',
    number: '01',
    articleTitle: 'Passage',
    intro: 'A corridor of light between two rooms, held for one second longer than expected.',
    description: 'The frame holds still while everything around it keeps moving — a hallway, a doorway, the sense of somewhere else just out of view. It is less a photograph of a place than of the moment before deciding to walk through it.',
  },
  {
    title: '02 — Static',
    desc: 'Everything in the shot is still, and none of it is at rest.',
    number: '02',
    articleTitle: 'Static',
    intro: 'Everything in the shot is still, and none of it is at rest.',
    description: 'Stillness photographs differently than motion — it asks the eye to look for what changed instead of what moved. Here, nothing did, and that is exactly the point: the tension is in what almost happened.',
  },
  {
    title: '03 — Interval',
    desc: 'The gap between two beats, stretched until it becomes its own shape.',
    number: '03',
    articleTitle: 'Interval',
    intro: 'The gap between two beats, stretched until it becomes its own shape.',
    description: 'Rhythm is usually described by its beats, rarely by the space between them. This one lingers on the space — the pause a shape can hold, the silence a frame can carry, before the next thing arrives.',
  },
  {
    title: '04 — Afterimage',
    desc: 'What stays on the eye once the light that made it is already gone.',
    number: '04',
    articleTitle: 'Afterimage',
    intro: 'What stays on the eye once the light that made it is already gone.',
    description: 'Every bright thing leaves a shadow of itself behind, briefly, on the eye that saw it. This is a study of that residue — the picture that keeps existing for a moment after its subject has already left the frame.',
  },
];

function buildTypeIn(lineRefs, typeRef) {
  return gsap.timeline({ paused: true })
    .to(typeRef.current, { duration: 1.4, ease: 'power2.inOut', scale: 2.7, rotate: -90 }, 0)
    .to(lineRefs.current, {
      keyframes: [
        { x: '20%', duration: 1, ease: 'power1.inOut' },
        { x: '-200%', duration: 1.5, ease: 'power1.in' },
      ],
      stagger: 0.04,
    }, 0)
    .to(lineRefs.current, {
      keyframes: [
        { opacity: 1, duration: 1, ease: 'power1.in' },
        { opacity: 0, duration: 1.5, ease: 'power1.in' },
      ],
    }, 0);
}

function buildTypeOut(lineRefs, typeRef) {
  return gsap.timeline({ paused: true })
    .to(typeRef.current, { duration: 1.4, ease: 'power2.inOut', scale: 1, rotate: 0 }, 1.2)
    .to(lineRefs.current, { duration: 2.3, ease: 'back', x: '0%', stagger: -0.04 }, 0)
    .to(lineRefs.current, {
      keyframes: [
        { opacity: 1, duration: 1, ease: 'power1.in' },
        { opacity: TYPE_LINE_OPACITY, duration: 1.5, ease: 'power1.in' },
      ],
    }, 0);
}

const Sample16Page = () => {
  const typeRef = useRef(null);
  const lineRefs = useRef([]);
  const frameRef = useRef(null);
  const backRef = useRef(null);
  const itemRefs = useRef([]);
  const itemImgRefs = useRef([]);
  const itemTitleRefs = useRef([]);
  const itemDescRefs = useRef([]);
  const articleRefs = useRef([]);
  const articleImageWrapRefs = useRef([]);
  const articleImageRefs = useRef([]);
  const articleNumberRefs = useRef([]);
  const articleTitleRefs = useRef([]);
  const articleIntroRefs = useRef([]);
  const articleDescRefs = useRef([]);

  const [currentItem, setCurrentItem] = useState(-1);
  const isAnimatingRef = useRef(false);

  const openItem = (index) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setCurrentItem(index);

    const typeIn = buildTypeIn(lineRefs, typeRef);

    const tl = gsap.timeline({ onComplete: () => { isAnimatingRef.current = false; } });
    tl.addLabel('start', 0);
    tl.addLabel('typeTransition', 0.3);
    tl.addLabel('articleOpening', typeIn.totalDuration() * 0.75 + 0.3);

    tl.to(itemRefs.current, {
      duration: 0.8, ease: 'power2.inOut', opacity: 0,
      y: (pos) => (pos % 2 ? '25%' : '-25%'),
    }, 'start');
    tl.to(frameRef.current, {
      duration: 0.8, ease: 'power3', opacity: 0,
      onComplete: () => gsap.set(frameRef.current, { pointerEvents: 'none' }),
    }, 'start');

    tl.add(typeIn.play(), 'typeTransition');

    tl.add(() => {
      gsap.set(backRef.current, { pointerEvents: 'auto' });
    }, 'articleOpening');
    tl.to(backRef.current, { duration: 0.7, opacity: 1 }, 'articleOpening');
    tl.set([
      articleTitleRefs.current[index], articleNumberRefs.current[index],
      articleIntroRefs.current[index], articleDescRefs.current[index],
    ], { opacity: 0, y: '50%' }, 'articleOpening');
    tl.set(articleImageWrapRefs.current[index], { y: '100%' }, 'articleOpening');
    tl.set(articleImageRefs.current[index], { y: '-100%' }, 'articleOpening');
    tl.to([
      articleTitleRefs.current[index], articleNumberRefs.current[index],
      articleIntroRefs.current[index], articleDescRefs.current[index],
    ], {
      duration: 1, ease: 'expo', opacity: 1, y: '0%', stagger: 0.04,
    }, 'articleOpening');
    tl.to([articleImageWrapRefs.current[index], articleImageRefs.current[index]], {
      duration: 1, ease: 'expo', y: '0%',
    }, 'articleOpening');
  };

  const closeItem = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const index = currentItem;

    const typeOut = buildTypeOut(lineRefs, typeRef);

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentItem(-1);
        isAnimatingRef.current = false;
      },
    });
    tl.addLabel('start', 0);
    tl.addLabel('typeTransition', 0.5);
    tl.addLabel('showItems', typeOut.totalDuration() * 0.7 + 0.5);

    tl.to(backRef.current, { duration: 0.7, ease: 'power1', opacity: 0 }, 'start');
    tl.to([
      articleTitleRefs.current[index], articleNumberRefs.current[index],
      articleIntroRefs.current[index], articleDescRefs.current[index],
    ], {
      duration: 1, ease: 'power4.in', opacity: 0, y: '50%', stagger: -0.04,
    }, 'start');
    tl.to(articleImageWrapRefs.current[index], { duration: 1, ease: 'power4.in', y: '100%' }, 'start');
    tl.to(articleImageRefs.current[index], { duration: 1, ease: 'power4.in', y: '-100%' }, 'start');

    tl.add(() => {
      gsap.set(backRef.current, { pointerEvents: 'none' });
    });

    tl.add(typeOut.play(), 'typeTransition');

    tl.to(frameRef.current, {
      duration: 0.8, ease: 'power3', opacity: 1,
      onStart: () => gsap.set(frameRef.current, { pointerEvents: 'auto' }),
    }, 'showItems');
    tl.to(itemRefs.current, { duration: 1, ease: 'power3.inOut', opacity: 1, y: '0%' }, 'showItems');
  };

  useEffect(() => {
    gsap.set(itemRefs.current, { opacity: 1, y: '0%' });
  }, []);

  return (
    <div className="sample16-page">
      <Helmet>
        <title>Sample 16 — Kinetic Typography Page Transition | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample16-page__back">&larr; Back</Link>

      <div className="sample16-type" ref={typeRef} aria-hidden="true">
        {Array.from({ length: TYPE_LINE_COUNT }).map((_, i) => (
          <div
            className="sample16-type__line"
            key={i}
            ref={(el) => (lineRefs.current[i] = el)}
          >
            {`${TYPE_WORDS[i % TYPE_WORDS.length]} ${TYPE_WORDS[i % TYPE_WORDS.length]} ${TYPE_WORDS[i % TYPE_WORDS.length]}`}
          </div>
        ))}
      </div>

      <div className="sample16-frame" ref={frameRef}>
        <span className="sample16-hint">Click a frame to open it</span>
      </div>

      <button type="button" className="sample16-back" ref={backRef} onClick={closeItem}>
        <svg viewBox="0 0 50 9" width="100%"><path d="M0 4.5l5-3M0 4.5l5 3M50 4.5h-77" /></svg>
      </button>

      <section className="sample16-item-wrap">
        {ITEMS.map((item, index) => (
          <figure
            className="sample16-item"
            key={item.number}
            ref={(el) => (itemRefs.current[index] = el)}
            onClick={() => openItem(index)}
            onMouseEnter={() => {
              gsap.timeline({ defaults: { duration: 1, ease: 'expo' } }).to(
                [itemImgRefs.current[index], itemTitleRefs.current[index], itemDescRefs.current[index]],
                { y: (pos) => pos * 8 - 4 },
              );
            }}
            onMouseLeave={() => {
              gsap.timeline({ defaults: { duration: 1, ease: 'expo' } }).to(
                [itemImgRefs.current[index], itemTitleRefs.current[index], itemDescRefs.current[index]],
                { y: 0 },
              );
            }}
          >
            <img
              className="sample16-item__img"
              src={IMG(index + 1)}
              alt={item.articleTitle}
              ref={(el) => (itemImgRefs.current[index] = el)}
            />
            <figcaption>
              <h2 className="sample16-item__title" ref={(el) => (itemTitleRefs.current[index] = el)}>{item.title}</h2>
              <p className="sample16-item__desc" ref={(el) => (itemDescRefs.current[index] = el)}>{item.desc}</p>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="sample16-article-wrap">
        {ITEMS.map((item, index) => (
          <article
            className={`sample16-article${currentItem === index ? ' is-current' : ''}`}
            key={item.number}
            ref={(el) => (articleRefs.current[index] = el)}
          >
            <div className="sample16-article__img-wrap" ref={(el) => (articleImageWrapRefs.current[index] = el)}>
              <div
                className="sample16-article__img"
                ref={(el) => (articleImageRefs.current[index] = el)}
                style={{ backgroundImage: `url(${IMG_LARGE(index + 1)})` }}
              />
            </div>
            <span className="sample16-article__number" ref={(el) => (articleNumberRefs.current[index] = el)}>{item.number}</span>
            <h2 className="sample16-article__title" ref={(el) => (articleTitleRefs.current[index] = el)}>{item.articleTitle}</h2>
            <p className="sample16-article__intro" ref={(el) => (articleIntroRefs.current[index] = el)}>{item.intro}</p>
            <p className="sample16-article__description" ref={(el) => (articleDescRefs.current[index] = el)}>{item.description}</p>
          </article>
        ))}
      </section>

      <span className="sample16-credit">Photography via Unsplash (as credited by the source demo)</span>
    </div>
  );
};

export default Sample16Page;
