import React from 'react';

const PurpleTeam = () => {
  return (
    <>
      <style>{`
        @keyframes purpleReveal {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeTextIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#000',
        color: '#67e8f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem 2rem 2rem',
      }}>
        <img
          src="/img/purpledome.png"
          alt="Purple Team"
          style={{
            maxWidth: '90vw',
            maxHeight: '60vh',
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 0 40px rgba(103, 232, 249, 0.7)',
            animation: 'purpleReveal 1.2s ease-out forwards',
            marginBottom: '2rem',
          }}
        />

        <div style={{ animation: 'fadeTextIn 1s ease-out 0.8s forwards', opacity: 0, textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', textShadow: '0 0 20px #67e8f9' }}>Purple Team</h1>
          <p style={{ fontSize: '1.5rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
            Continuous adversary emulation meets adaptive defense. Purple Team orchestrates
            synchronized offensive and defensive operations — threat hunting, detection engineering,
            and attack validation in a single integrated loop. The full spectrum, operating as one.
          </p>
        </div>
      </div>
    </>
  );
};

export default PurpleTeam;
