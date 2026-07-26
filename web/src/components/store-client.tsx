'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogBody,
    DialogFooter,
    DialogClose,
} from './ui/dialog'
import { Button } from './ui/button'
import {
    createStoreItem,
    updateStoreItem,
    deleteStoreItem,
    deductStoreItem,
} from '@/actions/store'
import { Plus, Edit2, Trash2, MinusCircle } from 'lucide-react'
import { IiitTeamsStore } from '@/db/schema'

interface StoreClientProps {
    initialItems: IiitTeamsStore[]
}

export default function StoreClient({ initialItems }: StoreClientProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeductModalOpen, setIsDeductModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<IiitTeamsStore | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form states
    const [name, setName] = useState('')
    const [stock, setStock] = useState(0)
    const [deductAmount, setDeductAmount] = useState(1)

    const handleOpenAdd = () => {
        setName('')
        setStock(0)
        setError('')
        setIsAddModalOpen(true)
    }

    const handleOpenEdit = (item: IiitTeamsStore) => {
        setSelectedItem(item)
        setName(item.name)
        setStock(item.stock_quantity)
        setError('')
        setIsEditModalOpen(true)
    }

    const handleOpenDeduct = (item: IiitTeamsStore) => {
        setSelectedItem(item)
        setDeductAmount(1)
        setError('')
        setIsDeductModalOpen(true)
    }

    const handleAdd = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await createStoreItem(name, stock)
            if (res.error) throw new Error(res.error)
            window.location.reload()
        } catch (e: any) {
            setError(e.message || 'Error adding item')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = async () => {
        if (!selectedItem) return
        setLoading(true)
        setError('')
        try {
            const res = await updateStoreItem(selectedItem.id, name, stock)
            if (res.error) throw new Error(res.error)
            window.location.reload()
        } catch (e: any) {
            setError(e.message || 'Error updating item')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        try {
            const res = await deleteStoreItem(id)
            if (res.error) throw new Error(res.error)
            window.location.reload()
        } catch (e: any) {
            alert(e.message || 'Error deleting item')
        }
    }

    const handleDeduct = async () => {
        if (!selectedItem) return
        setLoading(true)
        setError('')
        try {
            const res = await deductStoreItem(selectedItem.id, deductAmount)
            if (res?.error) throw new Error(res.error)
            window.location.reload()
        } catch (e: any) {
            setError(e.message || 'Error deducting item')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900 shadow rounded-lg p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-end mb-4">
                <Button onClick={handleOpenAdd} className="bg-amber-600 hover:bg-amber-700 text-white border-0">
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                            <th className="p-3 text-gray-700 dark:text-gray-300">Name</th>
                            <th className="p-3 text-gray-700 dark:text-gray-300">Stock Quantity</th>
                            <th className="p-3 text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialItems.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-500">
                                    No items in store.
                                </td>
                            </tr>
                        ) : (
                            initialItems.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                                    <td className="p-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock_quantity > 0 ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400'}`}>
                                            {item.stock_quantity} in stock
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenDeduct(item)} disabled={item.stock_quantity === 0}>
                                                <MinusCircle className="w-4 h-4 mr-1" /> Deduct
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleOpenEdit(item)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ADD MODAL */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Store Item</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input type="text" className="w-full border p-2 rounded dark:bg-slate-950 dark:border-slate-800" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Initial Stock</label>
                            <input type="number" min="0" className="w-full border p-2 rounded dark:bg-slate-950 dark:border-slate-800" value={stock} onChange={e => setStock(parseInt(e.target.value) || 0)} />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleAdd} disabled={loading || !name} className="bg-amber-600 hover:bg-amber-700 text-white">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT MODAL */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Store Item</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input type="text" className="w-full border p-2 rounded dark:bg-slate-950 dark:border-slate-800" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                            <input type="number" min="0" className="w-full border p-2 rounded dark:bg-slate-950 dark:border-slate-800" value={stock} onChange={e => setStock(parseInt(e.target.value) || 0)} />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleEdit} disabled={loading || !name} className="bg-amber-600 hover:bg-amber-700 text-white">Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* DEDUCT MODAL */}
            <Dialog open={isDeductModalOpen} onOpenChange={setIsDeductModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Deduct Stock</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <p className="text-sm text-gray-500 dark:text-gray-400">How many items are being taken from <strong>{selectedItem?.name}</strong>?</p>
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount to Deduct</label>
                            <input type="number" min="1" max={selectedItem?.stock_quantity} className="w-full border p-2 rounded dark:bg-slate-950 dark:border-slate-800" value={deductAmount} onChange={e => setDeductAmount(parseInt(e.target.value) || 1)} />
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleDeduct} disabled={loading || deductAmount < 1 || deductAmount > (selectedItem?.stock_quantity || 0)} className="bg-amber-600 hover:bg-amber-700 text-white">Deduct</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
