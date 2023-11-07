import { getTurn } from "../../game/Game";
import { IBoard } from "../../models/IGame";
import BoardSquare from "../boardSquare/BoardSquare"
import XCoordinate from "../coordinates/XCoordinate";
import YCoordinate from "../coordinates/YCoordinate";

type BoardProps = {
  board: IBoard,
  color?: string,
  rotate: boolean
}

export default function Board({ board, color, rotate }: BoardProps) {
  const horisontal = ["a", "b", "c", "d", "e", "f", "g", "h"];
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

  return (
    <div className="board_wrapper">
      <XCoordinate flip hidden={!rotate} />
      <YCoordinate hidden={rotate} />
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
      <YCoordinate flip hidden={!rotate} />
      <XCoordinate  hidden={rotate} />
    </div>
  )
}
