import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

const DEFAULTS = [
  { icon: '⚡', text: 'Focus on high-intent keywords for faster, measurable results' },
  { icon: '📈', text: 'Content clusters outperform isolated articles by 3×' },
  { icon: '🎯', text: 'Video thumbnails drive 47% more click-through rates' },
  { icon: '🔗', text: 'Internal linking boosts page authority significantly' },
  { icon: '💬', text: 'Community engagement multiplies organic reach over time' },
];

function html({ title, items, accentColor }) {
  return `<div class="ip-exploding-takeaways not-prose" style="--et-accent:${accentColor}">
  <div class="ip-et-header">
    <div class="ip-et-orb" aria-hidden="true"></div>
    <h2 class="ip-et-title">${title}</h2>
  </div>
  <ul class="ip-et-list">
    ${items.map(item => `<li class="ip-et-item">
      <span class="ip-et-icon" aria-hidden="true">${item.icon}</span>
      <span class="ip-et-text">${item.text}</span>
    </li>`).join('\n    ')}
  </ul>
</div>`;
}

registerBlockType('infinity-pillars/exploding-takeaways', {
  title: 'IP — Exploding Takeaways',
  icon: 'star-filled',
  category: 'infinity-pillars',
  attributes: {
    title:       { type: 'string', default: 'Key Takeaways' },
    accentColor: { type: 'string', default: '#6366f1' },
    items:       { type: 'array',  default: DEFAULTS },
  },

  edit({ attributes, setAttributes }) {
    const { title, accentColor, items } = attributes;
    const upd = (i, key, val) => { const n = [...items]; n[i] = { ...n[i], [key]: val }; setAttributes({ items: n }); };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Settings" initialOpen>
            <TextControl label="Title"        value={title}       onChange={v => setAttributes({ title: v })} />
            <TextControl label="Accent Color" value={accentColor} onChange={v => setAttributes({ accentColor: v })} />
          </PanelBody>
          <PanelBody title="Items">
            {items.map((item, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #333' }}>
                <TextControl label="Icon" value={item.icon} onChange={v => upd(i, 'icon', v)} />
                <TextControl label="Text" value={item.text} onChange={v => upd(i, 'text', v)} />
                <Button isDestructive size="small" onClick={() => setAttributes({ items: items.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ items: [...items, { icon: '✨', text: 'New insight here' }] })}>+ Add Item</Button>
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 32, borderRadius: 16 } })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: accentColor, boxShadow: `0 0 24px ${accentColor}` }} />
            <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{title}</div>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1a1a2e' }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <span style={{ color: '#e2e8f0', fontSize: 14 }}>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
