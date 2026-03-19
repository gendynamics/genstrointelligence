import React from 'react';

const About = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#67e8f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem 2rem 2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        marginBottom: '2rem',
        textAlign: 'center',
        textShadow: '0 0 20px #67e8f9'
      }}>
        About Genstro Intelligence
      </h1>

      <img
        src="/img/about.png"
        alt="About Genstro Intelligence"
        style={{
          width: '100%',
          maxWidth: '800px',
          borderRadius: '16px',
          marginBottom: '2rem',
          border: '1px solid rgba(103, 232, 249, 0.2)',
          boxShadow: '0 0 40px rgba(103, 232, 249, 0.15)',
        }}
      />

      <div style={{
        maxWidth: '800px',
        textAlign: 'center',
        lineHeight: '1.8',
        fontSize: '1.2rem'
      }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Born from the frontlines of cyber warfare, Genstro Intelligence builds the security
          infrastructure that global organizations trust to protect their most critical assets.
          We don't just detect threats — we predict them.
        </p>

        <p style={{ marginBottom: '1.5rem' }}>
          Our AI-driven platform unifies offensive testing, defensive monitoring, and quantum-safe
          encryption into one continuous security posture.
        </p>

        <p>
          Every layer intelligent. Every response autonomous. Every defense evolving.
        </p>

        <p>
          Through collaborative red, blue, and purple team operations powered by AI,
          we deliver unprecedented visibility and response capabilities.
        </p>
      </div>

      <div style={{
        marginTop: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '1000px',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI-Powered Detection</h3>
          <p>Machine learning models that identify threats before they manifest</p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quantum Security</h3>
          <p>Future-proof encryption and quantum-resistant algorithms</p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Unified Operations</h3>
          <p>Seamless collaboration between offensive and defensive teams</p>
        </div>
      </div>
    </div>
  );
};

export default About;
