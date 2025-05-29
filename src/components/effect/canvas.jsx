// src/components/CanvasBackground.jsx
import React, { useRef, useEffect } from "react";

const CanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();

    let w = window.innerWidth;
    let h = window.innerHeight;

    let dots = [];
    const dotRadius = window.innerWidth < 768 ? 2 : 2;
    const hoverRadius = window.innerWidth < 768 ? 12 : 30;
    let hoverTarget = null;
    let mouse = { x: 0, y: 0 };

    for (let i = 0; i < 32; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: -0.5 + Math.random(),
        vy: -0.5 + Math.random(),
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        // 设置发光效果（可选）
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgba(176, 132, 255, 0.8)";

        // 画点，统一透明紫色
        ctx.beginPath();
        ctx.fillStyle = "rgba(176, 132, 255, 0.8)"; // 普通紫色节点，透明度更低
        ctx.arc(d.x, d.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // 重置阴影，避免影响线条

        // 连接线（平滑透明紫线）
        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dx = d.x - d2.x;
          const dy = d.y - d2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();

            // 可选：透明度随距离线性变化，但上限为 0.3
            const alpha = Math.min(0.5, (1.3 - dist / 200) * 0.5);
            ctx.strokeStyle = `rgba(176, 132, 255, ${alpha})`;

            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    // 鼠标移动事件
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    // 窗口尺寸变化
    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      resizeCanvas();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto", // 支持鼠标事件
      }}
    />
  );
};

export default CanvasBackground;
