import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import gsap from 'gsap';
import './Sample12.css';

// Ported from mohAmineBrs' Codrops demo "Model Texture Transition And
// Procedural Radial Noise Using WebGL" (MIT licensed,
// tympanus.net/Development/TextureTransition/): a soda-can model whose
// body material gets a GLSL band injected via onBeforeCompile — a noisy,
// vertically-sweeping wipe (Perlin-noise-warped smoothstep) that cross-
// fades its texture tint between four accent colors on click — while a
// full-screen background plane runs an independent radial noise field
// (the same Perlin function, masked by two expanding/contracting circles)
// that pulses outward from the center on the same click. Source is React
// Three Fiber + drei's PresentationControls + zustand + framer-motion;
// this is an independent vanilla Three.js implementation (matching this
// project's other WebGL samples, e.g. Sample 6) — no component source
// copied, but the GLSL shader bodies (noise function, mask/parabola math,
// uniform names/defaults) and the model's group rotation/position values
// are reused directly since they're functional, not creative, code, and
// the demo's own MIT license covers them. Drag-to-tilt with a spring
// return approximates drei's PresentationControls (not pulled in as a
// dependency). Can model: "Energy Drink Game Ready Model" by dwalsh
// (Sketchfab, CC BY 4.0) — credited below. Environment map: Poly Haven's
// "Potsdamer Platz" HDRI (CC0), bundled with the source repo. Panton, the
// source's own Typekit trial font, isn't ours to redistribute — Jost
// (Google Fonts, OFL) substitutes as a similarly geometric sans. Frame/
// heading copy below is our own writing, not the source's own.
const MODEL_URL = '/models/noise-transition/energy-can.glb';
const ENV_MAP_URL = '/textures/noise-transition/potsdamer_platz_0.256k.hdr';
const COLORS = [0x8c75ff, 0x5cffab, 0xf74a8a, 0x3df2f2];

