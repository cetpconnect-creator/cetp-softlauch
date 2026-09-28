import React from 'react';

export default function EventModal({ event, onClose, onRegister }) {
  if (!event) return null;

  return (
    <div
      id="event-modal"
      className="modal-overlay open"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target.id === 'event-modal') onClose();
      }}
    >
      <div className="modal-content-box">
        <button
          id="modal-close-btn"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-poster-side">
          <img
            className="modal-poster-img"
            src={event.picture || '/posters/event_6.webp'}
            alt={event.heading}
            onError={(e) => {
              if (event.remotePicture) e.currentTarget.src = event.remotePicture;
            }}
          />
        </div>

        <div className="modal-info-side">
          <span className="modal-category-badge">
            {event.type === 'workshops' ? 'WORKSHOP' : 'COMPETITION'}
          </span>
          <h2 className="modal-title pp-fragment">{event.heading}</h2>
          <p className="modal-tagline">{event.catchyPara || "Official YUKTHI X'26 Event"}</p>

          <div className="modal-meta-grid">
            <div className="modal-meta-item">
              <span className="modal-meta-label">Registration Fee</span>
              <span className="modal-meta-val" style={{ color: '#22d3ee' }}>
                {event.price > 0 ? `₹${event.price}` : 'Free'}
              </span>
            </div>
            <div className="modal-meta-item">
              <span className="modal-meta-label">Organized By</span>
              <span className="modal-meta-val">{event.committee || 'YUKTHI Committee'}</span>
            </div>
            <div className="modal-meta-item" style={{ gridColumn: 'span 2' }}>
              <span className="modal-meta-label">Venue</span>
              <span className="modal-meta-val">{event.venueName || 'Main Campus'}</span>
            </div>
          </div>

          <div className="modal-desc-body">
            <p>{event.description}</p>
          </div>

          <div className="modal-action-row">
            <button
              className={`register-btn ${!event.published ? 'disabled' : ''}`}
              disabled={!event.published}
              onClick={() => {
                if (event.published) {
                  if (onRegister) onRegister(event);
                  else alert(`Registered successfully for ${event.heading}! Confirmation sent.`);
                }
              }}
            >
              {event.published ? 'REGISTER NOW' : 'BOOKING FULL'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
