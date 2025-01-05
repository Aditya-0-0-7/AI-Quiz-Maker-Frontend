import { useEffect, useState } from 'react';
import ScoreTable from './scoreTable';
import './quizPlay.css';
function QuizPlay({images,questions,quizTime,finishQuizHandler,assignedQuizMode,setLoading,triggerToast,submitQuizHandler,isQuizSubmitted,scoreList})
{
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [confirmSelectedAnswers, setConfirmSelectedAnswers] = useState({});
    const [isStart, setIsStart] = useState(false);
    const [timer, setTimer] = useState(parseInt(quizTime,10)>0?parseInt(quizTime,10):-1);

    function selectOptionHandler(index)
    {
        if(!questions[currentQuestionIndex]["multi_correct"])
        {
            setSelectedAnswers(value=>{
                let newValue = {...value};
                newValue[`${currentQuestionIndex}`] = index;
                return(newValue);
            });
        }
        else
        {
            setSelectedAnswers(value=>{
                let newValue = {...value};
                if(`${currentQuestionIndex}` in newValue)
                {
                    if(`${index}` in newValue[`${currentQuestionIndex}`])
                        newValue[`${currentQuestionIndex}`][index] = !newValue[`${currentQuestionIndex}`][index];
                    else
                        newValue[`${currentQuestionIndex}`][index] = true;
                }
                else
                    newValue[`${currentQuestionIndex}`] = {[index]: true};
                return(newValue);
            });
        }
    }

    function confirmOptionHandler()
    {
        if(`${currentQuestionIndex}` in selectedAnswers)
        {
            setIsStart(true);
            setConfirmSelectedAnswers(value=>{
                let newValue = {...value};
                newValue[`${currentQuestionIndex}`] = selectedAnswers[`${currentQuestionIndex}`];
                return(newValue);
            });
        }
        else
        {
            triggerToast("Please select any option for the question before confirming");
        }
    }

    function skipHandler()
    {
        if(`${currentQuestionIndex}` in confirmSelectedAnswers)
        {
            setIsStart(true);
            setConfirmSelectedAnswers(value=>{
                let newValue = {...value};
                delete newValue[`${currentQuestionIndex}`];
                return(newValue);
            });
        }
        else
        {
            changeQuestionHelper();
        }
    }

    function changeQuestionHelper()
    {
        if(Object.keys(confirmSelectedAnswers).length==questions.length)
        {
            triggerToast("You have answered all the questions. You can now submit the quiz");
        }
        else
        {
            if(currentQuestionIndex==questions.length-1)
            {
                let indexes = Object.keys(confirmSelectedAnswers);
                indexes.sort();
                let i=0;
                for(;i<indexes.length;i++)
                {
                    if(i!=indexes[i])
                    {
                        break;
                    }
                }
                setCurrentQuestionIndex(i);
            }
            else
            {
                setCurrentQuestionIndex(value=>value+1);
            }
        }
    }

    useEffect(()=>{
        if(isStart)
            changeQuestionHelper();
    },[confirmSelectedAnswers]);

    useEffect(()=>{
        if(!isQuizSubmitted&&(assignedQuizMode=="Play"||assignedQuizMode==""))
        {
            if (timer > 0) {
                const interval = setTimeout(() => {
                setTimer((prevTime) => prevTime - 1); // Decrease time by 1 second
                }, 60000);
        
                // Cleanup interval on component unmount
                return () => clearInterval(interval);
            }
            else if(timer == 0)
            {
                submitQuizHandler(confirmSelectedAnswers);
            }
        }
    },[timer]);

    return(!isQuizSubmitted&&(assignedQuizMode=="Play"||assignedQuizMode=="")?
    <section className="quizPlayScreen">
        <section className='questionSelectorPanel'>
            <div className='questionSelectorPanelInner'>
                {questions.map((question,index)=>{
                    return(<div key={index} onClick={()=>{setCurrentQuestionIndex(index)}} className={currentQuestionIndex==index?'questionSelector currentQuestion':(`${index}` in confirmSelectedAnswers?'questionSelector answeredQuestion':'questionSelector')}>{index+1}</div>);
                })}
            </div>
        </section>
        <section className='questionScreen'>
            <div className='displayQuestionHeader'>
                <div className='questionHeaderLeft'>
                    <div className='difficultyTag' style={{color:(questions[currentQuestionIndex]['difficulty'] == "Easy"?"green":questions[currentQuestionIndex]['difficulty'] == "Medium"?"orange":"red")}}>{questions[currentQuestionIndex]['difficulty']}</div>
                </div>
                <div className='questionHeaderRight'>
                    {timer>0&&<div className='timer'>{((timer/60)>=1?((timer/60)>9?Math.floor(timer/60):"0"+Math.floor(timer/60)):"00") + ":" + (timer%60<=9?"0"+(timer%60):timer%60)}</div>}
                    <button className='commonBtn press-button-general submitQuizBtn' onClick={()=>{submitQuizHandler(confirmSelectedAnswers)}}>Submit</button>
                </div>
            </div>
            <div className='displayQuestionOption'>
                <div className='questionDisplay'>Question: {questions[currentQuestionIndex]['question']}</div>
                {questions[currentQuestionIndex]['options'].map((option, index)=>{
                    if(questions[currentQuestionIndex]["multi_correct"])
                        return(<div key={index} onClick={()=>{selectOptionHandler(index)}} className={`${currentQuestionIndex}` in selectedAnswers && `${index}` in selectedAnswers[`${currentQuestionIndex}`] && selectedAnswers[`${currentQuestionIndex}`][`${index}`] ?'optionDisplaySelected':'optionDisplay'}>{(index+1)+". "+option}</div>)
                    else
                        return(<div key={index} onClick={()=>{selectOptionHandler(index)}} className={`${currentQuestionIndex}` in selectedAnswers && selectedAnswers[`${currentQuestionIndex}`] == index?'optionDisplaySelected':'optionDisplay'}>{(index+1)+". "+option}</div>)
                })}
            </div>
            <div className='displayQuestionBtns'>
                <button className='commonBtn press-button-general skipQuestionBtn' onClick={skipHandler}>Skip</button>
                <button className='commonBtn press-button-general confirmQuestionBtn' onClick={confirmOptionHandler}>Confirm</button>
            </div>
        </section>
    </section>
    :
    <ScoreTable images={images} scoreList = {scoreList} finishQuizHandler = {finishQuizHandler} assignedQuizMode = {assignedQuizMode}/>)
}
export default QuizPlay;