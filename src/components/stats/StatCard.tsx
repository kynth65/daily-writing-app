import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend
}: StatCardProps) {
  return (
    <div className="border border-[rgba(247,247,255,0.1)] bg-[#3A4F41] p-6 transition-colors hover:border-[rgba(247,247,255,0.2)]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#F7F7FF] opacity-60">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl text-[#F7F7FF]">{value}</p>
            {trend && (
              <span
                className={`text-sm ${
                  trend.direction === 'up'
                    ? 'text-green-400'
                    : trend.direction === 'down'
                    ? 'text-red-400'
                    : 'text-[#F7F7FF] opacity-60'
                }`}
              >
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-[#F7F7FF] opacity-50">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="ml-4 opacity-30">
            <Icon size={24} className="text-[#F7F7FF]" />
          </div>
        )}
      </div>
    </div>
  )
}
