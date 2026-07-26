'use client'

import Link from 'next/link'
import {
    LayoutDashboard,
    Package,
    MapPin,
    Calendar,
    AlertTriangle,
    Bell,
    MessageSquare,
    Users,
    ScrollText,
    BellRing,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@/components/sign-out-button'
import { ThemeToggle } from '@/components/theme-toggle'

export function AdminNav() {
    const pathname = usePathname()

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/equipment', label: 'Equipment', icon: Package },
        { href: '/admin/courts', label: 'Courts', icon: MapPin },
        { href: '/admin/reservations', label: 'Reservations', icon: Calendar },
        { href: '/admin/defaulters', label: 'Defaulters', icon: AlertTriangle },
        { href: '/admin/announcements', label: 'Announcements', icon: Bell },
        { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
        { href: '/admin/coordinators', label: 'Sport Info', icon: Users },
        { href: '/admin/logs', label: 'Logs', icon: ScrollText },
        { href: '/admin/notifications', label: 'Notifications', icon: BellRing },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shadow-lg md:relative md:border-t-0 md:bg-transparent md:dark:bg-transparent md:shadow-none">
            {/* Mobile View */}
            <div className="flex overflow-x-auto items-center h-16 md:hidden">
                {links.slice(0, 4).map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex flex-col items-center justify-center min-w-[20%] h-full space-y-1 transition-colors',
                                isActive
                                    ? 'text-[#004d40] dark:text-teal-400'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                            )}
                        >
                            <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')} />
                            <span className="text-[9px] font-medium">{label}</span>
                        </Link>
                    )
                })}
                <div className="min-w-[20%] flex justify-center">
                    <ThemeToggle />
                </div>
                <div className="min-w-[20%] flex justify-center">
                    <SignOutButton variant="mobile" className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col space-y-2 fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-4 overflow-y-auto">
                <div className="h-16 flex items-center justify-between px-4 font-bold text-xl text-[#004d40] dark:text-teal-400 mb-2">
                    <span>Admin Panel</span>
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
                                    ? 'bg-[#004d40] text-white dark:bg-teal-700'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{label}</span>
                        </Link>
                    )
                })}
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800">
                    <SignOutButton variant="desktop" />
                </div>
            </div>
        </nav>
    )
}
