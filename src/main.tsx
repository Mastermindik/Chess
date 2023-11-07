import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import GameApp from './pages/gameApp/GameApp.tsx'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/game/:id",
      element: <GameApp />,
    }
  ]
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend} >
      <RouterProvider router={router} />
    </DndProvider>
  </React.StrictMode>,
)
