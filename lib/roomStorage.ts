import { Room } from '@/types/multiplayer';

// In-Memory Storage für Demo (in Produktion würde man Redis/Database verwenden)
export const rooms = new Map<string, Room>();

// Cleanup alte Räume (älter als 24 Stunden)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rooms.forEach((room, id) => {
      if (now - room.createdAt > 24 * 60 * 60 * 1000) {
        rooms.delete(id);
      }
    });
  }, 60 * 60 * 1000); // Jede Stunde prüfen
}

