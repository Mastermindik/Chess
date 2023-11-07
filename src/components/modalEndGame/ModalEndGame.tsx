import { restartGame } from "../../game/Game"

type ModalEndGameProps = {
  reason: string,
  setCloseModal: Function
}

export default function ModalEndGame({ reason, setCloseModal }: ModalEndGameProps) {
  return (
    <div className="modal_wrapper">
      <div className="modal">
        <div className="reason">
          {reason}
        </div>
        <div className="buttons">
          <button className="btn restart" onClick={restartGame}>
            Restart
          </button>
          <button className="btn close" onClick={() => setCloseModal(true)} >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
