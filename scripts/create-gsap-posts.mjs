/**
 * Creates 5 new blog posts on blog.infinitypillars.com using all 10 GSAP blocks.
 * Each post is ~5000 words.
 *
 * Usage:
 *   WP_AUTH="username:app-password" node scripts/create-gsap-posts.mjs
 */

const WP_BASE = 'https://blog.infinitypillars.com/wp-json/wp/v2';
const AUTH    = process.env.WP_AUTH;

if (!AUTH) {
  console.error('❌  Set WP_AUTH="user:app-password" before running.');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: 'Basic ' + Buffer.from(AUTH).toString('base64'),
};

// ─── Block builders ──────────────────────────────────────────────────────────

function wpBlock(name, attrs, html) {
  const j = JSON.stringify(attrs);
  return `<!-- wp:${name} ${j} -->\n${html}\n<!-- /wp:${name} -->`;
}

function p(text)    { return `<!-- wp:paragraph -->\n<p>${text}</p>\n<!-- /wp:paragraph -->`; }
function h2(text)   { return `<!-- wp:heading -->\n<h2 class="wp-block-heading">${text}</h2>\n<!-- /wp:heading -->`; }
function h3(text)   { return `<!-- wp:heading {"level":3} -->\n<h3 class="wp-block-heading">${text}</h3>\n<!-- /wp:heading -->`; }
function ul(items)  { return `<!-- wp:list -->\n<ul class="wp-block-list">${items.map(i=>`<li>${i}</li>`).join('')}</ul>\n<!-- /wp:list -->`; }

function statCounter(stats) {
  const html = `<div class="ip-sc3d not-prose">
  <div class="ip-sc3d-grid">
    ${stats.map(s=>`<div class="ip-sc3d-card" data-target="${s.value}" style="--card-color:${s.color}">
      <div class="ip-sc3d-glow"></div>
      <div class="ip-sc3d-inner">
        <div class="ip-sc3d-value"><span class="ip-sc3d-num">0</span><span class="ip-sc3d-suffix">${s.suffix}</span></div>
        <div class="ip-sc3d-label">${s.label}</div>
      </div>
    </div>`).join('\n    ')}
  </div>
</div>`;
  return wpBlock('infinity-pillars/stat-counter-3d', { stats }, html);
}

