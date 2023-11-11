import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";
import { IGame, IGameDetails, IPromotion, IUpdateGameDetails, defaultGame } from "../models/IGame";
import { DocumentData, DocumentReference, collection, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { IMember } from "../models/IMember";
import { IHistoryMove } from "../models/IHistoryMove";

// init chess
const chess = new Chess();

let gameRef: DocumentReference<DocumentData, DocumentData>

// init game subject
export const gameSubject = new BehaviorSubject<IGame>(defaultGame);

/**
 * Create game and setup starting parameters
 * @param member object of creator
 * @returns 
 */
export async function createGame(member: IMember) {
  const game: IGameDetails = {
    status: "waiting",
    members: [member],
    gameId: `${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
    pendingPromotion: null,
    history: [],
  }

  // зберегти колекцію
  const gamesCollection = collection(db, "games");

  // Отримати посилання на документ за ідентифікатором "game.gameId"
  const gameDoc = doc(gamesCollection, game.gameId);

  // Зберегти дані гри в документ
  await setDoc(gameDoc, game);
  return game.gameId;
}

/**
 * 
 * @param gameRefFb document db (firebase)
 * @param nickname name of User
 * @returns Promise<"not found" | "game over" | "intruder" | "connected to game">
 * 
 */
export async function initGame(
  gameRefFb: DocumentReference<DocumentData, DocumentData>,
  nickname: string
) {
  gameRef = gameRefFb
  const { currentUser } = auth;
  const gameDoc = await getDoc(gameRefFb);
  const gameData = gameDoc.data() as IGameDetails;

  if (!gameData) {
    return "not found"
  }

  if (gameData.status === "over") {
    return "game over";
  }

  const creator = gameData.members.find(m => m.creator === true);

  if (gameData.status === "waiting" && creator?.uid !== currentUser?.uid) {
    const currentMember: IMember = {
      name: nickname,
      uid: currentUser?.uid,
      piece: creator?.piece === "white" ? "black" : "white",
      creator: false
    }
    const members = [...gameData.members, currentMember];
    await updateDoc<DocumentData, IUpdateGameDetails>(gameRefFb, { members, status: "ready" });

  } else if (!gameData.members.some(m => m.uid === currentUser?.uid)) {
    return 'intruder';
  }

  chess.reset();

  //monitor data updates in Firebase
  onSnapshot(gameRefFb, (gameDoc) => {
    const game = gameDoc.data() as IGameDetails;
    const { pendingPromotion, gameData, members, history } = game;
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
          history,
        }
      );
    }

  });
  // updateGame()
  return "connected to game"
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
    updateGame();
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

/**
 * Update game position
 * @param pendingPromotion if we have promotion
 * @param over if game over
 */
async function updateGame(pendingPromotion: IPromotion | null = null,
  over?: boolean) {
  if (over) {
    await updateDoc<DocumentData, IUpdateGameDetails>(gameRef, { status: "over" })
  } else if (pendingPromotion) {
    const game = gameSubject.getValue();
    game.pendingPromotion = pendingPromotion;
    gameSubject.next(game)

  } else if (gameRef) {
    const history = await getHistory();

    const updatedData: IUpdateGameDetails = { gameData: chess.fen(), pendingPromotion, history }
    await updateDoc<DocumentData, IUpdateGameDetails>(gameRef, updatedData);
  }
}

/**
 * Get color of turn
 * @returns "w" if turn white, "b" if turn black
 */
export function getTurn() {
  return chess.turn()
}

/**
 * 
 * @returns array of history moves
 */
async function getHistory() {
  const gameDoc = await getDoc(gameRef);
  const { history } = gameDoc.data() as IGameDetails;

  const { color, piece, san, lan } = chess.history({ verbose: true })[0];

  const nextMove: IHistoryMove = { color: color, piece: piece, move: san === ("O-O" || "O-O-O") ? san : lan };

  return [...history, nextMove];
}

