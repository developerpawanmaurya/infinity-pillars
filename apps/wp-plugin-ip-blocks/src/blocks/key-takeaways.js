import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const KT_HTML = (items) =>
  `<div class="ip-key-takeaways"><div class="ip-kt-header">Key Takeaways</div><ul class="ip-kt-list">${
    items.map((x) => `<li class="ip-kt-item">${x}</li>`).join('')
  }</ul></div>`;

registerBlockType('infinity-pillars/key-takeaways', {
  title: 'IP — Key Takeaways',
  icon: 'lightbulb',
  category: 'infinity-pillars',
  attributes: {
    items: { type: 'array', default: ['Key point one', 'Key point two', 'Key point three'] },
  },

  edit({ attributes, setAttributes }) {
    const { items } = attributes;
    const blockProps = useBlockProps({ style: { background: '#f6f6f6', padding: '1rem', borderLeft: '3px solid #111' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Key Takeaway Points" initialOpen>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'flex-start' }}>
                <TextareaControl
                  value={item}
                  rows={2}
                  onChange={(val) => { const n = [...items]; n[i] = val; setAttributes({ items: n }); }}
                  style={{ flex: 1 }}
                />
                <Button isDestructive size="small" onClick={() => setAttributes({ items: items.filter((_, j) => j !== i) })}>✕</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ items: [...items, ''] })}>+ Add Point</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <strong style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>KEY TAKEAWAYS</strong>
          <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: 'none' }}>
            {items.map((item, i) => (
              <li key={i} style={{ paddingLeft: '1.2rem', position: 'relative', marginBottom: 4, fontSize: 14 }}>
                <span style={{ position: 'absolute', left: 0 }}>→</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { items } }) {
    return <RawHTML>{KT_HTML(items)}</RawHTML>;
  },
});
