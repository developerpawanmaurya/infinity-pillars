import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Printer } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'user-responsibilities', title: 'User Responsibilities' },
    { id: 'service-limitations', title: 'Service Limitations' },
    { id: 'intellectual-property', title: 'Intellectual Property Rights' },
    { id: 'liability-disclaimers', title: 'Liability Disclaimers' },
    { id: 'payment-terms', title: 'Payment Terms' },
    { id: 'service-termination', title: 'Service Termination' },
    { id: 'dispute-resolution', title: 'Dispute Resolution' },
    { id: 'contact', title: 'Contact Information' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);

      const sectionElements = sections.map(s => document.getElementById(s.id));
      const currentSection = sectionElements.find(element => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 200 && rect.bottom > 200;
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
      const y = element.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>Terms of Service | Infinity Pillars</title>
        <meta name="description" content="Infinity Pillars' Terms of Service outlining user responsibilities, service limitations, and legal agreements." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground print:bg-white print:text-black">
        <Header />

        <main className="pt-32 pb-24 md:pt-48 md:pb-32 print:pt-10 print:pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 print:mb-10"
            >
              <div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Terms of Service.</h1>
                <p className="text-xl text-muted-foreground">Effective Date: April 15, 2026</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handlePrint}
                className="hidden md:flex items-center gap-2 rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 print:hidden"
              >
                <Printer className="w-4 h-4" />
                Print Document
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-24 print:block">
              {/* Desktop Sticky Navigation */}
              <div className="hidden lg:block print:hidden">
                <nav className="sticky top-32 flex flex-col gap-4 border-l border-border pl-6">
                  <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Legal Navigation</span>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left text-sm font-medium transition-colors duration-200 py-1 ${
                        activeSection === section.id 
                          ? 'text-foreground font-bold' 
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
                className="max-w-3xl space-y-12 print:space-y-8 print:max-w-full"
              >
                <Card id="introduction" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Introduction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      Welcome to Infinity Pillars ("Infinity Pillars", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of our website, digital marketing services, consulting, and related products (collectively, the "Services").
                    </p>
                    <p>
                      By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use our Services. These Terms constitute a legally binding agreement between you and Infinity Pillars.
                    </p>
                  </CardContent>
                </Card>

                <Card id="user-responsibilities" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">User Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      As a client or user of our Services, you agree to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-foreground/80 print:text-black">
                      <li>Provide accurate, current, and complete information during the onboarding and ongoing service delivery processes.</li>
                      <li>Maintain the security and confidentiality of any account credentials provided to you.</li>
                      <li>Ensure that any assets, materials, or content you provide for marketing purposes do not infringe upon the intellectual property rights of third parties.</li>
                      <li>Respond promptly to requests for approvals, feedback, or necessary assets required to execute our marketing campaigns.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card id="service-limitations" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Service Limitations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      While Infinity Pillars employs industry-best practices and data-driven strategies, digital marketing inherently involves external variables beyond our control (e.g., Google algorithm updates, competitor actions, platform policy changes).
                    </p>
                    <p>
                      Therefore, we do not guarantee specific financial results, rankings, or conversion rates. All projections or case studies provided are illustrative and do not constitute a warranty of future performance.
                    </p>
                  </CardContent>
                </Card>

                <Card id="intellectual-property" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Intellectual Property Rights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      <strong>Client Ownership:</strong> Upon full payment for our Services, you retain ownership of all final deliverables, including custom ad creatives, written copy, and specific campaign assets created specifically for your brand.
                    </p>
                    <p>
                      <strong>Infinity Pillars Ownership:</strong> Infinity Pillars retains all rights, title, and interest in our proprietary methodologies, software, templates, pre-existing materials, and general marketing frameworks used to deliver the Services.
                    </p>
                  </CardContent>
                </Card>

                <Card id="liability-disclaimers" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Liability Disclaimers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      To the maximum extent permitted by law, Infinity Pillars shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-foreground/80 print:text-black">
                      <li>Your access to or use of or inability to access or use the Services.</li>
                      <li>Any conduct or content of any third party or platform (such as Google, Meta, or LinkedIn).</li>
                      <li>Any unauthorized access, use, or alteration of your transmissions or content.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card id="payment-terms" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Payment Terms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      Unless otherwise specified in a custom Statement of Work (SOW):
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-foreground/80 print:text-black">
                      <li>Invoices are due upon receipt or strictly Net 30 days from the invoice date, depending on your account terms.</li>
                      <li>Retainer fees are billed in advance on the 1st of each month.</li>
                      <li>Late payments may incur a fee of 1.5% per month on the outstanding balance.</li>
                      <li>Infinity Pillars reserves the right to pause campaign management or suspend services if accounts become past due.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card id="service-termination" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Service Termination</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      Either party may terminate month-to-month services with a 30-day written notice. For fixed-term contracts, termination terms will be specified in the governing SOW.
                    </p>
                    <p>
                      Upon termination, you remain responsible for any accrued fees, outstanding invoices, and active third-party ad spend commitments up to the effective date of termination.
                    </p>
                  </CardContent>
                </Card>

                <Card id="dispute-resolution" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Dispute Resolution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      Any dispute arising from or relating to these Terms or our Services shall be resolved through binding arbitration in San Francisco, California, administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. Both parties waive the right to a jury trial or to participate in a class action.
                    </p>
                  </CardContent>
                </Card>

                <Card id="contact" className="scroll-mt-32 rounded-none border-foreground/10 shadow-sm print:border-none print:shadow-none print:p-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed print:text-black">
                    <p>
                      For legal inquiries, notices, or questions regarding these Terms of Service, please contact our legal department:
                    </p>
                    <div className="bg-muted/30 p-8 mt-6 border border-border">
                      <p className="font-bold text-foreground mb-4">Infinity Pillars Legal Department</p>
                      <p>Email: <a href="mailto:legal@infinitypillars.com" className="text-foreground hover:underline font-medium">legal@infinitypillars.com</a></p>
                      <p>Phone: +1 (555) 123-4567</p>
                      <p className="mt-4 text-foreground/80">
                        100 Digital Avenue, Suite 400<br />
                        San Francisco, CA 94107<br />
                        United States
                      </p>
                    </div>
                  </CardContent>
                </Card>
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
              className="fixed bottom-8 right-8 p-4 bg-foreground text-background rounded-none shadow-lg hover:bg-foreground/90 transition-colors z-50 group print:hidden"
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

export default TermsOfServicePage;