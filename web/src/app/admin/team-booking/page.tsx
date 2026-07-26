import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getActiveCourts } from '@/actions/courts'
import AdminBookingUI from './admin-booking-ui'

export default async function AdminTeamBookingPage() {
    const session = await auth()
    if (!session?.user?.id) redirect('/login')
    const userId = session.user.id

    const [profile] = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.id, userId))
        .limit(1)

    if (!profile || (profile.role !== 'admin' && profile.role !== 'superuser')) {
        redirect('/')
    }

    const courts = await getActiveCourts()

    return (
        <div className="p-4 md:p-8 space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Team Booking (Admin)</h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                    Book slots for IIIT Teams up to 20 days in advance. Overwrites existing student bookings automatically.
                </p>
            </header>

            {courts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-slate-400 border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-lg">
                    No courts available.
                </div>
            ) : (
                <AdminBookingUI initialCourts={courts} />
            )}
        </div>
    )
}
