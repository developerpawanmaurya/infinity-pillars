import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme.js';

// Mobile nav takeover — full-screen, numbered, staggered in like the site's
// other editorial index badges (PortfolioCaseCard, CareersPage steps)
// instead of a plain dropdown snapping open/closed with no transition.
//
// Portaled to document.body (see the render below) rather than left nested
// inside <header> — on the homepage, HomePage's hero GSAP tween sets a
// `transform` (translateY, via yPercent) directly on the <header> element
// itself to slide it in on scroll. Any CSS `transform` on an ancestor turns
// it into the containing block for `position: fixed` descendants, so this
// panel was being fixed relative to the (small) header box instead of the
// viewport — it rendered, just squeezed into the header's own bounding box.
// That's why it only ever failed specifically on the homepage. Portaling
// out to <body> sidesteps the whole containing-block problem regardless of
// what transforms other pages apply to the header later.
const menuVariants = {
  closed: { opacity: 0, scaleY: 0.9, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } },
  open: { opacity: 1, scaleY: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const listVariants = {
  closed: {},
  open: { transition: { staggerChildren: 0.055, delayChildren: 0.2 } },
};
const linkVariants = {
  closed: { opacity: 0, y: 36, rotate: 2 },
  open: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const ThemeToggleButton = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    // Circle, not the plain square the hamburger uses — reads as its own
    // distinct control. Hover glow is wrapped in [@media(hover:hover)] so it
    // can never get stuck "on" after a tap on a touch screen (bare
    // Tailwind `hover:` compiles to a plain CSS :hover, which touch
    // browsers latch onto until the next tap elsewhere) — active: (a real
    // touch-safe pseudo-class, always releases on touch-end) carries the
    // tactile feedback instead.
    className="group w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden transition-transform duration-200 active:scale-90 [@media(hover:hover)]:hover:bg-primary/15 [@media(hover:hover)]:hover:shadow-[0_0_0_1px_rgba(175,234,0,0.4),0_0_16px_rgba(175,234,0,0.35)]"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={isDark ? 'sun' : 'moon'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center transition-colors duration-200 [@media(hover:hover)]:group-hover:text-primary"
      >
        {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
      </motion.span>
    </AnimatePresence>
  </button>
);

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, toggleTheme] = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll while the takeover is open, and always close it
  // on route change so a link tap doesn't leave it lingering underneath.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Core Offerings', path: '/services' },
    { name: 'The Playbook', path: '/about' },
    { name: 'Success Blueprints', path: '/portfolio' },
    { name: 'Blogs', path: '/blog' },
    { name: 'Careers', path: '/careers' },
  ];

  const isActive = (path) => location.pathname === path;

  // The homepage opens on a full-bleed black hero, so the transparent (pre-scroll)
  // header floats over dark ground there; every other page's top section sits on
  // the light --background, so the transparent header floats over light ground.
  // Once scrolled, the header always gets a solid bg-background (light) behind it.
  const overDarkGround = !isScrolled && location.pathname === '/';
  // The mobile takeover panel is opaque bg-background, same as scrolled — once
  // it's open, the logo/button need to read against that regardless of hero.
  // Dark mode's --background is near-black everywhere, same reasoning as
  // overDarkGround: the dark icon-dark.svg would disappear against it.
  const logoSrc = (isDark || (overDarkGround && !isMobileMenuOpen))
    ? '/images/logo/icon-lime.svg'
    : '/images/logo/icon-dark.svg';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isMobileMenuOpen ? 'z-[999995]' : 'z-50'
        } ${
          isScrolled || isMobileMenuOpen ? 'bg-background border-b border-border/60 py-4' : 'bg-transparent py-6'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="hover:opacity-70 transition-opacity duration-200 relative z-10">
              <img src={logoSrc} alt="Infinity Pillars" className="h-[27px] md:h-[30px] w-auto" />
            </Link>

            {/* Desktop Navigation — right-aligned, grouped with the CTA */}
            <div className="hidden lg:flex items-center justify-end gap-12">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium transition-all duration-200 relative group whitespace-nowrap ${
                      isActive(link.path)
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.name}
                    {/* Minimal animated underline indicator */}
                    <span className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </Link>
                ))}
              </div>
              <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none px-6"
              >
                <Link to="#booking">Book Audit Call</Link>
              </Button>
            </div>

            {/* Mobile: theme toggle sits next to the hamburger */}
            <div className="lg:hidden flex items-center gap-1 relative z-10">
              <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center transition-transform duration-200 active:scale-90 [@media(hover:hover)]:hover:bg-muted"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                <motion.span
                  animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu — portaled straight to <body> (see the note up top on
          why: it can't live inside <header> without risking getting boxed
          into whatever transform a page's scroll animation puts there).
          z-index is intentionally very high (not just "above header"): a
          few page elements sit above the header's own z-50 already — the
          homepage hero's "Scroll to explore" cue is z-60, LimeRevealSection's
          content wrapper is z-45 — and both used to visibly float on top of
          this panel. Header itself jumps to z-[999995] (see above) whenever
          the menu is open so its logo/toggle/close button stay reachable on
          top of this. */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden fixed inset-0 z-[999990] bg-background overflow-y-auto"
              style={{ transformOrigin: 'top' }}
            >
              <motion.ul
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col pt-28 sm:pt-32 px-6 pb-10 min-h-full"
              >
                {navLinks.map((link, i) => (
                  <motion.li key={link.path} variants={linkVariants} className="border-b border-border/60">
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="flex items-baseline gap-4 min-w-0">
                        <span className="text-xs font-bold tracking-widest text-muted-foreground/40 shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`text-[2.1rem] leading-none font-bold tracking-tighter transition-colors duration-200 truncate ${
                            isActive(link.path) ? 'text-primary' : 'text-foreground group-active:text-muted-foreground'
                          }`}
                        >
                          {link.name}
                        </span>
                      </span>
                      <ArrowUpRight className="w-5 h-5 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </motion.li>
                ))}

                <motion.li variants={linkVariants} className="pt-8 mt-auto">
                  <Button
                    asChild
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] rounded-none py-6 text-lg"
                  >
                    <Link to="#booking" onClick={() => setIsMobileMenuOpen(false)}>
                      Book Audit Call
                    </Link>
                  </Button>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Header;
