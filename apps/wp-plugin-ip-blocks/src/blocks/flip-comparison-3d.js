import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

function html({ beforeTitle, beforeItems, afterTitle, afterItems }) {
  const li = items => items.map(t => `<li>${t}</li>`).join('');
  return `<div class="ip-flip3d not-prose">
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
}

const itemEditor = (items, key, setAttributes) => (
  <div>
    {items.map((item, i) => (
      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <TextControl value={item} onChange={v => { const n = [...items]; n[i] = v; setAttributes({ [key]: n }); }} style={{ flex: 1, margin: 0 }} />
        <Button isDestructive size="small" onClick={() => setAttributes({ [key]: items.filter((_, j) => j !== i) })}>×</Button>
      </div>
    ))}
    <Button variant="secondary" size="small" onClick={() => setAttributes({ [key]: [...items, 'New item'] })}>+ Add</Button>
  </div>
);

registerBlockType('infinity-pillars/flip-comparison-3d', {
  title: 'IP — 3D Flip Comparison',
  icon: 'leftright',
  category: 'infinity-pillars',
  attributes: {
    beforeTitle: { type: 'string', default: 'Without Us' },
    beforeItems: { type: 'array',  default: ['Scattered strategy', 'Guessing at results', 'Slow growth', 'Wasted ad spend', 'No clear direction'] },
    afterTitle:  { type: 'string', default: 'With Us' },
    afterItems:  { type: 'array',  default: ['Focused roadmap', 'Clear data insights', '3× faster growth', 'Optimised ROI', 'Scalable systems'] },
  },

  edit({ attributes, setAttributes }) {
    const { beforeTitle, beforeItems, afterTitle, afterItems } = attributes;
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Before" initialOpen>
            <TextControl label="Title" value={beforeTitle} onChange={v => setAttributes({ beforeTitle: v })} />
            {itemEditor(beforeItems, 'beforeItems', setAttributes)}
          </PanelBody>
          <PanelBody title="After">
            <TextControl label="Title" value={afterTitle} onChange={v => setAttributes({ afterTitle: v })} />
            {itemEditor(afterItems, 'afterItems', setAttributes)}
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 24, borderRadius: 16 } })}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[{ title: beforeTitle, items: beforeItems, color: '#ef4444' }, { title: afterTitle, items: afterItems, color: '#22c55e' }].map((side, si) => (
              <div key={si} style={{ background: '#1a1a2e', border: `1px solid ${side.color}44`, borderRadius: 12, padding: 24 }}>
                <div style={{ color: side.color, fontWeight: 700, fontSize: 13, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{side.title}</div>
                <ul style={{ color: '#94a3b8', fontSize: 13, paddingLeft: 16, margin: 0 }}>
                  {side.items.map((item, i) => <li key={i} style={{ marginBottom: 6 }}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p style={{ color: '#475569', fontSize: 12, marginTop: 12, textAlign: 'center' }}>Cards flip in 3D on scroll on the frontend</p>
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
