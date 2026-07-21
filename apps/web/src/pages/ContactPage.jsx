import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, PhoneCall, Share2, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import TiltCard from '@/components/TiltCard.jsx';
import ContactHero from '@/components/contact/ContactHero.jsx';
import ContactForm from '@/components/contact/ContactForm.jsx';

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: 'Email Us',
    value: 'hello@infinitypillars.com',
    desc: 'For anything at all — questions, quotes, or just to say hi. A real person reads every one.',
    href: 'mailto:hello@infinitypillars.com',
    cta: 'Send an email',
  },
  {
    icon: PhoneCall,
    label: 'Book a Call',
    value: '20-minute audit call',
    desc: 'Skip the back-and-forth. Grab a slot and walk us through what you need directly.',
    href: '#booking',
    cta: 'Book Audit Call',
  },
  {
    icon: Share2,
    label: 'Follow Along',
    value: 'LinkedIn & Twitter',
    desc: "Case studies, build notes, and the occasional hot take on what's broken in agency work.",
    href: '#',
    cta: 'See our socials',
  },
];

const NEXT_STEPS = [
  { step: '01', title: 'We read it', desc: 'No auto-drip sequence, no ticket queue. Every message lands in front of an actual founder.' },
  { step: '02', title: 'We reply', desc: "Within one business day — either a straight answer, or the one question we need to give you one." },
  { step: '03', title: 'We scope it', desc: "If it's a fit, we book a 20-minute audit call and get specific about outcomes, timeline, and cost." },
];

const FAQS = [
  {
    q: 'How fast do you actually reply?',
    a: 'Within one business day, most of the time same-day. We read every message ourselves — nothing sits in an unattended inbox.',
  },
  {
    q: "I'd rather talk live than fill out a form.",
    a: 'Use the "Book Audit Call" button above — it opens our scheduler directly for a free 20-minute call, no form required.',
  },
  {
    q: 'Do you take on smaller projects?',
    a: "We scope engagements around outcomes, not a fixed minimum. Tell us what you're trying to solve and we'll tell you honestly whether we're the right fit — or point you somewhere better if we're not.",
  },
  {
    q: "I'm not ready to hire yet, I just have questions.",
    a: "That's exactly what this page is for. Message us with no pressure — plenty of people ask a few questions long before they're ready to start.",
  },
  {
    q: 'Do you work with businesses outside your home base?',
    a: "Yes. We're a remote-first studio and work with clients wherever they are, across time zones — most of our engagements run fully async with a weekly live sync.",
  },
];

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact - Infinity Pillars</title>
        <meta name="description" content="Get in touch with Infinity Pillars. Email us, book a free 20-minute audit call, or send a message — a real person replies within one business day." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <ContactHero />

        {/* Quick contact cards */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 max-w-3xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Three ways in.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Pick whichever is fastest for you — they all land with the same team.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
            {CONTACT_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <TiltCard className="bg-background p-8 md:p-10 h-full flex flex-col">
                    <Icon className="w-7 h-7 text-[#AFEA00] mb-6" strokeWidth={1.5} />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{card.label}</span>
                    <h3 className="text-xl font-bold tracking-tight mb-3">{card.value}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm mb-6 flex-1">{card.desc}</p>
                    <Link
                      to={card.href}
                      className="text-sm font-bold uppercase tracking-widest border-b border-foreground pb-1 w-fit hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300 inline-flex items-center gap-1.5"
                    >
                      {card.cta} <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Form + what happens next */}
        <section id="contact-form" className="py-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">Send a Message</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">What happens next.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                No gatekeeping, no sales-qualifying quiz. Fill in what's on your mind — here's exactly what happens after you hit send.
              </p>

              <div className="space-y-0">
                {NEXT_STEPS.map((item, index) => (
                  <div
                    key={item.step}
                    className="grid grid-cols-[auto,1fr] gap-6 border-t border-border py-8 first:pt-0"
                  >
                    <div className="text-sm font-bold tracking-widest text-[#AFEA00] pt-1">{item.step}</div>
                    <div>
                      <h3 className="text-lg font-bold tracking-tight mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7"
            >
              <ContactForm />
            </motion.div>
          </div>
        </section>

        {/* Book-a-call banner */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-foreground p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] mb-4">Prefer to Talk Live?</p>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tighter mb-3 max-w-xl">
                Skip the form. Book a call.
              </h3>
              <p className="text-muted-foreground max-w-xl leading-relaxed">
                A free 20-minute audit call, no pitch deck. We'll ask about what's not working and tell you straight whether we can fix it.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 active:scale-[0.98] rounded-none px-10 py-7 text-base shrink-0"
            >
              <Link to="#booking">
                Book Audit Call <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
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
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Before you write in.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">Quick answers to what people usually ask first.</p>
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

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
