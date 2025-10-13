import { Calendar } from 'lucide-react'

export default function HistoryPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Writing History</h1>
        <p className="text-gray-600">View your past entries and writing journey</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
          <Calendar size={32} className="text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Calendar View Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This page will display a calendar with all your entries, allowing you to browse and
          search through your writing history.
        </p>
        <div className="text-sm text-gray-500">
          <p>Features in development:</p>
          <ul className="mt-2 space-y-1">
            <li>• Monthly calendar view</li>
            <li>• Entry preview on click</li>
            <li>• Search by content</li>
            <li>• Filter by date range</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
