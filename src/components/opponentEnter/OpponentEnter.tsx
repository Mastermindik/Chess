import { TextField, Button } from "@mui/material";
import { signInAnonymously } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase";

export default function OpponentEnter() {
  const [nickname, setNickname] = useState<string>("");
  async function handleClick() {
    await signInAnonymously(auth).then(e => {
      localStorage.setItem("nickname", nickname)
      console.log(e);
    }).catch(e => console.error(e));
  }
   
  return (
    <div>
      <TextField
        label="Enter nickname"
        variant="filled"
        fullWidth
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button variant="contained" color="success" onClick={handleClick} >Submit</Button>
    </div>
  )
}
