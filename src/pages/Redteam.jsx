import React from 'react';

const Redteam = () => {
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
          Red Team
        </h1>
        <p style={{
          fontSize: '1.5rem',
          maxWidth: '600px',
          margin: '0 auto',
          opacity: 0.9
        }}>
          Attack. Test. Improve. The spear that finds every weakness.
        </p>
      </div>

      <img
        src="/img/redteam.png"
        alt="Red Team Operations"
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
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Penetration Testing</h3>
          <p style={{ lineHeight: '1.6' }}>
            Ethical hacking and vulnerability exploitation to identify security gaps
            before malicious actors can discover them.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Social Engineering</h3>
          <p style={{ lineHeight: '1.6' }}>
            Advanced social engineering assessments and training to protect
            against human-factor vulnerabilities.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Adversary Simulation</h3>
          <p style={{ lineHeight: '1.6' }}>
            Realistic attack simulations using AI-powered tactics, techniques,
            and procedures (TTPs) of modern threat actors.
          </p>
        </div>

        <div style={{
          background: 'rgba(103, 232, 249, 0.1)',
          border: '1px solid #67e8f9',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Exploit Development</h3>
          <p style={{ lineHeight: '1.6' }}>
            Custom exploit creation and weaponization research to stay
            ahead of emerging threats and zero-day vulnerabilities.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '3rem',
        textAlign: 'center',
        maxWidth: '800px'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Offensive Intelligence</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7', opacity: 0.9 }}>
          Our red team employs aggressive, intelligence-driven approaches to uncover
          hidden vulnerabilities. We think like attackers, act like adversaries,
          and deliver actionable intelligence to strengthen defenses.
        </p>
      </div>
    </div>
  );
};

export default Redteam;
