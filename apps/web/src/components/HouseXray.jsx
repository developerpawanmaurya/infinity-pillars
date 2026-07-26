import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import './HouseXray.css';

// A cursor-driven square lens trails the mouse over the villa photo,
// clip-revealing a live-rendered 3D structural skeleton underneath —
// same interaction as the old CSS edge-detect "blueprint" lens this
// replaces, but the reveal layer is now an actual matching 3D frame
// (columns, floor/roof slabs, canopy, glazing) instead of a filtered copy
// of the photo. The skeleton's proportions and camera were hand-tuned
// against this specific photo (public/images/meridian-xray/villa-front.jpg)
// so a column in the photo has a column directly behind it in the reveal.
//
// Model geometry ported from the "House structural wireframe" concept
// export (public/models/apartment/House structural wireframe/
// skeleton-model.js) — same box-per-member approach, adapted to build
// directly into a plain three.js scene instead of that export's
// custom-element viewer shell.

// Camera solved directly from pixel measurements of the actual photo (not
// eyeballed): cropped the photo to a 0-100% grid, read off the normalized
// screen position of the parapet top (y=7.4, ny=0.256) and the ground line
// (y=0, ny=0.547) — both on the front facade, same depth — then solved the
// two-unknown system (camera height, FOV*distance product) those two
// points imply for a level perspective camera. Cross-checked against two
// more measured points (balcony rail, canopy beam) it wasn't fit to; both
// landed within ~1% of predicted, so the fit is trustworthy. The X-axis
// scale constants below came from the same grid: the model's original
// invented column spacing (±9 / ±4.4 world units) didn't match the real
// photo's measured column positions (±6.5 / ±3.7), so those are corrected
// via OUTER_SCALE/INNER_SCALE rather than by nudging the camera — a camera
// can't fix wrong geometry proportions, only reproduce them faithfully.
const CAMERA = {
  fov: 42,
  position: [0, 1.2, 37.6],
  lookAt: [0, 1.2, 0],
};

// Applied to the model's original outer-tower anchors (9, 5.4, 8.1, 7.4,
// 19.5, 15.7, 13, 0.9) and inner/center-bay anchors (4.4, 1.5) respectively.
const OUTER_SCALE = 6.513 / 9;
const INNER_SCALE = 3.722 / 4.4;

function buildSkeleton(THREE_) {
  const M = (c, o = {}) => new THREE_.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.85, metalness: 0.05 }, o));
  const mats = {
    concrete: M(0xaab3bc), slab: M(0x8d97a2),
    steel: M(0x2e353d, { roughness: 0.5, metalness: 0.3 }),
    wood: M(0x8a5a33), glass: M(0xbfe0ec, { transparent: true, opacity: 0.35, roughness: 0.15 }),
    stone: M(0xc9895f), paving: M(0xd8cfbc),
    water: M(0x46b8dc, { transparent: true, opacity: 0.75, roughness: 0.1 }),
  };
  const g = new THREE_.Group();
  let n = 0;
  const box = (mat, w, h, d, x, y, z) => {
    const m = new THREE_.Mesh(new THREE_.BoxGeometry(w, h, d), mats[mat]);
    m.name = mat + '_' + (n += 1); m.position.set(x, y, z); g.add(m); return m;
  };
  const beamX = (mat, x1, x2, y, z, s = 0.28, sy) => box(mat, Math.abs(x2 - x1), sy || s, s, (x1 + x2) / 2, y, z);
  const beamZ = (mat, z1, z2, y, x, s = 0.28, sy) => box(mat, s, sy || s, Math.abs(z2 - z1), x, y, (z1 + z2) / 2);
  const col = (mat, x, z, y1, y2, s = 0.32) => box(mat, s, y2 - y1, s, x, (y1 + y2) / 2, z);

  const OUTER_X = 9 * OUTER_SCALE;
  const MID_X = 4.4 * INNER_SCALE;
  const INNER_X = 1.5 * INNER_SCALE;
  const CANOPY_HALF = 5.4 * OUTER_SCALE;
  const POOL_HALF_X = 8.1 * OUTER_SCALE;
  const PLANTER_X = 7.4 * OUTER_SCALE;
  const TERRACE_W = 19.5 * OUTER_SCALE;
  const POOL_WATER_W = 15.7 * OUTER_SCALE;
  const STEP_BASE_W = 13 * OUTER_SCALE;
  const STEP_INC = 0.9 * OUTER_SCALE;
  const CENTER_GLAZING_W = 2 * MID_X - 0.2;

  for (const sx of [-1, 1]) {
    for (const [x, z] of [[OUTER_X, 4.5], [MID_X, 4.5], [OUTER_X, -4.5], [MID_X, -4.5]]) col('concrete', sx * x, z, 0, 7.4);
    for (const [x, z] of [[INNER_X, 3.2], [INNER_X, -4.5]]) col('concrete', sx * x, z, 0, 6.6);
  }
  for (const y of [3.3, 6.6]) {
    for (const sx of [-1, 1]) {
      beamX('slab', sx * MID_X, sx * OUTER_X, y, 4.5);
      beamZ('slab', 3.2, 4.5, y, sx * MID_X);
    }
    beamX('slab', -MID_X, MID_X, y, 3.2);
    beamX('slab', -OUTER_X, OUTER_X, y, -4.5);
    for (const x of [-OUTER_X, -MID_X, MID_X, OUTER_X]) beamZ('slab', -4.5, 4.5, y, x);
    for (const x of [-INNER_X, INNER_X]) beamZ('slab', -4.5, 3.2, y, x);
    for (let x = -OUTER_X + 0.7; x < OUTER_X - 0.6; x += 1.15 * OUTER_SCALE) {
      if ([-OUTER_X, -MID_X, -INNER_X, INNER_X, MID_X, OUTER_X].some((c) => Math.abs(c - x) < 0.45)) continue;
      beamZ('slab', -4.5, Math.abs(x) > MID_X ? 4.5 : 3.2, y, x, 0.14, 0.22);
    }
  }
  for (const sx of [-1, 1]) {
    const x1 = sx * MID_X; const x2 = sx * OUTER_X; const lo = Math.min(x1, x2); const hi = Math.max(x1, x2);
    beamX('concrete', x1, x2, 7.4, 4.5, 0.3); beamX('concrete', x1, x2, 7.4, -4.5, 0.3);
    beamZ('concrete', -4.5, 4.5, 7.4, x1, 0.3); beamZ('concrete', -4.5, 4.5, 7.4, x2, 0.3);
    for (let x = lo + 0.5; x < hi - 0.3; x += 0.45) beamZ('wood', -4.4, 4.4, 7.05, x, 0.09, 0.16);
    beamX('steel', x1, x2, 4.38, 4.62, 0.07);
    box('glass', Math.abs(x2 - x1) - 0.2, 1.0, 0.05, (x1 + x2) / 2, 3.88, 4.62);
  }
  beamX('steel', -CANOPY_HALF, CANOPY_HALF, 3.55, 4.25, 0.25, 0.5);
  for (let x = -CANOPY_HALF + 0.4; x < CANOPY_HALF - 0.3; x += 1.25 * OUTER_SCALE) beamZ('steel', 3.2, 4.25, 3.5, x, 0.16);
  box('glass', CENTER_GLAZING_W, 3.0, 0.06, 0, 1.62, 3.2);
  box('glass', CENTER_GLAZING_W, 2.9, 0.06, 0, 4.95, 3.2);
  box('paving', TERRACE_W, 0.12, 9.8, 0, -0.06, 0.2);
  for (let i = 0; i < 4; i += 1) box('paving', STEP_BASE_W + i * STEP_INC, 0.16, 0.55, 0, -0.2 - 0.16 * i, 5.3 + 0.55 * i);
  for (const sx of [-1, 1]) box('stone', 3.4 * OUTER_SCALE, 0.8, 1.6, sx * PLANTER_X, -0.4, 5.9);
  const py = -0.68;
  beamX('paving', -POOL_HALF_X, POOL_HALF_X, py, 7.4, 0.25); beamX('paving', -POOL_HALF_X, POOL_HALF_X, py, 13.8, 0.25);
  beamZ('paving', 7.4, 13.8, py, -POOL_HALF_X + 0.1, 0.25); beamZ('paving', 7.4, 13.8, py, POOL_HALF_X - 0.1, 0.25);
  box('water', POOL_WATER_W, 0.1, 6.3, 0, py - 0.12, 10.6);

  return g;
}

