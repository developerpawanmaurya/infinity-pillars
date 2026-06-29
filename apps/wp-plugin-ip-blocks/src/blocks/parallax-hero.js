import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

function html({ title, subtitle, badge, gradFrom, gradTo }) {
  return `<div class="ip-parallax-hero not-prose" style="--grad-from:${gradFrom};--grad-to:${gradTo}">
  <div class="ip-ph-bg" aria-hidden="true"></div>
  <div class="ip-ph-orbs" aria-hidden="true">
    <div class="ip-ph-orb ip-ph-orb-1"></div>
    <div class="ip-ph-orb ip-ph-orb-2"></div>
  </div>
  <div class="ip-ph-mid">
    <span class="ip-ph-badge">${badge}</span>
  </div>
  <div class="ip-ph-fg">
    <h2 class="ip-ph-title">${title}</h2>
    <p class="ip-ph-sub">${subtitle}</p>
  </div>
</div>`;
}

registerBlockType('infinity-pillars/parallax-hero', {
  title: 'IP — Parallax Hero',
  icon: 'align-wide',
  category: 'infinity-pillars',
  attributes: {
    title:    { type: 'string', default: 'The Future of Digital Marketing' },
    subtitle: { type: 'string', default: 'Strategies that work in the age of AI and automation.' },
    badge:    { type: 'string', default: 'Deep Dive' },
    gradFrom: { type: 'string', default: '#0f0f1a' },
    gradTo:   { type: 'string', default: '#1a1a3e' },
  },

  edit({ attributes, setAttributes }) {
    const { title, subtitle, badge, gradFrom, gradTo } = attributes;
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Content" initialOpen>
            <TextControl label="Badge"          value={badge}    onChange={v => setAttributes({ badge: v })} />
            <TextControl label="Title"          value={title}    onChange={v => setAttributes({ title: v })} />
            <TextControl label="Subtitle"       value={subtitle} onChange={v => setAttributes({ subtitle: v })} />
            <TextControl label="Gradient From"  value={gradFrom} onChange={v => setAttributes({ gradFrom: v })} />
            <TextControl label="Gradient To"    value={gradTo}   onChange={v => setAttributes({ gradTo: v })} />
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: `linear-gradient(135deg,${gradFrom},${gradTo})`, padding: '72px 48px', borderRadius: 16, textAlign: 'center', position: 'relative', overflow: 'hidden' } })}>
          <span style={{ background: '#6366f1', color: '#fff', padding: '4px 16px', borderRadius: 9999, fontSize: 12, fontWeight: 700, display: 'inline-block', marginBottom: 24 }}>{badge}</span>
          <h2 style={{ color: '#fff', fontSize: 40, fontWeight: 900, margin: '0 0 16px', lineHeight: 1.1 }}>{title}</h2>
          <p style={{ color: '#94a3b8', fontSize: 18, margin: 0 }}>{subtitle}</p>
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
