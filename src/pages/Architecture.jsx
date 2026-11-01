import React from 'react';
import '../styles/Architecture.css';

const architectureAreas = [
  {
    id: 'api-design',
    number: '01',
    title: 'API Design & Development',
    description: 'Build scalable, maintainable APIs with clear contracts, versioning strategies, and RESTful principles.',
    topics: ['RESTful Design', 'API Versioning', 'Contract Design', 'Rate Limiting', 'Error Handling'],
  },
  {
    id: 'testing-quality',
    number: '02',
    title: 'Testing & Quality Assurance',
    description: 'Implement comprehensive testing strategies from unit tests to end-to-end coverage with measurable quality gates.',
    topics: ['Unit Testing', 'Integration Testing', 'E2E Testing', 'Test Coverage', 'Quality Metrics'],
  },
  {
    id: 'devops-infrastructure',
    number: '03',
    title: 'DevOps & Infrastructure',
    description: 'Design automated deployment pipelines, containerization, and infrastructure-as-code patterns.',
    topics: ['CI/CD Pipelines', 'Containerization', 'Infrastructure as Code', 'Monitoring', 'Scaling'],
  },
  {
    id: 'performance',
    number: '04',
    title: 'Performance Optimization',
    description: 'Optimize application performance through caching strategies, bundling, and rendering techniques.',
    topics: ['Caching Strategies', 'Bundle Optimization', 'Rendering Performance', 'Load Testing', 'Metrics'],
  },
  {
    id: 'code-quality',
    number: '05',
    title: 'Code Quality & Maintainability',
    description: 'Establish patterns and practices that keep codebases clean, readable, and maintainable at scale.',
    topics: ['Design Patterns', 'Code Organization', 'Documentation', 'Code Reviews', 'Refactoring'],
  },
  {
    id: 'observability',
    number: '06',
    title: 'Logging & Observability',
    description: 'Implement comprehensive logging, error tracking, and observability for production systems.',
    topics: ['Structured Logging', 'Error Tracking', 'Distributed Tracing', 'Analytics', 'Debugging'],
  },
];

const principles = [
  ['Separation of Concerns', 'Clear boundaries between components, layers, and responsibilities.'],
  ['Single Responsibility', 'Each module should have one reason to change.'],
  ['Open/Closed Principle', 'Open for extension, closed for modification.'],
  ['Dependency Inversion', 'Depend on abstractions, not concrete implementations.'],
  ['DRY (Don\'t Repeat Yourself)', 'Eliminate redundancy through reusable abstractions.'],
  ['KISS (Keep It Simple)', 'Favor simplicity and clarity over complexity.'],
];

function Architecture() {
  return (
    <main id="top" className="architecture-page">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Genstro Intelligence home">
          <span className="brand-mark">G</span>
          <span>GENSTRO<br /><strong>INTELLIGENCE</strong></span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="#foundations">Foundations</a>
          <a href="#areas">Areas</a>
        </nav>
        <a className="header-cta" href="/#contact">Talk to an expert <span aria-hidden="true">↗</span></a>
      </header>

      <section className="hero-section" aria-labelledby="arch-hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Scalable Systems</p>
          <h1 id="arch-hero-title">Solid<br /><em>architecture</em><br />at scale.</h1>
          <p className="hero-lede">Build systems that grow with your needs. From API design to observability, we cover the patterns and practices that matter for sustainable software development.</p>
        </div>
        <div className="hero-visual" role="img" aria-label="Architecture visualization">
          <img src="/img/hero.jpg" alt="Architecture visualization" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      </section>

      <section className="proof-strip" aria-label="Architecture principles">
        <p className="proof-intro">Built on proven<br />design principles.</p>
        {principles.map(([title, description]) => (
          <article className="proof-point" key={title}>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section className="capabilities-section" id="areas" aria-labelledby="areas-title">
        <div className="section-heading">
          <p className="eyebrow">Comprehensive Coverage</p>
          <h2 id="areas-title">Architecture<br /><em>focus areas.</em></h2>
        </div>
        <div className="capability-list">
          {architectureAreas.map((area) => (
            <article className="capability" key={area.id}>
              <span className="section-number">{area.number}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <div className="topic-tags">
                {area.topics.map((topic) => (
                  <span key={topic} className="topic-tag">{topic}</span>
                ))}
              </div>
              <a href={`/architecture/${area.id}`} className="capability-arrow" aria-label={`Learn more about ${area.title}`}>↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="briefing-section" id="foundations" aria-labelledby="foundations-title">
        <div>
          <p className="eyebrow">Foundational Concepts</p>
          <h2 id="foundations-title">Why architecture<br /><em>matters.</em></h2>
        </div>
        <div className="briefing-copy">
          <p>Good architecture is invisible—it enables teams to move fast, systems to scale reliably, and codebases to remain maintainable as they grow. These principles and practices have been proven across thousands of projects and teams.</p>
          <a className="button button-light" href="/#contact">Explore implementation guides <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div className="footer-brand">
          <span className="brand-mark">G</span>
          <span>GENSTRO<br /><strong>INTELLIGENCE</strong></span>
        </div>
        <div className="footer-cta">
          <p>Ready to strengthen your<br /><em>architecture?</em></p>
          <a href="mailto:hello@genstrointelligence.com">hello@genstrointelligence.com ↗</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Genstro Intelligence</span>
          <span>Built for the moments that matter.</span>
          <span>Privacy / Security</span>
        </div>
      </footer>
    </main>
  );
}

export default Architecture;
