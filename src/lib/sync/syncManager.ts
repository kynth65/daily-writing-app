// Sync Manager for handling offline-to-online synchronization
import { localDB, type PendingSync } from '@/lib/db/indexedDB';

class SyncManager {
  private syncing = false;
  private syncCallbacks: Array<(success: boolean) => void> = [];

  // Register for background sync (if supported)
  async registerBackgroundSync(): Promise<void> {
    if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        // Type assertion for Background Sync API (not in standard TypeScript types)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (registration as any).sync.register('sync-entries');
        console.log('[Sync] Background sync registered');
      } catch (error) {
        console.error('[Sync] Failed to register background sync:', error);
      }
    } else {
      console.log('[Sync] Background Sync API not supported');
    }
  }

  // Sync pending changes to server
  async syncPendingChanges(): Promise<boolean> {
    if (this.syncing) {
      console.log('[Sync] Sync already in progress');
      return false;
    }

    if (!navigator.onLine) {
      console.log('[Sync] Device is offline, skipping sync');
      return false;
    }

    this.syncing = true;
    console.log('[Sync] Starting sync...');

    try {
      const pendingSyncs = await localDB.getPendingSyncs();

      if (pendingSyncs.length === 0) {
        console.log('[Sync] No pending syncs');
        this.syncing = false;
        return true;
      }

      console.log(`[Sync] Syncing ${pendingSyncs.length} pending changes`);

      // Sort by timestamp (oldest first)
      pendingSyncs.sort((a, b) => a.timestamp - b.timestamp);

      // Process each pending sync
      for (const sync of pendingSyncs) {
        try {
          await this.processPendingSync(sync);
          await localDB.removePendingSync(sync.id);
          console.log(`[Sync] Successfully synced: ${sync.action} ${sync.entry_id}`);
        } catch (error) {
          console.error(`[Sync] Failed to sync: ${sync.action} ${sync.entry_id}`, error);
          // Continue with other syncs even if one fails
        }
      }

      this.syncing = false;
      this.notifyCallbacks(true);
      return true;
    } catch (error) {
      console.error('[Sync] Sync failed:', error);
      this.syncing = false;
      this.notifyCallbacks(false);
      return false;
    }
  }

  // Process a single pending sync
  private async processPendingSync(sync: PendingSync): Promise<void> {
    const { action, entry_id, data } = sync;

    switch (action) {
      case 'create':
        await this.createEntryOnServer(data);
        break;

      case 'update':
        await this.updateEntryOnServer(entry_id, data);
        break;

      case 'delete':
        await this.deleteEntryOnServer(entry_id);
        break;

      default:
        throw new Error(`Unknown sync action: ${action}`);
    }
  }

  // Create entry on server
  private async createEntryOnServer(data: Partial<{ content: string; word_count: number; date: string }>): Promise<void> {
    console.log('[Sync] Creating entry on server with data:', {
      hasContent: !!data.content,
      contentLength: data.content?.length || 0,
      wordCount: data.word_count,
      date: data.date,
    });

    const response = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('[Sync] Server error:', errorData);
      console.error('[Sync] Response status:', response.status);
      throw new Error(`Failed to create entry on server: ${response.status} - ${errorData.error || errorData.details || 'Unknown error'}`);
    }

    const result = await response.json();

    // Update local entry with server ID and mark as synced
    if (result.entry) {
      // Get all unsynced entries and find the one that matches this content
      const unsyncedEntries = await localDB.getUnsyncedEntries();
      const localEntry = unsyncedEntries.find(e => e.content === data.content);

      if (localEntry) {
        // Update the entry with the server ID and mark as synced
        await localDB.saveEntry({
          ...localEntry,
          id: result.entry.id,
          user_id: result.entry.user_id,
          synced: true,
        });
      }
    }
  }

  // Update entry on server
  private async updateEntryOnServer(entryId: string, data: Partial<{ content: string; word_count: number; date: string }>): Promise<void> {
    const response = await fetch(`/api/entries/${entryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Sync] Server error:', errorText);
      throw new Error(`Failed to update entry on server: ${response.status}`);
    }

    // Mark local entry as synced
    const localEntry = await localDB.getEntry(entryId);
    if (localEntry) {
      await localDB.saveEntry({
        ...localEntry,
        synced: true,
      });
    }
  }

  // Delete entry on server
  private async deleteEntryOnServer(entryId: string): Promise<void> {
    const response = await fetch(`/api/entries/${entryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete entry on server');
    }

    // Remove from local storage
    await localDB.deleteEntry(entryId);
  }

  // Add sync callback
  onSyncComplete(callback: (success: boolean) => void): void {
    this.syncCallbacks.push(callback);
  }

  // Notify callbacks
  private notifyCallbacks(success: boolean): void {
    this.syncCallbacks.forEach((callback) => callback(success));
  }

  // Check if device is online and sync if needed
  async checkAndSync(): Promise<void> {
    if (navigator.onLine) {
      await this.syncPendingChanges();
    }
  }

  // Get sync status
  getSyncStatus(): { syncing: boolean; hasPending: boolean } {
    return {
      syncing: this.syncing,
      hasPending: false, // Will be set by caller after checking IndexedDB
    };
  }
}

// Export singleton instance
export const syncManager = new SyncManager();

// Set up online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[Sync] Device is online, syncing...');
    syncManager.checkAndSync();
  });

  window.addEventListener('offline', () => {
    console.log('[Sync] Device is offline');
  });

  // Listen for service worker messages
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SYNC_ENTRIES') {
        console.log('[Sync] Service worker requested sync');
        syncManager.checkAndSync();
      }
    });
  }
}
