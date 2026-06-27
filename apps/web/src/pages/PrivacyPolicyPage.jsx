import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const PrivacyPolicyPage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'data-collection', title: 'Data Collection' },
    { id: 'data-usage', title: 'Data Usage' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'user-rights', title: 'User Rights' },
    { id: 'cookies-tracking', title: 'Cookies & Tracking' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'contact', title: 'Contact Information' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show back to top button
      setShowBackToTop(window.scrollY > 400);

      // Update active section based on scroll position
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const currentSection = sectionElements.find(element => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom > 150;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Infinity Pillars</title>
        <meta name="description" content="Infinity Pillars' comprehensive privacy policy outlining our data collection, usage, and security practices." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <Header />

        <main className="pt-32 pb-24 md:pt-48 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:mb-24"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Privacy Policy.</h1>
              <p className="text-xl text-muted-foreground">Last Updated: April 15, 2026</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-24">
              {/* Desktop Sticky Navigation */}
              <div className="hidden lg:block">
                <nav className="sticky top-32 flex flex-col gap-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Contents</span>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left text-sm font-medium transition-colors duration-200 ${
                        activeSection === section.id 
                          ? 'text-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Policy Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-3xl space-y-16"
              >
                <section id="introduction" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Introduction</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      At Infinity Pillars ("Infinity Pillars", "we", "us", or "our"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our digital marketing services.
                    </p>
                    <p>
                      Please read this privacy policy carefully. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this privacy policy. If you do not agree, please do not use our site or services.
                    </p>
                  </div>
                </section>

                <section id="data-collection" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Data Collection</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We may collect information about you in a variety of ways. The information we may collect includes:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-foreground/80">
                      <li><strong className="text-foreground">Personal Data:</strong> Personally identifiable information, such as your name, email address, telephone number, company name, and job title that you voluntarily give to us when registering for services, submitting inquiries, or booking consultations.</li>
                      <li><strong className="text-foreground">Derivative Data:</strong> Information our servers automatically collect when you access our website, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.</li>
                      <li><strong className="text-foreground">Financial Data:</strong> Data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase our services. All financial data is stored by our payment processors and we encourage you to review their privacy policies.</li>
                    </ul>
                  </div>
                </section>

                <section id="data-usage" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Data Usage</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-foreground/80">
                      <li>Administer your account and deliver contracted marketing services.</li>
                      <li>Communicate with you regarding updates, service delivery, or account issues.</li>
                      <li>Generate data-driven insights and analytics to improve our marketing strategies.</li>
                      <li>Process payments and refunds.</li>
                      <li>Send you targeted marketing and promotional communications (subject to your consent).</li>
                      <li>Respond to product and customer service requests.</li>
                    </ul>
                  </div>
                </section>

                <section id="data-security" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Data Security</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We use administrative, technical, and physical security measures to help protect your personal information. We employ industry-standard encryption protocols, secure server infrastructure, and strict access controls to prevent unauthorized access, use, or disclosure of your data.
                    </p>
                    <p>
                      While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>
                  </div>
                </section>

                <section id="user-rights" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">User Rights</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      Depending on your location (including under GDPR and CCPA regulations), you may have certain rights regarding your personal information, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-foreground/80">
                      <li>The right to access and receive a copy of your personal data.</li>
                      <li>The right to rectify any inaccurate or incomplete personal data.</li>
                      <li>The right to request the erasure of your personal data (the "right to be forgotten").</li>
                      <li>The right to restrict or object to our processing of your personal data.</li>
                      <li>The right to data portability.</li>
                      <li>The right to withdraw your consent at any time.</li>
                    </ul>
                    <p className="mt-4">
                      To exercise any of these rights, please contact us using the information provided in the Contact Information section below.
                    </p>
                  </div>
                </section>

                <section id="cookies-tracking" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Cookies & Tracking</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We may use cookies, web beacons, tracking pixels, and other tracking technologies on our site to help customize our services and improve your experience. When you access our website, your personal information is not collected through the use of tracking technology.
                    </p>
                    <p>
                      You can remove or reject cookies using your browser settings. Please be aware that getting rid of cookies could affect the availability and functionality of the website.
                    </p>
                  </div>
                </section>

                <section id="third-party" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Third-Party Services</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We may share your information with third-parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
                    </p>
                    <p>
                      We may also partner with selected third-party vendors (such as Google Analytics, HubSpot, Meta) to allow tracking technologies and remarketing services on the website through the use of first-party cookies and third-party cookies, to, among other things, analyze and track users' use of the website and better understand online activity.
                    </p>
                  </div>
                </section>

                <section id="data-retention" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Data Retention</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      We will only retain your personal information for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                    </p>
                    <p>
                      When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.
                    </p>
                  </div>
                </section>

                <section id="contact" className="scroll-mt-32">
                  <h2 className="text-2xl font-bold tracking-tight mb-6">Contact Information</h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                      If you have questions or comments about this Privacy Policy, or wish to exercise your privacy rights, please contact us at:
                    </p>
                    <div className="bg-muted/30 p-8 mt-6 border border-border">
                      <p className="font-bold text-foreground mb-4">Infinity Pillars</p>
                      <p>Email: <a href="mailto:privacy@infinitypillars.com" className="text-foreground hover:underline">privacy@infinitypillars.com</a></p>
                      <p>Phone: +1 (555) 123-4567</p>
                      <p className="mt-4">
                        100 Digital Avenue, Suite 400<br />
                        San Francisco, CA 94107<br />
                        United States
                      </p>
                    </div>
                  </div>
                </section>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />

        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-4 bg-foreground text-background rounded-none shadow-lg hover:bg-foreground/90 transition-colors z-50 group"
              aria-label="Back to top"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;