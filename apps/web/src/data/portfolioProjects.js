// Shared project data — used by the live /portfolio page, the homepage
// portfolio teaser, and the /portfolio-preview-* comparison pages, so all of
// them render the exact same projects and images (live-site screenshots)
// instead of drifting out of sync with their own copies.
//
// Order matters: the homepage teaser shows just the first 3 entries, so
// reordering this array also reorders that teaser.
export const portfolioProjects = [
  {
    title: 'Marisol Ferreira',
    slug: 'marisol-ferreira',
    category: 'Portfolio Website · Fine Art Photography',
    description: 'A portfolio site for a fictional analog photographer — every frame hand-printed in the darkroom before it ever reaches a screen. A custom image-trail intro sequence sets the tone before a single word loads.',
    image: '/images/portfolio/marisol-ferreira.jpg',
    liveUrl: '/marisol-ferreira',
    metrics: ['Custom image-trail intro sequence', 'Hand-printed darkroom aesthetic', 'Editorial gallery & about page'],
    dark: true,
  },
  {
    title: 'Meridian',
    slug: 'meridian',
    category: 'Architecture Studio Website · Portfolio & Case Studies',
    description: 'A portfolio site for a fictional architecture bureau spanning Lisbon, Porto, and Copenhagen — precision residential and cultural work presented with the same restraint it was designed with.',
    image: '/images/portfolio/meridian.jpg',
    liveUrl: '/meridian',
    metrics: ['3 studios — Lisbon, Porto, Copenhagen', 'Flagship + project galleries', 'Cursor-tooltip interaction system'],
    dark: false,
  },
  {
    title: 'Drift',
    slug: 'drift-app',
    category: 'Independent Product · Shift-Work Wellness',
    description: 'A personal product concept: a sleep-coaching app for people whose schedule doesn’t follow the sun — night nurses, long-haul drivers, paramedics. Logo, landing page, and in-app experience designed and built end to end.',
    image: '/images/portfolio/drift-app.jpg',
    liveUrl: 'https://developerpawanmaurya.github.io/drift-app/',
    metrics: ['Roster-aware sleep planning', 'Sleep debt & wind-down tracking', 'Logo, landing page & app UI'],
    dark: false,
  },
  {
    title: 'deQollab',
    slug: 'deqollab',
    category: 'Strategic Communications · Brand Authority',
    description: 'A premium PR & comms agency needed a digital presence to match their real-world prestige. We organized a 17-sector portfolio into a seamless, minimalist experience built to command premium retainer fees.',
    image: '/images/portfolio/deqollab.jpg',
    liveUrl: 'https://deqollab.com/',
    metrics: ['17 sectors unified', '345+ verified media placements', '9–12% CVR lift potential'],
    dark: true,
  },
  {
    title: 'KISS Professional Solutions',
    slug: 'kiss-professional-solutions',
    category: 'Enterprise Lead Generation · Office Technology',
    description: 'An Australian office tech & managed services provider needed to unify diverse enterprise verticals under one brand. We deployed an 8-step interactive quote engine and a self-service support bot.',
    image: '/images/portfolio/kiss.jpg',
    liveUrl: 'https://kissps.com.au/',
    metrics: ['3,000+ organizations served', '8-step quote engine', '5 regional offices unified'],
    dark: false,
  },
  {
    title: 'XpertPatient.com',
    slug: 'xpertpatient',
    category: 'Healthcare · Empathetic UX',
    description: 'An award-winning oncology education platform translating dense clinical guidelines into calm, intuitive digital experiences for newly diagnosed patients and caregivers.',
    image: '/images/portfolio/xpertpatient.jpg',
    liveUrl: 'https://xpertpatient.com/',
    metrics: ['Stevie Award winner', '90% of diagnosed community supported', 'WCAG 2.1 AA / ADA compliant'],
    dark: false,
  },
  {
    title: 'PolyAgent',
    slug: 'polyagent',
    category: 'AI Web App · Prediction-Market Trading',
    description: 'An AI trading dashboard concept for automated Polymarket agents — live PnL, wallet balance, and an AI signal feed explaining why the agent is trading, with a single control to pause it instantly.',
    image: '/images/portfolio/polyagent.jpg',
    liveUrl: 'https://developerpawanmaurya.github.io/PolyAgent/',
    metrics: ['Real-time PnL & wallet tracking', 'AI signal feed with rationale', 'White-label ready dashboard'],
    dark: false,
  },
  {
    title: 'Nexus',
    slug: 'nexus',
    category: 'Landing Page & Web App · Predictive AI',
    description: 'A landing page and web app concept for a predictive-AI product, built around a scroll-driven motion narrative that reveals the product story as you move through the page rather than all at once.',
    image: '/images/portfolio/nexus.jpg',
    liveUrl: 'https://developerpawanmaurya.github.io/nexus/',
    metrics: ['Scroll-driven motion narrative', 'Landing page + web app shell', 'NEXUS 2.0 concept'],
    dark: false,
  },
];
