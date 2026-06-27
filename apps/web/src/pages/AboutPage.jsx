import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, TrendingUp } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: 'Results-driven',
      description: "We don't care about vanity metrics. Every campaign is measured by its impact on your bottom line and overall revenue growth."
    },
    {
      icon: Lightbulb,
      title: 'Transparent reporting',
      description: 'No black boxes or hidden fees. You get full visibility into our strategies, spend allocation, and real-time performance data.'
    },
    {
      icon: TrendingUp,
      title: 'Continuous optimization',
      description: 'Marketing is never "set it and forget it." We aggressively test, iterate, and refine to lower acquisition costs over time.'
    },
    {
      icon: Users,
      title: 'Strategic partnership',
      description: 'We operate as an extension of your internal team, aligning our marketing efforts completely with your broader business objectives.'
    }
  ];

  const team = [
    { name: 'Maya Chen', role: 'Digital Strategist', image: 'https://images.unsplash.com/photo-1690191886622-fd8d6cda73bd', rotation: '-rotate-2', mt: 'mt-0' },
    { name: 'Raj Patel', role: 'PPC Specialist', image: 'https://images.unsplash.com/photo-1531497258014-b5736f376b1b', rotation: 'rotate-3', mt: 'mt-12' },
    { name: 'Lucia Torres', role: 'SEO Expert', image: 'https://images.unsplash.com/photo-1690191886622-fd8d6cda73bd', rotation: '-rotate-1', mt: 'mt-4' },
    { name: 'Kwame Asante', role: 'Content Strategist', image: 'https://images.unsplash.com/photo-1531497258014-b5736f376b1b', rotation: 'rotate-2', mt: 'mt-16' },
    { name: 'Elena Silva', role: 'Analytics Manager', image: 'https://images.unsplash.com/photo-1690191886622-fd8d6cda73bd', rotation: '-rotate-2', mt: 'mt-8 md:hidden lg:block' }
  ];

  const stats = [
    { value: '500+', label: 'Campaigns managed' },
    { value: '150+', label: 'Clients served' },
    { value: '$50M+', label: 'Client revenue generated' },
    { value: '12+', label: 'Years of expertise' }
  ];

  return (
    <>
      <Helmet>
        <title>About us - Infinity Pillars</title>
        <meta name="description" content="We're a digital marketing agency obsessed with ROI. Meet our team of strategists and specialists who scale ambitious businesses." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Intro Section */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter leading-[0.9] mb-12">
              We engineer<br />
              <span className="text-muted-foreground italic font-medium">digital growth.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-20 border-t border-border pt-12">
              <div className="md:col-span-8 md:col-start-5">
                <p className="text-xl md:text-3xl text-muted-foreground leading-relaxed font-light">
                  Infinity Pillars was founded with a single purpose: to help businesses grow through data-driven marketing. We reject vanity metrics and focus exclusively on campaigns that drive qualified traffic, convert leads, and generate measurable revenue.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Team Photo Editorial Layout */}
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
              alt="Infinity Pillars marketing team collaborating in modern office workspace"
              className="w-full h-[400px] md:h-[600px] object-cover grayscale-[30%]"
            />
          </motion.div>
        </section>

        {/* Philosophy */}
        <section className="py-32 bg-muted/20">
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
                  Our philosophy
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Effective marketing isn't about shouting the loudest. It's about precision. We believe in understanding the exact unit economics of your business before spending a single dollar.
                  </p>
                  <p>
                    We combine rigorous technical expertise in SEO, PPC, and Analytics with compelling creative to build funnels that consistently turn strangers into loyal customers.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 lg:col-start-7"
              >
                <div className="space-y-12">
                  <div className="border-l-2 border-foreground pl-8">
                    <div className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2">01</div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">Data over opinions</h3>
                    <p className="text-muted-foreground leading-relaxed">Every strategy we implement is backed by historical data, market research, and rigorous A/B testing.</p>
                  </div>
                  <div className="border-l-2 border-border pl-8">
                    <div className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2">02</div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">Full-funnel approach</h3>
                    <p className="text-muted-foreground leading-relaxed">Traffic means nothing without conversion. We optimize every touchpoint from the first ad click to the final sale.</p>
                  </div>
                  <div className="border-l-2 border-border pl-8">
                    <div className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2">03</div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3">Agile execution</h3>
                    <p className="text-muted-foreground leading-relaxed">Markets change fast. We monitor campaigns daily and pivot budgets to wherever the highest ROI is hiding.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">What drives us</h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Four principles that shape our approach to client growth.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-8 border border-border">
                    <value.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight mb-4">{value.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid (Artistic / Scattered) */}
        <section className="py-32 bg-muted/20 border-y border-border overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-24"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Meet the experts</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Specialists who are obsessed with your metrics.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 justify-center">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`text-center ${member.mt}`}
                >
                  <div className={`transform ${member.rotation} hover:rotate-0 transition-transform duration-500 mb-8`}>
                    <div className="editorial-frame aspect-[3/4] bg-background">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover grayscale" 
                      />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-5xl md:text-7xl font-bold tracking-tighter mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
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
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Ready to scale?</h2>
              <p className="text-xl text-background/70 mb-12 leading-relaxed">
                Let's audit your current marketing stack and uncover hidden opportunities for revenue growth.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                <Link to="/#booking">Request an Audit</Link>
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