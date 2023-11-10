import { IHistoryMove } from "../../models/IHistoryMove"
import HistoryBox from "../historyBox/HistoryBox"

type GameInfoProps = {
  opponentName: string,
  memberName: string,
  history: IHistoryMove[]
}

export default function GameInfo({ history, memberName, opponentName }: GameInfoProps) {
  return (
    <div className="info">
      {!!opponentName.length ?
        <div className="name opponent">
          {opponentName}
        </div>
        : ""
      }
      <HistoryBox history={history} />
      <div className="name member">
        {memberName}
      </div>
    </div>
  )
}
