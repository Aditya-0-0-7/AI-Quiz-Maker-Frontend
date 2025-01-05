import loadingImg from '../Images/loading.gif';
import './loading.css';
function Loading()
{
    return(
        <div className="loadingScreen">
            <img className='loadingImg' src={loadingImg} />
        </div>
    )
}
export default Loading;