// Classic Perlin 3D/4D noise by Stefan Gustavson (public-domain research
// code; also the exact function the source demo itself ships under MIT).
const NOISE_GLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec4 P){
  vec4 Pi0 = floor(P);
  vec4 Pi1 = Pi0 + 1.0;
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec4 Pf0 = fract(P);
  vec4 Pf1 = Pf0 - 1.0;
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = vec4(Pi0.zzzz);
  vec4 iz1 = vec4(Pi1.zzzz);
  vec4 iw0 = vec4(Pi0.wwww);
  vec4 iw1 = vec4(Pi1.wwww);

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 ixy00 = permute(ixy0 + iw0);
  vec4 ixy01 = permute(ixy0 + iw1);
  vec4 ixy10 = permute(ixy1 + iw0);
  vec4 ixy11 = permute(ixy1 + iw1);

  vec4 gx00 = ixy00 / 7.0;
  vec4 gy00 = floor(gx00) / 7.0;
  vec4 gz00 = floor(gy00) / 6.0;
  gx00 = fract(gx00) - 0.5;
  gy00 = fract(gy00) - 0.5;
  gz00 = fract(gz00) - 0.5;
  vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
  vec4 sw00 = step(gw00, vec4(0.0));
  gx00 -= sw00 * (step(0.0, gx00) - 0.5);
  gy00 -= sw00 * (step(0.0, gy00) - 0.5);

  vec4 gx01 = ixy01 / 7.0;
  vec4 gy01 = floor(gx01) / 7.0;
  vec4 gz01 = floor(gy01) / 6.0;
  gx01 = fract(gx01) - 0.5;
  gy01 = fract(gy01) - 0.5;
  gz01 = fract(gz01) - 0.5;
  vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
  vec4 sw01 = step(gw01, vec4(0.0));
  gx01 -= sw01 * (step(0.0, gx01) - 0.5);
  gy01 -= sw01 * (step(0.0, gy01) - 0.5);

  vec4 gx10 = ixy10 / 7.0;
  vec4 gy10 = floor(gx10) / 7.0;
  vec4 gz10 = floor(gy10) / 6.0;
  gx10 = fract(gx10) - 0.5;
  gy10 = fract(gy10) - 0.5;
  gz10 = fract(gz10) - 0.5;
  vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
  vec4 sw10 = step(gw10, vec4(0.0));
  gx10 -= sw10 * (step(0.0, gx10) - 0.5);
  gy10 -= sw10 * (step(0.0, gy10) - 0.5);

  vec4 gx11 = ixy11 / 7.0;
  vec4 gy11 = floor(gx11) / 7.0;
  vec4 gz11 = floor(gy11) / 6.0;
  gx11 = fract(gx11) - 0.5;
  gy11 = fract(gy11) - 0.5;
  gz11 = fract(gz11) - 0.5;
  vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
  vec4 sw11 = step(gw11, vec4(0.0));
  gx11 -= sw11 * (step(0.0, gx11) - 0.5);
  gy11 -= sw11 * (step(0.0, gy11) - 0.5);

  vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
  vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
  vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
  vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
  vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
  vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
  vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
  vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
  vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
  vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
  vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
  vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
  vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
  vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
  vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
  vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

  vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
  g0000 *= norm00.x;
  g0100 *= norm00.y;
  g1000 *= norm00.z;
  g1100 *= norm00.w;

  vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
  g0001 *= norm01.x;
  g0101 *= norm01.y;
  g1001 *= norm01.z;
  g1101 *= norm01.w;

  vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
  g0010 *= norm10.x;
  g0110 *= norm10.y;
  g1010 *= norm10.z;
  g1110 *= norm10.w;

  vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
  g0011 *= norm11.x;
  g0111 *= norm11.y;
  g1011 *= norm11.z;
  g1111 *= norm11.w;

  float n0000 = dot(g0000, Pf0);
  float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
  float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
  float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
  float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
  float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
  float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
  float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
  float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
  float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
  float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
  float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
  float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
  float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
  float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
  float n1111 = dot(g1111, Pf1);

  vec4 fade_xyzw = fade(Pf0);
  vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
  vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
  vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
  vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
  float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
  return 2.2 * n_xyzw;
}
`;

const BACKGROUND_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BACKGROUND_FRAGMENT = `
  uniform float u_time;
  uniform float u_progress;
  uniform float u_aspect;
  uniform vec3 u_color;
  varying vec2 vUv;
  #define PI 3.14159265
  ${NOISE_GLSL}
  void main() {
    vec2 newUv = (vUv - vec2(0.5)) * vec2(u_aspect, 1.);
    float dist = length(newUv);
    float density = 1.8 - dist;
    float noise = cnoise(vec4(newUv * 40. * density, u_time, 1.));
    float grain = (fract(sin(dot(vUv, vec2(12.9898, 78.233) * 2000.0)) * 43758.5453));
    float facets = noise * 2.;
    float dots = smoothstep(0.1, 0.15, noise);
    float n = facets * dots;
    n = step(.2, facets) * dots;
    n = 1. - n;
    float radius = 1.5;
    float outerProgress = clamp(1.1 * u_progress, 0., 1.);
    float innerProgress = clamp(1.1 * u_progress - 0.05, 0., 1.);
    float innerCircle = 1. - smoothstep((innerProgress - 0.4) * radius, innerProgress * radius, dist);
    float outerCircle = 1. - smoothstep((outerProgress - 0.1) * radius, innerProgress * radius, dist);
    float displacement = outerCircle - innerCircle;
    float grainStrength = 0.3;
    vec3 final = vec3(displacement - (n + noise)) - vec3(grain * grainStrength);
    gl_FragColor = vec4(final, 1.0);
    gl_FragColor.rgb *= u_color * 2.;
    #include <colorspace_fragment>
  }
