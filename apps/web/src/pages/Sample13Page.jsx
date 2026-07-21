import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import gsap from 'gsap';
import './Sample13.css';

// Ported from Andrea Biason's Codrops demo "Shopping Cart Animation"
// (MIT licensed, tympanus.net/Tutorials/ShoppingCartAnimation/): clicking
// "Add to cart" scales the other products down, briefly enlarges the
// clicked one, then flies its 6 gallery thumbnails (staggered from the
// last) through a two-keyframe path — lift up/down first, then shrink
// into the cart button's own screen position — while the cart badge
// pops in with an elastic ease the first time an item lands. The cart
// itself is a right-hand drawer (background + panel slide in on
// separate staggered tweens) listing items with quantity controls and a
// running total. Independent implementation, written from scratch — no
// CSS/JS source copied, only the GSAP timeline structure/values (keyframe
// positions, stagger/easing numbers), which are functional, not creative.
// Product photos are the demo's own real images (its README credits them
// "Images generated with Midjourney"), reused directly per the repo's MIT
// license with no reuse restriction stated for them. Product names/copy
// below are our own original writing, not the demo's own placeholder
// "Product 01" labels. Font is Inter (Google Fonts), not the source's
// Typekit account.
const IMG = (path) => `/images/add-to-cart/${path}`;

const PRODUCTS = [
  { id: 'nova-runner', name: 'Nova Runner', price: 15 },
  { id: 'aero-slide', name: 'Aero Slide', price: 8 },
  { id: 'quartz-high', name: 'Quartz High', price: 12 },
  { id: 'drift-low', name: 'Drift Low', price: 5 },
  { id: 'solstice-boot', name: 'Solstice Boot', price: 20 },
  { id: 'ember-trainer', name: 'Ember Trainer', price: 8 },
].map((p, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    ...p,
    cover: IMG(`product-${n}-cover.jpg`),
    gallery: [1, 2, 3, 4, 5].map((g) => IMG(`galleries/product-${n}/0${g}.jpg`)).concat(IMG(`product-${n}-cover.jpg`)),
  };
});

