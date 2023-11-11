import { Chess } from "chess.js";
import { IMember } from "./IMember";
import { IHistoryMove } from "./IHistoryMove";

const chess = new Chess();

export interface IBoard extends ReturnType<typeof chess.board> { }

export interface IPromotion {
  from: string,
  to: string,
  color: "w" | "b",
  promotionPieces: ("r" | "n" | "b" | "q")[]
}

export interface IGame {
  board: IBoard,
  pendingPromotion: IPromotion | null,
  isGameOver: boolean,
  isDraw: boolean,
  gameResult: string | null,
  member: IMember,
  opponent: IMember | null,
  history: IHistoryMove[]
}

export interface IGameDetails {
  pendingPromotion: IPromotion | null,
  gameData?: string,
  status: "waiting" | "ready" | "over",
  members: IMember[],
  gameId: string,
  history: IHistoryMove[],
}

export interface IUpdateGameDetails {
  pendingPromotion?: IPromotion | null,
  gameData?: string,
  status?: "waiting" | "ready" | "over",
  members?: IMember[],
  gameId?: string,
  history?: IHistoryMove[],
}

export const defaultGame: IGame = {
  board: [],
  gameResult: null,
  isDraw: false,
  isGameOver: false,
  pendingPromotion: null,
  opponent: null,
  history: [],
  member: {
    uid: "",
    piece: "white",
    name: "",
    creator: true
  }
}
