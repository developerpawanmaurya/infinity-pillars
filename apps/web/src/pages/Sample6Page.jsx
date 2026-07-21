import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import './Sample6.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

// A closer port of variant-2 from JosephASG's "codrops-cinematic-scroll-
// animations" (MIT licensed) than Sample 4 was. The key structural thing
// Sample 4 got wrong: the source doesn't fly the camera between several
// separate buildings — there's exactly ONE structure at the origin, and
// the camera orbits it through ten fixed waypoints (a mix of low/close,
// high/wide and off-to-the-side angles), each owning its own slice of the
// scroll range. Both camera position AND look-at target are driven by the
// same GSAP timeline, one pair of tweens per waypoint, linear ('none')
// within each slice — the "smoothing" comes entirely from Lenis's inertia
// and the scrub value, not from eased tweens. Fog and light numbers below
// are quoted directly from the source (functional data, not creative
// expression): Fog('#0a0a0a', 12, 28); ambient 0.4; directional
// (10,20,10) 1.2; directional (-10,10,-10) 0.6; cyan point light
// (0,50,20) 0.8. Independent Three.js implementation (source uses React
// Three Fiber) — no shader/component source copied. Building model is a
// genuinely CC0 asset (Kenney's Starter-Kit-City-Builder) standing in for
// the source's own non-redistributable model, per your own earlier call.
// Font is Space Grotesk (Google Fonts), not the source's Typekit account.
// The source's own building model has no license or credit anywhere in its
// repo or article, so it wasn't safe to redistribute. Two substitutes were
// tried before this one (a generic CC0 kit piece, then a from-scratch
// procedural tower) purely to get *a* structure with the right proportions
// in place. This is a real model: "residential complex modern apartment
// building" by saeedakbari, licensed CC-BY-4.0, downloaded via Sketchfab
// (https://sketchfab.com/3d-models/residential-complex-modern-apartment-
// building-d1e54b379c664a349cd4a288527317c8) — confirmed from the
// author/license/source fields Sketchfab embeds directly in the glb's own
// asset.extras metadata, not just taken on faith. CC-BY requires
// attribution, given as a small credit line in the page below.
const MODEL_URL = '/models/cinematic-scroll/apartment-tower.glb';
// Rough estimate until the actual model loads and its bounding box is
// measured — TARGET_HEIGHT is what the model gets uniformly scaled to
// match, since the camera waypoints below were tuned for a structure
// roughly that tall (several look up toward y=25-35).
const TARGET_HEIGHT = 32 * 0.7;

function fitModelToHeight(model, targetHeight) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  box.getSize(size);
  const scale = size.y > 0 ? targetHeight / size.y : 1;
  model.scale.setScalar(scale);

  // Re-measure after scaling, then shift so the model's base sits at y=0
  // and it's centred on the x/z origin — the camera path assumes both.
  const scaledBox = new THREE.Box3().setFromObject(model);
  const center = new THREE.Vector3();
  scaledBox.getCenter(center);
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= scaledBox.min.y;
}

// Ten waypoints, quoted directly from the source's scene-data module:
// camera {x,y,z}, look-at target {x,y,z}, a text position, and the
// scroll-range percentage this waypoint owns.
const PERSPECTIVES = [
  { camera: [0, 2, 10], target: [0, 5, 0], pos: 'center', range: [0, 11.9], h: 'Ground Level', p: 'The shot opens close and low, looking straight up at the base of the structure.' },
  { camera: [3, 8, 10], target: [0, 10, 0], pos: 'left', range: [11.9, 23.7], h: 'Rising', p: 'The camera lifts and drifts to one side, tracking upward along the facade.' },
  { camera: [-10, 15, 0], target: [0, 15, 0], pos: 'right', range: [23.7, 35.6], h: 'Around the Side', p: "A full swing to the opposite side, at the structure's mid-height." },
  { camera: [-10, 22, 0], target: [0, 25, 0], pos: 'top-left', range: [35.6, 45.8], h: 'Higher Still', p: 'Still on that side, but climbing further, looking up toward the top.' },
  { camera: [5, 35, 5], target: [0, 20, 0], pos: 'top-right', range: [45.8, 52.5], h: 'Above It All', p: "The highest point of the sequence — a bird's-eye look down at the whole structure." },
  { camera: [5, 30, 10], target: [0, 20, 0], pos: 'center', range: [52.5, 62.7], h: 'Descending', p: 'The camera begins its way back down, still framing the structure centrally.' },
  { camera: [5, 25, 10], target: [0, 20, 0], pos: 'bottom-right', range: [62.7, 69.5], h: 'Settling', p: 'A shorter beat, easing toward a more level vantage point.' },
  { camera: [15, 20, 5], target: [0, 24, 0], pos: 'bottom-left', range: [69.5, 77.9], h: 'From Afar', p: 'Pulling further out to the side, the structure now reads as part of a skyline.' },
  { camera: [25, 15, 0], target: [0, 20, 0], pos: 'top', range: [77.9, 84.7], h: 'Wide Angle', p: "One of the widest shots — distant and low, watching the structure's silhouette." },
  { camera: [20, 20, -10], target: [0, 20, 0], pos: 'center', range: [84.7, 100], h: 'Final Vantage', p: 'The sequence ends behind the structure, closing the loop around it.' },
];

