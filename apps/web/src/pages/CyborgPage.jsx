import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './Cyborg.css';

gsap.registerPlugin(ScrollTrigger);

// Scroll-triggered hero: a rigged cyborg (right side) draws its katana into
// a guard stance, holds a beat, then whips a fast diagonal slash. The slash
// is sold on two layers — a 3D blade swing (driving the model's independent
// katana node, which isn't parented to the hand bone in the source asset)
// and a screen-space diagonal wipe that clip-paths the hero open along the
// blade's path, revealing the next section underneath. Everything is driven
// off one ScrollTrigger progress value so the 3D pose and the DOM/CSS wipe
// never fall out of sync with each other or with the scrubbed scroll input.
//
// Model: Sketchfab "Cyborg with Thermal Katana" by Mateusz Wolinski
// (SKETCHFAB Standard license). Source file was a 266MB, 4K/8K-texture
// export; optimized here to a 3.6MB glb (gltf-transform: WebP textures at
// 1024px, Draco-compressed geometry) — see cyborg-optimized.glb.

const MODEL_URL = '/models/Robot/cyborg-optimized.glb';
const DRACO_DECODER_PATH = '/draco/';

// Scroll-progress breakpoints for the pinned hero timeline (0..1).
const PH = [0, 0.38, 0.5, 0.66, 1];
// Named sub-windows used by the FX layer — kept in the same 0..1 space as
// PH so the blade motion and the screen wipe/flash stay visually locked.
const BURST_START = 0.5;
const BURST_PEAK = 0.58;
const BURST_END = 0.66;
const CUT_START = 0.52;
const CUT_END = 0.8;

const EASES = ['power2.inOut', 'sine.inOut', 'power3.out', 'power2.out'];
const YAW_DEG = [-18, -4, -4, 7, 2];
const EMISSIVE_MULT = [0.3, 1.0, 1.15, 1.6, 0.75];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// The katana node isn't skinned/parented to the hand bone in the source
// asset — it's an independent static prop, positioned at the hip in the
// authored rest pose (which is why it already reads as "held loosely at
// the side" at rest). Rather than hand-authoring a second, separate set of
// katana keyframes (which drifts out of sync with wherever the hand
// actually ends up), the katana is socketed onto the right hand bone every
// frame: its position/rotation are *derived* from the hand bone's live
// world transform (plus a fixed grip offset), so it stays attached through
// the whole swing no matter how the arm keyframes below are tuned. The
// choreography itself lives entirely in the arm bone rotations.
// GLTFLoader sanitizes node names for animation-path compatibility, which
// strips the colon out of the source rig's "mixamorig:" prefix.
const ARM_BONES = ['mixamorigRightArm_50', 'mixamorigRightForeArm_49', 'mixamorigRightHand_48'];
const ARM_DELTAS = [
  [{ euler: [0, 0, 0] }, { euler: [0, 0, 0] }, { euler: [0, 0, 0] }], // 0 rest / sheathed
  [{ euler: [-1.15, 0.2, 0.4] }, { euler: [-0.85, 0, 0] }, { euler: [-0.3, 0, 0.2] }], // 1 guard (rise complete)
  [{ euler: [-1.2, 0.22, 0.42] }, { euler: [-0.9, 0, 0] }, { euler: [-0.32, 0, 0.22] }], // 2 anticipation hold
  [{ euler: [0.35, -1.0, -0.55] }, { euler: [-0.35, 0, 0] }, { euler: [0.15, 0, -0.25] }], // 3 slash follow-through
  [{ euler: [0.1, -0.6, -0.3] }, { euler: [-0.4, 0, 0] }, { euler: [0.05, 0, -0.1] }], // 4 settle
];

// Fixed offset from the hand bone's origin/orientation to where the katana
// grip should sit, expressed in the hand bone's own local space — tuned by
// eye against screenshots, not derived from any semantic hand-frame
// convention (mixamo bone axes aren't standardized).
const GRIP_POS_OFFSET = [0, 0.09, -0.02];
const GRIP_QUAT_OFFSET_EULER = [1.15, 0.15, -1.35];

