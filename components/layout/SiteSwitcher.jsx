import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * SiteSwitcher
 * Seamless interactive capsule switcher between YUKTHI and VAAGA.
 * Supports smooth sliding glider, reactive status glow, and tactile transitions.
 */
export default function SiteSwitcher({
  currentSite = 'yukthi',
  vaagaUrl = '/vaaga',
  yukthiUrl = '/',
  onSwitch
}) {
  const router = useRouter();
  const [activeSite, setActiveSite] = useState(currentSite);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const isVaaga = router.pathname.startsWith('/vaaga');
    setActiveSite(isVaaga ? 'vaaga' : 'yukthi');
  }, [router.pathname]);

  const handleSwitch = (site) => {
    if (isSwitching) return;

    // Check if user is already on the selected site
    const isAlreadyOnSite =
      site === 'vaaga'
        ? router.pathname.startsWith('/vaaga')
        : (router.pathname === '/' || router.pathname === yukthiUrl);

    if (isAlreadyOnSite) {
      if (site === 'yukthi' && router.pathname !== '/' && router.pathname !== yukthiUrl) {
        router.push(yukthiUrl);
      }
      return;
    }

    const target = site === 'vaaga' ? vaagaUrl : yukthiUrl;

    setActiveSite(site);
    setIsSwitching(true);
    onSwitch?.(site);

    // Tactile delay allowing the smooth sliding glider animation to finish before page change
    window.setTimeout(() => {
      router.push(target).finally(() => {
        setIsSwitching(false);
      });
    }, 180);
  };

  return (
    <div className="site-switcher-wrapper" role="region" aria-label="Fest Switcher">
      <div
        className={`nav-switcher apple-matte-switcher ${isSwitching ? 'is-switching' : ''}`}
        role="tablist"
        aria-label="Switch between YUKTHI and VAAGA"
      >
        {/* Animated sliding highlight glider */}
        <div
          className={`nav-switcher__glider switcher-glider ${
            activeSite === 'vaaga'
              ? 'nav-switcher__glider--vaaga glider-vaaga'
              : 'nav-switcher__glider--yukthi glider-yukthi'
          }`}
          aria-hidden="true"
        />

        {/* YUKTHI Option */}
        <button
          type="button"
          role="tab"
          aria-selected={activeSite === 'yukthi'}
          className={`nav-switcher__item switcher-tab ${
            activeSite === 'yukthi' ? 'nav-switcher__item--active is-active' : ''
          }`}
          onClick={() => handleSwitch('yukthi')}
          title="YUKTHI X'26 - National Techno-Management Fest"
        >
          <span
            className="nav-switcher__dot nav-switcher__dot--yukthi tab-indicator dot-yukthi"
            aria-hidden="true"
          />
          <span className="tab-label">YUKTHI</span>
        </button>

        {/* VAAGA Option */}
        <button
          type="button"
          role="tab"
          aria-selected={activeSite === 'vaaga'}
          className={`nav-switcher__item switcher-tab ${
            activeSite === 'vaaga' ? 'nav-switcher__item--active is-active' : ''
          }`}
          onClick={() => handleSwitch('vaaga')}
          title="VAAGA'26.2.0 - Arts Day"
        >
          <span
            className="nav-switcher__dot nav-switcher__dot--vaaga tab-indicator dot-vaaga"
            aria-hidden="true"
          />
          <span className="tab-label">VAAGA</span>
          <span
            className={`switcher-arrow external-arrow ${activeSite === 'vaaga' ? 'arrow-hidden' : ''}`}
            aria-hidden="true"
          >
            ↗
          </span>
        </button>
      </div>
    </div>
  );
}

