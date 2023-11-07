import { Button } from "@mui/material";

type StebButtonsProps = {
  handleNext: () => void,
  handleBack: () => void,
  firstStep: boolean,
  lastStep: boolean,
  canNext: boolean
}

export default function StepButtons({
  handleBack, handleNext, lastStep, firstStep, canNext
}: StebButtonsProps) {
  return (
    <div>
      <Button
        variant="contained"
        onClick={handleNext}
        sx={{ mt: 1, mr: 1 }}
        disabled={!canNext}
      >
        {lastStep ? 'Finish' : 'Continue'}
      </Button>
      <Button
        disabled={firstStep}
        onClick={handleBack}
        sx={{ mt: 1, mr: 1 }}
      >
        Back
      </Button>
    </div>
  )
}
