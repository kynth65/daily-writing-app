'use client';

import { useEffect, useState } from 'react';
import { localDB } from '@/lib/db/indexedDB';
import { syncManager } from '@/lib/sync/syncManager';
import { OfflineIndicator } from './OfflineIndicator';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    // Initialize IndexedDB
    localDB.init().catch((error) => {
      console.error('[PWA] Failed to initialize IndexedDB:', error);
    });

    // Only register service worker in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('[PWA] Service Worker disabled in development mode');

      // Unregister any existing service workers in development
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log('[PWA] Unregistered service worker from development mode');
          });
        });
      });

      return;
    }

    // Register service worker
    navigator.serviceWorker
      .register('/service-worker.js', {
        scope: '/',
      })
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[PWA] New service worker available');
                setUpdateAvailable(true);
              }
            });
          }
        });

        // Check for updates periodically (every 10 minutes)
        setInterval(() => {
          registration.update();
        }, 10 * 60 * 1000);
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });

    // Set up sync on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && navigator.onLine) {
        syncManager.checkAndSync();
      }
    });

    // Initial sync check
    if (navigator.onLine) {
      syncManager.checkAndSync();
    }

    // Register for background sync
    syncManager.registerBackgroundSync();
  }, []);

  // Handle update
  const handleUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });

      // Reload after service worker activates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  return (
    <>
      {children}

      {/* Offline status indicator */}
      <OfflineIndicator />

      {/* Update notification */}
      {updateAvailable && (
        <div className="fixed bottom-4 right-4 bg-[#3A4F41] border border-[#F7F7FF] rounded-lg p-4 shadow-lg max-w-sm z-50">
          <p className="text-[#F7F7FF] mb-3">A new version is available!</p>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-transparent border border-[#F7F7FF] text-[#F7F7FF] rounded hover:bg-[rgba(247,247,255,0.1)] transition-colors"
            >
              Update Now
            </button>
            <button
              onClick={() => setUpdateAvailable(false)}
              className="px-4 py-2 bg-transparent text-[#F7F7FF] rounded hover:bg-[rgba(247,247,255,0.1)] transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
