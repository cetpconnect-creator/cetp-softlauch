import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 3D Tilt Hero Heading with Orbitron Font
export const HeroMainTitle = ({ text = "YUKTHI X'26" }) => {
  const titleRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!titleRef.current) return;
      const xNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      const yNorm = (e.clientY / window.innerHeight - 0.5) * 2;
      titleRef.current.style.transform = `perspective(1000px) rotateY(${xNorm * 15}deg) rotateX(${-yNorm * 15}deg)`;
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

  return (
    <div className="relative flex items-center justify-center pointer-events-none select-none z-20">
      <h1
        ref={titleRef}
        className="tathva-heading hero-main-title text-center font-bold uppercase text-white drop-shadow-2xl"
      >
        {text}
      </h1>
    </div>
  );
};

// Countdown Timer Component
export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: '06', hours: '20', mins: '43', secs: '25' });

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

  return (
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
  );
};

export default function Hero({ onExplore }) {
  return (
    <section className="home-hero-section">

      {/* Year 2026 */}
      <p className="hero-year-text">2026</p>

      {/* Giant Futuristic Title: YUKTHI X'26 */}
      <HeroMainTitle text="YUKTHI X'26" />

      {/* Dates */}
      <p className="hero-dates-text">13TH - 17TH OCTOBER</p>
    </section>
  );
}
