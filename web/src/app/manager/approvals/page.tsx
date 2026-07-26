import { getCurrentBookings } from '@/actions/manager'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Clock, ChevronRight } from 'lucide-react'

const statusColors: Record<string, string> = {
    pending_confirmation: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900',
    confirmed: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    waiting_manager: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    active: 'bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900',
}

const statusLabels: Record<string, string> = {
    pending_confirmation: 'Pending',
    confirmed: 'Confirmed',
    waiting_manager: 'Waiting',
    active: 'Active',
}

// Format time in IST regardless of server timezone
function formatTimeIST(dateStr: string | Date): string {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
    })
}

export default async function ApprovalsPage() {
    const bookings = await getCurrentBookings()

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Today&apos;s Bookings</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 -mt-2">Tap a booking to manage it</p>

            {bookings.length === 0 ? (
                <div className="p-8 text-center text-gray-400 dark:text-slate-500 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl">
                    No bookings right now.
                </div>
            ) : (
                <div className="space-y-3">
                    {bookings.map((booking: any) => (
                        <Link key={booking.id} href={`/manager/approvals/${booking.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-400 mb-3 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                {booking.courts?.name}
                                            </h3>
                                            <span
                                                className={cn(
                                                    'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full border',
                                                    statusColors[booking.status] ||
                                                        'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
                                                )}
                                            >
                                                {statusLabels[booking.status] || booking.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-slate-300 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-gray-500 dark:text-slate-400" />
                                            {formatTimeIST(booking.start_time)} –{' '}
                                            {formatTimeIST(booking.end_time)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                            {booking.profiles?.full_name || 'Unknown'}
                                            {booking.equipment_names?.length > 0 && (
                                                <span className="text-gray-400 dark:text-slate-500">
                                                    {' '}
                                                    · {booking.equipment_names.join(', ')}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-slate-500 shrink-0" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

