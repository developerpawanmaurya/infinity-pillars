import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './Sample17.css';

gsap.registerPlugin(Flip, ScrollTrigger);

// Ported from Codrops' "On-Scroll Image Layout Animations" (MIT licensed,
// tympanus.net/Development/ScrollBasedLayoutAnimations/, source mirrored
// locally under src/Sample/ScrollBasedLayoutAnimations-main for reference).
// Requested pixel-for-pixel fidelity, so unlike sibling samples this one
// keeps the source's own markup, CSS values and copy verbatim (only class
// names are prefixed `sample17-` to avoid colliding with the rest of the
// site's global CSS) — the whole repo, images included, is MIT licensed.
// The mechanics are identical to js/index.js: each gallery briefly gets a
// `--switch` class to let Flip.getState capture its "final" layout, the
// class is removed, and Flip.to() scrubs between the two states via a
// pinned ScrollTrigger — same per-gallery flip/scrollTrigger overrides as
// the source's `scroll()` function. Only the top Codrops nav frame (links
// back to the original article/demo) and two purely promotional/credit
// lines (the "@codrops" sign-off and the closing "get our other freebie"
// pitch) were swapped for site-appropriate equivalents, since those pointed
// at Codrops itself rather than being part of the demo's visual content.
const IMG = (n) => `/images/scroll-layout/${n}.jpg`;

const ROW_ITEMS = [
  { n: 6, sizes: ['s'] },
  { n: 3, sizes: ['m'] },
  { n: 4, sizes: ['l'] },
  { n: 1, sizes: ['xl', 'center'] },
  { n: 5, sizes: ['l'] },
  { n: 2, sizes: ['m'] },
  { n: 6, sizes: ['s'] },
];

const BREAKOUT_ITEMS = [8, 7, 15, 9, 12, 14, 10, 13, 11];

const GRID10_ITEMS = [16, 17, 18, 30, 20, 21, 22, 23, 24, 25, 26, 31, 28, 29, 19, 27];

const STACK_DARK_ITEMS = [33, 34, 35, 36, 37, 38];
const STACK_GLASS_ITEMS = [39, 40, 41, 42, 43, 44];
const STACK_SCALE_ITEMS = [45, 46, 47, 48, 49, 50];

const GRIDTINY_ITEMS = [
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  51, 52, 53, 54, 55, 56,
  51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  51, 52, 53, 54, 55, 56, 57, 58,
];

const BENTO_ITEMS = [64, 63, 62, 69, 65, 67, 68, 66];

const ALL_IMAGE_NUMBERS = Array.from(new Set([
  ...ROW_ITEMS.map((i) => i.n),
  ...BREAKOUT_ITEMS,
  ...GRID10_ITEMS,
  ...STACK_DARK_ITEMS,
  ...STACK_GLASS_ITEMS,
  ...STACK_SCALE_ITEMS,
  ...GRIDTINY_ITEMS,
  ...BENTO_ITEMS,
  70,
]));

function triggerFlipOnScroll(galleryEl, options = {}) {
  if (!galleryEl) return;

  const settings = {
    stagger: 0,
    ...options,
    flip: { absoluteOnLeave: false, absolute: false, scale: true, simple: true, ...options.flip },
    scrollTrigger: { start: 'center center', end: '+=300%', ...options.scrollTrigger },
  };

  const galleryCaption = galleryEl.querySelector('.sample17-caption');
  const galleryItems = galleryEl.querySelectorAll('.sample17-gallery__item');
  const galleryItemsInner = [...galleryItems]
    .map((item) => (item.children.length > 0 ? [...item.children] : []))
    .flat();

  galleryEl.classList.add('sample17-gallery--switch');
  const flipstate = Flip.getState([galleryItems, galleryCaption], { props: 'filter, opacity' });
  galleryEl.classList.remove('sample17-gallery--switch');

  const tl = Flip.to(flipstate, {
    ease: 'none',
    absoluteOnLeave: settings.flip.absoluteOnLeave,
    absolute: settings.flip.absolute,
    scale: settings.flip.scale,
    simple: settings.flip.simple,
    scrollTrigger: {
      trigger: galleryEl,
      start: settings.scrollTrigger.start,
      end: settings.scrollTrigger.end,
      pin: galleryEl.parentNode,
      scrub: true,
    },
    stagger: settings.stagger,
  });

  if (galleryItemsInner.length) {
    tl.fromTo(galleryItemsInner, { scale: 2 }, {
      scale: 1,
      scrollTrigger: {
        trigger: galleryEl,
        start: settings.scrollTrigger.start,
        end: settings.scrollTrigger.end,
        scrub: true,
      },
    }, 0);
  }
}

