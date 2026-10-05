import HeadlinersOrbit from '../HeadlinersOrbit';
import TemporalReflections from '../TemporalReflections';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CountdownTimer } from './Hero';


const GALLERY_IMAGES = [
  { id: 1, src: '/images/gallery/dodge_drift.jpg', alt: 'Dodge Charger Dirt Drift Stunt' },
  { id: 2, src: '/images/gallery/bike_stunt.jpg', alt: 'Extreme Bike Stunt on Fire' },
  { id: 3, src: '/images/gallery/singer_performance.png', alt: 'Anju Joseph Live Vocal Performance' },
  { id: 4, src: '/images/gallery/mercedes_drift.jpg', alt: 'Vintage Mercedes-Benz Dirt Drift' },
  { id: 5, src: '/images/gallery/glive_singer.png', alt: 'G-Live Pro Stage Solo Vocal Concert' },
  { id: 6, src: '/images/gallery/isro_rocket.jpg', alt: 'ISRO LVM3 Rocket & Space Exhibition' },
  { id: 7, src: '/images/gallery/dignitaries_stage.jpg', alt: 'College of Engineering & Technology Payyanur Welcome Ceremony' },
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

export default function About() {
  return (
    <div className="home-about-container">
      {/* Countdown Timer (Replaced Summits Dial Showcase) */}
      <div className="gallery-downside-countdown" style={{ margin: '2.5rem auto 2rem', textAlign: 'center' }}>
        <CountdownTimer />
      </div>

      {/* Headliners Orbit Showcase */}
      <HeadlinersOrbit />

      {/* Temporal Reflections Archives */}
      <TemporalReflections />

      <YukthiGallerySpiral />
    </div>
  );
}
