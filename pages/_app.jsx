import React, { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import MobileMenu from '../components/layout/MobileMenu';
import Footer from '../components/layout/Footer';
import StarfieldCanvas from '../components/common/StarfieldCanvas';
import '../styles/globals.css';
import '../components/GalaxyScene/GalaxyScene.css';

// Dynamically import GalaxyScene with ssr: false for Three.js client-side rendering
const GalaxyScene = dynamic(() => import('../components/GalaxyScene/GalaxyScene'), {
  ssr: false
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [toasts, setToasts] = useState([]);

  const isHome = router.pathname === '/';

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <div className="site-wrapper">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>YUKTHI X'26 | National Techno-Management Fest</title>
        <meta
          name="description"
          content="Official website of YUKTHI X'26, the annual techno-management festival of NIT Calicut. Explore competitions, workshops, passes, and lectures."
        />
      </Head>

      {/* Background Three.js 3D Golden Particle Galaxy for Home Page */}
      {isHome && <GalaxyScene />}

      {/* Background Milky Way & Starfield Canvas for Subpages */}
      {!isHome && (
        <>
          <img
            src="/images/milky_way_bg.jpg"
            alt="Milky Way Galaxy Background"
            className="galaxy-img-bg"
            id="galaxy-bg"
            onError={(e) => {
              e.currentTarget.src = 'https://tathva.org/images/milky_way_bg.jpg';
            }}
          />
          <StarfieldCanvas isLowPower={isLowPower} />
        </>
      )}

      {/* Fixed Navigation Header */}
      <Header
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onShowToast={showToast}
      />

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Page Content */}
      <main className={`main-content ${isHome ? 'home-main-content' : ''}`}>
        <div key={router.asPath} className="page-transition-wrapper">
          <Component {...pageProps} onToast={showToast} isLowPower={isLowPower} />
        </div>
      </main>

      {/* Official Footer */}
      <Footer />

      {/* Floating Low Power Mode Toggle Button */}
      <button
        id="low-power-btn"
        className={`floating-power-btn ${isLowPower ? 'active' : ''}`}
        title={isLowPower ? 'Disable Low Power Mode' : 'Enable Low Power Mode (CSS Only)'}
        onClick={() => {
          setIsLowPower(!isLowPower);
          showToast(
            !isLowPower
              ? '⚡ Low Power Mode Enabled: Canvas animations paused.'
              : '✨ High Performance Mode: Starfield & Warp active.'
          );
        }}
        aria-label="Toggle low power mode"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </button>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
