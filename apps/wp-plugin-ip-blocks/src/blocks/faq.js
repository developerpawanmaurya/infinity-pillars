import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const FAQ_HTML = (items) =>
  `<div class="faq-section">${items
    .map((x) => `<div class="faq-item"><h3 class="faq-question">${x.q}</h3><div class="faq-answer"><p>${x.a}</p></div></div>`)
    .join('')}</div>`;

registerBlockType('infinity-pillars/faq', {
  title: 'IP — FAQ Section',
  icon: 'editor-help',
  category: 'infinity-pillars',
  attributes: {
    items: {
      type: 'array',
      default: [
        { q: 'What is this about?', a: 'Answer to the question goes here.' },
        { q: 'How does this work?', a: 'Explanation of how it works.' },
      ],
    },
  },

  edit({ attributes, setAttributes }) {
    const { items } = attributes;
    const blockProps = useBlockProps({ style: { borderTop: '2px solid #111', paddingTop: '1rem' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="FAQ Items" initialOpen>
            {items.map((item, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
                <TextControl label={`Q${i + 1} — Question`} value={item.q} onChange={(val) => { const n = [...items]; n[i] = { ...n[i], q: val }; setAttributes({ items: n }); }} />
                <TextareaControl label="Answer" value={item.a} rows={3} onChange={(val) => { const n = [...items]; n[i] = { ...n[i], a: val }; setAttributes({ items: n }); }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ items: items.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ items: [...items, { q: '', a: '' }] })}>+ Add FAQ</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <strong style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>FAQ SECTION — Rendered as accordion on frontend</strong>
          {items.map((item, i) => (
            <div key={i} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              <strong style={{ display: 'block', marginBottom: 4 }}>Q: {item.q}</strong>
              <p style={{ margin: 0, fontSize: 13, color: '#666' }}>A: {item.a}</p>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes: { items } }) {
    return <RawHTML>{FAQ_HTML(items)}</RawHTML>;
  },
});
