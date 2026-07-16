/**
 * migrate-to-blocks.mjs
 * Converts all Infinity Pillars blog posts from raw HTML helper output
 * to proper Gutenberg block serialization format.
 *
 * Run: node scripts/migrate-to-blocks.mjs
 */

const WP   = process.env.WP_API_URL || 'https://blog.infinitypillars.com/wp-json/wp/v2';
const CRED = process.env.WP_AUTH; // set as "user:app-password"
if (!CRED) { console.error('Set WP_AUTH=user:app-password before running'); process.exit(1); }
const AUTH = 'Basic ' + Buffer.from(CRED).toString('base64');
const H    = { Authorization: AUTH, 'Content-Type': 'application/json' };

// ─── HTML template functions (must match save() output exactly) ───────────────

const KT_HTML  = (items) => `<div class="ip-key-takeaways"><div class="ip-kt-header">Key Takeaways</div><ul class="ip-kt-list">${items.map((x) => `<li class="ip-kt-item">${x}</li>`).join('')}</ul></div>`;
const ST_HTML  = (stats) => `<div class="ip-stats-row">${stats.map((s) => `<div class="ip-stat"><span class="ip-stat-num">${s.value}</span><span class="ip-stat-label">${s.label}</span></div>`).join('')}</div>`;
const EQ_HTML  = (text, author, role) => `<div class="ip-expert-quote"><p class="ip-eq-text">"${text}"</p><footer class="ip-eq-footer"><strong class="ip-eq-author">${author}</strong><span class="ip-eq-role">${role}</span></footer></div>`;
const AL_HTML  = (type, title, text) => `<div class="ip-alert ip-alert--${type}"><div class="ip-alert-body"><strong class="ip-alert-title">${title}</strong><p class="ip-alert-text">${text}</p></div></div>`;
const TL_HTML  = (steps) => `<div class="ip-timeline">${steps.map((s, i) => `<div class="ip-timeline-item"><div class="ip-timeline-marker">0${i + 1}</div><div class="ip-timeline-content"><h4 class="ip-timeline-title">${s.title}</h4><p class="ip-timeline-body">${s.body}</p></div></div>`).join('')}</div>`;
const SP_HTML  = (steps) => `<div class="ip-steps">${steps.map((s) => `<div class="ip-step"><div class="ip-step-num"></div><div class="ip-step-body"><p class="ip-step-title">${s.title}</p><p class="ip-step-desc">${s.desc}</p></div></div>`).join('')}</div>`;
const CL_HTML  = (header, items) => `<div class="ip-checklist"><div class="ip-checklist-header">${header}</div><ul class="ip-checklist-list">${items.map((x) => `<li class="ip-checklist-item"><span class="ip-check-box"></span>${x}</li>`).join('')}</ul></div>`;
const FG_HTML  = (features) => `<div class="ip-feature-grid">${features.map((f) => `<div class="ip-feature-item"><div class="ip-feature-icon">${f.icon}</div><h4 class="ip-feature-title">${f.title}</h4><p class="ip-feature-desc">${f.desc}</p></div>`).join('')}</div>`;
const BS_HTML  = (number, label, source) => `<div class="ip-big-stat"><span class="ip-big-stat-number">${number}</span><span class="ip-big-stat-label">${label}</span><span class="ip-big-stat-source">${source}</span></div>`;
const CP_HTML  = (pros, cons, proTitle, conTitle) => `<div class="ip-comparison"><div class="ip-pro-col"><h4 class="ip-pro-title">${proTitle}</h4><ul>${pros.map((x) => `<li>${x}</li>`).join('')}</ul></div><div class="ip-con-col"><h4 class="ip-con-title">${conTitle}</h4><ul>${cons.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>`;
const FF_HTML  = (text, source) => `<div class="ip-fun-fact"><p class="ip-fun-label">Did You Know?</p><p class="ip-fun-text">${text}</p><p class="ip-fun-source">Source: ${source}</p></div>`;
const PQ_HTML  = (text) => `<div class="ip-pull-quote"><p class="ip-pq-text">${text}</p></div>`;
const TC_HTML  = (l, r) => `<div class="ip-two-col"><div class="ip-two-col-side"><p class="ip-two-col-label">${l[0]}</p><h4 class="ip-two-col-title">${l[1]}</h4><p class="ip-two-col-body">${l[2]}</p></div><div class="ip-two-col-side"><p class="ip-two-col-label">${r[0]}</p><h4 class="ip-two-col-title">${r[1]}</h4><p class="ip-two-col-body">${r[2]}</p></div></div>`;
const DF_HTML  = (word, text) => `<div class="ip-definition"><p class="ip-def-term">Definition</p><p class="ip-def-word">${word}</p><p class="ip-def-text">${text}</p></div>`;
const RL_HTML  = (resources) => `<div class="ip-resource-list"><div class="ip-resource-header">Further Reading and Resources</div>${resources.map((r) => `<div class="ip-resource-item"><span class="ip-resource-tag">${r.tag}</span><div><p class="ip-resource-title">${r.title}</p><p class="ip-resource-desc">${r.desc}</p></div></div>`).join('')}</div>`;
const CTA_HTML = (headline, sub) => `<div class="ip-cta-card"><h3 class="ip-cta-headline">${headline}</h3><p class="ip-cta-sub">${sub}</p><a href="/#booking" class="ip-cta-btn">Book a Free Strategy Call</a></div>`;
const FAQ_HTML = (items) => `<div class="faq-section">${items.map((x) => `<div class="faq-item"><h3 class="faq-question">${x.q}</h3><div class="faq-answer"><p>${x.a}</p></div></div>`).join('')}</div>`;
const SB_HTML  = (title, text) => `<div class="ip-success-banner"><div class="ip-success-icon">✓</div><div class="ip-success-body"><p class="ip-success-title">${title}</p><p class="ip-success-text">${text}</p></div></div>`;

