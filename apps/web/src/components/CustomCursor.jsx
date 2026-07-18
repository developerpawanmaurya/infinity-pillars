import React, { useEffect, useRef, useState, useCallback } from 'react';

const HOVER_SEL       = 'a, button, [role="button"], h1, h2, h3, h4, h5';
const INTERACTIVE_SEL = 'a, button, input, textarea, select, label, [role="button"], [tabindex]:not([tabindex="-1"])';

// Subtle but visible paint splatter
const PARTICLES = [
  { angle: -15,  dist: 44,  size: 5  },
  { angle: 30,   dist: 34,  size: 4  },
  { angle: 62,   dist: 50,  size: 6  },
  { angle: 95,   dist: 38,  size: 4  },
  { angle: 130,  dist: 46,  size: 5  },
  { angle: 170,  dist: 32,  size: 4  },
  { angle: 210,  dist: 48,  size: 6  },
  { angle: 255,  dist: 36,  size: 4  },
  { angle: 300,  dist: 42,  size: 5  },
];

let splashId = 0;

const SplashEffect = ({ x, y, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 560);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ position: 'fixed', left: x, top: y, pointerEvents: 'none', zIndex: 9999990 }}>
      <div style={{
        position: 'absolute',
        width: '14px', height: '14px',
        backgroundColor: '#AFEA00',
        borderRadius: '50%',
        animation: 'splashCenter 0.45s ease-out forwards',
      }} />
      {PARTICLES.map((p, i) => {
        const rad = p.angle * Math.PI / 180;
        const delay = (i % 3) * 0.02;
        return (
          <div key={i} style={{
            position: 'absolute',
            width: `${p.size}px`, height: `${p.size}px`,
            marginLeft: `${-p.size / 2}px`, marginTop: `${-p.size / 2}px`,
            backgroundColor: '#AFEA00',
            borderRadius: '50%',
            '--dx': `${Math.cos(rad) * p.dist}px`,
            '--dy': `${Math.sin(rad) * p.dist}px`,
            animation: `splashParticle 0.52s cubic-bezier(0.15,0,0.85,1) ${delay}s both`,
          }} />
        );
      })}
    </div>
  );
};

