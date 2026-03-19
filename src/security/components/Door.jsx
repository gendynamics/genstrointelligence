import React from 'react';

const Door = ({ onOpen }) => {
  const handleClick = () => {
    if (onOpen) {
      onOpen();
    }
  };

  return (
    <div 
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
      onClick={handleClick}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 100px #67e8f9'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 60px #67e8f9'}
    >
      <h1 style={{
        color: '#67e8f9',
        fontSize: 'clamp(2rem, 8vw, 3.5rem)',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: '0.2em'
      }}>
        OPEN
      </h1>
    </div>
  );
};

export default Door;