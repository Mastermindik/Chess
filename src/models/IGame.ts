import { Chess } from "chess.js";
import { IMember } from "./IMember";

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
  gameResult: string | null,
  member: IMember,
  opponent: IMember | null,
}

export interface IGameDetails {
  pendingPromotion: IPromotion | null,
  gameData?: string,
  status: "waiting" | "ready",
  members: IMember[],
  gameId: string
}
