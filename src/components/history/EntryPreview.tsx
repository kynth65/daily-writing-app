'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { X, Trash2, ChevronLeft, ChevronRight, Calendar, FileText, Clock } from 'lucide-react'
import { Entry } from '@/types'

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

  if (!isOpen || entries.length === 0) return null

  const currentEntry = entries[currentIndex]
  const hasMultipleEntries = entries.length > 1

  const handlePrevEntry = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : entries.length - 1))
  }

  const handleNextEntry = () => {
    setCurrentIndex((prev) => (prev < entries.length - 1 ? prev + 1 : 0))
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

  return (
    <>
      {/* Backdrop with smooth fade */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal - Slide in from right */}
      <div className="fixed inset-y-0 right-0 w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-[#3A4F41] shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#F7F7FF]/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar size={24} className="text-[#F7F7FF]" />
            </div>
            <div>
              <h2 className="font-normal text-xl text-[#F7F7FF] mb-1">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h2>
              {hasMultipleEntries && (
                <p className="text-sm text-[#F7F7FF]/60">
                  Entry {currentIndex + 1} of {entries.length}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center hover:bg-[#F7F7FF]/10 hover:border-[#F7F7FF]/30 transition-all duration-200"
            aria-label="Close preview"
          >
            <X size={20} className="text-[#F7F7FF]" />
          </button>
        </div>

        {/* Entry metadata */}
        <div className="px-6 py-4 border-b border-[#F7F7FF]/10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#F7F7FF]/70">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#F7F7FF]/50" />
              <span>{currentEntry.word_count.toLocaleString()} words</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#F7F7FF]/50" />
              <span>Created {format(new Date(currentEntry.created_at), 'h:mm a')}</span>
            </div>
            {currentEntry.updated_at !== currentEntry.created_at && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#F7F7FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Updated {format(new Date(currentEntry.updated_at), 'h:mm a')}</span>
              </div>
            )}
            {currentEntry.emotion && (
              <div className="flex items-center gap-2 px-2 py-1 border border-[#F7F7FF]/10">
                <svg className="w-4 h-4 text-[#F7F7FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="capitalize">{currentEntry.emotion}</span>
              </div>
            )}
          </div>
        </div>

        {/* Entry content with custom scrollbar */}
        <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
          <div
            className="prose prose-invert prose-lg max-w-none text-[#F7F7FF]/90 leading-relaxed"
            style={{
              fontFamily: 'var(--font-raleway)',
            }}
            dangerouslySetInnerHTML={{ __html: currentEntry.content }}
          />
        </div>

        {/* Footer with actions */}
        <div className="border-t border-[#F7F7FF]/10 p-6 bg-[#3A4F41]/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            {/* Navigation for multiple entries */}
            <div className="flex items-center gap-2">
              {hasMultipleEntries ? (
                <>
                  <button
                    onClick={handlePrevEntry}
                    className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center hover:bg-[#F7F7FF]/10 hover:border-[#F7F7FF]/30 transition-all duration-200"
                    aria-label="Previous entry"
                  >
                    <ChevronLeft size={20} className="text-[#F7F7FF]" />
                  </button>
                  <button
                    onClick={handleNextEntry}
                    className="w-10 h-10 border border-[#F7F7FF]/20 rounded-lg flex items-center justify-center hover:bg-[#F7F7FF]/10 hover:border-[#F7F7FF]/30 transition-all duration-200"
                    aria-label="Next entry"
                  >
                    <ChevronRight size={20} className="text-[#F7F7FF]" />
                  </button>
                </>
              ) : (
                <div className="w-20" /> // Spacer for alignment
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#F7F7FF]/30 text-[#F7F7FF]/70 rounded-lg hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/50 hover:text-[#F7F7FF] transition-all duration-200 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(247, 247, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(247, 247, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(247, 247, 255, 0.3);
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
