import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const CTA_HTML = (headline, sub) =>
  `<div class="ip-cta-card"><h3 class="ip-cta-headline">${headline}</h3><p class="ip-cta-sub">${sub}</p><a href="/#booking" class="ip-cta-btn">Book a Free Strategy Call</a></div>`;

registerBlockType('infinity-pillars/cta-card', {
  title: 'IP — CTA Card',
  icon: 'megaphone',
  category: 'infinity-pillars',
  attributes: {
    headline: { type: 'string', default: 'Ready to grow your business?' },
    sub:      { type: 'string', default: 'Work with our team to build a strategy that drives real results.' },
  },

  edit({ attributes, setAttributes }) {
    const { headline, sub } = attributes;
    const blockProps = useBlockProps({ style: { border: '1px solid #111', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="CTA Content" initialOpen>
            <TextControl label="Headline" value={headline} onChange={(val) => setAttributes({ headline: val })} />
            <TextareaControl label="Sub-text" value={sub} rows={3} onChange={(val) => setAttributes({ sub: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <div>
            <strong style={{ display: 'block', fontSize: 18, letterSpacing: -0.5, marginBottom: 4 }}>{headline}</strong>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{sub}</p>
          </div>
          <span style={{ background: '#111', color: '#fff', padding: '0.75rem 1.5rem', fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Book a Free Strategy Call</span>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { headline, sub } }) {
    return <RawHTML>{CTA_HTML(headline, sub)}</RawHTML>;
  },
});
