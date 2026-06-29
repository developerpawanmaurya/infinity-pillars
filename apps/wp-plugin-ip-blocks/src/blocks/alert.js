import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const AL_HTML = (type, title, text) =>
  `<div class="ip-alert ip-alert--${type}"><div class="ip-alert-body"><strong class="ip-alert-title">${title}</strong><p class="ip-alert-text">${text}</p></div></div>`;

const TYPE_COLORS = { tip: '#22c55e', warning: '#f59e0b', info: '#3b82f6', danger: '#ef4444' };

registerBlockType('infinity-pillars/alert', {
  title: 'IP — Alert Box',
  icon: 'warning',
  category: 'infinity-pillars',
  attributes: {
    type:  { type: 'string', default: 'tip' },
    title: { type: 'string', default: 'Alert Title' },
    text:  { type: 'string', default: 'Alert body text goes here.' },
  },

  edit({ attributes, setAttributes }) {
    const { type, title, text } = attributes;
    const color = TYPE_COLORS[type] || '#22c55e';
    const blockProps = useBlockProps({ style: { borderLeft: `4px solid ${color}`, padding: '1rem 1.25rem', background: `${color}10` } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Alert Settings" initialOpen>
            <SelectControl
              label="Type"
              value={type}
              options={[
                { label: 'Tip (green)', value: 'tip' },
                { label: 'Warning (amber)', value: 'warning' },
                { label: 'Info (blue)', value: 'info' },
                { label: 'Danger (red)', value: 'danger' },
              ]}
              onChange={(val) => setAttributes({ type: val })}
            />
            <TextControl label="Title" value={title} onChange={(val) => setAttributes({ title: val })} />
            <TextareaControl label="Body Text" value={text} rows={3} onChange={(val) => setAttributes({ text: val })} />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <strong style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color, marginBottom: 4 }}>{title}</strong>
          <p style={{ margin: 0, fontSize: 14 }}>{text}</p>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { type, title, text } }) {
    return <RawHTML>{AL_HTML(type, title, text)}</RawHTML>;
  },
});
