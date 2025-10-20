/**
 * Mood Data API
 * GET /api/ai/mood - Fetch mood trends for the user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { subDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const startDate = format(subDays(new Date(), days), 'yyyy-MM-dd');

    // Fetch entries with mood data
    const { data: entries, error } = await supabase
      .from('entries')
      .select('date, mood_score, emotion')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .not('mood_score', 'is', null)
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching mood data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch mood data' },
        { status: 500 }
      );
    }

    // Group by date and calculate averages
    const moodByDate: Record<
      string,
      { total: number; count: number; emotions: string[] }
    > = {};

    entries?.forEach((entry) => {
      const date = entry.date;
      if (!moodByDate[date]) {
        moodByDate[date] = { total: 0, count: 0, emotions: [] };
      }
      moodByDate[date].total += entry.mood_score || 0;
      moodByDate[date].count += 1;
      if (entry.emotion) {
        moodByDate[date].emotions.push(entry.emotion);
      }
    });

    // Format response
    const moodData = Object.entries(moodByDate).map(([date, data]) => ({
      date,
      avgMood: data.total / data.count,
      entryCount: data.count,
      emotions: [...new Set(data.emotions)], // Unique emotions
    }));

    return NextResponse.json(moodData);
  } catch (error) {
    console.error('Error in GET /api/ai/mood:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
