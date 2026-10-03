import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { EVENTS_DATA } from '../../data/events';

// Flagship Summits Data
const SUMMITS = [
  {
    id: 'ai-robotics',
    badge: 'FLAGSHIP',
    badgeColor: '#22d3ee',
    title: 'AI & Autonomous Robotics',
    desc: 'Deep-dive keynotes, live humanoid demonstrations, and autonomous systems research presentations with leading AI scientists and robotics labs.',
    topics: ['Embodied AI', 'Edge Neural Networks', 'Computer Vision', 'LLM Agentic Systems']
  },
  {
    id: 'space-aero',
    badge: 'KEYNOTE',
    badgeColor: '#f59e0b',
    title: 'Aerospace & Deep Space',
    desc: 'Exploring next-gen launch vehicles, orbital dynamics, CubeSat engineering, and India’s growing private spacetech ecosystem with veterans.',
    topics: ['Propulsion Systems', 'SmallSat Payload', 'Orbital Mechanics', 'Deep Space Comm']
  },
  {
    id: 'fintech-web3',
    badge: 'CONCLAVE',
    badgeColor: '#ec4899',
    title: 'FinTech & Sovereign Systems',
    desc: 'High-frequency algorithmic trading, decentralized liquidity protocols, zero-knowledge proofs, and sovereign financial infrastructure engineering.',
    topics: ['ZK-Rollups', 'Algorithmic Arbitrage', 'Cross-Border Rails', 'Digital Sovereign ID']
  },
  {
    id: 'cleantech',
    badge: 'SPECIAL',
    badgeColor: '#10b981',
    title: 'CleanTech & Microgrids',
    desc: 'Solid-state battery chemistries, green hydrogen infrastructure, smart microgrids, and IoT-driven climate intelligence shaping zero-carbon campuses.',
    topics: ['Solid-State Storage', 'Green Hydrogen', 'Smart Microgrids', 'Carbon Intelligence']
  }
];

// Flagship Competitions
const COMPETITIONS = [
  {
    id: 'hack-a-yukthi',
    title: 'HACK-A-YUKTHI 36H',
    badge: 'FLAGSHIP HACKATHON',
    team: '2-4 Members',
    prize: '₹1,50,000 PRIZE POOL',
    cat: 'Software & AI',
    desc: 'Build groundbreaking real-world solutions across AI, Web3, FinTech, and IoT during an intense 36-hour non-stop hackathon with live mentoring.'
  },
  {
    id: 'robowars-heavy',
    title: 'ROBOWARS: COMBAT ARENA',
    badge: 'COMBAT SPORTS',
    team: 'Up to 5 Members',
    prize: '₹1,00,000 PRIZE POOL',
    cat: 'Robotics',
    desc: 'State-of-the-art enclosed polycarbonate arena where 30kg & 15kg pneumatic spinners, wedge bots, and crushers battle for ultimate destruction.'
  },
  {
    id: 'code-sprint',
    title: 'CODE CLASH: SPEED DEV',
    badge: 'ALGORITHMS',
    team: 'Individual',
    prize: '₹50,000 PRIZE POOL',
    cat: 'Competitive Dev',
    desc: 'Speed algorithmic battle testing advanced data structures, graph theory, dynamic programming, and mathematical problem-solving under extreme time limits.'
  },
  {
    id: 'design-dash',
    title: 'PRODUCT DESIGN DERBY',
    badge: 'CREATIVE TECH',
    team: '1-2 Members',
    prize: '₹40,000 PRIZE POOL',
    cat: 'UI/UX & Design',
    desc: 'Design intuitive, high-polish user experiences, design systems, and micro-interaction prototypes for real-world enterprise problem statements.'
  }
];

