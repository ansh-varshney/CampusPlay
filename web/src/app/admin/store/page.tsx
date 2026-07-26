import { getStoreItems } from '@/actions/store'
import StoreClient from '@/components/store-client'

export const dynamic = 'force-dynamic'

export default async function StorePage() {
    const items = await getStoreItems()

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                    IIIT Teams Store
                </h1>
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                    Manage bulk inventory and deduct stock when teams take equipment.
                </p>
            </div>
            
            <StoreClient initialItems={items} />
        </div>
    )
}
