import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, RangeControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

const DEFAULTS = [
  { label: 'Organic Search',  value: 78, color: '#6366f1' },
  { label: 'Email Marketing', value: 85, color: '#8b5cf6' },
  { label: 'Social Media',    value: 62, color: '#a855f7' },
  { label: 'Paid Ads',        value: 45, color: '#ec4899' },
  { label: 'Referral Traffic', value: 33, color: '#06b6d4' },
];

function html({ title, bars }) {
  return `<div class="ip-data-bars not-prose">
  <h2 class="ip-db-title">${title}</h2>
  <div class="ip-db-list">
    ${bars.map(bar => `<div class="ip-db-item">
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
}

registerBlockType('infinity-pillars/data-bar-visual', {
  title: 'IP — Animated Data Bars',
  icon: 'chart-bar',
  category: 'infinity-pillars',
  attributes: {
    title: { type: 'string', default: 'Channel Performance' },
    bars:  { type: 'array',  default: DEFAULTS },
  },

  edit({ attributes, setAttributes }) {
    const { title, bars } = attributes;
    const upd = (i, key, val) => { const n = [...bars]; n[i] = { ...n[i], [key]: val }; setAttributes({ bars: n }); };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Settings" initialOpen>
            <TextControl label="Section Title" value={title} onChange={v => setAttributes({ title: v })} />
          </PanelBody>
          <PanelBody title="Bars">
            {bars.map((bar, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #333' }}>
                <TextControl  label="Label" value={bar.label} onChange={v => upd(i, 'label', v)} />
                <RangeControl label="Value (%)" value={bar.value} onChange={v => upd(i, 'value', v)} min={0} max={100} />
                <TextControl  label="Color" value={bar.color} onChange={v => upd(i, 'color', v)} />
                <Button isDestructive size="small" onClick={() => setAttributes({ bars: bars.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ bars: [...bars, { label: 'New Channel', value: 50, color: '#6366f1' }] })}>+ Add Bar</Button>
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 32, borderRadius: 16 } })}>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 28 }}>{title}</div>
          {bars.map((bar, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#e2e8f0', fontSize: 13 }}>{bar.label}</span>
                <span style={{ color: bar.color, fontWeight: 700, fontSize: 13 }}>{bar.value}%</span>
              </div>
              <div style={{ background: '#1a1a2e', borderRadius: 9999, height: 10 }}>
                <div style={{ width: `${bar.value}%`, height: '100%', background: bar.color, borderRadius: 9999 }} />
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
