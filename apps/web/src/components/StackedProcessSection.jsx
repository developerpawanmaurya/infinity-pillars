import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StackedProcessSection = () => {
  const containerRef = useRef(null);
  const panelsRef = useRef([]);

  const steps = [
    {
      step: '01',
      title: 'The Discovery & Audit Phase',
      description: 'We audit your current digital footprint, analyze competitor gaps, and map a strict data-backed strategy tailored to your revenue goals.',
      detail: 'Before a single line of code is written, we study your market position with precision. We identify where competitors are winning, where your brand is leaking revenue, and define the exact levers we will pull to reverse that.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop'
    },
    {
      step: '02',
      title: 'UX/UI Interactive Design',
      description: "We prototype your complete user journey in high-fidelity Figma — designed around conversion psychology, not aesthetic preference.",
      detail: "Every screen, every interaction, every micro-copy decision is engineered to reduce friction and move users toward a single action: converting. We present interactive prototypes so you can validate the experience before a line of code is written.",
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop'
    },
    {
      step: '03',
      title: 'Full-Stack System Engineering',
      description: 'We build and deploy your high-speed web engine, API integrations, automation flows, and data infrastructure — tested before any go-live.',
      detail: 'We do not launch and disappear. We monitor live performance data, confirm that all integrations are firing correctly, and run QA across every device and browser before handing you the keys.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop'
    },
    {
      step: '04',
      title: 'Growth Optimization Retainer',
      description: 'Post-launch, we continuously audit performance, refine AI prompts, and optimize every layer to compound your returns over time.',
      detail: 'Markets shift. Algorithms update. Competitor behaviour changes. Our retainer keeps your digital infrastructure adaptive — always performing, always qualifying, always converting at the highest possible rate.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
    },
    {
      step: '05',
      title: 'Growth Operations & Talent Consulting',
      description: 'We help you build the internal team, processes, and operational systems required to sustain growth beyond our engagement.',
      detail: 'Sustainable growth requires the right people in the right seats. We consult on hiring, onboarding, and building internal capability — so that when our active engagement ends, your team can carry the momentum forward independently.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const panels = panelsRef.current.filter(Boolean);
    if (!panels.length) return;

    const ctx = gsap.context(() => {
      // For each panel (except the last), animate it as the next panel scrolls up over it.
      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return; // Last panel doesn't scale down
        const nextPanel = panels[i + 1];

        // Ensure origin is center so it scales smoothly
        gsap.set(panel, { transformOrigin: "center center" });

        gsap.to(panel, {
          scale: 0.85,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: nextPanel,
            start: "top bottom",
            end: "top top",
            scrub: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white">
      {steps.map((item, index) => (
        <div
          key={item.step}
          ref={(el) => (panelsRef.current[index] = el)}
          className="sticky top-0 h-screen w-full flex items-center overflow-hidden"
          style={{ zIndex: index }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${index % 2 !== 0 ? 'md:grid-flow-col-dense' : ''}`}>
              
              {/* Text Area */}
              <div className={`space-y-6 ${index % 2 !== 0 ? 'md:col-start-2' : ''}`}>
                <div className="text-sm font-bold tracking-widest text-[#AFEA00]">PHASE {item.step}</div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                  {item.title}
                </h2>
                <p className="text-xl text-white/90 leading-relaxed font-medium">
                  {item.description}
                </p>
                <p className="text-lg text-white/60 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              {/* Giant Number Area */}
              <div className={`flex ${index % 2 !== 0 ? 'justify-start md:col-start-1' : 'justify-end'} hidden md:flex`}>
                <span className="font-bold tracking-tighter text-[15rem] lg:text-[20rem] leading-none text-white/20 select-none">
                  {item.step}
                </span>
              </div>
              
              {/* Mobile Giant Number (Optional, behind text) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden pointer-events-none z-[-1]">
                <span className="font-bold tracking-tighter text-[15rem] leading-none text-white/10 select-none">
                  {item.step}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StackedProcessSection;
