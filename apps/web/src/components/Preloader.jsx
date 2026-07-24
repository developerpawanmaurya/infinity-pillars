import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Icon geometry — identical to public/images/logo/icon-lime.svg's cropped
// viewBox (102 319 795.6 362), lifted from the "dark / drawOnce" preloader
// spec. DRAW_PATH1/2 are the same two shapes with their `d` seam rotated
// onto the long straight run instead of the end-cap hook, so the stroke
// draw-on doesn't visibly start mid-curve.
const PATH1 = 'M547.68 333.759C554.656 324.226 568.039 322.154 577.572 329.129C587.105 336.105 589.177 349.488 582.202 359.021L564.941 346.39C581.979 358.857 582.198 359.021 582.198 359.027C582.196 359.029 582.192 359.035 582.188 359.04C582.181 359.05 582.17 359.065 582.156 359.084C582.129 359.121 582.089 359.174 582.038 359.243C581.937 359.381 581.789 359.583 581.596 359.845C581.208 360.371 580.638 361.144 579.895 362.145C578.408 364.146 576.227 367.065 573.425 370.775C567.821 378.195 559.724 388.785 549.706 401.523C529.689 426.977 501.917 461.12 470.993 495.742C440.147 530.278 405.772 565.734 372.558 593.555C355.948 607.468 339.265 619.779 323.156 629.149C307.251 638.399 290.695 645.501 274.526 647.674C220.866 654.886 178.11 642.778 148.901 614.419C120.157 586.51 108 546.196 108 503.788C108 456.341 140 405.752 187.34 381.629C237.138 356.253 301.621 360.818 363.571 418.742C372.199 426.81 372.653 440.345 364.585 448.974C356.517 457.602 342.984 458.055 334.355 449.988C283.972 402.879 238.667 403.485 206.761 419.743C172.399 437.253 150.778 473.892 150.777 503.788C150.777 538.723 160.789 566.338 178.7 583.728C196.147 600.667 224.535 611.23 268.827 605.276C277.147 604.158 288.124 600.037 301.649 592.17C314.969 584.423 329.616 573.722 345.089 560.761C376.046 534.832 408.865 501.086 439.09 467.246C469.238 433.494 496.417 400.085 516.082 375.08C525.904 362.589 533.83 352.223 539.289 344.994C542.019 341.38 544.131 338.552 545.554 336.637C546.265 335.68 546.803 334.95 547.16 334.465C547.338 334.223 547.472 334.042 547.559 333.924C547.602 333.865 547.636 333.82 547.656 333.793C547.665 333.779 547.673 333.77 547.677 333.764C547.679 333.762 547.679 333.76 547.68 333.759Z';
const PATH2 = 'M451.925 666.241C444.949 675.774 431.566 677.846 422.033 670.871C412.5 663.895 410.428 650.512 417.403 640.979L434.664 653.61C417.626 641.143 417.407 640.979 417.407 640.973C417.409 640.971 417.413 640.965 417.417 640.96C417.424 640.95 417.435 640.935 417.449 640.916C417.476 640.879 417.516 640.826 417.567 640.757C417.668 640.619 417.816 640.417 418.009 640.155C418.397 639.629 418.967 638.856 419.71 637.855C421.197 635.854 423.378 632.935 426.18 629.225C431.784 621.805 439.881 611.215 449.899 598.477C469.916 573.023 497.688 538.88 528.612 504.258C559.458 469.722 593.833 434.266 627.047 406.445C643.657 392.532 660.34 380.221 676.449 370.851C692.354 361.601 708.91 354.499 725.079 352.326C778.739 345.114 821.495 357.222 850.704 385.581C879.448 413.49 891.605 453.804 891.605 496.212C891.605 543.659 859.605 594.248 812.265 618.371C762.467 643.747 697.984 639.182 636.034 581.258C627.406 573.19 626.952 559.655 635.02 551.026C643.088 542.398 656.621 541.945 665.25 550.012C715.633 597.121 760.938 596.515 792.844 580.257C827.206 562.747 848.827 526.108 848.828 496.212C848.828 461.277 838.816 433.662 820.905 416.272C803.458 399.333 775.07 388.77 730.777 394.724C722.458 395.842 711.481 399.963 697.956 407.83C684.636 415.577 669.989 426.278 654.516 439.239C623.559 465.168 590.74 498.914 560.515 532.754C530.367 566.506 503.188 599.915 483.523 624.92C473.701 637.411 465.775 647.777 460.316 655.006C457.586 658.62 455.474 661.448 454.051 663.363C453.34 664.32 452.802 665.05 452.445 665.535C452.267 665.777 452.133 665.958 452.046 666.076C452.003 666.135 451.969 666.18 451.949 666.207C451.94 666.221 451.932 666.23 451.928 666.236C451.926 666.238 451.926 666.24 451.925 666.241Z';
const DRAW_PATH1 = 'M573.425 370.775C567.821 378.195 559.724 388.785 549.706 401.523C529.689 426.977 501.917 461.12 470.993 495.742C440.147 530.278 405.772 565.734 372.558 593.555C355.948 607.468 339.265 619.779 323.156 629.149C307.251 638.399 290.695 645.501 274.526 647.674C220.866 654.886 178.11 642.778 148.901 614.419C120.157 586.51 108 546.196 108 503.788C108 456.341 140 405.752 187.34 381.629C237.138 356.253 301.621 360.818 363.571 418.742C372.199 426.81 372.653 440.345 364.585 448.974C356.517 457.602 342.984 458.055 334.355 449.988C283.972 402.879 238.667 403.485 206.761 419.743C172.399 437.253 150.778 473.892 150.777 503.788C150.777 538.723 160.789 566.338 178.7 583.728C196.147 600.667 224.535 611.23 268.827 605.276C277.147 604.158 288.124 600.037 301.649 592.17C314.969 584.423 329.616 573.722 345.089 560.761C376.046 534.832 408.865 501.086 439.09 467.246C469.238 433.494 496.417 400.085 516.082 375.08C525.904 362.589 533.83 352.223 539.289 344.994C542.019 341.38 544.131 338.552 545.554 336.637C546.265 335.68 546.803 334.95 547.16 334.465C547.338 334.223 547.472 334.042 547.559 333.924C547.602 333.865 547.636 333.82 547.656 333.793C547.665 333.779 547.673 333.77 547.677 333.764C547.679 333.762 547.679 333.76 547.68 333.759C554.656 324.226 568.039 322.154 577.572 329.129C587.105 336.105 589.177 349.488 582.202 359.021C578.408 364.146 576.227 367.065 573.425 370.775Z';
const DRAW_PATH2 = 'M426.18 629.225C431.784 621.805 439.881 611.215 449.899 598.477C469.916 573.023 497.688 538.88 528.612 504.258C559.458 469.722 593.833 434.266 627.047 406.445C643.657 392.532 660.34 380.221 676.449 370.851C692.354 361.601 708.91 354.499 725.079 352.326C778.739 345.114 821.495 357.222 850.704 385.581C879.448 413.49 891.605 453.804 891.605 496.212C891.605 543.659 859.605 594.248 812.265 618.371C762.467 643.747 697.984 639.182 636.034 581.258C627.406 573.19 626.952 559.655 635.02 551.026C643.088 542.398 656.621 541.945 665.25 550.012C715.633 597.121 760.938 596.515 792.844 580.257C827.206 562.747 848.827 526.108 848.828 496.212C848.828 461.277 838.816 433.662 820.905 416.272C803.458 399.333 775.07 388.77 730.777 394.724C722.458 395.842 711.481 399.963 697.956 407.83C684.636 415.577 669.989 426.278 654.516 439.239C623.559 465.168 590.74 498.914 560.515 532.754C530.367 566.506 503.188 599.915 483.523 624.92C473.701 637.411 465.775 647.777 460.316 655.006C457.586 658.62 455.474 661.448 454.051 663.363C453.34 664.32 452.802 665.05 452.445 665.535C452.267 665.777 452.133 665.958 452.046 666.076C452.003 666.135 451.969 666.18 451.949 666.207C451.94 666.221 451.932 666.23 451.928 666.236C451.926 666.238 451.926 666.24 451.925 666.241C444.949 675.774 431.566 677.846 422.033 670.871C412.5 663.895 410.428 650.512 417.403 640.979C421.197 635.854 423.378 632.935 426.18 629.225Z';

