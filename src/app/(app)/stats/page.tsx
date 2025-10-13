import { BarChart3, TrendingUp, Calendar, Award, Target, Zap } from 'lucide-react'

export default function StatsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-normal text-[#F7F7FF] mb-2">
          Writing Statistics
        </h1>
        <p className="text-lg text-[#F7F7FF]/70">Track your progress and analyze your writing habits</p>
      </div>

      {/* Main Card */}
      <div className="border border-[#F7F7FF]/10 rounded-lg p-12">
        {/* Content */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-[#F7F7FF]/20 rounded-lg mb-6">
            <BarChart3 size={32} className="text-[#F7F7FF]" />
          </div>

          <h2 className="text-2xl font-normal text-[#F7F7FF] mb-4">Advanced Analytics Coming Soon</h2>
          <p className="text-lg text-[#F7F7FF]/70 mb-12 max-w-2xl mx-auto">
            We&apos;re building powerful insights to help you understand your writing patterns.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="border border-[#F7F7FF]/10 rounded-lg p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp size={20} className="text-[#F7F7FF]" />
              </div>
              <h3 className="font-normal text-[#F7F7FF] mb-2">Writing Trends</h3>
              <p className="text-sm text-[#F7F7FF]/70">Track words written over time</p>
            </div>

            <div className="border border-[#F7F7FF]/10 rounded-lg p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Calendar size={20} className="text-[#F7F7FF]" />
              </div>
              <h3 className="font-normal text-[#F7F7FF] mb-2">Frequency Heatmap</h3>
              <p className="text-sm text-[#F7F7FF]/70">Visualize writing patterns</p>
            </div>

            <div className="border border-[#F7F7FF]/10 rounded-lg p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target size={20} className="text-[#F7F7FF]" />
              </div>
              <h3 className="font-normal text-[#F7F7FF] mb-2">Goal Tracking</h3>
              <p className="text-sm text-[#F7F7FF]/70">Set and monitor goals</p>
            </div>

            <div className="border border-[#F7F7FF]/10 rounded-lg p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Award size={20} className="text-[#F7F7FF]" />
              </div>
              <h3 className="font-normal text-[#F7F7FF] mb-2">Best Days</h3>
              <p className="text-sm text-[#F7F7FF]/70">Discover your best work</p>
            </div>

            <div className="border border-[#F7F7FF]/10 rounded-lg p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 size={20} className="text-[#F7F7FF]" />
              </div>
              <h3 className="font-normal text-[#F7F7FF] mb-2">Progress Reports</h3>
              <p className="text-sm text-[#F7F7FF]/70">Monthly summaries</p>
            </div>

            <div className="border border-[#F7F7FF]/10 rounded-lg p-6 hover:border-[#F7F7FF]/20 transition-all duration-200">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap size={20} className="text-[#F7F7FF]" />
              </div>
              <h3 className="font-normal text-[#F7F7FF] mb-2">Productivity Insights</h3>
              <p className="text-sm text-[#F7F7FF]/70">Improve your workflow</p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-[#F7F7FF]/20 text-[#F7F7FF] rounded-lg">
              <span className="font-normal">In Active Development</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
