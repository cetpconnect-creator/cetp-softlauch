import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Cinematic video intro (Ragnarök).
 * - Autoplays muted (browser policy); click anywhere or the sound button to unmute.
 * - Exits with a zoom / blur / ember-flash animation shortly before the video ends.
 * - Skip button, Esc / Enter / Space to skip, auto-skips if the video can't play.
 */
const EXIT_LEAD_SECONDS = 0.9; // start exit animation this long before the video ends
const EXIT_DURATION_MS = 1200; // must match introExit duration in IntroScene.css
const START_TIMEOUT_MS = 6000; // give up if the video never starts

export default function IntroScene({ onDone }) {
  const videoRef = useRef(null);
  const [phase, setPhase] = useState('playing'); // playing | exiting
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const finishedRef = useRef(false);

  const beginExit = useCallback(() => {
    setPhase((p) => (p === 'playing' ? 'exiting' : p));
  }, []);

  // Finish once the exit animation has played
  useEffect(() => {
    if (phase !== 'exiting') return;
    const t = setTimeout(() => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      onDone();
    }, EXIT_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  // Start playback + failsafes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const p = video.play();
    if (p && p.catch) p.catch(() => beginExit());

    const guard = setTimeout(() => {
      if (video.currentTime === 0) beginExit();
    }, START_TIMEOUT_MS);
    return () => clearTimeout(guard);
  }, [beginExit]);

  // Keyboard: Esc / Enter / Space skip, M toggles sound
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

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    if (v.duration - v.currentTime <= EXIT_LEAD_SECONDS) beginExit();
  };

  return (
    <div
      className={`intro-overlay ${phase === 'exiting' ? 'is-exiting' : ''} ${started ? 'is-started' : ''}`}
      role="dialog"
      aria-label="Intro animation"
      onClick={toggleMute}
    >
      <video
        ref={videoRef}
        className="intro-video"
        src="/videos/ragnarok-intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlaying={() => setStarted(true)}
        onTimeUpdate={onTimeUpdate}
        onEnded={beginExit}
        onError={beginExit}
      />

      {/* Cinematic letterbox bars, vignette and ember flash */}
      <div className="intro-bar intro-bar-top" />
      <div className="intro-bar intro-bar-bottom" />
      <div className="intro-vignette" />
      <div className="intro-flash" />

      <div className="intro-controls" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="intro-btn"
          onClick={toggleMute}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
        >
          {muted ? '🔇 Sound off' : '🔊 Sound on'}
        </button>
        <button type="button" className="intro-btn intro-skip" onClick={beginExit}>
          Skip ›
        </button>
      </div>
    </div>
  );
}
