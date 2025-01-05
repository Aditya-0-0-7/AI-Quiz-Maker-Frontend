import './nav.css';
import logo from '../Images/appLogo.png';
function NavBar({setPage,page})
{
    return(
    <header>
        <section id='headLogoContainer'>
            <img id='headLogo' src={logo}/>
        </section>
        <section id='headNavContainer'>
            <button className={page===0?'headerNav headerNavExtra':'headerNav'} onClick={()=>{setPage(0)}}>Home</button>
            <button className={page===1?'headerNav headerNavExtra':'headerNav'} onClick={()=>{setPage(1)}}>Generate Quiz</button>
            <button className={page===2?'headerNav headerNavExtra':'headerNav'} onClick={()=>{setPage(2)}}>Join Quiz</button>
            <button className={page===3?'headerNav headerNavExtra':'headerNav'} style={{marginRight:'3vmin'}} onClick={()=>{setPage(3)}}>View Quiz</button>
        </section>
    </header>
    )
}
export default NavBar;