import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="error">
      <div className="wrapper">
        <h1 className="title">Oops!</h1>
        <div className="not_found">
          <h2 className="subtitle">404 - Page not found</h2>
          <p className="descr">The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
          <Button color="primary"
            variant="contained"
            size="large"
            className="btn"
            onClick={() => navigate("/")} >go to homepage</Button>
        </div>
      </div>
    </div>
  )
}
