import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import GalaxyScene from './GalaxyScene';

/**
 * YUKTHI X'26 - OFFICIAL REACT APPLICATION
 * Pixel-perfect reproduction of YUKTHI X'26 (NIT Calicut)
 * Includes Starfield Cosmic Canvas, Competitions, Workshops, Passes, Accomodation,
 * Authentic Posters, "Booking Full" Ribbons, Tabs, Search, and Event Modal.
 */

// ==========================================
// 1. DATASET: ALL 22 EVENTS
// ==========================================
const EVENTS_DATA = [
  // --- WORKSHOPS (YUKTHI X'26 Official) ---
  {
    id: 22,
    type: 'workshops',
    heading: 'Autonomous Driving Systems',
    price: 999,
    published: true,
    ticketId: 3312,
    description: "Step into the forefront of mobility innovation with an intensive, hands-on workshop on Autonomous Driving Systems. Self-driving technology relies on a complex fusion of artificial intelligence, high-performance sensors, precise localization, and real-time control algorithms. This session deconstructs the autonomous vehicle stack—from raw sensor perception and computer vision to path planning and drive-by-wire execution—giving you practical insights into how self-driving vehicles navigate real-world environments safely.",
    catchyPara: "Self-driving perception & path planning",
    datetime: "2026-10-11T03:30:00.000Z",
    picture: "posters/event_22.webp",
    remotePicture: "https://cdn.tathva.org/events/3a3c1037-3fd9-4717-8d40-eca95b2fbe77.webp",
    committee: "Workshop committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 23,
    type: 'workshops',
    heading: 'Cyber Forensics',
    price: 999,
    published: true,
    ticketId: 3313,
    description: "Step into the shoes of a digital detective in this intensive, hands-on Digital Forensics and Incident Response (DFIR) workshop. When a breach occurs, speed, accuracy, and clear chain-of-custody are everything. This session covers the complete lifecycle of a cyber attack investigation—from capturing volatile RAM and triage imaging to hunting threats across network logs, analyzing malware artifacts, and constructing an executive incident timeline.",
    catchyPara: "Digital Forensics & Incident Response",
    datetime: "2026-10-11T03:30:00.000Z",
    picture: "posters/event_23.webp",
    remotePicture: "https://cdn.tathva.org/events/c5da5741-b9b7-45aa-923b-9d60b4a2104c.webp",
    committee: "Workshop committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 24,
    type: 'workshops',
    heading: 'CyberSecurity',
    price: 999,
    published: true,
    ticketId: 3314,
    description: "Step onto the digital battlefield in this intensive, hands-on workshop covering Cybersecurity and Ethical Hacking. The best way to defend a network is to understand how adversaries breach it. This session bridges offensive techniques (Red Teaming) with defensive countermeasures (Blue Teaming), taking you through the complete cyber kill chain—from reconnaissance and vulnerability exploitation to threat containment and system hardening.",
    catchyPara: "Ethical Hacking & Network Defense",
    datetime: "2026-10-11T03:30:00.000Z",
    picture: "posters/event_24.webp",
    remotePicture: "https://cdn.tathva.org/events/9c61e2a8-16ef-42ac-ab1b-cdf1bb30b062.webp",
    committee: "Workshop committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 2,
    type: 'workshops',
    heading: 'PCB Design',
    price: 999,
    published: false,
    ticketId: 3287,
    description: "Take your electronics skills to the next level! Join our hands-on PCB Design Workshop and learn how to turn breadboard prototypes into custom, production-ready circuit boards. From schematic capture and track routing to exporting manufacturing files, master the end-to-end design process using industry-standard software.",
    catchyPara: "Let the circuits arise.",
    datetime: "2026-10-09T03:30:00.000Z",
    picture: "posters/event_2.webp",
    remotePicture: "https://cdn.tathva.org/events/579bfa73-4c14-4c9b-a1e5-09aefd353441.webp",
    committee: "Workshop Committe",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 8,
    type: 'workshops',
    heading: 'Frontend Workshop',
    price: 999,
    published: false,
    ticketId: 3296,
    description: "Transform code into compelling digital experiences with an intensive, hands-on workshop on modern frontend development. Whether you're building responsive layouts from scratch or creating dynamic, interactive web applications, this session covers the core languages, modern frameworks, and practical workflows needed to launch professional web interfaces.",
    catchyPara: "Feel the Design",
    datetime: "2026-10-11T03:30:00.000Z",
    picture: "posters/event_8.webp",
    remotePicture: "https://cdn.tathva.org/events/3929200e-91f0-461d-a3db-a085d74437fb.webp",
    committee: "Workshop Committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 3,
    type: 'workshops',
    heading: 'AI/ML workshop',
    price: 999,
    published: false,
    ticketId: 3292,
    description: "Master the next evolution of Machine Learning in this hands-on workshop focused on Agentic AI. You will learn to move beyond standard LLMs by building autonomous AI systems that reason, plan, connect to external APIs, and execute complex multi-step workflows using top frameworks like LangGraph and CrewAI. Ideal for developers and ML engineers ready to engineer goal-driven, next-generation AI solutions.",
    catchyPara: "Build the Artificial Brain",
    datetime: "2026-10-10T03:30:00.000Z",
    picture: "posters/event_3.webp",
    remotePicture: "https://cdn.tathva.org/events/e88d1e31-2283-4d3d-a75f-2f52a1ec5565.webp",
    committee: "Workshop committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 5,
    type: 'workshops',
    heading: 'Game Development Workshop',
    price: 999,
    published: false,
    ticketId: 3293,
    description: "Step into the world of game development with an intensive, hands-on workshop designed to turn your ideas into playable reality. Whether you're aspiring to build your first indie game, master game physics, or design engaging interactive mechanics, this session provides the foundational tools, engines, and workflow knowledge needed to bring virtual worlds to life.",
    catchyPara: "Build your own virtual worlds",
    datetime: "2026-10-10T03:30:00.000Z",
    picture: "posters/event_5.webp",
    remotePicture: "https://cdn.tathva.org/events/bd54731e-25a6-4a7f-8e14-63fea27cc320.webp",
    committee: "Workshop Committe",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 19,
    type: 'workshops',
    heading: 'UI/UX',
    price: 999,
    published: false,
    ticketId: 3306,
    description: "Bridge the gap between human behavior and digital product design with an intensive, hands-on UI/UX workshop. Great digital products don't just look good—they feel intuitive and solve real user problems. This session guides you through the full product design pipeline, from conducting user research and mapping user flows to designing visual interfaces and prototyping interactive experiences.",
    catchyPara: "Design intuitive digital products",
    datetime: "2026-10-09T03:30:00.000Z",
    picture: "posters/event_19.webp",
    remotePicture: "https://cdn.tathva.org/events/4bf1c894-b8d2-42bf-97f8-36d72fcfc8d8.webp",
    committee: "Workshop committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 18,
    type: 'workshops',
    heading: 'Data Mining',
    price: 999,
    published: false,
    ticketId: 3305,
    description: "Turn vast volumes of raw data into valuable knowledge with an intensive, hands-on workshop in data mining. In today's information-rich environment, simply storing data isn't enough. This session equips you with the foundational algorithms, pattern discovery techniques, and analytical tools needed to extract meaningful trends, detect anomalies, and uncover structural relationships hidden within complex datasets.",
    catchyPara: "Extract intelligence from massive datasets",
    datetime: "2026-10-09T03:30:00.000Z",
    picture: "posters/event_18.webp",
    remotePicture: "https://cdn.tathva.org/events/c347d96c-8b81-48f0-b5dd-0ba1a7b55d89.webp",
    committee: "Workshop committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 20,
    type: 'workshops',
    heading: 'Full Stack Development',
    price: 999,
    published: false,
    ticketId: 3307,
    description: "Connect every layer of web development in this intensive, hands-on full stack workshop. Building modern applications requires seamless communication between the user interface, backend server logic, and database storage. This session walks you through the complete development lifecycle, equipping you to architect, code, and deploy scalable, end-to-end web applications from scratch.",
    catchyPara: "Architect scalable end-to-end web apps",
    datetime: "2026-10-09T03:30:00.000Z",
    picture: "posters/event_20.webp",
    remotePicture: "https://cdn.tathva.org/events/00dbca7d-39a5-4e13-bb7f-97e9dc81efc3.webp",
    committee: "Workshop committee",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 21,
    type: 'workshops',
    heading: 'EV',
    price: 999,
    published: false,
    ticketId: 3308,
    description: "Dive into the heart of the automotive revolution with an intensive, hands-on Electric Vehicle workshop. As the global transition toward sustainable mobility accelerates, understanding the core engineering, powertrains, and energy storage systems behind modern EVs is essential. This session bridges the gap between mechanical and electrical systems, providing a complete breakdown of EV architecture, high-voltage safety, battery management, and motor control.",
    catchyPara: "Electric Vehicle architecture & motor control",
    datetime: "2026-10-09T03:30:00.000Z",
    picture: "posters/event_21.webp",
    remotePicture: "https://cdn.tathva.org/events/db542787-3277-4b1d-9a96-8e7cb99199de.webp",
    committee: "Workshop Committe",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },
  {
    id: 17,
    type: 'workshops',
    heading: 'Data Science With AI',
    price: 999,
    published: false,
    ticketId: 3303,
    description: "Discover how Artificial Intelligence is transforming modern data science in this intensive, hands-on workshop. Moving beyond traditional data analysis, this session teaches you how to leverage AI-driven automation, advanced machine learning, and Generative AI models to analyze complex datasets, build predictive systems, and extract deeper insights faster.",
    catchyPara: "Understand how the Brain of AI works",
    datetime: "2026-10-10T03:30:00.000Z",
    picture: "posters/event_17.webp",
    remotePicture: "https://cdn.tathva.org/events/05a2a161-e852-44ac-9600-dbbbb1fec395.webp",
    committee: "Workshop Committe",
    venueName: "East Campus Lecture Hall Complex (ECLC)",
    venueLocation: "NIT Calicut"
  },

  // --- COMPETITIONS (YUKTHI X'26 Official) ---
  {
    id: 6,
    type: 'competitions',
    heading: 'ROBOWARS 8KG',
    price: 1799,
    published: true,
    ticketId: 3294,
    description: "Welcome to the warzone- where the latest technology is programmed into a lean, mean killing machine. Robowars is YUKTHI X'26's epic battle of the bots, which simulates engineering problems in a combat for survival.\nParticipants must work in teams of up to 4 people, to maneuver a robot as it fights a death match in the arena. Select weapons may be used to damage or immobilize the opponent’s bot. May the best bot win.",
    catchyPara: "Heavyweight bot combat in a purpose-built arena.",
    datetime: "2026-10-09T06:30:00.000Z",
    picture: "posters/event_6.webp",
    remotePicture: "https://cdn.tathva.org/events/87943b01-971d-4bd1-bc64-22c8e0f94d74.webp",
    committee: "Program Committee",
    venueName: "OAT",
    venueLocation: "NITC Main Campus"
  },
  {
    id: 7,
    type: 'competitions',
    heading: 'RoboWars 15KG',
    price: 1999,
    published: true,
    ticketId: 3295,
    description: "Welcome to the warzone- where the latest technology is programmed into a lean, mean killing machine. Robowars is YUKTHI X'26's epic battle of the bots, which simulates engineering problems in a combat for survival.\nParticipants must work in teams of up to 4 people, to maneuver a robot as it fights a death match in the arena. Select weapons may be used to damage or immobilize the opponent’s bot. May the best bot win.",
    catchyPara: "15KG Combat Bot Showdown",
    datetime: "2026-10-09T06:30:00.000Z",
    picture: "posters/event_7.webp",
    remotePicture: "https://cdn.tathva.org/events/733bc895-b519-474d-b21b-5755bdc25ca1.webp",
    committee: "Program Committee",
    venueName: "OAT",
    venueLocation: "NITC Main Campus"
  },
  {
    id: 10,
    type: 'competitions',
    heading: 'tRACERcon',
    price: 299,
    published: true,
    ticketId: 3297,
    description: "tRACERcon is an autonomous line-following robot challenge where teams compete to navigate complex tracks featuring slopes, sharp turns, tunnels, inverted sections, and discontinuous paths as quickly and accurately as possible.",
    catchyPara: "High-speed autonomous line-following",
    datetime: "2026-10-10T03:30:00.000Z",
    picture: "posters/event_10.webp",
    remotePicture: "https://cdn.tathva.org/events/d0855097-dbf1-45be-a7ca-9e861ea93bdd.webp",
    committee: "Program Committee",
    venueName: "ABC Hall",
    venueLocation: "Ground Floor"
  },
  {
    id: 11,
    type: 'competitions',
    heading: 'NEON SOCCER',
    price: 299,
    published: true,
    ticketId: 3298,
    description: "NEON SOCCER is a 1v1 robotic football competition where two teams control robots and compete to score goals. The twist: the arena colour changes every 20 seconds, determining which team is allowed to score.",
    catchyPara: "1v1 robotic football with neon illumination",
    datetime: "2026-10-10T03:30:00.000Z",
    picture: "posters/event_11.webp",
    remotePicture: "https://cdn.tathva.org/events/70bb00e4-3cfa-41eb-833d-eca5b85f6843.webp",
    committee: "Program Committee",
    venueName: "ABC Hall",
    venueLocation: "First Floor"
  },
  {
    id: 12,
    type: 'competitions',
    heading: 'MAZE QUEST',
    price: 299,
    published: true,
    ticketId: 3299,
    description: "Maze Quest is a high-speed autonomous robotics challenge where teams navigate a continuous maze track as quickly and accurately as possible while avoiding wall contact.",
    catchyPara: "Navigate the unknown labyrinth",
    datetime: "2026-10-09T03:30:00.000Z",
    picture: "posters/event_12.webp",
    remotePicture: "https://cdn.tathva.org/events/c49c82cf-9037-4c55-9a89-a49726596c98.webp",
    committee: "Program Committee",
    venueName: "ABC Hall",
    venueLocation: "Ground Floor"
  },
  {
    id: 13,
    type: 'competitions',
    heading: 'PLATINUM PASS',
    price: 3299,
    published: true,
    ticketId: 3300,
    description: "ROBOWARS\nBots. Battles. No mercy.\n\nCustom-built combat robots. Head-to-head knockouts. Weapons, armor, and pure engineering grit — all inside a reinforced arena built for war.\n\n8KG and 15KG Combined Entry.\nTeams of up to 4 · May the best bot win.",
    catchyPara: "Platinum All-Access Robot Pass",
    datetime: "2026-10-08T18:30:00.000Z",
    picture: "posters/event_13.webp",
    remotePicture: "https://cdn.tathva.org/events/067bc394-3448-41ec-8ea4-ab6c27b33eb9.webp",
    committee: "Program Committee",
    venueName: "NIT Calicut Main Campus",
    venueLocation: "NITC"
  },
  {
    id: 14,
    type: 'competitions',
    heading: 'DIAMOND PASS',
    price: 3599,
    published: true,
    ticketId: 3301,
    description: "ROBOTICS + ROBOWARS\nOne pass. Every arena. Total warzone access.\nIncludes Maze Quest, Neon Soccer, tRACERcon, and Robowars (8KG & 15KG).",
    catchyPara: "All-in pass for every robotics arena",
    datetime: "2026-10-08T18:30:00.000Z",
    picture: "posters/event_14.webp",
    remotePicture: "https://cdn.tathva.org/events/d5cb81ae-58ec-4b0a-bc94-7656c2f34acf.webp",
    committee: "Program Committee",
    venueName: "NIT Calicut Main Campus",
    venueLocation: "NITC"
  },
  {
    id: 16,
    type: 'competitions',
    heading: 'GOLD PASS',
    price: 599,
    published: true,
    ticketId: 3302,
    description: "GOLD PASS\nROBOTICS\nBuild it. Code it. Battle it.\nThree arenas, one pass: Maze Quest, Neon Soccer, and tRACERcon.",
    catchyPara: "Access to Maze Quest, Neon Soccer & tRACERcon",
    datetime: "2026-10-09T18:30:00.000Z",
    picture: "posters/event_16.webp",
    remotePicture: "https://cdn.tathva.org/events/a237170a-ff4b-4c31-8b0b-bf2d2c155d50.webp",
    committee: "Program Committe",
    venueName: "NIT Calicut Main Campus",
    venueLocation: "NITC"
  },

  // --- PRE-TATHVA COMPETITIONS (GPC) ---
  {
    id: 101,
    type: 'competitions',
    heading: 'Battle of Bands',
    price: 200,
    published: true,
    ticketId: 9001,
    description: "Original music, 20 minutes on stage, judged live by renowned musicians.",
    catchyPara: "Bring the thunder to Open Air Theatre.",
    datetime: "2026-10-03T19:00:00+05:30",
    picture: "posters/event_6.webp",
    remotePicture: "https://cdn.tathva.org/events/87943b01-971d-4bd1-bc64-22c8e0f94d74.webp",
    committee: "GPC",
    venueName: "Open Air Theatre (OAT)",
    venueLocation: "NITC Main Campus"
  },
  {
    id: 102,
    type: 'competitions',
    heading: 'Dance Off',
    price: 100,
    published: true,
    ticketId: 9002,
    description: "Solo and crew dance showdown. All street, classical, and contemporary styles welcome.",
    catchyPara: "Own the spotlight and ignite the stage.",
    datetime: "2026-10-04T17:00:00+05:30",
    picture: "posters/event_10.webp",
    remotePicture: "https://cdn.tathva.org/events/d0855097-dbf1-45be-a7ca-9e861ea93bdd.webp",
    committee: "GPC",
    venueName: "Architecture Auditorium",
    venueLocation: "NITC Main Campus"
  },
  {
    id: 103,
    type: 'competitions',
    heading: 'Treasure Hunt',
    price: 0,
    published: true,
    ticketId: 9003,
    description: "Cryptic clues hidden across NIT Calicut campus. Speed, wits, and collaboration are essential.",
    catchyPara: "Decipher the enigmas across campus.",
    datetime: "2026-10-02T16:00:00+05:30",
    picture: "posters/event_12.webp",
    remotePicture: "https://cdn.tathva.org/events/c49c82cf-9037-4c55-9a89-a49726596c98.webp",
    committee: "GPC",
    venueName: "Student Activity Centre (SAC)",
    venueLocation: "NITC Main Campus"
  }
];

