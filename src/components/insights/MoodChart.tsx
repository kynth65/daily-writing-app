'use client';

import { Smile, Meh, Frown } from 'lucide-react';

interface MoodData {
  date: string;
  avgMood: number; // -1 to 1
  entryCount: number;
  emotions?: string[];
}

interface MoodChartProps {
  moodData: MoodData[];
}

export default function MoodChart({ moodData }: MoodChartProps) {
  if (!moodData || moodData.length === 0) {
    return (
      <div className="text-center py-8 opacity-60">
        <p className="text-base">No mood data available yet. Keep writing!</p>
      </div>
    );
  }

  // Get most common emotion
  const allEmotions = moodData.flatMap((d) => d.emotions || []);
  const emotionCounts = allEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([emotion]) => emotion);

  // Calculate average mood
  const avgMood =
    moodData.reduce((sum, d) => sum + d.avgMood, 0) / moodData.length;

  const getMoodIcon = (score: number) => {
    if (score > 0.3) return <Smile className="w-8 h-8" />;
    if (score < -0.3) return <Frown className="w-8 h-8" />;
    return <Meh className="w-8 h-8" />;
  };

  const getMoodLabel = (score: number) => {
    if (score > 0.5) return 'Very Positive';
    if (score > 0.2) return 'Positive';
    if (score > -0.2) return 'Neutral';
    if (score > -0.5) return 'Somewhat Negative';
    return 'Negative';
  };

  // Get color based on mood score
  const getMoodColor = (score: number) => {
    if (score > 0.5) return '#10b981'; // Green for very positive
    if (score > 0.2) return '#84cc16'; // Light green for positive
    if (score > -0.2) return '#eab308'; // Yellow for neutral
    if (score > -0.5) return '#f97316'; // Orange for somewhat negative
    return '#ef4444'; // Red for negative
  };

  // Convert -1 to 1 range to 0-100% for bar fill
  const fillPercent = ((avgMood + 1) / 2) * 100;
  const moodColor = getMoodColor(avgMood);

  return (
    <div className="space-y-6">
      {/* Overall Mood Summary */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F7F7FF]/10">
        <div>
          <p className="text-sm opacity-60 mb-1">Average Mood (30 days)</p>
          <div className="flex items-center gap-2">
            {getMoodIcon(avgMood)}
            <span className="text-2xl">{getMoodLabel(avgMood)}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-60">Mood Score</p>
          <p className="text-2xl">{avgMood.toFixed(2)}</p>
        </div>
      </div>

      {/* Mood Health Bar */}
      <div>
        <p className="text-sm opacity-60 mb-4">Overall Mood Level</p>
        <div className="relative h-16 bg-[rgba(247,247,255,0.1)] border-2 border-[rgba(247,247,255,0.2)] rounded-lg overflow-hidden">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${fillPercent}%`,
              backgroundColor: moodColor,
            }}
          />
          {/* Percentage label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#F7F7FF] drop-shadow-lg">
              {fillPercent.toFixed(0)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-base opacity-40">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>

      {/* Top Emotions */}
      {topEmotions.length > 0 && (
        <div>
          <p className="text-sm opacity-60 mb-3">Most Common Emotions</p>
          <div className="flex flex-wrap gap-2">
            {topEmotions.map((emotion) => (
              <span
                key={emotion}
                className="text-base px-3 py-1 border border-[rgba(247,247,255,0.1)] capitalize"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
