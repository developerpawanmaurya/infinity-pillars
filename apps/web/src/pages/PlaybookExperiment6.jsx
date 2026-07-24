import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LimeRevealSection from '@/components/LimeRevealSection.jsx';
import ThreeTunnelSection from '@/components/ThreeTunnelSection.jsx';
import StackedProcessSection from '@/components/StackedProcessSection.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Copy of the Playbook page — the Hero Image section is replaced with
// Copy of the Playbook page — the Hero Image (tunnel) section is replaced with
// a scroll-driven stacked process section using GSAP. The Five Phases
// section remains in its original form.
const PlaybookExperiment6 = () => {
  const steps = [
    {
      step: '01',
      title: 'The Discovery & Audit Phase',
      description: 'We audit your current digital footprint, analyze competitor gaps, and map a strict data-backed strategy tailored to your revenue goals.',
      detail: 'Before a single line of code is written, we study your market position with precision. We identify where competitors are winning, where your brand is leaking revenue, and define the exact levers we will pull to reverse that.'
    },
    {
      step: '02',
      title: 'UX/UI Interactive Design',
      description: "We prototype your complete user journey in high-fidelity Figma — designed around conversion psychology, not aesthetic preference.",
      detail: "Every screen, every interaction, every micro-copy decision is engineered to reduce friction and move users toward a single action: converting. We present interactive prototypes so you can validate the experience before a line of code is written."
    },
    {
      step: '03',
      title: 'Full-Stack System Engineering',
      description: 'We build and deploy your high-speed web engine, API integrations, automation flows, and data infrastructure — tested before any go-live.',
      detail: 'We do not launch and disappear. We monitor live performance data, confirm that all integrations are firing correctly, and run QA across every device and browser before handing you the keys.'
    },
    {
      step: '04',
      title: 'Growth Optimization Retainer',
      description: 'Post-launch, we continuously audit performance, refine AI prompts, and optimize every layer to compound your returns over time.',
      detail: 'Markets shift. Algorithms update. Competitor behaviour changes. Our retainer keeps your digital infrastructure adaptive — always performing, always qualifying, always converting at the highest possible rate.'
    },
    {
      step: '05',
      title: 'Growth Operations & Talent Consulting',
      description: 'We help you build the internal team, processes, and operational systems required to sustain growth beyond our engagement.',
      detail: 'Sustainable growth requires the right people in the right seats. We consult on hiring, onboarding, and building internal capability — so that when our active engagement ends, your team can carry the momentum forward independently.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>The Playbook — Experiment 6</title>
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

        {/* The 5-Step Playbook — Stacked & Scroll Driven (Replaced Tunnel Section) */}
        <StackedProcessSection />

        {/* The 4-Step Playbook (Original Form) */}
        <section className="py-32 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">The Five Phases</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Every engagement follows the same disciplined sequence. No shortcuts. No guesswork. Just a repeatable system that produces results.
              </p>
            </motion.div>

            <div className="space-y-0">
              {steps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-border py-16"
                >
                  <div className="lg:col-span-1">
                    <div className="text-sm font-bold tracking-widest text-[#AFEA00]">{item.step}</div>
                  </div>
                  <div className="lg:col-span-4">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{item.title}</h3>
                  </div>
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-lg font-medium leading-relaxed">{item.description}</p>
                    <p className="text-lg text-muted-foreground leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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

export default PlaybookExperiment6;
