import { useNavigate } from "react-router-dom"
import { restartGame } from "../../game/Game"

type ModalEndGameProps = {
  reason: string,
  setCloseModal: Function
}

export default function ModalEndGame({ reason, setCloseModal }: ModalEndGameProps) {
  const navigate = useNavigate();
  function handlerestart() {
    restartGame();
    navigate("/startPage")
  }

  return (
    <div className="modal_wrapper">
      <div className="modal">
        <div className="reason">
          {reason}
        </div>
        <div className="buttons">
          <button className="btn restart" onClick={handlerestart}>
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
