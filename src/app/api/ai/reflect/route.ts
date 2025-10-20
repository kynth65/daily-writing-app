/**
 * AI Reflections Generation API
 * POST /api/ai/reflect - Generate AI reflection from entries
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateReflection, isAIEnabled } from '@/lib/ai/openai';
import { subDays, subWeeks, format } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    // Check if AI is enabled
    if (!isAIEnabled()) {
      return NextResponse.json(
        { error: 'AI features are not configured' },
        { status: 503 }
      );
    }

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { type = 'weekly' } = body; // 'weekly' or 'monthly'

    if (!['weekly', 'monthly'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be "weekly" or "monthly"' },
        { status: 400 }
      );
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = type === 'weekly' ? subWeeks(endDate, 1) : subDays(endDate, 30);

    // Fetch entries for the period
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('id, content, date, word_count, sentiment, emotion')
      .eq('user_id', user.id)
      .gte('date', format(startDate, 'yyyy-MM-dd'))
      .lte('date', format(endDate, 'yyyy-MM-dd'))
      .order('date', { ascending: true });

    if (entriesError) {
      console.error('Error fetching entries:', entriesError);
      return NextResponse.json(
        { error: 'Failed to fetch entries' },
        { status: 500 }
      );
    }

    // Check if user has enough entries
    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: 'No entries found for this period. Write more to generate a reflection!' },
        { status: 400 }
      );
    }

    // Prepare entries for reflection
    const reflectionEntries = entries.map((entry) => ({
      date: entry.date || '',
      content: entry.content || '',
      sentiment: entry.sentiment,
      emotion: entry.emotion,
      wordCount: entry.word_count || 0,
    }));

    // Generate reflection
    const reflection = await generateReflection(reflectionEntries, type);

    // Save reflection to database
    const { data: savedReflection, error: saveError } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        title: reflection.title,
        content: reflection.content,
        reflection_type: type,
        period_start: format(startDate, 'yyyy-MM-dd'),
        period_end: format(endDate, 'yyyy-MM-dd'),
        entry_count: entries.length,
        themes: reflection.themes,
        insights: reflection.insights,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving reflection:', saveError);
      // Still return the reflection even if saving fails
      return NextResponse.json({
        ...reflection,
        saved: false,
        error: 'Reflection generated but not saved',
      });
    }

    return NextResponse.json({
      ...savedReflection,
      saved: true,
    });
  } catch (error) {
    console.error('Reflection generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reflection' },
      { status: 500 }
    );
  }
}

// GET /api/ai/reflect - Fetch user's reflections
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type'); // Filter by type if provided

    // Build query
    let query = supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (type && ['weekly', 'monthly', 'custom'].includes(type)) {
      query = query.eq('reflection_type', type);
    }

    const { data: reflections, error } = await query;

    if (error) {
      console.error('Error fetching reflections:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reflections' },
        { status: 500 }
      );
    }

    return NextResponse.json(reflections || []);
  } catch (error) {
    console.error('Error in GET /api/ai/reflect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
