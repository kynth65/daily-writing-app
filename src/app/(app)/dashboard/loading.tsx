export default function DashboardLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      {/* Header skeleton */}
      <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>

      {/* Stats cards grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Card 4 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* CTA Card skeleton */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-xl shadow-sm">
        <div className="h-8 w-64 bg-blue-400/50 rounded mb-2"></div>
        <div className="h-6 w-full max-w-md bg-blue-400/50 rounded mb-6"></div>
        <div className="h-12 w-40 bg-white/50 rounded-lg"></div>
      </div>
    </div>
  )
}