const Sample13Page = () => {
  const itemRefs = useRef([]);
  const galleryWrapRefs = useRef([]);
  const galleryItemRefs = useRef([]);
  const cartButtonRef = useRef(null);
  const cartButtonLabelRef = useRef(null);
  const cartButtonNumberRef = useRef(null);
  const cartButtonBgRef = useRef(null);
  const cartRef = useRef(null);
  const cartBgRef = useRef(null);
  const cartInnerBgRef = useRef(null);
  const cartCloseRef = useRef(null);
  const cartTotalRefs = useRef([]);
  const cartItemNodeRefs = useRef({});

  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const cartItemsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const hasPoppedRef = useRef(false);
  const cartButtonCoordsRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let cancelled = false;
    const images = PRODUCTS.flatMap((p) => [p.cover, ...p.gallery]);
    Promise.all(
      images.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          }),
      ),
    ).then(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    gsap.set([cartButtonNumberRef.current, cartButtonBgRef.current], { scale: 0 });
    gsap.set(cartRef.current, { xPercent: 100 });
    gsap.set([cartBgRef.current, cartInnerBgRef.current], { xPercent: 110 });
    gsap.set(cartCloseRef.current, { x: 30, autoAlpha: 0 });

    const setCoords = () => {
      const rect = cartButtonRef.current.getBoundingClientRect();
      cartButtonCoordsRef.current = { x: rect.x, y: rect.y };
    };
    setCoords();
    window.addEventListener('resize', setCoords);
    return () => window.removeEventListener('resize', setCoords);
  }, []);

  const cartButtonPop = () => {
    const tl = gsap.timeline();
    tl.addLabel('start');
    tl.to(cartButtonLabelRef.current, { x: -35, duration: 0.4, ease: 'power2.out' }, 'start');
    tl.to([cartButtonNumberRef.current, cartButtonBgRef.current], {
      scale: 1, stagger: 0.1, duration: 0.8, ease: 'elastic.out(1.3, 0.9)',
    }, 'start');
  };

  const addToCart = (index) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const product = PRODUCTS[index];
    const productEl = itemRefs.current[index];
    const otherEls = itemRefs.current.filter((_, i) => i !== index);
    const galleryWrap = galleryWrapRefs.current[index];
    const currentGallery = galleryItemRefs.current[index];
    const isTopRow = window.innerWidth > 768 && index < 3;

    gsap.set(galleryWrap, { autoAlpha: 1 });
    gsap.set(currentGallery, { transformOrigin: isTopRow ? 'top right' : 'bottom left' });

    const { y, left, right, height } = currentGallery[0].getBoundingClientRect();
    const { x: cbx, y: cby } = cartButtonCoordsRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(currentGallery, { scale: 1, autoAlpha: 1, y: 0, x: 0 });
        gsap.set(galleryWrap, { autoAlpha: 0 });
        isAnimatingRef.current = false;
      },
    });
    tl.addLabel('start');

    tl.to(otherEls, { scale: 0.8, autoAlpha: 0.05, duration: 0.6, stagger: 0.04, ease: 'power2.out' }, 'start');
    tl.to(productEl, { scale: 1.05, duration: 1, ease: 'power2.out' }, 'start+=0.7');

    tl.to(currentGallery, {
      keyframes: {
        '40%': {
          y: isTopRow ? height * 1.5 : -height * 1.5,
          scale: isTopRow ? 0.8 : 0.5,
          autoAlpha: 1,
        },
        '100%': {
          x: isTopRow ? cbx - right : cbx - left - 12,
          y: isTopRow ? cby - y : cby - y - height + 25,
          scale: 0,
          autoAlpha: 0,
        },
      },
      stagger: { from: 'end', each: 0.04 },
      duration: 1.8,
      ease: 'power2.inOut',
    }, 'start');

    tl.add(() => {
      const wasEmpty = cartItemsRef.current.length === 0;
      const existing = cartItemsRef.current.find((it) => it.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cartItemsRef.current.push({ ...product, quantity: 1 });
      }
      setCartItems([...cartItemsRef.current]);
      if (wasEmpty) cartButtonPop();
    }, 'start+=0.6');

    tl.to([productEl, ...otherEls], { scale: 1, autoAlpha: 1, duration: 0.8, stagger: 0.03, ease: 'power2.out' }, 'start+=1.6');
  };

  const updateQuantity = (id, delta) => {
    const item = cartItemsRef.current.find((it) => it.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      cartItemsRef.current = cartItemsRef.current.filter((it) => it.id !== id);
    }
    setCartItems([...cartItemsRef.current]);
  };

  const removeItem = (id) => {
    cartItemsRef.current = cartItemsRef.current.filter((it) => it.id !== id);
    setCartItems([...cartItemsRef.current]);
  };

  const openCart = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const itemNodes = Object.values(cartItemNodeRefs.current).filter(Boolean);
    if (itemNodes.length) gsap.set(itemNodes, { x: 30, autoAlpha: 0 });

    const tl = gsap.timeline({
      onStart: () => gsap.set(cartRef.current, { xPercent: 0 }),
      onComplete: () => { isAnimatingRef.current = false; },
    });
    tl.addLabel('start');
    tl.to([cartBgRef.current, cartInnerBgRef.current], { xPercent: 0, stagger: 0.1, duration: 2.2, ease: 'expo.inOut' }, 'start');
    tl.to(cartCloseRef.current, { x: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' }, 'start+=1.3');
    if (itemNodes.length) {
      tl.to(itemNodes, { x: 0, autoAlpha: 1, duration: 1, stagger: 0.1, ease: 'power2.out' }, 'start+=1.4');
    }
    tl.to(cartTotalRefs.current, { scale: 1, autoAlpha: 1, duration: 1, stagger: 0.1, ease: 'power2.out' }, 'start+=1.6');
  };

  const closeCart = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const itemNodes = Object.values(cartItemNodeRefs.current).filter(Boolean);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(cartRef.current, { xPercent: 100 });
        isAnimatingRef.current = false;
      },
    });
    tl.addLabel('start');
    tl.to([cartBgRef.current, cartInnerBgRef.current], { xPercent: 110, stagger: 0.1, duration: 1.5, ease: 'expo.inOut' }, 'start');
    if (itemNodes.length) {
      tl.to(itemNodes, { x: 30, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 'start');
    }
    tl.to(cartCloseRef.current, { x: 30, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 'start');
    tl.to(cartTotalRefs.current, { scale: 0.9, autoAlpha: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, 'start');
  };

  const total = cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div className={`sample13-page${isLoading ? ' locked' : ''}`}>
      <Helmet>
        <title>Sample 13 — Add-to-Cart Animation | Infinity Pillars</title>
      </Helmet>

      <span className="sample13-noise" aria-hidden="true" />

      <header className="sample13-frame">
        <Link to="/" className="sample13-page__back">&larr; Back</Link>
        <h1 className="sample13-frame__title">Add-To-Cart Animation</h1>
      </header>

      <button type="button" className="sample13-cart-button" ref={cartButtonRef} onClick={openCart}>
        <div className="sample13-cart-button__label-wrap" ref={cartButtonLabelRef}>
          <span className="sample13-cart-button__label">Cart</span>
          <span className="sample13-cart-button__line" />
        </div>
        <div className="sample13-cart-button__number-wrap">
          <span className="sample13-cart-button__number-bg" ref={cartButtonBgRef} />
          <span className="sample13-cart-button__number" ref={cartButtonNumberRef}>{cartItems.length}</span>
        </div>
      </button>

      <section className="sample13-content">
        <ul className="sample13-products__list">
          {PRODUCTS.map((product, index) => (
            <li
              className="sample13-products__item"
              key={product.id}
              ref={(el) => (itemRefs.current[index] = el)}
            >
              <div className="sample13-products__images">
                <img className="sample13-products__main-image" src={product.cover} alt={product.name} />
                <div className="sample13-products__gallery" ref={(el) => (galleryWrapRefs.current[index] = el)}>
                  {product.gallery.map((src, gi) => (
                    <img
                      className="sample13-products__gallery-item"
                      key={`${product.id}-${gi}`}
                      src={src}
                      alt=""
                      ref={(el) => {
                        if (!galleryItemRefs.current[index]) galleryItemRefs.current[index] = [];
                        galleryItemRefs.current[index][gi] = el;
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="sample13-products__footer">
                <span className="sample13-products__name">{product.name}</span>
                <span className="sample13-products__price">&euro; {product.price}</span>
              </div>
              <button type="button" className="sample13-button" onClick={() => addToCart(index)}>
                Add to cart
              </button>
            </li>
          ))}
        </ul>
      </section>

      <aside className="sample13-cart" ref={cartRef}>
        <div className="sample13-cart__bg" ref={cartBgRef} />
        <div className="sample13-cart__inner">
          <button type="button" className="sample13-cart__close" ref={cartCloseRef} onClick={closeCart}>Close</button>
          <div className="sample13-cart__inner-bg" ref={cartInnerBgRef} />

          <div className="sample13-cart-items">
            {cartItems.length === 0 && <span className="sample13-cart-items__empty">Your cart is empty.</span>}
            {cartItems.map((item) => (
              <div
                className="sample13-cart-grid sample13-cart-item"
                key={item.id}
                ref={(el) => (cartItemNodeRefs.current[item.id] = el)}
              >
                <img className="sample13-cart-item__img" src={item.cover} alt={item.name} />
                <div className="sample13-cart-item__details">
                  <span className="sample13-cart-item__title">{item.name}</span>
                  <button type="button" className="sample13-cart-item__remove" onClick={() => removeItem(item.id)}>Remove</button>
                  <div className="sample13-cart-item__wrap">
                    <div className="sample13-cart-item__actions">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    </div>
                    <span>&euro; {item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="sample13-cart-grid sample13-cart-total">
            <div className="sample13-cart-total__inner">
              <div className="sample13-cart-total__label" ref={(el) => (cartTotalRefs.current[0] = el)}>Total:</div>
              <div className="sample13-cart-total__amount" ref={(el) => (cartTotalRefs.current[1] = el)}>&euro; {total}</div>
              <div className="sample13-cart-total__taxes" ref={(el) => (cartTotalRefs.current[2] = el)}>
                Delivery fee and tax<br />calculated at checkout
              </div>
              <a className="sample13-button sample13-cart-total__checkout" href="#checkout" ref={(el) => (cartTotalRefs.current[3] = el)}>Checkout</a>
            </div>
          </div>
        </div>
      </aside>

      <span className="sample13-credit">Product photography: Midjourney (via the source demo)</span>
    </div>
  );
};

export default Sample13Page;
