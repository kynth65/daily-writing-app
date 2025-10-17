// IndexedDB wrapper for offline storage
const DB_NAME = 'DailyWritingDB';
const DB_VERSION = 1;
const ENTRIES_STORE = 'entries';
const PENDING_STORE = 'pending_sync';

export interface StoredEntry {
  id: string;
  user_id: string;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  synced: boolean;
}

export interface PendingSync {
  id: string;
  entry_id: string;
  action: 'create' | 'update' | 'delete';
  data: Partial<StoredEntry>;
  timestamp: number;
}

class IndexedDBManager {
  private db: IDBDatabase | null = null;

  // Initialize the database
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB is only available in browser'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create entries store
        if (!db.objectStoreNames.contains(ENTRIES_STORE)) {
          const entriesStore = db.createObjectStore(ENTRIES_STORE, { keyPath: 'id' });
          entriesStore.createIndex('user_id', 'user_id', { unique: false });
          entriesStore.createIndex('created_at', 'created_at', { unique: false });
          entriesStore.createIndex('synced', 'synced', { unique: false });
        }

        // Create pending sync queue store
        if (!db.objectStoreNames.contains(PENDING_STORE)) {
          const pendingStore = db.createObjectStore(PENDING_STORE, { keyPath: 'id' });
          pendingStore.createIndex('entry_id', 'entry_id', { unique: false });
          pendingStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Ensure database is initialized
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  // Get all entries
  async getAllEntries(): Promise<StoredEntry[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get entries'));
      };
    });
  }

  // Get entry by ID
  async getEntry(id: string): Promise<StoredEntry | null> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get entry'));
      };
    });
  }

  // Save or update entry
  async saveEntry(entry: StoredEntry): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ENTRIES_STORE], 'readwrite');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.put(entry);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to save entry'));
      };
    });
  }

  // Delete entry
  async deleteEntry(id: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ENTRIES_STORE], 'readwrite');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete entry'));
      };
    });
  }

  // Get entries by user ID
  async getEntriesByUser(userId: string): Promise<StoredEntry[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const index = store.index('user_id');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get entries by user'));
      };
    });
  }

  // Get unsynced entries
  async getUnsyncedEntries(): Promise<StoredEntry[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ENTRIES_STORE], 'readonly');
      const store = transaction.objectStore(ENTRIES_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        // Filter unsynced entries manually
        const unsyncedEntries = request.result.filter((entry: StoredEntry) => !entry.synced);
        resolve(unsyncedEntries);
      };

      request.onerror = () => {
        reject(new Error('Failed to get unsynced entries'));
      };
    });
  }

  // Add to pending sync queue
  async addPendingSync(sync: PendingSync): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PENDING_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORE);
      const request = store.put(sync);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to add pending sync'));
      };
    });
  }

  // Get all pending syncs
  async getPendingSyncs(): Promise<PendingSync[]> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PENDING_STORE], 'readonly');
      const store = transaction.objectStore(PENDING_STORE);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get pending syncs'));
      };
    });
  }

  // Remove pending sync
  async removePendingSync(id: string): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PENDING_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to remove pending sync'));
      };
    });
  }

  // Clear all pending syncs
  async clearPendingSyncs(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PENDING_STORE], 'readwrite');
      const store = transaction.objectStore(PENDING_STORE);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear pending syncs'));
      };
    });
  }

  // Clear all data
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([ENTRIES_STORE, PENDING_STORE], 'readwrite');

      const entriesStore = transaction.objectStore(ENTRIES_STORE);
      const pendingStore = transaction.objectStore(PENDING_STORE);

      entriesStore.clear();
      pendingStore.clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(new Error('Failed to clear database'));
      };
    });
  }
}

// Export singleton instance
export const localDB = new IndexedDBManager();
