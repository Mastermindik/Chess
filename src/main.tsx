import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
const StartPage = React.lazy(() => import('./pages/startPage/StartPage.tsx'))
const GameApp = React.lazy(() => import('./pages/gameApp/GameApp.tsx'))

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/game/:id",
          element: <GameApp />,
        },
        {
          path: "/startPage",
          element: <StartPage />,
        }
      ]
    }
  ]
)

const theme = createTheme({
  palette: {
    mode: "dark"
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend} >
      <ThemeProvider theme={theme} >
        <RouterProvider router={router} />
      </ThemeProvider>
    </DndProvider>
  </React.StrictMode>,
)
