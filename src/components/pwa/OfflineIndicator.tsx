'use client';

import { useEffect, useState } from 'react';
import { WifiOff, Cloud, CloudOff } from 'lucide-react';
import { localDB } from '@/lib/db/indexedDB';
import { syncManager } from '@/lib/sync/syncManager';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [hasPending, setHasPending] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);

    // Check for pending syncs
    const checkPending = async () => {
      try {
        const pending = await localDB.getPendingSyncs();
        setHasPending(pending.length > 0);
      } catch (error) {
        console.error('[Offline Indicator] Failed to check pending syncs:', error);
      }
    };

    checkPending();

    // Online/offline event listeners
    const handleOnline = () => {
      setIsOnline(true);
      checkPending();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending syncs periodically
    const interval = setInterval(checkPending, 5000);

    // Listen for sync events
    const handleSyncEnd = () => {
      setIsSyncing(false);
      checkPending();
    };

    syncManager.onSyncComplete(handleSyncEnd);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Don't show if online and no pending changes
  if (isOnline && !hasPending && !isSyncing) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-[#3A4F41] border border-[rgba(247,247,255,0.2)] rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
        {!isOnline && (
          <>
            <WifiOff className="w-4 h-4 text-[#F7F7FF]" />
            <span className="text-[#F7F7FF] text-sm">Offline</span>
          </>
        )}

        {isOnline && isSyncing && (
          <>
            <Cloud className="w-4 h-4 text-[#F7F7FF] animate-pulse" />
            <span className="text-[#F7F7FF] text-sm">Syncing...</span>
          </>
        )}

        {isOnline && !isSyncing && hasPending && (
          <>
            <CloudOff className="w-4 h-4 text-[#F7F7FF]" />
            <span className="text-[#F7F7FF] text-sm">Pending sync</span>
          </>
        )}
      </div>
    </div>
  );
}
