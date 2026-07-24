import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitReveal from '../components/SplitReveal';
import AnimatedCounter from '../components/AnimatedCounter';
import './Halvorsen.css';

gsap.registerPlugin(ScrollTrigger);

// Fictional architecture bureau landing page, built in the visual/motion
// language of cinematic one-page studio sites (full-bleed imagery, serif
// display type, marquee ticker rows, alternating story sections, pinned
// scroll reveals). Copy, firm name, people, offices, awards and clients
// below are all invented for this page — no real firm's text was copied.
// Photography is real, freely-licensed Unsplash photography (see credit
// in the footer); portraits are likewise free-license Unsplash headshots
// standing in for a fictional team roster.
const IMG = (n) => `/images/halvorsen/${n}.jpg`;

const AWARDS = [
  { name: 'Nordkant Design Award 2025', detail: 'First Place — Public Building' },
  { name: 'Formark Prize 2023', detail: "First Place — 'Open Field'" },
  { name: 'Formark Prize 2023', detail: "First Place — 'Harbor Ring'" },
  { name: 'European Concrete Award 2022', detail: 'Shortlisted' },
  { name: 'Nordic Housing Award 2021', detail: 'Honourable Mention' },
  { name: '60+ awards', detail: 'In international competition since 2012' },
];

const PUBLICATIONS = [
  'Fieldnotes Journal', 'Structura Review', 'The Plan Quarterly',
  'Material & Method', 'Nordic Form Papers', 'Concrete & Light', 'Studio Brief',
];

const OFFICES = [
  { city: 'Oslo', tag: 'Headquarters', addr: 'Havnegata 8, 0150 Oslo, Norway' },
  { city: 'Bergen', tag: 'Studio', addr: 'Sildagata 21, 5003 Bergen, Norway' },
  { city: 'Trondheim', tag: 'Studio', addr: 'Solsiden 6, 7010 Trondheim, Norway' },
  { city: 'Stavanger', tag: 'Studio', addr: 'Skagenkaien 12, 4006 Stavanger, Norway' },
  { city: 'Rotterdam', tag: 'Studio', addr: 'Wilhelminakade 47, 3072 Rotterdam, Netherlands' },
  { city: 'Amsterdam', tag: 'Studio', addr: 'Houtmankade 19, 1013 Amsterdam, Netherlands' },
  { city: 'Utrecht', tag: 'Studio', addr: 'Vredenburg 88, 3511 Utrecht, Netherlands' },
  { city: 'The Hague', tag: 'Studio', addr: 'Bezuidenhoutseweg 30, 2594 The Hague, Netherlands' },
];

const PROJECTS = [
  { name: 'Kolsås Private House', type: 'Private House', size: '640 m²', img: IMG('arch-04') },
  { name: 'Fjordpark Residence', type: 'Private House / Landscape', size: '1,410 m²', img: IMG('arch-10') },
  { name: 'Bryggen Residential', type: 'Residential', size: '7,850 m²', img: IMG('arch-06') },
  { name: 'Havneveien Complex', type: 'Mixed-Use', size: '3,120 m²', img: IMG('arch-07') },
  { name: 'Solstrand Villa', type: 'Private House', size: '980 m²', img: IMG('arch-12') },
  { name: 'Kanalhus Apartments', type: 'Residential Interiors', size: '15,600 m²', img: IMG('arch-05') },
  { name: 'Rotterdam Ornament Suite', type: 'Hospitality', size: '52,400 m²', img: IMG('arch-13') },
  { name: 'Utrecht Corner Plot', type: 'Private House', size: '410 m²', img: IMG('arch-11') },
];

