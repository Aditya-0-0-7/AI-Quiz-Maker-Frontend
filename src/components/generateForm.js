import './generateForm.css';
import { useRef, useState } from 'react';
import formImage from '../Images/generateImage.png';
import formImage1 from '../Images/generateImage1.png';
import formImage2 from '../Images/generateImage2.png';
import uploadImage from '../Images/upload-svgrepo-com.svg';
import viewImage from '../Images/imageLogo.svg';
import apiCall from '../utilities/apiCall';
import InfoPanel from '../utilities/infoPanel';

function GenerateForm({generationMethod, setLoading, triggerToast})
{
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState([]);
    const [openViewImage,setViewImageValue] = useState(false);
    const [topic, setTopic] = useState("")
    const [text, setText] = useState("")
    const [numQues, setNumQues] = useState(10)
    const [difficulty, setDifficulty] = useState("Easy")
    const [multiCorrect, setMultiCorrect] = useState(false)
    const [language, setLanguage] = useState("")
    const [showPanel, setShowPanel] = useState(false)
    const [generateResult, setGenerateResult] = useState({})
    const [imageLang, setImageLang] = useState("");

    function uploadClick(event)
    {
        event.preventDefault();
        fileInputRef.current.click();
    }

    function viewImageHandler(event)
    {
        event.preventDefault();
        setViewImageValue(value=>!value);
    }

    function removeImageHandler(index)
    {
        setSelectedImage(images=>[...images.slice(0,index),...images.slice(index+1)]);
    }

    function handleFileChange(event)
    {
        Array.from(event.target.files).forEach(file => {
            if (file && file.type.startsWith('image/'))
            {
                setSelectedImage(images=>[...images,file]);
            }
            else
            {
                triggerToast("Please select an image file.");
            }
        });
        event.target.value = '';
    };

    async function generateQuizHandler()
    {
        try
        {
            setLoading(true);
            const data = new FormData();

            if(generationMethod === 0)
            {
                data.append('generation_method', "topic");
                data.append('topic', topic);
            }
            else if(generationMethod === 1)
            {
                data.append('generation_method', "image");
                if(imageLang === "English")
                {
                    data.append('language_img', "eng")
                }
                else if(imageLang === "Hindi")
                {
                    data.append('language_img', "hin")
                }
                else if(imageLang === "Both Hindi and English")
                {
                    data.append('language_img', "hin+eng")
                }
                selectedImage.forEach(image => data.append('images', image));
            }
            else if(generationMethod === 2)
            {
                data.append('generation_method', "text");
                data.append('text', text);
            }
            data.append('num_questions', numQues);
            data.append('difficulty', difficulty);
            data.append('multi_correct', multiCorrect);
            data.append('language', language);
            const response = await apiCall(process.env.REACT_APP_API_URL+'generateQuiz/', 'POST', data);
            if(response.isError)
                triggerToast(response.msg);
            else
            {
                triggerToast("Quiz has been generated Successfully");
                setGenerateResult({
                    "Secret Code": response.msg['secretCode'],
                    "Share Code": response.msg['shareCode']
                });
                setShowPanel(true);
            }
            setLoading(false);
        }
        catch(error)
        {
            triggerToast("Can not generate quiz some error occured while generating");
            setLoading(false);
        }
    }

    return(
        <section id='generateForm'>
            <div id='formImageContainer'>
                <img className='formImage' src={formImage}/>
                <img className='formImage' src={formImage1}/>
                <img className='formImage' src={formImage2}/>
            </div>
            <div id='formHolder'>
                <form id='formContent' onSubmit={(event)=>{event.preventDefault()}}>
                    {showPanel&&<InfoPanel setShowPanel={setShowPanel} data={generateResult} note={"Note: Do not share the Secret Code with anyone. Only the Share Code should be provided to participants. The Secret Code grants admin privileges for the quiz and must be kept confidential."} triggerToast={triggerToast}/>}
                    {generationMethod===1&&<div id='uploadContainer'>
                        <button id='imageUploadBtn' className='uploadBtn uploadBtnActive press-button' onClick={uploadClick}><img src={uploadImage} className='uploadImg'/><div className='uploadText'>Upload Image</div></button>
                        <button id='viewImageBtn' style={{marginTop:'5%'}} className='uploadBtn uploadBtnActive press-button' onClick={viewImageHandler}><img src={viewImage} className='uploadImg'/><div className='uploadText'>View Images</div></button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {openViewImage&&<div id='imageDisplayHolder'>
                            <div id='imageDisplayContainerOuter'>
                                <div id='displayContainerHeader'><div className='crossHover' style={{cursor:'pointer'}} onClick={()=>{setViewImageValue(value=>!value)}}>X</div></div>
                                <div id='imageDisplayContainer'>
                                    {selectedImage.length===0?<div id='noImage'>No Images to Display</div>
                                    :selectedImage.map((image,index)=>{
                                        return(
                                            <div id='imageChip' key={index}>
                                                <div id='removeImageBtn' className='crossHover' onClick={()=>{removeImageHandler(index)}}>X</div>
                                                <div id='removeImageText'>{image.name}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>}
                    </div>}

                    <div id='formData'>
                        {generationMethod===0&&<label className='generateLabel' for='topic'>Topic</label>}
                        {generationMethod===0&&<input id='topic' className='generateInput' type='text' value={topic} onChange={(e)=>{setTopic(e.target.value)}}/>}
                        {generationMethod===2&&<label className='generateLabel' for='text'>Text</label>}
                        {generationMethod===2&&<textarea id='text' className='generateInput fromText' type='text' value={text} onChange={(e) => setText(e.target.value)}/>}
                        {generationMethod===1&&<label className='generateLabel' for='text'>Image Text Language</label>}
                        {generationMethod===1&&
                        <select id='imageLang' className='generateInput' value={imageLang} onChange={(e)=> setImageLang(e.target.value)}>
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Both Hindi and English</option>
                        </select>}   
                        <label className='generateLabel' for='numQues'>Number Of Questions</label>
                        <input id='numQues' className='generateInput' type='number' min='10' max='30' value={numQues} onChange={(e) => setNumQues(parseInt(e.target.value))}/>
                        <label className='generateLabel' for='difficulty'>Difficulty of Questions</label>
                        <select id='difficulty' className='generateInput' value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                            <option>Mixed</option>
                        </select>
                        <div className='checkBoxHolder'>
                            <label className='generateLabel' for='multiCorrect'>Multi Correct Allowed</label>
                            <input id='multiCorrect' className='checkbox' type='checkbox' checked={multiCorrect} onChange={(e) => setMultiCorrect(e.target.checked)}/>
                        </div>
                        <label className='generateLabel' for='language'>Language of Generation</label>
                        <input id='language' className='generateInput' type='text' value={language} onChange={(e) => setLanguage(e.target.value)}/>
                        <div id='generateBtnHolder'><button className='uploadBtn generateBtn generateBtnActive press-button' onClick={generateQuizHandler}>Generate Quiz</button></div>
                    </div>
                </form>
            </div>
        </section>
    )
}
export default GenerateForm;