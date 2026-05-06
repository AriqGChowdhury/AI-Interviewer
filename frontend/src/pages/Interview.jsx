import { ACCESS_TOKEN } from "../constants"
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { helix } from 'ldrs';
import api from '../api';

helix.register();


export function Interview() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [available, setAvailable] = useState(false);
  const [isCorrect, setIsCorrect] = useState([]);
  const hasFetched = useRef(false);


  useEffect(() => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      api.get("questions/",)
      .then((res) => {    
          const raw = res.data.questions || "";
          const lines = raw.split('\n').filter(q => q.trim() !== '');
          setAvailable(true);
          setQuestions(lines);
          setQuestionList(lines.filter((_, i) => i % 2 === 0));
      })
      .catch((err) => console.error(err));
  }, []);
    
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const totalQuestions = questions.length / 2;
  const isLastQuestion = currentIndex === questions.length - 2;
  const isFirstQuestion = currentIndex === 0;
  const progressPercent = ((currentIndex / 2 + 1) / totalQuestions) * 100;

    const checkAns = async (expectedAnswer) => {
      if (!answer.trim()) return false;
      try {
          const token = localStorage.getItem(ACCESS_TOKEN);
          const res = await api.post("checkAns", {
                  answer: answer,
                  expected: expectedAnswer
              }, 
              {headers: {
                  Authorization: `Bearer ${token}`
              }
              }
          )
          const score = res.data.score;
          if (score > 0.50) {
              setCurrentScore(prev => prev + 1);
              setIsCorrect(prev => [...prev, true]);
              return true;
          } 
          setIsCorrect(prev => [...prev, false]);
          return false;
      } catch (err) {
          console.error("Answer check failed:", err);
          return false
      }
    };

    const handleNext = async () => {
      if (!answer.trim()) {
          toast.error("Please provide an answer before continuing.");
          return;
      }
      const correctAnswer = questions[currentIndex + 1];
      const currentQ = questions[currentIndex];
      const userAns = answer;

      const checkPromise = checkAns(correctAnswer);

      if (currentIndex < questions.length - 2) {
        setCurrentIndex(prev => prev + 2);
        setQuestionIndex(prev => prev + 1);
      } else {
        setDone(true);
      }
        
    
      setAnswer("");
      setAnswers(prev => ({ 
          ...prev,
          [currentIndex]: answer
        }));

      const isCorrect2 = await checkPromise;
      const updatedIsCorrect = [...isCorrect, isCorrect2];
      setIsCorrect(updatedIsCorrect);

      if (currentIndex >= questions.length - 2) {
        toast.success("Interview Completed! Great job.")
        setTimeout(() => {
            navigate("/results", {
              state: {
                answers: answers,
                totalQuestions: questions.length / 2,
                score: currentScore,
                questions: questions,
                isCorrect: updatedIsCorrect,
              },
            });
          }, 1500);

        return;
      } 
        
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        await api.post("previousQuestions", {
            question: currentQ,
            answer_text: userAns,
            system_answer: correctAnswer,
            isCorrect: isCorrect2
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });    
      } catch (err) {
          console.error("error uploading to db:", err);
      }

        
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
          const prevIndex = currentIndex - 2;
          setCurrentIndex(prevIndex);
          setQuestionIndex(prev => prev - 1);
          setAnswer(answers[prevIndex] || "");
        }
    };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster />
      {!available && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg p-4 z-50 w-[400px] shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex justify-center">Generating Questions</h2>
            <p className="mt-2 flex justify-center">
              <l-helix size="45" speed="2.5" color="black" ></l-helix>
            </p>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Technical Interview
            </h1>
            <Badge variant="outline" className="text-sm">
              {currentIndex / 2 + 1} / {(questions.length / 2)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <Card className="border-0 shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-xl">
                Question {questionIndex + 1}
              </CardTitle>
              
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-lg text-gray-900 mb-6 leading-relaxed">
                {questions[currentIndex]}
            </p>

            {done && (
                   <div className="fixed inset-0 z-50 flex items-center justify-center">
                   <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
                 
                   <div className="relative bg-white rounded-lg p-4 z-50 w-[400px] shadow-xl">
                     <h2 className="text-xl font-semibold mb-4 flex justify-center">Calculating Score</h2>
                     <p className="mt-2 flex justify-center">
                       <l-helix size="45" speed="2.5" color="black" ></l-helix>
                     </p>
                   </div>
         
                 </div>
            )}

            <div className="space-y-2">
              <label htmlFor="answer" className="text-sm font-medium text-gray-700">
                Your Answer
              </label>
              <Textarea
                id="answer"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <p className="text-sm text-gray-500">
                Take your time and provide a detailed answer
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-1">
            {questionList.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < questionIndex
                    ? "bg-green-500"
                    : index === questionIndex
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLastQuestion ? (
              <>
                Complete
                <CheckCircle2 className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> There are no right or wrong answers. Focus on explaining your
            thought process and demonstrating your understanding of the concepts.
          </p>
        </div>
      </main>

      
    </div>
  );
}

export default Interview;