import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RoomTour3D.css';

gsap.registerPlugin(ScrollTrigger);

const DRACO_DECODER_PATH = '/draco/';

// This pins for its own scroll distance and drives everything off one
// ScrollTrigger progress value (0..1): camera flies between per-room
// bounding-box vantage points, each room's copy rises from the bottom
// while "in frame", and the ceiling fades once the walkthrough moves past
// the establishing shot. Deliberately does NOT create its own Lenis
// instance — the host page already runs one wired to
// `lenis.on('scroll', ScrollTrigger.update)`, and a second instance would
// fight it for control of the native scroll position. Built specifically
// around the apartment scan's node names (Sala_Cozinha / Quartos /
// Banheiros_Corredor / Teto), not a fully generic model viewer.
//
// `rooms`: [{ key, tag, title, body, boxKey, overview?, angleDeg,
//   distFactor, heightFrac, lookHeightFrac, lookAtBias? }]
// `boxKey` must be one of: 'overview' | 'living' | 'quartos' | 'bath'.

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

function computeStop(box, { angleDeg, distFactor, heightFrac, lookHeightFrac, lookAtBias }) {
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(size.x, size.z) * distFactor;
  const rad = THREE.MathUtils.degToRad(angleDeg);
  const position = new THREE.Vector3(
    center.x + Math.cos(rad) * radius,
    box.min.y + size.y * heightFrac,
    center.z + Math.sin(rad) * radius,
  );
  const [biasX = 0, biasZ = 0] = lookAtBias || [];
  const lookAt = new THREE.Vector3(
    center.x + biasX * size.x,
    box.min.y + size.y * lookHeightFrac,
    center.z + biasZ * size.z,
  );
  return { position, lookAt };
}

function segmentFor(p, ts) {
  let i = 0;
  while (i < ts.length - 2 && p > ts[i + 1]) i += 1;
  const span = ts[i + 1] - ts[i] || 1;
  const localT = clamp01((p - ts[i]) / span);
  return { i, localT };
}

// Triangular "in view" window centered on a stop's t, used to fade + lift
// each room's copy block only while the camera is actually near that stop.
function roomWindow(p, t, halfWidth, ramp) {
  const inEnd = t - halfWidth;
  const inStart = inEnd - ramp;
  const outStart = t + halfWidth;
  const outEnd = outStart + ramp;
  if (p <= inStart || p >= outEnd) return 0;
  if (p < inEnd) return smootherstep(clamp01((p - inStart) / ramp));
  if (p > outStart) return 1 - smootherstep(clamp01((p - outStart) / ramp));
  return 1;
}

const WINDOW_HALF = 0.075;
const WINDOW_RAMP = 0.05;

