import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function CompetitionsPage() {
  return (
    <>
      <Head>
        <title>Competitions | YUKTHI X'26</title>
      </Head>

      <section className="page-view active" aria-labelledby="competitions-title">
        <div className="grid-texture-overlay"></div>
        <div className="status-hero">
          <p className="status-tag poppins">YUKTHI X'26 / STATUS</p>
          <div className="status-divider-line"></div>
          <h1 id="competitions-title" className="status-title pp-fragment">
            COMPETITIONS<br />
            COMING SOON
          </h1>
          <p className="status-description poppins">
            Flagship technical competitions, hackathons, RoboWars arenas, and prize pools will be announced shortly.
          </p>
          <p className="status-badge monocraft">
            REGISTRATIONS OPEN OCTOBER 2026
          </p>
          <div>
            <Link href="/" className="return-home-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Return to Home</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
