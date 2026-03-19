import React, { useState, useEffect, useRef, useCallback, Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Deliah3DAvatar from './Deliah3D';

// Local error boundary: if 3D crashes, fall back to the JPEG image
class Avatar3DErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.warn('[Deliah 3D] Falling back to 2D avatar:', error.message);
  }
  render() {
    if (this.state.hasError) {
      // Fallback: flat JPEG image
      return (
        <img
          src="/deliah.jpeg"
          alt="Deliah — AI Guide"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
            display: 'block',
          }}
        />
      );
    }
    return this.props.children;
  }
}

/*
 * DELIAH — Virtual AI Guide for Genstro Intelligence
 *
 * Features:
 *   - Persistent floating avatar using deliah.jpeg
 *   - Responsive sizing (mobile/tablet/desktop)
 *   - Draggable mobility across the viewport
 *   - Context-aware speech bubbles per route
 *   - Points users to site categories interactively
 *   - Idle breathing animation + glow pulse
 *   - Minimizable to corner icon
 *   - Universal: touch, mouse, keyboard, all OS
 */

// ─── Page-aware guidance dialogue ───────────────────────────
const PAGE_GUIDANCE = {
  '/': {
    greeting: "Welcome. Genstro Intelligence is the portal to next-generation AI. Enter once — and the future expands infinitely. I'm Deliah, your guide.",
    tips: [
      "Tap the door to step through the portal into our world.",
      "Explore Cybersecurity — Red Team, Blue Team & Purple Team await you in the nav.",
      "Quantum computing is reshaping security. Visit Quantum to see the frontier.",
      "Our AI-driven cybersecurity architecture protects what matters most.",
      "Need to reach us? Head to Contact.",
    ],
  },
  '/about': {
    greeting: "This is where the Genstro Intelligence story lives — where AI meets cybersecurity.",
    tips: [
      "Learn how we fuse quantum computing with next-gen cybersecurity.",
      "Our mission: build the most intelligent security architecture on the planet.",
      "Want action? Try Red Team for offensive cybersecurity operations.",
      "Or Blue Team for AI-powered defense strategies.",
    ],
  },
  '/redteam': {
    greeting: "Red Team — Offensive Cybersecurity Operations. Strike first, strike smart.",
    tips: [
      "This is where we simulate real-world cyberattacks with AI precision.",
      "Penetration testing, adversary emulation, zero-day research — all here.",
      "Pair this with Blue Team for full-spectrum cybersecurity coverage.",
      "Purple Team merges offense and defense — check it out.",
      "Quantum-resistant attack simulations are the next evolution.",
    ],
  },
  '/blueteam': {
    greeting: "Blue Team — The Cybersecurity Shield. Defend. Detect. Dominate.",
    tips: [
      "AI-powered monitoring, threat detection, and incident response live here.",
      "Real-time cybersecurity intelligence protects every layer of the stack.",
      "Combine with Red Team for adversary simulation and hardened defenses.",
      "Purple Team brings both worlds together into unified security.",
      "Quantum-safe encryption ensures your defenses survive the next era.",
    ],
  },
  '/purpleteam': {
    greeting: "Purple Team — Where Cybersecurity Offense Meets Defense. Maximum posture.",
    tips: [
      "The fusion of Red Team attack and Blue Team defense — this is the apex.",
      "Review offensive techniques applied through a defensive cybersecurity lens.",
      "This is the heart of the Genstro Intelligence security architecture.",
      "AI-driven threat modeling and quantum-aware risk assessment converge here.",
    ],
  },
  '/quantum': {
    greeting: "Quantum Computing — The Next Frontier of Cybersecurity and AI.",
    tips: [
      "Explore quantum-safe cryptography that protects against tomorrow's threats.",
      "See how quantum computing is transforming cybersecurity from the ground up.",
      "Post-quantum algorithms, lattice-based encryption, quantum key distribution.",
      "Genstro Intelligence bridges quantum innovation with real-world security.",
      "Head to About to learn our full quantum-AI vision.",
    ],
  },
  '/contact': {
    greeting: "Let's connect. The future of cybersecurity starts with a conversation.",
    tips: [
      "Reach out for partnerships, quantum research, or cybersecurity inquiries.",
      "Review our OWASP 2026 security disclosure policy.",
      "Genstro Intelligence — enter once, and the future expands infinitely.",
      "Go Home to begin your journey through the portal again.",
    ],
  },
};

