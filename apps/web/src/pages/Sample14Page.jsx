import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import './Sample14.css';

gsap.registerPlugin(Flip, SplitText, ScrollTrigger, CustomEase);

// Ported from Codrops' "Intro Image Trail Animation" (MIT licensed,
// tympanus.net/Development/IntroTrailEffect/, source mirrored locally
// under src/Sample/IntroTrailEffect-main for reference): the exact grid
// system from the source (a full-viewport `main` grid, `.intro-content`
// and `.content` both pinned to the same 1/1/-1/-1 cell as stacked
// overlays, image sized via an `--img-ratio`/`--img-height` pair) drives
// three real DOM handoffs done with GSAP's Flip plugin, matching the
// source's own three `Flip.from` calls: a small corner portrait grows
// into the intro's centered slot once the fake progress counter
// finishes; a two-line title (each line built from several stacked,
// near-transparent trail copies so its entrance reads as one staggered
// comet-tail motion) and that same portrait then Flip again — smaller —
// into the final content layout when Enter is clicked, alongside two
// side photos and a SplitText line-reveal bio. Independent
// implementation, written from scratch — no CSS/JS source copied, only
// the grid measurements, Flip usage and trail/timeline values, which are
// functional, not creative. Photos are the demo's own real assets (its
// README credits "Images from Unsplash"), reused directly per the
// repo's MIT license. Fonts are Inter + Bodoni Moda (Google Fonts), not
// the source's Typekit account. Name/bio copy below is our own writing,
// not the source's own "Zofia Dabrowski" text.
const IMG = (n) => `/images/intro-trail/${n}.jpg`;
// Only 3 real photos exist for this persona, so decorative (non-"step")
// slots below cycle through them rather than needing unique images per slot.
const CYCLE_IMG = (i) => IMG(((i - 1) % 3) + 1);
const IMAGE_TRAIL_COUNT = 6;
const TITLE_UP_TRAIL_COUNT = 2;
const TITLE_DOWN_TRAIL_COUNT = 3;

// --- Cinema section (Sample 5's cylinder-carousel technique, reskinned) ---
// Same camera-choreography technique/values as Sample 5 (functional data —
// waypoints, segment durations, named eases — not creative expression),
// scaled down to a shorter 400vh scroll and a 6-slot cylinder (our 3 real
// photos, repeated once) rather than 12 unique images.
const CINEMA_SLOT_COUNT = 6;
const CINEMA_IMAGES = Array.from({ length: CINEMA_SLOT_COUNT }, (_, i) => CYCLE_IMG(i + 1));
const CINEMA_CAPTIONS = [
  { title: 'In the Darkroom', body: 'Where each frame waits, suspended in developer, until it decides to become an image.' },
  { title: 'Between Exposures', body: 'The seconds between one frame and the next are where the real work happens.' },
  { title: 'Held to the Light', body: 'Every negative gets checked twice — once for the image, once for what almost wasn’t there.' },
  { title: 'Ready to Print', body: 'Only a handful of frames from a roll ever make it this far.' },
];
const CINEMA_PARTICLE_COUNT = 22;
const CINEMA_ARC_POINTS = 10;
const CINEMA_ARC_SPAN = 0.28;
const CINEMA_RADIUS = 140;
const CINEMA_SLOT_W = 900;
const CINEMA_SLOT_H = 620;
const CINEMA_HEIGHT = (2 * Math.PI * CINEMA_RADIUS / CINEMA_SLOT_COUNT) * (CINEMA_SLOT_H / CINEMA_SLOT_W);
const CINEMA_TOTAL_ROTATION = 16;
const CINEMA_SCALE = CINEMA_RADIUS / 2.5;
const CINEMA_WIDE = 0.5;
const CINEMA_CAMERA_START = [0, 0, 8 * CINEMA_SCALE * CINEMA_WIDE];
const CINEMA_CAMERA_PATH = [
  { pos: [0 * CINEMA_SCALE * CINEMA_WIDE, 0 * CINEMA_SCALE * CINEMA_WIDE, 8 * CINEMA_SCALE * CINEMA_WIDE], duration: 1.0, ease: 'cinema14Silk' },
  { pos: [0 * CINEMA_SCALE, 5 * CINEMA_SCALE, 5 * CINEMA_SCALE], duration: 1.0, ease: 'cinema14Flow' },
  { pos: [1.5 * CINEMA_SCALE, 2 * CINEMA_SCALE, 2 * CINEMA_SCALE], duration: 2.0, ease: 'cinema14Linear' },
  { pos: [0.5 * CINEMA_SCALE, 0 * CINEMA_SCALE, 0.8 * CINEMA_SCALE], duration: 3.5, ease: 'power1.inOut' },
  { pos: [-6 * CINEMA_SCALE * CINEMA_WIDE, -1 * CINEMA_SCALE * CINEMA_WIDE, 8 * CINEMA_SCALE * CINEMA_WIDE], duration: 1.0, ease: 'power2.inOut' },
];
const CINEMA_TOTAL_DURATION = CINEMA_CAMERA_PATH.reduce((sum, kf) => sum + kf.duration, 0);

