'use client'

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayCell } from './DayCell'
import { Entry } from '@/types'

interface MonthCalendarProps {
  entries: Entry[]
  onDayClick: (date: Date, entries: Entry[]) => void
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

export function MonthCalendar({ entries, onDayClick, currentMonth, onMonthChange }: MonthCalendarProps) {
  // Create a map of dates to entries for quick lookup
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = entry.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(entry)
    return acc
  }, {} as Record<string, Entry[]>)

  console.log('MonthCalendar received', entries.length, 'entries')
  console.log('Entries by date map:', Object.keys(entriesByDate))

  // Generate calendar grid
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days: Date[] = []
  let day = startDate
  while (day <= endDate) {
    days.push(day)
    day = addDays(day, 1)
  }

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1))
  }

  const handleDayClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd')
    const dayEntries = entriesByDate[dateString] || []
    onDayClick(date, dayEntries)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="border border-[#F7F7FF]/10 rounded-lg overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-[#F7F7FF]/10 bg-[#3A4F41]">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center hover:bg-[#F7F7FF]/10 hover:border-[#F7F7FF]/30 transition-all duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} className="text-[#F7F7FF] sm:w-5 sm:h-5" />
        </button>

        <h2 className="text-xl font-normal text-[#F7F7FF] tracking-wide">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <button
          onClick={handleNextMonth}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center hover:bg-[#F7F7FF]/10 hover:border-[#F7F7FF]/30 transition-all duration-200"
          aria-label="Next month"
        >
          <ChevronRight size={18} className="text-[#F7F7FF] sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-[#F7F7FF]/10 bg-[#3A4F41]">
        {weekDays.map((day) => (
          <div key={day} className="p-1.5 sm:p-2 md:p-3 text-center text-sm font-normal text-[#F7F7FF]/60 uppercase tracking-wider">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dateString = format(day, 'yyyy-MM-dd')
          const dayEntries = entriesByDate[dateString] || []
          const hasEntry = dayEntries.length > 0
          const totalWords = dayEntries.reduce((sum, entry) => sum + entry.word_count, 0)
          const contentPreview = dayEntries[0]?.content
            ? dayEntries[0].content.replace(/<[^>]*>/g, '').substring(0, 100)
            : undefined

          return (
            <DayCell
              key={index}
              date={day}
              currentMonth={isSameMonth(day, currentMonth)}
              hasEntry={hasEntry}
              wordCount={totalWords}
              onClick={handleDayClick}
              contentPreview={contentPreview}
            />
          )
        })}
      </div>
    </div>
  )
}
