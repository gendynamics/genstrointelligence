import React, { Component, Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const QmindsAvatar = lazy(() => import('./QmindsAvatar'));

const MONO = "'DM Mono', monospace";

/*
 * QMINDS AI — floating briefing widget
 * Chat panel + 3D robot avatar (public/models/qminds.glb) anchored bottom-right.
 * Hidden on the home page. Tips rotate per page with "Next Tip (n/5)".
 */

const DEFAULT_TIPS = [
  "Welcome. Genstro Intelligence is the portal to next-generation AI. Enter once — and the future expands infinitely. I'm Qminds, your AI security analyst.",
  'Ask me about red team, blue team, and purple team operations — or the products we are building.',
  'Every page carries its own signal. Navigate and I will brief you on each domain.',
  'Security intelligence means seeing exposure clearly before it becomes impact.',
  'The door is always open. Where would you like to go next?',
];

const PAGE_TIPS = {
  '/blueteam': [
    'Blue Team — The Cybersecurity Shield. Defend. Detect. Dominate.',
    'Detection engineering turns raw telemetry into decisions — identity, endpoint, cloud, and network signal in one operating picture.',
    'Incident response is measured in minutes. Containment paths should be rehearsed, never improvised.',
    'Threat hunting assumes breach. The only question is how fast you see it.',
    'A strong SOC measures dwell time and decision velocity — not ticket counts.',
  ],
  '/redteam': [
    'Red Team — Offensive Cybersecurity Operations. Strike first, strike smart.',
    'Penetration testing maps the breach paths defenders fear most — before someone else finds them.',
    'Social engineering tests the human layer: process, trust, and the gaps in between.',
    'Exploit validation beats vulnerability lists. Business impact is the metric.',
    'The strongest defense is informed by the logic of the adversary.',
  ],
  '/purpleteam': [
    'Purple Team — where offense proves defense, and defense sharpens offense.',
    'Continuous validation maps detections to MITRE ATT&CK so coverage is measured, not assumed.',
    'Every red team finding becomes a blue team detection. That is the loop.',
    'Blind spots are found by testing, not by trusting the dashboard.',
    'Coverage scoring turns security posture into a number leadership can track.',
  ],
  '/quantum': [
    'Quantum Computing — The Next Frontier of Cybersecurity and AI.',
    'Harvest-now-decrypt-later attacks are already underway. Data stolen today may be decrypted tomorrow.',
    'Cryptographic agility means swapping algorithms without re-architecting the business.',
    'Post-quantum migration starts with inventory: keys, certificates, and where they live.',
    'Quantum readiness is a roadmap, not a product — assess, prioritize, migrate, validate.',
  ],
  '/products': [
    "Welcome. Genstro Intelligence is the portal to next-generation AI. Enter once — and the future expands infinitely. I'm Qminds, your guide through the grid.",
    'GENSTRO SIEM correlates millions of events per second with adaptive threat scoring.',
    'REDSTRIKE runs continuous attack campaigns against your infrastructure — and reports exploitable paths.',
    'SHIELDWALL stops zero-day threats, ransomware, and fileless attacks before execution.',
    'QUANTUM VAULT brings post-quantum cryptography to data at rest, in transit, and in use.',
  ],
};

// Falls back to a flat badge if WebGL or the model fails to load.
class AvatarErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn('[Qminds] 3D avatar unavailable, showing badge:', error && error.message);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

const Qminds = () => {
  const location = useLocation();
  const isCompact = useMediaQuery('(max-width: 620px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const tips = useMemo(
    () => PAGE_TIPS[location.pathname] || DEFAULT_TIPS,
    [location.pathname]
  );

  const [tipIndex, setTipIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);   // panel visible next to avatar
  const [hidden, setHidden] = useState(false);        // whole widget dismissed
  const [spinKey, setSpinKey] = useState(0);          // bump to replay the spin jump

  // Reset the briefing on every page change
  useEffect(() => {
    setTipIndex(0);
    setPanelOpen(!isCompact);
    setSpinKey(k => k + 1);
  }, [location.pathname, isCompact]);

  const avatarSize = isCompact ? { width: 92, height: 130 } : { width: 120, height: 170 };
  const badge = (
    <span style={{ ...styles.badge, width: 76, height: 76 }}>Q</span>
  );

  // No widget on the home page (matches the reference design)
  if (location.pathname === '/') return null;

  // Dismissed state: tiny restore dot
  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => { setHidden(false); setPanelOpen(true); }}
        aria-label="Open Qminds AI"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(103,232,249,0.5)',
          background: 'rgba(4,9,13,0.95)',
          color: '#67e8f9',
          fontFamily: MONO,
          fontSize: '0.8rem',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: '0 0 20px rgba(103,232,249,0.3)',
        }}
      >
        Q
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 14,
      }}
    >
      {/* ─── Chat panel ─── */}
      {panelOpen && (
        <div
          role="dialog"
          aria-label="Qminds AI briefing"
          style={{
            width: 'min(300px, calc(100vw - 150px))',
            background: 'rgba(4, 9, 13, 0.96)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(103, 232, 249, 0.32)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.65)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.55rem 0.85rem',
            borderBottom: '1px solid rgba(103, 232, 249, 0.18)',
          }}>
            <span style={{
              fontFamily: MONO,
              fontSize: '0.66rem',
              letterSpacing: '0.26em',
              color: '#67e8f9',
            }}>
              QMINDS AI
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Minimize Qminds panel"
                style={styles.controlButton}
              >
                —
              </button>
              <button
                type="button"
                onClick={() => setHidden(true)}
                aria-label="Close Qminds"
                style={styles.controlButton}
              >
                ×
              </button>
            </span>
          </div>

          {/* Message */}
          <div style={{ padding: '0.9rem 0.95rem', minHeight: '64px' }}>
            <p style={{
              margin: 0,
              fontSize: '0.84rem',
              lineHeight: 1.65,
              color: 'rgba(226, 232, 240, 0.88)',
              fontFamily: "'Manrope', sans-serif",
            }}>
              {tips[tipIndex]}
            </p>
          </div>

          {/* Next tip */}
          <div style={{ padding: '0 0.95rem 0.9rem' }}>
            <button
              type="button"
              onClick={() => setTipIndex(i => (i + 1) % tips.length)}
              style={{
                fontFamily: MONO,
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#67e8f9',
                background: 'rgba(103, 232, 249, 0.08)',
                border: '1px solid rgba(103, 232, 249, 0.45)',
                borderRadius: '4px',
                padding: '0.45rem 0.9rem',
                cursor: 'pointer',
              }}
            >
              Next Tip ({tipIndex + 1}/{tips.length})
            </button>
          </div>
        </div>
      )}

      {/* ─── Avatar ─── */}
      <button
        type="button"
        onClick={() => {
          setPanelOpen(open => !open);
          setSpinKey(k => k + 1);
        }}
        aria-label={panelOpen ? 'Hide Qminds panel' : 'Show Qminds panel'}
        style={{
          ...avatarSize,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
      >
        <AvatarErrorBoundary fallback={badge}>
          <Suspense fallback={badge}>
            <QmindsAvatar {...avatarSize} spinKey={spinKey} reducedMotion={reducedMotion} />
          </Suspense>
        </AvatarErrorBoundary>
      </button>
    </div>
  );
};

const styles = {
  badge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: '50%',
    border: '2px solid rgba(103, 232, 249, 0.55)',
    background: 'rgba(4, 9, 13, 0.95)',
    boxShadow: '0 0 24px rgba(103, 232, 249, 0.35)',
    color: '#67e8f9',
    fontFamily: MONO,
    fontSize: '1.4rem',
  },
  controlButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(103, 232, 249, 0.8)',
    fontFamily: MONO,
    fontSize: '0.85rem',
    lineHeight: 1,
    cursor: 'pointer',
    padding: '0 0.3rem',
  },
};

export default Qminds;
