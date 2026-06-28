/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
})

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "vite-ui-theme",
    ...props
}) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement

        const applyTheme = () => {
            root.classList.remove("light", "dark")

            if (theme === "system") {
                const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                root.classList.add(systemTheme)
            } else {
                root.classList.add(theme)
            }
        }

        applyTheme()

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
            const handleChange = () => {
                applyTheme()
            }

            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener("change", handleChange)
            } else {
                mediaQuery.addListener(handleChange)
            }

            return () => {
                if (mediaQuery.removeEventListener) {
                    mediaQuery.removeEventListener("change", handleChange)
                } else {
                    mediaQuery.removeListener(handleChange)
                }
            }
        }
    }, [theme])

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")

    return context
}
