import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HeadlinersOrbit from '../HeadlinersOrbit';
import TemporalReflections from '../TemporalReflections';

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
   12. MAIN YUKTHI X CONSOLIDATED COMPONENT
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
