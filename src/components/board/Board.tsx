import { getTurn } from "../../game/Game";
import { IBoard } from "../../models/IGame";
import AxisX from "../axis/AxisX";
import AxisY from "../axis/AxisY";
import BoardSquare from "../boardSquare/BoardSquare"

type BoardProps = {
  board: IBoard,
  color?: string,
  rotate: boolean
}

export default function Board({ board, color, rotate }: BoardProps) {
  const horisontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const vertical = [1, 2, 3, 4, 5, 6, 7, 8];
  function isBlack(i: number) {
    const row = Math.floor(i / 8);
    const col = i % 8;
    return (col + row) % 2 === 0;
  }

  function getPosition(i: number) {
    const x = i % 8;
    const y = Math.abs(Math.floor(i / 8) - 7);
    const letters = horisontal[x];
    return `${letters}${y + 1}`
  }
  console.log(color);


  /* передивитись структуру дом дерева */
  return (
    <div className="board_wrapper">
      <div className="vertical">
        {vertical.map(e => <AxisY number={e} key={e} />)}
      </div>
      <div className={`board ${rotate && "rotate"}`} style={{ pointerEvents: color === getTurn() ? "auto" : "none" }}>
        {board.flat().map((piece, i) =>
          <BoardSquare
            key={i}
            black={isBlack(i)}
            piece={piece}
            position={getPosition(i)}
            rotate={rotate}
          />
        )}
      </div>
      <div className="horisontal">
        <div className="corner">1</div>
        {horisontal.map(e => <AxisX letter={e} key={e} />)}
      </div>
    </div>
  )
}
