import React, { useState, useEffect, useRef, useCallback } from 'react';

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

export default function TemporalReflections({ onShowToast }) {
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
    // If scrolling up at start, allow default page scroll
    if (e.deltaY < 0 && targetRef.current === 0) return;
    // If scrolling down at end, allow default page scroll
    if (e.deltaY > 0 && targetRef.current === lastIndex) return;

    // Otherwise, transition between cards
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

    // If predominantly horizontal swipe, switch card
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
