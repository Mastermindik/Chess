import { useNavigate } from "react-router-dom"
import { restartGame } from "../../game/Game"
import { Button } from "@mui/material";

type ModalEndGameProps = {
  reason: string,
  setCloseModal: Function,
}

export default function ModalEndGame({ reason, setCloseModal }: ModalEndGameProps) {
  const navigate = useNavigate();
  function handlerestart() {
    restartGame();
    navigate("/");
  }

  return (
    <div className="modal_wrapper">
      <div className="modal">
        <div className="reason">
          {reason}
        </div>
        <div className="buttons">
          <Button 
          variant="contained" 
          color="success" 
          onClick={handlerestart}>
            New game
          </Button>
          <Button 
          variant="contained" 
          color="error" 
          onClick={() => setCloseModal(true)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
