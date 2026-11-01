// src/pages/Home.jsx
// Home hero — matches the reference screenshot exactly:
// eyebrow dot + GENSTRO INTELLIGENCE, split headline (light/accent),
// orb visual with concentric rings + ENTER THE INTELLIGENCE LAYER caption,
// footer strip AI / SECURITY / FORESIGHT — 01 — 03

import React from 'react';
import { useNavigate } from 'react-router-dom';

const MONO = "'DM Mono', monospace";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.gridOverlay} aria-hidden="true" />
      <div style={styles.glow} aria-hidden="true" />

      <main style={styles.main}>
        <div style={styles.copy}>
          <p style={styles.eyebrow}>
            <span style={styles.eyebrowDot} />
            GENSTRO INTELLIGENCE
          </p>
          <h1 style={styles.h1}>
            <span style={styles.h1Light}>Security</span>
            <span style={styles.h1Light}>intelligence</span>
            <span style={styles.h1Accent}>for the</span>
            <span style={styles.h1Accent}>consequential.</span>
          </h1>
          <p style={styles.lede}>
            The operating picture for leaders who need to see exposure clearly,
            move with conviction, and build resilience that holds.
          </p>
        </div>

        <div style={styles.visual}>
          <div style={styles.orbStage}>
            <div style={styles.ringOuter} aria-hidden="true" />
            <div style={styles.ringInner} aria-hidden="true" />
            <div
              style={styles.orb}
              role="img"
              aria-label="Genstro intelligence sphere — half network, half energy"
            />
          </div>
          <button
            type="button"
            style={styles.orbCaption}
            onClick={() => navigate('/products')}
          >
            ENTER THE INTELLIGENCE LAYER <span aria-hidden="true">↗</span>
          </button>
        </div>
      </main>

      <footer style={styles.footer}>
        <span>AI / SECURITY / FORESIGHT</span>
        <span>01 — 03</span>
      </footer>

      <style>{`
        @media (max-width: 980px) {
          .home-main { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#04070b',
    color: '#e8eef4',
    fontFamily: "'Manrope', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: '64px',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(103,232,249,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,0.045) 1px, transparent 1px)',
    backgroundSize: '140px 140px',
    pointerEvents: 'none',
  },
  glow: {
    position: 'absolute',
    right: '-12%',
    top: '18%',
    width: '46rem',
    height: '46rem',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,224,240,0.12), rgba(56,224,240,0) 65%)',
    pointerEvents: 'none',
  },
  main: {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    alignItems: 'center',
    gap: '3rem',
    width: '100%',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '2rem 4rem',
    position: 'relative',
    zIndex: 1,
  },
  copy: {
    maxWidth: '640px',
  },
  eyebrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: MONO,
    fontSize: '0.68rem',
    letterSpacing: '0.34em',
    color: '#4fd8e8',
    margin: '0 0 2.2rem',
  },
  eyebrowDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#4fd8e8',
    boxShadow: '0 0 10px #4fd8e8',
    flexShrink: 0,
  },
  h1: {
    margin: 0,
    fontSize: 'clamp(3rem, 6.4vw, 6.2rem)',
    lineHeight: 1.02,
    letterSpacing: '-0.03em',
    fontWeight: 800,
  },
  h1Light: {
    display: 'block',
    color: '#f4f7fa',
  },
  h1Accent: {
    display: 'block',
    color: '#38e0f0',
  },
  lede: {
    marginTop: '2.4rem',
    maxWidth: '480px',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: 'rgba(209, 213, 219, 0.66)',
  },
  visual: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbStage: {
    position: 'relative',
    width: 'min(440px, 60vw)',
    height: 'min(440px, 60vw)',
    display: 'grid',
    placeItems: 'center',
  },
  ringOuter: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '1px solid rgba(103, 232, 249, 0.18)',
  },
  ringInner: {
    position: 'absolute',
    inset: '9%',
    borderRadius: '50%',
    border: '1px solid rgba(103, 232, 249, 0.3)',
  },
  orb: {
    width: '68%',
    height: '68%',
    borderRadius: '50%',
    backgroundImage: 'url(/img/hero.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow:
      '0 0 80px rgba(56, 224, 240, 0.35), inset 0 0 60px rgba(0, 0, 0, 0.55)',
  },
  orbCaption: {
    marginTop: '1.8rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: MONO,
    fontSize: '0.62rem',
    letterSpacing: '0.3em',
    color: 'rgba(165, 224, 235, 0.75)',
    padding: 0,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem 4rem',
    borderTop: '1px solid rgba(148, 163, 184, 0.14)',
    fontFamily: MONO,
    fontSize: '0.6rem',
    letterSpacing: '0.3em',
    color: 'rgba(148, 163, 184, 0.55)',
    position: 'relative',
    zIndex: 1,
  },
};

export default Home;
