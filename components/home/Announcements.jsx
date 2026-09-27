import React, { useState } from 'react';

export const ContactSection = ({ onToast }) => {
  const [form, setForm] = useState({ topic: '', name: '', email: '', phone: '', query: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      if (onToast) onToast('⚠️ Please enter your name and email.');
      else alert('⚠️ Please enter your name and email.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onToast) onToast('✨ Message sent successfully! Our team will contact you soon.');
      else alert('✨ Message sent successfully! Our team will contact you soon.');
      setForm({ topic: '', name: '', email: '', phone: '', query: '' });
    }, 800);
  };

  return (
    <section className="tathva-contact-section">
      <div className="contact-card-box">
        <div className="contact-header">
          <p className="contact-tag">Get In Touch</p>
          <h2 className="contact-title pp-fragment">CONTACT US</h2>
          <p className="contact-desc">
            For all YUKTHI X'26 enquiries, our team is just a message away. Drop us a line and we'll get back to you shortly.
          </p>
        </div>

        <form className="contact-form-grid" onSubmit={handleSubmit}>
          <div className="contact-field-group">
            <label className="contact-field-label">Topic</label>
            <input
              type="text"
              placeholder="e.g. Workshops, Sponsorship"
              className="contact-field-input"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>

          <div className="contact-field-group">
            <label className="contact-field-label">Name</label>
            <input
              type="text"
              placeholder="Full Name"
              className="contact-field-input"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="contact-field-group">
            <label className="contact-field-label">Email</label>
            <input
              type="email"
              placeholder="yourname@example.com"
              className="contact-field-input"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="contact-field-group">
            <label className="contact-field-label">Phone</label>
            <input
              type="tel"
              placeholder="+91 00000 00000"
              className="contact-field-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="contact-field-group form-col-full">
            <label className="contact-field-label">Query Details</label>
            <textarea
              rows="4"
              placeholder="How can we help you?"
              className="contact-field-textarea"
              required
              value={form.query}
              onChange={(e) => setForm({ ...form, query: e.target.value })}
            />
          </div>

          <div className="form-col-full" style={{ textAlign: 'center' }}>
            <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default function Announcements({ onToast }) {
  const announcementsList = [
    { id: 1, tag: 'HOT', text: 'Workshops registration is now LIVE for Autonomous Driving, Cyber Forensics & more.' },
    { id: 2, tag: 'NEW', text: 'RoboWars 8KG & 15KG arena entries are now open for teams.' },
    { id: 3, tag: 'INFO', text: 'Pre-Tathva Battle of Bands tickets available soon.' }
  ];

  return (
    <div className="home-announcements-wrapper">
      <div className="announcements-bar-container">
        <div className="announcements-badge">
          <span className="live-pulse"></span>
          <span>ANNOUNCEMENTS</span>
        </div>
        <div className="announcements-ticker">
          {announcementsList.map((item) => (
            <div key={item.id} className="announcement-item">
              <span className={`announcement-tag ${item.tag.toLowerCase()}`}>{item.tag}</span>
              <span className="announcement-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <ContactSection onToast={onToast} />
    </div>
  );
}
