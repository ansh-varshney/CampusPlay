import { auth } from '@/auth'
import { db } from '@/db'
import { profiles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
    Package,
    MapPin,
    Calendar,
    AlertTriangle,
    Bell,
    MessageSquare,
    Users,
    BarChart3,
    DollarSign,
    TrendingUp,
    ScrollText,
    ShoppingCart,
} from 'lucide-react'

export default async function AdminHome() {
    const session = await auth()
    const userId = session?.user?.id

    let adminName = 'Admin'
    if (userId) {
        const [profile] = await db
            .select({ full_name: profiles.full_name })
            .from(profiles)
            .where(eq(profiles.id, userId))
            .limit(1)
        adminName = profile?.full_name?.split(' ')[0] || 'Admin'
    }

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">Welcome back, {adminName}</p>
                </div>
                <div className="w-10 h-10 bg-[#004d40] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                        {adminName.charAt(0).toUpperCase()}
                    </span>
                </div>
            </header>

            {/* Core Management Modules */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Core Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link href="/admin/equipment">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-[#004d40] cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-[#004d40]/10 dark:bg-teal-950/60 rounded-lg flex items-center justify-center group-hover:bg-[#004d40]/20 transition-colors">
                                                <Package className="w-5 h-5 text-[#004d40] dark:text-teal-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Equipment Management
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            Track condition, usage, and manage inventory
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/courts">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-blue-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 transition-colors">
                                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Court Management
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            Manage courts, maintenance, and availability
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/store">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-amber-500 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/60 rounded-lg flex items-center justify-center group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60 transition-colors">
                                                <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                IIIT Teams Store
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            Manage bulk equipment stock and team deductions
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/team-booking">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-indigo-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
                                                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Team Booking
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            Book practice slots for IIIT Teams (up to 20 days ahead)
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/defaulters">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-red-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/60 rounded-lg flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/60 transition-colors">
                                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Defaulter Students
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            View flagged students and violation history
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/reservations">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-purple-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/60 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60 transition-colors">
                                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Reservations
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            View and manage court reservations
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/announcements">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-yellow-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-950/60 rounded-lg flex items-center justify-center group-hover:bg-yellow-100 dark:group-hover:bg-yellow-900/60 transition-colors">
                                                <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Announcements
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            Add and edit facility announcements
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/feedback">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-indigo-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 transition-colors">
                                                <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Feedback & Complaints
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            Review student feedback and complaints
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/coordinators">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-green-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-green-50 dark:bg-green-950/60 rounded-lg flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/60 transition-colors">
                                                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">Sport Info</h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            View sport details and information
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/logs">
                        <Card className="hover:shadow-lg transition-all border-l-4 border-l-cyan-600 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-cyan-50 dark:bg-cyan-950/60 rounded-lg flex items-center justify-center group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/60 transition-colors">
                                                <ScrollText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-slate-100">
                                                Booking Logs
                                            </h3>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">
                                            View all bookings by sport and date
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </section>

            {/* Analytics Dashboards */}
            <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">Analytics Dashboards</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/admin/analytics/financials">
                        <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-[#004d40] to-[#00695c] text-white cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg">Financials</h3>
                                </div>
                                <p className="text-sm text-white/80">
                                    Equipment costs, vendor analysis, lifespan metrics
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/analytics/student-welfare">
                        <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-blue-600 to-blue-700 text-white cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <BarChart3 className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg">Student Welfare</h3>
                                </div>
                                <p className="text-sm text-white/80">
                                    Participation stats, branch profiles, heatmaps
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/analytics/team-performance">
                        <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-purple-600 to-purple-700 text-white cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg">Team Performance</h3>
                                </div>
                                <p className="text-sm text-white/80">
                                    Tournaments, wins/losses, practice sessions
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </section>
        </div>
    )
}
