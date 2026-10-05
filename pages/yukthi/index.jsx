import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as THREE from 'three';

/* ==========================================================================
   YUKTHI X'26 - SINGLE-FILE CONSOLIDATED COMPONENT
   Includes:
   - Fest Header & Navigation with tactile SiteSwitcher (Yukthi <-> Vaaga)
   - Mobile Drawer Menu with user profile card
   - 3D Interactive Hero with cursor tilt, 2026 badge & dates
   - Live Countdown Timer with Monocraft font & animated HUD
   - Flagship Summits Dial Showcase (Radar dial, 3D card tilt & glare)
   - 3D Infinite Spiral Gallery & Touch Mobile Carousel
   - Festival Footer with quick links and socials
   - Toast notification feedback system
   ========================================================================== */

/* =========================================================
   DATA & ASSETS
   ========================================================= */
export const GALLERY_IMAGES = [
    { id: 1, src: '/images/gallery/dodge_drift.jpg', alt: 'Dodge Charger Dirt Drift Stunt' },
    { id: 2, src: '/images/gallery/bike_stunt.jpg', alt: 'Extreme Bike Stunt on Fire' },
    { id: 3, src: '/images/gallery/singer_performance.png', alt: 'Anju Joseph Live Vocal Performance' },
    { id: 4, src: '/images/gallery/mercedes_drift.jpg', alt: 'Vintage Mercedes-Benz Dirt Drift' },
    { id: 5, src: '/images/gallery/glive_singer.png', alt: 'G-Live Pro Stage Solo Vocal Concert' },
    { id: 6, src: '/images/gallery/isro_rocket.jpg', alt: 'ISRO LVM3 Rocket & Space Exhibition' },
    { id: 7, src: '/images/gallery/dignitaries_stage.jpg', alt: 'College of Engineering & Technology Payyanur Welcome Ceremony' },
    { id: 8, src: '/images/gallery/concert_payyanur.png', alt: 'Live Pro Concert Performance' }
];

/* Helper math functions for 3D calculations */
const clampVal = (val, min, max) => Math.min(Math.max(val, min), max);
const smoothstepVal = (min, max, val) => {
    const a = clampVal((val - min) / (max - min || 1), 0, 1);
    return a * a * (3 - 2 * a);
};

/* =========================================================
   1. SITE SWITCHER (Yukthi <-> Vaaga)
   ========================================================= */
