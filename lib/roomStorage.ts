import { Room } from '@/types/multiplayer';

// Globale Variable für Room-Storage (persistiert über Requests)
declare global {
  var roomsStorage: Map<string, Room> | undefined;
  var roomsCleanupStarted: boolean | undefined;
}

// In-Memory Storage für Demo (in Produktion würde man Redis/Database verwenden)
if (!globalThis.roomsStorage) {
  console.log('[STORAGE] Initialisiere neuen Room-Storage');
  globalThis.roomsStorage = new Map<string, Room>();
}

export const rooms = globalThis.roomsStorage;

// Debug: Zeige alle Räume bei jedem Import
console.log('[STORAGE] Verfügbare Räume:', Array.from(rooms.keys()));

// Cleanup alte Räume (älter als 24 Stunden)
if (typeof setInterval !== 'undefined' && !globalThis.roomsCleanupStarted) {
  globalThis.roomsCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    console.log('[STORAGE CLEANUP] Prüfe Räume...');
    rooms.forEach((room, id) => {
      if (now - room.createdAt > 24 * 60 * 60 * 1000) {
        console.log('[STORAGE CLEANUP] Lösche alten Raum:', id);
        rooms.delete(id);
      }
    });
  }, 60 * 60 * 1000); // Jede Stunde prüfen
}

