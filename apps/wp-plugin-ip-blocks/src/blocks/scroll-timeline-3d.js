import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

const DEFAULTS = [
  { year: '2020', title: 'Founded',           description: 'Started with a vision to transform digital marketing.' },
  { year: '2021', title: 'First 10K Readers', description: 'Grew to 10,000 monthly readers in our first year.' },
  { year: '2022', title: 'Expanded Team',     description: 'Built a team of expert marketing professionals.' },
  { year: '2023', title: '1M+ Impressions',   description: 'Reached over one million monthly impressions.' },
];

function html({ title, items }) {
  return `<div class="ip-timeline-3d not-prose">
  <h2 class="ip-t3d-heading">${title}</h2>
  <div class="ip-t3d-track">
    <div class="ip-t3d-line"><div class="ip-t3d-progress"></div></div>
    ${items.map((item, i) => `<div class="ip-t3d-item ${i % 2 === 0 ? 'ip-t3d-left' : 'ip-t3d-right'}">
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
}

registerBlockType('infinity-pillars/scroll-timeline-3d', {
  title: 'IP — 3D Scroll Timeline',
  icon: 'excerpt-view',
  category: 'infinity-pillars',
  attributes: {
    title: { type: 'string', default: 'Our Journey' },
    items: { type: 'array', default: DEFAULTS },
  },

  edit({ attributes, setAttributes }) {
    const { title, items } = attributes;
    const upd = (i, key, val) => { const n = [...items]; n[i] = { ...n[i], [key]: val }; setAttributes({ items: n }); };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Timeline" initialOpen>
            <TextControl label="Section Title" value={title} onChange={v => setAttributes({ title: v })} />
            {items.map((item, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #333' }}>
                <TextControl label="Year"        value={item.year}        onChange={v => upd(i, 'year', v)} />
                <TextControl label="Title"       value={item.title}       onChange={v => upd(i, 'title', v)} />
                <TextControl label="Description" value={item.description} onChange={v => upd(i, 'description', v)} />
                <Button isDestructive size="small" onClick={() => setAttributes({ items: items.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ items: [...items, { year: '2024', title: 'New Milestone', description: 'Description here.' }] })}>+ Add</Button>
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 32, borderRadius: 16 } })}>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{title}</div>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
              <div style={{ background: '#6366f1', color: '#fff', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700, height: 'fit-content' }}>{item.year}</div>
              <div style={{ background: '#1a1a2e', padding: 16, borderRadius: 12, flex: 1 }}>
                <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                <div style={{ color: '#94a3b8', fontSize: 13 }}>{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