function segmentFor(p) {
  let i = 0;
  while (i < PH.length - 2 && p > PH[i + 1]) i += 1;
  const span = PH[i + 1] - PH[i] || 1;
  const localT = clamp01((p - PH[i]) / span);
  const eased = gsap.parseEase(EASES[i])(localT);
  return { i, eased };
}

const CyborgPage = () => {
  const heroRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneLayerRef = useRef(null);
  const copyRef = useRef(null);
  const streakRef = useRef(null);
  const flashRef = useRef(null);
  const cutEdgeRef = useRef(null);
  const loaderRef = useRef(null);
  const scrollCueRef = useRef(null);

  const [progressPct, setProgressPct] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pin = pinRef.current;
    const hero = heroRef.current;
    if (!canvas || !pin || !hero) return undefined;

    let cancelled = false;
    let rafId;
    let onResize;
    let ctx;
    let scrollTriggerInstance;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07070a);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.DirectionalLight(0xfff4e0, 1.6);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xafea00, 0.9);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);
    const bladeLight = new THREE.PointLight(0xafea00, 0, 6);
    scene.add(bladeLight);

    const robotRig = new THREE.Group();
    scene.add(robotRig);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let katana = null;
    let katanaBaseEmissive = 1;
    let handBone = null;
    let bbSize = new THREE.Vector3(1, 1.9, 1);
    const armBones = [];
    const armKeyframes = [];
    const gripPosOffset = new THREE.Vector3(...GRIP_POS_OFFSET);
    const gripQuatOffset = new THREE.Quaternion().setFromEuler(new THREE.Euler(...GRIP_QUAT_OFFSET_EULER));

    const isNarrow = () => window.innerWidth < 820;

    const applyFraming = () => {
      const narrow = isNarrow();
      const w = pin.clientWidth || window.innerWidth;
      const h = pin.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      // Vertical FOV is fixed, so a narrow (portrait) aspect ratio shrinks
      // the *horizontal* frustum a lot — pull the camera back much further
      // on narrow viewports or the off-center rig clips out of frame.
      const distFactor = narrow ? Math.max(3.6, 2.1 / camera.aspect) : 1.85;
      const rigOffsetXFactor = narrow ? 0.16 : 0.5;
      robotRig.position.x = bbSize.y * rigOffsetXFactor;
      camera.position.set(0, bbSize.y * 0.6, bbSize.y * distFactor);
      camera.lookAt(0, bbSize.y * 0.62, 0);
    };

    loader.load(
      MODEL_URL,
      (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.frustumCulled = false;
            if (child.material?.name === 'Katana') katana = child;
          }
          if (ARM_BONES.includes(child.name)) armBones.push(child);
        });
        // Traversal order isn't guaranteed to match ARM_BONES order.
        armBones.sort((a, b) => ARM_BONES.indexOf(a.name) - ARM_BONES.indexOf(b.name));

        robotRig.add(model);

        const box = new THREE.Box3().setFromObject(model);
        bbSize = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y;

        if (katana) {
          katanaBaseEmissive = katana.material.emissiveIntensity || 6;
          katana.material.emissiveIntensity = katanaBaseEmissive * EMISSIVE_MULT[0];
        }

        if (armBones.length === ARM_BONES.length) {
          handBone = armBones[armBones.length - 1];
          const restQuats = armBones.map((bone) => bone.quaternion.clone());
          // Pre-multiply (delta * rest), not post-multiply: these bones'
          // rest quaternions are themselves heavily twisted (mixamo rig),
          // so rotating "in the bone's own local frame" (post-multiply)
          // sends most of the delta into an invisible twist. Applying the
          // delta in the parent's frame instead reads as the intended
          // raise/swing.
          for (let kf = 0; kf < ARM_DELTAS.length; kf += 1) {
            armKeyframes.push(armBones.map((bone, boneIdx) => new THREE.Quaternion()
              .setFromEuler(new THREE.Euler(...ARM_DELTAS[kf][boneIdx].euler))
              .multiply(restQuats[boneIdx])));
          }
        }

        applyFraming();
        setLoaded(true);

        ctx = gsap.context(() => {
          let cutRect = { w: pin.clientWidth, h: pin.clientHeight };
          const refreshRect = () => { cutRect = { w: pin.clientWidth, h: pin.clientHeight }; };
          refreshRect();

          let shakeEnvelope = 0;

          const updateFrame = (p) => {
            const { i, eased } = segmentFor(p);

            if (armBones.length === ARM_BONES.length && armKeyframes.length) {
              const qa = armKeyframes[i];
              const qb = armKeyframes[i + 1];
              armBones.forEach((bone, boneIdx) => {
                bone.quaternion.slerpQuaternions(qa[boneIdx], qb[boneIdx], eased);
              });
            }

            const yaw = THREE.MathUtils.lerp(YAW_DEG[i], YAW_DEG[i + 1], eased);
            robotRig.rotation.y = THREE.MathUtils.degToRad(yaw);

            if (i === 1) {
              // Anticipation hold: tiny tremor so the pause doesn't read as frozen.
              robotRig.rotation.y += Math.sin(p * 900) * 0.004;
            }

            // Socket the katana onto the hand bone's live transform (see the
            // comment on ARM_BONES above) — this reads the arm/yaw changes
            // just applied, so it must run after them.
            if (katana && handBone) {
              const gripWorld = handBone.localToWorld(gripPosOffset.clone());
              katana.position.copy(katana.parent.worldToLocal(gripWorld));

              const handWorldQuat = handBone.getWorldQuaternion(new THREE.Quaternion());
              const parentWorldQuatInv = katana.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
              katana.quaternion.copy(parentWorldQuatInv.multiply(handWorldQuat).multiply(gripQuatOffset));

              const emissive = THREE.MathUtils.lerp(EMISSIVE_MULT[i], EMISSIVE_MULT[i + 1], eased);
              katana.material.emissiveIntensity = katanaBaseEmissive * emissive;
              bladeLight.intensity = emissive * 2.4;
              bladeLight.position.copy(katana.getWorldPosition(new THREE.Vector3()));
            }

            if (copyRef.current) {
              const introOpacity = 1 - smoothstep(0, 0.28, p);
              copyRef.current.style.opacity = String(introOpacity);
              copyRef.current.style.transform = `translateY(${(1 - introOpacity) * -18}px)`;
            }
            if (scrollCueRef.current) {
              scrollCueRef.current.style.opacity = String(1 - smoothstep(0, 0.1, p));
            }

            let burst = 0;
            if (p <= BURST_PEAK) burst = smoothstep(BURST_START, BURST_PEAK, p);
            else burst = 1 - smoothstep(BURST_PEAK, BURST_END, p);
            burst = clamp01(burst);
            shakeEnvelope = prefersReducedMotion ? 0 : burst;

            if (streakRef.current) streakRef.current.style.opacity = String(prefersReducedMotion ? 0 : burst);
            if (flashRef.current) flashRef.current.style.opacity = String(prefersReducedMotion ? 0 : burst * 0.5);

            const cutT = smoothstep(CUT_START, CUT_END, p);
            const w = cutRect.w;
            const h = cutRect.h;
            const slant = w * 0.22;
            const topX = -0.15 * w + cutT * 1.3 * w;
            const botX = topX - slant;
            if (sceneLayerRef.current) {
              sceneLayerRef.current.style.clipPath = `polygon(${topX}px 0px, ${w + 40}px 0px, ${w + 40}px ${h}px, ${botX}px ${h}px)`;
            }
            if (cutEdgeRef.current) {
              const edgeVisible = cutT > 0.001 && cutT < 0.999;
              const midX = (topX + botX) / 2;
              const midY = h / 2;
              const angleDeg = (Math.atan2(h, botX - topX) * 180) / Math.PI - 90;
              const edgeLen = Math.hypot(h, botX - topX);
              cutEdgeRef.current.style.opacity = edgeVisible ? String(Math.min(1, burst * 1.4 + 0.55)) : '0';
              cutEdgeRef.current.style.height = `${edgeLen}px`;
              cutEdgeRef.current.style.transform = `translate(${midX}px, ${midY}px) rotate(${angleDeg}deg) translate(-50%, -50%)`;
            }

            return shakeEnvelope;
          };

          scrollTriggerInstance = ScrollTrigger.create({
            trigger: hero,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.4,
            invalidateOnRefresh: true,
            onRefresh: refreshRect,
            onUpdate: (self) => {
              shakeEnvelope = updateFrame(self.progress) || 0;
            },
          });

          updateFrame(0);

          onResize = () => {
            applyFraming();
            refreshRect();
            ScrollTrigger.refresh();
          };
          window.addEventListener('resize', onResize);

          const animate = () => {
            rafId = requestAnimationFrame(animate);
            const t = performance.now() * 0.001;
            robotRig.position.y = Math.sin(t * 1.1) * 0.012;
            if (shakeEnvelope > 0.001) {
              camera.position.x = Math.sin(t * 53.1) * 0.025 * shakeEnvelope;
              camera.position.y = bbSize.y * 0.62 + Math.cos(t * 47.7) * 0.02 * shakeEnvelope;
            } else {
              camera.position.x = 0;
              camera.position.y = bbSize.y * 0.62;
            }
            renderer.render(scene, camera);
          };
          rafId = requestAnimationFrame(animate);
        }, hero);
      },
      (evt) => {
        if (evt.total) setProgressPct(Math.round((evt.loaded / evt.total) * 100));
      },
      () => {
        setLoaded(true);
      },
    );

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (onResize) window.removeEventListener('resize', onResize);
      scrollTriggerInstance?.kill();
      ctx?.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
      dracoLoader.dispose();
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => mat?.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="cyborg-page">
      <Helmet>
        <title>The Draw — Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="cyborg-page__back">&larr; Back</Link>

      <section className="cyborg-hero" ref={heroRef}>
        <div className="cyborg-hero__pin" ref={pinRef}>
          <div className="cyborg-hero__reveal">
            <div className="cyborg-hero__reveal-inner">
              <span className="cyborg-hero__eyebrow">Infinity Pillars</span>
              <h2>Built to cut<br />through the noise.</h2>
              <p>Strategy, design and build — moving at the speed the work actually demands.</p>
            </div>
          </div>

          <div className="cyborg-hero__scene" ref={sceneLayerRef}>
            <canvas ref={canvasRef} />
            <div className="cyborg-hero__vignette" />
            <div className="cyborg-hero__copy" ref={copyRef}>
              <span className="cyborg-hero__eyebrow">Infinity Pillars</span>
              <h1>Precision,<br />weaponized.</h1>
              <p>Scroll to draw the blade.</p>
            </div>
            {!loaded && (
              <div className="cyborg-hero__loader" ref={loaderRef}>
                <span>Loading {progressPct}%</span>
              </div>
            )}
          </div>

          <div className="cyborg-hero__streak" ref={streakRef} aria-hidden="true" />
          <div className="cyborg-hero__cut-edge" ref={cutEdgeRef} aria-hidden="true" />
          <div className="cyborg-hero__flash" ref={flashRef} aria-hidden="true" />

          <div className="cyborg-hero__scroll-cue" ref={scrollCueRef} aria-hidden="true">
            <span />
            Scroll
          </div>
        </div>
      </section>

      <section className="cyborg-next">
        <div className="cyborg-next__top">
          <span className="cyborg-hero__eyebrow">Infinity Pillars</span>
          <h2>Built to cut<br />through the noise.</h2>
          <p>Strategy, design and build — moving at the speed the work actually demands.</p>
        </div>

        <div className="cyborg-next__grid">
          <div className="cyborg-next__card">
            <span className="cyborg-next__num">01</span>
            <h3>Strategy</h3>
            <p>Clarity on the problem before a single pixel moves — so the build points at the right target.</p>
          </div>
          <div className="cyborg-next__card">
            <span className="cyborg-next__num">02</span>
            <h3>Design</h3>
            <p>Interfaces and motion built with intent, not decoration — every choice earns its place.</p>
          </div>
          <div className="cyborg-next__card">
            <span className="cyborg-next__num">03</span>
            <h3>Build</h3>
            <p>Production code from day one. No throwaway prototypes, no second build to get it right.</p>
          </div>
        </div>

        <div className="cyborg-next__cta">
          <Link to="/contact" className="cyborg-next__button">Start a project</Link>
        </div>
      </section>
    </div>
  );
};

export default CyborgPage;
