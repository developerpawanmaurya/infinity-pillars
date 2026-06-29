import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const SB_HTML = (title, text) =>
  `<div class="ip-success-banner"><div class="ip-success-icon">✓</div><div class="ip-success-body"><p class="ip-success-title">${title}</p><p class="ip-success-text">${text}</p></div></div>`;

registerBlockType('infinity-pillars/success-banner', {
  title: 'IP — Success Banner',
  icon: 'yes-alt',
  category: 'infinity-pillars',
  attributes: {
    title: { type: 'string', default: 'Success' },
    text:  { type: 'string', default: 'Outcome or achievement description.' },
  },

  edit({ attributes, setAttributes }) {
    const { title, text } = attributes;
    const blockProps = useBlockProps({ style: { display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem', border: '1px solid #86efac', background: '#f0fdf4' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Success Banner" initialOpen>
            <TextControl label="Title" value={title} onChange={(val) => setAttributes({ title: val })} />
            <TextareaControl label="Body Text" value={text} rows={3} onChange={(val) => setAttributes({ text: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <span style={{ color: '#16a34a', fontSize: 20, flexShrink: 0, marginTop: 2 }}>✓</span>
          <div>
            <strong style={{ display: 'block', color: '#16a34a', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>{title}</strong>
            <p style={{ margin: 0, fontSize: 14 }}>{text}</p>
          </div>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { title, text } }) {
    return <RawHTML>{SB_HTML(title, text)}</RawHTML>;
  },
});
