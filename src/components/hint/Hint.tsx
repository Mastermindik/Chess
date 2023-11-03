import { IPiece } from "../../models/IPiece"

type HintProps = {
  piece: IPiece | null,
  isOverPiece: boolean,
  isCaptured: boolean
}

export default function Hint({ piece, isOverPiece, isCaptured }: HintProps) {
    
  return (
    <>
      <div className={`hint `}></div>
      {isOverPiece && <div className="over"></div>}
      {isCaptured ? <div className="beat"></div> : ""}
    </>
  )
}
//${piece === null ? "beat" : ""}`
