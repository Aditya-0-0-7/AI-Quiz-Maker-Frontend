import './generateSelector.css';
function GenerateSelector({setGenerationMethod, generationMethod})
{
    return(
        <section id='selectorHolder'>
            <div id='selectorContainer'>
                <div onClick={()=>{setGenerationMethod(0)}} className={generationMethod==0?'selectorOption selectorOptionSelected':'selectorOption selectorOptionUnselected'}>
                    By Topic
                </div>
                <div onClick={()=>{setGenerationMethod(1)}} className={generationMethod==1?'selectorOption selectorOptionSelected':'selectorOption selectorOptionUnselected'}>
                    By Image
                </div>
                <div onClick={()=>{setGenerationMethod(2)}} className={generationMethod==2?'selectorOption selectorOptionSelected':'selectorOption selectorOptionUnselected'}>
                    By Text
                </div>
            </div> 
        </section>
    )
}
export default GenerateSelector;