import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter } from 'lucide-react';

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
              <a href="#" className="text-sm font-medium flex items-center gap-3 hover:text-muted-foreground transition-colors duration-200" aria-label="X">
                <Twitter className="w-4 h-4" /> X
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