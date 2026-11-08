import React, { Component, Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { askQminds, categoryForRoute, moveForRoute, suggestionsFor, tipsForRoute } from '../services/qmindsBrain';

const QmindsAvatar = lazy(() => import('./QmindsAvatar'));

const MONO = "'DM Mono', monospace";
const SANS = "'Manrope', sans-serif";
const CYAN = '#67e8f9';

const WALK_IN_PX = 90;       // how far right of his spot Qminds starts his walk-in (clipped by his box)
const WALK_IN_MS = 1500;
const MIN_THINK_MS = 650;    // keep the thinking pose visible even for instant local answers
const NAVIGATE_DELAY_MS = 900;
const CLICK_MOVE_WINDOW_MS = 2000; // a page change this soon after a category click doesn't repeat the move
const MENU_MOVE = 'scan';          // opening a category menu (e.g. Cybersecurity)
const MAX_MESSAGES = 40;

/*
 * QMINDS AI — floating briefing + chat widget
 * 3D robot avatar (public/models/qminds.glb) anchored bottom-right, beside a chat panel.
 * Hidden on the home page. On each page Qminds posts a briefing and performs that
 * category's move; visitors can chat, ask him to navigate, or ask for a move.
 */

const DOTS_KEYFRAMES = `
@keyframes qminds-dot { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
`;

let messageId = 0;
const makeMessage = (from, text) => ({ id: ++messageId, from, text });

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

// Reveals text a few characters at a time while Qminds "speaks" it.
function Typewriter({ text, active, onDone, onTick }) {
  const [shown, setShown] = useState(active ? 0 : text.length);
  const callbacks = useRef({ onDone, onTick });
  callbacks.current = { onDone, onTick };

  useEffect(() => {
    if (!active) {
      setShown(text.length);
      return undefined;
    }
    let count = 0;
    const step = Math.max(1, Math.round(text.length / 110));
    const timer = setInterval(() => {
      count = Math.min(text.length, count + step);
      setShown(count);
      if (callbacks.current.onTick) callbacks.current.onTick();
      if (count >= text.length) {
        clearInterval(timer);
        if (callbacks.current.onDone) callbacks.current.onDone();
      }
    }, 24);
    return () => clearInterval(timer);
  }, [text, active]);

  return (
    <>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      <span style={styles.srOnly}>{text}</span>
    </>
  );
}

const Qminds = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const route = location.pathname;
  const isCompact = useMediaQuery('(max-width: 620px)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const tips = useMemo(() => tipsForRoute(route), [route]);

  const [tipIndex, setTipIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(() => !window.matchMedia('(max-width: 620px)').matches);
  const [hidden, setHidden] = useState(false);
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState(() => suggestionsFor(route));
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [typingId, setTypingId] = useState(null);
  const [move, setMove] = useState({ name: null, id: 0 });
  const [walkIn, setWalkIn] = useState('idle'); // idle → start → walking → done

  const visible = route !== '/' && !hidden;
  const routeRef = useRef(route);
  routeRef.current = route;
  const walkInRef = useRef(walkIn);
  walkInRef.current = walkIn;
  const briefedRoute = useRef(null);
  const clickedCategory = useRef(null); // { category, at } from the last category click
  const pointer = useRef({ x: -0.6, y: -0.5 });
  const avatarRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef([]);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const perform = useCallback(name => {
    if (name) setMove(m => ({ name, id: m.id + 1 }));
  }, []);

  const say = useCallback(text => {
    const message = makeMessage('qminds', text);
    setMessages(list => [...list.slice(-(MAX_MESSAGES - 1)), message]);
    setTypingId(reducedMotion ? null : message.id);
  }, [reducedMotion]);

  const scrollToEnd = useCallback(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, []);

  // New page: brief on it and perform the category's move.
  useEffect(() => {
    if (briefedRoute.current === route) return; // also absorbs StrictMode's double effect
    briefedRoute.current = route;
    if (route === '/') return;
    setTipIndex(0);
    setSuggestions(suggestionsFor(route));
    say(tipsForRoute(route)[0]);
    const clicked = clickedCategory.current;
    const alreadyMoved = clicked && clicked.category === categoryForRoute(route) && Date.now() - clicked.at < CLICK_MOVE_WINDOW_MS;
    if (walkInRef.current === 'done' && !alreadyMoved) perform(moveForRoute(route));
  }, [route, say, perform]);

  // Show the category's move the moment a category is clicked — even the page you're on,
  // and category menus like Cybersecurity — instead of waiting for the page to change.
  useEffect(() => {
    if (!visible) return undefined;
    const onClick = event => {
      if (walkInRef.current !== 'done' || !event.target.closest) return;
      const link = event.target.closest('a[href]');
      if (link) {
        const url = new URL(link.href, window.location.href);
        const category = url.origin === window.location.origin && categoryForRoute(url.pathname);
        if (!category || category.route === '/') return;
        clickedCategory.current = { category, at: Date.now() };
        perform(category.move);
        return;
      }
      const menu = event.target.closest('button[aria-haspopup]');
      if (menu && !(avatarRef.current && avatarRef.current.parentElement.contains(menu))) perform(MENU_MOVE);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [visible, perform]);

  useEffect(() => {
    setPanelOpen(!isCompact);
  }, [isCompact]);

  // The avatar unmounts while hidden; walk in again when it comes back.
  useEffect(() => {
    if (!visible) setWalkIn('idle');
  }, [visible]);

  // Walk in from the right once the model is on screen, then do the page's move.
  const onAvatarReady = useCallback(() => {
    if (reducedMotion) {
      setWalkIn('done');
      return;
    }
    setWalkIn('start');
    requestAnimationFrame(() => requestAnimationFrame(() => setWalkIn('walking')));
    later(() => {
      setWalkIn('done');
      perform(moveForRoute(routeRef.current));
    }, WALK_IN_MS);
  }, [reducedMotion, later, perform]);

  // Head follows the cursor.
  useEffect(() => {
    if (!visible) return undefined;
    const onMove = event => {
      const box = avatarRef.current && avatarRef.current.getBoundingClientRect();
      if (!box) return;
      pointer.current = {
        x: (event.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2),
        y: (event.clientY - (box.top + box.height * 0.25)) / (window.innerHeight / 2),
      };
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [visible]);

  useEffect(scrollToEnd, [messages, thinking, panelOpen, scrollToEnd]);

  const nextTip = () => {
    const index = (tipIndex + 1) % tips.length;
    setTipIndex(index);
    say(tips[index]);
  };

  const send = async raw => {
    const text = raw.trim();
    if (!text || thinking) return;
    setDraft('');
    setTypingId(null);
    setMessages(list => [...list.slice(-(MAX_MESSAGES - 1)), makeMessage('user', text)]);
    setThinking(true);
    const asked = Date.now();
    const askedOn = routeRef.current;

    let answer;
    try {
      answer = await askQminds({ message: text, route: askedOn });
    } catch {
      answer = { text: 'My signal dropped for a moment. Try that again?', suggestions: suggestionsFor(askedOn) };
    }
    const wait = MIN_THINK_MS - (Date.now() - asked);
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));

    setThinking(false);
    say(answer.text);
    setSuggestions(answer.suggestions || suggestionsFor(askedOn));
    if (answer.move) perform(answer.move);
    if (answer.navigate && answer.navigate !== routeRef.current) {
      later(() => navigate(answer.navigate), NAVIGATE_DELAY_MS);
    }
  };

  const onSubmit = event => {
    event.preventDefault();
    send(draft);
  };

  if (route === '/') return null;

  // Dismissed state: tiny restore dot
  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => { setHidden(false); setPanelOpen(true); }}
        aria-label="Open Qminds AI"
        style={styles.restore}
      >
        Q
      </button>
    );
  }

  const avatarSize = isCompact ? { width: 92, height: 130 } : { width: 120, height: 170 };
  const walkStyle = walkIn === 'start'
    ? { transform: `translateX(${WALK_IN_PX}px)`, transition: 'none' }
    : walkIn === 'walking'
      ? { transform: 'translateX(0)', transition: `transform ${WALK_IN_MS}ms linear` }
      : null;
  const badge = <span style={{ ...styles.badge, width: 76, height: 76 }}>Q</span>;
  const chips = [`Next tip (${((tipIndex + 1) % tips.length) + 1}/${tips.length})`, ...suggestions];

  return (
    <div style={styles.dock}>
      <style>{DOTS_KEYFRAMES}</style>

      {/* ─── Chat panel ─── */}
      {panelOpen && (
        <div
          role="dialog"
          aria-label="Qminds AI chat"
          style={{ ...styles.panel, width: isCompact ? 'calc(100vw - 140px)' : 'min(330px, calc(100vw - 156px))' }}
        >
          <div style={styles.header}>
            <span style={styles.title}>QMINDS AI</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
              <button type="button" onClick={() => setPanelOpen(false)} aria-label="Minimize Qminds panel" style={styles.controlButton}>—</button>
              <button type="button" onClick={() => setHidden(true)} aria-label="Close Qminds" style={styles.controlButton}>×</button>
            </span>
          </div>

          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation with Qminds"
            style={{ ...styles.list, maxHeight: isCompact ? 190 : 250 }}
          >
            {messages.map(message => (
              <div key={message.id} style={message.from === 'user' ? styles.userBubble : styles.qmindsBubble}>
                {message.from === 'qminds' ? (
                  <Typewriter
                    text={message.text}
                    active={message.id === typingId}
                    onTick={scrollToEnd}
                    onDone={() => setTypingId(id => (id === message.id ? null : id))}
                  />
                ) : message.text}
              </div>
            ))}
            {thinking && (
              <div style={{ ...styles.qmindsBubble, display: 'flex', gap: 4, alignItems: 'center' }} aria-label="Qminds is thinking">
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ ...styles.dot, animation: `qminds-dot 1s ${i * 0.15}s infinite ease-in-out` }} />
                ))}
              </div>
            )}
          </div>

          <div style={styles.chips}>
            {chips.map((chip, i) => (
              <button
                key={`${i}-${chip}`}
                type="button"
                disabled={thinking}
                onClick={() => (i === 0 ? nextTip() : send(chip))}
                style={styles.chip}
              >
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} style={styles.form}>
            <input
              ref={inputRef}
              value={draft}
              onChange={event => setDraft(event.target.value)}
              maxLength={500}
              placeholder={thinking ? 'Qminds is thinking…' : 'Ask Qminds anything…'}
              aria-label="Message Qminds"
              style={styles.input}
            />
            <button type="submit" disabled={thinking || !draft.trim()} aria-label="Send message" style={styles.send}>
              ↑
            </button>
          </form>
        </div>
      )}

      {/* ─── Avatar ─── */}
      <button
        ref={avatarRef}
        type="button"
        onClick={() => {
          setPanelOpen(open => !open);
          perform('spin');
        }}
        aria-label={panelOpen ? 'Hide Qminds panel' : 'Show Qminds panel'}
        style={{ ...styles.avatar, ...avatarSize }}
      >
        {/* The walk-in slides inside this clipped box; moving past the screen edge would widen the page on phones. */}
        <span style={{ ...styles.avatarStage, ...walkStyle }}>
          <AvatarErrorBoundary fallback={badge}>
            <Suspense fallback={badge}>
              <QmindsAvatar
                {...avatarSize}
                move={move}
                walking={walkIn === 'start' || walkIn === 'walking'}
                talking={typingId !== null}
                thinking={thinking}
                pointer={pointer}
                reducedMotion={reducedMotion}
                onReady={onAvatarReady}
              />
            </Suspense>
          </AvatarErrorBoundary>
        </span>
      </button>
    </div>
  );
};

