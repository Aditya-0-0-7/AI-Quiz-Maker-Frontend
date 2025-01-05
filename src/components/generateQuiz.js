import './generateQuiz.css';
import { useState } from 'react';
import GenerateSelector from './generateSelector';
import GenerateForm from './generateForm';
function GenerateQuiz({setLoading, triggerToast})
{
    const [generationMethod,setGenerationMethod]=useState(0);
    return(
        <div id='generateQuiz'>
            <GenerateSelector setGenerationMethod={setGenerationMethod} generationMethod={generationMethod} />
            <GenerateForm generationMethod={generationMethod} setLoading={setLoading} triggerToast={triggerToast} />
        </div>
    )
}
export default GenerateQuiz;