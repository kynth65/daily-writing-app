'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Calendar, Loader2, Search } from 'lucide-react'
import { MonthCalendar } from '@/components/calendar/MonthCalendar'
import { EntryPreview } from '@/components/history/EntryPreview'
import { Entry } from '@/types'

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEntries, setSelectedEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Fetch entries for the current month
  useEffect(() => {
    fetchEntries()
  }, [currentMonth])

  const fetchEntries = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const monthStr = format(currentMonth, 'yyyy-MM')
      console.log('Fetching entries for month:', monthStr)
      const response = await fetch(`/api/history?month=${monthStr}`)

      if (!response.ok) {
        throw new Error('Failed to fetch entries')
      }

      const data = await response.json()
      console.log('Received entries:', data.entries?.length || 0, 'entries')
      console.log('Entries by date:', Object.keys(data.entriesByDate || {}))
      setEntries(data.entries || [])
    } catch (err) {
      console.error('Error fetching entries:', err)
      setError('Failed to load your writing history. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMonthChange = (newMonth: Date) => {
    console.log('Month changed to:', format(newMonth, 'yyyy-MM'))
    setCurrentMonth(newMonth)
  }

  const handleDayClick = (date: Date, dayEntries: Entry[]) => {
    console.log('Day clicked:', format(date, 'yyyy-MM-dd'), 'Entries:', dayEntries.length)
    if (dayEntries.length > 0) {
      setSelectedDate(date)
      setSelectedEntries(dayEntries)
    } else {
      console.warn('No entries found for this date')
    }
  }

  const handleClosePreview = () => {
    setSelectedDate(null)
    setSelectedEntries([])
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const response = await fetch(`/api/entries/${entryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete entry')
      }

      // Update local state
      setEntries((prev) => prev.filter((entry) => entry.id !== entryId))
      setSelectedEntries((prev) => prev.filter((entry) => entry.id !== entryId))

      // Refresh the view
      await fetchEntries()
    } catch (err) {
      console.error('Error deleting entry:', err)
      throw err
    }
  }

  // Filter entries by search query
  const filteredEntries = searchQuery
    ? entries.filter((entry) => {
        const content = entry.content.replace(/<[^>]*>/g, '').toLowerCase()
        return content.includes(searchQuery.toLowerCase())
      })
    : entries

  const totalWords = entries.reduce((sum, entry) => sum + entry.word_count, 0)
  const totalEntries = entries.length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Writing History</h1>
        <p className="text-gray-600">View your past entries and writing journey</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">This Month</div>
          <div className="text-2xl font-bold">{totalEntries} entries</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Words</div>
          <div className="text-2xl font-bold">{totalWords.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Average</div>
          <div className="text-2xl font-bold">
            {totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0} words/entry
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search entries by content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchEntries}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Calendar */}
      {!isLoading && !error && (
        <MonthCalendar
          entries={filteredEntries}
          onDayClick={handleDayClick}
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />
      )}

      {/* Empty state */}
      {!isLoading && !error && entries.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
            <Calendar size={32} className="text-blue-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No entries yet this month</h2>
          <p className="text-gray-600 mb-6">
            Start writing today to see your entries appear on the calendar.
          </p>
          <a
            href="/write"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Write Your First Entry
          </a>
        </div>
      )}

      {/* Entry Preview Modal */}
      {selectedDate && (
        <EntryPreview
          entries={selectedEntries}
          selectedDate={selectedDate}
          isOpen={!!selectedDate}
          onClose={handleClosePreview}
          onDelete={handleDeleteEntry}
        />
      )}
    </div>
  )
}
