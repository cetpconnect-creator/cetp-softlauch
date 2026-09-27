import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CountdownTimer } from './Hero';

const TECHKRITI_SUMMITS = [
  {
    id: 'tech-summit',
    index: '01',
    name: 'TECH SUMMIT',
    brief: 'Engineering the future through disruptive innovations.',
    image: 'https://2026.techkriti.org/images/summits/tech-summit.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    category: 'DISRUPTIVE INNOVATION',
    route: '/workshops'
  },
  {
    id: 'ai-summit',
    index: '02',
    name: 'AI SUMMIT',
    brief: 'Exploring the frontiers of artificial intelligence and machine learning.',
    image: 'https://2026.techkriti.org/images/summits/ai-summit.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80',
    category: 'MACHINE LEARNING & GENAI',
    route: '/competitions'
  },
  {
    id: 'rakshakriti',
    index: '03',
    name: 'RAKSHAKRITI',
    brief: 'Strengthening national security through indigenous defense technology.',
    image: 'https://2026.techkriti.org/images/summits/rakshakriti.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    category: 'DEFENSE & AEROSPACE',
    route: '/workshops'
  },
  {
    id: 'medtech',
    index: '04',
    name: 'MEDTECH',
    brief: 'Revolutionizing healthcare with advanced medical engineering.',
    image: 'https://2026.techkriti.org/images/summits/medtech.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    category: 'BIOMEDICAL ENGINEERING',
    route: '/competitions'
  },
  {
    id: 'space',
    index: '05',
    name: 'SPACE',
    brief: 'Scaling new heights in aerospace and interplanetary exploration.',
    image: 'https://2026.techkriti.org/images/summits/space.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80',
    category: 'ASTRONOMY & ROCKETRY',
    route: '/workshops'
  },
  {
    id: 'e-conclave',
    index: '06',
    name: 'E - CONCLAVE',
    brief: "Igniting the entrepreneurial spirit of tomorrow's leaders.",
    image: 'https://2026.techkriti.org/images/summits/e-conclave.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=80',
    category: 'VENTURE & STARTUPS',
    route: '/lectures'
  },
  {
    id: 'sustainability',
    index: '07',
    name: 'SUSTAINABILITY',
    brief: 'Crafting eco-friendly solutions for a greener planet.',
    image: 'https://2026.techkriti.org/images/summits/sustainability.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80',
    category: 'CLEANTECH & CLIMATE',
    route: '/workshops'
  },
  {
    id: 'industry-4-0',
    index: '08',
    name: 'INDUSTRY 4.0',
    brief: 'Mastering the smart manufacturing and automation revolution.',
    image: 'https://2026.techkriti.org/images/summits/industry-4-0.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    category: 'SMART AUTOMATION',
    route: '/competitions'
  },
  {
    id: 'women-panel',
    index: '09',
    name: 'WOMEN PANEL',
    brief: 'Celebrating and empowering women leaders in the tech ecosystem.',
    image: 'https://2026.techkriti.org/images/summits/women-panel.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    category: 'WOMEN IN TECH',
    route: '/lectures'
  },
  {
    id: 'vision-360',
    index: '10',
    name: 'VISION 360',
    brief: 'Shaping global policies through multifaceted dialogue.',
    image: 'https://2026.techkriti.org/images/summits/vision-360.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    category: 'POLICY & DIPLOMACY',
    route: '/lectures'
  }
];

