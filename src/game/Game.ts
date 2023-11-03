import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";
import { IGame, IPromotion } from "../models/IGame";

const chess = new Chess();

// Ініціалізуєм початкові значення
const initialGame: IGame = {
  board: chess.board(),
  pendingPromotion: null,
  isGameOver: chess.isGameOver(),
  isDraw: chess.isDraw(),
  gameResult: gameResult()
}

export const gameSubject = new BehaviorSubject<IGame>(initialGame)

export function checkPromotion(from: string, to: string) {
  const promotions = chess.moves({ verbose: true }).filter(e => e.promotion);
  
  
  if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
    const pendingPromotion: IPromotion = { from, to, color: promotions[0].color, promotionPieces: ["r", "n", "b", "q"] }
    updateGame(pendingPromotion)
  } else {
    move(from, to)
  }
}

export function move(from: string, to: string, promotion?: string) {
  let tempMove = { from, to, promotion }
  
  const legalMove = chess.move(tempMove)
  
  if (legalMove) {
    updateGame()
  }
}

export function canMove(from: string, to: string) {
  const moves = chess.moves({ verbose: true });
  return moves.some(e => e.to === to && e.from === from);
}

export function isCaptured(to: string) {
  const moves = chess.moves({ verbose: true }).filter(e => e.captured);
  return moves.some(e => e.to === to)
}

function gameResult() {
  if (chess.isCheckmate()) {
    const winner = chess.turn() === "w" ? "Black" : "White";
    return `CheckMate! ${winner} Win`;
  } else if (chess.isDraw()) {
    let reason = "";
    if (chess.isStalemate()) {
      reason = "Stalemate";
    } else if (chess.isThreefoldRepetition()) {
      reason = "Threefold Repetition";
    } else if (chess.isInsufficientMaterial()) {
      reason = "Insufficient Material";
    }
    return `Draw - ${reason}`
  }
  return null;
}

export function restartGame() {
  chess.reset();
  updateGame();
}

function updateGame(pendingPromotion: IPromotion | null = null) {
  const newGame: IGame = {
    board: chess.board(),
    pendingPromotion,
    isGameOver: chess.isGameOver(),
    isDraw: chess.isDraw(),
    gameResult: gameResult()
  }
  
  gameSubject.next(newGame);
  // console.log(chess.history());
}

