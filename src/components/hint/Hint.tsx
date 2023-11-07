
type HintProps = {
  isOverPiece: boolean,
  isCaptured: boolean
}

export default function Hint({ isOverPiece, isCaptured }: HintProps) {
    
  return (
    <>
      <div className={`hint `}></div>
      {isOverPiece && <div className="over"></div>}
      {isCaptured ? <div className="beat"></div> : ""}
    </>
  )
}
