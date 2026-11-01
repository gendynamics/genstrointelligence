import React, { useRef, useEffect, useState, useMemo } from 'react';

function HoloParticles() {
  const particles = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 12; i++) {
      pts.push({
        id: i,
        left: Math.random() * 100,
        top: 20 + Math.random() * 70,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
        color: i % 3 === 0
          ? 'rgba(103,232,249,0.8)'
          : i % 3 === 1
            ? 'rgba(168,85,247,0.6)'
            : 'rgba(52,211,153,0.6)',
      });
    }
    return pts;
  }, []);

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left + '%',
            top: p.top + '%',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: '0 0 6px ' + p.color,
            animation: 'deliah-particle-float ' + p.duration + 's ease-in-out ' + p.delay + 's infinite',
            pointerEvents: 'none',
            zIndex: 4,
          }}
        />
      ))}
    </>
  );
}

const SCAN_KEYFRAMES = `
@keyframes deliah-scanline {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
@keyframes deliah-glitch {
  0%, 94%, 100% { opacity: 1; transform: translate(0,0) scaleX(1); }
  95%  { opacity: 0.8; transform: translate(-2px, 1px) scaleX(1.01); }
  96%  { opacity: 0.9; transform: translate(1px, -1px) scaleX(0.99); }
  97%  { opacity: 1; transform: translate(0,0) scaleX(1); }
}
@keyframes deliah-holo-pulse {
  0%, 100% { box-shadow: 0 0 15px rgba(103,232,249,0.3), 0 0 30px rgba(103,232,249,0.15); }
  50%      { box-shadow: 0 0 25px rgba(103,232,249,0.5), 0 0 50px rgba(103,232,249,0.25); }
}
@keyframes deliah-particle-float {
  0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
  50%  { transform: translateY(-20px) translateX(5px) scale(1.2); opacity: 1; }
  100% { transform: translateY(-40px) translateX(-3px) scale(0.8); opacity: 0; }
}
`;

export default function Deliah3DAvatar({ width = 180, height = 340, isOpen, isDragging }) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const id = 'deliah-holo-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = SCAN_KEYFRAMES;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, []);

  if (videoError) {
    return (
      <img
        src="/img/deliah.jpeg"
        alt="Deliah"
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', display: 'block' }}
      />
    );
  }

  return (
    <div style={{
      width,
      height,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 8,
      animation: 'deliah-holo-pulse 3s ease-in-out infinite, deliah-glitch 8s linear infinite',
    }}>
      <video
        ref={videoRef}
        src="/img/deliah2.0.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
          filter: 'contrast(1.1) saturate(1.2) brightness(1.05)',
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(103,232,249,0.03) 2px, rgba(103,232,249,0.03) 4px)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: 40,
        background: 'linear-gradient(180deg, transparent, rgba(103,232,249,0.12), transparent)',
        animation: 'deliah-scanline 3s linear infinite',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 8,
        border: '1px solid rgba(103,232,249,0.25)',
        boxShadow: 'inset 0 0 20px rgba(103,232,249,0.1)',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(corner => {
        const isTop = corner.includes('top');
        const isLeft = corner.includes('Left');
        return (
          <div key={corner} style={{
            position: 'absolute',
            [isTop ? 'top' : 'bottom']: 4,
            [isLeft ? 'left' : 'right']: 4,
            width: 14,
            height: 14,
            borderTop: isTop ? '2px solid rgba(103,232,249,0.6)' : 'none',
            borderBottom: !isTop ? '2px solid rgba(103,232,249,0.6)' : 'none',
            borderLeft: isLeft ? '2px solid rgba(103,232,249,0.6)' : 'none',
            borderRight: !isLeft ? '2px solid rgba(103,232,249,0.6)' : 'none',
            pointerEvents: 'none',
            zIndex: 4,
          }} />
        );
      })}

      <HoloParticles />

      {!videoReady && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,20,0.9), rgba(103,232,249,0.1))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTop: '2px solid #67e8f9',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
      )}
    </div>
  );
}
