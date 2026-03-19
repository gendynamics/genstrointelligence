import React, { useState, useEffect } from 'react';

const Quantum = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate quantum particle visualization
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#67e8f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem 2rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Quantum particle visualization */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}>
        {particles.map(particle => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: '#67e8f9',
              borderRadius: '50%',
              opacity: particle.opacity,
              animation: 'quantumPulse 2s infinite ease-in-out',
              boxShadow: '0 0 10px #67e8f9'
            }}
          />
        ))}
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: '3rem',
        zIndex: 1,
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          textShadow: '0 0 30px #67e8f9'
        }}>
          Quantum Intelligence
        </h1>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '700px',
          margin: '0 auto',
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Every encryption standard deployed today has an expiration date. Genstro Intelligence
          provides enterprise organizations with quantum-readiness assessments, cryptographic
          agility frameworks, and post-quantum migration roadmaps. Our quantum security engineers
          architect the transition from vulnerable to unbreakable — protecting data in transit,
          at rest, and against harvest-now-decrypt-later attacks.
        </p>
      </div>

      <img
        src="/img/quantumG3n.png"
        alt="Quantum Intelligence"
        style={{
          width: '100%',
          maxWidth: '900px',
          borderRadius: '16px',
          marginBottom: '2rem',
          border: '1px solid rgba(103, 232, 249, 0.2)',
          boxShadow: '0 0 40px rgba(103, 232, 249, 0.15)',
          zIndex: 1,
          position: 'relative',
        }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        maxWidth: '1400px',
        width: '100%',
        zIndex: 1,
        position: 'relative'
      }}>
        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Quantum Key Distribution</h3>
          <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
            Unbreakable encryption using quantum entanglement. Any eavesdropping attempt
            is immediately detectable, ensuring perfect security.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Quantum Threat Detection</h3>
          <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
            AI algorithms running on quantum processors to analyze massive datasets
            and detect patterns invisible to classical computing.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Post-Quantum Cryptography</h3>
          <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
            Cryptographic algorithms resistant to quantum attacks. Preparing for
            the quantum computing era with lattice-based and hash-based cryptography.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Quantum Simulation</h3>
          <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
            Simulate complex attack scenarios and defense strategies using quantum
            computers to model real-world cybersecurity challenges.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        maxWidth: '1000px',
        zIndex: 1,
        position: 'relative'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>The Quantum Advantage</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', opacity: 0.9 }}>
          Quantum computing represents both the greatest threat and the most powerful defense
          in modern cybersecurity. Genstro Intelligence bridges this quantum divide,
          ensuring your security posture evolves beyond classical limitations.
        </p>
      </div>

      <style>{`
        @keyframes quantumPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Quantum;
