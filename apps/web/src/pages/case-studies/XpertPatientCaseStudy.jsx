import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ChevronLeft, ArrowUpRight, ChevronRight, Check, Award, ShieldCheck,
  HeartHandshake, Search, X as XIcon
} from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import AnimatedCounter from '@/components/AnimatedCounter.jsx';
import SplitReveal from '@/components/SplitReveal.jsx';
import { Button } from '@/components/ui/button';
import './XpertPatientCaseStudy.css';

gsap.registerPlugin(ScrollTrigger);

const CANCER_TYPES = [
  'Breast', 'Lung', 'Prostate', 'Colorectal', 'Melanoma', 'Leukemia',
  'Ovarian', 'Pancreatic', 'Bladder', 'Kidney', 'Liver', 'Brain', 'Thyroid', 'Head & Neck'
];

const COMPARISON_ROWS = [
  { label: 'Administration', oral: 'At home, by pill', iv: 'In-clinic infusion' },
  { label: 'Typical Hair Loss', oral: 'Low likelihood', iv: 'Moderate–high likelihood' },
  { label: 'Neuropathy Risk', oral: 'Moderate', iv: 'Lower' },
  { label: 'Clinic Visits', oral: 'Monthly check-in', iv: 'Weekly sessions' },
];

const ELIGIBILITY = [
  'Confirmed diagnosis on file',
  'Stage 0–IV documented',
  'No active second malignancy',
  'Willing to travel under 50 miles',
];

const OUTCOMES = [
  { mod: 'Intake / Onboarding', before: 'Confusing, complex search fields.', after: 'Personalized 3-field selector.', value: 'Low abandonment; rapid routing.' },
  { mod: 'Treatment Evaluation', before: 'Navigating dense PDF guidelines.', after: 'Side-by-side comparison grids.', value: 'Clear differentiation of regimens.' },
  { mod: 'Clinical Trial Matching', before: 'Complex eligibility checklists.', after: 'Integrated API search engine.', value: 'Seamless vertical matching.' },
  { mod: 'Information Delivery', before: 'Hard-to-read medical databases.', after: 'Typography, illustrations, and video.', value: 'Enhanced patient confidence.' },
];

