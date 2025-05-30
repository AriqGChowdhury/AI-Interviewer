import react from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import NavBar from "./components/NavBar"
import Footer from './components/Footer'
import Settings from "./pages/Settings"
import './styles/App.css'
import Dashboard from "./pages/Dashboard"
import Interview from "./pages/Interview"
import PreviousQs from "./pages/PreviousQs"
import { useState, useEffect } from "react"
import api from "./api"
import { ACCESS_TOKEN } from "./constants"

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}


function App() {

  const [user, setUser] = useState([]);
  
  const [prevQs, setPrevQs] = useState([]);

    useEffect(() => {
        getUser();
        getPrevQs();
    }, [])

    const getUser = () => {
        api
        .get('auth/login')
        .then((res) => res.data)
        .then((data) => {setUser(data); console.log(data)})
        .catch((err) => alert(err))
    };

    
    const getPrevQs = () => {
        api
        .get('auth/previousQuestions')
        .then((res) => res.data)
        .then((data) => {setPrevQs(data); console.log(data)})
        .catch((err) => alert(err))
    }
 
  
  return (
    

      
  <div className="app-wrapper">
      <main className="app-content"> 
         
        <BrowserRouter>
          <NavBar user={user} setUser={setUser} /> {}
          <Routes>
            <Route
              path="/"
              element={
                  <Home />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard prevQs={prevQs} setPrevQs={setPrevQs} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Interview prevQs={prevQs} setPrevQs={setPrevQs}/>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/prevQs'
              element={
                <ProtectedRoute>
                  <PreviousQs prevQs={prevQs} />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/login"
              element={<Login setUser={setUser} />}
            />
            <Route 
              path="/register"
              element={<RegisterAndLogout />}
            />
            <Route 
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </BrowserRouter>
    </main>
    <Footer /> {}
  </div>
  )
}

export default App;
