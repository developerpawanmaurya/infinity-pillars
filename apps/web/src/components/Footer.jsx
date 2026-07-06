import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin } from 'lucide-react';

const XIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {

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
              We design, build, and automate high-performance digital environments for ambitious, forward-thinking brands.
            </p>
            <a
              href="mailto:hello@infinitypillars.com"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 mt-4 inline-block"
            >
              hello@infinitypillars.com
            </a>
          </div>

          {/* Company */}
          <div className="md:col-span-3 md:col-start-7">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Company</span>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                  Success Blueprints
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                  The Playbook
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                  Privacy & Operations Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-2">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Connect</span>
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-sm font-medium flex items-center gap-3 hover:text-muted-foreground transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
              <a href="#" className="text-sm font-medium flex items-center gap-3 hover:text-muted-foreground transition-colors duration-200" aria-label="Twitter">
                <XIcon className="w-4 h-4" /> Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © 2026 Infinity Pillars. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;