import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ServicesScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const LIME       = '#AFEA00'; // theme green (pills/CTAs — unchanged brand accent)
const GREEN_WASH = '#CDF06B'; // panel 04 background — same green, softened/lighter so it's not as vibrant as full lime
const LIGHT_LIME = '#D9FF7A'; // light green of theme
const PALE_LIME  = '#F1FFD6'; // very light green of theme
const BLACK      = '#121212';
const WHITE      = '#FFFFFF';

// ─── Content: our 5 core services, paired with the real service imagery
// already used on /services (packages 1–2, à-la-carte 1–3). The section
// ramps white → very light green → light green → green → black as you
// scroll through them, so every crossfade stays inside one hue family —
// no white↔black hop, which was passing through a muddy grey midpoint.
// `dark` drives the one panel (05, on black) that needs inverted text/pill;
// every lighter panel reads fine with the site's normal dark text. ─────────
const SERVICES = [
  {
    number: '01',
    title: 'The Product Foundation Blueprint',
    description: 'A comprehensive transformation that transitions an idea from a rough business concept into a fully functional digital product — with the infrastructure to convert visitors into paying clients.',
    image: '/images/services/package-1.webp',
    alt: 'Connected product foundation — laptop, mobile app, sitemap, code and analytics modules linked together',
    dark: false,
  },
  {
    number: '02',
    title: 'The Scale & Scale-Up Ecosystem',
    description: 'Engineering multi-layered web systems integrated with product intelligence, data security, and team-building consulting — for organisations ready to move beyond early-stage.',
    image: '/images/services/package-2.webp',
    alt: 'Scaled ecosystem — dashboard, secured servers, AI automation, user management and growth analytics',
    dark: false,
  },
  {
    number: '03',
    title: 'Product Strategy & UX Design',
    description: 'Brand strategy, identity systems, and a full UX audit/redesign — prototyped in high-fidelity Figma around conversion psychology, not aesthetic preference.',
    image: '/images/services/a-la-carte-1.webp',
    alt: 'Design tooling — browser wireframe, mobile mockup, Figma, analytics and user research',
    dark: false,
  },
  {
    number: '04',
    title: 'Technical Engineering & Code',
    description: 'Custom web app and portal development wired directly into WhatsApp API and CRM integrations — the engineering backbone that keeps leads moving.',
    image: '/images/services/a-la-carte-2.webp',
    alt: 'Engineering stack — code editor, configuration, performance metering and databases',
    dark: false,
  },
  {
    number: '05',
    title: 'Organisational Scaling & Operations',
    description: 'Talent acquisition strategy, SOPs, and workflow automation documentation — the operational systems that let growth outlast our engagement.',
    image: '/images/services/a-la-carte-3.webp',
    alt: 'Organisational scaling — team org chart, task checklist, workflow automation and integrations',
    dark: true,
  },
];

// One color per panel/service, in order — panel i's band wipes away to
// reveal panel (i+1)'s underneath it, same mechanic as the images.
const PANEL_COLORS = [WHITE, PALE_LIME, LIGHT_LIME, GREEN_WASH, BLACK];

