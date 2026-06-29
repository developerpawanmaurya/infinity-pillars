import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

const DEFAULTS = [
  { text: 'Infinity Pillars transformed how we think about content marketing. Our traffic tripled in 6 months.', author: 'Sarah Chen',   role: 'CMO, TechVentures' },
  { text: 'The strategies here are unlike anything else. Practical, data-driven, and they actually work.',       author: 'Marcus Webb',  role: 'Founder, GrowthLab' },
  { text: 'Every article is a masterclass. I\'ve built my entire marketing playbook from this blog.',            author: 'Priya Sharma', role: 'Head of Growth, ScaleUp' },
];

function html({ quotes }) {
  return `<div class="ip-quote-rotator not-prose">
  <div class="ip-qr-carousel">
    ${quotes.map((q, i) => `<div class="ip-qr-slide${i === 0 ? ' ip-qr-active' : ''}">
      <div class="ip-qr-mark" aria-hidden="true">&ldquo;</div>
      <blockquote class="ip-qr-text">${q.text}</blockquote>
      <cite class="ip-qr-cite"><strong>${q.author}</strong> &mdash; ${q.role}</cite>
    </div>`).join('\n    ')}
  </div>
  <div class="ip-qr-nav">
    <button class="ip-qr-prev" aria-label="Previous">&#8592;</button>
    <div class="ip-qr-dots">${quotes.map((_, i) => `<button class="ip-qr-dot${i === 0 ? ' ip-qr-dot-active' : ''}" aria-label="Quote ${i + 1}"></button>`).join('')}</div>
    <button class="ip-qr-next" aria-label="Next">&#8594;</button>
  </div>
</div>`;
}

registerBlockType('infinity-pillars/quote-rotator', {
  title: 'IP — 3D Quote Rotator',
  icon: 'format-quote',
  category: 'infinity-pillars',
  attributes: { quotes: { type: 'array', default: DEFAULTS } },

  edit({ attributes, setAttributes }) {
    const { quotes } = attributes;
    const upd = (i, key, val) => { const n = [...quotes]; n[i] = { ...n[i], [key]: val }; setAttributes({ quotes: n }); };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Quotes" initialOpen>
            {quotes.map((q, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #333' }}>
                <TextControl label="Quote"  value={q.text}   onChange={v => upd(i, 'text', v)} />
                <TextControl label="Author" value={q.author} onChange={v => upd(i, 'author', v)} />
                <TextControl label="Role"   value={q.role}   onChange={v => upd(i, 'role', v)} />
                <Button isDestructive size="small" onClick={() => setAttributes({ quotes: quotes.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ quotes: [...quotes, { text: 'Amazing quote here.', author: 'Author', role: 'Role, Company' }] })}>+ Add Quote</Button>
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 48, borderRadius: 16, textAlign: 'center' } })}>
          <div style={{ fontSize: 72, color: '#6366f1', lineHeight: 0.8, marginBottom: 20 }}>&ldquo;</div>
          <p style={{ color: '#e2e8f0', fontSize: 18, fontStyle: 'italic', margin: '0 0 20px' }}>{quotes[0]?.text}</p>
          <p style={{ color: '#6366f1', fontWeight: 600, margin: 0 }}>{quotes[0]?.author} <span style={{ color: '#64748b', fontWeight: 400 }}>— {quotes[0]?.role}</span></p>
          <p style={{ color: '#475569', fontSize: 12, marginTop: 20 }}>({quotes.length} quotes — auto-rotates on frontend)</p>
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
