import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight, ArrowDown, Wallet, Globe2, GraduationCap,
  HeartPulse, Palmtree, Rocket,
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import SplitReveal from '@/components/SplitReveal.jsx';
import MagneticButton from '@/components/MagneticButton.jsx';
import TiltCard from '@/components/TiltCard.jsx';
import RoleTickerCard from '@/components/careers/RoleTickerCard.jsx';
import OpenRoles from '@/components/careers/OpenRoles.jsx';
import ApplyModal from '@/components/careers/ApplyModal.jsx';

gsap.registerPlugin(ScrollTrigger);

const PERKS = [
  'Remote-First', 'Equity Available', 'Paid Trial Projects', 'Async-Friendly',
  'Quarterly Offsites', 'Learning Budget', 'Health Stipend', 'No Bureaucracy',
];

const VALUES = [
  {
    title: 'Ship real systems',
    desc: 'Every hire touches production. No busywork, no theoretical roadmaps — you build the engines clients actually run their business on.',
  },
  {
    title: 'Own outcomes, not hours',
    desc: 'We measure impact, not seat time. Async-friendly, deep-work respecting, results-first — work the way that makes you sharpest.',
  },
  {
    title: 'Small team, high leverage',
    desc: "You're not one of two hundred engineers. Your decisions visibly move the product, the client roster, and the company's trajectory.",
  },
];

const BENEFITS = [
  { icon: Wallet, label: 'Competitive Pay + Equity', desc: 'Compensation benchmarked to top-tier agencies, plus a profit-share pool tied to studio growth.' },
  { icon: Globe2, label: 'Remote & Async', desc: 'Work from anywhere. Core overlap hours only — the rest is yours to structure.' },
  { icon: HeartPulse, label: 'Health Stipend', desc: 'Monthly stipend toward health coverage, wherever you are based.' },
  { icon: GraduationCap, label: 'Learning Budget', desc: 'Annual budget for courses, conferences, and tools that sharpen your craft.' },
  { icon: Palmtree, label: 'Flexible PTO', desc: 'No arbitrary day-counting. Take the time you need to do great work sustainably.' },
  { icon: Rocket, label: 'Paid Trial Projects', desc: 'Every offer starts with real, compensated work — you evaluate us as much as we evaluate you.' },
];

const HIRING_STEPS = [
  { step: '01', title: 'Apply', desc: 'Send your background and a couple of sentences on what you would bring. We read every application ourselves.' },
  { step: '02', title: 'Intro Call', desc: 'A 30-minute conversation — no trick questions. We want to understand how you think and what you are looking for.' },
  { step: '03', title: 'Paid Trial Project', desc: 'A small, real, compensated piece of work scoped to the role. You see how we operate; we see how you build.' },
  { step: '04', title: 'Offer', desc: "If it's a mutual fit, we move fast. Most candidates hear back within a week of the trial wrapping." },
];

const ROLES = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    description: 'Own the Website pillar — the React/Node systems, API integrations, and performance engineering behind every client revenue engine we ship.',
    responsibilities: [
      'Architect and ship production React + Node systems for client engagements',
      'Own performance budgets — Core Web Vitals are a KPI, not an afterthought',
      'Integrate third-party APIs (CRM, payments, scheduling) into cohesive client systems',
      'Pair with design to translate high-fidelity prototypes into pixel-accurate builds',
    ],
  },
  {
    title: 'AI Automation Engineer',
    department: 'AI & Automation',
    type: 'Full-time',
    location: 'Remote',
    description: 'Design, train, and ship the knowledge agents that qualify and convert leads for our clients — 24 hours a day, without a salary.',
    responsibilities: [
      'Build and fine-tune LLM-backed agents on client-specific knowledge bases',
      'Design conversation flows engineered around qualification and conversion',
      'Instrument agents with analytics to continuously improve conversion rate',
      'Work directly with clients to scope what "done" looks like for their agent',
    ],
  },
  {
    title: 'Local SEO & GMB Strategist',
    department: 'Growth',
    type: 'Full-time',
    location: 'Remote',
    description: 'Own the Google Business Profile pillar — rankings, review velocity, and local intent signals that qualify buyers before they ever call.',
    responsibilities: [
      'Run GMB optimization and local ranking strategy across the client roster',
      'Build review-acquisition systems that compound authority over time',
      'Audit competitor local presence and translate gaps into action plans',
      'Report on ranking, call volume, and lead quality month over month',
    ],
  },
  {
    title: 'Conversion-Focused Product Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'Remote',
    description: 'Prototype complete user journeys in high-fidelity Figma — designed around conversion psychology, not aesthetic preference alone.',
    responsibilities: [
      'Design interactive, high-fidelity prototypes clients can validate pre-build',
      'Reduce friction across every screen, field, and micro-interaction',
      'Partner with engineering to ensure designs ship pixel-accurate',
      'Maintain and evolve the studio-wide editorial design system',
    ],
  },
  {
    title: 'Growth Operations Manager',
    department: 'Operations',
    type: 'Full-time',
    location: 'Remote',
    description: 'Build the internal systems, reporting, and retainer processes that keep every engagement compounding long after launch.',
    responsibilities: [
      'Own the post-launch retainer process — reporting cadence, QBRs, upsell paths',
      'Build internal dashboards tracking client performance across all three pillars',
      'Identify and systematize the operational bottlenecks slowing the team down',
      'Partner with leadership on hiring, onboarding, and process documentation',
    ],
  },
];

