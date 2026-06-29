import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const SP_HTML = (steps) =>
  `<div class="ip-steps">${steps
    .map((s) => `<div class="ip-step"><div class="ip-step-num"></div><div class="ip-step-body"><p class="ip-step-title">${s.title}</p><p class="ip-step-desc">${s.desc}</p></div></div>`)
    .join('')}</div>`;

registerBlockType('infinity-pillars/steps', {
  title: 'IP — Step-by-Step',
  icon: 'editor-ol',
  category: 'infinity-pillars',
  attributes: {
    steps: {
      type: 'array',
      default: [
        { title: 'Step one title', desc: 'Step one description.' },
        { title: 'Step two title', desc: 'Step two description.' },
      ],
    },
  },

  edit({ attributes, setAttributes }) {
    const { steps } = attributes;
    const blockProps = useBlockProps({ style: { border: '1px solid #ddd' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Steps" initialOpen>
            {steps.map((s, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
                <TextControl label={`Step ${i + 1} — Title`} value={s.title} onChange={(val) => { const n = [...steps]; n[i] = { ...n[i], title: val }; setAttributes({ steps: n }); }} />
                <TextareaControl label="Description" value={s.desc} rows={2} onChange={(val) => { const n = [...steps]; n[i] = { ...n[i], desc: val }; setAttributes({ steps: n }); }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ steps: steps.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ steps: [...steps, { title: '', desc: '' }] })}>+ Add Step</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '1rem' }}>
              <span style={{ width: 48, color: '#999', fontSize: 11, fontWeight: 900 }}>0{i + 1}</span>
              <div>
                <strong style={{ display: 'block', marginBottom: 2 }}>{s.title}</strong>
                <p style={{ margin: 0, fontSize: 13, color: '#666' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes: { steps } }) {
    return <RawHTML>{SP_HTML(steps)}</RawHTML>;
  },
});
