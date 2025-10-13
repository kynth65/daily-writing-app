export default function WriteLoading() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-6 w-72 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Prompt card skeleton */}
      <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 bg-purple-200 dark:bg-purple-700 rounded"></div>
              <div className="h-5 w-32 bg-purple-200 dark:bg-purple-700 rounded"></div>
            </div>
            <div className="space-y-2 mb-2">
              <div className="h-5 w-full bg-purple-100 dark:bg-purple-800 rounded"></div>
              <div className="h-5 w-3/4 bg-purple-100 dark:bg-purple-800 rounded"></div>
            </div>
            <div className="h-6 w-24 bg-purple-200 dark:bg-purple-700 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Editor skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 min-h-[400px]">
        <div className="space-y-4">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Save button skeleton */}
      <div className="mt-6 flex justify-end">
        <div className="h-12 w-36 bg-purple-200 dark:bg-purple-700 rounded-lg"></div>
      </div>

      {/* Tips skeleton */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="space-y-2">
          <div className="h-4 w-full bg-blue-100 dark:bg-blue-800 rounded"></div>
          <div className="h-4 w-5/6 bg-blue-100 dark:bg-blue-800 rounded"></div>
        </div>
      </div>
    </div>
  )
}