// Passes
const PASSES = [
  {
    id: 'all-access',
    badge: 'BEST VALUE',
    title: 'ALL-ACCESS FEST PASS',
    tagline: 'Complete 3-day access to all arenas, keynotes, and certified tracks.',
    price: '₹1,499',
    original: '₹2,500',
    featured: true,
    features: [
      'Full access to all festival arenas & tech exhibitions',
      'Entry to all Flagship Summits, Conclaves & Keynotes',
      'Eligibility to attend any 1 Certified Technical Workshop',
      'Access to spectator galleries for RoboWars & Hackathons',
      'Exclusive Festival Welcome Kit & Official T-shirt',
      'Priority seating for evening cultural & networking events'
    ]
  },
  {
    id: 'workshop-pass',
    badge: 'CERTIFIED',
    title: 'WORKSHOP SINGLE PASS',
    tagline: 'Focused learning track for industry masterclasses.',
    price: '₹699',
    original: '₹1,000',
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
    badge: 'ENTRY TICKET',
    title: 'DAILY VISITOR PASS',
    tagline: 'Single-day access to general fest grounds and open exhibitions.',
    price: '₹299',
    original: '₹500',
    featured: false,
    features: [
      'Single-day access to general fest grounds & expo',
      'Access to RoboWars viewing gallery for selected day',
      'Entry to non-restricted guest tech talks and open displays',
      'Access to campus food courts & gaming zones',
      'Official visitor ID lanyard and festival map'
    ]
  }
];

// Accommodation
const ACCOMMODATIONS = [
  {
    id: 'acc-single',
    title: '1-DAY STAY',
    price: '350',
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
    price: '950',
    period: 'per person (3 nights)',
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
    price: '800',
    period: 'per person (3 nights)',
    details: [
      'Exclusive shared dormitory hall for college contingents',
      'Dedicated contingent point of contact and hospitality guide',
      'Direct walking proximity to main competition venues',
      'Round-the-clock hot water, lockers, and security assistance'
    ]
  }
];

