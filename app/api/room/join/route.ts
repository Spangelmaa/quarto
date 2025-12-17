import { NextRequest, NextResponse } from 'next/server';
import { rooms } from '@/lib/roomStorage';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId } = await request.json();
    
    const upperRoomId = roomId.toUpperCase();
    
    console.log(`[JOIN] Versuche Raum beizutreten: ${roomId} -> ${upperRoomId}`);
    console.log(`[JOIN] rooms Map Reference:`, rooms);
    console.log(`[JOIN] Verfügbare Räume:`, Array.from(rooms.keys()));
    console.log(`[JOIN] Suche nach Key:`, upperRoomId);
    
    const room = rooms.get(upperRoomId);
    
    if (!room) {
      console.log(`[JOIN] Raum nicht gefunden: ${roomId}`);
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    if (room.players.player2) {
      console.log(`[JOIN] Raum ist voll: ${roomId}`);
      return NextResponse.json({ error: 'Raum ist voll' }, { status: 400 });
    }
    
    room.players.player2 = playerId;
    rooms.set(roomId.toUpperCase(), room);
    
    console.log(`[JOIN] Spieler 2 beigetreten: ${playerId} in Raum ${roomId}`);
    
    return NextResponse.json({ 
      roomId: room.id, 
      playerNumber: 2,
      gameState: room.gameState 
    });
  } catch (error) {
    console.error('[JOIN] Fehler:', error);
    return NextResponse.json({ error: 'Fehler beim Beitreten' }, { status: 500 });
  }
}

