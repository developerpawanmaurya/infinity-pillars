import { sampleLogoParticles, LOGO_VIEWBOX } from './svgPaths.js';

export class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Performance & Config parameters (13,000 multi-sized particles)
    this.targetCount = 13000;
    this.scrollProgress = 0; // 0 = fully assembled logo, 1 = fully dispersed
    this.activeThreshold = 1.0; // 1 - scrollProgress
    
    // Customization & Physics Controls
    this.theme = 'neonLime'; // neonLime | cyberCyan | solarFlare | hyperViolet
    this.turbulence = 0.9;
    this.mouseForce = 1.3;
    this.mouseRadius = 160;
    this.particleSpeed = 1.0;
    this.alignmentMode = 'center'; // splitRight | center

    // Mouse state
    this.mouse = { x: -9999, y: -9999, isHover: false };

    // Offscreen particle sprites for zero-lag rendering
    this.sprites = {};
    
    // Data structures
    this.particles = [];
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    // Callbacks for UI metrics
    this.onMetricsUpdate = null;

    // Initialize
    this.initSprites();
    this.handleResize();
    this.createParticles();
    this.bindEvents();
  }

  initSprites() {
    const colors = {
      neonLime: { core: '#ffffff', mid: '#AFEA00', glow: 'rgba(175, 234, 0, 0.45)' },
      cyberCyan: { core: '#ffffff', mid: '#00F0FF', glow: 'rgba(0, 240, 255, 0.45)' },
      solarFlare: { core: '#ffffff', mid: '#FFB800', glow: 'rgba(255, 184, 0, 0.45)' },
      hyperViolet: { core: '#ffffff', mid: '#D946EF', glow: 'rgba(217, 70, 239, 0.45)' }
    };

    Object.keys(colors).forEach(key => {
      const palette = colors[key];
      const size = 20;
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const oCtx = offscreen.getContext('2d');
      
      const rad = size / 2;
      const grad = oCtx.createRadialGradient(rad, rad, 0, rad, rad, rad);
      grad.addColorStop(0, palette.core);
      grad.addColorStop(0.35, palette.mid);
      grad.addColorStop(0.75, palette.glow);
      grad.addColorStop(1, 'transparent');

      oCtx.fillStyle = grad;
      oCtx.beginPath();
      oCtx.arc(rad, rad, rad, 0, Math.PI * 2);
      oCtx.fill();

      this.sprites[key] = offscreen;
    });

    const sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = 24;
    sparkCanvas.height = 24;
    const sCtx = sparkCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(12, 12, 0, 12, 12, 12);
    sGrad.addColorStop(0, '#ffffff');
    sGrad.addColorStop(0.4, '#e6ff80');
    sGrad.addColorStop(1, 'transparent');
    sCtx.fillStyle = sGrad;
    sCtx.beginPath();
    sCtx.arc(12, 12, 12, 0, Math.PI * 2);
    sCtx.fill();
    this.sprites.spark = sparkCanvas;
  }

  handleResize() {
    this.width = this.canvas.parentElement.clientWidth;
    this.height = this.canvas.parentElement.clientHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    const isDesktop = this.width >= 992;
    
    // Scale logo appropriately
    const targetMaxW = isDesktop ? Math.min(this.width * 0.48, 620) : Math.min(this.width * 0.85, 600);
    const targetMaxH = this.height * (isDesktop ? 0.58 : 0.45);

    const scaleX = targetMaxW / LOGO_VIEWBOX.width;
    const scaleY = targetMaxH / LOGO_VIEWBOX.height;
    this.scale = Math.min(scaleX, scaleY) * 2;

    const logoRenderWidth = LOGO_VIEWBOX.width * this.scale;
    const logoRenderHeight = LOGO_VIEWBOX.height * this.scale;

    if (isDesktop && this.alignmentMode === 'splitRight') {
      // Place particle logo in right 50% quadrant of desktop hero
      const rightCenterX = this.width * 0.72;
      this.offsetX = rightCenterX - (logoRenderWidth / 2) - LOGO_VIEWBOX.x * this.scale;
      this.offsetY = (this.height * 0.48) - (logoRenderHeight / 2) - LOGO_VIEWBOX.y * this.scale;
    } else {
      // Center logo on mobile/tablet
      this.offsetX = (this.width - logoRenderWidth) / 2 - LOGO_VIEWBOX.x * this.scale;
      this.offsetY = (this.height * 0.42) - (logoRenderHeight / 2) - LOGO_VIEWBOX.y * this.scale;
    }

    if (this.particles.length > 0) {
      this.particles.forEach(p => {
        p.targetX = p.svgX * this.scale + this.offsetX;
        p.targetY = p.svgY * this.scale + this.offsetY;
      });
    }
  }

  createParticles() {
    const rawSamples = sampleLogoParticles(this.targetCount);
    
    this.particles = rawSamples.map((s, idx) => {
      const targetX = s.svgX * this.scale + this.offsetX;
      const targetY = s.svgY * this.scale + this.offsetY;

      // Multi-tier sizes: 1px, 2px, 3px
      const randVal = Math.random();
      let sizeRadius = 1.0;
      if (randVal < 0.40) sizeRadius = 0.5; // 1px
      else if (randVal < 0.85) sizeRadius = 1.0; // 2px
      else sizeRadius = 1.5; // 3px

      return {
        id: idx,
        svgX: s.svgX,
        svgY: s.svgY,
        targetX,
        targetY,
        x: targetX,
        y: targetY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        pathT: s.pathT,
        pathIndex: s.pathIndex,
        nx: s.nx,
        ny: s.ny,
        isFree: false,
        size: sizeRadius,
        alpha: Math.random() * 0.4 + 0.6,
        phase: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 5.0 + 2.5,
        orbitSpeed: Math.random() * 1.8 + 1.2,
        sparkle: 0,
        densityRank: Math.random() // Used for smooth uniform density reduction
      };
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.mouse.isHover = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.isHover = false;
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
    // Multiply by 1.25 so the entire trace finishes dissolving before the very end of the scroll
    this.activeThreshold = 1.0 - (this.scrollProgress * 1.25);
  }

  setParticleCount(count) {
    this.targetCount = count;
    this.createParticles();
  }

  setTheme(themeName) {
    if (this.sprites[themeName]) {
      this.theme = themeName;
    }
  }

  update(dt = 0.016) {
    const time = performance.now() * 0.001;
    let freeCount = 0;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      const shouldBeFree = this.scrollProgress >= 1.0 ? true : p.pathT > this.activeThreshold;

      if (shouldBeFree && !p.isFree) {
        p.isFree = true;
        const impulse = (Math.random() * 2.8 + 1.8) * this.particleSpeed;
        const dirX = p.nx || (Math.random() - 0.5);
        const dirY = p.ny || (Math.random() - 0.5);
        
        p.vx = dirX * impulse + (Math.random() - 0.5) * 1.8;
        p.vy = dirY * impulse + (Math.random() - 0.5) * 1.8;
        p.sparkle = 1.0;
      } else if (!shouldBeFree && p.isFree) {
        p.isFree = false;
        p.sparkle = 1.0;
      }

      if (p.sparkle > 0) {
        p.sparkle -= dt * 2.5;
        if (p.sparkle < 0) p.sparkle = 0;
      }

      if (p.isFree) {
        freeCount++;

        const nX = Math.sin(time * 1.5 + p.phase) * 0.4 * this.turbulence;
        const nY = Math.cos(time * 1.2 + p.phase) * 0.4 * this.turbulence;

        p.vx += nX * dt * 60;
        p.vy += nY * dt * 60;

        if (this.mouse.isHover) {
          const mDx = p.x - this.mouse.x;
          const mDy = p.y - this.mouse.y;
          const mDist = Math.hypot(mDx, mDy);

          if (mDist < this.mouseRadius && mDist > 0) {
            const force = (1 - mDist / this.mouseRadius) * 4.2 * this.mouseForce;
            p.vx += (mDx / mDist) * force;
            p.vy += (mDy / mDist) * force;
          }
        }

        p.vx *= 0.95;
        p.vy *= 0.95;

        p.x += p.vx * this.particleSpeed;
        p.y += p.vy * this.particleSpeed;

        const pad = 35;
        if (p.x < -pad) p.x = this.width + pad;
        if (p.x > this.width + pad) p.x = -pad;
        if (p.y < -pad) p.y = this.height + pad;
        if (p.y > this.height + pad) p.y = -pad;

      } else {
        // Living Swarm internal bounds motion
        const orbitAngle = time * p.orbitSpeed + p.phase;
        const orbitX = Math.sin(orbitAngle) * p.orbitRadius;
        const orbitY = Math.cos(orbitAngle * 1.3 + p.phase * 0.7) * p.orbitRadius;

        const dynamicTargetX = p.targetX + orbitX;
        const dynamicTargetY = p.targetY + orbitY;

        const dx = dynamicTargetX - p.x;
        const dy = dynamicTargetY - p.y;

        const forceX = dx * 0.08 * this.turbulence;
        const forceY = dy * 0.08 * this.turbulence;
        
        const forceMag = Math.hypot(forceX, forceY);
        // Cap the maximum pulling force for a smooth return (no massive bouncing)
        if (forceMag > 1.5) {
          p.vx += (forceX / forceMag) * 1.5;
          p.vy += (forceY / forceMag) * 1.5;
        } else {
          p.vx += forceX;
          p.vy += forceY;
        }

        if (this.mouse.isHover) {
          const mDx = p.x - this.mouse.x;
          const mDy = p.y - this.mouse.y;
          const mDist = Math.hypot(mDx, mDy);
          if (mDist < 90 && mDist > 0) {
            const push = (1 - mDist / 90) * 8.0 * this.mouseForce;
            p.vx += (mDx / mDist) * push;
            p.vy += (mDy / mDist) * push;
          }
        }

        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;
      }
    }

    if (this.onMetricsUpdate) {
      this.onMetricsUpdate({
        total: this.particles.length,
        locked: this.particles.length - freeCount,
        free: freeCount,
        dissolvePercent: Math.round(this.scrollProgress * 100)
      });
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const sprite = this.sprites[this.theme] || this.sprites.neonLime;
    const sparkSprite = this.sprites.spark;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      let renderSize = p.size * (p.isFree ? 1.25 : 1.0);
      let renderAlpha = p.alpha;

      // Smoothly decrease density uniformly across both lines as we scroll down
      const densityTarget = 1.0 - (this.scrollProgress * 0.75); // Drop to 25% density at max scroll
      if (p.densityRank > densityTarget) {
        const fadeAmount = (p.densityRank - densityTarget) / 0.05;
        renderAlpha *= Math.max(0, 1.0 - fadeAmount);
      }
      
      if (renderAlpha <= 0) continue;

      const drawDim = renderSize * 2.0;
      const halfDim = drawDim / 2;

      this.ctx.globalAlpha = renderAlpha;
      this.ctx.drawImage(sprite, p.x - halfDim, p.y - halfDim, drawDim, drawDim);

      if (p.sparkle > 0) {
        const sDim = drawDim * 1.6;
        this.ctx.globalAlpha = p.sparkle;
        this.ctx.drawImage(sparkSprite, p.x - sDim / 2, p.y - sDim / 2, sDim, sDim);
      }
    }

    this.ctx.globalAlpha = 1.0;
  }
}
