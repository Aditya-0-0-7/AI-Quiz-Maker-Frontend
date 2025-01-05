import "./player.css";
function Player({playerName, avatar})
{
    return(
    <section className="playerDisplayContainer">
        <div className="lobbyPlayerAvatar"><img className="lobbyPlayerImg" src={avatar} /></div>
        <div className="lobbyPlayerName">{playerName}</div>
    </section>
    );
}
export default Player;