import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MONO = "'DM Mono', monospace";

// Links left of the Cybersecurity dropdown
const leftItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
];

// Links right of the Cybersecurity dropdown
const rightItems = [
  { path: '/products', label: 'Products' },
  { path: '/quantum', label: 'Quantum' },
  { path: '/rnd', label: 'R&D' },
  { path: '/contact', label: 'Contact' },
];

// Cybersecurity dropdown children
const cyberItems = [
  { path: '/redteam', label: 'Red Team' },
  { path: '/blueteam', label: 'Blue Team' },
  { path: '/purpleteam', label: 'Purple Team' },
];

const Navigation = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimerRef = useRef(null);

  const isCyberActive = cyberItems.some(i => location.pathname === i.path);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const openDropdown = useCallback(() => {
    clearTimeout(dropdownTimerRef.current);
    setDropdownOpen(true);
  }, []);

  const closeDropdownDelayed = useCallback(() => {
    dropdownTimerRef.current = setTimeout(() => setDropdownOpen(false), 200);
  }, []);

  // Gold pill on the active route, quiet mono text otherwise
  const linkStyle = (active) => ({
    color: active ? '#e8c076' : 'rgba(226,232,240,0.72)',
    textDecoration: 'none',
    fontFamily: MONO,
    fontSize: '0.68rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    padding: '0.5rem 0.85rem',
    borderRadius: '3px',
    background: active ? 'rgba(216,177,108,0.14)' : 'transparent',
    boxShadow: active ? 'inset 0 0 0 1px rgba(216,177,108,0.35)' : 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.25s ease, background 0.25s ease',
  });

  const NavLink = ({ path, label }) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        style={linkStyle(active)}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#f1f5f9'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(226,232,240,0.72)'; }}
      >
        {label}
      </Link>
    );
  };

  // Cybersecurity dropdown (desktop: hover+click, mobile: tap)
  const CyberDropdown = ({ mobile }) => (
    <div
      ref={!mobile ? dropdownRef : undefined}
      style={{ position: 'relative' }}
      onMouseEnter={!mobile ? openDropdown : undefined}
      onMouseLeave={!mobile ? closeDropdownDelayed : undefined}
    >
      <button
        onClick={() => setDropdownOpen(prev => !prev)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen}
        style={{
          ...linkStyle(isCyberActive),
          cursor: 'pointer',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        Cybersecurity
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.3s ease',
          transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          fontSize: '0.6rem',
        }}>▾</span>
      </button>

      {dropdownOpen && (
        <div
          style={mobile ? {
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '1rem',
            gap: '0.25rem',
            marginTop: '0.25rem',
          } : {
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.6rem',
            background: 'rgba(3, 8, 12, 0.97)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(103, 232, 249, 0.25)',
            borderRadius: '6px',
            padding: '0.4rem 0',
            minWidth: '170px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            zIndex: 1201,
          }}
        >
          {cyberItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...linkStyle(location.pathname === item.path),
                display: 'block',
                padding: '0.6rem 1.1rem',
                borderRadius: 0,
                fontSize: '0.65rem',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .gnav-links { display: flex !important; }
        .gnav-tagline { display: block !important; }
        .gnav-hamburger { display: none !important; }
        .gnav-mobile { display: none !important; }
        @media (max-width: 1080px) {
          .gnav-tagline { display: none !important; }
        }
        @media (max-width: 900px) {
          .gnav-links { display: none !important; }
          .gnav-hamburger { display: flex !important; }
          .gnav-mobile { display: flex !important; }
        }
      `}</style>

      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
        background: 'rgba(2, 6, 10, 0.92)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(103, 232, 249, 0.22)',
        zIndex: 1200,
      }}>
        {/* Brand */}
        <Link to="/" aria-label="Genstro Intelligence home" style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.7rem',
          textDecoration: 'none',
          marginRight: '2rem',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: '0.98rem',
            letterSpacing: '0.3em',
            color: '#4fd8e8',
          }}>
            GENSTRO
          </span>
          <span style={{
            fontFamily: MONO,
            fontSize: '0.5rem',
            letterSpacing: '0.28em',
            color: 'rgba(148, 163, 184, 0.65)',
            whiteSpace: 'nowrap',
          }}>
            INTELLIGENCE GROUP
          </span>
        </Link>

        {/* Tagline */}
        <span className="gnav-tagline" style={{
          fontFamily: MONO,
          fontSize: '0.58rem',
          letterSpacing: '0.28em',
          color: 'rgba(148, 163, 184, 0.55)',
          flex: 1,
          paddingLeft: '2.5rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
          INDEPENDENT / AI / SECURITY / FORESIGHT
        </span>

        {/* Desktop links */}
        <nav className="gnav-links" aria-label="Primary navigation" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          {leftItems.map(item => (
            <NavLink key={item.path} {...item} />
          ))}
          <CyberDropdown mobile={false} />
          {rightItems.map(item => (
            <NavLink key={item.path} {...item} />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="gnav-hamburger"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            flexDirection: 'column',
            gap: '5px',
            marginLeft: 'auto',
          }}
        >
          <span style={{
            display: 'block', width: '24px', height: '2px', background: '#4fd8e8',
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px', background: '#4fd8e8',
            transition: 'all 0.3s ease',
            opacity: mobileMenuOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block', width: '24px', height: '2px', background: '#4fd8e8',
            transition: 'all 0.3s ease',
            transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
          }} />
        </button>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className="gnav-mobile"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            flexDirection: 'column',
            gap: '0.35rem',
            padding: '1rem 2rem 1.5rem',
            background: 'rgba(2, 6, 10, 0.98)',
            borderBottom: '1px solid rgba(103, 232, 249, 0.22)',
            zIndex: 1199,
          }}
        >
          {leftItems.map(item => (
            <NavLink key={item.path} {...item} />
          ))}
          <CyberDropdown mobile={true} />
          {rightItems.map(item => (
            <NavLink key={item.path} {...item} />
          ))}
        </div>
      )}
    </>
  );
};

export default Navigation;