import { IHistoryMove } from "../../models/IHistoryMove"

type HistoryBoxProps = {
  history: IHistoryMove[]
}

export default function HistoryBox({ history }: HistoryBoxProps) {
  return (
    <div className="history_box">
      <p>MOVES HISTORY:</p>
      <div className="history_moves">
        {history.map((e, i) => (
          <div className="move" key={i}>
            {`${i + 1}. ${e.move} `}
          </div>
        ))}
      </div>
    </div>
  )
}