// Moments
const MOMENTS = [
  { title: 'RoboWars Combat Arena', sub: 'Heavyweight battle in polycarbonate arena', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80' },
  { title: 'FPV Drone Sprint', sub: 'Pilots tearing through precision obstacle gates', img: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80' },
  { title: '36-Hour Hackathon', sub: 'Intense midnight coding and architecture sprints', img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80' },
  { title: 'Keynote & Conclaves', sub: 'Packed auditorium for research and venture talks', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80' },
  { title: 'Formula EV Expo', sub: 'Student-engineered race cars on display', img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80' },
  { title: 'EDM Pronite Celebration', sub: 'Closing celebration on the grand lawn', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80' }
];

// FAQs
const FAQS = [
  {
    q: 'How do I register for events and workshops?',
    a: 'You can register directly through this portal. Select the desired workshop or competition card, click "Register", fill in your participant details, and your official booking voucher will be generated.'
  },
  {
    q: 'Are certificates provided for workshops and hackathons?',
    a: 'Yes, all workshops and hackathons are officially accredited with verifiable digital QR certificates, contributing towards academic KTU activity points.'
  },
  {
    q: 'Is on-campus accommodation safe and accessible?',
    a: 'Yes, secure hostel wings are allocated separately for male and female attendees within the campus, guarded 24/7 with Wi-Fi and amenities.'
  },
  {
    q: 'Can participants from other colleges attend?',
    a: 'Absolutely! YUKTHI X\'26 is a national techno-management festival open to undergraduate, postgraduate, and diploma students from universities across India.'
  }
];

export default function YukthiPortal({ onToast, showToast }) {
  const router = useRouter();
  const notify = onToast || showToast;

  // Preloader
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  // Scrolled navbar
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active section
  const [activeSec, setActiveSec] = useState('hero');

  // Countdown timer
  const [countdown, setCountdown] = useState({ days: '06', hours: '20', mins: '43', secs: '25' });
  useEffect(() => {
    const target = new Date('2026-10-12T09:00:00+05:30').getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
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
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Workshops filter & search
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkshops = useMemo(() => {
    return EVENTS_DATA.filter((evt) => {
      const matchCat = activeCategory === 'ALL' || (evt.department && evt.department.toUpperCase() === activeCategory);
      const matchSearch =
        evt.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.subheading && evt.subheading.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (evt.department && evt.department.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const categories = useMemo(() => {
    const set = new Set();
    EVENTS_DATA.forEach((e) => {
      if (e.department) set.add(e.department.toUpperCase());
    });
    return ['ALL', ...Array.from(set)];
  }, []);

  // Modals state
  const [modalItem, setModalItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '' });

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState(null);

  const handleSmoothScroll = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSec(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const message = `🎉 Registration confirmed for "${modalItem.title}". Voucher sent to ${formData.email || 'your email'}.`;
    if (notify) {
      notify(message);
    } else {
      alert(message);
    }
    setModalItem(null);
    setFormData({ name: '', email: '', phone: '', college: '' });
  };

  return (
    <div className="yukthi-page">
      <Head>
        <title>YUKTHI X'26 | National Techno-Management Conclave</title>
        <meta
          name="description"
          content="Official standalone portal for YUKTHI X'26, South India's premier national techno-management conclave featuring certified workshops, robotics arenas, and leadership summits."
        />
      </Head>

      {/* Preloader */}
      <div className={`yk-preloader ${!loading ? 'is-hidden' : ''}`}>
        <div className="yk-preloader-spinner" />
        <span className="yk-preloader-text">INITIALIZING YUKTHI X'26...</span>
      </div>

      {/* Topbar Navigation */}
      <header className={`yk-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="yk-nav-left">
          <a href="#hero" onClick={handleSmoothScroll('hero')} className="yk-nav-logo">
            <img src="/images/yukthi26-logo.png" alt="YUKTHI" className="yk-nav-logo-img" />
            <span className="yk-nav-logo-text">YUKTHI<span>X'26</span></span>
          </a>

          {/* SiteSwitcher Capsule */}
          <div style={{ marginLeft: '0.5rem' }}>
            <Link
              href="/vaaga"
              className="btn-back-yukthi"
              style={{
                fontSize: '0.72rem',
                padding: '0.4rem 0.95rem',
                borderColor: 'rgba(236,72,153,0.4)',
                background: 'rgba(236,72,153,0.1)',
                color: '#ec4899'
              }}
              title="Switch to VAAGA Arts Day Portal"
            >
              <span>VAAGA'26</span> ↗
            </Link>
          </div>
        </div>

        <nav className="yk-nav-menu">
          <a href="#hero" onClick={handleSmoothScroll('hero')} className={`yk-nav-link ${activeSec === 'hero' ? 'active' : ''}`}>Home</a>
          <a href="#summits" onClick={handleSmoothScroll('summits')} className={`yk-nav-link ${activeSec === 'summits' ? 'active' : ''}`}>Summits</a>
          <a href="#workshops" onClick={handleSmoothScroll('workshops')} className={`yk-nav-link ${activeSec === 'workshops' ? 'active' : ''}`}>Workshops</a>
          <a href="#competitions" onClick={handleSmoothScroll('competitions')} className={`yk-nav-link ${activeSec === 'competitions' ? 'active' : ''}`}>Competitions</a>
          <a href="#passes" onClick={handleSmoothScroll('passes')} className={`yk-nav-link ${activeSec === 'passes' ? 'active' : ''}`}>Passes</a>
          <a href="#accommodation" onClick={handleSmoothScroll('accommodation')} className={`yk-nav-link ${activeSec === 'accommodation' ? 'active' : ''}`}>Accommodation</a>
          <a href="#gallery" onClick={handleSmoothScroll('gallery')} className={`yk-nav-link ${activeSec === 'gallery' ? 'active' : ''}`}>Gallery</a>
          <a href="#faq" onClick={handleSmoothScroll('faq')} className={`yk-nav-link ${activeSec === 'faq' ? 'active' : ''}`}>FAQ</a>
        </nav>

        <div className="yk-nav-right">
          <a href="#passes" onClick={handleSmoothScroll('passes')} className="yk-nav-cta">
            Get Passes
          </a>

          <button
            className={`yk-hamburger ${mobileMenuOpen ? 'is-active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`yk-mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="yk-mobile-links">
          <a href="#hero" className="yk-mobile-link" onClick={handleSmoothScroll('hero')}>Home</a>
          <a href="#summits" className="yk-mobile-link" onClick={handleSmoothScroll('summits')}>Summits</a>
          <a href="#workshops" className="yk-mobile-link" onClick={handleSmoothScroll('workshops')}>Workshops</a>
          <a href="#competitions" className="yk-mobile-link" onClick={handleSmoothScroll('competitions')}>Competitions</a>
          <a href="#passes" className="yk-mobile-link" onClick={handleSmoothScroll('passes')}>Passes</a>
          <a href="#accommodation" className="yk-mobile-link" onClick={handleSmoothScroll('accommodation')}>Accommodation</a>
          <a href="#gallery" className="yk-mobile-link" onClick={handleSmoothScroll('gallery')}>Gallery</a>
          <a href="#faq" className="yk-mobile-link" onClick={handleSmoothScroll('faq')}>FAQ</a>
        </div>
        <div>
          <Link
            href="/vaaga"
            className="btn-back-yukthi"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', color: '#ec4899', borderColor: '#ec4899' }}
          >
            Visit VAAGA'26 Arts Portal ↗
          </Link>
          <a href="#passes" className="yk-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSmoothScroll('passes')}>
            Claim Festival Pass
          </a>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="hero" className="yk-hero">
        <div className="yk-hero-bg-glow" />

        <div className="yk-hero-content">
          <div className="yk-hero-badge">
            <span className="yk-hero-badge-dot" />
            YUKTHI X'26 • EDITION 2.0
          </div>

          <h1 className="yk-hero-title">
            THE NEXUS OF
            <span className="yk-hero-title-highlight">YUKTHI X'26</span>
          </h1>

          <p className="yk-hero-dates">12TH – 17TH OCTOBER 2026</p>

          <p className="yk-hero-subtitle">
            South India's Flagship Techno-Management Conclave &amp; Innovation Arena.<br />
            Join 10,000+ engineers, founders, and innovators across 40+ certified events.
          </p>

          <div className="yk-hero-actions">
            <a href="#workshops" onClick={handleSmoothScroll('workshops')} className="yk-btn-primary">
              Explore Arenas <i>↓</i>
            </a>
            <a href="#passes" onClick={handleSmoothScroll('passes')} className="yk-btn-secondary">
              Claim Festival Pass <i>↗</i>
            </a>
          </div>

          {/* Live Countdown HUD */}
          <div className="yk-countdown">
            <div className="yk-countdown-card">
              <span className="yk-countdown-num">{countdown.days}</span>
              <span className="yk-countdown-label">DAYS</span>
            </div>
            <span className="yk-countdown-colon">:</span>
            <div className="yk-countdown-card">
              <span className="yk-countdown-num">{countdown.hours}</span>
              <span className="yk-countdown-label">HOURS</span>
            </div>
            <span className="yk-countdown-colon">:</span>
            <div className="yk-countdown-card">
              <span className="yk-countdown-num">{countdown.mins}</span>
              <span className="yk-countdown-label">MINS</span>
            </div>
            <span className="yk-countdown-colon">:</span>
            <div className="yk-countdown-card">
              <span className="yk-countdown-num">{countdown.secs}</span>
              <span className="yk-countdown-label">SECS</span>
            </div>
          </div>

          {/* Stats Ribbon */}
          <div className="yk-stats-ribbon">
            <div className="yk-stat-item">
              <span className="yk-stat-num">40+</span>
              <span className="yk-stat-label">Certified Masterclasses</span>
            </div>
            <div className="yk-stat-item">
              <span className="yk-stat-num">₹5L+</span>
              <span className="yk-stat-label">Prize Pools</span>
            </div>
            <div className="yk-stat-item">
              <span className="yk-stat-num">10K+</span>
              <span className="yk-stat-label">National Footfall</span>
            </div>
            <div className="yk-stat-item">
              <span className="yk-stat-num">15+</span>
              <span className="yk-stat-label">Industry Summits</span>
            </div>
          </div>
        </div>
      </section>

      {/* SUMMITS SECTION */}
      <section id="summits" className="yk-section">
        <div className="yk-container">
          <div className="yk-section-header">
            <span className="yk-tag">CONCLAVES &amp; SYMPOSIA</span>
            <h2 className="yk-title">Flagship <em>Summits</em></h2>
            <p className="yk-desc">
              Immerse yourself in research keynotes, live humanoid demonstrations, and venture roundtables with leading scientists and industry veterans.
            </p>
          </div>

          <div className="yk-summits-grid">
            {SUMMITS.map((s) => (
              <div key={s.id} className="yk-summit-card">
                <div>
                  <span className="yk-summit-badge" style={{ color: s.badgeColor, borderColor: s.badgeColor }}>
                    {s.badge}
                  </span>
                  <h3 className="yk-summit-title">{s.title}</h3>
                  <p className="yk-summit-desc">{s.desc}</p>
                </div>

                <div className="yk-summit-topics">
                  {s.topics.map((t, i) => (
                    <span key={i} className="yk-topic-pill">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOPS SECTION */}
      <section id="workshops" className="yk-section">
        <div className="yk-container">
          <div className="yk-section-header">
            <span className="yk-tag">HANDS-ON LEARNING</span>
            <h2 className="yk-title">Certified <em>Workshops</em></h2>
            <p className="yk-desc">
              Level up with hands-on, mentor-led masterclasses covering AI systems, cyber defense, and robotics architecture with verifiable industry certificates.
            </p>
          </div>

          {/* Search Bar */}
          <div className="yk-search-wrap">
            <input
              type="text"
              placeholder="Search masterclasses by topic or department..."
              className="yk-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter Pills */}
          <div className="yk-filter-bar">
            {categories.map((c) => (
              <button
                key={c}
                className={`yk-filter-btn ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="yk-grid-cards">
            {filteredWorkshops.slice(0, 9).map((w) => (
              <article key={w.id} className="yk-card">
                <div className="yk-card-banner">
                  <img
                    src={w.picture || w.remotePicture || `/posters/event_${w.id}.webp`}
                    alt={w.heading}
                    className="yk-card-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="yk-card-badge">{w.department || 'MASTERCLASS'}</span>
                </div>

                <div className="yk-card-body">
                  <div>
                    <h3 className="yk-card-title">{w.heading}</h3>
                    <p className="yk-card-desc">
                      {w.subheading ? w.subheading.substring(0, 110) + '...' : 'Hands-on practical training with certified takeaway project code and verified credential.'}
                    </p>
                  </div>

                  <div className="yk-card-footer">
                    <div>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'Monocraft, monospace' }}>FEE</span>
                      <span className="yk-card-price">{w.price > 0 ? `₹${w.price}` : 'Free'}</span>
                    </div>

                    <button
                      className="yk-card-btn"
                      onClick={() => setModalItem({ type: 'workshop', title: w.heading, price: w.price > 0 ? `₹${w.price}` : 'Free', desc: w.description || w.subheading })}
                    >
                      View &amp; Register ↗
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMPETITIONS SECTION */}
      <section id="competitions" className="yk-section">
        <div className="yk-container">
          <div className="yk-section-header">
            <span className="yk-tag" style={{ color: '#ec4899', borderColor: '#ec4899' }}>COMBAT &amp; HACKATHONS</span>
            <h2 className="yk-title">Flagship <em>Competitions</em></h2>
            <p className="yk-desc">
              Battle for supremacy and cash prizes across non-stop hackathons, heavyweight RoboWars polycarbonate cages, and speed programming arenas.
            </p>
          </div>

          <div className="yk-grid-cards">
            {COMPETITIONS.map((c) => (
              <div key={c.id} className="yk-comp-card">
                <div>
                  <div className="yk-comp-top">
                    <span className="yk-comp-badge">{c.badge}</span>
                    <span className="yk-comp-team">{c.team}</span>
                  </div>

                  <h3 className="yk-comp-title">{c.title}</h3>
                  <p className="yk-comp-desc">{c.desc}</p>
                </div>

                <div className="yk-comp-bottom">
                  <div className="yk-comp-meta">
                    <span className="yk-comp-prize">{c.prize}</span>
                    <span className="yk-comp-cat">{c.cat}</span>
                  </div>

                  <button
                    className="yk-comp-btn"
                    onClick={() => setModalItem({ type: 'competition', title: c.title, price: c.prize, desc: c.desc })}
                  >
                    Register for Arena ↗
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASSES SECTION */}
      <section id="passes" className="yk-section">
        <div className="yk-container">
          <div className="yk-section-header">
            <span className="yk-tag" style={{ color: '#f59e0b', borderColor: '#f59e0b' }}>FESTIVAL TICKETS</span>
            <h2 className="yk-title">Passes &amp; <em>Packages</em></h2>
            <p className="yk-desc">
              Secure your festival pass for full access to competitive arenas, industry keynotes, and certified hands-on masterclasses.
            </p>
          </div>

          <div className="yk-passes-grid">
            {PASSES.map((p) => (
              <div key={p.id} className={`yk-pass-card ${p.featured ? 'is-featured' : ''}`}>
                <div>
                  <div className="yk-pass-top">
                    <span className="yk-pass-badge">{p.badge}</span>
                  </div>

                  <h3 className="yk-pass-title">{p.title}</h3>
                  <p className="yk-pass-tagline">{p.tagline}</p>

                  <div className="yk-pass-pricing">
                    <span className="yk-pass-price">{p.price}</span>
                    <span className="yk-pass-original">{p.original}</span>
                  </div>

                  <div className="yk-pass-features">
                    {p.features.map((f, i) => (
                      <div key={i} className="yk-pass-feat">
                        <span className="yk-pass-check">✓</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="yk-pass-btn"
                  onClick={() => setModalItem({ type: 'pass', title: p.title, price: p.price, desc: p.tagline })}
                >
                  Book Pass Now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCOMMODATION SECTION */}
      <section id="accommodation" className="yk-section">
        <div className="yk-container">
          <div className="yk-section-header">
            <span className="yk-tag" style={{ color: '#06b6d4', borderColor: '#06b6d4' }}>CAMPUS HOSPITALITY</span>
            <h2 className="yk-title">On-Campus <em>Accommodation</em></h2>
            <p className="yk-desc">
              Safe, affordable hostel rooms and delegation suites right in the heart of the festival campus with round-the-clock security and Wi-Fi.
            </p>
          </div>

          <div className="yk-acc-grid">
            {ACCOMMODATIONS.map((a) => (
              <div key={a.id} className="yk-acc-card">
                <div>
                  <h3 className="yk-acc-title">{a.title}</h3>

                  <div className="yk-acc-price-box">
                    <span className="yk-acc-currency">₹</span>
                    <span className="yk-acc-amount">{a.price}</span>
                    <span className="yk-acc-period">{a.period}</span>
                  </div>

                  <div className="yk-acc-list">
                    {a.details.map((d, i) => (
                      <div key={i} className="yk-acc-item">
                        <span>•</span>
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="yk-acc-btn"
                  onClick={() => setModalItem({ type: 'accommodation', title: a.title, price: `₹${a.price}`, desc: a.period })}
                >
                  Reserve Bed →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="yk-section">
        <div className="yk-container">
          <div className="yk-section-header">
            <span className="yk-tag">ARCHIVES</span>
            <h2 className="yk-title">Moments from <em>Past Editions</em></h2>
            <p className="yk-desc">
              Witness the energy, engineering passion, and electric atmosphere that defines the YUKTHI experience.
            </p>
          </div>

          <div className="yk-gallery-grid">
            {MOMENTS.map((m, i) => (
              <div key={i} className="yk-gallery-card">
                <img src={m.img} alt={m.title} className="yk-gallery-img" />
                <div className="yk-gallery-overlay">
                  <div>
                    <h4 className="yk-gallery-caption">{m.title}</h4>
                    <p className="yk-gallery-sub">{m.sub}</p>
                  </div>
                  <span style={{ color: 'var(--yk-cyan)', fontSize: '1.2rem' }}>↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="yk-section">
        <div className="yk-container">
          <div className="yk-section-header">
            <span className="yk-tag">ASSISTANCE</span>
            <h2 className="yk-title">Frequently Asked <em>Questions</em></h2>
            <p className="yk-desc">
              Have queries about registration, certificates, or travel? Here are answers to common questions.
            </p>
          </div>

          <div className="yk-faq-list">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className={`yk-faq-item ${openFaq === idx ? 'is-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="yk-faq-header">
                  <h4 className="yk-faq-question">{faq.q}</h4>
                  <span className="yk-faq-icon">+</span>
                </div>
                {openFaq === idx && (
                  <div className="yk-faq-body">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="yk-footer">
        <div className="yk-container">
          <div className="yk-footer-grid">
            <div>
              <div className="yk-footer-brand-title">YUKTHI X'26</div>
              <p className="yk-footer-brand-desc">
                South India's Flagship Techno-Management Conclave. Shaping the engineers, researchers, and pioneers of tomorrow.
              </p>
            </div>

            <div>
              <div className="yk-footer-col-title">NAVIGATION</div>
              <div className="yk-footer-links">
                <a href="#hero" onClick={handleSmoothScroll('hero')} className="yk-footer-link">Home</a>
                <a href="#summits" onClick={handleSmoothScroll('summits')} className="yk-footer-link">Summits</a>
                <a href="#workshops" onClick={handleSmoothScroll('workshops')} className="yk-footer-link">Workshops</a>
                <a href="#competitions" onClick={handleSmoothScroll('competitions')} className="yk-footer-link">Competitions</a>
              </div>
            </div>

            <div>
              <div className="yk-footer-col-title">FESTIVAL</div>
              <div className="yk-footer-links">
                <a href="#passes" onClick={handleSmoothScroll('passes')} className="yk-footer-link">Passes</a>
                <a href="#accommodation" onClick={handleSmoothScroll('accommodation')} className="yk-footer-link">Accommodation</a>
                <Link href="/vaaga" className="yk-footer-link">VAAGA Arts Day ↗</Link>
                <Link href="/tech" className="yk-footer-link">TECH X ↗</Link>
              </div>
            </div>

            <div>
              <div className="yk-footer-col-title">CONTACT</div>
              <div className="yk-footer-links">
                <span className="yk-footer-link">yukthi@cetp.edu</span>
                <span className="yk-footer-link">+91 94470 00000</span>
                <span className="yk-footer-link">College of Engineering Campus</span>
              </div>
            </div>
          </div>

          <div className="yk-footer-bottom">
            <span>© 2026 YUKTHI X'26. All Rights Reserved.</span>
            <span>Crafted with precision for national excellence.</span>
          </div>
        </div>
      </footer>

      {/* MODAL DIALOG */}
      {modalItem && (
        <div className="yk-modal-backdrop" onClick={() => setModalItem(null)}>
          <div className="yk-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button className="yk-modal-close" onClick={() => setModalItem(null)}>✕</button>

            <span className="yk-tag" style={{ marginBottom: '0.5rem' }}>
              {modalItem.type.toUpperCase()} BOOKING
            </span>
            <h3 style={{ fontFamily: 'PPFragment, Georgia, serif', fontSize: '1.65rem', color: '#ffffff', margin: '0.4rem 0' }}>
              {modalItem.title}
            </h3>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', color: 'var(--yk-cyan)', margin: '0 0 1.25rem' }}>
              {modalItem.price}
            </p>

            <form onSubmit={handleModalSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  className="yk-modal-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="yk-modal-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="WhatsApp Number"
                  className="yk-modal-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="College / Institution"
                  className="yk-modal-input"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                />
              </div>

              <button type="submit" className="yk-modal-submit">
                Complete Reservation ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
