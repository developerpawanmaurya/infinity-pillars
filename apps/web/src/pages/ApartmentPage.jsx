import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import RoomTour3D from '../components/RoomTour3D';
import { withRoomCopy, APARTMENT_MODEL_URL } from '../data/apartmentTourStops';
import './Apartment.css';

gsap.registerPlugin(ScrollTrigger);

// Fictional development ("Atrium Residences") built around a real, freely
// licensed apartment 3D scan (public/models/apartment — see RoomTour3D.jsx
// for the model optimization notes and camera-framing approach).
const ROOMS = withRoomCopy([
  { tag: 'Floor Plan', title: 'A Home With a Plan',
    body: '610 m² arranged with intent — every room framed by daylight, every line load-bearing and honest.' },
  { tag: '01 — Living Room', title: 'The Living Room',
    body: 'An open frame for gathering — wide sightlines, warm oak flooring, and a low horizon of glass.' },
  { tag: '02 — Kitchen', title: 'The Kitchen',
    body: 'Built for the everyday and the occasion alike — a continuous counter, integrated storage, no wasted motion.' },
  { tag: '03 — Bedroom', title: 'The Bedroom',
    body: 'A quiet register — soft textiles, filtered light, and a bed that faces the morning sun.' },
  { tag: '04 — Bathroom', title: 'The Bathroom',
    body: 'Spa-quality finishes in a compact footprint — stone surfaces, warm-toned light, considered storage.' },
]);

const FACTS = [
  { value: '610 m²', label: 'Total living area' },
  { value: '4', label: 'Defined rooms' },
  { value: 'South', label: 'Facing exposure' },
  { value: '2026', label: 'Move-in ready' },
];

const ApartmentPage = () => {
  const heroRef = useRef(null);
  const gridPathRefs = useRef([]);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({
      duration: 1.15, smoothWheel: true, wheelMultiplier: 1,
      touchMultiplier: 1.4, smoothTouch: !isTouch,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    // ---------- Hero entrance ----------
    const heroCtx = gsap.context(() => {
      gridPathRefs.current.forEach((line, i) => {
        if (!line) return;
        const len = line.getTotalLength ? line.getTotalLength() : 0;
        if (!len) return;
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', delay: 0.1 + i * 0.05 });
      });
      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl
        .fromTo('.atr-nav__mark, .atr-nav__links a', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out' })
        .fromTo('.atr-hero__eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.15)
        .fromTo('.atr-hero__title-line span', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.2)
        .fromTo('.atr-hero__caption', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.55)
        .fromTo('.atr-hero__scroll-cue', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.8);
    }, heroRef);

    // ---------- Generic scroll reveal for intro/cta ----------
    const revealCtx = gsap.context(() => {
      gsap.utils.toArray('[data-atr-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      });
    });

    return () => {
      heroCtx.revert();
      revealCtx.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="atr-page">
      <Helmet>
        <title>Atrium Residences — A Home, Room by Room</title>
        <meta name="description" content="Atrium Residences: a 610 m² flagship apartment, walked through room by room — living room, kitchen, bedroom, bathroom." />
      </Helmet>

      <Link to="/" className="atr-back">&larr; Infinity Pillars</Link>

      <nav className="atr-nav">
        <div className="atr-nav__mark">Atrium<br />Residences</div>
        <div className="atr-nav__links">
          <a href="#index">Index</a>
          <a href="#tour">Tour</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* ---------- Hero (Meridian-style) ---------- */}
      <section className="atr-hero" id="index" ref={heroRef}>
        <svg className="atr-hero__grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[10, 25, 40, 55, 70, 85].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />
          ))}
          {[15, 35, 55, 75, 92].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} />
          ))}
          <line ref={(el) => { gridPathRefs.current[0] = el; }} x1="0" y1="92" x2="70" y2="15" stroke="var(--atr-accent)" strokeWidth="0.3" />
          <line ref={(el) => { gridPathRefs.current[1] = el; }} x1="55" y1="100" x2="100" y2="35" stroke="var(--atr-accent)" strokeWidth="0.3" />
        </svg>
        <div className="atr-hero__glow" />
        <div className="atr-hero__body">
          <span className="atr-hero__eyebrow">Atrium Residences — Flagship Unit</span>
          <h1 className="atr-hero__title">
            <span className="atr-hero__title-line"><span>One Address.</span></span>
            <span className="atr-hero__title-line"><span>Every Room</span></span>
            <span className="atr-hero__title-line"><span>Considered.</span></span>
          </h1>
          <div className="atr-hero__captions">
            <p className="atr-hero__caption">A 610 m² apartment planned end to end — layout, light, and material, resolved room by room.</p>
            <p className="atr-hero__caption">Scroll to walk through the living room, kitchen, bedroom, and bathroom in one continuous take.</p>
          </div>
        </div>
        <div className="atr-hero__scroll-cue"><span />Scroll</div>
      </section>

      {/* ---------- Intro facts ---------- */}
      <section className="atr-intro">
        {FACTS.map((f) => (
          <div className="atr-intro__stat" key={f.label} data-atr-reveal>
            <div className="atr-intro__value">{f.value}</div>
            <div className="atr-intro__label">{f.label}</div>
          </div>
        ))}
      </section>

      {/* ---------- Pinned 3D room walkthrough ---------- */}
      <RoomTour3D id="tour" rooms={ROOMS} modelUrl={APARTMENT_MODEL_URL} />

      {/* ---------- CTA / Footer ---------- */}
      <section className="atr-cta" id="contact">
        <p className="atr-cta__heading" data-atr-reveal>&ldquo;The best plan is the one you can feel before you've moved in.&rdquo;</p>
        <Link to="/contact" className="atr-cta__button" data-atr-reveal>Enquire About This Unit</Link>
      </section>
      <footer className="atr-footer">
        <span>&copy; 2026 Atrium Residences.</span>
        <span>A concept build by Infinity Pillars.</span>
      </footer>
    </div>
  );
};

export default ApartmentPage;
