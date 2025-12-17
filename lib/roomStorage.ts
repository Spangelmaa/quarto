import { Room } from '@/types/multiplayer';

// Globale Variable für Room-Storage (persistiert über Requests)
declare global {
  var roomsStorage: Map<string, Room> | undefined;
}

// In-Memory Storage für Demo (in Produktion würde man Redis/Database verwenden)
export const rooms = globalThis.roomsStorage || new Map<string, Room>();

if (!globalThis.roomsStorage) {
  globalThis.roomsStorage = rooms;
}

// Cleanup alte Räume (älter als 24 Stunden)
if (typeof setInterval !== 'undefined' && !globalThis.roomsCleanupStarted) {
  globalThis.roomsCleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    rooms.forEach((room, id) => {
      if (now - room.createdAt > 24 * 60 * 60 * 1000) {
        rooms.delete(id);
      }
    });
  }, 60 * 60 * 1000); // Jede Stunde prüfen
}

declare global {
  var roomsCleanupStarted: boolean | undefined;
}

