'use client'

import { useState, useEffect } from 'react'
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Calendar header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <h2 className="text-lg font-normal">{format(currentMonth, 'MMMM yyyy')}</h2>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-normal text-gray-600">
            {day}
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
