'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)

      // Calculate word count
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-8',
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    if (editor) {
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
    }
  }, [editor])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-sm border border-gray-200
        ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}
      `}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="text-sm text-gray-500">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Editor */}
      <div className={isFullscreen ? 'h-[calc(100vh-64px)] overflow-y-auto' : ''}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
