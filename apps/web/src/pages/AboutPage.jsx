import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const steps = [
    {
      step: '01',
      title: 'The Discovery & Audit Phase',
      description: 'We audit your local visibility, analyze competitor weaknesses, and map out a strict data-backed pipeline strategy tailored for revenue expansion.',
      detail: 'Before a single line of code is written or a single campaign is launched, we study your market position with precision. We review your current digital footprint, identify where competitors are winning, and define the exact revenue levers we will pull.'
    },
    {
      step: '02',
      title: 'The UI/UX & Integration Sprint',
      description: "We build interactive Figma prototypes of your user's journey, configure GMB architectures, and train your custom AI agent on your exact business documentation.",
      detail: "Every customer touchpoint is designed with conversion psychology at its core. Your AI agent is trained on your product, your pricing, and your objection-handling logic — so it speaks like your best sales rep, available 24/7."
    },
    {
      step: '03',
      title: 'Launch & Pipeline Calibration',
      description: 'We deploy your high-speed web engine, sync API pathways to your WhatsApp Business app/CRM, and set up tracking to measure real pipeline value.',
      detail: 'We do not launch and disappear. We monitor live performance data, confirm that lead routing is working correctly, and make real-time adjustments to ensure your pipeline is generating qualified inquiries from day one.'
    },
    {
      step: '04',
      title: 'Growth Optimization Retainer',
      description: 'We continuously audit search algorithms, optimize your local Google Map rankings, and tune AI prompts to maximize lead-to-close conversions.',
      detail: 'Markets shift. Algorithms update. Competitor behavior changes. Our retainer keeps your digital infrastructure adaptive — always ranking, always qualifying, always converting at the highest possible rate.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>The Playbook - Infinity Pillars</title>
        <meta name="description" content="A systematic, zero-guesswork approach designed to build digital assets that scale. Discover how Infinity Pillars engineers your growth." />
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

        {/* Hero Image */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="editorial-frame mx-auto max-w-5xl transform -rotate-1 hover:rotate-0 transition-transform duration-700"
          >
            <img
              src="https://images.unsplash.com/photo-1567080185975-88eedc2b273a"
              alt="Infinity Pillars team at work building digital infrastructure"
              className="w-full h-[400px] md:h-[600px] object-cover grayscale-[30%]"
            />
          </motion.div>
        </section>

        {/* The 4-Step Playbook */}
        <section className="py-32 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">The Four Phases</h2>
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
                    <div className="text-sm font-bold tracking-widest text-muted-foreground">{item.step}</div>
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

        {/* Philosophy Statement */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5"
              >
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">
                  Why This Approach Works
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 lg:col-start-7"
              >
                <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
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
              </motion.div>
            </div>
          </div>
        </section>

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
                className="bg-background text-foreground hover:bg-background/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="/#booking">Book Audit Call</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
