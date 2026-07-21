import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CYCLE_MS = 3200;

// Live-feeling hero card — auto-cycles through the real open roles instead
// of sitting there as decoration. Crossfades on an interval; clicking any
// role (or the dots) jumps to it and scrolls the roles list into view.
const RoleTickerCard = ({ roles, onSelect }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || roles.length < 2) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [paused, roles.length]);

  const role = roles[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="border border-border bg-background p-8 md:p-10"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Now Hiring</span>
        <span className="text-xs font-bold uppercase tracking-widest text-[#AFEA00]">{roles.length} Open Roles</span>
      </div>

      <div className="min-h-[9.5rem] relative">
        <AnimatePresence mode="wait">
          <motion.button
            key={role.title}
            onClick={() => onSelect(role)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-left w-full group"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] block mb-3">
              {role.department}
            </span>
            <span className="text-2xl md:text-3xl font-bold tracking-tight block mb-3 group-hover:opacity-70 transition-opacity">
              {role.title}
            </span>
            <span className="text-sm text-muted-foreground block mb-4">
              {role.type} · {role.location}
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-foreground pb-1 group-hover:text-muted-foreground group-hover:border-muted-foreground transition-all">
              View Role <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border">
        {roles.map((r, i) => (
          <button
            key={r.title}
            onClick={() => setIndex(i)}
            aria-label={`Show ${r.title}`}
            className="h-1 flex-1 bg-border relative overflow-hidden"
          >
            <span
              className="absolute inset-0 bg-[#AFEA00] transition-transform duration-300 origin-left"
              style={{ transform: `scaleX(${i === index ? 1 : 0})` }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleTickerCard;
