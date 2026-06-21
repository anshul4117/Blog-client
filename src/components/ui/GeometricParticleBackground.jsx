import { useEffect, useRef } from "react";

export default function GeometricParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let animationFrameId;
        let particles = [];

        let primaryRGB = "108, 113, 196"; // default base violet
        let secondaryRGB = "42, 161, 152"; // default base cyan

        const hexToRgb = (hex) => {
            let c = hex.replace("#", "").trim();
            if (c.length === 3) {
                c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
            }
            const num = parseInt(c, 16);
            if (isNaN(num)) return null;
            return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
        };

        const updateColors = () => {
            const style = getComputedStyle(document.documentElement);
            const primary = style.getPropertyValue('--color-primary').trim();
            const secondary = style.getPropertyValue('--color-secondary').trim();
            const pRgb = hexToRgb(primary);
            const sRgb = hexToRgb(secondary);
            if (pRgb) primaryRGB = pRgb;
            if (sRgb) secondaryRGB = sRgb;
        };

        updateColors();

        // Listen for class changes on documentElement to update colors instantly
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    updateColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const mouse = {
            x: null,
            y: null,
            radius: 170
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

        class GeometricParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 12 + 8; // Shape bounding size (increased for visibility)
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = -Math.random() * 0.45 - 0.15; // Slow drifting upward motion
                this.shape = ['square', 'triangle', 'cross', 'circle'][Math.floor(Math.random() * 4)];
                this.angle = Math.random() * Math.PI * 2;
                this.spinSpeed = (Math.random() - 0.5) * 0.015;
                this.alpha = Math.random() * 0.3 + 0.35; // Increased visibility in both modes
                this.rgb = Math.random() > 0.5 ? primaryRGB : secondaryRGB;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.angle += this.spinSpeed;

                // Mouse interaction - gentle push-away physics
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x += (dx / distance) * force * 1.6;
                        this.y += (dy / distance) * force * 1.6;
                        this.angle += this.spinSpeed * 6; // Spin faster near user cursor
                    }
                }

                // boundary wrap-around
                if (this.y < -20) {
                    this.y = canvas.height + 20;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x < -20) this.x = canvas.width + 20;
                if (this.x > canvas.width + 20) this.x = -20;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = `rgba(${this.rgb}, ${this.alpha * 0.45})`; // Soft semi-transparent fill
                ctx.strokeStyle = `rgba(${this.rgb}, ${this.alpha * 1.35})`; // Strong outline
                ctx.lineWidth = 1.35; // Thicker line for crisp visibility

                if (this.shape === 'square') {
                    ctx.beginPath();
                    ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                    ctx.stroke();
                    ctx.fill();
                } else if (this.shape === 'triangle') {
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(this.size / 2, this.size / 2);
                    ctx.lineTo(-this.size / 2, this.size / 2);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                } else if (this.shape === 'cross') {
                    ctx.beginPath();
                    ctx.moveTo(-this.size / 2, 0);
                    ctx.lineTo(this.size / 2, 0);
                    ctx.moveTo(0, -this.size / 2);
                    ctx.lineTo(0, this.size / 2);
                    ctx.stroke();
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = window.innerWidth < 768 ? 25 : 55; // Optimized particle density for mobile smoothness
            for (let i = 0; i < particleCount; i++) {
                particles.push(new GeometricParticle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        initParticles();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
