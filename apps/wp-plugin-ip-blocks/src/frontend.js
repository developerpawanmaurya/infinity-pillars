import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './frontend.css';

gsap.registerPlugin(ScrollTrigger);

function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(() => {
  initStatCounters();
  initScrollTimeline();
  initTiltGrid();
  initFlipComparison();
  initParallaxHero();
  initProcessSteps();
  initSpotlightCta();
  initQuoteRotator();
  initExplodingTakeaways();
  initDataBars();
});

// ─── 1. 3D Stat Counter ──────────────────────────────────────────────────────
function initStatCounters() {
  document.querySelectorAll('.ip-sc3d').forEach(block => {
    const cards = block.querySelectorAll('.ip-sc3d-card');
    gsap.set(cards, { rotateX: -50, y: 70, opacity: 0, transformPerspective: 800 });

    ScrollTrigger.create({
      trigger: block,
      start: 'top 80%',
      onEnter() {
        gsap.to(cards, {
          rotateX: 0,
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          onComplete: () => floatCards(cards),
        });

        cards.forEach(card => {
          const numEl  = card.querySelector('.ip-sc3d-num');
          const target = parseFloat(card.dataset.target) || 0;
          const isFloat = String(target).includes('.');
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.2,
            ease: 'power2.out',
            delay: 0.3,
            onUpdate() {
              numEl.textContent = isFloat ? obj.val.toFixed(1) : Math.floor(obj.val);
            },
          });
        });
      },
    });
  });
}

function floatCards(cards) {
  cards.forEach((card, i) => {
    gsap.to(card, {
      y: -12,
      duration: 2.2 + i * 0.25,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });
}

// ─── 2. 3D Scroll Timeline ───────────────────────────────────────────────────
function initScrollTimeline() {
  document.querySelectorAll('.ip-timeline-3d').forEach(block => {
    const progress = block.querySelector('.ip-t3d-progress');
    const items    = block.querySelectorAll('.ip-t3d-item');
    const dots     = block.querySelectorAll('.ip-t3d-dot');

    if (progress) {
      gsap.fromTo(progress,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: block,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 1,
          },
        }
      );
    }

    items.forEach(item => {
      const isLeft = item.classList.contains('ip-t3d-left');
      gsap.fromTo(item,
        { x: isLeft ? -100 : 100, opacity: 0, rotateY: isLeft ? -20 : 20 },
        {
          x: 0,
          opacity: 1,
          rotateY: 0,
          duration: 0.85,
          ease: 'power3.out',
          transformPerspective: 1000,
          scrollTrigger: { trigger: item, start: 'top 88%' },
        }
      );
    });

    dots.forEach(dot => {
      gsap.fromTo(dot,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: dot, start: 'top 88%' },
        }
      );
    });
  });
}

// ─── 3. 3D Tilt Feature Grid ─────────────────────────────────────────────────
function initTiltGrid() {
  document.querySelectorAll('.ip-tilt-grid').forEach(grid => {
    const cards = grid.querySelectorAll('.ip-tilt-card');

    gsap.fromTo(cards,
      { y: 70, opacity: 0, scale: 0.88 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: grid, start: 'top 82%' },
      }
    );

    cards.forEach(card => {
      const inner = card.querySelector('.ip-tilt-inner');
      const shine = card.querySelector('.ip-tilt-shine');

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left) / rect.width  - 0.5;
        const y    = (e.clientY - rect.top)  / rect.height - 0.5;

        gsap.to(inner, {
          rotateY:  x * 22,
          rotateX: -y * 22,
          duration: 0.35,
          ease: 'power2.out',
          transformPerspective: 700,
        });

        if (shine) {
          gsap.to(shine, {
            opacity: 0.18 + Math.abs(x) * 0.25,
            left: (x + 0.5) * 100 + '%',
            top:  (y + 0.5) * 100 + '%',
            duration: 0.35,
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(inner, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
        if (shine) gsap.to(shine, { opacity: 0, duration: 0.4 });
      });
    });
  });
}

// ─── 4. 3D Flip Comparison ───────────────────────────────────────────────────
function initFlipComparison() {
  document.querySelectorAll('.ip-flip3d').forEach(block => {
    const before = block.querySelector('.ip-flip3d-before');
    const after  = block.querySelector('.ip-flip3d-after');

    gsap.set([before, after], { rotateY: -180, transformPerspective: 1200 });

    ScrollTrigger.create({
      trigger: block,
      start: 'top 78%',
      onEnter() {
        gsap.to(before, { rotateY: 0, duration: 1.1, ease: 'power3.inOut' });
        gsap.to(after,  { rotateY: 0, duration: 1.1, ease: 'power3.inOut', delay: 0.45 });
      },
    });
  });
}

