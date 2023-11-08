import { IPiece } from "../../models/IPiece"
import Piece from "../piece/Piece"
import wb from "../../assets/wb.png"
import wn from "../../assets/wn.png"
import wr from "../../assets/wr.png"
import wk from "../../assets/wk.png"
import wq from "../../assets/wq.png"
import wp from "../../assets/wp.png"
import bb from "../../assets/bb.png"
import bn from "../../assets/bn.png"
import br from "../../assets/br.png"
import bk from "../../assets/bk.png"
import bq from "../../assets/bq.png"
import bp from "../../assets/bp.png"
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
  wb,
  wn,
  wr,
  wk,
  wq,
  wp,
  bb,
  bn,
  br,
  bk,
  bq,
  bp
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
          pieceImg={pieceImg[`${piece.color}${piece.type}`]}
          position={position}
          rotate={rotate} />}
      {canDrop &&
        <Hint
          isOverPiece={isOver}
          isCaptured={isCaptured(position)} />}
    </div>
  )
}
