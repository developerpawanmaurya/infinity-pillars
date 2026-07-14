import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LimeRevealSection from '@/components/LimeRevealSection.jsx';
import ShootingGameSection from '@/components/ShootingGameSection.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [rotatingText, setRotatingText] = useState(0);
  const audiences = ['E-commerce Brands.', 'Local Businesses.', 'Startups.'];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingText((prev) => (prev + 1) % audiences.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  const packages = [
    {
      number: '01',
      name: 'The Product Foundation Blueprint',
      description: 'A comprehensive transformation that transitions an idea from a rough business concept into a fully functional digital product.',
      deliverables: [
        'Product Strategy & User Journey Mapping',
        'Interactive UX Design Sprint (HiFi Figma Prototypes)',
        'Core Engineering & Infrastructure',
        'Go-To-Market Automation (WhatsApp API / CRM)',
      ],
      linkText: 'Start Your Foundation',
      link: '/services',
    },
    {
      number: '02',
      name: 'The Scale & Scale-Up Ecosystem',
      description: 'Engineering multi-layered web systems integrated with product intelligence and team-building consulting.',
      deliverables: [
        'Full-Scale Product Architecture & Advanced UX',
        'Advanced Full-Stack Engineering & Data Security',
        'Product Talent Pipeline Strategy',
        'Automated Product Ops (AI Agents & Webhooks)',
      ],
      linkText: 'Build Your Ecosystem',
      link: '/services',
    },
  ];

  const metrics = [
    { metric: '342%', label: 'Average ROI Increase' },
    { metric: '2.8M+', label: 'High-Intent Impressions Generated' },
    { metric: '87%', label: 'Long-Term Client Retention Rate' },
    { metric: '500+', label: 'Data-Driven Campaigns & Architectures Launched' }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Audit',
      description: 'We audit your current digital footprint, analyze competitor gaps, and map a data-backed strategy tailored to your revenue goals.'
    },
    {
      step: '02',
      title: 'UX/UI Interactive Design',
      description: 'We prototype your complete user journey in high-fidelity Figma — designed around conversion psychology, not aesthetic preference.'
    },
    {
      step: '03',
      title: 'Full-Stack System Engineering',
      description: 'We build and deploy your high-speed web engine, API integrations, and automation flows — tested before any go-live.'
    },
    {
      step: '04',
      title: 'Growth Optimization Retainer',
      description: 'Post-launch, we continuously audit performance, tune AI prompts, and optimize every layer to compound your returns.'
    },
    {
      step: '05',
      title: 'Growth Operations & Talent Consulting',
      description: 'We help you build the internal team and operational systems to sustain growth beyond our engagement.'
    }
  ];

  const showcaseProjects = [
    {
      title: 'Web Conversion Overhaul',
      category: 'Web Architecture',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      rotation: '-rotate-3',
      margin: 'mt-0'
    },
    {
      title: 'GMB Local Dominance',
      category: 'Local SEO',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      rotation: 'rotate-2',
      margin: 'mt-16 md:mt-32'
    },
    {
      title: 'AI Lead Automation',
      category: 'AI Agents',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      rotation: '-rotate-1',
      margin: 'mt-16'
    }
  ];

  const localBusinesses = [
    'The Daily Brew Coffee',
    'Riverside Bakery',
    'Pinch of Spice',
    'Urban Tech Solutions',
    'Green Leaf Landscaping',
    'Coastal Fitness Studio',
    'Artisan Woodworks',
    'Bloom & Petals Florist',
    'Swift Delivery Co'
  ];

  return (
    <>
      <Helmet>
        <title>Infinity Pillars - Digital Infrastructure That Captures, Qualifies, and Closes Leads</title>
        <meta name="description" content="We engineer high-conversion websites, establish undisputed Google Business authority, and deploy autonomous B2B AI agents that engage leads 24/7." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-32 overflow-hidden">
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-6xl"
            >
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-8">
                Digital Infrastructure<br />
                Agency for<br />
                <span className="inline-block relative min-w-[350px]">
                  <motion.span
                    key={rotatingText}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-0 text-muted-foreground italic font-medium"
                  >
                    {audiences[rotatingText]}
                  </motion.span>
                  <span className="invisible">{audiences[0]}</span>
                </span>
              </h1>

              <p className="text-2xl md:text-3xl font-medium tracking-tight text-foreground/80 mt-6 mb-12 max-w-4xl">
                We Build the Digital Infrastructure That Captures, Qualifies, and Closes Your Next Lead.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-border pt-12">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  We engineer high-conversion websites, establish undisputed Google Business authority, and deploy autonomous B2B AI agents that engage leads 24/7. No vanity metrics. No fluff. Just digital assets that work to scale your revenue.
                </p>
                <div className="flex flex-col items-start md:items-end justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-lg rounded-none px-10 py-8 shadow-editorial"
                  >
                    <Link to="/#booking">Book Audit Call</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Banner + Local Businesses Marquee */}
        <section className="py-10 border-t border-border bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground/60 mb-6 text-center">
              Validated by Ambitious Brands
            </p>
            <div className="flex gap-8 fade-left-edge">
              <div className="flex shrink-0 animate-scroll gap-8 items-center justify-between min-w-full">
                {localBusinesses.map((logo, idx) => (
                  <span key={`logo-1-${idx}`} className="text-lg md:text-xl font-bold tracking-widest uppercase text-muted-foreground/60 whitespace-nowrap">
                    {logo}
                  </span>
                ))}
              </div>
              <div className="flex shrink-0 animate-scroll gap-8 items-center justify-between min-w-full" aria-hidden="true">
                {localBusinesses.map((logo, idx) => (
                  <span key={`logo-2-${idx}`} className="text-lg md:text-xl font-bold tracking-widest uppercase text-muted-foreground/60 whitespace-nowrap">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Core Metrics Bar */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {metrics.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <div className="text-5xl md:text-6xl font-bold tracking-tighter mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {item.metric}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Offerings Section */}
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Core Offerings</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Two focused packages, engineered for where you are right now — and where you need to be next.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="border border-border p-10 flex flex-col gap-8 hover:border-[#AFEA00] transition-colors duration-300"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold tracking-widest text-[#AFEA00]">{pkg.number}</span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{pkg.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
                </div>
                <ul className="space-y-3 border-t border-border pt-8">
                  {pkg.deliverables.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="text-[#AFEA00] mt-0.5 shrink-0">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={pkg.link}
                  className="mt-auto inline-flex items-center gap-2 font-medium uppercase tracking-widest text-sm hover:gap-4 transition-all duration-300"
                >
                  {pkg.linkText} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium uppercase tracking-widest transition-colors duration-300"
            >
              View A-La-Carte & Intelligence Layer <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        {/* Success Blueprints Preview */}
        <section className="py-32 bg-muted/20 overflow-hidden border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
            >
              <div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Success Blueprints</h2>
                <p className="text-xl text-muted-foreground max-w-xl">
                  Real evidence of engineered systems driving measurable customer growth.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 px-8 py-6 text-base"
              >
                <Link to="/portfolio">
                  View Performance Archive
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {showcaseProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className={`${project.margin}`}
                >
                  <Link to="/portfolio" className="block group">
                    <div className={`transition-all duration-500 transform ${project.rotation} group-hover:rotate-0 group-hover:-translate-y-4`}>
                      <div className="editorial-frame">
                        <img
                          src={project.image}
                          alt={`${project.title} case study`}
                          className="w-full h-[400px] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                    </div>
                    <div className="mt-8 text-center md:text-left">
                      <div className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-3">
                        {project.category}
                      </div>
                      <h3 className="text-2xl font-bold tracking-tighter">
                        {project.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Lime Reveal — "Why Us" */}
        <LimeRevealSection className="py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              <div className="lg:col-span-7">
                <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: '#111' }}>
                  Why Us
                </p>
                <h2
                  className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-10"
                  style={{ color: '#111' }}
                >
                  Most web shops<br />build pages.<br />
                  <span style={{ color: '#111', opacity: 0.5 }}>We architect digital assets.</span>
                </h2>
              </div>
              <div className="lg:col-span-5 flex flex-col gap-10 lg:pt-16">
                {[
                  {
                    title: 'Product-Led, Not Trend-Led',
                    body: 'We build around your business model and revenue logic — not whatever design trend is popular this quarter.'
                  },
                  {
                    title: 'Systems, Not Campaigns',
                    body: 'Campaigns stop the moment budgets run dry. Our infrastructure compounds — earning attention, trust, and revenue long after launch.'
                  },
                  {
                    title: 'Measurable from Day One',
                    body: 'Every deliverable is tied to a metric. If it cannot be measured, we do not build it.'
                  },
                ].map((anchor) => (
                  <div key={anchor.title} className="border-t-2 pt-6" style={{ borderColor: '#111' }}>
                    <div className="text-base font-bold tracking-tight mb-2" style={{ color: '#111' }}>
                      {anchor.title}
                    </div>
                    <div className="text-sm leading-relaxed" style={{ color: '#333' }}>
                      {anchor.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </LimeRevealSection>

        {/* Testimonial Highlight */}
        <section className="py-40 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-primary mb-12">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto opacity-30"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>
            </div>
            <blockquote className="text-3xl md:text-5xl font-medium tracking-tight leading-tight mb-12">
              "Infinity Pillars did not just hand us a website and walk away. They rebuilt our entire customer intake pipeline. Within six months, our local Google Map inquiries surged, our AI agent qualified and booked over 200 leads without staff manual hours, and our client acquisition costs plummeted by 42%."
            </blockquote>
            <div>
              <div className="font-bold uppercase tracking-widest mb-1">Verified Partner</div>
              <div className="text-muted-foreground text-sm">Infinity Pillars Client</div>
            </div>
          </motion.div>
        </section>

        {/* The Playbook - Process Section */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">The Playbook: Our Work Philosophy</h2>
              <p className="text-xl text-background/70 max-w-2xl">
                A systematic, zero-guesswork approach designed to build digital assets that scale.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-t border-background/20 pt-8"
                >
                  <div className="text-sm font-bold tracking-widest text-background/50 mb-6">{item.step}</div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{item.title}</h3>
                  <p className="text-background/70 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-40 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Stop wasting capital on generic developments which don't understand your business roadmap.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Let's build your digital infrastructure.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial inline-flex"
            >
              <Link to="/#booking">Book Audit Call</Link>
            </Button>
          </motion.div>
        </section>

        <ShootingGameSection />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
