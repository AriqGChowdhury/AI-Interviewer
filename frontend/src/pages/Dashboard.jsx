import api from '../api';
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { PlayCircle, Trash2, Plus, Clock, Code, TrendingUp } from "lucide-react";
import { ACCESS_TOKEN } from '../constants';
import { IoIosArrowRoundForward } from 'react-icons/io';
import '../styles/tailwind.css';


function Dashboard() {
    const removingRef = useRef(false);
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
    const [newTodo, setNewTodo] = useState("");
    const [prevQs, setPrevQs] = useState([]);
    

    //Get to-dos
    useEffect(() => {
        const storedTodos = localStorage.getItem("todos");
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
                setMaxDisplayCount(4);
            } 
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        
    }, []);


    // get stored previous questions
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            api.get('previousQuestions')
            .then(res => {
                setPrevQs(res.data); 
            })
            .catch(err => console.log(err))
        }
        
    }, []);
    
    const hasFetched = useRef(false);
    //Get leetcode problems
    useEffect(() => {
        console.log("1");
        if (hasFetched.current) return;
        hasFetched.current = true;
        const stored = JSON.parse(localStorage.getItem('leetcodeQs'));
        if (stored && stored.length > 0) {
            setLeetcodeQ(stored);
            console.log("2");
            console.log("STORED: ", stored);            
            return;
        }

        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            console.log("nO TOKEN");
            return;
        }

        api.get("leetcodeQs/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
          .then((res) => {
            const raw = res.data.questions || "";
            const lines = raw.split('\n').filter(s => s.trim() !== '');
      
            const parsedQuestions = [];
            let current = {};
      
            lines.forEach(line => {
              const trimmed = line.trim();
      
              if (trimmed.startsWith("Type:")) {
                if (Object.keys(current).length > 0) {
                  parsedQuestions.push(current);
                  current = {};
                }
                current.type = trimmed.replace("Type:", "").trim();
      
              } else if (trimmed.startsWith("Link:")) {
                current.link = trimmed.replace("Link:", "").trim();
      
              } else if (trimmed.startsWith("Problem:")) {
                current.question = trimmed.replace("Problem:", "").trim();
      
              } else if (trimmed.startsWith("Difficulty:")) {
                current.difficulty = trimmed.replace("Difficulty:", "").trim();
                current.difficulty = current.difficulty.replace('.', '');
              }
            });
      
            // push last object
            if (Object.keys(current).length > 0) {
              parsedQuestions.push(current);
            }
      
            setLeetcodeQ(parsedQuestions);
            localStorage.setItem('leetcodeQs', JSON.stringify(parsedQuestions));
          })
          .catch((err) => console.error(err));
      }, []);

    //To do list
    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem("todos", JSON.stringify(todos));
        }
    }, [todos, hasLoaded]);
    

    const handleAddTodo = () => {
        if (newTodo.trim()) {
            setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
            setNewTodo("");
        }
    };

    const handleDeleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };


    // removes a single leetcode problem from the dashboard and adds a new one
    const removeLC = async (index) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            return;
        }
        const removeQ = JSON.parse(localStorage.getItem('leetcodeQs')) || [];
        const problem = removeQ[index];
        try { 
            await api.post('logLeetcode', 
                {
                    'question': problem.question,
                    'link': problem.link 
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            const updated = removeQ.filter((_, i) => i !== index);
            
           
            localStorage.setItem('leetcodeQs', JSON.stringify(updated));
            setLeetcodeQ(updated);

            const res = await api.get("1/leetcodeQs/",{headers: {
                Authorization: `Bearer ${token}`
            }});

            const raw = res.data.questions || "";
            const lines = raw.split('\n').filter(s => s.trim() !== '');
        
            const parsedQuestions = [];
            let current = {};
        
            lines.forEach(line => {
                const trimmed = line.trim();
        
                if (trimmed.startsWith("Type:")) {
                    if (Object.keys(current).length > 0) {
                    parsedQuestions.push(current);
                    current = {};
                    }
                    current.type = trimmed.replace("Type:", "").trim();
        
                } else if (trimmed.startsWith("Link:")) {
                    current.link = trimmed.replace("Link:", "").trim();
        
                } else if (trimmed.startsWith("Problem:")) {
                    current.question = trimmed.replace("Problem:", "").trim();
        
                } else if (trimmed.startsWith("Difficulty:")) {
                    current.difficulty = trimmed.replace("Difficulty:", "").trim();
                    current.difficulty = current.difficulty.replace('.', '');
                }
            });
        
            // push last object
            if (Object.keys(current).length > 0) {
                parsedQuestions.push(current);
            }
        
            const existing = JSON.parse(localStorage.getItem('leetcodeQs')) || [];
            const updated2 = [...existing, ...parsedQuestions];
            setLeetcodeQ(updated2);

            localStorage.setItem('leetcodeQs', JSON.stringify(updated2));
            } catch(err) {
                console.log(err);
            } finally {
                removingRef.current = false;
            }

    };

    //see all stored previous questions
    // see correct answer if your answer was wrong
    const handleSeeMore = () => {
        navigate('/prevQs');
    }

    const handleToggleTodo = (id) => {
        setTodos(
        todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
        );
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
          case "Easy":
            return "bg-green-100 text-green-700 hover:bg-green-200";
          case "Medium":
            return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
          case "Hard":
            return "bg-red-100 text-red-700 hover:bg-red-200";
          default:
            return "bg-gray-100 text-gray-700 hover:bg-gray-200";
        }
    };

    
    // get user
    useEffect(() => {
        getUser();
    }, [])
    const getUser = () => {
        api
        .get('login')
        .then((res) => res.data)
        .then((data) => {setUser(data); console.log(data)})
        .catch((err) => alert(err))
    };

    return (
        <>
        <div className="min-h-screen flex flex-col bg-gray-50">
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="lg:col-span-2 border-0 shadow-md">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Code className="w-6 h-6" />
                                </div>
                            <div>
                                <CardTitle>Ready to take your interview?</CardTitle>
                                <CardDescription className="text-blue-50">
                                    Practice with AI-powered technical questions
                                </CardDescription>
                            </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <p className="text-gray-600 mb-6">
                            Should only take around 30-45 minutes! Total of 12 Technical questions and it is
                            recommended to complete the 3 Leetcode Problems.
                        </p>
                        <Button
                            onClick={() => navigate("/interview")}
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                    <PlayCircle className="w-5 h-5 mr-2" />
                    Start Interview
                    </Button>
                      </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        To-Do List
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                        placeholder="Add a new task..."
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
                        />
                        <Button onClick={handleAddTodo} size="icon" className="shrink-0">
                        <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className='space-y-2 max-h-64 overflow-y-auto'>
                    {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleTodo(todo.id)}
                        />
                        <span
                        className={`flex-1 text-sm ${
                            todo.completed ? "line-through text-gray-400" : "text-gray-700"
                        }`}
                        >
                        {todo.text}
                        </span>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                        <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Previous Questions
                </CardTitle>
                <CardDescription>Review your recent interview questions</CardDescription>
                </CardHeader>
                <CardContent>
                {prevQs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No Previous Questions Yet!</p>
                ) : (
                    <div className="space-y-3">
                    {prevQs.slice(0,maxDisplayCount).map((q, index) => (
                        <div
                        key={q.id}
                        className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer"
                        >
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                            </span>
                            <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{q.question}</p>
                            <p className="text-xs text-gray-500 mt-1">{q.date}</p>
                            </div>
                        </div>
                        </div>
                    ))}
                    <div className="flex justify-end mt-4">
                        <Button 
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white "
                        onClick={handleSeeMore}
                        >
                            See More <IoIosArrowRoundForward />
                        </Button>
                    </div>
                    </div>
                )}
                </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-green-600" />
                    Today's Suggested Leetcode Problems
                </CardTitle>
                <CardDescription>Practice these problems to improve your skills</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                    {leetcodeQ.slice(0,maxDisplayCount).map((problem, index) => (
                    <a
                        key={problem.id}
                        href={problem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                    >
                        <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{problem.question}</span>
                        </div>
                        
                        <button
                            className='px-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm'
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeLC(index);
                            }}
                        >
                            X
                        </button>
                        
                        <Badge className={getDifficultyColor(problem.difficulty)}>
                            {problem.difficulty}
                        </Badge>
                        </div>
                    </a>
                    ))}
                </div>
                </CardContent>
            </Card>
            </div>
        </main>
        </div>
        </>
    )
    
}

export default Dashboard;





