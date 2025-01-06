import './viewQuizExplorer.css';
import addQuestionImg from '../Images/addQuestion.svg';
import ViewQuestion from './viewQuestion';
import { useEffect, useState } from 'react';
import AddEditQuestion from './addEditQuestion';
import backImg from '../Images/backHeader.svg';
import apiCall from '../utilities/apiCall';
import InfoPanel from '../utilities/infoPanel';

function ViewQuizExplorer({fetchedQuiz,exploreQuizCancelHandler,setLoading,triggerToast,secretCode})
{
    const [questions, setQuestions] = useState([]);
    const [removedQuestions, setRemovedQuestions] = useState([]);
    const [openAddQuestion, setOpenAddQuestion] = useState(false);
    const [openEditQuestion, setOpenEditQuestion] = useState(false);
    const [editQuestionValue, setEditQuestionValue] = useState({});
    const [editQuestionIndex, setEditQuestionIndex] = useState(-1);
    const [showPanel, setShowPanel] = useState(false)
    const [generateResult, setGenerateResult] = useState({})

    function moveToConfirmAllHandler()
    {
        setRemovedQuestions([]);
        setQuestions(value=>[...value,...removedQuestions]);
    }

    async function saveQuizHandler()
    {
        try
        {
            setLoading(true);
            if(questions.length===0)
            {
                triggerToast("Please provide atleast one question under Confirmed Questions section");
            }
            else
            {
                if(secretCode!=="")
                {
                    const data = {
                        "secretCode": secretCode,
                        "quiz": questions
                    }
                    const response = await apiCall(process.env.REACT_APP_API_URL+'updateQuiz/', 'POST', data);
                    if(response.isError)
                    {
                        triggerToast(response.msg);
                    }
                    else
                    {
                        triggerToast("Quiz has been saved Successfully");
                    }
                }
                else
                {
                    const data = new FormData();
                    data.append('generation_method', 'file');
                    data.append('quiz', JSON.stringify(questions));
                    data.append('num_questions', 10);
                    data.append('difficulty', 'Easy');
                    data.append('multi_correct', false);
                    data.append('language', 'English');
                    const response = await apiCall(process.env.REACT_APP_API_URL+'generateQuiz/', 'POST', data);
                    if(response.isError)
                    {
                        triggerToast(response.msg);
                    }
                    else
                    {
                        triggerToast("Quiz has been Generated Successfully");
                        setGenerateResult({
                            "Secret Code": response.msg['secretCode'],
                            "Share Code": response.msg['shareCode']
                        });
                        setShowPanel(true);
                    }
                }
            }
            setLoading(false);
        }
        catch(error)
        {
            if(secretCode!=="")
                triggerToast("Can not save quiz some error occured while saving");
            else
                triggerToast("Can not generate quiz some error occured while generating");
            setLoading(false);
        }
    }

    async function downloadPDFHandler()
    {
        try
        {
            setLoading(true);
            const data = {
                "quiz": questions
            }
            const response = await apiCall(process.env.REACT_APP_API_URL+'getPDF/', 'POST', data, false);
            if(response.isError)
            {
                triggerToast(response.msg);
            }
            else
            {
                triggerToast("PDF downloading has been started");
            }
            setLoading(false);
        }
        catch(error)
        {
            triggerToast("Can not download PDF file, some error occured while downloading");
            setLoading(false);
        }
    }

    useEffect(()=>{
        setQuestions(fetchedQuiz);
        setRemovedQuestions([]);
    },[]);

    return(
        <section id='viewQuizScreen'>
            {showPanel&&<InfoPanel setShowPanel={setShowPanel} data={generateResult} note={"Note: Do not share the Secret Code with anyone. Only the Share Code should be provided to participants. The Secret Code grants admin privileges for the quiz and must be kept confidential."} triggerToast={triggerToast}/>}
            <div className='viewQuizContainers'>
                <div className='viewQuizHeading'>Confirmed Questions</div>
                <section className='quizQuestions'>
                    <div className='quizQuestionsHeader'>
                        <button className='addQuestionImgBtn press-button-general' onClick={()=>{setOpenAddQuestion(value=>!value)}}><img src={addQuestionImg} className='addQuestionImg' /></button>
                    </div>
                    <div className='quizQuestionsContainer'>
                        {questions.length>0?
                            questions.map((question, index)=>{
                                return(<ViewQuestion question={question} index={index} setOpenEditQuestion={setOpenEditQuestion} setEditQuestionValue={setEditQuestionValue} setRemovedQuestions={setRemovedQuestions} setQuestions={setQuestions} isRemoved={false} setEditQuestionIndex={setEditQuestionIndex}/>)
                            }):
                            <div className='displayMsg'>No Questions to display</div>
                        }
                    </div>
                </section>
            </div>
            <div className='viewQuizContainers'>
                <div className='viewQuizHeading'>Removed Questions</div>
                <section className='quizQuestions'>
                    <div className='quizQuestionsHeader'>
                        <button className='addQuestionImgBtn press-button-general' onClick={moveToConfirmAllHandler}><img src={backImg} className='addQuestionImg extra' /></button>
                    </div>
                    <div className='quizQuestionsContainer'>
                        {removedQuestions.length>0?
                            removedQuestions.map((question, index)=>{
                                return(<ViewQuestion question={question} index={index} setOpenEditQuestion={setOpenEditQuestion} setEditQuestionValue={setEditQuestionValue} setRemovedQuestions={setRemovedQuestions} setQuestions={setQuestions} isRemoved={true} setEditQuestionIndex={setEditQuestionIndex} />)
                            }):
                            <div className='displayMsg'>No Questions to display</div>
                        }
                    </div>
                </section>
            </div>
            <div className='viewQuizBtns'>
                <div className='cancelBtnContainer'>
                    <button className='commonBtn cancelViewBtn press-button-general' onClick={()=>{exploreQuizCancelHandler()}} >Cancel</button>
                </div>
                <div className='downloadAndGenerateBtnContainer'>
                    <button className='commonBtn downloadPDFBtn press-button-general' onClick={()=>{downloadPDFHandler()}} >Download PDF</button>
                    <button className='commonBtn saveViewBtn press-button-general' onClick={saveQuizHandler}>{secretCode===""?"Generate Quiz":"Save Quiz"}</button>
                </div>
            </div>
            {openAddQuestion&&<AddEditQuestion setOpenAddQuestion={setOpenAddQuestion} setOpenEditQuestion={setOpenEditQuestion} question={""} setQuestions={setQuestions} editQuestionIndex={editQuestionIndex} />}
            {openEditQuestion&&<AddEditQuestion setOpenAddQuestion={setOpenAddQuestion} setOpenEditQuestion={setOpenEditQuestion} question={editQuestionValue} setQuestions={setQuestions} editQuestionIndex={editQuestionIndex} />}
        </section>
    );
}
export default ViewQuizExplorer;