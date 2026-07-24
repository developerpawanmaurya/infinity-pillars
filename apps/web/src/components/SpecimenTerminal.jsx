import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpecimenPreview from './SpecimenPreview';

// A completely different register from a visual index: the archive as
// something you interrogate rather than browse. A dark console window boots
// with a couple of typed lines, then lists every specimen like `ls -la`.
// Arrow keys / hover move a selection; a "monitor" pane on the right runs
// that specimen's live preview and types out its field note, like `cat`-ing
// a log entry. Click or Enter opens it.
const BOOT_LINES = ['cd ~/infinity-pillars/rd', 'ls specimens/ --sorted'];

function useTypewriter(text, speed = 16) {
  const [out, setOut] = useState('');
  useEffect(() => {
    setOut('');
    if (!text) return undefined;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

function useBootSequence(lines) {
  const [linesDone, setLinesDone] = useState(0);
  const [current, setCurrent] = useState('');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idx = 0;

    const typeLine = () => {
      if (cancelled) return;
      if (idx >= lines.length) { setFinished(true); return; }
      const full = lines[idx];
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setCurrent(full.slice(0, i));
        if (i >= full.length) {
          clearInterval(id);
          setTimeout(() => {
            if (cancelled) return;
            setLinesDone((d) => d + 1);
            setCurrent('');
            idx += 1;
            typeLine();
          }, 200);
        }
      }, 15);
    };
    typeLine();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { linesDone, current, finished };
}

const slugOf = (path) => path.replace(/^\//, '') || 'index';
const pluralEntries = (n) => `${n} ${n === 1 ? 'entry' : 'entries'}`;

const SpecimenTerminal = ({ specimens }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { linesDone, current, finished } = useBootSequence(BOOT_LINES);

  useEffect(() => {
    setSelectedIndex(0);
  }, [specimens.length]);

  const selected = specimens[selectedIndex] ?? specimens[0];
  const typedNote = useTypewriter(finished ? selected?.note : '', 10);

  const onKeyDown = useCallback((e) => {
    if (!specimens.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(specimens.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selected) navigate(selected.path);
    }
  }, [specimens, selected, navigate]);

  const catLine = useMemo(() => (selected ? `cat ${slugOf(selected.path)}.spec` : ''), [selected]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="border border-border bg-[#0a0d0a] font-mono outline-none"
      style={{ boxShadow: '0 30px 70px -30px rgba(0,0,0,0.35)' }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-3 text-[11px] tracking-wide text-white/40">
          archive.log — infinity-pillars/rd — {pluralEntries(specimens.length)}
        </span>
      </div>

      <div
        className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr]"
        style={{
          backgroundImage: 'repeating-linear-gradient(rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)',
        }}
      >
        {/* Left: boot lines + specimen log */}
        <div className="p-5 md:p-6 min-h-[420px] border-b lg:border-b-0 lg:border-r border-white/10">
          {BOOT_LINES.slice(0, linesDone).map((l) => (
            <div key={l} className="text-xs text-white/40 mb-1.5">
              <span className="text-primary">$</span> {l}
            </div>
          ))}
          {!finished && (
            <div className="text-xs text-white/40 mb-1.5">
              <span className="text-primary">$</span> {current}
              <span className="inline-block w-[6px] h-[12px] bg-white/70 ml-0.5 align-middle" style={{ animation: 'archCursorBlink 1s steps(1) infinite' }} />
            </div>
          )}

          {finished && specimens.length === 0 && (
            <div className="text-xs text-[#ff6b6b] mt-3">bash: no specimens found matching this filter</div>
          )}

          {finished && specimens.length > 0 && (
            <div className="mt-2">
              <div className="text-[10px] text-white/45 mb-1.5">
                {pluralEntries(specimens.length)} found
              </div>
              <div className="text-[10px] text-white/30 grid grid-cols-[1rem_2.5rem_6rem_1fr] gap-3 px-2 pb-1.5 border-b border-white/10 mb-1">
                <span />
                <span>no.</span>
                <span>tag</span>
                <span>name</span>
              </div>
              <div role="listbox">
                {specimens.map((s, i) => {
                  const isSelected = i === selectedIndex;
                  return (
                    <Link
                      key={s.path}
                      to={s.path}
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setSelectedIndex(i)}
                      onFocus={() => setSelectedIndex(i)}
                      className={`grid grid-cols-[1rem_2.5rem_6rem_1fr] items-center gap-3 px-2 py-1.5 text-[13px] outline-none transition-colors duration-100 ${
                        isSelected ? 'bg-primary text-[#08130a]' : 'text-white/75 hover:bg-white/5'
                      }`}
                    >
                      <span className={isSelected ? 'text-[#08130a]' : 'text-primary'}>{isSelected ? '›' : ''}</span>
                      <span className="tabular-nums">{s.n}</span>
                      <span className={`lowercase ${isSelected ? 'text-[#08130a]/70' : 'text-white/40'}`}>[{s.tag}]</span>
                      <span className="truncate font-semibold">{s.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: monitor + cat'd note for whatever's selected */}
        <div className="p-5 md:p-6 flex flex-col">
          {finished && selected ? (
            <>
              <div className="text-xs text-white/40 mb-3">
                <span className="text-primary">$</span> {catLine}
              </div>

              <div className="relative border border-white/15 overflow-hidden" style={{ height: 150 }}>
                <SpecimenPreview tag={selected.tag} />
                <span className="absolute top-2 left-2 text-[9px] tracking-widest text-white/40">REC ●</span>
                <span className="absolute top-2 right-2 text-[9px] tracking-widest uppercase text-white/40">{selected.tag}</span>
              </div>

              <div className="mt-4 flex-1">
                <div className="text-[10px] tracking-widest uppercase text-white/35 mb-1">
                  {selected.n} / {String(specimens.length).padStart(2, '0')}
                </div>
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight mb-2">{selected.name}</h3>
                <p className="text-white/55 text-sm leading-relaxed">
                  {typedNote}
                  <span className="inline-block w-[6px] h-[13px] bg-white/50 ml-0.5 align-middle" style={{ animation: 'archCursorBlink 1s steps(1) infinite' }} />
                </p>
              </div>

              <div className="mt-4 flex items-center gap-4 text-[10px] tracking-widest uppercase text-white/35">
                <span><kbd className="text-white/60">↑↓</kbd> select</span>
                <span><kbd className="text-white/60">↵</kbd> open</span>
                <span className="hidden sm:inline">or click any line</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/20 text-xs">
              <span className="inline-block w-[7px] h-[15px] bg-white/30" style={{ animation: 'archCursorBlink 1s steps(1) infinite' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecimenTerminal;
