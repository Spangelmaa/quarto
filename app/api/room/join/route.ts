import { NextRequest, NextResponse } from 'next/server';
import { rooms, logRoomStorage } from '@/lib/roomStorage';

export async function POST(request: NextRequest) {
  try {
    logRoomStorage('JOIN - VOR');
    
    const { roomId, playerId } = await request.json();
    const upperRoomId = roomId.toUpperCase();
    
    console.log(`[JOIN] 🔍 Suche Raum: ${roomId} -> ${upperRoomId}`);
    
    const room = rooms.get(upperRoomId);
    
    if (!room) {
      console.log(`[JOIN] ❌ Raum nicht gefunden: ${upperRoomId}`);
      logRoomStorage('JOIN - FEHLER');
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    if (room.players.player2) {
      console.log(`[JOIN] ⚠️ Raum ist voll: ${upperRoomId}`);
      return NextResponse.json({ error: 'Raum ist voll' }, { status: 400 });
    }
    
    room.players.player2 = playerId;
    rooms.set(upperRoomId, room);
    
    console.log(`[JOIN] ✅ Spieler 2 beigetreten: ${playerId} in Raum ${upperRoomId}`);
    logRoomStorage('JOIN - NACH');
    
    return NextResponse.json({ 
      roomId: room.id, 
      playerNumber: 2,
      gameState: room.gameState 
    });
  } catch (error) {
    console.error('[JOIN] ❌ Fehler:', error);
    return NextResponse.json({ error: 'Fehler beim Beitreten' }, { status: 500 });
  }
}

