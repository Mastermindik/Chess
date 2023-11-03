import { Square, PieceSymbol, Color } from "chess.js";

export interface IPiece {
  square: Square;
  type: PieceSymbol;
  color: Color;
}