const GALLERY_OPTIONS = [
  { flip: { absoluteOnLeave: true, scale: false } }, // gallery-1 (row)
  {}, // gallery-2 (breakout/cut)
  { flip: { absolute: true, scale: false }, scrollTrigger: { start: 'center center', end: '+=900%' }, stagger: 0.05 }, // gallery-3 (grid10)
  {}, // gallery-4 (stack dark)
  {}, // gallery-5 (stack glass)
  {}, // gallery-6 (stack scale dark)
  {}, // gallery-7 (gridtiny)
  { flip: { scale: false } }, // gallery-8 (bento)
  {}, // gallery-9 (one)
];

const Sample17Page = () => {
  const galleryRefs = useRef([]);
  const setGalleryRef = (i) => (el) => { galleryRefs.current[i] = el; };

  useEffect(() => {
    let cancelled = false;
    let lenis;
    let rafFn;
    let ctx;

    const preload = () => Promise.all(
      ALL_IMAGE_NUMBERS.map((n) => new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = resolve;
        img.src = IMG(n);
      }))
    );

    preload().then(() => {
      if (cancelled) return;

      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', () => ScrollTrigger.update());
      rafFn = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(rafFn);

      ctx = gsap.context(() => {
        galleryRefs.current.forEach((el, i) => triggerFlipOnScroll(el, GALLERY_OPTIONS[i]));
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      if (lenis) {
        if (rafFn) gsap.ticker.remove(rafFn);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div className="sample17-page">
      <Helmet>
        <title>Sample 17 — On-Scroll Image Layout Animations | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample17-page__back">&larr; Back</Link>

      <main className="sample17-main">
        <section className="sample17-project sample17-project--intro">
          <span className="sample17-project__label sample17-project__label--name">Project</span>
          <span className="sample17-project__name">AI Art</span>
          <span className="sample17-project__label sample17-project__label--date">Date</span>
          <span className="sample17-project__date">July, 2023</span>
          <h2 className="sample17-project__title">
            <span className="sample17-project__title-line">Creativity</span>
            <span className="sample17-project__title-line">Redefined</span>
          </h2>
          <span className="sample17-project__label sample17-project__label--mission">Mission</span>
          <div className="sample17-project__mission">
            <p>
              The AI-Art Project is a transformative initiative dedicated to exploring the immense
              impact of AI-generated art on the art world and artists. We aim to discover and promote
              exceptional AI-generated artworks that push the boundaries of creativity, redefine
              traditional practices, and provoke thought.
            </p>
            <p>
              Through collaborations with artists, workshops, and educational programs, we empower
              artists to leverage AI as a tool for exploration, expanding their artistic horizons and
              embracing new forms of expression.
            </p>
          </div>
        </section>

        <div className="sample17-gallery-wrap">
          <div className="sample17-gallery sample17-gallery--row" ref={setGalleryRef(0)}>
            {ROW_ITEMS.map((item, i) => (
              <div
                key={i}
                className={['sample17-gallery__item', ...item.sizes.map((s) => `sample17-gallery__item--${s}`)].join(' ')}
                style={{ backgroundImage: `url(${IMG(item.n)})` }}
              />
            ))}
            <div className="sample17-caption">
              Within this meticulously arranged AI-generated ensemble lies a tantalizing facade,
              captivating our gaze. Yet, as we search for the soul of human expression, we question
              whether algorithms can truly embody the essence of authentic art.
            </div>
          </div>
        </div>

        <section className="sample17-project sample17-project--details sample17-project--left">
          <span className="sample17-project__label sample17-project__label--default">Ethical Considerations</span>
          <p>
            The emergence of AI-generated art raises ethical questions and concerns. One of the key
            challenges is navigating the boundaries of authorship and ownership. Determining the role
            of AI algorithms and their creators in the artistic process, as well as addressing issues
            of attribution and intellectual property, requires careful deliberation. Additionally,
            ensuring that AI-generated art does not perpetuate bias, discrimination, or harmful content
            is crucial for fostering a responsible and inclusive artistic landscape.
          </p>
        </section>

        <div className="sample17-gallery-wrap sample17-gallery-wrap--large">
          <div className="sample17-gallery sample17-gallery--grid sample17-gallery--breakout" ref={setGalleryRef(1)}>
            {BREAKOUT_ITEMS.map((n, i) => (
              <div className="sample17-gallery__item sample17-gallery__item-cut" key={i}>
                <div className="sample17-gallery__item-inner" style={{ backgroundImage: `url(${IMG(n)})` }} />
              </div>
            ))}
            <div className="sample17-caption">
              <p>
                Devoid of inherent knowledge, the language model relies solely on probabilities to
                craft a peculiar vision. As a result, the earrings hang in curious defiance of physics,
                inviting us to ponder the implications of relinquishing human understanding in the
                pursuit of artificial creativity.
              </p>
            </div>
          </div>
        </div>

        <section className="sample17-project sample17-project--details sample17-project--right">
          <span className="sample17-project__label sample17-project__label--default">Preserving Artistic Identity</span>
          <p>
            While AI offers new avenues for artistic exploration, there is a concern that it may
            overshadow or replace human creativity. Balancing the integration of AI tools and
            techniques with preserving the unique perspectives, emotional depth, and artistic identity
            of human artists is a significant challenge. Striking the right balance between
            AI-generated art and the irreplaceable human touch requires thoughtful consideration and an
            ongoing dialogue between artists, technologists, and the wider art community.
          </p>
        </section>

        <div className="sample17-gallery-wrap">
          <div className="sample17-gallery sample17-gallery--grid10" ref={setGalleryRef(2)}>
            {GRID10_ITEMS.map((n, i) => (
              <div
                key={i}
                className={`sample17-gallery__item sample17-pos-${i + 1}`}
                style={{ backgroundImage: `url(${IMG(n)})` }}
              />
            ))}
            <div className="sample17-caption">The Art of Perfection?</div>
          </div>
        </div>

        <section className="sample17-project sample17-project--details">
          <span className="sample17-project__label sample17-project__label--default">Societal Impact</span>
          <p>
            As AI-generated art becomes more prevalent, its long-term impact on the art market, art
            institutions, and the broader societal perception of art needs to be carefully examined.
            Understanding the implications of AI-generated art for art sales, copyright laws, and the
            dynamics of the art market is crucial for shaping future policies and practices.
            Additionally, exploring the ways in which AI-generated art can democratize artistic
            expression and challenge traditional hierarchies is an ongoing challenge that requires
            proactive engagement and collaboration.
          </p>
        </section>

        <div className="sample17-gallery-wrap sample17-gallery-wrap--dense">
          <div className="sample17-gallery sample17-gallery--stack sample17-gallery--stack-inverse sample17-gallery--stack-dark" ref={setGalleryRef(3)}>
            {STACK_DARK_ITEMS.map((n, i) => (
              <div key={i} className="sample17-gallery__item" style={{ backgroundImage: `url(${IMG(n)})` }} />
            ))}
            <div className="sample17-caption">
              <p>AI-generated art captivates with varied creations, sometimes senseless, yet impressively enigmatic.</p>
            </div>
          </div>
        </div>

        <div className="sample17-gallery-wrap sample17-gallery-wrap--dense">
          <div className="sample17-gallery sample17-gallery--stack sample17-gallery--stack-glass" ref={setGalleryRef(4)}>
            {STACK_GLASS_ITEMS.map((n, i) => (
              <div key={i} className="sample17-gallery__item" style={{ backgroundImage: `url(${IMG(n)})` }} />
            ))}
            <div className="sample17-caption">
              <p>
                In the realm of unpredictable algorithms, some variations may appear random or without
                purpose, challenging traditional notions of beauty and meaning.
              </p>
            </div>
          </div>
        </div>

        <div className="sample17-gallery-wrap sample17-gallery-wrap--dense">
          <div className="sample17-gallery sample17-gallery--stack sample17-gallery--stack-inverse sample17-gallery--stack-scale sample17-gallery--stack-dark" ref={setGalleryRef(5)}>
            {STACK_SCALE_ITEMS.map((n, i) => (
              <div key={i} className="sample17-gallery__item" style={{ backgroundImage: `url(${IMG(n)})` }} />
            ))}
            <div className="sample17-caption">
              <p>
                This uncharted territory challenges artists and art enthusiasts alike, igniting debates
                about the role of intention and chance in the artistic process.
              </p>
            </div>
          </div>
        </div>

        <section className="sample17-project sample17-project--details sample17-project--right">
          <span className="sample17-project__label sample17-project__label--default">Unmasking the Void of Authenticity</span>
          <p>
            While AI-generated art showcases impressive technical prowess, it leaves behind an
            unsettling void in the quest for authenticity. As humans, we seek the genuine touch of
            human hands and the depth of emotional connection embedded within traditional art forms.
            The lack of human essence in AI-generated creations may leave us yearning for the profound
            human expression that sparks true resonance, evoking a sense of emptiness in the face of
            machine-driven artistry.
          </p>
        </section>

        <div className="sample17-gallery-wrap">
          <div className="sample17-gallery sample17-gallery--gridtiny" ref={setGalleryRef(6)}>
            {GRIDTINY_ITEMS.map((n, i) => (
              <div key={i} className="sample17-gallery__item" style={{ backgroundImage: `url(${IMG(n)})` }} />
            ))}
            <div className="sample17-caption">What is creativity?</div>
          </div>
        </div>

        <section className="sample17-project sample17-project--details sample17-project--left">
          <span className="sample17-project__label sample17-project__label--default">Photographic Flaws in Perfect Harmony</span>
          <p>
            In the realm of AI-generated photography, the quest for flawlessness inadvertently unveils
            a striking paradox — the absence of authentic imperfections. Even in the most human-like
            subjects, wrinkles and blemishes appear too immaculate, leaving us yearning for the raw,
            unfiltered beauty that only true imperfection can evoke.
          </p>
        </section>

        <div className="sample17-gallery-wrap">
          <div className="sample17-gallery sample17-gallery--bento" ref={setGalleryRef(7)}>
            {BENTO_ITEMS.map((n, i) => (
              <div key={i} className="sample17-gallery__item" style={{ backgroundImage: `url(${IMG(n)})` }} />
            ))}
            <div className="sample17-caption">Perfect Imperfections</div>
          </div>
        </div>

        <section className="sample17-project sample17-project--details sample17-project--right">
          <span className="sample17-project__label sample17-project__label--default">Moving forward</span>
          <p>
            As we conclude this transformative project, we are left with profound questions that
            continue to shape our understanding of AI-generated art and its place in the artistic
            landscape. How do we reconcile the precision of algorithms with the intangible spark of
            human creativity? Can machines truly grasp the depth of emotion and meaning that art evokes
            within us? And as AI continues to advance, how do we preserve the authenticity and soul
            that define artistic expression?
          </p>
        </section>

        <section className="sample17-project sample17-project--details sample17-project--left">
          <span className="sample17-project__label sample17-project__label--default">Photo credits</span>
          <p>
            All images except one were generated with Midjourney. The only "real" image was taken by
            Karsten Winegeart on Unsplash. <strong>Can you spot which one?</strong> Hint: it's one of
            the portraits in the last image grid.
          </p>
        </section>

        <div className="sample17-gallery-wrap">
          <div className="sample17-gallery sample17-gallery--one" ref={setGalleryRef(8)}>
            <div className="sample17-gallery__item" style={{ backgroundImage: `url(${IMG(70)})` }} />
            <div className="sample17-caption">Made by Infinity Pillars</div>
          </div>
        </div>

        <section className="sample17-project sample17-project--details sample17-project--left">
          <p>Like this exploration? It's one of several scroll-driven layout techniques we keep in our build toolkit.</p>
        </section>
      </main>

      <span className="sample17-credit">Photography via Midjourney &amp; Unsplash (as credited by the source demo)</span>
    </div>
  );
};

export default Sample17Page;
