import React from 'react';

const Blueteam = () => {
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
      <div style={{
        textAlign: 'center',
        marginBottom: '3rem'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          textShadow: '0 0 20px #67e8f9'
        }}>
          Blue Team
        </h1>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '600px',
          margin: '0 auto',
          opacity: 0.9
        }}>
          Defense. Detection. Response. The shield that never sleeps.
        </p>
      </div>

      <img
        src="/img/blueteam.jpg"
        alt="Blue Team Defense"
        style={{
          width: '100%',
          maxWidth: '900px',
          borderRadius: '16px',
          marginBottom: '2rem',
          border: '1px solid rgba(103, 232, 249, 0.2)',
          boxShadow: '0 0 40px rgba(103, 232, 249, 0.15)',
        }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        width: '100%'
      }}>
        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Threat Detection</h3>
          <p style={{ lineHeight: '1.6' }}>
            Advanced monitoring systems using AI to identify anomalies and potential threats
            in real-time across all network layers.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Incident Response</h3>
          <p style={{ lineHeight: '1.6' }}>
            Automated response protocols and human-AI collaboration for rapid threat
            containment and system recovery.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Vulnerability Management</h3>
          <p style={{ lineHeight: '1.6' }}>
            Continuous assessment and patching of security vulnerabilities
            with predictive risk analysis.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Compliance Monitoring</h3>
          <p style={{ lineHeight: '1.6' }}>
            Automated compliance checking and reporting across multiple
            regulatory frameworks and industry standards.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Defensive Intelligence</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', opacity: 0.9 }}>
          Our blue team leverages cutting-edge AI and machine learning to maintain
          impenetrable defenses. Every threat is analyzed, every vulnerability addressed,
          every response optimized for maximum effectiveness.
        </p>
      </div>
    </div>
  );
};

export default Blueteam;