export function SiteSwitcher({
    currentSite = 'yukthi',
    vaagaUrl = '/vaaga',
    yukthiUrl = '/',
    onSwitch
}) {
    const router = useRouter();
    const [activeSite, setActiveSite] = useState(currentSite);
    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        if (!router || !router.pathname) return;
        const isVaaga = router.pathname.startsWith('/vaaga');
        setActiveSite(isVaaga ? 'vaaga' : 'yukthi');
    }, [router?.pathname]);

    const handleSwitch = (site) => {
        if (isSwitching) return;

        const isAlreadyOnSite =
            site === 'vaaga'
                ? router?.pathname?.startsWith('/vaaga')
                : (router?.pathname === '/' || router?.pathname === yukthiUrl);

        if (isAlreadyOnSite) {
            if (site === 'yukthi' && router?.pathname !== '/' && router?.pathname !== yukthiUrl) {
                router?.push(yukthiUrl);
            }
            return;
        }

        const target = site === 'vaaga' ? vaagaUrl : yukthiUrl;

        setActiveSite(site);
        setIsSwitching(true);
        onSwitch?.(site);

        window.setTimeout(() => {
            if (router && router.push) {
                router.push(target).finally(() => {
                    setIsSwitching(false);
                });
            } else {
                window.location.href = target;
            }
        }, 180);
    };

    return (
        <div className="site-switcher-wrapper" role="region" aria-label="Fest Switcher">
            <div
                className={`nav-switcher apple-matte-switcher ${isSwitching ? 'is-switching' : ''}`}
                role="tablist"
                aria-label="Switch between YUKTHI and VAAGA"
            >
                <div
                    className={`nav-switcher__glider switcher-glider ${activeSite === 'vaaga'
                            ? 'nav-switcher__glider--vaaga glider-vaaga'
                            : 'nav-switcher__glider--yukthi glider-yukthi'
                        }`}
                    aria-hidden="true"
                />

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeSite === 'yukthi'}
                    className={`nav-switcher__item switcher-tab ${activeSite === 'yukthi' ? 'nav-switcher__item--active is-active' : ''
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

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeSite === 'vaaga'}
                    className={`nav-switcher__item switcher-tab ${activeSite === 'vaaga' ? 'nav-switcher__item--active is-active' : ''
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

/* =========================================================
   2. HEADER & NAVIGATION
   ========================================================= */
export function Header({
    onToggleMobileMenu,
    onShowToast,
    vaagaUrl = '/vaaga'
}) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        {
            label: (
                <>
                    TECH<sup style={{ fontSize: '0.75em', textTransform: 'lowercase', marginLeft: '1px' }}>x</sup>
                </>
            ),
            path: '/tech'
        },
        {
            label: 'Archives',
            path: '#archives'
        },
        {
            label: 'Gallery',
            path: '#galleryx'
        }
    ];

    return (
        <header className={`header-nav visible ${scrolled ? 'is-scrolled' : ''}`}>
            <div className="header-container">
                {/* Brand Section: Official 3D Fest Logo + Desktop Switcher */}
                <div className="header-brand-section">
                    <Link href="/" className="header-logo-link" title="YUKTHI '26 - Home">
                        <img
                            src="/images/yukthi26-logo.png"
                            alt="YUKTHI '26 Official Logo"
                            className="header-logo-img"
                            loading="eager"
                        />
                    </Link>

                    <div className="site-switcher-desktop-wrapper">
                        <SiteSwitcher
                            currentSite="yukthi"
                            vaagaUrl={vaagaUrl}
                        />
                    </div>
                </div>

                <nav className="nav-pill-menu" aria-label="Main Navigation">
                    {navItems.map((item) => {
                        const isActive =
                            router?.pathname === item.path ||
                            (item.path === '/tech' && router?.pathname?.startsWith('/tech'));

                        return item.path.startsWith('#') ? (
                            <a
                                key={item.path}
                                href={item.path}
                                className="nav-link"
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`nav-link ${isActive ? 'active' : ''}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Header Actions Pill */}
                <div className="nav-actions">
                    <button
                        className="icon-btn header-bell-btn"
                        onClick={() =>
                            onShowToast
                                ? onShowToast("🔔 YUKTHI X'26 Registrations are LIVE! Grab passes now.")
                                : alert("🔔 YUKTHI X'26 Registrations are LIVE! Grab passes now.")
                        }
                        title="Announcements"
                        aria-label="View announcements"
                    >
                        <span className="bell-icon-wrapper">
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                                <path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665"></path>
                            </svg>
                            <span className="bell-dot"></span>
                        </span>
                    </button>

                    <div className="nav-divider desktop-only-divider"></div>

                    {/* Desktop User Avatar */}
                    <button
                        className="user-avatar-btn desktop-only-avatar"
                        onClick={() =>
                            onShowToast
                                ? onShowToast('👤 Signed in as Dev Tester')
                                : alert('👤 Signed in as Dev Tester')
                        }
                        title="User Profile (Dev Tester)"
                        aria-label="User profile"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </button>

                    {/* Mobile Hamburger Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={onToggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="3.5" y1="7" x2="20.5" y2="7"></line>
                            <line x1="3.5" y1="12" x2="20.5" y2="12"></line>
                            <line x1="3.5" y1="17" x2="20.5" y2="17"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}

/* =========================================================
   3. MOBILE MENU DRAWER
   ========================================================= */
export function MobileMenu({
    isOpen,
    onClose,
    onShowToast,
    vaagaUrl = '/vaaga'
}) {
    const router = useRouter();

    const navItems = [
        {
            label: (
                <>
                    TECH<sup style={{ fontSize: '0.75em', textTransform: 'lowercase', marginLeft: '1px' }}>x</sup>
                    <span className="mobile-nav-featured-badge">FEATURED</span>
                </>
            ),
            path: '/tech',
            featured: true
        },
        {
            label: 'Archives (Reflections)',
            path: '#archives'
        },
        {
            label: 'Photo Gallery',
            path: '#galleryx'
        }
    ];

    if (!isOpen) return null;

    return (
        <>
            <div className="mobile-nav-backdrop" onClick={onClose} aria-hidden="true" />

            <div
                className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation Menu"
            >
                <div className="mobile-nav-header">
                    <SiteSwitcher currentSite="yukthi" vaagaUrl={vaagaUrl} onSwitch={onClose} />
                    <button
                        onClick={onClose}
                        className="mobile-nav-close-btn"
                        aria-label="Close menu"
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
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="mobile-nav-list">
                    {navItems.map((item) => {
                        const isActive =
                            router?.pathname === item.path ||
                            (item.path === '/tech' && router?.pathname?.startsWith('/tech'));
                        return item.path.startsWith('#') ? (
                            <a
                                key={item.path}
                                href={item.path}
                                className="mobile-nav-item"
                                onClick={onClose}
                            >
                                {item.label}
                            </a>
                        ) : (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`mobile-nav-item ${isActive ? 'active' : ''} ${item.featured ? 'mobile-nav-item--featured' : ''
                                    }`}
                                onClick={onClose}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="mobile-nav-footer">
                    <button
                        className="mobile-nav-profile-card"
                        onClick={() => {
                            if (onShowToast) {
                                onShowToast('👤 Signed in as Dev Tester');
                            } else {
                                alert('👤 Signed in as Dev Tester');
                            }
                            onClose();
                        }}
                        title="User Profile (Dev Tester)"
                        aria-label="User profile"
                    >
                        <div className="mobile-profile-avatar">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="mobile-profile-details">
                            <span className="mobile-profile-name">Dev Tester</span>
                            <span className="mobile-profile-status">
                                <span className="profile-status-dot"></span>
                                NIT Calicut • Verified
                            </span>
                        </div>
                        <div className="mobile-profile-action">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}

/* =========================================================
   4. 3D TILT HERO HEADING
   ========================================================= */
export const HeroMainTitle = ({ text = "YUKTHI X'26" }) => {
    const titleRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!titleRef.current) return;
            const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
            const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
            titleRef.current.style.transform = `perspective(1000px) rotateY(${xNorm * 15}deg) rotateX(${-yNorm * 15}deg)`;
        };

        const handleMouseLeave = () => {
            if (!titleRef.current) return;
            titleRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="relative flex items-center justify-center pointer-events-none select-none z-20">
            <h1
                ref={titleRef}
                className="tathva-heading hero-main-title text-center font-bold uppercase text-white drop-shadow-2xl"
            >
                {text}
            </h1>
        </div>
    );
};

/* =========================================================
   5. COUNTDOWN TIMER COMPONENT
   ========================================================= */
export const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ days: '07', hours: '13', mins: '15', secs: '35' });

    useEffect(() => {
        const target = new Date('2026-10-12T09:00:00+05:30').getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.max(0, target - now);
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(d).padStart(2, '0'),
                hours: String(h).padStart(2, '0'),
                mins: String(m).padStart(2, '0'),
                secs: String(s).padStart(2, '0')
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hero-countdown-box">
            <div className="countdown-block">
                <span className="countdown-digits monocraft">{timeLeft.days}</span>
                <span className="countdown-unit">DAYS</span>
            </div>
            <span className="countdown-sep monocraft">:</span>
            <div className="countdown-block">
                <span className="countdown-digits monocraft">{timeLeft.hours}</span>
                <span className="countdown-unit">HOURS</span>
            </div>
            <span className="countdown-sep monocraft">:</span>
            <div className="countdown-block">
                <span className="countdown-digits monocraft">{timeLeft.mins}</span>
                <span className="countdown-unit">MINS</span>
            </div>
            <span className="countdown-sep monocraft">:</span>
            <div className="countdown-block">
                <span className="countdown-digits monocraft">{timeLeft.secs}</span>
                <span className="countdown-unit">SECS</span>
            </div>
        </div>
    );
};

/* =========================================================
   6. HERO SECTION
   ========================================================= */
export function Hero({ onExplore, onShowToast }) {
    return (
        <section className="home-hero-section" id="hero">
            {/* Year 2026 Badge */}
            <p className="hero-year-text">2026</p>

            {/* Giant Futuristic Title: YUKTHI X'26 */}
            <HeroMainTitle text="YUKTHI X'26" />

            {/* Festival Dates */}
            <p className="hero-dates-text">13TH - 17TH OCTOBER</p>

            {/* Primary Action Buttons: Dark Transparent Glass + Subtle Galaxy Visible + Thin Cyan/Gold Glowing Border */}
            <div className="hero-glass-actions">
                <Link
                    href="/tech"
                    className="hero-glass-btn hero-glass-btn--cyan"
                >
                    EXPLORE TECH X
                </Link>
                <a
                    href="#galleryx"
                    className="hero-glass-btn hero-glass-btn--gold"
                >
                    VIEW GALLERY
                </a>
            </div>

            {/* Countdown Timer (Downside of Buttons) */}
            <div className="hero-downside-countdown">
                <CountdownTimer />
            </div>
        </section>
    );
}

/* =========================================================
   8. 3D INFINITE SPIRAL GALLERY (DESKTOP)
   ========================================================= */
export function InfiniteSpiral({
    items = [],
    speed = 0.5,
    direction = "up",
    animationMode = "all",
    radius = 350,
    cardWidth = 400,
    cardHeight = 520,
    verticalSpacing = 200,
    perspective = 1000,
    cardsPerTurn = 3.5,
    rotation = 0,
    cardTilt = 0,
    cardRadius = 10,
    centerScale = 1.2,
    edgeFade = 0.3,
    edgeBlur = 6,
    pauseOnHover = true,
    imageFit = "contain"
}) {
    const containerRef = useRef(null);
    const cardRefs = useRef([]);
    const currentScroll = useRef(0);
    const targetScroll = useRef(0);
    const velocity = useRef(0);
    const isHovered = useRef(false);
    const isIntersecting = useRef(true);
    const isDragging = useRef(false);
    const lastY = useRef(0);
    const hasMoved = useRef(false);

    const formattedItems = useMemo(
        () => items.map((item, i) => (typeof item === 'string' ? { src: item, alt: `Spiral image ${i + 1}` } : { alt: `Spiral image ${i + 1}`, ...item })),
        [items]
    );

    useEffect(() => {
        let animId;
        const container = containerRef.current;
        if (!container || formattedItems.length === 0) return;

        let lastTime = performance.now();
        let containerRect = container.getBoundingClientRect();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const respondsToScroll = animationMode === 'scroll' || animationMode === 'all';
        const speedMultiplier = Math.max(speed, 0) / 0.55;
        let lastScrollY = window.scrollY;

        const resizeObserver = new ResizeObserver(() => {
            containerRect = container.getBoundingClientRect();
        });
        resizeObserver.observe(container);

        const intersectionObserver = new IntersectionObserver(([entry]) => {
            isIntersecting.current = entry.isIntersecting;
        }, { threshold: 0.02 });
        intersectionObserver.observe(container);

        const handleWindowScroll = () => {
            const currentScrollY = window.scrollY;
            const deltaY = currentScrollY - lastScrollY;
            lastScrollY = currentScrollY;
            if (respondsToScroll && isIntersecting.current && deltaY !== 0) {
                targetScroll.current += clampVal((deltaY * speedMultiplier) / Math.max(2 * verticalSpacing, 1), -1.5, 1.5);
            }
        };
        window.addEventListener('scroll', handleWindowScroll, { passive: true });

        const animateLoop = (now) => {
            const deltaSec = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            const allowsAuto = animationMode === 'auto' || animationMode === 'all';
            const isPaused = isDragging.current || (pauseOnHover && isHovered.current);
            const dirMultiplier = direction === 'down' ? -1 : 1;
            const desiredVelocity = allowsAuto && isIntersecting.current && !prefersReducedMotion.matches && !isPaused
                ? speed * dirMultiplier
                : 0;

            const smoothFactor = 1 - Math.exp(-7 * deltaSec);
            velocity.current += (desiredVelocity - velocity.current) * smoothFactor;
            targetScroll.current += velocity.current * deltaSec;

            const lerpFactor = 1 - Math.exp(-deltaSec * (isDragging.current ? 22 : 11));
            currentScroll.current += (targetScroll.current - currentScroll.current) * lerpFactor;

            const totalCards = formattedItems.length;
            const halfTotal = totalCards / 2;
            const viewportW = Math.max(containerRect.width, 1);
            const scaleFactor = Math.min(
                1,
                viewportW / (2.8 * cardWidth),
                Math.max(containerRect.height, 1) / (2.35 * cardHeight)
            );
            const actualRadius = Math.min(radius, Math.max(72, 0.36 * viewportW)) * scaleFactor;
            const fadeThreshold = clampVal(1 - edgeFade, 0, 0.98);
            const actualCardsPerTurn = Math.max(cardsPerTurn, 1);

            cardRefs.current.forEach((el, index) => {
                if (!el) return;
                let offset = index - currentScroll.current;
                let wrappedOffset = ((offset + halfTotal) % totalCards + totalCards) % totalCards - halfTotal;
                const normalizedDist = Math.min(Math.abs(wrappedOffset) / Math.max(halfTotal, 1), 1);
                const opacity = 1 - smoothstepVal(fadeThreshold, 1, normalizedDist);
                const centerDist = 1 - Math.min(Math.abs(wrappedOffset) / Math.max(0.65 * actualCardsPerTurn, 1), 1);
                const grayscaleAmount = smoothstepVal(0, 1, Math.min(Math.abs(wrappedOffset) / 1.2, 1));
                const baseScale = (1 + (centerScale - 1) * centerDist) * scaleFactor;
                const angle = ((360 / actualCardsPerTurn) * wrappedOffset + rotation) * (Math.PI / 180);
                const xPos = Math.sin(angle) * actualRadius;
                const zPos = Math.cos(angle) * actualRadius;
                const perspectiveScale = clampVal(perspective / Math.max(perspective - zPos, 1), 0.72, 1.45);
                const depthNormalized = (zPos / Math.max(actualRadius, 1) + 1) / 2;
                const blurAmount = edgeBlur * smoothstepVal(0.35, 1, normalizedDist);

                const filters = [];
                if (blurAmount > 0.01) filters.push(`blur(${blurAmount.toFixed(2)}px)`);
                if (grayscaleAmount > 0.01) filters.push(`grayscale(${Math.round(100 * grayscaleAmount)}%)`);

                el.style.transform = `translate(-50%, -50%) translate3d(${xPos}px, ${wrappedOffset * verticalSpacing * scaleFactor}px, 0) rotateZ(${cardTilt}deg) scale(${baseScale * perspectiveScale})`;
                el.style.opacity = opacity.toFixed(3);
                el.style.filter = filters.length > 0 ? filters.join(' ') : 'none';
                el.style.zIndex = String(Math.round(100000 * depthNormalized) + index);
                el.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
            });

            animId = requestAnimationFrame(animateLoop);
        };

        animId = requestAnimationFrame(animateLoop);

        return () => {
            cancelAnimationFrame(animId);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            window.removeEventListener('scroll', handleWindowScroll);
        };
    }, [formattedItems, speed, direction, animationMode, radius, perspective, cardWidth, cardHeight, verticalSpacing, cardsPerTurn, rotation, cardTilt, centerScale, edgeFade, edgeBlur, pauseOnHover]);

    const allowsDrag = animationMode === 'drag' || animationMode === 'all';

    const handlePointerUp = (e) => {
        if (isDragging.current) {
            isDragging.current = false;
            if (e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }
            e.currentTarget.style.cursor = allowsDrag ? 'grab' : 'default';
        }
    };

    return (
        <div
            ref={containerRef}
            className="infinite-spiral"
            style={{
                perspective: `${perspective}px`,
                '--infinite-spiral-card-width': `${cardWidth}px`,
                '--infinite-spiral-card-height': `${cardHeight}px`,
                '--infinite-spiral-card-radius': `${cardRadius}px`,
                cursor: allowsDrag ? 'grab' : 'default',
                touchAction: allowsDrag ? 'pan-x' : 'auto',
                userSelect: allowsDrag ? 'none' : 'auto'
            }}
            onMouseEnter={() => { isHovered.current = true; }}
            onMouseLeave={() => { isHovered.current = false; }}
            onPointerDown={(e) => {
                if (allowsDrag && e.button === 0) {
                    isDragging.current = true;
                    hasMoved.current = false;
                    lastY.current = e.clientY;
                    targetScroll.current = currentScroll.current;
                    if (e.currentTarget.setPointerCapture) {
                        e.currentTarget.setPointerCapture(e.pointerId);
                    }
                    e.currentTarget.style.cursor = 'grabbing';
                }
            }}
            onPointerMove={(e) => {
                if (!isDragging.current) return;
                const delta = e.clientY - lastY.current;
                lastY.current = e.clientY;
                if (Math.abs(delta) > 0.5) hasMoved.current = true;
                targetScroll.current -= delta / Math.max(verticalSpacing, 1);
            }}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClickCapture={(e) => {
                if (hasMoved.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    hasMoved.current = false;
                }
            }}
        >
            <div className="infinite-spiral__stage" role="list" aria-label="Infinite spiral gallery">
                {formattedItems.map((item, idx) => (
                    <div
                        key={item.id || `${item.src}-${idx}`}
                        ref={(el) => { cardRefs.current[idx] = el; }}
                        className="infinite-spiral__item"
                        style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
                        role="listitem"
                        aria-label={item.alt}
                    >
                        <img
                            className="infinite-spiral__image"
                            src={item.src}
                            alt={item.alt}
                            loading={idx < 6 ? 'eager' : 'lazy'}
                            draggable={false}
                            style={{ width: cardWidth, height: cardHeight, maxWidth: 'none', maxHeight: 'none', objectFit: imageFit }}
                            onError={(e) => {
                                console.warn('Gallery image failed to load:', item.src);
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================
   9. MOBILE GALLERY CAROUSEL
   ========================================================= */
export function MobileGalleryCarousel({ items }) {
    const scrollRef = useRef(null);
    const cardOffsetRef = useRef(0);
    const animFrameRef = useRef(null);
    const isAdjustingRef = useRef(false);
    const autoTimeoutRef = useRef(null);
    const animScrollRef = useRef(null);
    const isInteractingRef = useRef(false);
    const isPausedRef = useRef(false);

    const repeatedItems = useMemo(
        () => Array.from({ length: 7 * items.length }, (_, i) => ({ ...items[i % items.length], id: i })),
        [items]
    );

    const totalBase = items.length;

    const handleLoop = () => {
        const el = scrollRef.current;
        if (!el) return;
        const offset = cardOffsetRef.current;
        if (!isAdjustingRef.current && offset > 0) {
            if (el.scrollLeft < 2 * offset) {
                isAdjustingRef.current = true;
                el.style.scrollSnapType = 'none';
                el.scrollLeft += offset;
                el.offsetHeight;
                requestAnimationFrame(() => {
                    el.style.scrollSnapType = '';
                    isAdjustingRef.current = false;
                });
            } else if (el.scrollLeft >= 4 * offset) {
                isAdjustingRef.current = true;
                el.style.scrollSnapType = 'none';
                el.scrollLeft -= offset;
                el.offsetHeight;
                requestAnimationFrame(() => {
                    el.style.scrollSnapType = '';
                    isAdjustingRef.current = false;
                });
            }
        }
    };

    const updateCardScale = () => {
        const el = scrollRef.current;
        if (!el) return;
        const center = el.scrollLeft + el.clientWidth / 2;
        const halfWidth = el.clientWidth / 2;
        const cards = el.querySelectorAll('[data-gallery-item]');
        cards.forEach((card) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distRatio = 1 - Math.min(1, Math.abs(cardCenter - center) / halfWidth);
            const scale = 0.7 + 0.3 * distRatio;
            const opacity = Math.min(1, 0.67 + 0.33 * distRatio);
            card.style.transform = `scale(${scale})`;
            card.style.opacity = opacity;
        });
    };

    const clearTimer = () => {
        if (autoTimeoutRef.current) {
            clearTimeout(autoTimeoutRef.current);
            autoTimeoutRef.current = null;
        }
    };

    const scheduleNext = () => {
        clearTimer();
        autoTimeoutRef.current = setTimeout(() => {
            autoStep();
        }, 1200);
    };

    const autoStep = () => {
        if (isPausedRef.current) return;
        const el = scrollRef.current;
        if (!el) return;
        const cards = el.querySelectorAll('[data-gallery-item]');
        const step = cards.length >= 2 ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : 0;
        if (!step) return scheduleNext();

        isInteractingRef.current = true;
        if (animScrollRef.current) cancelAnimationFrame(animScrollRef.current);
        el.style.scrollSnapType = 'none';
        const startTime = performance.now();
        let prevEased = 0;

        const tick = (now) => {
            const progress = Math.min(1, (now - startTime) / 400);
            const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            const delta = step * (eased - prevEased);
            el.scrollLeft += delta;
            prevEased = eased;
            updateCardScale();

            if (progress < 1) {
                animScrollRef.current = requestAnimationFrame(tick);
            } else {
                animScrollRef.current = null;
                isInteractingRef.current = false;
                el.style.scrollSnapType = '';
                handleLoop();
                scheduleNext();
            }
        };
        animScrollRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const init = () => {
            const cards = el.querySelectorAll('[data-gallery-item]');
            cardOffsetRef.current = cards.length >= 2 * totalBase ? cards[totalBase].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : 0;
            el.scrollLeft = 3 * cardOffsetRef.current;
            updateCardScale();
            scheduleNext();
        };
        const timer = setTimeout(init, 100);
        window.addEventListener('resize', init);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', init);
            clearTimer();
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            if (animScrollRef.current) cancelAnimationFrame(animScrollRef.current);
        };
    }, [totalBase]);

    return (
        <div
            ref={scrollRef}
            onScroll={() => {
                if (!animFrameRef.current) {
                    animFrameRef.current = requestAnimationFrame(() => {
                        updateCardScale();
                        animFrameRef.current = null;
                    });
                }
                if (!isInteractingRef.current) {
                    handleLoop();
                    if (!isPausedRef.current) scheduleNext();
                }
            }}
            onMouseEnter={() => { isPausedRef.current = true; clearTimer(); }}
            onMouseLeave={() => { isPausedRef.current = false; scheduleNext(); }}
            onTouchStart={() => { isPausedRef.current = true; clearTimer(); }}
            onTouchEnd={() => { isPausedRef.current = false; scheduleNext(); }}
            style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%', WebkitOverflowScrolling: 'touch' }}
        >
            <div style={{ display: 'flex', gap: '0', padding: '0 20vw' }}>
                {repeatedItems.map((item) => (
                    <div
                        key={item.id}
                        data-gallery-item="true"
                        style={{ flexShrink: 0, scrollSnapAlign: 'center', width: '78vw', maxWidth: '460px', willChange: 'transform' }}
                    >
                        <img
                            src={item.src}
                            alt={item.alt}
                            style={{ display: 'block', width: '100%', height: '280px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 20px 45px rgba(0,0,0,0.85)' }}
                            draggable={false}
                            onError={(e) => {
                                console.warn('Mobile gallery image failed to load:', item.src);
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* =========================================================
   10. GALLERY SECTION WRAPPER
   ========================================================= */
export const YukthiGallerySpiral = () => {
    return (
        <div id="galleryx" className="tathva-gallery-section">
            <div className="gallery-header-box">
                <div className="gallery-header-glow-bg" />
                <div className="gallery-header-content">
                    <h2 className="gallery-main-title pp-fragment">
                        YUKTHI X'26 GALLERY
                    </h2>
                    <p className="gallery-subtitle poppins">
                        Scroll through the moments that define YUKTHI X'26 — step into the vibrant spirit of{' '}
                        <span className="highlight">creativity</span> and{' '}
                        <span className="highlight">unforgettable</span> memories.
                    </p>
                </div>
            </div>

            <div className="gallery-spiral-stage-wrapper relative h-auto sm:h-[800px] w-full sm:overflow-hidden">
                <div className="desktop-spiral-container hidden sm:block h-full w-full">
                    <InfiniteSpiral
                        items={GALLERY_IMAGES}
                        imageFit="contain"
                        animationMode="all"
                        speed={0.5}
                        cardWidth={400}
                        cardHeight={520}
                        radius={350}
                        cardsPerTurn={3.5}
                        verticalSpacing={200}
                        centerScale={1.2}
                        edgeFade={0.3}
                        edgeBlur={6}
                    />
                </div>
                <div className="mobile-spiral-container block sm:hidden h-full w-full">
                    <MobileGalleryCarousel items={GALLERY_IMAGES} />
                </div>
            </div>
        </div>
    );
};

/* =========================================================
   11. FOOTER
   ========================================================= */
export function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="footer-top-section">
                    <ul className="footer-nav-list">
                        <li>
                            <Link href="/tech" className="footer-nav-link">
                                TECH X
                            </Link>
                        </li>
                        <li>
                            <Link href="/vaaga" className="footer-nav-link">
                                VAAGA'26
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

/* =========================================================
   10. HEADLINERS ORBIT SHOWCASE
   ========================================================= */
export const HEADLINER_ARTISTS = [
  {
    id: 1,
    name: "K. K. Shailaja",
    cat: "Former Health Minister • MLA",
    img: "/images/headliners/kk-shailaja.jpg",
    tint: "",
    bio: "Celebrated Indian politician, MLA, and former Minister for Health and Social Justice of Kerala, globally recognized for visionary crisis leadership.",
    stage: "Distinguished Guest • Main Stage"
  },
  {
    id: 2,
    name: "Dr. Ciza Thomas",
    cat: "Former Vice-Chancellor, KTU",
    img: "/images/headliners/dr-ciza-thomas.jpg",
    tint: "",
    bio: "Eminent academician, educational administrator, and Former Vice-Chancellor of APJ Abdul Kalam Technological University (KTU).",
    stage: "Keynote Speaker • Academic Arena"
  },
  {
    id: 3,
    name: "Dr. Manju S. Nair",
    cat: "Space Scientist • ISRO",
    img: "/images/headliners/dr-manju-s-nair.jpg",
    tint: "",
    bio: "Renowned aerospace scientist associated with ISRO, researcher, author, and acclaimed TEDx speaker inspiring the next generation in science.",
    stage: "Space & Tech Summit • Stage 1"
  },
  {
    id: 4,
    name: "Aniyan Midhun",
    cat: "Wushu Champion • Martial Artist",
    img: "/images/headliners/aniyan-midhun.jpg",
    tint: "",
    bio: "South Asian Wushu champion, combat sports practitioner, and celebrity guest from Kerala celebrated for his high-energy motivational presence.",
    stage: "Youth Icon • Live Interaction"
  },
  {
    id: 5,
    name: "Sarath S (Neon Tech)",
    cat: "Tech Creator & YouTuber",
    img: "/images/headliners/sarath-neon-tech.jpg",
    tint: "",
    bio: "Leading technology influencer and founder of Sarath's Neon Tech with over 1.1 million subscribers, reviewing cutting-edge consumer gadgets.",
    stage: "Creator Conclave • Tech Stage"
  },
  {
    id: 6,
    name: "Basi",
    cat: "Teacher • Commentator • MC",
    img: "/images/headliners/basi.jpg",
    tint: "",
    bio: "Passionate educator, commentator, and versatile master of ceremonies known for engaging live audiences.",
    stage: "Distinguished Guest • Live Stage"
  },
  {
    id: 7,
    name: "Almaram Music Band",
    cat: "Live Indie Fusion • Pro Show",
    img: "/images/headliners/almaram-music-band.jpg",
    tint: "",
    bio: "Acclaimed Kerala music band blending folk traditions with contemporary acoustic rhythms for an unforgettable live pro-show experience.",
    stage: "Grand Pro Show • Main Arena"
  }
];

const HEADLINERS_REPEAT_COUNT = 4;

export function HeadlinersOrbit({ onShowToast }) {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const pathRef = useRef(null);

  // Drag & scroll physics state refs
  const xRef = useRef(0);
  const speedRef = useRef(0.65);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const hasMovedRef = useRef(false);
  const momentumTimeoutRef = useRef(null);

  // 1. Particle Canvas Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let particles = [];
    let width = 0;
    let height = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : 700;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Initialize particles with gold/amber cosmic galaxy colors
      const count = Math.max(30, Math.floor(width * 0.08));
      particles = [];
      for (let i = 0; i < count; i++) {
        const isGold = Math.random() > 0.35;
        const rightBias = Math.pow(Math.random(), 0.7);
        const px = width * (0.15 + rightBias * 0.85) + (Math.random() - 0.5) * 120;
        particles.push({
          x: px,
          y: Math.random() * height,
          r: isGold ? Math.random() * 1.6 + 0.3 : Math.random() * 1.1 + 0.2,
          alpha: isGold ? Math.random() * 0.9 + 0.1 : Math.random() * 0.6 + 0.2,
          gold: isGold,
          vx: (Math.random() - 0.5) * (isGold ? 0.22 : 0.05),
          vy: (Math.random() - 0.5) * (isGold ? 0.16 : 0.04),
          tw: Math.random() * Math.PI * 2
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy + Math.sin(t + p.tw) * 0.06;
        p.tw += 0.01;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (p.gold) {
          ctx.fillStyle = `rgba(244, 190, 108, ${p.alpha * 0.95})`;
          ctx.shadowBlur = p.r * 4;
          ctx.shadowColor = 'rgba(244, 190, 108, 0.85)';
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 2. Dotted line animated stroke offset
  useEffect(() => {
    let dash = 0;
    let dashAnimId;
    const path = pathRef.current;
    if (!path) return;

    const animateDash = () => {
      dash = (dash + 0.6) % 24;
      path.style.strokeDashoffset = String(dash);
      dashAnimId = requestAnimationFrame(animateDash);
    };
    animateDash();

    return () => cancelAnimationFrame(dashAnimId);
  }, []);

  // 3. Marquee Drag & Physics Loop
  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    if (!track || !wrapper) return;

    let rafId;

    const getTrackWidth = () => {
      return track.scrollWidth / HEADLINERS_REPEAT_COUNT;
    };

    const animate = () => {
      if (!isDraggingRef.current) {
        xRef.current -= speedRef.current;
        const w = getTrackWidth();
        if (w > 0) {
          if (xRef.current <= -w) {
            xRef.current += w;
          } else if (xRef.current > 0) {
            xRef.current -= w;
          }
        }
        track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    animate();

    const handleWheel = (e) => {
      e.preventDefault();
      xRef.current -= e.deltaY * 0.6;
      const w = getTrackWidth();
      if (w > 0) {
        if (xRef.current <= -w) xRef.current += w;
        else if (xRef.current > 0) xRef.current -= w;
      }
      track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      wrapper.removeEventListener('wheel', handleWheel);
      if (momentumTimeoutRef.current) clearTimeout(momentumTimeoutRef.current);
    };
  }, []);

  // Pointer drag event handlers
  const handlePointerDown = (e) => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    wrapper.setPointerCapture(e.pointerId);
    startXRef.current = e.clientX;
    startScrollRef.current = xRef.current;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    wrapper.style.cursor = 'grabbing';
    track.style.transition = 'none';
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 6) {
      hasMovedRef.current = true;
    }

    xRef.current = startScrollRef.current + dx;

    // Seamless wrap during active drag
    const w = track.scrollWidth / HEADLINERS_REPEAT_COUNT;
    if (w > 0) {
      if (xRef.current <= -w * 1.5) xRef.current += w;
      if (xRef.current >= w * 0.5) xRef.current -= w;
    }

    track.style.transform = `translate3d(${xRef.current}px, 0, 0)`;

    const now = performance.now();
    velocityRef.current = (e.clientX - lastXRef.current) / (now - lastTimeRef.current || 16);
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const handlePointerEnd = (e) => {
    if (!isDraggingRef.current) return;
    const wrapper = wrapperRef.current;
    if (wrapper && wrapper.hasPointerCapture(e.pointerId)) {
      wrapper.releasePointerCapture(e.pointerId);
    }
    isDraggingRef.current = false;
    if (wrapper) wrapper.style.cursor = 'grab';

    // Momentum release
    const vel = velocityRef.current;
    if (Math.abs(vel) > 0.1) {
      speedRef.current = Math.max(0.3, Math.min(3, Math.abs(vel) * 2)) * Math.sign(-vel || -1);
      if (momentumTimeoutRef.current) clearTimeout(momentumTimeoutRef.current);
      momentumTimeoutRef.current = setTimeout(() => {
        speedRef.current = 0.65;
      }, 1200);
    }
  };

  // Hover speed control
  const handleMouseEnter = () => {
    speedRef.current *= 0.25;
  };

  const handleMouseLeave = () => {
    if (!isDraggingRef.current) {
      speedRef.current = 0.65;
    }
  };

  // Card click: only open if not dragged
  const handleCardClick = (artist) => {
    if (hasMovedRef.current) return;
    setSelectedArtist(artist);
  };

  // Modal ESC key listener & body lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedArtist(null);
    };

    if (selectedArtist) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedArtist]);

  // Repeat headliner list for smooth continuous wrap
  const loopArtists = Array(HEADLINERS_REPEAT_COUNT).fill(HEADLINER_ARTISTS).flat();

  return (
    <section className="headliners-section" id="headliners">
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="headliners-particle-canvas" />

      {/* Ambient Cosmic Gold/Amber Glow */}
      <div className="headliners-glow-gold" />

      {/* Main Header Container */}
      <div className="headliners-container">
        <div className="headliners-header-row">
          <h2 className="headliners-title">Headliners</h2>
        </div>
      </div>

      {/* 3D Orbit Carousel Track */}
      <div className="headliners-orbit-stage">
        {/* Dotted Sine Orbit SVG with traveling orb */}
        <svg
          className="dotted-svg"
          viewBox="0 0 2000 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="headlinersOrbitPath"
            ref={pathRef}
            d="M -100 165 C 80 60, 260 270, 440 165 S 800 55, 980 165 S 1240 275, 1440 165 S 1720 45, 1940 165 S 2100 280, 2300 165"
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2 16"
            opacity="0.85"
          />
          <circle r="3.4" fill="#f4be6c" style={{ filter: 'drop-shadow(0 0 6px rgba(244, 190, 108, 0.9))' }}>
            <animateMotion dur="22s" repeatCount="indefinite" rotate="auto">
              <mpath href="#headlinersOrbitPath" />
            </animateMotion>
          </circle>
        </svg>

        {/* Marquee Wrapper with Drag Physics */}
        <div
          ref={wrapperRef}
          className="marquee-wrapper"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={trackRef} className="marquee-track">
            {loopArtists.map((artist, idx) => (
              <div
                key={`${artist.id}-${idx}`}
                className="artist-card"
                onClick={() => handleCardClick(artist)}
              >
                <img
                  src={artist.img}
                  alt={artist.name}
                  loading="lazy"
                  style={{ filter: artist.tint || 'none' }}
                />
                <div className="artist-card-overlay" />
                <div className="card-meta">
                  <span className="card-cat">{artist.cat}</span>
                  <span className="card-name">{artist.name}</span>
                </div>
                <div className="card-indicator">
                  <span className="card-indicator-dot" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edge Fade Masks */}
        <div className="headliners-fade-left" />
        <div className="headliners-fade-right" />
      </div>

      {/* Bottom Continuous Marquee Ticker */}
      <div className="headliners-ticker">
        <div className="headliners-ticker-track">
          <div className="headliners-ticker-item">
            <span className="ticker-star">★ YUKTHI X'26</span>
            <span className="ticker-sep">—</span>
            <span>COLLEGE OF ENGINEERING PAYYANUR</span>
            <span className="ticker-sep">—</span>
            <span>DISTINGUISHED HEADLINERS &amp; SPEAKERS</span>
            <span className="ticker-sep">—</span>
            <span>13TH - 17TH OCTOBER 2026</span>
            <span className="ticker-sep">—</span>
            <span className="ticker-star">★ YUKTHI X'26</span>
            <span className="ticker-sep">—</span>
            <span>COLLEGE OF ENGINEERING PAYYANUR</span>
            <span className="ticker-sep">—</span>
          </div>
          <div className="headliners-ticker-item" aria-hidden="true">
            <span className="ticker-star">★ YUKTHI X'26</span>
            <span className="ticker-sep">—</span>
            <span>COLLEGE OF ENGINEERING PAYYANUR</span>
            <span className="ticker-sep">—</span>
            <span>DISTINGUISHED HEADLINERS &amp; SPEAKERS</span>
            <span className="ticker-sep">—</span>
            <span>13TH - 17TH OCTOBER 2026</span>
            <span className="ticker-sep">—</span>
            <span className="ticker-star">★ YUKTHI X'26</span>
            <span className="ticker-sep">—</span>
            <span>COLLEGE OF ENGINEERING PAYYANUR</span>
            <span className="ticker-sep">—</span>
          </div>
        </div>
      </div>

      {/* Artist Detail Modal Popup */}
      {selectedArtist && (
        <div className="headliners-modal-overlay">
          <div
            className="headliners-modal-backdrop"
            onClick={() => setSelectedArtist(null)}
          />
          <div className="headliners-modal-card">
            <button
              className="headliners-modal-close"
              onClick={() => setSelectedArtist(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="headliners-modal-media">
              <img src={selectedArtist.img} alt={selectedArtist.name} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)'
                }}
              />
            </div>
            <div className="headliners-modal-content">
              <div className="headliners-modal-cat">{selectedArtist.cat}</div>
              <h3 className="headliners-modal-name">{selectedArtist.name}</h3>
              <p className="headliners-modal-bio">{selectedArtist.bio}</p>
              <div className="headliners-modal-actions">
                <button
                  className="headliners-btn-primary"
                  onClick={() => {
                    if (onShowToast) {
                      onShowToast(`Session info for ${selectedArtist.name}: 10:30 AM • Main Auditorium`);
                    }
                  }}
                >
                  View Session Info
                </button>
                <button
                  className="headliners-btn-secondary"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                    if (onShowToast) {
                      onShowToast(`Copied ${selectedArtist.name} profile link!`);
                    }
                  }}
                >
                  Share
                </button>
              </div>
              <div className="headliners-modal-footer">
                <span className="card-indicator-dot" />
                <span>{selectedArtist.stage || 'Distinguished Headliner • Main Stage'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   11. TEMPORAL REFLECTIONS ARCHIVES (3D STACK)
   ========================================================= */
export const ARCHIVE_EDITIONS = [
  {
    id: 'autoshow',
    badge: 'FLAGSHIP EXPO',
    category: 'AUTOMOTIVE & SUPERCAR ARENA',
    log: 'CETP // YUKTHI\'26\nSTAGE_AUTO',
    title: 'AUTOSHOW',
    titleClass: 'temporal-title-autoshow',
    sub: 'Experience the roar of extreme horsepower, custom supercar builds, precision drift battles, and the ultimate automotive showcase at CET Payyanur.',
    image: '/images/events/autoshow.jpg',
    posterBadge: 'LIVE ATTRACTION',
    accent: '#ff4d2d',
    meta: [
      { label: 'VENUE', value: 'CET Payyanur Campus Grounds' },
      { label: 'SPECIAL', value: 'Supercars & Drift Exhibition' }
    ],
    tags: ['Supercars', 'Drift Battles', 'Custom Mods', 'Flame Show']
  },
  {
    id: 'robo-display',
    badge: 'TECH EXHIBITION',
    category: 'ROBOTICS & AI CONCLAVE',
    log: 'CETP // YUKTHI\'26\nEXHIBIT_ROBO',
    title: 'ROBO DISPLAY',
    titleClass: 'temporal-title-robo',
    sub: 'Explore, build, and innovate beyond limits. Featuring humanoid robots, quadruped robot dogs, autonomous drones, AI systems, and student engineering innovations.',
    image: '/images/events/robo-display.jpg',
    posterBadge: 'FLAGSHIP TECH',
    accent: '#00d0ff',
    meta: [
      { label: 'DATE', value: '14 OCT 2026' },
      { label: 'TIME', value: '10:00 AM - 4:00 PM' },
      { label: 'VENUE', value: 'CET Payyanur Exhibition Hall' }
    ],
    tags: ['Humanoid Robots', 'Robo Dog', 'Autonomous Drones', 'AI Systems']
  },
  {
    id: 'isro-display',
    badge: 'SPACE EXHIBITION',
    category: "INDIA'S SPACE ODYSSEY",
    log: 'CETP // YUKTHI\'26\nCOSMOS_HUB',
    title: 'ISRO DISPLAY',
    titleClass: 'temporal-title-isro',
    sub: "India's space journey closer than ever. Explore launch vehicles, orbital satellites, Chandrayaan lunar mission prototypes, and interactive space science exhibits.",
    image: '/images/events/isro-display.jpg',
    posterBadge: 'SPACE EXPO',
    accent: '#ff9933',
    meta: [
      { label: 'VENUE', value: 'CET Payyanur Exhibition Arena' },
      { label: 'EXHIBITS', value: 'Rockets, Satellites & Chandrayaan' }
    ],
    tags: ['Launch Vehicles', 'Chandrayaan', 'Satellites', 'Space Tech']
  },
  {
    id: 'almaram-music-band',
    badge: 'PRO SHOW HEADLINER',
    category: 'LIVE MUSIC & CONCERT ARENA',
    log: 'CETP // YUKTHI\'26\nPRO_SHOW_01',
    title: 'ALMARAM BAND',
    titleClass: 'temporal-title-almaram',
    sub: "Get ready Kannur! Feel the pulsating acoustic energy, soulful folk fusion, and electrifying live musical performance by Almaram Music Band at Yukthi X'26.",
    image: '/images/events/almaram-music-band.jpg',
    aspectRatio: '1 / 1',
    posterBadge: 'LIVE CONCERT',
    accent: '#ff2d55',
    meta: [
      { label: 'LOCATION', value: 'Kannur • CET Payyanur' },
      { label: 'STAGE', value: 'Grand Pro-Show Arena' }
    ],
    tags: ['AlmaramBand', 'LiveConcert', 'IndieFusion', 'MusicalNight']
  }
];

export function TemporalReflections({ onShowToast }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const stageInnerRef = useRef(null);
  const cardRefs = useRef([]);

  const targetRef = useRef(0);
  const curRef = useRef(0);
  const introRef = useRef(0);
  const coolRef = useRef(false);
  const mousePosRef = useRef({ mx: 0, my: 0, pmx: 0, pmy: 0 });
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const inViewRef = useRef(true);

  const lastIndex = ARCHIVE_EDITIONS.length - 1;

  // 1. Navigation functions
  const engageCooldown = useCallback(() => {
    coolRef.current = true;
    setTimeout(() => {
      coolRef.current = false;
    }, 850);
  }, []);

  const goTo = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(lastIndex, idx));
    if (clamped !== targetRef.current) {
      targetRef.current = clamped;
      setActiveIndex(clamped);
      engageCooldown();
    }
  }, [lastIndex, engageCooldown]);

  const step = useCallback((dir) => {
    if (coolRef.current) return;
    const next = Math.max(0, Math.min(lastIndex, targetRef.current + dir));
    if (next !== targetRef.current) {
      targetRef.current = next;
      setActiveIndex(next);
      engageCooldown();
    }
  }, [lastIndex, engageCooldown]);

  // 2. Depth Carousel Physics & Parallax Loop
  useEffect(() => {
    let animId;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const frame = () => {
      if (inViewRef.current) {
        curRef.current += (targetRef.current - curRef.current) * 0.058;
        if (Math.abs(targetRef.current - curRef.current) < 0.0004) {
          curRef.current = targetRef.current;
        }
        introRef.current += (1 - introRef.current) * 0.03;

        const m = mousePosRef.current;
        m.pmx += (m.mx - m.pmx) * 0.05;
        m.pmy += (m.my - m.pmy) * 0.05;

        if (stageInnerRef.current) {
          stageInnerRef.current.style.transform = `translate(${(m.pmx * 14).toFixed(2)}px, ${(m.pmy * 10).toFixed(2)}px)`;
        }

        const cards = cardRefs.current;
        for (let i = 0; i < cards.length; i++) {
          const c = cards[i];
          if (!c) continue;

          const d = i - curRef.current;
          let s, b, o, yy;

          if (d >= 0) {
            s = 1 - Math.min(d, 3) * 0.11;
            b = d * 8;
            o = 1 - Math.min(d, 1) * 0.62 - Math.max(0, Math.min(d - 1, 2)) * 0.22;
            yy = d * 30;
          } else {
            const p = -d;
            s = 1 + p * 1.15;
            b = p * 26;
            o = Math.max(0, 1 - p * 1.2);
            yy = -p * 46;
          }

          o = clamp(o, 0, 1) * introRef.current;
          const ss = s * (0.93 + 0.07 * introRef.current);

          c.style.transform = `translate(-50%, -50%) translateY(${yy.toFixed(2)}px) scale(${ss.toFixed(4)})`;
          c.style.filter = b < 0.12 ? 'none' : `blur(${b.toFixed(1)}px)`;
          c.style.opacity = o.toFixed(3);
          c.style.zIndex = String(200 - Math.round(d * 10));
          c.style.pointerEvents = Math.abs(d) < 0.4 ? 'auto' : 'none';
        }
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(animId);
  }, [lastIndex]);

  // 3. Mouse movement parallax & Intersection Observer
  useEffect(() => {
    const handleMouseMove = (e) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;

      mousePosRef.current.mx = (e.clientX - rect.left) / rect.width - 0.5;
      mousePosRef.current.my = (e.clientY - rect.top) / rect.height - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  // 4. Wheel navigation (non-blocking: passes through when at edges)
  const handleWheel = (e) => {
    if (e.deltaY < 0 && targetRef.current === 0) return;
    if (e.deltaY > 0 && targetRef.current === lastIndex) return;

    if (Math.abs(e.deltaY) > 24) {
      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    }
  };

  // 5. Touch handlers (supports both horizontal swipe and vertical flick)
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const dx = touchStartXRef.current - e.changedTouches[0].clientX;
    const dy = touchStartYRef.current - e.changedTouches[0].clientY;

    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy) * 0.9) {
      step(dx > 0 ? 1 : -1);
    } else if (Math.abs(dy) > 52) {
      step(dy > 0 ? 1 : -1);
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <section
      ref={sectionRef}
      className="temporal-archives-section"
      id="archives"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Archives Temporal Reflections"
    >
      {/* Ambient Cosmic Gold Nebula Glow over the Global Galaxy */}
      <div className="temporal-glow-ambient" />

      {/* Subtle Vertical Guides */}
      <div className="temporal-vlines">
        <i />
        <i />
        <i />
      </div>

      {/* Section Heading */}
      <div className="temporal-heading">
        <p className="temporal-phase">YUKTHI SHOWCASE&nbsp;&nbsp;//&nbsp;&nbsp;TEMPORAL REFLECTIONS</p>
        <h2>
          Temporal <em>Reflections.</em>
        </h2>
      </div>

      {/* 3D Depth Card Stage */}
      <div className="temporal-stage">
        <div ref={stageInnerRef} className="temporal-stage-inner">
          {ARCHIVE_EDITIONS.map((item, idx) => (
            <article
              key={item.id}
              ref={(el) => (cardRefs.current[idx] = el)}
              className="temporal-card has-poster"
              data-i={idx}
              onClick={() => goTo(idx)}
            >
              <div className="temporal-card-grid" />
              <div className="temporal-card-glow" />

              {/* Full-width Top Header spanning the card */}
              <div className="temporal-card-top-bar">
                <span className="temporal-card-badge-pill">{item.badge}</span>
                <span className="temporal-card-log">{item.log}</span>
              </div>

              {/* Main Content Split */}
              <div className="temporal-card-split">
                <div className="temporal-card-poster-col">
                  <div
                    className="temporal-card-poster-ambient"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div
                    className="temporal-card-poster-wrapper"
                    style={item.aspectRatio ? { aspectRatio: item.aspectRatio } : undefined}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="temporal-card-poster-img"
                      loading="eager"
                    />
                    <div className="temporal-card-poster-overlay" />
                    {item.posterBadge && (
                      <span className="temporal-poster-badge">{item.posterBadge}</span>
                    )}
                  </div>
                </div>

                <div className="temporal-card-info-col">
                  <div className="temporal-card-body">
                    <span className="temporal-card-category">{item.category}</span>
                    <h3 className={`temporal-card-title ${item.titleClass || ''}`}>
                      {item.title}
                    </h3>
                    <p className="temporal-card-sub">{item.sub}</p>

                    {item.meta && (
                      <div className="temporal-card-meta-list">
                        {item.meta.map((m, mi) => (
                          <div key={mi} className="temporal-meta-pill">
                            <span className="temporal-meta-label">{m.label}:</span>
                            <span className="temporal-meta-val">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.tags && (
                      <div className="temporal-card-tags">
                        {item.tags.map((tag, ti) => (
                          <span key={ti} className="temporal-tag-chip">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Corner crosshairs */}
              <span className="temporal-tick temporal-tl" />
              <span className="temporal-tick temporal-tr" />
              <span className="temporal-tick temporal-bl" />
              <span className="temporal-tick temporal-br" />
            </article>
          ))}
        </div>
      </div>

      {/* Desktop Prev / Next Floating Navigation Arrows */}
      <button
        type="button"
        className="temporal-nav-arrow prev desktop-only"
        onClick={() => step(-1)}
        disabled={activeIndex === 0}
        aria-label="Previous archive edition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="temporal-nav-arrow next desktop-only"
        onClick={() => step(1)}
        disabled={activeIndex === lastIndex}
        aria-label="Next archive edition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Mobile Navigation Controls Dock (prev / dots / next) */}
      <div className="temporal-mobile-controls" aria-label="Mobile card navigation">
        <button
          type="button"
          className="temporal-mobile-btn prev"
          onClick={() => step(-1)}
          disabled={activeIndex === 0}
          aria-label="Previous edition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="temporal-mobile-pills">
          {ARCHIVE_EDITIONS.map((ed, i) => (
            <button
              key={ed.id}
              type="button"
              className={`temporal-mobile-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Jump to ${ed.title}`}
            />
          ))}
          <span className="temporal-mobile-counter">0{activeIndex + 1}&nbsp;/&nbsp;0{ARCHIVE_EDITIONS.length}</span>
        </div>

        <button
          type="button"
          className="temporal-mobile-btn next"
          onClick={() => step(1)}
          disabled={activeIndex === lastIndex}
          aria-label="Next edition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Bottom Hint on Desktop */}
      <div className="temporal-hint desktop-only">
        <div className="temporal-mouse">
          <span />
        </div>
        <p>SCROLL OR CLICK TO EXPLORE EDITIONS</p>
      </div>
    </section>
  );
}

/* =========================================================
   12. 3D GALAXY COSMIC BACKGROUND SCENE
   ========================================================= */
function createGlowingStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 245, 225, 0.9)');
    gradient.addColorStop(0.48, 'rgba(244, 190, 108, 0.45)');
    gradient.addColorStop(0.78, 'rgba(217, 130, 43, 0.14)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export function GalaxyScene() {
    const mountRef = useRef(null);
    const constCanvasRef = useRef(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mount = mountRef.current;
        const constCanvas = constCanvasRef.current;
        if (!mount || !constCanvas) return;

        // 1. Constellation Network & Meteors Canvas
        const getViewportWidth = () => Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
        const getViewportHeight = () => window.innerHeight;

        const constCtx = constCanvas.getContext('2d');
        let cWidth = (constCanvas.width = getViewportWidth());
        let cHeight = (constCanvas.height = getViewportHeight());

        const nodes = Array.from({ length: 55 }, () => ({
            x: Math.random() * getViewportWidth(),
            y: Math.random() * getViewportHeight(),
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            radius: Math.random() * 1.5 + 0.8,
            alpha: Math.random() * 0.5 + 0.35
        }));

        const meteors = [];
        let nextMeteorTime = 0;

        function updateAndDrawConstellations(now) {
            constCtx.clearRect(0, 0, cWidth, cHeight);

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0) n.x = cWidth;
                else if (n.x > cWidth) n.x = 0;
                if (n.y < 0) n.y = cHeight;
                else if (n.y > cHeight) n.y = 0;

                for (let j = i + 1; j < nodes.length; j++) {
                    const m = nodes[j];
                    const dx = n.x - m.x;
                    const dy = n.y - m.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 115) {
                        const alpha = (1 - dist / 115) * 0.16;
                        constCtx.strokeStyle = `rgba(200, 225, 255, ${alpha})`;
                        constCtx.lineWidth = 0.75;
                        constCtx.beginPath();
                        constCtx.moveTo(n.x, n.y);
                        constCtx.lineTo(m.x, m.y);
                        constCtx.stroke();
                    }
                }

                constCtx.fillStyle = `rgba(255, 250, 235, ${n.alpha})`;
                constCtx.beginPath();
                constCtx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                constCtx.fill();
            }

            if (now > nextMeteorTime) {
                const angle = (Math.PI / 180) * (32 + Math.random() * 10);
                const speed = 4.5 + Math.random() * 4;
                meteors.push({
                    x: Math.random() * cWidth * 1.2 - cWidth * 0.1,
                    y: Math.random() * cHeight * 0.5,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    length: 45 + Math.random() * 35,
                    alpha: 0.85,
                    life: 0,
                    maxLife: 60 + Math.random() * 30
                });
                nextMeteorTime = now + 4000 + Math.random() * 4500;
            }

            for (let i = meteors.length - 1; i >= 0; i--) {
                const met = meteors[i];
                met.x += met.vx;
                met.y += met.vy;
                met.life++;
                met.alpha = 1 - met.life / met.maxLife;

                if (met.life >= met.maxLife || met.y > cHeight + 100) {
                    meteors.splice(i, 1);
                    continue;
                }

                const tailX = met.x - (met.vx / 5) * met.length;
                const tailY = met.y - (met.vy / 5) * met.length;

                const grad = constCtx.createLinearGradient(tailX, tailY, met.x, met.y);
                grad.addColorStop(0, 'rgba(100, 180, 255, 0)');
                grad.addColorStop(1, `rgba(160, 220, 255, ${met.alpha * 0.85})`);

                constCtx.strokeStyle = grad;
                constCtx.lineWidth = 1.4;
                constCtx.beginPath();
                constCtx.moveTo(tailX, tailY);
                constCtx.lineTo(met.x, met.y);
                constCtx.stroke();
            }
        }

        // 2. Three.js Scene, Fixed Perspective Camera, and Renderer
        const scene = new THREE.Scene();
        const initWidth = getViewportWidth();
        const initHeight = getViewportHeight();
        const camera = new THREE.PerspectiveCamera(65, initWidth / initHeight, 0.1, 100);
        camera.position.set(0, 2.7, 5.8);
        camera.lookAt(0, -0.32, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(initWidth, initHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // 3. Galaxy Particle Geometry & Color Grading (85,000 stars)
        const params = {
            count: 85000,
            size: 0.022,
            radius: 5.8,
            branches: 3,
            spin: 1.45,
            randomness: 0.22,
            randomnessPower: 3.2,
            colorCore: '#ffffff',
            colorInner: '#ffeed6',
            colorGold: '#f4be6c',
            colorBronze: '#d9822b',
            colorDust: '#8b4d1b',
            colorHalo: '#48cae4',
            rotationSpeed: 0.075
        };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(params.count * 3);
        const colors = new Float32Array(params.count * 3);

        const cCore = new THREE.Color(params.colorCore);
        const cInner = new THREE.Color(params.colorInner);
        const cGold = new THREE.Color(params.colorGold);
        const cBronze = new THREE.Color(params.colorBronze);
        const cDust = new THREE.Color(params.colorDust);
        const cHalo = new THREE.Color(params.colorHalo);

        for (let i = 0; i < params.count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * params.radius;
            const spinAngle = radius * params.spin;
            const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

            const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
            const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
            const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY * 0.42;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const ratio = radius / params.radius;
            const mixedColor = new THREE.Color();

            if (ratio < 0.18) {
                mixedColor.copy(cCore).lerp(cInner, ratio / 0.18);
            } else if (ratio < 0.55) {
                mixedColor.copy(cInner).lerp(cGold, (ratio - 0.18) / 0.37);
            } else if (ratio < 0.85) {
                mixedColor.copy(cGold).lerp(cBronze, (ratio - 0.55) / 0.3);
            } else {
                mixedColor.copy(cBronze).lerp(cDust, (ratio - 0.85) / 0.15);
            }

            if (Math.random() < 0.07 && ratio > 0.35) {
                mixedColor.lerp(cHalo, 0.65);
            }
            if (ratio < 0.12 && Math.random() < 0.4) {
                mixedColor.set('#ffffff');
            }

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starTexture = createGlowingStarTexture();
        const material = new THREE.PointsMaterial({
            size: params.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            map: starTexture,
            transparent: true,
            opacity: 0.95
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // 3b. Deep Space Ambient Starfield (20,000 stars across all sections)
        const ambientCount = 20000;
        const ambientGeo = new THREE.BufferGeometry();
        const ambientPos = new Float32Array(ambientCount * 3);
        const ambientCol = new Float32Array(ambientCount * 3);

        const goldTint = new THREE.Color('#f4be6c');
        const blueTint = new THREE.Color('#93c5fd');
        const whiteTint = new THREE.Color('#ffffff');

        for (let i = 0; i < ambientCount; i++) {
            const i3 = i * 3;
            ambientPos[i3] = (Math.random() - 0.5) * 45;
            ambientPos[i3 + 1] = (Math.random() - 0.5) * 35;
            ambientPos[i3 + 2] = (Math.random() - 0.5) * 35;

            const rand = Math.random();
            const starCol = rand < 0.5 ? whiteTint : rand < 0.8 ? goldTint : blueTint;
            ambientCol[i3] = starCol.r;
            ambientCol[i3 + 1] = starCol.g;
            ambientCol[i3 + 2] = starCol.b;
        }

        ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
        ambientGeo.setAttribute('color', new THREE.BufferAttribute(ambientCol, 3));

        const ambientMat = new THREE.PointsMaterial({
            size: 0.024,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            map: starTexture,
            transparent: true,
            opacity: 0.8
        });

        const ambientStars = new THREE.Points(ambientGeo, ambientMat);
        scene.add(ambientStars);

        // 4. Scroll Tracking for Smooth Parallax
        let targetScrollY = window.scrollY;
        let currentScrollY = window.scrollY;

        const handleScroll = () => {
            targetScrollY = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 5. Animation Loop
        const timer = new THREE.Timer();
        let animationFrameId;

        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            timer.update();
            const elapsedTime = timer.getElapsed();
            const now = performance.now();

            currentScrollY += (targetScrollY - currentScrollY) * 0.06;

            updateAndDrawConstellations(now);

            const scrollParallax = Math.min(currentScrollY, 3200);
            camera.position.y = 2.7 - scrollParallax * 0.00045;
            camera.position.z = 5.8 + scrollParallax * 0.0002;
            camera.lookAt(0, -0.32 - scrollParallax * 0.00045, 0);

            points.rotation.y = elapsedTime * params.rotationSpeed + currentScrollY * 0.00032;
            points.rotation.x = Math.sin(elapsedTime * 0.15) * 0.04 + currentScrollY * 0.00008;

            ambientStars.rotation.y = elapsedTime * 0.012 + currentScrollY * 0.00015;
            ambientStars.rotation.x = Math.cos(elapsedTime * 0.1) * 0.02;

            renderer.render(scene, camera);
        }
        animate();

        // 6. Window Resize Handler
        function handleResize() {
            const newW = getViewportWidth();
            const newH = getViewportHeight();
            cWidth = constCanvas.width = newW;
            cHeight = constCanvas.height = newH;

            camera.aspect = newW / newH;
            camera.updateProjectionMatrix();

            renderer.setSize(newW, newH);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        window.addEventListener('resize', handleResize);

        // 7. Cleanup on Unmount
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);

            if (mount && renderer.domElement && renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }

            geometry.dispose();
            material.dispose();
            ambientGeo.dispose();
            ambientMat.dispose();
            starTexture.dispose();
            renderer.dispose();
        };

    }, []);

    return (
        <div className="galaxy-container">
            <div className="cosmic-viewport">
                <div className="milky-way-layer" />
                <div className="tathva-nebula-glow" />
                <canvas ref={constCanvasRef} className="constellation-canvas" />
                <div className="vignette-overlay" />
            </div>
            <div ref={mountRef} className="webgl-mount" />
        </div>
    );
}

/* =========================================================
   13. MAIN YUKTHI X CONSOLIDATED COMPONENT
   ========================================================= */
export default function YukthiX({
    includeHeader = true,
    includeFooter = true,
    vaagaUrl = '/vaaga'
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    return (
        <div className="yukthix-portal-view">
            {/* Self-contained 3D Galaxy Cosmic Background */}
            <GalaxyScene />
            <Head>
                <title>YUKTHI X'26 | National Techno-Management Fest</title>
                <meta
                    name="description"
                    content="YUKTHI X'26 - National Techno-Management Fest at College of Engineering Payyanur."
                />
            </Head>

            {/* Header & Site Switcher */}
            {includeHeader && (
                <>
                    <Header
                        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
                        onShowToast={showToast}
                        vaagaUrl={vaagaUrl}
                    />
                    <MobileMenu
                        isOpen={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        onShowToast={showToast}
                        vaagaUrl={vaagaUrl}
                    />
                </>
            )}

            {/* Main Content Sections */}
            <main className="home-page-view">
                {/* Hero Section */}
                <Hero onShowToast={showToast} />

                {/* Headliners Orbit Showcase (Curated 3D Lineup) */}
                <HeadlinersOrbit onShowToast={showToast} />

                {/* 3D Infinite Spiral & Mobile Gallery */}
                {/* Temporal Reflections Archives (3D Depth Stack) */}
                <TemporalReflections onShowToast={showToast} />

                <YukthiGallerySpiral />
            </main>

            {/* Footer */}
            {includeFooter && <Footer />}

            {/* Dynamic Toast Feedback Overlay */}
            {toasts.length > 0 && (
                <div className="toast-container" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
                    {toasts.map((t) => (
                        <div
                            key={t.id}
                            className="toast"
                            style={{
                                background: 'rgba(14, 20, 34, 0.95)',
                                color: '#fff',
                                padding: '0.85rem 1.4rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(34, 211, 238, 0.4)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(34, 211, 238, 0.25)',
                                marginBottom: '0.5rem',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '0.9rem'
                            }}
                        >
                            <span>{t.message}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