const CustomCursor = () => {
  const dotWrapRef   = useRef(null);
  const ringWrapRef  = useRef(null);
  const crossRef     = useRef(null);
  const gameModeRef  = useRef(false); // tracks game mode inside event handlers

  const [visible,  setVisible]  = useState(false);
  const [hovering, setHovering] = useState(false);
  const [gameMode, setGameMode] = useState(false);
  const [splashes, setSplashes] = useState([]);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let mX = 0, mY = 0, rX = 0, rY = 0, rafId;
    let _vis = false, _hov = false;
    const lerp = (a, b, t) => a + (b - a) * t;

    const onMove = (e) => {
      mX = e.clientX; mY = e.clientY;
      if (!_vis) { _vis = true; setVisible(true); }
    };
    const onOver = (e) => {
      const inGame = !!e.target.closest('[data-game-section]');
      if (inGame !== gameModeRef.current) {
        gameModeRef.current = inGame;
        setGameMode(inGame);
      }
      if (!_hov && !inGame && e.target.closest(HOVER_SEL)) { _hov = true; setHovering(true); }
    };
    const onOut = (e) => {
      if (_hov && !e.relatedTarget?.closest(HOVER_SEL)) { _hov = false; setHovering(false); }
    };
    const onLeave = () => { _vis = false; setVisible(false); };
    const onEnter = () => { _vis = true;  setVisible(true);  };
    const onClick = (e) => {
      // no splatter: in game section, in popup/no-splash zone, or on interactive elements
      if (
        gameModeRef.current ||
        e.target.closest('[data-game-section]') ||
        e.target.closest('[data-no-splash]') ||
        e.target.closest(INTERACTIVE_SEL)
      ) return;
      setSplashes(p => [...p, { id: ++splashId, x: e.clientX, y: e.clientY }]);
    };

    const tick = () => {
      rX = lerp(rX, mX, 0.1);
      rY = lerp(rY, mY, 0.1);
      if (dotWrapRef.current)
        dotWrapRef.current.style.transform = `translate(${mX}px,${mY}px) translate(-50%,-50%)`;
      if (ringWrapRef.current)
        ringWrapRef.current.style.transform = `translate(${rX}px,${rY}px) translate(-50%,-50%)`;
      if (crossRef.current)
        crossRef.current.style.transform = `translate(${mX}px,${mY}px)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout',  onOut);
    window.addEventListener('click',     onClick);
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout',  onOut);
      window.removeEventListener('click',     onClick);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const removeSplash = useCallback((id) => setSplashes(p => p.filter(s => s.id !== id)), []);
  const halo = '0 0 0 1px rgba(255,255,255,0.6)';
  const arm  = hovering ? '18px' : '12px';

  return (
    <>
      {splashes.map(s => (
        <SplashEffect key={s.id} x={s.x} y={s.y} onDone={() => removeSplash(s.id)} />
      ))}

      {/* ── Default cursor: dot + lagging ring ──
          Back to a plain solid color, no mix-blend-mode — the color-
          inversion experiment caused an unfixable blue-shift whenever it
          crossed the site's lime accent (difference blending is a per-
          channel |a-b|, not a real invert, so saturated colors always come
          out wrong), so it's removed entirely rather than patched further.
          Visibility on any background comes from the white halo boxShadow
          instead. Ring's border still drops away on hover so it reads as
          "converting into" the bigger solid dot, same mechanic as before —
          just solid black again instead of blended white. */}
      {!gameMode && <>
        <div ref={ringWrapRef} style={{
          position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999998,
          width: hovering ? '90px' : '34px', height: hovering ? '90px' : '34px',
          border: hovering ? '0px solid transparent' : '1.5px solid #111', borderRadius: '50%',
          boxShadow: hovering ? 'none' : halo,
          opacity: visible ? 1 : 0,
          transition: 'opacity .25s, width .35s cubic-bezier(.25,.46,.45,.94), height .35s cubic-bezier(.25,.46,.45,.94), border-color .25s, box-shadow .25s',
        }} />
        <div ref={dotWrapRef} style={{
          position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999999,
          width: hovering ? '90px' : '7px', height: hovering ? '90px' : '7px',
          backgroundColor: '#121212', borderRadius: '50%',
          boxShadow: halo,
          opacity: visible ? 1 : 0,
          transition: 'opacity .25s, width .35s cubic-bezier(.25,.46,.45,.94), height .35s cubic-bezier(.25,.46,.45,.94)',
        }} />
      </>}

      {/* ── Game cursor: crosshair ── */}
      {gameMode && (
        <div ref={crossRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999999, opacity: visible ? 1 : 0, transition: 'opacity .2s' }}>
          <div style={{ position: 'absolute', height: '1.5px', width: arm, right: 'calc(50% + 3px)', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.5)', transition: 'width .2s' }} />
          <div style={{ position: 'absolute', height: '1.5px', width: arm, left: 'calc(50% + 3px)', top: '50%', transform: 'translateY(-50%)', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.5)', transition: 'width .2s' }} />
          <div style={{ position: 'absolute', width: '1.5px', height: arm, bottom: 'calc(50% + 3px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.5)', transition: 'height .2s' }} />
          <div style={{ position: 'absolute', width: '1.5px', height: arm, top: 'calc(50% + 3px)', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#fff', boxShadow: '0 0 0 1px rgba(0,0,0,0.5)', transition: 'height .2s' }} />
          <div style={{ position: 'absolute', width: '4px', height: '4px', backgroundColor: '#AFEA00', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', boxShadow: '0 0 0 1px rgba(0,0,0,0.4)' }} />
        </div>
      )}
    </>
  );
};

export default CustomCursor;
