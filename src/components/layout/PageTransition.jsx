// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
};

export default function PageTransition({ children, className }) {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className={className}
        >
            {children}
        </motion.div>
    );
}