const HouseXray = ({ photoSrc, photoAlt, debug = false }) => {
  const containerRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const canvasRef = useRef(null);
  const lensRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const scene = new THREE.Scene();
    // Debug mode renders transparent so the skeleton can be checked directly
    // against the photo underneath (calibration only — production always
    // shows the skeleton opaque, replacing the photo within the lens).
    scene.background = debug ? null : new THREE.Color(0x14110d);

    const camera = new THREE.PerspectiveCamera(CAMERA.fov, 1, 0.1, 200);
    camera.position.set(...CAMERA.position);
    camera.lookAt(new THREE.Vector3(...CAMERA.lookAt));

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: debug });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d2c4, 1.0));
    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(4, 7, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xfff4e6, 0.5);
    fill.position.set(-5, 3, -4);
    scene.add(fill);

    const model = buildSkeleton(THREE);
    scene.add(model);

    const applySize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      renderer.render(scene, camera);
    };
    applySize();

    const ro = new ResizeObserver(applySize);
    ro.observe(container);

    // ---------- Cursor-driven lens (mirrors the old xray interaction) ----------
    let active = false;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    const skeletonLayer = canvasWrapRef.current;
    const lens = lensRef.current;
    const HALF = window.innerWidth < 768 ? 75 : 130;
    if (skeletonLayer) {
      skeletonLayer.style.clipPath = debug ? 'none' : 'polygon(0 0, 0 0, 0 0, 0 0)';
    }
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const onEnter = () => { active = true; };
    const onLeave = () => { active = false; };
    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);
    const tick = () => {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      if (!debug && skeletonLayer) {
        const half = active ? HALF : 0;
        skeletonLayer.style.clipPath = `polygon(${tx - half}px ${ty - half}px, ${tx + half}px ${ty - half}px, ${tx + half}px ${ty + half}px, ${tx - half}px ${ty + half}px)`;
      }
      if (lens) gsap.set(lens, { x: tx, y: ty, opacity: debug ? 0 : (active ? 1 : 0) });
    };
    gsap.ticker.add(tick);

    return () => {
      ro.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      gsap.ticker.remove(tick);
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, [debug]);

  return (
    <div className="hxr" ref={containerRef}>
      <img className="hxr__photo" src={photoSrc} alt={photoAlt} />
      <div className="hxr__skeleton" ref={canvasWrapRef}>
        <canvas ref={canvasRef} />
      </div>
      <div className="hxr__lens" ref={lensRef} />
      {!debug && <div className="hxr__hint">Move your cursor over the photograph</div>}
    </div>
  );
};

export default HouseXray;
