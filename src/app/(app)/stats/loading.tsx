export default function StatsLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-9 w-72 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Main content skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
        <div className="text-center">
          {/* Icon placeholder */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>

          {/* Title skeleton */}
          <div className="h-7 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2"></div>

          {/* Description skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-5 w-full max-w-xl bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="h-5 w-80 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          </div>

          {/* Feature list skeleton */}
          <div className="space-y-2 max-w-xs mx-auto">
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-52 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