const QUICK_NAV = [
  { label: 'Home', path: '/' },
  { label: 'Red Team', path: '/redteam' },
  { label: 'Blue Team', path: '/blueteam' },
  { label: 'Purple Team', path: '/purpleteam' },
  { label: 'Quantum', path: '/quantum' },
  { label: 'Contact', path: '/contact' },
];

// ─── Orb colors mapped to Deliah's elemental hands ─────────
const ORB_COLORS = {
  '/':          { core: '#FFD700', glow: 'rgba(255,215,0,0.6)',   ring: 'rgba(255,215,0,0.15)' },   // Gold starburst (chest emblem)
  '/about':     { core: '#FFD700', glow: 'rgba(255,215,0,0.6)',   ring: 'rgba(255,215,0,0.15)' },   // Gold
  '/redteam':   { core: '#FF4500', glow: 'rgba(255,69,0,0.6)',    ring: 'rgba(255,69,0,0.15)' },    // Red/orange fire (upper-right hand)
  '/blueteam':  { core: '#00BFFF', glow: 'rgba(0,191,255,0.6)',   ring: 'rgba(0,191,255,0.15)' },   // Cyan-blue (lower-right sphere)
  '/purpleteam':{ core: '#A855F7', glow: 'rgba(168,85,247,0.6)',  ring: 'rgba(168,85,247,0.15)' },  // Purple (red+blue fusion)
  '/quantum':   { core: '#FBBF24', glow: 'rgba(251,191,36,0.6)',  ring: 'rgba(251,191,36,0.15)' },  // Amber-gold (crown halo)
  '/contact':   { core: '#22C55E', glow: 'rgba(34,197,94,0.6)',   ring: 'rgba(34,197,94,0.15)' },   // Green (lower-left earth sphere)
};

