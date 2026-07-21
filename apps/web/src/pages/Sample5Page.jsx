import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import './Sample5.css';

gsap.registerPlugin(ScrollTrigger, CustomEase);

// Sample 3 rebuilt to match the source demo's actual camera choreography,
// per its Codrops write-up ("How to Build Cinematic 3D Scroll Experiences
// with GSAP", tympanus.net/codrops — MIT-licensed code, publicly published
// specifically to teach this technique): the camera isn't confined inside
// the cylinder the whole time. It starts well OUTSIDE looking at the whole
// rotating drum, flies inward through the wall to a close, intimate shot,
// then swings back out to a wide angle from another side — five segments
// with deliberately uneven pacing (quick early moves, one long lingering
// close-up) rather than evenly-timed steps, so the material needs to be
// double-sided (visible from outside AND inside) rather than back-face-only.
// Independent Three.js implementation (source uses OGL); no shader or
// component source was copied — only the camera path's numeric waypoints,
// segment durations and named easing curves (all functional data, not
// creative expression) and the described particle-momentum formula, scaled
// up to this cylinder's larger world-unit radius. Scroll length matches the
// source's ~500vh. Photos are the repo's own real images (its README
// credits them as "Images generated with Midjourney"; repo is MIT).
const IMAGE_COUNT = 12;
const IMAGES = Array.from({ length: IMAGE_COUNT }, (_, i) => `/images/cinematic-scroll/img${i + 1}.webp`);

const CAPTIONS = [
  { title: 'From a Distance', body: 'The shot opens wide, watching the whole ring turn from outside.' },
  { title: 'Closing In', body: 'The camera flies inward, passing through the wall it was just looking at.' },
  { title: 'Held Close', body: 'The longest beat of the sequence: one frame, lingering, right up against the surface.' },
  { title: 'Swinging Wide', body: 'A last, faster move back out to a completely different angle.' },
];

const PARTICLE_COUNT = 26;
const ARC_POINTS = 10;
const ARC_SPAN = 0.28;
const CYLINDER_RADIUS = 160;
// Each of the 12 images occupies an equal arc-width slice of the
// circumference; the cylinder's height has to match that slice's aspect
// ratio (slot width : slot height) or every photo gets stretched
// vertically. It was hardcoded to 130 before, nearly 2.5x too tall for a
// slice this wide, which distorted every image and threw off how the whole
// camera path read against the (wrongly-shaped) object it was flying past.
const IMAGE_SLOT_W = 900;
const IMAGE_SLOT_H = 620;
const CYLINDER_HEIGHT = (2 * Math.PI * CYLINDER_RADIUS / 12) * (IMAGE_SLOT_H / IMAGE_SLOT_W);
// Source: cumulative cylinder rotation of ~28.27 radians spread across five
// camera segments whose durations (1, 1, 2, 3.5, 1 — summing to 8.5) are
// used below as relative weights along the scrub timeline.
const TOTAL_ROTATION = 28.27;
const SCALE = CYLINDER_RADIUS / 2.5; // source's cylinder radius baseline was ~2.5 world units
// The two "outside" waypoints (opening shot and the final swing-wide) sat
// too far back, making the cylinder read small in frame — halving their
// distance from the origin doubles how large the cylinder appears there
// without touching the inner waypoints, which were already right.
const WIDE = 0.5;

// Camera waypoints (source coordinates × SCALE) and each leg's relative
// duration/easing — deliberately uneven, not five equal steps: quick at
// first, one long held close-up, quick again at the end.
const CAMERA_START = [0, 0, 8 * SCALE * WIDE];
const CAMERA_PATH = [
  { pos: [0 * SCALE * WIDE, 0 * SCALE * WIDE, 8 * SCALE * WIDE], duration: 1.0, ease: 'cinematicSilk' },
  { pos: [0 * SCALE, 5 * SCALE, 5 * SCALE], duration: 1.0, ease: 'cinematicFlow' },
  { pos: [1.5 * SCALE, 2 * SCALE, 2 * SCALE], duration: 2.0, ease: 'cinematicLinear' },
  { pos: [0.5 * SCALE, 0 * SCALE, 0.8 * SCALE], duration: 3.5, ease: 'power1.inOut' },
  { pos: [-6 * SCALE * WIDE, -1 * SCALE * WIDE, 8 * SCALE * WIDE], duration: 1.0, ease: 'cinematicSmooth' },
];
const TOTAL_DURATION = CAMERA_PATH.reduce((sum, kf) => sum + kf.duration, 0);

