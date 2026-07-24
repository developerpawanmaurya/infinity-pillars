import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LimeRevealSection from '@/components/LimeRevealSection.jsx';
import WindingProcessSection from '@/components/WindingProcessSection.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Copy of the Playbook page — the Hero Image (tunnel) section is replaced with
// a scroll-driven winding process section using GSAP MotionPath. The standard 
// Five Phases section is removed as this serves as the process sequence.
const PlaybookExperiment7 = () => {

  return (
    <>
      <Helmet>
        <title>The Playbook — Experiment 7</title>
        <meta name="description" content="A systematic, zero-guesswork approach designed to build digital assets that scale. Discover how Infinity Pillars engineers your growth." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Hero Section*/}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-12">
              The Playbook:<br />
              <span className="text-muted-foreground italic font-medium">Our Work Philosophy.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  A systematic, zero-guesswork approach designed to build digital assets that scale.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* The 5-Step Playbook — Winding Line & Rolling Ball (Replaced Tunnel Section & Standard Process) */}
        <WindingProcessSection />

        {/* Lime Reveal — Philosophy Statement */}
        <LimeRevealSection className="pt-[120px] sm:pt-[160px] md:pt-[200px] pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
              <div className="lg:col-span-5">
                <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: '#111' }}>
                  Why It Works
                </p>
                <h2
                  className="text-4xl md:text-6xl font-bold tracking-tighter leading-[0.9]"
                  style={{ color: '#111' }}
                >
                  Disconnected tools compete.<br />
                  <span style={{ color: '#111', opacity: 0.5 }}>Systems compound.</span>
                </h2>
              </div>

              <div className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-8 text-lg leading-relaxed" style={{ color: '#222' }}>
                  <p>
                    Most agencies deploy tactics in isolation. A website here. A Google Ads campaign there. A chatbot bolted on as an afterthought. The result is a collection of disconnected tools that compete for your budget and deliver fragmented results.
                  </p>
                  <p>
                    Our Playbook is built on a different premise: your digital assets should function as a single, integrated revenue system. Your website captures. Your GMB profile qualifies intent. Your AI agent converts — 24 hours a day, 7 days a week, without a salary.
                  </p>
                  <p>
                    When all three pillars work together, the result is compounding growth — not a short-term spike that fades when the ad spend stops.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </LimeRevealSection>

        {/* CTA */}
        <section className="py-40 bg-foreground text-background text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Let's run the playbook for you.</h2>
              <p className="text-xl text-background/70 mb-12 leading-relaxed">
                Tell us where your client acquisition is stalling. We'll skip the generic sales pitch and present a custom engineering roadmap to scale your brand.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="#booking">Book Audit Call</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PlaybookExperiment7;
