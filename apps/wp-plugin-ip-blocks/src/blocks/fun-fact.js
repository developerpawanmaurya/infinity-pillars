import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const FF_HTML = (text, source) =>
  `<div class="ip-fun-fact"><p class="ip-fun-label">Did You Know?</p><p class="ip-fun-text">${text}</p><p class="ip-fun-source">Source: ${source}</p></div>`;

registerBlockType('infinity-pillars/fun-fact', {
  title: 'IP — Fun Fact',
  icon: 'info',
  category: 'infinity-pillars',
  attributes: {
    text:   { type: 'string', default: 'An interesting fact relevant to the article.' },
    source: { type: 'string', default: 'Source Name' },
  },

  edit({ attributes, setAttributes }) {
    const { text, source } = attributes;
    const blockProps = useBlockProps({ style: { borderLeft: '4px solid #111', background: '#f5f5f5', padding: '1.5rem 2rem' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Fun Fact" initialOpen>
            <TextareaControl label="Fact Text" value={text} rows={3} onChange={(val) => setAttributes({ text: val })} />
            <TextControl label="Source" value={source} onChange={(val) => setAttributes({ source: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#888', margin: '0 0 6px', fontWeight: 900 }}>Did You Know?</p>
          <p style={{ fontWeight: 600, fontSize: 15, margin: '0 0 6px' }}>{text}</p>
          <p style={{ fontSize: 12, color: '#888', margin: 0 }}>Source: {source}</p>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { text, source } }) {
    return <RawHTML>{FF_HTML(text, source)}</RawHTML>;
  },
});
