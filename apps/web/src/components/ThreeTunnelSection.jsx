import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// A real WebGL tunnel: a corridor of repeating segments (grid lines on the
// floor/ceiling/two walls, plus randomly-placed image planes on each
// surface) that the camera flies through as the page scrolls. Segments
// that fall behind the camera get recycled — pushed to the far end and
// re-randomized — so the tunnel feels infinite without needing an infinite
// number of objects. The section is much taller than one viewport; the
// canvas itself stays pinned via CSS `position: sticky` while that height
// is scrolled through, which is what actually gives the effect room to play
// out before the page continues normally below.
// Royalty-free "web design / landing page mockup" stock photography
// (Unsplash, free license, no attribution required) — deliberately generic
// screen/UI/workspace imagery rather than hotlinked screenshots of real
// companies' actual landing pages, which would be someone else's
// copyrighted/trademarked design and also unreliable as WebGL textures
// (most sites don't serve images with the CORS headers a canvas needs).
const IMAGES = [
  'https://images.unsplash.com/photo-1750056393306-ac672d0dbb8c', // hands holding laptop, bright screen
  'https://images.unsplash.com/photo-1588912914078-2fe5224fd8b8', // computer screen with a web page
  'https://images.unsplash.com/photo-1637937459053-c788742455be', // computer screen with code
  'https://images.unsplash.com/photo-1530435460869-d13625c69bbf', // screen displaying a website home page
  'https://images.unsplash.com/photo-1658753145551-8f44e5811d21', // graphical user interface, website
  'https://images.unsplash.com/photo-1722159475082-0a2331580de3', // desk with laptop and monitor
];

const TUNNEL_WIDTH   = 520;
const TUNNEL_HEIGHT  = 320;
const SEGMENT_LENGTH = 360;
const SEGMENT_COUNT  = 12;
const TOTAL_SPAN     = SEGMENT_LENGTH * SEGMENT_COUNT;
// How many full tunnel-lengths of travel the whole scrollable section is
// worth — higher = more scrolling before the effect finishes. Was 3;
// reduced along with the section's height below to cut total scroll.
const TRAVEL_LOOPS   = 1.5;
// Dark grid lines instead of lime — lime read as low-contrast/washed-out
// against the new white background.
const GRID_LINE_COLOR = 0x121212;

function buildGridLines(color) {
  const halfW = TUNNEL_WIDTH / 2;
  const halfH = TUNNEL_HEIGHT / 2;
  const step  = 60;
  const points = [];

  // Cross-ties every `step` along the segment, outlining the corridor's
  // rectangular cross-section (floor/ceiling/wall edges) — a simple wire
  // frame rather than a fully shaded tunnel, matching the site's flat
  // graphic language instead of a realistic-lit 3D render.
  for (let z = 0; z <= SEGMENT_LENGTH; z += step) {
    points.push(-halfW, -halfH, -z, halfW, -halfH, -z); // floor edge
    points.push(-halfW, halfH, -z, halfW, halfH, -z);   // ceiling edge
    points.push(-halfW, -halfH, -z, -halfW, halfH, -z); // left wall edge
    points.push(halfW, -halfH, -z, halfW, halfH, -z);   // right wall edge
  }
  // Long rails connecting each corner front-to-back
  const corners = [
    [-halfW, -halfH], [halfW, -halfH], [-halfW, halfH], [halfW, halfH],
  ];
  corners.forEach(([x, y]) => points.push(x, y, 0, x, y, -SEGMENT_LENGTH));

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.35 });
  return new THREE.LineSegments(geometry, material);
}

