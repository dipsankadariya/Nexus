import React from 'react'
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
      {/**common components*/}
      <Sidebar/>
      <Routes>
        <Route path='/' element= {<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/signup' element={<SignUpPage/>} />
      </Routes>
    </div>
  )
}

export default App;

//5:28