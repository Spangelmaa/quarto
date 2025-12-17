import { NextRequest, NextResponse } from 'next/server';
import { createInitialGameState } from '@/utils/gameLogic';
import { Room } from '@/types/multiplayer';
import { rooms, logRoomStorage } from '@/lib/roomStorage';

export async function POST(request: NextRequest) {
  try {
    logRoomStorage('CREATE - VOR');
    
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
    
    console.log(`[CREATE] ✅ Raum erstellt: ${roomId}, Spieler1: ${playerId}`);
    
    // Verifiziere sofort dass der Raum abrufbar ist
    const verification = rooms.get(roomId);
    console.log(`[CREATE] Verifikation: Raum ${roomId} kann abgerufen werden:`, !!verification);
    
    logRoomStorage('CREATE - NACH');
    
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
