// src/pages/Home.jsx  
// Full cinematic door experience — portal burst → site reveal  

import React, { useState, useEffect } from 'react';

const Home = () => {
  const [phase, setPhase] = useState('door');      // 'door' | 'burst' | 'revealed'
  const [heroOpacity, setHeroOpacity] = useState(1);

  const handleOpen = () => {
    if (phase !== 'door') return;
    setPhase('burst');

    // Fade hero out
    setTimeout(() => setHeroOpacity(0), 100);

    // Reveal content
    setTimeout(() => {
      setPhase('revealed');
      // Signal Deliah that the door has been opened
      window.dispatchEvent(new CustomEvent('doorOpened'));
    }, 1200);
  };

  // Keyboard accessible
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter' && phase === 'door') handleOpen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  if (phase === 'revealed') {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#000',
        paddingTop: 100,
        animation: 'homeReveal 0.8s ease-out',
      }}>
        <style>{`
          @keyframes homeReveal {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px' }}>
          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            color: '#67e8f9',
            marginBottom: 24,
            fontFamily: 'Orbitron, sans-serif',
            lineHeight: 1.1,
          }}>
            The Door Is Open
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
            color: '#d1d5db',
            lineHeight: 1.7,
            maxWidth: 640,
            marginBottom: 64,
          }}>
            Genstro Intelligence is the portal to next-generation AI.
            Enter once — and the future expands infinitely.
          </p>

          {/* Service cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
            marginBottom: 80,
          }}>
            {[
              { title: 'Generative Intelligence', desc: 'Custom AI models that create, predict, and evolve in real time.' },
              { title: 'Strategic Insight', desc: 'AI-powered decision engines for leaders who refuse limits.' },
              { title: 'Portal Integration', desc: 'Seamless connection between human vision and machine reality.' },
            ].map((card) => (
              <div key={card.title} style={{
                background: 'rgba(24,24,27,0.7)',
                padding: 40,
                borderRadius: 24,
                border: '1px solid rgba(103,232,249,0.15)',
                transition: 'border-color 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#67e8f9'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(103,232,249,0.15)'}
              >
                <h3 style={{ color: '#67e8f9', fontSize: '1.4rem', marginBottom: 12, fontFamily: 'Orbitron, sans-serif' }}>
                  {card.title}
                </h3>
                <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Footer tagline */}
          <div style={{ textAlign: 'center', paddingBottom: 60, borderTop: '1px solid rgba(103,232,249,0.15)', paddingTop: 48 }}>
            <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#a5f3fc', fontWeight: 300, marginBottom: 24 }}>
              The expansion has begun.
            </p>
            <p style={{ color: 'rgba(103,232,249,0.4)', fontSize: '0.85rem' }}>
              © 2026 Genstro Intelligence
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      opacity: heroOpacity,
      transition: 'opacity 1s ease',
    }}>
      {/* Hero background image (spear) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.35,
      }} />
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 30% 40%, rgba(103,232,249,0.06) 0%, transparent 60%)',
      }} />

      {/* Portal burst flash */}
      {phase === 'burst' && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <style>{`
            @keyframes portalBurst {
              0% { transform: scale(0); opacity: 0.8; }
              70% { opacity: 0.4; }
              100% { transform: scale(4); opacity: 0; }
            }
          `}</style>
          <div style={{
            width: 384,
            height: 384,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(103,232,249,0.5) 0%, rgba(103,232,249,0.1) 60%, transparent 100%)',
            animation: 'portalBurst 1.4s ease-out forwards',
          }} />
        </div>
      )}

      {/* The Door */}
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        aria-label="Open the door to Genstro Intelligence"
        style={{
          width: 'min(85vw, 420px)',
          height: 'min(85vw, 420px)',
          borderRadius: '50%',
          border: '8px solid rgba(103,232,249,0.6)',
          background: 'radial-gradient(circle at 40% 35%, rgba(103,232,249,0.04) 0%, #000 70%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 60px rgba(103,232,249,0.25), inset 0 0 80px rgba(103,232,249,0.03)',
          transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
          position: 'relative',
          zIndex: 10,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.06)';
          e.currentTarget.style.boxShadow = '0 0 100px rgba(103,232,249,0.4), inset 0 0 100px rgba(103,232,249,0.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 0 60px rgba(103,232,249,0.25), inset 0 0 80px rgba(103,232,249,0.03)';
        }}
      >
        <div style={{
          width: 64, height: 3,
          background: '#67e8f9',
          borderRadius: 2,
          marginBottom: 20,
          opacity: 0.7,
        }} />
        <h1 style={{
          color: '#a5f3fc',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 900,
          letterSpacing: '0.2em',
          fontFamily: 'Orbitron, sans-serif',
          textAlign: 'center',
          margin: 0,
        }}>
          OPEN THE DOOR
        </h1>
        <p style={{
          color: 'rgba(103,232,249,0.6)',
          fontSize: 'clamp(0.75rem, 2vw, 1.1rem)',
          marginTop: 12,
          letterSpacing: '0.15em',
          fontFamily: 'Orbitron, sans-serif',
        }}>
          Genstro Intelligence
        </p>
      </div>

      {/* Bottom instruction */}
      <div style={{
        position: 'absolute',
        bottom: 48,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: 'rgba(103,232,249,0.5)',
        fontSize: '0.75rem',
        letterSpacing: '0.3em',
        fontFamily: 'Orbitron, sans-serif',
      }}>
        <div style={{ width: 32, height: 1, background: 'rgba(103,232,249,0.4)' }} />
        CLICK THE SPHERE TO ENTER
        <div style={{ width: 32, height: 1, background: 'rgba(103,232,249,0.4)' }} />
      </div>
    </div>
  );
};

export default Home;
