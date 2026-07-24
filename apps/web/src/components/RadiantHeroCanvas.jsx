import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Ambient WebGL hero backdrop: a noise-displaced icosahedron rendered with a
// custom GLSL shader (fresnel rim + two-tone fill), slowly rotating and
// nudged by cursor position. Raw `three` + hand-rolled shaders, same
// approach as ThreeTunnelSection.jsx, rather than a react-three-fiber
// dependency this codebase doesn't otherwise use.

// Ashima Arts / Stefan Gustavson simplex noise (MIT licensed, the standard
// public-domain-equivalent GLSL noise utility — not project-specific code).
const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

const VERTEX_SHADER = `
${NOISE_GLSL}
uniform float uTime;
uniform float uAmp;
varying float vDisp;
varying vec3 vNormal;
varying vec3 vViewPos;

void main() {
  float n = snoise(position * 0.011 + vec3(0.0, 0.0, uTime * 0.12));
  float disp = n * uAmp;
  vec3 displaced = position + normal * disp;
  vDisp = n;
  vNormal = normalize(normalMatrix * normal);
  vec4 viewPos = modelViewMatrix * vec4(displaced, 1.0);
  vViewPos = -viewPos.xyz;
  gl_Position = projectionMatrix * viewPos;
}
`;

const FRAGMENT_SHADER = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uRim;
varying float vDisp;
varying vec3 vNormal;
varying vec3 vViewPos;

void main() {
  vec3 viewDir = normalize(vViewPos);
  float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.4);
  vec3 base = mix(uColorA, uColorB, clamp(vDisp * 0.5 + 0.5, 0.0, 1.0));
  vec3 color = base + uRim * fresnel;
  gl_FragColor = vec4(color, 1.0);
}
`;

const RadiantHeroCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.IcosahedronGeometry(2.1, 24);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.22 },
        uColorA: { value: new THREE.Color('#141215') },
        uColorB: { value: new THREE.Color('#3a1c12') },
        uRim: { value: new THREE.Color('#ff5d3a') },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    resize();

    let mx = 0, my = 0, tx = 0, ty = 0;
    const onPointerMove = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', resize);

    let isVisible = true;
    const onVisibility = () => { isVisible = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVisibility);

    let rafId;
    let t = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      if (!prefersReducedMotion) {
        t += 0.01;
        material.uniforms.uTime.value = t;
        tx += (mx - tx) * 0.04;
        ty += (my - ty) * 0.04;
        mesh.rotation.y = t * 0.15 + tx * 0.4;
        mesh.rotation.x = t * 0.08 + ty * 0.3;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="rdt-hero__canvas" aria-hidden="true" />;
};

export default RadiantHeroCanvas;
