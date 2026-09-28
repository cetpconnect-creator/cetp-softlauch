import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PassesPage() {
  return (
    <>
      <Head>
        <title>Passes | YUKTHI X'26 - NIT Calicut</title>
      </Head>

      <section className="page-view active" aria-labelledby="passes-title">
        <div className="grid-texture-overlay"></div>
        <div className="status-hero">
          <p className="status-tag poppins">YUKTHI X'26 / STATUS</p>
          <div className="status-divider-line"></div>
          <h1 id="passes-title" className="status-title pp-fragment">
            PASSES<br />
            COMING SOON
          </h1>
          <p className="status-description poppins">
            Official festival passes, workshop combo tickets, and student delegation packages will open for registration shortly.
          </p>
          <p className="status-badge monocraft">
            PASSES LIVE OCTOBER 2026
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
