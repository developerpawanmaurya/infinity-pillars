import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// ── Stack the Pillars ─────────────────────────────────────────────────────────
// A reskinned "Stack"-style precision game: drop each moving pillar onto the
// one below it. Aligned drops keep the tower's width; misaligned drops trim
// it down to the overlap. Miss the edge entirely and the tower collapses.
// Built on the site's own design tokens (border/background/primary) rather
// than a bespoke scene, so it sits in the page like any other section.
const FIELD_W = 340;
const FIELD_H = 540;
const BLOCK_H = 32;
const GROUND_OFFSET = 36;
const MIN_TOP = 64;
const INITIAL_WIDTH = 160;
const BASE_SPEED = 85;        // px/s
const SPEED_GAIN_PER_LAYER = 3.4;
const MAX_SPEED = 230;
const PERFECT_TOLERANCE = 5;  // px
const REWARD_AT = 20;
const HS_KEY = 'ip_stack_high_score';

function layerColor(i) {
  // Foundation is a pale tint of the brand lime (not literal white) and
  // ramps to the full, saturated lime (#AFEA00) fast — steeply eased so
  // the tower reads as green from the first couple of layers on, rather
  // than lingering near-white against the white panel.
  const t = Math.min(i / 22, 1) ** 0.28;
  const sat = 30 + t * 70;   // 30% pale-green → 100% brand lime
  const light = 92 - t * 46; // 92% pale-green → 46% brand lime
  return `hsl(75 ${sat}% ${light}%)`;
}

function baseBlock() {
  return { x: (FIELD_W - INITIAL_WIDTH) / 2, width: INITIAL_WIDTH, color: layerColor(0) };
}

// A scaled-down redraw of the player's actual tower — same x/width/color per
// layer as the real thing, just shrunk — rather than a screenshot. Every
// player's stack is a different shape (their overlaps, their misses), so
// this "elevation drawing" is the one part of the reward that's unique to
// them, which is the whole point of the pitch below it.
const SNAPSHOT_SCALE = 100 / FIELD_W;
const TowerSnapshot = ({ stack }) => {
  if (!stack || !stack.length) return null;
  const w = Math.round(FIELD_W * SNAPSHOT_SCALE);
  const h = Math.round(stack.length * BLOCK_H * SNAPSHOT_SCALE);
  return (
    <div style={{ flexShrink: 0 }}>
      <svg width={w} height={h} viewBox={`0 0 ${FIELD_W} ${stack.length * BLOCK_H}`}>
        <rect x="0" y="0" width={FIELD_W} height={stack.length * BLOCK_H} fill="none" />
        {stack.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={(stack.length - 1 - i) * BLOCK_H}
            width={b.width}
            height={BLOCK_H - 2}
            fill={b.color}
          />
        ))}
      </svg>
      <p style={{
        fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
        margin: '0.6rem 0 0', textAlign: 'center',
      }}>
        Your build
      </p>
    </div>
  );
};

const RewardPopup = ({ onClose, stack }) => {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      data-no-splash
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000000,
        background: 'rgba(5,20,5,0.82)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <div
        data-no-splash
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 620, width: '100%', background: '#0c0c0c',
          border: '1.5px solid #AFEA00', padding: 'clamp(1.75rem, 4vw, 2.75rem)',
          animation: 'couponReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
          display: 'flex', gap: 'clamp(1.5rem, 4vw, 2.5rem)', flexWrap: 'wrap',
        }}
      >
        <TowerSnapshot stack={stack} />

        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 4vw, 2.1rem)', fontWeight: 900,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: '#fff', margin: '0 0 0.4rem',
          }}>
            That tower&rsquo;s yours{' '}
            <span style={{ color: '#AFEA00' }}>and only yours.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: '0.75rem 0 1.25rem' }}>
            So is the plan we&rsquo;d build you — no template, just your business, shaped
            into a package.
          </p>
          <p style={{
            color: '#AFEA00', fontWeight: 900, fontSize: 'clamp(1.05rem, 3vw, 1.4rem)',
            letterSpacing: '-0.02em', margin: '0 0 1.75rem',
          }}>
            That&rsquo;s how we do it.
          </p>
          <a
            href="#booking"
            onClick={onClose}
            style={{
              display: 'block', background: '#AFEA00', color: '#051405',
              fontSize: '0.85rem', fontWeight: 900, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '0.9rem 1rem',
              textDecoration: 'none', textAlign: 'center', cursor: 'none',
            }}
          >
            Book a Call →
          </a>
        </div>
      </div>
    </div>
  );
};

