import React from 'react';

const featureCards = [
  {
    label: '01',
    title: 'Signal acquisition',
    text: 'Collect telemetry from experiments, adversarial simulations, and enterprise systems into one secure research stream.',
  },
  {
    label: '02',
    title: 'Hypothesis testing',
    text: 'Validate emerging attack paths and defense concepts in controlled experiments before operational rollout.',
  },
  {
    label: '03',
    title: 'Field iteration',
    text: 'Translate research into measurable detection, controls, and response workflows with proof in live environments.',
  },
];

const metrics = [
  { value: 'Frontier', label: 'cyber research agenda' },
  { value: 'Measured', label: 'operational proof' },
  { value: 'Live', label: 'field deployment' },
];

const RnD = () => {
  return (
    <div className="cyber-page" style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />

      <header className="cyber-header" style={styles.header}>
        <a href="/" style={styles.brand}>
          <span style={styles.brandMark}>G</span>
          <span>
            GENSTRO
            <strong style={styles.brandStrong}>INTELLIGENCE</strong>
          </span>
        </a>

        <nav className="cyber-nav" style={styles.nav} aria-label="R&D navigation">
          <a href="/" style={styles.navLink}>Home</a>
          <a href="/about" style={styles.navLink}>About</a>
          <a href="/products" style={styles.navLink}>Products</a>
          <a href="/research" style={styles.navLinkActive}>R&D</a>
        </nav>
      </header>

      <main style={styles.main}>
        <section className="cyber-hero" style={styles.hero}>
          <div style={styles.copy}>
            <p style={styles.eyebrow}>Cyber research & development</p>
            <h1 style={styles.h1}>Build the next generation of cyber defense before adversaries redefine the threat model.</h1>
            <p style={styles.lead}>
              Genstro’s research engine transforms emerging cyber signals into resilient controls, detection innovation, and operational strategies that can withstand real-world adversary pressure.
            </p>
            <div style={styles.actions}>
              <a href="#lab" style={styles.primaryButton}>Explore the lab</a>
              <a href="/" style={styles.secondaryLink}>Back to home</a>
            </div>
          </div>

          <div className="cyber-video-shell" style={styles.videoWrap} aria-label="Microscope research animation">
            <div style={styles.orbit} />
            <video className="cyber-video" src="/img/microscope_animation.mp4" autoPlay muted loop playsInline style={styles.video} />
          </div>
        </section>

        <section style={styles.metricRow}>
          {metrics.map((item) => (
            <div key={item.label} style={styles.metricCard}>
              <strong style={styles.metricValue}>{item.value}</strong>
              <span style={styles.metricLabel}>{item.label}</span>
            </div>
          ))}
        </section>

        <section style={styles.quotePanel}>
          <div style={styles.quoteMark}>“</div>
          <div style={styles.quoteBody}>
            <p style={styles.eyebrow}>Research signal</p>
            <h3 style={styles.quoteText}>
              The future of defense is not built from static playbooks. It is built where uncertainty first appears, tested under adversarial pressure, and translated into operational truth.
            </h3>
          </div>
        </section>

        <section style={styles.featureGrid}>
          {featureCards.map((card) => (
            <article key={card.label} style={styles.card}>
              <span style={styles.cardLabel}>{card.label}</span>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardText}>{card.text}</p>
            </article>
          ))}
        </section>

        <section id="lab" style={styles.bottomPanel}>
          <div>
            <p style={styles.eyebrow}>The Genstro lab</p>
            <h2 style={styles.h2}>The next frontier of defense begins where uncertainty is first observed.</h2>
          </div>
          <p style={styles.bottomText}>
            We turn disruptive security signals into resilient systems, tested methods, and strategic advantages that enterprises can operationalize with confidence.
          </p>
        </section>
      </main>
      <style>{`
        .cyber-page * { box-sizing: border-box; }
        .cyber-page .cyber-video-shell {
          width: 100%;
          position: relative;
          isolation: isolate;
          transform: perspective(1200px) rotateX(2deg);
        }
        .cyber-page .cyber-video-shell::before {
          content: "";
          position: absolute;
          inset: 5% 7% -3% 7%;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(168, 162, 255, 0.18), rgba(168, 162, 255, 0) 64%);
          filter: blur(22px);
          z-index: -1;
        }
        .cyber-page .cyber-video {
          width: 100%;
          height: min(60vw, 560px);
          max-height: 560px;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          transform: translateY(-4px) scale(1.02);
          animation: cyberPulseResearch 7s ease-in-out infinite alternate;
        }
        @keyframes cyberPulseResearch {
          0% { box-shadow: 0 22px 60px rgba(73, 82, 163, 0.24); }
          100% { box-shadow: 0 30px 90px rgba(111, 120, 255, 0.34); }
        }
        @media (max-width: 980px) {
          .cyber-page .cyber-hero { grid-template-columns: 1fr; }
          .cyber-page .cyber-video-shell { max-width: 760px; margin: 0 auto; }
          .cyber-page .cyber-video { height: min(72vw, 420px); }
        }
        @media (max-width: 640px) {
          .cyber-page .cyber-header { padding-left: 1rem; padding-right: 1rem; }
          .cyber-page .cyber-nav { gap: 0.75rem 1rem; }
          .cyber-page .cyber-video { height: clamp(220px, 52vw, 320px); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: 'radial-gradient(circle at top, rgba(87, 65, 191, 0.2), #070b13 45%)', color: '#f2f4ff', fontFamily: 'Inter, Arial, sans-serif', position: 'relative', overflow: 'hidden' },
  glowA: { position: 'absolute', top: '8%', right: '10%', width: '25rem', height: '25rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 162, 255, 0.18), rgba(168, 162, 255, 0) 70%)', filter: 'blur(18px)' },
  glowB: { position: 'absolute', bottom: '10%', left: '8%', width: '18rem', height: '18rem', borderRadius: '50%', background: 'radial-gradient(circle, rgba(95, 112, 255, 0.12), rgba(95, 112, 255, 0) 70%)', filter: 'blur(18px)' },
  header: { maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 },
  brand: { display: 'inline-flex', alignItems: 'center', gap: '0.8rem', color: '#f2f4ff', textDecoration: 'none', fontWeight: 700, letterSpacing: '0.12em', fontSize: '0.82rem' },
  brandMark: { width: '2.4rem', height: '2.4rem', display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, #a9a5ff, #5d7cff)', color: '#050d1c', fontWeight: 800 },
  brandStrong: { display: 'block', fontSize: '0.7rem', letterSpacing: '0.18em' },
  nav: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  navLink: { color: '#edf0ff', textDecoration: 'none', opacity: 0.8 },
  navLinkActive: { color: '#edf0ff', textDecoration: 'none', fontWeight: 700 },
  main: { maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem 5rem', position: 'relative', zIndex: 1 },
  hero: { display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '2rem', alignItems: 'center', marginTop: '0.5rem' },
  copy: { paddingRight: '0.8rem' },
  eyebrow: { color: '#b6b6ff', letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: '0.8rem', margin: '0 0 1rem' },
  h1: { fontSize: 'clamp(2.9rem, 5vw, 5.5rem)', lineHeight: 1.06, margin: '0 0 1rem', maxWidth: '680px' },
  lead: { fontSize: '1.15rem', lineHeight: 1.8, color: 'rgba(242,244,255,0.8)', maxWidth: '560px' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' },
  primaryButton: { background: 'linear-gradient(135deg, #c6c3ff, #8aa7ff)', color: '#0a1223', textDecoration: 'none', padding: '0.9rem 1.3rem', borderRadius: '999px', fontWeight: 700 },
  secondaryLink: { color: '#edf0ff', textDecoration: 'none', padding: '0.9rem 1.2rem' },
  videoWrap: { position: 'relative', display: 'flex', justifyContent: 'center', padding: '0.35rem 0.2rem 0.5rem', filter: 'drop-shadow(0 28px 60px rgba(72, 82, 180, 0.2))' },
  orbit: { position: 'absolute', inset: '10% 16%', border: '1px solid rgba(147, 165, 255, 0.18)', borderRadius: '50%', boxShadow: '0 0 60px rgba(89, 106, 255, 0.1)', animation: 'cyberOrbitResearch 10s linear infinite' },
  video: { width: '100%', height: '560px', objectFit: 'cover', borderRadius: 0, border: 'none', boxShadow: 'none', background: 'transparent', filter: 'saturate(1.18) contrast(1.08) drop-shadow(0 24px 60px rgba(84, 92, 180, 0.4))' },
  metricRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', margin: '3rem 0', borderTop: '1px solid rgba(142, 140, 255, 0.14)', paddingTop: '2rem' },
  metricCard: { background: 'transparent', border: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  metricValue: { fontSize: '2rem', fontWeight: 700, color: '#b6b6ff' },
  metricLabel: { color: 'rgba(242,244,255,0.72)', textTransform: 'lowercase' },
  quotePanel: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.25rem', alignItems: 'center', background: 'transparent', border: 'none', padding: '2rem 0', margin: '2rem 0 1.25rem', borderTop: '1px solid rgba(142, 140, 255, 0.12)' },
  quoteMark: { fontSize: 'clamp(4rem, 5vw, 6rem)', color: 'rgba(182, 182, 255, 0.8)', lineHeight: 1, fontWeight: 700 },
  quoteBody: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  quoteText: { margin: 0, fontSize: 'clamp(1.25rem, 2vw, 2.2rem)', lineHeight: 1.3, letterSpacing: '-0.05em' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem', marginTop: '2.5rem', borderTop: '1px solid rgba(142, 140, 255, 0.1)', paddingTop: '2.5rem' },
  card: { border: 'none', background: 'transparent', padding: 0 },
  cardLabel: { display: 'inline-block', fontSize: '0.72rem', letterSpacing: '0.18em', color: '#b7b8ff', marginBottom: '1rem' },
  cardTitle: { margin: '0 0 0.75rem', fontSize: '1.5rem' },
  cardText: { margin: 0, lineHeight: 1.7, color: 'rgba(242,244,255,0.78)' },
  bottomPanel: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', background: 'transparent', border: 'none', borderTop: '1px solid rgba(142, 140, 255, 0.14)', padding: '3rem 0 0', marginTop: '3rem' },
  h2: { margin: 0, fontSize: 'clamp(2rem, 3vw, 3rem)', lineHeight: 1.2 },
  bottomText: { margin: 0, color: 'rgba(242,244,255,0.8)', lineHeight: 1.8, maxWidth: '620px', justifySelf: 'end' },
};

export default RnD;
