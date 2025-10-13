import { createClient } from '@/lib/supabase/server'
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO
} from 'date-fns'

export interface UserStats {
  totalEntries: number
  totalWords: number
  averageWords: number
  currentStreak: number
  longestStreak: number
  entriesThisWeek: number
  entriesThisMonth: number
  wordsThisWeek: number
  wordsThisMonth: number
  bestWritingDay: string | null
  writingFrequency: number
}

export interface WordsOverTime {
  date: string
  words: number
}

export interface DayActivity {
  date: string
  wordCount: number
  hasEntry: boolean
}

/**
 * Calculate comprehensive user statistics
 */
export async function calculateUserStats(userId: string): Promise<UserStats> {
  const supabase = await createClient()

  // Fetch all user entries
  const { data: entries, error } = await supabase
    .from('entries')
    .select('word_count, created_at, date')
    .eq('user_id', userId)
    .order('date', { ascending: true })

  if (error || !entries) {
    throw new Error('Failed to fetch entries')
  }

  // Fetch streak data
  const { data: streakData } = await supabase
    .from('user_streaks')
    .select('current_streak, longest_streak')
    .eq('user_id', userId)
    .single()

  const totalEntries = entries.length
  const totalWords = entries.reduce((sum, entry) => sum + (entry.word_count || 0), 0)
  const averageWords = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0

  // Calculate this week's stats
  const now = new Date()
  const weekStart = startOfWeek(now)
  const weekEnd = endOfWeek(now)

  const entriesThisWeek = entries.filter(entry => {
    const entryDate = parseISO(entry.date)
    return entryDate >= weekStart && entryDate <= weekEnd
  })

  // Calculate this month's stats
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  const entriesThisMonth = entries.filter(entry => {
    const entryDate = parseISO(entry.date)
    return entryDate >= monthStart && entryDate <= monthEnd
  })

  // Calculate best writing day (day of week with most entries)
  const dayOfWeekCounts: { [key: string]: number } = {}
  entries.forEach(entry => {
    const dayName = format(parseISO(entry.date), 'EEEE')
    dayOfWeekCounts[dayName] = (dayOfWeekCounts[dayName] || 0) + 1
  })

  let bestWritingDay: string | null = null
  let maxCount = 0
  Object.entries(dayOfWeekCounts).forEach(([day, count]) => {
    if (count > maxCount) {
      maxCount = count
      bestWritingDay = day
    }
  })

  // Calculate writing frequency (average entries per week over all time)
  const writingFrequency = totalEntries > 0
    ? calculateWritingFrequency(entries)
    : 0

  return {
    totalEntries,
    totalWords,
    averageWords,
    currentStreak: streakData?.current_streak || 0,
    longestStreak: streakData?.longest_streak || 0,
    entriesThisWeek: entriesThisWeek.length,
    entriesThisMonth: entriesThisMonth.length,
    wordsThisWeek: entriesThisWeek.reduce((sum, e) => sum + (e.word_count || 0), 0),
    wordsThisMonth: entriesThisMonth.reduce((sum, e) => sum + (e.word_count || 0), 0),
    bestWritingDay,
    writingFrequency
  }
}

/**
 * Calculate average entries per week
 */
function calculateWritingFrequency(entries: Array<{ date: string }>): number {
  if (entries.length === 0) return 0

  const firstEntry = parseISO(entries[0].date)
  const lastEntry = parseISO(entries[entries.length - 1].date)

  const daysDiff = Math.max(1, Math.ceil((lastEntry.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24)))
  const weeksDiff = Math.max(1, daysDiff / 7)

  return Math.round((entries.length / weeksDiff) * 10) / 10
}

/**
 * Get words written over time for chart visualization
 */
export async function getWordsOverTime(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<WordsOverTime[]> {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('entries')
    .select('word_count, date')
    .eq('user_id', userId)
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'))
    .order('date', { ascending: true })

  if (error || !entries) {
    return []
  }

  // Group by date and sum word counts
  const dateMap = new Map<string, number>()
  entries.forEach(entry => {
    const existing = dateMap.get(entry.date) || 0
    dateMap.set(entry.date, existing + (entry.word_count || 0))
  })

  // Convert to array and fill in missing dates with 0
  const allDates = eachDayOfInterval({ start: startDate, end: endDate })
  return allDates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return {
      date: dateStr,
      words: dateMap.get(dateStr) || 0
    }
  })
}

/**
 * Get activity heatmap data for the past year
 */
export async function getYearActivityHeatmap(userId: string): Promise<DayActivity[]> {
  const supabase = await createClient()

  const endDate = new Date()
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)

  const { data: entries, error } = await supabase
    .from('entries')
    .select('word_count, date')
    .eq('user_id', userId)
    .gte('date', format(startDate, 'yyyy-MM-dd'))
    .lte('date', format(endDate, 'yyyy-MM-dd'))
    .order('date', { ascending: true })

  if (error || !entries) {
    return []
  }

  // Group by date
  const dateMap = new Map<string, number>()
  entries.forEach(entry => {
    const existing = dateMap.get(entry.date) || 0
    dateMap.set(entry.date, existing + (entry.word_count || 0))
  })

  // Generate all dates in range
  const allDates = eachDayOfInterval({ start: startDate, end: endDate })
  return allDates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const wordCount = dateMap.get(dateStr) || 0
    return {
      date: dateStr,
      wordCount,
      hasEntry: wordCount > 0
    }
  })
}

/**
 * Get recent entries for quick access
 */
export async function getRecentEntries(userId: string, limit: number = 5) {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('entries')
    .select('id, content, word_count, date, created_at')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error('Failed to fetch recent entries')
  }

  return entries || []
}