// ─── Gutenberg block serializer ───────────────────────────────────────────────

function gb(name, attrs, html) {
  const attrsStr = Object.keys(attrs).length ? ' ' + JSON.stringify(attrs) : '';
  return `<!-- wp:infinity-pillars/${name}${attrsStr} -->\n${html}\n<!-- /wp:infinity-pillars/${name} -->`;
}

// ─── HTML parsers ─────────────────────────────────────────────────────────────
// Each parser: (rawHtml: string) => gutenbergBlock: string | null

function inner(html, startTag, endTag) {
  const s = html.indexOf(startTag);
  if (s === -1) return '';
  const e = html.indexOf(endTag, s + startTag.length);
  return e === -1 ? '' : html.slice(s + startTag.length, e);
}

function textOf(html) {
  return html.replace(/<[^>]+>/g, '').trim();
}

function allMatches(html, re) {
  const results = [];
  let m;
  const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  while ((m = r.exec(html)) !== null) results.push(m);
  return results;
}

// ─── Key Takeaways ────────────────────────────────────────────────────────────
function parseKT(html) {
  const block = inner(html, '<div class="ip-key-takeaways">', '</div>');
  if (!block) return null;
  const items = allMatches(block, /<li[^>]*>([\s\S]*?)<\/li>/).map((m) => textOf(m[1])).filter(Boolean);
  if (!items.length) return null;
  const attrs = { items };
  return gb('key-takeaways', attrs, KT_HTML(items));
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function parseST(html) {
  const block = inner(html, '<div class="ip-stats-row">', '</div></div>') || inner(html, '<div class="ip-stats-row">', '</div>');
  if (!block) return null;
  const statDivs = allMatches(html.slice(html.indexOf('<div class="ip-stats-row">')), /<div class="ip-stat">([\s\S]*?)<\/div>/);
  const stats = statDivs.map((m) => {
    const valM = m[1].match(/<span class="ip-stat-num">([\s\S]*?)<\/span>/);
    const lblM = m[1].match(/<span class="ip-stat-label">([\s\S]*?)<\/span>/);
    return { value: valM ? textOf(valM[1]) : '', label: lblM ? textOf(lblM[1]) : '' };
  }).filter((s) => s.value);
  if (!stats.length) return null;
  const attrs = { stats };
  return gb('stats-row', attrs, ST_HTML(stats));
}

// ─── Expert Quote ─────────────────────────────────────────────────────────────
function parseEQ(html) {
  const start = html.indexOf('<div class="ip-expert-quote">');
  if (start === -1) return null;
  const block = html.slice(start, html.indexOf('</div>', start + 100) + 6);
  const textM   = block.match(/<p class="ip-eq-text">"([\s\S]*?)"<\/p>/);
  const authorM = block.match(/<strong class="ip-eq-author">([\s\S]*?)<\/strong>/);
  const roleM   = block.match(/<span class="ip-eq-role">([\s\S]*?)<\/span>/);
  if (!textM) return null;
  const text = textOf(textM[1]), author = authorM ? textOf(authorM[1]) : '', role = roleM ? textOf(roleM[1]) : '';
  return gb('expert-quote', { text, author, role }, EQ_HTML(text, author, role));
}

// ─── Alert ────────────────────────────────────────────────────────────────────
function parseAL(html) {
  const m = html.match(/<div class="ip-alert ip-alert--([\w]+)">([\s\S]*?)<\/div>\s*<\/div>/);
  if (!m) return null;
  const type = m[1];
  const titleM = m[2].match(/<strong class="ip-alert-title">([\s\S]*?)<\/strong>/);
  const textM  = m[2].match(/<p class="ip-alert-text">([\s\S]*?)<\/p>/);
  if (!titleM) return null;
  const title = textOf(titleM[1]), text = textM ? textOf(textM[1]) : '';
  return gb('alert', { type, title, text }, AL_HTML(type, title, text));
}

// ─── Process Timeline ─────────────────────────────────────────────────────────
function parseTL(html) {
  const start = html.indexOf('<div class="ip-timeline">');
  if (start === -1) return null;
  const end = html.indexOf('</div>', html.lastIndexOf('</div>', html.indexOf('</div>', start + 500)) ) + 6;
  const block = html.slice(start, end + 200);
  const items = allMatches(block, /<div class="ip-timeline-item">([\s\S]*?)<\/div>\s*<\/div>/);
  const steps = items.map((m) => {
    const titleM = m[1].match(/<h4 class="ip-timeline-title">([\s\S]*?)<\/h4>/);
    const bodyM  = m[1].match(/<p class="ip-timeline-body">([\s\S]*?)<\/p>/);
    return { title: titleM ? textOf(titleM[1]) : '', body: bodyM ? textOf(bodyM[1]) : '' };
  }).filter((s) => s.title);
  if (!steps.length) return null;
  return gb('timeline', { steps }, TL_HTML(steps));
}

// ─── Step-by-Step ─────────────────────────────────────────────────────────────
function parseSP(html) {
  const start = html.indexOf('<div class="ip-steps">');
  if (start === -1) return null;
  const items = allMatches(html.slice(start), /<div class="ip-step">([\s\S]*?)<\/div>\s*<\/div>/);
  const steps = items.map((m) => {
    const titleM = m[1].match(/<p class="ip-step-title">([\s\S]*?)<\/p>/);
    const descM  = m[1].match(/<p class="ip-step-desc">([\s\S]*?)<\/p>/);
    return { title: titleM ? textOf(titleM[1]) : '', desc: descM ? textOf(descM[1]) : '' };
  }).filter((s) => s.title);
  if (!steps.length) return null;
  return gb('steps', { steps }, SP_HTML(steps));
}

// ─── Checklist ────────────────────────────────────────────────────────────────
function parseCL(html) {
  const start = html.indexOf('<div class="ip-checklist">');
  if (start === -1) return null;
  const block = html.slice(start);
  const headerM = block.match(/<div class="ip-checklist-header">([\s\S]*?)<\/div>/);
  const header = headerM ? textOf(headerM[1]) : 'Checklist';
  const items = allMatches(block, /<li class="ip-checklist-item">[\s\S]*?<span[^>]*><\/span>([\s\S]*?)<\/li>/).map((m) => textOf(m[1])).filter(Boolean);
  if (!items.length) return null;
  return gb('checklist', { header, items }, CL_HTML(header, items));
}

// ─── Feature Grid ─────────────────────────────────────────────────────────────
function parseFG(html) {
  const start = html.indexOf('<div class="ip-feature-grid">');
  if (start === -1) return null;
  const items = allMatches(html.slice(start), /<div class="ip-feature-item">([\s\S]*?)<\/div>/);
  const features = items.map((m) => {
    const iconM  = m[1].match(/<div class="ip-feature-icon">([\s\S]*?)<\/div>/);
    const titleM = m[1].match(/<h4 class="ip-feature-title">([\s\S]*?)<\/h4>/);
    const descM  = m[1].match(/<p class="ip-feature-desc">([\s\S]*?)<\/p>/);
    return { icon: iconM ? textOf(iconM[1]) : '', title: titleM ? textOf(titleM[1]) : '', desc: descM ? textOf(descM[1]) : '' };
  }).filter((f) => f.title);
  if (!features.length) return null;
  return gb('feature-grid', { features }, FG_HTML(features));
}

// ─── Big Stat ─────────────────────────────────────────────────────────────────
function parseBS(html) {
  const start = html.indexOf('<div class="ip-big-stat">');
  if (start === -1) return null;
  const block = html.slice(start, html.indexOf('</div>', start) + 6);
  const numM  = block.match(/<span class="ip-big-stat-number">([\s\S]*?)<\/span>/);
  const lblM  = block.match(/<span class="ip-big-stat-label">([\s\S]*?)<\/span>/);
  const srcM  = block.match(/<span class="ip-big-stat-source">([\s\S]*?)<\/span>/);
  if (!numM) return null;
  const number = textOf(numM[1]), label = lblM ? textOf(lblM[1]) : '', source = srcM ? textOf(srcM[1]) : '';
  return gb('big-stat', { number, label, source }, BS_HTML(number, label, source));
}

// ─── Comparison ───────────────────────────────────────────────────────────────
function parseCP(html) {
  const start = html.indexOf('<div class="ip-comparison">');
  if (start === -1) return null;
  const block = html.slice(start);
  const proTitleM = block.match(/<h4 class="ip-pro-title">([\s\S]*?)<\/h4>/);
  const conTitleM = block.match(/<h4 class="ip-con-title">([\s\S]*?)<\/h4>/);
  const proColM   = block.match(/<div class="ip-pro-col">([\s\S]*?)<\/div>/);
  const conColM   = block.match(/<div class="ip-con-col">([\s\S]*?)<\/div>/);
  if (!proColM || !conColM) return null;
  const pros     = allMatches(proColM[1], /<li>([\s\S]*?)<\/li>/).map((m) => textOf(m[1])).filter(Boolean);
  const cons     = allMatches(conColM[1], /<li>([\s\S]*?)<\/li>/).map((m) => textOf(m[1])).filter(Boolean);
  const proTitle = proTitleM ? textOf(proTitleM[1]) : 'Advantages';
  const conTitle = conTitleM ? textOf(conTitleM[1]) : 'Watch-outs';
  if (!pros.length && !cons.length) return null;
  return gb('comparison', { pros, cons, proTitle, conTitle }, CP_HTML(pros, cons, proTitle, conTitle));
}

// ─── Fun Fact ─────────────────────────────────────────────────────────────────
function parseFF(html) {
  const start = html.indexOf('<div class="ip-fun-fact">');
  if (start === -1) return null;
  const block = html.slice(start, html.indexOf('</div>', start) + 6);
  const textM  = block.match(/<p class="ip-fun-text">([\s\S]*?)<\/p>/);
  const srcM   = block.match(/<p class="ip-fun-source">Source:\s*([\s\S]*?)<\/p>/);
  if (!textM) return null;
  const text = textOf(textM[1]), source = srcM ? textOf(srcM[1]) : '';
  return gb('fun-fact', { text, source }, FF_HTML(text, source));
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────
function parsePQ(html) {
  const m = html.match(/<div class="ip-pull-quote"><p class="ip-pq-text">([\s\S]*?)<\/p><\/div>/);
  if (!m) return null;
  const text = textOf(m[1]);
  return gb('pull-quote', { text }, PQ_HTML(text));
}

// ─── Two Column ───────────────────────────────────────────────────────────────
function parseTC(html) {
  const start = html.indexOf('<div class="ip-two-col">');
  if (start === -1) return null;
  const block = html.slice(start);
  const sides = allMatches(block, /<div class="ip-two-col-side">([\s\S]*?)<\/div>/);
  if (sides.length < 2) return null;
  const extractSide = (s) => {
    const labelM = s.match(/<p class="ip-two-col-label">([\s\S]*?)<\/p>/);
    const titleM = s.match(/<h4 class="ip-two-col-title">([\s\S]*?)<\/h4>/);
    const bodyM  = s.match(/<p class="ip-two-col-body">([\s\S]*?)<\/p>/);
    return [labelM ? textOf(labelM[1]) : '', titleM ? textOf(titleM[1]) : '', bodyM ? textOf(bodyM[1]) : ''];
  };
  const left = extractSide(sides[0][1]), right = extractSide(sides[1][1]);
  const attrs = { leftLabel: left[0], leftTitle: left[1], leftBody: left[2], rightLabel: right[0], rightTitle: right[1], rightBody: right[2] };
  return gb('two-col', attrs, TC_HTML(left, right));
}

// ─── Definition ───────────────────────────────────────────────────────────────
function parseDF(html) {
  const start = html.indexOf('<div class="ip-definition">');
  if (start === -1) return null;
  const block = html.slice(start, html.indexOf('</div>', start) + 6);
  const wordM = block.match(/<p class="ip-def-word">([\s\S]*?)<\/p>/);
  const textM = block.match(/<p class="ip-def-text">([\s\S]*?)<\/p>/);
  if (!wordM) return null;
  const word = textOf(wordM[1]), text = textM ? textOf(textM[1]) : '';
  return gb('definition', { word, text }, DF_HTML(word, text));
}

// ─── Resource List ────────────────────────────────────────────────────────────
function parseRL(html) {
  const start = html.indexOf('<div class="ip-resource-list">');
  if (start === -1) return null;
  const block = html.slice(start);
  const items = allMatches(block, /<div class="ip-resource-item">([\s\S]*?)<\/div>/);
  const resources = items.map((m) => {
    const tagM   = m[1].match(/<span class="ip-resource-tag">([\s\S]*?)<\/span>/);
    const titleM = m[1].match(/<p class="ip-resource-title">([\s\S]*?)<\/p>/);
    const descM  = m[1].match(/<p class="ip-resource-desc">([\s\S]*?)<\/p>/);
    return { tag: tagM ? textOf(tagM[1]) : '', title: titleM ? textOf(titleM[1]) : '', desc: descM ? textOf(descM[1]) : '' };
  }).filter((r) => r.title);
  if (!resources.length) return null;
  return gb('resource-list', { resources }, RL_HTML(resources));
}

// ─── CTA Card ─────────────────────────────────────────────────────────────────
function parseCTA(html) {
  const start = html.indexOf('<div class="ip-cta-card">');
  if (start === -1) return null;
  const block = html.slice(start, html.indexOf('</div>', start) + 6);
  const headM = block.match(/<h3 class="ip-cta-headline">([\s\S]*?)<\/h3>/);
  const subM  = block.match(/<p class="ip-cta-sub">([\s\S]*?)<\/p>/);
  if (!headM) return null;
  const headline = textOf(headM[1]), sub = subM ? textOf(subM[1]) : '';
  return gb('cta-card', { headline, sub }, CTA_HTML(headline, sub));
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function parseFAQ(html) {
  const start = html.indexOf('<div class="faq-section">');
  if (start === -1) return null;
  const end = html.lastIndexOf('</div>', html.indexOf('</div>', start + 200));
  const block = html.slice(start);
  const qItems = allMatches(block, /<div class="faq-item">([\s\S]*?)<\/div>\s*<\/div>/);
  const items = qItems.map((m) => {
    const qM = m[1].match(/<h3 class="faq-question">([\s\S]*?)<\/h3>/);
    const aM = m[1].match(/<p>([\s\S]*?)<\/p>/);
    return { q: qM ? textOf(qM[1]) : '', a: aM ? textOf(aM[1]) : '' };
  }).filter((i) => i.q);
  if (!items.length) return null;
  return gb('faq', { items }, FAQ_HTML(items));
}

// ─── Success Banner ───────────────────────────────────────────────────────────
function parseSB(html) {
  const start = html.indexOf('<div class="ip-success-banner">');
  if (start === -1) return null;
  const block = html.slice(start, html.indexOf('</div>', start + 100) + 6);
  const titleM = block.match(/<p class="ip-success-title">([\s\S]*?)<\/p>/);
  const textM  = block.match(/<p class="ip-success-text">([\s\S]*?)<\/p>/);
  if (!titleM) return null;
  const title = textOf(titleM[1]), text = textM ? textOf(textM[1]) : '';
  return gb('success-banner', { title, text }, SB_HTML(title, text));
}

// ─── Block pattern registry ───────────────────────────────────────────────────
// Each entry: { pattern: regex to find block, parser: fn(wholeHtml) => gutenbergBlock }
const BLOCK_PARSERS = [
  { marker: 'ip-key-takeaways',  parse: parseKT  },
  { marker: 'ip-stats-row',      parse: parseST  },
  { marker: 'ip-expert-quote',   parse: parseEQ  },
  { marker: 'ip-alert ip-alert', parse: parseAL  },
  { marker: 'ip-timeline">',     parse: parseTL  },
  { marker: 'ip-steps">',        parse: parseSP  },
  { marker: 'ip-checklist">',    parse: parseCL  },
  { marker: 'ip-feature-grid',   parse: parseFG  },
  { marker: 'ip-big-stat">',     parse: parseBS  },
  { marker: 'ip-comparison">',   parse: parseCP  },
  { marker: 'ip-fun-fact">',     parse: parseFF  },
  { marker: 'ip-pull-quote',     parse: parsePQ  },
  { marker: 'ip-two-col">',      parse: parseTC  },
  { marker: 'ip-definition">',   parse: parseDF  },
  { marker: 'ip-resource-list',  parse: parseRL  },
  { marker: 'ip-cta-card">',     parse: parseCTA },
  { marker: 'faq-section">',     parse: parseFAQ },
  { marker: 'ip-success-banner', parse: parseSB  },
];

// ─── Convert raw post content to Gutenberg blocks ────────────────────────────

function convertContent(rawContent) {
  // raw content is the actual post body (content.raw from WP API)
  // We need to split it into segments and replace each ip-* block

  // Split on known block root elements
  const blockRootClasses = [
    'ip-key-takeaways', 'ip-stats-row', 'ip-expert-quote', 'ip-alert ',
    'ip-timeline"', 'ip-steps"', 'ip-checklist"', 'ip-feature-grid',
    'ip-big-stat"', 'ip-comparison"', 'ip-fun-fact"', 'ip-pull-quote',
    'ip-two-col"', 'ip-definition"', 'ip-resource-list', 'ip-cta-card"',
    'faq-section"', 'ip-success-banner', 'ip-author-bio',
  ];

  // Process the content: find each IP block and replace with Gutenberg serialized version
  let result = rawContent;

  // Track which positions we've already processed to avoid double-conversion
  const processed = new Set();

  for (const { marker, parse } of BLOCK_PARSERS) {
    let pos = 0;
    while (true) {
      const idx = result.indexOf(marker, pos);
      if (idx === -1) break;

      // Find the start of the wrapping div
      const divStart = result.lastIndexOf('<div', idx);
      if (divStart === -1 || processed.has(divStart)) { pos = idx + 1; continue; }

      // Skip if already wrapped in Gutenberg comment
      const beforeDiv = result.slice(Math.max(0, divStart - 60), divStart);
      if (beforeDiv.includes('<!-- wp:')) { pos = idx + 1; continue; }

      // Extract a segment for parsing (take enough content)
      const segment = result.slice(divStart, divStart + 8000);

      // Try to parse
      const gbBlock = parse(segment);
      if (!gbBlock) { pos = idx + 1; continue; }

      // Find the end of this block element
      // Count open/close divs from divStart
      let depth = 0, endPos = divStart;
      for (let i = divStart; i < divStart + 8000 && i < result.length; i++) {
        if (result.slice(i, i + 4) === '<div') depth++;
        if (result.slice(i, i + 6) === '</div>') { depth--; if (depth === 0) { endPos = i + 6; break; } }
      }

      if (endPos === divStart) { pos = idx + 1; continue; }

      // Replace the original HTML with the Gutenberg block
      result = result.slice(0, divStart) + gbBlock + result.slice(endPos);
      processed.add(divStart);
      pos = divStart + gbBlock.length;
    }
  }

  // Remove ip-author-bio (it's now a React component)
  result = result.replace(/<div class="ip-author-bio">[\s\S]*?<\/div>\s*<\/div>/g, '');

  // Remove not-prose wrapper added by addNotProse() in previous sessions
  result = result.replace(/<div class="not-prose (ip-[^"]+)"/g, '<div class="$1"');

  return result;
}

// ─── Main migration ───────────────────────────────────────────────────────────

async function fetchAllPosts() {
  const res = await fetch(`${WP}/posts?per_page=100&status=publish`, { headers: H });
  const posts = await res.json();
  return posts.filter((p) => p.slug !== 'hello-world');
}

async function fetchRawContent(postId) {
  // Need ?context=edit to get content.raw
  const res = await fetch(`${WP}/posts/${postId}?context=edit`, { headers: H });
  const data = await res.json();
  return data.content?.raw || '';
}

async function updatePost(postId, content) {
  const res = await fetch(`${WP}/posts/${postId}`, {
    method: 'POST',
    headers: H,
    body: JSON.stringify({ content }),
  });
  return res.ok;
}

async function main() {
  console.log('\n🚀 Infinity Pillars — Migrating posts to Gutenberg blocks\n');

  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} posts to migrate.\n`);

  let success = 0, skipped = 0, failed = 0;

  for (const post of posts) {
    process.stdout.write(`  Post #${post.id} "${post.title.rendered.slice(0, 50)}"... `);

    const rawContent = await fetchRawContent(post.id);
    if (!rawContent) { console.log('⚠ no raw content'); skipped++; continue; }

    // Check if already migrated (has Gutenberg block comments)
    if (rawContent.includes('<!-- wp:infinity-pillars/')) {
      console.log('✓ already migrated');
      skipped++;
      continue;
    }

    const converted = convertContent(rawContent);

    if (converted === rawContent) {
      console.log('— no IP blocks found');
      skipped++;
      continue;
    }

    const ok = await updatePost(post.id, converted);
    if (ok) { console.log('✅ migrated'); success++; }
    else     { console.log('❌ update failed'); failed++; }

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\nDone. ${success} migrated · ${skipped} skipped · ${failed} failed\n`);
}

main().catch(console.error);
