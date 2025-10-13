import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PenTool } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
      <p className="text-gray-600 mb-8">Ready to write today?</p>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Current Streak Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Current Streak</h3>
          <p className="text-4xl font-bold mb-1">0 days</p>
          <p className="text-sm text-gray-500">Keep writing to maintain your streak!</p>
        </div>

        {/* Total Entries Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Entries</h3>
          <p className="text-4xl font-bold mb-1">0</p>
          <p className="text-sm text-gray-500">Start your writing journey today</p>
        </div>

        {/* Total Words Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Words</h3>
          <p className="text-4xl font-bold mb-1">0</p>
          <p className="text-sm text-gray-500">Every word counts!</p>
        </div>

        {/* Longest Streak Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Longest Streak</h3>
          <p className="text-4xl font-bold mb-1">0 days</p>
          <p className="text-sm text-gray-500">Challenge yourself to beat this!</p>
        </div>
      </div>

      {/* Write Today CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-2">Write Your Daily Entry</h2>
        <p className="mb-6 text-blue-100">
          Take a few moments to reflect on your day and capture your thoughts.
        </p>
        <Link
          href="/write"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <PenTool size={20} />
          Start Writing
        </Link>
      </div>
    </div>
  )
}
