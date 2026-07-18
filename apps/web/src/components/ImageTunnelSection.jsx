import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll-driven "fly-through" of 5 images — each one grows from small/
// distant/transparent to large/near/opaque as it scrolls into focus, then
// keeps growing while fading out as if the camera flew past it, straight
// into the next. A CSS `perspective` on the wrapper plus per-image
// translateZ gives the scale changes real depth instead of a flat zoom.
// Reuses the site's own service renders — real assets already in the
// project rather than new stock placeholders.
const IMAGES = [
  { src: '/images/services/package-1.webp', alt: 'Connected product foundation — laptop, mobile app, sitemap, code and analytics modules linked together' },
  { src: '/images/services/package-2.webp', alt: 'Scaled ecosystem — dashboard, secured servers, AI automation, user management and growth analytics' },
  { src: '/images/services/a-la-carte-1.webp', alt: 'Design tooling — browser wireframe, mobile mockup, Figma, analytics and user research' },
  { src: '/images/services/a-la-carte-2.webp', alt: 'Engineering stack — code editor, configuration, performance metering and databases' },
  { src: '/images/services/a-la-carte-3.webp', alt: 'Organisational scaling — team org chart, task checklist, workflow automation and integrations' },
];

// Scroll distance dedicated to each image's full enter+exit — tune this one
// number to make the whole flythrough feel faster/slower ("look good").
const PX_PER_IMAGE = 700;

const ImageTunnelSection = () => {
  const pinRef    = useRef(null);
  const planeRefs = useRef([]);

  useEffect(() => {
    if (!pinRef.current) return;

    const ctx = gsap.context(() => {
      const planes = planeRefs.current;
      gsap.set(planes, { opacity: 0, scale: 0.5, z: -500 });
      gsap.set(planes[0], { opacity: 1, scale: 1, z: 0 });

      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: 'top top',
          end: `+=${PX_PER_IMAGE * IMAGES.length}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      planes.forEach((plane, i) => {
        const seg = gsap.timeline();
        if (i > 0) {
          // Enter: rises from small/distant/transparent to full size/opacity.
          seg.fromTo(plane,
            { opacity: 0, scale: 0.5, z: -500 },
            { opacity: 1, scale: 1, z: 0, duration: 0.4, ease: 'power1.out' },
            0
          );
        }
        if (i < planes.length - 1) {
          // Exit: keeps growing while fading, as if flying past/through it.
          // Always starts at local 0.4 (even for the first plane, which has
          // no enter tween of its own) so it stays fully visible from 0-0.4
          // then hands off to the next plane's enter with zero dead time —
          // previously this used 0 for i===0, leaving a gap where neither
          // plane was visible (confirmed via opacity sampling across scroll
          // progress: 0.15 showed every plane at opacity 0 simultaneously).
          seg.to(plane,
            { opacity: 0, scale: 1.6, z: 500, duration: 0.6, ease: 'power1.in' },
            0.4
          );
        }
        mainTl.add(seg, i * 1); // each image gets an equal, sequential slice
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, pinRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={pinRef}
      className="relative h-[100svh] overflow-hidden bg-foreground"
      style={{ perspective: '1200px' }}
      aria-label="Scrolling image showcase"
    >
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            ref={(el) => (planeRefs.current[i] = el)}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 'min(70vw, 720px)',
              aspectRatio: '16 / 10',
              transform: 'translate(-50%, -50%)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
              willChange: 'transform, opacity',
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="eager"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageTunnelSection;
