import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top-section">
          <Link href="/" title="YUKTHI X'26 Home">
            <img
              src="/images/TATHVA25_LOGO_BLACK.png"
              alt="YUKTHI X'26 Logo"
              className="footer-logo-img"
              style={{ cursor: 'pointer' }}
              onError={(e) => {
                e.currentTarget.src = 'https://tathva.org/images/TATHVA25_LOGO_BLACK.png';
              }}
            />
          </Link>
          <ul className="footer-nav-list">
            <li>
              <Link href="/competitions" className="footer-nav-link">
                Events
              </Link>
            </li>
            <li>
              <Link href="/workshops" className="footer-nav-link">
                Workshops
              </Link>
            </li>
            <li>
              <Link href="/lectures" className="footer-nav-link">
                Lectures
              </Link>
            </li>
            <li>
              <Link href="/#galleryx" className="footer-nav-link">
                Gallery
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer-bottom-bar">
          <div className="footer-legal-links">
            <button
              className="legal-btn"
              type="button"
              onClick={() => alert("YUKTHI X'26 Terms of Service")}
            >
              Terms of Service
            </button>
            <button
              className="legal-btn"
              type="button"
              onClick={() => alert("YUKTHI X'26 Privacy Policy")}
            >
              Privacy Policy
            </button>
          </div>
          <div className="footer-social-links">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-btn"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-btn"
              aria-label="Twitter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle-btn"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
          <span className="footer-copyright">© YUKTHI X'26</span>
        </div>
      </div>
    </footer>
  );
}
