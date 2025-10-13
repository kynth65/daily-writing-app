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
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-normal text-[#F7F7FF] mb-2">
          Writing History
        </h1>
        <p className="text-lg text-[#F7F7FF]/70">View your past entries and writing journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="border border-[#F7F7FF]/10 rounded-lg p-3 sm:p-5 md:p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2.5 md:gap-3 mb-2 sm:mb-2.5 md:mb-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <Calendar size={14} className="text-[#F7F7FF] sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
            </div>
            <div className="text-[10px] sm:text-sm font-normal text-[#F7F7FF]/70 uppercase tracking-wide">This Month</div>
          </div>
          <div className="text-xl sm:text-3xl md:text-4xl font-normal text-[#F7F7FF]">{totalEntries}</div>
          <div className="text-[10px] sm:text-sm text-[#F7F7FF]/70 mt-0.5 sm:mt-1">{totalEntries === 1 ? 'entry' : 'entries'}</div>
        </div>

        <div className="border border-[#F7F7FF]/10 rounded-lg p-3 sm:p-5 md:p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2.5 md:gap-3 mb-2 sm:mb-2.5 md:mb-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-[#F7F7FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="text-[10px] sm:text-sm font-normal text-[#F7F7FF]/70 uppercase tracking-wide">Total Words</div>
          </div>
          <div className="text-xl sm:text-3xl md:text-4xl font-normal text-[#F7F7FF]">{totalWords.toLocaleString()}</div>
          <div className="text-[10px] sm:text-sm text-[#F7F7FF]/70 mt-0.5 sm:mt-1">words written</div>
        </div>

        <div className="border border-[#F7F7FF]/10 rounded-lg p-3 sm:p-5 md:p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2.5 md:gap-3 mb-2 sm:mb-2.5 md:mb-3">
            <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-[#F7F7FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-[10px] sm:text-sm font-normal text-[#F7F7FF]/70 uppercase tracking-wide">Average</div>
          </div>
          <div className="text-xl sm:text-3xl md:text-4xl font-normal text-[#F7F7FF]">
            {totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0}
          </div>
          <div className="text-[10px] sm:text-sm text-[#F7F7FF]/70 mt-0.5 sm:mt-1">words per entry</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F7F7FF]/50" size={20} />
          <input
            type="text"
            placeholder="Search entries by content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#3A4F41] border border-[#F7F7FF]/10 rounded-lg focus:outline-none focus:border-[#F7F7FF]/30 transition-all text-[#F7F7FF] placeholder-[#F7F7FF]/50"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-[#F7F7FF] mb-4" size={40} />
          <p className="text-[#F7F7FF]/70 font-normal">Loading your history...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="border border-[#F7F7FF]/20 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#F7F7FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-[#F7F7FF] font-normal mb-1">Oops! Something went wrong</h3>
              <p className="text-[#F7F7FF]/70 mb-3">{error}</p>
              <button
                onClick={fetchEntries}
                className="px-4 py-2 border border-[#F7F7FF] text-[#F7F7FF] rounded-lg hover:bg-[#F7F7FF]/10 transition-colors text-sm font-normal cursor-pointer"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      {!isLoading && !error && (
        <div>
          <MonthCalendar
            entries={filteredEntries}
            onDayClick={handleDayClick}
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && entries.length === 0 && (
        <div className="border border-[#F7F7FF]/10 rounded-lg p-16 text-center mt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-[#F7F7FF]/20 rounded-lg mb-6">
            <Calendar size={40} className="text-[#F7F7FF]" />
          </div>
          <h2 className="text-2xl font-normal text-[#F7F7FF] mb-3">No entries yet this month</h2>
          <p className="text-[#F7F7FF]/70 mb-8 text-lg max-w-md mx-auto">
            Start writing today to see your entries appear on the calendar and track your progress.
          </p>
          <a
            href="/write"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#F7F7FF] text-[#F7F7FF] rounded-lg hover:bg-[#F7F7FF]/10 transition-all duration-200 font-normal cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
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