const TEAM = [
  { name: 'Erik Halvorsen', role: 'Founder & Principal Architect', img: IMG('team-01') },
  { name: 'Mari Solvik', role: 'Design Director', img: IMG('team-02') },
  { name: 'Jonas Berge', role: 'Technical Director', img: IMG('team-03') },
  { name: 'Ingrid Vold', role: 'Senior Architect', img: IMG('team-04') },
  { name: 'Thomas Lindqvist', role: 'Facade Engineer', img: IMG('team-05') },
  { name: 'Sofie Dahl', role: 'Interior Design Lead', img: IMG('team-06') },
  { name: 'Kasper de Groot', role: 'Project Architect, Rotterdam', img: IMG('team-07') },
  { name: 'Nora Fjeld', role: 'Landscape Architect', img: IMG('team-08') },
  { name: 'Willem Bakker', role: 'Structural Coordinator', img: IMG('team-09') },
  { name: 'Emma Holt', role: 'Visualization Lead', img: IMG('team-10') },
  { name: 'Lucas van Dijk', role: 'Site Architect', img: IMG('team-11') },
  { name: 'Aksel Strand', role: 'Sustainability Consultant', img: IMG('team-12') },
  { name: 'Julie Moen', role: 'Studio Manager', img: IMG('team-13') },
];

const PARTNERS = [
  'Norra Group', 'Veldt Development', 'Stonework Capital', 'Arkholm',
  'Bruta Studio', 'Kant & Kai', 'Meridian Hold', 'Solidum', 'Fjellico', 'Ravenstein',
];