export default function Preloader({ onComplete }) {
  const wrapRef        = useRef(null);
  const topPanelRef    = useRef(null);
  const bottomPanelRef = useRef(null);
  const contentRef     = useRef(null);
  const drawPathRefs   = useRef([]);
  const outlineGroupRef = useRef(null);
  const fillGroupRef   = useRef(null);
  const topTextRef     = useRef(null);
  const botTextRef     = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete() {
        document.body.style.overflow = '';
        // Global signal for anything that mounted underneath the opaque
        // preloader and needs to wait for it to actually lift before playing
        // its own on-load animation (e.g. the /experiment hero's heading
        // intro) — otherwise that animation finishes silently behind the
        // curtain and the user never sees it play.
        window.__preloaderDone = true;
        window.dispatchEvent(new Event('preloader:done'));
        onComplete?.();
      },
    });

    // 1 — mark and agency name start together: the outline strokes trace the
    // infinity loop (pathLength=100 normalizes dashoffset regardless of
    // actual geometry) while the two text lines clip in from opposite
    // directions, all from the same t=0.
    tl.to(
      drawPathRefs.current,
      { strokeDashoffset: 0, duration: 0.7, stagger: 0.12, ease: 'power2.inOut' },
      0
    )
    .fromTo(
      topTextRef.current,
      { yPercent: -110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      0
    )
    .fromTo(
      botTextRef.current,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
      0.07
    )
    // 2 — the drawn outline crossfades into the solid lime fill
    .to(fillGroupRef.current, { opacity: 1, duration: 0.3, ease: 'power1.out' }, '-=0.15')
    .to(outlineGroupRef.current, { opacity: 0, duration: 0.3, ease: 'power1.out' }, '<')
    // 3 — hold, then exit: the mark+text cluster punches forward and fades,
    // then the curtain tears apart into two panels (instead of one flat
    // slide-up)
    .to(contentRef.current, { scale: 1.15, opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=0.5')
    .to(topPanelRef.current, { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, '-=0.2')
    .to(bottomPanelRef.current, { yPercent: 100, duration: 0.75, ease: 'power4.inOut' }, '<');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000000,
        overflow: 'hidden',
      }}
    >
      {/* Split curtain — two independent panels for the exit tear */}
      <div ref={topPanelRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: '#121212' }} />
      <div ref={bottomPanelRef} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: '#121212' }} />

      <div
        ref={contentRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Mark + agency name — icon draws itself on, text clips in as two lines */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.8rem, 2.5vw, 1.6rem)' }}>
          <svg
            viewBox="102 319 795.6 362"
            style={{ height: 'clamp(2.6rem, 7.5vw, 5rem)', width: 'auto', overflow: 'visible' }}
          >
            <g ref={outlineGroupRef} fill="none" stroke="#AFEA00" strokeWidth={6} strokeLinecap="round">
              <path
                ref={el => (drawPathRefs.current[0] = el)}
                d={DRAW_PATH1}
                pathLength={100}
                style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
              />
              <path
                ref={el => (drawPathRefs.current[1] = el)}
                d={DRAW_PATH2}
                pathLength={100}
                style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
              />
            </g>
            <g ref={fillGroupRef} fill="#AFEA00" style={{ opacity: 0 }}>
              <path d={PATH1} />
              <path d={PATH2} />
            </g>
          </svg>
          <div style={{ textAlign: 'left', lineHeight: 1 }}>
            <div style={{ overflow: 'hidden' }}>
              <div
                ref={topTextRef}
                style={{
                  fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#ffffff',
                  textTransform: 'uppercase',
                }}
              >
                Infinity
              </div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div
                ref={botTextRef}
                style={{
                  fontSize: 'clamp(1.6rem, 4.5vw, 3.2rem)',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#AFEA00',
                  textTransform: 'uppercase',
                }}
              >
                Pillars.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
