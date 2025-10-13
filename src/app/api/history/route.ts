import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') // Format: YYYY-MM
    const year = searchParams.get('year')

    let startDate: string
    let endDate: string

    if (month) {
      // If month is provided in YYYY-MM format
      const date = new Date(month + '-01')
      startDate = format(startOfMonth(date), 'yyyy-MM-dd')
      endDate = format(endOfMonth(date), 'yyyy-MM-dd')
    } else if (year) {
      // If only year is provided
      startDate = `${year}-01-01`
      endDate = `${year}-12-31`
    } else {
      // Default to current month
      const now = new Date()
      startDate = format(startOfMonth(now), 'yyyy-MM-dd')
      endDate = format(endOfMonth(now), 'yyyy-MM-dd')
    }

    // Fetch all entries within the date range
    const { data: entries, error } = await supabase
      .from('entries')
      .select('id, date, word_count, content, created_at, updated_at')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching history:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group entries by date
    const entriesByDate: Record<string, typeof entries> = {}
    entries.forEach((entry) => {
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = []
      }
      entriesByDate[entry.date].push(entry)
    })

    // Calculate total word count per day
    const dailyStats = Object.entries(entriesByDate).map(([date, dayEntries]) => ({
      date,
      entries: dayEntries,
      totalWords: dayEntries.reduce((sum, entry) => sum + entry.word_count, 0),
      entryCount: dayEntries.length,
    }))

    return NextResponse.json({
      entries,
      entriesByDate,
      dailyStats,
      dateRange: { startDate, endDate },
    })
  } catch (error) {
    console.error('Error in GET /api/history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
