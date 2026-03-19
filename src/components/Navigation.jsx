import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimerRef = useRef(null);

  // Top-level nav items (Cybersecurity is a dropdown, not a direct link)
  const topItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/quantum', label: 'Quantum' },
    { path: '/contact', label: 'Contact' },
  ];

  // Cybersecurity dropdown children
  const cyberItems = [
    { path: '/redteam', label: 'Red Team' },
    { path: '/blueteam', label: 'Blue Team' },
    { path: '/purpleteam', label: 'Purple Team' },
  ];

  const isCyberActive = cyberItems.some(i => location.pathname === i.path);

  // Close dropdown on outside click (touch-friendly for mobile/tablet)
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close on Escape key (accessibility)
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

  // Hover handlers with delay to prevent flicker (desktop)
  const openDropdown = useCallback(() => {
    clearTimeout(dropdownTimerRef.current);
    setDropdownOpen(true);
  }, []);

  const closeDropdownDelayed = useCallback(() => {
    dropdownTimerRef.current = setTimeout(() => setDropdownOpen(false), 200);
  }, []);

  // Shared link style generator
  const linkStyle = (active) => ({
    color: '#67e8f9',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: active ? 'bold' : 'normal',
    opacity: active ? 1 : 0.7,
    transition: 'all 0.3s ease',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    background: active ? 'rgba(103, 232, 249, 0.1)' : 'transparent',
    whiteSpace: 'nowrap',
  });

  // Hamburger icon (pure CSS, no external assets)
  const HamburgerIcon = () => (
    <button
      onClick={() => setMobileMenuOpen(prev => !prev)}
      aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={mobileMenuOpen}
      style={{
        display: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0.5rem',
        flexDirection: 'column',
        gap: '5px',
      }}
      className="nav-hamburger"
    >
      <span style={{
        display: 'block', width: '24px', height: '2px', background: '#67e8f9',
        transition: 'all 0.3s ease',
        transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
      }} />
      <span style={{
        display: 'block', width: '24px', height: '2px', background: '#67e8f9',
        transition: 'all 0.3s ease',
        opacity: mobileMenuOpen ? 0 : 1,
      }} />
      <span style={{
        display: 'block', width: '24px', height: '2px', background: '#67e8f9',
        transition: 'all 0.3s ease',
        transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
      }} />
    </button>
  );

  // Render a single nav link
  const NavLink = ({ path, label }) => {
    const active = location.pathname === path;
    return (
      <Link
        to={path}
        style={linkStyle(active)}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = active ? '1' : '0.7'; }}
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
          fontFamily: 'inherit',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = isCyberActive ? '1' : '0.7'; }}
      >
        Cybersecurity
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.3s ease',
          transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          fontSize: '0.65rem',
        }}>▼</span>
      </button>

      {/* Dropdown panel */}
      {dropdownOpen && (
        <div
          style={mobile ? {
            /* Mobile: inline expansion */
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '1rem',
            gap: '0.25rem',
            marginTop: '0.25rem',
          } : {
            /* Desktop: floating panel positioned left-to-right */
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.5rem',
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(103, 232, 249, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 0',
            minWidth: '160px',
            boxShadow: '0 8px 32px rgba(103, 232, 249, 0.15)',
            zIndex: 1001,
          }}
        >
          {cyberItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...linkStyle(location.pathname === item.path),
                display: 'block',
                padding: '0.6rem 1.2rem',
                borderRadius: 0,
                fontSize: '0.85rem',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.background = 'rgba(103, 232, 249, 0.08)';
              }}
              onMouseLeave={e => {
                const active = location.pathname === item.path;
                e.currentTarget.style.opacity = active ? '1' : '0.7';
                e.currentTarget.style.background = active ? 'rgba(103, 232, 249, 0.1)' : 'transparent';
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
      {/* Responsive CSS — injected once via <style> tag */}
      <style>{`
        .nav-hamburger {
          display: none !important;
        }
        .nav-desktop-links {
          display: flex !important;
        }
        .nav-mobile-menu {
          display: none !important;
        }
        @media (max-width: 768px) {
          .nav-hamburger {
            display: flex !important;
          }
          .nav-desktop-links {
            display: none !important;
          }
          .nav-mobile-menu {
            display: flex !important;
          }
        }
      `}</style>

      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #67e8f9',
        zIndex: 1000,
        padding: '1rem 2rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Brand */}
          <Link to="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#67e8f9',
            textDecoration: 'none',
            textShadow: '0 0 10px #67e8f9',
          }}>
            GENSTRO
          </Link>

          {/* Desktop nav links (left → right across) */}
          <div
            className="nav-desktop-links"
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {topItems.slice(0, 2).map(item => (
              <NavLink key={item.path} {...item} />
            ))}
            <CyberDropdown mobile={false} />
            {topItems.slice(2).map(item => (
              <NavLink key={item.path} {...item} />
            ))}
          </div>

          {/* Mobile hamburger */}
          <HamburgerIcon />
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div
            className="nav-mobile-menu"
            style={{
              flexDirection: 'column',
              gap: '0.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(103, 232, 249, 0.2)',
              marginTop: '1rem',
            }}
          >
            {topItems.slice(0, 2).map(item => (
              <NavLink key={item.path} {...item} />
            ))}
            <CyberDropdown mobile={true} />
            {topItems.slice(2).map(item => (
              <NavLink key={item.path} {...item} />
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;