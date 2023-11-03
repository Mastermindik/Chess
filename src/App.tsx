import { useState, useEffect } from 'react';
import './App.scss'
import { gameSubject, restartGame } from './game/Game';
import Board from './components/board/Board';
import { IBoard } from './models/IGame';
import ModalEndGame from './components/modalEndGame/ModalEndGame';

function App() {
  const [board, setBoard] = useState<IBoard>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  useEffect(() => {
    const subscribe = gameSubject.subscribe(game => {
      setBoard(game.board);
      setIsGameOver(game.isGameOver);
      setGameResult(game.gameResult);
    })

    return () => {
      subscribe.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isGameOver) {
      console.log("GAME OVER");
      // restartGame()
    }
  }, [isGameOver])


  return (
    <>
      {isGameOver && gameResult && <ModalEndGame reason={gameResult} />}
      <Board board={board} />
    </>
  )
}

export default App
