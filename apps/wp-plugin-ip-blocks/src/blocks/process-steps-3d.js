import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

const DEFAULTS = [
  { title: 'Discover',   description: 'We audit your current marketing stack and identify the key gaps.' },
  { title: 'Strategize', description: 'Build a data-backed growth roadmap tailored to your specific goals.' },
  { title: 'Execute',    description: 'Launch campaigns with precision and real-time optimisations.' },
  { title: 'Scale',      description: 'Double down on what works and expand to new profitable channels.' },
];

function html({ title, steps }) {
  return `<div class="ip-process-steps not-prose">
  <h2 class="ip-ps-heading">${title}</h2>
  <div class="ip-ps-track">
    ${steps.map((step, i) => `<div class="ip-ps-item ${i % 2 === 0 ? 'ip-ps-left' : 'ip-ps-right'}">
      <div class="ip-ps-num">${String(i + 1).padStart(2, '0')}</div>
      ${i < steps.length - 1 ? '<div class="ip-ps-line"></div>' : ''}
      <div class="ip-ps-content">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      </div>
    </div>`).join('\n    ')}
  </div>
</div>`;
}

registerBlockType('infinity-pillars/process-steps-3d', {
  title: 'IP — 3D Process Steps',
  icon: 'list-view',
  category: 'infinity-pillars',
  attributes: {
    title: { type: 'string', default: 'How It Works' },
    steps: { type: 'array',  default: DEFAULTS },
  },

  edit({ attributes, setAttributes }) {
    const { title, steps } = attributes;
    const upd = (i, key, val) => { const n = [...steps]; n[i] = { ...n[i], [key]: val }; setAttributes({ steps: n }); };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Steps" initialOpen>
            <TextControl label="Section Title" value={title} onChange={v => setAttributes({ title: v })} />
            {steps.map((step, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #333' }}>
                <TextControl label="Title"       value={step.title}       onChange={v => upd(i, 'title', v)} />
                <TextControl label="Description" value={step.description} onChange={v => upd(i, 'description', v)} />
                <Button isDestructive size="small" onClick={() => setAttributes({ steps: steps.filter((_, j) => j !== i) })}>Remove</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ steps: [...steps, { title: 'New Step', description: 'Step description here.' }] })}>+ Add Step</Button>
          </PanelBody>
        </InspectorControls>
        <div {...useBlockProps({ style: { background: '#0f0f1a', padding: 32, borderRadius: 16 } })}>
          <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, marginBottom: 28 }}>{title}</div>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ background: '#6366f1', color: '#fff', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ background: '#1a1a2e', padding: 20, borderRadius: 12, flex: 1 }}>
                <div style={{ color: '#e2e8f0', fontWeight: 600, marginBottom: 6 }}>{step.title}</div>
                <div style={{ color: '#94a3b8', fontSize: 13 }}>{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Fragment>
    );
  },

  save({ attributes }) { return <RawHTML>{html(attributes)}</RawHTML>; },
});
