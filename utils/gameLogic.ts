import { Piece, PieceAttribute, BoardCell, GameState } from '@/types/game';

// Alle 16 möglichen Spielsteine erstellen
export const createAllPieces = (): Piece[] => {
  const pieces: Piece[] = [];
  let id = 0;
  
  const colors: ('light' | 'dark')[] = ['light', 'dark'];
  const heights: ('tall' | 'short')[] = ['tall', 'short'];
  const shapes: ('square' | 'round')[] = ['square', 'round'];
  const tops: ('hollow' | 'solid')[] = ['hollow', 'solid'];
  
  colors.forEach(color => {
    heights.forEach(height => {
      shapes.forEach(shape => {
        tops.forEach(top => {
          pieces.push({
            id: id++,
            attributes: { color, height, shape, top }
          });
        });
      });
    });
  });
  
  return pieces;
};

// Initialer Spielzustand
export const createInitialGameState = (): GameState => ({
  board: Array(4).fill(null).map(() => Array(4).fill(null)),
  availablePieces: createAllPieces(),
  selectedPiece: null,
  currentPlayer: 1,
  winner: null,
  gamePhase: 'selectPiece'
});

// Prüft ob 4 Steine eine gemeinsame Eigenschaft haben
const checkFourPieces = (pieces: (Piece | null)[]): boolean => {
  if (pieces.some(p => p === null)) return false;
  
  const validPieces = pieces as Piece[];
  
  // Prüfe jede Eigenschaft
  const allSameColor = validPieces.every(p => p.attributes.color === validPieces[0].attributes.color);
  const allSameHeight = validPieces.every(p => p.attributes.height === validPieces[0].attributes.height);
  const allSameShape = validPieces.every(p => p.attributes.shape === validPieces[0].attributes.shape);
  const allSameTop = validPieces.every(p => p.attributes.top === validPieces[0].attributes.top);
  
  return allSameColor || allSameHeight || allSameShape || allSameTop;
};

// Prüft ob es einen Gewinner gibt
export const checkWinner = (board: BoardCell[][]): boolean => {
  // Reihen prüfen
  for (let row = 0; row < 4; row++) {
    if (checkFourPieces(board[row])) return true;
  }
  
  // Spalten prüfen
  for (let col = 0; col < 4; col++) {
    const column = [board[0][col], board[1][col], board[2][col], board[3][col]];
    if (checkFourPieces(column)) return true;
  }
  
  // Diagonalen prüfen
  const diagonal1 = [board[0][0], board[1][1], board[2][2], board[3][3]];
  const diagonal2 = [board[0][3], board[1][2], board[2][1], board[3][0]];
  
  if (checkFourPieces(diagonal1) || checkFourPieces(diagonal2)) return true;
  
  return false;
};

// Spielstein platzieren
export const placePiece = (
  gameState: GameState,
  row: number,
  col: number
): GameState | null => {
  console.log('[GAME LOGIC] placePiece aufgerufen:', {
    row, col,
    currentPlayer: gameState.currentPlayer,
    phase: gameState.gamePhase,
    selectedPiece: gameState.selectedPiece?.id
  });
  
  if (gameState.gamePhase !== 'placePiece' || !gameState.selectedPiece) {
    console.log('[GAME LOGIC] placePiece abgelehnt: Phase oder Stein fehlt');
    return null;
  }
  
  if (gameState.board[row][col] !== null) {
    console.log('[GAME LOGIC] placePiece abgelehnt: Feld belegt');
    return null; // Feld bereits belegt
  }
  
  const newBoard = gameState.board.map(r => [...r]);
  newBoard[row][col] = gameState.selectedPiece;
  
  const hasWinner = checkWinner(newBoard);
  const newAvailablePieces = gameState.availablePieces.filter(
    p => p.id !== gameState.selectedPiece!.id
  );
  
  // Unentschieden wenn keine Steine mehr verfügbar
  const isDraw = newAvailablePieces.length === 0 && !hasWinner;
  
  const newState: GameState = {
    ...gameState,
    board: newBoard,
    selectedPiece: null,
    winner: hasWinner ? gameState.currentPlayer : (isDraw ? 0 : null),
    // Spieler bleibt gleich - er wählt jetzt einen Stein für den Gegner
    currentPlayer: gameState.currentPlayer,
    gamePhase: (hasWinner || isDraw) ? 'placePiece' : 'selectPiece' as 'selectPiece' | 'placePiece',
    availablePieces: newAvailablePieces
  };
  
  console.log('[GAME LOGIC] placePiece Ergebnis:', {
    currentPlayer: newState.currentPlayer,
    phase: newState.gamePhase,
    selectedPiece: newState.selectedPiece,
    winner: newState.winner
  });
  
  return newState;
};

// Spielstein für den Gegner auswählen
export const selectPiece = (gameState: GameState, piece: Piece): GameState | null => {
  console.log('[GAME LOGIC] selectPiece aufgerufen:', {
    pieceId: piece.id,
    currentPlayer: gameState.currentPlayer,
    phase: gameState.gamePhase
  });
  
  if (gameState.gamePhase !== 'selectPiece') {
    console.log('[GAME LOGIC] selectPiece abgelehnt: Falsche Phase');
    return null;
  }
  
  // Der Spieler wählt den Stein für den Gegner aus
  // Der Spielerwechsel passiert NACH dem Auswählen
  const nextPlayer = gameState.currentPlayer === 1 ? 2 : 1;
  
  const newState: GameState = {
    ...gameState,
    selectedPiece: piece,
    gamePhase: 'placePiece' as const,
    currentPlayer: nextPlayer // Jetzt ist der andere Spieler dran zum Platzieren
  };
  
  console.log('[GAME LOGIC] selectPiece Ergebnis:', {
    currentPlayer: newState.currentPlayer,
    phase: newState.gamePhase,
    selectedPiece: newState.selectedPiece?.id
  });
  
  return newState;
};
