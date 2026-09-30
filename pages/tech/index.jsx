import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TechPage() {
  const [preloaderHidden, setPreloaderHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Glow position
  const cursorGlowRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  // Stats counter state
  const [stats, setStats] = useState({
    projects: 0,
    uptime: 0,
    years: 0,
    awards: 0
  });
  const statsStarted = useRef(false);
  const statsRef = useRef(null);

  // Testimonials data
  const testimonials = [
    {
      quote: `"TECH X didn't just deploy our models — they transformed our infrastructure. Sub-10ms latency across 40 countries on day one. Our team can ship without fear."`,
      author: 'Elena Marchetti',
      role: 'CEO, Lumière AI Studios',
      avatar: 'E'
    },
    {
      quote: `"Deploying with TECH X was effortless. We cut our monthly compute bill by 42% while scaling throughput 5x during peak demand."`,
      author: 'James Thornton',
      role: 'Head of Infrastructure, Apex Cloud',
      avatar: 'J'
    },
    {
      quote: `"The attention to reliability is extraordinary. Every model deployment, rollback, and traffic shift happens smoothly with zero downtime."`,
      author: 'Sofia Andersson',
      role: 'VP of Engineering, Nordic Systems',
      avatar: 'S'
    }
  ];

  // FAQ data
  const faqs = [
    {
      q: 'What types of AI workloads does TECH X support?',
      a: 'TECH X supports the full spectrum — from LLM inference and fine-tuning to computer vision, audio processing, and custom model serving. Any PyTorch, TensorFlow, or ONNX model deploys in minutes with zero container configuration.'
    },
    {
      q: 'How does pricing work?',
      a: 'We offer transparent, consumption-based pricing with no upfront commitments. You pay only for exact GPU/CPU compute seconds consumed. Enterprise plans with reserved capacity and custom volume discounts are available upon request.'
    },
    {
      q: 'Can I bring my own cloud infrastructure (BYOC)?',
      a: 'Yes. TECH X runs natively on AWS, GCP, and Azure, and supports seamless hybrid deployments into your own private VPC or on-premises cluster via our Bring-Your-Own-Cloud tier.'
    },
    {
      q: 'How long does onboarding take?',
      a: "Most engineering teams serve their first production model within 30 minutes of signing up. Our solutions engineering team provides dedicated white-glove onboarding for enterprise migrations, typically completing in under two weeks."
    },
    {
      q: 'Is there a free trial with credits?',
      a: 'Yes — every new account includes $500 in free compute credits, valid for 30 days. No credit card required to start building. Register now to claim your sandbox environment.'
    }
  ];

  // Showcase items
  const showcaseItems = [
    {
      title: 'HyperScale LLM',
      category: 'Real-Time Inference',
      bg: "linear-gradient(135deg, rgba(229,9,20,0.3) 0%, rgba(5,5,5,0.95) 100%), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')"
    },
    {
      title: 'Autonomous Vision',
      category: 'Edge Perception',
      bg: "linear-gradient(135deg, rgba(229,9,20,0.2) 0%, rgba(5,5,5,0.95) 100%), url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80')"
    },
    {
      title: 'Global Model Mesh',
      category: 'Cluster Orchestration',
      bg: "linear-gradient(135deg, rgba(229,9,20,0.25) 0%, rgba(5,5,5,0.95) 100%), url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80')"
    },
    {
      title: 'Neural Studio',
      category: 'Generative Synthesis',
      bg: "linear-gradient(135deg, rgba(229,9,20,0.35) 0%, rgba(5,5,5,0.95) 100%), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80')"
    },
    {
      title: 'Adaptive Grid',
      category: 'GPU Autoscaling',
      bg: "linear-gradient(135deg, rgba(229,9,20,0.2) 0%, rgba(5,5,5,0.95) 100%), url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80')"
    }
  ];

  // Preloader timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreloaderHidden(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Topbar scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cursor Glow smooth animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animateGlow = () => {
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * 0.12;

      if (cursorGlowRef.current) {
        cursorGlowRef.current.style.left = `${glowPos.current.x}px`;
        cursorGlowRef.current.style.top = `${glowPos.current.y}px`;
      }
      rafId.current = requestAnimationFrame(animateGlow);
    };
    animateGlow();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Animated stat counters
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsStarted.current) {
          statsStarted.current = true;
          const duration = 1200;
          const steps = 40;
          const intervalTime = duration / steps;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            setStats({
              projects: Math.min(150, Math.floor(150 * progress)),
              uptime: Math.min(99, Math.floor(99 * progress)),
              years: Math.min(12, Math.floor(12 * progress)),
              awards: Math.min(40, Math.floor(40 * progress))
            });
            if (step >= steps) {
              clearInterval(timer);
            }
          }, intervalTime);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Testimonials autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Dynamic particles generator in hero
  const particlesRef = useRef(null);
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const createParticle = () => {
      if (!container) return;
      const p = document.createElement('div');
      p.className = 'particle';
      const x = 10 + Math.random() * 80;
      const size = 1.5 + Math.random() * 3.5;
      const duration = 6 + Math.random() * 7;
      const delay = Math.random() * 3;

      p.style.left = `${x}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${delay}s`;
      p.style.opacity = `${0.2 + Math.random() * 0.6}`;

      container.appendChild(p);

      setTimeout(() => {
        if (p.parentNode === container) {
          container.removeChild(p);
        }
      }, (duration + delay) * 1000);
    };

    // Initial batch
    for (let i = 0; i < 20; i++) {
      createParticle();
    }
    const interval = setInterval(createParticle, 600);
    return () => clearInterval(interval);
  }, []);

  // 3D card tilt effect
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  // Form submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      e.target.reset();
    }, 3000);
  };

  // Smooth scroll handler
  const scrollTo = (id) => (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="techx-page">
      <Head>
        <title>TECH X | YUKTHI X'26</title>
        <meta
          name="description"
          content="TECH X infrastructure platform at YUKTHI X'26."
        />
      </Head>

      {/* Preloader */}
      <div className={`preloader ${preloaderHidden ? 'hidden' : ''}`} id="preloader">
        <div className="preloader-ring" />
      </div>

      {/* Trailing Cursor Glow */}
      <div ref={cursorGlowRef} className="cursor-glow" id="cursorGlow" />

      {/* Topbar / Navigation */}
      <nav className={`topbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <a href="#hero" onClick={scrollTo('hero')} className="nav-brand" aria-label="TECH X Home">
            <svg className="nav-brand-logo" viewBox="0 0 31.5 48.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <defs>
                <linearGradient id="brandGrad" x1="8" y1="0" x2="34.1" y2="28.9" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ff2e3d" />
                  <stop offset=".35" stopColor="#e50914" />
                  <stop offset=".70" stopColor="#99040c" />
                  <stop offset="1" stopColor="#550005" />
                </linearGradient>
              </defs>
              <path d="M21.5 0 L21.5 19.5 L31.5 19.5 L31.5 29 L10 48.5 L10 28.5 L0.5 28.5 L0.5 18.5 Z" fill="url(#brandGrad)" />
              <rect x="0.5" y="18.5" width="9" height="10" fill="#fdfdfd" />
              <rect x="22" y="19.5" width="9.5" height="9.5" fill="#fdfdfd" />
            </svg>
            <span className="nav-brand-title">TECH X</span>
          </a>

          {/* Quick link back to Yukthi X'26 */}
          <Link href="/" className="btn-back-yukthi" title="Return to YUKTHI X'26 Main Portal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>YUKTHI X'26</span>
          </Link>
        </div>

        <ul className="nav-links">
          <li><a href="#showcase" onClick={scrollTo('showcase')}>Work</a></li>
          <li><a href="#about" onClick={scrollTo('about')}>About</a></li>
          <li><a href="#features" onClick={scrollTo('features')}>Features</a></li>
          <li><a href="#testimonials" onClick={scrollTo('testimonials')}>Voices</a></li>
          <li><a href="#faq" onClick={scrollTo('faq')}>FAQ</a></li>
          <li><a href="#contact" onClick={scrollTo('contact')}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          <a href="#contact" onClick={scrollTo('contact')} className="btn-pill-nav">Register Now</a>
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Fullscreen Mobile Menu Drawer */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`} id="mobileMenu">
        <ul>
          <li><a href="#showcase" className="mobile-link" onClick={scrollTo('showcase')}>Work</a></li>
          <li><a href="#about" className="mobile-link" onClick={scrollTo('about')}>About</a></li>
          <li><a href="#features" className="mobile-link" onClick={scrollTo('features')}>Features</a></li>
          <li><a href="#testimonials" className="mobile-link" onClick={scrollTo('testimonials')}>Voices</a></li>
          <li><a href="#faq" className="mobile-link" onClick={scrollTo('faq')}>FAQ</a></li>
          <li><a href="#contact" className="mobile-link" onClick={scrollTo('contact')}>Contact</a></li>
        </ul>
        <a href="#contact" className="btn btn-primary mobile-link" onClick={scrollTo('contact')} style={{ marginTop: '0.5rem' }}>
          Register Now
        </a>
        <Link href="/" className="btn-back-yukthi" style={{ marginTop: '1rem', padding: '0.75rem 1.6rem', fontSize: '0.85rem' }}>
          ← Return to YUKTHI X'26
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="hero" id="hero">
        {/* Video Background Plate */}
        <div className="plate">
          <video
            className="plate-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src="/videos/techx-bg.mp4" type="video/mp4" />
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dynamic Floating Particles */}
        <div ref={particlesRef} className="particles-container" id="particles" />

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">TECH X</h1>
          <div className="hero-cta">
            <a href="#contact" onClick={scrollTo('contact')} className="btn btn-primary">
              Register Now
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <a href="#showcase" onClick={scrollTo('showcase')} className="scroll-indicator" aria-label="Scroll to next section">
          <span>Scroll</span>
          <div className="scroll-line" />
        </a>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="showcase" id="showcase">
        <div className="showcase-header">
          <p className="section-label reveal">Selected Work</p>
          <h2 className="section-title reveal reveal-delay-1">Next-Gen AI Deployments</h2>
          <p className="section-desc reveal reveal-delay-2" style={{ margin: '0 auto' }}>
            Powering mission-critical production pipelines across industries worldwide.
          </p>
        </div>

        {/* Infinite Marquee Track */}
        <div className="showcase-track" id="showcaseTrack">
          {/* Repeat twice for seamless infinite scroll */}
          {[...showcaseItems, ...showcaseItems].map((item, idx) => (
            <div key={idx} className="showcase-item">
              <div className="showcase-item-bg" style={{ backgroundImage: item.bg }} />
              <div className="showcase-item-overlay">
                <h4>{item.title}</h4>
                <p>{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <div className="about">
          <div className="about-visual reveal">
            <div className="about-image">
              <img
                src="/images/tech/about-speaker.png"
                alt="Keynote speaker on stage under spotlight"
                className="about-stage-img"
                onError={(e) => {
                  e.currentTarget.src = '/about-speaker.png';
                }}
              />
              <div className="about-stage-overlay" />
            </div>
          </div>

          <div className="about-content">
            <p className="section-label reveal">Our Story</p>
            <h2 className="section-title reveal reveal-delay-1">Built For The<br />AI Era</h2>
            <p className="section-desc reveal reveal-delay-2">
              TECH X is a next-generation infrastructure platform designed from the ground up for teams building intelligent systems. We believe the next layer of intelligence demands infrastructure that is fast, composable, and built to scale without compromise.
            </p>
            <p className="section-desc reveal reveal-delay-3" style={{ marginTop: '1rem' }}>
              Founded by engineers who have scaled AI at the world's largest organizations, TECH X brings enterprise-grade reliability to every team — from seed-stage startups to global enterprises.
            </p>

            {/* Interactive Stats Counters */}
            <div ref={statsRef} className="stats-row reveal reveal-delay-3">
              <div className="stat-item">
                <div className="stat-number">{stats.projects}+</div>
                <div className="stat-label">Projects Live</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.uptime}%</div>
                <div className="stat-label">Uptime SLA</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.years}+</div>
                <div className="stat-label">Years R&D</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.awards}+</div>
                <div className="stat-label">Industry Awards</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="features-header">
          <p className="section-label reveal">What We Do</p>
          <h2 className="section-title reveal reveal-delay-1">Everything Your<br />AI Stack Needs</h2>
          <p className="section-desc reveal reveal-delay-2" style={{ margin: '0 auto' }}>
            From model orchestration to global edge inference, we build every layer with microsecond precision.
          </p>
        </div>

        <div className="features-grid">
          {/* Card 1 */}
          <div
            className="feature-card reveal"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <span className="feature-num">01</span>
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </div>
            <h3>Unified Compute</h3>
            <p>Orchestrate GPU, TPU and CPU workloads from a single control plane with zero-config autoscaling.</p>
          </div>

          {/* Card 2 */}
          <div
            className="feature-card reveal reveal-delay-1"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <span className="feature-num">02</span>
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            </div>
            <h3>Model Registry</h3>
            <p>Version, deploy and roll back models instantly. Full lineage tracking from training run to production endpoint.</p>
          </div>

          {/* Card 3 */}
          <div
            className="feature-card reveal reveal-delay-2"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <span className="feature-num">03</span>
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <h3>Real-Time Inference</h3>
            <p>Sub-10ms p99 latency inference with global edge caching and adaptive batching built directly in.</p>
          </div>

          {/* Card 4 */}
          <div
            className="feature-card reveal"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <span className="feature-num">04</span>
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
            </div>
            <h3>Observability</h3>
            <p>Live dashboards for latency, throughput, drift detection and cost attribution across every model and team.</p>
          </div>

          {/* Card 5 */}
          <div
            className="feature-card reveal reveal-delay-1"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <span className="feature-num">05</span>
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Security & Compliance</h3>
            <p>SOC 2 Type II, HIPAA, and GDPR ready. Private VPC networking, KMS key management and audit logs included.</p>
          </div>

          {/* Card 6 */}
          <div
            className="feature-card reveal reveal-delay-2"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <span className="feature-num">06</span>
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <h3>Developer SDK</h3>
            <p>Python, TypeScript and REST APIs. Native CI/CD integrations with GitHub, GitLab and custom pipelines.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section" id="testimonials">
        <div className="testimonials-header">
          <p className="section-label reveal">Voices</p>
          <h2 className="section-title reveal reveal-delay-1">Trusted By Industry Leaders</h2>
        </div>

        <div className="testimonial-slider reveal reveal-delay-2">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className={`testimonial-slide ${idx === activeSlide ? 'active' : ''}`}
            >
              <p className="testimonial-quote">{t.quote}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div className="testimonial-info">
                  <h5>{t.author}</h5>
                  <p>{t.role}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="testimonial-dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`testimonial-dot ${idx === activeSlide ? 'active' : ''}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section" id="faq">
        <div className="faq-header">
          <p className="section-label reveal">FAQ</p>
          <h2 className="section-title reveal reveal-delay-1">Frequently Asked Questions</h2>
        </div>

        <div className="faq-list" id="faqList">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`faq-item reveal ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-q"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  {faq.q}
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-a">{faq.a}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT / CTA SECTION */}
      <section className="cta-section" id="contact">
        <div className="cta-container">
          <div className="cta-content">
            <p className="section-label reveal">Get Started</p>
            <h2 className="section-title reveal reveal-delay-1">Your Intelligent<br />Future Awaits</h2>
            <p className="section-desc reveal reveal-delay-2">
              Every breakthrough begins with the right foundation. Partner with our AI infrastructure architects to deploy, scale, and accelerate your vision.
            </p>
            <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a href="#contact" onClick={scrollTo('contact')} className="btn btn-primary">Schedule Demo</a>
              <a href="mailto:hello@techx.ai" className="btn btn-outline">hello@techx.ai</a>
            </div>
          </div>

          <div className="contact-card reveal reveal-delay-2">
            <form className="contact-form" id="contactForm" onSubmit={handleFormSubmit}>
              <div className="cf-row">
                <div className="cf-field">
                  <label htmlFor="cf-name">Name</label>
                  <input type="text" id="cf-name" placeholder="Varun Raj" required autoComplete="name" />
                </div>
                <div className="cf-field">
                  <label htmlFor="cf-email">Work Email</label>
                  <input type="email" id="cf-email" placeholder="varun@company.com" required autoComplete="email" />
                </div>
              </div>
              <div className="cf-field">
                <label htmlFor="cf-company">Company</label>
                <input type="text" id="cf-company" placeholder="Acme Technologies" autoComplete="organization" />
              </div>
              <div className="cf-field">
                <label htmlFor="cf-msg">Project Scope / Requirements</label>
                <textarea id="cf-msg" placeholder="Describe your models, expected throughput, or latency targets…"></textarea>
              </div>
              <button
                className="cf-submit"
                type="submit"
                style={formSubmitted ? { background: '#28a745' } : {}}
              >
                {formSubmitted ? 'Submitted ✓' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#hero" onClick={scrollTo('hero')} className="nav-brand">
              <svg className="nav-brand-logo" viewBox="0 0 31.5 48.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M21.5 0 L21.5 19.5 L31.5 19.5 L31.5 29 L10 48.5 L10 28.5 L0.5 28.5 L0.5 18.5 Z" fill="#e50914" />
                <rect x="0.5" y="18.5" width="9" height="10" fill="#fdfdfd" />
                <rect x="22" y="19.5" width="9.5" height="9.5" fill="#fdfdfd" />
              </svg>
              <span className="nav-brand-title">TECH X</span>
            </a>
            <p>The unified AI infrastructure platform engineered for maximum throughput, sub-10ms latency, and enterprise reliability.</p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#features" onClick={scrollTo('features')}>Unified Compute</a></li>
              <li><a href="#features" onClick={scrollTo('features')}>Model Registry</a></li>
              <li><a href="#features" onClick={scrollTo('features')}>Real-Time Inference</a></li>
              <li><a href="#features" onClick={scrollTo('features')}>Observability</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#about" onClick={scrollTo('about')}>About TECH X</a></li>
              <li><a href="#showcase" onClick={scrollTo('showcase')}>Case Studies</a></li>
              <li><a href="#testimonials" onClick={scrollTo('testimonials')}>Customer Voices</a></li>
              <li><a href="#faq" onClick={scrollTo('faq')}>Security & Trust</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="mailto:hello@techx.ai">hello@techx.ai</a></li>
              <li><a href="#hero" onClick={scrollTo('hero')}>San Francisco, CA</a></li>
              <li><a href="#hero" onClick={scrollTo('hero')}>New York, NY</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 TECH X Inc. All rights reserved.</p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">GH</a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X Twitter">X</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">IN</a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">DC</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
