import { NextRequest, NextResponse } from 'next/server';
import { rooms } from '@/lib/roomStorage';

export async function GET(request: NextRequest) {
  try {
    const roomId = request.nextUrl.searchParams.get('roomId');
    
    if (!roomId) {
      console.log('[STATE GET] Keine Room ID angegeben');
      return NextResponse.json({ error: 'Room ID erforderlich' }, { status: 400 });
    }
    
    const upperRoomId = roomId.toUpperCase();
    
    console.log(`[STATE GET] Hole Raum: ${roomId} -> ${upperRoomId}`);
    console.log(`[STATE GET] Verfügbare Räume:`, Array.from(rooms.keys()));
    
    const room = rooms.get(upperRoomId);
    
    if (!room) {
      console.log(`[STATE GET] Raum nicht gefunden: ${upperRoomId}`);
      console.log(`[STATE GET] Alle Räume im Detail:`, Array.from(rooms.entries()).map(([k, v]) => ({
        key: k,
        hasValue: !!v,
        player1: v?.players.player1,
        player2: v?.players.player2
      })));
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    console.log(`[STATE GET] Raum gefunden: ${upperRoomId}`);
    
    return NextResponse.json({ 
      gameState: room.gameState,
      players: room.players
    });
  } catch (error) {
    console.error('[STATE GET] Exception:', error);
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

