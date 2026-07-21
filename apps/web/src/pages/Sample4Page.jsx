import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import './Sample4.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Same general technique as the second demo in JosephASG's
// "codrops-cinematic-scroll-animations" (MIT licensed): a 3D scene the
// camera flies through on scroll, cross-fading DOM-overlay headlines
// (split into characters) in step with each vantage point. That source
// project is built on React Three Fiber with a licensed glTF model and the
// author's own Adobe Fonts kit; this is an independent Three.js
// implementation written from scratch — no shader/component source was
// copied, only the general idea (keyframed camera path + character-level
// text stagger, both scroll-scrubbed). The building model is a genuinely
// CC0 asset (Kenney's "Starter Kit: City Builder", public domain) standing
// in for the source's own non-redistributable model; five copies are
// arranged into a small skyline cluster with an emissive tint added for a
// neon-lit mood. Font is Space Grotesk (Google Fonts).
const MODELS = [
  { file: 'building-small-a.glb', position: [-60, 0, -40], scale: 12, rotationY: 0.4 },
  { file: 'building-small-b.glb', position: [55, 0, -85], scale: 15, rotationY: -0.6 },
  { file: 'building-small-c.glb', position: [-25, 0, -150], scale: 18, rotationY: 1.1 },
  { file: 'building-small-d.glb', position: [95, 0, -15], scale: 10, rotationY: -0.2 },
  { file: 'building-garage.glb', position: [10, 0, 35], scale: 9, rotationY: 0.9 },
];

const KEYFRAMES = [
  { pos: [0, 55, 230], target: [0, 20, -60] },
  { pos: [-45, 25, 95], target: [-40, 18, -35] },
  { pos: [60, 22, -5], target: [50, 22, -85] },
  { pos: [-15, 38, -95], target: [-25, 35, -150] },
  { pos: [110, 14, 5], target: [90, 16, -15] },
  { pos: [15, 95, 250], target: [0, 0, -60] },
];

const CAPTIONS = [
  { h: 'Establishing the Skyline', p: 'The camera opens wide, taking in the whole cluster before committing to a path.', pos: 'left' },
  { h: 'Closing the Distance', p: "Every cut in a scroll-driven scene is really just an interpolated camera move.", pos: 'right' },
  { h: 'Between the Towers', p: "Weaving past a structure gives scale to distance that a static shot can't.", pos: 'center' },
  { h: 'A Closer Look', p: 'Detail work: the camera settles near a single facade before pulling away.', pos: 'right' },
  { h: 'Pulling Back', p: 'The path ends where a real flythrough would cut to black — rising above it all.', pos: 'left' },
];

const NEON_TINT = new THREE.Color(0x2a0a45);

function lerpVec3(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

const Sample4Page = () => {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const headingRefs = useRef([]);
  const txtRefs = useRef([]);
  const fillRefs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    let cancelled = false;
    let onResize;
    let ctx;
    let rafId;
    let camState = { pos: KEYFRAMES[0].pos, target: KEYFRAMES[0].target };
    const splits = [];
    const loadedModels = [];

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 180, 420);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000);
    camera.position.set(...KEYFRAMES[0].pos);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(80, 120, 60);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x8899ff, 0.5);
    fillLight.position.set(-100, 40, -60);
    scene.add(fillLight);
    const accentLight = new THREE.PointLight(0x7ef9ff, 1.4, 400);
    accentLight.position.set(0, 40, 0);
    scene.add(accentLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const loader = new GLTFLoader();
    const loadModel = (file) => new Promise((resolve) => {
      loader.load(
        `/models/cinematic-scroll/${file}`,
        (gltf) => resolve(gltf.scene),
        undefined,
        () => resolve(null),
      );
    });

    Promise.all(MODELS.map((m) => loadModel(m.file))).then((scenes) => {
      if (cancelled) return;

      scenes.forEach((model, i) => {
        if (!model) return;
        const cfg = MODELS[i];
        model.position.set(...cfg.position);
        model.scale.setScalar(cfg.scale);
        model.rotation.y = cfg.rotationY;
        model.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              if ('emissive' in mat) {
                mat.emissive = NEON_TINT.clone();
                mat.emissiveIntensity = 0.5;
              }
            });
          }
        });
        scene.add(model);
        loadedModels.push(model);
      });

      resize();

      ctx = gsap.context(() => {
        const headings = headingRefs.current;
        const texts = txtRefs.current;

        headings.forEach((el) => {
          if (!el) return;
          const split = new SplitText(el, { type: 'chars' });
          splits.push(split);
          gsap.set(split.chars, { yPercent: 120, opacity: 0 });
        });
        gsap.set(texts, { opacity: 0 });
        gsap.set(texts[0], { opacity: 1 });
        if (splits[0]) gsap.set(splits[0].chars, { yPercent: 0, opacity: 1 });

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        const segments = CAPTIONS.length;
        for (let i = 1; i < segments; i++) {
          const slot = i * 2;
          if (texts[i - 1]) master.to(texts[i - 1], { opacity: 0, duration: 0.6 }, slot);
          if (splits[i - 1]) master.to(splits[i - 1].chars, { yPercent: -120, opacity: 0, duration: 0.6, stagger: 0.01 }, slot);
          if (texts[i]) master.to(texts[i], { opacity: 1, duration: 0.6 }, slot + 0.3);
          if (splits[i]) master.to(splits[i].chars, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.015, ease: 'power2.out' }, slot + 0.3);
        }

        ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate(self) {
            const kfSegments = KEYFRAMES.length - 1;
            const floatIdx = gsap.utils.clamp(0, kfSegments - 0.0001, self.progress * kfSegments);
            const idx = Math.floor(floatIdx);
            const localT = floatIdx - idx;
            camState = {
              pos: lerpVec3(KEYFRAMES[idx].pos, KEYFRAMES[idx + 1].pos, localT),
              target: lerpVec3(KEYFRAMES[idx].target, KEYFRAMES[idx + 1].target, localT),
            };

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
        camera.position.set(...camState.pos);
        camera.lookAt(...camState.target);
        accentLight.position.set(camState.pos[0], camState.pos[1] + 10, camState.pos[2]);
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (onResize) window.removeEventListener('resize', onResize);
      splits.forEach((s) => s.revert());
      ctx?.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      loadedModels.forEach((model) => {
        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => mat?.dispose());
          }
        });
      });
      ground.geometry.dispose();
      ground.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="sample4-page">
      <Helmet>
        <title>Sample 4 — Cinematic Scene Showcase | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample4-page__back">&larr; Back</Link>

      <div className="sample4-intro">
        <h1>Cinematic Scene Showcase</h1>
        <span>Scroll down</span>
      </div>

      <section className="sample4-stage" ref={stageRef}>
        <div className="sample4-stage__pin">
          <canvas ref={canvasRef} />
          <div className="sample4-texts">
            {CAPTIONS.map((c, i) => (
              <div className={`sample4-txt pos-${c.pos}`} key={c.h} ref={(el) => (txtRefs.current[i] = el)}>
                <h2 ref={(el) => (headingRefs.current[i] = el)}>{c.h}</h2>
                <p>{c.p}</p>
              </div>
            ))}
          </div>
          <div className="sample4-progress">
            {CAPTIONS.map((c, i) => (
              <div className="segment" key={c.h}>
                <div className="fill" ref={(el) => (fillRefs.current[i] = el)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sample4Page;
