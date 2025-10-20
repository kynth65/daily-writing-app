'use client'

import { TrendingUp, Calendar, Award, Zap, Flame, BookOpen, PenTool, Smile } from 'lucide-react'
import StatCard from '@/components/stats/StatCard'
import MoodChart from '@/components/insights/MoodChart'
import { useStats } from '@/hooks/useStats'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function StatsPage() {
  const { stats, isLoading: loading } = useStats()
  const { data: moodData } = useSWR('/api/ai/mood?days=30', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-normal text-[#F7F7FF] mb-2">
          Writing Statistics
        </h1>
        <p className="text-lg text-[#F7F7FF]/70">Track your progress and analyze your writing habits</p>
      </div>

      {loading ? (
        <div className="border border-[#F7F7FF]/10 rounded-lg p-12 text-center">
          <p className="text-[#F7F7FF]/70">Loading your statistics...</p>
        </div>
      ) : (
        <>
          {/* Overview Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Current Streak"
              value={stats?.currentStreak || 0}
              subtitle="consecutive days"
              icon={Flame}
            />
            <StatCard
              title="Longest Streak"
              value={stats?.longestStreak || 0}
              subtitle="days in a row"
              icon={Award}
            />
            <StatCard
              title="Total Entries"
              value={formatNumber(stats?.totalEntries || 0)}
              subtitle="journal entries"
              icon={BookOpen}
            />
            <StatCard
              title="Total Words"
              value={formatNumber(stats?.totalWords || 0)}
              subtitle="words written"
              icon={PenTool}
            />
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Writing Habits */}
            <div className="border border-[#F7F7FF]/10 rounded-lg p-6">
              <h2 className="text-xl font-normal text-[#F7F7FF] mb-6 flex items-center gap-2">
                <TrendingUp size={24} />
                Writing Habits
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[#F7F7FF]/10">
                  <span className="text-base text-[#F7F7FF]/70">Average Words per Entry</span>
                  <span className="text-[#F7F7FF] text-base">{formatNumber(stats?.averageWords || 0)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F7F7FF]/10">
                  <span className="text-base text-[#F7F7FF]/70">Writing Frequency</span>
                  <span className="text-[#F7F7FF] text-base">{stats?.writingFrequency || 0} entries/week</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F7F7FF]/10">
                  <span className="text-base text-[#F7F7FF]/70">Best Writing Day</span>
                  <span className="text-[#F7F7FF] text-base">{stats?.bestWritingDay || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border border-[#F7F7FF]/10 rounded-lg p-6">
              <h2 className="text-xl font-normal text-[#F7F7FF] mb-6 flex items-center gap-2">
                <Calendar size={24} />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[#F7F7FF]/10">
                  <span className="text-base text-[#F7F7FF]/70">This Week</span>
                  <span className="text-[#F7F7FF] text-base">{stats?.entriesThisWeek || 0} entries</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F7F7FF]/10">
                  <span className="text-base text-[#F7F7FF]/70">Words This Week</span>
                  <span className="text-[#F7F7FF] text-base">{formatNumber(stats?.wordsThisWeek || 0)}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F7F7FF]/10">
                  <span className="text-base text-[#F7F7FF]/70">This Month</span>
                  <span className="text-[#F7F7FF] text-base">{stats?.entriesThisMonth || 0} entries</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#F7F7FF]/10">
                  <span className="text-base text-[#F7F7FF]/70">Words This Month</span>
                  <span className="text-[#F7F7FF] text-base">{formatNumber(stats?.wordsThisMonth || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mood Insights */}
          <div className="border border-[#F7F7FF]/10 rounded-lg p-6 mb-10">
            <h2 className="text-xl font-normal text-[#F7F7FF] mb-6 flex items-center gap-2">
              <Smile size={24} />
              Mood Insights
            </h2>
            <MoodChart moodData={moodData || []} />
          </div>

          {/* Insights & Motivation */}
          <div className="border border-[#F7F7FF]/10 rounded-lg p-8">
            <h2 className="text-xl font-normal text-[#F7F7FF] mb-4 flex items-center gap-2">
              <Zap size={24} />
              Your Progress
            </h2>
            <div className="space-y-4">
              {stats?.totalEntries === 0 ? (
                <p className="text-[#F7F7FF]/70 text-lg">
                  Start your writing journey today! Create your first entry and begin building a consistent writing habit.
                </p>
              ) : (
                <>
                  <p className="text-[#F7F7FF]/70 text-lg">
                    Great work! You have written <span className="text-[#F7F7FF]">{formatNumber(stats?.totalWords || 0)} words</span> across{' '}
                    <span className="text-[#F7F7FF]">{stats?.totalEntries} entries</span>.
                  </p>
                  {(stats?.currentStreak ?? 0) > 0 && (
                    <p className="text-[#F7F7FF]/70 text-lg">
                      You are on a <span className="text-[#F7F7FF]">{stats?.currentStreak}-day streak</span>! Keep writing to maintain your momentum.
                    </p>
                  )}
                  {stats?.currentStreak === 0 && (stats?.longestStreak ?? 0) > 0 && (
                    <p className="text-[#F7F7FF]/70 text-lg">
                      Your longest streak is <span className="text-[#F7F7FF]">{stats?.longestStreak} days</span>. Start writing again to build a new streak!
                    </p>
                  )}
                  {stats?.bestWritingDay && (
                    <p className="text-[#F7F7FF]/70 text-lg">
                      You write most consistently on <span className="text-[#F7F7FF]">{stats.bestWritingDay}s</span>. Consider making this your dedicated writing day!
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
