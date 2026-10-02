import React, { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EVENTS_DATA } from '../../data/events';

// Flagship Summits Data
const YUKTHI_SUMMITS = [
  {
    id: 'tech-summit',
    index: '01',
    name: 'TECH SUMMIT',
    brief: 'Engineering the future through disruptive innovations.',
    image: 'https://2026.techkriti.org/images/summits/tech-summit.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    category: 'DISRUPTIVE INNOVATION',
    target: '#workshops'
  },
  {
    id: 'ai-summit',
    index: '02',
    name: 'AI SUMMIT',
    brief: 'Exploring the frontiers of artificial intelligence and machine learning.',
    image: 'https://2026.techkriti.org/images/summits/ai-summit.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80',
    category: 'MACHINE LEARNING & GENAI',
    target: '#competitions'
  },
  {
    id: 'rakshakriti',
    index: '03',
    name: 'RAKSHAKRITI',
    brief: 'Strengthening national security through indigenous defense technology.',
    image: 'https://2026.techkriti.org/images/summits/rakshakriti.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    category: 'DEFENSE & AEROSPACE',
    target: '#workshops'
  },
  {
    id: 'medtech',
    index: '04',
    name: 'MEDTECH',
    brief: 'Revolutionizing healthcare with advanced medical engineering.',
    image: 'https://2026.techkriti.org/images/summits/medtech.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    category: 'BIOMEDICAL ENGINEERING',
    target: '#competitions'
  },
  {
    id: 'space',
    index: '05',
    name: 'SPACE',
    brief: 'Scaling new heights in aerospace and interplanetary exploration.',
    image: 'https://2026.techkriti.org/images/summits/space.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80',
    category: 'ASTRONOMY & ROCKETRY',
    target: '#workshops'
  },
  {
    id: 'e-conclave',
    index: '06',
    name: 'E - CONCLAVE',
    brief: "Igniting the entrepreneurial spirit of tomorrow's leaders.",
    image: 'https://2026.techkriti.org/images/summits/e-conclave.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=80',
    category: 'VENTURE & STARTUPS',
    target: '#competitions'
  }
];

// Passes Data
const YUKTHI_PASSES = [
  {
    id: 'all-access',
    title: 'ALL-ACCESS FESTIVAL PASS',
    tag: 'MOST POPULAR',
    price: '₹1,499',
    originalPrice: '₹2,499',
    badge: 'FLAGSHIP',
    featured: true,
    features: [
      'Entry to all 6 days of YUKTHI X\'26 (Oct 12 - 17)',
      'Access to all competitive events & hackathons',
      'Free pass to 1 certified technical workshop',
      'Exclusive pro-show concert & pronite entry',
      'Festival Welcome Kit & Official Merchandise',
      'Access to Exhibition, Tech Expo & Guest Lectures'
    ]
  },
  {
    id: 'workshop-pass',
    title: 'TECH WORKSHOP COMBO',
    tag: 'SKILL BUILDER',
    price: '₹1,999',
    originalPrice: '₹3,200',
    badge: 'CERTIFIED',
    featured: false,
    features: [
      'Choice of any 2 Hands-on Certified Workshops',
      'Official Industry Certification with QR verification',
      'Access to full technical resource materials & code repos',
      'Direct interaction with keynote industry mentors',
      'Complimentary entry to Tech Expo & Guest Lectures',
      'Festival Welcome Kit & Badge'
    ]
  },
  {
    id: 'day-pass',
    title: 'DAILY VISITOR PASS',
    tag: 'FLEXIBLE',
    price: '₹399',
    originalPrice: '₹600',
    badge: '1 DAY',
    featured: false,
    features: [
      'Valid for 1 full day of your choice',
      'Access to public competitive arenas & RoboWars',
      'Access to all tech exhibitions & startup stalls',
      'Evening cultural events & street performances',
      'Festival map and daily event schedule'
    ]
  },
  {
    id: 'delegate-pass',
    title: 'STUDENT DELEGATION PACK',
    tag: 'COLLEGE TEAMS (5+)',
    price: '₹1,199',
    originalPrice: '₹1,999',
    badge: 'PER PERSON',
    featured: false,
    features: [
      'Discounted bulk rate for college contingents (min 5)',
      'All-Access entry for every team member',
      'Priority seating for Robowars & Keynotes',
      'Eligibility for Best College Delegation Trophy',
      'Certificate of Participation for each member'
    ]
  }
];

