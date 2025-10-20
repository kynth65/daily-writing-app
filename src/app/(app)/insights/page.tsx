'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import ReflectionCard from '@/components/insights/ReflectionCard';
import useSWR, { mutate } from 'swr';

interface Reflection {
  id: string;
  title: string;
  content: string;
  reflection_type: 'weekly' | 'monthly' | 'custom';
  period_start: string;
  period_end: string;
  entry_count: number;
  themes: string[];
  insights: string[];
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InsightsPage() {
  const [generating, setGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'weekly' | 'monthly'>('weekly');
  const [error, setError] = useState<string | null>(null);

  // Fetch reflections
  const { data: reflections, isLoading } = useSWR<Reflection[]>(
    '/api/ai/reflect?limit=20',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const handleGenerate = async (type: 'weekly' | 'monthly') => {
    setGenerating(true);
    setGenerationType(type);
    setError(null);

    try {
      const response = await fetch('/api/ai/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate reflection');
      }

      // Refresh reflections list
      await mutate('/api/ai/reflect?limit=20');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reflection');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3A4F41] text-[#F7F7FF] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-10 h-10" />
            <h1 className="text-3xl">Insights</h1>
          </div>
          <p className="opacity-80 text-lg">
            AI-powered reflections on your writing journey
          </p>
        </div>

        {/* Generate Buttons */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => handleGenerate('weekly')}
            disabled={generating}
            className="px-6 py-3 border border-[#F7F7FF] transition-colors hover:bg-[rgba(247,247,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
          >
            {generating && generationType === 'weekly' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Weekly Reflection'
            )}
          </button>

          <button
            onClick={() => handleGenerate('monthly')}
            disabled={generating}
            className="px-6 py-3 border border-[#F7F7FF] transition-colors hover:bg-[rgba(247,247,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-base"
          >
            {generating && generationType === 'monthly' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Monthly Reflection'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 border border-red-400/30 bg-red-400/5">
            <p className="text-base">{error}</p>
          </div>
        )}

        {/* Reflections List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin opacity-60" />
          </div>
        ) : reflections && reflections.length > 0 ? (
          <div className="space-y-6">
            {reflections.map((reflection) => (
              <ReflectionCard key={reflection.id} reflection={reflection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="opacity-60 mb-4 text-lg">
              No reflections yet. Generate your first reflection to see AI insights
              about your writing journey.
            </p>
            <p className="text-base opacity-50">
              Write at least a few entries before generating a reflection for best
              results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
