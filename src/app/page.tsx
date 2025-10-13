import Link from 'next/link'
import { PenTool, TrendingUp, Target } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#3A4F41]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
              <PenTool className="text-[#F7F7FF]" size={20} />
            </div>
            <span className="text-2xl font-normal text-[#F7F7FF]">
              Daily Writer
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-[#F7F7FF] hover:text-[#F7F7FF]/80 transition-all duration-200 font-normal cursor-pointer"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 border border-[#F7F7FF] text-[#F7F7FF] rounded-lg hover:bg-[#F7F7FF]/10 transition-all duration-200 font-normal cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h1 className="text-5xl md:text-7xl font-normal mb-8 leading-tight text-[#F7F7FF]">
            Build Your Daily Writing Ritual
          </h1>

          <p className="text-xl md:text-2xl text-[#F7F7FF]/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            A distraction-free writing space to transform your thoughts into words.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="px-8 py-4 border-2 border-[#F7F7FF] text-[#F7F7FF] rounded-lg hover:bg-[#F7F7FF]/10 transition-all duration-200 font-normal text-lg cursor-pointer"
            >
              Start Writing Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border border-[#F7F7FF]/30 text-[#F7F7FF] rounded-lg hover:border-[#F7F7FF]/50 hover:bg-[#F7F7FF]/5 transition-all duration-200 font-normal text-lg cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-32">
          <div className="border border-[#F7F7FF]/10 p-8 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-200">
            <div className="w-12 h-12 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-6">
              <PenTool className="text-[#F7F7FF]" size={20} />
            </div>
            <h3 className="text-xl font-normal mb-4 text-[#F7F7FF]">Daily Prompts</h3>
            <p className="text-[#F7F7FF]/70 leading-relaxed">
              Thoughtful prompts to spark creativity and overcome writer&apos;s block.
            </p>
          </div>

          <div className="border border-[#F7F7FF]/10 p-8 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-200">
            <div className="w-12 h-12 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-6">
              <Target className="text-[#F7F7FF]" size={20} />
            </div>
            <h3 className="text-xl font-normal mb-4 text-[#F7F7FF]">Streak Tracking</h3>
            <p className="text-[#F7F7FF]/70 leading-relaxed">
              Build momentum and stay motivated with visual streak tracking.
            </p>
          </div>

          <div className="border border-[#F7F7FF]/10 p-8 rounded-lg hover:border-[#F7F7FF]/20 transition-all duration-200">
            <div className="w-12 h-12 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-6">
              <TrendingUp className="text-[#F7F7FF]" size={20} />
            </div>
            <h3 className="text-xl font-normal mb-4 text-[#F7F7FF]">Analytics</h3>
            <p className="text-[#F7F7FF]/70 leading-relaxed">
              Track your word count and writing frequency over time.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto border border-[#F7F7FF]/10 rounded-lg p-12 md:p-16 mb-32">
          <h2 className="text-3xl md:text-4xl font-normal text-center mb-4 text-[#F7F7FF]">
            How It Works
          </h2>
          <p className="text-center text-[#F7F7FF]/70 mb-16 text-lg">Simple steps to build your writing habit</p>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 border-2 border-[#F7F7FF] text-[#F7F7FF] rounded-lg flex items-center justify-center font-normal text-xl mb-6">
                1
              </div>
              <h3 className="text-lg font-normal mb-3 text-[#F7F7FF]">Sign Up Free</h3>
              <p className="text-[#F7F7FF]/70 leading-relaxed">
                Create your account in seconds. Start writing immediately.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 border-2 border-[#F7F7FF] text-[#F7F7FF] rounded-lg flex items-center justify-center font-normal text-xl mb-6">
                2
              </div>
              <h3 className="text-lg font-normal mb-3 text-[#F7F7FF]">Write Daily</h3>
              <p className="text-[#F7F7FF]/70 leading-relaxed">
                Use our distraction-free editor with daily prompts.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 border-2 border-[#F7F7FF] text-[#F7F7FF] rounded-lg flex items-center justify-center font-normal text-xl mb-6">
                3
              </div>
              <h3 className="text-lg font-normal mb-3 text-[#F7F7FF]">Track Progress</h3>
              <p className="text-[#F7F7FF]/70 leading-relaxed">
                Watch your streaks grow and gain insights.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-5xl mx-auto text-center border border-[#F7F7FF]/10 rounded-lg p-16 md:p-20">
          <h2 className="text-3xl md:text-4xl font-normal mb-6 text-[#F7F7FF]">
            Ready to Start Writing?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-[#F7F7FF]/70 max-w-2xl mx-auto">
            Build a consistent daily writing practice.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 border-2 border-[#F7F7FF] text-[#F7F7FF] rounded-lg hover:bg-[#F7F7FF]/10 transition-all duration-200 font-normal text-lg cursor-pointer"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 mt-32 border-t border-[#F7F7FF]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
                <PenTool className="text-[#F7F7FF]" size={16} />
              </div>
              <span className="text-xl font-normal text-[#F7F7FF]">
                Daily Writer
              </span>
            </div>
            <p className="text-[#F7F7FF]/70 text-center max-w-md">
              Build your writing habit, one day at a time.
            </p>
          </div>
          <div className="pt-8 text-center text-[#F7F7FF]/50 text-sm">
            <p>© 2025 Daily Writer</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
