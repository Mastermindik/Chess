import { useState } from "react"
import StepButtons from "./StepButtons";
import { IconButton, TextField } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

type GameLinkProps = {
  link: string,
  handleNext: () => void,
  handleBack: () => void,
  firstStep?: boolean,
  lastStep?: boolean
}

export default function StepGameLink({
  link, firstStep, handleBack, handleNext, lastStep
}: GameLinkProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  function copy() {
    if (link) {
      navigator.clipboard.writeText(link)
        .then(() => {
          setIsCopied(true)
        })
        .catch(e => console.error(e))
    }
  }

  return (
    <div>
      <div className="link_wrapper">
        <TextField
          label="Copy game link"
          InputProps={{
            readOnly: true,
          }}
          fullWidth
          variant="filled"
          value={isCopied ? "Link copied" : link}
        />
        <IconButton aria-label="copy" onClick={copy} size="large" >
          <ContentCopyIcon fontSize="large" />
        </IconButton>
      </div>
      <StepButtons
        firstStep={!!firstStep}
        lastStep={!!lastStep}
        handleBack={handleBack}
        handleNext={handleNext}
        canNext={isCopied}
      />
    </div>
  )
}
