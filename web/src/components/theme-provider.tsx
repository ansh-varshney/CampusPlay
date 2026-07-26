'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('system')
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('theme') as Theme | null
        if (saved && ['light', 'dark', 'system'].includes(saved)) {
            setThemeState(saved)
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const updateTheme = () => {
            const isDark =
                theme === 'dark' || (theme === 'system' && mediaQuery.matches)

            if (isDark) {
                root.classList.add('dark')
                setResolvedTheme('dark')
            } else {
                root.classList.remove('dark')
                setResolvedTheme('light')
            }
        }

        updateTheme()

        const handleChange = () => {
            if (theme === 'system') {
                updateTheme()
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, mounted])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
