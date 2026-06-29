import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const ST_HTML = (stats) =>
  `<div class="ip-stats-row">${stats
    .map((s) => `<div class="ip-stat"><span class="ip-stat-num">${s.value}</span><span class="ip-stat-label">${s.label}</span></div>`)
    .join('')}</div>`;

registerBlockType('infinity-pillars/stats-row', {
  title: 'IP — Stats Row',
  icon: 'chart-bar',
  category: 'infinity-pillars',
  attributes: {
    stats: {
      type: 'array',
      default: [
        { value: '100%', label: 'Stat label one' },
        { value: '2x', label: 'Stat label two' },
        { value: '50K+', label: 'Stat label three' },
        { value: '$1M', label: 'Stat label four' },
      ],
    },
  },

  edit({ attributes, setAttributes }) {
    const { stats } = attributes;
    const blockProps = useBlockProps({ style: { display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 1, background: '#e5e5e5', border: '1px solid #e5e5e5' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Stats" initialOpen>
            {stats.map((s, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
                <TextControl label={`Stat ${i + 1} — Value`} value={s.value} onChange={(val) => { const n = [...stats]; n[i] = { ...n[i], value: val }; setAttributes({ stats: n }); }} />
                <TextControl label={`Stat ${i + 1} — Label`} value={s.label} onChange={(val) => { const n = [...stats]; n[i] = { ...n[i], label: val }; setAttributes({ stats: n }); }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ stats: stats.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ stats: [...stats, { value: '', label: '' }] })}>+ Add Stat</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: '#fff', padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: 28, fontWeight: 900, color: '#e07820' }}>{s.value}</span>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 600 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes: { stats } }) {
    return <RawHTML>{ST_HTML(stats)}</RawHTML>;
  },
});
