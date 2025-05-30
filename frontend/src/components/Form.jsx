import {useState} from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"
import { jwtDecode } from "jwt-decode"


function Form({route, method, setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [pass2, setPassword2] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method == "login" ? "Login" : "Register"

    //Submission of form
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (pass2 && password != pass2) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }
        try {
            const res = await api.post(route, {username, password, pass2, email})
            if (method == "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                const decoded = jwtDecode(res.data.access);
                setUser({username: decoded.username});


                window.location.href = '/dashboard';
            } else {
                navigate("/login")
            }
        }
        catch (error) {
            alert("Invalid username or password");
        } finally {
            setLoading(false);
        }
    
    }

    //Registration
    if (method == "Register" || method == "register") {
        return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>

        
        <input
            className="form-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
        />


        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />

        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />

        <input
            className="form-input"
            type="password"
            value={pass2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm Password"
        />

        <button className="form-button" type="submit">
            {name}
        </button>

    </form>;
    }
    
    //Login
    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>

        <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
        />

        <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
        />

        <button className="form-button" type="submit">
            {name}
        </button>

        <a onClick={() => navigate('/register')}>Sign up for an account!</a>

    </form>;
}


export default Form;