'use client'

import Link from 'next/link'
import { LayoutDashboard, CheckSquare, ClipboardList, BellRing } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { SignOutButton } from '@/components/sign-out-button'
import { ThemeToggle } from '@/components/theme-toggle'

export function ManagerNav() {
    const pathname = usePathname()

    const links = [
        { href: '/manager', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/manager/approvals', label: 'Approvals', icon: CheckSquare },
        { href: '/manager/active', label: 'Active Sessions', icon: ClipboardList },
        { href: '/manager/notifications', label: 'Notifications', icon: BellRing },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#004d40] dark:bg-slate-900 text-white shadow-lg md:relative md:bg-transparent md:text-gray-900 md:shadow-none">
            {/* Mobile View */}
            <div className="flex justify-around items-center h-16 md:hidden">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                                isActive ? 'text-yellow-400' : 'text-white/70 hover:text-white'
                            )}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    )
                })}
                <ThemeToggle className="text-white/80 hover:text-white hover:bg-white/10" />
                <SignOutButton variant="mobile" className="text-white/80 hover:text-red-300" />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col space-y-4 fixed left-0 top-0 bottom-0 w-64 bg-[#004d40] dark:bg-slate-900 text-white p-4 border-r border-teal-800 dark:border-slate-800">
                <div className="h-16 flex items-center justify-between px-4 font-bold text-xl">
                    <span>Manager Panel</span>
                    <ThemeToggle className="text-white/80 hover:text-white hover:bg-white/10 dark:text-gray-300 dark:hover:bg-slate-800" />
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
                                    ? 'bg-white/10 text-yellow-400 font-semibold'
                                    : 'text-white/80 hover:bg-white/5'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{label}</span>
                        </Link>
                    )
                })}
                <div className="mt-auto pt-4 border-t border-white/10 dark:border-slate-800">
                    <SignOutButton variant="desktop" className="text-white/80 hover:text-red-300 hover:bg-white/10" />
                </div>
            </div>
        </nav>
    )
}
