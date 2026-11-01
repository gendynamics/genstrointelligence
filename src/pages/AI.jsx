import React, { useState, useEffect } from 'react';

const AI = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const generateNodes = () => {
      const nextNodes = [];
      for (let i = 0; i < 18; i += 1) {
        nextNodes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 3,
          opacity: Math.random() * 0.6 + 0.3,
        });
      }
      setNodes(nextNodes);
    };

    generateNodes();
    const interval = setInterval(generateNodes, 4000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: 'Threat intelligence',
      text: 'Machine learning models trained on global threat data to predict, classify, and neutralize emerging attack vectors before they materialize.',
    },
    {
      title: 'Behavioral analysis',
      text: 'Deep learning algorithms model normal network behavior and isolate signals that indicate compromise, drift, or insider risk.',
    },
    {
      title: 'Autonomous response',
      text: 'AI orchestrates containment, remediation, and policy adaptation in real time so teams respond faster than the threat evolves.',
    },
    {
      title: 'Natural language security',
      text: 'NLP-powered analyst workflows convert noisy logs, chatter, and operational context into immediate executive meaning.',
    },
  ];

  return (
    <main className="page-shell ai-page">
      <header className="page-header">
        <div className="brand-block">
          <span className="brand-mark">G</span>
          <span>
            GENSTRO
            <strong>INTELLIGENCE</strong>
          </span>
        </div>
        <nav className="page-nav" aria-label="AI page navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/products">Products</a>
          <a href="/ai" className="is-active">AI</a>
        </nav>
      </header>

      <section className="ai-hero" aria-labelledby="ai-title">
        <div className="ai-copy">
          <p className="eyebrow eyebrow-soft">
            <span className="eyebrow-dot" />
            Intelligence that moves at machine speed
          </p>
          <h1 id="ai-title">The decision engine behind resilient operations.</h1>
          <p>
            Genstro blends signal fusion, autonomous logic, and human expertise to turn fragmented
            security data into confident action in the moments that matter most.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/#contact">
              Request an executive briefing <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="/products">
              Explore the platform <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="ai-visual" aria-label="Neural intelligence visualization">
          <div className="ai-glow" />
          <div className="ai-ring ai-ring-one" />
          <div className="ai-ring ai-ring-two" />
          <div className="ai-ring ai-ring-three" />
          {nodes.map((node) => (
            <span
              key={node.id}
              className="ai-node"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: `${node.size}px`,
                height: `${node.size}px`,
                opacity: node.opacity,
              }}
            />
          ))}
          <div className="ai-core">
            <span>G</span>
          </div>
        </div>
      </section>

      <section className="ai-grid" aria-label="AI capability overview">
        {cards.map((card) => (
          <article className="ai-card" key={card.title}>
            <span className="section-number">0{cards.indexOf(card) + 1}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </section>

      <section className="ai-facts">
        <div className="fact-panel fact-panel-large">
          <p className="eyebrow eyebrow-soft">Operational impact</p>
          <h2>Signal quality is the difference between noise and advantage.</h2>
        </div>
        <div className="fact-panel">
          <span className="stat-score">94.8%</span>
          <p>Exposure visibility achieved through fused security and business context.</p>
        </div>
      </section>
    </main>
  );
};

export default AI;
