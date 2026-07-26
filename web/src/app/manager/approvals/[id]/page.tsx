import { getBookingDetails } from '@/actions/manager'
import { ManagerApprovalScreen } from '@/components/manager-approval-screen'
import { notFound } from 'next/navigation'

export default async function ManagerApprovalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const booking = await getBookingDetails(id)

    if (!booking) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pb-8 transition-colors duration-200">
            <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10 px-4 h-14 flex items-center justify-center">
                <span className="font-bold text-gray-900 dark:text-slate-100">Session Details</span>
            </header>

            <main className="p-4">
                <ManagerApprovalScreen booking={booking} />
            </main>
        </div>
    )
}
