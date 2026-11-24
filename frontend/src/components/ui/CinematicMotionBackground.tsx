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

    // 1. Telemetry Nodes (Delicate Rose Gold Inventory Flow Grid)
    const nodeCount = Math.floor(Math.min(width, 1400) / 42);
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
        speed: 0.12 + Math.random() * 0.28,
        radius: 1 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.15 + Math.random() * 0.35,
      });
    }

    // 2. Oscilloscope / Demand Waves
    let waveOffset = 0;

    const render = () => {
      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // --- Layer A: Ambient Radial Spotlight following cursor (Rose Gold aura) ---
      const mouseGrad = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        Math.min(width * 0.5, 550)
      );
      mouseGrad.addColorStop(0, "rgba(183, 110, 121, 0.07)");
      mouseGrad.addColorStop(0.5, "rgba(226, 180, 189, 0.025)");
      mouseGrad.addColorStop(1, "rgba(250, 248, 245, 0)");
      ctx.fillStyle = mouseGrad;
      ctx.fillRect(0, 0, width, height);

      // --- Layer B: Top Ambient Rose Gold / Champagne Core Glow ---
      const topGrad = ctx.createRadialGradient(
        width * 0.5,
        120,
        20,
        width * 0.5,
        120,
        width * 0.6
      );
      topGrad.addColorStop(0, "rgba(197, 128, 139, 0.09)");
      topGrad.addColorStop(0.4, "rgba(183, 110, 121, 0.03)");
      topGrad.addColorStop(1, "rgba(250, 248, 245, 0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height * 0.85);

      // --- Layer C: Demand Flow Waveform Lines (Delicate Rose Gold curves) ---
      waveOffset += 0.007;

      const waves = [
        {
          amplitude: 28,
          frequency: 0.0018,
          yOffset: height * 0.42,
          color: "rgba(183, 110, 121, 0.14)",
          lineWidth: 1.2,
          speed: 1.0,
        },
        {
          amplitude: 38,
          frequency: 0.0012,
          yOffset: height * 0.48,
          color: "rgba(197, 128, 139, 0.10)",
          lineWidth: 1.5,
          speed: 0.75,
        },
        {
          amplitude: 20,
          frequency: 0.0024,
          yOffset: height * 0.54,
          color: "rgba(212, 163, 115, 0.09)",
          lineWidth: 1.0,
          speed: 1.25,
        },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.lineWidth;

        for (let x = 0; x <= width; x += 6) {
          const distanceToMouse = Math.abs(x - mouse.x);
          const mouseDamp = Math.max(0, 1 - distanceToMouse / (width * 0.35));
          const interactiveWarp = Math.sin((x - mouse.x) * 0.015) * 12 * mouseDamp;

          const y =
            w.yOffset +
            Math.sin(x * w.frequency + waveOffset * w.speed) * w.amplitude +
            Math.cos(x * w.frequency * 0.5 + waveOffset * 0.5) * (w.amplitude * 0.4) +
            interactiveWarp;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // --- Layer D: Telemetry Nodes (Soft Rose Gold Data Points) ---
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.phase += node.speed * 0.04;
        node.y = node.baseY + Math.sin(node.phase) * 14;

        // Subtle proximity connection to adjacent nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.08;
            ctx.strokeStyle = `rgba(183, 110, 121, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node dot
        ctx.fillStyle = `rgba(183, 110, 121, ${node.alpha * 0.65})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Underlying warm off-white canvas */}
      <div className="absolute inset-0 bg-[#FAF8F5]" />

      {/* 2. Delicate Rose Gold Ambient Glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#B76E79]/8 via-[#C5808B]/4 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[650px] h-[450px] bg-gradient-to-tl from-[#D4A373]/6 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* 3. Interactive WebGL/2D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 4. Delicate architectural grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(183, 110, 121, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(183, 110, 121, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)",
        }}
      />
    </div>
  );
};
