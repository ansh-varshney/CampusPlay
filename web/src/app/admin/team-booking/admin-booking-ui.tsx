'use client'

import { useState, useTransition, useEffect, useMemo } from 'react'
import { addDays, format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getBookingsForDateRange, getAvailableEquipment } from '@/actions/bookings'
import { createTeamBooking, deleteTeamBooking } from '@/actions/admin-team-bookings'
import {
    Loader2,
    CheckCircle,
    Clock,
    Package,
    X,
    ChevronRight,
    Trash2,
} from 'lucide-react'
import React from 'react'

type Court = { id: string; name: string; sport: string }
type Booking = {
    id: string
    court_id: string
    start_time: Date | string
    end_time: Date | string
    status: string | null
    user_id: string
    profiles?: { full_name: string | null } | null
    num_players?: number | null
    notes?: string | null
    is_priority?: boolean | null
}
type Equipment = {
    id: string
    name: string
    sport: string
    condition: string | null
    in_use?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const generateTimeSlots = () => {
    const slots: string[] = []
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
        }
    }
    return slots
}

const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminBookingUI({
    initialCourts,
}: {
    initialCourts: Court[]
}) {
    const sports = useMemo(() => {
        const set = new Set(initialCourts.map((c) => c.sport.toLowerCase().trim()))
        return Array.from(set).sort()
    }, [initialCourts])

    const [selectedSport, setSelectedSport] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loadingBookings, setLoadingBookings] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

    // Booking dialog state
    const [selectedSlot, setSelectedSlot] = useState<{
        courtId: string
        courtName: string
        time: string
        existingBooking?: Booking
    } | null>(null)
    const [duration, setDuration] = useState<30 | 60 | 90 | 120>(60)
    const [teamName, setTeamName] = useState('')
    const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([])
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
    const [loadingEquipment, setLoadingEquipment] = useState(false)

    const filteredCourts = useMemo(() => {
        if (!selectedSport) return []
        return initialCourts.filter((c) => c.sport.toLowerCase() === selectedSport.toLowerCase())
    }, [selectedSport, initialCourts])

    const fetchBookings = async (dateStr: string) => {
        if (!dateStr || !selectedSport) return
        setLoadingBookings(true)
        setMessage(null)
        try {
            const startOfDay = new Date(dateStr)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(dateStr)
            endOfDay.setHours(23, 59, 59, 999)

            const allBookings: Booking[] = []
            for (const c of filteredCourts) {
                const b = await getBookingsForDateRange(c.id, startOfDay, endOfDay)
                allBookings.push(...b)
            }
            setBookings(allBookings)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingBookings(false)
        }
    }

    useEffect(() => {
        if (selectedDate && filteredCourts.length > 0) {
            fetchBookings(selectedDate)
        } else {
            setBookings([])
        }
    }, [selectedDate, selectedSport])

    const timeSlots = useMemo(() => generateTimeSlots(), [])

    const visibleTimeSlots = useMemo(() => {
        if (!selectedDate) return timeSlots
        const todayStr = new Date().toLocaleDateString('en-CA')
        if (selectedDate !== todayStr) return timeSlots

        const now = new Date()
        const currentHour = now.getHours()
        const currentMinute = now.getMinutes()
        return timeSlots.filter((time) => {
            const [h, m] = time.split(':').map(Number)
            return h > currentHour || (h === currentHour && m > currentMinute)
        })
    }, [selectedDate, timeSlots])

    const selectedTime = selectedSlot?.time ?? null
    useEffect(() => {
        if (selectedSlot && !selectedSlot.existingBooking && selectedSport && selectedTime && selectedDate) {
            setLoadingEquipment(true)
            setAvailableEquipment([])
            const [h, m] = selectedTime.split(':').map(Number)
            const start = new Date(selectedDate)
            start.setHours(h, m, 0, 0)
            const end = new Date(start.getTime() + duration * 60 * 1000)
            getAvailableEquipment(selectedSport, start.toISOString(), end.toISOString())
                .then((eq) => {
                    setAvailableEquipment(eq)
                    setLoadingEquipment(false)
                })
                .catch(() => setLoadingEquipment(false))
        }
    }, [selectedSlot?.courtId, selectedSport, selectedTime, selectedDate, duration])

    const getBookingForSlot = (courtId: string, slotTime: string): Booking | undefined => {
        const [slotH, slotM] = slotTime.split(':').map(Number)
        const slotDate = new Date(selectedDate)
        slotDate.setHours(slotH, slotM, 0, 0)
        const slotMs = slotDate.getTime()

        return bookings.find((b) => {
            if (b.court_id !== courtId) return false
            const bStart = new Date(b.start_time).getTime()
            const bEnd = new Date(b.end_time).getTime()
            return slotMs >= bStart && slotMs < bEnd
        })
    }

    const handleSlotClick = (court: Court, time: string) => {
        const booking = getBookingForSlot(court.id, time)
        
        setSelectedSlot({ 
            courtId: court.id, 
            courtName: court.name, 
            time,
            existingBooking: booking 
        })
        setDuration(60)
        setTeamName('')
        setSelectedEquipment([])
        setMessage(null)
    }

    const handleBook = async () => {
        if (!selectedSlot || !selectedDate || !teamName) return

        const [hour, minute] = selectedSlot.time.split(':').map(Number)
        const startTime = new Date(selectedDate)
        startTime.setHours(hour, minute, 0, 0)

        startTransition(async () => {
            const formData = new FormData()
            formData.append('courtId', selectedSlot.courtId)
            formData.append('startTime', startTime.toISOString())
            formData.append('duration', duration.toString())
            formData.append('teamName', teamName)
            if (selectedEquipment.length > 0) {
                formData.append('equipmentIds', JSON.stringify(selectedEquipment))
            }

            const result = await createTeamBooking(null, formData)
            if (result?.error) {
                setMessage({ text: result.error, type: 'error' })
            } else {
                setMessage({ text: 'Team slot booked and overwrites applied (if any)!', type: 'success' })
                setSelectedSlot(null)
                fetchBookings(selectedDate)
            }
        })
    }
    
    const handleDeleteBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to delete this booking?')) return
        startTransition(async () => {
            const result = await deleteTeamBooking(bookingId)
            if (result?.error) {
                setMessage({ text: result.error, type: 'error' })
            } else {
                setMessage({ text: 'Booking deleted successfully.', type: 'success' })
                setSelectedSlot(null)
                fetchBookings(selectedDate)
            }
        })
    }

    const todayStr = new Date().toLocaleDateString('en-CA')
    const maxDateStr = format(addDays(new Date(), 20), 'yyyy-MM-dd') // 20 DAYS AHEAD FOR ADMINS

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div className={cn('space-y-4', selectedSlot && 'pb-[60vh]')}>
            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-900 dark:text-slate-100">Sport:</label>
                            <select
                                value={selectedSport}
                                onChange={(e) => {
                                    setSelectedSport(e.target.value)
                                    setSelectedSlot(null)
                                    setBookings([])
                                }}
                                className="px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#004d40] dark:focus:ring-teal-400"
                            >
                                <option value="">Select Sport</option>
                                {sports.map((s) => (
                                    <option key={s} value={s}>
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedSport && (
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-gray-900 dark:text-slate-100">Date:</label>
                                <input
                                    type="date"
                                    min={todayStr}
                                    max={maxDateStr}
                                    value={selectedDate}
                                    onChange={(e) => {
                                        setSelectedDate(e.target.value)
                                        setSelectedSlot(null)
                                    }}
                                    className="px-3 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm text-gray-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-[#004d40] dark:focus:ring-teal-400"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Prompt states */}
            {!selectedSport ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Select a Sport</h3>
                        </div>
                    </CardContent>
                </Card>
            ) : !selectedDate ? (
                <Card>
                    <CardContent className="p-12">
                        <div className="text-center space-y-3">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Select a Date</h3>
                            <p className="text-gray-500 text-sm">Admins can book up to 20 days in advance.</p>
                        </div>
                    </CardContent>
                </Card>
            ) : loadingBookings ? (
                <div className="flex items-center justify-center p-16">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            ) : (
                /* Calendar Grid */
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full">
                                <div
                                    className="grid"
                                    style={{
                                        gridTemplateColumns: `72px repeat(${filteredCourts.length}, minmax(120px, 1fr))`,
                                    }}
                                >
                                    {/* Header Row */}
                                    <div className="sticky top-0 left-0 z-20 bg-indigo-950 border-b border-r border-indigo-900 p-2">
                                        <span className="text-[10px] font-bold text-white/70 uppercase">
                                            Time
                                        </span>
                                    </div>
                                    {filteredCourts.map((court) => (
                                        <div
                                            key={court.id}
                                            className="sticky top-0 z-10 bg-indigo-950 border-b border-r border-indigo-900 p-2"
                                        >
                                            <div className="font-semibold text-xs text-white">
                                                {court.name}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Only future time slots */}
                                    {visibleTimeSlots.map((time) => (
                                        <React.Fragment key={time}>
                                            <div className="sticky left-0 z-10 bg-gray-50 dark:bg-slate-800 border-r border-b border-gray-200 dark:border-slate-700 p-1.5 text-[11px] text-gray-500 dark:text-slate-400 font-medium flex items-center">
                                                {formatTime(time)}
                                            </div>

                                            {filteredCourts.map((court) => {
                                                const booking = getBookingForSlot(court.id, time)
                                                const isBooked = !!booking
                                                const isTeamBooking = booking?.is_priority && booking?.notes?.includes('Team Booking')
                                                const isSelected =
                                                    selectedSlot?.courtId === court.id &&
                                                    selectedSlot?.time === time

                                                return (
                                                    <div
                                                        key={`${court.id}-${time}`}
                                                        onClick={() => handleSlotClick(court, time)}
                                                        className={cn(
                                                            'border-r border-b border-gray-200 dark:border-slate-800 p-1.5 min-h-[44px] transition-all text-xs',
                                                            isSelected
                                                                ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-1'
                                                                : isBooked
                                                                    ? (isTeamBooking ? 'bg-amber-100 border-l-[3px] border-l-amber-500 cursor-pointer' : 'bg-blue-50 border-l-[3px] border-l-blue-500 cursor-pointer')
                                                                    : 'bg-white hover:bg-indigo-50 cursor-pointer'
                                                        )}
                                                    >
                                                        {isSelected ? (
                                                            <span className="text-[10px] font-bold">
                                                                ✓ Selected
                                                            </span>
                                                        ) : booking ? (
                                                            <div>
                                                                <div className="font-semibold text-[11px] truncate text-slate-700">
                                                                    {isTeamBooking ? booking.notes : (booking.profiles?.full_name?.split(' ')[0] || 'Booked')}
                                                                </div>
                                                                <div className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                                                    Click to view/overwrite
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )
                                            })}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Booking Dialog */}
            {selectedSlot && (
                <div className="fixed bottom-0 left-0 md:left-64 right-0 z-50 bg-white dark:bg-slate-900 border-t-4 border-indigo-600 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] rounded-t-2xl max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom-4">
                    <div className="p-6 pb-20 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                                    {selectedSlot.courtName}
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                                    {selectedDate} · {formatTime(selectedSlot.time)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSlot(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                            </button>
                        </div>
                        
                        {/* If clicking an existing booking */}
                        {selectedSlot.existingBooking && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <h4 className="font-semibold text-slate-800 mb-2">Existing Booking</h4>
                                <p className="text-sm text-slate-600 mb-4">
                                    This slot is currently booked by: <br/>
                                    <strong>{selectedSlot.existingBooking.notes?.includes('Team Booking') ? selectedSlot.existingBooking.notes : selectedSlot.existingBooking.profiles?.full_name}</strong>
                                </p>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDeleteBooking(selectedSlot.existingBooking!.id)}
                                        disabled={isPending}
                                        className="flex-1 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete Booking
                                    </button>
                                </div>
                                
                                {!selectedSlot.existingBooking.notes?.includes('Team Booking') && (
                                    <div className="mt-4 pt-4 border-t border-slate-200">
                                        <p className="text-xs text-amber-600 font-medium mb-3">
                                            ⚠️ You can overwrite this student booking with a new Team Booking below. The student will be notified.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {(!selectedSlot.existingBooking || !selectedSlot.existingBooking.notes?.includes('Team Booking')) && (
                            <div className="space-y-6">
                                {/* Team Name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                                        Team Name
                                    </label>
                                    <input 
                                        type="text" 
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        placeholder="e.g. Men's Basketball Team"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>

                                {/* Duration */}
                                <div>
                                    <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase mb-2">
                                        <Clock className="w-3 h-3" /> Duration
                                    </label>
                                    <div className="flex gap-2">
                                        {([30, 60, 90, 120] as const).map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => setDuration(d)}
                                                className={cn(
                                                    'flex-1 py-2 text-sm font-bold rounded-lg border transition-all',
                                                    duration === d
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-600'
                                                )}
                                            >
                                                {d} min
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Equipment */}
                                <div>
                                    <label className="flex items-center gap-1 text-xs font-bold text-gray-500 uppercase mb-2">
                                        <Package className="w-3 h-3" /> Equipment
                                    </label>
                                    {loadingEquipment ? (
                                        <p className="text-xs text-gray-400">Loading equipment...</p>
                                    ) : availableEquipment.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {availableEquipment.map((eq) => (
                                                <button
                                                    key={eq.id}
                                                    onClick={() =>
                                                        !eq.in_use &&
                                                        setSelectedEquipment((prev) =>
                                                            prev.includes(eq.id)
                                                                ? prev.filter((id) => id !== eq.id)
                                                                : [...prev, eq.id]
                                                        )
                                                    }
                                                    disabled={eq.in_use}
                                                    className={cn(
                                                        'px-3 py-1.5 text-xs rounded-full border transition-all font-medium',
                                                        eq.in_use
                                                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                            : selectedEquipment.includes(eq.id)
                                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-600'
                                                    )}
                                                >
                                                    {eq.name}{' '}
                                                    {eq.in_use
                                                        ? '(In Use)'
                                                        : selectedEquipment.includes(eq.id) && '✓'}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400">No equipment available</p>
                                    )}
                                </div>

                                {/* Confirm Button */}
                                <button
                                    onClick={handleBook}
                                    disabled={isPending || !teamName}
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                                >
                                    {isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {selectedSlot.existingBooking ? 'Overwrite Student Booking & Save' : 'Confirm Team Booking'} <ChevronRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {message && (
                            <div
                                className={cn(
                                    'p-4 rounded-xl flex items-center gap-3 text-sm font-medium',
                                    message.type === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                )}
                            >
                                <CheckCircle className="w-5 h-5" />
                                {message.text}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
