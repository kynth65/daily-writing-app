'use client'

import { useState, useEffect, useCallback } from 'react'
import TipTapEditor from '@/components/editor/TipTapEditor'
import { useAutosave } from '@/hooks/useAutosave'
import { getTodayPrompt } from '@/lib/prompts'
import { format } from 'date-fns'
import { CheckCircle2, AlertCircle, Loader2, Sparkles, Save } from 'lucide-react'

export default function WritePage() {
  const [content, setContent] = useState('')
  const [entryId, setEntryId] = useState<string | null>(null)
  const [todayPrompt] = useState(() => getTodayPrompt())
  const [showPrompt, setShowPrompt] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const today = format(new Date(), 'yyyy-MM-dd')

  // Fetch today's entry if it exists
  useEffect(() => {
    const fetchTodayEntry = async () => {
      try {
        const response = await fetch(`/api/entries?date=${today}`)
        if (response.ok) {
          const entries = await response.json()
          if (entries.length > 0) {
            setContent(entries[0].content)
            setEntryId(entries[0].id)
          }
        }
      } catch (error) {
        // Silently handle error - entry might not exist yet
      }
    }

    fetchTodayEntry()
  }, [today])

  const saveEntry = useCallback(
    async (contentToSave: string) => {
      try {
        if (entryId) {
          // Update existing entry
          const response = await fetch(`/api/entries/${entryId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: contentToSave }),
          })

          if (!response.ok) {
            throw new Error('Failed to update entry')
          }
        } else {
          // Create new entry
          const response = await fetch('/api/entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: contentToSave, date: today }),
          })

          if (!response.ok) {
            throw new Error('Failed to create entry')
          }

          const data = await response.json()
          setEntryId(data.id)
        }
      } catch (error) {
        console.error('Error saving entry:', error)
        throw error
      }
    },
    [entryId, today]
  )

  const { status } = useAutosave({
    content,
    onSave: saveEntry,
    delay: 3000,
  })

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
  }

  const handleManualSave = async () => {
    if (!content.trim()) {
      return // Don't save empty content
    }

    setIsSaving(true)
    try {
      await saveEntry(content)
      // Clear the content after successful save
      setContent('')
      setEntryId(null)
    } catch (error) {
      console.error('Failed to save entry:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Today&apos;s Entry</h1>
          <div className="flex items-center gap-2 text-sm">
            {status === 'saved' && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 size={16} />
                Saved
              </span>
            )}
            {status === 'saving' && (
              <span className="flex items-center gap-1 text-blue-600">
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </span>
            )}
            {status === 'error' && (
              <span className="flex items-center gap-1 text-red-600">
                <AlertCircle size={16} />
                Error saving
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      {/* Daily Prompt */}
      {showPrompt && (
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-purple-600" />
                <h3 className="font-semibold text-purple-900">Today&apos;s Prompt</h3>
              </div>
              <p className="text-gray-700">{todayPrompt.prompt}</p>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full capitalize">
                {todayPrompt.category}
              </span>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="text-gray-400 hover:text-gray-600 ml-4 cursor-pointer"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {!showPrompt && (
        <button
          onClick={() => setShowPrompt(true)}
          className="mb-6 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
        >
          <Sparkles size={16} />
          Show today&apos;s prompt
        </button>
      )}

      {/* Editor */}
      <TipTapEditor
        content={content}
        onChange={handleContentChange}
        placeholder="Start writing your thoughts..."
      />

      {/* Manual Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleManualSave}
          disabled={isSaving || !content.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save Entry
            </>
          )}
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-900">
          <strong>Tip:</strong> Your entry is automatically saved as you write. Click the Save Entry button to save and clear the editor for a fresh start!
        </p>
      </div>
    </div>
  )
}
