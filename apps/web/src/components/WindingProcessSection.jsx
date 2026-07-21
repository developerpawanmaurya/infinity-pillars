import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const WindingProcessSection = () => {
  const containerRef = useRef(null);
  const ballRef = useRef(null);
  const stepsRefs = useRef([]);

  const steps = [
    {
      step: '01',
      title: 'The Discovery & Audit Phase',
      description: 'We audit your current digital footprint, analyze competitor gaps, and map a strict data-backed strategy tailored to your revenue goals.',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      align: 'left' // path is on the left (x=30%)
    },
    {
      step: '02',
      title: 'UX/UI Interactive Design',
      description: "We prototype your complete user journey in high-fidelity Figma — designed around conversion psychology, not aesthetic preference.",
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
      align: 'right' // path is on the right (x=70%)
    },
    {
      step: '03',
      title: 'Full-Stack System Engineering',
      description: 'We build and deploy your high-speed web engine, API integrations, automation flows, and data infrastructure — tested before any go-live.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      align: 'left' // path is on the left (x=30%)
    },
    {
      step: '04',
      title: 'Growth Optimization Retainer',
      description: 'Post-launch, we continuously audit performance, refine AI prompts, and optimize every layer to compound your returns over time.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      align: 'right' // path is on the right (x=70%)
    },
    {
      step: '05',
      title: 'Growth Operations',
      description: 'We help you build the internal team, processes, and operational systems required to sustain growth beyond our engagement.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      align: 'left' // path is on the left (x=30%)
    }
  ];

  // Map each step to its vertical position percentage
  const stepPositions = [15, 35, 55, 75, 95];

  useEffect(() => {
    if (!containerRef.current || !ballRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Animate the ball along the path
      gsap.to(ballRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        motionPath: {
          path: "#winding-path",
          align: "#winding-path",
          alignOrigin: [0.5, 0.5],
        },
        ease: "none"
      });

      // 2. Animate each step's content fading/sliding in as the user scrolls to it
      stepsRefs.current.forEach((stepEl, i) => {
        if (!stepEl) return;
        
        gsap.fromTo(stepEl, 
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepEl,
              start: "top 75%", // Triggers when the top of the step hits 75% down the viewport
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative w-full bg-background overflow-hidden" ref={containerRef} style={{ height: '3000px' }}>
      
      {/* SVG Path Background */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        preserveAspectRatio="none" 
        viewBox="0 0 1000 3000"
      >
        <path 
          id="winding-path" 
          d="M 500 0 C 500 225, 200 225, 200 450 C 200 750, 800 750, 800 1050 C 800 1350, 200 1350, 200 1650 C 200 1950, 800 1950, 800 2250 C 800 2550, 200 2550, 200 2850 C 200 2925, 500 2925, 500 3000" 
          stroke="#000000" 
          strokeWidth="1" 
          vectorEffect="non-scaling-stroke"
          fill="none" 
        />
      </svg>

      {/* The Rolling Ball */}
      <div 
        ref={ballRef} 
        className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-[#AFEA00] rounded-full shadow-[0_0_40px_rgba(175,234,0,0.8)] z-20 pointer-events-none"
      />

      {/* The Steps Content */}
      <div className="absolute inset-0 w-full h-full max-w-6xl mx-auto pointer-events-none">
        {steps.map((item, index) => {
          const yPos = stepPositions[index];
          const isLeftAlign = item.align === 'left';
          
          return (
            <div 
              key={item.step}
              ref={(el) => (stepsRefs.current[index] = el)}
              className="absolute w-full flex items-center px-4 md:px-8"
              style={{ 
                top: `${yPos}%`, 
                transform: 'translateY(-50%)',
              }}
            >
              {/* Graphic/Circle Area */}
              <div 
                className="absolute"
                style={{ 
                  left: isLeftAlign ? '20%' : '80%',
                  transform: 'translate(-50%, -50%)',
                  top: '50%'
                }}
              >
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-background shadow-2xl relative pointer-events-auto">
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/80">{item.step}</span>
                  </div>
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Text Content Area */}
              <div 
                className="absolute w-[45%] md:w-[35%] pointer-events-auto"
                style={{
                  ...(isLeftAlign ? { left: '32%' } : { right: '32%' }),
                  top: '50%',
                  transform: 'translateY(-50%)',
                  textAlign: isLeftAlign ? 'left' : 'right'
                }}
              >
                <div className="text-sm font-bold tracking-widest text-[#AFEA00] mb-2">PHASE {item.step}</div>
                <h3 className="text-2xl md:text-4xl font-bold text-foreground mb-4">{item.title}</h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{item.description}</p>
              </div>

            </div>
          );
        })}
      </div>
      
    </section>
  );
};

export default WindingProcessSection;
