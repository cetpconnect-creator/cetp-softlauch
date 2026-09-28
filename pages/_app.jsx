import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import MobileMenu from '../components/layout/MobileMenu';
import Footer from '../components/layout/Footer';
import StarfieldCanvas from '../components/common/StarfieldCanvas';
import IntroScene from '../components/intro/IntroScene';
import '../styles/globals.css';
import '../components/GalaxyScene/GalaxyScene.css';
import '../components/intro/IntroScene.css';

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

  // Intro video: plays on the home page, once per browser session
  const [introState, setIntroState] = useState('pending'); // pending | playing | done
  const [justRevealed, setJustRevealed] = useState(false);

  useEffect(() => {
    if (introState !== 'pending') return;
    let seen = false;
    try { seen = sessionStorage.getItem('cetp-intro-seen') === '1'; } catch (e) {}
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Only the home page gets the intro; a direct visit to a subpage skips it
    setIntroState(isHome && !seen && !reduced ? 'playing' : 'done');
  }, [introState, isHome]);

  useEffect(() => {
    document.body.classList.toggle('intro-active', introState === 'playing' || (introState === 'pending' && isHome));
    return () => document.body.classList.remove('intro-active');
  }, [introState, isHome]);

  const handleIntroDone = useCallback(() => {
    try { sessionStorage.setItem('cetp-intro-seen', '1'); } catch (e) {}
    setIntroState('done');
    setJustRevealed(true);
    setTimeout(() => setJustRevealed(false), 1600);
  }, []);

  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <div className={`site-wrapper ${justRevealed ? 'intro-reveal' : ''}`}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>YUKTHI X'26 | National Techno-Management Fest</title>
        <meta
          name="description"
          content="Official website of YUKTHI X'26, the annual techno-management festival. Explore competitions, workshops, passes, and lectures."
        />
      </Head>

      {/* Cinematic intro (black cover while checking, then video) */}
      {isHome && introState === 'pending' && <div className="intro-overlay" />}
      {isHome && introState === 'playing' && <IntroScene onDone={handleIntroDone} />}

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
        vaagaUrl="http://localhost:3001"
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
