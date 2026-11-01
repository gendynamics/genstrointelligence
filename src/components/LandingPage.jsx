import React from 'react';

function LandingPage({
  eyebrow,
  title,
  description,
  media = { video: null, image: null },
  accent = '#69e0ff',
  accentSecondary = '#c6f0ff',
  metrics = [],
  pillars = [],
  cta = { primary: 'Book a strategic briefing', secondary: { label: 'Back to home', href: '/' } },
  closing = { eyebrow: 'Executive signal', headline: '', text: '' },
}) {
  return (
    <main
      className="landing-page"
      style={{ '--lp-accent': accent, '--lp-accent-secondary': accentSecondary }}
    >
      <div className="lp-backdrop" />
      <div className="lp-grain" aria-hidden="true" />
      <div className="lp-glow" />

      <header className="lp-header">
        <a className="lp-brand" href="/" aria-label="Genstro Intelligence home">
          <span className="lp-brand-mark">G</span>
          <span className="lp-brand-copy">
            <span>GENSTRO</span>
            <small>INTELLIGENCE GROUP</small>
          </span>
        </a>

        <nav className="lp-nav" aria-label="Section navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/ai">AI</a>
          <a href="/architecture">Architecture</a>
        </nav>

        <a className="lp-ghost" href="#briefing">{cta.primary}</a>
      </header>

      <section className="lp-hero" aria-labelledby="lp-title">
        <div className="lp-hero-copy">
          <p className="lp-eyebrow">{eyebrow}</p>
          <h1 id="lp-title">{title}</h1>
          <p className="lp-lede">{description}</p>

          <div className="lp-cta-row">
            <a className="lp-primary" href="#briefing">{cta.primary}</a>
            <a className="lp-text-link" href={cta.secondary.href}>
              {cta.secondary.label}
            </a>
          </div>
        </div>

        <div className="lp-visual" role="img" aria-label={`${eyebrow} visual`}>
          <div className="lp-visual-shell">
            <div className="lp-media-layer" aria-hidden="true">
              {media.video && (
                <video
                  className="lp-video"
                  src={media.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              {media.image && (
                <img className="lp-image" src={media.image} alt="" />
              )}
            </div>
            <div className="lp-halo" />
            <div className="lp-core-rim lp-rim-outer" />
            <div className="lp-core-rim lp-rim-inner" />
            <div className="lp-visual-core">
              <span>G</span>
            </div>
            <div className="lp-pulse-ring lp-ring-a" />
            <div className="lp-pulse-ring lp-ring-b" />
          </div>
        </div>
      </section>

      {metrics.length > 0 && (
        <div className="lp-metrics" aria-label="Key metrics">
          {metrics.map((item) => (
            <div className="lp-metric" key={item.label}>
              <span className="lp-metric-line" />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {pillars.length > 0 && (
        <section className="lp-pillars" aria-labelledby="lp-pillars-title">
          <div className="lp-section-head">
            <p className="lp-eyebrow-alt" id="lp-pillars-title">
              The Genstro advantage
            </p>
            <h2>Built for leaders who need clarity under pressure.</h2>
          </div>

          <div className="lp-pillar-grid">
            {pillars.map((pillar) => (
              <article className="lp-pillar-card" key={pillar.title}>
                <span className="lp-pillar-label">{pillar.label}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="lp-closing" id="briefing" aria-label="Strategic briefing">
        <div>
          <p className="lp-eyebrow-alt">{closing.eyebrow}</p>
          <h3>{closing.headline}</h3>
        </div>
        <p>{closing.text}</p>
      </section>

      <footer className="lp-footer">
        <p>GENSTRO INTELLIGENCE GROUP</p>
        <small>© 2026 Genstro Intelligence. All rights reserved.</small>
      </footer>
    </main>
  );
}

export default LandingPage;
