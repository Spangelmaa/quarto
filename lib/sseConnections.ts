// SSE-Verbindungsverwaltung
const connections = new Map<string, Set<ReadableStreamDefaultController>>();

export function addConnection(roomId: string, controller: ReadableStreamDefaultController) {
  const upperRoomId = roomId.toUpperCase();
  if (!connections.has(upperRoomId)) {
    connections.set(upperRoomId, new Set());
  }
  connections.get(upperRoomId)!.add(controller);
  console.log(`[SSE] 🔌 Verbindung hinzugefügt für Raum ${upperRoomId}, Total: ${connections.get(upperRoomId)!.size}`);
}

export function removeConnection(roomId: string, controller: ReadableStreamDefaultController) {
  const upperRoomId = roomId.toUpperCase();
  const roomConnections = connections.get(upperRoomId);
  if (roomConnections) {
    roomConnections.delete(controller);
    if (roomConnections.size === 0) {
      connections.delete(upperRoomId);
    }
    console.log(`[SSE] 🔌 Verbindung entfernt für Raum ${upperRoomId}, Verbleibend: ${roomConnections.size}`);
  }
}

export function broadcastRoomUpdate(roomId: string, data: any) {
  const upperRoomId = roomId.toUpperCase();
  const roomConnections = connections.get(upperRoomId);
  
  if (!roomConnections || roomConnections.size === 0) {
    console.log(`[SSE] Keine aktiven Verbindungen für Raum ${upperRoomId}`);
    return;
  }
  
  console.log(`[SSE] 📡 Broadcasting Update für Raum ${upperRoomId} zu ${roomConnections.size} Clients`);
  
  const encoder = new TextEncoder();
  const message = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
  
  // Sende an alle verbundenen Clients
  const deadConnections: ReadableStreamDefaultController[] = [];
  
  roomConnections.forEach((controller) => {
    try {
      controller.enqueue(message);
    } catch (e) {
      console.error('[SSE] Fehler beim Senden:', e);
      deadConnections.push(controller);
    }
  });
  
  // Entferne tote Verbindungen
  deadConnections.forEach(controller => {
    roomConnections.delete(controller);
  });
}
