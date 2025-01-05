import './scoreTable.css';
function ScoreTable({images,scoreList,finishQuizHandler, assignedQuizMode})
{
    return(
    <section className='scoreTableScreen'>
        <div className='scoreHeading'>LEADERBOARD</div>
        <div className='scoreTable'>
            <div className='scoreRow'>
                <div className='scoreIndex headerCommon'>Rank</div>
                <div className='scoreAvatar headerCommon'>Avatar</div>
                <div className='scorePlayerName headerCommon'>Name</div>
                <div className='displayScore headerCommon'>Score</div>
            </div>
            <div className='scoreContent'>
                {scoreList.map((player,index)=>{
                    return(<div className='scoreRow'>
                        <div className='scoreIndex'>{index+1}</div>
                        <div className='scoreAvatar'><img src={images[player['avatar']]} className='scoreAvatarImg' /></div>
                        <div className='scorePlayerName'>{player['playerName']}</div>
                        <div className='displayScore'>{player['score']}</div>
                    </div>)
                })}
            </div>
        </div>
        <div className='scoreBtns'>
            {assignedQuizMode=="Host"&&<button className='commonBtn press-button-general leaveQuizBtn btnExtra' onClick={()=>{finishQuizHandler()}}>Finish Quiz For Everyone</button>}
        </div>
    </section>
    );
}
export default ScoreTable;