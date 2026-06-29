import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const DF_HTML = (word, text) =>
  `<div class="ip-definition"><p class="ip-def-term">Definition</p><p class="ip-def-word">${word}</p><p class="ip-def-text">${text}</p></div>`;

registerBlockType('infinity-pillars/definition', {
  title: 'IP — Definition Box',
  icon: 'book-alt',
  category: 'infinity-pillars',
  attributes: {
    word: { type: 'string', default: 'Term' },
    text: { type: 'string', default: 'A clear, concise definition of the term.' },
  },

  edit({ attributes, setAttributes }) {
    const { word, text } = attributes;
    const blockProps = useBlockProps({ style: { borderLeft: '3px solid #aaa', background: '#f8f8f8', padding: '1.5rem 2rem' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Definition" initialOpen>
            <TextControl label="Term / Word" value={word} onChange={(val) => setAttributes({ word: val })} />
            <TextareaControl label="Definition Text" value={text} rows={3} onChange={(val) => setAttributes({ text: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#888', margin: '0 0 4px' }}>Definition</p>
          <p style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>{word}</p>
          <p style={{ fontSize: 14, color: '#555', margin: 0 }}>{text}</p>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { word, text } }) {
    return <RawHTML>{DF_HTML(word, text)}</RawHTML>;
  },
});
