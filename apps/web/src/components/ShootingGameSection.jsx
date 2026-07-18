import React, { useState, useRef, useCallback, useEffect } from 'react';

let nextId = 200;
const HEADER_H      = 72;   // px — matches header py-4 scrolled state
const HIT_THRESHOLD = 5;    // testing value — bump to 20 for production
const STICKY_EXTRA  = 400;  // px of scroll the section stays pinned for

function makeBird() {
  const dir = Math.random() > 0.5 ? 'ltr' : 'rtl';
  return {
    id: nextId++,
    top: Math.random() * 42 + 5,
    duration: Math.random() * 20 + 18,
    dir,
    size: Math.random() * 14 + 22,
    delay: -(Math.random() * 15),
    status: 'flying',
  };
}

const INITIAL_BIRDS = Array.from({ length: 8 }, makeBird);

const BirdSVG = ({ size, dir }) => (
  <svg
    width={size} height={size * 0.55}
    viewBox="0 0 44 24" fill="none"
    style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : 'none', display: 'block' }}
  >
    <path d="M22,13 Q14,4 3,8" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
      style={{ transformOrigin: '22px 13px', animation: `birdWing ${0.5 + Math.random() * 0.2}s ease-in-out infinite` }} />
    <path d="M22,13 Q30,4 41,8" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
      style={{ transformOrigin: '22px 13px', animation: `birdWing ${0.5 + Math.random() * 0.2}s ease-in-out infinite`, animationDelay: '0.1s' }} />
    <ellipse cx="22" cy="13" rx="3" ry="2.2" fill="#1a1a1a" />
    <circle cx={dir === 'rtl' ? 19 : 25} cy="10" r="2.5" fill="#1a1a1a" />
    <circle cx={dir === 'rtl' ? 18.5 : 25.5} cy="9.5" r="0.8" fill="white" />
  </svg>
);

const Bird = React.memo(({ bird, onShoot }) => {
  const isActive  = bird.status === 'flying';
  const isFalling = bird.status === 'falling';
  return (
    <div style={{
      position: 'absolute', top: `${bird.top}%`, left: 0, zIndex: 10,
      pointerEvents: isFalling ? 'none' : 'auto',
      animation: `${bird.dir === 'ltr' ? 'birdLTR' : 'birdRTL'} ${bird.duration}s linear ${bird.delay}s infinite`,
      animationPlayState: isActive ? 'running' : 'paused',
    }}>
      <div onClick={() => isActive && onShoot(bird.id)} style={{
        display: 'inline-block', cursor: 'none', userSelect: 'none',
        animation: isFalling ? 'birdFall 0.85s cubic-bezier(0.4,0,1,1) forwards' : 'none',
      }}>
        {bird.status === 'hit'
          ? <span style={{ fontSize: bird.size * 0.9, lineHeight: 1 }}>💥</span>
          : <BirdSVG size={bird.size} dir={bird.dir} />}
      </div>
    </div>
  );
});

const Cloud = ({ top, duration, delay, width }) => (
  <div style={{
    position: 'absolute', top: `${top}%`, width: `${width}px`, height: `${Math.round(width * 0.42)}px`,
    background: 'rgba(255,255,255,0.82)', borderRadius: '60px', filter: 'blur(5px)',
    animation: `cloudDrift ${duration}s linear ${delay}s infinite`, zIndex: 2, pointerEvents: 'none',
  }} />
);

const CLOUDS = [
  { top: 6,  duration: 60, delay: 0,    width: 150 },
  { top: 15, duration: 75, delay: -22,  width: 210 },
  { top: 4,  duration: 48, delay: -38,  width: 95  },
  { top: 24, duration: 85, delay: -12,  width: 175 },
  { top: 10, duration: 55, delay: -50,  width: 120 },
];

