import './playerLobby.css';
import Player from './player';
import QuizPlay from './quizPlay';
import { useEffect, useState, useRef } from 'react';
function PlayerLobby({images, setToPlayerLobby, playerDetails, setLoading, triggerToast, joinCode, joinQuizMode, joinSecretCode})
{
    const [playerList, setPlayerList] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [startQuizClicked, setStartQuizClicked] = useState(false);
    const [quizMode, setQuizMode] = useState("");
    const [assignedQuizMode, setAssignedQuizMode] = useState("Play");
    const [secretCode, setSecretCode] = useState("");
    const [quizTime, setQuizTime] = useState("");
    const [isQuizPlay, setIsQuizPlay] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [scoreList,setScoreList] = useState([]);
    const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
    const websocketRef = useRef(null);

    useEffect(()=>{
        setLoading(true);

        const websocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL+`joinQuiz/${joinCode}/${playerDetails["id"]}`);
        websocketRef.current = websocket;
    
        websocket.onopen = () => {
          setIsConnected(true);
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
        
            switch (data.event) {
                case "inform_quiz_expire":
                    if(playerList.length == 0)
                        triggerToast("The quiz you are trying to join is already expired or your join code for Quiz is invalid");
                    else
                        triggerToast("Sorry! The Quiz got expired before starting");
                    setLoading(false);
                    setToPlayerLobby(false);
                    setIsQuizPlay(false);
                    setIsQuizSubmitted(false);
                    break;
        
                case "max_player_limit_reached":
                    setLoading(false);
                    triggerToast("Cannot join Quiz. The max quiz join player limit is already reached");
                    setToPlayerLobby(false);
                    setIsQuizPlay(false);
                    setIsQuizSubmitted(false);
                    break;

                case "new_player_join":
                    if(playerList.length == 0)
                    {
                        setLoading(false);
                    }
                    setPlayerList(JSON.parse(data.detail['playerDetails'])['result']);
                    if(data.detail['status'] == "quizPlay")
                    {
                        setIsQuizPlay(true);
                        setQuizTime(data.detail['quizTime']);
                        setQuestions(data.detail['questions']);
                    }
                    break;

                case "player_leaved":
                    setPlayerList(JSON.parse(data.detail['playerDetails'])['result']);
                    break;
                
                case "inform_room_expire":
                    setLoading(false);
                    triggerToast("The Quiz player room expire. Please try again by rejoining the quiz and creating new room");
                    setToPlayerLobby(false);
                    setIsQuizPlay(false);
                    setIsQuizSubmitted(false);
                    break;

                case "play_quiz":
                    setLoading(false);
                    triggerToast("The Quiz has been started");
                    setQuestions(data["questions"]);
                    setIsQuizPlay(true);
                    setQuizTime(data["quizTime"]);
                    break;

                case "set_quiz_mode":
                    setLoading(false);
                    setAssignedQuizMode(data["mode"]);
                    break;

                case "quiz_submitted":
                    setLoading(false);
                    setScoreList(data['scoreDetails']);
                    break;

                case "update_submitted_status":
                    setIsQuizSubmitted(true);
                    triggerToast("The Quiz has been Submitted Successfully");
                    break;
                
                case "quiz_finished":
                    triggerToast("The quiz is ended by the Host and no longer available");
                    setLoading(false);
                    setToPlayerLobby(false);
                    setIsQuizPlay(false);
                    setIsQuizSubmitted(false);
                    break;
                
                case "invalid_secret":
                    setLoading(false);
                    triggerToast("Can not start the quiz because Secret code for the quiz is invalid");
                    break;
                
                case "invalid_secret_join":
                    setLoading(false);
                    triggerToast("Can not join the quiz because Secret code for the quiz is invalid. Either join in play mode or provide correct secret code.");
                    setToPlayerLobby(false);
                    setIsQuizPlay(false);
                    setIsQuizSubmitted(false);
                    break;
        
                default:
                    triggerToast("Some Error occured while performing the operation. Please try again later.");
            }
        };
      
        websocket.onclose = () => {
            setIsConnected(false);
        };
      
        return () => {
            websocket.close();
        };

    },[joinCode]);

    useEffect(()=>{
        setAssignedQuizMode(joinQuizMode);
        setSecretCode(joinSecretCode);
        if (websocketRef.current && isConnected) {
            websocketRef.current.send(
              JSON.stringify({
                "event": "player_joined",
                "playerDetails": playerDetails,
                "quizMode": joinQuizMode,
                "secretCode": joinSecretCode
              })
            );
        }
    },[isConnected]);

    function startQuizHandler()
    {
        if(secretCode === "")
        {
            triggerToast("Secret Code field can not be empty");
            return;
        }
        if(quizMode === "")
        {
            triggerToast("Please select the quiz mode");
            return;
        }
        setLoading(true);
        if (websocketRef.current && isConnected) {
            websocketRef.current.send(
              JSON.stringify({
                "event": "start_quiz",
                "secretCode": secretCode,
                "quizTime": quizTime,
                "quizMode": quizMode
              })
            );
        }
        else
        {
            setLoading(false);
            triggerToast("Some connection issue occured please try again later")
        }
    }

    function submitQuizHandler(answers)
    {
        setLoading(true);
        if (websocketRef.current && isConnected) {
            websocketRef.current.send(
              JSON.stringify({
                "event": "submit_quiz",
                "scoreDetails": playerDetails,
                "answers": answers
              })
            );
        }
        else
        {
            setLoading(false);
            triggerToast("Some connection issue occured please try again later")
        }
    }

    function finishQuizHandler()
    {
        setLoading(true);
        if (websocketRef.current && isConnected) {
            websocketRef.current.send(
              JSON.stringify({
                "event": "finish_quiz",
                "secretCode": secretCode
              })
            );
        }
        else
        {
            setLoading(false);
            triggerToast("Some connection issue occured please try again later")
        }
    }

    return(!isQuizPlay?
    <section className="playerLobbyScreen">
        <div className="playerContainer">
            {playerList.map((player, index)=>{
                return(<Player key={index} playerName={player["playerName"]} avatar={images[player["avatar"]]} />)
            })}
        </div>
        <div className="lobbyMsg">
            Total Players in Lobby: {playerList.length}
        </div>
        <div className="lobbyBtns">
            <button onClick={()=>{setToPlayerLobby(false)}} className='commonBtn press-button-general leaveQuizBtn'>Leave Quiz</button>
            <button className='commonBtn press-button-general startQuizBtn' onClick={()=>{setStartQuizClicked(value=>!value)}}>Start Quiz</button>
        </div>
        {startQuizClicked&&
            <section className='startControlScreen'>
                <div className='startControlPanel'>
                    <div className='panelBar'><div className='crossPanel' style={{cursor:'pointer'}} onClick={()=>{setStartQuizClicked(value=>!value)}}>X</div></div>
                    <input className='startControlInput' placeholder='Secret Code For Quiz' value={secretCode} onChange={(e)=>{setSecretCode(e.target.value)}} />
                    <input className='startControlInput' placeholder='Quiz Time Duration in Minutes. Leave blank if no time duration' value={quizTime} onChange={(e)=>{setQuizTime(e.target.value)}} />
                    <select className='startControlExpand' placeholder="Quiz Mode" value={quizMode} onChange={(e)=>{setQuizMode(e.target.value)}} style={quizMode==""?{color:"grey"}:{}}>
                        <option value="" disabled selected hidden>Select Quiz Mode</option>
                        <option value="Play">Play</option>
                        <option value="Host">Host</option>
                    </select>
                    <button className='commonBtn press-button-general startQuizBtn startQuizBtn2' onClick={startQuizHandler}>Start Quiz</button>
                </div>
            </section>
        }
    </section>:
    <QuizPlay images={images} questions={questions} quizTime={quizTime} finishQuizHandler={finishQuizHandler} assignedQuizMode={assignedQuizMode} setLoading={setLoading} triggerToast={triggerToast} submitQuizHandler={submitQuizHandler} isQuizSubmitted={isQuizSubmitted} scoreList={scoreList}/>);
}
export default PlayerLobby;