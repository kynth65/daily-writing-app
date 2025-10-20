import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { analyzeSentiment, isAIEnabled } from '@/lib/ai/openai'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, date } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Calculate word count
    const text = content.replace(/<[^>]*>/g, ' ')
    const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0)
    const wordCount = words.length

    const { data, error } = await supabase
      .from('entries')
      .insert({
        user_id: user.id,
        content,
        word_count: wordCount,
        date: date || new Date().toISOString().split('T')[0],
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating entry:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Analyze sentiment in background (non-blocking)
    if (isAIEnabled() && wordCount >= 10) {
      analyzeSentiment(text)
        .then(async (analysis) => {
          await supabase
            .from('entries')
            .update({
              sentiment: analysis.sentiment,
              emotion: analysis.emotion,
              mood_score: analysis.moodScore,
            })
            .eq('id', data.id)
            .eq('user_id', user.id);
        })
        .catch((err) => {
          console.error('Background sentiment analysis failed:', err);
        });
    }

    return NextResponse.json({ entry: data }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/entries:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

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
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const date = searchParams.get('date')

    let query = supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (date) {
      query = query.eq('date', date)
    }

    const { data, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/entries:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
