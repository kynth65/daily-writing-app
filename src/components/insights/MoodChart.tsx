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
        <p className="text-sm">No mood data available yet. Keep writing!</p>
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
    if (score > 0.3) return <Smile className="w-5 h-5" />;
    if (score < -0.3) return <Frown className="w-5 h-5" />;
    return <Meh className="w-5 h-5" />;
  };

  const getMoodLabel = (score: number) => {
    if (score > 0.5) return 'Very Positive';
    if (score > 0.2) return 'Positive';
    if (score > -0.2) return 'Neutral';
    if (score > -0.5) return 'Somewhat Negative';
    return 'Negative';
  };

  // Simple bar chart visualization
  const maxHeight = 100;

  return (
    <div className="space-y-6">
      {/* Overall Mood Summary */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F7F7FF]/10">
        <div>
          <p className="text-sm opacity-60 mb-1">Average Mood (30 days)</p>
          <div className="flex items-center gap-2">
            {getMoodIcon(avgMood)}
            <span className="text-lg">{getMoodLabel(avgMood)}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-60">Mood Score</p>
          <p className="text-lg">{avgMood.toFixed(2)}</p>
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
                className="text-sm px-3 py-1 border border-[rgba(247,247,255,0.1)] capitalize"
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Simple Mood Trend Chart */}
      <div>
        <p className="text-sm opacity-60 mb-4">Recent Mood Trends (Last 14 Days)</p>
        <div className="flex items-end gap-1 h-32">
          {moodData.slice(-14).map((data, index) => {
            const heightPercent = ((data.avgMood + 1) / 2) * 100; // Convert -1 to 1 range to 0-100%
            const height = (heightPercent / 100) * maxHeight;

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1 group relative"
              >
                <div
                  className="w-full bg-[rgba(247,247,255,0.2)] transition-all hover:bg-[rgba(247,247,255,0.3)]"
                  style={{ height: `${height}px` }}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-[#F7F7FF] text-[#3A4F41] px-2 py-1 text-xs whitespace-nowrap pointer-events-none transition-opacity">
                    {getMoodLabel(data.avgMood)}
                    <br />
                    {data.avgMood.toFixed(2)}
                  </div>
                </div>
                <div className="text-xs opacity-40 mt-1">
                  {new Date(data.date).getDate()}
                </div>
              </div>
            );
          })}
        </div>
        {/* Y-axis labels */}
        <div className="flex justify-between mt-2 text-xs opacity-40">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>
    </div>
  );
}
