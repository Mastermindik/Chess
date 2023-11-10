import { Button, Step, StepContent, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import StepNickname from "../../components/steps/StepNickname";
import StepColor from "../../components/steps/StepColor";
import StepGameLink from "../../components/steps/StepGameLink";
import { IMember } from "../../models/IMember";
import { auth, db } from "../../firebase";
import { IGameDetails } from "../../models/IGame";
import { collection, doc, setDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import { createGame } from "../../game/Game";

export default function StartPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [color, setColor] = useState<"black" | "white" | "random">("random");
  const [nickname, setNickname] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const { currentUser } = auth;
  const baseUrl = window.location.origin;
  const [redirect, setRedirect] = useState(false)

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const goToGame = () => {
    setRedirect(true)
  }

  const steps = [
    {
      label: "Enter nickname",
      component: <StepNickname
        handleBack={handleBack}
        handleNext={handleNext}
        nickname={nickname}
        setNickname={setNickname}
        firstStep />
    },
    {
      label: "Choose color",
      component: <StepColor
        handleBack={handleBack}
        handleNext={handleNext}
        startGame={startGame}
        color={color}
        setColor={setColor} />
    },
    {
      label: "Share game's link",
      component: <StepGameLink
        link={link}
        handleBack={handleBack}
        handleNext={handleNext}
        lastStep />
    },
  ]

  function pickColor(color: "black" | "white" | "random") {
    if (color === "random") {
      const colorPick: ["black", "white"] = ["black", "white"];
      return [...colorPick][Math.floor(Math.random())]
    }
    return color;
  }

  async function startGame() {

    const member: IMember = {
      uid: currentUser?.uid,
      name: nickname,
      piece: pickColor(color),
      creator: true
    }

    const gameId = await createGame(member);

    setGameId(gameId);
    setLink(`${baseUrl}/game/${gameId}`);
  }

  return (

    <div className="stepper_wrapper">
      <Stepper activeStep={activeStep} orientation="vertical" >
        {steps.map(({ label, component }) => (
          <Step key={label}>
            <StepLabel>
              {label}
            </StepLabel>
            <StepContent >
              {component}
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Button variant="contained" color="success" onClick={goToGame} >start game</Button>
      )}
      {redirect && <Navigate to={`/game/${gameId}`} />}
    </div>

  )
}