export default function StackPillarsSection() {
  const movingRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);
  const curXRef = useRef(0);
  const curWidthRef = useRef(INITIAL_WIDTH);
  const speedRef = useRef(BASE_SPEED);
  const dirRef = useRef('left');
  const rewardShownRef = useRef(false);

  const [stack, setStack] = useState([baseBlock()]);
  const [movingWidth, setMovingWidth] = useState(INITIAL_WIDTH);
  const [status, setStatus] = useState('ready'); // ready | playing | over
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return Number(window.localStorage.getItem(HS_KEY)) || 0;
  });
  const [isNewBest, setIsNewBest] = useState(false);
  const [flash, setFlash] = useState(null);
  const [chips, setChips] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [towerSnapshot, setTowerSnapshot] = useState(null);
  const [shake, setShake] = useState(false);
  const [collapsing, setCollapsing] = useState(false);

  const spawnMoving = useCallback((width, layerIndex) => {
    curWidthRef.current = width;
    setMovingWidth(width);
    const side = Math.random() > 0.5 ? 'left' : 'right';
    dirRef.current = side;
    curXRef.current = side === 'left' ? 0 : FIELD_W - width;
    speedRef.current = Math.min(MAX_SPEED, BASE_SPEED + layerIndex * SPEED_GAIN_PER_LAYER);
    startTimeRef.current = performance.now();
  }, []);

  // Idle attract-mode: before the first drop, the top block keeps drifting
  // back and forth on its own — the motion itself is the "click me" cue,
  // no overlay text needed.
  useEffect(() => {
    if (status === 'ready') spawnMoving(INITIAL_WIDTH, 0);
  }, [status, spawnMoving]);

  useEffect(() => {
    if (status !== 'playing' && status !== 'ready') return undefined;
    const tick = (now) => {
      const w = curWidthRef.current;
      const range = FIELD_W - w;
      if (range <= 0) {
        curXRef.current = 0;
      } else {
        const elapsed = (now - startTimeRef.current) / 1000;
        const period = (range * 2) / speedRef.current;
        const tMod = elapsed % period;
        const half = period / 2;
        const from = dirRef.current === 'left' ? 0 : range;
        const to = dirRef.current === 'left' ? range : 0;
        curXRef.current = tMod <= half
          ? from + (to - from) * (tMod / half)
          : to + (from - to) * ((tMod - half) / half);
      }
      if (movingRef.current) movingRef.current.style.left = `${curXRef.current}px`;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status]);

  const startGame = useCallback(() => {
    setStack([baseBlock()]);
    setScore(0);
    setIsNewBest(false);
    setCollapsing(false);
    setStatus('playing');
    spawnMoving(INITIAL_WIDTH, 1);
  }, [spawnMoving]);

  const drop = useCallback(() => {
    if (status === 'over') { startGame(); return; }
    // 'won' is a brief freeze between hitting REWARD_AT and the popup
    // actually opening (see below) — without this guard, a click landed in
    // that gap kept scoring, so the popup would open showing 21+ instead of
    // exactly 20.
    if (status === 'won') return;

    // The idle attract-mode block (status 'ready') is the same moving block
    // used during play — the first click resolves it as the first real drop
    // instead of just switching status and respawning it, so there's no
    // teleport/jump and the first pillar placed is genuinely layer 1, not a
    // free "start" click before layer 1.
    setStack((prevStack) => {
      const prev = prevStack[prevStack.length - 1];
      const curX = curXRef.current;
      const curW = curWidthRef.current;
      const overlapStart = Math.max(prev.x, curX);
      const overlapEnd = Math.min(prev.x + prev.width, curX + curW);
      const overlapWidth = overlapEnd - overlapStart;

      if (overlapWidth <= 2) {
        // Tower visually collapses (blocks tumble, dust kicks up) before the
        // "Tower collapsed" HUD appears — showing the game-over copy over a
        // still-standing tower reads as broken, not as a loss.
        setCollapsing(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setTimeout(() => setStatus('over'), 700);
        setHighScore((h) => {
          const next = Math.max(h, prevStack.length - 1);
          if (next > h) setIsNewBest(true);
          window.localStorage.setItem(HS_KEY, String(next));
          return next;
        });
        return prevStack;
      }

      const isPerfect = Math.abs(curX - prev.x) <= PERFECT_TOLERANCE
        && Math.abs(curW - prev.width) <= PERFECT_TOLERANCE * 2;
      const newWidth = isPerfect ? prev.width : overlapWidth;
      const newX = isPerfect ? prev.x : overlapStart;
      const layerIndex = prevStack.length;

      if (!isPerfect) {
        // Relative to the panned wrapper, same coordinate space as the
        // stack blocks below (which use `bottom: i * BLOCK_H`) — the
        // wrapper itself already carries the GROUND_OFFSET.
        const layerY = layerIndex * BLOCK_H;
        const toAdd = [];
        if (curX < overlapStart) toAdd.push({ x: curX, width: overlapStart - curX });
        if (curX + curW > overlapEnd) toAdd.push({ x: overlapEnd, width: (curX + curW) - overlapEnd });
        const withMeta = toAdd.map((c, i) => ({ ...c, id: `${Date.now()}-${i}`, y: layerY, color: layerColor(layerIndex) }));
        if (withMeta.length) {
          setChips((cs) => [...cs, ...withMeta]);
          withMeta.forEach((c) => {
            setTimeout(() => setChips((cs) => cs.filter((x) => x.id !== c.id)), 650);
          });
        }
        setFlash(null);
      } else {
        setFlash('PERFECT');
        setTimeout(() => setFlash(null), 480);
      }

      const nextScore = layerIndex; // number of successful placements so far
      setScore(nextScore);
      const nextStack = [...prevStack, { x: newX, width: newWidth, color: layerColor(layerIndex) }];

      if (nextScore === REWARD_AT && !rewardShownRef.current) {
        rewardShownRef.current = true;
        setTowerSnapshot(nextStack); // frozen at the moment it's earned, not live state
        // Freeze instead of spawning the next block — otherwise the game
        // keeps running during the reveal delay below and an extra drop can
        // sneak in before the popup opens.
        setStatus('won');
        setTimeout(() => setShowReward(true), 450);
      } else {
        setStatus('playing');
        spawnMoving(newWidth, layerIndex + 1);
      }

      return nextStack;
    });
  }, [status, startGame, spawnMoving]);

  const onKeyDown = useCallback((e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      drop();
    }
  }, [drop]);

  const handleCloseReward = useCallback(() => {
    setShowReward(false);
    rewardShownRef.current = false; // allow it to re-trigger on a later playthrough
    setStatus('playing');
    setStack((prev) => {
      const top = prev[prev.length - 1];
      spawnMoving(top.width, prev.length); // resume the drop that froze at REWARD_AT
      return prev;
    });
  }, [spawnMoving]);

  // Camera pan: derived purely from tower height, so it's naturally monotonic
  // and needs no extra state — the active layer stays pinned near MIN_TOP.
  const activeIndex = stack.length;
  const rawTop = FIELD_H - GROUND_OFFSET - activeIndex * BLOCK_H;
  const panY = rawTop < MIN_TOP ? (MIN_TOP - rawTop) : 0;

  return (
    // Section and game panel both stay on the page's own light theme.
    <section className="relative overflow-hidden border-t-2 border-primary/25 py-16 md:py-32">
      {showReward && <RewardPopup onClose={handleCloseReward} stack={towerSnapshot} />}

      {/* Ambient glow behind the panel — echoes the shooting-game section's
          horizon glow so the two "still here?" moments feel like one family. */}
      <div style={{
        position: 'absolute', top: '30%', right: '8%', zIndex: 0,
        width: 420, height: 420,
        background: 'radial-gradient(circle, rgba(175,234,0,0.22) 0%, rgba(175,234,0,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            {/* "Still here?" as a live-status pill rather than a plain
                label — the ping animation reads as "this is interactive,"
                which fits a game section better than a static banner. */}
            <div className="inline-flex items-center gap-2.5 mb-6 pl-3 pr-4 py-1.5 rounded-full border border-primary/40 bg-primary/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-foreground">
                Still here?
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-[0.95]">
              Stack the<br />
              <span className="text-primary">pillars.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mb-10">
              Compounding growth looks a lot like this: place things well, keep the base
              clean, and height takes care of itself. Rush the edge and the whole tower
              comes down — {REWARD_AT} clean layers unlocks a reward.
            </p>
            <div className="flex items-center gap-10">
              <div>
                <div className="text-4xl font-bold tracking-tighter tabular-nums">{score}</div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">Pillars</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <div className="text-4xl font-bold tracking-tighter tabular-nums text-muted-foreground">{highScore}</div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-1">Best</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 lg:col-start-7 flex justify-center"
          >
            <div style={{ position: 'relative', width: '100%', maxWidth: FIELD_W + 64 }}>
              <div
              role="button"
              tabIndex={0}
              data-no-splash
              onClick={drop}
              onKeyDown={onKeyDown}
              style={{
                width: '100%', height: FIELD_H,
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                userSelect: 'none', outline: 'none',
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 20px 60px -28px rgba(175,234,0,0.4)',
                animation: shake ? 'stackCollapseShake 0.5s ease' : 'none',
              }}
            >
              {/* HUD */}
              <div style={{ position: 'absolute', top: 14, left: 16, zIndex: 20, pointerEvents: 'none' }}
                className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                {status === 'playing' ? `Layer ${score + 1}` : 'Stack the Pillars'}
              </div>

              {flash && (
                <div style={{
                  position: 'absolute', left: '50%', top: FIELD_H - GROUND_OFFSET - activeIndex * BLOCK_H + panY - 34,
                  zIndex: 25, pointerEvents: 'none',
                  animation: 'stackPerfectFlash 0.5s ease forwards',
                }}
                  className="text-xs font-bold tracking-widest uppercase text-primary"
                >
                  {flash}
                </div>
              )}

              {/* Ground line */}
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: GROUND_OFFSET,
                borderTop: '1px solid hsl(var(--border))', zIndex: 1,
              }} />

              {/* Tower + moving block share one panned wrapper */}
              <div style={{
                position: 'absolute', left: '50%', bottom: GROUND_OFFSET,
                width: FIELD_W, marginLeft: -FIELD_W / 2,
                transform: `translateY(${panY}px)`, transition: 'transform 0.35s ease',
              }}>
                {stack.map((b, i) => {
                  // Deterministic per-block "physics" — each layer tumbles a
                  // different amount so the tower reads as falling apart
                  // rather than sliding down as one rigid unit. Seeded off
                  // the index (not Math.random) so it doesn't reroll and
                  // jitter on every re-render while collapsing is playing.
                  const fallX   = ((i % 2 === 0 ? 1 : -1) * (36 + ((i * 17) % 70)));
                  const fallRot = ((i % 2 === 0 ? 1 : -1) * (18 + ((i * 13) % 40)));
                  const fallDelay = (i % 6) * 0.025;
                  return (
                    <div key={i} style={{
                      position: 'absolute', bottom: i * BLOCK_H, left: b.x,
                      width: b.width, height: BLOCK_H - 2,
                      background: b.color, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                      ...(collapsing ? {
                        '--fall-x': `${fallX}px`,
                        '--fall-rot': `${fallRot}deg`,
                        animation: `stackBlockCollapse 0.65s cubic-bezier(0.55,0,1,0.45) ${fallDelay}s forwards`,
                      } : null),
                    }} />
                  );
                })}

                {/* Dust kicked up off the ground line as the tower hits down */}
                {collapsing && Array.from({ length: 10 }).map((_, i) => {
                  const puffX = (i / 9) * FIELD_W + (((i * 29) % 20) - 10);
                  const puffDelay = 0.12 + (i % 5) * 0.03;
                  const puffSize = 22 + ((i * 11) % 20);
                  return (
                    <div key={`smoke-${i}`} style={{
                      position: 'absolute', left: puffX, bottom: 0,
                      width: puffSize, height: puffSize, borderRadius: '50%',
                      background: 'radial-gradient(circle, hsl(var(--foreground)/0.28) 0%, hsl(var(--foreground)/0) 72%)',
                      animation: `stackSmokePuff 0.9s ease-out ${puffDelay}s forwards`,
                      opacity: 0, pointerEvents: 'none', zIndex: 2,
                    }} />
                  );
                })}

                {(status === 'playing' || status === 'ready' || status === 'won') && (
                  <div
                    ref={movingRef}
                    style={{
                      position: 'absolute', bottom: stack.length * BLOCK_H, left: 0,
                      width: movingWidth, height: BLOCK_H - 2,
                      background: layerColor(stack.length),
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
                    }}
                  />
                )}

                {chips.map((c) => (
                  <div key={c.id} style={{
                    position: 'absolute', bottom: c.y, left: c.x,
                    width: c.width, height: BLOCK_H - 2, background: c.color,
                    animation: 'stackChipFall 0.65s ease-in forwards', zIndex: 3,
                  }} />
                ))}
              </div>

              {status === 'over' && (
                <div
                  data-no-splash
                  style={{
                    position: 'absolute', inset: 0, zIndex: 30,
                    background: 'hsl(var(--background) / 0.92)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
                  }}
                >
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">
                    {isNewBest ? 'New best — tower collapsed' : 'Tower collapsed'}
                  </p>
                  <p className="text-5xl font-bold tracking-tighter tabular-nums">{score}</p>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">
                    pillars high
                  </p>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-6"
                    onClick={(e) => { e.stopPropagation(); startGame(); }}
                  >
                    Play Again
                  </Button>
                </div>
              )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