// ─── 5. Parallax Hero ────────────────────────────────────────────────────────
function initParallaxHero() {
  document.querySelectorAll('.ip-parallax-hero').forEach(block => {
    const bg   = block.querySelector('.ip-ph-bg');
    const orbs = block.querySelectorAll('.ip-ph-orb');
    const mid  = block.querySelector('.ip-ph-mid');
    const fg   = block.querySelector('.ip-ph-fg');
    const st   = { trigger: block, start: 'top bottom', end: 'bottom top', scrub: 1.5 };

    if (bg)   gsap.to(bg,   { y: '-25%', ease: 'none', scrollTrigger: st });
    orbs.forEach((orb, i) => gsap.to(orb, { y: `-${15 + i * 8}%`, ease: 'none', scrollTrigger: st }));
    if (mid)  gsap.to(mid,  { y: '-12%', ease: 'none', scrollTrigger: st });

    if (fg) {
      gsap.fromTo([...fg.children],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: block, start: 'top 82%' },
        }
      );
    }
  });
}

// ─── 6. 3D Process Steps ─────────────────────────────────────────────────────
function initProcessSteps() {
  document.querySelectorAll('.ip-process-steps').forEach(block => {
    const items = block.querySelectorAll('.ip-ps-item');

    items.forEach((item, i) => {
      const isLeft  = item.classList.contains('ip-ps-left');
      const num     = item.querySelector('.ip-ps-num');
      const content = item.querySelector('.ip-ps-content');
      const line    = item.querySelector('.ip-ps-line');

      if (num) {
        gsap.fromTo(num,
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(2)', scrollTrigger: { trigger: item, start: 'top 87%' } }
        );
      }

      if (content) {
        gsap.fromTo(content,
          { x: isLeft ? -70 : 70, opacity: 0, skewX: isLeft ? -6 : 6 },
          { x: 0, opacity: 1, skewX: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 87%' } }
        );
      }

      if (line) {
        gsap.fromTo(line,
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: 'top center', duration: 0.55, delay: 0.3, ease: 'power2.out', scrollTrigger: { trigger: item, start: 'top 87%' } }
        );
      }
    });
  });
}

// ─── 7. Spotlight CTA ────────────────────────────────────────────────────────
function initSpotlightCta() {
  document.querySelectorAll('.ip-spotlight-cta').forEach(block => {
    const beam     = block.querySelector('.ip-spc-beam');
    const words    = block.querySelectorAll('.ip-spc-headline span');
    const sub      = block.querySelector('.ip-spc-sub');
    const btn      = block.querySelector('.ip-spc-btn');
    const particles = block.querySelector('.ip-spc-particles');

    // Text entrance
    gsap.fromTo([...words, sub].filter(Boolean),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: block, start: 'top 82%' },
      }
    );

    // Beam follows mouse with silky lag
    if (beam) {
      let bx = 0, by = 0;
      const xTo = gsap.quickTo(beam, 'x', { duration: 0.7, ease: 'power3.out' });
      const yTo = gsap.quickTo(beam, 'y', { duration: 0.7, ease: 'power3.out' });

      block.addEventListener('mouseenter', () => gsap.to(beam, { opacity: 1, duration: 0.4 }));
      block.addEventListener('mouseleave', () => gsap.to(beam, { opacity: 0, duration: 0.6 }));
      block.addEventListener('mousemove', e => {
        const rect = block.getBoundingClientRect();
        xTo(e.clientX - rect.left  - rect.width  / 2);
        yTo(e.clientY - rect.top   - rect.height / 2);
      });
    }

    // Magnetic button
    if (btn) {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width  / 2) * 0.4;
        const y = (e.clientY - rect.top  - rect.height / 2) * 0.4;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    }

    // Floating particles (CSS-injected spans)
    if (particles) spawnParticles(particles);
  });
}

function spawnParticles(container) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'ip-spc-particle';
    container.appendChild(p);

    gsap.set(p, {
      x: Math.random() * 100 + '%',
      y: Math.random() * 100 + '%',
      scale: Math.random() * 0.6 + 0.2,
      opacity: 0,
    });

    gsap.to(p, {
      y: '-=' + (Math.random() * 80 + 40) + 'px',
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 4 + 3,
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 3,
      ease: 'sine.inOut',
    });
  }
}

