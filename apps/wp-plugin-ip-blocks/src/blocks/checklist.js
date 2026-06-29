import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const CL_HTML = (header, items) =>
  `<div class="ip-checklist"><div class="ip-checklist-header">${header}</div><ul class="ip-checklist-list">${items
    .map((x) => `<li class="ip-checklist-item"><span class="ip-check-box"></span>${x}</li>`)
    .join('')}</ul></div>`;

registerBlockType('infinity-pillars/checklist', {
  title: 'IP — Action Checklist',
  icon: 'yes-alt',
  category: 'infinity-pillars',
  attributes: {
    header: { type: 'string', default: 'Action Checklist' },
    items:  { type: 'array', default: ['Action item one', 'Action item two', 'Action item three'] },
  },

  edit({ attributes, setAttributes }) {
    const { header, items } = attributes;
    const blockProps = useBlockProps({ style: { border: '1px solid #ddd' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Checklist" initialOpen>
            <TextControl label="Header" value={header} onChange={(val) => setAttributes({ header: val })} />
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'flex-start' }}>
                <TextareaControl value={item} rows={2} onChange={(val) => { const n = [...items]; n[i] = val; setAttributes({ items: n }); }} style={{ flex: 1 }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ items: items.filter((_, j) => j !== i) })}>✕</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ items: [...items, ''] })}>+ Add Item</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <div style={{ padding: '0.75rem 1.25rem', fontWeight: 700, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', background: '#f5f5f5', borderBottom: '1px solid #ddd' }}>{header}</div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {items.map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, padding: '0.75rem 1.25rem', borderBottom: '1px solid #f0f0f0', fontSize: 14, alignItems: 'flex-start' }}>
                <span style={{ width: 16, height: 16, border: '1.5px solid #ccc', flexShrink: 0, marginTop: 2 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { header, items } }) {
    return <RawHTML>{CL_HTML(header, items)}</RawHTML>;
  },
});
