// src/security/components/Door.jsx
// The guarded entry. Click only if cleared.

import React from 'react';

const Door = ({ onClick }) => {
  return (
    <div 
      onClick={onClick} // clicks go to gatekeeper first
      style={{
        width: 'min(90vw, 400px)',
        height: 'min(90vw, 400px)',
        borderRadius: '50%',
        border: '12px solid #67e8f9',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 0 60px #67e8f9',
        margin: 'auto',
        transition: 'all 0.4s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 100px #67e8f9'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 60px #67e8f9'}
    >
      <h1 style={{
        color: '#67e8f9',
        fontSize: 'clamp(1.8rem, 7vw, 3rem)',
        letterSpacing: '0.3em',
        textTransform: 'uppercase'
      }}>
        OPEN
      </h1>
    </div>
  );
};

export default Door;
