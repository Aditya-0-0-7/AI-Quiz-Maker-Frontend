import { useState } from "react";
import './viewQuestion.css';
import editQuestionImg from '../Images/editQuestion.svg';
import backImg from '../Images/back-square-svgrepo-com.svg';
function ViewQuestion({question, index, setOpenEditQuestion, setEditQuestionValue, setRemovedQuestions, setQuestions, isRemoved, setEditQuestionIndex})
{
    const [expandQuestion,setExpandQuestion] = useState(false);
    function removeQuestionHandler()
    {
        setQuestions(value=>[...value.slice(0,index),...value.slice(index+1)]);
        setRemovedQuestions(value=>[...value,question]);
    }
    function moveToConfirmHandler()
    {
        setRemovedQuestions(value=>[...value.slice(0,index),...value.slice(index+1)]);
        setQuestions(value=>[...value,question]);
    }
    return(
    <section key={index} className="viewQuestion">
        <div className="viewQuestion-total">
            <div className="viewQuestion-question">
                <div className="viewQuestion-questionText" onClick={()=>{setExpandQuestion(value=>!value)}}>{(index+1)+". "+question['question']}</div>
                {!isRemoved&&<div className="viewQuestion-editQuestionBtn"><img src={editQuestionImg} onClick={()=>{setOpenEditQuestion(true); setEditQuestionValue(question); setEditQuestionIndex(index)}} className="viewQuestion-editQuestionBtnImg"/></div>}
                {!isRemoved&&<button className="viewQuestion-removeQuestionBtn" onClick={removeQuestionHandler}>X</button>}
                {isRemoved&&<div className="viewQuestion-editQuestionBtn"><img src={backImg} onClick={moveToConfirmHandler} className="viewQuestion-editQuestionBtnImg"/></div>}
            </div>
            {expandQuestion&&<div className="expandedContentContainer">
                <div className="expandedContentHeading">Options:</div>
                {question['options'].map((option,index)=>{
                    return(<div key={index} className="expandedContentNonHeading">{(index+1)+". "+option}</div>)
                })}
                <div className="expandedContentHeading">Answer:</div>
                {question['correct_option'].map((option,index)=>{
                    return(<div key={index} className="expandedContentNonHeading">{option+1}</div>)
                })}
                <div className="expandedContentHeading">Difficulty:</div>
                <div className="expandedContentNonHeading">{question['difficulty']}</div>
            </div>}
        </div>
    </section>
    );
}
export default ViewQuestion;