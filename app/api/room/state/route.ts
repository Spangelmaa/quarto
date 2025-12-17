import { NextRequest, NextResponse } from 'next/server';
import { roomStorage } from '@/lib/roomStorage';
import { broadcastRoomUpdate } from '@/lib/sseConnections';

export async function GET(request: NextRequest) {
  try {
    const roomId = request.nextUrl.searchParams.get('roomId');
    
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID erforderlich' }, { status: 400 });
    }
    
    const upperRoomId = roomId.toUpperCase();
    const room = roomStorage.getRoom(upperRoomId);
    
    if (!room) {
      console.log(`[STATE GET] ❌ Raum nicht gefunden: ${upperRoomId}`);
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      gameState: room.gameState,
      players: room.players
    });
  } catch (error) {
    console.error('[STATE GET] ❌ Exception:', error);
    return NextResponse.json({ error: 'Fehler beim Abrufen des Spielstands' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { roomId, gameState, playerId } = await request.json();
    const upperRoomId = roomId.toUpperCase();
    
    console.log(`[STATE UPDATE] 📝 Aktualisiere Raum ${upperRoomId}:`, {
      currentPlayer: gameState.currentPlayer,
      phase: gameState.gamePhase,
      selectedPiece: gameState.selectedPiece?.id
    });
    
    const room = roomStorage.getRoom(upperRoomId);
    
    if (!room) {
      console.log(`[STATE UPDATE] ❌ Raum nicht gefunden: ${upperRoomId}`);
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    // Verifiziere dass der Spieler im Raum ist
    if (room.players.player1 !== playerId && room.players.player2 !== playerId) {
      console.log(`[STATE UPDATE] ⚠️ Nicht autorisiert: ${playerId}`);
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
    }
    
    room.gameState = gameState;
    room.lastActivity = Date.now();
    roomStorage.setRoom(upperRoomId, room);
    
    console.log(`[STATE UPDATE] ✅ Zustand gespeichert für Raum ${upperRoomId}`);
    
    // Broadcast Update via SSE
    broadcastRoomUpdate(upperRoomId, {
      type: 'state',
      gameState: room.gameState,
      players: room.players,
    });
    
    return NextResponse.json({ success: true, gameState: room.gameState });
  } catch (error) {
    console.error('[STATE UPDATE] ❌ Fehler:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Spielstands' }, { status: 500 });
  }
}

