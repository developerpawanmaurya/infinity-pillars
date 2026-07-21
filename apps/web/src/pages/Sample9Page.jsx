import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import './Sample9.css';

gsap.registerPlugin(ScrollTrigger, Flip);

// Ported from Codrops' "Consecutive Scroll Animations with One Element"
// (MIT licensed, tympanus.net/Development/OneElementScroll/): a single
// image element (".one", holding the big opening photo) morphs into the
// position and size of a run of invisible placeholder slots as you
// scroll — one shared, scrubbed ScrollTrigger timeline calls Flip.fit()
// against each slot's captured Flip.getState() in turn, so it reads as
// one photo travelling through the page rather than a new image loading
// in each section. Supporting scroll animations (title spans sliding in,
// non-"step" images fading from desaturated, parallax on text/column
// images, a brightness fade on the hero shot) round out the page.
// Independent implementation, written from scratch — no CSS/JS source
// copied, only the layout structure and the animation technique itself
// (Flip config, ScrollTrigger start/end/scrub values), which are
// functional, not creative. Photos are the demo's own real images (its
// README credits them "Images generated with Midjourney"). All heading
// and body copy below is our own original writing — not the demo's own
// fictional "Seraph Kamos" clothing-brand text.
const IMG = (n) => `/images/one-element-scroll/${n}.jpg`;

