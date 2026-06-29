import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const RL_HTML = (resources) =>
  `<div class="ip-resource-list"><div class="ip-resource-header">Further Reading and Resources</div>${resources
    .map((r) => `<div class="ip-resource-item"><span class="ip-resource-tag">${r.tag}</span><div><p class="ip-resource-title">${r.title}</p><p class="ip-resource-desc">${r.desc}</p></div></div>`)
    .join('')}</div>`;

registerBlockType('infinity-pillars/resource-list', {
  title: 'IP — Resource List',
  icon: 'list-view',
  category: 'infinity-pillars',
  attributes: {
    resources: {
      type: 'array',
      default: [
        { tag: 'Guide', title: 'Resource title', desc: 'Brief description of this resource.' },
        { tag: 'Tool', title: 'Another resource', desc: 'Description of the second resource.' },
      ],
    },
  },

  edit({ attributes, setAttributes }) {
    const { resources } = attributes;
    const blockProps = useBlockProps({ style: { border: '1px solid #ddd' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Resources" initialOpen>
            {resources.map((r, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
                <TextControl label={`Resource ${i + 1} — Tag`} value={r.tag} onChange={(val) => { const n = [...resources]; n[i] = { ...n[i], tag: val }; setAttributes({ resources: n }); }} />
                <TextControl label="Title" value={r.title} onChange={(val) => { const n = [...resources]; n[i] = { ...n[i], title: val }; setAttributes({ resources: n }); }} />
                <TextareaControl label="Description" value={r.desc} rows={2} onChange={(val) => { const n = [...resources]; n[i] = { ...n[i], desc: val }; setAttributes({ resources: n }); }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ resources: resources.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ resources: [...resources, { tag: '', title: '', desc: '' }] })}>+ Add Resource</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <div style={{ padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>Further Reading and Resources</div>
          {resources.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', border: '1px solid #ddd', padding: '2px 6px', color: '#888', flexShrink: 0 }}>{r.tag}</span>
              <div>
                <strong style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>{r.title}</strong>
                <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes: { resources } }) {
    return <RawHTML>{RL_HTML(resources)}</RawHTML>;
  },
});
