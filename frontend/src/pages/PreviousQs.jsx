import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import '../styles/PreviousQs.css'
import api from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CircleQuestionMark } from 'lucide-react';


function PreviousQs() {
    const [prevQs, setPrevQs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            api.get('previousQuestions')
            .then(res => setPrevQs(res.data))
            .catch(err => console.log(err))
        }
        
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);
    
    const ixLast = currentPage * itemsPerPage;
    const ixFirst = ixLast - itemsPerPage;
    const currentItems = prevQs.slice(ixFirst, ixLast);
    const totalPages = Math.ceil(prevQs.length / itemsPerPage);

    return (
        <>
        <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4">
            <CircleQuestionMark className="w-10 h-10 text-white" /> 
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Question History</h1>
        </div>
        <div className="prev">
            {prevQs &&  prevQs.length > 0 ? (
                <>
                {currentItems.map((q, index) => (
                    <Card className="border-0 shadow-md mb-6">
                    <CardHeader>
                        <CardTitle key={index}>{q.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{q.answer_text}</span>
                            
                        </div>
                        
                        
                        {!q.isCorrect && (
                            <p className="text-xs text-gray-500">
                            Correct Answer: <span className="text-gray-800">{q.system_answer.replace(/^[A-Za-z]\.\s*/, '')}</span>
                            </p>
                        )}
                        <div className="flex justify-end mt-4">
                            {q.isCorrect === true ? (
                            <div className="bg-green-100 px-3 py-1 rounded-md">
                                <p className="text-green-600 text-xs">Correct</p>
                            </div> ) : (
                            <div className="bg-red-100 px-3 py-1 rounded-md">
                                <p className="text-red-600 text-xs">Incorrect</p>
                            </div>
                            )}
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                ))}
                </>
            ) : (
                <p id='noPrev'>No Previous Questions Yet!</p>
            )}

            
        </div>
        <div className="flex justify-center mt-6 gap-2">
            <button
                onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                   
                }}
                disabled={currentPage === 1}
                className="rounded px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
            >
                Prev
            </button>

            <span className="px-3 py-1 text-sm">
                <strong>Page {currentPage} of {totalPages}</strong>
            </span>

            <button
                onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    
                }}
                disabled={currentPage === totalPages}
                className="rounded px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
            >
                Next
            </button>
        </div>
        </main>
        </div>
        </>
    )
}


export default PreviousQs;