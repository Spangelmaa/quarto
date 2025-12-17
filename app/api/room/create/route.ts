import { NextRequest, NextResponse } from 'next/server';
import { createInitialGameState } from '@/utils/gameLogic';
import { Room } from '@/types/multiplayer';
import { setRoom, getRoomCount } from '@/lib/fileStorage';

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
    
    await setRoom(roomId, room);
    
    const roomCount = await getRoomCount();
    console.log(`[CREATE] ✅ Raum erstellt: ${roomId}, Spieler1: ${playerId}, Gesamt: ${roomCount} Räume`);
    
    return NextResponse.json({ 
      roomId, 
      playerNumber: 1,
      gameState: room.gameState 
    });
  } catch (error) {
    console.error('[CREATE] ❌ Fehler:', error);
    return NextResponse.json({ error: 'Fehler beim Erstellen des Raums' }, { status: 500 });
  }
}
