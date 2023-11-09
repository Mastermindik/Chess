import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

type ErrorPageProps = {
  subtitle?: string,
  description?: string
}

export default function ErrorPage({
  subtitle = "Page not found",
  description = "The page you are looking for might have been removed had its name changed or is temporarily unavailable."
}:ErrorPageProps) {
  const navigate = useNavigate();

  return (
    <div className="error">
      <div className="wrapper">
        <h1 className="title">Oops!</h1>
        <div className="not_found">
          <h2 className="subtitle">404 - {subtitle}</h2>
          <p className="descr">{description}</p>
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
