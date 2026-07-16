import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LimeRevealSection from '@/components/LimeRevealSection.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const packages = [
    {
      number: '01',
      name: 'The Product Foundation Blueprint',
      description: 'A comprehensive transformation that transitions an idea from a rough business concept into a fully functional digital product — with the infrastructure to convert visitors into paying clients.',
      image: '/images/services/package-1',
      imageAlt: 'Connected product foundation — laptop, mobile app, sitemap, code and analytics modules linked together',
      deliverables: [
        'Product Strategy & User Journey Mapping',
        'Interactive UX Design Sprint (HiFi Figma Prototypes)',
        'Core Engineering & Infrastructure',
        'Go-To-Market Automation (WhatsApp API / CRM)',
      ],
    },
    {
      number: '02',
      name: 'The Scale & Scale-Up Ecosystem',
      description: 'Engineering multi-layered web systems integrated with product intelligence, data security, and team-building consulting — for organisations ready to move beyond early-stage.',
      image: '/images/services/package-2',
      imageAlt: 'Scaled ecosystem — dashboard, secured servers, AI automation, user management and growth analytics',
      deliverables: [
        'Full-Scale Product Architecture & Advanced UX',
        'Advanced Full-Stack Engineering & Data Security',
        'Product Talent Pipeline Strategy',
        'Automated Product Ops (AI Agents & Webhooks)',
      ],
    },
  ];

  const alaCarte = [
    {
      category: 'Product Strategy & UX Design',
      image: '/images/services/a-la-carte-1',
      imageAlt: 'Design tooling — browser wireframe, mobile mockup, Figma, analytics and user research',
      items: [
        { name: 'Brand Strategy & Identity System' },
        { name: 'Full UX Audit & Redesign' },
      ],
    },
    {
      category: 'Technical Engineering & Code',
      image: '/images/services/a-la-carte-2',
      imageAlt: 'Engineering stack — code editor, configuration, performance metering and databases',
      items: [
        { name: 'Custom Web App / Portal Development' },
        { name: 'WhatsApp API & CRM Integration' },
      ],
    },
    {
      category: 'Organisational Scaling',
      image: '/images/services/a-la-carte-3',
      imageAlt: 'Organisational scaling — team org chart, task checklist, workflow automation and integrations',
      items: [
        { name: 'Talent Acquisition Strategy' },
        { name: 'SOPs & Workflow Documentation' },
      ],
    },
  ];

  const intelligenceLayer = [
    {
      name: 'Custom-Trained AI Knowledge Agents',
      description: 'Deploy a trained AI interface on your site that qualifies leads, answers deep product questions, and routes high-intent visitors to a calendar — 24/7, without a salary.',
    },
    {
      name: 'Autonomous Calendar Routing',
      description: 'Automated scheduling flows that sync with your availability, send reminders, and reduce no-shows — integrated directly with your existing CRM or calendar stack.',
    },
    {
      name: 'Hyper-Automated Operations',
      description: 'Custom automation pipelines built on n8n, Zapier, or Make — connecting your product, CRM, comms, and reporting into a single operational backbone.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Core Offerings - Infinity Pillars</title>
        <meta name="description" content="Two focused engagement packages and a modular A-La-Carte menu — engineered for where your business is right now and where it needs to go next." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Hero */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-5xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-12">
              Core<br />
              <span className="text-muted-foreground italic font-medium">Offerings.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  Two focused packages. A modular A-La-Carte menu. And an Intelligence Layer that makes everything compound.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Packages */}
        <section className="py-24 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Engagement Packages</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Choose Your Starting Point</h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group border border-border flex flex-col overflow-hidden hover:border-[#AFEA00] transition-colors duration-300"
                >
                  {/* Visual header — full-bleed 3D render */}
                  <div className="aspect-[16/10] overflow-hidden bg-muted/30 border-b border-border">
                    <picture>
                      <source srcSet={`${pkg.image}.webp`} type="image/webp" />
                      <img
                        src={`${pkg.image}.png`}
                        alt={pkg.imageAlt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </picture>
                  </div>

                  <div className="p-10 md:p-12 flex flex-col gap-8 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-sm font-bold tracking-widest text-[#AFEA00]">{pkg.number}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{pkg.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{pkg.description}</p>
                    </div>
                    <div className="border-t border-border pt-8">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Deliverables</p>
                      <ul className="space-y-4">
                        {pkg.deliverables.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm">
                            <span className="text-[#AFEA00] mt-0.5 shrink-0">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-auto rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 h-12 text-sm uppercase tracking-widest font-bold"
                    >
                      <Link to="/#booking">Book Audit Call</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </section>

        {/* A-La-Carte */}
        <section className="py-32 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Modular Add-Ons</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">A-La-Carte Services</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Already have a package? Layer on exactly what you need — nothing more, nothing less.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-border">
              {alaCarte.map((category, catIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                  className={`group bg-background p-8 md:p-10 ${catIndex < alaCarte.length - 1 ? 'border-b lg:border-b-0 lg:border-r border-border' : ''}`}
                >
                  {/* Category visual */}
                  <div className="aspect-[16/10] overflow-hidden bg-muted/40 border border-border mb-8">
                    <picture>
                      <source srcSet={`${category.image}.webp`} type="image/webp" />
                      <img
                        src={`${category.image}.png`}
                        alt={category.imageAlt}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </picture>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-8">{category.category}</p>
                  <div className="space-y-6">
                    {category.items.map((item) => (
                      <div key={item.name} className="border-t border-border pt-6">
                        <span className="text-sm font-medium leading-snug">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Intelligence Layer */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">AI-Powered</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">The Intelligence Layer</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Autonomous systems that work while you sleep — qualifying leads, routing calendars, and running operations without manual input.
              </p>
            </motion.div>

            <div className="space-y-0">
              {intelligenceLayer.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-t border-border py-12"
                >
                  <div className="lg:col-span-1">
                    <span className="text-sm font-bold tracking-widest text-[#AFEA00]">0{index + 1}</span>
                  </div>
                  <div className="lg:col-span-4">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{item.name}</h3>
                  </div>
                  <div className="lg:col-span-7">
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-20 pt-12 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
            >
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Not sure where to start?</h3>
                <p className="text-muted-foreground">Book a 30-minute audit call. We'll map the right entry point for your business.</p>
              </div>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-10 py-8 text-base shadow-editorial shrink-0"
              >
                <Link to="/#booking">Book Audit Call <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Lime Reveal */}
        <LimeRevealSection className="py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-bold tracking-widest uppercase mb-10" style={{ color: '#111' }}>
              Our Execution Standard
            </p>
            <h2
              className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[0.9] mb-14 mx-auto max-w-4xl"
              style={{ color: '#111' }}
            >
              Every deliverable.<br />
              <span style={{ color: '#111', opacity: 0.5 }}>Tied to a metric.</span>
            </h2>
            <p className="text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto mb-16" style={{ color: '#222' }}>
              If it cannot be measured, we do not build it. Every engagement starts with a clear success benchmark and ends with verified results.
            </p>
            <Link
              to="/#booking"
              className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm border-b-2 pb-1 transition-opacity hover:opacity-70"
              style={{ borderColor: '#111', color: '#111' }}
            >
              Start your engagement
            </Link>
          </div>
        </LimeRevealSection>

        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;
