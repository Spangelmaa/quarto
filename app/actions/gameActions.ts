'use server';

import { revalidatePath } from 'next/cache';
import { GameState } from '@/types/game';

// Server Actions für optimierte Multiplayer-Operationen
// Diese laufen auf dem Server und sind automatisch sicher

/**
 * Erstellt einen neuen Raum
 */
export async function createRoomAction(playerId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/room/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId }),
      // Server-zu-Server Kommunikation: kein CORS
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Fehler beim Erstellen des Raums' };
    }

    const data = await response.json();
    
    // Cache invalidieren
    revalidatePath('/');
    
    return {
      success: true,
      data: {
        roomId: data.roomId,
        playerNumber: data.playerNumber,
        gameState: data.gameState,
      },
    };
  } catch (error) {
    console.error('[SERVER ACTION] createRoom error:', error);
    return { success: false, error: 'Netzwerkfehler beim Erstellen des Raums' };
  }
}

/**
 * Tritt einem Raum bei
 */
export async function joinRoomAction(roomId: string, playerId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/room/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, playerId }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || 'Fehler beim Beitreten' };
    }

    const data = await response.json();
    
    // Cache invalidieren
    revalidatePath('/');
    
    return {
      success: true,
      data: {
        roomId: data.roomId,
        playerNumber: data.playerNumber,
        gameState: data.gameState,
      },
    };
  } catch (error) {
    console.error('[SERVER ACTION] joinRoom error:', error);
    return { success: false, error: 'Netzwerkfehler beim Beitreten' };
  }
}

/**
 * Aktualisiert den Spielzustand
 */
export async function updateGameStateAction(
  roomId: string,
  playerId: string,
  gameState: GameState
) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/room/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, playerId, gameState }),
    });

    if (!response.ok) {
      return { success: false, error: 'Fehler beim Aktualisieren des Spielzustands' };
    }

    // Cache invalidieren für alle Clients
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('[SERVER ACTION] updateGameState error:', error);
    return { success: false, error: 'Netzwerkfehler beim Aktualisieren' };
  }
}

/**
 * Lädt den aktuellen Spielzustand
 */
export async function fetchGameStateAction(roomId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/room/state?roomId=${roomId}`, {
      // Server-Side Caching
      next: { revalidate: 1 }, // Cache für 1 Sekunde
    });

    if (!response.ok) {
      return { success: false, error: 'Fehler beim Laden des Spielzustands' };
    }

    const data = await response.json();
    
    return {
      success: true,
      data: {
        gameState: data.gameState,
        players: data.players,
      },
    };
  } catch (error) {
    console.error('[SERVER ACTION] fetchGameState error:', error);
    return { success: false, error: 'Netzwerkfehler beim Laden' };
  }
}

/**
 * Validiert ob ein Raum existiert
 */
export async function validateRoomAction(roomId: string): Promise<{ exists: boolean; error?: string }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/room/state?roomId=${roomId}`, {
      method: 'GET',
      // Kein Caching für Validierung
      cache: 'no-store',
    });

    return { exists: response.ok };
  } catch (error) {
    return { exists: false, error: 'Netzwerkfehler' };
  }
}
