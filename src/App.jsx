import Home from './pages/home'
import Error from './pages/error'
import Profile from './pages/profile'
import './App.css'
import {GoogleOAuthProvider} from '@react-oauth/google'
import Header from './components/header'
import Popups from './components/popups'
import { UserProvider } from './UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <div className="App">
    <BrowserRouter>
    <UserProvider>
    <GoogleOAuthProvider clientId="330627404815-8ne978q386ufkfr08e23pn8824ob11mh.apps.googleusercontent.com">
      <Header/>
      <Popups/>

      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='*' element={<Error/>}/>
        <Route path='/profile/:id' element={<Profile/>}/>
      </Routes>

    </GoogleOAuthProvider>
    </UserProvider>
    </BrowserRouter>
    </div>
  )
}

export default App
