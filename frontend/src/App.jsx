
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import NavBar from "./components/Navbar"
import Footer from './components/Footer'
import Settings from "./pages/Settings"
import Results from "./pages/Results"
import './styles/App.css'
import Dashboard from "./pages/Dashboard"
import Interview from "./pages/Interview"
import ForgotPass from "./pages/ForgotPass"
import PreviousQs from "./pages/PreviousQs"
import { useState, useEffect } from "react"
import api from "./api"
import { ACCESS_TOKEN } from "./constants"

function RegisterAndLogout() {
  useEffect(() => {
    localStorage.clear();
  }, []); 
  return <Register />
}


function App() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      api.get('me')
        .then(res => { 
          setUser(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
      
    } else {
      setLoading(false);
    }
  }, []);


  if (loading) {
    return <div>Loading...</div>;
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
                  <Settings user={user} setUser={setUser}/>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Interview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reset/:uidb64/:token"
              element={
                <ForgotPass />
              }
            />
            <Route 
              path='/prevQs'
              element={
                <ProtectedRoute>
                  <PreviousQs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route 
              path="login"
              element={<Login setUser={setUser} />}
            />
            <Route 
              path="register"
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
