import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const OpenRoles = ({ roles, onApply }) => {
  const [filter, setFilter] = useState('All');
  const listRef = useRef(null);

  const departments = ['All', ...Array.from(new Set(roles.map((r) => r.department)))];
  const filtered = filter === 'All' ? roles : roles.filter((r) => r.department === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-role-row]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }
      );
    }, listRef);
    return () => ctx.revert();
  }, [filter]);

  return (
    <div ref={listRef}>
      <div className="flex flex-wrap gap-3 mb-10">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setFilter(dept)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all duration-200 ${
              filter === dept
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center border border-dashed border-border">
          No open roles in this department right now — check back soon, or pitch us below.
        </p>
      ) : (
        <Accordion type="single" collapsible className="border-t border-border">
          {filtered.map((role) => (
            <AccordionItem key={role.title} value={role.title} data-role-row className="border-border py-2">
              <AccordionTrigger className="hover:no-underline group py-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-left w-full pr-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#AFEA00] sm:w-32 shrink-0">
                    {role.department}
                  </span>
                  <span className="text-xl md:text-2xl font-bold tracking-tight group-hover:opacity-70 transition-opacity">
                    {role.title}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground sm:ml-auto sm:mr-4">
                    {role.type} · {role.location}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-0 sm:pl-[8.5rem] pb-8 pr-4 max-w-3xl">
                  <p className="text-muted-foreground leading-relaxed mb-6">{role.description}</p>
                  <ul className="space-y-2 mb-8">
                    {role.responsibilities.map((item) => (
                      <li key={item} className="text-sm text-foreground/80 flex items-start gap-3">
                        <span className="text-[#AFEA00] mt-1">→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onApply(role)}
                    className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-all duration-300"
                  >
                    Apply for this role
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default OpenRoles;
