"use client";

import { useState, useCallback, useEffect } from "react";
import TipTapEditor from "@/components/editor/TipTapEditor";
import { getTodayPrompt } from "@/lib/prompts";
import { format } from "date-fns";
import { CheckCircle2, AlertCircle, Loader2, Sparkles, X, Save, WifiOff } from "lucide-react";
import { localDB } from "@/lib/db/indexedDB";
import { syncManager } from "@/lib/sync/syncManager";

export default function WritePage() {
  const [content, setContent] = useState("");
  const [todayPrompt] = useState(() => getTodayPrompt());
  const [showPrompt, setShowPrompt] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'saved_offline' | 'error'>('idle');
  const [isOnline, setIsOnline] = useState(true);
  const today = format(new Date(), "yyyy-MM-dd");

  // Monitor online/offline status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

    // Calculate word count
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;

    try {
      // If online, try to save to server
      if (navigator.onLine) {
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, date: today }),
        });

        if (!response.ok) {
          throw new Error("Failed to save entry");
        }

        const result = await response.json();

        // Also save to IndexedDB as cache
        if (result.entry) {
          await localDB.saveEntry({
            id: result.entry.id,
            user_id: result.entry.user_id,
            content,
            word_count: wordCount,
            created_at: result.entry.created_at,
            updated_at: result.entry.updated_at,
            synced: true,
          });
        }

        setSaveStatus('saved');
        setContent("");

        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } else {
        // Offline mode - save to IndexedDB
        const tempId = `temp-${Date.now()}`;
        const now = new Date().toISOString();

        await localDB.saveEntry({
          id: tempId,
          user_id: 'offline-user', // Will be replaced on sync
          content,
          word_count: wordCount,
          created_at: now,
          updated_at: now,
          synced: false,
        });

        // Add to pending sync queue
        await localDB.addPendingSync({
          id: `sync-${tempId}`,
          entry_id: tempId,
          action: 'create',
          data: { content, word_count: wordCount },
          timestamp: Date.now(),
        });

        // Register background sync
        await syncManager.registerBackgroundSync();

        setSaveStatus('saved_offline');
        setContent("");

        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error("Error saving entry:", error);

      // Try to save offline as fallback
      try {
        const tempId = `temp-${Date.now()}`;
        const now = new Date().toISOString();

        await localDB.saveEntry({
          id: tempId,
          user_id: 'offline-user',
          content,
          word_count: wordCount,
          created_at: now,
          updated_at: now,
          synced: false,
        });

        await localDB.addPendingSync({
          id: `sync-${tempId}`,
          entry_id: tempId,
          action: 'create',
          data: { content, word_count: wordCount },
          timestamp: Date.now(),
        });

        setSaveStatus('saved_offline');
        setContent("");

        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      } catch (offlineError) {
        console.error("Failed to save offline:", offlineError);
        setSaveStatus('error');

        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
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
        {saveStatus === "saved_offline" && (
          <div className="flex items-center gap-2 px-4 py-2 border border-[#F7F7FF]/20 rounded-lg text-[#F7F7FF] text-sm font-normal bg-[#3A4F41]">
            <WifiOff size={14} />
            <span>Saved offline</span>
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
