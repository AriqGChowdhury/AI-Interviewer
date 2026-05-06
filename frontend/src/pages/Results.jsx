import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Trophy, CheckCircle2, Home, RotateCcw, TrendingUp, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";

export function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);

  const answers = location.state?.answers || {};
  const totalQuestions = location.state?.totalQuestions || 12;
  const answeredCount = (Object.keys(answers).length) + 1;
  const completionRate = Math.round(((answeredCount) / (totalQuestions)) * 100);
  const score = location.state?.score || 0;
  const scorePercent = Math.round((score / totalQuestions) * 100);
  const questions = location.state?.questions || [];
  const isCorrect = location.state?.isCorrect || [];

  const getFeedbackMessage = () => {
    if (completionRate === 100) {
      return "Outstanding! You completed all questions. Great job!";
    } else if (completionRate >= 75) {
      return "Well done! You answered most of the questions.";
    } else if (completionRate >= 50) {
      return "Good effort! Keep practicing to improve further.";
    } else {
      return "Keep going! Practice makes perfect.";
    }
  };

  const getPerformanceLevel = () => {
    if (scorePercent === 100) return { level: "Excellent", color: "text-green-600" };
    if (scorePercent >= 75) return { level: "Good", color: "text-blue-600" };
    if (scorePercent >= 50) return { level: "Average", color: "text-yellow-600" };
    return { level: "Needs Improvement", color: "text-orange-600" };
  };

  const performance = getPerformanceLevel();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {showConfetti && scorePercent === 100 && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
          <p className="text-lg text-gray-600">{getFeedbackMessage()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Correct Answers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {score}/{totalQuestions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Score</p>
                  <p className="text-2xl font-bold text-gray-900">{scorePercent}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className={`text-2xl font-bold ${performance.color}`}>
                    {performance.level}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-md mb-6">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completion</span>
                <span className="font-medium text-gray-900">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>
          </CardContent>
        </Card>
        
        {Object.entries(answers).map(([key, value]) => (
            <Card className="border-0 shadow-md mb-6">
            <CardHeader>
                <CardTitle>{questions[key]}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{value}</span>
                    
                </div>
                {isCorrect[key] ? <Progress value={completionRate} className="h-3" indicatorClassName="bg-green-500"/> : <Progress value={completionRate} className="h-3" indicatorClassName="bg-red-500" /> }
                </div>
            </CardContent>
            </Card>
        ))}

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-purple-50 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Review your answers and identify areas for improvement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Practice the suggested Leetcode problems on your home page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>Take another practice interview to track your progress</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigate("/interview")}
            size="lg"
            variant="outline"
            className="gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Take Another Interview
          </Button>
        </div>
      </main>
    </div>
  );
}

export default Results;