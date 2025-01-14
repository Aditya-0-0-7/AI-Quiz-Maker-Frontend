import { useState, useRef } from 'react';
import uploadImage from '../Images/upload-svgrepo-com.svg';
import './viewQuiz.css';
import fileImg from '../Images/file.svg';
import ViewQuizExplorer from './viewQuizExplorer';
import apiCall from '../utilities/apiCall';

function ViewQuiz({setLoading,triggerToast})
{
    const fileInputRefs = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const [fetchedQuiz, setFetchedQuiz] = useState([]);
    const [viewQuizClicked, setViewQuizClicked] = useState(false);
    const [secretCode, setSecretCode] = useState("");

    function uploadClicks(event)
    {
        fileInputRefs.current.click();
    }

    function exploreQuizCancelHandler()
    {
        setViewQuizClicked(false);
        setFetchedQuiz([]);
        setSecretCode("");
        setSelectedFile([]);
    }

    function handleFileChange(event) {
        const file = Array.from(event.target.files);
    
        if (file && file[0].type === 'application/pdf') {
            setSelectedFile(files => [...files, file[0]]);
        } else {
            triggerToast("Please upload a PDF document.");
        }
        event.target.value = '';
    }

    function fileRemoveHandler(index)
    {
        if (fileInputRefs.current) {
            fileInputRefs.current.value = '';
        }
        setSelectedFile(files=>[...files.slice(0,index),...files.slice(index+1)]);
    }

    async function viewQuizHandler()
    {
        try
        {
            setLoading(true);
            const data = new FormData();
            if(secretCode === "" && selectedFile.length === 0)
            {
                triggerToast("Please provide either of the secret code or word file");
                setLoading(false);
                return;
            }
            if(secretCode !== "" && selectedFile.length !== 0)
            {
                triggerToast("Provide one of Either Secret Code or Word File. Both are not allowed.");
                setLoading(false);
                return;
            }
            if(secretCode !== "")
            {
                data.append('secretCode', secretCode);
            }
            if(selectedFile.length !== 0)
            {
                selectedFile.forEach(file => data.append('quizFiles', file));
            }
            const response = await apiCall(process.env.REACT_APP_API_URL+'getQuiz/', 'POST', data);
            if(response.isError)
            {
                triggerToast(response.msg);
            }
            else
            {
                const quiz = response.msg.quiz
                if(secretCode!=="" && quiz.length===0)
                {
                    triggerToast("Can not find Quiz for the secret code provided. Please check your secret code and try again");
                }
                else
                {
                    setFetchedQuiz(quiz)
                    setViewQuizClicked(true);
                }
            }
            setLoading(false);
        }
        catch(error)
        {
            triggerToast("Can not fetch quiz. Some error occured while fetching quiz");
            setLoading(false);
        }
    }
    
    return(
        !viewQuizClicked?
        <section id='joinQuiz'>
            <div id='joinQuizContainerWrapper'>
                <div id='joinQuizContainer'>
                    <div className='viewMsg'>View and Generate using Quiz File</div>
                    <button id='fileUploadBtn' onClick={uploadClicks} className='viewFromFileBtn uploadBtn uploadBtnActive press-button' ><img src={uploadImage} className='uploadImg'/><div className='uploadText'>Upload File</div></button>
                    <div className='filesDisplayContainer' style={selectedFile.length>0?{}:{display:"none"}}>
                        {selectedFile.map((file, index)=>{
                            return(<div className='viewFileContainer' key={index}>
                                <button className='removeFileBtn' onClick={()=>{fileRemoveHandler(index)}}>x</button>
                                <img className='viewFileImg' src={fileImg}/>
                                <div className='viewFileName'><div className='viewFileNameText'>{file.name}</div></div>
                            </div>)
                        })}
                    </div>
                    <div className='viewMsg'>OR</div>
                    <div className='viewMsg'>View using Secret Code</div>
                    <input value={secretCode} onChange={(e)=>{setSecretCode(e.target.value)}} className='joinInput' placeholder='Enter Secret Code'/>
                    <div id='generateBtnHolder'><button className='uploadBtn generateBtn generateBtnActive press-button' onClick={viewQuizHandler}>View Quiz</button></div>
                    <input
                            type="file"
                            ref={fileInputRefs}
                            style={{ display: 'none' }}
                            accept=".pdf"
                            onChange={handleFileChange}
                    />
                </div>
            </div>
        </section>:
        <ViewQuizExplorer fetchedQuiz={fetchedQuiz} exploreQuizCancelHandler={exploreQuizCancelHandler} setLoading={setLoading} triggerToast={triggerToast} secretCode={secretCode}/>
    );
}
export default ViewQuiz;