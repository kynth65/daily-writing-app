'use client'

import { User, Bell, Moon, Shield, Zap } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-normal text-[#F7F7FF] mb-2">
          Settings
        </h1>
        <p className="text-lg text-[#F7F7FF]/70">Manage your account and customize your experience</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Profile Section */}
        <div className="border border-[#F7F7FF]/10 rounded-lg overflow-hidden">
          <div className="border-b border-[#F7F7FF]/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
                <User size={20} className="text-[#F7F7FF]" />
              </div>
              <h2 className="text-lg font-normal text-[#F7F7FF]">Profile</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Display Name</h3>
                <p className="text-sm text-[#F7F7FF]/70">Personalize how your name appears</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#F7F7FF]/10">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Email Address</h3>
                <p className="text-sm text-[#F7F7FF]/70">Update your email preferences</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#F7F7FF]/10">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Profile Picture</h3>
                <p className="text-sm text-[#F7F7FF]/70">Add a profile picture to your account</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="border border-[#F7F7FF]/10 rounded-lg overflow-hidden">
          <div className="border-b border-[#F7F7FF]/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
                <Moon size={20} className="text-[#F7F7FF]" />
              </div>
              <h2 className="text-lg font-normal text-[#F7F7FF]">Appearance</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Dark Mode</h3>
                <p className="text-sm text-[#F7F7FF]/70">Switch between light and dark themes</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#F7F7FF]/10">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Font Size</h3>
                <p className="text-sm text-[#F7F7FF]/70">Adjust the editor font size</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="border border-[#F7F7FF]/10 rounded-lg overflow-hidden">
          <div className="border-b border-[#F7F7FF]/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
                <Bell size={20} className="text-[#F7F7FF]" />
              </div>
              <h2 className="text-lg font-normal text-[#F7F7FF]">Notifications</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Daily Writing Reminders</h3>
                <p className="text-sm text-[#F7F7FF]/70">Get reminders to maintain your streak</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#F7F7FF]/10">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Email Notifications</h3>
                <p className="text-sm text-[#F7F7FF]/70">Receive updates via email</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
          </div>
        </div>

        {/* Data & Privacy Section */}
        <div className="border border-[#F7F7FF]/10 rounded-lg overflow-hidden">
          <div className="border-b border-[#F7F7FF]/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center">
                <Shield size={20} className="text-[#F7F7FF]" />
              </div>
              <h2 className="text-lg font-normal text-[#F7F7FF]">Data & Privacy</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Export Your Data</h3>
                <p className="text-sm text-[#F7F7FF]/70">Download all your entries and data</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-[#F7F7FF]/10">
              <div className="flex-1">
                <h3 className="font-normal text-[#F7F7FF] mb-1">Delete Account</h3>
                <p className="text-sm text-[#F7F7FF]/70">Permanently delete your account and data</p>
              </div>
              <div className="px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF]/50 rounded-lg text-sm">Coming soon</div>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="border border-[#F7F7FF]/10 rounded-lg p-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap size={32} className="text-[#F7F7FF]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-normal text-[#F7F7FF] mb-2">More Features Coming Soon</h3>
              <p className="text-[#F7F7FF]/70 mb-3">
                We&apos;re actively developing new settings and customization options to give you full control over your writing experience.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#F7F7FF]/20 text-[#F7F7FF] rounded-lg text-sm font-normal">
                <div className="w-2 h-2 bg-[#F7F7FF] rounded-full animate-pulse" />
                In Active Development
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
