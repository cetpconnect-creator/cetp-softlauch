import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EVENTS_DATA, getEventById } from '../../data/events';
import { formatWorkshopDate } from '../../components/events/EventGrid';

export default function EventDetailPage({ onToast }) {
  const router = useRouter();
  const { id } = router.query;

  const event = getEventById(id);

  if (!router.isReady) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'rgba(255,255,255,0.7)' }}>
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="workshop-detail-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <h2 className="pp-fragment" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Event Not Found
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>
          The requested event could not be found or does not exist.
        </p>
        <Link href="/" className="return-home-btn" style={{ display: 'inline-flex' }}>
          ← Return to Home
        </Link>
      </div>
    );
  }

  const dateStr = formatWorkshopDate(event.datetime);
  const timeStr = event.time || '9:00 am';
  const venueStr = event.venueName
    ? `${event.venueName}${event.venueLocation ? ', ' + event.venueLocation : ''}`
    : 'East Campus Lecture Hall Complex (ECLC)';
  const priceStr = event.price > 0 ? `₹${event.price}` : 'Free';
  const imgSrc = event.picture || `/posters/event_${event.id}.webp`;

  const handleRegister = () => {
    if (event.published) {
      if (onToast) {
        onToast(`✨ Registered successfully for ${event.heading}! Confirmation sent.`);
      } else {
        alert(`✨ Registered successfully for ${event.heading}! Confirmation sent.`);
      }
    } else {
      if (onToast) {
        onToast('⚠️ Registrations for this event are currently full.');
      } else {
        alert('⚠️ Registrations for this event are currently full.');
      }
    }
  };

  return (
    <>
      <Head>
        <title>{event.heading} | YUKTHI X'26</title>
        <meta name="description" content={event.catchyPara || event.description} />
      </Head>

      <div className="workshop-detail-container">
        <div className="workshop-detail-inner">
          {/* Breadcrumb & Title */}
          <div className="workshop-detail-header">
            <button
              className="workshop-back-btn"
              onClick={() => router.back()}
              aria-label="Back"
            >
              ← Back
            </button>
            <h1 className="workshop-detail-title pp-fragment">{event.heading}</h1>
          </div>

          {/* 2-Column Content Grid */}
          <div className="workshop-detail-grid">
            {/* Left: Poster Image Frame */}
            <div className="workshop-poster-column">
              <div className="workshop-poster-box">
                <img
                  src={imgSrc}
                  alt={event.heading}
                  className="workshop-poster-image"
                  onError={(e) => {
                    if (event.remotePicture) e.currentTarget.src = event.remotePicture;
                  }}
                />
              </div>
            </div>

            {/* Right: Glassmorphic Details Card */}
            <div className="workshop-info-glass-card">
              {/* 2x2 Meta Grid: Date, Time, Venue, Price */}
              <div className="workshop-meta-grid">
                <div className="workshop-meta-cell">
                  <p className="meta-cell-label">Date</p>
                  <p className="meta-cell-value">{dateStr}</p>
                </div>
                <div className="workshop-meta-cell">
                  <p className="meta-cell-label">Time</p>
                  <p className="meta-cell-value">{timeStr}</p>
                </div>
                <div className="workshop-meta-cell">
                  <p className="meta-cell-label">Venue</p>
                  <p className="meta-cell-value">{venueStr}</p>
                </div>
                <div className="workshop-meta-cell">
                  <p className="meta-cell-label">Price</p>
                  <p className="meta-cell-value">{priceStr}</p>
                </div>
              </div>

              <div className="workshop-detail-divider"></div>

              {/* Description Text */}
              <div className="workshop-detail-desc">{event.description}</div>

              {/* Action Button */}
              <div className="workshop-action-row">
                <button
                  className={`workshop-register-btn ${!event.published ? 'disabled' : ''}`}
                  onClick={handleRegister}
                  disabled={!event.published}
                >
                  {event.published ? 'Register Now' : 'Booking Full'}
                </button>
              </div>

              {/* Profile Note & Refund Policy */}
              <p className="workshop-profile-note">
                Note - Ticket details are automatically linked to your registered profile.
              </p>
              <p className="workshop-refund-policy">
                Refund Policy - All tickets are non-refundable and non-transferable except in the case of event cancellation or technical issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
