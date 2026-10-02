import React, { useState, useEffect, useRef, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { EVENTS_DATA } from '../../data/events';

// Flagship Summits Data
const SUMMITS_DATA = [
  {
    id: 'ai-robotics',
    title: 'AI & Autonomous Robotics Summit',
    badge: 'FLAGSHIP',
    color: '#22d3ee',
    desc: 'Deep-dive keynotes, live humanoid demonstrations, and autonomous systems research presentations with leading scientists from IISc, IITs, and top AI labs.',
    topics: ['Embodied AI & Humanoids', 'Computer Vision in Robotics', 'Edge Neural Networks', 'LLM Agentic Systems']
  },
  {
    id: 'space-aero',
    title: 'Aerospace & Deep Space Symposium',
    badge: 'KEYNOTE',
    color: '#f59e0b',
    desc: 'Exploring next-generation launch vehicles, orbital dynamics, CubeSat engineering, and India’s growing private spacetech ecosystem with ISRO veterans.',
    topics: ['Reusable Propulsion Systems', 'SmallSat Payload Integration', 'Interplanetary Trajectories', 'Commercial Spacetech']
  },
  {
    id: 'fintech-web3',
    title: 'FinTech & Decentralized Systems',
    badge: 'CONCLAVE',
    color: '#ec4899',
    desc: 'High-frequency algorithmic trading, decentralized liquidity protocols, zero-knowledge proofs, and sovereign financial infrastructure engineering.',
    topics: ['ZK-Rollups & Scaling', 'Algorithmic Arbitrage', 'Cross-Border Instant Settlement', 'Crypto Regulatory Architecture']
  },
  {
    id: 'cleantech',
    title: 'Sustainable Energy & CleanTech',
    badge: 'SPECIAL',
    color: '#10b981',
    desc: 'Grid-scale battery chemistries, green hydrogen infrastructure, smart microgrids, and IoT-driven climate intelligence shaping zero-carbon campuses.',
    topics: ['Solid-State Battery Tech', 'Green Hydrogen Electrolysis', 'Distributed Microgrids', 'Carbon Credit Verification']
  }
];

// Competitions Flagship Data
const COMPETITIONS_DATA = [
  {
    id: 'hack-a-yukthi',
    title: 'HACK-A-YUKTHI 36H',
    category: 'Software & AI',
    prize: '₹1,50,000 PRIZE POOL',
    team: '2-4 Members',
    badge: 'FLAGSHIP HACKATHON',
    desc: 'Build groundbreaking real-world solutions across AI, Web3, FinTech, and IoT during an intense 36-hour non-stop hackathon with live mentoring.'
  },
  {
    id: 'robowars-heavy',
    title: 'ROBOWARS: COMBAT ARENA',
    category: 'Robotics',
    prize: '₹1,00,000 PRIZE POOL',
    team: 'Up to 5 Members',
    badge: 'COMBAT SPORTS',
    desc: 'State-of-the-art enclosed polycarbonate arena where 30kg & 15kg pneumatic spinners, wedge bots, and crushers battle for ultimate destruction.'
  },
  {
    id: 'code-sprint',
    title: 'CODE CLASH: SPEED DEV',
    category: 'Competitive Programming',
    prize: '₹50,000 PRIZE POOL',
    team: 'Individual',
    badge: 'ALGORITHMS',
    desc: 'Speed algorithmic battle testing advanced data structures, graph theory, dynamic programming, and mathematical problem-solving under extreme time limits.'
  },
  {
    id: 'design-dash',
    title: 'PRODUCT DESIGN DERBY',
    category: 'UI/UX & Design',
    prize: '₹40,000 PRIZE POOL',
    team: '1-2 Members',
    badge: 'CREATIVE',
    desc: 'Design intuitive, high-polish user experiences, design systems, and micro-interaction prototypes for real-world enterprise problem statements.'
  }
];

// Passes & Ticketing Data
const PASS_PACKAGES = [
  {
    id: 'all-access',
    title: 'ALL-ACCESS FEST PASS',
    tag: 'MOST POPULAR',
    price: '₹1,499',
    originalPrice: '₹2,500',
    badge: 'BEST VALUE',
    featured: true,
    features: [
      'Full 3-day access to all YUKTHI arenas & exhibitions',
      'Entry to all Flagship Summits, Conclaves & Keynotes',
      'Eligibility to attend any 1 Certified Technical Workshop',
      'Access to spectator galleries for RoboWars & Hackathons',
      'Exclusive Festival Welcome Kit & Official Merchandise T-shirt',
      'Priority seating for evening cultural & networking events'
    ]
  },
  {
    id: 'workshop-pass',
    title: 'WORKSHOP SINGLE PASS',
    tag: 'FOCUSED LEARNING',
    price: '₹699',
    originalPrice: '₹1,000',
    badge: 'CERTIFIED',
    featured: false,
    features: [
      'Admission to 1 selected hands-on technical workshop',
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
      'Accommodation for full fest duration (3 nights)',
      'Separate secure wings for male and female participants',
      'Free high-speed campus Wi-Fi & charging docks',
      'Complimentary early-morning tea and festival kit'
    ]
  },
  {
    id: 'acc-group',
    title: 'DELEGATION DORM (5+)',
    price: '₹800',
    period: 'per person (3 nights)',
    details: [
      'Exclusive shared dormitory hall for college contingents',
      'Dedicated contingent point of contact and hospitality guide',
      'Direct walking proximity to main competition venues',
      'Round-the-clock hot water, lockers, and security assistance'
    ]
  }
];

// Past Moments & Highlights
const GALLERY_HIGHLIGHTS = [
  { title: 'RoboWars Championship Arena', subtitle: 'Heavyweight battle in full swing', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80' },
  { title: 'Drone Obstacle Sprint', subtitle: 'FPV pilots tearing through precision checkpoints', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80' },
  { title: 'Hackathon Midnight Rush', subtitle: '36 hours of continuous coding and architectural pivots', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
  { title: 'Keynote & Conclaves', subtitle: 'Full house audience at the open-air stage', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80' },
  { title: 'Automotive Expo & EV Tech', subtitle: 'Student-built Formula prototypes on display', img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80' },
  { title: 'Evening Light & EDM Fest', subtitle: 'Campus celebration closing night', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' }
];

export default function YukthiPage({ onToast }) {
  // Category filter state for workshops
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedPass, setSelectedPass] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  // Form states for modal submission
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: ''
  });

  // Countdown timer state
  const [countdown, setCountdown] = useState({ days: '06', hours: '20', mins: '43', secs: '25' });

  // 3D Hero Title mouse interaction
  const heroTitleRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroTitleRef.current) return;
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
      heroTitleRef.current.style.transform = `perspective(1000px) rotateY(${xNorm * 12}deg) rotateX(${-yNorm * 12}deg)`;
    };

    const handleMouseLeave = () => {
      if (!heroTitleRef.current) return;
      heroTitleRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Fest Live Countdown
  useEffect(() => {
    const targetDate = new Date('2026-10-12T09:00:00+05:30').getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetDate - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days: String(d).padStart(2, '0'),
        hours: String(h).padStart(2, '0'),
        mins: String(m).padStart(2, '0'),
        secs: String(s).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filtered workshops from dataset
  const filteredWorkshops = useMemo(() => {
    return EVENTS_DATA.filter((evt) => {
      const matchesCat = activeCategory === 'ALL' || (evt.department && evt.department.toUpperCase() === activeCategory);
      const matchesSearch =
        evt.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.subheading && evt.subheading.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (evt.department && evt.department.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Unique categories for filter pills
  const categories = useMemo(() => {
    const depts = new Set(['ALL']);
    EVENTS_DATA.forEach((e) => {
      if (e.department) depts.add(e.department.toUpperCase());
    });
    return Array.from(depts);
  }, []);

  const handleModalSubmit = (e, title) => {
    e.preventDefault();
    if (!bookingFormData.name || !bookingFormData.email) {
      alert('Please fill in your name and email address.');
      return;
    }
    const message = `✨ Successfully registered for "${title}"! A confirmation has been sent to ${bookingFormData.email}.`;
    if (onToast) {
      onToast(message);
    } else {
      alert(message);
    }
    // Close modals
    setSelectedWorkshop(null);
    setSelectedPass(null);
    setSelectedAccommodation(null);
    setBookingFormData({ name: '', email: '', phone: '', college: '' });
  };

  return (
    <>
      <Head>
        <title>YUKTHI X'26 | National Techno-Management Fest</title>
        <meta
          name="description"
          content="Official portal for YUKTHI X'26, South India's premier national techno-management festival featuring summits, workshops, hackathons, and certified competitions."
        />
      </Head>

      <main className="yukthi-unified-page" style={{ position: 'relative', zIndex: 10 }}>
        {/* =================================================================
            1. HERO SECTION
            ================================================================= */}
        <section id="hero" className="home-hero-section">
          <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div className="yukthi-hero-badge">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22d3ee', display: 'inline-block' }} />
              EDITION 2.0 • OCT 12-14, 2026
            </div>

            <div style={{ perspective: '1000px', display: 'flex', justifyContent: 'center' }}>
              <h1
                ref={heroTitleRef}
                className="tathva-heading hero-main-title yukthi-hero-title"
                style={{
                  transition: 'transform 0.15s ease-out',
                  willChange: 'transform',
                  userSelect: 'none'
                }}
              >
                YUKTHI X'26
              </h1>
            </div>

            <p className="yukthi-hero-subtitle">
              South India's Flagship Techno-Management Conclave & Innovation Fest.<br />
              <span style={{ color: '#22d3ee' }}>3 Days. 40+ Certified Events. ₹5,00,000+ Prize Pools.</span>
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="#workshops"
                className="pass-book-btn"
                style={{ width: 'auto', padding: '0.85rem 2rem', background: '#22d3ee', color: '#04060a' }}
              >
                Explore Workshops <i>↓</i>
              </a>
              <a
                href="#competitions"
                className="pass-book-btn"
                style={{ width: 'auto', padding: '0.85rem 2rem', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Competitions &amp; Hackathons
              </a>
              <a
                href="#passes"
                className="pass-book-btn"
                style={{ width: 'auto', padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000000' }}
              >
                Get Passes
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================
            2. LAUNCH COUNTDOWN SECTION (Replaced Summits Section)
            ================================================================= */}
        <section id="countdown-banner" className="techkriti-summits-section" aria-label="Yukthi X'26 Launch Countdown" style={{ textAlign: 'center', padding: '3rem 1.5rem 2rem' }}>
          <p className="hero-launch-label">YUKTHI X'26 COMMENCES IN</p>
          <div className="hero-countdown-box">
            <div className="countdown-block">
              <span className="countdown-digits monocraft">{countdown.days}</span>
              <span className="countdown-unit">DAYS</span>
            </div>
            <span className="countdown-sep monocraft">:</span>
            <div className="countdown-block">
              <span className="countdown-digits monocraft">{countdown.hours}</span>
              <span className="countdown-unit">HOURS</span>
            </div>
            <span className="countdown-sep monocraft">:</span>
            <div className="countdown-block">
              <span className="countdown-digits monocraft">{countdown.mins}</span>
              <span className="countdown-unit">MINS</span>
            </div>
            <span className="countdown-sep monocraft">:</span>
            <div className="countdown-block">
              <span className="countdown-digits monocraft">{countdown.secs}</span>
              <span className="countdown-unit">SECS</span>
            </div>
          </div>
        </section>

        {/* =================================================================
            3. WORKSHOPS SECTION
            ================================================================= */}
        <section id="workshops" className="home-events-section" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div className="section-header-wrap">
            <span className="section-category-tag">HANDS-ON LEARNING</span>
            <h2 className="section-headline">
              Certified Technical <em>Workshops</em>
            </h2>
            <p className="section-description">
              Level up with hands-on, mentor-led masterclasses covering AI systems, embedded micro-architecture, and full-stack development with industry certifications.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
            <input
              type="text"
              placeholder="Search workshops by topic, department, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          <div className="category-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Workshops Cards Grid */}
          <div className="events-responsive-grid">
            {filteredWorkshops.slice(0, 8).map((evt) => (
              <article key={evt.id} className="event-card-modern">
                <div className="event-card-banner">
                  <img
                    src={evt.picture || evt.remotePicture || `/posters/event_${evt.id}.webp`}
                    alt={evt.heading}
                    className="event-card-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="event-badge-tag">
                    {evt.department || 'TECH'}
                  </div>
                </div>

                <div className="event-body-modern">
                  <div>
                    <h3 className="event-title-modern">{evt.heading}</h3>
                    <p className="event-desc-modern">
                      {evt.subheading ? evt.subheading.substring(0, 110) + '...' : 'Hands-on practical training with certified takeaway project code and verified credential.'}
                    </p>
                  </div>

                  <div className="event-meta-info">
                    <div>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Monocraft, monospace' }}>
                        FEE
                      </span>
                      <span className="event-price-highlight">
                        {evt.price > 0 ? `₹${evt.price}` : 'Free'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="event-cta-btn"
                      onClick={() => setSelectedWorkshop(evt)}
                    >
                      View Details &amp; Register <i>↗</i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================
            4. COMPETITIONS SECTION
            ================================================================= */}
        <section id="competitions" className="home-events-section" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div className="section-header-wrap">
            <span className="section-category-tag">ARENA &amp; HACKATHONS</span>
            <h2 className="section-headline">
              Flagship <em>Competitions</em>
            </h2>
            <p className="section-description">
              Compete for glory and a combined cash prize pool exceeding ₹5 Lakhs across high-intensity hackathons, combat arenas, and algorithm battles.
            </p>
          </div>

          <div className="events-responsive-grid">
            {COMPETITIONS_DATA.map((comp) => (
              <article key={comp.id} className="event-card-modern" style={{ borderColor: 'rgba(236, 72, 153, 0.25)' }}>
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontFamily: 'Monocraft, monospace', fontSize: '0.7rem', padding: '0.25rem 0.65rem', borderRadius: '9999px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#ec4899' }}>
                        {comp.badge}
                      </span>
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        {comp.team}
                      </span>
                    </div>

                    <h3 className="event-title-modern" style={{ fontSize: '1.5rem' }}>{comp.title}</h3>
                    <p className="event-desc-modern">{comp.desc}</p>
                  </div>

                  <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', color: '#f59e0b', fontWeight: '700' }}>
                        {comp.prize}
                      </span>
                      <span style={{ fontFamily: 'Monocraft, monospace', fontSize: '0.7rem', color: '#22d3ee' }}>
                        {comp.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="pass-book-btn"
                      style={{ padding: '0.75rem', fontSize: '0.8rem', background: '#ec4899', color: '#ffffff' }}
                      onClick={() => {
                        setSelectedWorkshop({
                          heading: comp.title,
                          subheading: `${comp.desc} (${comp.prize})`,
                          price: 0,
                          datetime: 'October 13, 2026',
                          venueName: 'Competitive Arenas Complex'
                        });
                      }}
                    >
                      Register Team <i>↗</i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================
            5. PASSES & TICKETING SECTION
            ================================================================= */}
        <section id="passes" className="passes-container-page" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div className="section-header-wrap">
            <span className="section-category-tag">FESTIVAL ACCESS</span>
            <h2 className="section-headline">
              Passes &amp; <em>Registration</em>
            </h2>
            <p className="section-description">
              Choose your festival pass to unlock unlimited entry, workshop certifications, arena seats, and official festival delegation kits.
            </p>
          </div>

          <div className="passes-grid">
            {PASS_PACKAGES.map((pass) => (
              <div key={pass.id} className={`pass-card ${pass.featured ? 'featured' : ''}`}>
                <div>
                  <div className={`pass-badge ${pass.featured ? 'gold' : 'cyan'}`}>
                    {pass.badge}
                  </div>

                  <p style={{ fontFamily: 'Monocraft, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
                    {pass.tag}
                  </p>
                  <h3 className="pass-title">{pass.title}</h3>

                  <div className="pass-price-wrap">
                    <span className="pass-price-symbol">₹</span>
                    <span className="pass-price-amount">{pass.price.replace('₹', '')}</span>
                    <span className="pass-price-period">
                      <s style={{ color: 'rgba(255,255,255,0.3)', marginRight: '4px' }}>{pass.originalPrice}</s>
                      / pass
                    </span>
                  </div>

                  <ul className="pass-perks-list">
                    {pass.features.map((feature, idx) => (
                      <li key={idx} className="pass-perk-item">
                        <span className="pass-check-icon">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="pass-book-btn"
                  onClick={() => setSelectedPass(pass)}
                >
                  Book Pass Now <i>→</i>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            6. ACCOMMODATION PACKAGES SECTION
            ================================================================= */}
        <section id="accommodation" style={{ padding: '4rem 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
          <div className="section-header-wrap">
            <span className="section-category-tag">CAMPUS HOSPITALITY</span>
            <h2 className="section-headline">
              Hostel <em>Accommodation</em>
            </h2>
            <p className="section-description">
              Stay right in the center of the action. Safe, comfortable, and affordable on-campus hostel packages for visiting participants and teams.
            </p>
          </div>

          <div className="accommodation-grid">
            {ACCOMMODATION_PACKAGES.map((acc) => (
              <article key={acc.id} className="acc-card">
                <div>
                  {acc.badge && <div className="acc-badge">{acc.badge}</div>}
                  <h3 className="acc-title">{acc.title}</h3>

                  <div className="acc-price-wrap">
                    <span className="acc-price-symbol">₹</span>
                    <span className="acc-price-amount">{acc.price.replace('₹', '')}</span>
                    <span className="acc-price-period">{acc.period}</span>
                  </div>

                  <ul className="acc-details-list">
                    {acc.details.map((detail, idx) => (
                      <li key={idx} className="acc-detail-item">
                        <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="acc-reserve-btn"
                  onClick={() => setSelectedAccommodation(acc)}
                >
                  Reserve Bed <i>→</i>
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================
            7. MOMENTS & GALLERY SECTION
            ================================================================= */}
        <section id="galleryx" className="gallery-section" style={{ margin: '3rem 0' }}>
          <div className="section-header-wrap">
            <span className="section-category-tag">ARCHIVES</span>
            <h2 className="section-headline">
              Moments from <em>Past Editions</em>
            </h2>
            <p className="section-description">
              Witness the energy, engineering passion, and electric atmosphere that defines Yukthi.
            </p>
          </div>

          <div className="gallery-grid">
            {GALLERY_HIGHLIGHTS.map((item, idx) => (
              <div key={idx} className="gallery-item">
                <img src={item.img} alt={item.title} className="gallery-img" />
                <div className="gallery-overlay-badge">
                  <div>
                    <h4 className="gallery-caption">{item.title}</h4>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>
                      {item.subtitle}
                    </p>
                  </div>
                  <span style={{ color: '#22d3ee', fontSize: '1.1rem' }}>↗</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            8. COUNTDOWN HUD & FESTIVAL FINAL CTA
            ================================================================= */}
        <div id="countdown" className="gallery-downside-countdown" style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-category-tag">COUNTDOWN TO LAUNCH</span>
            <h2 className="section-headline" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              OCTOBER 12, 2026
            </h2>
            <p className="section-description">
              The stage is set. Registrations are filling up across all technical tracks.
            </p>

            <div className="countdown-box-container">
              <div className="countdown-unit-card">
                <span className="countdown-number">{countdown.days}</span>
                <span className="countdown-unit-label">DAYS</span>
              </div>
              <div className="countdown-unit-card">
                <span className="countdown-number">{countdown.hours}</span>
                <span className="countdown-unit-label">HOURS</span>
              </div>
              <div className="countdown-unit-card">
                <span className="countdown-number">{countdown.mins}</span>
                <span className="countdown-unit-label">MINUTES</span>
              </div>
              <div className="countdown-unit-card">
                <span className="countdown-number">{countdown.secs}</span>
                <span className="countdown-unit-label">SECONDS</span>
              </div>
            </div>

            <a
              href="#passes"
              className="pass-book-btn"
              style={{ display: 'inline-flex', width: 'auto', padding: '1rem 3rem', background: '#22d3ee', color: '#04060a' }}
            >
              Get Your Official Pass Now <i>↗</i>
            </a>
          </div>
        </div>

        {/* =================================================================
            MODALS: REGISTRATION, PASSES, ACCOMMODATION
            ================================================================= */}
        {selectedWorkshop && (
          <div className="modal-backdrop-blur" onClick={() => setSelectedWorkshop(null)}>
            <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setSelectedWorkshop(null)}
              >
                ✕
              </button>

              <span className="section-category-tag" style={{ color: '#22d3ee' }}>
                EVENT REGISTRATION
              </span>
              <h3 className="pp-fragment" style={{ fontSize: '1.75rem', color: '#ffffff', margin: '0.4rem 0 1rem' }}>
                {selectedWorkshop.heading}
              </h3>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                {selectedWorkshop.subheading || 'Reserve your seat for this session. Complete the registration form below to receive your digital ticket.'}
              </p>

              <form onSubmit={(e) => handleModalSubmit(e, selectedWorkshop.heading)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={bookingFormData.name}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={bookingFormData.email}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={bookingFormData.phone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="text"
                    placeholder="College / Institution"
                    value={bookingFormData.college}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, college: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="pass-book-btn"
                  style={{ background: '#22d3ee', color: '#000000' }}
                >
                  Confirm Registration ({selectedWorkshop.price > 0 ? `₹${selectedWorkshop.price}` : 'Free'})
                </button>
              </form>
            </div>
          </div>
        )}

        {selectedPass && (
          <div className="modal-backdrop-blur" onClick={() => setSelectedPass(null)}>
            <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setSelectedPass(null)}
              >
                ✕
              </button>

              <span className="section-category-tag" style={{ color: '#f59e0b' }}>
                PASS CHECKOUT
              </span>
              <h3 className="pp-fragment" style={{ fontSize: '1.75rem', color: '#ffffff', margin: '0.4rem 0 0.5rem' }}>
                {selectedPass.title}
              </h3>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: '#f59e0b', marginBottom: '1.5rem' }}>
                {selectedPass.price}
              </p>

              <form onSubmit={(e) => handleModalSubmit(e, selectedPass.title)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={bookingFormData.name}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={bookingFormData.email}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={bookingFormData.phone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="text"
                    placeholder="College / Institution Name"
                    value={bookingFormData.college}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, college: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="pass-book-btn"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000000' }}
                >
                  Pay &amp; Generate Pass ({selectedPass.price})
                </button>
              </form>
            </div>
          </div>
        )}

        {selectedAccommodation && (
          <div className="modal-backdrop-blur" onClick={() => setSelectedAccommodation(null)}>
            <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setSelectedAccommodation(null)}
              >
                ✕
              </button>

              <span className="section-category-tag" style={{ color: '#06b6d4' }}>
                HOSTEL BOOKING
              </span>
              <h3 className="pp-fragment" style={{ fontSize: '1.75rem', color: '#ffffff', margin: '0.4rem 0 0.5rem' }}>
                {selectedAccommodation.title}
              </h3>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: '#06b6d4', marginBottom: '1.5rem' }}>
                {selectedAccommodation.price} <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{selectedAccommodation.period}</span>
              </p>

              <form onSubmit={(e) => handleModalSubmit(e, selectedAccommodation.title)}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <input
                    type="text"
                    required
                    placeholder="Lead Guest Full Name"
                    value={bookingFormData.name}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={bookingFormData.email}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp Phone Number"
                    value={bookingFormData.phone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                  <input
                    type="text"
                    placeholder="College / Delegation Name"
                    value={bookingFormData.college}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, college: e.target.value })}
                    style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#ffffff', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="pass-book-btn"
                  style={{ background: '#06b6d4', color: '#000000' }}
                >
                  Reserve Bed &amp; Get Hostel Slip
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
