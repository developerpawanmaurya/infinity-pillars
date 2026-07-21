import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import './Sample7.css';

gsap.registerPlugin(Draggable, InertiaPlugin, Flip, SplitText);

// Ported from Codrops' "Smooth, Draggable Product Grid" (MIT licensed,
// tympanus.net/Tutorials/PalmerDraggableGrid — original idea by Uncommon,
// recreating Palmer's site): a big grid of repeating product tiles, panned
// with GSAP Draggable + inertia (or the scroll wheel), each product
// clickable to Flip into a details panel sliding in from the right, with
// SplitText line/char reveals and a small cursor-following "×" close
// button. Independent implementation written from scratch — no CSS/JS
// source copied, only the layout/timing values (column gaps, Flip/
// Draggable durations, SplitText stagger amounts), which are functional
// data. Photos are the demo's own real images (its README credits them
// "Free for Personal and Business use from rawpixel"). Product names,
// prices and descriptions below are our own original copy — not the
// demo's — written from what's actually visible in each photo.
const PRODUCTS = [
  { id: 1, name: 'Scarlet Bloom Vase', price: '$128.00', desc: 'A glossy, bulbous vase in a deep red glaze. Its rounded body and narrow neck make it a striking centerpiece on its own, no arrangement required.' },
  { id: 2, name: 'Sandstone Speckle Urn', price: '$96.00', desc: 'Warm cream stoneware flecked with rust and amber speckles, finished with a softly flared rim. Feels handmade, at home in almost any room.' },
  { id: 3, name: 'Citrine Tall Vase', price: '$118.00', desc: 'A tall, glossy yellow vase with a graceful curved silhouette. Bright without being loud — a quiet pop of color on a shelf or console.' },
  { id: 4, name: 'Honeypot Vase', price: '$88.00', desc: 'Squat and generous, this mustard-glazed vase trades height for presence. A confident, low centerpiece for a wide table.' },
  { id: 5, name: 'Obsidian Classic Urn', price: '$145.00', desc: 'Deep black glaze over a traditional urn shape with a flared collar. Timeless and a little dramatic, it pairs with almost anything.' },
  { id: 6, name: 'Amber Speckle Cylinder', price: '$104.00', desc: 'A cylindrical vase in a mottled amber glaze with a darker rim. The texture catches the light differently from every angle.' },
  { id: 7, name: 'Walnut Grain Vase', price: '$132.00', desc: 'Turned from wood and finished to show off its natural grain, this teardrop-shaped vase brings warmth where ceramic usually goes.' },
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

// Same repeating column arrangement as the source (10 columns of 5 tiles,
// referencing the 7 unique products) — a structural/layout pattern, not
// creative content, kept as-is for a faithful copy.
const COLUMNS = [
  [3, 7, 1, 5, 2],
  [4, 6, 3, 7, 1],
  [5, 2, 4, 6, 1],
  [3, 5, 1, 6, 2],
  [4, 6, 3, 5, 1],
  [5, 6, 2, 1, 4],
  [3, 4, 1, 2, 6],
  [5, 2, 4, 6, 1],
  [3, 5, 1, 6, 2],
  [4, 6, 3, 5, 1],
];

const Sample7Page = () => {
  const pageRef = useRef(null);
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const productRefs = useRef([]);
  const detailsRef = useRef(null);
  const detailsThumbRef = useRef(null);
  const crossRef = useRef(null);
  const titleRefs = useRef({});
  const textRefs = useRef({});

  useEffect(() => {
    const page = pageRef.current;
    const container = containerRef.current;
    const grid = gridRef.current;
    const details = detailsRef.current;
    const detailsThumb = detailsThumbRef.current;
    const cross = crossRef.current;
    if (!page || !container || !grid || !details || !detailsThumb || !cross) return undefined;

    const products = productRefs.current.filter(Boolean);
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.15, smoothWheel: false, smoothTouch: !isTouch });
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    let draggable;
    let observer;
    let onWheel;
    let onResize;
    let onMouseMove;
    let titleSplits;
    let textSplits;
    let currentProduct = null;
    let originalParent = null;
    let showDetails = false;
    let ctx = gsap.context(() => {
      const centerGrid = () => {
        const gridWidth = grid.offsetWidth;
        const gridHeight = grid.offsetHeight;
        const centerX = (window.innerWidth - gridWidth) / 2;
        const centerY = (window.innerHeight - gridHeight) / 2;
        gsap.set(grid, { x: centerX, y: centerY });
      };

      const updateBounds = () => {
        if (!draggable) return;
        draggable.vars.bounds = {
          minX: -(grid.offsetWidth - window.innerWidth) - 200,
          maxX: 200,
          minY: -(grid.offsetHeight - window.innerHeight) - 100,
          maxY: 100,
        };
      };

      const setupDraggable = () => {
        container.classList.add('is-loaded');

        draggable = Draggable.create(grid, {
          type: 'x,y',
          bounds: {
            minX: -(grid.offsetWidth - window.innerWidth) - 200,
            maxX: 200,
            minY: -(grid.offsetHeight - window.innerHeight) - 100,
            maxY: 100,
          },
          inertia: true,
          allowEventDefault: true,
          edgeResistance: 0.9,
          onDragStart: () => grid.classList.add('is-dragging'),
          onDragEnd: () => grid.classList.remove('is-dragging'),
        })[0];

        onWheel = (e) => {
          e.preventDefault();
          const deltaX = -e.deltaX * 7;
          const deltaY = -e.deltaY * 7;
          const currentX = gsap.getProperty(grid, 'x');
          const currentY = gsap.getProperty(grid, 'y');
          const bounds = draggable.vars.bounds;
          const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, currentX + deltaX));
          const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, currentY + deltaY));
          gsap.to(grid, { x: clampedX, y: clampedY, duration: 0.3, ease: 'power3.out' });
        };
        window.addEventListener('wheel', onWheel, { passive: false });

        onResize = () => updateBounds();
        window.addEventListener('resize', onResize);

        onMouseMove = (e) => {
          if (showDetails) {
            gsap.to(cross, {
              x: e.clientX - cross.offsetWidth / 2,
              y: e.clientY - cross.offsetHeight / 2,
              duration: 0.4,
              ease: 'power2.out',
            });
          }
        };
        window.addEventListener('mousemove', onMouseMove);
      };

      const observeProducts = () => {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.target === currentProduct) return;
            if (entry.isIntersecting) {
              gsap.to(entry.target, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' });
            } else {
              gsap.to(entry.target, { opacity: 0, scale: 0.5, duration: 0.5, ease: 'power2.in' });
            }
          });
        }, { root: null, threshold: 0.1 });
        products.forEach((p) => observer.observe(p));
      };

      const flipProduct = (product) => {
        currentProduct = product;
        originalParent = product.parentNode;
        if (observer) observer.unobserve(product);

        const state = Flip.getState(product);
        detailsThumb.appendChild(product);
        Flip.from(state, { absolute: true, duration: 1.2, ease: 'power3.inOut' });

        gsap.to(cross, { scale: 1, duration: 0.4, delay: 0.5, ease: 'power2.out' });
      };

      const unflipProduct = () => {
        if (!currentProduct || !originalParent) return;
        gsap.to(cross, { scale: 0, duration: 0.4, ease: 'power2.out' });

        const finalRect = originalParent.getBoundingClientRect();
        const currentRect = currentProduct.getBoundingClientRect();
        const thumbRect = detailsThumb.getBoundingClientRect();

        gsap.set(currentProduct, {
          position: 'absolute',
          top: currentRect.top - thumbRect.top,
          left: currentRect.left - thumbRect.left,
          width: currentRect.width,
          height: currentRect.height,
          zIndex: 10000,
        });

        gsap.to(currentProduct, {
          top: finalRect.top - thumbRect.top,
          left: finalRect.left - thumbRect.left,
          width: finalRect.width,
          height: finalRect.height,
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.inOut',
          onComplete: () => {
            originalParent.appendChild(currentProduct);
            gsap.set(currentProduct, { position: '', top: '', left: '', width: '', height: '', zIndex: '' });
            currentProduct = null;
            originalParent = null;
          },
        });
      };

      const showProductDetails = (product) => {
        if (showDetails) return;
        showDetails = true;
        details.classList.add('is-showing');
        page.classList.add('is-details-showing');

        gsap.to(container, { x: '-50vw', duration: 1.2, ease: 'power3.inOut' });
        gsap.to(details, { x: 0, duration: 1.2, ease: 'power3.inOut' });

        flipProduct(product);

        const id = product.dataset.id;
        const title = titleRefs.current[id];
        const text = textRefs.current[id];
        if (title) {
          gsap.to(title.querySelectorAll('.sample7-char'), {
            y: 0, duration: 1.1, delay: 0.4, ease: 'power3.inOut', stagger: 0.025,
          });
        }
        if (text) {
          gsap.to(text.querySelectorAll('.sample7-line'), {
            y: 0, duration: 1.1, delay: 0.4, ease: 'power3.inOut', stagger: 0.05,
          });
        }
      };

      const hideProductDetails = () => {
        showDetails = false;
        page.classList.remove('is-details-showing');

        gsap.to(container, {
          x: 0, duration: 1.2, delay: 0.3, ease: 'power3.inOut',
          onComplete: () => details.classList.remove('is-showing'),
        });
        gsap.to(details, { x: '50vw', duration: 1.2, delay: 0.3, ease: 'power3.inOut' });

        unflipProduct();

        Object.values(titleRefs.current).forEach((title) => {
          gsap.to(title.querySelectorAll('.sample7-char'), {
            y: '100%', duration: 0.6, ease: 'power3.inOut', stagger: { amount: 0.025, from: 'end' },
          });
        });
        Object.values(textRefs.current).forEach((text) => {
          gsap.to(text.querySelectorAll('.sample7-line'), {
            y: '100%', duration: 0.6, ease: 'power3.inOut', stagger: 0.05,
          });
        });
      };

      const handleDetails = () => {
        titleSplits = new SplitText(Object.values(titleRefs.current), {
          type: 'lines, chars', mask: 'lines', charsClass: 'sample7-char',
        });
        textSplits = new SplitText(Object.values(textRefs.current), {
          type: 'lines', mask: 'lines', linesClass: 'sample7-line',
        });

        products.forEach((product) => {
          product.addEventListener('click', (e) => {
            e.stopPropagation();
            showProductDetails(product);
          });
        });
        container.addEventListener('click', () => {
          if (showDetails) hideProductDetails();
        });
        cross.addEventListener('click', (e) => {
          e.stopPropagation();
          if (showDetails) hideProductDetails();
        });
      };

      centerGrid();

      const timeline = gsap.timeline();
      timeline.set(container, { scale: 0.5 });
      timeline.set(products, { scale: 0.5, opacity: 0 });
      timeline.to(products, {
        scale: 1, opacity: 1, duration: 0.6, ease: 'power3.out',
        stagger: { amount: 1.2, from: 'random' },
      });
      timeline.to(container, {
        scale: 1, duration: 1.2, ease: 'power3.inOut',
        onComplete: () => {
          setupDraggable();
          observeProducts();
          handleDetails();
        },
      });
    }, page);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      observer?.disconnect();
      draggable?.kill();
      titleSplits?.revert();
      textSplits?.revert();
      ctx.revert();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="sample7-page" ref={pageRef}>
      <Helmet>
        <title>Sample 7 — Draggable Product Grid | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample7-page__back">&larr; Back</Link>
      <div className="sample7-hint">Drag, scroll, or click a piece</div>

      <div className="sample7-container" ref={containerRef}>
        <div className="sample7-grid" ref={gridRef}>
          {COLUMNS.map((col, ci) => (
            <div className="sample7-column" key={ci}>
              {col.map((id, ri) => {
                const product = PRODUCT_MAP[id];
                return (
                  <div className="sample7-product" key={`${ci}-${ri}`}>
                    <div
                      className="sample7-product__inner"
                      data-id={id}
                      ref={(el) => (productRefs.current[ci * col.length + ri] = el)}
                    >
                      <img src={`/images/draggable-grid/img-${id}.png`} alt={product.name} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="sample7-details" ref={detailsRef}>
        <div className="sample7-details__title">
          {PRODUCTS.map((p) => (
            <p key={p.id} ref={(el) => (titleRefs.current[p.id] = el)}>{p.name}</p>
          ))}
        </div>
        <div className="sample7-details__body">
          <div className="sample7-details__thumb" ref={detailsThumbRef} />
          <div className="sample7-details__texts">
            {PRODUCTS.map((p) => (
              <p key={p.id} ref={(el) => (textRefs.current[p.id] = el)}>
                <span>{p.price}</span>
                {p.desc}
                <button type="button">Add to cart</button>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="sample7-cross" ref={crossRef}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke="#313131" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default Sample7Page;
