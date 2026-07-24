import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Instagram, Mail } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme.js';

const XIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const [isDark] = useTheme();
  const logoSrc = isDark ? '/images/logo/lockup-lime.svg' : '/images/logo/lockup-dark.svg';

  return (
    <footer className="bg-background text-foreground border-t border-border pt-24 pb-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-24">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="inline-block mb-6">
              <img src={logoSrc} alt="Infinity Pillars" className="h-8 w-auto" />
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

          {/* Link columns — min-w-0 at every level below is load-bearing:
              CSS grid items default to min-width:auto (their content's
              min-content width), so without it the unbreakable strings in
              Connect (emails, @handles) refuse to shrink and force this
              whole grid wider than its md:col-span-8 track — which doesn't
              show as an overflowing footer, it shows as the FOOTER pushing
              the entire document wider than the viewport, i.e. dead white
              space opening up on the right of every section above it. Hit
              hardest right around 768–900px, where sm:grid-cols-3 has just
              kicked in but there isn't yet enough width for 3 comfortable
              columns. */}
          <div className="md:col-span-8 md:col-start-5 grid grid-cols-2 sm:grid-cols-3 gap-10 min-w-0">
            {/* Company */}
            <div className="min-w-0">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Company</span>
              <ul className="space-y-4">
                <li>
                  <Link to="/" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Core Offerings
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
                  <Link to="/careers" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="min-w-0">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Resources</span>
              <ul className="space-y-4">
                <li>
                  <Link to="/testimonials" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link to="/referral" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Refer & Earn 10%
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Privacy & Operations Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-sm font-medium hover:text-muted-foreground transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="col-span-2 sm:col-span-1 min-w-0">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6 block">Connect</span>
              <div className="flex flex-col space-y-4">
                <a href="mailto:hello@infinitypillars.com" className="text-sm font-medium flex items-center gap-3 min-w-0 hover:text-muted-foreground transition-colors duration-200" aria-label="Email">
                  <Mail className="w-4 h-4 shrink-0" /> <span className="truncate">hello@infinitypillars.com</span>
                </a>
                <a href="https://linkedin.com/company/infinity-pillars" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-3 min-w-0 hover:text-muted-foreground transition-colors duration-200" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4 shrink-0" /> <span className="truncate">@infinity-pillars</span>
                </a>
                <a href="https://instagram.com/infinity_pillars" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-3 min-w-0 hover:text-muted-foreground transition-colors duration-200" aria-label="Instagram">
                  <Instagram className="w-4 h-4 shrink-0" /> <span className="truncate">@infinity_pillars</span>
                </a>
                <a href="https://twitter.com/InftyPillars" target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-3 min-w-0 hover:text-muted-foreground transition-colors duration-200" aria-label="Twitter">
                  <XIcon className="w-4 h-4 shrink-0" /> <span className="truncate">@InftyPillars</span>
                </a>
              </div>
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