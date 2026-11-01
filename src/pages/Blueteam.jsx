import React from 'react';

const MONO = "'DM Mono', monospace";

const services = [
  {
    label: '01 / DETECT',
    title: 'Threat Detection',
    text: 'Continuous detection engineering across identity, endpoint, cloud, and network telemetry — tuned to surface real signal before it becomes impact.',
  },
  {
    label: '02 / RESPOND',
    title: 'Incident Response',
    text: 'Measured containment and coordinated response workflows that shrink dwell time, escalate with context, and keep the business moving.',
  },
  {
    label: '03 / MONITOR',
    title: 'Security Monitoring',
    text: '24/7 SOC visibility with adaptive threat scoring, threat hunting, and automated triage built for live defense operations.',
  },
];

const Blueteam = () => {
  return (
    <div style={styles.page}>
      {/* Full-bleed live defense view */}
      <section style={styles.hero} aria-label="Blue team live defense view">
        <video
          style={styles.heroMedia}
          src="/img/blue.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div style={styles.heroShade} aria-hidden="true" />
        <p style={styles.caption}>BLUE TEAM / LIVE DEFENSE VIEW</p>
      </section>

      {/* Service columns */}
      <main style={styles.main}>
        <section style={styles.services} aria-label="Blue team services">
          {services.map((service) => (
            <article key={service.title} style={styles.card}>
              <span style={styles.cardLabel}>{service.label}</span>
              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardText}>{service.text}</p>
            </article>
          ))}
        </section>
      </main>

      <style>{`
        @media (max-width: 900px) {
          .blueteam-services { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#020609',
    color: '#e8eef4',
    fontFamily: "'Manrope', sans-serif",
    paddingTop: '64px',
  },
  hero: {
    position: 'relative',
    width: '100%',
    height: 'min(72vh, 760px)',
    overflow: 'hidden',
  },
  heroMedia: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  heroShade: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(to top, rgba(2,6,9,0.75) 0%, rgba(2,6,9,0.1) 45%, rgba(2,6,9,0.35) 100%)',
    pointerEvents: 'none',
  },
  caption: {
    position: 'absolute',
    left: '2.5rem',
    bottom: '1.8rem',
    margin: 0,
    fontFamily: MONO,
    fontSize: '0.66rem',
    letterSpacing: '0.32em',
    color: '#67e8f9',
    textShadow: '0 0 12px rgba(103, 232, 249, 0.45)',
  },
  main: {
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '3.5rem 2.5rem 5rem',
  },
  services: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '3rem',
  },
  card: {},
  cardLabel: {
    fontFamily: MONO,
    fontSize: '0.62rem',
    letterSpacing: '0.3em',
    color: '#67e8f9',
  },
  cardTitle: {
    margin: '0.9rem 0 0.9rem',
    fontSize: 'clamp(1.6rem, 2.4vw, 2.2rem)',
    fontWeight: 650,
    letterSpacing: '-0.01em',
    color: '#eef3f7',
  },
  cardText: {
    margin: 0,
    maxWidth: '420px',
    fontSize: '0.95rem',
    lineHeight: 1.7,
    color: 'rgba(209, 213, 219, 0.62)',
  },
};

export default Blueteam;
