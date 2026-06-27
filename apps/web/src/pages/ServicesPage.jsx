import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Compass, Palette, Code, TrendingUp, BarChart3, Megaphone } from 'lucide-react';
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
      id: 'seo-service',
      icon: Compass,
      title: 'SEO',
      description: 'Increase organic visibility and drive qualified traffic. We deploy technical, on-page, and off-page strategies that outrank your competitors and capture high-intent searchers.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'Comprehensive technical audits',
        'Keyword & competitor research',
        'On-page content optimization',
        'High-authority link building'
      ]
    },
    {
      id: 'ppc-advertising-service',
      icon: Palette,
      title: 'PPC Management',
      description: 'Maximize ROI with targeted paid advertising. We design, launch, and ruthlessly optimize paid search and display campaigns to lower your customer acquisition cost.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'Google Ads & Bing Ads',
        'Retargeting campaigns',
        'A/B testing ad creatives',
        'Conversion rate optimization'
      ]
    },
    {
      id: 'social-media-marketing-service',
      icon: Megaphone,
      title: 'Social Media Marketing',
      description: 'Build engaged communities and drive conversions. We craft paid and organic social strategies that stop the scroll and turn followers into loyal customers.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'Paid social (Meta, LinkedIn, TikTok)',
        'Audience targeting & segmentation',
        'Creative content production',
        'Community management'
      ]
    },
    {
      id: 'content-marketing-service',
      icon: Code,
      title: 'Content Marketing',
      description: 'Create valuable content that attracts and converts. From long-form blogs to engaging video scripts, we build content engines that establish your brand authority.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'Content strategy & calendars',
        'SEO-optimized blog writing',
        'Whitepapers & lead magnets',
        'Video & multimedia content'
      ]
    },
    {
      id: 'email-marketing-automation-service',
      icon: TrendingUp,
      title: 'Email Marketing',
      description: 'Nurture leads and drive repeat business. We design automated email sequences and broadcast campaigns that deliver personalized messaging at scale.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'Lifecycle drip campaigns',
        'List segmentation & hygiene',
        'Newsletter copywriting',
        'Cart abandonment flows'
      ]
    },
    {
      id: 'analytics-reporting-service',
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Data-driven insights for continuous improvement. We configure advanced tracking so you have crystal clear visibility into exactly what is driving your revenue.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      features: [
        'GA4 & Tag Manager setup',
        'Custom Looker Studio dashboards',
        'Funnel drop-off analysis',
        'Attribution modeling'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Services - Infinity Pillars Marketing</title>
        <meta name="description" content="From SEO and PPC to content and analytics, we offer comprehensive digital marketing services to help you scale your revenue." />
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
              Capabilities<br />
              <span className="text-muted-foreground italic font-medium">and focus.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  We offer end-to-end marketing solutions for building brand presence, capturing high-intent demand, and driving long-term revenue growth.
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
                      <Link to="/#booking">Book a Demo</Link>
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
              <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Ready to accelerate your growth?</h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                Let's discuss how our tailored marketing strategies can help you hit your revenue targets this quarter.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="/#booking">Book a Demo</Link>
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
              <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">How we execute</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                A disciplined methodology designed to minimize waste and maximize returns.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 text-left">
              {[
                {
                  number: '01',
                  title: 'Audit & Strategy',
                  description: 'We dissect your historical data, map your competitive landscape, and build a channel-specific roadmap.'
                },
                {
                  number: '02',
                  title: 'Deploy & Test',
                  description: 'We launch campaigns with rapid A/B testing frameworks to identify winning creatives and targeting.'
                },
                {
                  number: '03',
                  title: 'Scale & Optimize',
                  description: 'We double down on the highest ROI channels while ruthlessly cutting underperforming spend.'
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