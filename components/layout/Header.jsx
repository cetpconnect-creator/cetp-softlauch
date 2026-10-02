import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SiteSwitcher from './SiteSwitcher';

export default function Header({ onToggleMobileMenu, onShowToast, vaagaUrl = '/vaaga' }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = router.pathname === '/';
  const navItems = [
    {
      label: (
        <>
          TECH<sup style={{ fontSize: '0.75em', textTransform: 'lowercase', marginLeft: '1px' }}>x</sup>
        </>
      ),
      path: '/tech'
    },
    { label: 'Workshops', path: '/workshops' },
    { label: 'Competitions', path: '/competitions' },
    { label: 'Passes', path: '/passes' },
    { label: 'Accommodation', path: '/accommodation' }
  ];

  return (
    <header className="header-nav visible">
      <div className="header-container">
        {/* Brand Section: Official 3D Fest Logo + Desktop Switcher */}
        <div className="header-brand-section">
          <Link href="/" className="header-logo-link" title="YUKTHI '26 - Home">
            <img
              src="/images/yukthi26-logo.png"
              alt="YUKTHI '26 Official Logo"
              className="header-logo-img"
              loading="eager"
            />
          </Link>

          {/* Apple Matte Design Switcher (Yukthi <-> Vaaga) - Visible on desktop, moves to Hamburger Menu on mobile */}
          <div className="site-switcher-desktop-wrapper">
            <SiteSwitcher
              currentSite="yukthi"
              vaagaUrl={vaagaUrl}
            />
          </div>
        </div>

        <nav className="nav-pill-menu" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              router.pathname === item.path ||
              (item.path === '/tech' && router.pathname.startsWith('/tech')) ||
              (item.path === '/workshops' && router.pathname.startsWith('/workshops')) ||
              (item.path === '/competitions' && router.pathname.startsWith('/competitions')) ||
              (item.path === '/events' && router.pathname.startsWith('/events'));

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions Pill: Desktop has Bell + Divider + Profile. Mobile keeps Bell + Hamburger Menu */}
        <div className="nav-actions">
          <button
            className="icon-btn header-bell-btn"
            onClick={() =>
              onShowToast
                ? onShowToast("🔔 YUKTHI X'26 Registrations are LIVE! Grab passes now.")
                : alert("🔔 YUKTHI X'26 Registrations are LIVE! Grab passes now.")
            }
            title="Announcements"
            aria-label="View announcements"
          >
            <span className="bell-icon-wrapper">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                <path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665"></path>
              </svg>
              <span className="bell-dot"></span>
            </span>
          </button>

          <div className="nav-divider desktop-only-divider"></div>

          {/* Desktop User Avatar (Moves to Hamburger Menu in mobile view) */}
          <button
            className="user-avatar-btn desktop-only-avatar"
            onClick={() =>
              onShowToast
                ? onShowToast('👤 Signed in as Dev Tester')
                : alert('👤 Signed in as Dev Tester')
            }
            title="User Profile (Dev Tester)"
            aria-label="User profile"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>

          {/* Mobile Hamburger Menu Button (Matching Screenshot 2 circle pill) */}
          <button
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3.5" y1="7" x2="20.5" y2="7"></line>
              <line x1="3.5" y1="12" x2="20.5" y2="12"></line>
              <line x1="3.5" y1="17" x2="20.5" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
