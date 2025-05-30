import '../styles/Interview.css'
import { use, useEffect, useState } from 'react';
import { Container, Row, Col, Button, Spinner} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from "../constants"


function Interview( prevQs ) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState("");
    const [isCorrect, setCorrect] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expectedIndex, setExpectedIndex] = useState(1);
    const [currentScore, setCurrentScore] = useState(0);
    const [showScorePopup, setShowScorePopup] = useState(false);
    const [scorePercent, setScorePercent] = useState(0);
    let tfList = [];
    useEffect(() => {
        
        axios.get("http://localhost:8000/auth/questions/")
        .then((res) => {
            console.log("raw", res);
            console.log("res.data", res.data);
            console.log(res.data.questions);
            const raw = res.data.questions || "";
            const lines = raw.split('\n').filter(q => q.trim() !== '');
            
            setQuestions(lines);
            
        })
        .catch((err) => console.error(err));
    }, []);
    
    useEffect(() => {

        document.body.style.backgroundColor = '#F3F5F9';

        return () => {
            document.body.style.backgroundColor = '';
        }
    }, []);



    const checkAns = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const res = await axios.post("http://localhost:8000/auth/checkAns", {
            answer: text,
            expected: questions[expectedIndex]
            }, 
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
            }
        )
        
        setCorrect(res.data['correct?: ']);
        if (isCorrect > 0.55 ) {
            setCurrentScore(prev => prev + 1);
            return true;
        } else {
            return false;
        }
        
        } catch (err) {
            console.error("Answer check failed:", err);
            return false
        } finally {
            setIsLoading(false);
        }
    };

    const handlePopup = (currentScore) => {
        const percent = Math.round((currentScore / 12) * 100);
        setScorePercent(percent);
        setShowScorePopup(true);
    }

    const handleNext = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            await axios.post("http://localhost:8000/auth/previousQuestions", {
                question: questions[currentIndex].slice(2),
                answer_text: questions[expectedIndex]
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setText("");
            const result = await checkAns();
            tfList.push(result);

            if (currentIndex < questions.length - 2) {
                setCurrentIndex(currentIndex + 2);
                setExpectedIndex(currentIndex + 2);
            } else {
                alert("Next Complete Suggested Leetcode Problems");
                console.log((currentScore / 12 ) * 100);
                handlePopup(currentScore);
                
                console.log("Uploaded to db");
            }
        } catch (err) {
            console.error("error uploading to db:", err);
        }
    };
        
     
    


    return <>
        <div className="interviewPage">
            <div className="innerDiv">
                <Container>
                    
                    <>
                        <div className="row1c d-flex justify-content-center align-items-center">
                            <Row className='w-100 text-center'>
                                
                                <Col >{questions[currentIndex]}</Col>
                                
                                
                            </Row>
                        </div>
                    </>
                    

                    
                    <div className="row2">
                        <Row>
                            {isLoading ?  (
                                <Col className='text-center'><Spinner animation="border" variant="success" /></Col>
                            ) : (
                                <Col xs={8}><textarea rows={6} cols={60} value={text} onChange={(e) => setText(e.target.value)}  /></Col>

                            )}   
                            
                            {currentIndex === 14 ? (
                                <Col><Button variant='success' id='nextButton' onClick={handleNext}>Done</Button></Col>
                            ) : (
                                <Col><Button variant='success' id='nextButton' onClick={handleNext}>Next</Button></Col>

                            )}
                                
                            
                        </Row>
                    </div>
                </Container>
                
               
            </div>
        </div>

        {showScorePopup && (
            <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-sm" role="document">
                    <div className="modal-content text-center p-4">
                        <h5 className="modal-title mb-3">Your Score</h5>

                        <div className="progress-circle mx-auto mb-3">
                            <svg width="120" height="120">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke="#e6e6e6"
                                    strokeWidth="10"
                                    fill="none"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke={scorePercent >= 60 ? "#198754" : "#dc3545"}  // Bootstrap green/red
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray={Math.PI * 2 * 50}
                                    strokeDashoffset={
                                        Math.PI * 2 * 50 * (1 - scorePercent / 100)
                                    }
                                    strokeLinecap="round"
                                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                                />
                                <text
                                    x="50%"
                                    y="50%"
                                    dominantBaseline="middle"
                                    textAnchor="middle"
                                    fontSize="22"
                                    fontWeight="bold"
                                >
                                    {scorePercent}%
                                </text>
                            </svg>
                        </div>

                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => setShowScorePopup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}

    </>
}

export default Interview;