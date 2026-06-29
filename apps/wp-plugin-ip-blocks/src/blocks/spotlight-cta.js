import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

function html({ headline, subtitle, buttonText, buttonUrl }) {
  return `<div class="ip-spotlight-cta not-prose">
  <div class="ip-spc-beam" aria-hidden="true"></div>
  <div class="ip-spc-particles" aria-hidden="true"></div>
  <div class="ip-spc-content">
    <h2 class="ip-spc-headline">${headline.split(' ').map(w => `<span>${w}</span>`).join(' ')}</h2>
    <p class="ip-spc-sub">${subtitle}</p>
    <a href="${buttonUrl}" class="ip-spc-btn">${buttonText}</a>
  </div>
</div>`;
}

registerBlockType('infinity-pillars/spotlight-cta', {
  title: 'IP — Spotlight CTA',
  icon: 'megaphone',
  category: 'infinity-pillars',
  attributes: {
    headline:   { type: 'string', default: 'Ready to 10x Your Growth?' },
    subtitle:   { type: 'string', default: 'Join 50,000+ marketers who trust Infinity Pillars.' },
    buttonText: { type: 'string', default: 'Get Started Free' },
    buttonUrl:  { type: 'string', default: '#' },
  },

  edit({ attributes, setAttributes }) {
    const { headline, subtitle, buttonText, buttonUrl } = attributes;
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="CTA" initialOpen>
            <TextControl label="Headline"    value={headline}   onChange={v => setAttributes({ headline: v })} />
            <TextControl label="Subtitle"    value={subtitle}   onChange={v => setAttributes({ subtitle: v })} />
            <TextControl label="Button Text" value={buttonText} onChange={v => setAttributes({ buttonText: v })} />
            <TextControl label="Button URL"  value={buttonUrl}  onChange={v => setAttributes({ buttonUrl: v })} />
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#050510', padding: '72px 48px', borderRadius: 16, textAlign: 'center', position: 'relative', overflow: 'hidden' } })}>
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, background: 'radial-gradient(circle,rgba(99,102,241,0.35) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <h2 style={{ color: '#fff', fontSize: 38, fontWeight: 900, margin: '0 0 16px', position: 'relative', lineHeight: 1.2 }}>{headline}</h2>
          <p style={{ color: '#94a3b8', marginBottom: 36, position: 'relative' }}>{subtitle}</p>
          <a href={buttonUrl} style={{ background: '#6366f1', color: '#fff', padding: '14px 36px', borderRadius: 9999, fontWeight: 700, textDecoration: 'none', display: 'inline-block', position: 'relative' }}>{buttonText}</a>
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