function buildCompositeTexture(images) {
  const slotW = IMAGE_SLOT_W;
  const slotH = IMAGE_SLOT_H;
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

function buildCylinder(texture, fogColor, fogNear, fogFar) {
  const geometry = new THREE.CylinderGeometry(
    CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT, 96, 1, true,
  );
  // Double-sided (not BackSide-only): the camera crosses from outside the
  // drum to inside it mid-shot, so both faces need to render or the wall
  // would vanish the moment the camera passes through from the outside.
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uDarkness: { value: 0.35 },
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

function buildParticles() {
  const group = new THREE.Group();
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const radius = CYLINDER_RADIUS * (0.35 + Math.random() * 0.55);
    const height = (Math.random() - 0.5) * CYLINDER_HEIGHT * 0.85;
    const baseAngle = Math.random() * Math.PI * 2;
    const speedMult = 0.6 + Math.random() * 0.8;

    const positions = new Float32Array(ARC_POINTS * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
    const line = new THREE.Line(geometry, material);
    group.add(line);
    particles.push({ line, radius, height, angle: baseAngle, speedMult });
  }

  return { group, particles };
}

function updateParticle(p) {
  const positions = p.line.geometry.attributes.position;
  for (let j = 0; j < ARC_POINTS; j++) {
    const t = j / (ARC_POINTS - 1);
    const a = p.angle + t * ARC_SPAN;
    positions.setXYZ(j, Math.cos(a) * p.radius, p.height, Math.sin(a) * p.radius);
  }
  positions.needsUpdate = true;
}

const Sample5Page = () => {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const txtRefs = useRef([]);
  const fillRefs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    let cancelled = false;
    let onResize;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    CustomEase.create('cinematicSilk', 'M0,0 C0.45,0.05 0.55,0.95 1,1');
    CustomEase.create('cinematicFlow', 'M0,0 C0.33,0 0.2,1 1,1');
    CustomEase.create('cinematicLinear', 'M0,0 C0.4,0 0.6,1 1,1');

    const FOG_COLOR = 0x000000;
    const FOG_NEAR = CYLINDER_RADIUS * 2;
    const FOG_FAR = CYLINDER_RADIUS * 6;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(FOG_COLOR);
    scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 4000);
    camera.position.set(...CAMERA_START);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);

    const { group: particleGroup, particles } = buildParticles();
    cylinderGroup.add(particleGroup);

    const camState = { x: CAMERA_START[0], y: CAMERA_START[1], z: CAMERA_START[2] };

    let ctx;
    let master;
    let rafId;
    let mesh;
    let texture;
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

    const loadImages = () => Promise.all(IMAGES.map((src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    })));

    loadImages().then((loaded) => {
      if (cancelled) return;
      const images = loaded.filter(Boolean);
      if (!images.length) return;

      texture = buildCompositeTexture(images);
      mesh = buildCylinder(texture, FOG_COLOR, FOG_NEAR, FOG_FAR);
      cylinderGroup.add(mesh);
      resize();

      ctx = gsap.context(() => {
        const texts = txtRefs.current;
        gsap.set(texts, { clipPath: 'inset(0% 0% 100% 0%)' });

        master = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        let cursor = 0;
        CAMERA_PATH.forEach((kf) => {
          master.to(camState, {
            x: kf.pos[0], y: kf.pos[1], z: kf.pos[2],
            duration: kf.duration, ease: kf.ease,
          }, cursor);
          cursor += kf.duration;
        });
        master.to(cylinderGroup.rotation, { y: -TOTAL_ROTATION, duration: TOTAL_DURATION, ease: 'none' }, 0);

        CAPTIONS.forEach((_, i) => {
          const slot = (i / CAPTIONS.length) * TOTAL_DURATION;
          if (texts[i]) {
            master.to(texts[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: TOTAL_DURATION * 0.1, ease: 'power2.out' }, slot);
            master.to(texts[i], { clipPath: 'inset(0% 0% 100% 0%)', duration: TOTAL_DURATION * 0.1, ease: 'power2.in' }, slot + TOTAL_DURATION * 0.18);
          }
        });

        ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate(self) {
            const step = 1 / CAPTIONS.length;
            fillRefs.current.forEach((fill, i) => {
              const p = gsap.utils.clamp(0, 1, (self.progress - i * step) / step);
              if (fill) fill.style.width = `${p * 100}%`;
            });
          },
        });

        onResize = () => {
          resize();
          ScrollTrigger.refresh();
        };
        window.addEventListener('resize', onResize);
      }, stage);

      const animate = () => {
        camera.position.set(camState.x, camState.y, camState.z);
        // Always look toward the cylinder's actual vertical centre (its
        // own height, not the camera's) — looking at the camera's own
        // height instead meant that whenever the camera climbed away from
        // y=0 (the "moves down" and "closing in" waypoints), it aimed at
        // empty space level with itself while the cylinder stayed near the
        // origin, pushing it out of frame or chopped at the bottom.
        camera.lookAt(0, 0, 0);

        // Per-frame rotation delta (not per-second) plus a momentum/decay
        // blend, matching the source's velocity-reactive particle formula:
        // momentum settles toward the raw delta with a 0.92 decay / 0.15
        // blend, then maps to opacity via a *300 gain capped at 0.95.
        const rawDelta = cylinderGroup.rotation.y - lastRotation;
        lastRotation = cylinderGroup.rotation.y;
        momentum = momentum * 0.92 + rawDelta * 0.15;
        const targetSpeed = gsap.utils.clamp(0, 0.95, Math.abs(momentum) * 300);
        speedFactor += (targetSpeed - speedFactor) * 0.15;

        particles.forEach((p) => {
          p.angle += momentum * p.speedMult * 1.5;
          updateParticle(p);
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
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      texture?.dispose();
      mesh?.geometry.dispose();
      mesh?.material.dispose();
      particles.forEach((p) => {
        p.line.geometry.dispose();
        p.line.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="sample5-page">
      <Helmet>
        <title>Sample 5 — Cylinder Carousel (Scroll-Accurate) | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample5-page__back">&larr; Back</Link>

      <div className="sample5-intro">
        <h1>The Cylinder Carousel</h1>
        <span>Scroll down</span>
      </div>

      <section className="sample5-stage" ref={stageRef}>
        <div className="sample5-stage__pin">
          <canvas ref={canvasRef} />
          <div className="sample5-texts">
            {CAPTIONS.map((c, i) => (
              <div className="sample5-txt" key={c.title} ref={(el) => (txtRefs.current[i] = el)}>
                <h2>{c.title}</h2>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          <div className="sample5-progress">
            {CAPTIONS.map((c, i) => (
              <div className="segment" key={c.title}>
                <div className="fill" ref={(el) => (fillRefs.current[i] = el)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sample5Page;
