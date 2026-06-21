import { useEffect, useRef } from "react";

export default function ParticleBackground() {
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

        const mouse = {
            x: null,
            y: null,
            radius: 185
        };

        let burstParticles = [];

        class BurstParticle {
            constructor(x, y, rgb) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.5 + 1.2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = Math.random() * 3 + 1;
                this.rgb = rgb;
                this.alpha = 1;
                this.decay = Math.random() * 0.025 + 0.015;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.rgb}, ${this.alpha})`;
                ctx.fill();
            }
        }

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        const handleCanvasClick = (e) => {
            const rgb = Math.random() > 0.5 ? primaryRGB : secondaryRGB;
            // Spawn 15 responsive burst particles upon user click
            for (let i = 0; i < 15; i++) {
                burstParticles.push(new BurstParticle(e.clientX, e.clientY, rgb));
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("click", handleCanvasClick);

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.45; // Energetic but smooth drifting velocity
                this.vy = (Math.random() - 0.5) * 0.45;
                this.size = Math.random() * 3 + 1.2; // Brighter and larger particles
                this.type = Math.random() > 0.5 ? 'primary' : 'secondary';
                this.alpha = Math.random() * 0.4 + 0.35; // Increased visibility in both modes
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const rgb = this.type === 'primary' ? primaryRGB : secondaryRGB;
                ctx.fillStyle = `rgba(${rgb}, ${this.alpha})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = window.innerWidth < 768 ? 45 : 130; // Optimized particle density for mobile performance
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Update and draw main drifting particles
            particles.forEach((p, index) => {
                p.update();

                // Mouse interaction - advanced attraction + close repulsion physics
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;

                        if (distance > 38) {
                            // Gentle attraction at medium range
                            p.x += (dx / distance) * force * 0.65;
                            p.y += (dy / distance) * force * 0.65;
                        } else {
                            // Tactile repulsion at very close range (prevents clamping)
                            const pushForce = (38 - distance) / 38;
                            p.x -= (dx / distance) * pushForce * 1.5;
                            p.y -= (dy / distance) * pushForce * 1.5;
                        }

                        // Draw line connecting particle to cursor (increased visibility)
                        ctx.beginPath();
                        const rgb = p.type === 'primary' ? primaryRGB : secondaryRGB;
                        ctx.strokeStyle = `rgba(${rgb}, ${force * 0.35})`;
                        ctx.lineWidth = 0.85;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }

                p.draw();

                // Inter-particle connection lines (increased opacity and width)
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 130) { // Increased distance threshold for longer, richer webs
                        ctx.beginPath();
                        const rgb = p.type === 'primary' ? primaryRGB : secondaryRGB;
                        ctx.strokeStyle = `rgba(${rgb}, ${(0.28 - distance / 500)})`;
                        ctx.lineWidth = 0.7;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            // 2. Update and draw click burst particles
            burstParticles.forEach((bp) => {
                bp.update();
                bp.draw();
            });
            burstParticles = burstParticles.filter((bp) => bp.alpha > 0);

            animationFrameId = requestAnimationFrame(animate);
        };

        initParticles();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("click", handleCanvasClick);
            cancelAnimationFrame(animationFrameId);
            observer.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
}