// ── SVG rubber stamp — matches classic circular stamp design ─────────────────
const Stamp = () => (
  /*
   * - Outer + inner double ring
   * - "SHARPSHOOTER" arcs around top (mostly clipped = chopped-off look)
   * - "SHARPSHOOTER" arcs around bottom between the rings
   * - Bold "VERIFIED" diagonal banner across the centre (white text on red)
   * - Stars at top and bottom between rings
   * - feTurbulence grunge filter = worn ink texture
   * Positioned so top ~26px of SVG are clipped by card overflow:hidden
   */
  <div style={{
    position: 'absolute',
    top: -14,
    right: 54,   // right side, clearly left of the × button (× is at right:16)
    pointerEvents: 'none',
    transform: 'rotate(-10deg)',
    transformOrigin: 'center center',
    animation: 'couponStamp 0.5s cubic-bezier(0.34,1.56,0.64,1) 1s both',
    opacity: 0,
  }}>
    <svg viewBox="0 0 130 130" width="110" height="110" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Grunge — structural elements only, NOT text */}
        <filter id="sg" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="4" stitchTiles="stitch" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/>
        </filter>

        {/*
          Outer ring r=58, inner ring r=36 → 22px gap.
          Text arc at r=47 (midpoint).
          Top arc: text ascenders go OUTWARD (away from centre) → caps reach r=55 (inside outer ring).
          Bottom arc: text ascenders go INWARD (toward centre)  → caps reach r=39 (just outside inner ring).
          No dy needed — geometry works without it.
        */}
        <clipPath id="sc"><circle cx="65" cy="65" r="58"/></clipPath>
        <path id="s-t" d="M 65,65 m -47,0 a 47,47 0 0,1 94,0"/>
        <path id="s-b" d="M 65,65 m -47,0 a 47,47 0 0,0 94,0"/>
      </defs>

      {/* Grunged rings + stars */}
      <g filter="url(#sg)">
        <circle cx="65" cy="65" r="58" fill="none" stroke="#dc2626" strokeWidth="3.5"/>
        <circle cx="65" cy="65" r="36" fill="none" stroke="#dc2626" strokeWidth="2"/>
        <text x="43" y="26" textAnchor="middle" fill="#dc2626" fontSize="9">★</text>
        <text x="65" y="19" textAnchor="middle" fill="#dc2626" fontSize="9">★</text>
        <text x="87" y="26" textAnchor="middle" fill="#dc2626" fontSize="9">★</text>
        <text x="43" y="113" textAnchor="middle" fill="#dc2626" fontSize="9">★</text>
        <text x="65" y="118" textAnchor="middle" fill="#dc2626" fontSize="9">★</text>
        <text x="87" y="113" textAnchor="middle" fill="#dc2626" fontSize="9">★</text>
      </g>

      {/* Grunged band fill, clipped to outer ring */}
      <g clipPath="url(#sc)">
        <g filter="url(#sg)">
          <rect x="-5" y="52" width="140" height="26" fill="#dc2626" transform="rotate(-7 65 65)"/>
        </g>
      </g>

      {/* Clean VERIFIED text on band */}
      <g clipPath="url(#sc)">
        <text x="65" y="67" textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize="19" fontWeight="900" letterSpacing="3"
          transform="rotate(-7 65 65)">VERIFIED</text>
      </g>

      {/* Clean arc text — no filter, sharp and readable */}
      <text fill="#dc2626" fontSize="8.5" fontWeight="900" letterSpacing="1.6">
        <textPath href="#s-t" startOffset="50%" textAnchor="middle">SHARPSHOOTER</textPath>
      </text>
      <text fill="#dc2626" fontSize="8.5" fontWeight="900" letterSpacing="1.6">
        <textPath href="#s-b" startOffset="50%" textAnchor="middle">SHARPSHOOTER</textPath>
      </text>
    </svg>
  </div>
);

// ── Coupon popup ─────────────────────────────────────────────────────────────
const COUPON_CODE = 'SHARPSHOT10';

