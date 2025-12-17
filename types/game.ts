// Quarto Spielstein-Eigenschaften
export type PieceAttribute = {
  color: 'light' | 'dark';
  height: 'tall' | 'short';
  shape: 'square' | 'round';
  top: 'hollow' | 'solid';
};

export type Piece = {
  id: number;
  attributes: PieceAttribute;
};

export type BoardCell = Piece | null;

export type GameState = {
  board: BoardCell[][];
  availablePieces: Piece[];
  selectedPiece: Piece | null;
  currentPlayer: 1 | 2;
  winner: number | null;
  gamePhase: 'selectPiece' | 'placePiece';
};
