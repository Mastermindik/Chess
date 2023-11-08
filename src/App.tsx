import './App.scss'
import StartPage from './pages/startPage/StartPage';

function App() {
  //TODO Коли дошка з'являється то наче штори роздвигаються
  //TODO Game Over

  return (
    <>
      {/* <Suspense fallback={<Loading />} >
        <Outlet />
      </Suspense> */}
      <StartPage />
    </>
  )
}

export default App
