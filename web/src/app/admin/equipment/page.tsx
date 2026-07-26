import { getEquipmentList } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import { EquipmentForm } from '@/components/equipment-form'
import { SportFilter } from '@/components/sport-filter'
import { ImageGallery } from '@/components/image-gallery'

export default async function EquipmentManagement({
    searchParams,
}: {
    searchParams: Promise<{ sport?: string }>
}) {
    const params = await searchParams
    const sport = params.sport || ''

    // Only fetch equipment if sport is selected
    const equipment = sport && sport !== 'all' ? await getEquipmentList(sport) : []

    const conditionVariants: Record<string, 'success' | 'warning' | 'danger'> = {
        good: 'success',
        minor_damage: 'warning',
        damaged: 'danger',
        lost: 'danger',
    }

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Equipment Management</h1>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                        Track condition, usage, and manage inventory
                    </p>
                </div>
                {sport && sport !== 'all' && (
                    <EquipmentForm mode="create" sport={sport}>
                        <Button className="bg-[#004d40] hover:bg-[#004d40]/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Equipment
                        </Button>
                    </EquipmentForm>
                )}
            </header>

            {/* Filters */}
            <SportFilter />

            {/* No Sport Selected State */}
            {!sport || sport === 'all' ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                <ImageIcon className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                                Please Select a Sport
                            </h3>
                            <p className="text-gray-500 dark:text-slate-400 text-sm max-w-md mx-auto">
                                Choose a sport from the dropdown above to view and manage equipment
                                for that sport.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* Equipment Table */
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-slate-100">
                            Equipment Inventory ({equipment.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {equipment.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                                <p>No equipment found for {sport}.</p>
                                <EquipmentForm mode="create" sport={sport}>
                                    <Button variant="outline" className="mt-4">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Equipment
                                    </Button>
                                </EquipmentForm>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold">ID/Name</TableHead>
                                            <TableHead className="font-semibold">
                                                Condition
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Usage Count
                                            </TableHead>
                                            <TableHead className="font-semibold">Vendor</TableHead>
                                            <TableHead className="font-semibold">
                                                Cost (₹)
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Lifespan
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                Pictures
                                            </TableHead>
                                            <TableHead className="font-semibold">Notes</TableHead>
                                            <TableHead className="text-right font-semibold">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {equipment.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-slate-100">
                                                            {item.equipment_id || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-600 dark:text-slate-400">
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            conditionVariants[
                                                                item.condition ?? 'good'
                                                            ] || 'default'
                                                        }
                                                    >
                                                        {(item.condition ?? '').replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded text-sm font-medium">
                                                        {item.total_usage_count || 0}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-900 dark:text-slate-100">
                                                    {item.vendor_name || '-'}
                                                </TableCell>
                                                <TableCell className="text-gray-900 dark:text-slate-100 font-medium">
                                                    {item.cost
                                                        ? `₹${parseFloat(String(item.cost)).toFixed(2)}`
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {item.condition === 'damaged' ||
                                                    item.condition === 'lost' ? (
                                                        <span className="inline-flex items-center px-2 py-1 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded text-sm font-medium">
                                                            {item.total_usage_count || 0} uses
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500 dark:text-slate-400 text-sm">
                                                            Active
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.pictures && item.pictures.length > 0 ? (
                                                        <ImageGallery
                                                            images={item.pictures}
                                                            equipmentName={item.name}
                                                        >
                                                            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium underline">
                                                                {item.pictures.length} image
                                                                {item.pictures.length > 1
                                                                    ? 's'
                                                                    : ''}
                                                            </button>
                                                        </ImageGallery>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 dark:text-slate-500">
                                                            None
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-sm text-gray-900 dark:text-slate-100">
                                                    {item.notes || '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <EquipmentForm
                                                            mode="edit"
                                                            equipment={item}
                                                            sport={sport}
                                                        >
                                                            <Button variant="ghost" size="sm">
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </EquipmentForm>
                                                        <EquipmentForm
                                                            mode="delete"
                                                            equipment={item}
                                                            sport={sport}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </EquipmentForm>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
