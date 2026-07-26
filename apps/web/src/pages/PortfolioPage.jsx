import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AnimatedCounter from '@/components/AnimatedCounter.jsx';
import PortfolioIndexSection from '@/components/portfolio-variants/PortfolioIndexSection.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { portfolioProjects as projects } from '@/data/portfolioProjects.js';

gsap.registerPlugin(ScrollTrigger);

const PortfolioPage = () => {
  // Ticker tags derived from every project's category so the marquee scales
  // automatically as builds are added, instead of a hand-maintained list
  // that quietly goes stale (it used to hard-code just the original 3).
  const industries = Array.from(new Set(projects.flatMap((p) => p.category.split(' · '))));

  // Fonts swapping in after ScrollTrigger positions were first measured
  // shifts everything below the fold slightly — recalculate once they
  // settle so trigger points (especially for the card closest to the top)
  // don't fire against a stale layout.
  useEffect(() => {
    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <Helmet>
        <title>Success Blueprints - Infinity Pillars</title>
        <meta name="description" content="Real evidence of engineered systems driving measurable customer growth. Explore our Success Blueprints." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Hero */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-12">
              <SplitReveal text="Success" trigger="mount" />
              <SplitReveal
                text="Blueprints."
                trigger="mount"
                delay={0.28}
                className="text-muted-foreground italic font-medium"
              />
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  Real evidence of engineered systems driving measurable customer growth.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Marquee ticker — the industries behind every build below */}
        <section className="border-y border-border py-6 overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
          >
            {[0, 1].map((dupe) => (
              <div key={dupe} className="flex items-center animate-scroll" aria-hidden={dupe === 1}>
                {industries.map((tag) => (
                  <span key={tag} className="mx-6 text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-6">
                    {tag}
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio — editorial index, hover a title for a live preview */}
        <PortfolioIndexSection projects={projects} />

        {/* Stats */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {[
                { value: projects.length, suffix: '', label: 'Digital Products & Platforms Engineered' },
                { value: 17, suffix: '', label: 'Sectors Unified Into One Platform (deQollab)' },
                { value: 345, suffix: '+', label: 'Verified Media Placements Surfaced (deQollab)' },
                { value: 90, suffix: '%', label: 'Of a Diagnosed Community Reached (XpertPatient)' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 block"
                    duration={1.6}
                  />
                  <div className="text-xs font-bold uppercase tracking-widest text-background/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 bg-muted/20 text-center border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Let's Build Your Success Blueprint.</h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Tell us where your client acquisition is stalling. We'll present a custom engineering roadmap to scale your brand.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="#booking">Get in touch</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PortfolioPage;