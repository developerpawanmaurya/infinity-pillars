import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './Sample3.css';

gsap.registerPlugin(ScrollTrigger);

// Same general technique as the cylinder-panorama demo in JosephASG's
// "codrops-cinematic-scroll-animations" (MIT licensed): twelve photos are
// composited into one wide strip, wrapped around the inside of a cylinder,
// which slowly rotates on scroll while a scatter of orbiting line
// "particles" speeds up and fades in with the spin. That source project
// builds it on OGL with its own shader/component code; this is an
// independent Three.js implementation written from scratch for this
// project — no shader or component source was copied, only the general
// idea (panorama cylinder + velocity-reactive particles + scroll-scrubbed
// rotation). Photos are the repo's own real images (its README credits them
// as "Images generated with Midjourney"; repo is MIT).
const IMAGE_COUNT = 12;
const IMAGES = Array.from({ length: IMAGE_COUNT }, (_, i) => `/images/cinematic-scroll/img${i + 1}.webp`);

const CAPTIONS = [
  { title: 'A Slow Orbit', body: 'Twelve frames, stitched into one continuous ring. Scroll to turn it.' },
  { title: 'Momentum', body: 'The faster the ring spins, the more the light around it comes alive.' },
  { title: 'Depth in Motion', body: 'Every photograph passes just once before the next one arrives.' },
  { title: 'Full Circle', body: 'By the end of the scroll, the ring has turned all the way around.' },
];

const PARTICLE_COUNT = 26;
const ARC_POINTS = 10;
const ARC_SPAN = 0.28; // radians of arc each particle streak covers
const CYLINDER_RADIUS = 160;
const CYLINDER_HEIGHT = 130;
const TOTAL_ROTATION = Math.PI * 2 * 1.05;

function buildCompositeTexture(images) {
  const slotW = 900;
  const slotH = 620;
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

function buildCylinder(texture) {
  const geometry = new THREE.CylinderGeometry(
    CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT, 96, 1, true,
  );
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uDarkness: { value: 0.35 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform float uDarkness;
      varying vec2 vUv;
      void main() {
        vec3 color = texture2D(uMap, vUv).rgb;
        color = mix(color, vec3(0.0), uDarkness);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    side: THREE.BackSide,
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

const Sample3Page = () => {
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    camera.position.set(0, 0, 0.001);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);

    const { group: particleGroup, particles } = buildParticles();
    cylinderGroup.add(particleGroup);

    let ctx;
    let master;
    let rafId;
    let mesh;
    let texture;
    let lastProgress = 0;
    let lastTime = performance.now();
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
      mesh = buildCylinder(texture);
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
            scrub: 2.5,
            invalidateOnRefresh: true,
          },
        });

        CAPTIONS.forEach((_, i) => {
          const slot = i * 2;
          if (texts[i]) {
            master.to(texts[i], { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.out' }, slot);
            master.to(texts[i], { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power2.in' }, slot + 1.2);
          }
        });

        ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate(self) {
            lastProgress = self.progress;
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
        const now = performance.now();
        const dt = Math.max((now - lastTime) / 1000, 0.001);
        lastTime = now;

        cylinderGroup.rotation.y = -lastProgress * TOTAL_ROTATION;

        const angularVelocity = (lastProgress - animate.prevProgress) * TOTAL_ROTATION / dt;
        animate.prevProgress = lastProgress;
        const targetSpeed = gsap.utils.clamp(0, 0.9, Math.abs(angularVelocity) * 4);
        speedFactor += (targetSpeed - speedFactor) * 0.08;

        particles.forEach((p) => {
          p.angle += angularVelocity * p.speedMult * dt * 0.5;
          updateParticle(p);
          p.line.material.opacity += (speedFactor - p.line.material.opacity) * 0.1;
        });

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };
      animate.prevProgress = 0;
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
    <div className="sample3-page">
      <Helmet>
        <title>Sample 3 — Cylinder Carousel | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample3-page__back">&larr; Back</Link>

      <div className="sample3-intro">
        <h1>The Cylinder Carousel</h1>
        <span>Scroll down</span>
      </div>

      <section className="sample3-stage" ref={stageRef}>
        <div className="sample3-stage__pin">
          <canvas ref={canvasRef} />
          <div className="sample3-texts">
            {CAPTIONS.map((c, i) => (
              <div className="sample3-txt" key={c.title} ref={(el) => (txtRefs.current[i] = el)}>
                <h2>{c.title}</h2>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          <div className="sample3-progress">
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

export default Sample3Page;
