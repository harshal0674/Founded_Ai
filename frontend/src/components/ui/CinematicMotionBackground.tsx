import React, { useEffect, useRef } from "react";

export const CinematicMotionBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for interactive glow
    let mouse = { x: width * 0.5, y: height * 0.35, targetX: width * 0.5, targetY: height * 0.35 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize);

    // 1. Telemetry Nodes (Inventory Flow Grid)
    const nodeCount = Math.floor(Math.min(width, 1400) / 38);
    const nodes: Array<{
      x: number;
      y: number;
      baseY: number;
      speed: number;
      radius: number;
      phase: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        baseY: y,
        speed: 0.15 + Math.random() * 0.35,
        radius: 1 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.45,
      });
    }

    // 2. Oscilloscope / Demand Waves
    let waveOffset = 0;

    const render = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // --- Layer A: Ambient Radial Spotlight following cursor ---
      const mouseGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        Math.min(width * 0.5, 550)
      );
      mouseGrad.addColorStop(0, "rgba(10, 132, 255, 0.09)");
      mouseGrad.addColorStop(0.5, "rgba(94, 92, 230, 0.03)");
      mouseGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // --- Layer B: Top Ambient Blue/Cyan Core Glow ---
      const topGrad = ctx.createRadialGradient(
        width * 0.5,
        120,
        20,
        width * 0.5,
        120,
        width * 0.6
      );
      topGrad.addColorStop(0, "rgba(10, 132, 255, 0.14)");
      topGrad.addColorStop(0.4, "rgba(0, 113, 227, 0.05)");
      topGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height * 0.85);

      // --- Layer C: Demand Flow Waveform Lines ---
      waveOffset += 0.008;
      const drawFlowWave = (
        yBase: number,
        amplitude: number,
        frequency: number,
        color: string,
        strokeWidth: number,
        offsetMultiplier: number
      ) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 12) {
          const y =
            yBase +
            Math.sin(x * frequency + waveOffset * offsetMultiplier) * amplitude +
            Math.cos(x * frequency * 0.5 + waveOffset * 0.7) * (amplitude * 0.4);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      };

      // Flowing background wave graphs (subtle opacity)
      drawFlowWave(height * 0.32, 38, 0.0022, "rgba(10, 132, 255, 0.07)", 1.5, 1.2);
      drawFlowWave(height * 0.36, 48, 0.0018, "rgba(94, 92, 230, 0.06)", 1.2, 0.9);
      drawFlowWave(height * 0.68, 44, 0.002, "rgba(48, 209, 88, 0.04)", 1.0, 1.1);

      // --- Layer D: Telemetry Nodes & Connecting Lines ---
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.phase += 0.015;
        n.y = n.baseY + Math.sin(n.phase) * 14;

        // Draw connecting hairlines between nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.08;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(10, 132, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 245, 247, ${n.alpha * 0.55})`;
        ctx.fill();

        // Occasional blue accent node
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(10, 132, 255, 0.12)";
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Subtle High-Tech Isometric Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 25%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 25%, black 40%, transparent 85%)",
        }}
      />

      {/* 2. Interactive Canvas for dynamic waveforms & neural inventory nodes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* 3. Deep Atmospheric Gradient Aura Orbs */}
      <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-apple-blue/10 rounded-full blur-[140px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-[#5E5CE6]/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-2/3 -left-32 w-[600px] h-[600px] bg-[#30D158]/5 rounded-full blur-[160px] pointer-events-none" />
    </div>
  );
};
