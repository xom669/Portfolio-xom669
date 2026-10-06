import { useEffect, useRef } from 'react';

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorLightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let canvasW = (canvas.width = window.innerWidth);
    let canvasH = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      canvasW = canvas.width = window.innerWidth;
      canvasH = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 5 fluid metaballs: Deep Purple, Royal Violet, Electric Purple, Cyber Orange, Radiant Amber
    const fluidBlobs = [
      { x: canvasW * 0.25, y: canvasH * 0.25, vx: 0.35, vy: 0.25, radius: 380, color: 'rgba(127, 29, 203, 0.45)' }, // Royal Violet
      { x: canvasW * 0.75, y: canvasH * 0.30, vx: -0.3, vy: 0.45, radius: 400, color: 'rgba(255, 110, 0, 0.38)' },  // Cyber Orange
      { x: canvasW * 0.45, y: canvasH * 0.75, vx: 0.4, vy: -0.35, radius: 430, color: 'rgba(160, 58, 240, 0.35)' }, // Electric Purple
      { x: canvasW * 0.85, y: canvasH * 0.80, vx: -0.35, vy: -0.3, radius: 350, color: 'rgba(255, 170, 0, 0.30)' }, // Radiant Amber
      { x: canvasW * 0.15, y: canvasH * 0.85, vx: 0.25, vy: 0.4, radius: 370, color: 'rgba(62, 11, 110, 0.65)' }    // Deep Plum Violet
    ];

    const renderLava = () => {
      ctx.clearRect(0, 0, canvasW, canvasH);

      fluidBlobs.forEach((b) => {
        b.x += b.vx;
        b.y += b.vy;

        if (b.x < -120 || b.x > canvasW + 120) b.vx *= -1;
        if (b.y < -120 || b.y > canvasH + 120) b.vy *= -1;

        const radial = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        radial.addColorStop(0, b.color);
        radial.addColorStop(1, 'transparent');

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(renderLava);
    };

    renderLava();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Spotlight pointer tracker
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (cursorLightRef.current) {
        cursorLightRef.current.style.left = `${e.clientX}px`;
        cursorLightRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <>
      <canvas id="antigravityLavaCanvas" ref={canvasRef} />
      <div className="ambient-overlay-grid" aria-hidden="true" />
      <div className="ambient-radial-shade" aria-hidden="true" />
      <div id="cursorLight" ref={cursorLightRef} aria-hidden="true" />
    </>
  );
}
