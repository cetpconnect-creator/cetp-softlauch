import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function MobileMenu({ isOpen, onClose }) {
  const router = useRouter();

  const navItems = [
    { label: 'WORKSHOPS', path: '/workshops' },
    { label: 'COMPETITIONS', path: '/competitions' },
    { label: 'PASSES', path: '/passes' },
    { label: 'LECTURES', path: '/lectures' },
    { label: 'ACCOMMODATION', path: '/accommodation' }
  ];

  if (!isOpen) return null;

  return (
    <div className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}>
      <div className="mobile-nav-header" style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
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
