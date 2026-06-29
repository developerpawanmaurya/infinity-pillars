import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const EQ_HTML = (text, author, role) =>
  `<div class="ip-expert-quote"><p class="ip-eq-text">"${text}"</p><footer class="ip-eq-footer"><strong class="ip-eq-author">${author}</strong><span class="ip-eq-role">${role}</span></footer></div>`;

registerBlockType('infinity-pillars/expert-quote', {
  title: 'IP — Expert Quote',
  icon: 'format-quote',
  category: 'infinity-pillars',
  attributes: {
    text:   { type: 'string', default: 'The insight or quote text goes here.' },
    author: { type: 'string', default: 'Expert Name' },
    role:   { type: 'string', default: 'Title, Company' },
  },

  edit({ attributes, setAttributes }) {
    const { text, author, role } = attributes;
    const blockProps = useBlockProps({ style: { borderLeft: '4px solid #e07820', padding: '1.5rem', background: '#f9f9f9' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Quote Details" initialOpen>
            <TextareaControl label="Quote Text" value={text} rows={4} onChange={(val) => setAttributes({ text: val })} />
            <TextControl label="Author Name" value={author} onChange={(val) => setAttributes({ author: val })} />
            <TextControl label="Author Title / Company" value={role} onChange={(val) => setAttributes({ role: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <p style={{ fontStyle: 'italic', fontSize: 16, margin: '0 0 1rem' }}>"{text}"</p>
          <footer style={{ fontSize: 12, borderTop: '1px solid #ddd', paddingTop: 8 }}>
            <strong style={{ display: 'block' }}>{author}</strong>
            <span style={{ color: '#777' }}>{role}</span>
          </footer>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { text, author, role } }) {
    return <RawHTML>{EQ_HTML(text, author, role)}</RawHTML>;
  },
});
