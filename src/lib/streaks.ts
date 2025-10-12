import { differenceInDays, parseISO, format } from 'date-fns'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  totalEntries: number
  totalWords: number
  lastEntryDate: string | null
}

/**
 * Calculate current and longest streaks from entry dates
 */
export function calculateStreaks(entryDates: string[]): {
  currentStreak: number
  longestStreak: number
} {
  if (entryDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // Sort dates in descending order (most recent first)
  const sortedDates = [...entryDates].sort((a, b) => b.localeCompare(a))

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')

  // Calculate current streak
  let currentStreak = 0
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    currentStreak = 1
    let expectedDate = sortedDates[0] === today ? yesterday : format(new Date(parseISO(sortedDates[0]).getTime() - 86400000), 'yyyy-MM-dd')

    for (let i = 1; i < sortedDates.length; i++) {
      if (sortedDates[i] === expectedDate) {
        currentStreak++
        expectedDate = format(new Date(parseISO(expectedDate).getTime() - 86400000), 'yyyy-MM-dd')
      } else {
        break
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 1
  let tempStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = parseISO(sortedDates[i])
    const previousDate = parseISO(sortedDates[i - 1])
    const daysDiff = differenceInDays(previousDate, currentDate)

    if (daysDiff === 1) {
      tempStreak++
      longestStreak = Math.max(longestStreak, tempStreak)
    } else {
      tempStreak = 1
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  }
}

/**
 * Check if user has written today
 */
export function hasWrittenToday(entryDates: string[]): boolean {
  const today = format(new Date(), 'yyyy-MM-dd')
  return entryDates.includes(today)
}

/**
 * Get the next date needed to maintain streak
 */
export function getNextStreakDate(lastEntryDate: string | null): string {
  if (!lastEntryDate) {
    return format(new Date(), 'yyyy-MM-dd')
  }

  const lastDate = parseISO(lastEntryDate)
  const nextDate = new Date(lastDate.getTime() + 86400000)
  return format(nextDate, 'yyyy-MM-dd')
}

/**
 * Calculate if streak is at risk (user hasn't written today and last entry was yesterday)
 */
export function isStreakAtRisk(lastEntryDate: string | null): boolean {
  if (!lastEntryDate) {
    return false
  }

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')

  return lastEntryDate === yesterday && lastEntryDate !== today
}
