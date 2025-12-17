import { NextRequest } from 'next/server';
import { roomStorage } from '@/lib/roomStorage';
import { addConnection, removeConnection } from '@/lib/sseConnections';

// WICHTIG: Node.js Runtime für SSE erforderlich (nicht Edge)
export const runtime = 'nodejs';
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
      addConnection(upperRoomId, controller);
      
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
      
      // Heartbeat alle 15 Sekunden (verhindert Timeout)
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
          console.log(`[SSE] 💓 Heartbeat gesendet an Raum ${upperRoomId}`);
        } catch (e) {
          console.error(`[SSE] ❌ Heartbeat fehlgeschlagen für Raum ${upperRoomId}:`, e);
          clearInterval(heartbeatInterval);
          removeConnection(upperRoomId, controller);
        }
      }, 15000);
      
      // Cleanup bei Verbindungsabbruch
      request.signal.addEventListener('abort', () => {
        console.log(`[SSE] 🔌 Verbindung geschlossen für Raum ${upperRoomId}`);
        clearInterval(heartbeatInterval);
        removeConnection(upperRoomId, controller);
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
