import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TestimonialsPage = () => {
  const testimonials = [
    {
      name: 'Sarah Kim',
      role: 'CMO, Veritas Analytics',
      content: 'Infinity Pillars completely overhauled our approach to lifecycle marketing. Within months, we grew our email list from 5K to 45K active subscribers and saw a massive jump in engaged users.',
    },
    {
      name: 'Marcus Johnson',
      role: 'Founder, Canopy',
      content: 'We had burned thousands on poorly optimized Facebook ads before hiring them. Infinity Pillars stepped in, rebuilt our targeting, and we achieved a 312% ROI on paid social campaigns in quarter one.',
    },
    {
      name: 'Elena Rodriguez',
      role: 'VP Marketing, Bloom Health',
      content: 'Their technical SEO expertise is unmatched. They cleaned up years of legacy site issues and restructured our content. We improved our organic traffic by 287% in 12 months.',
    },
    {
      name: 'David Chen',
      role: 'CEO, Lighthouse Logistics',
      content: 'As a B2B company, lead quality is everything. Infinity Pillars optimized our search campaigns to weed out the noise, which ultimately reduced our customer acquisition cost by 42%.',
    },
    {
      name: 'Priya Sharma',
      role: 'Director of Growth, Quantum',
      content: 'The content and social strategy they developed gave our brand a completely new life online. We generated 2.1M impressions across social platforms during the launch phase alone.',
    },
    {
      name: 'Alex Novak',
      role: 'COO, Summit E-commerce',
      content: "They didn't just run ads; they helped us optimize our landing pages. Thanks to their CRO strategies, we increased our overall conversion rate from 1.2% to 4.8%.",
    }
  ];

  const featuredTestimonial = {
    name: 'Maya Patel',
    role: 'CEO, Spark Retail',
    content: "Infinity Pillars transformed our revenue trajectory. They didn't just sell us a service, they built an integrated growth engine. By aligning our PPC and SEO strategy, they increased our online sales by 156% in just 6 months. It's the best ROI we've seen from an agency.",
  };

  return (
    <>
      <Helmet>
        <title>Client Success - Infinity Pillars</title>
        <meta name="description" content="Read what our clients say about working with us. Real feedback and marketing metrics from companies we've helped grow." />
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
              Results from<br />
              <span className="text-muted-foreground italic font-medium">our partners.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  We measure our success strictly by the revenue and growth our clients achieve. Here's what they have to say about partnering with our agency.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Featured Testimonial (Oversized Editorial) */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Quote className="w-12 h-12 mx-auto mb-12 text-background/30" />
              <blockquote className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-16">
                "{featuredTestimonial.content}"
              </blockquote>

              <div className="border-t border-background/20 pt-8 max-w-xs mx-auto">
                <div className="font-bold uppercase tracking-widest text-sm mb-2">{featuredTestimonial.name}</div>
                <div className="text-background/60">{featuredTestimonial.role}</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Grid (Clean, minimal borders) */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                  className="flex flex-col h-full"
                >
                  <p className="text-xl leading-relaxed mb-10 flex-grow font-serif italic text-foreground/80">
                    "{testimonial.content}"
                  </p>

                  <div className="mt-auto border-t border-border pt-6">
                    <div className="font-bold text-sm tracking-widest uppercase mb-1">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-40 bg-muted/30 border-t border-border text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Ready to grow?</h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Join the ambitious brands that trust us to scale their marketing efforts and drive real revenue.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="/#booking">Book a Strategy Call</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TestimonialsPage;