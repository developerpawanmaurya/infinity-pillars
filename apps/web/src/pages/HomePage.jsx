import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [rotatingText, setRotatingText] = useState(0);
  const audiences = ['E-commerce Brands.', 'SaaS Companies.', 'Local Businesses.', 'B2B Enterprises.', 'Startups.'];

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingText((prev) => (prev + 1) % audiences.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const services = [
    {
      title: 'Search Engine Optimization',
      description: 'Increase organic visibility, outrank competitors, and drive highly qualified traffic to your website.',
      link: '/services'
    },
    {
      title: 'Pay-Per-Click Advertising',
      description: 'Maximize your ROI with hyper-targeted paid advertising campaigns across Google, Bing, and beyond.',
      link: '/services'
    },
    {
      title: 'Social Media Marketing',
      description: 'Build engaged communities, amplify brand awareness, and drive conversions through strategic social content.',
      link: '/services'
    }
  ];

  const results = [
    { metric: '342%', label: 'Average ROI increase' },
    { metric: '2.8M', label: 'Impressions generated' },
    { metric: '87%', label: 'Client retention' },
    { metric: '500+', label: 'Campaigns launched' }
  ];

  const process = [
    {
      step: '01',
      title: 'Strategy',
      description: 'We audit your current performance, analyze competitors, and build a data-backed marketing roadmap.'
    },
    {
      step: '02',
      title: 'Setup',
      description: 'We implement tracking, build target audiences, and create compelling ad creatives and copy.'
    },
    {
      step: '03',
      title: 'Optimization',
      description: 'We continuously test, measure, and refine campaigns to drive down acquisition costs and boost conversions.'
    },
    {
      step: '04',
      title: 'Reporting',
      description: 'We provide transparent, real-time dashboards so you always know exactly how your investment is performing.'
    }
  ];

  const showcaseProjects = [
    {
      title: 'E-commerce SEO Overhaul',
      category: 'Organic Growth',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      rotation: '-rotate-3',
      margin: 'mt-0'
    },
    {
      title: 'SaaS PPC Campaign',
      category: 'Paid Acquisition',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      rotation: 'rotate-2',
      margin: 'mt-16 md:mt-32'
    },
    {
      title: 'Social Media Growth Strategy',
      category: 'Community & Brand',
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
        <title>Infinity Pillars - Digital Marketing Agency That Drives Real Results</title>
        <meta name="description" content="We partner with ambitious companies to deploy data-driven marketing strategies that increase visibility, reduce acquisition costs, and maximize ROI." />
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
              <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-12">
                Digital Marketing<br />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 border-t border-border pt-12">
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  We deploy data-driven online marketing strategies that increase visibility, reduce acquisition costs, and maximize your return on investment.
                </p>
                <div className="flex flex-col items-start md:items-end justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] text-lg rounded-none px-10 py-8 shadow-editorial"
                  >
                    <Link to="/#booking">Book a Marketing Consultation</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Local Businesses Marquee Section */}
        <section className="py-10 border-t border-border bg-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 fade-left-edge">
              {/* First Track */}
              <div className="flex shrink-0 animate-scroll gap-8 items-center justify-between min-w-full">
                {localBusinesses.map((logo, idx) => (
                  <span key={`logo-1-${idx}`} className="text-lg md:text-xl font-bold tracking-widest uppercase text-muted-foreground/60 whitespace-nowrap">
                    {logo}
                  </span>
                ))}
              </div>
              {/* Duplicated Track for Seamless Loop */}
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

        {/* Results Bar */}
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {results.map((item, index) => (
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

        {/* Featured Services */}
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 sticky top-32">
                What we do
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Comprehensive marketing services designed to work together or stand alone. We focus strictly on channels that deliver ROI.
              </p>
            </motion.div>

            <div className="lg:col-span-8 flex flex-col gap-12">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex flex-col md:flex-row gap-8 items-start border-t border-border pt-12"
                >
                  <div className="text-2xl text-muted-foreground/50 font-medium">0{index + 1}</div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold tracking-tight mb-4 group-hover:text-muted-foreground transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-xl">
                      {service.description}
                    </p>
                    <Link
                      to={service.link}
                      className="inline-flex items-center gap-2 font-medium uppercase tracking-widest text-sm hover:gap-4 transition-all duration-300"
                    >
                      Learn more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Work Preview */}
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
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Featured campaigns</h2>
                <p className="text-xl text-muted-foreground max-w-xl">
                  A selection of recent marketing initiatives that drove measurable growth.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-all duration-300 px-8 py-6 text-base"
              >
                <Link to="/portfolio">
                  View archive
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
                          alt={`${project.title} minimalist one-line art design`}
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
              "Infinity Pillars completely overhauled our digital acquisition channels. Within six months, our cost-per-lead dropped by 42% while our total lead volume tripled."
            </blockquote>
            <div>
              <div className="font-bold uppercase tracking-widest mb-1">Marcus Johnson</div>
              <div className="text-muted-foreground text-sm">VP of Marketing, Canopy</div>
            </div>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Our Campaign Process</h2>
              <p className="text-xl text-background/70 max-w-2xl">
                A rigorous, data-informed methodology that removes guesswork from growth.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
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

        {/* Booking CTA Section (Replaces inline form) */}
        <section className="py-40 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Let's talk growth.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Tell us about your current marketing challenges and revenue goals. We'll schedule a consultation to discuss your growth potential.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial inline-flex"
            >
              <Link to="/#booking">Book a Marketing Consultation</Link>
            </Button>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;