const XpertPatientCaseStudy = () => {
  const [wizardStep, setWizardStep] = useState(0);
  const [cancerType, setCancerType] = useState(null);
  const [stage, setStage] = useState(null);
  const [role, setRole] = useState(null);
  const [routed, setRouted] = useState(false);
  const [checked, setChecked] = useState({});
  const [trialsFound, setTrialsFound] = useState(false);
  const pageRef = useRef(null);

  const toggleCheck = (item) => setChecked((c) => ({ ...c, [item]: !c[item] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  const canAdvance = (wizardStep === 0 && cancerType) || (wizardStep === 1 && stage !== null) || (wizardStep === 2 && role);

  const advanceWizard = () => {
    if (wizardStep < 2) {
      setWizardStep((s) => s + 1);
    } else {
      setRouted(true);
    }
  };
  const resetWizard = () => {
    setWizardStep(0); setCancerType(null); setStage(null); setRole(null); setRouted(false);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-xp-reveal]').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      });
      gsap.utils.toArray('[data-xp-stagger]').forEach((group) => {
        gsap.fromTo(group.children,
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08, scrollTrigger: { trigger: group, start: 'top 85%', once: true } });
      });
    }, pageRef);

    if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  // The wizard, comparison toggle, and eligibility checklist all change the
  // height of their section as the user interacts — recalculate trigger
  // positions for everything below so later sections don't drift out of
  // sync with the real (now taller/shorter) layout.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [wizardStep, routed, trialsFound]);

  return (
    <div ref={pageRef} className="xp-page min-h-screen bg-background text-foreground">
      <Helmet>
        <title>XpertPatient.com — Case Study | Infinity Pillars</title>
        <meta name="description" content="Democratizing oncology education through empathetic UX: how Infinity Pillars designed XpertPatient's award-winning patient support platform." />
      </Helmet>

      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="pt-40 pb-24 md:pt-52 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-14">
          <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Success Blueprints
          </Link>
          <a
            href="https://xpertpatient.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="xp-visit-btn group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest rounded-full px-4 py-2 transition-all duration-300"
          >
            Visit live site
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: 'hsl(var(--xp-accent))' }}>
            <HeartHandshake className="w-3.5 h-3.5" />
            Case Study — Healthcare · Empathetic UX
          </div>
          <div className="xp-badge relative overflow-hidden inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white px-3 py-1.5 rounded-full" style={{ backgroundColor: 'hsl(var(--xp-amber))' }}>
            <Award className="w-3.5 h-3.5" />
            Stevie Award Winner
            <span className="xp-shine" />
          </div>
        </div>

        <SplitReveal
          text="Democratizing oncology education through empathetic UX."
          as="h1"
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-5xl"
        />

        <p className="mt-10 text-lg md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
          How do you turn complex clinical data into calm and clarity? A personalized intake wizard and side-by-side comparison tool minimized cognitive load for newly diagnosed individuals across 14 diagnostic centers.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border pt-10 max-w-3xl">
          {[
            { k: '14', v: 'Diagnostic centers' },
            { k: '0–4', v: 'Stage selector' },
            { k: 'AA', v: 'WCAG 2.1 compliance' },
            { k: '90%', v: 'Community supported' },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-2xl md:text-3xl font-bold tracking-tighter">{s.k}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Challenge ────────────────────────────────────────────────── */}
      <section className="py-28 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-xp-reveal className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--xp-accent))' }}>The Digital Challenge</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Clinical precision, delivered with calm.</h2>
          </div>
          <div data-xp-stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { t: 'Jargon Barrier', d: 'FDA staging, drug regimens, and trial eligibility overwhelm newly diagnosed users.' },
              { t: 'Compliance Under Stress', d: 'Strict WCAG 2.1 AA and ADA compliance for users under extreme cognitive and physical stress.' },
              { t: 'Third-Party Complexity', d: 'Integrating clinical trial matching APIs without adding friction to the experience.' },
            ].map((c) => (
              <div key={c.t} className="bg-background border border-border rounded-2xl p-8">
                <h3 className="text-xl font-bold tracking-tight mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Personalized Intake Wizard ───────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-xp-reveal className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--xp-accent))' }}>Solution 01</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Personalized Intake Wizard.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
              A 3-field selector instantly routes users to a tailored dashboard. Try it below.
            </p>
          </div>

          <div className="border border-border rounded-3xl p-8 md:p-12 bg-background">
            <AnimatePresence mode="wait">
              {!routed ? (
                <motion.div key={wizardStep} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.35 }}>
                  {wizardStep === 0 && (
                    <>
                      <h3 className="text-xl font-bold tracking-tight mb-6">What type of cancer?</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                        {CANCER_TYPES.map((t) => (
                          <button key={t} onClick={() => setCancerType(t)} className={`xp-type-btn px-4 py-3 text-sm font-medium ${cancerType === t ? 'is-selected' : ''}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {wizardStep === 1 && (
                    <>
                      <h3 className="text-xl font-bold tracking-tight mb-8">What stage, if known?</h3>
                      <div className="flex items-center justify-center gap-4">
                        {[0, 1, 2, 3, 4].map((n) => (
                          <button key={n} onClick={() => setStage(n)} className={`xp-stage-btn ${stage === n ? 'is-selected' : ''}`}>
                            {n}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  {wizardStep === 2 && (
                    <>
                      <h3 className="text-xl font-bold tracking-tight mb-8 text-center">Are you the patient or a caregiver?</h3>
                      <div className="flex justify-center">
                        <div className="xp-toggle-pill">
                          {['Patient', 'Caregiver'].map((r) => (
                            <button key={r} onClick={() => setRole(r)} className={role === r ? 'is-active' : ''}>{r}</button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === wizardStep ? 'hsl(var(--xp-accent))' : 'hsl(var(--border))' }} />
                      ))}
                    </div>
                    <button
                      onClick={advanceWizard}
                      disabled={!canAdvance}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-30 hover:opacity-70 transition-opacity"
                      style={{ color: 'hsl(var(--xp-accent))' }}
                    >
                      {wizardStep === 2 ? 'Route Me' : 'Continue'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="routed" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45 }} className="text-center py-6">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'hsl(var(--xp-mint) / 0.15)' }}>
                    <Check className="w-7 h-7" style={{ color: 'hsl(var(--xp-mint))' }} />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Dashboard ready</p>
                  <h3 className="text-2xl font-bold tracking-tight mb-6">
                    {cancerType} · Stage {stage} · {role}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                    Routed straight to the treatment pathways, comparison tools, and trial matches most relevant to this profile — no dead-end search results.
                  </p>
                  <button onClick={resetWizard} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                    Start over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Comparison Engine ────────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-xp-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--xp-accent))' }}>Solution 02</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Side-by-side comparison engine.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Synthesizes dense clinical protocols into simple visual cards — weighing trade-offs like oral vs. IV administration.
            </p>
          </div>

          <div data-xp-stagger className="xp-compare-card overflow-hidden">
            <div className="grid grid-cols-3 border-b border-border">
              <div className="p-5" />
              <div className="p-5 text-center border-l border-border">
                <span className="text-sm font-bold tracking-tight">Oral Therapy</span>
              </div>
              <div className="p-5 text-center border-l border-border">
                <span className="text-sm font-bold tracking-tight">IV Infusion</span>
              </div>
            </div>
            {COMPARISON_ROWS.map((row) => (
              <div key={row.label} className="grid grid-cols-3 border-b border-border last:border-b-0">
                <div className="p-5 text-sm font-medium text-muted-foreground">{row.label}</div>
                <div className="p-5 text-center text-sm border-l border-border">{row.oral}</div>
                <div className="p-5 text-center text-sm border-l border-border">{row.iv}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Antidote Match ───────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-xp-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--xp-accent))' }}>Solution 03</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Antidote Match API.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Converts complex eligibility checklists into a guided search tool for clinical trial matching.
            </p>
          </div>

          <div className="border border-border rounded-3xl p-8 md:p-10">
            <div className="space-y-4 mb-8">
              {ELIGIBILITY.map((item) => (
                <button key={item} onClick={() => toggleCheck(item)} className="flex items-center gap-4 w-full text-left group">
                  <span className={`xp-checkbox ${checked[item] ? 'is-checked' : ''}`}>
                    {checked[item] && <Check className="w-3.5 h-3.5 text-white" />}
                  </span>
                  <span className="text-sm group-hover:text-foreground text-foreground/80">{item}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setTrialsFound(true)}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-full text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'hsl(var(--xp-accent))' }}
            >
              <Search className="w-4 h-4" />
              Find Matching Trials ({checkedCount}/{ELIGIBILITY.length} criteria)
            </button>

            <AnimatePresence>
              {trialsFound && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="rounded-2xl p-6 flex items-center justify-between" style={{ backgroundColor: 'hsl(var(--xp-mint) / 0.08)' }}>
                    <div>
                      <p className="text-2xl font-bold tracking-tight" style={{ color: 'hsl(var(--xp-mint))' }}>
                        {Math.max(3, checkedCount * 4)} matching trials found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Illustrative preview of the Antidote Match integration flow.</p>
                    </div>
                    <button onClick={() => setTrialsFound(false)} className="text-muted-foreground hover:text-foreground">
                      <XIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Visual Identity ──────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-xp-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--xp-accent))' }}>Solution 04</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Calm, clinical confidence.</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              A trustworthy blue, a reassuring mint, and a gentle amber for encouragement — colors chosen to lower anxiety, not raise it.
            </p>
          </div>
          <div data-xp-stagger className="flex flex-wrap gap-6">
            {[
              { color: 'hsl(var(--xp-accent))', label: 'Trustworthy blue' },
              { color: 'hsl(var(--xp-mint))', label: 'Reassuring mint' },
              { color: 'hsl(var(--xp-amber))', label: 'Gentle amber' },
              { color: 'hsl(var(--border))', label: 'Hairline dividers' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full shrink-0 border border-border" style={{ backgroundColor: c.color }} />
                <span className="text-sm text-muted-foreground">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Outcomes ─────────────────────────────────────────────────── */}
      <section className="py-32 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-xp-reveal className="mb-14 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'hsl(var(--xp-accent))' }}>Measurable UX Outcomes</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">From jargon barrier to clarity.</h2>
          </div>
          <div data-xp-stagger className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[760px]">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="py-4 pr-6">Educational Module</th>
                  <th className="py-4 pr-6">Pre-Development Barrier</th>
                  <th className="py-4 pr-6">Design Innovation</th>
                  <th className="py-4">Measurable UX Outcome</th>
                </tr>
              </thead>
              <tbody>
                {OUTCOMES.map((row) => (
                  <tr key={row.mod} className="border-b border-border align-top">
                    <td className="py-6 pr-6 font-bold">{row.mod}</td>
                    <td className="py-6 pr-6 text-muted-foreground">{row.before}</td>
                    <td className="py-6 pr-6" style={{ color: 'hsl(var(--xp-accent))' }}>{row.after}</td>
                    <td className="py-6 text-foreground/80">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Big Stat ─────────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div data-xp-reveal className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            <ShieldCheck className="w-4 h-4" style={{ color: 'hsl(var(--xp-mint))' }} />
            WCAG 2.1 AA &amp; ADA Compliant
          </div>
          <AnimatedCounter value={90} suffix="%" className="text-7xl md:text-8xl font-bold tracking-tighter block" style={{ color: 'hsl(var(--xp-accent))' }} />
          <p className="text-xl text-muted-foreground mt-4">of the diagnosed cancer community supported by the redesigned platform.</p>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-40 text-center border-t border-border" style={{ backgroundColor: 'hsl(var(--xp-accent) / 0.06)' }}>
        <div data-xp-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">Transform complex data<br />into empathetic UX.</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            If you manage clinical platforms, hospital portals, or digital therapeutics tools, clarity is vital to patient outcomes.
          </p>
          <Link
            to="#booking"
            className="inline-flex items-center gap-3 font-bold uppercase tracking-widest text-sm px-10 py-6 rounded-full text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'hsl(var(--xp-accent))' }}
          >
            Book Audit Call
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <div className="mt-10">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group">
              More success blueprints
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default XpertPatientCaseStudy;
