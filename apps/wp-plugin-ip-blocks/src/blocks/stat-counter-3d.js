import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

const DEFAULTS = [
  { value: '50', suffix: 'K+', label: 'Monthly Readers',     color: '#6366f1' },
  { value: '200', suffix: '+', label: 'Articles Published',   color: '#8b5cf6' },
  { value: '98',  suffix: '%', label: 'Satisfaction Rate',    color: '#a855f7' },
  { value: '4.9', suffix: '★', label: 'Average Rating',       color: '#ec4899' },
];

function html({ stats }) {
  return `<div class="ip-sc3d not-prose">
  <div class="ip-sc3d-grid">
    ${stats.map(s => `<div class="ip-sc3d-card" data-target="${s.value}" style="--card-color:${s.color}">
      <div class="ip-sc3d-glow"></div>
      <div class="ip-sc3d-inner">
        <div class="ip-sc3d-value"><span class="ip-sc3d-num">0</span><span class="ip-sc3d-suffix">${s.suffix}</span></div>
        <div class="ip-sc3d-label">${s.label}</div>
      </div>
    </div>`).join('\n    ')}
  </div>
</div>`;
}

registerBlockType('infinity-pillars/stat-counter-3d', {
  title: 'IP — 3D Stat Counter',
  icon: 'chart-bar',
  category: 'infinity-pillars',
  attributes: { stats: { type: 'array', default: DEFAULTS } },

  edit({ attributes, setAttributes }) {
    const { stats } = attributes;
    const upd = (i, key, val) => { const n = [...stats]; n[i] = { ...n[i], [key]: val }; setAttributes({ stats: n }); };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Stats" initialOpen>
            {stats.map((s, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #333' }}>
                <TextControl label="Value"        value={s.value}  onChange={v => upd(i, 'value', v)} />
                <TextControl label="Suffix"       value={s.suffix} onChange={v => upd(i, 'suffix', v)} />
                <TextControl label="Label"        value={s.label}  onChange={v => upd(i, 'label', v)} />
                <TextControl label="Accent color" value={s.color}  onChange={v => upd(i, 'color', v)} />
                <Button isDestructive size="small" onClick={() => setAttributes({ stats: stats.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ stats: [...stats, { value: '0', suffix: '', label: 'New Stat', color: '#6366f1' }] })}>+ Add Stat</Button>
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 24, borderRadius: 16 } })}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 16 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: '#1a1a2e', border: `1px solid ${s.color}44`, borderRadius: 12, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.value}{s.suffix}</div>
                <div style={{ color: '#94a3b8', marginTop: 8, fontSize: 13 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
