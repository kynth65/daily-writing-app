export default function DashboardLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      {/* Header skeleton */}
      <div className="h-9 w-64 bg-[#F7F7FF]/10 rounded mb-2"></div>
      <div className="h-6 w-48 bg-[#F7F7FF]/10 rounded mb-8"></div>

      {/* Stats cards grid */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Card 1 */}
        <div className="bg-[#F7F7FF]/5 p-6 rounded-xl border border-[#F7F7FF]/10">
          <div className="h-4 w-32 bg-[#F7F7FF]/10 rounded mb-2"></div>
          <div className="h-10 w-24 bg-[#F7F7FF]/10 rounded mb-1"></div>
          <div className="h-4 w-full bg-[#F7F7FF]/10 rounded"></div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#F7F7FF]/5 p-6 rounded-xl border border-[#F7F7FF]/10">
          <div className="h-4 w-32 bg-[#F7F7FF]/10 rounded mb-2"></div>
          <div className="h-10 w-16 bg-[#F7F7FF]/10 rounded mb-1"></div>
          <div className="h-4 w-full bg-[#F7F7FF]/10 rounded"></div>
        </div>

        {/* Card 3 */}
        <div className="bg-[#F7F7FF]/5 p-6 rounded-xl border border-[#F7F7FF]/10">
          <div className="h-4 w-32 bg-[#F7F7FF]/10 rounded mb-2"></div>
          <div className="h-10 w-20 bg-[#F7F7FF]/10 rounded mb-1"></div>
          <div className="h-4 w-full bg-[#F7F7FF]/10 rounded"></div>
        </div>

        {/* Card 4 */}
        <div className="bg-[#F7F7FF]/5 p-6 rounded-xl border border-[#F7F7FF]/10">
          <div className="h-4 w-32 bg-[#F7F7FF]/10 rounded mb-2"></div>
          <div className="h-10 w-24 bg-[#F7F7FF]/10 rounded mb-1"></div>
          <div className="h-4 w-full bg-[#F7F7FF]/10 rounded"></div>
        </div>
      </div>

      {/* CTA Card skeleton */}
      <div className="bg-[#F7F7FF]/5 p-8 rounded-xl border border-[#F7F7FF]/10">
        <div className="h-8 w-64 bg-[#F7F7FF]/10 rounded mb-2"></div>
        <div className="h-6 w-full max-w-md bg-[#F7F7FF]/10 rounded mb-6"></div>
        <div className="h-12 w-40 bg-[#F7F7FF]/10 rounded-lg"></div>
      </div>
    </div>
  )
}
