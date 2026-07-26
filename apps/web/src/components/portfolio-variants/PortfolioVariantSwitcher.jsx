import React from 'react';
import { Link } from 'react-router-dom';

const VARIANTS = [
  { key: 'index', label: 'Index', path: '/portfolio-preview-index' },
  { key: 'grid', label: 'Grid', path: '/portfolio-preview-grid' },
  { key: 'slideshow', label: 'Slideshow', path: '/portfolio-preview-slideshow' },
  { key: 'cards', label: 'Cards', path: '/portfolio-preview-cards' },
  { key: 'sidebar', label: 'Sidebar', path: '/portfolio-preview-sidebar' },
];

// Floating pill nav so the /portfolio-preview-* comparison builds can be
// flipped between without retyping URLs. Throwaway — delete alongside the
// preview pages once a variant is picked for the real /portfolio page.
const PortfolioVariantSwitcher = ({ active }) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999995] flex items-center gap-1 bg-foreground text-background rounded-full p-1 shadow-2xl text-xs font-bold uppercase tracking-wide overflow-x-auto max-w-[95vw]">
    {VARIANTS.map((v) => (
      <Link
        key={v.key}
        to={v.path}
        className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full transition-colors duration-200 ${
          active === v.key ? 'bg-primary text-primary-foreground' : 'hover:bg-background/10'
        }`}
      >
        {v.label}
      </Link>
    ))}
    <Link to="/portfolio" className="shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-background/50 hover:text-background transition-colors duration-200">
      Live page
    </Link>
  </div>
);

export default PortfolioVariantSwitcher;
