import React from 'react';

const pillars = [
  {
    label: '01',
    title: 'Detection validation',
    text: 'Run controlled adversary techniques against your live controls and measure exactly which detections fire, which fail, and why.',
  },
  {
    label: '02',
    title: 'Coverage intelligence',
    text: 'Map defensive coverage against real attack behavior so gaps become prioritized engineering work, not audit findings.',
  },
  {
    label: '03',
    title: 'Unified operations',
    text: 'Fuse offensive insight and defensive engineering into one continuous loop that hardens the enterprise every cycle.',
  },
];

const metrics = [
  { value: 'Unified', label: 'attack and defense loop' },
  { value: 'Measured', label: 'detection coverage score' },
  { value: 'Continuous', label: 'validation cadence' },
];

const PurpleTeam = () => {
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

        <nav className="cyber-nav" style={styles.nav} aria-label="Purple team navigation">
          <a href="/" style={styles.navLink}>Home</a>
          <a href="/about" style={styles.navLink}>About</a>
          <a href="/products" style={styles.navLink}>Products</a>
          <a href="/research" style={styles.navLink}>Research</a>
        </nav>
      </header>

      <main style={styles.main}>
        <section className="cyber-hero" style={styles.hero}>
          <div style={styles.copy}>
            <p style={styles.eyebrow}>Purple team cyber validation</p>
            <h1 style={styles.h1}>One loop where offense proves defense — and defense sharpens offense.</h1>
            <p style={styles.lead}>
              Genstro’s purple team program synchronizes adversary emulation with detection engineering, validating your controls
              against real attack behavior and converting every gap into hardened coverage.
            </p>
            <div style={styles.actions}>
              <a href="#convergence" style={styles.primaryButton}>See the loop</a>
              <a href="/" style={styles.secondaryLink}>Back to home</a>
            </div>
          </div>

          <div className="cyber-video-shell" style={styles.videoWrap}>
            <div style={styles.ring} />
            <video
              className="cyber-video purple-dome"
              src="/img/purple.Mp4"
              autoPlay
              muted
              loop
              playsInline
              style={{ ...styles.video, objectFit: 'cover' }}
              aria-label="Purple Team convergence animation"
            />
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
            <p style={styles.eyebrow}>Convergence signal</p>
            <h3 style={styles.quoteText}>
              Defenses you have never tested against a real adversary are assumptions. We turn assumptions into evidence.
            </h3>
          </div>
        </section>

        <section style={styles.featureGrid}>
          {pillars.map((pillar) => (
            <article key={pillar.title} style={styles.card}>
              <span style={styles.cardLabel}>{pillar.label}</span>
              <h3 style={styles.cardTitle}>{pillar.title}</h3>
              <p style={styles.cardText}>{pillar.text}</p>
            </article>
          ))}
        </section>

        <section id="convergence" style={styles.bottomPanel}>
          <div>
            <p style={styles.eyebrow}>Validation intelligence</p>
            <h2 style={styles.h2}>The strongest posture is the one that has already survived the attack.</h2>
          </div>
          <p style={styles.bottomText}>
            Every engagement closes the loop: simulate the threat, measure the response, engineer the fix, and prove the coverage holds.
          </p>
        </section>
      </main>

      <style>{`
        .cyber-page * { box-sizing: border-box; }
        @keyframes purpleReveal {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .cyber-page .purple-dome {
          animation: purpleReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) both,
                     cyberPulsePurple 7s ease-in-out 1.2s infinite alternate;
        }
        .cyber-page .cyber-video-shell {
          position: relative;
        }
        .cyber-page .cyber-video-shell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(168, 85, 247, 0.25), transparent 55%);
          pointer-events: none;
          z-index: 2;
        }
        .cyber-page .cyber-video {
          width: 100%;
          height: min(60vw, 520px);
          max-height: 520px;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          display: block;
        }
        @keyframes cyberPulsePurple {
          from { transform: scale(1); filter: saturate(1); }
          to { transform: scale(1.04); filter: saturate(1.2); }
        }
        @keyframes cyberOrbitPurple {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
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
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, rgba(168, 85, 247, 0.1), transparent 34%), linear-gradient(180deg, #0a0312 0%, #050208 100%)',
    color: '#f0e8ff',
    paddingBottom: '5rem',
    overflow: 'hidden',
    position: 'relative',
  },
  glowA: {
    position: 'absolute',
    top: '-10%',
    right: '-8%',
    width: '42vw',
    height: '42vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18), transparent 65%)',
    pointerEvents: 'none',
  },
  glowB: {
    position: 'absolute',
    bottom: '-14%',
    left: '-10%',
    width: '46vw',
    height: '46vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(192, 132, 252, 0.12), transparent 65%)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '1.75rem 2rem',
    position: 'relative',
    zIndex: 3,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#f0e8ff',
    textDecoration: 'none',
    letterSpacing: '0.14em',
    fontSize: '0.82rem',
    fontWeight: 600,
  },
  brandMark: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(109, 40, 217, 0.9))',
    color: '#fff',
    fontWeight: 800,
    boxShadow: '0 0 24px rgba(168, 85, 247, 0.45)',
  },
  brandStrong: { display: 'block', fontSize: '0.62rem', color: 'rgba(240, 232, 255, 0.6)', letterSpacing: '0.3em' },
  nav: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  navLink: { color: 'rgba(240, 232, 255, 0.72)', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.06em' },
  main: { maxWidth: '1240px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 2 },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: '3rem',
    alignItems: 'center',
    padding: '3rem 0 4rem',
  },
  copy: { maxWidth: '620px' },
  eyebrow: {
    color: '#c084fc',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    fontSize: '0.72rem',
    fontWeight: 700,
    marginBottom: '1.1rem',
  },
  h1: {
    fontSize: 'clamp(2.4rem, 5vw, 4rem)',
    lineHeight: 1.02,
    marginBottom: '1.4rem',
    letterSpacing: '-0.02em',
  },
  lead: { fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(240, 232, 255, 0.78)', marginBottom: '2rem' },
  actions: { display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' },
  primaryButton: {
    padding: '0.9rem 1.8rem',
    borderRadius: '999px',
    background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    boxShadow: '0 12px 40px rgba(168, 85, 247, 0.35)',
  },
  secondaryLink: { color: 'rgba(240, 232, 255, 0.7)', textDecoration: 'none', fontSize: '0.9rem' },
  videoWrap: { position: 'relative' },
  ring: {
    position: 'absolute',
    inset: '8% 14%',
    border: '1px solid rgba(192, 132, 252, 0.22)',
    borderRadius: '50%',
    boxShadow: '0 0 60px rgba(109, 40, 217, 0.15)',
    animation: 'cyberOrbitPurple 12s linear infinite',
    zIndex: 3,
    pointerEvents: 'none',
  },
  video: { borderRadius: 0, border: 'none', boxShadow: 'none', background: 'transparent', filter: 'drop-shadow(0 24px 60px rgba(109, 40, 217, 0.5))' },
  metricRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '2rem',
    marginBottom: '3.5rem',
    borderTop: '1px solid rgba(168, 85, 247, 0.16)',
    paddingTop: '2rem',
  },
  metricCard: {
    padding: 0,
    background: 'transparent',
    border: 'none',
  },
  metricValue: { display: 'block', fontSize: '1.6rem', color: '#d8b4fe', marginBottom: '0.35rem' },
  metricLabel: { fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(240, 232, 255, 0.6)' },
  quotePanel: {
    display: 'flex',
    gap: '2rem',
    padding: '2.5rem 0',
    background: 'transparent',
    border: 'none',
    borderTop: '1px solid rgba(168, 85, 247, 0.14)',
    marginBottom: '3.5rem',
  },
  quoteMark: { fontSize: '4rem', lineHeight: 1, color: 'rgba(192, 132, 252, 0.4)', fontFamily: 'Georgia, serif' },
  quoteBody: { maxWidth: '820px' },
  quoteText: { fontSize: 'clamp(1.3rem, 2.4vw, 1.9rem)', lineHeight: 1.35, fontWeight: 600, margin: 0 },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2.5rem',
    marginBottom: '3.5rem',
    borderTop: '1px solid rgba(168, 85, 247, 0.12)',
    paddingTop: '2.5rem',
  },
  card: {
    padding: 0,
    background: 'transparent',
    border: 'none',
  },
  cardLabel: { display: 'block', color: '#c084fc', fontSize: '0.75rem', letterSpacing: '0.2em', marginBottom: '0.9rem' },
  cardTitle: { fontSize: '1.25rem', marginBottom: '0.7rem', color: '#fff' },
  cardText: { fontSize: '0.92rem', lineHeight: 1.7, color: 'rgba(240, 232, 255, 0.72)', margin: 0 },
  bottomPanel: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '2.5rem',
    alignItems: 'center',
    padding: '3rem 0 0',
    background: 'transparent',
    border: 'none',
    borderTop: '1px solid rgba(168, 85, 247, 0.16)',
  },
  h2: { fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.01em' },
  bottomText: { fontSize: '1rem', lineHeight: 1.8, color: 'rgba(240, 232, 255, 0.78)', margin: 0 },
};

export default PurpleTeam;
