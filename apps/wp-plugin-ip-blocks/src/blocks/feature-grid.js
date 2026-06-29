import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const FG_HTML = (features) =>
  `<div class="ip-feature-grid">${features
    .map((f) => `<div class="ip-feature-item"><div class="ip-feature-icon">${f.icon}</div><h4 class="ip-feature-title">${f.title}</h4><p class="ip-feature-desc">${f.desc}</p></div>`)
    .join('')}</div>`;

registerBlockType('infinity-pillars/feature-grid', {
  title: 'IP — Feature Grid',
  icon: 'grid-view',
  category: 'infinity-pillars',
  attributes: {
    features: {
      type: 'array',
      default: [
        { icon: '🎯', title: 'Feature One', desc: 'Description of this feature.' },
        { icon: '⚡', title: 'Feature Two', desc: 'Description of this feature.' },
        { icon: '🔒', title: 'Feature Three', desc: 'Description of this feature.' },
      ],
    },
  },

  edit({ attributes, setAttributes }) {
    const { features } = attributes;
    const blockProps = useBlockProps({ style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: '#e5e5e5', border: '1px solid #e5e5e5' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Features" initialOpen>
            {features.map((f, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
                <TextControl label={`Feature ${i + 1} — Icon (emoji)`} value={f.icon} onChange={(val) => { const n = [...features]; n[i] = { ...n[i], icon: val }; setAttributes({ features: n }); }} />
                <TextControl label="Title" value={f.title} onChange={(val) => { const n = [...features]; n[i] = { ...n[i], title: val }; setAttributes({ features: n }); }} />
                <TextareaControl label="Description" value={f.desc} rows={2} onChange={(val) => { const n = [...features]; n[i] = { ...n[i], desc: val }; setAttributes({ features: n }); }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ features: features.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ features: [...features, { icon: '✨', title: '', desc: '' }] })}>+ Add Feature</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: '1.5rem', background: '#fff' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <strong style={{ display: 'block', marginBottom: 4 }}>{f.title}</strong>
              <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes: { features } }) {
    return <RawHTML>{FG_HTML(features)}</RawHTML>;
  },
});
