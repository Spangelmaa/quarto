import { NextRequest, NextResponse } from 'next/server';
import { roomStorage } from '@/lib/roomStorage';
import { broadcastRoomUpdate } from '@/lib/sseConnections';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId } = await request.json();
    const upperRoomId = roomId.toUpperCase();
    
    console.log(`[JOIN] 🔍 Suche Raum: ${upperRoomId}, Verfügbare: [${roomStorage.getAllRoomIds().join(', ')}]`);
    
    const room = roomStorage.getRoom(upperRoomId);
    
    if (!room) {
      console.log(`[JOIN] ❌ Raum nicht gefunden: ${upperRoomId}`);
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    if (room.players.player2) {
      console.log(`[JOIN] ⚠️ Raum ist voll: ${upperRoomId}`);
      return NextResponse.json({ error: 'Raum ist voll' }, { status: 400 });
    }
    
    room.players.player2 = playerId;
    room.lastActivity = Date.now();
    roomStorage.setRoom(upperRoomId, room);
    
    console.log(`[JOIN] ✅ Spieler 2 beigetreten: ${playerId} in Raum ${upperRoomId}`);
    
    // Broadcast an Spieler 1 dass Spieler 2 beigetreten ist
    broadcastRoomUpdate(upperRoomId, {
      type: 'state',
      gameState: room.gameState,
      players: room.players,
    });
    
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

