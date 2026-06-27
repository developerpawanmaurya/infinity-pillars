import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PortfolioPage = () => {
  const projects = [
    {
      title: 'E-commerce SEO Overhaul',
      slug: 'ecommerce-seo-overhaul',
      category: 'Organic Growth',
      description: 'Challenge: Low organic visibility and declining traffic. Strategy: Comprehensive technical SEO cleanup paired with a high-intent content marketing strategy.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      metrics: ['287% traffic increase', '156% revenue lift', 'Top 3 rankings'],
      rotation: 'rotate-2'
    },
    {
      title: 'SaaS PPC Campaign',
      slug: 'saas-ppc-campaign',
      category: 'Paid Acquisition',
      description: 'Challenge: Unsustainably high customer acquisition cost. Strategy: Refined audience targeting, negative keyword expansion, and strict landing page CRO.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      metrics: ['312% ROI', '42% CAC reduction', '2x trial volume'],
      rotation: '-rotate-2'
    },
    {
      title: 'Social Media Growth',
      slug: 'social-media-growth',
      category: 'Brand Awareness',
      description: 'Challenge: Stagnant community and low engagement rates. Strategy: Video-first content strategy mixed with active community management and influencer partnerships.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      metrics: ['450% follower growth', '8.2% engagement rate', '1.2M video views'],
      rotation: 'rotate-1'
    },
    {
      title: 'Content Marketing Strategy',
      slug: 'content-marketing-success',
      category: 'Inbound Leads',
      description: 'Challenge: Poor brand awareness in a crowded B2B market. Strategy: Educational blog series combined with high-value video assets and lead magnets.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      metrics: ['2.1M impressions', '340 qualified leads', '45% bounce drop'],
      rotation: '-rotate-3'
    },
    {
      title: 'Email Marketing Automation',
      slug: 'email-marketing-automation',
      category: 'Lifecycle Marketing',
      description: 'Challenge: Low customer retention and repeat purchase rates. Strategy: Dynamic list segmentation, automated cart recovery, and personalized post-purchase flows.',
      image: 'https://images.unsplash.com/photo-1697893156187-8598ba865712',
      metrics: ['34% open rate', '8.7% click rate', '22% repeat buyers'],
      rotation: 'rotate-2'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Case Studies - Infinity Pillars Marketing</title>
        <meta name="description" content="Explore our marketing case studies and see how we've helped companies scale their revenue and dominate their markets." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background">
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
              Selected<br />
              <span className="text-muted-foreground italic font-medium">campaigns.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  A curated collection of case studies showcasing strategic execution and measurable marketing ROI.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Portfolio Grid (Editorial / Scattered Layout) */}
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-32 md:space-y-48">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className={`flex flex-col gap-12 lg:gap-24 items-center ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  {/* Image Presentation */}
                  <div className="w-full md:w-1/2">
                    <div className={`transform ${project.rotation} hover:rotate-0 hover:-translate-y-2 transition-all duration-700`}>
                      <div className="editorial-frame">
                        <img
                          src={project.image}
                          alt={`${project.title} case study showcase`}
                          className="w-full h-[400px] md:h-[600px] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Presentation */}
                  <div className="w-full md:w-1/2">
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
                      {project.category}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">{project.title}</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 border-t border-border pt-8">
                      {project.metrics.map((metric) => (
                        <div key={metric} className="text-sm font-medium">
                          {metric}
                        </div>
                      ))}
                    </div>

                    <Link 
                      to={`/portfolio/${project.slug}`}
                      className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300"
                    >
                      Read full case study
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {[
                { value: '500+', label: 'Campaigns launched' },
                { value: '87%', label: 'Client retention' },
                { value: '342%', label: 'Average ROI' },
                { value: '2.8M', label: 'Impressions generated' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col"
                >
                  <div className="text-5xl md:text-7xl font-bold tracking-tighter mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {stat.value}
                  </div>
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
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Ready for results?</h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Schedule a consultation to discuss your growth goals and how we can achieve them.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="/#booking">Get in touch</Link>
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