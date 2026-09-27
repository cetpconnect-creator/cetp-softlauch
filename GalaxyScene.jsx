import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './GalaxyScene.css';

/**
 * Creates a soft glowing radial star texture to avoid square points.
 */
function createGlowingStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 245, 225, 0.9)');
    gradient.addColorStop(0.48, 'rgba(244, 190, 108, 0.45)');
    gradient.addColorStop(0.78, 'rgba(217, 130, 43, 0.14)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export default function GalaxyScene() {
    const mountRef = useRef(null);
    const constCanvasRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const constCanvas = constCanvasRef.current;
        if (!mount || !constCanvas) return;

        // ============================================================
        // 1. Constellation Network & Meteors Canvas
        // ============================================================
        const constCtx = constCanvas.getContext('2d');
        let cWidth = (constCanvas.width = window.innerWidth);
        let cHeight = (constCanvas.height = window.innerHeight);

        const nodes = Array.from({ length: 55 }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            radius: Math.random() * 1.5 + 0.8,
            alpha: Math.random() * 0.5 + 0.35
        }));

        const meteors = [];
        let nextMeteorTime = 0;

        function updateAndDrawConstellations(now) {
            constCtx.clearRect(0, 0, cWidth, cHeight);

            // Draw connecting constellation lines
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0) n.x = cWidth;
                else if (n.x > cWidth) n.x = 0;
                if (n.y < 0) n.y = cHeight;
                else if (n.y > cHeight) n.y = 0;

                for (let j = i + 1; j < nodes.length; j++) {
                    const m = nodes[j];
                    const dx = n.x - m.x;
                    const dy = n.y - m.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 115) {
                        const alpha = (1 - dist / 115) * 0.16;
                        constCtx.strokeStyle = `rgba(200, 225, 255, ${alpha})`;
                        constCtx.lineWidth = 0.75;
                        constCtx.beginPath();
                        constCtx.moveTo(n.x, n.y);
                        constCtx.lineTo(m.x, m.y);
                        constCtx.stroke();
                    }
                }

                // Draw star node
                constCtx.fillStyle = `rgba(255, 250, 235, ${n.alpha})`;
                constCtx.beginPath();
                constCtx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                constCtx.fill();
            }

            // Spawn blue meteors
            if (now > nextMeteorTime) {
                const angle = (Math.PI / 180) * (32 + Math.random() * 10);
                const speed = 4.5 + Math.random() * 4;
                meteors.push({
                    x: Math.random() * cWidth * 1.2 - cWidth * 0.1,
                    y: Math.random() * cHeight * 0.5,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    length: 45 + Math.random() * 35,
                    alpha: 0.85,
                    life: 0,
                    maxLife: 60 + Math.random() * 30
                });
                nextMeteorTime = now + 4000 + Math.random() * 4500;
            }

            // Draw and advance meteors
            for (let i = meteors.length - 1; i >= 0; i--) {
                const met = meteors[i];
                met.x += met.vx;
                met.y += met.vy;
                met.life++;
                met.alpha = 1 - met.life / met.maxLife;

                if (met.life >= met.maxLife || met.y > cHeight + 100) {
                    meteors.splice(i, 1);
                    continue;
                }

                const tailX = met.x - (met.vx / 5) * met.length;
                const tailY = met.y - (met.vy / 5) * met.length;

                const grad = constCtx.createLinearGradient(tailX, tailY, met.x, met.y);
                grad.addColorStop(0, 'rgba(100, 180, 255, 0)');
                grad.addColorStop(1, `rgba(160, 220, 255, ${met.alpha * 0.85})`);

                constCtx.strokeStyle = grad;
                constCtx.lineWidth = 1.4;
                constCtx.beginPath();
                constCtx.moveTo(tailX, tailY);
                constCtx.lineTo(met.x, met.y);
                constCtx.stroke();
            }
        }

        // ============================================================
        // 2. Three.js Scene, Fixed Perspective Camera, and Renderer
        // ============================================================
        const scene = new THREE.Scene();

        // Fixed perspective locked to match Screenshot 2:
        // Inclined angle (~26°) looking down at the golden galaxy with the core glowing directly behind "2026"
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 2.7, 5.8);
        camera.lookAt(0, -0.32, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        // ============================================================
        // 3. Galaxy Particle Geometry & Color Grading (85,000 stars)
        // ============================================================
        const params = {
            count: 85000,
            size: 0.022,
            radius: 5.8,
            branches: 3,
            spin: 1.45,
            randomness: 0.22,
            randomnessPower: 3.2,
            colorCore: '#ffffff',
            colorInner: '#ffeed6',
            colorGold: '#f4be6c',
            colorBronze: '#d9822b',
            colorDust: '#8b4d1b',
            colorHalo: '#48cae4',
            rotationSpeed: 0.075
        };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(params.count * 3);
        const colors = new Float32Array(params.count * 3);

        const cCore = new THREE.Color(params.colorCore);
        const cInner = new THREE.Color(params.colorInner);
        const cGold = new THREE.Color(params.colorGold);
        const cBronze = new THREE.Color(params.colorBronze);
        const cDust = new THREE.Color(params.colorDust);
        const cHalo = new THREE.Color(params.colorHalo);

        for (let i = 0; i < params.count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * params.radius;
            const spinAngle = radius * params.spin;
            const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

            const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
            const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;
            const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * params.randomness * radius;

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY * 0.42;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const ratio = radius / params.radius;
            const mixedColor = new THREE.Color();

            if (ratio < 0.18) {
                mixedColor.copy(cCore).lerp(cInner, ratio / 0.18);
            } else if (ratio < 0.55) {
                mixedColor.copy(cInner).lerp(cGold, (ratio - 0.18) / 0.37);
            } else if (ratio < 0.85) {
                mixedColor.copy(cGold).lerp(cBronze, (ratio - 0.55) / 0.3);
            } else {
                mixedColor.copy(cBronze).lerp(cDust, (ratio - 0.85) / 0.15);
            }

            if (Math.random() < 0.07 && ratio > 0.35) {
                mixedColor.lerp(cHalo, 0.65);
            }
            if (ratio < 0.12 && Math.random() < 0.4) {
                mixedColor.set('#ffffff');
            }

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starTexture = createGlowingStarTexture();
        const material = new THREE.PointsMaterial({
            size: params.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            map: starTexture,
            transparent: true,
            opacity: 0.95
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // ============================================================
        // 3b. Deep Space Ambient Starfield (20,000 stars across all sections)
        // Ensures continuous celestial stars across Summits & Gallery
        // ============================================================
        const ambientCount = 20000;
        const ambientGeo = new THREE.BufferGeometry();
        const ambientPos = new Float32Array(ambientCount * 3);
        const ambientCol = new Float32Array(ambientCount * 3);

        const goldTint = new THREE.Color('#f4be6c');
        const blueTint = new THREE.Color('#93c5fd');
        const whiteTint = new THREE.Color('#ffffff');

        for (let i = 0; i < ambientCount; i++) {
            const i3 = i * 3;
            // Spread across wide 3D bounding box
            ambientPos[i3] = (Math.random() - 0.5) * 45;
            ambientPos[i3 + 1] = (Math.random() - 0.5) * 35;
            ambientPos[i3 + 2] = (Math.random() - 0.5) * 35;

            const rand = Math.random();
            const starCol = rand < 0.5 ? whiteTint : rand < 0.8 ? goldTint : blueTint;
            ambientCol[i3] = starCol.r;
            ambientCol[i3 + 1] = starCol.g;
            ambientCol[i3 + 2] = starCol.b;
        }

        ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));
        ambientGeo.setAttribute('color', new THREE.BufferAttribute(ambientCol, 3));

        const ambientMat = new THREE.PointsMaterial({
            size: 0.024,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            map: starTexture,
            transparent: true,
            opacity: 0.8
        });

        const ambientStars = new THREE.Points(ambientGeo, ambientMat);
        scene.add(ambientStars);

        // ============================================================
        // 4. Scroll Tracking for Smooth Parallax & Continuous Motion
        // ============================================================
        let targetScrollY = window.scrollY;
        let currentScrollY = window.scrollY;

        const handleScroll = () => {
            targetScrollY = window.scrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // ============================================================
        // 5. Animation Loop (Smooth Orbit Spin & Continuous Parallax)
        // ============================================================
        const timer = new THREE.Timer();
        let animationFrameId;

        function animate() {
            animationFrameId = requestAnimationFrame(animate);

            timer.update();
            const elapsedTime = timer.getElapsed();
            const now = performance.now();

            // Smooth lerp for scroll position
            currentScrollY += (targetScrollY - currentScrollY) * 0.06;

            updateAndDrawConstellations(now);

            // Camera subtle parallax travel as user scrolls across Hero -> Summits -> Gallery -> Contact
            const scrollParallax = Math.min(currentScrollY, 3200);
            camera.position.y = 2.7 - scrollParallax * 0.00045;
            camera.position.z = 5.8 + scrollParallax * 0.0002;
            camera.lookAt(0, -0.32 - scrollParallax * 0.00045, 0);

            // Smooth continuous spiral rotation + gentle scroll-induced spin
            points.rotation.y = elapsedTime * params.rotationSpeed + currentScrollY * 0.00032;
            points.rotation.x = Math.sin(elapsedTime * 0.15) * 0.04 + currentScrollY * 0.00008;

            // Ambient background stars slow celestial drift
            ambientStars.rotation.y = elapsedTime * 0.012 + currentScrollY * 0.00015;
            ambientStars.rotation.x = Math.cos(elapsedTime * 0.1) * 0.02;

            renderer.render(scene, camera);
        }
        animate();

        // ============================================================
        // 6. Window Resize Handler
        // ============================================================
        function handleResize() {
            cWidth = constCanvas.width = window.innerWidth;
            cHeight = constCanvas.height = window.innerHeight;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        window.addEventListener('resize', handleResize);

        // ============================================================
        // 7. Cleanup on Unmount
        // ============================================================
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);

            if (mount && renderer.domElement) {
                mount.removeChild(renderer.domElement);
            }

            geometry.dispose();
            material.dispose();
            ambientGeo.dispose();
            ambientMat.dispose();
            starTexture.dispose();
            renderer.dispose();
        };

    }, []);

    return (
        <div className="galaxy-container">
            {/* Cosmic Background Layers */}
            <div className="cosmic-viewport">
                <div className="milky-way-layer" />
                <div className="tathva-nebula-glow" />
                <canvas ref={constCanvasRef} className="constellation-canvas" />
                <div className="vignette-overlay" />
            </div>

            {/* Three.js Canvas Container (Pointer events none so buttons are directly clickable) */}
            <div ref={mountRef} className="webgl-mount" />
        </div>
    );
}