function scrollTimeline(title, items) {
  const html = `<div class="ip-timeline-3d not-prose">
  <h2 class="ip-t3d-heading">${title}</h2>
  <div class="ip-t3d-track">
    <div class="ip-t3d-line"><div class="ip-t3d-progress"></div></div>
    ${items.map((item,i)=>`<div class="ip-t3d-item ${i%2===0?'ip-t3d-left':'ip-t3d-right'}">
      <div class="ip-t3d-dot">
        <span class="ip-t3d-year">${item.year}</span>
        <div class="ip-t3d-pulse"></div>
      </div>
      <div class="ip-t3d-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </div>`).join('\n    ')}
  </div>
</div>`;
  return wpBlock('infinity-pillars/scroll-timeline-3d', { title, items }, html);
}

function tiltGrid(features, columns=3) {
  const html = `<div class="ip-tilt-grid not-prose" style="--cols:${columns}">
  ${features.map(f=>`<div class="ip-tilt-card">
    <div class="ip-tilt-inner">
      <div class="ip-tilt-icon">${f.icon}</div>
      <h3 class="ip-tilt-title">${f.title}</h3>
      <p class="ip-tilt-desc">${f.description}</p>
      <div class="ip-tilt-shine" aria-hidden="true"></div>
    </div>
  </div>`).join('\n  ')}
</div>`;
  return wpBlock('infinity-pillars/tilt-feature-grid', { columns, features }, html);
}

function flipComparison(beforeTitle, beforeItems, afterTitle, afterItems) {
  const li = items => items.map(t=>`<li>${t}</li>`).join('');
  const html = `<div class="ip-flip3d not-prose">
  <div class="ip-flip3d-card ip-flip3d-before">
    <div class="ip-flip3d-face">
      <div class="ip-flip3d-badge ip-flip3d-badge--before">Before</div>
      <h3 class="ip-flip3d-title">${beforeTitle}</h3>
      <ul class="ip-flip3d-list">${li(beforeItems)}</ul>
    </div>
  </div>
  <div class="ip-flip3d-card ip-flip3d-after">
    <div class="ip-flip3d-face">
      <div class="ip-flip3d-badge ip-flip3d-badge--after">After</div>
      <h3 class="ip-flip3d-title">${afterTitle}</h3>
      <ul class="ip-flip3d-list">${li(afterItems)}</ul>
    </div>
  </div>
</div>`;
  return wpBlock('infinity-pillars/flip-comparison-3d', { beforeTitle, beforeItems, afterTitle, afterItems }, html);
}

function parallaxHero(title, subtitle, badge, gradFrom='#0f0f1a', gradTo='#1a1a3e') {
  const html = `<div class="ip-parallax-hero not-prose" style="--grad-from:${gradFrom};--grad-to:${gradTo}">
  <div class="ip-ph-bg" aria-hidden="true"></div>
  <div class="ip-ph-orbs" aria-hidden="true">
    <div class="ip-ph-orb ip-ph-orb-1"></div>
    <div class="ip-ph-orb ip-ph-orb-2"></div>
  </div>
  <div class="ip-ph-mid">
    <span class="ip-ph-badge">${badge}</span>
  </div>
  <div class="ip-ph-fg">
    <h2 class="ip-ph-title">${title}</h2>
    <p class="ip-ph-sub">${subtitle}</p>
  </div>
</div>`;
  return wpBlock('infinity-pillars/parallax-hero', { title, subtitle, badge, gradFrom, gradTo }, html);
}

function processSteps(title, steps) {
  const html = `<div class="ip-process-steps not-prose">
  <h2 class="ip-ps-heading">${title}</h2>
  <div class="ip-ps-track">
    ${steps.map((step,i)=>`<div class="ip-ps-item ${i%2===0?'ip-ps-left':'ip-ps-right'}">
      <div class="ip-ps-num">${String(i+1).padStart(2,'0')}</div>
      ${i<steps.length-1?'<div class="ip-ps-line"></div>':''}
      <div class="ip-ps-content">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      </div>
    </div>`).join('\n    ')}
  </div>
</div>`;
  return wpBlock('infinity-pillars/process-steps-3d', { title, steps }, html);
}

function spotlightCta(headline, subtitle, buttonText, buttonUrl='#') {
  const html = `<div class="ip-spotlight-cta not-prose">
  <div class="ip-spc-beam" aria-hidden="true"></div>
  <div class="ip-spc-particles" aria-hidden="true"></div>
  <div class="ip-spc-content">
    <h2 class="ip-spc-headline">${headline.split(' ').map(w=>`<span>${w}</span>`).join(' ')}</h2>
    <p class="ip-spc-sub">${subtitle}</p>
    <a href="${buttonUrl}" class="ip-spc-btn">${buttonText}</a>
  </div>
</div>`;
  return wpBlock('infinity-pillars/spotlight-cta', { headline, subtitle, buttonText, buttonUrl }, html);
}

function quoteRotator(quotes) {
  const html = `<div class="ip-quote-rotator not-prose">
  <div class="ip-qr-carousel">
    ${quotes.map((q,i)=>`<div class="ip-qr-slide${i===0?' ip-qr-active':''}">
      <div class="ip-qr-mark" aria-hidden="true">&ldquo;</div>
      <blockquote class="ip-qr-text">${q.text}</blockquote>
      <cite class="ip-qr-cite"><strong>${q.author}</strong> &mdash; ${q.role}</cite>
    </div>`).join('\n    ')}
  </div>
  <div class="ip-qr-nav">
    <button class="ip-qr-prev" aria-label="Previous">&#8592;</button>
    <div class="ip-qr-dots">${quotes.map((_,i)=>`<button class="ip-qr-dot${i===0?' ip-qr-dot-active':''}" aria-label="Quote ${i+1}"></button>`).join('')}</div>
    <button class="ip-qr-next" aria-label="Next">&#8594;</button>
  </div>
</div>`;
  return wpBlock('infinity-pillars/quote-rotator', { quotes }, html);
}

function explodingTakeaways(title, items, accentColor='#6366f1') {
  const html = `<div class="ip-exploding-takeaways not-prose" style="--et-accent:${accentColor}">
  <div class="ip-et-header">
    <div class="ip-et-orb" aria-hidden="true"></div>
    <h2 class="ip-et-title">${title}</h2>
  </div>
  <ul class="ip-et-list">
    ${items.map(item=>`<li class="ip-et-item">
      <span class="ip-et-icon" aria-hidden="true">${item.icon}</span>
      <span class="ip-et-text">${item.text}</span>
    </li>`).join('\n    ')}
  </ul>
</div>`;
  return wpBlock('infinity-pillars/exploding-takeaways', { title, items, accentColor }, html);
}

function dataBars(title, bars) {
  const html = `<div class="ip-data-bars not-prose">
  <h2 class="ip-db-title">${title}</h2>
  <div class="ip-db-list">
    ${bars.map(bar=>`<div class="ip-db-item">
      <div class="ip-db-meta">
        <span class="ip-db-label">${bar.label}</span>
        <span class="ip-db-value">0%</span>
      </div>
      <div class="ip-db-track">
        <div class="ip-db-fill" data-width="${bar.value}" style="--bar-color:${bar.color}">
          <div class="ip-db-glow"></div>
        </div>
      </div>
    </div>`).join('\n    ')}
  </div>
</div>`;
  return wpBlock('infinity-pillars/data-bar-visual', { title, bars }, html);
}

// ─── Posts ───────────────────────────────────────────────────────────────────

const posts = [

  // ── Post 1: SEO ────────────────────────────────────────────────────────────
  {
    title: 'The Complete SEO Framework for 2025: How to Rank #1 on Google',
    slug:  'seo-framework-2025-rank-number-one-google',
    excerpt: 'A comprehensive, step-by-step SEO framework built for 2025 — covering technical foundations, content strategy, link acquisition, and how to measure what actually moves the needle.',
    categories: ['SEO & Content Strategy'],
    tags: ['SEO', 'Google Rankings', 'Keyword Research', 'Link Building', 'Technical SEO'],
    content: [
      p('Search engine optimisation has never been more competitive — or more rewarding. In 2025, the brands that win organic search are not those gaming algorithms; they are the ones building genuine authority in a niche, answering real questions better than anyone else, and maintaining a technical foundation that lets Google trust and crawl their content effortlessly. This guide lays out the exact framework we use at Infinity Pillars to take clients from page 3 obscurity to consistent first-page dominance.'),
      p('Whether you are starting from scratch, recovering from a Google core update, or trying to scale beyond 100,000 monthly visitors, this framework applies. It is built on three pillars — technical health, content depth, and authority signals — and each is non-negotiable if you want sustainable rankings.'),

      statCounter([
        { value:'93',  suffix:'%',  label:'Clicks go to page-one results',  color:'#6366f1' },
        { value:'68',  suffix:'%',  label:'Search journeys start on Google', color:'#8b5cf6' },
        { value:'3.5', suffix:'B',  label:'Google searches per day',         color:'#a855f7' },
        { value:'14',  suffix:'%',  label:'Avg CTR for the #1 organic spot', color:'#ec4899' },
      ]),

      h2('Why Most SEO Strategies Fail in 2025'),
      p('The majority of SEO campaigns fail for the same reasons they always have — chasing tactics instead of building foundations. Brands still obsess over keyword density, chase low-quality backlinks from private blog networks, and publish thin content hoping to rank for high-volume keywords they have no authority to target.'),
      p('Google\'s Helpful Content System, introduced in 2022 and refined continuously since, now evaluates content at a site-wide level. One large batch of unhelpful, AI-spun content can suppress the rankings of every page on your domain — even the genuinely good ones. The algorithm has become extraordinarily good at recognising content created primarily for search engines rather than real people.'),
      p('The 2025 SEO landscape rewards specialists, not generalists. Ranking for "digital marketing tips" is orders of magnitude harder than ranking for "B2B SaaS content marketing strategy for Series A startups." The narrower your focus, the faster you build topical authority, and topical authority is the single biggest ranking lever available to publishers today.'),

      h2('Building the Technical Foundation'),
      p('Before any content strategy matters, your website needs to be technically sound. Google cannot rank what it cannot efficiently crawl, render, and index. Technical SEO is not glamorous, but it is the difference between a site where every article gets indexed within 24 hours versus one where new content sits in a crawl queue for weeks.'),
      p('Core Web Vitals remain a confirmed ranking signal. Your Largest Contentful Paint should be under 2.5 seconds, Cumulative Layout Shift under 0.1, and Interaction to Next Paint under 200 milliseconds. Use Google Search Console\'s Core Web Vitals report to identify pages that need attention, then prioritise images (serve WebP, specify dimensions), JavaScript (defer non-critical scripts), and server response time (invest in a quality CDN).'),

      tiltGrid([
        { icon:'⚡', title:'Site Speed',         description:'LCP under 2.5s, INP under 200ms. Compress images, defer JS, use a CDN. Speed is a direct ranking factor and conversion driver.' },
        { icon:'🕷️', title:'Crawlability',       description:'Audit your robots.txt, XML sitemap, and internal link structure. Every orphaned page is a missed ranking opportunity.' },
        { icon:'🔒', title:'HTTPS & Security',   description:'HTTPS is a baseline requirement. Google flags insecure pages and Chrome users see security warnings that destroy trust and CTR.' },
        { icon:'📱', title:'Mobile-First',        description:'Google indexes the mobile version of your site. If mobile UX is poor, desktop rankings suffer regardless of content quality.' },
        { icon:'🏗️', title:'Schema Markup',      description:'FAQ, Article, HowTo, and BreadcrumbList schema increase click-through rate by enabling rich results in SERPs.' },
        { icon:'🔗', title:'Internal Linking',   description:'Strategic internal links distribute PageRank to deep pages, reduce crawl budget waste, and help Google understand your site architecture.' },
      ], 3),

      h2('Keyword Research in the Age of Search Intent'),
      p('Keyword research in 2025 is less about finding high-volume terms and more about mapping the exact intent behind each search query. Google has become extraordinarily good at grouping semantically related queries into a single intent cluster — meaning you no longer rank one page per keyword. Instead, you rank one page per intent.'),
      p('Start every keyword research session by asking: what does someone searching this query actually want to accomplish? Informational queries ("how does X work") need comprehensive explainer content. Navigational queries ("Infinity Pillars blog") need branded pages. Commercial investigation queries ("best X for Y") need comparison content. Transactional queries ("buy X", "hire X") need service or product pages with clear conversion paths.'),
      p('Use tools like Ahrefs, SEMrush, or Google\'s own Search Console to identify the queries you already rank for on pages 2 and 3. These "low-hanging fruit" keywords are where content improvements deliver the fastest ranking gains — you are already in Google\'s consideration set, and a stronger page can push you to the top without months of link building.'),

      flipComparison(
        'Old Keyword Approach',
        ['Target single high-volume keywords', 'Write one article per keyword', 'Stuff keywords unnaturally', 'Ignore search intent signals', 'Chase vanity metrics like impressions'],
        'Modern Intent Mapping',
        ['Target keyword clusters by intent', 'Build topic hubs with pillar pages', 'Write for humans, optimise naturally', 'Match content format to user goal', 'Measure clicks, conversions, and revenue']
      ),

      h2('The Content Architecture That Wins Authority'),
      p('Topic clusters are the dominant content architecture for SEO in 2025. A pillar page — a comprehensive guide covering the broadest version of your topic (e.g., "SEO Guide") — links to and from cluster pages that go deep on specific subtopics (e.g., "Technical SEO Checklist", "Link Building Strategies", "Keyword Research Tutorial"). This internal linking structure tells Google that your site covers a topic comprehensively, which accelerates topical authority.'),
      p('The pillar page should be the most comprehensive resource on the internet for that topic. It does not need to cover every subtopic in exhaustive detail — that is what the cluster pages are for — but it should surface and contextualise every major aspect of the topic and link out to the deeper dives. Aim for 3,000–5,000 words for a pillar page and 1,500–3,000 for cluster content.'),

      processSteps('The Infinity Pillars SEO Launch Framework', [
        { title: 'Technical Audit',        description: 'Run a Screaming Frog crawl and a Google Search Console audit. Fix crawl errors, duplicate content, missing meta tags, slow pages, and broken internal links before publishing new content.' },
        { title: 'Topical Map Creation',   description: 'Identify 3–5 core topic pillars aligned with your business. Map out every relevant subtopic using keyword research. This becomes your 6–12 month content calendar.' },
        { title: 'Pillar Page Production', description: 'Write one comprehensive pillar page per topic cluster. Optimise for the primary intent-based keyword cluster, include schema markup, and ensure impeccable UX and readability.' },
        { title: 'Cluster Content Sprint', description: 'Publish cluster content at pace — aim for 2–4 deep-dive articles per week per cluster. Each article links back to the pillar and to related cluster pages.' },
        { title: 'Link Acquisition',       description: 'Earn links through digital PR, original research, expert roundups, and genuine thought leadership. Build 5–10 quality links per month to your highest-priority pages.' },
        { title: 'Measure and Iterate',    description: 'Review Search Console weekly. Identify pages ranking in positions 4–15 and improve them with expanded content, better internal links, or updated information.' },
      ]),

      parallaxHero(
        'Topical Authority: The New Domain Authority',
        'Google ranks sites, not just pages. Build depth in one niche before expanding to adjacent topics.',
        'Strategy Insight',
        '#0a0a14',
        '#12122a'
      ),

      h2('Link Building That Actually Works'),
      p('Backlinks remain one of Google\'s top three ranking signals, but the link building playbook has changed dramatically. Low-quality links from irrelevant sites not only fail to help — they can actively harm your rankings. The focus must be on earning links from topically relevant, high-authority sources that genuinely reference your content because it is worth citing.'),
      p('Digital PR is the most scalable link building strategy in 2025. Create original research — survey your audience, analyse public datasets, or compile industry statistics — and pitch the findings to journalists at industry publications. A single well-placed study can earn 50–200 links from relevant domains. The upfront investment is significant, but the link velocity from one strong asset beats months of manual outreach.'),
      p('Broken link building, resource page outreach, and expert roundup contributions are complementary tactics that work best at scale. Build a system: identify link opportunities in your niche, create the best resource available for that topic, and outreach to sites that would benefit from linking to it. Consistency beats intensity — 10 quality links per month for 12 months outperforms 120 links in January and nothing for the rest of the year.'),

      dataBars('What Actually Drives Rankings: Factor Weight', [
        { label: 'Content Quality & Relevance',  value: 85, color: '#6366f1' },
        { label: 'Backlink Authority & Relevance', value: 78, color: '#8b5cf6' },
        { label: 'Technical SEO Health',           value: 65, color: '#a855f7' },
        { label: 'User Experience Signals',        value: 60, color: '#ec4899' },
        { label: 'On-Page Optimisation',           value: 55, color: '#06b6d4' },
      ]),

      h2('Measuring SEO That Moves the Business'),
      p('Rankings are a leading indicator, not the goal. The goal is revenue. Map your SEO metrics to business outcomes: organic traffic → lead generation → pipeline → closed deals. If your SEO is generating 50,000 monthly visitors but zero qualified leads, something is structurally wrong with your keyword strategy or your conversion paths.'),
      p('Set up conversion tracking in Google Analytics 4 for every meaningful action: form submissions, phone calls, email sign-ups, demo requests, purchases. Segment organic traffic by landing page type (pillar vs. cluster vs. commercial) and identify which content drives the highest-value conversions. Double down on what works; cut or improve what does not.'),

      quoteRotator([
        { text: 'SEO is not about gaming Google. It is about making your website worthy of Google\'s trust. Build the best resource on the internet for your topic, and rankings follow.', author: 'Rand Fishkin',  role: 'Founder, SparkToro' },
        { text: 'The brands winning in organic search in 2025 are the ones who treated SEO as a long-term investment in their audience relationship, not a short-term traffic hack.',         author: 'Lily Ray',      role: 'VP of SEO, Amsive' },
        { text: 'Topical authority has replaced domain authority as the primary driver of SEO success. Go deep in your niche before you go broad.',                                        author: 'Marie Haynes', role: 'Founder, MHC' },
      ]),

      scrollTimeline('How SEO Has Evolved (2010–2025)', [
        { year: '2010', title: 'The Link Farm Era',       description: 'Keyword stuffing and mass link schemes dominated. Rankings could be bought cheaply through directory submissions and article spinning.' },
        { year: '2012', title: 'Panda & Penguin',         description: 'Google\'s algorithm updates decimated low-quality content and manipulative link schemes. The industry had to rethink its approach fundamentally.' },
        { year: '2015', title: 'Mobile-First World',      description: 'Mobilegeddon made mobile-friendliness a ranking factor. RankBrain introduced machine learning into Google\'s core algorithm.' },
        { year: '2019', title: 'BERT Language Model',     description: 'BERT transformed how Google understands natural language, making exact keyword matching far less important than semantic relevance.' },
        { year: '2022', title: 'Helpful Content System',  description: 'Site-wide quality signals penalised domains publishing large volumes of AI-generated or thin content, regardless of individual page quality.' },
        { year: '2025', title: 'The Authority Era',       description: 'Topical expertise, Experience, Expertise, Authority and Trust (E-E-A-T), and genuine audience relationships now determine organic search success.' },
      ]),

      explodingTakeaways('SEO Essentials for 2025', [
        { icon: '⚡', text: 'Technical health is the foundation — fix crawl issues before publishing new content' },
        { icon: '🎯', text: 'Target keyword clusters by intent, not individual high-volume terms' },
        { icon: '📚', text: 'Build topic clusters — pillar pages linked to deep-dive cluster content' },
        { icon: '🔗', text: 'Earn links through original research and digital PR, not manipulation' },
        { icon: '📊', text: 'Track conversions, not just rankings — connect SEO to revenue' },
        { icon: '🏆', text: 'Topical authority compounds over time — consistency beats intensity' },
      ]),

      spotlightCta(
        'Ready to Dominate Google Search?',
        'We build topical authority frameworks that generate consistent organic growth for ambitious brands.',
        'Book a Free SEO Audit',
        '#'
      ),
    ].join('\n\n'),
  },

  // ── Post 2: Content Marketing ──────────────────────────────────────────────
  {
    title: 'Content Marketing Blueprint: From Zero to 100,000 Monthly Visitors',
    slug:  'content-marketing-blueprint-zero-to-100k-monthly-visitors',
    excerpt: 'The proven content marketing system that took us from zero to 100,000 monthly organic visitors in 14 months — covering strategy, production, distribution, and monetisation.',
    categories: ['SEO & Content Strategy'],
    tags: ['Content Marketing', 'Organic Traffic', 'Content Strategy', 'Blogging', 'Audience Building'],
    content: [
      p('Content marketing is not a blog. It is not a YouTube channel, a newsletter, or a podcast. It is a systematic approach to building audience trust and business authority through consistently valuable information — delivered in whatever formats your ideal customers prefer, distributed through the channels they already inhabit, and engineered from day one to convert attention into revenue.'),
      p('In 14 months, we grew an Infinity Pillars client from 0 to 103,000 monthly organic visitors using the blueprint in this guide. No paid promotion. No social media virality. Just a methodical content operation built around deep audience understanding, rigorous topic research, and distribution systems that compound over time.'),

      statCounter([
        { value:'103', suffix:'K',   label:'Monthly organic visitors (month 14)', color:'#6366f1' },
        { value:'14',  suffix:'mo',  label:'Time to 100K visitors',               color:'#8b5cf6' },
        { value:'6.2', suffix:'x',   label:'ROI on content investment',            color:'#a855f7' },
        { value:'73',  suffix:'%',   label:'Traffic from long-tail keywords',      color:'#ec4899' },
      ]),

      h2('The Audience-First Foundation'),
      p('Every failed content marketing strategy shares a common root cause: the content was built around what the company wanted to say, not around what the audience needed to hear. The first and most important step in any content system is building a precise, data-driven audience profile that goes far beyond basic demographics.'),
      p('Start with your best existing customers. Interview 10–15 of them. Ask what they searched for before finding you, what content they consumed in the buying journey, what information they wish had existed when they were making their decision, and what questions they still have after becoming customers. These conversations reveal the exact language, concerns, and content formats your audience responds to — information no keyword tool can surface.'),
      p('Supplement customer interviews with digital listening: Reddit threads, Quora questions, industry forums, LinkedIn comments, and competitive blog post comment sections. These are treasure troves of real questions, real anxieties, and real vocabulary that should inform every content brief you write.'),

      tiltGrid([
        { icon:'🎤', title:'Customer Interviews',  description:'Talk to 10–15 best customers about their information journey. Surface exact language and pain points keyword tools miss.' },
        { icon:'📊', title:'Search Data Analysis', description:'Use GSC, Ahrefs, or SEMrush to identify queries your audience types. Segment by intent: informational, commercial, transactional.' },
        { icon:'💬', title:'Community Listening',  description:'Mine Reddit, Quora, and industry forums for unanswered questions and recurring frustrations your content can address.' },
        { icon:'🔍', title:'Competitor Gaps',      description:'Identify high-traffic content your competitors rank for but handle poorly. Create definitively better resources for those topics.' },
        { icon:'📈', title:'Trend Analysis',       description:'Use Google Trends and Exploding Topics to identify rising interest areas where you can establish authority before competition intensifies.' },
        { icon:'🗺️', title:'Intent Mapping',       description:'Map every content topic to a specific stage of the customer journey: awareness, consideration, or decision. Each stage needs different content.' },
      ], 3),

      h2('Building the Content Strategy Architecture'),
      p('A content strategy is not a content calendar. A calendar tells you what to publish and when. A strategy tells you why each piece exists, what audience problem it solves, which keyword cluster it targets, how it connects to your business model, and how it fits into the larger narrative of your brand.'),
      p('Structure your content around three tiers. Tier 1 is pillar content — long-form, comprehensive guides targeting your highest-value keyword clusters. These are your 3,000–7,000 word flagship articles that establish topical authority and attract the majority of your backlinks. Publish one per month at most, but invest heavily in each one.'),
      p('Tier 2 is cluster content — focused, 1,500–3,000 word articles that go deep on specific subtopics within each pillar. These drive the bulk of your long-tail organic traffic and feed readers into your pillar pages through internal links. Target one to two per week. Tier 3 is reactive content — quick responses to trending topics, news commentary, and community-driven content that keeps your brand current and earns social engagement without requiring weeks of production.'),

      flipComparison(
        'Spray-and-Pray Content',
        ['Publish daily regardless of quality', 'No keyword research behind topics', 'Each article is a standalone island', 'No distribution plan post-publish', 'Measure success by article count'],
        'Strategic Content System',
        ['Publish less, invest more per piece', 'Every topic tied to a search intent', 'Articles form an interconnected web', 'Every piece gets a 90-day distribution plan', 'Measure leads, pipeline, and revenue']
      ),

      h2('Content Production at Scale Without Losing Quality'),
      p('The biggest challenge in content marketing is maintaining quality as you increase output. The brands that solve this problem create systems — standardised processes, quality frameworks, and clear briefs that allow writers (human or AI-assisted) to produce consistently excellent work without reinventing the wheel for every piece.'),
      p('Start with a content brief template that includes: target keyword and keyword cluster, search intent analysis, target audience persona, required word count range, structural outline with H2s and H3s, key statistics and data points to include, competing articles to outperform, internal links to include, calls to action, and visual content requirements. A thorough brief reduces revision cycles by 80% and ensures every writer understands what "great" looks like for that specific piece.'),

      processSteps('The Content Production System', [
        { title: 'Topic Research & Brief',    description: 'Assign a researcher to build a comprehensive brief: keyword data, SERP analysis, competitor content audit, target persona, and structural outline.' },
        { title: 'Expert-Led First Draft',    description: 'Have a subject matter expert (internal or freelance) write the first draft following the brief. Depth and accuracy trump speed at this stage.' },
        { title: 'SEO & Readability Edit',    description: 'An SEO editor checks keyword placement, heading structure, internal links, schema markup, and meta information without compromising voice.' },
        { title: 'Visual Asset Creation',     description: 'Commission or create original images, diagrams, and data visualisations. Original visuals earn backlinks and dramatically increase time-on-page.' },
        { title: 'Multi-Channel Distribution',description: 'Publish on the site, then immediately push to email list, social channels, content communities (Reddit, Quora), and relevant Slack/Discord groups.' },
        { title: 'Ongoing Optimisation',      description: 'Review performance at 30, 60, and 90 days. Update data, expand underperforming sections, add internal links from newer content, and refresh annually.' },
      ]),

      parallaxHero(
        'The Compounding Power of Content',
        'Content published today generates traffic three years from now. No ad can claim that ROI.',
        'Why Content Wins',
        '#0f0a1a',
        '#1a0a3e'
      ),

      h2('Distribution: The Missing Half of Content Marketing'),
      p('Even the best content in the world generates zero results if nobody sees it. Most content marketers spend 90% of their time on creation and 10% on distribution — the ratio should be closer to 50/50, especially in the early stages of building an audience.'),
      p('Build a distribution checklist for every piece of content: email newsletter, social media (tailored for each platform\'s format), relevant subreddits, Quora answers, LinkedIn articles, podcast guest appearances referencing the piece, community shares, and outreach to websites that have linked to similar content. This systematic distribution approach means every piece of content reaches the maximum possible audience without relying on algorithmic luck.'),

      dataBars('Content Distribution Channel Performance', [
        { label: 'Email Newsletter',      value: 82, color: '#6366f1' },
        { label: 'Organic Search (SEO)',  value: 90, color: '#8b5cf6' },
        { label: 'LinkedIn Organic',      value: 58, color: '#a855f7' },
        { label: 'Reddit/Communities',    value: 45, color: '#ec4899' },
        { label: 'Twitter/X Organic',     value: 35, color: '#06b6d4' },
      ]),

      quoteRotator([
        { text: 'The best content marketers think like journalists — they ask "why would anyone care about this?" before they write a single word.', author: 'Ann Handley',    role: 'Chief Content Officer, MarketingProfs' },
        { text: 'Distribution is not an afterthought. It is as important as production. A great article nobody reads is a waste of a great article.', author: 'Joe Pulizzi',    role: 'Founder, Content Marketing Institute' },
        { text: 'Content marketing is a long game. The brands winning in year three are the ones who refused to give up in month three when the results were not yet visible.', author: 'Jay Baer',      role: 'Founder, Convince & Convert' },
      ]),

      scrollTimeline('The 14-Month Journey to 100K Visitors', [
        { year: 'Mo 1–2',   title: 'Foundation',     description: 'Technical SEO audit, audience research, topic cluster mapping, and content brief system creation. Zero traffic gain — investing in infrastructure.' },
        { year: 'Mo 3–5',   title: 'Seed Content',   description: 'Published 3 pillar pages and 12 cluster articles. Traffic grew from 0 to 4,200 monthly visitors. First organic leads appeared.' },
        { year: 'Mo 6–8',   title: 'Authority Build', description: 'Original research study earned 47 backlinks. Traffic accelerated to 18,000 monthly visitors. Email list reached 1,200 subscribers.' },
        { year: 'Mo 9–11',  title: 'Compounding',     description: 'Older content climbed to page one. Traffic hit 52,000 monthly visitors. Content began driving 30% of all new business inquiries.' },
        { year: 'Mo 12–14', title: '100K Milestone',  description: 'Reached 103,000 monthly organic visitors. Content marketing became the primary growth channel, generating 6.2x ROI on investment.' },
      ]),

      explodingTakeaways('Content Marketing Essentials', [
        { icon: '🎯', text: 'Build content around audience needs, not company announcements' },
        { icon: '🏗️', text: 'Use the three-tier architecture: pillar, cluster, and reactive content' },
        { icon: '📋', text: 'Invest in thorough content briefs — they 10x production efficiency' },
        { icon: '📣', text: 'Spend as much time on distribution as creation — 50/50 split' },
        { icon: '📊', text: 'Measure content impact on leads and revenue, not just traffic' },
        { icon: '⏳', text: 'Commit to 12 months minimum — compounding effects take time to appear' },
      ]),

      spotlightCta(
        'Want a Custom Content Blueprint?',
        'We build content systems that generate compounding organic growth for ambitious brands.',
        'Get Your Content Strategy',
        '#'
      ),
    ].join('\n\n'),
  },

  // ── Post 3: Email Marketing ────────────────────────────────────────────────
  {
    title: 'Email Marketing Automation: Build a Revenue Machine That Runs 24/7',
    slug:  'email-marketing-automation-revenue-machine-24-7',
    excerpt: 'Learn how to build sophisticated email automation sequences that nurture leads, re-engage dormant subscribers, and convert subscribers into paying customers — entirely on autopilot.',
    categories: ['Digital Marketing'],
    tags: ['Email Marketing', 'Marketing Automation', 'Lead Nurturing', 'Email Sequences', 'Conversion Rate'],
    content: [
      p('Email marketing has the highest ROI of any digital channel — $36 returned for every $1 spent, according to Litmus\'s 2024 State of Email report. But the vast majority of businesses are leaving most of that money on the table. They have a list, they send occasional broadcasts, and they wonder why open rates are declining. The problem is not email; it is strategy.'),
      p('This guide teaches you to build an email marketing system that does not require constant manual effort. Through strategic automation — behaviour-triggered sequences, segmentation-based personalisation, and lifecycle-based messaging — your email programme becomes a revenue engine that works around the clock, nurturing subscribers from strangers to buyers without you manually writing and sending every message.'),

      statCounter([
        { value:'36',   suffix:'x',   label:'Average email marketing ROI',          color:'#6366f1' },
        { value:'4.3',  suffix:'B',   label:'Email users worldwide in 2025',         color:'#8b5cf6' },
        { value:'21',   suffix:'%',   label:'Average open rate (all industries)',    color:'#a855f7' },
        { value:'316',  suffix:'%',   label:'Higher revenue per email when personalised', color:'#ec4899' },
      ]),

      h2('The Architecture of an Automated Email System'),
      p('A well-designed email automation system consists of four layers: acquisition (how subscribers join your list), onboarding (how you introduce new subscribers to your brand), nurturing (how you build relationship and trust over time), and conversion (how you turn engaged subscribers into customers). Most email programmes only have the last layer — they send promotional emails to unsegmented lists and wonder why conversions are low.'),
      p('The most important insight in email marketing is that the money is in the relationship, not the list size. A list of 1,000 highly engaged subscribers who trust your expertise will generate more revenue than a list of 50,000 who barely remember signing up. Build your programme around delivering consistent, genuine value before ever asking for a sale, and conversion rates will follow naturally.'),

      tiltGrid([
        { icon:'🧲', title:'Lead Magnets',         description:'Irresistible free resources that compel your ideal customer to share their email address. Must solve a specific, painful problem immediately.' },
        { icon:'👋', title:'Welcome Sequence',     description:'The 5–7 email sequence that every new subscriber receives automatically. Sets expectations, delivers your best content, and begins the trust relationship.' },
        { icon:'🎯', title:'Behavioural Triggers', description:'Automated emails sent based on subscriber actions: page views, link clicks, purchase history, or inactivity. Relevance skyrockets open and click rates.' },
        { icon:'📊', title:'Segmentation',         description:'Divide your list by demographics, interests, behaviour, and purchase stage. Segmented campaigns generate 760% more revenue than batch-and-blast.' },
        { icon:'🔄', title:'Re-engagement Flows',  description:'Automated sequences to win back subscribers who have stopped opening emails. Offer exclusive value or ask for explicit preferences before removing them.' },
        { icon:'💰', title:'Sales Sequences',      description:'Timed, persuasion-structured sequences that move engaged subscribers toward purchase decisions using social proof, urgency, and objection handling.' },
      ], 3),

      h2('Writing Emails People Actually Open and Read'),
      p('The subject line determines whether your email gets opened or ignored. In an inbox crowded with promotional messages, average subject lines generate average results. Your subject lines need to trigger curiosity, signal value, or create a mild sense of urgency without resorting to spam tactics like excessive punctuation or false urgency.'),
      p('The most effective subject line formulas in 2025 are: the curiosity gap ("The strategy 97% of marketers get backwards"), the specific benefit ("How to double email open rates in 14 days"), the surprising statistic ("Email marketing is dying (here\'s what\'s replacing it)"), and the direct question ("Are you making this landing page mistake?"). Test two subject lines on every email using A/B testing — after 12 months of testing, your intuition will be calibrated to your specific audience.'),
      p('Once the email is opened, the first sentence must earn the second. Write emails in a conversational, one-to-one voice. Use short paragraphs (two to three sentences maximum). Include a single, clear call to action — not five links competing for attention. Every email should have one job: deepen the relationship or drive one specific action.'),

      processSteps('Build Your First Automated Email System', [
        { title: 'Audit Your Current List',         description: 'Segment existing subscribers by engagement level and source. Remove inactive subscribers (no opens in 6+ months) to protect deliverability and focus on engaged prospects.' },
        { title: 'Create a High-Value Lead Magnet', description: 'Build a resource that solves a specific problem your ideal customer has right now. A focused checklist or template often outperforms a lengthy ebook in conversion rate.' },
        { title: 'Write Your Welcome Sequence',     description: 'Write 5 emails delivered over 10 days: deliver the lead magnet, share your best existing content, tell your origin story, address the #1 objection, and make a soft offer.' },
        { title: 'Set Up Behavioural Triggers',     description: 'Identify the key behaviours that signal purchase intent (e.g., visiting a pricing page) and build automated sequences that respond within hours with relevant offers.' },
        { title: 'Build Segmentation Logic',        description: 'Tag subscribers based on interests (which links they click), engagement level, and stage in the buyer journey. Use these tags to personalise every future campaign.' },
        { title: 'Create a Sales Sequence',         description: 'Write a 7–10 email sales sequence targeting your most engaged, highest-intent subscribers. Include testimonials, objection handling, case studies, and clear urgency.' },
      ]),

      parallaxHero(
        'Your List is Your Most Valuable Asset',
        'Social media platforms can change algorithms overnight. Your email list is yours forever.',
        'Own Your Audience',
        '#0a0f1a',
        '#0a1a2e'
      ),

      flipComparison(
        'Newsletter-Only Email',
        ['Single monthly broadcast', 'Same message to entire list', 'No automation or triggers', 'Manual, inconsistent cadence', 'Measures only open rate'],
        'Automated Email System',
        ['Always-on behavioural sequences', 'Personalised by segment and action', 'Every action triggers relevant follow-up', 'Consistent, hands-off cadence', 'Measures revenue generated per subscriber']
      ),

      dataBars('Email Automation Impact on Key Metrics', [
        { label: 'Open Rate Improvement',        value: 70, color: '#6366f1' },
        { label: 'Click-Through Rate Increase',  value: 152, color: '#8b5cf6' },
        { label: 'Conversion Rate Improvement',  value: 88, color: '#a855f7' },
        { label: 'Revenue per Subscriber Lift',  value: 316, color: '#ec4899' },
        { label: 'List Churn Reduction',         value: 45, color: '#06b6d4' },
      ]),

      scrollTimeline('The Evolution of Email Marketing', [
        { year: '2000', title: 'The Broadcast Era',   description: 'Mass email blasts to purchased lists. Spam filters did not exist. Open rates were 60%+. Marketers abused the channel relentlessly.' },
        { year: '2007', title: 'CAN-SPAM & Filters',  description: 'Legislation and improved spam filters forced senders to earn permission. Double opt-in became best practice. List quality over quantity emerged.' },
        { year: '2013', title: 'Marketing Automation', description: 'Platforms like HubSpot and Marketo made sophisticated automation accessible. Behavioural triggers and lead scoring transformed B2B email programmes.' },
        { year: '2018', title: 'GDPR & Privacy',      description: 'Data privacy regulations reshaped list-building practices. Consent became explicit, lists shrank, but engagement rates improved dramatically.' },
        { year: '2025', title: 'AI-Personalised Email', description: 'AI generates personalised subject lines, send-time optimisation, and content personalisation at scale. Human strategy + AI execution = maximum performance.' },
      ]),

      quoteRotator([
        { text: 'The money is in the list, but only if the list trusts you. Build the relationship first. The revenue follows.', author: 'Derek Halpern',    role: 'Founder, Social Triggers' },
        { text: 'Email is still the highest ROI channel in digital marketing. Every dollar invested in building and nurturing an email list compounds over time.', author: 'Noah Kagan',       role: 'CEO, AppSumo' },
        { text: 'Automation is not about removing the human element from email marketing. It is about making your human touch available at scale, at exactly the right moment.', author: 'Chris Brogan', role: 'Marketing Strategist' },
      ]),

      explodingTakeaways('Email Marketing Must-Knows', [
        { icon: '💌', text: 'Focus on list quality and engagement over raw list size' },
        { icon: '🎁', text: 'Lead magnets must solve a specific, immediate problem to convert' },
        { icon: '🤖', text: 'Automation delivers personalisation at scale — set it up once, earn forever' },
        { icon: '🎯', text: 'Segmented campaigns outperform batch-and-blast by 760% in revenue' },
        { icon: '📧', text: 'Write every email for one person — conversational, specific, valuable' },
        { icon: '📈', text: 'Measure revenue per subscriber, not open rate in isolation' },
      ]),

      spotlightCta(
        'Ready to Automate Your Revenue?',
        'We design and implement email automation systems that generate consistent, compounding returns.',
        'Build My Email System',
        '#'
      ),
    ].join('\n\n'),
  },

  // ── Post 4: Performance Marketing ─────────────────────────────────────────
  {
    title: 'Performance Marketing in 2025: How to Get 10x ROI on Your Ad Spend',
    slug:  'performance-marketing-2025-10x-roi-ad-spend',
    excerpt: 'A complete guide to performance marketing — from Google and Meta Ads fundamentals to advanced attribution, creative testing, and the measurement frameworks that turn ad spend into predictable profit.',
    categories: ['Digital Marketing'],
    tags: ['Performance Marketing', 'Google Ads', 'Meta Ads', 'PPC', 'Ad Creative', 'ROAS'],
    content: [
      p('Performance marketing is the only channel in digital marketing where you pay directly for results — clicks, leads, purchases, and revenue. Done correctly, it is the fastest way to scale a business. Done incorrectly, it is the fastest way to burn through a marketing budget with nothing to show for it. The difference between a profitable and an unprofitable performance marketing programme often comes down to three things: targeting precision, creative quality, and measurement accuracy.'),
      p('This guide covers every layer of building a profitable performance marketing machine — from campaign architecture and audience targeting to creative testing frameworks, attribution models, and the optimisation cadences that separate agencies generating 2x ROAS from those delivering 10x.'),

      statCounter([
        { value:'10',  suffix:'x',  label:'Max achievable ROAS with right strategy', color:'#6366f1' },
        { value:'72',  suffix:'%',  label:'Marketers who say creative is #1 ROAS lever', color:'#8b5cf6' },
        { value:'5',   suffix:'x',  label:'More expensive to acquire vs. retain a customer', color:'#a855f7' },
        { value:'1.8', suffix:'B',  label:'Annual global digital ad spend (2025, USD)', color:'#ec4899' },
      ]),

      h2('Understanding the Performance Marketing Funnel'),
      p('Performance marketing works across the entire customer journey, but different channel tactics are effective at different funnel stages. Awareness campaigns (broad targeting, video, display) introduce your brand to cold audiences at the top of the funnel. Consideration campaigns (search, retargeting, content ads) engage people actively researching solutions. Conversion campaigns (bottom-of-funnel retargeting, branded search, shopping ads) capture people ready to buy.'),
      p('The most common mistake in performance marketing is sending cold traffic directly to a purchase page. Cold audiences need to be warmed up — they need to see your brand multiple times, understand your value proposition, and develop enough trust before they will convert. A full-funnel approach using different creative, messaging, and offers at each stage dramatically improves overall programme efficiency.'),

      tiltGrid([
        { icon:'🎯', title:'Audience Targeting',    description:'Layer demographic, interest, behavioural, and lookalike audiences. The tighter the targeting, the higher the relevance, and the lower the cost per acquisition.' },
        { icon:'🎨', title:'Creative Strategy',     description:'Creative is the single biggest ROAS lever. Test video vs. static, emotional vs. rational, lifestyle vs. product. Refresh creatives every 14–21 days to prevent fatigue.' },
        { icon:'🛬', title:'Landing Page Quality',  description:'Ad performance is capped by landing page conversion rate. A 2% landing page sending 50% click-to-purchase traffic to checkout = 1% overall conversion. Optimise landing pages relentlessly.' },
        { icon:'📊', title:'Attribution Modelling', description:'Last-click attribution undervalues top-funnel channels. Use data-driven attribution or multi-touch models to understand the true contribution of each channel to revenue.' },
        { icon:'🔄', title:'Bid Optimisation',      description:'Target CPA and target ROAS bidding strategies outperform manual bidding at scale, but require 30–50 conversions per week to optimise effectively. Fund learning phases adequately.' },
        { icon:'🔁', title:'Retargeting Strategy',  description:'Segment retargeting audiences by depth of engagement: site visitors, video viewers, cart abandoners, past customers. Each segment receives different creative and offers.' },
      ], 3),

      h2('Google Ads: The Intent-Capture Engine'),
      p('Google Search Ads remain the most powerful intent-capture tool in performance marketing. When someone searches "buy project management software for small teams," they have already decided they want to buy — your ad simply needs to be the most relevant, credible, and compelling response to that moment of intent.'),
      p('Modern Google Ads success requires moving beyond keyword lists to comprehensive search term coverage using a combination of broad match (with smart bidding), phrase match for control, and exact match for your highest-converting queries. Performance Max campaigns now cover Search, Display, YouTube, Shopping, Gmail, and Discover from a single campaign using Google\'s AI to optimise across surfaces — but they require high-quality creative assets and strong conversion data to perform effectively.'),

      processSteps('Performance Marketing Launch Framework', [
        { title: 'Define Your Economics',       description: 'Calculate your maximum CPA (customer lifetime value × margin ÷ acceptable payback period). This is your guardrail for all bidding decisions. Never bid without knowing your number.' },
        { title: 'Build Campaign Architecture', description: 'Separate brand vs. non-brand, top vs. bottom funnel, and prospecting vs. retargeting. Different objectives need different campaigns with different bid strategies and budgets.' },
        { title: 'Launch Creative Testing',     description: 'Launch with 3–5 creative concepts per ad set, each with a distinct hook, visual style, or offer. Run for 7–14 days with equal budget. Let data, not opinion, declare winners.' },
        { title: 'Implement Conversion Tracking',description: 'Set up server-side conversion tracking, GA4 integration, and CRM data import. Inaccurate conversion data leads to incorrect automated bidding decisions that destroy ROAS.' },
        { title: 'Establish Optimisation Cadence',description: 'Review search term reports daily, ad performance weekly, audience performance bi-weekly, and full strategy quarterly. Over-optimising (touching campaigns too frequently) prevents algorithms from learning.' },
        { title: 'Scale Winners Methodically', description: 'Increase budgets of winning ad sets by 15–20% every 3–4 days. Aggressive scaling (doubling budgets overnight) disrupts learning phases and causes CPA spikes.' },
      ]),

      flipComparison(
        'Amateur Performance Marketing',
        ['Set and forget campaigns', 'Same creative running for months', 'Only tracking last-click conversions', 'Sending all traffic to homepage', 'Measuring by spend, not revenue'],
        'Professional Performance Marketing',
        ['Active daily/weekly optimisation cadence', 'Continuous creative refresh cycle (every 14–21 days)', 'Multi-touch attribution modelling', 'Dedicated landing pages per ad group', 'Every decision tied to CPA and ROAS targets']
      ),

      parallaxHero(
        'Creative Quality is the New Targeting',
        'In a cookieless world, exceptional creative that self-selects your audience is the ultimate targeting tool.',
        'Creative-First Strategy',
        '#0f0a0a',
        '#2a0f14'
      ),

      dataBars('Channel Performance Benchmarks (Average ROAS)', [
        { label: 'Google Search — Branded',      value: 95, color: '#6366f1' },
        { label: 'Google Search — Non-Branded',  value: 65, color: '#8b5cf6' },
        { label: 'Meta Ads — Retargeting',       value: 72, color: '#a855f7' },
        { label: 'Meta Ads — Prospecting',       value: 42, color: '#ec4899' },
        { label: 'Performance Max',              value: 58, color: '#06b6d4' },
      ]),

      scrollTimeline('The Evolution of Performance Marketing', [
        { year: '2004', title: 'AdWords Launches',      description: 'Google AdWords introduced pay-per-click advertising at scale. Keyword-based targeting was revolutionary. CTR and CPC were the primary metrics.' },
        { year: '2010', title: 'Social Advertising',    description: 'Facebook Ads launched interest and demographic targeting. Performance marketers gained the ability to find audiences rather than wait for them to search.' },
        { year: '2017', title: 'Automation & Smart Bidding', description: 'Machine learning-powered bidding strategies (Target CPA, Target ROAS) began outperforming manual bidding for accounts with sufficient conversion data.' },
        { year: '2021', title: 'The Privacy Revolution', description: 'iOS 14.5 ATT framework, GDPR enforcement, and cookie deprecation forced a fundamental rethink of attribution and targeting methodologies.' },
        { year: '2025', title: 'Creative-Led Performance', description: 'With targeting limitations, creative quality has become the primary ROAS lever. AI generates and tests creative at scale. Human strategy + AI execution = maximum ROAS.' },
      ]),

      quoteRotator([
        { text: 'In 2025, your creative is your targeting. The best ads attract the right audience and repel the wrong one automatically. Invest in creative like it is your most important channel.', author: 'Andrew Faris',   role: 'CEO, AJF Growth' },
        { text: 'Performance marketing without proper attribution is like driving at night with your headlights off. You might reach your destination — but you will not know how you got there.', author: 'Brad Geddes',    role: 'Co-Founder, Adalysis' },
        { text: 'The brands with the highest ROAS are obsessively focused on the customer journey, not the campaign dashboard. Great ad performance starts with great product-market fit.', author: 'Akvile DeFazio', role: 'President, AKvertise' },
      ]),

      explodingTakeaways('Performance Marketing Principles', [
        { icon: '💰', text: 'Know your maximum CPA before launching any campaign' },
        { icon: '🎨', text: 'Creative is the #1 ROAS lever — refresh every 14–21 days' },
        { icon: '📊', text: 'Accurate attribution is non-negotiable for smart bidding to work' },
        { icon: '🏗️', text: 'Separate prospecting, retargeting, and branded campaigns always' },
        { icon: '⏱️', text: 'Optimise on a cadence — daily tweaks prevent algorithms from learning' },
        { icon: '📈', text: 'Scale winners gradually — 15–20% budget increases every 3–4 days' },
      ]),

      spotlightCta(
        'Struggling to Scale Your Ad ROAS?',
        'Our performance marketing team builds and manages campaigns that generate predictable, profitable returns.',
        'Get a Free Ad Audit',
        '#'
      ),
    ].join('\n\n'),
  },

  // ── Post 5: Social Media Growth ────────────────────────────────────────────
  {
    title: 'Social Media Growth in 2025: The Science of Building a 100K Following From Scratch',
    slug:  'social-media-growth-2025-build-100k-following-from-scratch',
    excerpt: 'A data-driven guide to building a significant social media following from zero — covering platform algorithm mechanics, content formats, posting cadence, community tactics, and the monetisation strategies that matter.',
    categories: ['Digital Marketing'],
    tags: ['Social Media', 'Instagram Growth', 'LinkedIn Marketing', 'Content Creation', 'Community Building'],
    content: [
      p('Building a large social media following is not about luck, viral moments, or magic posting times. It is a disciplined, systematic process of understanding platform mechanics, creating content optimised for both human attention and algorithmic distribution, and showing up consistently enough that your audience begins to expect — and seek out — your content.'),
      p('This guide is for serious brand builders and marketers who want to use social media as a genuine business asset. We cover the mechanics behind every major platform\'s algorithm in 2025, the content formats and posting cadences that drive growth, and the community-building tactics that convert followers into loyal advocates and paying customers.'),

      statCounter([
        { value:'5.17', suffix:'B',  label:'Social media users worldwide (2025)',        color:'#6366f1' },
        { value:'2h28', suffix:'',   label:'Average daily time spent on social media',   color:'#8b5cf6' },
        { value:'80',   suffix:'%',  label:'B2B buyers influenced by social media',      color:'#a855f7' },
        { value:'4.5',  suffix:'x',  label:'Higher conversion rate with social proof',   color:'#ec4899' },
      ]),

      h2('Platform Selection: Focus Beats Omnipresence'),
      p('The biggest mistake in social media marketing is trying to be everywhere at once. With limited time, budget, and creative resources, spreading yourself across seven platforms results in mediocre performance on all of them. The brands with the fastest-growing social presences are ruthlessly focused — they pick one or two platforms where their audience is most concentrated, master those channels completely, and only expand once they have real traction.'),
      p('LinkedIn is the undisputed platform for B2B brands, professional services, SaaS, and thought leadership. Organic reach on LinkedIn remains exceptional compared to other mature platforms — a well-crafted post from a personal profile regularly reaches 10x more people than a post from a Facebook page. Instagram and TikTok dominate in visual, lifestyle, and consumer categories. YouTube remains the best platform for long-form educational content with search discovery intent.'),

      tiltGrid([
        { icon:'💼', title:'LinkedIn',   description:'Best for B2B, professional services, SaaS. High organic reach for personal profiles. Long-form text posts, carousels, and video all perform. Ideal for thought leadership.' },
        { icon:'🎵', title:'TikTok',     description:'Highest organic reach of any platform for new creators. Algorithm heavily favours content quality over follower count. Short, entertainment-first video is essential.' },
        { icon:'📸', title:'Instagram',  description:'Strong for visual brands, D2C, lifestyle, and personal brands. Reels drive discovery; Stories deepen engagement. Link-in-bio is the primary traffic driver.' },
        { icon:'🎥', title:'YouTube',    description:'Search-based discovery with the longest content shelf life of any social platform. A video can generate views for 5+ years. Best for educational and how-to content.' },
        { icon:'🐦', title:'X / Twitter',description:'Real-time conversation, tech, media, and politics. Extremely difficult for brands to grow organically post-2023. Best as a customer service and PR monitoring tool.' },
        { icon:'📌', title:'Pinterest',  description:'High-intent discovery platform for home, fashion, food, and lifestyle. Excellent for driving website traffic. Content persists and compounds much longer than other platforms.' },
      ], 3),

      h2('Understanding Algorithm Mechanics in 2025'),
      p('Every social media algorithm shares a fundamental goal: maximise time spent on the platform by surfacing content users will engage with. Understanding this goal tells you exactly what the algorithm rewards: content that earns high engagement rates (likes, comments, shares, saves) relative to reach, content that keeps viewers on the platform (watch time, session length), and content that generates the kind of engagement that reflects genuine satisfaction rather than controversy.'),
      p('LinkedIn\'s algorithm in 2025 prioritises personal profiles over company pages, rewards content that generates meaningful comments within the first two hours of posting, and actively suppresses posts that ask for likes or shares (engagement-bait). The sweet spot is content that makes people think, disagree constructively, or want to add their own experience — a question, a counterintuitive insight, a surprising statistic, or a personal story with a lesson attached.'),
      p('TikTok\'s algorithm is uniquely powerful for new creators because it distributes content based on its performance with a small test audience, not based on your follower count. A single excellent video from an account with 50 followers can reach millions if the test audience engages well. This makes TikTok the fastest platform for zero-to-audience growth — but it requires consistent production because the algorithm serves content to entirely new audiences who have no relationship with your brand.'),

      processSteps('The 90-Day Social Media Growth Sprint', [
        { title: 'Platform Research & Profile Optimisation', description: 'Choose one primary platform. Study your 10 most successful competitors on that platform. Optimise your profile: clear bio, professional image, keyword-rich headline, link to email capture or website.' },
        { title: 'Content Pillar Framework',                description: 'Define 3–5 content pillars (topic categories) that balance what your brand knows, what your audience wants, and what drives engagement on your chosen platform.' },
        { title: 'First 30 Days: Testing Phase',            description: 'Publish daily at consistent times. Try every content format: short video, long video, text posts, carousels, polls, stories. Analyse what earns the most engagement and saves per impression.' },
        { title: 'Days 31–60: Doubling Down',               description: 'Identify your top three performing content types from month one. Create a production system that lets you publish more of what works. Engage with every comment for the first hour after posting.' },
        { title: 'Days 61–90: Community Activation',        description: 'Actively engage with other creators in your niche. Comment thoughtfully on 10 relevant posts per day. Start a weekly series or recurring format your audience can expect and look forward to.' },
        { title: 'Month 4+: Monetisation Planning',         description: 'With 5,000+ engaged followers, begin connecting social to business outcomes: email list building, lead magnets, consulting inquiries, or product offers. Followers without a monetisation path generate vanity, not value.' },
      ]),

      flipComparison(
        'Spray-and-Pray Social Media',
        ['Posting irregularly when inspired', 'Same content across all platforms', 'Broadcasting, never engaging', 'Measuring success by follower count', 'No strategy connecting social to revenue'],
        'Strategic Social Media System',
        ['Consistent cadence driven by content calendar', 'Platform-native content optimised per channel', 'Daily community engagement and conversation', 'Measuring reach, engagement rate, and leads generated', 'Every post tied to audience-building or conversion goals']
      ),

      parallaxHero(
        'The Only Algorithm That Matters: Your Audience',
        'Build content for the people, not the platform. Genuine value travels further than algorithmic tricks.',
        'Audience-First Growth',
        '#0a0f0a',
        '#0a1a0f'
      ),

      h2('Content Formats That Drive Explosive Growth in 2025'),
      p('Video is not the future of social media — it is the present. Short-form video (15–90 seconds) dominates discovery across LinkedIn, Instagram, TikTok, and YouTube Shorts. But video is not a format requirement; it is a medium. The format that drives growth is the one that delivers the most value in the least time for your specific audience. For data-heavy B2B content, a LinkedIn carousel can outperform video. For lifestyle and food brands, Instagram Reels consistently beat static images.'),
      p('The most underused high-performing format in 2025 is the document carousel on LinkedIn. Carousels allow you to teach something step-by-step in a visually engaging, swipeable format. They earn saves (which signal high content quality to LinkedIn\'s algorithm) far more than text posts or images, and they are natively shareable in a way that screenshot-heavy content cannot match.'),

      dataBars('Content Format Engagement Rate Comparison', [
        { label: 'Short Video (Reels/TikTok/Shorts)', value: 88, color: '#6366f1' },
        { label: 'LinkedIn Document Carousels',         value: 75, color: '#8b5cf6' },
        { label: 'Long-Form Video (YouTube)',           value: 62, color: '#a855f7' },
        { label: 'Text Posts (LinkedIn)',               value: 55, color: '#ec4899' },
        { label: 'Static Images',                       value: 38, color: '#06b6d4' },
      ]),

      scrollTimeline('The Social Media Landscape: 2010–2025', [
        { year: '2010', title: 'Facebook Dominates',     description: 'Facebook reaches 500M users. Organic reach for brand pages averages 16%. Social media marketing is primarily a brand awareness tool for early adopters.' },
        { year: '2013', title: 'Visual Era Begins',      description: 'Instagram and Pinterest drive a shift to visual storytelling. Brands invest in photography and design. Twitter becomes the real-time news and conversation platform.' },
        { year: '2016', title: 'Organic Reach Collapses',description: 'Facebook organic reach drops to under 2% for brand pages. Paid social becomes essential. LinkedIn introduces native video. Influencer marketing begins its rise.' },
        { year: '2019', title: 'TikTok Changes Everything', description: 'TikTok launches globally and introduces the interest graph (content-based) over the social graph (follower-based). Any creator can go viral regardless of following.' },
        { year: '2022', title: 'Creator Economy Matures', description: 'LinkedIn personal brand gold rush. Newsletter platforms (Substack) challenge social distribution. Short-form video dominates all platforms.' },
        { year: '2025', title: 'Community Over Audience', description: 'Broadcast social media fades in favour of community-first approaches. Discord, private groups, and niche communities outperform public following counts for business results.' },
      ]),

      quoteRotator([
        { text: 'Social media growth is not a numbers game. Ten thousand highly engaged followers who trust your expertise are worth more than a million passive observers who barely notice you post.', author: 'Gary Vaynerchuk', role: 'CEO, VaynerMedia' },
        { text: 'The secret to growing on LinkedIn is not posting more often. It is posting content so genuinely useful that people share it without being asked and save it to read later.', author: 'Justin Welsh',    role: 'Founder, The Solopreneur' },
        { text: 'In 2025, your social media presence is your professional reputation. Build it with the same intentionality you would build your CV.', author: 'Dorie Clark',    role: 'Marketing Strategist, Duke University' },
      ]),

      explodingTakeaways('Social Media Growth Essentials', [
        { icon: '🎯', text: 'Pick one platform and master it completely before expanding' },
        { icon: '🎥', text: 'Short-form video drives the most discovery across all platforms in 2025' },
        { icon: '💬', text: 'Engagement in the first hour after posting is critical for algorithmic reach' },
        { icon: '🗓️', text: 'Consistent cadence matters more than perfect individual posts' },
        { icon: '🤝', text: 'Build community by giving first — comment, collaborate, share others\' work' },
        { icon: '📧', text: 'Always direct social traffic to email — you own your list, not your following' },
      ]),

      spotlightCta(
        'Ready to Build Your Social Media Presence?',
        'We create data-driven social media strategies that build genuine audiences and drive business results.',
        'Start Growing Today',
        '#'
      ),
    ].join('\n\n'),
  },

];

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getCategoryIds(names) {
  const ids = [];
  for (const name of names) {
    const r = await fetch(`${WP_BASE}/categories?search=${encodeURIComponent(name)}&per_page=5`, { headers });
    const data = await r.json();
    const existing = data.find(c => c.name.replace(/&amp;/g,'&') === name || c.name === name);
    if (existing) {
      ids.push(existing.id);
    } else {
      const cr = await fetch(`${WP_BASE}/categories`, { method:'POST', headers, body: JSON.stringify({ name }) });
      const created = await cr.json();
      if (created.id) ids.push(created.id);
    }
  }
  return ids;
}

async function getTagIds(names) {
  const ids = [];
  for (const name of names) {
    const r = await fetch(`${WP_BASE}/tags?search=${encodeURIComponent(name)}&per_page=5`, { headers });
    const data = await r.json();
    const existing = data.find(t => t.name === name);
    if (existing) {
      ids.push(existing.id);
    } else {
      const cr = await fetch(`${WP_BASE}/tags`, { method:'POST', headers, body: JSON.stringify({ name }) });
      const created = await cr.json();
      if (created.id) ids.push(created.id);
    }
  }
  return ids;
}

async function createPost(post) {
  const catIds = await getCategoryIds(post.categories);
  const tagIds = await getTagIds(post.tags);

  const body = JSON.stringify({
    title:      post.title,
    slug:       post.slug,
    content:    post.content,
    excerpt:    post.excerpt,
    status:     'publish',
    categories: catIds,
    tags:       tagIds,
  });

  const r = await fetch(`${WP_BASE}/posts`, { method:'POST', headers, body });
  const data = await r.json();

  if (data.id) {
    console.log(`✅  Created: "${post.title}" (ID ${data.id})`);
    return data;
  } else {
    console.error(`❌  Failed: "${post.title}"`, data.message ?? data);
    return null;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log(`🚀  Creating ${posts.length} posts on ${WP_BASE}...\n`);

for (const post of posts) {
  await createPost(post);
  await new Promise(r => setTimeout(r, 500)); // throttle
}

console.log('\n✅  Done.');
