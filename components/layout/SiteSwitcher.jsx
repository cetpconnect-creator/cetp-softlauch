import React, { useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Apple Matte Design Site Switcher
 * Provides a tactile, frosted-matte segmented pill control to switch between YUKTHI and VAAGA sites.
 */
export default function SiteSwitcher({
  currentSite = 'yukthi',
  vaagaUrl = 'https://vaaga.in',
  yukthiUrl = '/',
  onSwitch
}) {
  const router = useRouter();
  const [activeSite, setActiveSite] = useState(currentSite);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = (site) => {
    if (site === activeSite) {
      if (site === 'yukthi' && router.pathname !== '/') {
        router.push('/');
      }
      return;
    }

    setActiveSite(site);
    setIsSwitching(true);

    if (onSwitch) {
      onSwitch(site);
    }

    if (site === 'vaaga') {
      // Brief tactile delay so the smooth sliding pill animation completes before redirection
      setTimeout(() => {
        window.location.href = vaagaUrl;
      }, 260);
    } else {
      setTimeout(() => {
        window.location.href = yukthiUrl;
      }, 260);
    }
  };

  return (
    <div className="site-switcher-wrapper" role="region" aria-label="Fest Switcher">
      <div className={`apple-matte-switcher ${isSwitching ? 'switching' : ''}`}>
        {/* Animated sliding matte highlight pill */}
        <div
          className={`switcher-glider ${activeSite === 'vaaga' ? 'glider-vaaga' : 'glider-yukthi'}`}
          aria-hidden="true"
        />

        {/* Yukthi Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeSite === 'yukthi'}
          className={`switcher-tab ${activeSite === 'yukthi' ? 'is-active' : ''}`}
          onClick={() => handleSwitch('yukthi')}
          title="YUKTHI X'26 - National Techno-Management Fest"
        >
          <span className="tab-indicator dot-yukthi" aria-hidden="true" />
          <span className="tab-label">YUKTHI</span>
        </button>

        {/* Vaaga Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeSite === 'vaaga'}
          className={`switcher-tab ${activeSite === 'vaaga' ? 'is-active' : ''}`}
          onClick={() => handleSwitch('vaaga')}
          title="Switch to VAAGA website"
        >
          <span className="tab-indicator dot-vaaga" aria-hidden="true" />
          <span className="tab-label">VAAGA</span>
          <svg
            className="external-arrow"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
