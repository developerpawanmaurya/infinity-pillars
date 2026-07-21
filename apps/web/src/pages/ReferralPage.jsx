import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight, InfinityIcon, ShieldCheck, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import SplitReveal from '@/components/SplitReveal.jsx';
import MagneticButton from '@/components/MagneticButton.jsx';
import TiltCard from '@/components/TiltCard.jsx';
import PayoutPreviewCard from '@/components/referral/PayoutPreviewCard.jsx';
import ReferralHowItWorks from '@/components/referral/ReferralHowItWorks.jsx';
import ReferralCalculator from '@/components/referral/ReferralCalculator.jsx';
import ReferralForm from '@/components/referral/ReferralForm.jsx';

gsap.registerPlugin(ScrollTrigger);

const TRUST_POINTS = [
  { icon: InfinityIcon, label: 'No cap on referrals or payouts' },
  { icon: Zap, label: 'Paid within 15 days of first invoice' },
  { icon: ShieldCheck, label: '12-month attribution window' },
];

const FAQS = [
  {
    q: 'Who can I refer?',
    a: "Any business that could use a high-performance website, local SEO / Google Business Profile growth, or an AI-driven conversion agent — the three pillars we build. It doesn't need to be a warm intro; a cold-ish tip with the right context works too.",
  },
  {
    q: 'How much do I actually earn?',
    a: "10% of the total value of their initial signed engagement. If the referred business signs a $30,000 build, you earn $3,000. There's no sliding scale and no fine print.",
  },
  {
    q: 'When do I get paid?',
    a: "Within 15 business days of the client's first invoice clearing. We'll email you a confirmation the moment the engagement is signed, and again when your payout is sent.",
  },
  {
    q: 'Is there a limit on how many people I can refer?',
    a: 'None. Refer one business or fifty — each successful referral pays out independently, with no cap on total earnings.',
  },
  {
    q: 'Do I need to already be a client to refer someone?',
    a: 'No. The program is open to clients, past clients, partner agencies, and anyone else who knows a business that could use what we build.',
  },
  {
    q: "What if the business I refer doesn't sign right away?",
    a: 'Your referral stays attributed to you for 12 months from the date you submit it — however long their decision takes, you still get credit when it closes.',
  },
];

const ReferralPage = () => {
  const heroContentRef = useRef(null);

  // Light parallax-out — the hero text drifts up and fades slightly faster
  // than scroll.
  useEffect(() => {
    const content = heroContentRef.current;
    if (!content) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        yPercent: -14,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: { trigger: content, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Refer & Earn 10% - Infinity Pillars</title>
        <meta name="description" content="Know a business that needs a high-conversion website, local SEO growth, or an AI sales agent? Refer them to Infinity Pillars and earn 10% of the engagement value." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        {/* Hero */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div ref={heroContentRef} className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 border border-[#AFEA00]/40 bg-[#AFEA00]/5 px-4 py-2 mb-8"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#AFEA00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#AFEA00]" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#AFEA00]">Refer & Earn</span>
              </motion.div>
              <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-10">
                <SplitReveal text="Earn 10%." trigger="mount" />
                <SplitReveal
                  text="Just for the intro."
                  trigger="mount"
                  delay={0.28}
                  className="text-muted-foreground italic font-medium"
                />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed mb-12"
              >
                Know a business that needs a website that converts, a Google Business Profile that ranks, or an AI agent that never sleeps? Introduce us. If they sign, you earn 10% of the deal — no cap.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap items-center gap-6"
              >
                <MagneticButton>
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#AFEA00] text-black hover:bg-[#AFEA00]/90 transition-all duration-200 active:scale-[0.98] rounded-none px-10 py-7 text-base shadow-editorial"
                  >
                    <a href="#refer-form">
                      Refer Someone Now <ArrowDown className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </MagneticButton>
                <a
                  href="#calculator"
                  className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300"
                >
                  Estimate Your Payout
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="lg:col-span-5"
            >
              <TiltCard>
                <PayoutPreviewCard />
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-border py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {TRUST_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex items-center gap-4"
                >
                  <Icon className="w-6 h-6 text-[#AFEA00] shrink-0" strokeWidth={1.75} />
                  <span className="text-sm font-bold uppercase tracking-widest">{point.label}</span>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <ReferralHowItWorks />

        {/* Calculator */}
        <section id="calculator" className="py-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ReferralCalculator />
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="py-32 bg-muted/20 border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Program rules.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">Straightforward, no fine print.</p>
            </motion.div>

            <Accordion type="single" collapsible className="border-t border-border">
              {FAQS.map((faq) => (
                <AccordionItem key={faq.q} value={faq.q} className="border-border">
                  <AccordionTrigger className="hover:no-underline py-6 text-left">
                    <span className="text-lg md:text-xl font-bold tracking-tight pr-4">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed pb-4 pr-8">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Referral form */}
        <section id="refer-form" className="py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">Submit a Referral</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Make the intro.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Takes about two minutes. We'll take it from there.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ReferralForm />
          </motion.div>
        </section>

        {/* Careers cross-link */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-foreground p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">We're Also Hiring</p>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3 max-w-xl">
                Rather join the team than refer one?
              </h3>
              <p className="text-muted-foreground max-w-xl leading-relaxed">
                We're a small, remote-first studio always looking for people who ship. See what's open.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] rounded-none px-10 py-7 text-base shrink-0"
            >
              <Link to="/careers">
                View Open Roles <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ReferralPage;
