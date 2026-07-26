'use server'

import { db } from '@/db'
import { bookings, profiles, courts } from '@/db/schema'
import { getCurrentUser } from '@/lib/session'
import { eq, and, gt, lt, ne } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { addMinutes } from 'date-fns'
import { sendNotification } from '@/actions/notifications'

async function verifyAdmin() {
    const user = await getCurrentUser()
    if (!user) throw new Error('Unauthorized: No user logged in')

    const [profile] = await db
        .select({ role: profiles.role })
        .from(profiles)
        .where(eq(profiles.id, user.id))

    if (!profile || (profile.role !== 'admin' && profile.role !== 'superuser')) {
        throw new Error('Forbidden: Admin access required')
    }
    return user
}

export async function createTeamBooking(prevState: any, formData: FormData) {
    try {
        const user = await verifyAdmin()
        
        const courtId = formData.get('courtId') as string
        const startTimeStr = formData.get('startTime') as string
        const durationParam = formData.get('duration') as string
        const teamName = formData.get('teamName') as string
        
        if (!courtId || !startTimeStr || !durationParam || !teamName) {
            return { error: 'Missing required booking details' }
        }

        const startTime = new Date(startTimeStr)
        const duration = parseInt(durationParam)
        const endTime = addMinutes(startTime, duration)

        if (startTime < new Date()) {
            return { error: 'Cannot book a slot in the past' }
        }

        // 1. Find conflicting bookings
        const conflictingBookings = await db
            .select({ 
                id: bookings.id, 
                user_id: bookings.user_id 
            })
            .from(bookings)
            .where(
                and(
                    eq(bookings.court_id, courtId),
                    ne(bookings.status, 'cancelled'),
                    ne(bookings.status, 'rejected'),
                    lt(bookings.start_time, endTime),
                    gt(bookings.end_time, startTime)
                )
            )

        // 2. Overwrite conflicting student bookings
        for (const conflict of conflictingBookings) {
            // Update status to cancelled
            await db
                .update(bookings)
                .set({ status: 'cancelled' })
                .where(eq(bookings.id, conflict.id))
                
            // Fetch court info for notification
            const [courtInfo] = await db
                .select({ name: courts.name })
                .from(courts)
                .where(eq(courts.id, courtId))

            const timeStr = startTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
            
            // Notify student
            await sendNotification({
                recipientId: conflict.user_id,
                title: 'Booking Cancelled (Admin Override)',
                body: `Your booking for ${courtInfo?.name || 'Court'} at ${timeStr} was cancelled by an Admin for a Team Practice session.`,
                type: 'system',
                data: { relatedId: conflict.id }
            })
        }

        // 3. Create the team booking
        await db.insert(bookings).values({
            user_id: user.id,
            court_id: courtId,
            start_time: startTime,
            end_time: endTime,
            status: 'confirmed', // Instantly confirmed
            is_priority: true, // Team booking priority
            num_players: 10, // Assuming a full team
            notes: `Team Booking: ${teamName}`
        })

        revalidatePath('/admin/team-booking')
        revalidatePath('/student/book')
        return { success: true }
    } catch (e: any) {
        return { error: e.message || 'Error creating team booking' }
    }
}

export async function deleteTeamBooking(bookingId: string) {
    try {
        await verifyAdmin()
        await db.update(bookings).set({ status: 'cancelled' }).where(eq(bookings.id, bookingId))
        revalidatePath('/admin/team-booking')
        return { success: true }
    } catch (e: any) {
        return { error: e.message || 'Error deleting booking' }
    }
}
