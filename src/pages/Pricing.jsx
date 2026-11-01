import React from 'react';
import { useNavigate } from 'react-router-dom';
import { startCheckout } from '../utils/checkout';
import '../styles/Pricing.css';

const tiers = [
  { id: '01', name: 'Scout', price: '$499', period: '/ month', description: 'A focused foundation for organizations building their security practice.', cta: 'Start a conversation' },
  { id: '02', name: 'Sentinel', price: '$1,499', period: '/ month', description: 'A managed intelligence engagement for teams ready to deepen their operating picture.', cta: 'Start a conversation' },
  { id: '03', name: 'Operator', price: '$4,999', period: '/ month', description: 'A strategic security partnership shaped around sustained operational requirements.', cta: 'Discuss scope', featured: true },
  { id: '04', name: 'Quantum', price: 'Custom', period: '', description: 'A tailored enterprise engagement for high-consequence environments.', cta: 'Request a briefing' },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <main className="pricing-page">
      <section className="pricing-hero" aria-labelledby="pricing-title">
        <div><p className="pricing-kicker">Engagement models</p><h1 id="pricing-title">Security intelligence, sized to the decision.</h1></div>
        <p>Choose a starting point for your organization. Engagement scope and platform access are established through a confidential briefing.</p>
      </section>
      <section className="pricing-table" aria-label="Genstro engagement models">
        <div className="pricing-table-head"><span>Engagement</span><span>Investment</span><span>Starting point</span><span>Next step</span></div>
        {tiers.map((tier) => <article className={`pricing-row${tier.featured ? ' is-featured' : ''}`} key={tier.name}>
          <div className="pricing-tier"><span>{tier.id}{tier.featured && <b>Recommended</b>}</span><h2>{tier.name}</h2></div>
          <div className="pricing-price"><strong>{tier.price}</strong><small>{tier.period}</small></div>
          <p>{tier.description}</p>
          <button type="button" onClick={() => startCheckout(tier.name, navigate)}>{tier.cta} <span aria-hidden="true">↗</span></button>
        </article>)}
      </section>
      <section className="pricing-note"><p className="pricing-kicker">Confidential by design</p><p>Every engagement begins with a conversation about your operating context, priorities, and the decision you need to make next.</p></section>
    </main>
  );
};

export default Pricing;
