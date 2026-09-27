import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function LecturesPage() {
  return (
    <>
      <Head>
        <title>Lectures | YUKTHI X'26 - NIT Calicut</title>
      </Head>

      <section className="page-view active" aria-labelledby="lectures-title">
        <div className="grid-texture-overlay"></div>
        <div className="status-hero">
          <p className="status-tag poppins">YUKTHI X'26 / STATUS</p>
          <div className="status-divider-line"></div>
          <h1 id="lectures-title" className="status-title pp-fragment">
            LECTURES<br />
            COMING SOON
          </h1>
          <p className="status-description poppins">
            Lecture schedule and speaker lineup will be announced soon.
          </p>
          <p className="status-badge monocraft">
            WEBSITE LAUNCHING IN 2026
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