export const TechkritiSummitsDialShowcase = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const wheelCooldownRef = useRef(false);
  const touchStartY = useRef(0);

  const currentSummit = TECHKRITI_SUMMITS[activeIndex];

  useEffect(() => {
    if (isHovered) return;

    const intervalTime = 40;
    const totalDuration = 3800;
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % TECHKRITI_SUMMITS.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isHovered, activeIndex]);

  const handleWheel = useCallback((e) => {
    if (Math.abs(e.deltaY) < 15) return;
    if (wheelCooldownRef.current) return;
    wheelCooldownRef.current = true;
    setTimeout(() => {
      wheelCooldownRef.current = false;
    }, 220);

    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % TECHKRITI_SUMMITS.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + TECHKRITI_SUMMITS.length) % TECHKRITI_SUMMITS.length);
    }
    setProgress(0);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: normX, y: normY });

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cardX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
      const cardY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
      cardRef.current.style.setProperty('--mouse-x', `${cardX}%`);
      cardRef.current.style.setProperty('--mouse-y', `${cardY}%`);
    }
  }, []);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev + 1) % TECHKRITI_SUMMITS.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + TECHKRITI_SUMMITS.length) % TECHKRITI_SUMMITS.length);
      }
      setProgress(0);
    }
  };

  const dialRotationAngle = -activeIndex * 20 + mousePos.y * 8;

  return (
    <section
      ref={containerRef}
      className="techkriti-summits-section"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Techkriti Summits Showcase"
    >
      <div className="techkriti-ambient-glow-left" />
      <div className="techkriti-ambient-glow-right" />

      <div className="techkriti-stage-container">
        {/* LEFT SIDE: RADAR DIAL */}
        <div className="techkriti-dial-side">
          <div className="techkriti-radar-container">
            <svg
              className="techkriti-radar-svg"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="dialCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="#b45309" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="dialCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="300" cy="300" r="280" stroke="rgba(245, 158, 11, 0.22)" strokeWidth="1" />
              <circle cx="300" cy="300" r="235" stroke="rgba(245, 158, 11, 0.16)" strokeWidth="1" />
              <circle cx="300" cy="300" r="185" stroke="rgba(245, 158, 11, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="300" cy="300" r="130" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1" />
              <circle cx="300" cy="300" r="120" fill="url(#dialCenterGlow)" />
              <circle cx="300" cy="300" r="60" fill="url(#dialCoreGlow)" />

              <g
                className="dial-ticks-group"
                style={{
                  transform: `rotate(${dialRotationAngle}deg)`
                }}
              >
                {Array.from({ length: 120 }).map((_, i) => {
                  const angle = (i * 360) / 120;
                  const isMajor = i % 10 === 0;
                  const isSemi = i % 5 === 0;
                  const tickLength = isMajor ? 18 : isSemi ? 11 : 6;
                  const r1 = 280;
                  const r2 = r1 - tickLength;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 300 + r1 * Math.cos(rad);
                  const y1 = 300 + r1 * Math.sin(rad);
                  const x2 = 300 + r2 * Math.cos(rad);
                  const y2 = 300 + r2 * Math.sin(rad);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isMajor ? '#f59e0b' : isSemi ? 'rgba(245, 158, 11, 0.55)' : 'rgba(245, 158, 11, 0.25)'}
                      strokeWidth={isMajor ? 2 : 1}
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          <div className="dial-center-pointer">
            <div className="dial-pointer-line" />
            <div className="dial-pointer-bracket">
              <span className="dial-bracket-number">{currentSummit.index}</span>
            </div>
          </div>

          <div className="summits-list-window">
            <div
              className="summits-list-track"
              style={{
                transform: `translateY(-${activeIndex * 68 + 34}px)`
              }}
            >
              {TECHKRITI_SUMMITS.map((summit, idx) => {
                const isActive = idx === activeIndex;
                const dist = Math.abs(idx - activeIndex);
                const opacity = isActive ? 1 : dist === 1 ? 0.38 : dist === 2 ? 0.16 : 0.04;
                const scale = isActive ? 1.05 : dist === 1 ? 0.94 : 0.88;

                return (
                  <button
                    key={summit.id}
                    className={`summit-name-row ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveIndex(idx);
                      setProgress(0);
                    }}
                    onMouseEnter={() => {
                      setActiveIndex(idx);
                      setProgress(0);
                    }}
                    style={{
                      opacity,
                      transform: `scale(${scale})`
                    }}
                    title={`View ${summit.name}`}
                  >
                    <span className="summit-row-index">{summit.index}</span>
                    <span className="summit-row-title">{summit.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: 3D CARD */}
        <div className="techkriti-card-side">
          <div
            ref={cardRef}
            className="summit-3d-card-wrapper"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 14}deg) rotateX(${-mousePos.y * 14}deg)`,
              transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={() => router.push(currentSummit.route)}
            title={`Explore ${currentSummit.name}`}
          >
            <img
              key={currentSummit.id}
              src={currentSummit.image}
              alt={currentSummit.name}
              className="summit-card-bg-image"
              onError={(e) => {
                if (e.currentTarget.src !== currentSummit.fallbackImage) {
                  e.currentTarget.src = currentSummit.fallbackImage;
                }
              }}
            />
            <div className="summit-card-glare" />

            <div className="summit-card-overlay">
              <div className="summit-card-meta">
                <span className="summit-category-pill">{currentSummit.category}</span>
                <span className="summit-index-counter">
                  {currentSummit.index} / {TECHKRITI_SUMMITS.length.toString().padStart(2, '0')}
                </span>
              </div>

              <h3 className="summit-card-title">{currentSummit.name}</h3>
              <p className="summit-card-brief">{currentSummit.brief}</p>

              <div className="summit-card-actions">
                <span className="summit-action-btn">
                  <span>EXPLORE SUMMIT</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>

              <div className="summit-auto-progress-bar">
                <div
                  className="summit-auto-progress-fill"
                  style={{ width: `${isHovered ? 100 : progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="techkriti-controls-row">
        <div className="summit-dot-indicators" role="tablist" aria-label="Summit Selection">
          {TECHKRITI_SUMMITS.map((summit, idx) => (
            <button
              key={summit.id}
              className={`summit-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(idx);
                setProgress(0);
              }}
              title={summit.name}
              aria-label={summit.name}
            />
          ))}
        </div>

        <div className="summit-mouse-hint">
          <span>{isHovered ? 'PAUSED • MOVE MOUSE / SCROLL WHEEL' : 'AUTO-ROTATING • HOVER TO EXPLORE'}</span>
        </div>
      </div>
    </section>
  );
};

const GALLERY_IMAGES = [
  { id: 1, src: '/images/gallery/dodge_drift.jpg', alt: 'Dodge Charger Dirt Drift Stunt' },
  { id: 2, src: '/images/gallery/bike_stunt.jpg', alt: 'Extreme Bike Stunt on Fire' },
  { id: 3, src: '/images/gallery/singer_performance.png', alt: 'Anju Joseph Live Vocal Performance' },
  { id: 4, src: '/images/gallery/mercedes_drift.jpg', alt: 'Vintage Mercedes-Benz Dirt Drift' },
  { id: 5, src: '/images/gallery/glive_singer.png', alt: 'G-Live Pro Stage Solo Vocal Concert' },
  { id: 6, src: '/images/gallery/isro_rocket.jpg', alt: 'ISRO LVM3 Rocket & Space Exhibition' },
  { id: 7, src: '/images/gallery/dignitaries_stage.jpg', alt: 'Fest Inauguration & Dignitaries' },
  { id: 8, src: '/images/gallery/concert_payyanur.png', alt: 'Live Pro Concert Performance' }
];

const clampVal = (val, min, max) => Math.min(Math.max(val, min), max);
const smoothstepVal = (min, max, val) => {
  const a = clampVal((val - min) / (max - min || 1), 0, 1);
  return a * a * (3 - 2 * a);
};

function InfiniteSpiral({
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

function MobileGalleryCarousel({ items }) {
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
  }, []);

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

export const TathvaGallerySpiral = () => {
  return (
    <div id="galleryx" className="tathva-gallery-section my-auto mb-14 bg-transparent relative z-10">
      <div className="gallery-header-box flex justify-center items-center px-4 sm:px-8 lg:px-16 sm:py-12 relative">
        <div className="gallery-header-glow-bg absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,190,108,0.1)_0%,_transparent_65%)] pointer-events-none -z-10" />
        <p className="text-center max-w-3xl text-gray-200 plus-jakarta leading-relaxed tracking-wide font-light drop-shadow-md">
          <span className="gallery-main-title bg-gradient-to-r pp-fragment from-white via-gray-200 to-white bg-clip-text text-transparent text-4xl tracking-wide sm:text-5xl block mb-6 sm:mb-10 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            YUKTHI X'26 Gallery
          </span>
          <span className="gallery-subtitle inline-block text-white/90 font-light mb-5">
            Scroll through the moments that define YUKTHI X'26 — step into the vibrant spirit of{' '}
            <span className="font-medium text-white highlight">creativity</span> and{' '}
            <span className="font-medium text-white highlight">unforgettable</span> memories.
          </span>
        </p>
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

export default function About() {
  return (
    <div className="home-about-container">
      {/* Interactive Radar Dial Summits Showcase */}
      <TechkritiSummitsDialShowcase />

      {/* 3D Infinite Spiral Gallery */}
      <TathvaGallerySpiral />

      {/* Countdown Timer */}
      <div className="gallery-downside-countdown">
        <p className="hero-launch-label">WEBSITE LAUNCHING IN</p>
        <CountdownTimer />
      </div>
    </div>
  );
}