const ServicesScrollReveal = () => {
  const washRef    = useRef(null);
  const archRef    = useRef(null);
  const rightRef   = useRef(null);
  const washPinRef = useRef(null);

  useEffect(() => {
    if (!archRef.current) return;

    let cancelled = false;
    let ctx;

    const setup = () => {
      if (cancelled || !archRef.current) return;

      ctx = gsap.context(() => {
        const imgs = gsap.utils.toArray(archRef.current.querySelectorAll('.ssr-img-wrapper img'));

        // Stacking order mirrors the CodePen: each image's data-index becomes
        // its z-index, so the first-listed (topmost service) paints on top
        // and wipes away first as the user scrolls.
        archRef.current.querySelectorAll('.ssr-img-wrapper').forEach((el) => {
          const order = el.getAttribute('data-index');
          if (order !== null) el.style.zIndex = order;
        });

        const bands = gsap.utils.toArray(washRef.current.querySelectorAll('.ssr-wash-band'));
        washRef.current.querySelectorAll('.ssr-wash-band').forEach((el) => {
          const order = el.getAttribute('data-index');
          if (order !== null) el.style.zIndex = order;
        });

        ScrollTrigger.matchMedia({
          '(min-width: 769px)': () => {
            const mainTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: archRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: rightRef.current,
                scrub: true,
                anticipatePin: 1,
                // Sits below the hero's pin (refreshPriority 10) but above
                // the testimonial word-reveal further down the page — same
                // reasoning as the hero effect: this pin's spacer must be
                // measured before triggers below it, or they fire early.
                refreshPriority: 5,
              },
            });

            // Second, independent pin on the identical trigger/range — pins
            // the full-bleed color-band layer in lockstep with the image
            // column above. Two pins sharing one trigger stay perfectly in
            // sync because both derive progress from the same scroll math.
            const bandTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: archRef.current,
                start: 'top top',
                end: 'bottom bottom',
                pin: washPinRef.current,
                scrub: true,
                anticipatePin: 1,
                refreshPriority: 5,
              },
            });

            gsap.set(imgs, { clipPath: 'inset(0)', objectPosition: '0px 0%' });
            gsap.set(bands, { clipPath: 'inset(0)' });

            imgs.forEach((currentImage, index) => {
              const nextImage = imgs[index + 1] || null;
              if (!nextImage) return;

              const sectionTimeline = gsap.timeline();
              sectionTimeline
                .to(currentImage, {
                  clipPath: 'inset(0px 0px 100%)',
                  objectPosition: '0px 60%',
                  duration: 1.5,
                  ease: 'none',
                }, 0)
                .to(nextImage, {
                  objectPosition: '0px 40%',
                  duration: 1.5,
                  ease: 'none',
                }, 0);

              mainTimeline.add(sectionTimeline);

              // Same duration/easing, same relative position — the color
              // band wipes at the exact same rate as its paired image, so
              // the hard edge and the image reveal move as one.
              bandTimeline.add(
                gsap.timeline().to(bands[index], {
                  clipPath: 'inset(0px 0px 100%)',
                  duration: 1.5,
                  ease: 'none',
                }, 0)
              );
            });
          },
          '(max-width: 768px)': () => {
            gsap.set(imgs, { objectPosition: '0px 60%' });

            imgs.forEach((image, index) => {
              gsap.timeline({
                scrollTrigger: {
                  trigger: image,
                  start: 'top-=70% top+=50%',
                  end: 'bottom+=200% bottom',
                  scrub: true,
                },
              })
                .to(image, { objectPosition: '0px 30%', duration: 5, ease: 'none' })
                // Hard snap, not a tween — no grey/blended midpoint.
                .set(washRef.current, { backgroundColor: PANEL_COLORS[index + 1] });
            });
          },
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, archRef);
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setup);
    } else {
      setup();
    }

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section className="py-24 md:py-32 border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Core Services</h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Five focused disciplines, engineered to work together as a single system — scroll to see each one.
        </p>
      </div>

      {/* Wash wrapper — mobile-only background (desktop's color reveal lives
          in .ssr-wash-pin below, pinned full-bleed). Starts white inline to
          match panel 01, before any scroll/JS has run. position:relative so
          .ssr-wash-pin (a sibling of .ssr-arch, not nested inside its flex
          row — see that CSS comment) has a containing block to break out
          of. */}
      <div ref={washRef} style={{ backgroundColor: WHITE, position: 'relative' }}>
        {/* Full-bleed color bands — pinned in sync with .ssr-arch__right
            (see the effect below) so each solid color wipes up and covers
            the whole screen with a hard edge, same clip-path mechanic as
            the images, instead of a blended color crossfade. */}
        <div ref={washPinRef} className="ssr-wash-pin" aria-hidden="true">
          {SERVICES.map((service, index) => (
            <div
              className="ssr-wash-band"
              data-index={SERVICES.length - index}
              key={service.number}
              style={{ backgroundColor: PANEL_COLORS[index] }}
            />
          ))}
        </div>

        <div ref={archRef} className="ssr-arch px-4 sm:px-6 lg:px-8">
          <div className="ssr-arch__left">
            {SERVICES.map((service) => (
              <div className="ssr-arch__info" key={service.number}>
                <div>
                  {/* A solid badge, not bare colored text — on the light-green/
                      green panels (03, 04) plain lime/black text sitting
                      directly on a similarly-toned background read weakly.
                      A self-contained chip (same black/lime pairing as the
                      "Learn More" pill below) guarantees strong contrast no
                      matter what's behind it. */}
                  <div
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold tracking-widest mb-4"
                    style={{
                      backgroundColor: service.dark ? LIME : BLACK,
                      color: service.dark ? BLACK : LIME,
                    }}
                  >
                    {service.number}
                  </div>
                  {/* Same idea as the number badge — a highlighter-style
                      solid chip behind the text, not bare colored text. Plain
                      black-on-green (technically legible) still read weakly
                      on the brighter washes. box-decoration-break: clone
                      makes the background wrap per-line, like an actual
                      highlighter marker across the two title lines, instead
                      of one box stretching the full paragraph width. */}
                  <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-[1.4]">
                    <span
                      style={{
                        backgroundColor: service.dark ? LIME : BLACK,
                        color: service.dark ? BLACK : LIME,
                        padding: '0.05em 0.35em',
                        borderRadius: '0.15em',
                        boxDecorationBreak: 'clone',
                        WebkitBoxDecorationBreak: 'clone',
                      }}
                    >
                      {service.title}
                    </span>
                  </h3>
                  <p className={`leading-relaxed mb-7 ${service.dark ? 'text-white/70' : 'text-[#121212]/70'}`}>{service.description}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium"
                    style={{
                      backgroundColor: service.dark ? LIME : BLACK,
                      color: service.dark ? BLACK : LIME,
                    }}
                  >
                    Learn More <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div ref={rightRef} className="ssr-arch__right">
            {SERVICES.map((service, index) => (
              <div className="ssr-img-wrapper" data-index={SERVICES.length - index} key={service.number}>
                <img src={service.image} alt={service.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesScrollReveal;