const HalvorsenPage = () => {
  const rootRef = useRef(null);
  const progressFillRef = useRef(null);
  const heroImgRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.85, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    const ctx = gsap.context(() => {
      // Scroll progress rail
      gsap.to(progressFillRef.current, {
        height: '100%',
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom bottom', scrub: true },
      });

      // Hero: slow continuous Ken Burns drift + scroll parallax pull-back
      gsap.to(heroImgRef.current, { scale: 1.16, duration: 22, ease: 'none', repeat: -1, yoyo: true });
      gsap.to(heroImgRef.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: '.hv-hero', start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.fromTo('.hv-hero__body, .hv-hero__nav', { opacity: 1 }, {
        opacity: 0.15, ease: 'none',
        scrollTrigger: { trigger: '.hv-hero', start: 'center top', end: 'bottom top', scrub: true },
      });

      // Generic reveal-on-scroll for anything flagged data-reveal
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { y: 46, opacity: 0 }, {
          y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 87%' },
        });
      });

      // Staggered groups (projects grid, offices grid, team grid)
      gsap.utils.toArray('[data-stagger-group]').forEach((group) => {
        const items = group.querySelectorAll('[data-stagger-item]');
        gsap.fromTo(items, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: group, start: 'top 82%' },
        });
      });

      // Clip-path image reveals (intro photo)
      gsap.utils.toArray('[data-clip-reveal]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      });

      // Parallax drift inside the alternating story rows + offices bg
      gsap.utils.toArray('[data-parallax-img]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -8 }, {
          yPercent: 8, ease: 'none',
          scrollTrigger: {
            trigger: el.closest('[data-parallax-wrap]') || el.parentElement,
            start: 'top bottom', end: 'bottom top', scrub: true,
          },
        });
      });

      // Infinite marquees
      gsap.utils.toArray('[data-marquee]').forEach((track) => {
        gsap.to(track, { xPercent: -50, ease: 'none', duration: Number(track.dataset.speed) || 26, repeat: -1 });
      });

      // Philosophy background: slow zoom while pinned in view
      gsap.fromTo('.hv-philosophy__bg img', { scale: 1.1 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.hv-philosophy', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, rootRef);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div className="hv-page" ref={rootRef}>
      <Helmet>
        <title>Halvorsen Architectural Bureau — Systematic Clarity &amp; Quiet Ambition</title>
        <meta
          name="description"
          content="Halvorsen Architectural Bureau: architecture, interiors, and master planning across Norway and the Netherlands since 2012."
        />
      </Helmet>

      <Link to="/" className="hv-back">&larr; Infinity Pillars</Link>

      <div className="hv-progress-rail"><div className="hv-progress-fill" ref={progressFillRef} /></div>

      {/* ---------- Hero ---------- */}
      <section className="hv-hero">
        <div className="hv-hero__media">
          <img ref={heroImgRef} className="hv-hero__img" src={IMG('arch-01')} alt="Angular glass and steel building against a bright sky" />
          <div className="hv-hero__scrim" />
        </div>

        <nav className="hv-hero__nav">
          <span className="hv-hero__mark">Halvorsen</span>
          <div className="hv-hero__links">
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
            <a href="#team">Team</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>

        <div className="hv-hero__body">
          <div className="hv-hero__eyebrow">Halvorsen Architectural Bureau &middot; Est. 2012</div>
          <h1 className="hv-hero__title">
            <SplitReveal text="Systematic Clarity" as="span" delay={0.15} />
            <SplitReveal text="& Quiet Ambition" as="span" delay={0.35} wordClassName="hv-title-accent" />
          </h1>
          <div className="hv-hero__row">
            <p className="hv-hero__sub">
              Architecture, interiors, and master planning for clients who build for decades,
              not seasons — across eight studios in Norway and the Netherlands.
            </p>
            <div className="hv-hero__tags">
              <span className="hv-tag">Sustainability Strategy</span>
              <span className="hv-tag">Facade Engineering</span>
              <span className="hv-tag">Visualization &amp; Render</span>
            </div>
          </div>
        </div>

        <div className="hv-scrollcue"><span className="hv-scrollcue__dot" />Scroll &middot; Portfolio 2026</div>
      </section>

      {/* ---------- Intro / About ---------- */}
      <section className="hv-section hv-intro" id="studio">
        <div className="hv-wrap hv-intro__grid">
          <div data-reveal>
            <div className="hv-eyebrow">Founded 2012 &middot; Erik Halvorsen</div>
            <h2 className="hv-intro__heading">From first pencil line to final drawing set.</h2>
            <p className="hv-intro__body">
              We stay on a project from the opening sketch through facades, layouts,
              documentation, and full visualization — one studio, one thread of judgment,
              start to finish.
            </p>
            <p className="hv-intro__body">
              Precision and feeling are not opposites here. Every material call, every
              sightline, answers to context first: the site, the client, and the decade the
              building actually has to survive.
            </p>
            <div className="hv-facts">
              <div className="hv-facts__item">
                <div className="hv-facts__value">2012</div>
                <div className="hv-facts__label">Founded</div>
              </div>
              <div className="hv-facts__item">
                <div className="hv-facts__value">Oslo</div>
                <div className="hv-facts__label">Headquarters</div>
              </div>
              <div className="hv-facts__item">
                <div className="hv-facts__value">8</div>
                <div className="hv-facts__label">Studio Cities</div>
              </div>
            </div>
          </div>

          <div data-reveal>
            <div className="hv-intro__media">
              <img data-clip-reveal src={IMG('arch-02')} alt="Bright white archway corridor with staircase" />
            </div>
            <div className="hv-intro__caption">
              <span>Study Hall — Oslo Studio</span>
              <span>No. 02</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Awards marquee ---------- */}
      <section className="hv-marquee-section">
        <div className="hv-wrap">
          <div className="hv-eyebrow">Recognition</div>
          <h3 className="hv-marquee-heading">Judged well, on the record.</h3>
        </div>
        <div className="hv-marquee">
          <div className="hv-marquee__track" data-marquee data-speed="30">
            {[...AWARDS, ...AWARDS].map((a, i) => (
              <span className="hv-marquee__item" key={i}>
                {a.name}<span>{a.detail}</span><i className="hv-marquee__dot" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Publications ---------- */}
      <section className="hv-section hv-pubs">
        <div className="hv-wrap">
          <div data-reveal>
            <div className="hv-eyebrow">Press</div>
            <h3 className="hv-intro__heading" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)' }}>
              Featured in 25+ design publications this year.
            </h3>
          </div>
          <div className="hv-pubs__grid" data-stagger-group>
            {PUBLICATIONS.map((p) => (
              <span className="hv-pubs__item" key={p} data-stagger-item>{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Offices ---------- */}
      <section className="hv-section hv-offices">
        <div className="hv-offices__bg" data-parallax-wrap>
          <img data-parallax-img src={IMG('arch-08')} alt="Skyscrapers viewed from below against the sky" />
        </div>
        <div className="hv-wrap hv-offices__inner">
          <div data-reveal>
            <div className="hv-eyebrow">Studios</div>
            <h3 className="hv-offices__heading">Eight cities. One standard of care.</h3>
          </div>
          <div className="hv-offices__grid" data-stagger-group>
            {OFFICES.map((o) => (
              <div className="hv-office" key={o.city} data-stagger-item>
                <span className="hv-office__tag">{o.tag}</span>
                <div className="hv-office__city">{o.city}</div>
                <div className="hv-office__addr">{o.addr}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Sketch to Strategy / Precision in Development ---------- */}
      <section className="hv-section hv-story">
        <div className="hv-wrap">
          <div className="hv-story__row">
            <div className="hv-story__media" data-parallax-wrap data-reveal>
              <img data-parallax-img src={IMG('arch-14')} alt="Interior office corridor with glass partitions" />
            </div>
            <div className="hv-story__text" data-reveal>
              <div className="hv-story__num">01 — Concept</div>
              <h3 className="hv-story__heading">From Sketch to Strategy</h3>
              <p className="hv-story__body">
                Every commission starts as a conversation, not a brief. We sit with
                developers and site conditions until the pencil work turns into direction —
                grounded, specific to the plot, and strategic enough to survive contact with
                a budget.
              </p>
            </div>
          </div>

          <div className="hv-story__row hv-story__row--reverse">
            <div className="hv-story__media" data-parallax-wrap data-reveal>
              <img data-parallax-img src={IMG('arch-15')} alt="Aerial view of a construction site with engineers reviewing plans" />
            </div>
            <div className="hv-story__text" data-reveal>
              <div className="hv-story__num">02 — Development</div>
              <h3 className="hv-story__heading">Precision in Development</h3>
              <p className="hv-story__body">
                Layouts tighten. Volumes get tested against light, structure, and cost before
                they get tested against anything else. Facade logic is resolved down to the
                joint before a single sheet leaves the studio for site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Selected Projects ---------- */}
      <section className="hv-section hv-projects" id="work">
        <div className="hv-wrap">
          <div className="hv-projects__head" data-reveal>
            <h3 className="hv-projects__heading">Eight projects, one standard of care.</h3>
            <span className="hv-projects__count">Selected Work / 08</span>
          </div>
          <div className="hv-projects__grid" data-stagger-group>
            {PROJECTS.map((p, i) => (
              <div className="hv-project" key={p.name} data-stagger-item>
                <img className="hv-project__img" src={p.img} alt={p.name} />
                <span className="hv-project__index">{String(i + 1).padStart(2, '0')}</span>
                <div className="hv-project__info">
                  <div className="hv-project__type">{p.type}</div>
                  <div className="hv-project__name">{p.name}</div>
                  <div className="hv-project__size">{p.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Studio Philosophy ---------- */}
      <section className="hv-philosophy">
        <div className="hv-philosophy__bg"><img src={IMG('arch-03')} alt="Sculptural blue curved building facade" /></div>
        <div className="hv-wrap hv-philosophy__inner">
          <div className="hv-philosophy__eyebrow" data-reveal>Studio Philosophy</div>
          <h3 className="hv-philosophy__line" data-reveal>Refined. Bold. <em>Essential.</em></h3>
          <p className="hv-philosophy__sub" data-reveal>
            Simplicity isn&rsquo;t the absence of ambition — it&rsquo;s the discipline that
            survives it. Every project gets reduced until only the necessary decisions
            remain visible.
          </p>
        </div>
      </section>

      {/* ---------- Team ---------- */}
      <section className="hv-section hv-team" id="team">
        <div className="hv-wrap">
          <div className="hv-team__head" data-reveal>
            <div className="hv-eyebrow">People &amp; Process</div>
            <h3 className="hv-team__heading">A studio built on clarity, trust, and one shared standard.</h3>
            <p className="hv-team__sub">
              Thirty-eight people, one line of judgment from first sketch to final handover.
            </p>
          </div>
          <div className="hv-team__grid" data-stagger-group>
            {TEAM.map((m) => (
              <div className="hv-member" key={m.name} data-stagger-item>
                <div className="hv-member__photo"><img src={m.img} alt={m.name} /></div>
                <div className="hv-member__name">{m.name}</div>
                <div className="hv-member__role">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Stats ---------- */}
      <section className="hv-stats">
        <div className="hv-wrap">
          <div className="hv-stats__grid">
            <div data-reveal>
              <div className="hv-stat__value"><AnimatedCounter value={14} suffix="+" /></div>
              <div className="hv-stat__label">Years of Practice</div>
            </div>
            <div data-reveal>
              <div className="hv-stat__value"><AnimatedCounter value={260} suffix="+" /></div>
              <div className="hv-stat__label">Completed Projects</div>
            </div>
            <div data-reveal>
              <div className="hv-stat__value"><AnimatedCounter value={38} suffix="+" /></div>
              <div className="hv-stat__label">Studio Professionals</div>
            </div>
            <div data-reveal>
              <div className="hv-stat__value"><AnimatedCounter value={210} suffix="K m²" /></div>
              <div className="hv-stat__label">Total Area Delivered</div>
            </div>
          </div>
          <p className="hv-stats__note" data-reveal>
            Passive-first strategies, honest material logic, and lifecycle thinking on every
            commission — not a checkbox, a constraint we design inside of.
          </p>
        </div>
      </section>

      {/* ---------- Partners marquee ---------- */}
      <section className="hv-marquee-section">
        <div className="hv-wrap">
          <div className="hv-eyebrow">Collaborators</div>
          <h3 className="hv-marquee-heading">The world&rsquo;s most deliberate developers build with us.</h3>
        </div>
        <div className="hv-marquee">
          <div className="hv-marquee__track" data-marquee data-speed="22">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <span className="hv-marquee__item" key={i}>{p}<i className="hv-marquee__dot" /></span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="hv-cta" id="contact">
        <div className="hv-wrap">
          <h3 className="hv-cta__heading" data-reveal>Have a plot, a program, or just a question?</h3>
          <a href="mailto:studio@halvorsenbureau.no" className="hv-cta__button" data-reveal>
            Start a Conversation &rarr;
          </a>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="hv-footer">
        <div className="hv-wrap">
          <div className="hv-footer__top">
            <div>
              <div className="hv-footer__brand">Halvorsen</div>
              <p className="hv-footer__tag">
                Architectural Bureau — systematic clarity and quiet ambition, practiced across
                Norway and the Netherlands since 2012.
              </p>
            </div>
            <div>
              <div className="hv-footer__label">Navigate</div>
              <div className="hv-footer__list">
                <a href="#work">Work</a>
                <a href="#studio">Studio</a>
                <a href="#team">Team</a>
                <a href="#contact">Contact</a>
                <a href="mailto:studio@halvorsenbureau.no">Order Design</a>
              </div>
            </div>
            <div>
              <div className="hv-footer__label">Connect</div>
              <div className="hv-footer__list">
                <a href="#" onClick={(e) => e.preventDefault()}>Behance</a>
                <a href="#" onClick={(e) => e.preventDefault()}>Instagram</a>
                <a href="#" onClick={(e) => e.preventDefault()}>LinkedIn</a>
                <a href="mailto:studio@halvorsenbureau.no">Email</a>
              </div>
            </div>
            <div>
              <div className="hv-footer__label">Oslo (HQ)</div>
              <div className="hv-footer__addr">Havnegata 8, 0150 Oslo, Norway</div>
              <div className="hv-footer__label">Rotterdam</div>
              <div className="hv-footer__addr">Wilhelminakade 47, 3072 Rotterdam, Netherlands</div>
            </div>
            <div>
              <div className="hv-footer__label">Studio Hours</div>
              <div className="hv-footer__list">
                <span>Mon &ndash; Fri: 09:00 &ndash; 18:00</span>
                <span>Saturday: 10:00 &ndash; 14:00</span>
                <span>Sunday: Closed</span>
              </div>
            </div>
          </div>
          <div className="hv-footer__bottom">
            <span>License No. NO-AR-2012-48213 &middot; NL-BA-77410256</span>
            <span>Photography via Unsplash. Visual design &amp; development — Infinity Pillars Studio.</span>
            <span>&copy; 2026 Halvorsen Architectural Bureau. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HalvorsenPage;
