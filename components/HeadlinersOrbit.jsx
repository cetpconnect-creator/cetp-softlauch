import React, { useState, useEffect, useRef, useCallback } from 'react';

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

const REPEAT_COUNT = 4;

export default function HeadlinersOrbit({ onShowToast }) {
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
      return track.scrollWidth / REPEAT_COUNT;
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
    const w = track.scrollWidth / REPEAT_COUNT;
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
  const loopArtists = Array(REPEAT_COUNT).fill(HEADLINER_ARTISTS).flat();

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
