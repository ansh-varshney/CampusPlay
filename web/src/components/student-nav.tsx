'use client'

import Link from 'next/link'
import { Home, CalendarPlus, History, User, Trophy, Bell, Inbox } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@/components/sign-out-button'
import { ThemeToggle } from '@/components/theme-toggle'

export function StudentNav() {
    const pathname = usePathname()

    const links = [
        { href: '/student', label: 'Home', icon: Home },
        { href: '/student/book', label: 'Book', icon: CalendarPlus },
        { href: '/student/reservations', label: 'Reservations', icon: History },
        { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
        { href: '/student/notifications', label: 'Alerts', icon: Bell },
        { href: '/student/play-requests', label: 'Requests', icon: Inbox },
        { href: '/student/profile', label: 'Profile', icon: User },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shadow-lg md:relative md:border-t-0 md:bg-transparent md:dark:bg-transparent md:shadow-none">
            {/* Mobile View */}
            <div className="flex justify-around items-center h-16 md:hidden">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full space-y-1',
                                isActive
                                    ? 'text-[#004d40] dark:text-teal-400'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                            )}
                        >
                            <Icon className={cn('w-6 h-6', isActive && 'fill-current')} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    )
                })}
                <ThemeToggle className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200" />
                <SignOutButton variant="mobile" className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" />
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex flex-col space-y-4 fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4">
                <div className="h-16 flex items-center justify-between px-4">
                    <span className="font-bold text-xl text-[#004d40] dark:text-teal-400">SportPortal</span>
                    <ThemeToggle />
                </div>
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                                isActive
                                    ? 'bg-[#004d40]/10 text-[#004d40] dark:bg-teal-950/40 dark:text-teal-400 font-semibold'
                                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-slate-800'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{label}</span>
                        </Link>
                    )
                })}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
                    <SignOutButton variant="desktop" />
                </div>
            </div>
        </nav>
    )
}
