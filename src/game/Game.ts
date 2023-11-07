import { Chess } from "chess.js";
import { BehaviorSubject } from "rxjs";
import { IGame, IGameDetails, IPromotion } from "../models/IGame";
import { DocumentData, DocumentReference, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { IMember } from "../models/IMember";
// import {} from 'rxfire/firestore';

const chess = new Chess();

// Ініціалізуєм початкові значення
// const initialGame: IGame = {
//   board: chess.board(),
//   pendingPromotion: null,
//   isGameOver: chess.isGameOver(),
//   isDraw: chess.isDraw(),
//   gameResult: gameResult()
// }
let gameRef: DocumentReference<DocumentData, DocumentData>

export const gameSubject = new BehaviorSubject<IGame | null>(null)

export async function initGame(
  gameRefFb: DocumentReference<DocumentData, DocumentData>,
  nickname: string
) {
  gameRef = gameRefFb
  const { currentUser } = auth;
  const gameDoc = await getDoc(gameRefFb)
  if (!gameDoc) {
    return "not found"
  }
  const gameData = gameDoc.data() as IGameDetails;
  const creator = gameData.members.find(m => m.creator === true);

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

  onSnapshot(gameRefFb, (gameDoc) => {
    const game = gameDoc.data() as IGameDetails;
    const { pendingPromotion, gameData } = game;
    const member = game.members.find(m => m.uid === currentUser?.uid);
    const opponent = game.members.find(m => m.uid !== currentUser?.uid);
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
}

export function checkPromotion(from: string, to: string) {
  const promotions = chess.moves({ verbose: true }).filter(e => e.promotion);


  if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
    const pendingPromotion: IPromotion = { from, to, color: promotions[0].color, promotionPieces: ["r", "n", "b", "q"] }
    updateGame(pendingPromotion)
  } else {
    move(from, to)
  }
}

export function move(from: string, to: string,
  promotion?: string) {
  let tempMove = { from, to, promotion }

  const legalMove = chess.move(tempMove);

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
  // updateGame();
}

function updateGame(pendingPromotion: IPromotion | null = null) {
  // const newGame: IGame = {
  //   board: chess.board(),
  //   pendingPromotion,
  //   isGameOver: chess.isGameOver(),
  //   isDraw: chess.isDraw(),
  //   gameResult: gameResult(),
  // }
  const updatedData = { gameData: chess.fen(), pendingPromotion: pendingPromotion }
  if (gameRef) {
    updateDoc(gameRef, updatedData)
  }
  // gameSubject.next(newGame);
  // console.log(chess.history());
}

export function getTurn() {
  return chess.turn()
}

export function undo() {
  const test = chess.undo();
  const history = chess.history({ verbose: true }).map(e => e.after);
  console.log(history);


  console.log(test);
  // updateGame()
}

export function showGameHistory(move: number, history: string[]) {
  chess.load(history[move]);
  // updateGame()
}

let history: string[] = [];

export function getHistory() {
  const nextPositions = chess.history({ verbose: true }).map(e => e.after);
  const firstPosition = chess.history({ verbose: true })[0].before;
  return history = [firstPosition, ...nextPositions];

}