const RoomTour3D = ({ rooms, modelUrl, className = '', id }) => {
  const tourRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const roomTagRef = useRef(null);
  const copyRefs = useRef([]);
  const dotRefs = useRef([]);
  const veilRef = useRef(null);

  const [progressPct, setProgressPct] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const STOP_T = rooms.map((_, i) => i / (rooms.length - 1));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const canvas = canvasRef.current;
    const pin = pinRef.current;
    const tour = tourRef.current;
    let cancelled = false;
    let rafId;
    let onResize;
    let scrollTriggerInstance;
    let dracoLoader;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050504);
    scene.fog = new THREE.Fog(0x050504, 8, 60);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.05, 200);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;

    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const basePos = new THREE.Vector3();
    const baseLookAt = new THREE.Vector3();
    let bobScale = 1;
    let currentIndex = 0;

    const applySize = () => {
      const w = pin.clientWidth || window.innerWidth;
      const h = pin.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    applySize();

    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH);
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let ctx;

    loader.load(
      modelUrl,
      (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;
        modelGroup.add(model);

        // Center horizontally, drop floor to y=0 — matches the coordinate
        // space every room bounding box below is computed in.
        let box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y;
        model.updateMatrixWorld(true);

        box = new THREE.Box3().setFromObject(model);
        const overallSize = box.getSize(new THREE.Vector3());
        bobScale = Math.max(overallSize.x, overallSize.y, overallSize.z) * 0.006;

        const livingNode = model.getObjectByName('Sala_Cozinha');
        // "Chambre01_Meuble_Lit" is only the bed/furniture prop — "Quartos"
        // is the actual bedroom shell, floor to ceiling.
        const quartosNode = model.getObjectByName('Quartos');
        const bathNode = model.getObjectByName('Banheiros_Corredor');
        const ceilingNode = model.getObjectByName('Teto');

        const roomBoxes = {
          overview: box,
          living: livingNode ? new THREE.Box3().setFromObject(livingNode) : box,
          quartos: quartosNode ? new THREE.Box3().setFromObject(quartosNode) : box,
          bath: bathNode ? new THREE.Box3().setFromObject(bathNode) : box,
        };

        if (ceilingNode) {
          const mats = Array.isArray(ceilingNode.material) ? ceilingNode.material : [ceilingNode.material];
          mats.forEach((m) => { if (m) m.transparent = true; });
        }

        const firstStop = computeStop(roomBoxes[rooms[0].boxKey], rooms[0]);
        camera.position.copy(firstStop.position);
        basePos.copy(firstStop.position);
        baseLookAt.copy(firstStop.lookAt);
        camera.lookAt(baseLookAt);

        setLoaded(true);

        ctx = gsap.context(() => {
          const posA = new THREE.Vector3();
          const posB = new THREE.Vector3();
          const lookA = new THREE.Vector3();
          const lookB = new THREE.Vector3();

          const updateFrame = (p) => {
            const { i, localT } = segmentFor(p, STOP_T);
            const eased = smootherstep(localT);
            const roomA = rooms[i];
            const roomB = rooms[i + 1];
            const stopA = computeStop(roomBoxes[roomA.boxKey], roomA);
            const stopB = computeStop(roomBoxes[roomB.boxKey], roomB);
            posA.copy(stopA.position); posB.copy(stopB.position);
            lookA.copy(stopA.lookAt); lookB.copy(stopB.lookAt);

            basePos.lerpVectors(posA, posB, eased);
            baseLookAt.lerpVectors(lookA, lookB, eased);

            if (ceilingNode) {
              const ceilFade = 1 - smootherstep(clamp01((p - STOP_T[0]) / (STOP_T[1] * 0.55)));
              const mats = Array.isArray(ceilingNode.material) ? ceilingNode.material : [ceilingNode.material];
              mats.forEach((m) => { if (m) m.opacity = ceilFade; });
              ceilingNode.visible = ceilFade > 0.01;
            }

            let bestIdx = 0;
            let bestVal = -1;
            rooms.forEach((room, idx) => {
              const w = roomWindow(p, STOP_T[idx], WINDOW_HALF, WINDOW_RAMP);
              const el = copyRefs.current[idx];
              if (el) {
                el.style.opacity = String(w);
                el.style.transform = `translateY(${(1 - w) * 36}px)`;
              }
              const dot = dotRefs.current[idx];
              if (dot) dot.classList.toggle('is-active', w > 0.4);
              if (w > bestVal) { bestVal = w; bestIdx = idx; }
            });
            if (bestIdx !== currentIndex || bestVal < 0.05) {
              const nearest = STOP_T.reduce((acc, t, idx) => (Math.abs(t - p) < Math.abs(STOP_T[acc] - p) ? idx : acc), 0);
              currentIndex = nearest;
              if (roomTagRef.current) roomTagRef.current.textContent = rooms[nearest].tag;
            } else if (roomTagRef.current) {
              roomTagRef.current.textContent = rooms[bestIdx].tag;
            }

            // A straight camera lerp between two rooms' vantage points
            // briefly grazes the wall between them mid-flight (they aren't
            // mutually visible, so there's no clip-free path). Rather than
            // author per-room waypoints, mask the transit with a brief
            // darken — reads as a deliberate cut between rooms.
            if (veilRef.current) {
              veilRef.current.style.opacity = String(Math.pow(clamp01(1 - bestVal), 1.6) * 0.7);
            }
          };

          scrollTriggerInstance = ScrollTrigger.create({
            trigger: tour, start: 'top top', end: 'bottom bottom', scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => updateFrame(self.progress),
          });
          updateFrame(0);

          onResize = () => { applySize(); ScrollTrigger.refresh(); };
          window.addEventListener('resize', onResize);

          const animate = () => {
            rafId = requestAnimationFrame(animate);
            const t = performance.now() * 0.001;
            if (!prefersReducedMotion) {
              camera.position.set(
                basePos.x + Math.cos(t * 0.35) * bobScale,
                basePos.y + Math.sin(t * 0.5) * bobScale,
                basePos.z + Math.sin(t * 0.3) * bobScale,
              );
            } else {
              camera.position.copy(basePos);
            }
            camera.lookAt(baseLookAt);
            renderer.render(scene, camera);
          };
          rafId = requestAnimationFrame(animate);
        }, tour);
      },
      (evt) => {
        if (evt.total) setProgressPct(Math.round((evt.loaded / evt.total) * 100));
      },
      () => setLoaded(true),
    );

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (onResize) window.removeEventListener('resize', onResize);
      scrollTriggerInstance?.kill();
      ctx?.revert();
      dracoLoader?.dispose();
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat) => mat?.dispose());
        }
      });
      renderer.dispose();
    };
  }, [rooms, modelUrl]);

  return (
    <section className={`rt-tour ${className}`} id={id} ref={tourRef}>
      <div className="rt-tour__pin" ref={pinRef}>
        <canvas ref={canvasRef} />
        <div className="rt-tour__vignette" />
        <div className="rt-tour__veil" ref={veilRef} aria-hidden="true" />
        {!loaded && (
          <div className="rt-tour__loader">Loading — {progressPct}%</div>
        )}
        <div className="rt-tour__room-tag" ref={roomTagRef}>{rooms[0].tag}</div>

        {rooms.map((room, i) => (
          <div className="rt-tour__copy" key={room.key} ref={(el) => { copyRefs.current[i] = el; }}>
            <span className="rt-tour__copy-eyebrow">{room.tag}</span>
            <h2>{room.title}</h2>
            <p>{room.body}</p>
          </div>
        ))}

        <div className="rt-tour__dots">
          {rooms.map((room, i) => (
            <div className="rt-tour__dot" key={room.key} ref={(el) => { dotRefs.current[i] = el; }} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomTour3D;