// One image plane laid flat against a given tunnel surface.
function buildImagePlane(texture, surface) {
  const w = 140 + Math.random() * 80;
  const h = w * 0.65;
  const geometry = new THREE.PlaneGeometry(w, h);
  const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
  const mesh = new THREE.Mesh(geometry, material);

  const halfW = TUNNEL_WIDTH / 2 - 4;
  const halfH = TUNNEL_HEIGHT / 2 - 4;
  const z = -(40 + Math.random() * (SEGMENT_LENGTH - 80));

  if (surface === 'floor') {
    mesh.position.set((Math.random() - 0.5) * (TUNNEL_WIDTH - w), -halfH, z);
    mesh.rotation.x = -Math.PI / 2;
  } else if (surface === 'ceiling') {
    mesh.position.set((Math.random() - 0.5) * (TUNNEL_WIDTH - w), halfH, z);
    mesh.rotation.x = Math.PI / 2;
  } else if (surface === 'left') {
    mesh.position.set(-halfW, (Math.random() - 0.5) * (TUNNEL_HEIGHT - h), z);
    mesh.rotation.y = Math.PI / 2;
  } else {
    mesh.position.set(halfW, (Math.random() - 0.5) * (TUNNEL_HEIGHT - h), z);
    mesh.rotation.y = -Math.PI / 2;
  }
  return mesh;
}

function populateSegment(group, textures) {
  // Clear any previously-attached image planes (kept the grid lines, which
  // are the group's first child) before re-randomizing on recycle.
  for (let i = group.children.length - 1; i >= 1; i--) {
    const child = group.children[i];
    group.remove(child);
    child.geometry.dispose();
    child.material.dispose();
  }

  const surfaces = ['floor', 'ceiling', 'left', 'right'];
  surfaces.forEach((surface) => {
    if (Math.random() > 0.55) return; // sparse, not every surface every segment
    const texture = textures[(Math.random() * textures.length) | 0];
    group.add(buildImagePlane(texture, surface));
  });
}

const ThreeTunnelSection = () => {
  const wrapperRef = useRef(null);
  const canvasRef  = useRef(null);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const scene    = new THREE.Scene();
    scene.fog      = new THREE.FogExp2(0xffffff, 0.0014);
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(70, 1, 0.1, 3000);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const segments = [];
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const group = new THREE.Group();
      group.position.z = -i * SEGMENT_LENGTH;
      group.add(buildGridLines(GRID_LINE_COLOR));
      segments.push(group);
      scene.add(group);
    }

    let texturesReady = false;
    let textures = [];
    const loader = new THREE.TextureLoader();
    Promise.all(IMAGES.map((src) => new Promise((resolve) => {
      loader.load(src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      }, undefined, () => resolve(null));
    }))).then((loaded) => {
      textures = loaded.filter(Boolean);
      if (!textures.length) return;
      segments.forEach((group) => populateSegment(group, textures));
      texturesReady = true;
    });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();

    let targetZ = 0;
    const updateTargetFromScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      const progress = scrollable > 0
        ? Math.min(1, Math.max(0, -rect.top / scrollable))
        : 0;
      targetZ = -progress * TOTAL_SPAN * TRAVEL_LOOPS;
    };

    const onScroll = () => updateTargetFromScroll();
    const onResize = () => { resize(); updateTargetFromScroll(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    updateTargetFromScroll();

    let rafId;
    const animate = () => {
      camera.position.z += (targetZ - camera.position.z) * 0.08;

      if (texturesReady) {
        segments.forEach((group) => {
          // Forward scroll: segment fell behind the camera — recycle it to
          // the far front so it's ready again next time around.
          if (group.position.z > camera.position.z + SEGMENT_LENGTH) {
            group.position.z -= TOTAL_SPAN;
            populateSegment(group, textures);
          // Backward scroll: this only handled the forward direction before
          // — segments pushed far ahead during forward scrolling never came
          // back when reversing, so scrolling back could leave a stretch of
          // camera travel with no segments nearby to render (the reported
          // blank white section). Symmetric case: once a segment is more
          // than one tunnel-length AHEAD of the camera, pull it back behind
          // instead, so recycling works the same going either way.
          } else if (group.position.z < camera.position.z - TOTAL_SPAN) {
            group.position.z += TOTAL_SPAN;
            populateSegment(group, textures);
          }
        });
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      segments.forEach((group) => {
        group.children.forEach((child) => {
          child.geometry?.dispose();
          child.material?.dispose();
        });
      });
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{ height: '300vh' }}
      aria-label="Scrolling 3D image tunnel"
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>
    </section>
  );
};

export default ThreeTunnelSection;
