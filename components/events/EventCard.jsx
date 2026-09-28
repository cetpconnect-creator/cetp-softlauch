import React from 'react';

export default function EventCard({ event, onSelect }) {
  if (!event) return null;

  const isClosed = !event.published;
  const priceText = event.price > 0 ? `₹${event.price}` : 'Free';
  const venueText = event.venueName || 'Main Campus';
  const imgSrc = event.picture || '/posters/event_6.webp';

  return (
    <div
      className={`event-card ${isClosed ? 'closed' : ''}`}
      onClick={() => onSelect && onSelect(event)}
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
        <img
          className="poster-img"
          src={imgSrc}
          alt={event.heading}
          loading="lazy"
          onError={(e) => {
            if (event.remotePicture) e.currentTarget.src = event.remotePicture;
          }}
        />
      </div>

      <div className="card-divider-line"></div>

      <div className="card-title-row">
        <h3 className="card-heading">{event.heading}</h3>
        <span className="arrow-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>

      <div className="card-desc-box">{event.description}</div>
      <div className="card-venue-box">{venueText}</div>

      <div className="card-price-row">
        <span className="price-val">{priceText}</span>
        <span className="extra-bullet">·</span>
        <span className="venue-info">{event.committee || (event.type === 'workshops' ? 'Workshop' : 'Event')}</span>
      </div>
    </div>
  );
}
