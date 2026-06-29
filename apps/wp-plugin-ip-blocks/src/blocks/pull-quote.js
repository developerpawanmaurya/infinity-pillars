import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const PQ_HTML = (text) =>
  `<div class="ip-pull-quote"><p class="ip-pq-text">${text}</p></div>`;

registerBlockType('infinity-pillars/pull-quote', {
  title: 'IP — Pull Quote',
  icon: 'format-quote',
  category: 'infinity-pillars',
  attributes: {
    text: { type: 'string', default: 'A compelling statement that stands alone.' },
  },

  edit({ attributes, setAttributes }) {
    const { text } = attributes;
    const blockProps = useBlockProps({ style: { textAlign: 'center', padding: '2rem', maxWidth: 600, margin: '0 auto' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Pull Quote" initialOpen>
            <TextareaControl label="Quote Text" value={text} rows={3} onChange={(val) => setAttributes({ text: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <p style={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.5 }}>"{text}"</p>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { text } }) {
    return <RawHTML>{PQ_HTML(text)}</RawHTML>;
  },
});
