import { DragPreviewImage, useDrag } from "react-dnd"
import { IPiece } from "../../models/IPiece"

type PieceProps = {
  piece: IPiece,
  pieceImg: string,
  position: string
}


export default function Piece({ piece, pieceImg, position }: PieceProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "piece",
    item: { type: "piece", id: `${position}_${piece.type}_${piece.color}` },
    collect(monitor) {
      return { isDragging: !!monitor.isDragging() }
    },
  })
  return (
    <>
      <DragPreviewImage connect={preview} src={pieceImg} />
      <div className="piece" ref={drag} style={{ opacity: isDragging ? 0 : 1 }} >
        <img src={pieceImg} alt={piece.type} />
      </div>
    </>
  )
}
