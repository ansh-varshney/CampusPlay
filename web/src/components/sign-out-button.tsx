'use client'

import { LogOut } from 'lucide-react'
import { signOut } from '@/actions/auth'
import { cn } from '@/lib/utils'

interface SignOutButtonProps {
    className?: string
    variant?: 'mobile' | 'desktop'
}

export function SignOutButton({ className, variant = 'desktop' }: SignOutButtonProps) {
    return (
        <button
            onClick={() => signOut()}
            suppressHydrationWarning
            className={cn(
                'flex items-center transition-colors rounded-lg',
                variant === 'desktop'
                    ? 'space-x-3 px-4 py-3 w-full text-left text-gray-700 hover:text-red-600 hover:bg-red-50 dark:text-gray-200 dark:hover:text-red-400 dark:hover:bg-red-950/40'
                    : 'flex-col justify-center space-y-1 w-full h-full text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400',
                className
            )}
        >
            <LogOut className={cn(variant === 'desktop' ? 'w-5 h-5' : 'w-6 h-6')} />
            <span className={cn(variant === 'desktop' ? 'font-medium' : 'text-[10px] font-medium')}>
                Logout
            </span>
        </button>
    )
}
