import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import SiteSwitcher from './SiteSwitcher';

export default function MobileMenu({ isOpen, onClose, vaagaUrl = '/vaaga' }) {
  const router = useRouter();

  const navItems = [
    {
      label: (
        <>
          TECH<sup style={{ fontSize: '0.75em', textTransform: 'lowercase', marginLeft: '1px' }}>x</sup>
        </>
      ),
      path: '/tech'
    },
    { label: 'WORKSHOPS', path: '/workshops' },
    { label: 'COMPETITIONS', path: '/competitions' },
    { label: 'PASSES', path: '/passes' },
    { label: 'ACCOMMODATION', path: '/accommodation' }
  ];

  if (!isOpen) return null;

  return (
    <div className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}>
      <div className="mobile-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <SiteSwitcher vaagaUrl={vaagaUrl} onSwitch={onClose} />
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      {navItems.map((item) => {
        const isActive = router.pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
