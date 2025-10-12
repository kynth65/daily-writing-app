'use client'

import { Flame, Trophy } from 'lucide-react'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  isAtRisk?: boolean
}

export default function StreakDisplay({
  currentStreak,
  longestStreak,
  isAtRisk = false,
}: StreakDisplayProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Current Streak */}
      <div
        className={`
          p-6 rounded-xl shadow-sm transition-colors
          ${
            isAtRisk
              ? 'bg-orange-50 border-2 border-orange-200'
              : 'bg-white border border-gray-200'
          }
        `}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`
              p-2 rounded-lg
              ${isAtRisk ? 'bg-orange-100' : 'bg-blue-50'}
            `}
          >
            <Flame
              size={24}
              className={isAtRisk ? 'text-orange-500' : 'text-blue-500'}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
            {isAtRisk && (
              <p className="text-xs text-orange-600 font-medium">At risk!</p>
            )}
          </div>
        </div>

        <p className="text-4xl font-bold mb-2">{currentStreak}</p>
        <p className="text-sm text-gray-600">
          {currentStreak === 0
            ? 'Start your streak today!'
            : currentStreak === 1
            ? 'Keep it going!'
            : `${currentStreak} days in a row!`}
        </p>

        {isAtRisk && (
          <div className="mt-3 p-3 bg-orange-100 rounded-lg">
            <p className="text-xs text-orange-800">
              Write today to keep your streak alive! 🔥
            </p>
          </div>
        )}
      </div>

      {/* Longest Streak */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-yellow-50">
            <Trophy size={24} className="text-yellow-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-500">Longest Streak</h3>
        </div>

        <p className="text-4xl font-bold mb-2">{longestStreak}</p>
        <p className="text-sm text-gray-600">
          {longestStreak === 0
            ? 'Set your first record!'
            : longestStreak === currentStreak
            ? "You're at your best!"
            : 'Your personal best'}
        </p>

        {currentStreak > 0 && currentStreak === longestStreak && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              New personal record! Keep it up! 🏆
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
