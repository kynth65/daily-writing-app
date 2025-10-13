import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PenTool, Flame, BookOpen, Award, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-normal text-[#F7F7FF] mb-2">
          Welcome back!
        </h1>
        <p className="text-lg text-[#F7F7FF]/70">Ready to continue your writing journey?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {/* Current Streak Card */}
        <div className="border border-[#F7F7FF]/10 p-6 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <Flame className="text-[#F7F7FF]" size={20} />
            </div>
          </div>
          <h3 className="text-xs font-normal text-[#F7F7FF]/70 mb-2 uppercase tracking-wide">Current Streak</h3>
          <p className="text-3xl font-normal text-[#F7F7FF] mb-2">0 <span className="text-lg text-[#F7F7FF]/70">days</span></p>
          <p className="text-sm text-[#F7F7FF]/50">Keep writing daily</p>
        </div>

        {/* Total Entries Card */}
        <div className="border border-[#F7F7FF]/10 p-6 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <BookOpen className="text-[#F7F7FF]" size={20} />
            </div>
          </div>
          <h3 className="text-xs font-normal text-[#F7F7FF]/70 mb-2 uppercase tracking-wide">Total Entries</h3>
          <p className="text-3xl font-normal text-[#F7F7FF] mb-2">0 <span className="text-lg text-[#F7F7FF]/70">posts</span></p>
          <p className="text-sm text-[#F7F7FF]/50">Start your journey</p>
        </div>

        {/* Total Words Card */}
        <div className="border border-[#F7F7FF]/10 p-6 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <PenTool className="text-[#F7F7FF]" size={20} />
            </div>
          </div>
          <h3 className="text-xs font-normal text-[#F7F7FF]/70 mb-2 uppercase tracking-wide">Total Words</h3>
          <p className="text-3xl font-normal text-[#F7F7FF] mb-2">0 <span className="text-lg text-[#F7F7FF]/70">words</span></p>
          <p className="text-sm text-[#F7F7FF]/50">Every word counts</p>
        </div>

        {/* Longest Streak Card */}
        <div className="border border-[#F7F7FF]/10 p-6 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <Award className="text-[#F7F7FF]" size={20} />
            </div>
          </div>
          <h3 className="text-xs font-normal text-[#F7F7FF]/70 mb-2 uppercase tracking-wide">Best Streak</h3>
          <p className="text-3xl font-normal text-[#F7F7FF] mb-2">0 <span className="text-lg text-[#F7F7FF]/70">days</span></p>
          <p className="text-sm text-[#F7F7FF]/50">Beat your record</p>
        </div>
      </div>

      {/* Write Today CTA */}
      <div className="border border-[#F7F7FF]/10 rounded-lg p-10 mb-8 hover:border-[#F7F7FF]/20 transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
            <PenTool className="text-[#F7F7FF]" size={24} />
          </div>
          <h2 className="text-2xl font-normal text-[#F7F7FF]">Write Your Daily Entry</h2>
        </div>
        <p className="mb-8 text-[#F7F7FF]/70 text-base max-w-2xl">
          Take a few moments to reflect on your day and capture your thoughts.
        </p>
        <Link
          href="/write"
          className="inline-flex items-center gap-3 px-6 py-3 border-2 border-[#F7F7FF] text-[#F7F7FF] rounded-lg font-normal hover:bg-[#F7F7FF]/10 transition-all duration-200 cursor-pointer"
        >
          <PenTool size={20} />
          Start Writing Now
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/history"
          className="border border-[#F7F7FF]/10 p-6 rounded-lg hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/20 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <BookOpen className="text-[#F7F7FF]" size={18} />
            </div>
            <div>
              <h3 className="font-normal text-[#F7F7FF] mb-1">View History</h3>
              <p className="text-sm text-[#F7F7FF]/70">Browse past entries</p>
            </div>
          </div>
        </Link>

        <Link
          href="/stats"
          className="border border-[#F7F7FF]/10 p-6 rounded-lg hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/20 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-[#F7F7FF]" size={18} />
            </div>
            <div>
              <h3 className="font-normal text-[#F7F7FF] mb-1">Statistics</h3>
              <p className="text-sm text-[#F7F7FF]/70">View your analytics</p>
            </div>
          </div>
        </Link>

        <Link
          href="/settings"
          className="border border-[#F7F7FF]/10 p-6 rounded-lg hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/20 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-[#F7F7FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-normal text-[#F7F7FF] mb-1">Settings</h3>
              <p className="text-sm text-[#F7F7FF]/70">Customize your experience</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