// Accommodation Packages Data
const ACCOMMODATION_PACKAGES = [
  {
    id: 'acc-single',
    title: '1-DAY STAY',
    price: '₹350',
    period: 'per person / night',
    details: [
      'Safe on-campus college hostel accommodation',
      'Mattress, clean bedsheet, and pillow provided',
      '24/7 security, high-speed Wi-Fi & water supply',
      'Luggage storage and cloakroom facility'
    ]
  },
  {
    id: 'acc-package',
    title: '3-DAY FEST PACKAGE',
    price: '₹950',
    period: 'per person (3 nights)',
    badge: 'POPULAR',
    details: [
      'Valid for 3 nights stay during prime fest days',
      'Dedicated contingent floor allocation',
      'Late night hostel pass for hackathon teams',
      '24/7 campus shuttle bus service',
      'Free food court breakfast vouchers'
    ]
  },
  {
    id: 'acc-full',
    title: 'FULL FEST STAY (6 NIGHTS)',
    price: '₹1,699',
    period: 'per person (Oct 11 - 17)',
    badge: 'BEST VALUE',
    details: [
      'Covers the entire duration of YUKTHI X\'26',
      'Pre-check-in available on October 11 evening',
      'Full amenity pack & fest hospitality coordinator',
      'Priority checkout & certificate of stay'
    ]
  }
];

