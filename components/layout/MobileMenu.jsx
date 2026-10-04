import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SiteSwitcher from './SiteSwitcher';

export default function MobileMenu({ isOpen, onClose, onShowToast, vaagaUrl = '/vaaga' }) {
  const router = useRouter();

  const navItems = [
    {
      label: (
        <>
          TECH<sup style={{ fontSize: '0.75em', textTransform: 'lowercase', marginLeft: '1px' }}>x</sup>
          <span className="mobile-nav-featured-badge">FEATURED</span>
        </>
      ),
      path: '/tech',
      featured: true
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed backdrop to close on outside tap */}
      <div className="mobile-nav-backdrop" onClick={onClose} aria-hidden="true" />

      <div
        className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Switcher & Close button header */}
        <div className="mobile-nav-header">
          <SiteSwitcher currentSite="yukthi" vaagaUrl={vaagaUrl} onSwitch={onClose} />
          <button
            onClick={onClose}
            className="mobile-nav-close-btn"
            aria-label="Close menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation links list */}
        <div className="mobile-nav-list">
          {navItems.map((item) => {
            const isActive =
              router.pathname === item.path ||
              (item.path === '/tech' && router.pathname.startsWith('/tech'));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`mobile-nav-item ${isActive ? 'active' : ''} ${
                  item.featured ? 'mobile-nav-item--featured' : ''
                }`}
                onClick={onClose}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User profile (Dev Tester) section - moved from front header to hamburger menu */}
        <div className="mobile-nav-footer">
          <button
            className="mobile-nav-profile-card"
            onClick={() => {
              if (onShowToast) {
                onShowToast('👤 Signed in as Dev Tester');
              } else {
                alert('👤 Signed in as Dev Tester');
              }
              onClose();
            }}
            title="User Profile (Dev Tester)"
            aria-label="User profile"
          >
            <div className="mobile-profile-avatar">
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
            </div>
            <div className="mobile-profile-details">
              <span className="mobile-profile-name">Dev Tester</span>
              <span className="mobile-profile-status">
                <span className="profile-status-dot"></span>
                NIT Calicut • Verified
              </span>
            </div>
            <div className="mobile-profile-action">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
