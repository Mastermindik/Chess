import { useState, useEffect } from "react";
import Board from "../../components/board/Board";
import ModalEndGame from "../../components/modalEndGame/ModalEndGame";
import { gameSubject, initGame } from "../../game/Game";
import { IBoard } from "../../models/IGame";
import { collection, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useParams } from "react-router-dom";
import OpponentEnter from "../../components/opponentEnter/OpponentEnter";
import { useAuthState } from 'react-firebase-hooks/auth'
import Loading from "../../components/loading/Loading";

export default function GameApp() {
  const [board, setBoard] = useState<IBoard>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);
  const [color, setColor] = useState<string>();
  const [rotate, setRotate] = useState<boolean>(false);
  const [memberName, setMemberName] = useState<string>("");
  const [opponentName, setOpponentName] = useState<string>("");
  const [initResult, setInitResult] = useState<"not found" | "intruder" | "game over" | undefined>();
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const { id } = useParams();
  const nickname = localStorage.getItem("nickname");
  const [user, loading, error] = useAuthState(auth);

  //TODO promotions
  //TODO restart game

  useEffect(() => {    
    async function init() {
      const res = await initGame(doc(collection(db, "games"), `${id}`), nickname ? nickname : '')
      setInitResult(res)
    }
    init();
    const subscribe = gameSubject.subscribe(game => {
      if (game) {
        setBoard(game.board);
        setIsGameOver(game.isGameOver);
        setGameResult(game.gameResult);
        setColor(game.member?.piece.substring(0, 1));
        if (game.member?.piece === "black") {
          setRotate(true);
        }
        setMemberName(game.member.name);
        if (game.opponent) {
          setOpponentName(game.opponent.name)
        }
      }
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [user])

  if (!user) {
    return <OpponentEnter />
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return "Error"
  }

  if (initResult === 'not found') {
    return 'Game Not found'
  }

  if (initResult === 'intruder') {
    return 'The game is already full'
  }

  if (initResult === 'game over') {
    return 'The game is over'
  }

  return (
    <div className="game">
      {isGameOver && gameResult && !closeModal && <ModalEndGame reason={gameResult} setCloseModal={setCloseModal} />}
      <Board board={board} color={color} rotate={rotate} />
      <div className="info">
        {!!opponentName.length &&
          <div className="name opponent">
            {opponentName}
          </div>
        }
        <div className="name member">
          {memberName}
        </div>
      </div>
    </div>
  )
}
