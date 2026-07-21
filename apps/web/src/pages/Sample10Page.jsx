import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import './Sample10.css';

gsap.registerPlugin(ScrollTrigger);

// Ported from Joe Ben Taylor's Codrops tutorial "The Never Ending Story:
// Building a Seamless Infinite Scroll Experience with Lenis + GSAP" (code
// MIT licensed): Lenis runs with `infinite: true` over a `.wrapper`,
// ScrollTrigger is proxied onto that same scroller via
// ScrollTrigger.scrollerProxy, a Snap instance locks each scroll gesture
// onto the nearest hero section, and the first hero is duplicated at the
// very end so the loop has no visible seam. Each hero's image parallaxes
// (yPercent -50 to 50) as it crosses the viewport. Independent
// implementation, written from scratch — no CSS/JS source copied, only
// the scrollerProxy wiring / snap config / parallax values, which are
// functional, not creative.
// The source repo's own README states its three photos are real client
// images "licensed only for use in this tutorial repository and its live
// GitHub demo" — reuse elsewhere is explicitly prohibited. These three are
// verified free-to-use Unsplash photos instead (confirmed individually,
// not the Unsplash+ premium tier).
const HEROES = [
  {
    src: 'https://images.unsplash.com/photo-1593763803214-d8dd436d9717?w=1920&q=80&auto=format&fit=crop',
    label: 'Stillwater',
    sub: 'Where the water forgets to move',
  },
  {
    src: 'https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=1920&q=80&auto=format&fit=crop',
    label: 'Nightfall',
    sub: 'Ten thousand stars over one quiet ridge',
  },
  {
    src: 'https://images.unsplash.com/photo-1530912780732-0d2507ded3e8?w=1920&q=80&auto=format&fit=crop',
    label: 'Mistwood',
    sub: 'Fog folding slowly through the pines',
  },
];

const Sample10Page = () => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const heroRefs = useRef([]);
  const imageRefs = useRef([]);
  const marqueeRefs = useRef([]);
  const badgeRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return undefined;

    const lenis = new Lenis({
      infinite: true,
      wrapper,
      content,
      syncTouch: true,
    });

    const snap = new Snap(lenis, {
      type: 'mandatory',
      debounce: 500,
      duration: 0.9,
      easing: (t) => 1 - (1 - t) ** 4,
    });

    ScrollTrigger.scrollerProxy(wrapper, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        } else {
          return lenis.scroll;
        }
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: wrapper.clientWidth, height: wrapper.clientHeight };
      },
      pinType: 'transform',
    });

    const heroes = heroRefs.current.filter(Boolean);
    snap.addElements(heroes, { align: 'start' });

    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    const ANIMATION = {
      IMAGE: { before: -50, after: 50 },
      MARQUEE: { before: 1.5, after: 0.5 },
    };

    const ctx = gsap.context(() => {
      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          rotate: 360,
          duration: 10,
          ease: 'none',
          repeat: -1,
        });
      }

      heroes.forEach((hero, i) => {
        const image = imageRefs.current[i];
        const marquee = marqueeRefs.current[i];
        const sharedSettings = {
          ease: 'none',
          scrollTrigger: {
            scroller: wrapper,
            trigger: hero,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            fastScrollEnd: true,
          },
        };

        if (image) {
          gsap.fromTo(image,
            { yPercent: ANIMATION.IMAGE.before },
            { yPercent: ANIMATION.IMAGE.after, ...sharedSettings });
        }
        if (marquee) {
          gsap.fromTo(marquee,
            { scale: ANIMATION.MARQUEE.before },
            { scale: ANIMATION.MARQUEE.after, ...sharedSettings });
        }
      });
    }, wrapper);

    return () => {
      ctx.revert();
      snap.destroy();
      gsap.ticker.remove(rafFn);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <div className="sample10-page">
      <Helmet>
        <title>Sample 10 — Infinite Scroll with Parallax | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample10-page__back">&larr; Back</Link>

      <div className="sample10-badge" ref={badgeRef} aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <defs>
            <path id="sample10-badge-path" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
          </defs>
          <text>
            <textPath href="#sample10-badge-path">
              &nbsp;SCROLL &bull; SCROLL &bull; SCROLL &bull;
            </textPath>
          </text>
        </svg>
        <span className="sample10-badge__arrow">&darr;</span>
      </div>

      <div className="sample10-hint">Keep scrolling — it loops</div>

      <div className="sample10-wrapper" ref={wrapperRef}>
        <div className="sample10-content" ref={contentRef}>
          {HEROES.map((hero, i) => (
            <section className="sample10-hero" key={`${hero.label}-${i}`} ref={(el) => (heroRefs.current[i] = el)}>
              <div className="sample10-hero-image" ref={(el) => (imageRefs.current[i] = el)}>
                <img src={hero.src} alt={hero.label} />
              </div>
              <div className="sample10-hero__marquee" ref={(el) => (marqueeRefs.current[i] = el)}>
                <span className="sample10-hero__label">{hero.label}</span>
                <span className="sample10-hero__sub">{hero.sub}</span>
              </div>
            </section>
          ))}

          {/* Duplicate of the first hero, appended once, so the loop has
              nowhere visible to seam. */}
          <section
            className="sample10-hero"
            aria-hidden="true"
            ref={(el) => (heroRefs.current[HEROES.length] = el)}
          >
            <div className="sample10-hero-image" aria-hidden="true" ref={(el) => (imageRefs.current[HEROES.length] = el)}>
              <img src={HEROES[0].src} alt="" aria-hidden="true" />
            </div>
            <div className="sample10-hero__marquee" aria-hidden="true" ref={(el) => (marqueeRefs.current[HEROES.length] = el)}>
              <span className="sample10-hero__label">{HEROES[0].label}</span>
              <span className="sample10-hero__sub">{HEROES[0].sub}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sample10Page;
