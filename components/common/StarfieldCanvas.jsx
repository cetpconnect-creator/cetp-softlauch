import React, { useEffect, useRef } from 'react';

export default function StarfieldCanvas({ isLowPower }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    let animId = null;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const warpStars = Array.from({ length: 200 }, () => ({
      x: (Math.random() - 0.5) * 2500,
      y: (Math.random() - 0.5) * 2500,
      z: 2000 * Math.random(),
      baseRadius: 1.8 * Math.random() + 0.8,
      opacity: 0.8 * Math.random() + 0.2
    }));

    const twinkleStars = Array.from({ length: 400 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.5 * Math.random(),
      opacity: Math.random(),
      twinkleSpeed: 0.025 * Math.random() + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1
    }));

    const meteors = [];
    let lastMeteor = 0;
    let nextMeteorDelay = 3500 + Math.random() * 4000;

    const render = (time) => {
      if (isLowPower) {
        ctx.clearRect(0, 0, width, height);
        return;
      }
      ctx.clearRect(0, 0, width, height);

      // Twinkling stars
      for (let i = 0; i < twinkleStars.length; i++) {
        const s = twinkleStars[i];
        s.opacity += s.twinkleSpeed * s.twinkleDir;
        if (s.opacity >= 1) {
          s.opacity = 1;
          s.twinkleDir = -1;
        } else if (s.opacity <= 0.1) {
          s.opacity = 0.1;
          s.twinkleDir = 1;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * s.opacity})`;
        const sz = Math.max(2 * s.radius, 1);
        ctx.fillRect(s.x - sz / 2, s.y - sz / 2, sz, sz);
      }

      // 3D Perspective Warp stars
      const cx = width / 2;
      const cy = height / 2;
      const speed = 1.8;

      for (let i = 0; i < warpStars.length; i++) {
        const s = warpStars[i];
        s.z -= speed;
        if (s.z <= 1) {
          s.z = 2000;
          s.x = (Math.random() - 0.5) * 2500;
          s.y = (Math.random() - 0.5) * 2500;
        }

        const k = 300 / s.z;
        const px = cx + s.x * k;
        const py = cy + s.y * k;
        const prevK = 300 / (s.z + 2.5 * speed);
        const prevX = cx + s.x * prevK;
        const prevY = cy + s.y * prevK;

        if (px > 0 && px < width && py > 0 && py < height) {
          const rad = s.baseRadius * k;
          const alpha = s.opacity * Math.min(1, 1 - s.z / 2000);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `rgba(160, 215, 255, ${alpha * 0.7})`;
          ctx.lineWidth = Math.max(0.75, rad);
          ctx.stroke();
        }
      }

      // Shooting stars
      if (time - lastMeteor > nextMeteorDelay) {
        const ang = (Math.PI / 180) * (25 * Math.random() + 30);
        const spd = 4 * Math.random() + 5;
        meteors.push({
          x: Math.random() * width * 1.3 - 0.15 * width,
          y: -50,
          length: 70 * Math.random() + 50,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          opacity: 0.5 * Math.random() + 0.4,
          life: 0,
          maxLife: 90 * Math.random() + 80
        });
        lastMeteor = time;
        nextMeteorDelay = 4000 * Math.random() + 4000;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.length;
        const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.length;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.2, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
        ctx.fill();

        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        if (m.life > m.maxLife || m.x > width + m.length || m.y > height + m.length) {
          meteors.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isLowPower]);

  return (
    <canvas
      ref={canvasRef}
      className="viewport-bg"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
