import React, { useState, useEffect, useRef } from 'react';
import EventCard from './EventCard';

const CIPHER_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=<>/\\|[]{}";
const getCipherChar = () => CIPHER_CHARSET[Math.floor(Math.random() * CIPHER_CHARSET.length)];

const generateCipherThresholds = (len) => {
  const arr = new Array(len);
  for (let i = 0; i < len; i++) {
    const n = len > 1 ? i / (len - 1) : 0;
    arr[i] = Math.min(0.72 * n + 0.28 * Math.random(), 1);
  }
  return arr;
};

export const formatWorkshopDate = (dt) => {
  if (!dt) return "11 October 2026";
  try {
    return new Date(dt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    });
  } catch (e) {
    return "11 October 2026";
  }
};

/**
 * Holographic HUD Workshops Grid Component
 */
export const WorkshopsGrid = ({ workshops = [], onSelect }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [activeId, setActiveId] = useState(null);
  const [tilts, setTilts] = useState({});
  const [firingRipples, setFiringRipples] = useState({});
  const [hudState, setHudState] = useState({
    visible: false,
    x: 0,
    y: 0,
    side: 'right',
    pathD: '',
    pathLength: 300,
    event: null
  });

  const [decryptedText, setDecryptedText] = useState({
    title: '',
    meta: '',
    desc: '',
    price: ''
  });

  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!activeId) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setHudState((prev) => ({ ...prev, visible: false }));
      return;
    }

    const event = workshops.find((w) => w.id === activeId);
    if (!event) return;

    const fullTitle = (event.heading || 'UNTITLED').toUpperCase();
    const fullMeta = `${formatWorkshopDate(event.datetime)}${event.time ? ' · ' + event.time : ''}${event.venueName ? ' · ' + event.venueName : ''}`;
    const fullDesc = event.description || 'No description available';
    const fullPrice = event.price > 0 ? `₹${event.price}` : 'Free';

    const thTitle = generateCipherThresholds(fullTitle.length);
    const thMeta = generateCipherThresholds(fullMeta.length);
    const thDesc = generateCipherThresholds(fullDesc.length);
    const thPrice = generateCipherThresholds(fullPrice.length);

    const startTime = performance.now();

    const updateFrame = (now) => {
      const elapsed = now - startTime;

      const pTitle = Math.min(Math.max((elapsed - 0) / 360, 0), 1);
      const pMeta = Math.min(Math.max((elapsed - 80) / 360, 0), 1);
      const pDesc = Math.min(Math.max((elapsed - 150) / 480, 0), 1);
      const pPrice = Math.min(Math.max((elapsed - 240) / 280, 0), 1);

      const cipherTransform = (str, ths, p) => {
        if (p >= 1) return str;
        let res = '';
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          if (char === ' ' || char === '·' || char === '(' || char === ')' || p >= ths[i]) {
            res += char;
          } else {
            res += getCipherChar();
          }
        }
        return res;
      };

      setDecryptedText({
        title: cipherTransform(fullTitle, thTitle, pTitle),
        meta: cipherTransform(fullMeta, thMeta, pMeta),
        desc: cipherTransform(fullDesc, thDesc, pDesc),
        price: cipherTransform(fullPrice, thPrice, pPrice)
      });

      if (pPrice < 1 || pDesc < 1) {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeId, workshops]);

  const calculateHudPosition = (id) => {
    const container = containerRef.current;
    const card = cardRefs.current[id];
    if (!container || !card) return;

    const contRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const event = workshops.find((w) => w.id === id);
    if (!event) return;

    const spaceRight = window.innerWidth - cardRect.right;
    const spaceLeft = cardRect.left;
    const side = spaceRight >= 350 ? 'right' : spaceLeft >= 350 ? 'left' : spaceRight >= spaceLeft ? 'right' : 'left';

    const cardRelLeft = cardRect.left - contRect.left;
    const cardRelTop = cardRect.top - contRect.top;
    const cardRelRight = cardRect.right - contRect.left;

    const anchorX = side === 'right' ? cardRelRight : cardRelLeft;
    const anchorY = cardRelTop + cardRect.height * 0.28;

    const isMobile = window.innerWidth < 640;
    let hudX = side === 'right' ? cardRelRight + 26 : cardRelLeft - 380 - 26;
    let hudY = cardRelTop + 22;

    if (isMobile) {
      hudX = 14;
      hudY = cardRelTop + cardRect.height * 0.44;
    }

    const cornerX = side === 'right' ? anchorX + 18 : anchorX - 18;
    const labelX = side === 'right' ? hudX : hudX + 380;
    const labelY = hudY + 14;

    const pathD = isMobile
      ? `M ${anchorX} ${anchorY} L ${hudX + 20} ${labelY}`
      : `M ${anchorX} ${anchorY} L ${cornerX} ${anchorY} L ${cornerX} ${labelY} L ${labelX} ${labelY}`;

    const approxLength = isMobile ? 120 : Math.abs(cornerX - anchorX) + Math.abs(labelY - anchorY) + Math.abs(labelX - cornerX);

    setHudState({
      visible: true,
      x: hudX,
      y: hudY,
      side,
      pathD,
      pathLength: Math.max(approxLength, 200),
      event
    });
  };

  const handleMouseEnter = (e, id) => {
    setActiveId(id);
    calculateHudPosition(id);

    const card = cardRefs.current[id];
    if (card) {
      const rect = card.getBoundingClientRect();
      const xPct = Math.min(Math.max(((e.clientX - rect.left) / rect.width) * 100, 0), 100);
      const yPct = Math.min(Math.max(((e.clientY - rect.top) / rect.height) * 100, 0), 100);
      setFiringRipples((prev) => ({
        ...prev,
        [id]: { x: xPct, y: yPct, active: true }
      }));
    }
  };

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = Math.max(-0.5, Math.min(0.5, normX));
    const tiltY = Math.max(-0.5, Math.min(0.5, normY));

    setTilts((prev) => ({
      ...prev,
      [id]: {
        x: tiltX * 22,
        y: tiltY * 22,
        rotX: -tiltY * 9,
        rotY: tiltX * 9,
        pulseX: (normX + 0.5) * 100,
        pulseY: (normY + 0.5) * 100
      }
    }));
  };

  const handleMouseLeave = (id) => {
    if (activeId === id) {
      setActiveId(null);
    }
    setTilts((prev) => ({
      ...prev,
      [id]: { x: 0, y: 0, rotX: 0, rotY: 0, pulseX: 50, pulseY: 50 }
    }));
  };

  const handleTouch = (e, event) => {
    if (activeId === event.id) {
      if (onSelect) onSelect(event);
      return;
    }
    setActiveId(event.id);
    calculateHudPosition(event.id);

    const card = cardRefs.current[event.id];
    if (card) {
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const xPct = touch ? Math.min(Math.max(((touch.clientX - rect.left) / rect.width) * 100, 0), 100) : 50;
      const yPct = touch ? Math.min(Math.max(((touch.clientY - rect.top) / rect.height) * 100, 0), 100) : 50;
      setFiringRipples((prev) => ({
        ...prev,
        [event.id]: { x: xPct, y: yPct, active: true }
      }));
    }
  };

  return (
    <div ref={containerRef} className="workshops-container-wrapper">
      <div className={`workshop-focus-overlay ${activeId ? 'active' : ''}`} />

      {hudState.visible && (
        <svg className="workshop-connector-svg" aria-hidden="true">
          <path
            d={hudState.pathD}
            className="workshop-connector-line"
            style={{
              strokeDasharray: hudState.pathLength,
              strokeDashoffset: 0
            }}
          />
        </svg>
      )}

      {hudState.visible && hudState.event && (
        <div
          className={`workshop-hud-panel visible align-${hudState.side}`}
          style={{
            left: `${hudState.x}px`,
            top: `${hudState.y}px`
          }}
        >
          <div className="workshop-hud-title">{decryptedText.title}</div>
          <div className="workshop-hud-meta">{decryptedText.meta}</div>
          <div className="workshop-hud-desc">{decryptedText.desc}</div>
          <div className="workshop-hud-price">
            <span>{decryptedText.price}</span>
            <button
              className="workshop-hud-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect(hudState.event);
              }}
            >
              <span>{hudState.event.published ? 'Register' : 'View Details'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="workshops-grid">
        {workshops.map((ev) => {
          const isActive = activeId === ev.id;
          const isDimmed = activeId !== null && !isActive;
          const tilt = tilts[ev.id] || { x: 0, y: 0, rotX: 0, rotY: 0, pulseX: 50, pulseY: 50 };
          const ripple = firingRipples[ev.id] || { x: 50, y: 50, active: false };
          const isClosed = !ev.published;

          const transformStyle = isActive
            ? `perspective(1000px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) translate3d(${tilt.x}px, ${tilt.y}px, 18px) scale3d(1.07, 1.07, 1.07)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)';

          return (
            <div
              key={ev.id}
              ref={(el) => {
                if (el) cardRefs.current[ev.id] = el;
              }}
              className={`workshop-card ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
              style={{ transform: transformStyle }}
              onMouseEnter={(e) => handleMouseEnter(e, ev.id)}
              onMouseMove={(e) => handleMouseMove(e, ev.id)}
              onMouseLeave={() => handleMouseLeave(ev.id)}
              onTouchStart={(e) => handleTouch(e, ev)}
              onClick={() => onSelect && onSelect(ev)}
            >
              <div className="poster-frame">
                {isClosed && (
                  <div className="booking-full-overlay" aria-label="Booking full">
                    <div className="booking-full-backdrop"></div>
                    <div className="booking-full-banner">
                      <div className="booking-full-bar left"></div>
                      <div className="booking-full-bar right"></div>
                      <span className="booking-full-text">BOOKING FULL</span>
                    </div>
                  </div>
                )}

                <div
                  className="workshop-pulse-overlay"
                  style={{
                    '--pulse-x': tilt.pulseX,
                    '--pulse-y': tilt.pulseY
                  }}
                  aria-hidden="true"
                />

                <div
                  className={`workshop-activation-overlay ${ripple.active ? 'firing' : ''}`}
                  style={{
                    '--activation-x': `${ripple.x}%`,
                    '--activation-y': `${ripple.y}%`
                  }}
                  aria-hidden="true"
                />

                <img
                  className="poster-img"
                  src={ev.picture || `/posters/event_${ev.id}.webp`}
                  alt={ev.heading}
                  loading="lazy"
                  onError={(e) => {
                    if (ev.remotePicture) e.currentTarget.src = ev.remotePicture;
                  }}
                />
              </div>

              <div className="workshop-static-info">
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#ffffff' }}>
                  {ev.heading}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: '4px', fontFamily: 'monospace' }}>
                  {formatWorkshopDate(ev.datetime)} {ev.venueName ? `· ${ev.venueName}` : ''}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, marginTop: '6px', fontFamily: 'monospace' }}>
                  {ev.price > 0 ? `₹${ev.price}` : 'Free'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function EventGrid({ events = [], onSelect, emptyMessage = 'No events found.' }) {
  if (!events || events.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '3rem 0', fontSize: '1.1rem' }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="events-grid competitions-grid">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} onSelect={onSelect} />
      ))}
    </div>
  );
}
