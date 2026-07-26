const fs = require('fs');

const path = 'c:/Pawan Personal/IP/infinity-pillars/apps/web/src/pages/PlaybookExperiment8.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Alignment mode
content = content.replace("engine.setTheme('neonLime');", "engine.setTheme('neonLime');\n    engine.alignmentMode = 'splitRight';");

// 2. Canvas styling
content = content.replace(
  "style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto', display: 'block' }}",
  "style={{ position: 'fixed', zIndex: 0, inset: 0, width: '100vw', height: '100vh', pointerEvents: 'auto', display: 'block' }}"
);

// 3. Remove bigScale start
content = content.replace(
  "gsap.set(h1Ref.current, { scale: bigScale });",
  "gsap.set(h1Ref.current, { scale: restScale });"
);

// 4. Remove h1 scale animation
const scaleAnimRegex = /\s*if \(\!isMobile\) \{\s*tl\.fromTo\(h1Ref\.current,[\s\S]*?0\s*\);\s*\}/g;
content = content.replace(scaleAnimRegex, "");

// 5. Fix onUpdate
content = content.replace(
  /onUpdate\(self\) \{\s*\/\/\s*Progress cue:/,
  "onUpdate(self) {\n              if (engineRef.current) engineRef.current.setScrollProgress(self.progress);\n              // Progress cue:"
);

// 6. Move ParticleCanvas and make transparent
content = content.replace(
  /className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">\s*<Header \/>/,
  "className=\"min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground relative\">\n        <ParticleCanvas ref={engineRef} hoveredService={null} color=\"#AFEA00\" />\n        <Header />"
);
content = content.replace(/backgroundColor: '#000',/g, "backgroundColor: 'transparent',");
content = content.replace(
  /\{\/\* Ambient particle field — idle float, no hover-morph \(hoveredService: null\) \*\/\}\s*<ParticleCanvas ref=\{engineRef\} hoveredService=\{null\} color="#AFEA00" \/>/,
  ""
);

fs.writeFileSync(path, content, 'utf8');
console.log("Update 3 successful");
