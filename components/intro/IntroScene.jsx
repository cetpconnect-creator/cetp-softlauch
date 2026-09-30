import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Cinematic video intro (Ragnarök) - Optimized for Phone & Desktop users.
 * 
 * Phone optimizations:
 * - Responsive framing: phone portrait mode provides smart Fit (contain with ambient glow)
 *   or Fill (cover) modes so title cards & text aren't cropped out.
 * - Mobile autoplay resilience: handles iOS Low Power Mode and strict browser policies.
 *   Shows an elegant "Tap to Play" gate if autoplay is blocked instead of abruptly skipping.
 * - Touch ergonomics: Safe-area aware, thumb-friendly tap targets (>= 44px).
 * - Visual touch feedback: animated "Sound On / Muted" badge on screen tap.
 * - Progress indicator: glowing ember timeline bar so phone users know playback progress.
 * - Swipe-up gesture: swipe up anywhere to skip directly into the fest.
 * - Memory & battery: clean teardown, hardware accelerated CSS, passive touch handlers.
 */
const EXIT_LEAD_SECONDS = 0.8;
const EXIT_DURATION_MS = 1100;
const START_TIMEOUT_MS = 7500;

export default function IntroScene({ onDone }) {
  const videoRef = useRef(null);
  const touchStartY = useRef(null);
  const lastTapTime = useRef(0);
  const finishedRef = useRef(false);

  const [phase, setPhase] = useState('playing'); // 'playing' | 'exiting'
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soundFeedback, setSoundFeedback] = useState(null); // 'on' | 'off'
  const [blockedAutoplay, setBlockedAutoplay] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [fillMode, setFillMode] = useState('fit'); // 'fit' | 'fill'
  const [showRotateHint, setShowRotateHint] = useState(false);

  const beginExit = useCallback(() => {
    setPhase((p) => (p === 'playing' ? 'exiting' : p));
  }, []);

  // Detect mobile phone screen & orientation
  useEffect(() => {
    const checkPhone = () => {
      const phone = window.innerWidth <= 768 || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      setIsPhone(phone);
      const isPortrait = window.innerHeight > window.innerWidth;
      setShowRotateHint(phone && isPortrait);
    };

    checkPhone();
    window.addEventListener('resize', checkPhone, { passive: true });
    window.addEventListener('orientationchange', checkPhone, { passive: true });

    // Auto-hide rotate hint after 3.8s
    const timer = setTimeout(() => setShowRotateHint(false), 3800);

    return () => {
      window.removeEventListener('resize', checkPhone);
      window.removeEventListener('orientationchange', checkPhone);
      clearTimeout(timer);
    };
  }, []);

  // Finish once exit animation completes
  useEffect(() => {
    if (phase !== 'exiting') return;
    const t = setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onDone();
    }, EXIT_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  // Video autoplay with mobile failsafe & Low-Power Mode resilience
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict attributes for iOS Safari & Android Chrome
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch((err) => {
        // Autoplay blocked by mobile browser (e.g. low-power mode or user settings)
        console.warn('Autoplay restricted by browser, showing interactive play prompt:', err);
        setBlockedAutoplay(true);
      });
    }

    const guard = setTimeout(() => {
      if (video.currentTime === 0 && !video.paused) {
        // Stalled network
        beginExit();
      }
    }, START_TIMEOUT_MS);

    return () => clearTimeout(guard);
  }, [beginExit]);

  // Keyboard navigation for desktop: Esc / Enter / Space skip, M toggles sound
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        beginExit();
      } else if (e.code === 'KeyM') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [beginExit]); // eslint-disable-line react-hooks/exhaustive-deps

  const showAudioToast = (isMuted) => {
    setSoundFeedback(isMuted ? 'off' : 'on');
    setTimeout(() => {
      setSoundFeedback(null);
    }, 1200);
  };

  const toggleMute = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;

    if (blockedAutoplay) {
      handleManualStart(false);
      return;
    }

    const nextMuted = !v.muted;
    v.muted = nextMuted;
    setMuted(nextMuted);
    showAudioToast(nextMuted);
  };

  const handleManualStart = (unmute = false) => {
    const v = videoRef.current;
    if (!v) return;
    setBlockedAutoplay(false);
    v.muted = !unmute;
    setMuted(!unmute);
    const p = v.play();
    if (p && p.catch) {
      p.catch(() => beginExit());
    }
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const pct = Math.min(100, (v.currentTime / v.duration) * 100);
    setProgress(pct);

    if (v.duration - v.currentTime <= EXIT_LEAD_SECONDS) {
      beginExit();
    }
  };

  // Touch gesture handling for phone users:
  // - Tap to toggle sound + toast
  // - Double tap to toggle Fit / Fill framing on portrait phones
  // - Swipe up to skip
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current !== null && e.changedTouches && e.changedTouches[0]) {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (deltaY > 55) {
        // Swipe up to skip
        beginExit();
        return;
      }
    }

    // Double tap detector
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      // Double tap: toggle framing between fit and fill
      setFillMode((m) => (m === 'fit' ? 'fill' : 'fit'));
    } else {
      // Single tap: toggle sound
      toggleMute();
    }
    lastTapTime.current = now;
  };

  return (
    <div
      className={`intro-overlay ${phase === 'exiting' ? 'is-exiting' : ''} ${
        started ? 'is-started' : ''
      } ${isPhone ? 'is-phone' : ''} is-mode-${fillMode}`}
      role="dialog"
      aria-label="Yukthi Ragnarök Intro Animation"
      onClick={toggleMute}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Phone portrait ambient backdrop glow */}
      {isPhone && (
        <div className="intro-ambient-bg" aria-hidden="true">
          <div className="intro-ambient-glow" />
        </div>
      )}

      {/* Main video element with dual fit/fill responsive mode */}
      <div className="intro-stage">
        <video
          ref={videoRef}
          className={`intro-video ${fillMode === 'fill' ? 'is-fill' : 'is-fit'}`}
          src="/videos/ragnarok-intro.mp4"
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          onPlaying={() => {
            setStarted(true);
            setBlockedAutoplay(false);
          }}
          onTimeUpdate={onTimeUpdate}
          onEnded={beginExit}
          onError={beginExit}
        />
      </div>

      {/* Cinematic letterbox bars, vignette and ember flash */}
      <div className="intro-bar intro-bar-top" />
      <div className="intro-bar intro-bar-bottom" />
      <div className="intro-vignette" />
      <div className="intro-flash" />

      {/* Sound feedback toast (instant visual indicator on phone tap) */}
      {soundFeedback && (
        <div className="intro-toast" aria-live="polite">
          <span className="intro-toast__icon">
            {soundFeedback === 'on' ? '🔊' : '🔇'}
          </span>
          <span className="intro-toast__text">
            {soundFeedback === 'on' ? 'Sound On' : 'Sound Muted'}
          </span>
        </div>
      )}

      {/* Rotate hint for phone users in portrait */}
      {showRotateHint && started && (
        <div className="intro-rotate-hint" aria-hidden="true">
          <span>↻ Rotate for widescreen</span>
        </div>
      )}

      {/* Autoplay blocked fallback gate for mobile power-saver mode */}
      {blockedAutoplay && (
        <div className="intro-gate" onClick={(e) => e.stopPropagation()}>
          <div className="intro-gate__card">
            <div className="intro-gate__pulse" />
            <button
              type="button"
              className="intro-gate__play-btn"
              onClick={() => handleManualStart(true)}
              aria-label="Play cinematic intro with sound"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <h3 className="intro-gate__title">YUKTHI X&apos;26</h3>
            <p className="intro-gate__sub">Tap to experience the Ragnarök intro</p>
            <div className="intro-gate__actions">
              <button
                type="button"
                className="intro-gate__action-btn intro-gate__action-btn--primary"
                onClick={() => handleManualStart(true)}
              >
                Watch Intro
              </button>
              <button
                type="button"
                className="intro-gate__action-btn intro-gate__action-btn--ghost"
                onClick={beginExit}
              >
                Skip to Fest ›
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom glowing progress timeline */}
      <div className="intro-progress" aria-hidden="true">
        <div
          className="intro-progress__fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mobile-optimized controls */}
      <div className="intro-controls" onClick={(e) => e.stopPropagation()}>
        {/* On portrait phones: Fit vs Fill framing toggle */}
        {isPhone && (
          <button
            type="button"
            className="intro-btn intro-btn--mode"
            onClick={(e) => {
              e.stopPropagation();
              setFillMode((m) => (m === 'fit' ? 'fill' : 'fit'));
            }}
            aria-label={fillMode === 'fit' ? 'Switch to Fullscreen Fill' : 'Switch to Fit Video'}
          >
            {fillMode === 'fit' ? '⛶ Fill' : '⊡ Fit'}
          </button>
        )}

        <button
          type="button"
          className={`intro-btn intro-btn--sound ${!muted ? 'is-active' : ''}`}
          onClick={toggleMute}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
        >
          {muted ? '🔇 Sound off' : '🔊 Sound on'}
        </button>

        <button
          type="button"
          className="intro-btn intro-skip"
          onClick={(e) => {
            e.stopPropagation();
            beginExit();
          }}
        >
          Skip ›
        </button>
      </div>
    </div>
  );
}
