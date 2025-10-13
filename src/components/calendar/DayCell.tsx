'use client'

import { format, isSameDay, isToday } from 'date-fns'
import { cn } from '@/lib/utils'

interface DayCellProps {
  date: Date
  currentMonth: boolean
  hasEntry: boolean
  wordCount?: number
  onClick: (date: Date) => void
  contentPreview?: string
}

export function DayCell({
  date,
  currentMonth,
  hasEntry,
  wordCount = 0,
  onClick,
  contentPreview,
}: DayCellProps) {
  const isCurrentDay = isToday(date)
  const dayNumber = format(date, 'd')

  return (
    <button
      onClick={() => onClick(date)}
      disabled={!hasEntry}
      className={cn(
        'group relative h-16 sm:h-20 md:h-24 lg:h-28 p-1.5 sm:p-2 md:p-3 border border-[#F7F7FF]/10 transition-all duration-200',
        !currentMonth && 'bg-[#3A4F41]/30 text-[#F7F7FF]/30',
        currentMonth && 'bg-[#3A4F41] text-[#F7F7FF]',
        isCurrentDay && 'ring-1 sm:ring-2 ring-[#F7F7FF]/40 ring-inset',
        hasEntry && currentMonth && 'bg-[#F7F7FF]/5 hover:bg-[#F7F7FF]/10 hover:border-[#F7F7FF]/30 cursor-pointer md:transform md:hover:scale-[1.02]',
        !hasEntry && currentMonth && 'cursor-default hover:bg-[#F7F7FF]/5',
        !hasEntry && !currentMonth && 'cursor-not-allowed'
      )}
      aria-label={`${format(date, 'MMMM d, yyyy')}${hasEntry ? ` - ${wordCount} words written` : ' - No entry'}`}
    >
      {/* Day number */}
      <div className="flex items-start justify-between mb-1 sm:mb-2">
        <div
          className={cn(
            'text-xs sm:text-sm font-normal transition-all',
            isCurrentDay && 'inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-[#F7F7FF] text-[#3A4F41] font-normal',
            !isCurrentDay && currentMonth && 'text-[#F7F7FF]',
            !isCurrentDay && !currentMonth && 'text-[#F7F7FF]/30'
          )}
        >
          {dayNumber}
        </div>

        {/* Entry count badge for multiple entries */}
        {hasEntry && currentMonth && (
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#F7F7FF]/60 group-hover:bg-[#F7F7FF] transition-colors" />
          </div>
        )}
      </div>

      {/* Entry indicator with word count */}
      {hasEntry && currentMonth && (
        <div className="absolute bottom-1 sm:bottom-1.5 md:bottom-3 left-1 sm:left-1.5 md:left-3 right-1 sm:right-1.5 md:right-3">
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 text-[10px] sm:text-xs text-[#F7F7FF]/70 group-hover:text-[#F7F7FF] transition-colors">
            <svg
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span className="font-normal truncate">{wordCount.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Hover preview tooltip - hidden on mobile */}
      {hasEntry && contentPreview && (
        <div className="hidden md:block absolute z-20 invisible group-hover:visible bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 bg-[#3A4F41] border border-[#F7F7FF]/20 text-[#F7F7FF] text-sm rounded-lg shadow-2xl w-64 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <div className="font-normal text-[#F7F7FF]/60 mb-2 text-xs uppercase tracking-wide">
            {wordCount.toLocaleString()} words
          </div>
          <div className="line-clamp-3 text-[#F7F7FF]/90 leading-relaxed">
            {contentPreview}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#3A4F41] border-r border-b border-[#F7F7FF]/20 transform rotate-45" />
        </div>
      )}
    </button>
  )
}