function lerpVec3(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

const Sample6Page = () => {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const headingRefs = useRef([]);
  const subRefs = useRef([]);
  const txtRefs = useRef([]);
  const fillRefs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    let onResize;
    let ctx;
    let rafId;
    const camState = { x: PERSPECTIVES[0].camera[0], y: PERSPECTIVES[0].camera[1], z: PERSPECTIVES[0].camera[2] };
    const targetState = { x: PERSPECTIVES[0].target[0], y: PERSPECTIVES[0].target[1], z: PERSPECTIVES[0].target[2] };
    const splits = [];

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    const scene = new THREE.Scene();
    const fogColor = new THREE.Color(0x0a0a0a);
    scene.background = fogColor;
    scene.fog = new THREE.Fog(fogColor, 12, 28);

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    camera.position.set(...PERSPECTIVES[0].camera);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 20, 10);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);
    const accentLight = new THREE.PointLight(0x00ffff, 0.8);
    accentLight.position.set(0, 50, 20);
    scene.add(accentLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(400, 400),
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

    let cancelled = false;
    let loadedModel = null;
    const loader = new GLTFLoader();

    loader.load(MODEL_URL, (gltf) => {
      if (cancelled) return;
      const model = gltf.scene;
      fitModelToHeight(model, TARGET_HEIGHT);
      scene.add(model);
      loadedModel = model;
      resize();

      ctx = gsap.context(() => {
        const headings = headingRefs.current;
        const subs = subRefs.current;
        const texts = txtRefs.current;

        headings.forEach((el, i) => {
          if (!el || !subs[i]) return;
          const titleSplit = new SplitText(el, { type: 'chars' });
          const subtitleSplit = new SplitText(subs[i], { type: 'chars' });
          splits.push({ titleSplit, subtitleSplit });
          gsap.set([...titleSplit.chars, ...subtitleSplit.chars], { x: -100, opacity: 0 });
        });
        gsap.set(texts, { autoAlpha: 0 });
        gsap.set(texts[0], { autoAlpha: 1 });
        if (splits[0]) {
          gsap.set([...splits[0].titleSplit.chars, ...splits[0].subtitleSplit.chars], { x: 0, opacity: 1 });
        }

        // One shared timeline, 0-100 units matching the scroll percentage
        // ranges directly: camera + look-at target both tween linearly
        // within each waypoint's own slice.
        const master = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        PERSPECTIVES.forEach((persp, i) => {
          if (i === 0) return;
          const [start, end] = persp.range;
          master.to(camState, { x: persp.camera[0], y: persp.camera[1], z: persp.camera[2], duration: end - start, ease: 'none' }, start);
          master.to(targetState, { x: persp.target[0], y: persp.target[1], z: persp.target[2], duration: end - start, ease: 'none' }, start);
        });

        // Per-text ScrollTrigger, one per waypoint, tied to that
        // waypoint's own scroll-range percentage of the container height.
        PERSPECTIVES.forEach((persp, i) => {
          const el = texts[i];
          const split = splits[i];
          if (!el || !split) return;
          const chars = [...split.titleSplit.chars, ...split.subtitleSplit.chars];
          const [start, end] = persp.range;

          gsap.timeline({
            scrollTrigger: {
              trigger: stage,
              start: `${start}% top`,
              end: `${end}% top`,
              scrub: 0.5,
            },
          })
            .set(el, { autoAlpha: 1 })
            .fromTo(chars, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25, stagger: -0.02, ease: 'power2.out' })
            .to(chars, { x: 100, opacity: 0, duration: 1, stagger: -0.02, ease: 'power2.in' }, '+=0.5')
            .set(el, { autoAlpha: 0 });
        });

        ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          onUpdate(self) {
            const step = 1 / PERSPECTIVES.length;
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
        camera.lookAt(targetState.x, targetState.y, targetState.z);
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (onResize) window.removeEventListener('resize', onResize);
      splits.forEach(({ titleSplit, subtitleSplit }) => {
        titleSplit.revert();
        subtitleSplit.revert();
      });
      ctx?.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      loadedModel?.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => mat?.dispose());
        }
      });
      ground.geometry.dispose();
      ground.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="sample6-page">
      <Helmet>
        <title>Sample 6 — Cinematic Scene Showcase (Exact Copy) | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample6-page__back">&larr; Back</Link>

      <div className="sample6-intro">
        <h1>Cinematic Scene Showcase</h1>
        <span>Scroll down</span>
      </div>

      <section className="sample6-stage" ref={stageRef}>
        <div className="sample6-stage__pin">
          <canvas ref={canvasRef} />
          <div className="sample6-texts">
            {PERSPECTIVES.map((persp, i) => (
              <div className={`sample6-txt pos-${persp.pos}`} key={persp.h} ref={(el) => (txtRefs.current[i] = el)}>
                <h2 ref={(el) => (headingRefs.current[i] = el)}>{persp.h}</h2>
                <p ref={(el) => (subRefs.current[i] = el)}>{persp.p}</p>
              </div>
            ))}
          </div>
          <div className="sample6-progress">
            {PERSPECTIVES.map((persp, i) => (
              <div className="segment" key={persp.h}>
                <div className="fill" ref={(el) => (fillRefs.current[i] = el)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <a
        className="sample6-credit"
        href="https://sketchfab.com/3d-models/residential-complex-modern-apartment-building-d1e54b379c664a349cd4a288527317c8"
        target="_blank"
        rel="noopener noreferrer"
      >
        Building model by saeedakbari, CC BY 4.0
      </a>
    </div>
  );
};

export default Sample6Page;
