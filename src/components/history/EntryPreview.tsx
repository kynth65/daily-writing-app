'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { X, Edit, Trash2, ChevronLeft, ChevronRight, Calendar, FileText } from 'lucide-react'
import { Entry } from '@/types'
import { useRouter } from 'next/navigation'

interface EntryPreviewProps {
  entries: Entry[]
  selectedDate: Date
  isOpen: boolean
  onClose: () => void
  onDelete?: (entryId: string) => void
}

export function EntryPreview({ entries, selectedDate, isOpen, onClose, onDelete }: EntryPreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  if (!isOpen || entries.length === 0) return null

  const currentEntry = entries[currentIndex]
  const hasMultipleEntries = entries.length > 1

  const handlePrevEntry = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : entries.length - 1))
  }

  const handleNextEntry = () => {
    setCurrentIndex((prev) => (prev < entries.length - 1 ? prev + 1 : 0))
  }

  const handleEdit = () => {
    router.push(`/write?date=${currentEntry.date}&entryId=${currentEntry.id}`)
  }

  const handleDelete = async () => {
    if (!onDelete) return

    const confirmed = window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')
    if (!confirmed) return

    setIsDeleting(true)
    try {
      await onDelete(currentEntry.id)

      // If there are more entries, move to the next one, otherwise close
      if (entries.length > 1) {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else {
        onClose()
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-blue-500" />
            <div>
              <h2 className="font-normal text-lg">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
              {hasMultipleEntries && (
                <p className="text-sm text-gray-600">
                  Entry {currentIndex + 1} of {entries.length}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Entry metadata */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <FileText size={16} />
              <span>{currentEntry.word_count} words</span>
            </div>
            <div>
              Created: {format(new Date(currentEntry.created_at), 'h:mm a')}
            </div>
            {currentEntry.updated_at !== currentEntry.created_at && (
              <div>
                Updated: {format(new Date(currentEntry.updated_at), 'h:mm a')}
              </div>
            )}
          </div>
        </div>

        {/* Entry content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: currentEntry.content }}
          />
        </div>

        {/* Footer with actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Navigation for multiple entries */}
            {hasMultipleEntries && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevEntry}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Previous entry"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextEntry}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Next entry"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
