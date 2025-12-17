import { NextRequest, NextResponse } from 'next/server';
import { rooms } from '../create/route';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId } = await request.json();
    
    const room = rooms.get(roomId.toUpperCase());
    
    if (!room) {
      return NextResponse.json({ error: 'Raum nicht gefunden' }, { status: 404 });
    }
    
    if (room.players.player2) {
      return NextResponse.json({ error: 'Raum ist voll' }, { status: 400 });
    }
    
    room.players.player2 = playerId;
    rooms.set(roomId.toUpperCase(), room);
    
    return NextResponse.json({ 
      roomId: room.id, 
      playerNumber: 2,
      gameState: room.gameState 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Beitreten' }, { status: 500 });
  }
}

