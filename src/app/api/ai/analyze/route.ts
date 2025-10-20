/**
 * AI Sentiment Analysis API
 * POST /api/ai/analyze - Analyze sentiment of entry content
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeSentiment, isAIEnabled } from '@/lib/ai/openai';

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
    const { entryId, content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Skip analysis for very short entries (< 10 words)
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 10) {
      return NextResponse.json({
        sentiment: 'neutral',
        emotion: 'calm',
        moodScore: 0,
        skipped: true,
        reason: 'Entry too short for meaningful analysis',
      });
    }

    // Analyze sentiment
    const analysis = await analyzeSentiment(content);

    // If entryId provided, update the entry with sentiment data
    if (entryId) {
      const { error: updateError } = await supabase
        .from('entries')
        .update({
          sentiment: analysis.sentiment,
          emotion: analysis.emotion,
          mood_score: analysis.moodScore,
        })
        .eq('id', entryId)
        .eq('user_id', user.id); // Ensure user owns this entry

      if (updateError) {
        console.error('Failed to update entry with sentiment:', updateError);
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({
      sentiment: analysis.sentiment,
      emotion: analysis.emotion,
      moodScore: analysis.moodScore,
      confidence: analysis.confidence,
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
}
