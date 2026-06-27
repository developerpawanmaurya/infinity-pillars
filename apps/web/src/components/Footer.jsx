import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleServiceClick = (e, id) => {
    e.preventDefault();
    if (location.pathname === '/services') {
      const element = document.getElementById(id);
      if (element) {
        // Smooth scroll to the element
        const yOffset = -100; // Account for fixed headers if any
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Highlight the headline
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
    } else {
      navigate('/services', { state: { scrollTo: id } });
    }
  };

  const servicesLinks = [
    { name: 'SEO', id: 'seo-service' },
    { name: 'PPC Advertising', id: 'ppc-advertising-service' },
    { name: 'Social Media Marketing', id: 'social-media-marketing-service' },
    { name: 'Content Marketing', id: 'content-marketing-service' },
    { name: 'Email Marketing Automation', id: 'email-marketing-automation-service' }
  ];

  return (
    <footer className="bg-background text-foreground border-t border-border pt-24 pb-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold tracking-tighter">Infinity Pillars.</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed max-w-sm">
              We craft digital experiences that drive real business results. Strategy, design, and development for forward-thinking brands.
            </p>
          </div>

          {/* Services */}
          <div className="md:col-span-3 lg:col-span-2 md:col-start-7">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Services</span>
            <ul className="space-y-4">
              {servicesLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={(e) => handleServiceClick(e, link.id)}
                    className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200 text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Company</span>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="md:col-span-2">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Follow</span>
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-sm font-medium flex items-center gap-3 hover:text-muted-foreground transition-colors duration-200" aria-label="Instagram">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href="#" className="text-sm font-medium flex items-center gap-3 hover:text-muted-foreground transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a href="#" className="text-sm font-medium flex items-center gap-3 hover:text-muted-foreground transition-colors duration-200" aria-label="Twitter">
                <Twitter className="w-4 h-4" /> Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Infinity Pillars. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;