// ─── 8. 3D Quote Rotator ─────────────────────────────────────────────────────
function initQuoteRotator() {
  document.querySelectorAll('.ip-quote-rotator').forEach(block => {
    const slides  = [...block.querySelectorAll('.ip-qr-slide')];
    const dots    = [...block.querySelectorAll('.ip-qr-dot')];
    const prevBtn = block.querySelector('.ip-qr-prev');
    const nextBtn = block.querySelector('.ip-qr-next');

    if (slides.length < 2) return;

    let current     = 0;
    let isAnimating = false;

    // Hide all but first
    gsap.set(slides.slice(1), { opacity: 0, x: '60%', rotateY: 30, position: 'absolute', top: 0, left: 0, right: 0 });

    function goTo(next, dir = 1) {
      if (isAnimating || next === current) return;
      isAnimating = true;

      const out = slides[current];
      const inn = slides[next];

      gsap.set(inn, { opacity: 0, x: dir * 60 + '%', rotateY: dir * 30 });

      gsap.to(out, { opacity: 0, x: -dir * 40 + '%', rotateY: -dir * 20, duration: 0.45, ease: 'power2.in' });
      gsap.to(inn, {
        opacity: 1,
        x: '0%',
        rotateY: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'power3.out',
        transformPerspective: 900,
        onComplete() {
          isAnimating = false;
          current = next;
          dots.forEach((d, i) => d.classList.toggle('ip-qr-dot-active', i === current));
        },
      });
    }

    const next = () => goTo((current + 1) % slides.length,  1);
    const prev = () => goTo((current - 1 + slides.length) % slides.length, -1);

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i, i > current ? 1 : -1)));

    let auto = setInterval(next, 5000);
    block.addEventListener('mouseenter', () => clearInterval(auto));
    block.addEventListener('mouseleave', () => { auto = setInterval(next, 5000); });

    // Entrance
    gsap.fromTo(block,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: block, start: 'top 82%' } }
    );
  });
}

// ─── 9. Exploding Takeaways ──────────────────────────────────────────────────
function initExplodingTakeaways() {
  document.querySelectorAll('.ip-exploding-takeaways').forEach(block => {
    const orb   = block.querySelector('.ip-et-orb');
    const items = block.querySelectorAll('.ip-et-item');

    gsap.set(items, { opacity: 0, y: 30, scale: 0.85 });

    ScrollTrigger.create({
      trigger: block,
      start: 'top 80%',
      onEnter() {
        // Orb entrance + pulse
        if (orb) {
          gsap.fromTo(orb,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.5)' }
          );
          gsap.to(orb, {
            scale: 1.15,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: 0.6,
          });
        }

        // Items burst in staggered
        items.forEach((item, i) => {
          gsap.fromTo(item,
            {
              opacity: 0,
              scale: 0,
              y: 20,
              x: (Math.random() - 0.5) * 30,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              x: 0,
              duration: 0.65,
              ease: 'back.out(1.7)',
              delay: 0.25 + i * 0.1,
            }
          );
        });
      },
    });
  });
}

// ─── 10. Animated Data Bars ──────────────────────────────────────────────────
function initDataBars() {
  document.querySelectorAll('.ip-data-bars').forEach(block => {
    const fills  = block.querySelectorAll('.ip-db-fill');
    const labels = block.querySelectorAll('.ip-db-label');
    const values = block.querySelectorAll('.ip-db-value');

    gsap.set(fills,  { width: '0%' });
    gsap.set(labels, { x: -30, opacity: 0 });
    gsap.set(values, { opacity: 0 });

    ScrollTrigger.create({
      trigger: block,
      start: 'top 82%',
      onEnter() {
        gsap.to(labels, { x: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' });
        gsap.to(values, { opacity: 1, stagger: 0.08, duration: 0.5, delay: 0.1, ease: 'power2.out' });

        fills.forEach((fill, i) => {
          const target = parseInt(fill.dataset.width, 10) || 0;
          const valEl  = values[i];

          gsap.to(fill, {
            width: target + '%',
            duration: 1.6,
            delay: 0.15 + i * 0.1,
            ease: 'power4.out',
          });

          if (valEl) {
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: 1.6,
              delay: 0.15 + i * 0.1,
              ease: 'power4.out',
              onUpdate() { valEl.textContent = Math.floor(obj.v) + '%'; },
            });
          }
        });
      },
    });
  });
}
