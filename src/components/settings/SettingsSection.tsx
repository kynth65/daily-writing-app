import { ReactNode } from 'react'

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="border-b border-[rgba(247,247,255,0.1)] pb-8 mb-8 last:border-b-0 last:pb-0 last:mb-0">
      <div className="mb-6">
        <h2 className="text-xl text-[#F7F7FF] mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-[#F7F7FF] opacity-60">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}
