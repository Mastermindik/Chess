import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";
import { IGame, IGameDetails, IPromotion, defaultGame } from "../models/IGame";
import { DocumentData, DocumentReference, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { IMember } from "../models/IMember";

// init chess
const chess = new Chess();

let gameRef: DocumentReference<DocumentData, DocumentData>

// init game subject
export const gameSubject = new BehaviorSubject<IGame>(defaultGame);

/**
 * 
 * @param gameRefFb document db (firebase)
 * @param nickname name of User
 * @returns Promise<"not found" | "game over" | "intruder" | "game created">
 * 
 */
export async function initGame(
  gameRefFb: DocumentReference<DocumentData, DocumentData>,
  nickname: string
) {
  gameRef = gameRefFb
  const { currentUser } = auth;
  const gameDoc = await getDoc(gameRefFb);

  if (!gameDoc) {
    return "not found"
  }

  const gameData = gameDoc.data() as IGameDetails;
  const creator = gameData.members.find(m => m.creator === true);

  if (gameData.status === "over") {
    return "game over";
  }

  if (gameData.status === "waiting" && creator?.uid !== currentUser?.uid) {
    const currentMember: IMember = {
      name: nickname,
      uid: currentUser?.uid,
      piece: creator?.piece === "white" ? "black" : "white",
      creator: false
    }
    const members = [...gameData.members, currentMember];
    await updateDoc(gameRefFb, { members, status: "ready" });

  } else if (!gameData.members.some(m => m.uid === currentUser?.uid)) {
    return 'intruder';
  }

  chess.reset();
  
  //monitor data updates in Firebase
  onSnapshot(gameRefFb, (gameDoc) => {
    const game = gameDoc.data() as IGameDetails;
    const { pendingPromotion, gameData, members } = game;
    const member = members.find(m => m.uid === currentUser?.uid);
    const opponent = members.find(m => m.uid !== currentUser?.uid);

    if (gameData) {
      chess.load(gameData);
    }

    const isGameOver = chess.isGameOver();

    if (member) {
      gameSubject.next(
        {
          board: chess.board(),
          gameResult: isGameOver ? gameResult() : null,
          isDraw: chess.isDraw(),
          isGameOver,
          pendingPromotion,
          member,
          opponent: opponent ? opponent : null,
        }
      );
    }

    updateGame()
  });
  return "game created"
}

/**
 * Check promotion
 * @param from square from which the chess piece comes 
 * @param to square where the chess piece goes
 */
export function checkPromotion(from: string, to: string) {
  const promotions = chess.moves({ verbose: true }).filter(e => e.promotion);
  const havePromotion = promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)

  if (havePromotion) {
    const pendingPromotion: IPromotion = { from, to, color: promotions[0].color, promotionPieces: ["r", "n", "b", "q"] }
    updateGame(pendingPromotion)
  } else {
    move(from, to)
  }
}

/**
 * Check if legal move and do move
 * @param from square from which the chess piece comes 
 * @param to square where the chess piece goes
 * @param promotion if we have promotion
 */
export function move(from: string, to: string, promotion?: string) {
  let tempMove = { from, to, promotion }

  const legalMove = chess.move(tempMove);

  if (legalMove) {
    updateGame()
  }
}

/**
 * Check if piece can move to the square
 * @param from square from which the chess piece comes 
 * @param to square where the chess piece goes
 * @returns true if piece can move, false if can't
 */
export function canMove(from: string, to: string) {
  const moves = chess.moves({ verbose: true });
  return moves.some(e => e.to === to && e.from === from);
}

/**
 * Check if square is captured(already have piece)
 * @param to square where the chess piece goes
 * @returns true if is captured, false if is not
 */
export function isCaptured(to: string) {
  const moves = chess.moves({ verbose: true }).filter(e => e.captured);
  return moves.some(e => e.to === to)
}

/**
 * 
 * @returns game result with reason, null if game not over
 */
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

/**
 * Function to restart game
 */
export function restartGame() {
  chess.reset();
  updateGame(null, true);
}

// export async function revancheGame() {
//   chess.reset();
//   const gameDoc = await getDoc(gameRef);
//   const game = gameDoc.data() as IGameDetails;
//   const newCreator = game.members.filter(e => e.creator)[0];
//   newCreator.piece = newCreator.piece === "black" ? "white" : "black";
//   const newOpponent = game.members.filter(e => !e.creator)[0];
//   newOpponent.piece = newOpponent.piece === "black" ? "white" : "black";
//   const newMembers = [newCreator, newOpponent]

//   await updateDoc(gameRef, { members: newMembers, status: "ready", gameData: chess.fen() });

//   updateGame();
// }

/**
 * Update game position
 * @param pendingPromotion if we have promotion
 * @param over if game over
 */
async function updateGame(pendingPromotion: IPromotion | null = null,
  over?: boolean) {
  if (over) {
    await updateDoc(gameRef, { status: "over" })
  } else if (pendingPromotion) {
    const game = gameSubject.getValue();
    game.pendingPromotion = pendingPromotion;
    gameSubject.next(game)

  } else if (gameRef) {
    const updatedData = { gameData: chess.fen(), pendingPromotion }
    await updateDoc(gameRef, updatedData)
  }
}

/**
 * Get color of turn
 * @returns "w" if turn white, "b" if turn black
 */
export function getTurn() {
  return chess.turn()
}

// export function undo() {
//   const test = chess.undo();
//   const history = chess.history({ verbose: true }).map(e => e.after);
//   console.log(history);


//   console.log(test);
//   // updateGame()
// }

// export function showGameHistory(move: number, history: string[]) {
//   chess.load(history[move]);
//   // updateGame()
// }
