import { Chess } from "chess.js";

const chess = new Chess();

// export type IBoard = ReturnType<typeof chess.board>;
export interface IBoard extends ReturnType<typeof chess.board> { }

export interface IPromotion {
  from: string,
  to: string,
  color: "w" | "b",
  promotionPieces: ("r"| "n"| "b"| "q")[]
}

export interface IGame {
  board: IBoard,
  pendingPromotion: IPromotion | null,
  isGameOver: boolean,
  isDraw: boolean,
  gameResult: string | null
}
