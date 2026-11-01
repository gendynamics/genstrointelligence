import React from 'react';

const MONO = "'DM Mono', monospace";

const Quantum = () => {
  return (
    <div style={styles.page}>
      {/* Centered prose — matches the reference layout */}
      <section style={styles.prose} aria-label="Quantum security overview">
        <p style={styles.eyebrow}>QUANTUM SECURITY</p>
        <h1 style={styles.h1}>Resilience for the post-quantum era.</h1>
        <p style={styles.paragraph}>
          The quantum threat is no longer a distant horizon — it is a planning mandate.
          Genstro Intelligence provides enterprise organizations with quantum-readiness
          assessments, cryptographic agility frameworks, and post-quantum migration
          roadmaps. Our quantum security engineers architect the transition from
          vulnerable to unbreakable — protecting data in transit, at rest, and against
          harvest-now-decrypt-later attacks.
        </p>
      </section>

      {/* Full-bleed quantum starburst */}
      <section style={styles.mediaWrap} aria-label="Quantum visualization">
        <video
          style={styles.media}
          src="/users.m4"
          autoPlay
          muted
          loop
          playsInline
        />
      </section>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#020508',
    color: '#e8eef4',
    fontFamily: "'Manrope', sans-serif",
    paddingTop: '64px',
  },
  prose: {
    maxWidth: '980px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '4.5rem 2rem 4rem',
  },
  eyebrow: {
    fontFamily: MONO,
    fontSize: '0.66rem',
    letterSpacing: '0.34em',
    color: '#e8c076',
    margin: '0 0 1.8rem',
  },
  h1: {
    margin: '0 0 2rem',
    color: '#f4f7fa',
    fontSize: 'clamp(2.4rem, 4.6vw, 3.9rem)',
    lineHeight: 1.08,
    letterSpacing: '-0.02em',
    fontWeight: 800,
  },
  paragraph: {
    margin: 0,
    color: 'rgba(209, 213, 219, 0.7)',
    fontSize: 'clamp(1.05rem, 1.6vw, 1.35rem)',
    lineHeight: 1.75,
  },
  mediaWrap: {
    width: '100%',
  },
  media: {
    width: '100%',
    height: 'min(72vh, 680px)',
    objectFit: 'cover',
    display: 'block',
  },
};

export default Quantum;
