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
                this.vx = (Math.random() - 0.5) * 0.2; // Smooth slow drifting velocity
                this.vy = (Math.random() - 0.5) * 0.2;
                this.size = Math.random() * 2 + 0.5;
                this.type = Math.random() > 0.5 ? 'primary' : 'secondary';
                this.alpha = Math.random() * 0.25 + 0.05; // Soft glow
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
            const particleCount = 70; // High density but optimized
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.update();
                p.draw();

                // Simple connection lines matching colors
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 90) {
                        ctx.beginPath();
                        const rgb = p.type === 'primary' ? primaryRGB : secondaryRGB;
                        ctx.strokeStyle = `rgba(${rgb}, ${(0.08 - distance / 1100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        initParticles();
        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
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
