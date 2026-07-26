import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ArrowUpRight, Radio, Globe2, Quote, ChevronRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AnimatedCounter from '@/components/AnimatedCounter.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import './DeQollabCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const SECTORS = [
  'Spacetech', 'FMCG', 'Fintech', 'Healthtech', 'EdTech', 'CleanTech',
  'D2C Retail', 'SaaS', 'Real Estate', 'Hospitality', 'Mobility',
  'Agritech', 'Media & Entertainment', 'Logistics', 'Gaming', 'Fashion', 'Public Sector'
];

const CASE_TILES = [
  { title: 'Orbital Launch Narrative', sector: 'Spacetech' },
  { title: 'Series B Fintech Positioning', sector: 'Fintech' },
  { title: 'National FMCG Relaunch', sector: 'FMCG' },
  { title: 'Digital Health Category Entry', sector: 'Healthtech' },
  { title: 'Campus-to-Career EdTech Push', sector: 'EdTech' },
  { title: 'Net-Zero CleanTech Reveal', sector: 'CleanTech' },
  { title: 'D2C Category Leadership', sector: 'D2C Retail' },
  { title: 'Enterprise SaaS Rebrand', sector: 'SaaS' },
  { title: 'Skyline Real Estate Debut', sector: 'Real Estate' },
  { title: 'Boutique Hospitality Group', sector: 'Hospitality' },
  { title: 'Urban Mobility Rollout', sector: 'Mobility' },
  { title: 'Agritech Field Trial Story', sector: 'Agritech' },
];

const TESTIMONIALS = [
  { quote: "The filter matrix alone changed how prospects understand our range — they find the exact sector proof point in seconds instead of scrolling a wall of text.", role: 'VP of Communications, Enterprise PR Client' },
  { quote: "Every metric on that homepage is doing sales work for us before the first call even happens.", role: 'Corporate Communications Director, Tech Partner' },
  { quote: "It finally reads like the agency we actually are — not a commodity shop competing on price.", role: 'Founder-Partner, Venture-Backed Client' },
];

const OUTCOMES = [
  { feature: 'Vertical Showcase', legacy: 'Cluttered text directories', design: 'Interactive Filter Matrix', value: 'Instant niche-specific solutions across 17 sectors' },
  { feature: 'Trust Building', legacy: 'Hidden accomplishments', design: 'Data Stats Console (345+ coverages)', value: 'Immediate authority verification' },
  { feature: 'User Feedback', legacy: 'Static testimonials', design: 'Interactive Partner Carousel', value: 'Premium social proof with elegant motion' },
  { feature: 'Booking Intake', legacy: 'Complex multi-field forms', design: 'Single-column contact form', value: 'Maximizes conversion, minimizes friction' },
];

