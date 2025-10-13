import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  calculateUserStats,
  getWordsOverTime,
  getYearActivityHeatmap,
  getRecentEntries
} from '@/lib/stats'
import { subMonths } from 'date-fns'

/**
 * GET /api/stats
 * Fetch user statistics, including overview stats, charts data, and recent entries
 *
 * Query params:
 * - type: 'overview' | 'words-over-time' | 'heatmap' | 'recent' (default: 'overview')
 * - months: number of months for words-over-time chart (default: 3)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'overview'

    // Handle different stat types
    switch (type) {
      case 'overview': {
        const stats = await calculateUserStats(user.id)
        return NextResponse.json(stats)
      }

      case 'words-over-time': {
        const months = parseInt(searchParams.get('months') || '3', 10)
        const endDate = new Date()
        const startDate = subMonths(endDate, months)

        const wordsData = await getWordsOverTime(user.id, startDate, endDate)
        return NextResponse.json(wordsData)
      }

      case 'heatmap': {
        const heatmapData = await getYearActivityHeatmap(user.id)
        return NextResponse.json(heatmapData)
      }

      case 'recent': {
        const limit = parseInt(searchParams.get('limit') || '5', 10)
        const entries = await getRecentEntries(user.id, limit)
        return NextResponse.json(entries)
      }

      case 'all': {
        // Return all stats at once for dashboard
        const [stats, wordsData, recentEntries] = await Promise.all([
          calculateUserStats(user.id),
          getWordsOverTime(user.id, subMonths(new Date(), 3), new Date()),
          getRecentEntries(user.id, 5)
        ])

        return NextResponse.json({
          overview: stats,
          wordsOverTime: wordsData,
          recentEntries
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid stat type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
