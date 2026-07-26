'use server'

import { db } from '@/db'
import { profiles, iiitTeamsStore } from '@/db/schema'
import { getCurrentUser } from '@/lib/session'
import { eq, sql, asc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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

    return { user }
}

export async function getStoreItems() {
    await verifyAdmin()
    return await db.select().from(iiitTeamsStore).orderBy(asc(iiitTeamsStore.name))
}

export async function createStoreItem(name: string, stockQuantity: number) {
    await verifyAdmin()
    await db.insert(iiitTeamsStore).values({ name, stock_quantity: stockQuantity })
    revalidatePath('/admin/store')
    return { success: true }
}

export async function updateStoreItem(id: string, name: string, stockQuantity: number) {
    await verifyAdmin()
    await db.update(iiitTeamsStore).set({ name, stock_quantity: stockQuantity, updated_at: new Date() }).where(eq(iiitTeamsStore.id, id))
    revalidatePath('/admin/store')
    return { success: true }
}

export async function deleteStoreItem(id: string) {
    await verifyAdmin()
    await db.delete(iiitTeamsStore).where(eq(iiitTeamsStore.id, id))
    revalidatePath('/admin/store')
    return { success: true }
}

export async function deductStoreItem(id: string, amount: number) {
    await verifyAdmin()
    if (amount <= 0) return { error: 'Invalid amount' }
    
    const [item] = await db.select({ stock: iiitTeamsStore.stock_quantity }).from(iiitTeamsStore).where(eq(iiitTeamsStore.id, id))
    if (!item) return { error: 'Item not found' }
    if (item.stock < amount) return { error: 'Not enough stock available' }

    await db.update(iiitTeamsStore)
        .set({ stock_quantity: sql`${iiitTeamsStore.stock_quantity} - ${amount}`, updated_at: new Date() })
        .where(eq(iiitTeamsStore.id, id))
        
    revalidatePath('/admin/store')
    return { success: true }
}
