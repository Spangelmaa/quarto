import { Room } from '@/types/multiplayer';

// Einfache In-Memory Storage Lösung
// Wichtig: In Produktion sollte Redis oder eine Datenbank verwendet werden
class RoomStorage {
  private static instance: RoomStorage;
  private rooms: Map<string, Room>;

  private constructor() {
    this.rooms = new Map<string, Room>();
    console.log('[STORAGE] 🆕 RoomStorage Singleton erstellt');
  }

  public static getInstance(): RoomStorage {
    if (!RoomStorage.instance) {
      RoomStorage.instance = new RoomStorage();
    }
    return RoomStorage.instance;
  }

  public getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId.toUpperCase());
  }

  public setRoom(roomId: string, room: Room): void {
    this.rooms.set(roomId.toUpperCase(), room);
    console.log(`[STORAGE] 💾 Raum gespeichert: ${roomId}, Gesamt: ${this.rooms.size}`);
  }

  public deleteRoom(roomId: string): void {
    this.rooms.delete(roomId.toUpperCase());
  }

  public getAllRoomIds(): string[] {
    return Array.from(this.rooms.keys());
  }

  public getRoomCount(): number {
    return this.rooms.size;
  }

  public cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;
    this.rooms.forEach((room, id) => {
      if (now - room.createdAt > 24 * 60 * 60 * 1000) {
        this.rooms.delete(id);
        deletedCount++;
      }
    });
    if (deletedCount > 0) {
      console.log(`[STORAGE CLEANUP] ${deletedCount} alte Räume gelöscht`);
    }
  }
}

// Exportiere Singleton-Instanz
export const roomStorage = RoomStorage.getInstance();

