import { useTheme } from "./theme-provider"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="relative h-10 w-10 rounded-full glass-panel hover:bg-primary/10 border-transparent hover:border-primary/20 transition-all duration-300 overflow-hidden"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                    <motion.div
                        key="moon"
                        initial={{ y: 20, rotate: 45, opacity: 0 }}
                        animate={{ y: 0, rotate: 0, opacity: 1 }}
                        exit={{ y: -20, rotate: -45, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ y: 20, rotate: 45, opacity: 0 }}
                        animate={{ y: 0, rotate: 0, opacity: 1 }}
                        exit={{ y: -20, rotate: -45, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    )
}