`;

function buildBackgroundMesh(width, height) {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0 },
      u_progress: { value: 0 },
      u_aspect: { value: width / height },
      u_color: { value: new THREE.Color(COLORS[0]) },
    },
    vertexShader: BACKGROUND_VERTEX,
    fragmentShader: BACKGROUND_FRAGMENT,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  return mesh;
}

function injectBodyShader(material, uniforms) {
  material.metalness = 0;
  material.roughness = 1;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vUv;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvUv = uv;');

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float u_time;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform float u_progress;
        uniform float u_width;
        uniform float u_scaleX;
        uniform float u_scaleY;
        uniform vec2 u_textureSize;
        varying vec2 vUv;
        ${NOISE_GLSL}
        float parabola(float x, float k) { return pow(4. * x * (1. - x), k); }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float dt = parabola(u_progress, 1.);
        float border = 1.;
        float noise = 0.5 * (cnoise(vec4(vUv.x * u_scaleX + 0.5 * u_time / 3., vUv.y * u_scaleY, 0.5 * u_time / 3., 0.)) + 1.);
        float w = u_width * dt;
        float maskValue = smoothstep(1. - w, 1., vUv.y + mix(-w / 2., 1. - w / 2., u_progress));
        maskValue += maskValue * noise;
        float mask = smoothstep(border, border + 0.01, maskValue);
        diffuseColor.rgb += mix(u_color1, u_color2, mask);`,
      );
  };
}

