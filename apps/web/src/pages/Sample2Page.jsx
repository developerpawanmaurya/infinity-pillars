import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HorizontalBlinds from '../components/sample2/HorizontalBlinds.jsx';
import RandomGrid from '../components/sample2/RandomGrid.jsx';
import VerticalBlinds from '../components/sample2/VerticalBlinds.jsx';
import ColumnGrid from '../components/sample2/ColumnGrid.jsx';
import CustomTransition from '../components/sample2/CustomTransition.jsx';
import './Sample2.css';

const VARIANTS = [
  { id: 'horizontal', label: '1. Horizontal Blinds', Component: HorizontalBlinds },
  { id: 'random', label: '2. Random Grid', Component: RandomGrid },
  { id: 'vertical', label: '3. Vertical Blinds', Component: VerticalBlinds },
  { id: 'column', label: '4. Column Grid', Component: ColumnGrid },
  { id: 'custom', label: '5. Custom', Component: CustomTransition },
];

const Sample2Page = () => {
  const [activeId, setActiveId] = useState(VARIANTS[0].id);
  const active = VARIANTS.find((v) => v.id === activeId) ?? VARIANTS[0];
  const Active = active.Component;

  return (
    <div className="sample2-page">
      <Helmet>
        <title>Sample 2 — Scroll Mask Transitions | Infinity Pillars</title>
      </Helmet>

      <Link to="/" className="sample2-page__back">&larr; Back</Link>

      <nav className="sample2-switcher">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={v.id === activeId}
            onClick={() => setActiveId(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <Active key={active.id} />
    </div>
  );
};

export default Sample2Page;
