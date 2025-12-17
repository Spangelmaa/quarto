import { Room } from '@/types/multiplayer';

// Globale Variable für Room-Storage (persistiert über Requests)
declare global {
  var __QUARTO_ROOMS__: Map<string, Room>;
  var __QUARTO_CLEANUP_STARTED__: boolean;
}

// WICHTIG: Nutze eine eindeutige globale Variable mit konstantem Namen
// Dies stellt sicher, dass alle API Routes die gleiche Map-Instanz verwenden
const initializeStorage = (): Map<string, Room> => {
  if (typeof globalThis.__QUARTO_ROOMS__ === 'undefined') {
    console.log('[STORAGE] ⚠️ Initialisiere neuen Room-Storage');
    globalThis.__QUARTO_ROOMS__ = new Map<string, Room>();
  } else {
    console.log('[STORAGE] ✅ Verwende existierenden Room-Storage mit', globalThis.__QUARTO_ROOMS__.size, 'Räumen');
  }
  return globalThis.__QUARTO_ROOMS__;
};

// Exportiere immer die gleiche Referenz
export const rooms = initializeStorage();

// Hilfsfunktion um Storage-Status zu loggen
export const logRoomStorage = (context: string) => {
  console.log(`[STORAGE ${context}] Anzahl Räume:`, rooms.size);
  console.log(`[STORAGE ${context}] Raum-IDs:`, Array.from(rooms.keys()));
  console.log(`[STORAGE ${context}] Map Referenz:`, rooms === globalThis.__QUARTO_ROOMS__ ? '✅ GLEICH' : '❌ UNTERSCHIEDLICH');
};

// Cleanup alte Räume (älter als 24 Stunden)
if (typeof setInterval !== 'undefined' && !globalThis.__QUARTO_CLEANUP_STARTED__) {
  globalThis.__QUARTO_CLEANUP_STARTED__ = true;
  console.log('[STORAGE] Cleanup Timer gestartet');
  setInterval(() => {
    const now = Date.now();
    console.log('[STORAGE CLEANUP] Prüfe', rooms.size, 'Räume...');
    rooms.forEach((room, id) => {
      const age = now - room.createdAt;
      if (age > 24 * 60 * 60 * 1000) {
        console.log('[STORAGE CLEANUP] Lösche alten Raum:', id, 'Alter:', Math.round(age / 1000 / 60), 'Minuten');
        rooms.delete(id);
      }
    });
  }, 60 * 60 * 1000); // Jede Stunde prüfen
}

