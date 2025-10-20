/**
 * OpenAI API Integration
 * Handles sentiment analysis and AI reflection generation
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  emotion: string;
  moodScore: number; // -1 to 1
  confidence: number; // 0 to 1
}

export interface ReflectionEntry {
  date: string;
  content: string;
  sentiment?: string;
  emotion?: string;
  wordCount: number;
}

export interface ReflectionResult {
  title: string;
  content: string;
  themes: string[];
  insights: string[];
  encouragement: string;
}

/**
 * Analyze sentiment and emotion from entry content
 */
export async function analyzeSentiment(content: string): Promise<SentimentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cost-effective
      messages: [
        {
          role: 'system',
          content: `You are a sentiment analysis expert. Analyze the emotional tone of journal entries.

Return a JSON object with:
- sentiment: "positive", "neutral", or "negative"
- emotion: primary emotion (joy, gratitude, sadness, anxiety, calm, excitement, frustration, contentment, nostalgia, hope, etc.)
- moodScore: numerical score from -1 (very negative) to 1 (very positive)
- confidence: how confident you are in this analysis (0 to 1)

Be nuanced and accurate. Consider context and subtle emotional cues.`,
        },
        {
          role: 'user',
          content: `Analyze this journal entry:\n\n${content}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for consistent analysis
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      sentiment: result.sentiment || 'neutral',
      emotion: result.emotion || 'calm',
      moodScore: parseFloat(result.moodScore) || 0,
      confidence: parseFloat(result.confidence) || 0.5,
    };
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    // Return neutral fallback
    return {
      sentiment: 'neutral',
      emotion: 'calm',
      moodScore: 0,
      confidence: 0,
    };
  }
}

/**
 * Generate AI reflection from multiple entries
 */
export async function generateReflection(
  entries: ReflectionEntry[],
  periodType: 'weekly' | 'monthly'
): Promise<ReflectionResult> {
  try {
    // Prepare entry summaries
    const entrySummaries = entries.map((entry) => ({
      date: entry.date,
      wordCount: entry.wordCount,
      sentiment: entry.sentiment,
      emotion: entry.emotion,
      preview: entry.content.substring(0, 500), // First 500 chars
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // More sophisticated model for reflections
      messages: [
        {
          role: 'system',
          content: `You are a thoughtful, encouraging journal reflection assistant. Create meaningful insights from journal entries.

Your reflections should:
- Be warm, personal, and encouraging
- Identify patterns in emotions, topics, and experiences
- Celebrate growth and positive moments
- Gently note challenges while being supportive
- Surface forgotten meaningful moments
- Be concise yet insightful (2-3 paragraphs)

Return a JSON object with:
- title: catchy title for this reflection (4-8 words)
- content: the main reflection text (2-3 paragraphs, warm and personal)
- themes: array of 3-5 key themes identified (single words or short phrases)
- insights: array of 3-5 specific observations or patterns
- encouragement: one encouraging sentence to end with

Use a conversational, second-person tone ("you wrote about...", "you've been...").`,
        },
        {
          role: 'user',
          content: `Generate a ${periodType} reflection from these ${entries.length} journal entries:\n\n${JSON.stringify(entrySummaries, null, 2)}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7, // More creative for reflections
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      title: result.title || `Your ${periodType} reflection`,
      content: result.content || 'Thank you for writing consistently.',
      themes: result.themes || [],
      insights: result.insights || [],
      encouragement: result.encouragement || 'Keep writing!',
    };
  } catch (error) {
    console.error('Reflection generation failed:', error);
    // Return fallback reflection
    return {
      title: `Your ${periodType} reflection`,
      content: `You wrote ${entries.length} entries this ${periodType === 'weekly' ? 'week' : 'month'}. Keep up the great work!`,
      themes: ['consistency', 'reflection'],
      insights: [`Wrote ${entries.length} entries`],
      encouragement: 'Keep writing and reflecting!',
    };
  }
}

/**
 * Check if OpenAI API is configured
 */
export function isAIEnabled(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
