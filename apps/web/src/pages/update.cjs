const fs = require('fs');
let content = fs.readFileSync('c:/Pawan Personal/IP/infinity-pillars/apps/web/src/pages/PlaybookExperiment8.jsx', 'utf8');

content = content.replace("import { ScrollTrigger } from 'gsap/ScrollTrigger';", "import { ScrollTrigger } from 'gsap/ScrollTrigger';\nimport { ParticleEngine } from '@/components/Particles/particleEngine.js';");

const regexParticleCanvas = /\/\/ ─── Particle constants ─────────[\s\S]*?(?=\/\/ Computes the hero heading's animation geometry)/;
const newParticleCanvas = `// ─── New Particle Canvas Wrapper ────────────────────────────────────────────────
const ParticleCanvas = React.forwardRef(({ hoveredService, color = '#AFEA00' }, ref) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new ParticleEngine(canvasRef.current);
    engine.turbulence = 0.2;
    engine.mouseForce = 3;
    engine.setTheme('neonLime');
    
    if (ref) ref.current = engine;
    
    let lastFrame = performance.now();
    let animationFrameId;
    
    const animationLoop = (now) => {
      const dt = Math.min((now - lastFrame) * 0.001, 0.033);
      lastFrame = now;
      engine.update(dt);
      engine.render();
      animationFrameId = requestAnimationFrame(animationLoop);
    };
    
    animationFrameId = requestAnimationFrame(animationLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [ref]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto', display: 'block' }}
    />
  );
});\n\n`;

content = content.replace(regexParticleCanvas, newParticleCanvas);

content = content.replace("const HomePage = () => {", "const PlaybookExperiment8 = () => {\n  const engineRef = useRef(null);");
content = content.replace("export default HomePage;", "export default PlaybookExperiment8;");

content = content.replace('<ParticleCanvas hoveredService={null} color="#AFEA00" />', '<ParticleCanvas ref={engineRef} hoveredService={null} color="#AFEA00" />');

const targetScrollTrigger = `            refreshPriority: 10,
            onUpdate(self) {
              // Progress cue: lime line fills with scroll, cue fades near the end
              if (cueLineRef.current) cueLineRef.current.style.transform = \`scaleX(\${self.progress})\`;
              if (cueRef.current) {
                cueRef.current.style.opacity = String(Math.max(0, 1 - Math.max(0, (self.progress - 0.72) / 0.22)));
              }`;
const replaceScrollTrigger = `            refreshPriority: 10,
            onUpdate(self) {
              if (engineRef.current) engineRef.current.setScrollProgress(self.progress);
              // Progress cue: lime line fills with scroll, cue fades near the end
              if (cueLineRef.current) cueLineRef.current.style.transform = \`scaleX(\${self.progress})\`;
              if (cueRef.current) {
                cueRef.current.style.opacity = String(Math.max(0, 1 - Math.max(0, (self.progress - 0.72) / 0.22)));
              }`;
content = content.replace(targetScrollTrigger, replaceScrollTrigger);

fs.writeFileSync('c:/Pawan Personal/IP/infinity-pillars/apps/web/src/pages/PlaybookExperiment8.jsx', content, 'utf8');
console.log('Update successful');