const CouponPopup = ({ onClose }) => {
  const [copied,  setCopied]  = useState(false);
  const [shaking, setShaking] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(COUPON_CODE).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  // Stamp lands at ~1.5s (1s delay + 0.5s animation) — shake fires as it hits
  useEffect(() => {
    const t = setTimeout(() => {
      setShaking(true);
      setTimeout(() => setShaking(false), 520);
    }, 1380);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      data-no-splash
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000000,
        background: 'rgba(5,20,5,0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      {/* Shake wrapper — separate from reveal so animations don't conflict */}
      <div
        data-no-splash
        style={{
          maxWidth: 520, width: '100%',
          animation: shaking ? 'cardThump 0.42s cubic-bezier(0.36,0.07,0.19,0.97) both' : 'none',
        }}
      >
      <div
        data-no-splash
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          background: '#0c0c0c',
          border: '1.5px solid #AFEA00',
          width: '100%',
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          animation: 'couponReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards',
          overflow: 'hidden',  // clips the stamp at top
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)',
            fontSize: '1.4rem', lineHeight: 1, cursor: 'none', padding: '4px 8px',
          }}
        >×</button>

        <Stamp />

        {/* Eyebrow */}
        <p style={{
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#AFEA00', margin: '0 0 1rem',
        }}>
          🎯 &nbsp; {HIT_THRESHOLD} birds down
        </p>

        {/* Headline */}
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900,
          letterSpacing: '-0.03em', lineHeight: 1.1,
          color: '#fff', margin: '0 0 0.4rem',
        }}>
          Your aim is better than most of{' '}
          <span style={{ color: '#AFEA00' }}>our clients' conversion rates.</span>
        </h2>

        {/* Divider */}
        <div style={{ width: 48, height: 2, background: '#AFEA00', margin: '1.5rem 0' }} />

        {/* Coupon strip */}
        <div style={{
          background: '#AFEA00', padding: '1.2rem 1.4rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1rem', marginBottom: '1.5rem',
        }}>
          <div>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#1a3300', margin: '0 0 0.2rem',
            }}>Your reward code</p>
            <p style={{
              fontSize: 'clamp(1.3rem, 4vw, 1.9rem)', fontWeight: 900,
              letterSpacing: '0.12em', color: '#051405', margin: 0, fontFamily: 'monospace',
            }}>
              {COUPON_CODE}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{
              fontSize: 'clamp(2rem, 7vw, 3.2rem)', fontWeight: 900,
              lineHeight: 1, color: '#051405', margin: 0,
            }}>10%</p>
            <p style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#1a3300', margin: 0,
            }}>off web services</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={copy}
            style={{
              flex: 1, minWidth: 130,
              background: copied ? 'rgba(175,234,0,0.15)' : 'transparent',
              border: `1.5px solid ${copied ? '#AFEA00' : 'rgba(255,255,255,0.25)'}`,
              color: copied ? '#AFEA00' : '#fff',
              fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '0.85rem 1rem',
              cursor: 'none', transition: 'all 0.2s',
            }}
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
          <a
            href="#booking"
            onClick={onClose}
            style={{
              flex: 1, minWidth: 130,
              background: '#AFEA00', color: '#051405',
              fontSize: '0.82rem', fontWeight: 900, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '0.85rem 1rem',
              textDecoration: 'none', textAlign: 'center', cursor: 'none', display: 'block',
            }}
          >
            Book a Call →
          </a>
        </div>

        <p style={{
          fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)',
          margin: '1.2rem 0 0', letterSpacing: '0.05em',
        }}>
          Valid for 48 hours · One use per project · New web service engagements only
        </p>
      </div>
      </div>{/* end shake wrapper */}
    </div>
  );
};