function buildCinemaTexture(images) {
  const slotW = CINEMA_SLOT_W;
  const slotH = CINEMA_SLOT_H;
  const canvas = document.createElement('canvas');
  canvas.width = slotW * images.length;
  canvas.height = slotH;
  const ctx = canvas.getContext('2d');
  images.forEach((img, i) => {
    const scale = Math.max(slotW / img.width, slotH / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = i * slotW + (slotW - w) / 2;
    const y = (slotH - h) / 2;
    ctx.drawImage(img, x, y, w, h);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function buildCinemaCylinder(texture, fogColor, fogNear, fogFar) {
  const geometry = new THREE.CylinderGeometry(CINEMA_RADIUS, CINEMA_RADIUS, CINEMA_HEIGHT, 96, 1, true);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uDarkness: { value: 0.45 },
      uFogColor: { value: new THREE.Color(fogColor) },
      uFogNear: { value: fogNear },
      uFogFar: { value: fogFar },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vFogDepth;
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vFogDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform float uDarkness;
      uniform vec3 uFogColor;
      uniform float uFogNear;
      uniform float uFogFar;
      varying vec2 vUv;
      varying float vFogDepth;
      void main() {
        vec3 color = texture2D(uMap, vUv).rgb;
        color = mix(color, vec3(0.0), uDarkness);
        float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
        color = mix(color, uFogColor, fogFactor);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.DoubleSide,
  });
  return new THREE.Mesh(geometry, material);
}

function buildCinemaParticles() {
  const group = new THREE.Group();
  const particles = [];
  for (let i = 0; i < CINEMA_PARTICLE_COUNT; i++) {
    const radius = CINEMA_RADIUS * (0.35 + Math.random() * 0.55);
    const height = (Math.random() - 0.5) * CINEMA_HEIGHT * 0.85;
    const baseAngle = Math.random() * Math.PI * 2;
    const speedMult = 0.6 + Math.random() * 0.8;
    const positions = new Float32Array(CINEMA_ARC_POINTS * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: 0xdbb59b, transparent: true, opacity: 0 });
    const line = new THREE.Line(geometry, material);
    group.add(line);
    particles.push({ line, radius, height, angle: baseAngle, speedMult });
  }
  return { group, particles };
}

function updateCinemaParticle(p) {
  const positions = p.line.geometry.attributes.position;
  for (let j = 0; j < CINEMA_ARC_POINTS; j++) {
    const t = j / (CINEMA_ARC_POINTS - 1);
    const a = p.angle + t * CINEMA_ARC_SPAN;
    positions.setXYZ(j, Math.cos(a) * p.radius, p.height, Math.sin(a) * p.radius);
  }
  positions.needsUpdate = true;
}

// --- One-element scroll section (Sample 9's Flip.fit technique, reskinned) ---
const SCROLL_LINES = [
  ['Shot wide', 'and slow'],
  ['Printed dark', 'and warm'],
  ['kept close', 'for years'],
];

// --- Archive galleries (Sample 17's on-scroll Flip layout technique, reskinned) ---
const GALLERY_IMG = (n) => `/images/scroll-layout/${n}.jpg`;
const GALLERY_ROW_ITEMS = [
  { n: 6, sizes: ['s'] },
  { n: 3, sizes: ['m'] },
  { n: 4, sizes: ['l'] },
  { n: 1, sizes: ['xl', 'center'] },
  { n: 5, sizes: ['l'] },
  { n: 2, sizes: ['m'] },
  { n: 6, sizes: ['s'] },
];
const GALLERY_BREAKOUT_ITEMS = [8, 7, 15, 9, 12, 14, 10, 13, 11];
const GALLERY_STACK_ITEMS = [33, 34, 35, 36, 37, 38];
const GALLERY_BENTO_ITEMS = [64, 63, 62, 69, 65, 67, 68, 66];
const GALLERY_ALL_NUMBERS = Array.from(new Set([
  ...GALLERY_ROW_ITEMS.map((i) => i.n),
  ...GALLERY_BREAKOUT_ITEMS,
  ...GALLERY_STACK_ITEMS,
  ...GALLERY_BENTO_ITEMS,
]));

function triggerGalleryFlipOnScroll(galleryEl, options = {}) {
  if (!galleryEl) return undefined;

  const settings = {
    stagger: 0,
    ...options,
    flip: { absoluteOnLeave: false, absolute: false, scale: true, simple: true, ...options.flip },
    scrollTrigger: { start: 'center center', end: '+=300%', ...options.scrollTrigger },
  };

  const galleryCaption = galleryEl.querySelector('.sample14-gallery-caption');
  const galleryItems = galleryEl.querySelectorAll('.sample14-gallery__item');
  const galleryItemsInner = [...galleryItems]
    .map((item) => (item.children.length > 0 ? [...item.children] : []))
    .flat();

  galleryEl.classList.add('sample14-gallery--switch');
  const flipstate = Flip.getState([galleryItems, galleryCaption], { props: 'filter, opacity' });
  galleryEl.classList.remove('sample14-gallery--switch');

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

  return () => tl.scrollTrigger?.kill();
}

const GALLERY_OPTIONS = [
  { flip: { absoluteOnLeave: true, scale: false } }, // row
  {}, // breakout
  {}, // stack
  { flip: { scale: false } }, // bento
];

const Sample14Page = () => {
  const progressRef = useRef(null);
  const logoRef = useRef(null);

  const introImageSlotRef = useRef(null);
  const trailImageRef = useRef(null);
  const imageLayerRefs = useRef([]);

  const titleUpRef = useRef(null);
  const titleDownRef = useRef(null);
  const titleUpLayerRefs = useRef([]);
  const titleDownLayerRefs = useRef([]);

  const introContentImageSlotRef = useRef(null);
  const contentTitleUpSlotRef = useRef(null);
  const contentTitleDownSlotRef = useRef(null);
  const contentImageSlotRef = useRef(null);

  const enterRef = useRef(null);
  const aboutRef = useRef(null);
  const aboutTextRef = useRef(null);
  const otherImageRefs = useRef([]);

  const pageRef = useRef(null);
  const cinemaStageRef = useRef(null);
  const cinemaCanvasRef = useRef(null);
  const cinemaTxtRefs = useRef([]);
  const cinemaFillRefs = useRef([]);

  const scrollRootRef = useRef(null);
  const oneRef = useRef(null);
  const initialSectionRef = useRef(null);
  const stepRefs = useRef([]);
  const setStepRef = (i) => (el) => { stepRefs.current[i] = el; };

  const galleryRefs = useRef([]);
  const setGalleryRef = (i) => (el) => { galleryRefs.current[i] = el; };

  const longPageCleanupRef = useRef(() => {});

  const [contentOpen, setContentOpen] = useState(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = img.onerror = () => {
      if (cancelled) return;

      const progressVal = { value: 0 };
      gsap.timeline()
        .to(progressVal, {
          duration: 1.5,
          ease: 'steps(14)',
          value: 100,
          onUpdate: () => {
            if (progressRef.current) progressRef.current.textContent = `${Math.floor(progressVal.value)}%`;
          },
          onComplete: showIntro,
        })
        .to(progressRef.current, { duration: 0.7, ease: 'power3.inOut', opacity: 0 });
    };
    img.src = IMG(1);
    return () => {
      cancelled = true;
      longPageCleanupRef.current?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function showIntro() {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const state = Flip.getState(imageLayerRefs.current);
    introContentImageSlotRef.current.appendChild(trailImageRef.current);

    const tl = gsap.timeline({
      defaults: { duration: 1.4, ease: 'power4' },
      onComplete: () => { isAnimatingRef.current = false; },
    });
    tl.addLabel('start', 0);
    tl.add(() => {
      Flip.from(state, { duration: 1.4, ease: 'power4', stagger: -0.03, scale: true });
    }, 'start');
    tl.set([titleUpLayerRefs.current, titleDownLayerRefs.current], { opacity: 0 }, 'start');
    tl.set([titleUpRef.current, titleDownRef.current], { opacity: 1 }, 'start');
    tl.fromTo(titleUpLayerRefs.current, { y: -40, rotateY: 160, opacity: 0 }, {
      y: 0, rotateY: 0, opacity: 1, stagger: -0.1,
    }, 'start');
    tl.fromTo(titleDownLayerRefs.current, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, stagger: -0.08,
    }, 'start');
    tl.fromTo(enterRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1 }, 'start+=0.3');
    tl.add(() => {
      logoRef.current.classList.add('show');
    }, 'start+=0.3');
  }

  const showContent = () => {
    if (isAnimatingRef.current || contentOpen) return;
    isAnimatingRef.current = true;

    const topState = Flip.getState(titleUpRef.current);
    const bottomState = Flip.getState(titleDownRef.current);
    contentTitleUpSlotRef.current.appendChild(titleUpRef.current);
    contentTitleDownSlotRef.current.appendChild(titleDownRef.current);

    const imageState = Flip.getState(trailImageRef.current);
    contentImageSlotRef.current.appendChild(trailImageRef.current);
    gsap.set(trailImageRef.current, { opacity: 1 });

    setContentOpen(true);
    pageRef.current.classList.remove('is-intro-locked');

    const tl = gsap.timeline({
      defaults: { duration: 1.4, ease: 'power4' },
      onComplete: () => {
        isAnimatingRef.current = false;
        initLongPage();
      },
    });
    tl.addLabel('start', 0);
    tl.to(enterRef.current, { duration: 0.6, opacity: 0, scale: 0.8 }, 'start');
    tl.add(() => {
      Flip.from(topState, { duration: 1.4, ease: 'power4', scale: true });
      Flip.from(bottomState, { duration: 1.4, ease: 'power4', scale: true });
      Flip.from(imageState, { duration: 1.4, ease: 'power4' });
    }, 'start');
    tl.fromTo(otherImageRefs.current, { yPercent: 100, autoAlpha: 0 }, {
      yPercent: 0, autoAlpha: 1, stagger: 0.05,
    }, 'start+=0.1');
    tl.fromTo(aboutRef.current, { yPercent: 10, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1 }, 'start+=0.2');
    tl.add(() => {
      const split = new SplitText(aboutTextRef.current, { type: 'lines' });
      gsap.fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, stagger: 0.04, duration: 1.4, ease: 'power4' });
    }, 'start+=0.2');
  };

  // Runs once, right after the hero settles: unlocks page scroll and wires
  // up the cinema (Sample 5), one-element-scroll (Sample 9) and archive
  // gallery (Sample 17) sections below it with a single shared Lenis
  // instance driving GSAP ScrollTrigger.
  function initLongPage() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    const cleanups = [() => { gsap.ticker.remove(rafFn); lenis.destroy(); }];

    cleanups.push(initCinema());
    cleanups.push(initOneElementScroll());
    cleanups.push(initGalleryScroll());

    requestAnimationFrame(() => ScrollTrigger.refresh());

    longPageCleanupRef.current = () => cleanups.forEach((fn) => fn?.());
  }

  function initGalleryScroll() {
    let cancelled = false;
    let ctx;
    const killFns = [];

    Promise.all(GALLERY_ALL_NUMBERS.map((n) => new Promise((resolve) => {
      const img = new Image();
      img.onload = img.onerror = resolve;
      img.src = GALLERY_IMG(n);
    }))).then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        galleryRefs.current.forEach((el, i) => {
          const kill = triggerGalleryFlipOnScroll(el, GALLERY_OPTIONS[i]);
          if (kill) killFns.push(kill);
        });
      });
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelled = true;
      killFns.forEach((fn) => fn());
      ctx?.revert();
    };
  }

  function initCinema() {
    const stage = cinemaStageRef.current;
    const canvas = cinemaCanvasRef.current;
    if (!stage || !canvas) return undefined;

    let cancelled = false;
    let onResize;
    let rafId;
    let mesh;
    let texture;

    CustomEase.create('cinema14Silk', 'M0,0 C0.45,0.05 0.55,0.95 1,1');
    CustomEase.create('cinema14Flow', 'M0,0 C0.33,0 0.2,1 1,1');
    CustomEase.create('cinema14Linear', 'M0,0 C0.4,0 0.6,1 1,1');

    const FOG_COLOR = 0x161a19;
    const FOG_NEAR = CINEMA_RADIUS * 2;
    const FOG_FAR = CINEMA_RADIUS * 6;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(FOG_COLOR);
    scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 4000);
    camera.position.set(...CINEMA_CAMERA_START);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);
    const { group: particleGroup, particles } = buildCinemaParticles();
    cylinderGroup.add(particleGroup);

    const camState = { x: CINEMA_CAMERA_START[0], y: CINEMA_CAMERA_START[1], z: CINEMA_CAMERA_START[2] };
    let lastRotation = 0;
    let momentum = 0;
    let speedFactor = 0;

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const loadImages = () => Promise.all(CINEMA_IMAGES.map((src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    })));

    let ctx;
    loadImages().then((loaded) => {
      if (cancelled) return;
      const images = loaded.filter(Boolean);
      if (!images.length) return;

      texture = buildCinemaTexture(images);
      mesh = buildCinemaCylinder(texture, FOG_COLOR, FOG_NEAR, FOG_FAR);
      cylinderGroup.add(mesh);
      resize();

      ctx = gsap.context(() => {
        const texts = cinemaTxtRefs.current;
        gsap.set(texts, { clipPath: 'inset(0% 0% 100% 0%)' });

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        let cursor = 0;
        CINEMA_CAMERA_PATH.forEach((kf) => {
          master.to(camState, { x: kf.pos[0], y: kf.pos[1], z: kf.pos[2], duration: kf.duration, ease: kf.ease }, cursor);
          cursor += kf.duration;
        });
        master.to(cylinderGroup.rotation, { y: -CINEMA_TOTAL_ROTATION, duration: CINEMA_TOTAL_DURATION, ease: 'none' }, 0);

        CINEMA_CAPTIONS.forEach((_, i) => {
          const slot = (i / CINEMA_CAPTIONS.length) * CINEMA_TOTAL_DURATION;
          if (texts[i]) {
            master.to(texts[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: CINEMA_TOTAL_DURATION * 0.1, ease: 'power2.out' }, slot);
            master.to(texts[i], { clipPath: 'inset(0% 0% 100% 0%)', duration: CINEMA_TOTAL_DURATION * 0.1, ease: 'power2.in' }, slot + CINEMA_TOTAL_DURATION * 0.18);
          }
        });

        ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate(self) {
            const step = 1 / CINEMA_CAPTIONS.length;
            cinemaFillRefs.current.forEach((fill, i) => {
              const p = gsap.utils.clamp(0, 1, (self.progress - i * step) / step);
              if (fill) fill.style.width = `${p * 100}%`;
            });
          },
        });

        onResize = () => { resize(); ScrollTrigger.refresh(); };
        window.addEventListener('resize', onResize);
      }, stage);

      const animate = () => {
        camera.position.set(camState.x, camState.y, camState.z);
        camera.lookAt(0, 0, 0);

        const rawDelta = cylinderGroup.rotation.y - lastRotation;
        lastRotation = cylinderGroup.rotation.y;
        momentum = momentum * 0.92 + rawDelta * 0.15;
        const targetSpeed = gsap.utils.clamp(0, 0.95, Math.abs(momentum) * 300);
        speedFactor += (targetSpeed - speedFactor) * 0.15;

        particles.forEach((p) => {
          p.angle += momentum * p.speedMult * 1.5;
          updateCinemaParticle(p);
          p.line.material.opacity += (speedFactor - p.line.material.opacity) * 0.15;
        });

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (onResize) window.removeEventListener('resize', onResize);
      ctx?.revert();
      texture?.dispose();
      mesh?.geometry.dispose();
      mesh?.material.dispose();
      particles.forEach((p) => { p.line.geometry.dispose(); p.line.material.dispose(); });
      renderer.dispose();
    };
  }

  function initOneElementScroll() {
    const root = scrollRootRef.current;
    const oneEl = oneRef.current;
    const parentEl = initialSectionRef.current;
    if (!root || !oneEl || !parentEl) return undefined;

    let flipCtx;
    let onResize;

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

      const animateTitleSpans = () => {
        const spans = root.querySelectorAll('.sample14-scroll__title > span');
        spans.forEach((span, index) => {
          const direction = index % 2 === 0 ? -150 : 150;
          const triggerElement = span.closest('.sample14-scroll__section--center') ? span.parentNode : span;
          gsap.from(span, {
            x: direction,
            duration: 1,
            ease: 'sine',
            scrollTrigger: { trigger: triggerElement, start: 'top bottom', end: '+=45%', scrub: true },
          });
        });
      };

      const animateDecorativeImages = () => {
        const images = root.querySelectorAll('.sample14-scroll__img:not([data-step])');
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
        const textEl = root.querySelector('.sample14-scroll__text');
        if (!textEl) return;
        gsap.fromTo(textEl, { y: 200 }, {
          y: -200, ease: 'sine',
          scrollTrigger: { trigger: textEl, start: 'top bottom', end: 'top top', scrub: true },
        });
      };

      const animateFilterOnFirstSwitch = () => {
        gsap.fromTo(oneEl, { filter: 'brightness(75%)' }, {
          filter: 'brightness(100%)', ease: 'sine',
          scrollTrigger: { trigger: parentEl, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: true },
        });
      };

      createFlipOnScrollAnimation();
      animateTitleSpans();
      animateDecorativeImages();
      addParallaxToText();
      animateFilterOnFirstSwitch();

      onResize = () => createFlipOnScrollAnimation();
      window.addEventListener('resize', onResize);
    }, root);

    return () => {
      if (onResize) window.removeEventListener('resize', onResize);
      flipCtx?.revert();
      ctx.revert();
    };
  }

  return (
    <div className="sample14-page is-intro-locked" ref={pageRef}>
      <Helmet>
        <title>Sample 14 — Intro Image Trail Animation | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample14-page__back">&larr; Back</Link>

      <div className="sample14-main">
        <span className="sample14-intro-progress" ref={progressRef}>0%</span>
        <h2 className="sample14-logo" ref={logoRef}>MF</h2>

        <div className="sample14-intro-image" ref={introImageSlotRef}>
          <div className="sample14-trail" ref={trailImageRef}>
            {Array.from({ length: IMAGE_TRAIL_COUNT }).map((_, i) => (
              <div className="sample14-trail__layer" key={i} ref={(el) => (imageLayerRefs.current[i] = el)}>
                <img
                  className="sample14-trail__img"
                  src={IMG(1)}
                  alt={i === IMAGE_TRAIL_COUNT - 1 ? 'Marisol Ferreira' : ''}
                  aria-hidden={i === IMAGE_TRAIL_COUNT - 1 ? undefined : true}
                  style={{ opacity: i === IMAGE_TRAIL_COUNT - 1 ? 1 : 0.8 }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sample14-intro-content">
          <div className="sample14-intro-content__title sample14-intro-content__title--up sample14-trail" ref={titleUpRef}>
            {Array.from({ length: TITLE_UP_TRAIL_COUNT }).map((_, i) => (
              <span
                className="sample14-trail__layer"
                key={i}
                style={{ opacity: i === TITLE_UP_TRAIL_COUNT - 1 ? 1 : 0.6 }}
                ref={(el) => (titleUpLayerRefs.current[i] = el)}
              >
                Marisol
              </span>
            ))}
          </div>

          <div className="sample14-intro-content__image" ref={introContentImageSlotRef} />

          <div className="sample14-intro-content__title sample14-intro-content__title--down sample14-trail" ref={titleDownRef}>
            {Array.from({ length: TITLE_DOWN_TRAIL_COUNT }).map((_, i) => (
              <span
                className="sample14-trail__layer"
                key={i}
                style={{ opacity: i === TITLE_DOWN_TRAIL_COUNT - 1 ? 1 : (i + 1) / TITLE_DOWN_TRAIL_COUNT }}
                ref={(el) => (titleDownLayerRefs.current[i] = el)}
              >
                Ferre<em>ir</em>a
              </span>
            ))}
          </div>
        </div>

        <button type="button" className="sample14-button-enter" ref={enterRef} onClick={showContent}>
          <span>Enter</span>
        </button>

        <div className={`sample14-content${contentOpen ? ' is-open' : ''}`}>
          <div className="sample14-content__title-up" ref={contentTitleUpSlotRef} />
          <div className="sample14-content__title-down" ref={contentTitleDownSlotRef} />

          <div className="sample14-content__about" ref={aboutRef}>
            <h4 className="sample14-content__about-title">About</h4>
            <p ref={aboutTextRef}>
              Marisol works between darkroom and studio, printing every frame by hand before it
              ever reaches a screen. The grain is not a filter — it is the film, and the light
              that actually fell across the room the day the shutter opened.
            </p>
          </div>

          <div className="sample14-content__image sample14-content__image--1">
            <div
              className="sample14-content__image-inner"
              ref={(el) => (otherImageRefs.current[0] = el)}
              style={{ backgroundImage: `url(${IMG(2)})` }}
            />
          </div>
          <div className="sample14-content__image sample14-content__image--2" ref={contentImageSlotRef} />
          <div className="sample14-content__image sample14-content__image--3">
            <div
              className="sample14-content__image-inner"
              ref={(el) => (otherImageRefs.current[1] = el)}
              style={{ backgroundImage: `url(${IMG(3)})` }}
            />
          </div>
        </div>

        <div className="sample14-frame" />
      </div>

      <div className="sample14-cinema-intro">
        <h2>A roll, developed</h2>
        <span>Scroll down</span>
      </div>

      <section className="sample14-cinema" ref={cinemaStageRef}>
        <div className="sample14-cinema__pin">
          <canvas ref={cinemaCanvasRef} />
          <div className="sample14-cinema__texts">
            {CINEMA_CAPTIONS.map((c, i) => (
              <div className="sample14-cinema__txt" key={c.title} ref={(el) => (cinemaTxtRefs.current[i] = el)}>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          <div className="sample14-cinema__progress">
            {CINEMA_CAPTIONS.map((c, i) => (
              <div className="segment" key={c.title}>
                <div className="fill" ref={(el) => (cinemaFillRefs.current[i] = el)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="sample14-scroll" ref={scrollRootRef}>
        <section className="sample14-scroll__section" ref={initialSectionRef}>
          <div
            className="sample14-scroll__one"
            ref={oneRef}
            style={{ backgroundImage: `url(${IMG(1)})` }}
          />
        </section>

        <section className="sample14-scroll__section sample14-scroll__section--center">
          <div data-step className="sample14-scroll__img" ref={setStepRef(0)} />
          <h1 className="sample14-scroll__title">
            <span>Held</span><br /><span>to Light</span>
          </h1>
        </section>

        <section className="sample14-scroll__section sample14-scroll__section--lines">
          {SCROLL_LINES.map((line, li) => (
            <h2 className="sample14-scroll__title" key={line.join('-')}>
              <span>{line[0]}</span>
              {li === 0
                ? <div data-step className="sample14-scroll__img" ref={setStepRef(1)} />
                : <div className="sample14-scroll__img" style={{ backgroundImage: `url(${CYCLE_IMG(li + 3)})` }} />}
              <span>{line[1]}</span>
            </h2>
          ))}
        </section>

        <section className="sample14-scroll__section sample14-scroll__section--sides">
          <div data-step className="sample14-scroll__img" ref={setStepRef(2)} />
          <div className="sample14-scroll__text">
            <p>
              <strong>Marisol shoots on three cameras and trusts only one of them completely.</strong>{' '}
              The rest is process: a hand-mixed developer, a timer she still doesn&rsquo;t fully trust,
              and a habit of printing the same negative three times before deciding which version is true.
            </p>
          </div>
        </section>

        <section className="sample14-scroll__section sample14-scroll__section--center">
          <div data-step className="sample14-scroll__img" ref={setStepRef(3)} />
          <div className="sample14-scroll__text sample14-scroll__text--large">
            <p>
              Nothing here is shot twice for safety. If the frame doesn&rsquo;t hold up on the contact
              sheet, it doesn&rsquo;t get printed — that&rsquo;s the whole editing process, and it hasn&rsquo;t
              changed in fifteen years.
            </p>
          </div>
        </section>
      </main>

      <section className="sample14-note">
        <span className="sample14-note__label">The Archive</span>
        <p>
          Not every frame makes it to a gallery wall. What follows is the rest of it — contact
          sheets, rejects, and the odd print she kept for no reason she&rsquo;s ever explained.
        </p>
      </section>

      <div className="sample14-gallery-wrap">
        <div className="sample14-gallery sample14-gallery--row" ref={setGalleryRef(0)}>
          {GALLERY_ROW_ITEMS.map((item, i) => (
            <div
              key={i}
              className={['sample14-gallery__item', ...item.sizes.map((s) => `sample14-gallery__item--${s}`)].join(' ')}
              style={{ backgroundImage: `url(${GALLERY_IMG(item.n)})` }}
            />
          ))}
          <div className="sample14-gallery-caption">
            A contact sheet is a confession — every frame she almost threw away, still sitting
            right next to the one that made it.
          </div>
        </div>
      </div>

      <section className="sample14-note sample14-note--left">
        <span className="sample14-note__label">On Editing</span>
        <p>
          She still marks up contact sheets with a grease pencil, the same way she was taught —
          a circle for a keeper, a cross for gone, and nothing in between.
        </p>
      </section>

      <div className="sample14-gallery-wrap sample14-gallery-wrap--large">
        <div className="sample14-gallery sample14-gallery--grid sample14-gallery--breakout" ref={setGalleryRef(1)}>
          {GALLERY_BREAKOUT_ITEMS.map((n, i) => (
            <div className="sample14-gallery__item sample14-gallery__item-cut" key={i}>
              <div className="sample14-gallery__item-inner" style={{ backgroundImage: `url(${GALLERY_IMG(n)})` }} />
            </div>
          ))}
          <div className="sample14-gallery-caption">
            <p>
              Cropped tight enough to lose the room but keep the light — that&rsquo;s usually
              the whole decision.
            </p>
          </div>
        </div>
      </div>

      <section className="sample14-note sample14-note--right">
        <span className="sample14-note__label">On Keeping Prints</span>
        <p>
          A stack like this lives on the studio floor for months before it earns a frame, or
          quietly stops existing. There&rsquo;s no in-between shelf for maybes.
        </p>
      </section>

      <div className="sample14-gallery-wrap sample14-gallery-wrap--dense">
        <div className="sample14-gallery sample14-gallery--stack sample14-gallery--stack-inverse sample14-gallery--stack-dark" ref={setGalleryRef(2)}>
          {GALLERY_STACK_ITEMS.map((n, i) => (
            <div key={i} className="sample14-gallery__item" style={{ backgroundImage: `url(${GALLERY_IMG(n)})` }} />
          ))}
          <div className="sample14-gallery-caption">
            <p>Six prints from the same roll, kept in the order they came out of the fixer.</p>
          </div>
        </div>
      </div>

      <section className="sample14-note sample14-note--left">
        <span className="sample14-note__label">On the Wall</span>
        <p>
          The pieces that finally get framed rarely match — she hangs by feel, not by size,
          which is why the wall never looks finished and never quite needs to be.
        </p>
      </section>

      <div className="sample14-gallery-wrap">
        <div className="sample14-gallery sample14-gallery--bento" ref={setGalleryRef(3)}>
          {GALLERY_BENTO_ITEMS.map((n, i) => (
            <div key={i} className="sample14-gallery__item" style={{ backgroundImage: `url(${GALLERY_IMG(n)})` }} />
          ))}
          <div className="sample14-gallery-caption">A working wall, mid-edit</div>
        </div>
      </div>

      <section className="sample14-note">
        <p>
          Archive images via the source demo&rsquo;s own credits: generated with Midjourney,
          except one real photograph by Karsten Winegeart on Unsplash — hidden somewhere in the
          stack above.
        </p>
      </section>

      <section className="sample14-outro">
        <h2 className="sample14-outro__title">Made slowly, printed by hand</h2>
        <span className="sample14-outro__sub">Photography via Unsplash (as credited by the source demo)</span>
      </section>
    </div>
  );
};

export default Sample14Page;
