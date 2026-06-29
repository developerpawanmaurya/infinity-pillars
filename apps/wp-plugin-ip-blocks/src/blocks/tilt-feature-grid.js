import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

const DEFAULTS = [
  { icon: '🚀', title: 'Performance',  description: 'Lightning-fast strategies that deliver measurable results every time.' },
  { icon: '🎯', title: 'Precision',    description: 'Data-driven targeting for maximum impact on your audience.' },
  { icon: '💡', title: 'Innovation',   description: 'Cutting-edge techniques that keep you ahead of the competition.' },
  { icon: '📊', title: 'Analytics',    description: 'Deep insights into every metric that matters for growth.' },
  { icon: '🔒', title: 'Security',     description: 'Enterprise-grade protection for all your marketing data.' },
  { icon: '🌐', title: 'Global Reach', description: 'Expand your audience across all markets and geographies.' },
];

function html({ features, columns }) {
  return `<div class="ip-tilt-grid not-prose" style="--cols:${columns}">
  ${features.map(f => `<div class="ip-tilt-card">
    <div class="ip-tilt-inner">
      <div class="ip-tilt-icon">${f.icon}</div>
      <h3 class="ip-tilt-title">${f.title}</h3>
      <p class="ip-tilt-desc">${f.description}</p>
      <div class="ip-tilt-shine" aria-hidden="true"></div>
    </div>
  </div>`).join('\n  ')}
</div>`;
}

registerBlockType('infinity-pillars/tilt-feature-grid', {
  title: 'IP — 3D Tilt Feature Grid',
  icon: 'grid-view',
  category: 'infinity-pillars',
  attributes: {
    columns:  { type: 'number', default: 3 },
    features: { type: 'array',  default: DEFAULTS },
  },

  edit({ attributes, setAttributes }) {
    const { columns, features } = attributes;
    const upd = (i, key, val) => { const n = [...features]; n[i] = { ...n[i], [key]: val }; setAttributes({ features: n }); };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Grid" initialOpen>
            <RangeControl label="Columns" value={columns} onChange={v => setAttributes({ columns: v })} min={2} max={4} />
          </PanelBody>
          <PanelBody title="Features">
            {features.map((f, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #333' }}>
                <TextControl label="Icon"        value={f.icon}        onChange={v => upd(i, 'icon', v)} />
                <TextControl label="Title"       value={f.title}       onChange={v => upd(i, 'title', v)} />
                <TextControl label="Description" value={f.description} onChange={v => upd(i, 'description', v)} />
                <Button isDestructive size="small" onClick={() => setAttributes({ features: features.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ features: [...features, { icon: '✨', title: 'New Feature', description: 'Description here.' }] })}>+ Add</Button>
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 24, borderRadius: 16 } })}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#1a1a2e', border: '1px solid #6366f122', borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
                <div style={{ color: '#94a3b8', fontSize: 13 }}>{f.description}</div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
