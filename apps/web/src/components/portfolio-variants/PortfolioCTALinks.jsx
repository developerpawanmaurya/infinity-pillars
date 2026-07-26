import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe } from 'lucide-react';

// Shared "Read full case study / Visit live site" link row — used by the
// portfolio-variant demos that need a full CTA (Quiet Cards, Sidebar
// Selector, Scrub Slideshow). `dark` swaps the palette for use over a
// full-bleed photo instead of the page background.
const PortfolioCTALinks = ({ project, className = '', dark = false }) => (
  <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}>
    <Link
      to={`/portfolio/${project.slug}`}
      className={`group inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm border-b pb-1 transition-all duration-300 ${
        dark ? 'text-white border-white hover:text-white/70 hover:border-white/70' : 'border-foreground hover:text-muted-foreground hover:border-muted-foreground'
      }`}
    >
      Read full case study
      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </Link>
    {project.liveUrl && (
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm transition-all duration-300 ${
          dark ? 'text-white/70 hover:text-white' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <Globe className="w-4 h-4" />
        Visit live site
      </a>
    )}
  </div>
);

export default PortfolioCTALinks;
