import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'

function TestComponent() {
    const { theme, resolvedTheme } = useTheme()
    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <span data-testid="resolved">{resolvedTheme}</span>
            <ThemeToggle showLabel />
        </div>
    )
}

describe('Theme System', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.className = ''
        vi.stubGlobal(
            'matchMedia',
            vi.fn().mockImplementation((query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            }))
        )
    })

    it('renders default theme and toggles theme on click', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        const toggleBtn = screen.getByRole('button', { name: /toggle dark mode/i })
        expect(toggleBtn).toBeDefined()

        fireEvent.click(toggleBtn)
        expect(localStorage.getItem('theme')).toBe('dark')
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
})
