import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const BS_HTML = (number, label, source) =>
  `<div class="ip-big-stat"><span class="ip-big-stat-number">${number}</span><span class="ip-big-stat-label">${label}</span><span class="ip-big-stat-source">${source}</span></div>`;

registerBlockType('infinity-pillars/big-stat', {
  title: 'IP — Big Single Stat',
  icon: 'chart-line',
  category: 'infinity-pillars',
  attributes: {
    number: { type: 'string', default: '94%' },
    label:  { type: 'string', default: 'Stat label here' },
    source: { type: 'string', default: 'Source' },
  },

  edit({ attributes, setAttributes }) {
    const { number, label, source } = attributes;
    const blockProps = useBlockProps({ style: { textAlign: 'center', padding: '2.5rem', border: '1px solid #eee', background: '#fafafa' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Big Stat" initialOpen>
            <TextControl label="Number / Value" value={number} onChange={(val) => setAttributes({ number: val })} />
            <TextControl label="Label" value={label} onChange={(val) => setAttributes({ label: val })} />
            <TextControl label="Source" value={source} onChange={(val) => setAttributes({ source: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <span style={{ display: 'block', fontSize: 64, fontWeight: 900, lineHeight: 1, letterSpacing: -3 }}>{number}</span>
          <span style={{ display: 'block', fontSize: 16, fontWeight: 600, color: '#444', marginTop: 8 }}>{label}</span>
          <span style={{ display: 'block', fontSize: 11, color: '#999', marginTop: 4 }}>{source}</span>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { number, label, source } }) {
    return <RawHTML>{BS_HTML(number, label, source)}</RawHTML>;
  },
});