const Sample12Page = () => {
  const mountRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const mount = mountRef.current;
    if (!canvas || !mount) return undefined;

    let cancelled = false;
    let rafId;
    let loadedModel = null;
    let bgMesh = null;
    let bgTexture = null;
    let onResize;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Group the pointer-drag rotates (springs back to rest on release) —
    // a hand-rolled stand-in for drei's <PresentationControls>, which
    // isn't pulled in as a dependency here.
    const dragGroup = new THREE.Group();
    scene.add(dragGroup);

    const bgWidthHeightAt = (distance) => {
      const vFov = (camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFov / 2) * distance;
      const width = height * camera.aspect;
      return { width, height };
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);

      if (bgMesh) {
        const { width, height } = bgWidthHeightAt(camera.position.z);
        bgMesh.geometry.dispose();
        bgMesh.geometry = new THREE.PlaneGeometry(width, height);
        bgMesh.material.uniforms.u_aspect.value = width / height;
      }
    };

    // Background plane sits at world z=0; the camera never moves, so its
    // frustum size there is constant except on resize.
    const initialSize = bgWidthHeightAt(camera.position.z);
    bgMesh = buildBackgroundMesh(initialSize.width, initialSize.height);
    scene.add(bgMesh);

    new RGBELoader().load(ENV_MAP_URL, (texture) => {
      if (cancelled) return;
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      bgTexture = texture;
    });

    let colorIndex = 0;
    let playing = true;
    const modelUniforms = {
      u_time: { value: 0 },
      u_color1: { value: new THREE.Color(COLORS[0]) },
      u_color2: { value: new THREE.Color(COLORS[0]) },
      u_progress: { value: 0.5 },
      u_width: { value: 0.8 },
      u_scaleX: { value: 50 },
      u_scaleY: { value: 50 },
      u_textureSize: { value: new THREE.Vector2(1, 1) },
    };

    const loader = new GLTFLoader();
    loader.load(MODEL_URL, (gltf) => {
      if (cancelled) return;

      const bodyNode = gltf.scene.getObjectByName('LowRes_Can_Body_0');
      const alumNode = gltf.scene.getObjectByName('LowRes_Can_Alluminium_0');
      if (!bodyNode || !alumNode) return;

      const bodyMap = bodyNode.material.map;
      if (bodyMap?.image) {
        modelUniforms.u_textureSize.value.set(bodyMap.image.width, bodyMap.image.height);
      }
      injectBodyShader(bodyNode.material, modelUniforms);

      const bodyMesh = new THREE.Mesh(bodyNode.geometry, bodyNode.material);
      const alumMesh = new THREE.Mesh(alumNode.geometry, alumNode.material);

      const subGroup = new THREE.Group();
      subGroup.rotation.set(-Math.PI / 2, 0, 0);
      subGroup.add(bodyMesh, alumMesh);

      const modelGroup = new THREE.Group();
      modelGroup.rotation.set(-Math.PI / 2, 1.7, Math.PI / 2);
      modelGroup.position.set(0, 0, 5);
      modelGroup.add(subGroup);

      dragGroup.add(modelGroup);
      loadedModel = modelGroup;
      setIsLoading(false);
    });

    // --- Pointer drag: tilt on X/Y clamped to +-45 deg, spring back on release ---
    let dragging = false;
    let dragged = false;
    let lastX = 0;
    let lastY = 0;
    const LIMIT = Math.PI / 4;

    const clamp = (v) => Math.max(-LIMIT, Math.min(LIMIT, v));

    const advance = () => {
      if (!playing) return;
      playing = false;

      const nextColor = new THREE.Color(COLORS[(colorIndex + 1) % COLORS.length]);

      gsap.killTweensOf(bgMesh.material.uniforms.u_progress);
      bgMesh.material.uniforms.u_color.value = nextColor;
      bgMesh.material.uniforms.u_progress.value = 0;
      gsap.to(bgMesh.material.uniforms.u_progress, { value: 1, duration: 2, ease: 'power2.out' });

      modelUniforms.u_color2.value = nextColor;
      gsap.to(modelUniforms.u_progress, {
        value: 1,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          colorIndex = (colorIndex + 1) % COLORS.length;
          modelUniforms.u_color1.value = nextColor;
          modelUniforms.u_progress.value = 0.5;
          playing = true;
        },
      });
    };

    const onPointerDown = (e) => {
      dragging = true;
      dragged = false;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 4) dragged = true;
      lastX = e.clientX;
      lastY = e.clientY;
      dragGroup.rotation.y = clamp(dragGroup.rotation.y + dx * 0.005);
      dragGroup.rotation.x = clamp(dragGroup.rotation.x + dy * 0.005);
    };

    const onPointerUp = (e) => {
      dragging = false;
      canvas.releasePointerCapture(e.pointerId);
      gsap.to(dragGroup.rotation, { x: 0, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.65)' });
      if (!dragged) advance();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);

    resize();
    onResize = resize;
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    const animate = () => {
      const time = clock.getElapsedTime();
      bgMesh.material.uniforms.u_time.value = time;
      modelUniforms.u_time.value = time;
      if (loadedModel) {
        loadedModel.position.y = Math.sin(time) * 0.12;
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      gsap.killTweensOf(modelUniforms.u_progress);
      gsap.killTweensOf(dragGroup.rotation);
      if (bgMesh) {
        gsap.killTweensOf(bgMesh.material.uniforms.u_progress);
        bgMesh.geometry.dispose();
        bgMesh.material.dispose();
      }
      bgTexture?.dispose();
      loadedModel?.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="sample12-page" ref={mountRef}>
      <Helmet>
        <title>Sample 12 — Model Texture Transition &amp; Radial Noise | Infinity Pillars</title>
      </Helmet>

      <canvas className="sample12-canvas" ref={canvasRef} />

      <div className={`sample12-loading${isLoading ? '' : ' is-hidden'}`}>Loading</div>

      <div className="sample12-frame">
        <div className="sample12-frame__header">
          <Link to="/" className="sample12-page__back">&larr; Back</Link>
          <h1 className="sample12-frame__title">Texture transition &amp; procedural radial noise</h1>
        </div>
        <div className="sample12-frame__footer">
          <span className="sample12-hint">Drag to tilt &bull; Click to change color</span>
          <a
            className="sample12-credit"
            href="https://sketchfab.com/3d-models/energy-drink-game-ready-model-83676feb8b0a4589952cf3676299311b"
            target="_blank"
            rel="noopener noreferrer"
          >
            Can model by dwalsh, CC BY 4.0
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sample12Page;
