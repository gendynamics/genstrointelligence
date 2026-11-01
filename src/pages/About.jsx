import React from 'react';

const About = () => {
  return (
    <main className="page-shell about-page">
      <header className="page-header">
        <div className="brand-block">
          <span className="brand-mark">G</span>
          <span>
            GENSTRO
            <strong>INTELLIGENCE</strong>
          </span>
        </div>
        <nav className="page-nav" aria-label="About page navigation">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/quantum">Quantum</a>
          <a href="/about" className="is-active">About</a>
        </nav>
      </header>

      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-copy">
          <p className="eyebrow eyebrow-soft">
            <span className="eyebrow-dot" />
            The signal behind the shield
          </p>
          <h1 id="about-title">We build the intelligence layer behind enterprise trust.</h1>
          <p>
            Genstro Intelligence exists to make the most consequential security decisions visible,
            credible, and actionable before risk becomes disruption.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/#contact">
              Book a strategic briefing <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="/#platform">
              Explore the platform <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="blackhole-scene" aria-hidden="true">
          <div className="blackhole-wrap">
            <video
              className="blackhole-video"
              src="/img/blackhole_turbulence_animation.MP4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="blackhole-glow" />
            <div className="blackhole-rim" />
            <div className="blackhole-core" />
            <div className="blackhole-ring ring-one" />
            <div className="blackhole-ring ring-two" />
            <div className="blackhole-ring ring-three" />
            <div className="blackhole-dust">
              <span className="dust dust-1" />
              <span className="dust dust-2" />
              <span className="dust dust-3" />
              <span className="dust dust-4" />
              <span className="dust dust-5" />
              <span className="dust dust-6" />
              <span className="dust dust-7" />
              <span className="dust dust-8" />
            </div>
            <div className="star-field">
              <span className="star star-1" />
              <span className="star star-2" />
              <span className="star star-3" />
              <span className="star star-4" />
              <span className="star star-5" />
              <span className="star star-6" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <article className="stat-card">
          <span className="stat-number">01</span>
          <h3>AI-led security</h3>
          <p>Machine intelligence that turns noisy data into decisive action.</p>
        </article>
        <article className="stat-card">
          <span className="stat-number">02</span>
          <h3>Quantum-ready</h3>
          <p>Tomorrow’s risks require protection built for the next security era.</p>
        </article>
        <article className="stat-card">
          <span className="stat-number">03</span>
          <h3>Unified operations</h3>
          <p>Offense, defense, and leadership aligned around one operating picture.</p>
        </article>
      </section>

      <section className="about-kpis" aria-label="Leadership metrics">
        <article className="kpi-tile">
          <span className="kpi-label">Operational confidence</span>
          <strong>94.8%</strong>
          <p>Exposure visibility across the critical attack surface.</p>
        </article>
        <article className="kpi-tile">
          <span className="kpi-label">Decision velocity</span>
          <strong>−38%</strong>
          <p>Faster executive action before risk compounds.</p>
        </article>
        <article className="kpi-tile">
          <span className="kpi-label">Risk doctrine</span>
          <strong>24/7</strong>
          <p>Continuous operational coordination across teams.</p>
        </article>
      </section>

      <section className="about-quote-panel" aria-label="Executive positioning">
        <div className="quote-mark">“</div>
        <div className="quote-copy">
          <p className="eyebrow eyebrow-soft">Boardroom signal</p>
          <h3>
            The defining advantage is not more alerts. It is the capacity to see what matters,
            decide faster, and act with conviction under pressure.
          </h3>
        </div>
      </section>

      <section className="about-story">
        <div className="story-panel">
          <p className="eyebrow eyebrow-soft">Why we exist</p>
          <h2>Security is no longer a layer. It is the operating model.</h2>
        </div>
        <div className="story-panel story-panel-copy">
          <p>
            Born from the frontlines of cyber warfare, Genstro Intelligence builds the infrastructure
            enterprises trust when the margin for error is near zero. We unify AI, resilience,
            quantum-aware strategy, and real-world offense/defense operations so organizations can
            move with clarity under pressure.
          </p>
          <p>
            Our platform turns fragmented attack surface data into a sovereign operational view that
            leadership, engineering, and response teams can all act on — in real time.
          </p>
          <p>
            In other words, we do not treat cyber risk as a technical backlog. We frame it as a
            leadership discipline: one that determines whether the business can move with speed,
            trust, and strategic confidence.
          </p>
        </div>
      </section>
    </main>
  );
};

export default About;