export default function YukthiPage({ onToast }) {
  const router = useRouter();

  // Active section for navigation
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedPass, setSelectedPass] = useState(null);
  const [selectedAcc, setSelectedAcc] = useState(null);
  const [activeEventTab, setActiveEventTab] = useState('all'); // 'all' | 'workshops' | 'competitions'
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({ name: '', email: '', phone: '', college: '' });

  // 3D Tilt Title Ref
  const titleRef = useRef(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: '06', hours: '20', mins: '43', secs: '25' });

  // Gallery slider ref
  const galleryRef = useRef(null);

  // Gallery images list
  const galleryImages = [
    { src: '/images/gallery/bike_stunt.jpg', alt: 'Extreme Bike Stunt Show' },
    { src: '/images/gallery/singer_performance.png', alt: 'Live Vocal Concert' },
    { src: '/images/gallery/mercedes_drift.jpg', alt: 'Vintage Mercedes Drift' },
    { src: '/images/gallery/glive_singer.png', alt: 'G-Live Pro Concert' },
    { src: '/images/gallery/isro_rocket.jpg', alt: 'ISRO Space Exhibition' },
    { src: '/images/gallery/concert_payyanur.png', alt: 'Festival Pronite Arena' }
  ];

  // 3D Perspective Tilt on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!titleRef.current) return;
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
      titleRef.current.style.transform = `perspective(1000px) rotateY(${xNorm * 14}deg) rotateX(${-yNorm * 14}deg)`;
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

  // Real-time Countdown Timer
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

  // Smooth scroll handler
  const scrollTo = (id) => (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter events (Workshops vs Competitions)
  const filteredEvents = useMemo(() => {
    if (activeEventTab === 'all') return EVENTS_DATA;
    return EVENTS_DATA.filter((ev) => ev.type === activeEventTab);
  }, [activeEventTab]);

  // Gallery scroll controls
  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handle booking form submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email || !bookingData.phone) {
      if (onToast) onToast('⚠️ Please enter your name, email, and phone number.');
      else alert('⚠️ Please enter your name, email, and phone number.');
      return;
    }
    setBookingStep(2);
    if (onToast) onToast('🎉 Registration initiated! Check your email for pass confirmation.');
    else alert('🎉 Registration initiated! Check your email for pass confirmation.');
  };

  return (
    <>
      <Head>
        <title>YUKTHI X'26 | National Techno-Management Fest</title>
        <meta
          name="description"
          content="Official portal of YUKTHI X'26 - National Techno-Management Fest. Workshops, competitions, hackathons, passes, and pro-shows from 12th - 17th October 2026."
        />
      </Head>

      <div className="single-yukthi-page home-page-view">
        {/* =========================================================
            SECTION 1: HERO (Matching Screenshot 1 & 2)
            ========================================================= */}
        <section id="hero" className="home-hero-section">
          {/* Year 2026 */}
          <p className="hero-year-text">2026</p>

          {/* Giant 3D Perspective Title */}
          <div className="relative flex items-center justify-center pointer-events-none select-none z-20">
            <h1
              ref={titleRef}
              className="tathva-heading hero-main-title text-center font-bold uppercase text-white drop-shadow-2xl"
            >
              YUKTHI X'26
            </h1>
          </div>

          {/* Festival Dates */}
          <p className="hero-dates-text">12TH - 17TH OCTOBER</p>

          {/* Fast Navigation Quick Jump Pills */}
          <div className="hero-nav-buttons-container" style={{ marginTop: '1.25rem' }}>
            <div className="hero-nav-row">
              <a href="#summits" onClick={scrollTo('summits')} className="hero-pill-btn">
                Summits
              </a>
              <a href="#workshops" onClick={scrollTo('workshops')} className="hero-pill-btn">
                Workshops
              </a>
              <a href="#competitions" onClick={scrollTo('competitions')} className="hero-pill-btn">
                Competitions
              </a>
              <a href="#passes" onClick={scrollTo('passes')} className="hero-pill-btn">
                Passes
              </a>
              <a href="#accommodation" onClick={scrollTo('accommodation')} className="hero-pill-btn">
                Stay
              </a>
              <a href="#galleryx" onClick={scrollTo('galleryx')} className="hero-pill-btn">
                Gallery
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: FLAGSHIP SUMMITS
            ========================================================= */}
        <section id="summits" className="techkriti-summits-section" aria-label="Yukthi X'26 Flagship Summits">
          <div className="summits-header-box">
            <p className="summits-eyebrow">YUKTHI X'26 FLAGSHIP</p>
            <h2 className="summits-main-title pp-fragment">SUMMITS &amp; CONCLAVES</h2>
            <p className="summits-subtitle">
              Pioneering multidisciplinary symposiums converging academia, defense, enterprise, and emerging technologies.
            </p>
          </div>

          <div className="summits-interactive-track">
            {YUKTHI_SUMMITS.map((summit) => (
              <div
                key={summit.id}
                className="summit-blade-card"
                onClick={scrollTo(summit.target.replace('#', ''))}
                title={`Explore ${summit.name}`}
              >
                <div className="blade-bg-image-wrapper">
                  <img
                    src={summit.image}
                    alt={summit.name}
                    className="blade-bg-image"
                    onError={(e) => {
                      e.currentTarget.src = summit.fallbackImage;
                    }}
                  />
                  <div className="blade-overlay-vignette"></div>
                </div>

                <div className="blade-collapsed-label">
                  <span className="blade-index monocraft">{summit.index}</span>
                  <span className="blade-vertical-title">{summit.name}</span>
                </div>

                <div className="blade-expanded-content">
                  <span className="blade-category-tag">{summit.category}</span>
                  <h3 className="blade-expanded-heading pp-fragment">{summit.name}</h3>
                  <p className="blade-expanded-brief">{summit.brief}</p>
                  <a href={summit.target} onClick={scrollTo(summit.target.replace('#', ''))} className="blade-explore-btn">
                    <span>Explore Section</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 3: WORKSHOPS & MASTERCLASSES
            ========================================================= */}
        <section id="workshops" className="home-events-section" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="status-tag poppins" style={{ justifyContent: 'center' }}>
              HANDS-ON MASTERCLASSES
            </p>
            <h2 className="pp-fragment" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#ffffff', textTransform: 'uppercase', margin: '0.4rem 0' }}>
              CERTIFIED WORKSHOPS
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
              Intensive, industry-standard practical workshops led by senior engineers and researchers with verifiable certificates.
            </p>
          </div>

          {/* Workshop Cards Grid */}
          <div className="passes-grid">
            {EVENTS_DATA.filter((e) => e.type === 'workshops').map((ws) => (
              <div key={ws.id} className="pass-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedEvent(ws)}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="pass-badge" style={{ position: 'static' }}>
                      CERTIFIED
                    </span>
                    <span style={{ fontFamily: 'Monocraft', color: '#22d3ee', fontSize: '1.15rem', fontWeight: 'bold' }}>
                      ₹{ws.price}
                    </span>
                  </div>
                  <h3 className="pp-fragment" style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                    {ws.heading}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {ws.catchyPara || ws.description.slice(0, 110) + '...'}
                  </p>
                </div>

                <div>
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      📍 {ws.venueName || 'Main Academic Complex'}
                    </span>
                    <button className="pass-book-btn" style={{ padding: '0.45rem 1.1rem', fontSize: '0.75rem' }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 4: COMPETITIONS & ROBOWARS
            ========================================================= */}
        <section id="competitions" className="home-events-section" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="status-tag poppins" style={{ justifyContent: 'center' }}>
              FLAGSHIP ARENAS &amp; PRIZE POOLS
            </p>
            <h2 className="pp-fragment" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#ffffff', textTransform: 'uppercase', margin: '0.4rem 0' }}>
              TECH COMPETITIONS
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
              Battle with top innovators across robotics combat arenas, 36-hour hackathons, structural design challenges, and coding leagues.
            </p>
          </div>

          <div className="passes-grid">
            {EVENTS_DATA.filter((e) => e.type === 'competitions').map((comp) => (
              <div key={comp.id} className="pass-card featured" style={{ cursor: 'pointer' }} onClick={() => setSelectedEvent(comp)}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="pass-badge" style={{ position: 'static', background: 'rgba(229, 9, 20, 0.8)', borderColor: '#e50914', color: '#fff' }}>
                      PRIZE POOL
                    </span>
                    <span style={{ fontFamily: 'Monocraft', color: '#f59e0b', fontSize: '1.15rem', fontWeight: 'bold' }}>
                      ₹{comp.price}
                    </span>
                  </div>
                  <h3 className="pp-fragment" style={{ fontSize: '1.45rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                    {comp.heading}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {comp.catchyPara || comp.description.slice(0, 110) + '...'}
                  </p>
                </div>

                <div>
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      👥 Team up to 4 members
                    </span>
                    <button className="pass-book-btn" style={{ padding: '0.45rem 1.1rem', fontSize: '0.75rem' }}>
                      Rules &amp; Register
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 5: PASSES & PACKAGES
            ========================================================= */}
        <section id="passes" className="passes-container-page" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="status-tag poppins" style={{ justifyContent: 'center' }}>
              OFFICIAL ENTRY
            </p>
            <h2 className="pp-fragment" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#ffffff', textTransform: 'uppercase', margin: '0.4rem 0' }}>
              FESTIVAL PASSES
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
              Choose your ideal pass for access to competitions, certified masterclasses, guest lectures, and evening pro-shows.
            </p>
          </div>

          <div className="passes-grid">
            {YUKTHI_PASSES.map((pass) => (
              <div key={pass.id} className={`pass-card ${pass.featured ? 'featured' : ''}`}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="pass-badge" style={{ position: 'static' }}>
                      {pass.badge}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>
                      {pass.tag}
                    </span>
                  </div>

                  <h3 className="pp-fragment" style={{ fontSize: '1.5rem', color: '#ffffff', marginTop: '0.75rem' }}>
                    {pass.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', margin: '1rem 0 1.5rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Monocraft' }}>
                      {pass.price}
                    </span>
                    <span style={{ textDecoration: 'line-through', color: 'rgba(255, 255, 255, 0.4)', fontSize: '1rem' }}>
                      {pass.originalPrice}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {pass.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                        <span style={{ color: '#22d3ee' }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="pass-book-btn"
                  onClick={() => {
                    setSelectedPass(pass);
                    setBookingStep(1);
                  }}
                >
                  Book Pass Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 6: ACCOMMODATION & CAMPUS STAY
            ========================================================= */}
        <section id="accommodation" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p className="status-tag poppins" style={{ justifyContent: 'center' }}>
              CAMPUS HOSPITALITY
            </p>
            <h2 className="pp-fragment" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: '#ffffff', textTransform: 'uppercase', margin: '0.4rem 0' }}>
              HOSTEL ACCOMMODATION
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem' }}>
              Affordable, secure on-campus accommodation for delegates, teams, and attendees throughout the fest from October 11 to 17.
            </p>
          </div>

          <div className="passes-grid">
            {ACCOMMODATION_PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`pass-card ${pkg.badge === 'BEST VALUE' ? 'featured' : ''}`}>
                <div>
                  {pkg.badge && (
                    <span className="pass-badge" style={{ position: 'static', marginBottom: '0.75rem', display: 'inline-block' }}>
                      {pkg.badge}
                    </span>
                  )}
                  <h3 className="pp-fragment" style={{ fontSize: '1.45rem', color: '#ffffff', margin: '0.4rem 0' }}>
                    {pkg.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.75rem 0 1.25rem' }}>
                    <span style={{ fontSize: '1.85rem', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Monocraft' }}>
                      {pkg.price}
                    </span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}>
                      {pkg.period}
                    </span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {pkg.details.map((d, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                        <span style={{ color: '#f59e0b' }}>•</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className="pass-book-btn"
                  onClick={() => {
                    setSelectedAcc(pkg);
                    setBookingStep(1);
                  }}
                >
                  Reserve Stay
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 7: GALLERY
            ========================================================= */}
        <section id="galleryx" className="gallery-section" style={{ margin: '3rem 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', maxWidth: '80rem', margin: '0 auto 1.5rem', padding: '0 1.5rem' }}>
            <div>
              <p className="status-tag poppins">VISUAL ARCHIVES</p>
              <h2 className="pp-fragment" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#ffffff', margin: '0.2rem 0' }}>
                YUKTHI X'26 GALLERY
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                className="gallery-nav-btn prev"
                onClick={() => scrollGallery('left')}
                style={{ position: 'static', transform: 'none' }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                className="gallery-nav-btn next"
                onClick={() => scrollGallery('right')}
                style={{ position: 'static', transform: 'none' }}
                aria-label="Next image"
              >
                ›
              </button>
            </div>
          </div>

          <div
            ref={galleryRef}
            style={{
              display: 'flex',
              gap: '1.25rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '1rem 1.5rem 2rem',
              scrollbarWidth: 'none'
            }}
          >
            {galleryImages.map((img, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  width: 'clamp(280px, 45vw, 460px)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85)'
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  style={{ display: 'block', width: '100%', height: '280px', objectFit: 'cover' }}
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 8: COUNTDOWN BOX
            ========================================================= */}
        <div id="countdown" className="gallery-downside-countdown" style={{ padding: '4rem 1.5rem' }}>
          <p className="hero-launch-label">YUKTHI X'26 COMMENCES IN</p>
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
        </div>

        {/* =========================================================
            MODAL: EVENT / WORKSHOP / COMPETITION DETAIL & BOOKING
            ========================================================= */}
        {selectedEvent && (
          <div className="event-modal-backdrop" onClick={() => setSelectedEvent(null)}>
            <div className="event-modal-card" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span className="pass-badge" style={{ position: 'static', marginBottom: '0.4rem', display: 'inline-block' }}>
                    {selectedEvent.type.toUpperCase()}
                  </span>
                  <h3 className="pp-fragment" style={{ fontSize: '1.75rem', color: '#ffffff', margin: '0.2rem 0' }}>
                    {selectedEvent.heading}
                  </h3>
                  <p style={{ color: '#22d3ee', fontSize: '0.85rem' }}>
                    {selectedEvent.catchyPara}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '1.5rem', maxHeight: '240px', overflowY: 'auto' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {selectedEvent.description}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  <span>📍 {selectedEvent.venueName || 'College of Engineering & Technology Payyanur'}</span>
                  <span>🗓️ October 2026</span>
                  <span>💰 Fee: ₹{selectedEvent.price}</span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  className="contact-field-input"
                  required
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="contact-field-input"
                  required
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp / Phone Number"
                  className="contact-field-input"
                  required
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                />
                <button type="submit" className="pass-book-btn" style={{ marginTop: '0.5rem' }}>
                  Register for {selectedEvent.heading} (₹{selectedEvent.price})
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            MODAL: PASS / ACCOMMODATION BOOKING
            ========================================================= */}
        {(selectedPass || selectedAcc) && (
          <div className="event-modal-backdrop" onClick={() => { setSelectedPass(null); setSelectedAcc(null); }}>
            <div className="event-modal-card" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div>
                  <span className="pass-badge" style={{ position: 'static', marginBottom: '0.4rem', display: 'inline-block' }}>
                    {selectedPass ? 'FESTIVAL PASS' : 'HOSTEL STAY'}
                  </span>
                  <h3 className="pp-fragment" style={{ fontSize: '1.65rem', color: '#ffffff', margin: '0.2rem 0' }}>
                    {selectedPass?.title || selectedAcc?.title}
                  </h3>
                  <p style={{ color: '#f59e0b', fontSize: '1.15rem', fontFamily: 'Monocraft', marginTop: '0.25rem' }}>
                    {selectedPass?.price || selectedAcc?.price}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedPass(null); setSelectedAcc(null); }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {bookingStep === 1 ? (
                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="contact-field-input"
                    required
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="contact-field-input"
                    required
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="contact-field-input"
                    required
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="College / Institution"
                    className="contact-field-input"
                    value={bookingData.college}
                    onChange={(e) => setBookingData({ ...bookingData, college: e.target.value })}
                  />
                  <button type="submit" className="pass-book-btn" style={{ marginTop: '0.5rem' }}>
                    Confirm &amp; Proceed to Payment
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎉</div>
                  <h4 className="pp-fragment" style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                    Booking Confirmed!
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                    We have sent booking confirmation &amp; instructions to <strong>{bookingData.email}</strong>. See you at YUKTHI X'26!
                  </p>
                  <button
                    className="pass-book-btn"
                    onClick={() => {
                      setSelectedPass(null);
                      setSelectedAcc(null);
                      setBookingStep(1);
                    }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
