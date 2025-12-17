import { Room } from '@/types/multiplayer';
import { promises as fs } from 'fs';
import path from 'path';

const STORAGE_FILE = path.join(process.cwd(), '.rooms.json');

// Hilfsfunktion: Lese Räume aus Datei
async function readRoomsFromFile(): Promise<Map<string, Room>> {
  try {
    const data = await fs.readFile(STORAGE_FILE, 'utf-8');
    const roomsArray: [string, Room][] = JSON.parse(data);
    return new Map(roomsArray);
  } catch (error) {
    // Datei existiert nicht oder ist leer - gebe leere Map zurück
    return new Map();
  }
}

// Hilfsfunktion: Schreibe Räume in Datei
async function writeRoomsToFile(rooms: Map<string, Room>): Promise<void> {
  const roomsArray = Array.from(rooms.entries());
  await fs.writeFile(STORAGE_FILE, JSON.stringify(roomsArray, null, 2), 'utf-8');
}

// API Funktionen
export async function getAllRooms(): Promise<Map<string, Room>> {
  return await readRoomsFromFile();
}

export async function getRoom(roomId: string): Promise<Room | undefined> {
  const rooms = await readRoomsFromFile();
  return rooms.get(roomId.toUpperCase());
}

export async function setRoom(roomId: string, room: Room): Promise<void> {
  const rooms = await readRoomsFromFile();
  rooms.set(roomId.toUpperCase(), room);
  await writeRoomsToFile(rooms);
}

export async function deleteRoom(roomId: string): Promise<void> {
  const rooms = await readRoomsFromFile();
  rooms.delete(roomId.toUpperCase());
  await writeRoomsToFile(rooms);
}

export async function getRoomCount(): Promise<number> {
  const rooms = await readRoomsFromFile();
  return rooms.size;
}

// Cleanup alte Räume
export async function cleanupOldRooms(): Promise<number> {
  const rooms = await readRoomsFromFile();
  const now = Date.now();
  let deletedCount = 0;
  
  rooms.forEach((room, id) => {
    if (now - room.createdAt > 24 * 60 * 60 * 1000) {
      rooms.delete(id);
      deletedCount++;
    }
  });
  
  if (deletedCount > 0) {
    await writeRoomsToFile(rooms);
  }
  
  return deletedCount;
}

