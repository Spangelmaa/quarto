import { NextRequest, NextResponse } from 'next/server';
import { rooms } from '@/lib/roomStorage';

export async function GET(request: NextRequest) {
  try {
    const roomId = request.nextUrl.searchParams.get('roomId');
    
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID erforderlich' }, { status: 400 });
    }
    
    const room = rooms.get(roomId.toUpperCase());
    
    if (!room) {
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      gameState: room.gameState,
      players: room.players
    });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Abrufen des Spielstands' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { roomId, gameState, playerId } = await request.json();
    
    console.log(`[STATE UPDATE] Spieler ${playerId} aktualisiert Raum ${roomId}`);
    console.log(`[STATE UPDATE] Neuer Zustand:`, {
      currentPlayer: gameState.currentPlayer,
      phase: gameState.gamePhase,
      selectedPiece: gameState.selectedPiece?.id
    });
    
    const room = rooms.get(roomId.toUpperCase());
    
    if (!room) {
      console.log(`[STATE UPDATE] Raum nicht gefunden: ${roomId}`);
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    // Verifiziere dass der Spieler im Raum ist
    if (room.players.player1 !== playerId && room.players.player2 !== playerId) {
      console.log(`[STATE UPDATE] Nicht autorisiert: ${playerId}`);
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 });
    }
    
    room.gameState = gameState;
    rooms.set(roomId.toUpperCase(), room);
    
    console.log(`[STATE UPDATE] Zustand erfolgreich gespeichert für Raum ${roomId}`);
    
    return NextResponse.json({ success: true, gameState: room.gameState });
  } catch (error) {
    console.error('[STATE UPDATE] Fehler:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Spielstands' }, { status: 500 });
  }
}

