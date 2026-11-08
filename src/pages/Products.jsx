import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Products.css';

const products = [
  { id: '01', name: 'Genstro SIEM', tag: 'Detection platform', headline: 'See the signal before it becomes impact.', color: '#69e0ff' },
  { id: '02', name: 'Redstrike', tag: 'Offensive toolkit', headline: 'Find the pressure points before they find you.', color: '#e98b7c' },
  { id: '03', name: 'Shieldwall', tag: 'Endpoint protection', headline: 'Keep the edge of your operation intact.', color: '#a6d5c0' },
  { id: '04', name: 'Quantum Vault', tag: 'Encryption suite', headline: 'Protect what must remain private.', color: '#d8b16c' },
  { id: '05', name: 'Qminds', tag: 'AI security analyst', headline: 'Turn complexity into a clear next move.', color: '#8ea6be' },
  { id: '06', name: 'Purplenet', tag: 'Validation engine', headline: 'Make confidence something you can test.', color: '#b3c2d6' },
];

const Products = () => {
  const navigate = useNavigate();

  return (
    <main className="products-page">
      <section className="products-hero" aria-labelledby="products-title">
        <div>
          <p className="products-eyebrow">Genstro platform portfolio</p>
          <h1 id="products-title">Security systems for the decisions that cannot wait.</h1>
        </div>
        <p className="products-intro">A connected portfolio for intelligence, validation, resilience, and response. Each system stands on its own. Together, they create a clearer operating picture.</p>
      </section>

      <section className="products-index" aria-label="Genstro products">
        <div className="products-index-header"><span>Platform systems</span><span>Confidential portfolio</span></div>
        <div className="product-list">
          {products.map((product) => (
            <article className="product-row" key={product.name} style={{ '--product-accent': product.color }}>
              <div className="product-number">{product.id}</div>
              <div className="product-name"><span>{product.tag}</span><h2>{product.name}</h2></div>
              <div className="product-summary"><p>{product.headline}</p><span>Capability details are shared through a confidential briefing.</span></div>
              <button type="button" onClick={() => navigate(`/contact?product=${encodeURIComponent(product.name)}`)} aria-label={`Request a ${product.name} briefing`}><span>Request briefing</span><b aria-hidden="true">↗</b></button>
            </article>
          ))}
        </div>
      </section>

      <section className="products-closing" aria-labelledby="portfolio-title">
        <p className="products-eyebrow">One operating picture</p>
        <h2 id="portfolio-title">Build the right intelligence layer for the risk in front of you.</h2>
        <button type="button" onClick={() => navigate('/contact')}>Talk to a specialist <span aria-hidden="true">↗</span></button>
      </section>
    </main>
  );
};

export default Products;
