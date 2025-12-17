import { NextRequest, NextResponse } from 'next/server';
import { createInitialGameState } from '@/utils/gameLogic';
import { Room } from '@/types/multiplayer';

// In-Memory Storage für Demo (in Produktion würde man Redis/Database verwenden)
const rooms = new Map<string, Room>();

// Cleanup alte Räume (älter als 24 Stunden)
setInterval(() => {
  const now = Date.now();
  rooms.forEach((room, id) => {
    if (now - room.createdAt > 24 * 60 * 60 * 1000) {
      rooms.delete(id);
    }
  });
}, 60 * 60 * 1000); // Jede Stunde prüfen

export async function POST(request: NextRequest) {
  try {
    const { playerId } = await request.json();
    
    // Generiere eindeutige Room-ID (4 Buchstaben)
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const room: Room = {
      id: roomId,
      gameState: createInitialGameState(),
      players: {
        player1: playerId,
        player2: null,
      },
      createdAt: Date.now(),
    };
    
    rooms.set(roomId, room);
    
    return NextResponse.json({ 
      roomId, 
      playerNumber: 1,
      gameState: room.gameState 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Erstellen des Raums' }, { status: 500 });
  }
}

export { rooms };

