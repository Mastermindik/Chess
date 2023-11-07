import { TextField } from '@mui/material'
import StepButtons from './StepButtons'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '../../firebase'

type StepNicknameProps = {
  handleNext: () => void,
  handleBack: () => void,
  nickname: string,
  setNickname: Function,
  firstStep?: boolean,
  lastStep?: boolean
}

export default function StepNickname({
  handleBack, handleNext, firstStep, lastStep, nickname, setNickname
}: StepNicknameProps) {
  async function handleClick() {
    await signInAnonymously(auth).then(e => {
      localStorage.setItem("nickname", nickname)
    }).catch(e => console.error(e));
    handleNext();
  }
  return (
    <div >
      <TextField
        label="Enter nickname"
        variant="filled"
        fullWidth
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <StepButtons
        handleBack={handleBack}
        handleNext={handleClick}
        firstStep={!!firstStep}
        lastStep={!!lastStep}
        canNext={!!nickname.length}
      />
    </div>

  )
}
