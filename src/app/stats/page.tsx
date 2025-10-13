import { BarChart3 } from 'lucide-react'

export default function StatsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Writing Statistics</h1>
        <p className="text-gray-600">Track your progress and analyze your writing habits</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-4">
          <BarChart3 size={32} className="text-purple-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Advanced Analytics Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This page will provide detailed insights into your writing patterns, word count trends,
          and productivity metrics.
        </p>
        <div className="text-sm text-gray-500">
          <p>Features in development:</p>
          <ul className="mt-2 space-y-1">
            <li>• Words written over time chart</li>
            <li>• Writing frequency heatmap</li>
            <li>• Average words per entry</li>
            <li>• Best writing day analysis</li>
            <li>• Monthly progress reports</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
