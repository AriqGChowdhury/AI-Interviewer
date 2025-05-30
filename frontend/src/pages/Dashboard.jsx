
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import api from '../api';
import '../styles/Dashboard.css'
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import interviewImage from '../assets/readyInterview.png';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

function Dashboard({ prevQs, setPrevQs }) {
    const navigate = useNavigate();
    useEffect(() => {
        document.body.style.backgroundColor = '#F3F5F9';

        return () => {
            document.body.style.backgroundColor = '';
        }
    }, []);
    const [user, setUser] = useState([]);
    const [todos, setTodos] = useState([]);
    const [todoText, setTodoText] = useState("");
    const [hasLoaded, setHasLoaded] = useState(false);
    const [leetcodeQ, setLeetcodeQ] = useState([]);
    const [maxDisplayCount, setMaxDisplayCount] = useState(5);

    useEffect(() => {
        const storedTodos = localStorage.getItem("todos");
        console.log("loaded todos", storedTodos);
        if (storedTodos) {
            try {
                setTodos(JSON.parse(storedTodos));
            } catch (err) {
                console.error("Error parsing stored ", err);
                setTodos([]);
            }
            
        }
        setHasLoaded(true);
    }, []);

    //Display previous questions
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) {
                setMaxDisplayCount(2);
            } else {
                setMaxDisplayCount(5);
            } 
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        
    }, []);

    //Get leetcode problems
    useEffect(() => {
        axios.get("http://localhost:8000/auth/leetcodeQs/")
        .then((res) => {
            console.log("raw: ", res);
            const raw = res.data.questions || "";
            const lines = raw.split('\n').filter(s => s.trim() !== '');
            console.log("raw after: ", raw);
            console.log("lines: ", lines);
            const parsedQuestions = [];
            let current = {};

            lines.forEach(line => {
                const trimmed = line.trim();
                
                if (trimmed.startsWith("**Type:")) {
                    if (Object.keys(current).length > 0) {
                        parsedQuestions.push(current);
                        current = {};
                    }
                    current.type = trimmed.replace("**Type:", "").replace("**", "").trim();
                } else if (trimmed.startsWith("**Link:")) {
                    current.link = trimmed.replace("**Link:", "").replace("**", "").trim();
                } else if (trimmed.startsWith("**Problem:")) {
                    current.question = trimmed.replace("**Problem:", "").replace("**", "").trim();
                }
             
                console.log("trimmed: ", trimmed);
                parsedQuestions.push(trimmed.replace("Link:", ""));
                setLeetcodeQ(parsedQuestions);
            });

            

        
        })
        .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        console.log("leetcode: ", leetcodeQ);
        
    }, [leetcodeQ]);

    //To do list
    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    }, [todos, hasLoaded]);
    
    const onChangeBox = item => {
        const updatedTodos = todos.map((el) => 
        el.id === item.id ? { ...el, done: !el.done } : el);
        setTodos(updatedTodos);
    };

    const handleDel = item => {
        const updatedTodos = todos.filter((el) => el.id !== item.id);
        setTodos(updatedTodos);
    };

    const onChangeInput = e => {
        setTodoText(e.target.value);
    };

    const onSubmitTodo = () => {
        if  (todoText.trim() === "") return;
        const newTodo = {
            id: todos.length + 1,
            name: todoText,
            done: false,
        };
        setTodos([...todos, newTodo]);
        setTodoText("");

    };

    

    useEffect(() => {
        getUser();
    }, [])

    const getUser = () => {
        api
        .get('auth/login')
        .then((res) => res.data)
        .then((data) => {setUser(data); console.log(data)})
        .catch((err) => alert(err))
    };

    const handleClickQuestion = async (question, link) => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            await axios.post("http://localhost:8000/auth/logLeetcode", {
                question,
                link
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            window.open(link, '_blank'); 
        } catch (err) {
            console.error("Error logging clicked question:", err);
        }
    };

   

    return (
        <>
        <div className="takeInterview">
            
            <div className="innerDiv">
                <div className="imageContainerDash">
                    <img width={150} src={interviewImage} className='interviewImg'/>
                </div>
                <div className="rightContainerDash">
                    <p id='readyText'>Ready to take your interview? <br /></p>
                    <div className="interviewDesc">
                        Should only take around <b>30-45 minutes!</b> Total of <b>12 Technical questions</b> and it is recommended to complete the <b>3 Leetcode Problems</b>.
                    </div>
                    
                    <div className="buttonDiv">
                        <Button onClick={() => navigate("/interview")} variant="success" className='w-100'>Start</Button>
                    </div>   
                    
                    
                </div>
            </div>
                
            
        </div>
        <div className="prev-leet">
            <div className="prevQuestions">
                <div className="innerDivPrev">
                    {prevQs &&  prevQs.length > 0 ? (
                        <>
                        {prevQs.slice(0,maxDisplayCount).map((q, index) => (
                            <p key={index}>{index + 1} {q.question}</p>
                        ))}
                        <p><Button onClick={() => navigate("/prevQs")} variant="success">See all</Button></p> 
                        </>
                    ) : (
                        <p id='noPrev'>No Previous Questions Yet!</p>
                    )}

                </div>
            </div>
            <div className="leetcodeProbs">
                <div className="innerDiv3">
                    <p>Todays Suggested Leetcode Problems</p>
                    {leetcodeQ.length > 0 ? (
                    leetcodeQ.map((s, index) => (
                        (index === 2 || index === 5 || index === 8) && (
                            <div key={index}>
                            <p>{Math.floor(index / 3) + 1}. <a onClick={(e) => {
                                e.preventDefault();
                                handleClickQuestion(s, leetcodeQ[index - 1]);
                            }} href='#'><strong>{s}</strong></a></p>
                            
                            
                            <hr />
                            </div>
                        )
                        
                    ))
                    ) : (
                    <p id='noPrev'>No Leetcode Questions yet!</p>
                    )}
                </div>
            </div>

        </div>
        







        <div className="todo">
            <div className="innerDiv4">
                <p>To-Do</p>
                
                <input value={todoText} onChange={onChangeInput} placeholder='Add task'/>
                <Button onClick={onSubmitTodo} className='addButton' variant='success'>Add</Button>
                <ul>
                    {todos.map((item) => (
                        <li
                            key={item.id}
                            style={{ textDecoration: item.done ? "line-through" : "none" }}
                        >
                            <input
                                type='checkbox'
                                checked={item.done}
                                onChange={() => onChangeBox(item)}
                            />{" "}
                            {item.name}
                            <Button onClick={() => handleDel(item)} variant='danger' className='deleteButton'>Delete</Button>
                        </li>
                    ))}
                </ul>
            </div>
            

        </div>
        </>
    )
    
}

export default Dashboard;





