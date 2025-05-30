import HomeImage from '../assets/WelcomePageImage.png'
import '../styles/Home.css'
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';



function Home() {
    const navigate = useNavigate();

    return <div className="homePage">
        <p>Test out your coding and non technical skills with AI Interviewer!</p>
        <div className="getStartedButton">
            <Button onClick={() => navigate('/register')} variant="success">Get Started!</Button>
        </div>
        <div className='imageHome'><img src={HomeImage}  alt='welcomeImage' /></div>
    </div>
}

export default Home;