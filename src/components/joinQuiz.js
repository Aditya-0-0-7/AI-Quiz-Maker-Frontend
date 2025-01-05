import './joinQuiz.css';
import image1 from '../Images/Avatars/image1.svg';
import image2 from '../Images/Avatars/image2.svg';
import image3 from '../Images/Avatars/image3.svg';
import image4 from '../Images/Avatars/image4.svg';
import image5 from '../Images/Avatars/image5.svg';
import image6 from '../Images/Avatars/image6.svg';
import image7 from '../Images/Avatars/image7.svg';
import image8 from '../Images/Avatars/image8.svg';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useMemo, useState } from 'react';
import PlayerLobby from './playerLobby';
import apiCall from '../utilities/apiCall';
function JoinQuiz({setLoading, triggerToast})
{
    const images = useMemo(()=>[image1, image2, image3, image4, image5, image6, image7, image8],[]);
    const [startIndex,setStartIndex] = useState(0);
    const [selectedAvatar,setAvatar] = useState(0);
    const [playerName, setPlayerName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [quizRoomStatus, setQuizRoomStatus] = useState("");
    const [toPlayerLobby, setToPlayerLobby] = useState(false);
    const [playerDetails, setPlayerDetails] = useState(false);
    const [joinQuizMode, setJoinQuizMode] = useState("");
    const [joinSecretCode, setJoinSecretCode] = useState("");
    
    function increaseStartIndex()
    {
        if(startIndex+5<8)
            setStartIndex((index=>index+1));
    }

    function decreaseStartIndex()
    {
        if(startIndex>0)
            setStartIndex((index=>index-1));
    }

    async function joinQuizHandler()
    {
        if(playerName == "")
        {
            triggerToast("Player Name can not be empty");
            return
        }
        if(joinCode == "")
        {
            triggerToast("Join Code can not be empty");
            return;
        }
    
        if(quizRoomStatus == "")
        {
            setLoading(true);
            const response = await apiCall(process.env.REACT_APP_API_URL+'getQuizStatus/', 'POST', {"shareCode":joinCode});
            if(response.isError)
            {
                triggerToast("Failed to join the Quiz. Try again Later");
            }
            else
            {
                if(response.msg["status"] == "lobby")
                {
                    const playerID = uuidv4();
                    const playerDetail = {
                        "id":playerID,
                        "playerName":playerName,
                        "avatar":selectedAvatar
                    }
                    setPlayerDetails(playerDetail);
                    setToPlayerLobby(true);
                }
                else
                    setQuizRoomStatus(response.msg["status"]);
            }
            setLoading(false);
        }
        else
        {
            if(joinQuizMode == "")
            {
                triggerToast("Please select Quiz Mode before joining");
                return;
            }
            if(joinQuizMode == "Host"&&joinSecretCode == "")
            {
                triggerToast("Please provide Secret code before joining or join in Play mode");
                return;
            }
            const playerID = uuidv4();
            const playerDetail = {
                "id":playerID,
                "playerName":playerName,
                "avatar":selectedAvatar
            }
            setPlayerDetails(playerDetail);
            setToPlayerLobby(true);
        }
    }

    return(
        !toPlayerLobby?<section id='joinQuiz'>
            <div id='joinQuizContainerWrapper'>
                <div id='joinQuizContainer'>
                    <div id='viewAvatar'>
                        <img className='selectedAvatarImg' src={images?images[selectedAvatar]:''} />
                    </div>
                    <div id='avatarMessage'>Select Player Avatar</div>
                    <div id='selectAvatar'>
                        <div className='selectAvatarImgHolder'><button className='selectAvatarBtn' onClick={decreaseStartIndex}>{"<"}</button></div>
                        {images.map((image,index)=>{
                            if(index>=startIndex&&index<startIndex+5)
                                return(<div key={index} className='selectAvatarImgHolder'><img src={image} onClick={()=>{setAvatar(index)}} className='selectAvatarImg' /></div>);
                            else
                                return(<div key={index} style={{position:'absolute'}}></div>);
                        })}
                        <div className='selectAvatarImgHolder'><button className='selectAvatarBtn' onClick={increaseStartIndex}>{">"}</button></div>
                    </div>
                    <input className='joinInput' value={playerName} onChange={(event)=>{setPlayerName(event.target.value)}} placeholder='Enter Player Name' />
                    <input className='joinInput' value={joinCode} onChange={(event)=>{setJoinCode(event.target.value)}} placeholder='Enter Join Code'/>
                    
                    {quizRoomStatus==="quizPlay"&&
                    <select className='joinQuizMode' placeholder="Quiz Mode" value={joinQuizMode} onChange={(e)=>{setJoinQuizMode(e.target.value)}} style={joinQuizMode==""?{color:"black"}:{}}>
                        <option value="" disabled selected hidden>Select Quiz Mode</option>
                        <option value="Play">Play</option>
                        <option value="Host">Host</option>
                    </select>}

                    {quizRoomStatus==="quizPlay"&&joinQuizMode=="Host"&&<input className='joinInput' value={joinSecretCode} onChange={(event)=>{setJoinSecretCode(event.target.value)}} placeholder='Enter Secret Code'/>}

                    <div id='generateBtnHolder' className='joinQuizBtn'><button onClick={joinQuizHandler} className='uploadBtn generateBtn generateBtnActive press-button extra'>Join Quiz</button></div>
                </div>
            </div>
        </section>:
        <PlayerLobby images={images} setToPlayerLobby = {setToPlayerLobby} playerDetails={playerDetails} setLoading = {setLoading} triggerToast={triggerToast} joinCode={joinCode} joinQuizMode={joinQuizMode} joinSecretCode={joinSecretCode}/>
    );
}
export default JoinQuiz;