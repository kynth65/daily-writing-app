"use client";

import { useState, useCallback } from "react";
import TipTapEditor from "@/components/editor/TipTapEditor";
import { getTodayPrompt } from "@/lib/prompts";
import { format } from "date-fns";
import { CheckCircle2, AlertCircle, Loader2, Sparkles, X, Save } from "lucide-react";

export default function WritePage() {
  const [content, setContent] = useState("");
  const [todayPrompt] = useState(() => getTodayPrompt());
  const [showPrompt, setShowPrompt] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const today = format(new Date(), "yyyy-MM-dd");

  // Helper function to check if content is empty
  const isContentEmpty = (text: string) => {
    if (!text || text.trim() === '') return true;
    // Strip HTML tags and check if there's actual text content
    const stripped = text.replace(/<[^>]*>/g, '').trim();
    return stripped === '';
  };

  const handleSave = useCallback(async () => {
    if (isContentEmpty(content)) {
      return;
    }

    setSaveStatus('saving');

    try {
      // Always create new entry
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, date: today }),
      });

      if (!response.ok) {
        throw new Error("Failed to save entry");
      }

      setSaveStatus('saved');

      // Clear the editor after successful save
      setContent("");

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error("Error saving entry:", error);
      setSaveStatus('error');

      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  }, [content, today]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <div className="relative min-h-screen -my-6 -ml-20 -mr-6 sm:-my-8 sm:-ml-24 sm:-mr-8 lg:-m-10 bg-[#3A4F41]">
      {/* Floating Status Indicator */}
      <div className="fixed top-8 right-8 z-20">
        {saveStatus === "saved" && (
          <div className="flex items-center gap-2 px-4 py-2 border border-[#F7F7FF]/20 rounded-lg text-[#F7F7FF] text-sm font-normal bg-[#3A4F41]">
            <CheckCircle2 size={14} />
            <span>Saved</span>
          </div>
        )}
        {saveStatus === "saving" && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#3A4F41] border border-[#F7F7FF]/20 rounded-lg text-[#F7F7FF] text-sm font-normal">
            <Loader2 size={14} className="animate-spin" />
            <span>Saving...</span>
          </div>
        )}
        {saveStatus === "error" && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[#3A4F41] border border-[#F7F7FF]/20 rounded-lg text-[#F7F7FF] text-sm font-normal">
            <AlertCircle size={14} />
            <span>Failed to save</span>
          </div>
        )}
      </div>

      {/* Main Editor Container */}
      <div className="max-w-4xl mx-auto pl-24 pr-8 py-16 sm:pl-28 sm:pr-8 lg:px-8">
        {/* Subtle date header */}
        <div className="text-center mb-8">
          <p className="text-sm font-normal text-[#F7F7FF]/50 tracking-wide uppercase mb-2">
            {format(new Date(), "EEEE")}
          </p>
          <h1 className="text-3xl font-light text-[#F7F7FF]">
            {format(new Date(), "MMMM d, yyyy")}
          </h1>
        </div>

        {/* Today's Writing Prompt - Simple Note */}
        {showPrompt && (
          <div className="mb-8 p-6 border border-[#F7F7FF]/20 rounded-lg bg-[#3A4F41]">
            <div className="flex items-start gap-3">
              <Sparkles
                size={20}
                className="text-[#F7F7FF]/70 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-sm font-normal text-[#F7F7FF]/50 mb-2">
                  Today&apos;s Writing Prompt
                </p>
                <p className="text-base text-[#F7F7FF]/80 leading-relaxed">
                  {todayPrompt.prompt}
                </p>
              </div>
              <button
                onClick={() => setShowPrompt(false)}
                className="p-1 text-[#F7F7FF]/40 hover:text-[#F7F7FF]/70 transition-colors cursor-pointer flex-shrink-0"
                aria-label="Dismiss prompt"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Editor */}
        <div>
          <TipTapEditor
            content={content}
            onChange={handleContentChange}
            placeholder="Begin writing..."
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || isContentEmpty(content)}
            className="flex items-center gap-2 px-8 py-3 text-base font-normal text-[#F7F7FF] bg-[#3A4F41] border border-[#F7F7FF]/20 hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/30 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3A4F41] disabled:hover:border-[#F7F7FF]/20"
          >
            {saveStatus === 'saving' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Entry</span>
              </>
            )}
          </button>
        </div>

        {/* Show prompt button */}
        {!showPrompt && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowPrompt(true)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-normal text-[#F7F7FF]/70 hover:text-[#F7F7FF] bg-[#3A4F41] border border-[#F7F7FF]/10 hover:bg-[#F7F7FF]/5 hover:border-[#F7F7FF]/20 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <Sparkles size={16} />
              <span>View today&apos;s prompt</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
