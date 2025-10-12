'use client'

import { useEffect, useRef, useState } from 'react'

type SaveStatus = 'saved' | 'saving' | 'error' | 'idle'

interface UseAutosaveOptions {
  content: string
  onSave: (content: string) => Promise<void>
  delay?: number
}

export function useAutosave({ content, onSave, delay = 3000 }: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousContentRef = useRef<string>(content)

  useEffect(() => {
    // Skip if content hasn't changed
    if (content === previousContentRef.current) {
      return
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set status to idle while waiting
    setStatus('idle')

    // Set new timeout for autosave
    timeoutRef.current = setTimeout(async () => {
      setStatus('saving')
      try {
        await onSave(content)
        setStatus('saved')
        previousContentRef.current = content
      } catch (error) {
        console.error('Autosave error:', error)
        setStatus('error')
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [content, onSave, delay])

  return { status }
}
