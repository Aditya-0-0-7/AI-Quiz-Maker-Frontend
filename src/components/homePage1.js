import { useEffect } from 'react';
import dashboardImg from '../Images/dashboard.png';
import languageImg from '../Images/language-svgrepo-com.svg';
import generateImg from '../Images/ai-svgrepo-com.svg';
import imageImg from '../Images/image-square-svgrepo-com.svg';
import winImg from '../Images/winner-win-champion-hero-svgrepo-com.svg';
import './homePage1.css';
function HomePage1({visibleItems, setRef})
{
    useEffect(() => {
        if(setRef)
        {
          setRef(0,document.getElementById('page1'));
        }
    }, [setRef]);

    return(
    <section id='page1' key={0} className={`container ${visibleItems[0] ? "show" : ""}`}>
        <div id='description'>
            <div id='welcome'>
                Welcome to<br/>AI Quiz Maker
            </div>
            <div id='features'>
                <div id='feature'>
                    <img id='featureLogo' src={generateImg} />
                    <div id='featureData'>Generate Quiz using AI</div>
                </div>
                <div id='feature'>
                    <img id='featureLogo' src={languageImg} />
                    <div id='featureData'>Generate Quiz in languages of your Choice</div>
                </div>
                <div id='feature'>
                    <img id='featureLogo' src={imageImg} />
                    <div id='featureData'>Generate Quiz from text images</div>
                </div>
                <div id='feature'>
                    <img id='featureLogo' src={winImg} />
                    <div id='featureData'>Play alone or Compete with your Friends</div>
                </div>
            </div>
        </div>
        <div id='homeImg'>
            <img id='dashboardImg' src={dashboardImg}/>
        </div>
    </section>
    );
}
export default HomePage1;