'use client'

import { useEffect, useState } from 'react'
import SettingsSection from '@/components/settings/SettingsSection'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface Settings {
  reminder_enabled: boolean
  reminder_time: string | null
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState<Settings>({
    reminder_enabled: false,
    reminder_time: null
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    loadUserAndSettings()
  }, [])

  const loadUserAndSettings = async () => {
    try {
      const supabase = createClient()

      // Get user
      const { data: { user: userData } } = await supabase.auth.getUser()
      setUser(userData)

      // Get settings
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          reminder_enabled: data.reminder_enabled ?? false,
          reminder_time: data.reminder_time ?? null
        })
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<Settings>) => {
    setSaving(true)
    setSaveMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const data = await response.json()
        setSettings({
          reminder_enabled: data.reminder_enabled ?? false,
          reminder_time: data.reminder_time ?? null
        })
        setSaveMessage('Settings saved successfully')
        setTimeout(() => setSaveMessage(''), 3000)
      } else {
        setSaveMessage('Failed to save settings')
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      setSaveMessage('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReminderToggle = () => {
    const newValue = !settings.reminder_enabled
    updateSettings({ reminder_enabled: newValue })
  }

  const handleReminderTimeChange = (time: string) => {
    updateSettings({ reminder_time: time })
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-[#F7F7FF] opacity-60">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl text-[#F7F7FF] mb-2">Settings</h1>
        <p className="text-[#F7F7FF] opacity-60">
          Manage your account preferences and settings
        </p>
      </div>

      {saveMessage && (
        <div className={`mb-6 p-4 rounded-lg border ${
          saveMessage.includes('success')
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Profile Section */}
      <SettingsSection
        title="Profile"
        description="Your account information"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-[#F7F7FF] opacity-60 mb-2">
              Email
            </label>
            <div className="text-[#F7F7FF]">
              {user?.email || 'Not available'}
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#F7F7FF] opacity-60 mb-2">
              Member since
            </label>
            <div className="text-[#F7F7FF]">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'Not available'}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Reminders Section */}
      <SettingsSection
        title="Reminders"
        description="Set up writing reminders"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#F7F7FF] mb-1">Enable Reminders</div>
              <div className="text-sm text-[#F7F7FF] opacity-60">
                Get reminded to write daily
              </div>
            </div>
            <button
              onClick={handleReminderToggle}
              disabled={saving}
              className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                settings.reminder_enabled
                  ? 'bg-[#F7F7FF]'
                  : 'bg-[rgba(247,247,255,0.2)]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-[#3A4F41] transition-transform duration-200 ${
                  settings.reminder_enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.reminder_enabled && (
            <div>
              <label className="block text-sm text-[#F7F7FF] opacity-60 mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                value={settings.reminder_time || '09:00'}
                onChange={(e) => handleReminderTimeChange(e.target.value)}
                disabled={saving}
                className="px-4 py-2 bg-[#F7F7FF] text-[#3A4F41] rounded-lg border border-[rgba(247,247,255,0.1)] focus:outline-none focus:border-[#F7F7FF]"
              />
            </div>
          )}
        </div>
      </SettingsSection>

      {/* Data Section */}
      <SettingsSection
        title="Data Management"
        description="Export or delete your data"
      >
        <div className="space-y-4">
          <button
            className="w-full px-4 py-3 bg-transparent border border-[rgba(247,247,255,0.1)] text-[#F7F7FF] rounded-lg hover:bg-[rgba(247,247,255,0.1)] transition-colors"
            onClick={() => alert('Export feature coming soon!')}
          >
            Export All Entries
          </button>
          <button
            className="w-full px-4 py-3 bg-transparent border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion feature coming soon!')
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </SettingsSection>

      {/* Account Actions */}
      <div className="mt-8 pt-8 border-t border-[rgba(247,247,255,0.1)]">
        <button
          onClick={handleSignOut}
          className="px-6 py-3 bg-transparent border border-[rgba(247,247,255,0.1)] text-[#F7F7FF] rounded-lg hover:bg-[rgba(247,247,255,0.1)] transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