// ==========================================
// 2. STARFIELD & COSMIC CANVAS COMPONENT
// ==========================================
const StarfieldCanvas = ({ isLowPower }) => {
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

    // 200 Warp stars
    const warpStars = Array.from({ length: 200 }, () => ({
      x: (Math.random() - 0.5) * 2500,
      y: (Math.random() - 0.5) * 2500,
      z: 2000 * Math.random(),
      baseRadius: 1.8 * Math.random() + 0.8,
      opacity: 0.8 * Math.random() + 0.2
    }));

    // 400 Twinkling stars
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
        if (s.opacity >= 1) { s.opacity = 1; s.twinkleDir = -1; }
        else if (s.opacity <= 0.1) { s.opacity = 0.1; s.twinkleDir = 1; }

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
};

// ==========================================
// 3. EVENT CARD COMPONENT (Classic Grid for Competitions)
// ==========================================
const EventCard = ({ event, onSelect }) => {
  const isClosed = !event.published;
  const priceText = event.price > 0 ? `₹${event.price}` : 'Free';
  const venueText = event.venueName || 'NIT Calicut Main Campus';
  const imgSrc = event.picture || 'posters/event_6.webp';

  return (
    <div
      className={`event-card ${isClosed ? 'closed' : ''}`}
      onClick={() => onSelect(event)}
    >
      <div className="poster-frame">
        {isClosed && (
          <div className="booking-full-overlay" aria-label="Booking full">
            <div className="booking-full-backdrop"></div>
            <div className="booking-full-banner">
              <div className="booking-full-bar left"></div>
              <div className="booking-full-bar right"></div>
              <span className="booking-full-text">BOOKING FULL</span>
            </div>
          </div>
        )}
        <img
          className="poster-img"
          src={imgSrc}
          alt={event.heading}
          loading="lazy"
          onError={(e) => {
            if (event.remotePicture) e.target.src = event.remotePicture;
          }}
        />
      </div>

      <div className="card-divider-line"></div>

      <div className="card-title-row">
        <h3 className="card-heading">{event.heading}</h3>
        <span className="arrow-icon-wrapper">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>

      <div className="card-desc-box">{event.description}</div>
      <div className="card-venue-box">{venueText}</div>

      <div className="card-price-row">
        <span className="price-val">{priceText}</span>
        <span className="extra-bullet">·</span>
        <span className="venue-info">{event.committee || (event.type === 'workshops' ? 'Workshop' : 'Event')}</span>
      </div>
    </div>
  );
};

