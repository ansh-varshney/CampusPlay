import { getCoordinators } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone } from 'lucide-react'
import { CoordinatorForm } from '@/components/coordinator-form'
import { SportFilter } from '@/components/sport-filter'

export default async function CoordinatorsManagement({
    searchParams,
}: {
    searchParams: Promise<{ sport?: string }>
}) {
    const params = await searchParams
    const sport = params.sport || 'all'
    const coordinators = await getCoordinators(sport)

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Coordinator Information</h1>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                        Manage coach and team coordinator details
                    </p>
                </div>
                <CoordinatorForm mode="create">
                    <Button className="bg-[#004d40] hover:bg-[#004d40]/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Coordinator
                    </Button>
                </CoordinatorForm>
            </header>

            {/* Filters */}
            <SportFilter />

            {/* Coordinators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coordinators.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="text-center py-12 text-gray-500 dark:text-slate-400">
                            <p>No coordinators found.</p>
                            <CoordinatorForm mode="create">
                                <Button variant="outline" className="mt-4">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add First Coordinator
                                </Button>
                            </CoordinatorForm>
                        </CardContent>
                    </Card>
                ) : (
                    coordinators.map((coordinator: any) => (
                        <Card key={coordinator.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {coordinator.name}
                                        </CardTitle>
                                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                            {coordinator.role}
                                        </p>
                                    </div>
                                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-[#004d40]/10 dark:bg-teal-950/60 text-[#004d40] dark:text-teal-300 capitalize">
                                        {coordinator.sport}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {coordinator.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                        <Mail className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                                        <a
                                            href={`mailto:${coordinator.email}`}
                                            className="hover:text-[#004d40] dark:hover:text-teal-400"
                                        >
                                            {coordinator.email}
                                        </a>
                                    </div>
                                )}
                                {coordinator.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                                        <Phone className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                                        <a
                                            href={`tel:${coordinator.phone}`}
                                            className="hover:text-[#004d40] dark:hover:text-teal-400"
                                        >
                                            {coordinator.phone}
                                        </a>
                                    </div>
                                )}
                                {coordinator.notes && (
                                    <p className="text-sm text-gray-600 dark:text-slate-400 border-t border-gray-100 dark:border-slate-800 pt-2 mt-2">
                                        {coordinator.notes}
                                    </p>
                                )}
                                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-slate-800 mt-3">
                                    <CoordinatorForm mode="edit" coordinator={coordinator}>
                                        <Button variant="outline" size="sm" className="flex-1">
                                            Edit
                                        </Button>
                                    </CoordinatorForm>
                                    <CoordinatorForm mode="delete" coordinator={coordinator}>
                                        <Button variant="destructive" size="sm" className="flex-1">
                                            Delete
                                        </Button>
                                    </CoordinatorForm>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
