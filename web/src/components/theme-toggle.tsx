'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
    className?: string
    showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <button
            onClick={toggleTheme}
            type="button"
            aria-label="Toggle dark mode"
            className={cn(
                'flex items-center justify-center p-2 rounded-lg transition-colors',
                'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800',
                className
            )}
        >
            {resolvedTheme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
            ) : (
                <Moon className="w-5 h-5 text-slate-700" />
            )}
            {showLabel && (
                <span className="ml-2 text-sm font-medium">
                    {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
            )}
        </button>
    )
}
