import StepButtons from "./StepButtons"
import k_b from "../../assets/k_b.png"
import k_w from "../../assets/k_w.png"
import { ChangeEvent } from "react"

type StepColorProps = {
  handleNext: () => void,
  handleBack: () => void,
  startGame: Function,
  setColor: Function,
  color: string,
  firstStep?: boolean,
  lastStep?: boolean
}

export default function StepColor({
  handleBack, handleNext, startGame, firstStep, lastStep, color, setColor
}: StepColorProps) {

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setColor(e.target.value);
  }

  async function handleClick() {
    await startGame()
    handleNext()
  }

  return (
    <div >
      <div className="colors">
        <input
          type="radio"
          name="color"
          id="white"
          value={"white"}
          onChange={e => handleChange(e)} />

        <label className="white" htmlFor="white">
          <img src={k_w} alt="white" />
        </label>

        <input
          type="radio"
          name="color"
          id="black"
          value={"black"}
          onChange={e => handleChange(e)} />

        <label className="black" htmlFor="black">
          <img src={k_b} alt="black" />
        </label>

        <input
          type="radio"
          name="color"
          id="random"
          value={"random"}
          onChange={e => handleChange(e)} />

        <label className="random" htmlFor="random">
          <img src={k_b} alt="random" className="white_path" />
          <img src={k_w} alt="random" className="black_path" />
        </label>
      </div>
      <StepButtons
        handleBack={handleBack}
        handleNext={handleClick}
        firstStep={!!firstStep}
        lastStep={!!lastStep}
        canNext={!!color.length}
      />
    </div>
  )
}
