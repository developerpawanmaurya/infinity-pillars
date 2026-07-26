import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import PortfolioQuietCardsSection from '@/components/portfolio-variants/PortfolioQuietCardsSection.jsx';
import PortfolioVariantSwitcher from '@/components/portfolio-variants/PortfolioVariantSwitcher.jsx';
import { portfolioProjects } from '@/data/portfolioProjects.js';

gsap.registerPlugin(ScrollTrigger);

// Comparison build — Quiet Cards variant. Throwaway route, see
// PortfolioVariantSwitcher for context. Delete once a variant ships.
const PortfolioPreviewCardsPage = () => {
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.85, smoothWheel: true, smoothTouch: !isTouch });
    lenis.on('scroll', ScrollTrigger.update);
    const rafFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafFn);

    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Portfolio Preview — Quiet Cards</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <section className="pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
              <SplitReveal text="Success" trigger="mount" />
              <SplitReveal text="Blueprints." trigger="mount" delay={0.28} className="text-muted-foreground italic font-medium" />
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Quiet Cards — single column, minimal motion, the restrained baseline.
            </p>
          </motion.div>
        </section>

        <PortfolioQuietCardsSection projects={portfolioProjects} />

        <Footer />
      </div>

      <PortfolioVariantSwitcher active="cards" />
    </>
  );
};

export default PortfolioPreviewCardsPage;
