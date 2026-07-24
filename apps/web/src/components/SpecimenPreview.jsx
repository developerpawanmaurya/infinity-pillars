import React, { useEffect, useRef } from 'react';

// There are no screenshots of the 17 sample pages to draw from, so instead
// of a static thumbnail each specimen card gets a small live loop that
// abstracts the *feeling* of its tag — bars scrolling, a ring turning, a
// chip getting dragged and dropped, static noise, a cursor trail — rather
// than a literal preview of the effect. Every piece here is CSS keyframes
// (defined in index.css) except the noise field, which is real per-frame
// canvas static since that's cheaper and more honest than faking it in CSS.

function BarsPreview() {
  const heights = [42, 72, 55, 92, 38, 66, 48];
  return (
    <div className="absolute inset-0 flex items-end justify-center gap-[5px] px-4 pb-3">
      {heights.map((h, i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: `${h}%`,
            background: i % 2 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.32)',
            animation: `archBarRise ${1.1 + (i % 3) * 0.25}s ease-in-out ${i * 0.09}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

function OrbitPreview() {
  const dashes = Array.from({ length: 8 });
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div style={{ position: 'relative', width: 66, height: 66, animation: 'archOrbitSpin 5.5s linear infinite' }}>
        {dashes.map((_, i) => {
          const angle = (360 / dashes.length) * i;
          return (
            <span
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 3,
                height: 13,
                background: i === 0 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.4)',
                transform: `rotate(${angle}deg) translate(0, -29px)`,
                transformOrigin: 'center',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function DragPreview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        style={{
          position: 'absolute',
          bottom: 18,
          width: 42,
          height: 26,
          border: '1.5px dashed rgba(255,255,255,0.22)',
          borderRadius: 4,
        }}
      />
      <span
        style={{
          position: 'relative',
          width: 34,
          height: 22,
          borderRadius: 4,
          background: 'hsl(var(--primary))',
          animation: 'archDragWobble 2.6s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function TypePreview() {
  const letters = ['A', 'E', 'I', 'O', 'U'];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
      {letters.map((l, i) => (
        <span
          key={l}
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: i === 2 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.5)',
            animation: `archTypeBounce 1.4s ease-in-out ${i * 0.12}s infinite`,
          }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

function ShaderPreview() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const W = 48;
    const H = 32;
    canvas.width = W;
    canvas.height = H;
    const imageData = ctx.createImageData(W, H);
    let rafId;
    let last = 0;

    const draw = (t) => {
      if (t - last > 70) {
        last = t;
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v * 0.5;
          data[i + 1] = v;
          data[i + 2] = v * 0.3;
          data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ imageRendering: 'pixelated', opacity: 0.6, mixBlendMode: 'screen' }}
    />
  );
}

function CursorPreview() {
  const dots = [0, 1, 2, 3];
  return (
    <div className="absolute inset-0">
      {dots.map((i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            width: 10 - i * 1.6,
            height: 10 - i * 1.6,
            borderRadius: '50%',
            background: i === 0 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.4)',
            opacity: 1 - i * 0.2,
            animation: 'archCursorLoop 3.2s ease-in-out infinite',
            animationDelay: `${-i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function MicroPreview() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span
        style={{
          position: 'absolute',
          top: '30%',
          fontSize: 11,
          fontWeight: 800,
          color: 'hsl(var(--primary))',
          animation: 'archMicroBadge 1.8s ease-out infinite',
        }}
      >
        +1
      </span>
      <span
        style={{
          width: 40,
          height: 26,
          borderRadius: 4,
          background: 'rgba(255,255,255,0.85)',
          animation: 'archMicroPulse 1.8s ease-in-out infinite',
        }}
      />
    </div>
  );
}

function LayoutPreview() {
  const cells = [
    { x: 0, y: 0, lx: 26, ly: 0 },
    { x: 1, y: 0, lx: -26, ly: 0 },
    { x: 0, y: 1, lx: 0, ly: 0 },
    { x: 1, y: 1, lx: 0, ly: 0 },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div style={{ position: 'relative', width: 76, height: 48 }}>
        {cells.map((c, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: c.x * 40,
              top: c.y * 26,
              width: 32,
              height: 18,
              background: i === 0 ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.32)',
              '--lx': `${c.lx}px`,
              '--ly': `${c.ly}px`,
              animation: c.lx || c.ly ? 'archLayoutSwap 3s ease-in-out infinite' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

const TAG_PREVIEWS = {
  Scroll: BarsPreview,
  '3D': OrbitPreview,
  Drag: DragPreview,
  Type: TypePreview,
  Shader: ShaderPreview,
  Cursor: CursorPreview,
  Micro: MicroPreview,
  Layout: LayoutPreview,
};

const SpecimenPreview = ({ tag }) => {
  const Comp = TAG_PREVIEWS[tag] || BarsPreview;
  return <Comp />;
};

export default SpecimenPreview;
