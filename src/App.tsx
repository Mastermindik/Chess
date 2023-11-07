import { Outlet } from 'react-router-dom';
import './App.scss'
import { Suspense } from 'react';
import Loading from './components/loading/Loading';

function App() {
  //TODO Коли дошка з'являється то наче штори роздвигаються
  //TODO Game Over

  return (
    <>
      <Suspense fallback={<Loading />} >
        <Outlet />
      </Suspense>
    </>
  )
}

export default App