const DeQollabCaseStudy = () => {
  const [activeSector, setActiveSector] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const tilesRef = useRef(null);
  const heroRef = useRef(null);

  const visibleTiles = activeSector ? CASE_TILES.filter((t) => t.sector === activeSector) : CASE_TILES;

  // Hero + section reveals
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-dq-reveal]').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 36 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          });
      });

      gsap.utils.toArray('[data-dq-stagger]').forEach((group) => {
        gsap.fromTo(group.children,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          });
      });
    }, heroRef);

    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  // Filter-matrix re-flow animation whenever the active sector changes
  useEffect(() => {
    if (!tilesRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(tilesRef.current.children,
        { opacity: 0, scale: 0.94, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.045 }
      );
    }, tilesRef);
    // Filtering can shrink the grid from a dozen tiles down to one, which
    // shortens the page a lot — every section below needs its ScrollTrigger
    // start/end points recalculated against the new (shorter) layout.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => { ctx.revert(); cancelAnimationFrame(id); };
  }, [activeSector]);

  // Auto-rotate testimonials
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="dq-page" ref={heroRef}>
      <Helmet>
        <title>deQollab — Case Study | Infinity Pillars</title>
        <meta name="description" content="Establishing authority through precision minimalist web design: how Infinity Pillars engineered deQollab's high-converting digital platform." />
      </Helmet>

      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden dq-grid-bg dq-noise pt-32 pb-24">
        <div className="dq-scanline" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-16">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-[#AFEA00] transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Success Blueprints
            </Link>
            <a
              href="https://deqollab.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="dq-visit-btn group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 transition-all duration-300"
            >
              Visit live site
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-[#AFEA00] mb-8">
            <Radio className="w-3.5 h-3.5" />
            Case Study — Strategic Communications
          </div>

          <SplitReveal
            text="Establishing authority through precision minimalist design."
            as="h1"
            className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[0.95] max-w-5xl dq-glow-text"
          />

          <p className="mt-10 text-lg md:text-2xl text-white/60 max-w-2xl font-light leading-relaxed">
            deQollab, founded by award-winning innovators Falguni Khemka and Rajeshwari Singh, needed a digital presence that projects immediate strategic authority to Venture Capital Partners, Tech Founders, and Corporate Communication Directors — across a 17-sector portfolio.
          </p>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 max-w-3xl">
            {[
              { k: '17', v: 'Sectors unified' },
              { k: '345+', v: 'Media coverages' },
              { k: '9–12%', v: 'Potential CVR lift' },
              { k: '01', v: 'Frictionless intake' },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-2xl md:text-3xl font-bold tracking-tighter text-white">{s.k}</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Challenge ────────────────────────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-dq-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">The Digital Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">ICP friction was costing deQollab premium retainers.</h2>
          </div>

          <div data-dq-stagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {[
              { t: 'The Commodity Trap', d: "Baseline design that failed to reflect the founders' pedigree." },
              { t: 'Multi-Sector Dilution', d: 'Clutter from trying to showcase 17 diverse verticals, from Spacetech to FMCG.' },
              { t: 'Low Trust Verification', d: 'Lack of immediate, data-driven proof on the homepage.' },
            ].map((c) => (
              <div key={c.t} className="bg-[#0a0a0a] p-10">
                <h3 className="text-xl font-bold tracking-tight mb-4">{c.t}</h3>
                <p className="text-white/50 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Sector Filter Matrix ─────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-dq-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">The Solution — 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Interactive Sector Filter Matrix.</h2>
            <p className="text-white/50 text-lg leading-relaxed">Dynamically displays targeted case studies by industry niche, eliminating page clutter. Try it — filter the live matrix below by sector.</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-12">
            <button
              onClick={() => setActiveSector(null)}
              className={`dq-chip px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full ${activeSector === null ? 'is-active' : ''}`}
            >
              All Sectors
            </button>
            {SECTORS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSector(s)}
                className={`dq-chip px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full ${activeSector === s ? 'is-active' : ''}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div ref={tilesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[120px]">
            {visibleTiles.map((tile) => (
              <div key={tile.title} className="dq-tile p-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#AFEA00]">{tile.sector}</span>
                <h4 className="text-lg font-bold tracking-tight mt-3">{tile.title}</h4>
              </div>
            ))}
            {visibleTiles.length === 0 && (
              <p className="text-white/40 col-span-full py-10 text-center">No case studies filed under this sector yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Stats Console ─────────────────────────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-dq-reveal className="dq-console relative p-10 md:p-16 overflow-hidden">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-12">
              <Globe2 className="w-4 h-4" />
              Data-Rich Stats Console — Solution 02
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              <div>
                <AnimatedCounter value={345} suffix="+" className="text-6xl md:text-7xl font-bold tracking-tighter block" />
                <p className="text-white/50 mt-3 uppercase text-xs tracking-widest">Verified media coverages</p>
              </div>
              <div>
                <AnimatedCounter value={17} className="text-6xl md:text-7xl font-bold tracking-tighter block" />
                <p className="text-white/50 mt-3 uppercase text-xs tracking-widest">Sectors, one platform</p>
              </div>
              <div>
                <div className="text-6xl md:text-7xl font-bold tracking-tighter">Global</div>
                <p className="text-white/50 mt-3 uppercase text-xs tracking-widest">Reach, unassailable proof</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial Carousel ──────────────────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p data-dq-reveal className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-14">Testimonial Carousel — Solution 03</p>

          <div className="relative min-h-[220px] flex items-center justify-center">
            <Quote className="w-10 h-10 text-[#AFEA00]/40 absolute -top-4 left-1/2 -translate-x-1/2" />
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="pt-10"
              >
                <p className="text-2xl md:text-3xl font-light leading-relaxed text-white/90 mb-8 text-balance">
                  "{TESTIMONIALS[testimonialIdx].quote}"
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-white/40">{TESTIMONIALS[testimonialIdx].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.role}
                onClick={() => setTestimonialIdx(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'w-8 bg-[#AFEA00]' : 'w-1.5 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Single-Column Intake Hub ──────────────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div data-dq-reveal className="lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">Solution 04</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Single-Column Intake Hub.</h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              A friction-free booking form. Conversion research indicates single-column layouts can lift conversion rates by <span className="text-white font-semibold">9% to 12%</span> by minimizing cognitive load.
            </p>
            <div className="inline-flex items-baseline gap-2 border border-[#AFEA00]/30 px-6 py-4">
              <span className="text-4xl font-bold text-[#AFEA00]">9–12%</span>
              <span className="text-xs uppercase tracking-widest text-white/50">Conversion lift potential</span>
            </div>
          </div>

          <div data-dq-stagger className="lg:col-span-7 lg:col-start-6 border border-white/10 p-8 md:p-10 bg-white/[0.02] max-w-md">
            {['Full Name', 'Work Email', 'What are you looking to solve?'].map((label, i) => (
              <div key={label} className="mb-5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2 block">{label}</label>
                <div className={`w-full border-b border-white/20 ${i === 2 ? 'h-16' : 'h-9'}`} />
              </div>
            ))}
            <div className="mt-8 bg-[#AFEA00] text-black text-center py-4 text-xs font-bold uppercase tracking-widest">
              Book Strategy Call
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual Identity ──────────────────────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-dq-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">Solution 05</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Boardroom-grade minimalism.</h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl">
              A near-black canvas and a single signal-lime accent — restraint that reads as authority, not decoration.
            </p>
          </div>
          <div data-dq-stagger className="flex flex-wrap gap-6">
            {[
              { hex: '#0a0a0a', label: 'Near-black canvas' },
              { hex: '#AFEA00', label: 'Signal lime accent' },
              { hex: '#f5f5f2', label: 'Off-white text' },
              { hex: 'rgba(245,245,242,0.1)', label: 'Hairline dividers' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full shrink-0 border border-white/15" style={{ backgroundColor: c.hex }} />
                <span className="text-sm text-white/50">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes Table ────────────────────────────────────────────── */}
      <section className="py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-dq-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">Measurable Outcomes</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Legacy vs. engineered.</h2>
          </div>

          <div data-dq-stagger className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[720px]">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-white/40 border-b border-white/15">
                  <th className="py-4 pr-6">Feature</th>
                  <th className="py-4 pr-6">The Legacy</th>
                  <th className="py-4 pr-6">The Design</th>
                  <th className="py-4">Strategic Value</th>
                </tr>
              </thead>
              <tbody>
                {OUTCOMES.map((row) => (
                  <tr key={row.feature} className="border-b border-white/10 align-top">
                    <td className="py-6 pr-6 font-bold">{row.feature}</td>
                    <td className="py-6 pr-6 text-white/40">{row.legacy}</td>
                    <td className="py-6 pr-6 text-[#AFEA00]">{row.design}</td>
                    <td className="py-6 text-white/70">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-40 border-t border-white/10 text-center">
        <div data-dq-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Elevate your<br /><span className="text-[#AFEA00]">digital authority.</span></h2>
          <p className="text-xl text-white/50 mb-12 leading-relaxed">
            In the B2B landscape, your website is either a conversion engine or a leaky funnel. Let us build yours.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 bg-[#AFEA00] text-black font-bold uppercase tracking-widest text-sm px-10 py-6 hover:bg-white transition-colors"
          >
            Book Audit Call
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <div className="mt-10">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors group">
              More success blueprints
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DeQollabCaseStudy;
