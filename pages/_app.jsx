import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import MobileMenu from '../components/layout/MobileMenu';
import Footer from '../components/layout/Footer';
import StarfieldCanvas from '../components/common/StarfieldCanvas';

import '../styles/globals.css';
import '../styles/techx.css';
import '../styles/vaaga.css';
import '../styles/yukthi.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [toasts, setToasts] = useState([]);

  const isHome = router.pathname === '/';
  const isTech = router.pathname.startsWith('/tech');
  const isVaaga = router.pathname.startsWith('/vaaga');
  const isYukthi = router.pathname.startsWith('/yukthi');

  useEffect(() => {
    // Always close Yukthi mobile menu when moving to another page.
    setMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  }, [router.asPath]);

  const showToast = (message) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message }
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 3500);
  };

  const handleMobileClose = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  return (
    <div
      className={`site-wrapper ${isVaaga ? 'is-vaaga-route' : ''}`}
    >
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          {isVaaga
            ? "VAAGA'26.2.0 | Arts Day"
            : isYukthi
            ? "YUKTHI X'26 | National Techno-Management Conclave"
            : "YUKTHI X'26 | National Techno-Management Fest"}
        </title>
      </Head>


      {/* Other YUKTHI subpages only */}
      {!isHome && !isTech && !isVaaga && !isYukthi && (
        <>
          <img
            src="/images/milky_way_bg.jpg"
            alt=""
            className="galaxy-img-bg"
            id="galaxy-bg"
          />
          <StarfieldCanvas
            isLowPower={isLowPower}
          />
        </>
      )}

      {/* YUKTHI shared Header only */}
      {!isTech && !isVaaga && !isYukthi && (
        <>
          <Header
            onToggleMobileMenu={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            onShowToast={showToast}
            vaagaUrl="/vaaga"
          />

          <MobileMenu
            isOpen={mobileMenuOpen}
            onClose={handleMobileClose}
            onShowToast={showToast}
            vaagaUrl="/vaaga"
          />
        </>
      )}

      {/* Page */}
      <main
        className={`main-content ${isHome ? 'home-main-content' : ''
          } ${isTech ? 'tech-main-content' : ''
          } ${isVaaga ? 'vaaga-main-content' : ''
          } ${isYukthi ? 'yukthi-main-content' : ''
          }`}
      >
        <div
          key={router.asPath}
          className={
            isTech
              ? 'tech-transition-wrapper'
              : isVaaga
              ? 'vaaga-transition-wrapper'
              : isYukthi
              ? 'yukthi-transition-wrapper'
              : 'page-transition-wrapper'
          }
        >
          <Component
            {...pageProps}
            showToast={showToast}
            onToast={showToast}
            isLowPower={isLowPower}
          />
        </div>
      </main>

      {/* YUKTHI footer only */}
      {!isTech && !isVaaga && !isYukthi && <Footer />}

      {/* YUKTHI floating power button only */}
      {!isTech && !isVaaga && !isYukthi && (
        <button
          id="low-power-btn"
          className={`floating-power-btn ${isLowPower ? 'active' : ''
            }`}
          title={
            isLowPower
              ? 'Disable Low Power Mode'
              : 'Enable Low Power Mode'
          }
          onClick={() => {
            const next = !isLowPower;
            setIsLowPower(next);

            showToast(
              next
                ? '⚡ Low Power Mode Enabled.'
                : '✨ High Performance Mode Enabled.'
            );
          }}
          aria-label="Toggle low power mode"
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
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </button>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
