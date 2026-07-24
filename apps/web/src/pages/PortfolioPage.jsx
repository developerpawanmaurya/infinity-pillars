import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AnimatedCounter from '@/components/AnimatedCounter.jsx';
import PortfolioCaseCard from '@/components/PortfolioCaseCard.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const PortfolioPage = () => {
  const projects = [
    {
      title: 'deQollab',
      slug: 'deqollab',
      category: 'Strategic Communications · Brand Authority',
      description: 'A premium PR & comms agency needed a digital presence to match their real-world prestige. We organized a 17-sector portfolio into a seamless, minimalist experience built to command premium retainer fees.',
      image: '/images/DeQollab.png',
      liveUrl: 'https://deqollab.com/',
      metrics: ['17 sectors unified', '345+ verified media placements', '9–12% CVR lift potential'],
      rotation: 'rotate-2',
      dark: true
    },
    {
      title: 'KISS Professional Solutions',
      slug: 'kiss-professional-solutions',
      category: 'Enterprise Lead Generation · Office Technology',
      description: 'An Australian office tech & managed services provider needed to unify diverse enterprise verticals under one brand. We deployed an 8-step interactive quote engine and a self-service support bot.',
      image: '/images/KISS.png',
      liveUrl: 'https://kissps.com.au/',
      metrics: ['3,000+ organizations served', '8-step quote engine', '5 regional offices unified'],
      rotation: '-rotate-2',
      dark: false
    },
    {
      title: 'XpertPatient.com',
      slug: 'xpertpatient',
      category: 'Healthcare · Empathetic UX',
      description: 'An award-winning oncology education platform translating dense clinical guidelines into calm, intuitive digital experiences for newly diagnosed patients and caregivers.',
      image: '/images/XpertPatient.png',
      liveUrl: 'https://xpertpatient.com/',
      metrics: ['Stevie Award winner', '90% of diagnosed community supported', 'WCAG 2.1 AA / ADA compliant'],
      rotation: 'rotate-1',
      dark: false
    }
  ];

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

        {/* Marquee ticker — the industries behind the three flagship builds below */}
        <section className="border-y border-border py-6 overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
          >
            {[0, 1].map((dupe) => (
              <div key={dupe} className="flex items-center animate-scroll" aria-hidden={dupe === 1}>
                {['Strategic Communications', 'Office Technology & Managed Services', 'Oncology Patient Education', 'Brand Authority', 'Enterprise Lead Generation', 'Empathetic Healthcare UX'].map((tag) => (
                  <span key={tag} className="mx-6 text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-6">
                    {tag}
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Grid (Editorial / Scattered Layout) */}
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-40 md:space-y-56">
              {projects.map((project, index) => (
                <PortfolioCaseCard key={project.title} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {[
                { value: 3, suffix: '', label: 'Custom Digital Ecosystems Engineered' },
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