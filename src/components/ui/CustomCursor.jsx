import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring configuration for smooth following
    const springConfig = { damping: 25, stiffness: 250 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = 
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.onclick || 
                window.getComputedStyle(target).cursor === 'pointer';
            setIsHovering(isClickable);
        };

        window.addEventListener("mousemove", moveMouse);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveMouse);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] hidden lg:block"
            style={{
                x: cursorX,
                y: cursorY,
                translateX: "-50%",
                translateY: "-50%",
                border: "1.5px solid var(--color-primary)",
                background: isHovering ? "rgba(124, 58, 237, 0.15)" : "transparent",
                scale: isHovering ? 2.5 : 1,
                mixBlendMode: "difference"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm opacity-50" />
        </motion.div>
    );
}
