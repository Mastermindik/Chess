import { IPiece } from "../../models/IPiece"
import Piece from "../piece/Piece"
import b_b from "../../assets/b_b.png"
import b_w from "../../assets/b_w.png"
import k_b from "../../assets/k_b.png"
import k_w from "../../assets/k_w.png"
import n_b from "../../assets/n_b.png"
import n_w from "../../assets/n_w.png"
import p_b from "../../assets/p_b.png"
import p_w from "../../assets/p_w.png"
import q_b from "../../assets/q_b.png"
import q_w from "../../assets/q_w.png"
import r_b from "../../assets/r_b.png"
import r_w from "../../assets/r_w.png"
import { useDrop } from "react-dnd"
import { IPieceItem } from "../../models/IPieceItem"
import { canMove, checkPromotion, gameSubject, isCaptured } from "../../game/Game"
import Hint from "../hint/Hint"
import { useEffect, useState } from "react"
import { IPromotion } from "../../models/IGame"
import Promote from "../promote/Promote"

type BoardSquareProps = {
  black: boolean,
  piece: IPiece | null,
  position: string,
  rotate: boolean
}

const pieceImg = {
  b_b,
  b_w,
  k_b,
  k_w,
  n_b,
  n_w,
  p_b,
  p_w,
  q_b,
  q_w,
  r_b,
  r_w
}

export default function BoardSquare({ black, piece, position, rotate }: BoardSquareProps) {
  const [promotion, setPromotion] = useState<IPromotion | null>(null);

  useEffect(() => {
    const subscribe = gameSubject.subscribe(
      (game) =>
        game?.pendingPromotion && game?.pendingPromotion.to === position
          ? setPromotion(game?.pendingPromotion)
          : setPromotion(null)
    )
    return () => subscribe.unsubscribe();
  }, [])


  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "piece",
    canDrop: (item) => {
      const fromPosition = item.id.split("_")[0];
      return canMove(fromPosition, position)
    },
    drop: (item: IPieceItem) => {
      const [fromPosition] = item.id.split("_");
      checkPromotion(fromPosition, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  const isBlack = black ? "black" : "white";

  return (
    <div
      className={`square ${isBlack}`}
      ref={drop} >
      {promotion ?
        <Promote promotions={promotion} />
        : piece &&
        <Piece
          piece={piece}
          pieceImg={pieceImg[`${piece.type}_${piece.color}`]}
          position={position}
          rotate={rotate} />}
      {canDrop &&
        <Hint
          piece={piece}
          isOverPiece={isOver}
          isCaptured={isCaptured(position)} />}
    </div>
  )
}