const Sample9Page = () => {
  const rootRef = useRef(null);
  const oneRef = useRef(null);
  const initialSectionRef = useRef(null);
  const stepRefs = useRef([]);
  const setStepRef = (i) => (el) => { stepRefs.current[i] = el; };

  useEffect(() => {
    const root = rootRef.current;
    const oneEl = oneRef.current;
    const parentEl = initialSectionRef.current;
    if (!root || !oneEl || !parentEl) return undefined;

    let cancelled = false;
    let onResize;
    let flipCtx;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    const ctx = gsap.context(() => {
      const steps = stepRefs.current.filter(Boolean);

      const createFlipOnScrollAnimation = () => {
        flipCtx?.revert();
        flipCtx = gsap.context(() => {
          const flipConfig = { duration: 1, ease: 'sine.inOut' };
          const states = steps.map((el) => Flip.getState(el));

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: parentEl,
              start: 'clamp(center center)',
              endTrigger: steps[steps.length - 1],
              end: 'clamp(center center)',
              scrub: true,
              immediateRender: false,
            },
          });

          states.forEach((state, index) => {
            const customFlipConfig = { ...flipConfig, ease: index === 0 ? 'none' : flipConfig.ease };
            tl.add(Flip.fit(oneEl, state, customFlipConfig), index ? '+=0.5' : 0);
          });
        }, root);
      };

      const animateSpansOnScroll = () => {
        const spans = root.querySelectorAll('.sample9-content__title > span');
        spans.forEach((span, index) => {
          const direction = index % 2 === 0 ? -150 : 150;
          const triggerElement = span.closest('.sample9-content--center') ? span.parentNode : span;
          gsap.from(span, {
            x: direction,
            duration: 1,
            ease: 'sine',
            scrollTrigger: { trigger: triggerElement, start: 'top bottom', end: '+=45%', scrub: true },
          });
        });
      };

      const animateImagesOnScroll = () => {
        const images = root.querySelectorAll(
          '.sample9-content--lines .sample9-content__img:not([data-step]), .sample9-content--grid .sample9-content__img:not([data-step])',
        );
        images.forEach((image) => {
          gsap.fromTo(image,
            { scale: 0, autoAlpha: 0, filter: 'brightness(180%) saturate(0%)' },
            {
              scale: 1, autoAlpha: 1, filter: 'brightness(100%) saturate(100%)',
              duration: 1, ease: 'sine',
              scrollTrigger: { trigger: image, start: 'top bottom', end: '+=45%', scrub: true },
            });
        });
      };

      const addParallaxToText = () => {
        const firstTextElement = root.querySelector('.sample9-content__text');
        if (!firstTextElement) return;
        gsap.fromTo(firstTextElement, { y: 250 }, {
          y: -250, ease: 'sine',
          scrollTrigger: { trigger: firstTextElement, start: 'top bottom', end: 'top top', scrub: true },
        });
      };

      const animateFilterOnFirstSwitch = () => {
        gsap.fromTo(oneEl, { filter: 'brightness(80%)' }, {
          filter: 'brightness(100%)', ease: 'sine',
          scrollTrigger: { trigger: parentEl, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: true },
        });
      };

      const addParallaxToColumnImages = () => {
        const columnImages = [...root.querySelectorAll('.sample9-content--column .sample9-content__img:not([data-step])')];
        const middleIndex = (columnImages.length - 1) / 2;
        columnImages.forEach((image, index) => {
          const intensity = Math.abs(index - middleIndex) * 75;
          gsap.fromTo(image, { y: intensity }, {
            y: -intensity, ease: 'sine',
            scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        });
      };

      createFlipOnScrollAnimation();
      animateSpansOnScroll();
      animateImagesOnScroll();
      addParallaxToText();
      addParallaxToColumnImages();
      animateFilterOnFirstSwitch();

      onResize = () => createFlipOnScrollAnimation();
      window.addEventListener('resize', onResize);
    }, root);

    const img = new Image();
    img.onload = img.onerror = () => { if (!cancelled) root.classList.remove('is-loading'); };
    img.src = IMG('main');

    return () => {
      cancelled = true;
      if (onResize) window.removeEventListener('resize', onResize);
      flipCtx?.revert();
      ctx.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="sample9-page is-loading" ref={rootRef}>
      <Helmet>
        <title>Sample 9 — One Element Scroll | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample9-page__back">&larr; Back</Link>

      <main className="sample9-main">
        <section className="sample9-content sample9-content--initial" ref={initialSectionRef}>
          <div className="sample9-one" ref={oneRef} style={{ backgroundImage: `url(${IMG('main')})` }} />
        </section>

        <section className="sample9-content sample9-content--center sample9-content--blend">
          <div data-step className="sample9-content__img" ref={setStepRef(0)} />
          <h1 className="sample9-content__title sample9-font-alt">
            <span>Solace</span><br /><span>Thread</span>
          </h1>
        </section>

        <section className="sample9-content sample9-content--column">
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(1)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(2)})` }} />
          <div data-step className="sample9-content__img" ref={setStepRef(1)} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(3)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(4)})` }} />
        </section>

        <section className="sample9-content sample9-content--lines">
          <h2 className="sample9-content__title sample9-content__title--medium sample9-font-alt">
            <span>Woven</span> <div data-step className="sample9-content__img" ref={setStepRef(2)} /> <span>by hand</span>
          </h2>
          <h2 className="sample9-content__title sample9-content__title--medium sample9-font-alt">
            <span>Grown with</span> <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(5)})` }} /> <span>patience</span>
          </h2>
          <h2 className="sample9-content__title sample9-content__title--medium sample9-font-alt">
            <span>worn with</span> <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(4)})` }} /> <span>ease</span>
          </h2>
        </section>

        <section className="sample9-content sample9-content--sides">
          <div data-step className="sample9-content__img" ref={setStepRef(3)} />
          <div className="sample9-content__text">
            <p>
              <strong>Solace Thread began with a single bolt of undyed linen.</strong> We still work
              the same way: natural fibers, small runs, nothing rushed. Every piece starts as raw
              material from a grower we know by name, and ends as something meant to be worn for
              years, not seasons.
            </p>
          </div>
        </section>

        <section className="sample9-content sample9-content--center sample9-content--center-tall">
          <div data-step className="sample9-content__img" ref={setStepRef(4)} />
          <div className="sample9-content__text sample9-content__text--large">
            <p>
              We keep the supply chain short enough to walk. Every mill and stitcher we work with
              is someone we've actually visited, paid fairly, and would happily name in public.
              That's not a marketing line — it's just how small batches have to work if you want
              to be able to stand behind them.
            </p>
          </div>
        </section>

        <section className="sample9-content sample9-content--grid">
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(13)})` }} />
          <div data-step className="sample9-content__img" ref={setStepRef(5)} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(12)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(9)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(7)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(11)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(8)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(10)})` }} />
          <div className="sample9-content__img" style={{ backgroundImage: `url(${IMG(6)})` }} />
        </section>

        <section className="sample9-outro">
          <h2 className="sample9-outro__title sample9-font-alt">Made slowly, on purpose</h2>
        </section>
      </main>
    </div>
  );
};

export default Sample9Page;
