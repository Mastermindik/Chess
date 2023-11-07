import { DragPreviewImage, useDrag } from "react-dnd"
import { IPiece } from "../../models/IPiece"

type PieceProps = {
  piece: IPiece,
  pieceImg: string,
  position: string,
  rotate: boolean
}


export default function Piece({ piece, pieceImg, position, rotate }: PieceProps) {
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
      <div className="piece" 
      ref={drag} 
      style={{ 
        opacity: isDragging ? 0 : 1,
        rotate: rotate ? "180deg" : "0deg"
       }} >
        <img src={pieceImg} alt={piece.type} />
      </div>
    </>
  )
}
