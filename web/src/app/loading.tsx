import { Loader2 } from 'lucide-react'

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-gray-500 animate-pulse text-lg font-medium">
                Loading CampusPlay...
            </p>
        </div>
    )
}
