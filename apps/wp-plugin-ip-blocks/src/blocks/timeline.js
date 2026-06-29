import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const TL_HTML = (steps) =>
  `<div class="ip-timeline">${steps
    .map((s, i) =>
      `<div class="ip-timeline-item"><div class="ip-timeline-marker">0${i + 1}</div><div class="ip-timeline-content"><h4 class="ip-timeline-title">${s.title}</h4><p class="ip-timeline-body">${s.body}</p></div></div>`
    )
    .join('')}</div>`;

registerBlockType('infinity-pillars/timeline', {
  title: 'IP — Process Timeline',
  icon: 'list-view',
  category: 'infinity-pillars',
  attributes: {
    steps: {
      type: 'array',
      default: [
        { title: 'Step One', body: 'Description of step one.' },
        { title: 'Step Two', body: 'Description of step two.' },
        { title: 'Step Three', body: 'Description of step three.' },
      ],
    },
  },

  edit({ attributes, setAttributes }) {
    const { steps } = attributes;
    const blockProps = useBlockProps({ style: { borderLeft: '2px solid #111', paddingLeft: '1.5rem' } });
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Timeline Steps" initialOpen>
            {steps.map((s, i) => (
              <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #eee' }}>
                <TextControl label={`Step ${i + 1} — Title`} value={s.title} onChange={(val) => { const n = [...steps]; n[i] = { ...n[i], title: val }; setAttributes({ steps: n }); }} />
                <TextareaControl label="Body" value={s.body} rows={2} onChange={(val) => { const n = [...steps]; n[i] = { ...n[i], body: val }; setAttributes({ steps: n }); }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ steps: steps.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ steps: [...steps, { title: '', body: '' }] })}>+ Add Step</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          {steps.map((s, i) => (
            <div key={i} style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ background: '#111', color: '#fff', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>0{i + 1}</span>
              <div>
                <strong style={{ display: 'block', marginBottom: 2 }}>{s.title}</strong>
                <p style={{ margin: 0, fontSize: 14, color: '#555' }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes: { steps } }) {
    return <RawHTML>{TL_HTML(steps)}</RawHTML>;
  },
});
