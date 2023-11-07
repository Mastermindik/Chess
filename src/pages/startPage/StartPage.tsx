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

export default function StartPage() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [color, setColor] = useState<"black" | "white" | "random">("random");
  const [nickname, setNickname] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [redirectToGame, setRedirectToGame] = useState<boolean>(false);
  const { currentUser } = auth;
  const baseUrl = window.location.origin;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

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
    const game: IGameDetails = {
      status: "waiting",
      members: [member],
      gameId: `${Math.random().toString(36).substring(2, 9)}_${Date.now()}`,
      pendingPromotion: null,
    }
    console.log(game);

    // await db.collection("games").doc(game.gameId).set(game)
    const gamesCollection = collection(db, "games");

    // Отримати посилання на документ за ідентифікатором "game.gameId"
    const gameDoc = doc(gamesCollection, game.gameId);

    // Зберегти дані гри в документ
    await setDoc(gameDoc, game);
    setGameId(game.gameId);
    setLink(`${baseUrl}/game/${game.gameId}`);

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
        <Button variant="contained" color="success" onClick={() => setRedirectToGame(true)} >start game</Button>
      )}
      { redirectToGame && <Navigate to={`/game/${gameId}`} /> }
    </div>

  )
}