const Deliah = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Door gate: hide Deliah on home page until door is opened
  const [doorOpened, setDoorOpened] = useState(false);

  useEffect(() => {
    const handleDoorOpened = () => setDoorOpened(true);
    window.addEventListener('doorOpened', handleDoorOpened);
    return () => window.removeEventListener('doorOpened', handleDoorOpened);
  }, []);

  // If user navigates to any page other than home, door is implicitly passed
  useEffect(() => {
    if (location.pathname !== '/') {
      setDoorOpened(true);
    }
  }, [location.pathname]);

  // State
  const [isOpen, setIsOpen] = useState(false);        // Chat bubble visible
  const [isMinimized, setIsMinimized] = useState(false); // Collapsed to small icon
  const [currentTip, setCurrentTip] = useState(0);
  const [showNav, setShowNav] = useState(false);       // Quick-nav panel
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);

  // Drag state
  const [position, setPosition] = useState({ x: -1, y: -1 }); // -1 = use default
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const avatarRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const wasDragged = useRef(false);

  // Responsive size — circular ball avatar
  const [figureW, setFigureW] = useState(100);
  const [figureH, setFigureH] = useState(100);

  // Orb transition state
  const [orbActive, setOrbActive] = useState(false);       // Is orb animation playing?
  const [orbPhase, setOrbPhase] = useState('idle');         // 'idle' | 'throw' | 'flames' | 'expand' | 'loading' | 'explode'
  const [orbColor, setOrbColor] = useState(null);           // Current orb color set
  const [orbTarget, setOrbTarget] = useState(null);         // Path to navigate after explosion
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });    // Current orb position for flame trail

  // ─── Responsive sizing (ball avatar) ───────────────
  const computeSize = useCallback(() => {
    const w = window.innerWidth;
    if (w <= 480) return { w: 64, h: 64 };
    if (w <= 768) return { w: 80, h: 80 };
    if (w <= 1024) return { w: 90, h: 90 };
    return { w: 100, h: 100 };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const { w, h } = computeSize();
      setFigureW(w);
      setFigureH(h);
      setPosition(prev => {
        if (prev.x === -1) return prev;
        return {
          x: Math.min(prev.x, window.innerWidth - w - 8),
          y: Math.min(prev.y, window.innerHeight - h - 8),
        };
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [computeSize]);

  // Default position: right side, vertically centered-low
  const defaultPos = {
    x: typeof window !== 'undefined' ? window.innerWidth - figureW - 16 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight - figureH - 40 : 0,
  };
  const pos = position.x === -1 ? defaultPos : position;

  // ─── Auto-greet on first page visit ────────────────────
  useEffect(() => {
    if (!hasGreeted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasGreeted(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasGreeted]);

  // ─── Typing animation ─────────────────────────────────
  const typeText = useCallback((text) => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // ─── Route change: show new greeting ───────────────────
  useEffect(() => {
    if (hasGreeted) {
      setCurrentTip(0);
      setShowNav(false);
      const guidance = PAGE_GUIDANCE[location.pathname] || PAGE_GUIDANCE['/'];
      typeText(guidance.greeting);
    }
  }, [location.pathname, hasGreeted, typeText]);

  // First greeting type effect
  useEffect(() => {
    if (isOpen && hasGreeted) {
      const guidance = PAGE_GUIDANCE[location.pathname] || PAGE_GUIDANCE['/'];
      typeText(guidance.greeting);
    }
  }, [isOpen, hasGreeted, location.pathname, typeText]);

  // ─── Drag handlers (pointer events = universal) ────────
  const handlePointerDown = useCallback((e) => {
    if (isMinimized) return;
    e.preventDefault();
    const rect = avatarRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    wasDragged.current = false;
    setIsDragging(true);
    avatarRef.current.setPointerCapture(e.pointerId);
  }, [isMinimized]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = Math.abs(e.clientX - dragStartPos.current.x);
    const dy = Math.abs(e.clientY - dragStartPos.current.y);
    if (dx > 5 || dy > 5) wasDragged.current = true;

    const newX = Math.max(0, Math.min(e.clientX - dragOffset.current.x, window.innerWidth - figureW - 8));
    const newY = Math.max(0, Math.min(e.clientY - dragOffset.current.y, window.innerHeight - figureH - 8));
    setPosition({ x: newX, y: newY });
  }, [isDragging, figureW, figureH]);

  const handlePointerUp = useCallback((e) => {
    setIsDragging(false);
    if (avatarRef.current) {
      avatarRef.current.releasePointerCapture(e.pointerId);
    }
  }, []);

  // ─── Click handler (only if not dragged) ───────────────
  const handleAvatarClick = useCallback(() => {
    if (wasDragged.current) return;
    if (isMinimized) {
      setIsMinimized(false);
      setIsOpen(true);
    } else {
      setIsOpen(prev => !prev);
    }
  }, [isMinimized]);

  // ─── Next tip ──────────────────────────────────────────
  const nextTip = useCallback(() => {
    const guidance = PAGE_GUIDANCE[location.pathname] || PAGE_GUIDANCE['/'];
    const nextIdx = (currentTip + 1) % guidance.tips.length;
    setCurrentTip(nextIdx);
    typeText(guidance.tips[nextIdx]);
  }, [location.pathname, currentTip, typeText]);

  // ─── Navigate to page (orb launch sequence with flames) ──────────
  const goTo = useCallback((path) => {
    if (orbActive) return;
    if (path === location.pathname) return;

    const colors = ORB_COLORS[path] || ORB_COLORS['/'];
    setOrbColor(colors);
    setOrbTarget(path);
    setShowNav(false);
    setIsOpen(false);
    setOrbActive(true);
    setOrbPos({ x: pos.x + figureW / 2, y: pos.y + figureH * 0.35 });
    setOrbPhase('throw');

    // Phase 1: Orb thrown from Deliah toward center with fire trail (500ms)
    setTimeout(() => setOrbPhase('flames'), 100);

    // Phase 2: Orb in flames flying toward screen center (600ms)
    setTimeout(() => {
      setOrbPhase('expand');
      // Trigger a light flash when it hits the screen
      const flash = document.createElement('div');
      flash.style.cssText = `position:fixed;inset:0;background:white;z-index:10005;pointer-events:none;animation:deliah-screen-flash 0.4s ease-out forwards;`;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 500);
    }, 600);

    // Phase 3: Flames expand, loading screen appears (800ms)
    setTimeout(() => setOrbPhase('loading'), 1000);

    // Phase 4: Navigate during loading
    setTimeout(() => {
      navigate(path);
    }, 1400);

    // Phase 5: Explode and clean up
    setTimeout(() => setOrbPhase('explode'), 1700);

    setTimeout(() => {
      setOrbPhase('idle');
      setOrbActive(false);
      setOrbColor(null);
      setOrbTarget(null);
    }, 2300);
  }, [navigate, orbActive, location.pathname, pos, figureW, figureH]);

  // ─── Bubble dimensions (responsive) ────────────────────
  const bubbleWidth = figureW < 130 ? 220 : 280;

  // ─── Compute bubble position (to the left of the figure) ─
  const bubbleOnLeft = pos.x > window.innerWidth / 2;
  const bubbleStyle = {
    position: 'absolute',
    top: 10,
    ...(bubbleOnLeft
      ? { right: figureW + 16 }
      : { left: figureW + 16 }),
    width: bubbleWidth,
    maxWidth: 'calc(100vw - 32px)',
  };

  const guidance = PAGE_GUIDANCE[location.pathname] || PAGE_GUIDANCE['/'];

  // Hide Deliah on home page until the door has been opened
  if (location.pathname === '/' && !doorOpened) {
    return null;
  }

  if (isMinimized) {
    // ─── Minimized: small pulsing dot ────────────────────
    return (
      <div
        onClick={() => { setIsMinimized(false); setIsOpen(true); }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: '#67e8f9',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 0 20px #67e8f9, 0 0 40px rgba(103,232,249,0.3)',
          animation: 'deliah-pulse 2s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          color: '#000',
          fontWeight: 'bold',
          fontFamily: 'Orbitron, sans-serif',
        }}
        role="button"
        aria-label="Open Deliah AI Guide"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') { setIsMinimized(false); setIsOpen(true); }}}
      >
        D
      </div>
    );
  }

  return (
    <>
      {/* ─── Keyframe animations (injected once) ─── */}
      <style>{`
        @keyframes deliah-breathe {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-4px) scale(1.03); }
        }
        @keyframes deliah-pulse {
          0%, 100% { box-shadow: 0 0 15px #67e8f9, 0 0 30px rgba(103,232,249,0.3); }
          50% { box-shadow: 0 0 25px #67e8f9, 0 0 50px rgba(103,232,249,0.5); }
        }
        @keyframes deliah-bubble-in {
          0% { opacity: 0; transform: translateY(8px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes deliah-typing {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes deliah-orb-appear {
          0% { transform: scale(0.3); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes deliah-orb-expand {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(60); opacity: 1; }
        }
        @keyframes deliah-orb-explode {
          0% { opacity: 1; }
          40% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes deliah-orb-ring {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes deliah-flame-flicker {
          0%   { transform: scaleY(1) scaleX(1) translateY(0); opacity: 0.9; }
          25%  { transform: scaleY(1.3) scaleX(0.85) translateY(-8px); opacity: 1; }
          50%  { transform: scaleY(0.9) scaleX(1.1) translateY(-4px); opacity: 0.8; }
          75%  { transform: scaleY(1.2) scaleX(0.9) translateY(-12px); opacity: 1; }
          100% { transform: scaleY(1) scaleX(1) translateY(0); opacity: 0.9; }
        }
        @keyframes deliah-flame-particle {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--fx), var(--fy)) scale(0); opacity: 0; }
        }
        @keyframes deliah-orb-throw-fly {
          0%   { transform: scale(1) translate(0, 0); filter: brightness(1) blur(0px); }
          40%  { transform: scale(1.8) translate(0, 0); filter: brightness(1.5) blur(1px); }
          100% { transform: scale(4) translate(0, 0); filter: brightness(3) blur(4px); }
        }
        @keyframes deliah-screen-flash {
          0% { opacity: 0; }
          20% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes deliah-fire-expand {
          0% { transform: scale(1); opacity: 1; filter: blur(4px); }
          100% { transform: scale(100); opacity: 0; filter: blur(20px); }
        }
        @keyframes deliah-loading-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes deliah-loading-fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes deliah-loading-text-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .deliah-avatar {
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }
        .deliah-avatar:focus-visible {
          outline: 2px solid #67e8f9;
          outline-offset: 3px;
        }
        .deliah-nav-btn:hover {
          background: rgba(103,232,249,0.15) !important;
          transform: translateX(4px);
        }
        .deliah-nav-btn:active {
          transform: translateX(2px);
        }
      `}</style>

      {/* ─── Orb transition overlay with flames ─── */}
      {orbActive && orbColor && (() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const avatarCenterX = orbPos.x;
        const avatarCenterY = orbPos.y;
        const inFlight = orbPhase === 'throw' || orbPhase === 'flames';
        const atCenter = orbPhase === 'expand' || orbPhase === 'loading' || orbPhase === 'explode';
        const orbX = inFlight ? avatarCenterX : centerX;
        const orbY = inFlight ? avatarCenterY : centerY;

        return (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            pointerEvents: orbPhase === 'idle' ? 'none' : 'all',
          }}>
            {/* Screen fill during expand/loading/explode */}
            {(orbPhase === 'expand' || orbPhase === 'loading' || orbPhase === 'explode') && (
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at center, ${orbColor.core}, #000 70%)`,
                opacity: orbPhase === 'explode' ? undefined : 0,
                animation: orbPhase === 'explode'
                  ? 'deliah-orb-explode 0.6s ease-out forwards'
                  : undefined,
                transition: 'opacity 0.5s ease',
                ...(orbPhase !== 'explode' ? { opacity: 0.97 } : {}),
              }} />
            )}

            {/* The orb itself — with flame effect */}
            {(inFlight || orbPhase === 'expand') && (
              <div style={{
                position: 'absolute',
                left: (inFlight ? avatarCenterX : centerX) - 40,
                top: (inFlight ? avatarCenterY : centerY) - 40,
                width: 80, height: 80,
                transition: 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), top 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: orbPhase === 'throw'
                  ? 'deliah-orb-appear 0.15s ease-out forwards'
                  : orbPhase === 'expand'
                    ? 'deliah-orb-expand 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                    : 'deliah-orb-throw-fly 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                zIndex: 10002,
              }}>
                {/* Core orb */}
                <div style={{
                  position: 'absolute', inset: 0,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, #fff 0%, ${orbColor.core} 40%, ${orbColor.glow} 70%, transparent 100%)`,
                  boxShadow: `0 0 60px ${orbColor.glow}, 0 0 120px ${orbColor.glow}, 0 0 180px ${orbColor.ring}`,
                }} />

                {/* Fire aura */}
                <div style={{
                  position: 'absolute', inset: -20,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${orbColor.core} 0%, transparent 70%)`,
                  opacity: 0.6,
                  filter: 'blur(10px)',
                  animation: 'deliah-flame-flicker 0.1s infinite alternate',
                }} />

                {/* Flame layers */}
                {(orbPhase === 'flames' || orbPhase === 'throw' || orbPhase === 'expand') && (
                  <>
                    {/* Outer flame */}
                    <div style={{
                      position: 'absolute',
                      left: -20, top: -40, width: 120, height: 140,
                      borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
                      background: `radial-gradient(ellipse at 50% 80%, ${orbColor.core}ee 0%, ${orbColor.glow}aa 50%, transparent 80%)`,
                      filter: 'blur(10px)',
                      animation: 'deliah-flame-flicker 0.1s ease-in-out infinite alternate',
                      opacity: 0.9,
                    }} />
                    {/* Inner flame (brighter) */}
                    <div style={{
                      position: 'absolute',
                      left: 10, top: -10, width: 60, height: 80,
                      borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
                      background: `radial-gradient(ellipse at 50% 70%, #fff 0%, ${orbColor.core} 60%, transparent 90%)`,
                      filter: 'blur(4px)',
                      animation: 'deliah-flame-flicker 0.08s ease-in-out 0.04s infinite alternate',
                      opacity: 1,
                    }} />
                    {/* Fire trail particles */}
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} style={{
                        position: 'absolute',
                        left: 40 + (Math.random() - 0.5) * 50,
                        top: 60 + Math.random() * 30,
                        width: 6 + Math.random() * 10,
                        height: 6 + Math.random() * 10,
                        borderRadius: '50%',
                        background: i % 4 === 0 ? '#fff' : i % 4 === 1 ? orbColor.core : i % 4 === 2 ? orbColor.glow : '#FFA500',
                        '--fx': (Math.random() - 0.5) * 120 + 'px',
                        '--fy': (50 + Math.random() * 80) + 'px',
                        animation: `deliah-flame-particle ${0.4 + Math.random() * 0.5}s ease-out ${i * 0.02}s infinite`,
                        filter: 'blur(2px)',
                        opacity: 0.9,
                      }} />
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Loading screen overlay */}
            {orbPhase === 'loading' && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                animation: 'deliah-loading-fade-in 0.4s ease-out',
                zIndex: 10001,
                background: `radial-gradient(circle at center, ${orbColor.core}33, #000 80%)`,
              }}>
                {/* Background fire storm effect */}
                <div style={{
                  position: 'absolute', inset: 0,
                  opacity: 0.2,
                  pointerEvents: 'none',
                  background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  mixBlendMode: 'overlay',
                }} />

                {/* Spinning ring */}
                <div style={{
                  width: 100, height: 100,
                  borderRadius: '50%',
                  border: `4px solid ${orbColor.ring}`,
                  borderTop: `4px solid ${orbColor.core}`,
                  animation: 'deliah-loading-spin 0.6s linear infinite',
                  boxShadow: `0 0 30px ${orbColor.glow}, inset 0 0 20px ${orbColor.glow}`,
                  position: 'relative',
                }}>
                   {/* Center core pulse */}
                   <div style={{
                     position: 'absolute', inset: 15, borderRadius: '50%',
                     background: orbColor.core,
                     boxShadow: `0 0 40px ${orbColor.core}`,
                     animation: 'deliah-loading-text-pulse 1s ease-in-out infinite',
                   }} />
                </div>

                {/* Category label */}
                <div style={{
                  marginTop: 40,
                  color: orbColor.core,
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  textShadow: `0 0 20px ${orbColor.glow}, 0 0 40px ${orbColor.core}`,
                  animation: 'deliah-loading-text-pulse 1.2s ease-in-out infinite',
                }}>
                  {orbTarget === '/' ? 'GATEWAY' : orbTarget?.replace('/', '').replace('team', ' TEAM').toUpperCase()}
                </div>

                {/* Ember particles around spinner */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i / 12) * Math.PI * 2;
                  return (
                    <div key={i} style={{
                      position: 'absolute',
                      left: centerX + Math.cos(angle) * 80 - 4,
                      top: centerY + Math.sin(angle) * 80 - 4,
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: orbColor.core,
                      boxShadow: `0 0 12px ${orbColor.glow}`,
                      animation: `deliah-flame-particle 0.8s ease-out ${i * 0.05}s infinite`,
                      '--fx': Math.cos(angle) * 60 + 'px',
                      '--fy': Math.sin(angle) * 60 + 'px',
                    }} />
                  );
                })}
              </div>
            )}

            {/* Explosion rings */}
            {orbPhase === 'explode' && [0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute',
                left: centerX - 40,
                top: centerY - 40,
                width: 80, height: 80,
                borderRadius: '50%',
                border: `3px solid ${orbColor.core}`,
                animation: `deliah-orb-ring 0.6s ease-out ${i * 0.12}s forwards`,
                opacity: 0,
              }} />
            ))}
          </div>
        );
      })()}

      {/* ─── Main container (fixed, draggable) ─── */}
      <div
        style={{
          position: 'fixed',
          left: pos.x,
          top: pos.y,
          zIndex: 9999,
          transition: isDragging ? 'none' : 'left 0.3s ease, top 0.3s ease',
        }}
      >
        {/* ─── Speech bubble ─── */}
        {isOpen && (
          <div style={{
            ...bubbleStyle,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(103, 232, 249, 0.4)',
            borderRadius: 12,
            padding: '14px 16px',
            boxShadow: '0 8px 32px rgba(103, 232, 249, 0.15), 0 0 60px rgba(103,232,249,0.05)',
            animation: 'deliah-bubble-in 0.3s ease-out',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              borderBottom: '1px solid rgba(103,232,249,0.15)',
              paddingBottom: 8,
            }}>
              <span style={{
                color: '#67e8f9',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: figureW < 130 ? '0.65rem' : '0.75rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
              }}>
                DELIAH AI
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {/* Minimize button */}
                <button
                  onClick={() => { setIsMinimized(true); setIsOpen(false); }}
                  aria-label="Minimize Deliah"
                  style={{
                    background: 'none', border: 'none', color: '#67e8f9',
                    cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px',
                    opacity: 0.6, transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                >—</button>
                {/* Close button */}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  style={{
                    background: 'none', border: 'none', color: '#67e8f9',
                    cursor: 'pointer', fontSize: '0.9rem', padding: '0 4px',
                    opacity: 0.6, transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                >✕</button>
              </div>
            </div>

            {/* Message text */}
            <p style={{
              color: '#e0e0e0',
              fontSize: figureW < 130 ? '0.75rem' : '0.85rem',
              lineHeight: 1.5,
              margin: 0,
              minHeight: 40,
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {displayedText}
              {isTyping && (
                <span style={{ animation: 'deliah-typing 0.6s infinite', marginLeft: 2 }}>▊</span>
              )}
            </p>

            {/* Action buttons */}
            <div style={{
              display: 'flex',
              gap: 8,
              marginTop: 12,
              flexWrap: 'wrap',
            }}>
              <button
                onClick={nextTip}
                style={{
                  background: 'rgba(103,232,249,0.1)',
                  border: '1px solid rgba(103,232,249,0.3)',
                  color: '#67e8f9',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: figureW < 130 ? '0.65rem' : '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'Orbitron, sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                Next Tip ({currentTip + 1}/{guidance.tips.length})
              </button>
              <button
                onClick={() => setShowNav(prev => !prev)}
                style={{
                  background: showNav ? 'rgba(103,232,249,0.2)' : 'rgba(103,232,249,0.05)',
                  border: '1px solid rgba(103,232,249,0.3)',
                  color: '#67e8f9',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: figureW < 130 ? '0.65rem' : '0.75rem',
                  cursor: 'pointer',
                  fontFamily: 'Orbitron, sans-serif',
                  transition: 'all 0.2s',
                }}
              >
                {showNav ? 'Hide Pages' : 'Show Me Pages'}
              </button>
            </div>

            {/* Quick navigation panel */}
            {showNav && (
              <div style={{
                marginTop: 10,
                borderTop: '1px solid rgba(103,232,249,0.15)',
                paddingTop: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}>
                {QUICK_NAV.map(item => (
                  <button
                    key={item.path}
                    className="deliah-nav-btn"
                    onClick={() => goTo(item.path)}
                    style={{
                      background: location.pathname === item.path
                        ? 'rgba(103,232,249,0.15)' : 'transparent',
                      border: 'none',
                      color: location.pathname === item.path ? '#67e8f9' : '#a0a0a0',
                      textAlign: 'left',
                      padding: '6px 10px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: figureW < 130 ? '0.65rem' : '0.75rem',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: '0.6rem' }}>
                      {location.pathname === item.path ? '◆' : '▸'}
                    </span>
                    {item.label}
                    {location.pathname === item.path && (
                      <span style={{
                        marginLeft: 'auto', fontSize: '0.55rem',
                        color: '#67e8f9', opacity: 0.6,
                      }}>current</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Bubble arrow/tail pointing toward figure */}
            <div style={{
              position: 'absolute',
              top: 20,
              [bubbleOnLeft ? 'right' : 'left']: -8,
              width: 0, height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              ...(bubbleOnLeft
                ? { borderLeft: '8px solid rgba(103, 232, 249, 0.4)' }
                : { borderRight: '8px solid rgba(103, 232, 249, 0.4)' }),
            }} />
          </div>
        )}

        {/* ─── 3D Hologram Figure (draggable, clickable) ─── */}
        <div
          ref={avatarRef}
          className="deliah-avatar"
          role="button"
          tabIndex={0}
          aria-label="Deliah AI Guide — click to chat, drag to move"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onClick={handleAvatarClick}
          onKeyDown={e => { if (e.key === 'Enter') handleAvatarClick(); }}
          style={{
            width: figureW,
            height: figureH,
            borderRadius: '50%',
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'grab',
            animation: isDragging ? 'none' : 'deliah-breathe 4s ease-in-out infinite',
            position: 'relative',
            filter: `drop-shadow(0 0 12px rgba(103,232,249,${isOpen ? 0.5 : 0.25}))`,
            border: '2px solid rgba(103,232,249,0.5)',
            boxShadow: '0 0 20px rgba(103,232,249,0.3), 0 0 40px rgba(103,232,249,0.15)',
            transition: 'filter 0.3s',
          }}
        >
          <Avatar3DErrorBoundary>
            <Deliah3DAvatar width={figureW} height={figureH} isOpen={isOpen} isDragging={isDragging} />
          </Avatar3DErrorBoundary>
          {/* Online indicator */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #000',
            boxShadow: '0 0 6px #22c55e',
            zIndex: 1,
          }} />
        </div>
      </div>
    </>
  );
};

export default Deliah;
