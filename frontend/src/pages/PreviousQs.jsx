import axios from "axios";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import '../styles/PreviousQs.css'

function PreviousQs({ prevQs }) {
    useEffect(() => {
        if (prevQs.length >= 50) {
            const token = localStorage.getItem(ACCESS_TOKEN);
            axios.delete("http://localhost:8000/auth/clearPrevQs", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                console.log("Deleted", res.data);
            })
            .catch((err) => console.error(err));
        }
    }, [prevQs]);


   


    return <div className="prev">
        
        {prevQs &&  prevQs.length > 0 ? (
            <>
            <p>Previous Questions</p>
            {prevQs.map((q, index) => (
                <p key={index}>{index + 1} {q.question}</p>
            ))}
            </>
        ) : (
            <p id='noPrev'>No Previous Questions Yet!</p>
        )}
    </div>
}

export default PreviousQs;