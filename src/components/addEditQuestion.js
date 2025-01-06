import { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import './addEditQuestion.css';

const animatedComponents = makeAnimated();

function AddEditQuestion({setOpenAddQuestion, setOpenEditQuestion, question, setQuestions, editQuestionIndex})
{
    const [addedOptions, setAddedOptions] = useState([]);
    const [optionValue, setOptionValue] = useState('');
    const [selectOptions, setSelectOptions] = useState([]);
    const [questionValue, setQuestionValue] = useState("");
    const [selectedCorrectOptions, setSelectedCorrectOptions] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [maxHeight, setMaxHeight] = useState("10vh");

    // Function to update maxHeight based on screen width
    const updateMaxHeight = () => {
        if (window.innerWidth <= 600)
        {
            setMaxHeight("12vh");
        } 
        else
        {
            setMaxHeight("10vh");
        }
    };
    
    function addOptions()
    {
        let isRepeatedOption=false;
        addedOptions.forEach(option=>{
            if(option===optionValue.trim())
                isRepeatedOption=true;
        });
        if(!isRepeatedOption&&optionValue!=="")
        {
            setAddedOptions(value=>[...value,optionValue]);
            setSelectOptions(value=>[...value,{value:optionValue,label:optionValue}])
        }
    }

    function removeOptionHandler(index)
    {
        const modifiedOptionList = [...addedOptions.slice(0,index),...addedOptions.slice(index+1)]
        setAddedOptions(modifiedOptionList);
        const requiredOptionList = modifiedOptionList.map(optionValue=>{return({value:optionValue,label:optionValue})});
        setSelectOptions(requiredOptionList);
        const filteredSelectedCorrectOptionsList = selectedCorrectOptions.filter((option=>{
            for(let i=0;i<modifiedOptionList.length;i++)
            {
                if(modifiedOptionList[i]===option["value"])
                    return true;
            }
            return false;
        }));
        setSelectedCorrectOptions(filteredSelectedCorrectOptionsList);
    }

    function getFormattedQuestion()
    {
        let formattedQuestion = {
            "question": questionValue,
            "options": addedOptions,
            "correct_option": selectedCorrectOptions.map(correctOption=>{
                for(let index=0;index<addedOptions.length;index++)
                {
                    if(addedOptions[index]===correctOption["value"])
                        return(index);
                }
            }),
            "difficulty": selectedDifficulty["value"]
        }
        return formattedQuestion;
    }

    function closeHandler()
    {
        if(question!=="")
        {
            setOpenEditQuestion(false);
        }
        else
        {
            setOpenAddQuestion(value=>!value);
        }
    }

    function addQuestionHandler()
    {
        let formattedQuestion = getFormattedQuestion();
        setQuestions(value=>[...value, formattedQuestion]);
        setOpenAddQuestion(value=>!value);
    }

    function editQuestionHandler()
    {
        let formattedQuestion = getFormattedQuestion();
        setQuestions(value=>[...value.slice(0,editQuestionIndex),formattedQuestion,...value.slice(editQuestionIndex+1)]);
        setOpenEditQuestion(false);
    }

    useEffect(()=>{
        if(question!=="")
        {
            setQuestionValue(question["question"]);
            setAddedOptions(question["options"]);
            setSelectOptions(question["options"].map(option=>{return({value:option,label:option})}));
            setSelectedCorrectOptions(question["correct_option"].map(index=>{return({value:question["options"][index],label:question["options"][index]})}))
            const formattedDifficultyValue = question["difficulty"].charAt(0).toUpperCase() + question["difficulty"].slice(1).toLowerCase();
            setSelectedDifficulty({value:formattedDifficultyValue,label:formattedDifficultyValue})  
        }
        updateMaxHeight();
        window.addEventListener("resize", updateMaxHeight);
        return () => window.removeEventListener("resize", updateMaxHeight);
    },[]);

    return(<section className="addEditQuestionScreen">
        <div className="addEditQuestionContainer">
            <div className='addEditQuestionHeader'><div className='crossHovers' style={{cursor:'pointer', fontWeight:'600'}} onClick={closeHandler}>X</div></div>
            <div className="addEditQuestionData">
                <div className='enterQuestionContainer'>
                    <div className='enterQuestionSubContainer'>
                        <div className='addQuestionText'>Question</div>
                        <textarea id='text' value={questionValue} onChange={(event)=>{setQuestionValue(event.target.value)}} className='addQuestionInput fromText' type='text'/>
                    </div>
                </div>
                <div className="addOptionsContainer">
                    <input className="addEditQuestionInputs" placeholder="Enter Option" value={optionValue} onChange={(event)=>{setOptionValue(event.target.value)}} />
                    <button className='addEditQuestionBtn press-button' onClick={addOptions}>Add Option</button>
                </div>
                <div className="displayOptions">
                    {addedOptions.map((option,index)=>{
                        return(
                        <div className='displayOption' key={index}>
                            <button className='removeOptionBtn' onClick={()=>{removeOptionHandler(index)}}>x</button>
                            <div className='displayOption-option'>{option}</div>
                        </div>);
                    })}
                </div>
                
                <div className='correctAnswerDrop'>
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={selectedCorrectOptions}
                        isMulti
                        options={selectOptions}
                        placeholder="Select Correct Answers"
                        styles={
                            {
                                option: (base, state) => ({
                                    ...base,
                                    whiteSpace:"nowrap",
                                    overflow:'hidden',
                                    textOverflow:'ellipsis'
                                }),
                                valueContainer: (base) => ({
                                    ...base,
                                    maxHeight: maxHeight,
                                    overflowY: "auto",
                                }),
                            }
                        }
                        onChange={(valueList)=>{setSelectedCorrectOptions(valueList)}}
                    />
                </div>

                <div className='correctAnswerContainer'>
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        value={selectedDifficulty}
                        options={[
                            {value:"Easy",label:"Easy"},
                            {value:"Medium",label:"Medium"},
                            {value:"Hard",label:"Hard"},
                        ]}
                        placeholder="Select Difficulty"
                        styles={{option: (base, state) => ({
                            ...base,
                            whiteSpace:"nowrap",
                            overflow:'hidden',
                            textOverflow:'ellipsis'
                          })
                        }}
                        onChange={(value)=>{setSelectedDifficulty(value)}}
                    />
                </div>

                <div className='AddQuestionBtnsContainer'>
                        <button className='commonBtn cancelQuestionBtn press-button-general' onClick={closeHandler}>Cancel</button>
                        {question===""&&<button className='commonBtn addQuestionBtn press-button-general' onClick={addQuestionHandler}>Add Question</button>}
                        {question!==""&&<button className='commonBtn addQuestionBtn press-button-general' onClick={editQuestionHandler}>Confirm Edit</button>}
                </div>
            </div>
        </div>
    </section>);
}
export default AddEditQuestion;