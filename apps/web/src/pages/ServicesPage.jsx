import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Globe, MapPin, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

const ServicesPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle cross-page navigation with scroll target
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          
          const headline = element.querySelector('h2');
          if (headline) {
            headline.style.transition = 'color 0.5s ease-in-out';
            headline.classList.add('text-primary');
            setTimeout(() => {
              headline.classList.remove('text-primary');
              headline.style.transition = '';
            }, 2000);
          }
        }
      }, 300); // Allow initial animations/layout to settle
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const services = [
    {
      id: 'web-architecture-service',
      icon: Globe,
      title: 'Conversion-First Web Architecture & UX',
      description: "We design and build ultra-fast, responsive web platforms custom-built around your user's psychology. We turn passive visitors into immediate phone calls, form submissions, and booked calendar appointments.",
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'High-conversion page design & UX mapping',
        'Speed optimization & Core Web Vitals',
        'Phone, form & calendar conversion flows',
        'Responsive mobile-first architecture'
      ]
    },
    {
      id: 'gmb-seo-service',
      icon: MapPin,
      title: 'Google Local Map Dominance & GMB SEO',
      description: 'When target buyers search for your services, we make sure you are the undisputed, highly rated choice in the top 3 Google Map spots. We turn search intent into physical foot traffic and inbound inquiries.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'Google Business Profile optimization',
        'Local Map Pack ranking strategy',
        'Review generation & management',
        'Local citation building & authority'
      ]
    },
    {
      id: 'ai-agents-service',
      icon: Zap,
      title: 'Autonomous B2B AI Agents & Automation',
      description: 'Form fills are too slow. We deploy custom-trained AI interfaces onto your website that act as continuous, round-the-clock sales reps—answering deep technical questions, qualifying high-value leads, and auto-booking sales calls.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'Custom-trained AI chatbot deployment',
        '24/7 lead qualification & filtering',
        'Auto-booking & CRM integration',
        'Deep technical Q&A handling'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Core Offerings - Infinity Pillars</title>
        <meta name="description" content="We deploy integrated systems engineered to work together as a seamless sales team — web architecture, GMB SEO, and autonomous AI agents." />
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
              Core<br />
              <span className="text-muted-foreground italic font-medium">Offerings.</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  Static websites and simple ad campaigns no longer work in 2026. We deploy integrated systems engineered to work together as a seamless sales team.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Services Grid (Aligned minimal cards) */}
        <section className="py-24 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  id={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-card p-8 md:p-12 border border-border flex flex-col h-full shadow-sm hover:shadow-editorial transition-all duration-300 scroll-mt-24"
                >
                  <div className="editorial-frame mb-10 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-48 object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <service.icon className="w-8 h-8 text-foreground" strokeWidth={1.5} />
                    <h2 className="text-3xl font-bold tracking-tight">{service.title}</h2>
                  </div>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                    {service.description}
                  </p>

                  <div className="border-t border-border pt-8 mb-8">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Deliverables</div>
                    <ul className="space-y-4">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-4">
                          <span className="w-1 h-1 bg-foreground rounded-full mt-2.5 flex-shrink-0"></span>
                          <span className="text-foreground font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-4">
                    <Button 
                      asChild 
                      variant="outline"
                      className="w-full rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 h-12 text-sm uppercase tracking-widest font-bold"
                    >
                      <Link to="/#booking">Book Audit Call</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Prominent Section CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-32 text-center"
            >
              <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Ready to build your digital engine?</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                Tell us where your client acquisition is stalling. We'll present a custom engineering roadmap to scale your brand.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="/#booking">Book Audit Call</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Process Overview */}
        <section className="py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">The Playbook Process</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A systematic, zero-guesswork approach designed to build digital assets that scale.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 text-left">
              {[
                {
                  number: '01',
                  title: 'Discovery & Audit',
                  description: 'We audit your local visibility, analyze competitor weaknesses, and map out a strict data-backed pipeline strategy tailored for revenue expansion.'
                },
                {
                  number: '02',
                  title: 'Build & Configure',
                  description: 'We construct your web infrastructure, configure GMB architectures, and train your custom AI agent on your exact business documentation.'
                },
                {
                  number: '03',
                  title: 'Launch & Optimize',
                  description: 'We deploy your high-speed web engine, sync API pathways to your CRM, and continuously optimize to maximize lead-to-close conversions.'
                }
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="border-t border-border pt-8"
                >
                  <div className="text-sm font-bold tracking-widest text-muted-foreground mb-6">{step.number}</div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ServicesPage;