const styles = {
  dock: {
    position: 'fixed',
    right: 20,
    bottom: 20,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 14,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    background: 'rgba(4, 9, 13, 0.96)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(103, 232, 249, 0.32)',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.65)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.55rem 0.85rem',
    borderBottom: '1px solid rgba(103, 232, 249, 0.18)',
  },
  title: {
    fontFamily: MONO,
    fontSize: '0.66rem',
    letterSpacing: '0.26em',
    color: CYAN,
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
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0.8rem 0.85rem 0.4rem',
    overflowY: 'auto',
    minHeight: 64,
  },
  qmindsBubble: {
    alignSelf: 'flex-start',
    maxWidth: '92%',
    padding: '0.5rem 0.65rem',
    borderLeft: `2px solid ${CYAN}`,
    background: 'rgba(103, 232, 249, 0.06)',
    borderRadius: '0 6px 6px 0',
    fontFamily: SANS,
    fontSize: '0.82rem',
    lineHeight: 1.6,
    color: 'rgba(226, 232, 240, 0.9)',
  },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    padding: '0.45rem 0.65rem',
    background: 'rgba(103, 232, 249, 0.16)',
    border: '1px solid rgba(103, 232, 249, 0.3)',
    borderRadius: '6px 6px 0 6px',
    fontFamily: SANS,
    fontSize: '0.82rem',
    lineHeight: 1.5,
    color: '#e2e8f0',
    overflowWrap: 'anywhere',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: CYAN,
    display: 'inline-block',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    padding: '0.35rem 0.85rem 0.6rem',
  },
  chip: {
    fontFamily: MONO,
    fontSize: '0.56rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: CYAN,
    background: 'rgba(103, 232, 249, 0.08)',
    border: '1px solid rgba(103, 232, 249, 0.4)',
    borderRadius: '4px',
    padding: '0.35rem 0.55rem',
    cursor: 'pointer',
    textAlign: 'left',
  },
  form: {
    display: 'flex',
    gap: '0.4rem',
    padding: '0.55rem 0.7rem',
    borderTop: '1px solid rgba(103, 232, 249, 0.18)',
  },
  input: {
    flex: 1,
    minWidth: 0,
    background: 'rgba(103, 232, 249, 0.05)',
    border: '1px solid rgba(103, 232, 249, 0.25)',
    borderRadius: '6px',
    padding: '0.5rem 0.6rem',
    color: '#e2e8f0',
    fontFamily: SANS,
    fontSize: '0.82rem',
    outline: 'none',
  },
  send: {
    width: 34,
    flexShrink: 0,
    background: 'rgba(103, 232, 249, 0.15)',
    border: '1px solid rgba(103, 232, 249, 0.5)',
    borderRadius: '6px',
    color: CYAN,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  avatar: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
    overflow: 'hidden',
  },
  avatarStage: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: '50%',
    border: '2px solid rgba(103, 232, 249, 0.55)',
    background: 'rgba(4, 9, 13, 0.95)',
    boxShadow: '0 0 24px rgba(103, 232, 249, 0.35)',
    color: CYAN,
    fontFamily: MONO,
    fontSize: '1.4rem',
  },
  restore: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid rgba(103,232,249,0.5)',
    background: 'rgba(4,9,13,0.95)',
    color: CYAN,
    fontFamily: MONO,
    fontSize: '0.8rem',
    cursor: 'pointer',
    zIndex: 9999,
    boxShadow: '0 0 20px rgba(103,232,249,0.3)',
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};

export default Qminds;
