import { useEffect, useRef } from "react";

export default function MagneticOrbBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates
    const mouse = {
      x: null,
      y: null,
      radius: 180, // Influence radius
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Resolve brand colors dynamically based on theme index.css variable
    const getThemeColor = () => {
      const isDark = document.documentElement.classList.contains("dark");
      // Forest green matching XDrop branding green
      return isDark ? { r: 75, g: 126, b: 107 } : { r: 43, g: 87, b: 72 };
    };

    class Orb {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // Keep original home coordinates for spring return
        this.homeX = this.x;
        this.homeY = this.y;
        
        this.size = Math.random() * 8 + 3; // Orb diameter
        this.alpha = Math.random() * 0.4 + 0.15; // Opacity
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
        
        // Drift velocity
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        
        // Orb magnetic attraction speed factor
        this.magneticFactor = Math.random() * 0.05 + 0.01;
      }

      update(color) {
        // Slow natural drift
        this.homeX += this.vx;
        this.homeY += this.vy;

        // Wrap around screens for home position
        if (this.homeX < 0) this.homeX = width;
        if (this.homeX > width) this.homeX = 0;
        if (this.homeY < 0) this.homeY = height;
        if (this.homeY > height) this.homeY = 0;

        // Magnetic behavior
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            // Orb gets sucked in gently towards mouse cursor
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += dx * force * this.magneticFactor;
            this.y += dy * force * this.magneticFactor;
            
            // Pulse visual sizes when active
            this.alpha += 0.01 * this.pulseDir;
            if (this.alpha > 0.7) this.alpha = 0.7;
            if (this.alpha < 0.15) this.alpha = 0.15;
          } else {
            // Return to home position via spring easing
            this.x += (this.homeX - this.x) * 0.08;
            this.y += (this.homeY - this.y) * 0.08;
            
            // Standard pulse opacity
            this.alpha += this.pulseSpeed * this.pulseDir;
            if (this.alpha > 0.55 || this.alpha < 0.15) {
              this.pulseDir = -this.pulseDir;
            }
          }
        } else {
          // No mouse - follow natural home coordinates
          this.x += (this.homeX - this.x) * 0.08;
          this.y += (this.homeY - this.y) * 0.08;

          this.alpha += this.pulseSpeed * this.pulseDir;
          if (this.alpha > 0.55 || this.alpha < 0.15) {
            this.pulseDir = -this.pulseDir;
          }
        }

        // Draw soft glowing radial gradients
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${this.alpha})`);
        gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${this.alpha * 0.4})`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const orbs = [];
    const orbCount = window.innerWidth < 768 ? 25 : 70; // Optimized orb count for mobile rendering
    for (let i = 0; i < orbCount; i++) {
      orbs.push(new Orb());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const currentColor = getThemeColor();

      for (let i = 0; i < orbs.length; i++) {
        orbs[i].update(currentColor);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-full w-full pointer-events-none z-0"
    />
  );
}
