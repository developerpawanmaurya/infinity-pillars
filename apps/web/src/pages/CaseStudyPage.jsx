import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { caseStudies } from '@/data/caseStudies.js';

const CaseStudyPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const caseStudy = caseStudies.find(study => study.slug === slug);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Helmet>
          <title>Case Study Not Found - Infinity Pillars</title>
        </Helmet>
        <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
        <p className="text-muted-foreground mb-8">The requested campaign could not be located.</p>
        <button 
          onClick={() => navigate('/portfolio')}
          className="inline-flex items-center gap-2 font-medium hover:text-muted-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Return to Portfolio
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${caseStudy.title} - Case Study | Infinity Pillars`}</title>
        <meta name="description" content={caseStudy.overview.substring(0, 150) + '...'} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background flex flex-col">
        <Header />

        <main className="flex-1 pt-32 pb-24 md:pt-48">
          <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <button 
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Portfolio
              </button>
            </motion.div>

            {/* Header & Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-5xl mb-24"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[0.95] mb-16 text-balance">
                {caseStudy.title}
              </h1>

              {/* Metrics Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-border py-12">
                {caseStudy.metrics.map((metric, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-4xl md:text-5xl font-bold tracking-tighter mb-2" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {metric.value}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-32"
            >
              <div className="editorial-frame">
                <img 
                  src={caseStudy.image} 
                  alt={`${caseStudy.title} case study minimalist art`} 
                  className="w-full h-[50vh] md:h-[70vh] object-cover grayscale-[20%]"
                />
              </div>
            </motion.div>

            {/* Content Sections */}
            <div className="max-w-5xl mx-auto space-y-32">
              
              {/* Brand Overview */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
              >
                <div className="md:col-span-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground sticky top-32">
                    Brand Overview
                  </h2>
                </div>
                <div className="md:col-span-8">
                  <p className="text-xl md:text-2xl leading-relaxed text-foreground font-light max-w-[65ch]">
                    {caseStudy.overview}
                  </p>
                </div>
              </motion.section>

              {/* Challenge */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
              >
                <div className="md:col-span-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground sticky top-32">
                    The Challenge
                  </h2>
                </div>
                <div className="md:col-span-8">
                  <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-[65ch]">
                    {caseStudy.challenge}
                  </p>
                </div>
              </motion.section>

              {/* Strategy / Solution */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
              >
                <div className="md:col-span-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground sticky top-32">
                    Strategy & Execution
                  </h2>
                </div>
                <div className="md:col-span-8">
                  <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-[65ch]">
                    {caseStudy.strategy}
                  </p>
                </div>
              </motion.section>

              {/* Results */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pb-24 border-b border-border"
              >
                <div className="md:col-span-4">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground sticky top-32">
                    The Results
                  </h2>
                </div>
                <div className="md:col-span-8">
                  <p className="text-xl md:text-2xl leading-relaxed text-foreground font-light max-w-[65ch]">
                    {caseStudy.results}
                  </p>
                </div>
              </motion.section>

            </div>
            
            {/* Bottom Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-32 text-center max-w-3xl mx-auto"
            >
              <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8">Ready to scale your revenue?</h3>
              <p className="text-xl text-muted-foreground mb-10">
                Let's apply these exact strategies to your business model.
              </p>
              <Link 
                to="/#booking" 
                className="inline-flex items-center justify-center px-10 py-6 bg-foreground text-background font-bold uppercase tracking-widest text-sm hover:bg-foreground/90 transition-all active:scale-[0.98]"
              >
                Book a consultation
              </Link>
            </motion.div>

          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CaseStudyPage;