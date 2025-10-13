import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
          <Settings size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Settings Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          This page will allow you to customize your writing experience and manage your account.
        </p>
        <div className="text-sm text-gray-500">
          <p>Features in development:</p>
          <ul className="mt-2 space-y-1">
            <li>• Profile management</li>
            <li>• Dark mode toggle</li>
            <li>• Writing reminders</li>
            <li>• Export your data</li>
            <li>• Account preferences</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
