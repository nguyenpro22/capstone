"use client";

import type React from "react";

import { useEffect, useRef } from "react";

interface AnimatedGradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedGradientBackground({
  children,
  className = "",
}: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = [
      "rgba(139, 92, 246, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(236, 72, 153, 0.8)",
    ];
    const circles: Circle[] = [];

    class Circle {
      x: number;
      y: number;
      radius: number;
      color: string;
      dx: number;
      dy: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 100 + 50;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.dx = (Math.random() - 0.5) * 0.5;
        this.dy = (Math.random() - 0.5) * 0.5;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x + this.radius > width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }

        if (this.y + this.radius > height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        this.draw();
      }
    }

    for (let i = 0; i < 5; i++) {
      circles.push(new Circle());
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx?.clearRect(0, 0, width, height);

      circles.forEach((circle) => {
        circle.update();
      });
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute  inset-0 -z-10 opacity-50" />
      {children}
    </div>
  );
}
