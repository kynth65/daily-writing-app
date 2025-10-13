'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { Maximize2, Minimize2, Type } from 'lucide-react'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Begin writing...',
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)

      // Calculate counts
      const text = editor.getText()
      const words = text.trim().split(/\s+/).filter(word => word.length > 0)
      setWordCount(words.length)
      setCharCount(text.length)

      // Show typing indicator
      setIsTyping(true)
      const timeout = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timeout)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-xl prose-invert max-w-none focus:outline-none min-h-[70vh] px-4 py-12 prose-headings:font-light prose-headings:text-[#F7F7FF] prose-p:text-[#F7F7FF]/90 prose-p:leading-relaxed prose-p:text-lg prose-strong:text-[#F7F7FF] prose-strong:font-normal prose-em:text-[#F7F7FF]/90',
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
      setCharCount(text.length)
    }
  }, [editor])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  return (
    <div
      className={`
        relative bg-[#3A4F41] border border-[#F7F7FF]/10 rounded-lg transition-all duration-500
        ${isFullscreen ? 'fixed inset-8 z-50' : ''}
      `}
    >
      {/* Minimal Toolbar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-4 bg-[#3A4F41] border-b border-[#F7F7FF]/10 z-10 rounded-t-lg">
        {/* Word count */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-[#F7F7FF]/70">
            <Type size={14} />
            <span className="font-normal">{wordCount}</span>
            <span className="text-[#F7F7FF]/50">{wordCount === 1 ? 'word' : 'words'}</span>
          </div>
          <div className="w-px h-4 bg-[#F7F7FF]/10" />
          <div className="text-[#F7F7FF]/50">
            {charCount} {charCount === 1 ? 'character' : 'characters'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2.5 text-[#F7F7FF]/70 hover:text-[#F7F7FF] hover:bg-[#F7F7FF]/5 rounded-lg transition-all cursor-pointer"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className={`
        overflow-y-auto custom-scrollbar pt-20
        ${isFullscreen ? 'h-full' : 'max-h-[80vh]'}
      `}>
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(247, 247, 255, 0.1);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(247, 247, 255, 0.2);
        }

        /* Placeholder styles */
        .tiptap p.is-editor-empty:first-child::before {
          color: rgba(247, 247, 255, 0.3);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
          font-weight: 300;
          font-size: 1.125rem;
        }

        /* Remove default TipTap focus ring */
        .tiptap {
          caret-color: #F7F7FF;
        }

        .tiptap:focus {
          outline: none;
        }

        /* Better typography */
        .tiptap h1 {
          font-size: 2.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
          color: #F7F7FF;
        }

        .tiptap h2 {
          font-size: 2rem;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
          color: #F7F7FF;
        }

        .tiptap h3 {
          font-size: 1.5rem;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #F7F7FF;
        }

        .tiptap p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
          color: rgba(247, 247, 255, 0.9);
        }

        .tiptap ul,
        .tiptap ol {
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
          color: rgba(247, 247, 255, 0.9);
        }

        .tiptap li {
          margin-bottom: 0.5rem;
        }

        .tiptap blockquote {
          border-left: 3px solid rgba(247, 247, 255, 0.3);
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(247, 247, 255, 0.7);
        }

        .tiptap code {
          background: rgba(247, 247, 255, 0.1);
          color: #F7F7FF;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .tiptap pre {
          background: rgba(0, 0, 0, 0.3);
          color: #F7F7FF;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid rgba(247, 247, 255, 0.1);
        }

        .tiptap pre code {
          background: none;
          padding: 0;
          color: inherit;
        }

        .tiptap strong {
          color: #F7F7FF;
        }

        .tiptap em {
          color: rgba(247, 247, 255, 0.9);
        }
      `}</style>
    </div>
  )
}
