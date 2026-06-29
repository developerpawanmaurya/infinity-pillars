import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const TC_HTML = (left, right) =>
  `<div class="ip-two-col"><div class="ip-two-col-side"><p class="ip-two-col-label">${left[0]}</p><h4 class="ip-two-col-title">${left[1]}</h4><p class="ip-two-col-body">${left[2]}</p></div><div class="ip-two-col-side"><p class="ip-two-col-label">${right[0]}</p><h4 class="ip-two-col-title">${right[1]}</h4><p class="ip-two-col-body">${right[2]}</p></div></div>`;

registerBlockType('infinity-pillars/two-col', {
  title: 'IP — Two Column',
  icon: 'columns',
  category: 'infinity-pillars',
  attributes: {
    leftLabel:  { type: 'string', default: 'Left Column' },
    leftTitle:  { type: 'string', default: 'Left Title' },
    leftBody:   { type: 'string', default: 'Left column body text.' },
    rightLabel: { type: 'string', default: 'Right Column' },
    rightTitle: { type: 'string', default: 'Right Title' },
    rightBody:  { type: 'string', default: 'Right column body text.' },
  },

  edit({ attributes, setAttributes }) {
    const { leftLabel, leftTitle, leftBody, rightLabel, rightTitle, rightBody } = attributes;
    const blockProps = useBlockProps({ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e5e5e5', border: '1px solid #e5e5e5' } });
    const side = { background: '#fff', padding: '1.5rem' };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Left Column" initialOpen>
            <TextControl label="Label" value={leftLabel} onChange={(val) => setAttributes({ leftLabel: val })} />
            <TextControl label="Title" value={leftTitle} onChange={(val) => setAttributes({ leftTitle: val })} />
            <TextareaControl label="Body" value={leftBody} rows={3} onChange={(val) => setAttributes({ leftBody: val })} />
          </PanelBody>
          <PanelBody title="Right Column" initialOpen={false}>
            <TextControl label="Label" value={rightLabel} onChange={(val) => setAttributes({ rightLabel: val })} />
            <TextControl label="Title" value={rightTitle} onChange={(val) => setAttributes({ rightTitle: val })} />
            <TextareaControl label="Body" value={rightBody} rows={3} onChange={(val) => setAttributes({ rightBody: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <div style={side}>
            <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#888', margin: '0 0 6px' }}>{leftLabel}</p>
            <strong style={{ display: 'block', marginBottom: 6 }}>{leftTitle}</strong>
            <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{leftBody}</p>
          </div>
          <div style={side}>
            <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#888', margin: '0 0 6px' }}>{rightLabel}</p>
            <strong style={{ display: 'block', marginBottom: 6 }}>{rightTitle}</strong>
            <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{rightBody}</p>
          </div>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { leftLabel, leftTitle, leftBody, rightLabel, rightTitle, rightBody } }) {
    return <RawHTML>{TC_HTML([leftLabel, leftTitle, leftBody], [rightLabel, rightTitle, rightBody])}</RawHTML>;
  },
});
