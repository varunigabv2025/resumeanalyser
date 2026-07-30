import React, { useEffect, useRef } from 'react';

const BackgroundEffects = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Globe parameters
    let rotationAngle = 0;
    const globeRadius = Math.min(width, height) * 0.28;

    // Generate 3D Globe Latitude / Longitude Points
    const points = [];
    const latLines = 12;
    const lngLines = 18;

    for (let i = 0; i <= latLines; i++) {
      const lat = (Math.PI * i) / latLines - Math.PI / 2;
      for (let j = 0; j < lngLines; j++) {
        const lng = (2 * Math.PI * j) / lngLines;
        points.push({
          x: globeRadius * Math.cos(lat) * Math.cos(lng),
          y: globeRadius * Math.sin(lat),
          z: globeRadius * Math.cos(lat) * Math.sin(lng),
          lat,
          lng,
        });
      }
    }

    // Neural Particles around Globe
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * width * 0.8,
      y: (Math.random() - 0.5) * height * 0.8,
      z: (Math.random() - 0.5) * 400,
      size: Math.random() * 2 + 0.8,
      color: Math.random() > 0.5 ? '#635985' : '#443C68',
      alpha: Math.random() * 0.5 + 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      rotationAngle += 0.003;

      // Draw Orbit Rings around Core
      ctx.save();
      ctx.translate(centerX, centerY);

      // Ring 1: Main Tilted Outer Orbit
      ctx.beginPath();
      ctx.ellipse(0, 0, globeRadius * 1.35, globeRadius * 0.45, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#635985';
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.25;
      ctx.stroke();

      // Ring 2: Counter Rotating Inner Orbit
      ctx.beginPath();
      ctx.ellipse(0, 0, globeRadius * 1.15, globeRadius * 0.35, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = '#443C68';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.3;
      ctx.stroke();

      ctx.restore();

      // Project & Draw 3D Globe Core
      const projectedPoints = points.map((p) => {
        // Rotate around Y axis
        const cos = Math.cos(rotationAngle);
        const sin = Math.sin(rotationAngle);
        const rx = p.x * cos - p.z * sin;
        const rz = p.x * sin + p.z * cos;

        // Perspective Projection
        const scale = 500 / (500 + rz);
        return {
          px: centerX + rx * scale,
          py: centerY + p.y * scale,
          pz: rz,
          scale,
        };
      });

      // Draw longitude/latitude connecting lines
      ctx.beginPath();
      for (let i = 0; i < projectedPoints.length; i++) {
        const pt = projectedPoints[i];
        if (pt.pz < 50) {
          ctx.fillStyle = '#635985';
          ctx.globalAlpha = Math.max(0.1, (1 - pt.pz / 250) * 0.4);
          ctx.fillRect(pt.px, pt.py, 1.8 * pt.scale, 1.8 * pt.scale);
        }
      }

      // Draw flowing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z += 0.4;
        if (p.z > 200) p.z = -200;

        const scale = 500 / (500 + p.z);
        const screenX = centerX + p.x * scale;
        const screenY = centerY + p.y * scale;

        ctx.beginPath();
        ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (scale * 0.6);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Holographic AI Globe Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-75" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-scifi opacity-30" />

      {/* Deep Purple Radial Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-scifi-600/15 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-scifi-700/20 rounded-full blur-[140px] pointer-events-none animate-float" />
    </div>
  );
};

export default BackgroundEffects;
