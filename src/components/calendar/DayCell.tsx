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
        'relative h-20 md:h-24 p-2 border border-gray-200 transition-all',
        !currentMonth && 'bg-gray-50 text-gray-400',
        currentMonth && 'bg-white text-gray-900',
        isCurrentDay && 'border-blue-500 border-2',
        hasEntry && currentMonth && 'bg-blue-50/30 hover:border-blue-400 hover:shadow-sm cursor-pointer',
        !hasEntry && currentMonth && 'cursor-default',
        !hasEntry && !currentMonth && 'cursor-not-allowed'
      )}
      aria-label={`${format(date, 'MMMM d, yyyy')}${hasEntry ? ` - ${wordCount} words written` : ' - No entry'}`}
      title={hasEntry && contentPreview ? contentPreview : undefined}
    >
      {/* Day number */}
      <div
        className={cn(
          'text-sm font-medium mb-1',
          isCurrentDay && 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white'
        )}
      >
        {dayNumber}
      </div>

      {/* Entry indicator */}
      {hasEntry && currentMonth && (
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-blue-600 font-medium">
              <svg
                className="w-3 h-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              {wordCount}
            </span>
          </div>
        </div>
      )}

      {/* Hover tooltip - shown with CSS */}
      {hasEntry && contentPreview && (
        <div className="absolute z-10 invisible group-hover:visible bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="font-semibold mb-1">{wordCount} words</div>
          <div className="line-clamp-3">{contentPreview}</div>
        </div>
      )}
    </button>
  )
}
