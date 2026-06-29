import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, Button } from '@wordpress/components';
import { RawHTML, Fragment } from '@wordpress/element';

export const CP_HTML = (pros, cons, proTitle, conTitle) =>
  `<div class="ip-comparison"><div class="ip-pro-col"><h4 class="ip-pro-title">${proTitle}</h4><ul>${pros
    .map((x) => `<li>${x}</li>`)
    .join('')}</ul></div><div class="ip-con-col"><h4 class="ip-con-title">${conTitle}</h4><ul>${cons
    .map((x) => `<li>${x}</li>`)
    .join('')}</ul></div></div>`;

registerBlockType('infinity-pillars/comparison', {
  title: 'IP — Pro/Con Comparison',
  icon: 'editor-table',
  category: 'infinity-pillars',
  attributes: {
    proTitle: { type: 'string', default: 'Advantages' },
    conTitle: { type: 'string', default: 'Watch-outs' },
    pros: { type: 'array', default: ['Advantage one', 'Advantage two', 'Advantage three'] },
    cons: { type: 'array', default: ['Limitation one', 'Limitation two', 'Limitation three'] },
  },

  edit({ attributes, setAttributes }) {
    const { pros, cons, proTitle, conTitle } = attributes;
    const blockProps = useBlockProps({ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e5e5e5', border: '1px solid #e5e5e5' } });
    const listStyle = { margin: 0, padding: 0, listStyle: 'none' };
    const itemStyle = { padding: '4px 0', fontSize: 13, paddingLeft: '1rem', position: 'relative' };
    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title="Column Titles" initialOpen>
            <TextControl label="Pro Column Title" value={proTitle} onChange={(val) => setAttributes({ proTitle: val })} />
            <TextControl label="Con Column Title" value={conTitle} onChange={(val) => setAttributes({ conTitle: val })} />
          </PanelBody>
          <PanelBody title="Pros (Advantages)" initialOpen={false}>
            {pros.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <TextareaControl value={item} rows={2} onChange={(val) => { const n = [...pros]; n[i] = val; setAttributes({ pros: n }); }} style={{ flex: 1 }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ pros: pros.filter((_, j) => j !== i) })}>✕</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ pros: [...pros, ''] })}>+ Add Pro</Button>
          </PanelBody>
          <PanelBody title="Cons (Watch-outs)" initialOpen={false}>
            {cons.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <TextareaControl value={item} rows={2} onChange={(val) => { const n = [...cons]; n[i] = val; setAttributes({ cons: n }); }} style={{ flex: 1 }} />
                <Button isDestructive size="small" onClick={() => setAttributes({ cons: cons.filter((_, j) => j !== i) })}>✕</Button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => setAttributes({ cons: [...cons, ''] })}>+ Add Con</Button>
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <div style={{ background: '#fff', padding: '1.25rem' }}>
            <strong style={{ display: 'block', color: '#16a34a', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{proTitle}</strong>
            <ul style={listStyle}>{pros.map((p, i) => <li key={i} style={itemStyle}>+ {p}</li>)}</ul>
          </div>
          <div style={{ background: '#fff', padding: '1.25rem' }}>
            <strong style={{ display: 'block', color: '#dc2626', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>{conTitle}</strong>
            <ul style={listStyle}>{cons.map((c, i) => <li key={i} style={itemStyle}>− {c}</li>)}</ul>
          </div>
        </div>
      </Fragment>
    );
  },

  save({ attributes: { pros, cons, proTitle, conTitle } }) {
    return <RawHTML>{CP_HTML(pros, cons, proTitle, conTitle)}</RawHTML>;
  },
});