const CareersPage = () => {
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const heroContentRef = useRef(null);

  const openApply = (role = null) => {
    setSelectedRole(role);
    setApplyOpen(true);
  };

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
        <title>Careers - Infinity Pillars</title>
        <meta name="description" content="Join Infinity Pillars. We're a small, remote-first team engineering the digital revenue systems ambitious brands run on. See open roles." />
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
                <span className="text-xs font-bold uppercase tracking-widest text-[#AFEA00]">We're Hiring</span>
              </motion.div>
              <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.9] mb-10">
                <SplitReveal text="Build the machine" trigger="mount" />
                <SplitReveal
                  text="behind the growth."
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
                We're a small, remote-first studio engineering the websites, local systems, and AI agents that ambitious brands run their revenue on. No bureaucracy. Just people who ship.
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
                    <a href="#roles">
                      See Open Roles <ArrowDown className="w-4 h-4 ml-1" />
                    </a>
                  </Button>
                </MagneticButton>
                <button
                  onClick={() => openApply(null)}
                  className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300"
                >
                  General Application
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="lg:col-span-5"
            >
              <TiltCard>
                <RoleTickerCard roles={ROLES} onSelect={openApply} />
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* Perks marquee */}
        <section className="border-y border-border py-6 overflow-hidden bg-foreground text-background">
          <div
            className="flex whitespace-nowrap"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}
          >
            {[0, 1].map((dupe) => (
              <div key={dupe} className="flex items-center animate-scroll" aria-hidden={dupe === 1}>
                {PERKS.map((perk) => (
                  <span key={perk} className="mx-6 text-sm font-bold uppercase tracking-widest flex items-center gap-6">
                    {perk}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#AFEA00]" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Why Infinity Pillars */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20 max-w-3xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Why work here.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We don't run a typical agency. There's no bench, no billable-hour theater, no fifteen-person approval chain between an idea and it shipping.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <TiltCard className="bg-background p-8 md:p-10 h-full">
                  <span className="text-4xl font-bold text-[#AFEA00] tracking-tighter block mb-6">0{i + 1}</span>
                  <h3 className="text-xl font-bold tracking-tight mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{value.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits grid */}
        <section className="py-32 bg-muted/20 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-16"
            >
              What you get.
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {BENEFITS.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                    className="flex flex-col gap-4"
                  >
                    <Icon className="w-7 h-7 text-[#AFEA00]" strokeWidth={1.5} />
                    <h3 className="text-lg font-bold tracking-tight">{benefit.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section id="roles" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-3xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Open roles.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every open seat below is real, funded, and hiring now. Don't see your exact title? Pitch us anyway.
            </p>
          </motion.div>

          <OpenRoles roles={ROLES} onApply={openApply} />
        </section>

        {/* Hiring process */}
        <section className="py-32 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter mb-20"
            >
              How hiring works.
            </motion.h2>

            <div className="space-y-0">
              {HIRING_STEPS.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 border-t border-background/15 py-12"
                >
                  <div className="lg:col-span-1">
                    <div className="text-sm font-bold tracking-widest text-[#AFEA00]">{item.step}</div>
                  </div>
                  <div className="lg:col-span-3">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{item.title}</h3>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="text-lg text-background/70 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Referral CTA banner */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-foreground p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">Refer & Earn</p>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3 max-w-xl">
                Know a business that needs this?
              </h3>
              <p className="text-muted-foreground max-w-xl leading-relaxed">
                Refer a company that becomes a client, and earn 10% of the engagement value. No cap, no catch.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] rounded-none px-10 py-7 text-base shrink-0"
            >
              <Link to="/referral">
                Refer & Earn 10% <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* Final CTA */}
        <section className="py-40 bg-muted/20 border-t border-border text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Don't see your role?</h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                We're always meeting people who could be a future hire. Tell us what you'd bring — we read every note.
              </p>
              <Button
                onClick={() => openApply(null)}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-12 py-8 text-lg shadow-editorial"
              >
                Send General Application
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>

      <ApplyModal open={applyOpen} onOpenChange={setApplyOpen} role={selectedRole} />
    </>
  );
};

export default CareersPage;
