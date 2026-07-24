import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import SpecimenTerminal from '../components/SpecimenTerminal';

gsap.registerPlugin(ScrollTrigger, SplitText);

// The 17 standalone technique demos (Sample 1 / "/sample" through
// Sample 17 / "/sample-17") built while shipping the main site, indexed
// here as one browsable catalog. Names + field notes below are original
// copy describing what each page actually does — see each Sample*Page.jsx
// for the effect's own build notes / attribution.
const SPECIMENS = [
  { n: '01', name: 'Orbit Gallery', note: 'A photograph ring that turns exactly as fast as you scroll it.', tag: 'Scroll', path: '/sample' },
  { n: '02', name: 'Mask Reveal', note: 'One shape cuts a window straight through into the next scene.', tag: 'Scroll', path: '/sample-2' },
  { n: '03', name: 'The Cylinder', note: 'Twelve frames wrapped around a wall of light, slowly spinning.', tag: '3D', path: '/sample-3' },
  { n: '04', name: 'Cinematic Cut', note: 'A camera that never stops moving between scenes.', tag: '3D', path: '/sample-4' },
  { n: '05', name: 'The Cylinder — Redux', note: 'Same ring, retimed until the spin matches the scrollbar exactly.', tag: '3D', path: '/sample-5' },
  { n: '06', name: 'Cinematic Cut — Redux', note: 'A frame-accurate rebuild of 04, shot for shot.', tag: '3D', path: '/sample-6' },
  { n: '07', name: 'Drag & Drop', note: 'A shelf of products you can throw around with a cursor.', tag: 'Drag', path: '/sample-7' },
  { n: '08', name: 'Zoom Through', note: 'The image gets closer than the frame should allow.', tag: 'Scroll', path: '/sample-8' },
  { n: '09', name: 'Single Frame', note: 'One element doing all the work of a full scene.', tag: 'Scroll', path: '/sample-9' },
  { n: '10', name: 'Endless Parallax', note: 'Layers drifting past each other at different speeds, forever.', tag: 'Scroll', path: '/sample-10' },
  { n: '11', name: 'Quiet Orbit', note: 'Eight photographs fly in, settle into a ring, and never fully stop turning.', tag: '3D', path: '/sample-11' },
  { n: '12', name: 'Noise Field', note: "A model's surface dissolves into procedural static.", tag: 'Shader', path: '/sample-12' },
  { n: '13', name: 'Cart Drop', note: 'The satisfying half-second between a click and its confirmation.', tag: 'Micro', path: '/sample-13' },
  { n: '14', name: 'Image Trail', note: 'Move the cursor, leave a trail of frames behind it.', tag: 'Cursor', path: '/sample-14' },
  { n: '15', name: 'From the Lines', note: 'A page built from lines that decide, mid-scroll, to become content.', tag: 'Layout', path: '/sample-15' },
  { n: '16', name: 'Kinetic Type', note: 'Words that move as if the sentence is still being decided.', tag: 'Type', path: '/sample-16' },
  { n: '17', name: 'Layout Shift', note: 'Images that quietly rearrange themselves as you scroll past.', tag: 'Scroll', path: '/sample-17' },
];

const FILTERS = ['All', 'Scroll', '3D', 'Drag', 'Type', 'Shader', 'Cursor', 'Micro', 'Layout'];

const ArchivePage = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const [filter, setFilter] = useState('All');

  const visible = useMemo(
    () => (filter === 'All' ? SPECIMENS : SPECIMENS.filter((s) => s.tag === filter)),
    [filter],
  );

  // Hero: headline splits into characters and flips up into place, then the
  // rest of the hero (eyebrow, copy, counter, scroll cue) fades in behind it.
  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(headlineRef.current, { type: 'chars' });
      gsap.set(split.chars, { yPercent: 130, rotateX: -60, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power4.out' } });
      tl.to(split.chars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1, stagger: 0.025 })
        .from('[data-hero-fade]', { opacity: 0, y: 16, stagger: 0.08, duration: 0.7 }, '-=0.6')
        .from('[data-hero-count]', {
          textContent: 0,
          duration: 1.2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function onUpdate() {
            /* GSAP's textContent tween needs a numeric target read back live */
          },
        }, '-=0.7');

      return () => split.revert();
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>The Motion Archive — 17 Interactive Experiments | Infinity Pillars</title>
        <meta
          name="description"
          content="Seventeen scroll, drag, shader, and typography experiments built while shipping Infinity Pillars — kept exactly as made, indexed like specimens."
        />
      </Helmet>

      <Link
        to="/"
        className="fixed top-6 left-4 sm:left-6 lg:left-8 z-40 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
      >
        &larr; Infinity Pillars
      </Link>

      {/* Hero */}
      <section ref={heroRef} className="relative pt-40 pb-24 md:pt-56 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div data-hero-fade className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
          Field Notes &middot; R&amp;D
        </div>

        <h1
          ref={headlineRef}
          className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter leading-[0.9] mb-12"
          style={{ perspective: 800 }}
        >
          The Motion Archive.
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-border pt-12">
          <div data-hero-fade className="md:col-span-7 md:col-start-5">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              Seventeen scroll, drag, shader, and typography experiments, built while shipping this
              site and kept exactly as they were made — not polished into a portfolio, logged like
              specimens instead.
            </p>
          </div>
        </div>

        <div data-hero-fade className="flex items-center gap-4 mt-16">
          <span className="text-5xl md:text-6xl font-bold tracking-tighter">
            <span data-hero-count>17</span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground max-w-[9rem] leading-snug">
            Specimens logged, none deleted
          </span>
        </div>

        <motion.div
          data-hero-fade
          className="hidden md:flex items-center gap-2 absolute bottom-8 right-4 lg:right-8 text-xs font-bold uppercase tracking-widest text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          Scroll to open the archive
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* Tag ticker */}
      <section className="border-y border-border py-6 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          {[0, 1].map((dupe) => (
            <div key={dupe} className="flex items-center animate-scroll" aria-hidden={dupe === 1}>
              {['Scroll', '3D', 'Drag', 'Typography', 'Shader', 'Cursor', 'Micro-interaction', 'Layout'].map((tag) => (
                <span key={tag} className="mx-6 text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-6">
                  {tag}
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`relative px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-full border transition-colors duration-200 ${
                filter === f
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground'
              }`}
            >
              {filter === f && (
                <motion.span
                  layoutId="archive-filter-pill"
                  className="absolute inset-0 rounded-full bg-foreground -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* The index — a terminal you interrogate rather than a shelf you browse */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-4">
        <SpecimenTerminal specimens={visible} />
      </section>

      {/* Sign-off */}
      <section className="py-32 bg-foreground text-background text-center border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
              Every pillar started as a sample.
            </h2>
            <p className="text-lg text-background/70 mb-12 leading-relaxed">
              This archive is where the site's motion language gets tested before it earns a place
              on the real pages.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm border-b border-background pb-1 hover:text-background/70 hover:border-background/70 transition-all duration-300"
            >
              Back to Infinity Pillars
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ArchivePage;
