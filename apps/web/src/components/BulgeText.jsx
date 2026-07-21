import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Interactive 3D bulge-text effect (see tympanus.net/Tutorials/3DBulgeTextEffect).
// Text is baked into a canvas texture, then displaced on the Z axis by a
// vertex shader wherever the pointer is nearby, with a lit, lens-like normal
// computed analytically from the displacement so the bulge actually shades
// like a raised surface instead of just a flat texture warp.

const VERTEX_SHADER = /* glsl */ `
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;

    vec2 delta = position.xy - uMouse;
    float dist = length(delta);
    float t = clamp(dist / uRadius, 0.0, 1.0);
    float bump = 1.0 - t * t * (3.0 - 2.0 * t);

    float dBumpDDist = -(6.0 * t * (1.0 - t)) / max(uRadius, 0.0001);
    vec2 dirUnit = dist > 0.0001 ? delta / dist : vec2(0.0);
    vec2 gradWorld = uIntensity * dBumpDDist * dirUnit;

    vec3 pos = position;
    pos.z += uIntensity * bump;

    vNormal = normalize(vec3(-gradWorld.x, -gradWorld.y, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vec4 tex = texture2D(uTexture, vUv);
    if (tex.a < 0.02) discard;

    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vec3(0.35, 0.55, 0.8));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);

    float diff = max(dot(normal, lightDir), 0.0);
    float spec = pow(max(dot(normal, halfDir), 0.0), 50.0);
    float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.5);

    vec3 color = tex.rgb * (0.42 + diff * 0.8) + vec3(1.0) * spec * 1.1 + vec3(0.55, 0.62, 1.0) * rim * 0.4;
    gl_FragColor = vec4(color, tex.a);
  }
`;

const DEFAULT_LINES = [
  { text: '404', weight: 900, sizeRatio: 0.56, tracking: -0.02, marginTop: 0 },
  { text: 'PAGE NOT FOUND', weight: 700, sizeRatio: 0.085, tracking: 0.32, marginTop: 0.06 },
];

function drawTrackedLine(ctx, text, centerX, y, letterSpacingPx) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const totalWidth = widths.reduce((a, b) => a + b, 0) + letterSpacingPx * (text.length - 1);
  let x = centerX - totalWidth / 2;
  [...text].forEach((ch, i) => {
    ctx.fillText(ch, x + widths[i] / 2, y);
    x += widths[i] + letterSpacingPx;
  });
}

async function drawTextTexture(canvas, cssW, cssH, dpr, lines) {
  const w = Math.max(1, Math.round(cssW * dpr));
  const h = Math.max(1, Math.round(cssH * dpr));
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';

  const fontsToLoad = lines.map((l) => `${l.weight} ${Math.round(l.sizeRatio * h)}px "DM Sans"`);
  try {
    await Promise.all(fontsToLoad.map((f) => document.fonts.load(f)));
  } catch {
    // Font API unsupported / load failure — fall back to whatever's cached.
  }

  const totalHeight = lines.reduce((sum, l) => sum + l.sizeRatio * h + l.marginTop * h, 0);
  let y = h / 2 - totalHeight / 2 + (lines[0].sizeRatio * h) / 2;

  lines.forEach((line, i) => {
    if (i > 0) y += line.marginTop * h + (line.sizeRatio * h) / 2 + (lines[i - 1].sizeRatio * h) / 2;
    const fontSize = Math.round(line.sizeRatio * h);
    ctx.font = `${line.weight} ${fontSize}px "DM Sans", sans-serif`;
    drawTrackedLine(ctx, line.text, w / 2, y, fontSize * line.tracking);
  });
}

export default function BulgeText({
  lines = DEFAULT_LINES,
  radius = 130,
  intensity = 46,
  className = '',
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 5000);

    const textCanvas = document.createElement('canvas');
    const texture = new THREE.CanvasTexture(textCanvas);
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const uniforms = {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRadius: { value: radius },
      uIntensity: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
    });

    let mesh = null;

    let target = new THREE.Vector2(0, 0);
    let current = new THREE.Vector2(0, 0);
    let hasPointer = false;
    let rafId;
    let t = 0;

    const rebuild = async () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);

      renderer.setSize(w, h);
      camera.aspect = w / h;
      const fovRad = (camera.fov * Math.PI) / 180;
      const distance = h / 2 / Math.tan(fovRad / 2);
      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      await drawTextTexture(textCanvas, w, h, dpr, lines);
      texture.needsUpdate = true;

      if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
      }
      const segX = Math.min(200, Math.max(24, Math.round(w / 8)));
      const segY = Math.min(120, Math.max(16, Math.round(h / 8)));
      const geometry = new THREE.PlaneGeometry(w, h, segX, segY);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      hasPointer = true;
      target.set(px - rect.width / 2, rect.height / 2 - py);
    };
    const onTouchMove = (e) => {
      if (!e.touches?.length) return;
      onPointerMove(e.touches[0]);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    let ro;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => rebuild());
      ro.observe(container);
    } else {
      window.addEventListener('resize', rebuild);
    }

    rebuild();

    const animate = () => {
      t += 0.016;
      const targetIntensity = intensity;

      if (!hasPointer && !prefersReducedMotion) {
        const rect = container.getBoundingClientRect();
        target.set(Math.sin(t * 0.4) * rect.width * 0.12, Math.cos(t * 0.33) * rect.height * 0.1);
      }

      current.lerp(target, prefersReducedMotion ? 1 : 0.12);
      uniforms.uMouse.value.copy(current);
      uniforms.uIntensity.value += (targetIntensity - uniforms.uIntensity.value) * 0.1;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', rebuild);
      if (mesh) mesh.geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className={className} />;
}
