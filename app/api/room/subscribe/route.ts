import { NextRequest } from 'next/server';
import { roomStorage } from '@/lib/roomStorage';

// Map um SSE-Verbindungen zu verwalten
const connections = new Map<string, Set<ReadableStreamDefaultController>>();

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const roomId = request.nextUrl.searchParams.get('roomId');
  
  if (!roomId) {
    return new Response('Room ID erforderlich', { status: 400 });
  }
  
  const upperRoomId = roomId.toUpperCase();
  
  // Prüfe ob Raum existiert
  const room = roomStorage.getRoom(upperRoomId);
  if (!room) {
    return new Response('Raum nicht gefunden', { status: 404 });
  }

  // Erstelle SSE-Stream
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      console.log(`[SSE] 🔌 Neue Verbindung für Raum ${upperRoomId}`);
      
      // Füge Controller zur Connection-Map hinzu
      if (!connections.has(upperRoomId)) {
        connections.set(upperRoomId, new Set());
      }
      connections.get(upperRoomId)!.add(controller);
      
      // Sende initialen State
      const room = roomStorage.getRoom(upperRoomId);
      if (room) {
        const data = JSON.stringify({
          type: 'state',
          gameState: room.gameState,
          players: room.players,
        });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }
      
      // Heartbeat alle 30 Sekunden
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch (e) {
          clearInterval(heartbeatInterval);
        }
      }, 30000);
      
      // Cleanup bei Verbindungsabbruch
      request.signal.addEventListener('abort', () => {
        console.log(`[SSE] 🔌 Verbindung geschlossen für Raum ${upperRoomId}`);
        clearInterval(heartbeatInterval);
        const roomConnections = connections.get(upperRoomId);
        if (roomConnections) {
          roomConnections.delete(controller);
          if (roomConnections.size === 0) {
            connections.delete(upperRoomId);
          }
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

// Hilfsfunktion um Updates zu broadcasten
export function broadcastRoomUpdate(roomId: string) {
  const upperRoomId = roomId.toUpperCase();
  const room = roomStorage.getRoom(upperRoomId);
  const roomConnections = connections.get(upperRoomId);
  
  if (!room || !roomConnections || roomConnections.size === 0) {
    return;
  }
  
  console.log(`[SSE] 📡 Broadcasting Update für Raum ${upperRoomId} zu ${roomConnections.size} Clients`);
  
  const encoder = new TextEncoder();
  const data = JSON.stringify({
    type: 'state',
    gameState: room.gameState,
    players: room.players,
  });
  
  const message = encoder.encode(`data: ${data}\n\n`);
  
  // Sende an alle verbundenen Clients
  roomConnections.forEach((controller) => {
    try {
      controller.enqueue(message);
    } catch (e) {
      console.error('[SSE] Fehler beim Senden:', e);
      roomConnections.delete(controller);
    }
  });
}