// ==========================================
// 3.5 YUKTHI X'26 HOLOGRAPHIC HUD WORKSHOPS GRID COMPONENT
// ==========================================
const CIPHER_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_-+=<>/\\|[]{}";
const getCipherChar = () => CIPHER_CHARSET[Math.floor(Math.random() * CIPHER_CHARSET.length)];

const generateCipherThresholds = (len) => {
  const arr = new Array(len);
  for (let i = 0; i < len; i++) {
    const n = len > 1 ? i / (len - 1) : 0;
    arr[i] = Math.min(0.72 * n + 0.28 * Math.random(), 1);
  }
  return arr;
};

const formatWorkshopDate = (dt) => {
  if (!dt) return "11 October 2026";
  try {
    return new Date(dt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata"
    });
  } catch (e) {
    return "11 October 2026";
  }
};

const WorkshopsGrid = ({ workshops, onSelect }) => {
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const [activeId, setActiveId] = useState(null);
  const [tilts, setTilts] = useState({});
  const [firingRipples, setFiringRipples] = useState({});
  const [hudState, setHudState] = useState({
    visible: false,
    x: 0,
    y: 0,
    side: 'right',
    pathD: '',
    pathLength: 300,
    event: null
  });

  const [decryptedText, setDecryptedText] = useState({
    title: '',
    meta: '',
    desc: '',
    price: ''
  });

  const animFrameRef = useRef(null);

  // Authenticate & Scramble Typewriter effect
  useEffect(() => {
    if (!activeId) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setHudState(prev => ({ ...prev, visible: false }));
      return;
    }

    const event = workshops.find(w => w.id === activeId);
    if (!event) return;

    const fullTitle = (event.heading || 'UNTITLED').toUpperCase();
    const fullMeta = `${formatWorkshopDate(event.datetime)}${event.time ? ' · ' + event.time : ''}${event.venueName ? ' · ' + event.venueName : ''}`;
    const fullDesc = event.description || 'No description available';
    const fullPrice = event.price > 0 ? `₹${event.price}` : 'Free';

    const thTitle = generateCipherThresholds(fullTitle.length);
    const thMeta = generateCipherThresholds(fullMeta.length);
    const thDesc = generateCipherThresholds(fullDesc.length);
    const thPrice = generateCipherThresholds(fullPrice.length);

    const startTime = performance.now();

    const updateFrame = (now) => {
      const elapsed = now - startTime;

      const pTitle = Math.min(Math.max((elapsed - 0) / 360, 0), 1);
      const pMeta = Math.min(Math.max((elapsed - 80) / 360, 0), 1);
      const pDesc = Math.min(Math.max((elapsed - 150) / 480, 0), 1);
      const pPrice = Math.min(Math.max((elapsed - 240) / 280, 0), 1);

      const cipherTransform = (str, ths, p) => {
        if (p >= 1) return str;
        let res = '';
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          if (char === ' ' || char === '·' || char === '(' || char === ')' || p >= ths[i]) {
            res += char;
          } else {
            res += getCipherChar();
          }
        }
        return res;
      };

      setDecryptedText({
        title: cipherTransform(fullTitle, thTitle, pTitle),
        meta: cipherTransform(fullMeta, thMeta, pMeta),
        desc: cipherTransform(fullDesc, thDesc, pDesc),
        price: cipherTransform(fullPrice, thPrice, pPrice)
      });

      if (pPrice < 1 || pDesc < 1) {
        animFrameRef.current = requestAnimationFrame(updateFrame);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeId, workshops]);

  // Position HUD and draw SVG laser connector line
  const calculateHudPosition = (id) => {
    const container = containerRef.current;
    const card = cardRefs.current[id];
    if (!container || !card) return;

    const contRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const event = workshops.find(w => w.id === id);
    if (!event) return;

    const spaceRight = window.innerWidth - cardRect.right;
    const spaceLeft = cardRect.left;
    const side = spaceRight >= 350 ? 'right' : (spaceLeft >= 350 ? 'left' : (spaceRight >= spaceLeft ? 'right' : 'left'));

    const cardRelLeft = cardRect.left - contRect.left;
    const cardRelTop = cardRect.top - contRect.top;
    const cardRelRight = cardRect.right - contRect.left;

    const anchorX = side === 'right' ? cardRelRight : cardRelLeft;
    const anchorY = cardRelTop + cardRect.height * 0.28;

    const isMobile = window.innerWidth < 640;
    let hudX = side === 'right' ? cardRelRight + 26 : cardRelLeft - 380 - 26;
    let hudY = cardRelTop + 22;

    if (isMobile) {
      hudX = 14;
      hudY = cardRelTop + cardRect.height * 0.44;
    }

    const cornerX = side === 'right' ? anchorX + 18 : anchorX - 18;
    const labelX = side === 'right' ? hudX : hudX + 380;
    const labelY = hudY + 14;

    const pathD = isMobile
      ? `M ${anchorX} ${anchorY} L ${hudX + 20} ${labelY}`
      : `M ${anchorX} ${anchorY} L ${cornerX} ${anchorY} L ${cornerX} ${labelY} L ${labelX} ${labelY}`;

    const approxLength = isMobile ? 120 : (Math.abs(cornerX - anchorX) + Math.abs(labelY - anchorY) + Math.abs(labelX - cornerX));

    setHudState({
      visible: true,
      x: hudX,
      y: hudY,
      side,
      pathD,
      pathLength: Math.max(approxLength, 200),
      event
    });
  };

  const handleMouseEnter = (e, id) => {
    setActiveId(id);
    calculateHudPosition(id);

    const card = cardRefs.current[id];
    if (card) {
      const rect = card.getBoundingClientRect();
      const xPct = Math.min(Math.max((e.clientX - rect.left) / rect.width * 100, 0), 100);
      const yPct = Math.min(Math.max((e.clientY - rect.top) / rect.height * 100, 0), 100);
      setFiringRipples(prev => ({
        ...prev,
        [id]: { x: xPct, y: yPct, active: true }
      }));
    }
  };

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = Math.max(-0.5, Math.min(0.5, normX));
    const tiltY = Math.max(-0.5, Math.min(0.5, normY));

    setTilts(prev => ({
      ...prev,
      [id]: {
        x: tiltX * 22,
        y: tiltY * 22,
        rotX: -tiltY * 9,
        rotY: tiltX * 9,
        pulseX: (normX + 0.5) * 100,
        pulseY: (normY + 0.5) * 100
      }
    }));
  };

  const handleMouseLeave = (id) => {
    if (activeId === id) {
      setActiveId(null);
    }
    setTilts(prev => ({
      ...prev,
      [id]: { x: 0, y: 0, rotX: 0, rotY: 0, pulseX: 50, pulseY: 50 }
    }));
  };

  // Touch device handler (Mobile & Tablet)
  const handleTouch = (e, event) => {
    if (activeId === event.id) {
      onSelect(event);
      return;
    }
    setActiveId(event.id);
    calculateHudPosition(event.id);

    const card = cardRefs.current[event.id];
    if (card) {
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const xPct = touch ? Math.min(Math.max((touch.clientX - rect.left) / rect.width * 100, 0), 100) : 50;
      const yPct = touch ? Math.min(Math.max((touch.clientY - rect.top) / rect.height * 100, 0), 100) : 50;
      setFiringRipples(prev => ({
        ...prev,
        [event.id]: { x: xPct, y: yPct, active: true }
      }));
    }
  };

  return (
    <div ref={containerRef} className="workshops-container-wrapper">
      {/* Background Focus Dimmer */}
      <div className={`workshop-focus-overlay ${activeId ? 'active' : ''}`} />

      {/* SVG Laser Connector Line */}
      {hudState.visible && (
        <svg className="workshop-connector-svg" aria-hidden="true">
          <path
            d={hudState.pathD}
            className="workshop-connector-line"
            style={{
              strokeDasharray: hudState.pathLength,
              strokeDashoffset: 0
            }}
          />
        </svg>
      )}

      {/* Floating Hologram HUD Inspection Panel */}
      {hudState.visible && hudState.event && (
        <div
          className={`workshop-hud-panel visible align-${hudState.side}`}
          style={{
            left: `${hudState.x}px`,
            top: `${hudState.y}px`
          }}
        >
          <div className="workshop-hud-title">
            {decryptedText.title}
          </div>
          <div className="workshop-hud-meta">
            {decryptedText.meta}
          </div>
          <div className="workshop-hud-desc">
            {decryptedText.desc}
          </div>
          <div className="workshop-hud-price">
            <span>{decryptedText.price}</span>
            <button
              className="workshop-hud-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(hudState.event);
              }}
            >
              <span>{hudState.event.published ? 'Register' : 'View Details'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Grid of Workshop Cards */}
      <div className="workshops-grid">
        {workshops.map((ev) => {
          const isActive = activeId === ev.id;
          const isDimmed = activeId !== null && !isActive;
          const tilt = tilts[ev.id] || { x: 0, y: 0, rotX: 0, rotY: 0, pulseX: 50, pulseY: 50 };
          const ripple = firingRipples[ev.id] || { x: 50, y: 50, active: false };
          const isClosed = !ev.published;

          const transformStyle = isActive
            ? `perspective(1000px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) translate3d(${tilt.x}px, ${tilt.y}px, 18px) scale3d(1.07, 1.07, 1.07)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale3d(1, 1, 1)';

          return (
            <div
              key={ev.id}
              ref={(el) => { if (el) cardRefs.current[ev.id] = el; }}
              className={`workshop-card ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
              style={{ transform: transformStyle }}
              onMouseEnter={(e) => handleMouseEnter(e, ev.id)}
              onMouseMove={(e) => handleMouseMove(e, ev.id)}
              onMouseLeave={() => handleMouseLeave(ev.id)}
              onTouchStart={(e) => handleTouch(e, ev)}
              onClick={() => onSelect(ev)}
            >
              <div className="poster-frame">
                {isClosed && (
                  <div className="booking-full-overlay" aria-label="Booking full">
                    <div className="booking-full-backdrop"></div>
                    <div className="booking-full-banner">
                      <div className="booking-full-bar left"></div>
                      <div className="booking-full-bar right"></div>
                      <span className="booking-full-text">BOOKING FULL</span>
                    </div>
                  </div>
                )}

                {/* Pulse Radial Overlay */}
                <div
                  className="workshop-pulse-overlay"
                  style={{
                    '--pulse-x': tilt.pulseX,
                    '--pulse-y': tilt.pulseY
                  }}
                  aria-hidden="true"
                />

                {/* Activation Radar Ripple */}
                <div
                  className={`workshop-activation-overlay ${ripple.active ? 'firing' : ''}`}
                  style={{
                    '--activation-x': `${ripple.x}%`,
                    '--activation-y': `${ripple.y}%`
                  }}
                  aria-hidden="true"
                />

                <img
                  className="poster-img"
                  src={ev.picture || `posters/event_${ev.id}.webp`}
                  alt={ev.heading}
                  loading="lazy"
                  onError={(e) => {
                    if (ev.remotePicture) e.target.src = ev.remotePicture;
                  }}
                />
              </div>

              {/* Static Info for small touch screens when card is idle */}
              <div className="workshop-static-info">
                <div style={{ fontWeight: 600, fontSize: '1rem', color: '#ffffff' }}>
                  {ev.heading}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginTop: '4px', fontFamily: 'monospace' }}>
                  {formatWorkshopDate(ev.datetime)} {ev.venueName ? `· ${ev.venueName}` : ''}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600, marginTop: '6px', fontFamily: 'monospace' }}>
                  {ev.price > 0 ? `₹${ev.price}` : 'Free'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3.6 YUKTHI X'26 WORKSHOP DETAIL PAGE COMPONENT
// ==========================================
const WorkshopDetailPage = ({ workshop, onBack, onRegister }) => {
  if (!workshop) return null;

  const dateStr = formatWorkshopDate(workshop.datetime);
  const timeStr = workshop.time || "9:00 am";
  const venueStr = workshop.venueName
    ? `${workshop.venueName}, NIT`
    : "East Campus Lecture Hall Complex (ECLC), NIT";
  const priceStr = workshop.price > 0 ? `₹${workshop.price}` : "Free";
  const imgSrc = workshop.picture || `posters/event_${workshop.id}.webp`;

  return (
    <div className="workshop-detail-container">
      <div className="workshop-detail-inner">
        {/* Breadcrumb & Title */}
        <div className="workshop-detail-header">
          <button
            className="workshop-back-btn"
            onClick={onBack}
            aria-label="Back to Workshops"
          >
            ← Back to Workshops
          </button>
          <h1 className="workshop-detail-title pp-fragment">
            {workshop.heading}
          </h1>
        </div>

        {/* 2-Column Content Grid */}
        <div className="workshop-detail-grid">
          {/* Left: Poster Image Frame */}
          <div className="workshop-poster-column">
            <div className="workshop-poster-box">
              <img
                src={imgSrc}
                alt={workshop.heading}
                className="workshop-poster-image"
                onError={(e) => {
                  if (workshop.remotePicture) e.target.src = workshop.remotePicture;
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
            <div className="workshop-detail-desc">
              {workshop.description}
            </div>

            {/* Action Button */}
            <div className="workshop-action-row">
              <button
                className="workshop-register-btn"
                onClick={() => onRegister(workshop)}
              >
                {workshop.published ? "Login to Register" : "Booking Full"}
              </button>
            </div>

            {/* Profile Note & Refund Policy */}
            <p className="workshop-profile-note">
              Note - Ticket details are automatically taken from your profile. You can update them on the{" "}
              <span className="profile-link" onClick={() => onRegister(workshop)}>
                profile page
              </span>
            </p>
            <p className="workshop-refund-policy">
              Refund Policy - All tickets are non-refundable and non-transferable except in the case of event cancellation or technical issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3.7 COUNTDOWN TIMER COMPONENT (Monocraft)
// ==========================================
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: '06', hours: '20', mins: '43', secs: '25' });

  useEffect(() => {
    // Target date: October 9, 2026
    const target = new Date('2026-10-09T09:00:00+05:30').getTime();

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

// ==========================================
// 3.8 TECHKRITI '26 RADAR DIAL SUMMITS SHOWCASE
// Replaces old showcase with exact interactive radar dial animation
// Features: Mouse motion tracking, auto-advance timer, 3D tilt, smooth dial rotation
// ==========================================
const TECHKRITI_SUMMITS = [
  {
    id: 'tech-summit',
    index: '01',
    name: 'TECH SUMMIT',
    brief: 'Engineering the future through disruptive innovations.',
    image: 'https://2026.techkriti.org/images/summits/tech-summit.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
    category: 'DISRUPTIVE INNOVATION',
    route: 'workshops'
  },
  {
    id: 'ai-summit',
    index: '02',
    name: 'AI SUMMIT',
    brief: 'Exploring the frontiers of artificial intelligence and machine learning.',
    image: 'https://2026.techkriti.org/images/summits/ai-summit.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80',
    category: 'MACHINE LEARNING & GENAI',
    route: 'competitions'
  },
  {
    id: 'rakshakriti',
    index: '03',
    name: 'RAKSHAKRITI',
    brief: 'Strengthening national security through indigenous defense technology.',
    image: 'https://2026.techkriti.org/images/summits/rakshakriti.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    category: 'DEFENSE & AEROSPACE',
    route: 'workshops'
  },
  {
    id: 'medtech',
    index: '04',
    name: 'MEDTECH',
    brief: 'Revolutionizing healthcare with advanced medical engineering.',
    image: 'https://2026.techkriti.org/images/summits/medtech.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    category: 'BIOMEDICAL ENGINEERING',
    route: 'competitions'
  },
  {
    id: 'space',
    index: '05',
    name: 'SPACE',
    brief: 'Scaling new heights in aerospace and interplanetary exploration.',
    image: 'https://2026.techkriti.org/images/summits/space.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1000&q=80',
    category: 'ASTRONOMY & ROCKETRY',
    route: 'workshops'
  },
  {
    id: 'e-conclave',
    index: '06',
    name: 'E - CONCLAVE',
    brief: "Igniting the entrepreneurial spirit of tomorrow's leaders.",
    image: 'https://2026.techkriti.org/images/summits/e-conclave.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1000&q=80',
    category: 'VENTURE & STARTUPS',
    route: 'lectures'
  },
  {
    id: 'sustainability',
    index: '07',
    name: 'SUSTAINABILITY',
    brief: 'Crafting eco-friendly solutions for a greener planet.',
    image: 'https://2026.techkriti.org/images/summits/sustainability.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=80',
    category: 'CLEANTECH & CLIMATE',
    route: 'workshops'
  },
  {
    id: 'industry-4-0',
    index: '08',
    name: 'INDUSTRY 4.0',
    brief: 'Mastering the smart manufacturing and automation revolution.',
    image: 'https://2026.techkriti.org/images/summits/industry-4-0.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    category: 'SMART AUTOMATION',
    route: 'competitions'
  },
  {
    id: 'women-panel',
    index: '09',
    name: 'WOMEN PANEL',
    brief: 'Celebrating and empowering women leaders in the tech ecosystem.',
    image: 'https://2026.techkriti.org/images/summits/women-panel.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
    category: 'WOMEN IN TECH',
    route: 'lectures'
  },
  {
    id: 'vision-360',
    index: '10',
    name: 'VISION 360',
    brief: 'Shaping global policies through multifaceted dialogue.',
    image: 'https://2026.techkriti.org/images/summits/vision-360.webp',
    fallbackImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    category: 'POLICY & DIPLOMACY',
    route: 'lectures'
  }
];

const TechkritiSummitsDialShowcase = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to "02 AI SUMMIT" matching Screenshot 1
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const wheelCooldownRef = useRef(false);
  const touchStartY = useRef(0);

  const currentSummit = TECHKRITI_SUMMITS[activeIndex];

  // Auto-advance timer: moves every 3.8s through the summits unless paused by hover
  useEffect(() => {
    if (isHovered) return;

    const intervalTime = 40; // 40ms tick
    const totalDuration = 3800; // 3.8 seconds per summit
    const step = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => (current + 1) % TECHKRITI_SUMMITS.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isHovered, activeIndex]);

  // Mouse Wheel navigation: scroll naturally through summits when hovering over section
  const handleWheel = useCallback((e) => {
    // Only capture vertical delta
    if (Math.abs(e.deltaY) < 15) return;
    
    // Prevent document scroll only if user is actively wheeling over the widget
    if (wheelCooldownRef.current) return;
    wheelCooldownRef.current = true;
    setTimeout(() => {
      wheelCooldownRef.current = false;
    }, 220);

    if (e.deltaY > 0) {
      setActiveIndex((prev) => (prev + 1) % TECHKRITI_SUMMITS.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + TECHKRITI_SUMMITS.length) % TECHKRITI_SUMMITS.length);
    }
    setProgress(0);
  }, []);

  // Mouse Move: 3D parallax tilt & card glare calculation
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x: normX, y: normY });

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const cardX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
      const cardY = ((e.clientY - cardRect.top) / cardRect.height) * 100;
      cardRef.current.style.setProperty('--mouse-x', `${cardX}%`);
      cardRef.current.style.setProperty('--mouse-y', `${cardY}%`);
    }
  }, []);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev + 1) % TECHKRITI_SUMMITS.length);
      } else {
        setActiveIndex((prev) => (prev - 1 + TECHKRITI_SUMMITS.length) % TECHKRITI_SUMMITS.length);
      }
      setProgress(0);
    }
  };

  // Dial rotation angle: smoothly rotates by -20 deg per summit index
  const dialRotationAngle = -activeIndex * 20 + mousePos.y * 8;

  return (
    <section
      ref={containerRef}
      className="techkriti-summits-section"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Techkriti Summits Showcase"
    >
      {/* Background Cosmic Glows */}
      <div className="techkriti-ambient-glow-left" />
      <div className="techkriti-ambient-glow-right" />

      {/* Main Two-Column Stage */}
      <div className="techkriti-stage-container">
        {/* ================= LEFT SIDE: RADAR DIAL & SUMMIT NAMES WHEEL ================= */}
        <div className="techkriti-dial-side">
          {/* Circular Radar Dial SVG */}
          <div className="techkriti-radar-container">
            <svg
              className="techkriti-radar-svg"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="dialCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
                  <stop offset="50%" stopColor="#b45309" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="dialCoreGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Concentric Amber Radar Rings */}
              <circle cx="300" cy="300" r="280" stroke="rgba(245, 158, 11, 0.22)" strokeWidth="1" />
              <circle cx="300" cy="300" r="235" stroke="rgba(245, 158, 11, 0.16)" strokeWidth="1" />
              <circle cx="300" cy="300" r="185" stroke="rgba(245, 158, 11, 0.12)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="300" cy="300" r="130" stroke="rgba(245, 158, 11, 0.08)" strokeWidth="1" />
              <circle cx="300" cy="300" r="120" fill="url(#dialCenterGlow)" />
              <circle cx="300" cy="300" r="60" fill="url(#dialCoreGlow)" />

              {/* Rotating Compass / Gauge Tick Marks (120 ticks around 360 deg) */}
              <g
                className="dial-ticks-group"
                style={{
                  transform: `rotate(${dialRotationAngle}deg)`
                }}
              >
                {Array.from({ length: 120 }).map((_, i) => {
                  const angle = (i * 360) / 120;
                  const isMajor = i % 10 === 0;
                  const isSemi = i % 5 === 0;
                  const tickLength = isMajor ? 18 : isSemi ? 11 : 6;
                  const r1 = 280;
                  const r2 = r1 - tickLength;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 300 + r1 * Math.cos(rad);
                  const y1 = 300 + r1 * Math.sin(rad);
                  const x2 = 300 + r2 * Math.cos(rad);
                  const y2 = 300 + r2 * Math.sin(rad);
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isMajor ? '#f59e0b' : isSemi ? 'rgba(245, 158, 11, 0.55)' : 'rgba(245, 158, 11, 0.25)'}
                      strokeWidth={isMajor ? 2 : 1}
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Active Reticle Pointer at 3 o'clock: horizontal glowing line + [ 02 ] bracket */}
          <div className="dial-center-pointer">
            <div className="dial-pointer-line" />
            <div className="dial-pointer-bracket">
              <span className="dial-bracket-number">{currentSummit.index}</span>
            </div>
          </div>

          {/* Vertical Scrolling Summit Names Viewport */}
          <div className="summits-list-window">
            <div
              className="summits-list-track"
              style={{
                transform: `translateY(-${activeIndex * 68 + 34}px)`
              }}
            >
              {TECHKRITI_SUMMITS.map((summit, idx) => {
                const isActive = idx === activeIndex;
                const dist = Math.abs(idx - activeIndex);
                const opacity = isActive ? 1 : dist === 1 ? 0.38 : dist === 2 ? 0.16 : 0.04;
                const scale = isActive ? 1.05 : dist === 1 ? 0.94 : 0.88;

                return (
                  <button
                    key={summit.id}
                    className={`summit-name-row ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveIndex(idx);
                      setProgress(0);
                    }}
                    onMouseEnter={() => {
                      setActiveIndex(idx);
                      setProgress(0);
                    }}
                    style={{
                      opacity,
                      transform: `scale(${scale})`
                    }}
                    title={`View ${summit.name}`}
                  >
                    <span className="summit-row-index">{summit.index}</span>
                    <span className="summit-row-title">{summit.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: 3D PARALLAX SHOWCASE CARD ================= */}
        <div className="techkriti-card-side">
          <div
            ref={cardRef}
            className="summit-3d-card-wrapper"
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 14}deg) rotateX(${-mousePos.y * 14}deg)`,
              transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={() => onNavigate(currentSummit.route)}
            title={`Explore ${currentSummit.name}`}
          >
            {/* Summit Background Image with crossfade */}
            <img
              key={currentSummit.id}
              src={currentSummit.image}
              alt={currentSummit.name}
              className="summit-card-bg-image"
              onError={(e) => {
                if (e.target.src !== currentSummit.fallbackImage) {
                  e.target.src = currentSummit.fallbackImage;
                }
              }}
            />

            {/* Specular Glare Layer */}
            <div className="summit-card-glare" />

            {/* Bottom Card Content & Text Overlay */}
            <div className="summit-card-overlay">
              <div className="summit-card-meta">
                <span className="summit-category-pill">{currentSummit.category}</span>
                <span className="summit-index-counter">
                  {currentSummit.index} / {TECHKRITI_SUMMITS.length.toString().padStart(2, '0')}
                </span>
              </div>

              <h3 className="summit-card-title">{currentSummit.name}</h3>
              <p className="summit-card-brief">{currentSummit.brief}</p>

              <div className="summit-card-actions">
                <span className="summit-action-btn">
                  <span>EXPLORE SUMMIT</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>

              {/* Dynamic Auto-Advance Timer Progress Bar */}
              <div
                className="summit-auto-progress-bar"
                title={isHovered ? "Paused on hover" : "Auto-advancing to next summit"}
              >
                <div
                  className="summit-auto-progress-fill"
                  style={{ width: `${isHovered ? 100 : progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Dot Indicators & Mouse Hint */}
      <div className="techkriti-controls-row">
        <div className="summit-dot-indicators" role="tablist" aria-label="Summit Selection">
          {TECHKRITI_SUMMITS.map((summit, idx) => (
            <button
              key={summit.id}
              className={`summit-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => {
                setActiveIndex(idx);
                setProgress(0);
              }}
              title={summit.name}
              aria-label={summit.name}
            />
          ))}
        </div>

        <div className="summit-mouse-hint">
          <span>{isHovered ? 'PAUSED • MOVE MOUSE / SCROLL WHEEL' : 'AUTO-ROTATING • HOVER TO EXPLORE'}</span>
        </div>
      </div>
    </section>
  );
};

// Backward-compatible alias for FeatureShowcase
const FeatureShowcase = TechkritiSummitsDialShowcase;


// ==========================================
// 3.9 TATHVA GALLERY 3D SPIRAL (Exact YUKTHI X'26 Official Implementation)
// ==========================================
const GALLERY_IMAGES = [
  { id: 1, src: '/images/gallery/dodge_drift.jpg', alt: 'Dodge Charger Dirt Drift Stunt' },
  { id: 2, src: '/images/gallery/bike_stunt.jpg', alt: 'Extreme Bike Stunt on Fire' },
  { id: 3, src: '/images/gallery/singer_performance.png', alt: 'Anju Joseph Live Vocal Performance' },
  { id: 4, src: '/images/gallery/mercedes_drift.jpg', alt: 'Vintage Mercedes-Benz Dirt Drift' },
  { id: 5, src: '/images/gallery/glive_singer.png', alt: 'G-Live Pro Stage Solo Vocal Concert' },
  { id: 6, src: '/images/gallery/isro_rocket.jpg', alt: 'ISRO LVM3 Rocket & Space Exhibition' },
  { id: 7, src: '/images/gallery/dignitaries_stage.jpg', alt: 'Fest Inauguration & Dignitaries' },
  { id: 8, src: '/images/gallery/concert_payyanur.png', alt: 'Live Pro Concert Performance' }
];

const clampVal = (val, min, max) => Math.min(Math.max(val, min), max);
const smoothstepVal = (min, max, val) => {
  const a = clampVal((val - min) / (max - min || 1), 0, 1);
  return a * a * (3 - 2 * a);
};

/**
 * Exact 3D Infinite Spiral Component from YUKTHI X'26 (cardWidth: 400, cardHeight: 520, radius: 350)
 */
function InfiniteSpiral({
  items = [],
  speed = 0.5,
  direction = "up",
  animationMode = "all",
  radius = 350,
  cardWidth = 400,
  cardHeight = 520,
  verticalSpacing = 200,
  perspective = 1000,
  cardsPerTurn = 3.5,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = "contain"
}) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const currentScroll = useRef(0);
  const targetScroll = useRef(0);
  const velocity = useRef(0);
  const isHovered = useRef(false);
  const isIntersecting = useRef(true);
  const isDragging = useRef(false);
  const lastY = useRef(0);
  const hasMoved = useRef(false);

  const formattedItems = useMemo(
    () => items.map((item, i) => (typeof item === 'string' ? { src: item, alt: `Spiral image ${i + 1}` } : { alt: `Spiral image ${i + 1}`, ...item })),
    [items]
  );

  useEffect(() => {
    let animId;
    const container = containerRef.current;
    if (!container || formattedItems.length === 0) return;

    let lastTime = performance.now();
    let containerRect = container.getBoundingClientRect();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const respondsToScroll = animationMode === 'scroll' || animationMode === 'all';
    const speedMultiplier = Math.max(speed, 0) / 0.55;
    let lastScrollY = window.scrollY;

    const resizeObserver = new ResizeObserver(() => {
      containerRect = container.getBoundingClientRect();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting.current = entry.isIntersecting;
    }, { threshold: 0.02 });
    intersectionObserver.observe(container);

    const handleWindowScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      if (respondsToScroll && isIntersecting.current && deltaY !== 0) {
        targetScroll.current += clampVal((deltaY * speedMultiplier) / Math.max(2 * verticalSpacing, 1), -1.5, 1.5);
      }
    };
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    const animateLoop = (now) => {
      const deltaSec = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const allowsAuto = animationMode === 'auto' || animationMode === 'all';
      const isPaused = isDragging.current || (pauseOnHover && isHovered.current);
      const dirMultiplier = direction === 'down' ? -1 : 1;
      const desiredVelocity = allowsAuto && isIntersecting.current && !prefersReducedMotion.matches && !isPaused
        ? speed * dirMultiplier
        : 0;

      const smoothFactor = 1 - Math.exp(-7 * deltaSec);
      velocity.current += (desiredVelocity - velocity.current) * smoothFactor;
      targetScroll.current += velocity.current * deltaSec;

      const lerpFactor = 1 - Math.exp(-deltaSec * (isDragging.current ? 22 : 11));
      currentScroll.current += (targetScroll.current - currentScroll.current) * lerpFactor;

      const totalCards = formattedItems.length;
      const halfTotal = totalCards / 2;
      const viewportW = Math.max(containerRect.width, 1);
      const scaleFactor = Math.min(
        1,
        viewportW / (2.8 * cardWidth),
        Math.max(containerRect.height, 1) / (2.35 * cardHeight)
      );
      const actualRadius = Math.min(radius, Math.max(72, 0.36 * viewportW)) * scaleFactor;
      const fadeThreshold = clampVal(1 - edgeFade, 0, 0.98);
      const actualCardsPerTurn = Math.max(cardsPerTurn, 1);

      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        let offset = index - currentScroll.current;
        let wrappedOffset = ((offset + halfTotal) % totalCards + totalCards) % totalCards - halfTotal;
        const normalizedDist = Math.min(Math.abs(wrappedOffset) / Math.max(halfTotal, 1), 1);
        const opacity = 1 - smoothstepVal(fadeThreshold, 1, normalizedDist);
        const centerDist = 1 - Math.min(Math.abs(wrappedOffset) / Math.max(0.65 * actualCardsPerTurn, 1), 1);
        const grayscaleAmount = smoothstepVal(0, 1, Math.min(Math.abs(wrappedOffset) / 1.2, 1));
        const baseScale = (1 + (centerScale - 1) * centerDist) * scaleFactor;
        const angle = ((360 / actualCardsPerTurn) * wrappedOffset + rotation) * (Math.PI / 180);
        const xPos = Math.sin(angle) * actualRadius;
        const zPos = Math.cos(angle) * actualRadius;
        const perspectiveScale = clampVal(perspective / Math.max(perspective - zPos, 1), 0.72, 1.45);
        const depthNormalized = (zPos / Math.max(actualRadius, 1) + 1) / 2;
        const blurAmount = edgeBlur * smoothstepVal(0.35, 1, normalizedDist);

        const filters = [];
        if (blurAmount > 0.01) filters.push(`blur(${blurAmount.toFixed(2)}px)`);
        if (grayscaleAmount > 0.01) filters.push(`grayscale(${Math.round(100 * grayscaleAmount)}%)`);

        el.style.transform = `translate(-50%, -50%) translate3d(${xPos}px, ${wrappedOffset * verticalSpacing * scaleFactor}px, 0) rotateZ(${cardTilt}deg) scale(${baseScale * perspectiveScale})`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = filters.length > 0 ? filters.join(' ') : 'none';
        el.style.zIndex = String(Math.round(100000 * depthNormalized) + index);
        el.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none';
      });

      animId = requestAnimationFrame(animateLoop);
    };

    animId = requestAnimationFrame(animateLoop);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [formattedItems, speed, direction, animationMode, radius, perspective, cardWidth, cardHeight, verticalSpacing, cardsPerTurn, rotation, cardTilt, centerScale, edgeFade, edgeBlur, pauseOnHover]);

  const allowsDrag = animationMode === 'drag' || animationMode === 'all';

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      if (e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
      e.currentTarget.style.cursor = allowsDrag ? 'grab' : 'default';
    }
  };

  return (
    <div
      ref={containerRef}
      className="infinite-spiral"
      style={{
        perspective: `${perspective}px`,
        '--infinite-spiral-card-width': `${cardWidth}px`,
        '--infinite-spiral-card-height': `${cardHeight}px`,
        '--infinite-spiral-card-radius': `${cardRadius}px`,
        cursor: allowsDrag ? 'grab' : 'default',
        touchAction: allowsDrag ? 'pan-x' : 'auto',
        userSelect: allowsDrag ? 'none' : 'auto'
      }}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
      onPointerDown={(e) => {
        if (allowsDrag && e.button === 0) {
          isDragging.current = true;
          hasMoved.current = false;
          lastY.current = e.clientY;
          targetScroll.current = currentScroll.current;
          if (e.currentTarget.setPointerCapture) {
            e.currentTarget.setPointerCapture(e.pointerId);
          }
          e.currentTarget.style.cursor = 'grabbing';
        }
      }}
      onPointerMove={(e) => {
        if (!isDragging.current) return;
        const delta = e.clientY - lastY.current;
        lastY.current = e.clientY;
        if (Math.abs(delta) > 0.5) hasMoved.current = true;
        targetScroll.current -= delta / Math.max(verticalSpacing, 1);
      }}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClickCapture={(e) => {
        if (hasMoved.current) {
          e.preventDefault();
          e.stopPropagation();
          hasMoved.current = false;
        }
      }}
    >
      <div className="infinite-spiral__stage" role="list" aria-label="Infinite spiral gallery">
        {formattedItems.map((item, idx) => (
          <div
            key={item.id || `${item.src}-${idx}`}
            ref={(el) => { cardRefs.current[idx] = el; }}
            className="infinite-spiral__item"
            style={{ width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
            role="listitem"
            aria-label={item.alt}
          >
            <img
              className="infinite-spiral__image"
              src={item.src}
              alt={item.alt}
              loading={idx < 6 ? 'eager' : 'lazy'}
              draggable={false}
              style={{ width: cardWidth, height: cardHeight, maxWidth: 'none', maxHeight: 'none', objectFit: imageFit }}
              onError={(e) => {
                console.warn('Gallery image failed to load:', item.src);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Mobile Carousel for screens under 640px
 */
function MobileGalleryCarousel({ items }) {
  const scrollRef = useRef(null);
  const cardOffsetRef = useRef(0);
  const animFrameRef = useRef(null);
  const isAdjustingRef = useRef(false);
  const autoTimeoutRef = useRef(null);
  const animScrollRef = useRef(null);
  const isInteractingRef = useRef(false);
  const isPausedRef = useRef(false);

  const repeatedItems = useMemo(
    () => Array.from({ length: 7 * items.length }, (_, i) => ({ ...items[i % items.length], id: i })),
    [items]
  );

  const totalBase = items.length;

  const handleLoop = () => {
    const el = scrollRef.current;
    if (!el) return;
    const offset = cardOffsetRef.current;
    if (!isAdjustingRef.current && offset > 0) {
      if (el.scrollLeft < 2 * offset) {
        isAdjustingRef.current = true;
        el.style.scrollSnapType = 'none';
        el.scrollLeft += offset;
        el.offsetHeight;
        requestAnimationFrame(() => {
          el.style.scrollSnapType = '';
          isAdjustingRef.current = false;
        });
      } else if (el.scrollLeft >= 4 * offset) {
        isAdjustingRef.current = true;
        el.style.scrollSnapType = 'none';
        el.scrollLeft -= offset;
        el.offsetHeight;
        requestAnimationFrame(() => {
          el.style.scrollSnapType = '';
          isAdjustingRef.current = false;
        });
      }
    }
  };

  const updateCardScale = () => {
    const el = scrollRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    const halfWidth = el.clientWidth / 2;
    const cards = el.querySelectorAll('[data-gallery-item]');
    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distRatio = 1 - Math.min(1, Math.abs(cardCenter - center) / halfWidth);
      const scale = 0.7 + 0.3 * distRatio;
      const opacity = Math.min(1, 0.67 + 0.33 * distRatio);
      card.style.transform = `scale(${scale})`;
      card.style.opacity = opacity;
    });
  };

  const clearTimer = () => {
    if (autoTimeoutRef.current) {
      clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = null;
    }
  };

  const scheduleNext = () => {
    clearTimer();
    autoTimeoutRef.current = setTimeout(() => {
      autoStep();
    }, 1200);
  };

  const autoStep = () => {
    if (isPausedRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll('[data-gallery-item]');
    const step = cards.length >= 2 ? cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : 0;
    if (!step) return scheduleNext();

    isInteractingRef.current = true;
    if (animScrollRef.current) cancelAnimationFrame(animScrollRef.current);
    el.style.scrollSnapType = 'none';
    const startTime = performance.now();
    let prevEased = 0;

    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / 400);
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const delta = step * (eased - prevEased);
      el.scrollLeft += delta;
      prevEased = eased;
      updateCardScale();

      if (progress < 1) {
        animScrollRef.current = requestAnimationFrame(tick);
      } else {
        animScrollRef.current = null;
        isInteractingRef.current = false;
        el.style.scrollSnapType = '';
        handleLoop();
        scheduleNext();
      }
    };
    animScrollRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const init = () => {
      const cards = el.querySelectorAll('[data-gallery-item]');
      cardOffsetRef.current = cards.length >= 2 * totalBase ? cards[totalBase].getBoundingClientRect().left - cards[0].getBoundingClientRect().left : 0;
      el.scrollLeft = 3 * cardOffsetRef.current;
      updateCardScale();
      scheduleNext();
    };
    const timer = setTimeout(init, 100);
    window.addEventListener('resize', init);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', init);
      clearTimer();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (animScrollRef.current) cancelAnimationFrame(animScrollRef.current);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      onScroll={() => {
        if (!animFrameRef.current) {
          animFrameRef.current = requestAnimationFrame(() => {
            updateCardScale();
            animFrameRef.current = null;
          });
        }
        if (!isInteractingRef.current) {
          handleLoop();
          if (!isPausedRef.current) scheduleNext();
        }
      }}
      onMouseEnter={() => { isPausedRef.current = true; clearTimer(); }}
      onMouseLeave={() => { isPausedRef.current = false; scheduleNext(); }}
      onTouchStart={() => { isPausedRef.current = true; clearTimer(); }}
      onTouchEnd={() => { isPausedRef.current = false; scheduleNext(); }}
      style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%', WebkitOverflowScrolling: 'touch' }}
    >
      <div style={{ display: 'flex', gap: '0', padding: '0 20vw' }}>
        {repeatedItems.map((item) => (
          <div
            key={item.id}
            data-gallery-item="true"
            style={{ flexShrink: 0, scrollSnapAlign: 'center', width: '78vw', maxWidth: '460px', willChange: 'transform' }}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={{ display: 'block', width: '100%', height: '280px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 20px 45px rgba(0,0,0,0.85)' }}
              draggable={false}
              onError={(e) => {
                console.warn('Mobile gallery image failed to load:', item.src);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const TathvaGallerySpiral = () => {
  return (
    <div id="galleryx" className="tathva-gallery-section my-auto mb-14 bg-transparent relative z-10">
      <div className="gallery-header-box flex justify-center items-center px-4 sm:px-8 lg:px-16 sm:py-12 relative">
        <div className="gallery-header-glow-bg absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,190,108,0.1)_0%,_transparent_65%)] pointer-events-none -z-10" />
        <p className="text-center max-w-3xl text-gray-200 plus-jakarta leading-relaxed tracking-wide font-light drop-shadow-md">
          <span className="gallery-main-title bg-gradient-to-r pp-fragment from-white via-gray-200 to-white bg-clip-text text-transparent text-4xl tracking-wide sm:text-5xl block mb-6 sm:mb-10 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            YUKTHI X'26 Gallery
          </span>
          <span className="gallery-subtitle inline-block text-white/90 font-light mb-5">
            Scroll through the moments that define YUKTHI X'26 — step into the vibrant spirit of{' '}
            <span className="font-medium text-white highlight">creativity</span> and{' '}
            <span className="font-medium text-white highlight">unforgettable</span> memories.
          </span>
        </p>
      </div>

      <div className="gallery-spiral-stage-wrapper relative h-auto sm:h-[800px] w-full sm:overflow-hidden">
        <div className="desktop-spiral-container hidden sm:block h-full w-full">
          <InfiniteSpiral
            items={GALLERY_IMAGES}
            imageFit="contain"
            animationMode="all"
            speed={0.5}
            cardWidth={400}
            cardHeight={520}
            radius={350}
            cardsPerTurn={3.5}
            verticalSpacing={200}
            centerScale={1.2}
            edgeFade={0.3}
            edgeBlur={6}
          />
        </div>
        <div className="mobile-spiral-container block sm:hidden h-full w-full">
          <MobileGalleryCarousel items={GALLERY_IMAGES} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3.10 CONTACT SECTION
// ==========================================
const ContactSection = ({ onToast }) => {
  const [form, setForm] = useState({ topic: '', name: '', email: '', phone: '', query: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      onToast('⚠️ Please enter your name and email.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onToast('✨ Message sent successfully! Our team will contact you soon.');
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

// 3.11b OFFICIAL 3D TILT HERO HEADING (Matching YUKTHI X'26 Orbitron Font & Dimensions)
const HeroMainTitle = ({ text = "YUKTHI X'26" }) => {
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

// ==========================================
// 3.12 YUKTHI X'26 HOME PAGE COMPONENT
// ==========================================
const TathvaHomePage = ({ onNavigate, onToast }) => {
  return (
    <div className="home-page-view">
      {/* Hero Section (Matching Screenshot 2) */}
      <section className="home-hero-section">
        {/* Top Left YUKTHI X'26 Logo */}
        <div
          className="hero-top-left-logo"
          onClick={() => onNavigate('home')}
          title="YUKTHI X'26 Home"
        >
          <img
            src="images/TATHVA25_LOGO_BLACK.png"
            alt="YUKTHI X'26 Logo"
            onError={(e) => { e.target.src = 'https://tathva.org/images/TATHVA25_LOGO_BLACK.png'; }}
          />
        </div>

        {/* Year 2026 */}
        <p className="hero-year-text">2026</p>

        {/* Giant Futuristic Title: YUKTHI X'26 (Exact YUKTHI X'26 Orbitron Font & Scale) */}
        <HeroMainTitle text="YUKTHI X'26" />

        {/* Dates */}
        <p className="hero-dates-text">13TH - 15TH OCTOBER</p>
      </section>

      {/* Techkriti '26 Interactive Radar Dial Summits Showcase (Replaces Screenshot 4) */}
      <TechkritiSummitsDialShowcase onNavigate={onNavigate} />

      {/* TATHVA GALLERY with 3D Infinite Spiral (Matching Screenshots 3 & 4) */}
      <TathvaGallerySpiral />

      {/* Website Launch Countdown on Downside of Tathva Gallery */}
      <div className="gallery-downside-countdown">
        <p className="hero-launch-label">WEBSITE LAUNCHING IN</p>
        <CountdownTimer />
      </div>

      {/* CONTACT US Form */}
      <ContactSection onToast={onToast} />
    </div>
  );
};

// ==========================================
// 3.13 OFFICIAL TATHVA FOOTER
// ==========================================
const Footer = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top-section">
          <img
            src="images/TATHVA25_LOGO_BLACK.png"
            alt="YUKTHI X'26 Logo"
            className="footer-logo-img"
            onClick={() => onNavigate('home')}
            style={{ cursor: 'pointer' }}
            onError={(e) => { e.target.src = 'https://tathva.org/images/TATHVA25_LOGO_BLACK.png'; }}
          />
          <ul className="footer-nav-list">
            <li>
              <a
                href="#competitions"
                className="footer-nav-link"
                onClick={(e) => { e.preventDefault(); onNavigate('competitions'); }}
              >
                Events
              </a>
            </li>
            <li>
              <a
                href="#workshops"
                className="footer-nav-link"
                onClick={(e) => { e.preventDefault(); onNavigate('workshops'); }}
              >
                Workshops
              </a>
            </li>
            <li>
              <a
                href="#lectures"
                className="footer-nav-link"
                onClick={(e) => { e.preventDefault(); onNavigate('lectures'); }}
              >
                Lectures
              </a>
            </li>
            <li>
              <a
                href="#competitions"
                className="footer-nav-link"
                onClick={(e) => { e.preventDefault(); onNavigate('competitions'); }}
              >
                Gallery
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-bottom-bar">
          <div className="footer-legal-links">
            <button className="legal-btn" type="button" onClick={() => alert("YUKTHI X'26 Terms of Service")}>Terms of Service</button>
            <button className="legal-btn" type="button" onClick={() => alert("YUKTHI X'26 Privacy Policy")}>Privacy Policy</button>
          </div>
          <div className="footer-social-links">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle-btn" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-circle-btn" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-circle-btn" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
          <span className="footer-copyright">© YUKTHI X'26</span>
        </div>
      </div>
    </footer>
  );
};

// ==========================================
// 4. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const [route, setRoute] = useState('home'); // 'home', 'competitions', 'workshops', 'workshop-detail', 'passes', 'accomodation', 'lectures'
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [activeTab, setActiveTab] = useState('tathva'); // 'tathva' or 'pretathva'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLowPower, setIsLowPower] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  // Track window scroll for sticky header visibility
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toast dispatcher
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Sync hash routing (supports #home, #workshops/22, #workshops, #competitions, etc.)
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (!hash || hash === 'home') {
        setRoute('home');
        setSelectedWorkshopId(null);
        return;
      }
      if (hash.startsWith('workshops/')) {
        const id = parseInt(hash.replace('workshops/', ''), 10);
        if (id) {
          setRoute('workshop-detail');
          setSelectedWorkshopId(id);
          return;
        }
      }
      if (['competitions', 'workshops', 'passes', 'accomodation', 'lectures'].includes(hash)) {
        setRoute(hash);
        setSelectedWorkshopId(null);
      }
    };
    if (window.location.hash) onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (newRoute) => {
    if (!newRoute || newRoute === 'home') {
      setRoute('home');
      setSelectedWorkshopId(null);
      window.location.hash = '';
    } else if (newRoute.startsWith('workshops/')) {
      const id = parseInt(newRoute.replace('workshops/', ''), 10);
      setRoute('workshop-detail');
      setSelectedWorkshopId(id);
      window.location.hash = newRoute;
    } else {
      setRoute(newRoute);
      setSelectedWorkshopId(null);
      window.location.hash = newRoute;
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Competitions
  const filteredCompetitions = useMemo(() => {
    let list = EVENTS_DATA.filter((e) => e.type === 'competitions');
    if (activeTab === 'pretathva') {
      list = list.filter((e) => e.committee === 'GPC');
    } else {
      list = list.filter((e) => e.committee !== 'GPC');
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => e.heading.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return list.sort((a, b) => Number(!a.published) - Number(!b.published));
  }, [activeTab, searchQuery]);

  // Filtered Workshops (Matches Image 1 and user screenshot: Autonomous Driving & Cyber Forensics in top row, PCB Design & Frontend Workshop in second row)
  const filteredWorkshops = useMemo(() => {
    let list = EVENTS_DATA.filter((e) => e.type === 'workshops');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((e) => e.heading.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    return list.sort((a, b) => {
      const order = [22, 23, 2, 8, 3, 5, 24, 19, 18, 20, 21, 17];
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return Number(!a.published) - Number(!b.published);
    });
  }, [searchQuery]);

  return (
    <div className="site-wrapper">
      {/* Background Three.js 3D Golden Particle Galaxy & Cosmic Viewport for Home Page */}
      {route === 'home' && <GalaxyScene />}

      {/* Background Milky Way Galaxy & Starfield Canvas (for non-home pages) */}
      {route !== 'home' && (
        <>
          <img
            src="images/milky_way_bg.jpg"
            alt="Milky Way Galaxy Background"
            className="galaxy-img-bg"
            id="galaxy-bg"
            onError={(e) => { e.target.src = 'https://tathva.org/images/milky_way_bg.jpg'; }}
          />
          <StarfieldCanvas isLowPower={isLowPower} />
        </>
      )}

      {/* Fixed Header & Glass Navigation Bar */}
      <header className={`header-nav ${route === 'home' && !scrolled ? 'home-top-hidden' : 'visible'}`}>
        <div className="header-container">
          <a
            href="#home"
            className="logo-pill"
            onClick={(e) => { e.preventDefault(); navigate('home'); }}
            title="YUKTHI X'26 Home"
          >
            <img
              src="images/TATHVA25_LOGO_BLACK.png"
              alt="YUKTHI X'26 Logo"
              onError={(e) => { e.target.src = 'https://tathva.org/images/TATHVA25_LOGO_BLACK.png'; }}
            />
          </a>

          <nav className="nav-pill-menu" aria-label="Main Navigation">
            {['workshops', 'competitions', 'passes', 'lectures', 'accomodation'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={`nav-link ${(route === item || (route === 'workshop-detail' && item === 'workshops')) ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); navigate(item); }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="icon-btn"
              onClick={() => showToast("🔔 YUKTHI X'26 Registrations are LIVE! Grab passes now.")}
              title="Announcements"
              aria-label="View announcements"
            >
              <span className="bell-icon-wrapper">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                  <path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665"></path>
                </svg>
                <span className="bell-dot"></span>
              </span>
            </button>

            <div className="nav-divider"></div>

            <button
              className="user-avatar-btn"
              onClick={() => showToast('👤 Signed in as Dev Tester (NIT Calicut)')}
              title="User Profile (Dev Tester)"
              aria-label="User profile"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {['workshops', 'competitions', 'passes', 'lectures', 'accomodation'].map((item) => (
          <a
            key={item}
            href={`#${item}`}
            className={`mobile-nav-item ${route === item ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); navigate(item); }}
          >
            {item.toUpperCase()}
          </a>
        ))}
      </div>

      {/* Main Pages Content */}
      <main className={`main-content ${route === 'home' ? 'home-main-content' : ''}`}>
        <div key={route} className="page-transition-wrapper">
          {/* ==========================================================
              SCREEN 0: HOME PAGE (Three.js 3D Galaxy + Hero + Feature Showcase + 3D Spiral Gallery + Contact)
              ========================================================== */}
          {route === 'home' && (
            <TathvaHomePage
              onNavigate={navigate}
              onToast={showToast}
            />
          )}

          {/* ==========================================================
              SCREEN 1: COMPETITIONS (Image 2)
              ========================================================== */}
          {route === 'competitions' && (
            <section className="page-view active" aria-labelledby="comp-title">
              <div className="section-header-box">
                <button
                  className="breadcrumb-home-link"
                  onClick={() => navigate('home')}
                  title="Return to YUKTHI X'26 Home"
                  aria-label="Return to Home"
                >
                  <span className="breadcrumb-arrow">←</span> Home
                </button>
                <div className="header-flex-row">
                  <h1 id="comp-title" className="page-main-title pp-fragment">COMPETITIONS</h1>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search For Competitions"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* YUKTHI X'26 vs Pre-Tathva Tabs */}
              <div className="tabs-container">
                <div className="tabs-flex">
                  <button
                    className={`tab-btn ${activeTab === 'tathva' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tathva')}
                  >
                    YUKTHI X'26
                  </button>
                  <button
                    className={`tab-btn ${activeTab === 'pretathva' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pretathva')}
                  >
                    PRE-TATHVA
                  </button>
                </div>
                <div
                  className="tab-slider-bar"
                  style={{ transform: activeTab === 'tathva' ? 'translateX(0%)' : 'translateX(100%)' }}
                />
              </div>

              {/* Competitions Grid */}
              {filteredCompetitions.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '3rem 0', fontSize: '1.1rem' }}>
                  No competitions found matching your search.
                </p>
              ) : (
                <div className="events-grid competitions-grid">
                  {filteredCompetitions.map((ev) => (
                    <EventCard key={ev.id} event={ev} onSelect={setSelectedEvent} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ==========================================================
            SCREEN 2: WORKSHOPS (Image 1)
            ========================================================== */}
          {route === 'workshops' && (
            <section className="page-view active" aria-labelledby="work-title">
              <div className="section-header-box">
                <button
                  className="breadcrumb-home-link"
                  onClick={() => navigate('home')}
                  title="Return to YUKTHI X'26 Home"
                  aria-label="Return to Home"
                >
                  <span className="breadcrumb-arrow">←</span> Home
                </button>
                <div className="header-flex-row">
                  <h1 id="work-title" className="page-main-title pp-fragment">WORKSHOPS</h1>
                  <div className="search-input-wrapper">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search For Workshops"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {filteredWorkshops.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '3rem 0', fontSize: '1.1rem' }}>
                  No workshops found matching your search.
                </p>
              ) : (
                <WorkshopsGrid
                  workshops={filteredWorkshops}
                  onSelect={(ev) => navigate(`workshops/${ev.id}`)}
                />
              )}
            </section>
          )}

          {/* ==========================================================
            SCREEN 2.5: WORKSHOP DETAIL PAGE (Exact match to YUKTHI X'26)
            ========================================================== */}
          {route === 'workshop-detail' && (
            <section className="page-view active" aria-labelledby="workshop-detail-title">
              {(() => {
                const currentWorkshop = EVENTS_DATA.find((e) => e.id === selectedWorkshopId) || EVENTS_DATA.find((e) => e.id === 22);
                return (
                  <WorkshopDetailPage
                    workshop={currentWorkshop}
                    onBack={() => navigate('workshops')}
                    onRegister={(ev) => {
                      if (ev.published) {
                        setSelectedEvent(ev);
                      } else {
                        showToast('⚠️ Registrations for this workshop are currently full.');
                      }
                    }}
                  />
                );
              })()}
            </section>
          )}

          {/* ==========================================================
            SCREEN 3: PASSES (Image 3)
            ========================================================== */}
          {route === 'passes' && (
            <section className="page-view active" aria-labelledby="passes-title">
              <div className="grid-texture-overlay"></div>
              <div className="status-hero">
                <p className="status-tag poppins">YUKTHI X'26 / STATUS</p>
                <div className="status-divider-line"></div>
                <h1 id="passes-title" className="status-title pp-fragment">
                  PASSES<br />
                  COMING<br />
                  SOON
                </h1>
                <p className="status-description poppins">
                  Passes are not on sale yet. Check back soon.
                </p>
                <p className="status-badge monocraft">
                  WEBSITE LAUNCHING IN 2026
                </p>
                <div>
                  <button className="return-home-btn" onClick={() => navigate('competitions')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Return to Home</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ==========================================================
            SCREEN 4: ACCOMODATION (Image 4)
            ========================================================== */}
          {route === 'accomodation' && (
            <section className="page-view active" aria-labelledby="accom-title">
              <div className="grid-texture-overlay"></div>
              <div className="status-hero">
                <p className="status-tag poppins">YUKTHI X'26 / STATUS</p>
                <div className="status-divider-line"></div>
                <h1 id="accom-title" className="status-title pp-fragment">
                  ACCOMODATION<br />
                  COMING SOON
                </h1>
                <p className="status-description poppins">
                  Accomodation details and bookings will be available soon.
                </p>
                <p className="status-badge monocraft">
                  WEBSITE LAUNCHING IN 2026
                </p>
                <div>
                  <button className="return-home-btn" onClick={() => navigate('competitions')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Return to Home</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ==========================================================
            SCREEN 5: LECTURES
            ========================================================== */}
          {route === 'lectures' && (
            <section className="page-view active" aria-labelledby="lectures-title">
              <div className="section-header-box">
                <button
                  className="breadcrumb-home-link"
                  onClick={() => navigate('home')}
                  title="Return to YUKTHI X'26 Home"
                  aria-label="Return to Home"
                >
                  <span className="breadcrumb-arrow">←</span> Home
                </button>
                <div className="header-flex-row">
                  <h1 id="lectures-title" className="page-main-title pp-fragment">LECTURES</h1>
                </div>
              </div>
              <div className="events-grid">
                {EVENTS_DATA.filter((e) => e.type === 'lectures').map((ev) => (
                  <EventCard key={ev.id} event={ev} onSelect={setSelectedEvent} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Official Tathva Footer */}
      <Footer onNavigate={navigate} />

      {/* Floating Low Power Mode Toggle Button */}
      <button
        id="low-power-btn"
        className={`floating-power-btn ${isLowPower ? 'active' : ''}`}
        title={isLowPower ? 'Disable Low Power Mode' : 'Enable Low Power Mode (CSS Only)'}
        onClick={() => {
          setIsLowPower(!isLowPower);
          showToast(!isLowPower ? '⚡ Low Power Mode Enabled: Canvas animations paused.' : '✨ High Performance Mode: Starfield & Warp active.');
        }}
        aria-label="Toggle low power mode"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </button>

      {/* Event Details Modal Dialog */}
      {selectedEvent && (
        <div
          id="event-modal"
          className="modal-overlay open"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target.id === 'event-modal') setSelectedEvent(null);
          }}
        >
          <div className="modal-content-box">
            <button
              id="modal-close-btn"
              className="modal-close-btn"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close dialog"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="modal-poster-side">
              <img
                className="modal-poster-img"
                src={selectedEvent.picture || 'posters/event_6.webp'}
                alt={selectedEvent.heading}
                onError={(e) => {
                  if (selectedEvent.remotePicture) e.target.src = selectedEvent.remotePicture;
                }}
              />
            </div>

            <div className="modal-info-side">
              <span className="modal-category-badge">
                {selectedEvent.type === 'workshops' ? 'WORKSHOP' : 'COMPETITION'}
              </span>
              <h2 className="modal-title pp-fragment">{selectedEvent.heading}</h2>
              <p className="modal-tagline">{selectedEvent.catchyPara || "Official YUKTHI X'26 Event at NIT Calicut"}</p>

              <div className="modal-meta-grid">
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Registration Fee</span>
                  <span className="modal-meta-val" style={{ color: '#22d3ee' }}>
                    {selectedEvent.price > 0 ? `₹${selectedEvent.price}` : 'Free'}
                  </span>
                </div>
                <div className="modal-meta-item">
                  <span className="modal-meta-label">Organized By</span>
                  <span className="modal-meta-val">{selectedEvent.committee || 'YUKTHI Committee'}</span>
                </div>
                <div className="modal-meta-item" style={{ gridColumn: 'span 2' }}>
                  <span className="modal-meta-label">Venue</span>
                  <span className="modal-meta-val">{selectedEvent.venueName || 'NIT Calicut Main Campus'}</span>
                </div>
              </div>

              <div className="modal-desc-body">
                <p>{selectedEvent.description}</p>
              </div>

              <div className="modal-action-row">
                <button
                  className={`register-btn ${!selectedEvent.published ? 'disabled' : ''}`}
                  disabled={!selectedEvent.published}
                  onClick={() => {
                    if (selectedEvent.published) {
                      showToast(`Registered successfully for ${selectedEvent.heading}! Confirmation sent.`);
                      setSelectedEvent(null);
                    }
                  }}
                >
                  {selectedEvent.published ? 'REGISTER NOW' : 'BOOKING FULL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