// ── Main section ─────────────────────────────────────────────────────────────
export default function ShootingGameSection() {
  const [birds,      setBirds]      = useState(INITIAL_BIRDS);
  const [score,      setScore]      = useState(0);
  const [misses,     setMisses]     = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const couponShown = useRef(false);

  const onShoot = useCallback((id) => {
    setScore(s => {
      const next = s + 1;
      if (next >= HIT_THRESHOLD && !couponShown.current) {
        couponShown.current = true;
        setTimeout(() => setShowCoupon(true), 350);
      }
      return next;
    });
    setBirds(prev => prev.map(b => b.id === id ? { ...b, status: 'hit' } : b));
    setTimeout(() => {
      setBirds(prev => prev.map(b => b.id === id ? { ...b, status: 'falling' } : b));
    }, 110);
    setTimeout(() => {
      setBirds(prev => [...prev.filter(b => b.id !== id), makeBird()]);
    }, 1050);
  }, []);

  const onSectionClick = useCallback((e) => {
    if (!e.target.closest('[data-bird]')) setMisses(m => m + 1);
  }, []);

  // reset score + allow re-trigger after popup closes
  const handleClose = useCallback(() => {
    setShowCoupon(false);
    setScore(0);
    setMisses(0);
    couponShown.current = false;
  }, []);

  const sectionH = `calc(100vh - ${HEADER_H}px)`;

  return (
    <>
      {showCoupon && <CouponPopup onClose={handleClose} />}

      {/* Sticky scroll container — section stays pinned for STICKY_EXTRA px of scroll */}
      <div style={{ height: `calc(${sectionH} + ${STICKY_EXTRA}px)`, position: 'relative' }}>
        <section
          data-game-section
          onClick={onSectionClick}
          style={{
            position: 'sticky',
            top: HEADER_H,
            height: sectionH,
            minHeight: 480,
            overflow: 'hidden',
            userSelect: 'none',
            background: 'linear-gradient(to bottom, #5ba8d4 0%, #87CEEB 38%, #b0deb0 56%, #3d9e3d 62%, #256325 100%)',
          }}
        >
          {/* Sun */}
          <div style={{
            position: 'absolute', top: '6%', right: '7%', zIndex: 3,
            width: 64, height: 64,
            background: 'radial-gradient(circle, #fff9c4 55%, rgba(255,250,180,0) 100%)',
            borderRadius: '50%', boxShadow: '0 0 35px 14px rgba(255,248,180,0.55)',
            pointerEvents: 'none',
          }} />

          {CLOUDS.map((c, i) => <Cloud key={i} {...c} />)}

          {/* Heading */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: 'clamp(1.5rem, 4vw, 3rem) 24px 0',
            textAlign: 'center', zIndex: 20, pointerEvents: 'none',
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900,
              letterSpacing: '-0.03em', lineHeight: 1, color: '#051405',
              textShadow: '0 2px 12px rgba(255,255,255,0.55)', margin: 0,
            }}>
              Still here?{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Shoot the birds.</span>
            </h2>
            <p style={{
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#0a2a0a', marginTop: 10, opacity: 0.65,
            }}>
              Click anywhere · crosshair activates · {HIT_THRESHOLD} hits unlocks a surprise
            </p>
          </div>

          {/* Score */}
          <div style={{
            position: 'absolute', top: 28, right: 24, zIndex: 25, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
          }}>
            <div style={{
              background: '#AFEA00', color: '#051405', fontWeight: 800,
              fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '5px 14px',
            }}>
              {score} / {HIT_THRESHOLD}
            </div>
            {misses > 0 && (
              <div style={{
                background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.7)',
                fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.06em',
                textTransform: 'uppercase', padding: '3px 10px',
              }}>
                {misses} missed
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{
            position: 'absolute', bottom: '39%', left: 0, right: 0, zIndex: 5, pointerEvents: 'none',
            padding: '0 24px',
          }}>
            <div style={{ height: 3, background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: '#AFEA00',
                width: `${Math.min((score / HIT_THRESHOLD) * 100, 100)}%`,
                transition: 'width 0.3s ease', boxShadow: '0 0 8px #AFEA00',
              }} />
            </div>
          </div>

          {/* Birds */}
          {birds.map(bird => (
            <div key={bird.id} data-bird>
              <Bird bird={bird} onShoot={onShoot} />
            </div>
          ))}

          {/* Fence */}
          <div style={{ position: 'absolute', bottom: '37%', left: 0, right: 0, height: 2, background: 'rgba(0,0,0,0.25)', zIndex: 4, pointerEvents: 'none' }} />
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: '37%', left: `${(i / 22) * 100 + 0.5}%`,
              width: 6, height: 28, background: '#8B5E3C', zIndex: 4, pointerEvents: 'none',
              boxShadow: '1px 0 0 rgba(0,0,0,0.2)',
            }} />
          ))}
        </section>
      </div>
    </>
  );
}
